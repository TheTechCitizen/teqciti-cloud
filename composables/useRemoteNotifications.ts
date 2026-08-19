import { ref } from 'vue';
import type { NotificationOptions } from '@basea-layer/types';
import type { NotificationEntry } from '@basea-layer/schemas/notification.schema';

// --- REALTIME SOCKET SINGLETON ---
// One shared connection per browser tab, same pattern as useLeadCenter/useTasksCenter — this
// is what keeps it lightweight. Lives HERE (not in useNotifications, which also handles
// purely local/ephemeral notifications and has nothing to do with the remote data source).
// Connects to the PRIMARY Directus instance with the CALLER'S OWN token, subscribed with a
// narrow filter (user_id = caller only).
//
// No read/unread concept at all — deliberately dropped per spec: this only cares that a
// notification WAS SENT, not whether it's been seen. That means the in-memory cache below
// just accumulates everything that's arrived (initial pull + live socket appends) and never
// needs a separate read-state sync back to Directus.
// CLIENT-FACING. Matching is user_id (the real, load-bearing filter) + category: 'client' as
// defense-in-depth — useCreateNotification already validates at write time that a
// category:'client' row can only ever target a real org_users member, so this filter should
// never actually exclude anything a client SHOULD see. It's here so a client app can never
// display a staff-only ('internal') notification even in the event that validation is ever
// bypassed or misconfigured — belt and suspenders, not the primary boundary.
let sharedNotificationsSocket: WebSocket | null = null;
let sharedNotificationsReconnectTimer: ReturnType<typeof setTimeout> | null = null;
const sharedNotificationsCache = ref<NotificationOptions[]>([]);
// Purely additive — increments every time the socket pushes something new into the cache.
// fetchRemote's own behavior/signature is completely unchanged; this is a SEPARATE signal
// for external code (see the bridge below) to know "something changed, worth re-checking."
const cacheVersion = ref(0);
let hasDoneInitialFetch = false;

const mapEntry = (entry: NotificationEntry): NotificationOptions => ({
  id: entry.id,
  title: entry.title,
  message: entry.message,
  type: entry.type,
  isRemote: true,
  showInTray: entry.showInTray,
  // Bulk historical catch-up is SILENT, deliberately — same pattern every mature SaaS app
  // uses (Uber, Slack, etc.): opening the app after being away shows a badge count and a
  // list you can check, it doesn't fire a toast per missed item. Toasts are for something
  // happening live, right now. isToastVisible: false here is what actually makes this true
  // — see mapRawRow below for the live-arrival counterpart, which does NOT set this.
  isToastVisible: false,
  // Same reasoning for native OS push — a backlog of 20 historical items should never
  // trigger 20 native push notifications on login, regardless of what native_push was set
  // to when each was originally created. Forced false here, unconditionally.
  nativePush: false,
  createdAt: entry.createdAt ?? new Date().toISOString(),
});

// LIVE arrivals via the socket — the counterpart to mapEntry above. Deliberately does NOT
// set isToastVisible (so it defaults to true in show() — a toast IS shown) and respects the
// real native_push flag from the row, since this is something actually happening now.
const mapRawRow = (row: any): NotificationOptions => ({
  id: row.id,
  title: row.title,
  message: row.message,
  type: row.type,
  isRemote: true,
  showInTray: row.show_in_tray ?? true,
  nativePush: row.native_push ?? false,
  createdAt: row.date_created ?? new Date().toISOString(),
});

let hasSetupUserWatcher = false;

export const useRemoteNotifications = () => {
  const notificationService = useDataService<NotificationEntry>('notifications');
  const { user, getToken } = useAuth();
  const config = useRuntimeConfig();

  if (!hasSetupUserWatcher && import.meta.client) {
    hasSetupUserWatcher = true;
    watch(() => user.value?.id, async (newId, oldId) => {
      if (newId === oldId) return;
      hasDoneInitialFetch = false;
      sharedNotificationsCache.value = [];
      disconnectRealtime();
      cacheVersion.value++;

      if (newId) {
        await fetchRemote();
        cacheVersion.value++;
      }
    });
  }

  const disconnectRealtime = () => {
    if (sharedNotificationsReconnectTimer) clearTimeout(sharedNotificationsReconnectTimer);
    sharedNotificationsSocket?.close();
    sharedNotificationsSocket = null;
  };

  const connectRealtime = () => {
    if (!import.meta.client || !user.value?.id) return;

    if (sharedNotificationsSocket && (sharedNotificationsSocket.readyState === WebSocket.OPEN || sharedNotificationsSocket.readyState === WebSocket.CONNECTING)) {
      return; // singleton guard
    }

    const wsUrl = config.public.link.replace(/^http/, 'ws') + '/websocket';
    const socket = new WebSocket(wsUrl);
    sharedNotificationsSocket = socket;

    socket.onopen = async () => {
      socket.send(JSON.stringify({ type: 'auth', access_token: await getToken() }));
    };

    socket.onmessage = (event) => {
      let message: any;
      try { message = JSON.parse(event.data); } catch (e) { return; }

      if (message.type === 'auth' && message.status === 'ok') {
        socket.send(JSON.stringify({
          type: 'subscribe',
          collection: 'notifications',
          query: { filter: { user_id: { _eq: user.value!.id }, category: { _eq: 'client' } } },
        }));
        return;
      }

      if (message.type !== 'subscription' || message.event !== 'create') return;

      const rows = Array.isArray(message.data) ? message.data : [message.data];
      for (const row of rows) {
        sharedNotificationsCache.value.push(mapRawRow(row));
      }
      cacheVersion.value++;
    };

    socket.onclose = () => {
      if (sharedNotificationsSocket === socket) sharedNotificationsSocket = null;
      sharedNotificationsReconnectTimer = setTimeout(connectRealtime, 5000);
    };

    socket.onerror = () => { socket.close(); };
  };

  // The only exposed function, matching the original placeholder's shape exactly. First call
  // does one real Directus read (populating the cache) and connects the socket; every call
  // after that just returns the current cache — kept fresh by the socket in the background,
  // no repeated queries.
  //
  // BOUNDED, deliberately: without a limit/date range, a user with a year of accumulated
  // notifications would have ALL of them pulled in on first load. mapEntry above already
  // makes bulk items toast-silent, so this bound is now purely about not fetching a
  // genuinely unbounded/unnecessary amount of stale data — not a toast-spam concern anymore.
  // Defaults to the most recent 20, no older than 30 days. Override via the optional params
  // if a different window makes sense for your use case.
  const fetchRemote = async (
    opts: { limit?: number; sinceDays?: number } = {}
  ): Promise<NotificationOptions[]> => {
    if (!user.value?.id) return [];

    if (!hasDoneInitialFetch) {
      hasDoneInitialFetch = true;
      const limit = opts.limit ?? 20;
      const sinceDays = opts.sinceDays ?? 30;
      const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000);

      const rows = await notificationService.getFiltered({
        filter: {
          user_id: { _eq: user.value.id }, category: { _eq: 'client' },
          date_created: { _gte: since.toISOString() },
        },
        sort: ['-date_created'],
        limit,
      });
      sharedNotificationsCache.value = (rows || []).map(mapEntry);
      connectRealtime();
    }

    return [...sharedNotificationsCache.value];
  };

  return { fetchRemote, cacheVersion, disconnectRealtime };
};

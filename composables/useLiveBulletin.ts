import { ref, computed, onUnmounted, getCurrentInstance } from 'vue';
import type { ClientOpsItem } from '@teqciti-layer/schemas/clientop.schema';
import type { SprintSummary } from '@teqciti-layer/composables/useClientOps';

// CLIENT-FACING. Composes useClientOps (reused, not reimplemented — the published-only
// filtering, month logic, and sprint math all live there) and layers a live realtime feed
// on top via useRealtimeSocket, so a client's dashboard updates the moment staff publishes
// something, without needing a manual refresh.
//
// Covers BOTH bulletins and tasks, not just bulletins specifically — any published change to
// client_ops is something a client watching this widget would want to know about. The name
// reflects the primary use case; the subscription itself naturally covers the whole
// collection either way.
export const useLiveBulletin = async (orgId: string) => {
  const {
    getCurrentMonthPlan, getNextMonthPlan, getMonthAfterPlan, getPreviousMonthPlan,
    getSprintSummary, getPreviousMonthSummary, getMonthOverMonthTrend,
    getAgencyHighlights, getBurndownChart,
  } = await useClientOps();
  // Reused for graduatedAt only — useCurrentOrg already fetches the full org record
  // (including graduated_at) as part of resolving the logged-in client's own org, so there's
  // no need for useClientOps to make a second, redundant fetch of the same record.
  const { currentOrg } = await useCurrentOrg();
  const { getToken } = useAuth();
  const { show } = useNotifications();
  const config = useRuntimeConfig();

  const currentPlan = ref<ClientOpsItem[]>([]);
  const sprintSummary = ref<SprintSummary | null>(null);
  const highlights = ref<Awaited<ReturnType<typeof getAgencyHighlights>> | null>(null);
  const burndown = ref<Awaited<ReturnType<typeof getBurndownChart>>>([]);
  const isLoading = ref(true);

  const bulletins = computed(() => currentPlan.value.filter(i => i.type === 'bulletin'));
  const tasks = computed(() => currentPlan.value.filter(i => i.type === 'task'));

  // A short "recent activity" feed for the UI — separate from currentPlan itself, which
  // always reflects the true current state. This is purely "what just happened, worth
  // flashing to the user" — capped, most-recent-first.
  interface LiveUpdate {
    item: ClientOpsItem;
    event: 'create' | 'update' | 'delete';
    receivedAt: string;
  }
  const recentUpdates = ref<LiveUpdate[]>([]);
  const MAX_RECENT_UPDATES = 10;

  // Builds a show() call matching useLeadCenter's own parameter shape (title/message/type/
  // showInTray/nativePush) — but with VALUES chosen for this context, not copied blindly.
  // useLeadCenter's nativePush: true made sense there (a new lead is genuinely urgent for
  // staff); firing a native push for every minor task edit here would just be annoying for
  // a client. nativePush is reserved for three genuinely notable moments: a new bulletin, a
  // new task being added to the plan (either way, something new just appeared), and a task
  // actually finishing — everything else stays a quieter, showInTray-only notice.
  // NEW — deduplication guard. Regardless of exact root cause, a live feed should never
  // fire the same notification repeatedly for what's practically the same event — most
  // likely explanation for "endless notifications every few seconds": the socket connection
  // itself repeatedly dropping and reconnecting (5s is the default first-retry backoff in
  // useRealtimeSocket), with each reconnect re-triggering a fresh subscription snapshot from
  // Directus. This guard protects against that AND any other future source of duplicate/
  // redundant events, rather than only patching one specific theorized cause.
  const recentlyNotified = new Map<string, number>(); // `${id}:${event}` -> timestamp
  const DEDUP_WINDOW_MS = 10000; // don't re-notify the same item+event within 10 seconds

  const shouldNotify = (id: string, event: string): boolean => {
    const key = `${id}:${event}`;
    const last = recentlyNotified.get(key);
    const now = Date.now();
    if (last && now - last < DEDUP_WINDOW_MS) return false;
    recentlyNotified.set(key, now);
    // Prevent unbounded growth over a long session — occasional cleanup of old entries.
    if (recentlyNotified.size > 200) {
      recentlyNotified.forEach((ts, k) => { if (now - ts > DEDUP_WINDOW_MS) recentlyNotified.delete(k); });
    }
    return true;
  };

  const notifyForEvent = (event: 'create' | 'update' | 'delete', item: ClientOpsItem, previousStatus?: ClientOpsItem['status']): void => {
    if (!shouldNotify(item.id, event)) return;
    if (item.type === 'bulletin') {
      if (event === 'create') {
        show({ title: 'New Update', message: item.title, type: 'info', showInTray: true, nativePush: true });
      } else if (event === 'update') {
        show({ title: 'Update Revised', message: `"${item.title}" was updated.`, type: 'info', showInTray: true, nativePush: false });
      } else {
        show({ title: 'Update Removed', message: `"${item.title}" was taken down.`, type: 'info', showInTray: true, nativePush: false });
      }
      return;
    }

    // type: 'task'
    if (event === 'create') {
      show({ title: 'New Task Added', message: `"${item.title}" was added to your plan.`, type: 'info', showInTray: true, nativePush: true });
    } else if (event === 'update') {
      if (item.status === 'done' && previousStatus !== 'done') {
        show({ title: 'Task Completed', message: `"${item.title}" has been marked done.`, type: 'success', showInTray: true, nativePush: true });
      } else {
        show({ title: 'Task Updated', message: `"${item.title}" was updated.`, type: 'info', showInTray: true, nativePush: false });
      }
    } else {
      show({ title: 'Task Removed', message: `"${item.title}" was removed from your plan.`, type: 'info', showInTray: true, nativePush: false });
    }
  };

  // FIXED: previously had no error handling at all — if any of the 4 fetches threw,
  // isLoading never reset to false (a permanent stuck loading state) and the error went
  // unhandled entirely. Also adds a stale-response guard: a burst of realtime events in
  // quick succession could previously fire overlapping refreshAll() calls, and an OLDER,
  // slower response completing AFTER a newer one could overwrite it with stale data — this
  // is now guarded against explicitly rather than left as a possible race.
  let refreshRequestId = 0;
  const refreshAll = async (): Promise<void> => {
    const thisRequestId = ++refreshRequestId;
    try {
      // All four fetched together — a newly-completed task affects sprintSummary AND
      // highlights (totalCompletedAllTime, streaks) AND burndown, so they should all update
      // together on the same trigger rather than drifting out of sync with each other.
      const [plan, summary, agencyHighlights, burndownData] = await Promise.all([
        getCurrentMonthPlan(orgId),
        getSprintSummary(orgId, 0),
        // ASSUMPTION worth flagging: this passes currentOrg's graduatedAt, which is only
        // correct if `orgId` (this composable's own param) actually matches the logged-in
        // client's own org — true for every real usage of this composable today (a client
        // only ever views their own org's live dashboard), but worth knowing this is an
        // implicit coupling, not something enforced by a type or a runtime check.
        getAgencyHighlights(orgId, currentOrg.value?.graduatedAt ?? null),
        getBurndownChart(orgId, 0),
      ]);

      // A newer refreshAll() call already completed while this one was in flight — discard
      // this now-stale result rather than overwrite the more recent, correct one.
      if (thisRequestId !== refreshRequestId) return;

      currentPlan.value = plan;
      sprintSummary.value = summary;
      highlights.value = agencyHighlights;
      burndown.value = burndownData;
    } catch (e) {
      console.error(`[useLiveBulletin:${orgId}] refreshAll failed`, e);
    } finally {
      if (thisRequestId === refreshRequestId) isLoading.value = false;
    }
  };

  // Debounced wrapper — coalesces a burst of rapid-fire messages (a snapshot replay after
  // reconnecting, or genuinely many real changes in quick succession) into ONE actual
  // refetch shortly after they settle, rather than one refetch per message.
  const REFRESH_DEBOUNCE_MS = 300;
  let refreshDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  const scheduleRefresh = (): void => {
    if (refreshDebounceTimer) clearTimeout(refreshDebounceTimer);
    refreshDebounceTimer = setTimeout(refreshAll, REFRESH_DEBOUNCE_MS);
  };

  // FIXED: previously nothing cleared a pending debounce timer on unmount — if a component
  // unmounted while a debounced refresh was still scheduled, the timer fired anyway shortly
  // after, doing a wasted network fetch against a composable instance nothing was watching
  // anymore.
  if (getCurrentInstance()) {
    onUnmounted(() => {
      if (refreshDebounceTimer) clearTimeout(refreshDebounceTimer);
    });
  }

  await refreshAll();

  // Minimal local mapper for the raw realtime payload (snake_case, unmapped) into the same
  // ClientOpsItem shape the rest of this composable uses — same reasoning as
  // useRemoteNotifications' own mapRawRow, kept local rather than trying to reach into
  // useDataService's internal mapper for a single realtime-only use case.
  const mapRawRow = (row: any): ClientOpsItem => ({
    id: row.id,
    organizationId: typeof row.organization === 'object' ? row.organization?.id : row.organization,
    type: row.type,
    title: row.title,
    description: row.description ?? null,
    status: row.status ?? null,
    period: row.period ?? null,
    dueDate: row.due_date ?? null,
    completedAt: row.completed_at ?? null,
    priority: row.priority ?? null,
    displayOrder: row.display_order ?? null,
    pinned: row.pinned ?? false,
    isPublished: row.is_published ?? false,
    submissionFileId: typeof row.submission_file === 'object' ? row.submission_file?.id : (row.submission_file ?? null),
    createdBy: row.user_created ?? null,
    createdAt: row.date_created ?? null,
    updatedBy: row.user_updated ?? null,
    updatedAt: row.date_updated ?? null,
  });

  const wsUrl = config.public.link.replace(/^http/, 'ws') + '/websocket';

  const { connected, disconnect } = useRealtimeSocket({
    key: `live-bulletin-${orgId}`,
    wsUrl,
    getAuthToken: getToken,
    onAuthed: (send) => {
      send({
        type: 'subscribe',
        collection: 'client_ops',
        query: { filter: { organization: { _eq: orgId }, is_published: { _eq: true } } },
      });
    },
    onMessage: (message) => {
      if (message.type !== 'subscription') return;

      const eventType = message.event as 'create' | 'update' | 'delete' | undefined;
      const rows = Array.isArray(message.data) ? message.data : [message.data];

      // Captured BEFORE refreshAll() runs — a status-transition check ("just became done")
      // needs the OLD status to compare against, and a delete event typically only carries
      // the deleted row's ID (nothing left to fetch a title from), so its title has to come
      // from what was cached here a moment ago, not from the message itself.
      const previousById = new Map(currentPlan.value.map(item => [item.id, item]));

      // FIXED: was calling refreshAll() directly on every single message — during a
      // reconnect's replay burst (Directus resending everything currently matching, often
      // as many individual messages), this meant one full refetch PER ROW rather than one
      // refetch for the whole burst. Debounced instead: rapid-fire messages coalesce into a
      // single refresh shortly after they settle, whether that burst is a replay or a
      // genuine flurry of real activity.
      scheduleRefresh();

      if (!eventType) return;

      // THE ACTUAL FIX for the reported bug: message._isSnapshotReplay (set by
      // useRealtimeSocket) is true for the burst of "current state" events Directus sends
      // right after every (re)subscription — including ordinary, expected reconnects after
      // a brief internet drop, which is NOT a bug on its own. That replay means "resync your
      // view," not "something just happened" — local state (via scheduleRefresh above) still
      // updates correctly, but notifications and the activity feed are skipped entirely
      // during this window. This is what actually stops phantom "removed"/"updated" popups
      // and feed entries stamped with the current time for things that happened long ago.
      if (message._isSnapshotReplay) return;

      rows.forEach((row: any) => {
        if (eventType === 'delete') {
          // row here is typically just an id (string/number), not a full object.
          const deletedId = typeof row === 'object' ? row?.id : row;
          const cached = previousById.get(deletedId);
          if (cached) notifyForEvent('delete', cached);
          return;
        }

        const mapped = mapRawRow(row);
        if (!mapped.isPublished) return; // e.g. still an unpublished draft — nothing to notify a client about

        if (eventType === 'create') {
          notifyForEvent('create', mapped);
        } else {
          const previous = previousById.get(mapped.id);
          notifyForEvent('update', mapped, previous?.status ?? undefined);
        }

        // Recent-activity feed — cosmetic only. Still dedup-guarded as an extra layer of
        // defense, even though the snapshot-phase check above is the real fix now.
        if (shouldNotify(`feed-${mapped.id}`, eventType)) {
          recentUpdates.value.unshift({ item: mapped, event: eventType, receivedAt: new Date().toISOString() });
        }
      });

      recentUpdates.value = recentUpdates.value.slice(0, MAX_RECENT_UPDATES);
    },
  });

  // Simple three-state status for the UI, rather than exposing the raw boolean — matches
  // what a "connection indicator" component typically wants to render directly.
  // 'connecting' covers both "never connected yet" and "actively reconnecting after a drop" —
  // useRealtimeSocket's own backoff/reconnect logic is what's actually running underneath
  // this; this composable doesn't need its own separate reconnect handling at all.
  const connectionStatus = computed<'connected' | 'connecting'>(() =>
    connected.value ? 'connected' : 'connecting'
  );

  return {
    isLoading,
    // Full current-month published plan (tasks + bulletins together)
    currentPlan,
    // Subsets, for convenience
    bulletins,
    tasks,
    // Same SprintSummary shape as useClientOps — velocity, completion %, onTrack, etc.
    sprintSummary,
    // All-time "make the agency look good" stats — totalCompletedAllTime, bulletinCountAllTime,
    // tenureMonths, averageItemsCompletedPerMonth, currentStreak, longestStreakEver,
    // upcomingPlannedCount. Refreshes on the same realtime trigger as everything else here.
    highlights,
    // Day-by-day cumulative completion for the current month. For any OTHER month, call
    // getBurndownChart directly (re-exported below) rather than relying on this live-updated one.
    burndown,
    getBurndownChart,
    // On-demand, deliberately NOT part of the live-refresh cycle above — next/month-after/
    // previous plans are forward-looking or historical, not "happening right now" the way
    // the current month is, so they don't need second-by-second realtime updates the same
    // way. Call these directly whenever the UI actually needs them (e.g. a "next month"
    // tab being opened), rather than fetching them on every single realtime event
    // regardless of whether anyone's currently looking at them.
    getNextMonthPlan,
    getMonthAfterPlan,
    getPreviousMonthPlan,
    getPreviousMonthSummary,
    // "Better or worse than last month" — same on-demand reasoning as above.
    getMonthOverMonthTrend,
    // Manual refresh, if ever needed on top of the automatic realtime-driven one
    refreshAll,
    // Short, capped "what just happened" feed for a live-activity style UI element
    recentUpdates,
    // Raw connected ref, if a UI wants the boolean directly
    connected,
    // 'connected' | 'connecting' — for a simple status pill/indicator
    connectionStatus,
    // Explicit teardown, if ever needed outside normal component unmount (which already
    // handles this automatically via useRealtimeSocket's own cleanup)
    disconnect,
  };
};

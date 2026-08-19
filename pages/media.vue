<!-- pages/media.vue -->
<template>
  <div class="mx-auto w-full max-w-5xl px-4 py-8 pb-28 sm:px-6 lg:px-8 relative min-h-screen space-y-8">
    
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-white">Media Hub</h1>
        <p class="mt-2 text-sm text-slate-400">Review your upcoming schedules and access project assets.</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- NEW — manual refresh, same pattern as Action Center. This page has no live
             update mechanism; a staffer publishing a new schedule or asset while a client
             already has this page open otherwise wouldn't show up without a reload. -->
        <button
          @click="handleManualRefresh"
          :disabled="isRefreshing"
          aria-label="Check for updates"
          class="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 ring-1 ring-slate-700/50 hover:bg-slate-700 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all shrink-0"
        >
          <Icon name="lucide:refresh-cw" size="16" :class="{ 'animate-spin': isRefreshing }" />
          {{ isRefreshing ? 'Checking...' : 'Check for updates' }}
        </button>

        <div class="flex p-1 space-x-1 rounded-xl bg-slate-800/50 ring-1 ring-slate-700/50 backdrop-blur-sm">
          <button 
            @click="activeTab = 'schedule'"
            :class="['flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all', activeTab === 'schedule' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800']"
          >
            <Icon name="lucide:calendar-clock" size="16" />
            Content Schedule
          </button>
          <button 
            @click="activeTab = 'assets'"
            :class="['flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all', activeTab === 'assets' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800']"
          >
            <Icon name="lucide:folder-open" size="16" />
            Asset Library
          </button>
        </div>
      </div>
    </div>

    <!-- GLOBAL LOADING STATE -->
    <div v-if="pending" class="flex justify-center py-20">
      <Icon name="lucide:loader-2" class="animate-spin text-purple-500" size="32" />
    </div>

    <!-- ========================================== -->
    <!-- TAB 1: CONTENT SCHEDULE -->
    <!-- ========================================== -->
    <section v-else-if="activeTab === 'schedule'" class="animate-in fade-in duration-300">
      
      <!-- Expectation Banner -->
      <div class="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 p-5 flex gap-5 items-start sm:items-center shadow-lg">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/30">
          <Icon name="lucide:calendar-sync" size="24" />
        </div>
        <div>
          <h4 class="text-base font-bold text-purple-300 tracking-tight">
            Schedule Updates: <span v-if="updateDay" class="capitalize">Every {{ updateDay }}</span><span v-else class="italic opacity-80">Not set yet</span>
          </h4>
          <p class="text-sm text-slate-400 mt-1 leading-relaxed max-w-3xl">
            Our creative team finalizes and uploads the upcoming batch of content 
            <span v-if="updateDay" class="font-medium text-slate-300">every {{ updateDay }}</span><span v-else>(update day pending)</span>. 
            Please review the posts below and flag any necessary changes so we can lock in the publishing schedule!
          </p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="activeSchedules.length === 0" class="flex flex-col items-center justify-center rounded-3xl bg-slate-800/30 py-16 px-6 ring-1 ring-slate-700/50 text-center">
        <img :src="getAssetUrl(null, { fallback: '/img/illustrations/2.png' }) || '/img/illustrations/2.png'" alt="No active schedule" class="w-40 h-40 object-contain opacity-70 mb-6 drop-shadow-xl" />
        <h3 class="text-xl font-bold text-white tracking-tight">You're all caught up!</h3>
        <p class="mt-2 text-sm text-slate-400 max-w-md leading-relaxed">
          There are no upcoming schedules requiring your review right now. Check back on <span v-if="updateDay" class="capitalize">{{ updateDay }}</span><span v-else class="italic opacity-80">(Update Day not set)</span> for the next batch
        </p>
      </div>

      <!-- Multiple Schedules Container -->
      <div v-else class="space-y-16">
        
        <!-- Loop through active schedules (Weekly, Monthly, etc.) -->
        <div v-for="schedule in activeSchedules" :key="schedule.id" class="space-y-6">
          
          <!-- Schedule Header -->
          <div class="flex items-center justify-between pb-2 border-b border-white/5">
            <div class="flex items-center gap-3">
              <div class="h-8 w-1 rounded-full bg-purple-500"></div>
              <h2 class="text-xl font-bold text-white">{{ schedule.title }}</h2>
            </div>
            <!-- Expiration Date Indicator -->
            <div class="text-xs font-medium text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full">
              Closes {{ new Date(schedule.endDate).toLocaleDateString() }}
            </div>
          </div>

          <div v-if="schedule.posts.length === 0" class="text-slate-400 text-sm py-10 text-center">
            This schedule has been created, but no posts have been attached yet.
          </div>

          <!-- Schedule Grid -->
          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div 
              v-for="post in schedule.posts" 
              :key="post.id"
              :class="[
                'group relative flex flex-col overflow-hidden rounded-2xl ring-1 transition-all aspect-[4/5]',
                post.status === 'flagged' ? 'ring-rose-500/40' : 'ring-slate-700/50 hover:ring-slate-500/50'
              ]"
            >
              <!-- Background Media (Clickable to Expand) -->
              <div 
                class="absolute inset-0 bg-slate-900 cursor-pointer z-0" 
                @click="viewMedia(post.mediaId, post.mediaType, post.status)"
              >
                <img 
                  v-if="post.mediaType === 'photo' && post.mediaId" 
                  :src="getAssetUrl(post.mediaId) || ''" 
                  class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <!-- FIXED: HLS (.m3u8) isn't natively playable in a plain <video> tag in
                     most browsers — this was never going to work as a video element. This
                     is a preview only (nothing here was ever actually playing), so a static
                     thumbnail is not just a fix but genuinely simpler than what was here. -->
                <img
                  v-else-if="post.mediaType === 'video' && post.mediaId"
                  :src="getVideoThumbnailUrl(post.mediaId)"
                  class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div v-else class="h-full w-full flex items-center justify-center bg-slate-800">
                  <Icon name="lucide:image" size="32" class="text-slate-600" />
                </div>
              </div>

              <!-- Overlays -->
              <div class="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/90 pointer-events-none z-10"></div>

              <div v-if="post.mediaType === 'video'" class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/40 backdrop-blur-md ring-1 ring-white/20">
                  <Icon name="lucide:play" size="24" class="text-white fill-white ml-1" />
                </div>
              </div>
              
              <!-- Platform Icons -->
              <div class="absolute top-3 left-3 flex items-center -space-x-1.5 z-20 pointer-events-none">
                <div 
                  v-for="platform in post.platforms" 
                  :key="platform"
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 backdrop-blur-md ring-1 ring-white/10 shadow-lg transition-transform hover:scale-110 hover:z-30"
                  :title="platform"
                >
                  <Icon :name="getPlatformIcon(platform)" size="16" :class="getPlatformColor(platform)" />
                </div>
              </div>
              
              <div class="absolute top-3 right-3 z-20 pointer-events-none">
                <span v-if="post.status === 'auto-approved'" class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/90 shadow-lg backdrop-blur-md" title="Auto-Approved">
                  <Icon name="lucide:check" size="16" class="text-white" />
                </span>
                <span v-else-if="post.status === 'flagged'" class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/90 shadow-lg backdrop-blur-md" title="Revision Requested">
                  <Icon name="lucide:flag" size="16" class="text-white" />
                </span>
              </div>

              <div class="absolute bottom-0 inset-x-0 p-3 z-20">
                <div v-if="post.status === 'flagged'" class="w-full rounded-xl bg-slate-900/90 backdrop-blur-md p-3 ring-1 ring-rose-500/30 mb-2">
                  <p class="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-0.5">Revision Note:</p>
                  <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed">{{ post.flagReason }}</p>
                </div>

                <button 
                  v-if="post.status === 'auto-approved'"
                  @click="openFlagModal(post)"
                  class="w-full flex items-center justify-center gap-2 rounded-xl bg-transparent px-4 py-2 text-xs font-medium text-slate-400 hover:bg-slate-900/80 hover:backdrop-blur-md hover:text-rose-400 hover:ring-1 hover:ring-rose-500/30 transition-all"
                >
                  <Icon name="lucide:flag" size="14" />
                  Flag Content
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================== -->
    <!-- TAB 2: ASSET LIBRARY -->
    <!-- ========================================== -->
    <section v-else-if="activeTab === 'assets'" class="animate-in fade-in duration-300">
      
      <div v-if="assetLibraries.length === 0" class="flex flex-col items-center justify-center rounded-3xl bg-slate-800/30 py-16 px-6 ring-1 ring-slate-700/50 text-center">
        <img :src="getAssetUrl(null, { fallback: '/img/illustrations/5.png' }) || '/img/illustrations/5.png'" alt="No assets" class="w-40 h-40 object-contain opacity-70 mb-6 drop-shadow-xl" />
        <h3 class="text-xl font-bold text-white tracking-tight">No project assets yet</h3>
        <p class="mt-2 text-sm text-slate-400 max-w-md leading-relaxed">
          High-resolution photos, raw videos, and finalized deliverables from your projects will appear here once available.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div 
          v-for="library in assetLibraries" 
          :key="library.id"
          @click="openLibrary(library)"
          class="group relative flex overflow-hidden rounded-2xl bg-slate-800/40 ring-1 ring-slate-700/50 backdrop-blur-sm transition-all hover:bg-slate-800 hover:ring-purple-500/50 cursor-pointer h-40"
        >
          <!-- Folder Preview -->
          <div class="w-2/5 h-full bg-slate-900 relative shrink-0 border-r border-slate-700/50">
            <template v-if="library.assets[0]?.id">
              <img 
                v-if="library.assets[0].type === 'photo'" 
                :src="getAssetUrl(library.assets[0].id) || ''" 
                class="h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" 
              />
              <!-- FIXED: same HLS-in-plain-video-tag issue as the schedule grid — static
                   thumbnail, since this was only ever a preview, never real playback. -->
              <img
                v-else-if="library.assets[0].type === 'video'"
                :src="getVideoThumbnailUrl(library.assets[0].id)"
                class="h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="h-full w-full flex items-center justify-center bg-slate-800"><Icon name="lucide:file-text" size="32" class="text-slate-600" /></div>
            </template>
            
            <div class="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/90"></div>
            <div class="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900/80 backdrop-blur-sm ring-1 ring-white/10">
              <Icon name="lucide:images" size="16" class="text-white" />
            </div>
          </div>
          
          <div class="flex-1 p-5 flex flex-col justify-center relative">
            <div class="absolute top-3 right-3">
              <Icon v-if="!library.downloadApproved" name="lucide:lock" size="14" class="text-rose-400" />
            </div>

            <h3 class="text-base font-bold text-white truncate pr-6">{{ library.name }}</h3>
            <p class="text-xs font-medium text-purple-400 mt-1">{{ library.projectName }}</p>
            <p class="text-sm text-slate-400 mt-2 line-clamp-2">{{ library.description }}</p>
            
            <div class="mt-3 flex items-center gap-3 text-xs text-slate-500">
              <span class="flex items-center gap-1"><Icon name="lucide:file-image" size="12" /> {{ library.assets.length }} Items</span>
              <span class="flex items-center gap-1 text-emerald-400" v-if="library.downloadApproved">
                <Icon name="lucide:check" size="12" /> Cleared
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================== -->
    <!-- MODALS -->
    <!-- ========================================== -->
    <!-- LIGHTBOX: EXPANDED MEDIA VIEW -->
    <Teleport to="body">
      <div v-if="expandedMedia" class="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-200">
        
        <div class="absolute inset-0 bg-slate-950/95 backdrop-blur-xl transition-opacity" @click="expandedMedia = null"></div>
        
        <div v-if="expandedMedia.status === 'auto-approved'" class="fixed top-4 left-4 sm:top-8 sm:left-8 z-[210] flex items-center gap-2 rounded-full bg-emerald-500/90 px-4 py-2.5 text-sm font-bold text-white shadow-2xl backdrop-blur-md">
          <Icon name="lucide:check-circle-2" size="18" /> auto-approved
        </div>
        <div v-else-if="expandedMedia.status === 'flagged'" class="fixed top-4 left-4 sm:top-8 sm:left-8 z-[210] flex items-center gap-2 rounded-full bg-rose-500/90 px-4 py-2.5 text-sm font-bold text-white shadow-2xl backdrop-blur-md">
          <Icon name="lucide:flag" size="18" /> Flagged
        </div>

        <button @click="expandedMedia = null" class="fixed top-4 right-4 sm:top-8 sm:right-8 z-[210] flex h-12 w-12 items-center justify-center text-slate-300 hover:text-white bg-slate-800/80 hover:bg-rose-500/90 rounded-full transition-all backdrop-blur-md shadow-2xl hover:scale-105">
          <Icon name="lucide:x" size="24" />
        </button>

        <div class="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
          <img 
            v-if="expandedMedia.type === 'photo'" 
            :src="getAssetUrl(expandedMedia.id) || ''" 
            class="max-w-full max-h-full object-contain rounded-lg shadow-2xl pointer-events-auto" 
          />
          <!-- FIXED: this is real playback (controls, autoplay), not a preview — so unlike
               the thumbnail fixes elsewhere on this page, the fix here is Cloudflare's own
               iframe player, which handles HLS compatibility internally across every
               browser. A plain <video src="...m3u8"> was never going to work here either. -->
          <iframe
            v-else-if="expandedMedia.type === 'video'"
            :src="getVideoIframeUrl(expandedMedia.id)"
            class="max-w-full max-h-full aspect-video w-full sm:w-[80vw] rounded-lg shadow-2xl pointer-events-auto border-0"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </Teleport>

    <!-- FLAG CONTENT MODAL -->
    <Teleport to="body">
      <div v-if="flaggingPost" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" @click="flaggingPost = null"></div>
        <div class="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-slate-900 ring-1 ring-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300">
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl font-bold text-white flex items-center gap-2">
                  <Icon name="lucide:flag" size="20" class="text-rose-400" /> Flag Content
                </h3>
                <p class="mt-1 text-sm text-slate-400">This post will be paused from publishing.</p>
              </div>
              <button @click="flaggingPost = null" class="text-slate-400 hover:text-white transition-colors">
                <Icon name="lucide:x" size="20" />
              </button>
            </div>
            <div class="space-y-4">
              <textarea 
                v-model="revisionText"
                rows="4" 
                class="w-full rounded-xl border-0 bg-slate-950 py-3 px-4 text-sm text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-600 focus:ring-2 focus:ring-rose-500"
                placeholder="What needs changing?"
              ></textarea>
              <div class="flex gap-3">
                <button @click="flaggingPost = null" class="flex-1 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">Cancel</button>
                <button @click="handleFlagSubmit" :disabled="!revisionText.trim() || isFlagging" class="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-500 disabled:opacity-50 flex justify-center gap-2">
                  <Icon v-if="isFlagging" name="lucide:loader-2" class="animate-spin" size="16" />
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ASSET LIBRARY GALLERY MODAL -->
    <Teleport to="body">
      <div v-if="activeLibrary" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity" @click="activeLibrary = null"></div>
        <div class="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 ring-1 ring-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div class="flex items-center justify-between border-b border-slate-700/50 bg-slate-800/90 px-6 py-4 backdrop-blur-md shrink-0">
            <div>
              <h2 class="text-xl font-bold text-white">{{ activeLibrary.name }}</h2>
              <p class="text-xs text-slate-400 mt-1">{{ activeLibrary.projectName }} • {{ activeLibrary.assets.length }} Items</p>
            </div>
            <div class="flex items-center gap-4">
              <button v-if="activeLibrary.downloadApproved" @click="downloadCollection(activeLibrary)" class="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500">
                <Icon name="lucide:download-cloud" size="16" /> Download All
              </button>
              <div v-else class="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm text-rose-400 ring-1 ring-inset ring-rose-500/20" title="Download Locked">
                <Icon name="lucide:lock" size="16" /> Download Locked
              </div>
              <button @click="activeLibrary = null" class="rounded-full p-2 text-slate-400 hover:text-white"><Icon name="lucide:x" size="20" /></button>
            </div>
          </div>
          <div class="flex-1 overflow-y-auto p-6">
            <p class="text-sm text-slate-300 mb-6">{{ activeLibrary.description }}</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div 
                v-for="asset in activeLibrary.assets" 
                :key="asset.id" 
                class="group relative aspect-square overflow-hidden rounded-xl bg-slate-800 ring-1 ring-slate-700/50 cursor-pointer"
                @click="viewMedia(asset.id, asset.type)"
              >
                <img v-if="asset.type === 'photo'" :src="getAssetUrl(asset.id) || ''" class="h-full w-full object-cover transition-transform group-hover:scale-110" />
                <!-- FIXED: same preview-not-playback fix as the other two grid contexts. -->
                <img v-else-if="asset.type === 'video'" :src="getVideoThumbnailUrl(asset.id)" class="h-full w-full object-cover transition-transform group-hover:scale-110" />
                <div v-else class="h-full w-full flex items-center justify-center"><Icon name="lucide:file-text" size="48" class="text-slate-600" /></div>
                
                <div v-if="asset.type === 'video'" class="absolute inset-0 flex items-center justify-center bg-slate-950/20 pointer-events-none">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                    <Icon name="lucide:play" size="20" class="text-white ml-1" />
                  </div>
                </div>

                <!-- Hover Actions (Download) -->
                <!-- CHANGED: download is only offered for photo/document assets (real Directus
                     files). A video asset's id here is a Stream uid, not a Directus file —
                     there's no confirmed, working "download this Stream video" mechanism in
                     this system, so this is hidden for videos rather than shown as a broken
                     link. If Stream's own MP4-download feature is enabled for your account
                     later, this can be wired to that specifically. -->
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent opacity-0 transition-opacity group-hover:opacity-100 flex flex-col justify-end p-3">
                  <a v-if="activeLibrary.downloadApproved && asset.type !== 'video'" :href="getAssetUrl(asset.id, { download: true }) || '#'" target="_blank" @click.stop class="flex w-full items-center justify-center gap-2 rounded-md bg-purple-600/90 py-1.5 text-xs font-semibold text-white hover:bg-purple-500">
                    <Icon name="lucide:download" size="14" /> Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

definePageMeta({
  requiresAuth: true
});

const { orgId, contentUpdateDay } = await useCurrentOrg();

const { getAssetUrl } = await useAsset();
const { show } = useNotifications();

const { 
  activeSchedules,
  assetLibraries, 
  pending, 
  isFlagging, 
  flagPost, 
  refreshMedia,
  getVideoThumbnailUrl,
  getVideoIframeUrl,
} = await useMediaHub(orgId.value);

watch(orgId, async (newId) => {
  if (newId) await refreshMedia();
});

const updateDay = ref(contentUpdateDay.value);

const activeTab = ref<'schedule' | 'assets'>('schedule');

// Modals State
const flaggingPost = ref<any>(null);
const revisionText = ref('');
const activeLibrary = ref<any>(null);

const expandedMedia = ref<{ id: string, type: 'photo' | 'video', status?: string } | null>(null);

const viewMedia = (id: string | null, type: string, status?: string) => {
  if (!id || type === 'document') return;
  expandedMedia.value = { 
    id, 
    type: type as 'photo' | 'video',
    status
  };
};

const openFlagModal = (post: any) => {
  flaggingPost.value = post;
  revisionText.value = '';
};

const handleFlagSubmit = async () => {
  if (!flaggingPost.value) return;
  const success = await flagPost(flaggingPost.value.id, revisionText.value);
  if (success) {
    flaggingPost.value = null;
    revisionText.value = '';
  }
};

const openLibrary = (library: any) => {
  activeLibrary.value = library;
};

const downloadCollection = (library: any) => {
  if (!library.downloadApproved) return;
  // Video assets skipped for the same reason as the individual download link above — no
  // confirmed Stream download mechanism, and getAssetUrl would build a broken URL for one.
  library.assets.filter((a: any) => a.type !== 'video').forEach((asset: any) => {
    const url = getAssetUrl(asset.id, { download: true });
    if (url) window.open(url, '_blank');
  });
};

// NEW — manual refresh, same pattern as Action Center. Compares total post count (across
// all schedules) and total asset count (across all libraries) before/after, so the
// confirmation actually says something rather than a bare "refreshed."
const isRefreshing = ref(false);

const handleManualRefresh = async () => {
  if (isRefreshing.value) return;
  isRefreshing.value = true;

  const postsBefore = activeSchedules.value.reduce((sum: number, s: any) => sum + s.posts.length, 0);
  const assetsBefore = assetLibraries.value.reduce((sum: number, l: any) => sum + l.assets.length, 0);

  await refreshMedia();

  const postsAfter = activeSchedules.value.reduce((sum: number, s: any) => sum + s.posts.length, 0);
  const assetsAfter = assetLibraries.value.reduce((sum: number, l: any) => sum + l.assets.length, 0);
  isRefreshing.value = false;

  const newPosts = postsAfter - postsBefore;
  const newAssets = assetsAfter - assetsBefore;

  if (newPosts > 0 && newAssets > 0) {
    show({ title: 'New content', message: `${newPosts} new post${newPosts === 1 ? '' : 's'} and ${newAssets} new asset${newAssets === 1 ? '' : 's'}.`, type: 'info', showInTray: true });
  } else if (newPosts > 0) {
    show({ title: 'New posts added', message: `${newPosts} new post${newPosts === 1 ? '' : 's'} to review.`, type: 'info', showInTray: true });
  } else if (newAssets > 0) {
    show({ title: 'New assets added', message: `${newAssets} new asset${newAssets === 1 ? '' : 's'} available.`, type: 'info', showInTray: true });
  } else {
    show({ title: "You're all caught up", message: 'No new content right now.', type: 'success', showInTray: false });
  }
};

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'instagram': return 'lucide:instagram';
    case 'tiktok': return 'lucide:music-2';
    case 'linkedin': return 'lucide:linkedin';
    case 'x': return 'lucide:twitter';
    case 'youtube': return 'lucide:youtube';
    case 'facebook': return 'lucide:facebook';
    default: return 'lucide:share-2';
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'instagram': return 'text-pink-500';
    case 'tiktok': return 'text-cyan-400';
    case 'linkedin': return 'text-blue-400';
    case 'x': return 'text-white';
    case 'youtube': return 'text-red-500';
    case 'facebook': return 'text-blue-500';
    default: return 'text-slate-400';
  }
};
</script>

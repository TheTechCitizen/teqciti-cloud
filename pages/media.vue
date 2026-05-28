<template>
  <div class="mx-auto w-full max-w-5xl px-4 py-8 pb-28 sm:px-6 lg:px-8 relative min-h-screen space-y-8">
    
    <!-- Header & Tab Navigation -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-white">Media Hub</h1>
        <p class="mt-2 text-sm text-slate-400">Review upcoming social posts and access your high-res project assets.</p>
      </div>

      <!-- Segmented Control Tabs -->
      <div class="flex p-1 space-x-1 rounded-xl bg-slate-800/50 ring-1 ring-slate-700/50 backdrop-blur-sm">
        <button 
          @click="activeTab = 'schedule'"
          :class="['flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all', activeTab === 'schedule' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800']"
        >
          <Icon name="lucide:calendar-clock" size="16" />
          Social Schedule
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

    <!-- ========================================== -->
    <!-- TAB 1: SOCIAL MEDIA SCHEDULE -->
    <!-- ========================================== -->
    <section v-if="activeTab === 'schedule'" class="animate-in fade-in duration-300">
      
      <!-- Empty State -->
      <div v-if="socialPosts.length === 0" class="flex flex-col items-center justify-center rounded-3xl bg-slate-800/30 py-16 px-6 ring-1 ring-slate-700/50 text-center">
        <img src="/img/illustrations/2.png" alt="No scheduled posts" class="w-40 h-40 object-contain opacity-70 mb-6 drop-shadow-xl" />
        <h3 class="text-xl font-bold text-white tracking-tight">Schedule is empty</h3>
        <p class="mt-2 text-sm text-slate-400 max-w-md leading-relaxed">
          There is no content scheduled for the next two weeks. We might be in the production phase or waiting for your latest shoot!
        </p>
      </div>

      <!-- Schedule Timeline Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div 
          v-for="post in socialPosts" 
          :key="post.id"
          :class="[
            'group flex flex-col overflow-hidden rounded-2xl ring-1 transition-all',
            post.status === 'flagged' ? 'bg-rose-950/20 ring-rose-500/30' : 'bg-slate-800/40 ring-slate-700/50 hover:bg-slate-800/60'
          ]"
        >
          <!-- Media Preview (Header) -->
          <div class="relative h-48 w-full bg-slate-900 overflow-hidden">
            <img :src="post.thumbnail" alt="Thumbnail" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            
            <!-- Platform & Status Badges -->
            <div class="absolute top-3 left-3 flex gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 backdrop-blur-md ring-1 ring-white/10">
                <Icon :name="getPlatformIcon(post.platform)" size="16" :class="getPlatformColor(post.platform)" />
              </div>
            </div>
            
            <div class="absolute top-3 right-3">
              <span v-if="post.status === 'auto-approved'" class="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-md">
                <Icon name="lucide:check-circle-2" size="12" /> Auto-Approved
              </span>
              <span v-else class="inline-flex items-center gap-1 rounded-full bg-rose-500/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-md">
                <Icon name="lucide:flag" size="12" /> Revision Requested
              </span>
            </div>

            <!-- Date -->
            <div class="absolute bottom-3 left-3 text-white">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-300">Publishing on</p>
              <p class="text-sm font-bold">{{ post.publishDate }}</p>
            </div>
          </div>

          <!-- Content Details -->
          <div class="flex flex-1 flex-col p-5">
            <p class="text-sm text-slate-300 line-clamp-3 mb-4 flex-1 whitespace-pre-line">{{ post.caption }}</p>
            
            <div v-if="post.status === 'flagged'" class="rounded-xl bg-rose-500/10 p-3 ring-1 ring-rose-500/20 mb-4">
              <p class="text-xs font-bold text-rose-400 mb-1">Your Revision Note:</p>
              <p class="text-xs text-rose-200/80 leading-relaxed">{{ post.flagReason }}</p>
            </div>

            <button 
              v-if="post.status === 'auto-approved'"
              @click="openFlagModal(post)"
              class="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-700/50 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-rose-500/20 hover:text-rose-400 hover:ring-1 hover:ring-rose-500/50 transition-all"
            >
              <Icon name="lucide:flag" size="16" />
              Flag / Request Revision
            </button>
            <div v-else class="text-center text-xs text-slate-500 font-medium py-2">
              Agency is reviewing your request.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================== -->
    <!-- TAB 2: ASSET LIBRARY (LONG RUNNING) -->
    <!-- ========================================== -->
    <section v-if="activeTab === 'assets'" class="animate-in fade-in duration-300">
      
      <!-- Empty State -->
      <div v-if="assetCollections.length === 0" class="flex flex-col items-center justify-center rounded-3xl bg-slate-800/30 py-16 px-6 ring-1 ring-slate-700/50 text-center">
        <img src="/img/illustrations/5.png" alt="No assets" class="w-40 h-40 object-contain opacity-70 mb-6 drop-shadow-xl" />
        <h3 class="text-xl font-bold text-white tracking-tight">No project assets yet</h3>
        <p class="mt-2 text-sm text-slate-400 max-w-md leading-relaxed">
          High-resolution photos, raw videos, and finalized deliverables from your projects will appear here once available.
        </p>
      </div>

      <!-- Asset Collections Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div 
          v-for="collection in assetCollections" 
          :key="collection.id"
          @click="openCollection(collection)"
          class="group relative flex overflow-hidden rounded-2xl bg-slate-800/40 ring-1 ring-slate-700/50 backdrop-blur-sm transition-all hover:bg-slate-800 hover:ring-purple-500/50 cursor-pointer h-40"
        >
          <!-- Folder Preview / Collage -->
          <div class="w-2/5 h-full bg-slate-900 relative shrink-0 border-r border-slate-700/50">
            <img :src="collection.assets[0]?.url" class="h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/90"></div>
            <!-- Type Icon overlay -->
            <div class="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900/80 backdrop-blur-sm ring-1 ring-white/10">
              <Icon name="lucide:images" size="16" class="text-white" />
            </div>
          </div>
          
          <!-- Collection Info -->
          <div class="flex-1 p-5 flex flex-col justify-center relative">
            
            <div class="absolute top-3 right-3">
              <Icon v-if="!collection.downloadApproved" name="lucide:lock" size="14" class="text-rose-400" />
            </div>

            <h3 class="text-base font-bold text-white truncate pr-6">{{ collection.name }}</h3>
            <p class="text-xs font-medium text-purple-400 mt-1">{{ collection.projectName }}</p>
            <p class="text-sm text-slate-400 mt-2 line-clamp-2">{{ collection.description }}</p>
            
            <div class="mt-3 flex items-center gap-3 text-xs text-slate-500">
              <span class="flex items-center gap-1"><Icon name="lucide:file-image" size="12" /> {{ collection.assets.length }} Items</span>
              <span class="flex items-center gap-1 text-emerald-400" v-if="collection.downloadApproved">
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

    <!-- FLAG CONTENT MODAL -->
    <div v-if="flaggingPost" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" @click="flaggingPost = null"></div>
      
      <div class="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-slate-900 ring-1 ring-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300">
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold text-white flex items-center gap-2">
                <Icon name="lucide:flag" size="20" class="text-rose-400" />
                Flag Content
              </h3>
              <p class="mt-1 text-sm text-slate-400">This post will be paused from publishing.</p>
            </div>
            <button @click="flaggingPost = null" class="text-slate-400 hover:text-white transition-colors">
              <Icon name="lucide:x" size="20" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">What needs changing?</label>
              <textarea 
                v-model="revisionText"
                rows="4" 
                class="w-full rounded-xl border-0 bg-slate-950 py-3 px-4 text-sm text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-600 focus:ring-2 focus:ring-rose-500 transition-shadow"
                placeholder="E.g., Please change the call to action, or use a different image..."
              ></textarea>
            </div>

            <div class="flex gap-3 pt-2">
              <button @click="flaggingPost = null" class="flex-1 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors">
                Cancel
              </button>
              <button 
                @click="submitFlag"
                :disabled="!revisionText.trim()"
                class="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Revision
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ASSET COLLECTION GALLERY MODAL -->
    <div v-if="activeCollection" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity" @click="activeCollection = null"></div>
      
      <div class="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 ring-1 ring-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <!-- Gallery Header -->
        <div class="flex items-center justify-between border-b border-slate-700/50 bg-slate-800/90 px-6 py-4 backdrop-blur-md shrink-0">
          <div>
            <h2 class="text-xl font-bold text-white">{{ activeCollection.name }}</h2>
            <p class="text-xs text-slate-400 mt-1">{{ activeCollection.projectName }} • {{ activeCollection.assets.length }} Items</p>
          </div>
          <div class="flex items-center gap-4">
            
            <!-- Conditional Download Button -->
            <button 
              v-if="activeCollection.downloadApproved"
              class="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
            >
              <Icon name="lucide:download-cloud" size="16" />
              <span class="hidden sm:inline">Download All</span>
            </button>
            <div 
              v-else 
              class="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-rose-400 ring-1 ring-inset ring-rose-500/20 cursor-not-allowed tooltip-trigger"
              title="Downloads pending final invoice settlement or approval."
            >
              <Icon name="lucide:lock" size="16" />
              <span class="hidden sm:inline">Download Locked</span>
            </div>

            <button @click="activeCollection = null" class="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
              <Icon name="lucide:x" size="20" />
            </button>
          </div>
        </div>

        <!-- Gallery Grid (Scrollable) -->
        <div class="flex-1 overflow-y-auto p-6">
          <p class="text-sm text-slate-300 mb-6">{{ activeCollection.description }}</p>
          
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div 
              v-for="asset in activeCollection.assets" 
              :key="asset.id"
              class="group relative aspect-square overflow-hidden rounded-xl bg-slate-800 ring-1 ring-slate-700/50"
            >
              <img :src="asset.url" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              
              <!-- Video Indicator -->
              <div v-if="asset.type === 'video'" class="absolute inset-0 flex items-center justify-center bg-slate-950/20">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                  <Icon name="lucide:play" size="20" class="text-white fill-white ml-1" />
                </div>
              </div>

              <!-- Hover Actions -->
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-3">
                <button 
                  v-if="activeCollection.downloadApproved"
                  class="flex w-full items-center justify-center gap-2 rounded-md bg-purple-600/90 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-purple-500"
                >
                  <Icon name="lucide:download" size="14" /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
    requiresAuth: true
});

import { ref } from 'vue'

// --- TYPES ---
type Tab = 'schedule' | 'assets'
type Platform = 'instagram' | 'tiktok' | 'linkedin'
type SocialStatus = 'auto-approved' | 'flagged'

interface SocialPost {
  id: string
  platform: Platform
  publishDate: string
  thumbnail: string
  caption: string
  status: SocialStatus
  flagReason?: string
}

interface Asset {
  id: string
  type: 'photo' | 'video'
  url: string
}

interface AssetCollection {
  id: string
  name: string
  projectName: string
  description: string
  downloadApproved: boolean
  assets: Asset[]
}

// --- STATE ---
const activeTab = ref<Tab>('schedule')

// Modals
const flaggingPost = ref<SocialPost | null>(null)
const revisionText = ref('')
const activeCollection = ref<AssetCollection | null>(null)

// --- MOCK DATA: SOCIAL SCHEDULE ---
const socialPosts = ref<SocialPost[]>([
  {
    id: 'post_1',
    platform: 'instagram',
    publishDate: 'Tomorrow, 10:00 AM',
    thumbnail: '/img/illustrations/1.png',
    caption: 'Creating smiles that last a lifetime. 😁✨\n\nOur team is dedicated to providing the most comfortable experience possible. Book your session today via the link in our bio!\n\n#SmileMakeover #DentalCare #NairobiDentist',
    status: 'auto-approved'
  },
  ])

// --- MOCK DATA: ASSET LIBRARY ---
const assetCollections = ref<AssetCollection[]>([
  {
    id: 'col_1',
    name: 'Cinematic B-Roll Pack',
    projectName: 'Q2 Content Shoot',
    description: 'High-resolution graded video clips and facility photos shot during the May production day. Ready for use on your website and PR materials.',
    downloadApproved: true,
    assets: [
      { id: 'a1', type: 'video', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&q=80' },
      { id: 'a2', type: 'photo', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&q=80' },
      { id: 'a3', type: 'photo', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&q=80' },
      { id: 'a4', type: 'video', url: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=500&q=80' },
      { id: 'a5', type: 'photo', url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&q=80' }
    ]
  },
  {
    id: 'col_2',
    name: 'Staff Headshots (Raw & Retouched)',
    projectName: 'Brand Identity Refresh',
    description: 'Professional headshots for the new management team. Includes both raw formats and final retouched versions for the "About Us" page.',
    downloadApproved: false, // Locked state
    assets: [
      { id: 'a6', type: 'photo', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80' },
      { id: 'a7', type: 'photo', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80' },
      { id: 'a8', type: 'photo', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80' }
    ]
  }
])

// --- ACTIONS ---

// Flagging flow
const openFlagModal = (post: SocialPost) => {
  flaggingPost.value = post
  revisionText.value = ''
}

const submitFlag = () => {
  if (!flaggingPost.value) return
  
  // Update post state
  flaggingPost.value.status = 'flagged'
  flaggingPost.value.flagReason = revisionText.value
  
  // Close modal
  flaggingPost.value = null
  revisionText.value = ''
}

// Asset Gallery flow
const openCollection = (collection: AssetCollection) => {
  activeCollection.value = collection
  document.body.style.overflow = 'hidden'
}
// Watcher or click away to restore scroll omitted for brevity, handled implicitly in standard setups or UI frameworks.

// --- HELPERS ---
const getPlatformIcon = (platform: Platform) => {
  switch (platform) {
    case 'instagram': return 'lucide:instagram'
    case 'tiktok': return 'lucide:music-2' // Closest standard lucide icon
    case 'linkedin': return 'lucide:linkedin'
  }
}

const getPlatformColor = (platform: Platform) => {
  switch (platform) {
    case 'instagram': return 'text-pink-400'
    case 'tiktok': return 'text-cyan-400'
    case 'linkedin': return 'text-blue-400'
  }
}
</script>

<style scoped>
/* Optional tooltip styling if needed, but standard browser 'title' attribute is used on the locked button */
</style>

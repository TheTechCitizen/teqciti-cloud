<template>
  <div class="mx-auto w-full max-w-5xl px-4 py-8 pb-28 sm:px-6 lg:px-8 relative min-h-screen">
    
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-white">Action Center</h1>
      <p class="mt-2 text-sm text-slate-400">Complete tasks to unlock agency perks, free credits, and campaign boosts.</p>
    </div>

    <!-- Gamification Banner -->
    <div class="relative overflow-hidden rounded-3xl bg-slate-800 ring-1 ring-slate-700/50 mb-8 flex flex-col md:flex-row items-center p-6 sm:p-8 gap-8">
      <!-- Background glows -->
      <div class="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none"></div>
      <div class="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none"></div>
      
      <!-- Tier Illustration -->
      <div class="relative shrink-0">
        <div class="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full"></div>
        <img src="/img/illustrations/10.png" alt="Current Tier" class="h-32 w-32 object-contain drop-shadow-2xl relative z-10 hover:scale-105 transition-transform duration-500" />
        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
          {{ clientStats.currentTier }}
        </div>
      </div>

      <!-- Stats & Progress -->
      <div class="flex-1 w-full z-10">
        <div class="flex items-end justify-between mb-2">
          <div>
            <p class="text-sm font-medium text-slate-400">Total Reward Points</p>
            <p class="text-4xl font-black text-white mt-1">{{ animatedPoints }}<span class="text-lg text-amber-500 ml-1">pts</span></p>
          </div>
          <div class="text-right">
            <p class="text-xs text-slate-400">Next Unlock</p>
            <p class="text-sm font-bold text-purple-400 flex items-center gap-1 justify-end mt-1">
              <Icon name="lucide:gift" size="14" />
              {{ clientStats.nextReward }}
            </p>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="h-3 w-full overflow-hidden rounded-full bg-slate-900 ring-1 ring-inset ring-slate-700/50 relative">
          <div 
            class="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 transition-all duration-1000 relative"
            :style="{ width: `${progressPercentage}%` }"
          >
            <!-- Shimmer effect -->
            <div class="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
        <p class="text-xs font-medium text-slate-500 mt-3 text-right">
          {{ clientStats.nextTierThreshold - clientStats.points }} pts to {{ clientStats.nextTier }}
        </p>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- LEFT COLUMN: Tasks Feed -->
      <div class="lg:col-span-2 space-y-6">
        <div class="flex items-center justify-between border-b border-slate-700/50 pb-4">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <Icon name="lucide:swords" size="20" class="text-purple-400" />
            Active Quests
          </h2>
          <!-- Filter pills -->
          <div class="flex gap-2">
            <button class="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-white ring-1 ring-slate-600 transition-colors">To Do</button>
            <button class="rounded-full bg-transparent px-3 py-1 text-xs font-medium text-slate-400 hover:text-white transition-colors">Completed</button>
          </div>
        </div>

        <div class="space-y-4">
          <div 
            v-for="task in pendingTasks" 
            :key="task.id"
            :class="[
              'group relative overflow-hidden rounded-2xl p-5 ring-1 transition-all duration-300 cursor-pointer',
              activeTaskId === task.id ? 'bg-slate-800/80 ring-purple-500/50 shadow-lg shadow-purple-500/10' : 'bg-slate-800/30 ring-slate-700/50 hover:bg-slate-800/50 hover:ring-slate-600'
            ]"
            @click="toggleTask(task.id)"
          >
            <!-- Highlight bar for active task -->
            <div v-if="activeTaskId === task.id" class="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>

            <div class="flex items-start gap-4">
              <!-- Task Icon based on type -->
              <div :class="['flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 ring-1 ring-inset', getTaskTypeStyles(task.type)]">
                <Icon :name="getTaskIcon(task.type)" size="24" />
              </div>
              
              <div class="flex-1 pt-1">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <span :class="['inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', getFrequencyStyles(task.frequency)]">
                    {{ task.frequency }}
                  </span>
                  <span v-if="task.dueDate" class="text-xs font-medium text-amber-400/80 flex items-center gap-1">
                    <Icon name="lucide:clock" size="12" /> Due {{ task.dueDate }}
                  </span>
                </div>
                <h3 class="text-base font-bold text-white">{{ task.title }}</h3>
                <p class="text-sm text-slate-400 mt-1 line-clamp-2" v-if="activeTaskId !== task.id">{{ task.description }}</p>
              </div>

              <!-- Points Bounty -->
              <div class="shrink-0 text-right flex flex-col items-end pt-1">
                <div class="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg">
                  <Icon name="lucide:coins" size="14" />
                  +{{ task.points }}
                </div>
              </div>
            </div>

            <!-- TASK ACTION AREA (Expands inline when clicked) -->
            <div 
              v-show="activeTaskId === task.id" 
              class="mt-6 pt-5 border-t border-slate-700/50 animate-in slide-in-from-top-2 fade-in duration-200"
              @click.stop
            >
              <p class="text-sm text-slate-300 mb-6">{{ task.description }}</p>

              <!-- Upload UI (Photo/Video) -->
              <div v-if="task.type === 'upload_photo' || task.type === 'upload_video'" class="space-y-4">
                <div class="flex justify-center rounded-xl border border-dashed border-slate-600 bg-slate-900/50 px-6 py-10 hover:bg-slate-900 hover:border-purple-500/50 transition-colors cursor-pointer group/drop">
                  <div class="text-center">
                    <Icon :name="task.type === 'upload_video' ? 'lucide:video' : 'lucide:image'" size="32" class="mx-auto text-slate-500 group-hover/drop:text-purple-400 transition-colors" />
                    <div class="mt-4 flex text-sm leading-6 text-slate-400 justify-center">
                      <span class="relative cursor-pointer rounded-md font-semibold text-purple-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 hover:text-purple-300">
                        Upload a file
                      </span>
                      <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs leading-5 text-slate-500 mt-1">
                      {{ task.type === 'upload_video' ? 'MP4, MOV up to 500MB' : 'PNG, JPG up to 10MB' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Input / Approval UI -->
              <div v-if="task.type === 'text_input'" class="space-y-4">
                <textarea 
                  rows="3" 
                  class="w-full rounded-xl border-0 bg-slate-900 py-3 px-4 text-sm text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500"
                  placeholder="Type your notes or feedback here..."
                ></textarea>
              </div>

              <!-- Submit Action -->
              <div class="mt-6 flex justify-end">
                <button 
                  @click="completeTask(task)"
                  class="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-purple-500 transition-all hover:scale-105"
                >
                  <Icon name="lucide:check-circle-2" size="18" />
                  Complete & Claim +{{ task.points }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="pendingTasks.length === 0" class="text-center py-12">
          <div class="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 mb-4 ring-1 ring-emerald-500/20">
            <Icon name="lucide:party-popper" size="32" class="text-emerald-400" />
          </div>
          <h3 class="text-lg font-bold text-white">All Quests Completed!</h3>
          <p class="text-slate-400 text-sm mt-1">Check back later for new tasks and rewards.</p>
        </div>
      </div>

      <!-- RIGHT COLUMN: Events & Schedule -->
      <div class="space-y-6">
        <h2 class="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-700/50 pb-4">
          <Icon name="lucide:calendar-days" size="20" class="text-cyan-400" />
          Mission Control
        </h2>
        
        <div class="rounded-2xl bg-slate-800/30 p-5 ring-1 ring-slate-700/50">
          <div class="relative pl-6 border-l border-slate-700 space-y-8 py-2">
            
            <div v-for="(event, idx) in upcomingEvents" :key="event.id" class="relative group">
              <!-- Timeline Dot -->
              <div :class="['absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-slate-800/30', getEventColor(event.type).dotBg]">
                <div :class="['h-2 w-2 rounded-full', getEventColor(event.type).innerBg]"></div>
              </div>
              
              <div class="-mt-1.5">
                <p :class="['text-xs font-bold uppercase tracking-wider mb-1', getEventColor(event.type).text]">
                  {{ event.dateLabel }}
                </p>
                <h4 class="text-sm font-bold text-white">{{ event.title }}</h4>
                <p class="text-xs text-slate-400 mt-1 line-clamp-2">{{ event.description }}</p>
                
                <!-- Actionable event link if applicable -->
                <button v-if="event.actionLabel" class="mt-3 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded-md w-max">
                  <Icon name="lucide:external-link" size="12" />
                  {{ event.actionLabel }}
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Quick Summary Block -->
        <div class="rounded-2xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 p-5 ring-1 ring-indigo-500/20 flex gap-4 items-center">
          <img src="/img/illustrations/9.png" class="h-16 w-16 object-contain drop-shadow-lg" />
          <div>
            <h4 class="text-sm font-bold text-white">Monthly Review Call</h4>
            <p class="text-xs text-indigo-200 mt-1 mb-2">Discuss ad performance and strategy.</p>
            <button class="text-xs font-bold bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-400 transition-colors">
              Book Slot
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Celebration Overlay (Fires on task complete) -->
    <div v-if="showCelebration" class="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div class="animate-in zoom-in slide-in-from-bottom-10 fade-in duration-500 flex flex-col items-center">
        <div class="h-32 w-32 bg-amber-500/20 rounded-full blur-xl absolute"></div>
        <Icon name="lucide:coins" size="64" class="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] relative z-10" />
        <p class="mt-4 text-2xl font-black text-white drop-shadow-lg relative z-10">
          +{{ lastRewardedPoints }} Points!
        </p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

definePageMeta({
    requiresAuth: true
});


// --- TYPES ---
type TaskType = 'upload_photo' | 'upload_video' | 'text_input' | 'checkbox'
type TaskFrequency = 'one-off' | 'weekly' | 'monthly'
type EventType = 'shoot' | 'meeting' | 'launch' | 'deadline'

interface Task {
  id: string
  title: string
  description: string
  type: TaskType
  frequency: TaskFrequency
  points: number
  dueDate?: string
  status: 'pending' | 'completed'
}

interface AppEvent {
  id: string
  title: string
  description: string
  dateLabel: string
  type: EventType
  actionLabel?: string
}

// --- STATE: Gamification ---
const clientStats = ref({
  points: 1240,
  currentTier: 'Silver Partner',
  nextTier: 'Gold Partner',
  nextTierThreshold: 2000,
  nextReward: 'Free SEO Technical Audit'
})

// Used for smooth point animation
const animatedPoints = ref(clientStats.value.points)

const progressPercentage = computed(() => {
  return Math.min(100, Math.round((clientStats.value.points / clientStats.value.nextTierThreshold) * 100))
})

// --- STATE: Tasks & Events ---
const activeTaskId = ref<string | null>(null)
const showCelebration = ref(false)
const lastRewardedPoints = ref(0)

const tasks = ref<Task[]>([
  {
    id: 't_1',
    title: 'Record Monthly Patient Testimonial',
    description: 'Use your smartphone to record a quick 30-60 second review from a happy client. We will handle the editing, captions, and color grading for the TikTok campaign.',
    type: 'upload_video',
    frequency: 'monthly',
    points: 100,
    dueDate: 'In 3 Days',
    status: 'pending'
  },
  {
    id: 't_2',
    title: 'Approve "Black November" Ad Copy',
    description: 'Review the 3 variations of ad copy for the upcoming promo. Let us know if the discount structures look correct before we launch.',
    type: 'text_input',
    frequency: 'one-off',
    points: 25,
    status: 'pending'
  },
  {
    id: 't_3',
    title: 'Upload Workspace / Clinic B-Roll',
    description: 'Snap 5-10 horizontal photos of the facility while it is clean. We need these to update the digital reception and booking canvas.',
    type: 'upload_photo',
    frequency: 'one-off',
    points: 50,
    status: 'pending'
  }
])

const upcomingEvents = ref<AppEvent[]>([
  {
    id: 'e_1',
    title: 'Cinematic Content Shoot',
    description: 'On-location shoot. High-contrast lighting setups. Ensure staff are in uniform.',
    dateLabel: 'Tomorrow, 9:00 AM',
    type: 'shoot'
  },
  {
    id: 'e_2',
    title: 'Meta Campaign Launch',
    description: 'Performance marketing engine goes live targeting local radius.',
    dateLabel: 'Friday, June 12',
    type: 'launch',
    actionLabel: 'View Assets'
  },
  {
    id: 'e_3',
    title: 'Asset Review Deadline',
    description: 'Final day to request edits on the DaVinci Resolve video cuts.',
    dateLabel: 'Mon, June 15',
    type: 'deadline'
  }
])

const pendingTasks = computed(() => tasks.value.filter(t => t.status === 'pending'))

// --- ACTIONS ---
const toggleTask = (id: string) => {
  activeTaskId.value = activeTaskId.value === id ? null : id
}

const completeTask = (task: Task) => {
  // 1. Mark complete
  task.status = 'completed'
  activeTaskId.value = null

  // 2. Award Points & Trigger Animation
  lastRewardedPoints.value = task.points
  clientStats.value.points += task.points
  
  // Smooth counter animation
  const step = Math.ceil(task.points / 20)
  const timer = setInterval(() => {
    if (animatedPoints.value < clientStats.value.points) {
      animatedPoints.value = Math.min(animatedPoints.value + step, clientStats.value.points)
    } else {
      clearInterval(timer)
    }
  }, 30)

  // 3. Show Celebration UI
  showCelebration.value = true
  setTimeout(() => {
    showCelebration.value = false
  }, 2500)
}

// --- HELPERS (UI STYLING) ---
const getTaskIcon = (type: TaskType) => {
  switch (type) {
    case 'upload_video': return 'lucide:film'
    case 'upload_photo': return 'lucide:camera'
    case 'text_input': return 'lucide:message-square-text'
    case 'checkbox': return 'lucide:check-square'
  }
}

const getTaskTypeStyles = (type: TaskType) => {
  switch (type) {
    case 'upload_video': return 'text-rose-400 ring-rose-500/30'
    case 'upload_photo': return 'text-emerald-400 ring-emerald-500/30'
    case 'text_input': return 'text-cyan-400 ring-cyan-500/30'
    case 'checkbox': return 'text-purple-400 ring-purple-500/30'
  }
}

const getFrequencyStyles = (freq: TaskFrequency) => {
  switch (freq) {
    case 'one-off': return 'bg-slate-700 text-slate-300'
    case 'weekly': return 'bg-indigo-500/20 text-indigo-300'
    case 'monthly': return 'bg-purple-500/20 text-purple-300'
  }
}

const getEventColor = (type: EventType) => {
  switch (type) {
    case 'shoot': return { text: 'text-emerald-400', dotBg: 'bg-emerald-950', innerBg: 'bg-emerald-500' }
    case 'meeting': return { text: 'text-indigo-400', dotBg: 'bg-indigo-950', innerBg: 'bg-indigo-500' }
    case 'launch': return { text: 'text-purple-400', dotBg: 'bg-purple-950', innerBg: 'bg-purple-500' }
    case 'deadline': return { text: 'text-rose-400', dotBg: 'bg-rose-950', innerBg: 'bg-rose-500' }
  }
}
</script>

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-100%); opacity: 0; }
  50% { opacity: 0.5; }
  100% { transform: translateX(100%); opacity: 0; }
}
</style>

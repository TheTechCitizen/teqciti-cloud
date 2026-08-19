<template>
  <div class="mx-auto w-full max-w-5xl px-4 py-8 pb-28 sm:px-6 lg:px-8 relative min-h-screen">
    
   <!-- Header -->
<div class="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
  <div>
    <h1 class="text-3xl font-bold tracking-tight text-white">Action Center</h1>
    <p class="mt-2 text-sm text-slate-400">Complete client deliverables to keep projects healthy and optimum</p>
  </div>

  <!-- ADD THIS -->
  <button
    @click="handleManualRefresh"
    :disabled="isRefreshing"
    aria-label="Check for new tasks"
    class="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 ring-1 ring-slate-700/50 hover:bg-slate-700 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all shrink-0"
  >
    <Icon name="lucide:refresh-cw" size="16" :class="{ 'animate-spin': isRefreshing }" />
    {{ isRefreshing ? 'Checking...' : 'Check for new tasks' }}
  </button>
</div>


    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-20">
      <Icon name="lucide:loader-2" class="animate-spin text-purple-500" size="48" />
    </div>

    <!-- NEW — Error State. Previously a real fetch failure showed the exact same
         "Sprint Cleared!" empty state as genuinely having zero tasks. error is now exposed
         from useActionCenter; checked here BEFORE the empty-state path can be reached. -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 ring-1 ring-rose-500/30 mb-4">
        <Icon name="lucide:alert-triangle" size="28" class="text-rose-400" />
      </div>
      <h3 class="text-lg font-bold text-white">Couldn't load your tasks</h3>
      <p class="text-slate-400 text-sm mt-1 max-w-sm">Something went wrong fetching your action items. Check your connection and try again.</p>
      <button @click="refreshActions" class="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 transition-colors">
        <Icon name="lucide:refresh-cw" size="16" />
        Retry
      </button>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-8">
      
      <!-- Weekly Completion Banner -->
   <div class="relative overflow-hidden rounded-3xl bg-slate-800 ring-1 ring-slate-700/50 flex flex-col md:flex-row items-center p-5 sm:p-8 gap-5 md:gap-8 shadow-xl">
  <div class="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none"></div>
  <div class="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none"></div>
  
  <div class="relative shrink-0 w-full md:w-auto flex justify-center md:block mb-2 md:mb-0">
    <div class="relative">
      <div class="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full"></div>
      <div class="relative z-10 flex h-20 w-20 md:h-28 md:w-28 items-center justify-center rounded-full bg-slate-900 ring-1 ring-emerald-500/50 shadow-2xl">
        <Icon name="lucide:check-circle" class="text-emerald-400 w-10 h-10 md:w-12 md:h-12" />
      </div>
      <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2.5 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-bold text-white shadow-lg">
        Weekly Sprint
      </div>
    </div>
  </div>

  <div class="flex-1 w-full z-10">
    <div class="flex flex-wrap items-end justify-between gap-4 mb-3 md:mb-2">
      <div>
        <p class="text-xs md:text-sm font-medium text-slate-400">Completion Rate</p>
        <p class="text-3xl md:text-4xl font-black text-white mt-0.5 md:mt-1">
          {{ completionRate }}<span class="text-lg md:text-xl text-emerald-500 ml-1">%</span>
        </p>
      </div>
      <div class="text-left md:text-right">
        <p class="text-xs font-medium text-slate-400">Task Velocity</p>
        <p class="text-sm font-bold text-emerald-400 flex items-center md:justify-end gap-1 mt-0.5 md:mt-1">
          <Icon name="lucide:activity" size="14" />
          {{ sprintCompletedTasks.length }} of {{ sprintTasks.length }} Done
        </p>
      </div>
    </div>

    <div class="h-2.5 md:h-3 w-full overflow-hidden rounded-full bg-slate-900 ring-1 ring-inset ring-slate-700/50 relative">
      <div 
        class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 relative overflow-hidden"
        :style="{ width: `${completionRate}%` }"
      >
        <div class="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
      </div>
    </div>
    
    <p class="text-[11px] md:text-xs font-medium text-slate-500 mt-2.5 md:mt-3 text-left md:text-right">
      Resets every Monday
    </p>
  </div>
</div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- LEFT COLUMN: Tasks Feed -->
        <div class="lg:col-span-2 space-y-8">
          
            <div class="space-y-6">
                <div class="flex items-center justify-between border-b border-slate-700/50 pb-4">
                    <h2 class="text-lg font-bold text-white flex items-center gap-2">
                        <Icon name="lucide:list-todo" size="20" class="text-purple-400" />
                        This Week's Deliverables
                    </h2>
                    <div class="flex gap-2 p-1 rounded-full bg-slate-900/50 ring-1 ring-slate-700/50">
                        <button 
                            @click="activeFilter = 'pending'"
                            :class="[
                            'rounded-full px-3 py-1.5 md:px-4 md:py-2 text-[11px] sm:text-xs font-medium transition-all whitespace-nowrap',
                            activeFilter === 'pending' 
                            ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-600' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                            ]"
                            >
                            To Do ({{ sprintPendingTasks.length }})
                        </button>
                            <button 
                                @click="activeFilter = 'completed'"
                                :class="['rounded-full px-4 py-1 text-xs font-medium transition-all', activeFilter === 'completed' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white']"
                                >Completed</button>
                    </div>
                </div>

            <div class="space-y-4">
              <TaskCard
                v-for="task in visibleSprintTasks"
                :key="task.id"
                :task="task"
                :is-active="activeTaskId === task.id"
                :is-completed-view="activeFilter === 'completed'"
                :is-submitting="isSubmitting"
                :upload-progress="uploadProgress"
                :selected-file="selectedFile"
                :is-dragging="isDragging"
                :file-error="fileError"
                :task-input-data="taskInputData"
                @toggle="toggleTask"
                @drop="handleDrop"
                @file-select="handleFileSelect"
                @clear-file="clearFile"
                @complete="handleCompleteTask"
                @update:task-input-data="taskInputData = $event"
                @dragover="isDragging = true"
                @dragleave="isDragging = false"
              />
            </div>

            <!-- Empty States -->
            <div v-if="activeFilter === 'pending' && sprintPendingTasks.length === 0" class="text-center py-16 rounded-2xl bg-slate-800/30 ring-1 ring-slate-700/50">
              <div class="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 mb-4 ring-1 ring-emerald-500/20">
                <Icon name="lucide:party-popper" size="32" class="text-emerald-400" />
              </div>
              <h3 class="text-lg font-bold text-white">Sprint Cleared!</h3>
              <p class="text-slate-400 text-sm mt-1">You have no pending tasks for this week's sprint.</p>
            </div>

            <div v-if="activeFilter === 'completed' && sprintCompletedTasks.length === 0" class="text-center py-16 rounded-2xl bg-slate-800/30 ring-1 ring-slate-700/50">
              <Icon name="lucide:inbox" size="48" class="text-slate-600 mx-auto mb-4" />
              <h3 class="text-lg font-bold text-white">No tasks completed this week</h3>
            </div>
          </div>

          <!-- MONTHLY OUTLOOK SECTION -->
          <!-- CHANGED: previously static, non-interactive cards — a monthly task could not be
               completed early even if a client wanted to, since no complete UI existed here
               at all. Now uses the same interactive TaskCard as the sprint section above,
               with a muted "head start" framing instead of urgency, since these genuinely
               aren't due yet — they're just no longer BLOCKED from being done early. -->
          <div v-if="!isLastWeekOfMonth && monthlyOutlookTasks.length > 0" class="mt-12 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-700/50 pb-4">
              <h2 class="text-base font-bold text-slate-300 flex items-center gap-2">
                <Icon name="lucide:calendar-check" size="18" class="text-amber-400" />
                Monthly Outlook
              </h2>
              <span class="text-xs text-slate-500">Optional — get a head start any time</span>
            </div>

            <div class="space-y-4">
              <TaskCard
                v-for="task in monthlyOutlookTasks"
                :key="task.id"
                :task="task"
                :is-active="activeTaskId === task.id"
                :is-completed-view="false"
                :is-submitting="isSubmitting"
                :upload-progress="uploadProgress"
                :selected-file="selectedFile"
                :is-dragging="isDragging"
                :file-error="fileError"
                :task-input-data="taskInputData"
                :muted="true"
                @toggle="toggleTask"
                @drop="handleDrop"
                @file-select="handleFileSelect"
                @clear-file="clearFile"
                @complete="handleCompleteTask"
                @update:task-input-data="taskInputData = $event"
                @dragover="isDragging = true"
                @dragleave="isDragging = false"
              />
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN: Events & Schedule -->
        <div class="space-y-6">
          <h2 class="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-700/50 pb-4">
            <Icon name="lucide:calendar-days" size="20" class="text-cyan-400" />
            Mission Control
          </h2>
          
          <div v-if="events.length === 0" class="rounded-2xl bg-slate-800/30 p-6 ring-1 ring-slate-700/50 text-center text-sm text-slate-400">
            No upcoming events scheduled.
          </div>

          <div v-else class="rounded-2xl bg-slate-800/30 p-5 ring-1 ring-slate-700/50">
            <div class="relative pl-6 border-l border-slate-700 space-y-8 py-2">
              <div v-for="event in events" :key="event.id" class="relative group">
                <!-- Timeline Dot -->
                <div :class="['absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-slate-800/30', getEventColor(event.type).dotBg]">
                  <div :class="['h-2 w-2 rounded-full', getEventColor(event.type).innerBg]"></div>
                </div>
                
                <div class="-mt-1.5">
                  <p :class="['text-xs font-bold uppercase tracking-wider mb-1', getEventColor(event.type).text]">
                    {{ event.formattedDate }}
                  </p>
                  <h4 class="text-sm font-bold text-white">{{ event.title }}</h4>
                  <p class="text-xs text-slate-400 mt-1 line-clamp-2">{{ event.description }}</p>
                  
                  <!-- Actionable event link -->
                  <NuxtLink 
                    v-if="event.actionLabel && event.actionLink" 
                    :to="event.actionLink"
                    class="mt-3 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1 bg-slate-700/50 hover:bg-slate-600 px-3 py-1.5 rounded-md w-max transition-colors"
                  >
                    <Icon name="lucide:external-link" size="12" />
                    {{ event.actionLabel }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Celebration Overlay -->
    <div v-if="showCelebration" class="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"></div>
      <div class="animate-in zoom-in slide-in-from-bottom-10 fade-in duration-500 flex flex-col items-center bg-slate-900 p-8 rounded-3xl ring-1 ring-emerald-500/30 shadow-2xl relative z-10">
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-400/50 mb-4">
          <Icon name="lucide:check" size="40" class="text-emerald-400" />
        </div>
        <p class="text-2xl font-black text-white text-center">Task Completed!</p>
        <p class="text-slate-400 text-sm mt-2 text-center">Your weekly progress has been updated.</p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
  requiresAuth: true
});

const { orgId } = await useCurrentOrg();
// NEW: error now destructured — previously unavailable, meaning a genuine fetch failure was
// indistinguishable from "you have zero tasks" (see the Error State block in the template).
const { tasks, events, isLastWeekOfMonth, completeTask, pending, error, refreshActions } = await useActionCenter(orgId.value);

const { show } = useNotifications();

// --- STATE ---
const activeFilter = ref<'pending' | 'completed'>('pending');
const activeTaskId = ref<string | null>(null);
const taskInputData = ref('');
const isSubmitting = ref(false);
const showCelebration = ref(false);
// NEW — real progress (0-100) during an upload, wired to completeTask's new progress
// callback. null when not currently uploading, so the UI can distinguish "not uploading"
// from "uploading, 0% so far."
const uploadProgress = ref<number | null>(null);

// Upload State
const isDragging = ref(false);
const selectedFile = ref<File | null>(null);
const fileError = ref<string>('');

// --- COMPUTED: Task Separation ---
const sprintTasks = computed(() => tasks.value.filter(t => t.inSprint));
const sprintPendingTasks = computed(() => sprintTasks.value.filter(t => t.computedStatus === 'pending'));
const sprintCompletedTasks = computed(() => sprintTasks.value.filter(t => t.computedStatus === 'completed'));
const visibleSprintTasks = computed(() => activeFilter.value === 'pending' ? sprintPendingTasks.value : sprintCompletedTasks.value);

const monthlyOutlookTasks = computed(() => tasks.value.filter(t => !t.inSprint && t.computedStatus === 'pending'));

const completionRate = computed(() => {
  const total = sprintTasks.value.length;
  if (total === 0) return 0;
  return Math.round((sprintCompletedTasks.value.length / total) * 100);
});

const isRefreshing = ref(false);

const handleManualRefresh = async () => {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  const taskCountBefore = sprintPendingTasks.value.length + monthlyOutlookTasks.value.length;
  const eventCountBefore = events.value.length;

  await refreshActions();

  const taskCountAfter = sprintPendingTasks.value.length + monthlyOutlookTasks.value.length;
  const eventCountAfter = events.value.length;
  isRefreshing.value = false;

  const newTasks = taskCountAfter - taskCountBefore;
  const newEvents = eventCountAfter - eventCountBefore;

  if (newTasks > 0 && newEvents > 0) {
    show({ title: 'New activity', message: `${newTasks} new task${newTasks === 1 ? '' : 's'} and ${newEvents} new event${newEvents === 1 ? '' : 's'}.`, type: 'info', showInTray: true });
  } else if (newTasks > 0) {
    show({ title: 'New task added', message: `${newTasks} new task${newTasks === 1 ? '' : 's'} just came in.`, type: 'info', showInTray: true });
  } else if (newEvents > 0) {
    show({ title: 'New event added', message: `${newEvents} new event${newEvents === 1 ? '' : 's'} on your schedule.`, type: 'info', showInTray: true });
  } else {
    show({ title: "You're all caught up", message: 'No new tasks or events right now.', type: 'success', showInTray: false });
  }
};
// --- ACTIONS ---
const toggleTask = (id: string) => {
  activeTaskId.value = activeTaskId.value === id ? null : id;
  taskInputData.value = '';
  clearFile();
};

const validateFile = (file: File | undefined, taskType: string) => {
  fileError.value = '';
  if (!file) return;

  const mbs = file.size / 1024 / 1024;

  if (taskType === 'upload_pdf') {
    if (file.type !== 'application/pdf') {
      fileError.value = 'Please upload a valid PDF document.';
      return;
    }
    if (mbs > 20) fileError.value = 'PDF exceeds 20MB limit.';
  }
  else if (taskType === 'upload_photo') {
    if (!file.type.startsWith('image/')) {
      fileError.value = 'Please upload a valid image file (JPG, PNG).';
      return;
    }
    if (mbs > 10) fileError.value = 'Image exceeds 10MB limit.';
  }
  else if (taskType === 'upload_video') {
    if (!file.type.startsWith('video/')) {
      fileError.value = 'Please upload a valid video file (MP4, MOV).';
      return;
    }
    if (mbs > 500) fileError.value = 'Video exceeds 500MB limit.';
  }

  if (!fileError.value) {
    selectedFile.value = file;
  }
};

const handleFileSelect = (event: Event, taskType: string) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  validateFile(file, taskType);
};

const handleDrop = (event: DragEvent, taskType: string) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  validateFile(file, taskType);
};

const clearFile = () => {
  selectedFile.value = null;
  fileError.value = '';
};

// --- SUBMISSION ---
const handleCompleteTask = async (taskId: string, taskType: string) => {
  isSubmitting.value = true;
  uploadProgress.value = taskType.startsWith('upload_') ? 0 : null;

  const payload = {
    text: taskType === 'text_input' ? taskInputData.value : undefined,
    file: taskType.startsWith('upload_') ? selectedFile.value : null
  };

  // NEW — third argument wires real upload progress back from useActionCenter's XHR/TUS
  // upload paths into this ref, driving the progress bar in TaskCard.
  const success = await completeTask(taskId, payload, (pct) => {
    uploadProgress.value = pct;
  });

  isSubmitting.value = false;
  uploadProgress.value = null;

  if (success) {
    activeTaskId.value = null;
    clearFile();

    showCelebration.value = true;
    setTimeout(() => {
      showCelebration.value = false;
    }, 2000);
  } else {
    fileError.value = "Upload failed. Please try again or contact support.";
  }
};

// --- HELPERS (UI STYLING) ---
const getEventColor = (type: string) => {
  switch (type) {
    case 'shoot': return { text: 'text-emerald-400', dotBg: 'bg-emerald-950', innerBg: 'bg-emerald-500' }
    case 'meeting': return { text: 'text-indigo-400', dotBg: 'bg-indigo-950', innerBg: 'bg-indigo-500' }
    case 'launch': return { text: 'text-purple-400', dotBg: 'bg-purple-950', innerBg: 'bg-purple-500' }
    case 'deadline': return { text: 'text-rose-400', dotBg: 'bg-rose-950', innerBg: 'bg-rose-500' }
    default: return { text: 'text-slate-400', dotBg: 'bg-slate-900', innerBg: 'bg-slate-500' }
  }
};
</script>

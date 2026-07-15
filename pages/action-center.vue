<template>
  <div class="mx-auto w-full max-w-5xl px-4 py-8 pb-28 sm:px-6 lg:px-8 relative min-h-screen">
    
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-white">Action Center</h1>
        <p class="mt-2 text-sm text-slate-400">Complete your weekly deliverables to keep campaigns moving.</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-20">
      <Icon name="lucide:loader-2" class="animate-spin text-purple-500" size="48" />
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-8">
      
      <!-- Weekly Completion Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-slate-800 ring-1 ring-slate-700/50 flex flex-col md:flex-row items-center p-6 sm:p-8 gap-8 shadow-xl">
        <div class="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none"></div>
        <div class="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none"></div>
        
        <div class="relative shrink-0 mb-4 md:mb-0">
          <div class="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full"></div>
          <div class="relative z-10 flex h-28 w-28 items-center justify-center rounded-full bg-slate-900 ring-1 ring-emerald-500/50 shadow-2xl">
            <Icon name="lucide:check-circle" size="48" class="text-emerald-400" />
          </div>
          <!-- ADDED z-20 HERE -->
          <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
            Weekly Sprint
          </div>
        </div>

        <div class="flex-1 w-full z-10">
          <div class="flex items-end justify-between mb-2">
            <div>
              <p class="text-sm font-medium text-slate-400">Completion Rate</p>
              <p class="text-4xl font-black text-white mt-1">{{ completionRate }}<span class="text-xl text-emerald-500 ml-1">%</span></p>
            </div>
            <div class="text-right">
              <p class="text-xs text-slate-400">Task Velocity</p>
              <p class="text-sm font-bold text-emerald-400 flex items-center gap-1 justify-end mt-1">
                <Icon name="lucide:activity" size="14" />
                {{ sprintCompletedTasks.length }} of {{ sprintTasks.length }} Done
              </p>
            </div>
          </div>

          <div class="h-3 w-full overflow-hidden rounded-full bg-slate-900 ring-1 ring-inset ring-slate-700/50 relative">
            <div 
              class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 relative"
              :style="{ width: `${completionRate}%` }"
            >
              <div class="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
          <p class="text-xs font-medium text-slate-500 mt-3 text-right">
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
                  :class="['rounded-full px-4 py-1 text-xs font-medium transition-all', activeFilter === 'pending' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white']"
                >To Do ({{ sprintPendingTasks.length }})</button>
                <button 
                  @click="activeFilter = 'completed'"
                  :class="['rounded-full px-4 py-1 text-xs font-medium transition-all', activeFilter === 'completed' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white']"
                >Completed</button>
              </div>
            </div>

            <div class="space-y-4">
              <div 
                v-for="task in visibleSprintTasks" 
                :key="task.id"
                :class="[
                  'group relative overflow-hidden rounded-2xl p-5 ring-1 transition-all duration-300',
                  activeFilter === 'completed' ? 'bg-slate-800/20 ring-slate-700/30 opacity-70' :
                  activeTaskId === task.id ? 'bg-slate-800/80 ring-purple-500/50 shadow-lg shadow-purple-500/10' : 'bg-slate-800/40 ring-slate-700/50 hover:bg-slate-800/60 cursor-pointer'
                ]"
                @click="activeFilter === 'pending' && activeTaskId !== task.id ? toggleTask(task.id) : null"
              >
                <div v-if="activeTaskId === task.id" class="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>

                <div class="flex items-start gap-4">
                  <div :class="['flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 ring-1 ring-inset', task.computedStatus === 'completed' ? 'text-emerald-500 ring-emerald-500/30' : getTaskTypeStyles(task.type)]">
                    <Icon v-if="task.computedStatus === 'completed'" name="lucide:check" size="24" />
                    <Icon v-else :name="getTaskIcon(task.type)" size="24" />
                  </div>
                  
                  <div class="flex-1 pt-1">
                    <div class="flex flex-wrap items-center gap-2 mb-1">
                      <span v-if="task.isLate" class="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30">
                        Overdue
                      </span>
                      <span v-else-if="task.computedStatus === 'pending'" class="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30">
                        Active
                      </span>
                      <span v-else class="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400">
                        Done
                      </span>

                      <span :class="['text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md', getFrequencyStyles(task.frequency)]">
                        {{ task.frequency }}
                      </span>

                      <span v-if="task.dueDate && task.computedStatus === 'pending'" :class="['text-xs font-medium flex items-center gap-1', task.isLate ? 'text-rose-400' : 'text-slate-400']">
                        <Icon name="lucide:clock" size="12" /> Due {{ new Date(task.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) }}
                      </span>
                    </div>
                    <h3 :class="['text-base font-bold transition-colors', task.computedStatus === 'completed' ? 'text-slate-400 line-through' : 'text-white']">{{ task.title }}</h3>
                    <p class="text-sm text-slate-400 mt-1 line-clamp-2" v-if="activeTaskId !== task.id">{{ task.description }}</p>
                  </div>
                </div>

                <!-- TASK ACTION AREA -->
                <div 
                  v-show="activeTaskId === task.id && task.computedStatus === 'pending'" 
                  class="mt-6 pt-5 border-t border-slate-700/50 animate-in slide-in-from-top-2 fade-in duration-200 cursor-default"
                  @click.stop
                >
                  <p class="text-sm text-slate-300 mb-6">{{ task.description }}</p>
                  
                  <!-- VALIDATED UPLOAD UI -->
                  <div v-if="task.type.startsWith('upload_')" class="space-y-4">
                    
                    <!-- If a file is successfully staged -->
                    <div v-if="selectedFile" class="flex items-center justify-between rounded-xl bg-slate-900/80 p-4 ring-1 ring-purple-500/50">
                      <div class="flex items-center gap-3 overflow-hidden">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                          <Icon name="lucide:file-check" size="20" />
                        </div>
                        <div class="truncate">
                          <p class="text-sm font-medium text-white truncate">{{ selectedFile.name }}</p>
                          <p class="text-xs text-slate-400">{{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
                        </div>
                      </div>
                      <button @click="clearFile" class="p-2 text-slate-400 hover:text-rose-400 transition-colors">
                        <Icon name="lucide:trash-2" size="18" />
                      </button>
                    </div>

                    <!-- Dropzone (Hidden if file is staged) -->
                    <div 
                      v-else
                      @dragover.prevent="isDragging = true"
                      @dragleave.prevent="isDragging = false"
                      @drop.prevent="handleDrop($event, task.type)"
                      :class="[
                        'relative flex justify-center rounded-xl border border-dashed px-6 py-10 transition-colors cursor-pointer group/drop',
                        isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-slate-600 bg-slate-900/50 hover:bg-slate-900 hover:border-purple-500/50'
                      ]"
                    >
                      <!-- Hidden File Input -->
                      <input 
                        type="file" 
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        :accept="getAcceptType(task.type)"
                        @change="handleFileSelect($event, task.type)"
                      />
                      
                      <div class="text-center pointer-events-none">
                        <Icon :name="getTaskIcon(task.type)" size="32" class="mx-auto text-slate-500 group-hover/drop:text-purple-400 transition-colors" />
                        <div class="mt-4 flex text-sm leading-6 text-slate-400 justify-center">
                          <span class="font-semibold text-purple-400 group-hover/drop:text-purple-300">Upload a file</span>
                          <p class="pl-1">or drag and drop</p>
                        </div>
                        <p class="text-xs text-slate-500 mt-1">{{ getUploadRequirements(task.type) }}</p>
                      </div>
                    </div>

                    <!-- Error Message -->
                    <p v-if="fileError" class="text-sm text-rose-400 flex items-center gap-1.5 mt-2 animate-in fade-in">
                      <Icon name="lucide:alert-circle" size="14" /> {{ fileError }}
                    </p>
                  </div>

                  <!-- TEXT INPUT UI -->
                  <div v-if="task.type === 'text_input'" class="space-y-4">
                    <textarea 
                      v-model="taskInputData" rows="3" 
                      class="w-full rounded-xl border-0 bg-slate-900 py-3 px-4 text-sm text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500"
                      placeholder="Type your notes, links, or feedback here..."
                    ></textarea>
                  </div>

                  <div class="mt-6 flex justify-end gap-3">
                    <button @click="toggleTask(task.id)" class="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">Cancel</button>
                    <button 
                      @click="handleCompleteTask(task.id, task.type)"
                      :disabled="isSubmitting || (!selectedFile && task.type.startsWith('upload_'))"
                      class="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-purple-500 disabled:opacity-50 transition-all"
                    >
                      <Icon v-if="isSubmitting" name="lucide:loader-2" class="animate-spin" size="18" />
                      <Icon v-else name="lucide:check-circle-2" size="18" />
                      {{ task.type.startsWith('upload_') ? 'Upload & Complete' : 'Complete Task' }}
                    </button>
                  </div>
                </div>
              </div>
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
          <div v-if="!isLastWeekOfMonth && monthlyOutlookTasks.length > 0" class="mt-12 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-700/50 pb-4">
              <h2 class="text-base font-bold text-slate-300 flex items-center gap-2">
                <Icon name="lucide:calendar-check" size="18" class="text-amber-400" />
                Monthly Outlook
              </h2>
              <span class="text-xs text-slate-500">Enters sprint at end of month</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                v-for="task in monthlyOutlookTasks" 
                :key="task.id"
                class="rounded-xl bg-slate-800/20 p-4 ring-1 ring-slate-700/50 flex items-start gap-3 opacity-80"
              >
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 ring-1 ring-slate-700 text-slate-500">
                  <Icon :name="getTaskIcon(task.type)" size="20" />
                </div>
                <div>
                  <h4 class="text-sm font-bold text-slate-300 line-clamp-1">{{ task.title }}</h4>
                  <p class="text-xs text-slate-500 mt-0.5 line-clamp-2">{{ task.description }}</p>
                </div>
              </div>
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
const { tasks, events, isLastWeekOfMonth, completeTask, pending } = await useActionCenter(orgId.value);

// --- STATE ---
const activeFilter = ref<'pending' | 'completed'>('pending');
const activeTaskId = ref<string | null>(null);
const taskInputData = ref('');
const isSubmitting = ref(false);
const showCelebration = ref(false);

// Upload State
const isDragging = ref(false);
const selectedFile = ref<File | null>(null);
const fileError = ref<string>('');

// --- COMPUTED: Task Separation ---
// 1. Tasks belonging in the current Weekly Sprint
const sprintTasks = computed(() => tasks.value.filter(t => t.inSprint));
const sprintPendingTasks = computed(() => sprintTasks.value.filter(t => t.computedStatus === 'pending'));
const sprintCompletedTasks = computed(() => sprintTasks.value.filter(t => t.computedStatus === 'completed'));
const visibleSprintTasks = computed(() => activeFilter.value === 'pending' ? sprintPendingTasks.value : sprintCompletedTasks.value);

// 2. Monthly Tasks resting outside the sprint
const monthlyOutlookTasks = computed(() => tasks.value.filter(t => !t.inSprint && t.computedStatus === 'pending'));

const completionRate = computed(() => {
  const total = sprintTasks.value.length;
  if (total === 0) return 0;
  return Math.round((sprintCompletedTasks.value.length / total) * 100);
});

// --- ACTIONS ---
const toggleTask = (id: string) => {
  activeTaskId.value = activeTaskId.value === id ? null : id;
  taskInputData.value = ''; 
  clearFile(); // Reset file state when closing
};

// --- FILE VALIDATION & HANDLING ---
const getAcceptType = (type: string) => {
  if (type === 'upload_photo') return 'image/jpeg, image/png, image/webp';
  if (type === 'upload_video') return 'video/mp4, video/quicktime';
  if (type === 'upload_pdf') return 'application/pdf';
  return '*/*';
};

const getUploadRequirements = (type: string) => {
  if (type === 'upload_photo') return 'JPG, PNG up to 10MB';
  if (type === 'upload_video') return 'MP4, MOV up to 500MB';
  if (type === 'upload_pdf') return 'PDF up to 20MB';
  return '';
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

  // If no error, set the file!
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
  
  // Package the payload based on task type
  const payload = {
    text: taskType === 'text_input' ? taskInputData.value : undefined,
    file: taskType.startsWith('upload_') ? selectedFile.value : null
  };

  const success = await completeTask(taskId, payload);
  
  isSubmitting.value = false;
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
const getTaskIcon = (type: string) => {
  switch (type) {
    case 'upload_video': return 'lucide:film'
    case 'upload_photo': return 'lucide:camera'
    case 'upload_pdf': return 'lucide:file-text' 
    case 'text_input': return 'lucide:message-square-text'
    case 'checkbox': return 'lucide:check-square'
    default: return 'lucide:file-text'
  }
};

const getTaskTypeStyles = (type: string) => {
  switch (type) {
    case 'upload_video': return 'text-rose-400 ring-rose-500/30'
    case 'upload_photo': return 'text-emerald-400 ring-emerald-500/30'
    case 'upload_pdf': return 'text-amber-400 ring-amber-500/30' 
    case 'text_input': return 'text-cyan-400 ring-cyan-500/30'
    case 'checkbox': return 'text-purple-400 ring-purple-500/30'
    default: return 'text-slate-400 ring-slate-500/30'
  }
};

const getFrequencyStyles = (freq: string) => {
  switch (freq) {
    case 'once': return 'text-slate-400 bg-slate-800'
    case 'weekly': return 'text-purple-300 bg-purple-500/20'
    case 'monthly': return 'text-amber-300 bg-amber-500/20'
    default: return ''
  }
};

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

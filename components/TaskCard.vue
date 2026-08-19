<template>
  <div 
    :class="[
      'group relative overflow-hidden rounded-2xl p-5 ring-1 transition-all duration-300',
      isCompletedView ? 'bg-slate-800/20 ring-slate-700/30 opacity-70' :
      isActive ? 'bg-slate-800/80 ring-purple-500/50 shadow-lg shadow-purple-500/10' :
      muted ? 'bg-slate-800/20 ring-slate-700/40 hover:bg-slate-800/40 cursor-pointer' :
      'bg-slate-800/40 ring-slate-700/50 hover:bg-slate-800/60 cursor-pointer'
    ]"
    @click="!isCompletedView && !isActive ? $emit('toggle', task.id) : null"
  >
    <div v-if="isActive" class="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>

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
          <!-- CHANGED: muted tasks (Monthly Outlook, not yet in the urgent sprint) get a
               calmer "Get a head start" framing instead of "Active" — these aren't due yet,
               they're just no longer blocked from being done early. -->
          <span v-else-if="muted && task.computedStatus === 'pending'" class="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
            Get a head start
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
        <h3 :class="['text-base font-bold transition-colors', task.computedStatus === 'completed' ? 'text-slate-400 line-through' : muted ? 'text-slate-300' : 'text-white']">{{ task.title }}</h3>
        <p class="text-sm text-slate-400 mt-1 line-clamp-2" v-if="!isActive">{{ task.description }}</p>
      </div>
    </div>

    <!-- TASK ACTION AREA -->
    <div 
      v-show="isActive && task.computedStatus === 'pending'" 
      class="mt-6 pt-5 border-t border-slate-700/50 animate-in slide-in-from-top-2 fade-in duration-200 cursor-default"
      @click.stop
    >
      <p class="text-sm text-slate-300 mb-6">{{ task.description }}</p>

      <!-- VALIDATED UPLOAD UI -->
      <div v-if="task.type.startsWith('upload_')" class="space-y-4">

        <!-- NEW — real upload progress, replacing the previous spinner-only feedback.
             Wired from useActionCenter's XHR/TUS progress callback via the parent page. -->
        <div v-if="isSubmitting && uploadProgress !== null" class="rounded-xl bg-slate-900/80 p-4 ring-1 ring-purple-500/50 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-medium text-slate-300">Uploading...</span>
            <span class="font-bold text-purple-400">{{ uploadProgress }}%</span>
          </div>
          <div class="h-2 w-full overflow-hidden rounded-full bg-slate-800 ring-1 ring-inset ring-slate-700/50">
            <div class="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-300" :style="{ width: `${uploadProgress}%` }"></div>
          </div>
        </div>

        <!-- If a file is successfully staged (and not currently uploading) -->
        <div v-else-if="selectedFile" class="flex items-center justify-between rounded-xl bg-slate-900/80 p-4 ring-1 ring-purple-500/50">
          <div class="flex items-center gap-3 overflow-hidden">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
              <Icon name="lucide:file-check" size="20" />
            </div>
            <div class="truncate">
              <p class="text-sm font-medium text-white truncate">{{ selectedFile.name }}</p>
              <p class="text-xs text-slate-400">{{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
            </div>
          </div>
          <button @click="$emit('clear-file')" class="p-2 text-slate-400 hover:text-rose-400 transition-colors">
            <Icon name="lucide:trash-2" size="18" />
          </button>
        </div>

        <!-- Dropzone -->
        <div 
          v-else
          @dragover.prevent="$emit('dragover')"
          @dragleave.prevent="$emit('dragleave')"
          @drop.prevent="$emit('drop', $event, task.type)"
          :class="[
            'relative flex justify-center rounded-xl border border-dashed px-6 py-10 transition-colors cursor-pointer group/drop',
            isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-slate-600 bg-slate-900/50 hover:bg-slate-900 hover:border-purple-500/50'
          ]"
        >
          <input 
            type="file" 
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            :accept="getAcceptType(task.type)"
            @change="$emit('file-select', $event, task.type)"
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

        <p v-if="fileError" class="text-sm text-rose-400 flex items-center gap-1.5 mt-2 animate-in fade-in">
          <Icon name="lucide:alert-circle" size="14" /> {{ fileError }}
        </p>
      </div>

      <!-- TEXT INPUT UI -->
      <div v-if="task.type === 'text_input'" class="space-y-4">
        <textarea 
          :value="taskInputData"
          @input="$emit('update:task-input-data', ($event.target as HTMLTextAreaElement).value)"
          rows="3" 
          class="w-full rounded-xl border-0 bg-slate-900 py-3 px-4 text-sm text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500"
          placeholder="Type your notes, links, or feedback here..."
        ></textarea>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button @click="$emit('toggle', task.id)" class="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">Cancel</button>
        <button 
          @click="$emit('complete', task.id, task.type)"
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
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  task: any;
  isActive: boolean;
  isCompletedView: boolean;
  isSubmitting: boolean;
  uploadProgress: number | null;
  selectedFile: File | null;
  isDragging: boolean;
  fileError: string;
  taskInputData: string;
  muted?: boolean;
}>(), {
  muted: false,
});

defineEmits<{
  toggle: [id: string];
  drop: [event: DragEvent, taskType: string];
  'file-select': [event: Event, taskType: string];
  'clear-file': [];
  complete: [taskId: string, taskType: string];
  'update:task-input-data': [value: string];
  dragover: [];
  dragleave: [];
}>();

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
</script>

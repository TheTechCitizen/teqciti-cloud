<template>
  <div>
    <h2 class="text-lg font-semibold text-white">Select a Plan</h2>
    <div class="mt-4 grid grid-cols-2 gap-4">
      <button
        v-for="plan in plans"
        :key="plan.id"
        class="group text-left p-4 rounded-xl border-2 transition-all duration-300"
        :class="modelValue === plan.id 
          ? 'border-primary-500 bg-muted-800 ring-2 ring-primary-500/20' 
          : 'border-muted-700 hover:border-primary-500'"
        @click="$emit('update:modelValue', plan.id)"
      >
        <div class="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between h-full">
          <div class="flex items-center gap-x-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted-700/50">
              <img :src="plan.logo" :alt="plan.name" class="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div>
              <p class="font-semibold text-white">{{ plan.name }}</p>
              <p class="text-sm text-muted-400">{{ plan.description }}</p>
            </div>
          </div>
          <div 
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 mt-2 sm:mt-0"
            :class="modelValue === plan.id ? 'border-primary-500 bg-primary-500' : 'border-muted-600'"
          >
            <Icon v-if="modelValue === plan.id" name="lucide:check" class="size-4 text-white" />
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Plan } from '~/pages/service/[id].vue';

defineProps({
  plans: { type: Array as PropType<Plan[]>, required: true },
  modelValue: { type: String, required: true }, // The ID of the selected plan
});
defineEmits(['update:modelValue']);
</script>

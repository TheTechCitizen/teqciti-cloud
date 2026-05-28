<!-- FILE: components/StatusBadge.vue -->
<template>
  <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="statusClass">
    {{ status }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
});

const statusClass = computed(() => {
  switch (props.status.toLowerCase()) {
    case 'approved':
    case 'paid':
      return 'bg-green-500/10 text-green-400';
    case 'changes requested':
    case 'pending review':
      return 'bg-yellow-500/10 text-yellow-400';
    case 'past due':
      return 'bg-red-500/10 text-red-400';
    case 'active':
      return 'bg-blue-500/10 text-blue-400';
    default:
      return 'bg-slate-500/10 text-slate-400';
  }
});
</script>

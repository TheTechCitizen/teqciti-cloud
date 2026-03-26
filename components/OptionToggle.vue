<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-x-3">
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted-700/50">
        <Icon :name="icon" class="size-5 text-primary-400" />
      </div>
      <div>
        <p class="font-semibold text-white">{{ label }}</p>
        <p class="text-sm text-muted-400">{{ sublabel }}</p>
      </div>
    </div>
    <BaseSwitch v-model="model" color="primary" />
  </div>
</template>

<script setup lang="ts">
const model = defineModel<boolean>();

defineProps<{
  icon: string;
  label: string;
  sublabel: string;
}>();
</script>

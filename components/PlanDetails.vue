<template>
  <div v-if="plan" class="sticky top-24">
    <div class="text-center">
      <img :src="plan.logo" :alt="plan.name" class="mx-auto h-32 md:h-10" />
      <p class="mt-4 text-4xl font-bold text-white">
        ${{ billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly }}
        <span class="text-lg font-medium text-muted-400">/ month</span>
      </p>
      <p v-if="billingCycle === 'yearly'" class="text-sm font-semibold text-primary-400">
        Billed ${{ plan.priceYearly * 12 }} yearly
      </p>
    </div>
    <p class="mt-6 text-center text-muted-400">
      {{ plan.longDescription }}
    </p>
    <ul class="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
      <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-x-3 text-sm text-gray-200">
        <Icon name="lucide:check-circle-2" class="size-4 shrink-0 text-primary-400" />
        <span>{{ feature }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Plan } from '~/pages/service/[id].vue';

defineProps({
  plan: { type: Object as PropType<Plan | null> },
  billingCycle: { type: String as PropType<'monthly' | 'yearly'>, required: true },
});
</script>

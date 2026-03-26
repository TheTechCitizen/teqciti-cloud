<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div>
      <h1 class="font-sans text-3xl font-bold text-gray-800 dark:text-white">
        Services
      </h1>
      <p class="mt-2 font-sans text-gray-500 dark:text-gray-400">
        Explore and manage your available services and subscriptions.
      </p>
    </div>

    <!-- Responsive Grid of Service Cards -->
    <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      <TServicesServiceCardA
        v-for="service in sortedServices"
        :key="service.id"
        :service="service"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// --- Directus Collection Blueprint for later ---
// Collection: services
// Fields: title (string), description (text), image (file),
//         status (string: active, inactive, coming_soon),
//         team (M2M to directus_users)

// --- Type Definitions (Exported so child components can import them) ---
export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'active' | 'inactive' | 'coming_soon';
}

// --- Mock Data ---
const services = ref<Service[]>([
  {
    id: 's1',
    title: 'Project Management App',
    description: 'Centralize your team’s projects, tasks, and deadlines.',
    image: '/img/illustrations/1.png',
    status: 'active',
  },
  {
    id: 's2',
    title: 'UX Design App',
    description: 'Design, prototype, and collaborate on user interfaces.',
    image: '/img/illustrations/2.png',
    status: 'active',
  },
  {
    id: 's3',
    title: 'Music Player App',
    description: 'Stream and organize your entire music library.',
    image: '/img/illustrations/3.png',
    status: 'inactive',
  },
  {
    id: 's4',
    title: 'AI Analytics Suite',
    description: 'Harness the power of AI to analyze your business data.',
    image: '/img/illustrations/4.png',
    status: 'coming_soon',
  },
]);

// --- Sorting Logic ---
// A computed property to sort services, showing 'active' ones first.
const sortedServices = computed(() => {
  const statusOrder = { active: 1, inactive: 2, coming_soon: 3 };
  return [...services.value].sort((a, b) => {
    return statusOrder[a.status] - statusOrder[b.status];
  });
});

// --- Page Meta ---
definePageMeta({
  layout: 'sidebar',
});
</script>

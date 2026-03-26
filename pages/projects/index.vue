<template>
  <div class="bg-muted-100 dark:bg-muted-900 p-6 md:p-8">
    <!-- Page header -->
    <div class="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
        <BaseHeading as="h1" size="3xl" weight="semibold" class="text-muted-800 dark:text-white">
          <span>Projects</span>
        </BaseHeading>
        <p class="text-muted-500 dark:text-muted-400 font-sans text-lg">
          Browse and review all your completed and ongoing projects.
        </p>
      </div>

    <!-- NEW: Filters Section -->
    <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <BaseInput v-model="searchQuery" icon="lucide:search" placeholder="Search projects..." shape="rounded" />
      <BaseSelect v-model="selectedService" label="Filter by Service" shape="rounded">
        <option value="">All Services</option>
        <option v-for="service in allServices" :key="service" :value="service">{{ service }}</option>
      </BaseSelect>
      <BaseSelect v-model="selectedYear" label="Filter by Year" shape="rounded">
        <option value="">All Time</option>
        <option value="2025">2025</option>
        <option value="2024">2024</option>
      </BaseSelect>
    </div>
    </div>
     
   

    <!-- Projects Grid -->
       <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink v-for="project in filteredProjects" :key="project.id" :to="`/projects/${project.id}`">
        <BaseCard shape="rounded" class="group flex flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-muted-800/20">
          <img :src="project.thumbnail" :alt="project.name" class="h-48 w-full object-cover" />
          <div class="flex flex-1 flex-col p-6">
            <div class="flex items-center justify-between">
              <p class="text-xs text-muted-400">Created: {{ project.createdDate }}</p>
              <BaseTag :color="project.status === 'Complete' ? 'success' : 'primary'" flavor="pastel" shape="rounded">
                {{ project.status }}
              </BaseTag>
            </div>
            <h3 class="mt-2 font-sans text-lg font-semibold text-muted-800 dark:text-white">
              {{ project.name }}
            </h3>
            <!-- NEW: Service Tags -->
            <div class="mt-2 flex flex-wrap gap-2">
              <BaseTag v-for="service in project.services" :key="service" shape="rounded" color="muted" class="!text-xs">
                {{ service }}
              </BaseTag>
            </div>
            <div class="mt-auto pt-4 flex items-center justify-end opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span class="font-sans text-sm font-medium text-primary-500">View Project</span>
              <Icon name="lucide:arrow-right" class="ms-1 h-4 w-4 text-primary-500" />
            </div>
          </div>
        </BaseCard>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
 layout: 'sidebar'
})

import { ref, computed } from 'vue'

const allServices = ref(['Event Coverage', 'Livestream', 'Product Photography', 'Video Production', 'Social Media Management', 'Corporate Headshots'])
const searchQuery = ref('')
const selectedService = ref('')
const selectedYear = ref('')

const projects = ref([
  { id: 1, name: 'Innovate Inc. Brand Video', status: 'Complete', createdDate: '2025-09-10', thumbnail: '/img/illustrations/1.png', services: ['Video Production'] },
  { id: 2, name: 'Spring Gala Event', status: 'In Review', createdDate: '2025-10-22', thumbnail: '/img/illustrations/2.png', services: ['Event Coverage', 'Livestream'] },
  { id: 3, name: 'Ongoing Social Management', status: 'Active', createdDate: '2025-01-15', thumbnail: '/img/illustrations/6.png', services: ['Social Media Management'] },
  { id: 4, name: 'Q2 Product Launch', status: 'Complete', createdDate: '2025-05-30', thumbnail: '/img/illustrations/3.png', services: ['Product Photography', 'Video Production'] },
  { id: 5, name: 'Founders Headshots', status: 'Complete', createdDate: '2024-11-05', thumbnail: '/img/illustrations/5.png', services: ['Corporate Headshots'] },
])

const filteredProjects = computed(() => {
  let items = projects.value

  if (searchQuery.value) {
    items = items.filter((p) => p.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }
  if (selectedService.value) {
    items = items.filter((p) => p.services.includes(selectedService.value))
  }
  if (selectedYear.value) {
    items = items.filter((p) => p.createdDate.startsWith(selectedYear.value))
  }
  return items
})
</script>

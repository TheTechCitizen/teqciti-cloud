<template>
  <div v-if="project" class="bg-muted-100 dark:bg-muted-900 p-6 md:p-8">
    <!-- Header with breadcrumbs -->
    <div class="mb-8 max-w-5xl">
      <div class="flex items-center gap-2 text-sm text-muted-500 dark:text-muted-400">
        <NuxtLink to="/console/projects" class="hover:text-primary-500">Projects</NuxtLink>
        <Icon name="lucide:chevron-right" class="h-4 w-4" />
        <span class="font-medium text-muted-800 dark:text-muted-100">{{ project.name }}</span>
      </div>
      <BaseHeading as="h1" size="3xl" weight="semibold" class="mt-2 text-muted-800 dark:text-white">
        {{ project.name }}
      </BaseHeading>
    </div>

    <!-- Main content grid -->
    <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12">
      <!-- Media Viewer (Left Column) -->
      <div class="lg:col-span-8">
        <!-- CORRECTED: Using BaseTabSlider for consistency -->
        <div class="max-w-sm">
          <BaseTabSlider
            v-model="activeMediaTab"
            :tabs="[
              { label: 'Photos', value: 'photos' },
              { label: 'Videos', value: 'videos' },
            ]"
          />
        </div>

        <!-- Conditional content based on activeMediaTab -->
        <div class="mt-6">
          <!-- Photos Content -->
          <div v-if="activeMediaTab === 'photos'">
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              <img
                v-for="photo in project.media.photos"
                :key="photo.id"
                :src="photo.url"
                alt="Project Photo"
                class="aspect-square w-full cursor-pointer rounded-lg object-cover transition-all duration-300 hover:brightness-75"
              />
            </div>
            <p v-if="!project.media.photos.length" class="mt-4 text-center text-muted-400">
              No photos available for this project.
            </p>
          </div>

          <!-- Videos Content -->
          <div v-if="activeMediaTab === 'videos'">
            <div class="space-y-6">
              <div v-for="video in project.media.videos" :key="video.id">
                <h4 class="mb-2 font-sans font-medium text-muted-800 dark:text-white">{{ video.title }}</h4>
                <div class="aspect-video overflow-hidden rounded-lg">
                  <video :src="video.url" controls class="h-full w-full bg-muted-200 dark:bg-muted-800"></video>
                </div>
              </div>
            </div>
            <p v-if="!project.media.videos.length" class="mt-4 text-center text-muted-400">
              No videos available for this project.
            </p>
          </div>
        </div>
      </div>

      <!-- Details & Hubs (Right Column) - No Changes -->
      <div class="lg:col-span-4">
        <div class="sticky top-24 flex flex-col gap-6">
          <!-- Project Details Card -->
          <BaseCard shape="rounded" class="p-6">
            <h3 class="mb-4 font-sans text-lg font-semibold text-muted-800 dark:text-white">Project Details</h3>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-sm text-muted-500 dark:text-muted-400">Client</span>
                <span class="font-sans text-sm font-medium text-muted-800 dark:text-muted-100">{{ project.client }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-muted-500 dark:text-muted-400">Date</span>
                <span class="font-sans text-sm font-medium text-muted-800 dark:text-muted-100">{{ project.createdDate }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-muted-500 dark:text-muted-400">Status</span>
                <BaseTag :color="project.status === 'Complete' ? 'success' : 'primary'" flavor="pastel" shape="rounded">
                  {{ project.status }}
                </BaseTag>
              </div>
            </div>
            <div class="my-6 border-t border-muted-200 dark:border-muted-700"></div>
            <BaseButton color="primary" shape="rounded" class="w-full">
              <Icon name="lucide:download" class="h-4 w-4" />
              <span>Download All (.zip)</span>
            </BaseButton>
          </BaseCard>

          <!-- Conditional Social Media Hub Card -->
          <BaseCard
            v-if="project.services.includes('Social Media Management')"
            shape="rounded"
            class="p-6"
          >
            <div class="flex items-center gap-3">
              <BaseIconBox shape="rounded" size="md" class="bg-primary-500/20 text-primary-500">
                <Icon name="lucide:share-2" class="h-5 w-5" />
              </BaseIconBox>
              <h3 class="font-sans text-lg font-semibold text-muted-800 dark:text-white">Social Media Hub</h3>
            </div>
            <p class="mt-3 text-sm text-muted-500 dark:text-muted-400">
              Access the content plan, schedule, and reports for this project.
            </p>
            <BaseButton
              :to="`/console/projects/socials/${project.id}`"
              tag="NuxtLink"
              color="primary"
              flavor="outline"
              shape="rounded"
              class="mt-4 w-full"
            >
              <span>Open Dashboard</span>
              <Icon name="lucide:arrow-right" class="h-4 w-4" />
            </BaseButton>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex h-screen items-center justify-center p-6 md:p-8">
    <BasePlaceholderPage title="Project not found" subtitle="The project you are looking for does not exist or you do not have permission to view it." />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
 layout: 'sidebar'
})

import { ref } from 'vue'
import { useRoute } from 'vue-router'

// NEW: Add a ref to manage the state of the media tab slider
const activeMediaTab = ref('photos')

const allProjects = ref([
  { id: '1', name: 'Innovate Inc. Brand Video', client: 'Innovate Inc.', status: 'Complete', createdDate: '2025-09-10', services: ['Video Production'], media: { photos: [], videos: [{ id: 1, title: 'Final Brand Video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' }] } },
  { id: '2', name: 'Spring Gala Event', client: 'Innovate Inc.', status: 'In Review', createdDate: '2025-10-22', services: ['Event Coverage', 'Livestream'], media: { photos: [{ id: 1, url: '/img/illustrations/1.png' }, { id: 2, url: '/img/illustrations/2.png' }], videos: [] } },
  { id: '3', name: 'Ongoing Social Management', client: 'Innovate Inc.', status: 'Active', createdDate: '2025-01-15', services: ['Social Media Management'], media: { photos: [], videos: [] } },
  { id: '4', name: 'Q2 Product Launch', client: 'Innovate Inc.', status: 'Complete', createdDate: '2025-05-30', services: ['Product Photography', 'Video Production'], media: { photos: [{ id: 3, url: '/img/illustrations/3.png' }], videos: [] } },
  { id: '5', name: 'Founders Headshots', client: 'Innovate Inc.', status: 'Complete', createdDate: '2024-11-05', services: ['Corporate Headshots'], media: { photos: [{ id: 4, url: '/img/illustrations/4.png' }], videos: [] } },
])

const route = useRoute()
const projectId = route.params.id as string // Ensure projectId is a string
const project = ref(allProjects.value.find((p) => p.id === projectId))
</script>

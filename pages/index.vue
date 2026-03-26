<template>
  <!-- Main content area with a dark background -->
  <div class="bg-muted-100 dark:bg-muted-900 p-6 md:p-8">
    <!-- Page header -->
    <div class="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div class="flex items-center gap-4">
        <BaseAvatar
          src="/img/illustrations/10.png"
          size="lg"
          shape="full"
          class="bg-primary-500/20 text-primary-500"
        />
        <div>
          <BaseHeading as="h1" size="3xl" weight="semibold" class="text-muted-800 dark:text-white">
            <span>Welcome, {{ client.name }}</span>
          </BaseHeading>
          <p class="text-muted-500 dark:text-muted-400 font-sans text-lg">
            Let's check in on your projects.
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <BaseButton color="primary" shape="rounded" class="h-10 w-full md:w-auto">
          <Icon name="lucide:plus" class="h-4 w-4" />
          <span>Book a New Service</span>
        </BaseButton>
      </div>
    </div>

    <!-- Dashboard grid -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <!-- Recent Projects -->
      <div class="flex flex-col gap-6 xl:col-span-2">
        <BaseCard class="p-6">
          <div class="mb-6 flex items-center justify-between">
            <BaseHeading as="h3" size="lg" weight="medium" class="text-muted-800 dark:text-white">
              <span>Recent Projects</span>
            </BaseHeading>
            <BaseButton flavor="text" shape="rounded" color="primary">
              <span>View All</span>
              <Icon name="lucide:arrow-right" class="h-4 w-4" />
            </BaseButton>
          </div>
          <!-- Projects Grid -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <BaseCard
              v-for="project in recentProjects"
              :key="project.id"
              shape="rounded"
              class="p-5"
            >
              <div class="mb-3 flex items-center gap-2">
                <BaseAvatar :src="project.thumbnail" rounded="md" size="sm" />
                <div>
                  <h4 class="font-sans text-sm font-semibold text-muted-800 dark:text-white">
                    {{ project.name }}
                  </h4>
                </div>
              </div>
              <!-- UPDATED: Service tags added here -->
              <div class="mb-4 flex flex-wrap gap-1">
                <BaseTag
                  v-for="service in project.services"
                  :key="service"
                  shape="full"
                  color="muted"
                  class="!text-[10px] !font-semibold uppercase"
                >
                  {{ service }}
                </BaseTag>
              </div>
              <div class="mt-auto">
                <div class="mb-1 flex items-end justify-between">
                  <span class="font-sans text-xs text-muted-400">Progress</span>
                  <span class="font-sans text-xs font-semibold text-primary-500">
                    {{ project.progress }}%
                  </span>
                </div>
                <BaseProgress :value="project.progress" size="xs" color="primary" />
              </div>
            </BaseCard>
          </div>
        </BaseCard>

        <!-- Pending Invoices (Table-like card) -->
        <BaseCard class="p-6">
          <div class="mb-4 flex items-center justify-between">
            <BaseHeading as="h3" size="lg" weight="medium" class="text-muted-800 dark:text-white">
              <span>Pending Invoices</span>
            </BaseHeading>
          </div>
          <div class="space-y-5">
            <!-- Invoice Row -->
            <div
              v-for="invoice in pendingInvoices"
              :key="invoice.id"
              class="flex items-center"
            >
              <BaseIconBox shape="rounded" size="sm" class="bg-muted-100 text-muted-500 dark:bg-muted-800 dark:text-muted-200">
                <Icon name="lucide:file-text" class="h-5 w-5" />
              </BaseIconBox>
              <div class="ms-3">
                <p class="font-sans font-medium text-muted-800 dark:text-muted-100">{{ invoice.id }}</p>
              </div>
              <div class="ms-auto flex items-center gap-4">
                <p class="text-sm text-muted-500 dark:text-muted-400">{{ invoice.dueDate }}</p>
                <p class="font-sans font-semibold text-muted-800 dark:text-muted-100">{{ invoice.amount }}</p>
                <BaseButtonIcon shape="rounded" size="sm" class="text-muted-400">
                  <Icon name="lucide:arrow-right" class="h-4 w-4" />
                </BaseButtonIcon>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Right Column -->
      <div class="flex flex-col gap-6">
        <!-- Quick Stats -->
        <BaseCard class="p-6">
          <div class="mb-4">
            <BaseHeading as="h3" size="lg" weight="medium" class="text-muted-800 dark:text-white">
              <span>Quick Stats</span>
            </BaseHeading>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="stat in quickStats"
              :key="stat.label"
              class="bg-muted-100 dark:bg-muted-800 rounded-lg p-4 text-center"
            >
              <BaseIconBox :class="stat.color" size="md" shape="full" class="mx-auto !h-14 !w-14">
                <Icon :name="stat.icon" class="h-6 w-6" />
              </BaseIconBox>
              <p class="mt-2 font-sans text-xl font-bold text-muted-800 dark:text-white">
                {{ stat.value }}
              </p>
              <p class="text-xs text-muted-400">{{ stat.label }}</p>
            </div>
          </div>
        </BaseCard>

        <!-- Active Services -->
        <BaseCard class="p-6">
          <div class="mb-4">
            <BaseHeading as="h3" size="lg" weight="medium" class="text-muted-800 dark:text-white">
              <span>Active Services</span>
            </BaseHeading>
          </div>
          <div class="space-y-4">
            <div
              v-for="service in activeServices"
              :key="service.id"
              class="flex items-center gap-3"
            >
              <BaseIconBox
                shape="rounded"
                size="sm"
                class="bg-primary-500/20 text-primary-500"
              >
                <Icon :name="service.icon" class="h-4 w-4" />
              </BaseIconBox>
              <div>
                <p class="font-sans text-sm font-medium text-muted-800 dark:text-muted-100">
                  {{ service.name }}
                </p>
              </div>
              <div class="ms-auto">
                <BaseTag color="success" flavor="pastel" shape="rounded">Active</BaseTag>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
 layout: 'sidebar'
})

import { ref } from 'vue'

// ... client, quickStats, pendingInvoices, activeServices data ...
const client = ref({ name: 'Innovate Inc.' })

const quickStats = ref([
  {
    label: 'Projects in Progress',
    value: 2,
    icon: 'lucide:layers',
    color: 'text-primary-500 bg-primary-500/20',
  },
  {
    label: 'Media Delivered',
    value: 124,
    icon: 'lucide:image',
    color: 'text-lime-500 bg-lime-500/20',
  },
  {
    label: 'Pending Invoices',
    value: 2,
    icon: 'lucide:file-text',
    color: 'text-amber-500 bg-amber-500/20',
  },
  {
    label: 'Active Services',
    value: 2,
    icon: 'lucide:sparkles',
    color: 'text-sky-500 bg-sky-500/20',
  },
])


// UPDATED: recentProjects now includes a 'services' array
const recentProjects = ref([
  {
    id: 3,
    name: 'Ongoing Social Management',
    thumbnail: '/img/illustrations/6.png',
    progress: 95,
    services: ['Social Media Management'],
  },
  {
    id: 2,
    name: 'Spring Gala Event',
    thumbnail: '/img/illustrations/2.png',
    progress: 75,
    services: ['Event Coverage', 'Livestream'],
  },
])

// ... other mock data ...
const pendingInvoices = ref([
  { id: 'INV-0452', dueDate: 'Due Nov 28', amount: '$2,500.00' },
  { id: 'INV-0451', dueDate: 'Due Dec 05', amount: '$1,200.00' },
])

const activeServices = ref([
  { id: 1, name: 'Social Media Management', icon: 'lucide:share-2' },
  { id: 2, name: 'Content Retainer', icon: 'lucide:camera' },
])

</script>

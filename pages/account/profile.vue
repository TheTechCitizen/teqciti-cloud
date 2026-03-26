<template>
  <div class="bg-muted-100 dark:bg-muted-900 p-6 md:p-8">
    <!-- Page header -->
    <div class="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <BaseHeading as="h1" size="3xl" weight="semibold" class="text-muted-800 dark:text-white">
          <span>Client Profile</span>
        </BaseHeading>
        <p class="text-muted-500 dark:text-muted-400 font-sans text-lg">
          Here is the information we have on file for your account.
        </p>
      </div>
      <BaseButton flavor="outline" color="muted" shape="rounded">
        <Icon name="lucide:edit-3" class="h-4 w-4" />
        <span>Request Update</span>
      </BaseButton>
    </div>

    <!-- Profile Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Left Column (Main Details) -->
      <div class="flex flex-col gap-6 lg:col-span-2">
        <!-- Company Info Card -->
        <BaseCard shape="rounded" class="p-6">
          <div class="flex items-center gap-4">
            <BaseAvatar
              :src="client.logo"
              size="xl"
              shape="rounded"
              class="bg-muted-100 dark:bg-muted-700"
            />
            <div>
              <h2 class="font-sans text-2xl font-semibold text-muted-800 dark:text-white">
                {{ client.name }}
              </h2>
              <p class="text-sm text-muted-500 dark:text-muted-400">
                {{ client.industry }}
              </p>
            </div>
          </div>
          <div class="my-6 border-t border-muted-200 dark:border-muted-700"></div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="flex items-center gap-3">
              <BaseIconBox shape="rounded" class="bg-muted-100 dark:bg-muted-700">
                <Icon name="lucide:map-pin" class="h-5 w-5 text-muted-500" />
              </BaseIconBox>
              <div>
                <p class="text-xs text-muted-400">Location</p>
                <p class="font-sans font-medium text-muted-800 dark:text-muted-100">
                  {{ client.location }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <BaseIconBox shape="rounded" class="bg-muted-100 dark:bg-muted-700">
                <Icon name="lucide:users" class="h-5 w-5 text-muted-500" />
              </BaseIconBox>
              <div>
                <p class="text-xs text-muted-400">Employees</p>
                <p class="font-sans font-medium text-muted-800 dark:text-muted-100">
                  {{ client.employees }}
                </p>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Active Services Card -->
        <BaseCard shape="rounded" class="p-6">
          <h3 class="mb-4 font-sans text-lg font-semibold text-muted-800 dark:text-white">
            Services
          </h3>
          <div class="space-y-4">
            <div
              v-for="service in client.services"
              :key="service.id"
              class="flex items-center"
            >
              <BaseIconBox
                shape="rounded"
                size="sm"
                class="bg-primary-500/20 text-primary-500"
              >
                <Icon :name="service.icon" class="h-4 w-4" />
              </BaseIconBox>
              <div class="ms-3">
                <p class="font-sans font-medium text-muted-800 dark:text-muted-100">
                  {{ service.name }}
                </p>
                <p class="text-xs text-muted-400">{{ service.dateRange }}</p>
              </div>
              <div class="ms-auto">
                <BaseTag
                  :color="service.status === 'Active' ? 'success' : 'muted'"
                  flavor="pastel"
                  shape="rounded"
                >
                  {{ service.status }}
                </BaseTag>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Right Column (Contact & Billing) -->
      <div class="flex flex-col gap-6 lg:col-span-1">
        <!-- Primary Contact Card -->
        <BaseCard shape="rounded" class="p-6">
          <h3 class="mb-4 font-sans text-lg font-semibold text-muted-800 dark:text-white">
            Primary Contact
          </h3>
          <div class="flex items-center gap-3">
            <BaseAvatar :src="client.primaryContact.avatar" size="md" />
            <div>
              <p class="font-sans font-medium text-muted-800 dark:text-muted-100">
                {{ client.primaryContact.name }}
              </p>
              <p class="text-xs text-muted-400">
                {{ client.primaryContact.title }}
              </p>
            </div>
          </div>
          <div class="my-4 space-y-3">
            <div class="flex items-center gap-2 text-sm text-muted-500 dark:text-muted-400">
              <Icon name="lucide:mail" class="h-4 w-4" />
              <span>{{ client.primaryContact.email }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-muted-500 dark:text-muted-400">
              <Icon name="lucide:phone" class="h-4 w-4" />
              <span>{{ client.primaryContact.phone }}</span>
            </div>
          </div>
        </BaseCard>

        <!-- Billing Address Card -->
        <BaseCard shape="rounded" class="p-6">
          <h3 class="mb-4 font-sans text-lg font-semibold text-muted-800 dark:text-white">
            Billing Address
          </h3>
          <address class="text-sm not-italic text-muted-500 dark:text-muted-400">
            {{ client.billingAddress.street }}<br />
            {{ client.billingAddress.city }}, {{ client.billingAddress.state }}
            {{ client.billingAddress.zip }}<br />
            {{ client.billingAddress.country }}
          </address>
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

// Mock data for the client profile
const client = ref({
  name: 'Innovate Inc.',
  logo: '/img/illustrations/10.png',
  industry: 'Technology & SaaS',
  location: 'San Francisco, CA',
  employees: '50-100',
  primaryContact: {
    name: 'Kendra Williams',
    title: 'Marketing Director',
    avatar: '/img/illustrations/5.png',
    email: 'kendra.w@innovate.io',
    phone: '(555) 123-4567',
  },
  billingAddress: {
    street: '123 Tech Avenue',
    city: 'Palo Alto',
    state: 'CA',
    zip: '94301',
    country: 'USA',
  },
  services: [
    {
      id: 1,
      name: 'Social Media Management',
      icon: 'lucide:share-2',
      dateRange: 'Jan 2025 - Present',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Content Retainer',
      icon: 'lucide:camera',
      dateRange: 'Mar 2025 - Present',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Brand Video Production',
      icon: 'lucide:video',
      dateRange: 'Sep 2025 - Oct 2025',
      status: 'Complete',
    },
  ],
})
</script>

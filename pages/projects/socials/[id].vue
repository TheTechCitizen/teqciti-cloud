<template>
      <div class="bg-muted-100 dark:bg-muted-900 p-6 md:p-8">
    <!-- NEW: Contextual Header -->
    <div class="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <p class="mb-1 text-sm text-muted-500 dark:text-muted-400">
          Social Media Management for:
        </p>
        <BaseHeading as="h1" size="3xl" weight="semibold" class="text-muted-800 dark:text-white">
          <span>{{ project.name }}</span>
        </BaseHeading>
      </div>
      <BaseButton color="primary" shape="rounded" :to="`/console/projects/socials/reports/${projectId}`" tag="NuxtLink">
        <Icon name="lucide:bar-chart-3" class="h-4 w-4" />
        <span>View Reports</span>
      </BaseButton>
    </div>

    <!-- BaseTabSlider implementation -->
    <div class="max-w-sm">
      <BaseTabSlider
        v-model="activeTab"
        :tabs="[
          { label: 'Content Plan', value: 'plan' },
          { label: 'Content Schedule', value: 'schedule' },
          { label: 'Idea Board', value: 'ideas' },
        ]"
      />
    </div>

    <!-- Conditional content based on activeTab -->
    <div class="mt-6">
      <!-- 1. Content Plan -->
      <div v-if="activeTab === 'plan'">
        <div class="space-y-2">
          <!-- Header Row -->
          <div class="hidden items-center px-4 py-2 md:flex">
            <div class="w-1/4 font-sans text-xs font-semibold uppercase text-muted-400">Date</div>
            <div class="w-1/2 font-sans text-xs font-semibold uppercase text-muted-400">Task</div>
            <div class="w-1/4 font-sans text-xs font-semibold uppercase text-muted-400">Status</div>
          </div>
          <!-- Plan Items -->
          <div
            v-for="item in contentPlanItems"
            :key="item.id"
            class="flex flex-col rounded-lg border border-muted-200 bg-white p-4 transition-colors duration-300 hover:bg-muted-50 dark:border-muted-700 dark:bg-muted-800 dark:hover:bg-muted-700/50 md:flex-row md:items-center"
          >
            <div class="flex w-full items-center gap-2 md:w-1/4">
              <Icon name="lucide:calendar" class="h-4 w-4 text-muted-400" />
              <span class="font-sans text-sm font-medium text-muted-600 dark:text-muted-300">{{ item.date }}</span>
            </div>
            <div class="w-full py-2 md:w-1/2 md:py-0">
              <p class="font-sans font-medium text-muted-800 dark:text-muted-100">{{ item.task }}</p>
              <p class="text-xs text-muted-500 dark:text-muted-400">
                <span class="font-semibold">{{ item.assignedTo }}:</span> {{ item.description }}
              </p>
            </div>
            <div class="w-full md:w-1/4">
              <BaseTag :color="getStatusColor(item.status)" flavor="pastel" shape="rounded">{{ item.status }}</BaseTag>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Content Schedule -->
      <div v-if="activeTab === 'schedule'">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <BaseCard
            v-for="post in scheduledPosts"
            :key="post.id"
            shape="rounded"
            class="p-4"
            :class="{ 'ring-2 ring-danger-500': post.status === 'Needs Changes' }"
          >
            <div class="mb-3 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon :name="post.platformIcon" class="h-5 w-5" :class="post.platformColor" />
                <span class="font-sans text-xs text-muted-400">{{ post.scheduledDate }}</span>
              </div>
              <BaseTag v-if="post.status === 'Needs Changes'" color="danger" flavor="pastel" shape="rounded">Flagged</BaseTag>
            </div>
            <img :src="post.mediaUrl" alt="Social Media Post" class="mb-3 rounded-lg object-cover" />
            <p class="font-sans text-sm text-muted-600 dark:text-muted-300 line-clamp-3">{{ post.caption }}</p>
            <BaseButton flavor="outline" shape="rounded" color="muted" class="mt-4 w-full">
              <Icon name="lucide:flag" class="h-4 w-4" />
              <span>Request Changes</span>
            </BaseButton>
          </BaseCard>
        </div>
      </div>

      <!-- 3. Idea Board -->
      <div v-if="activeTab === 'ideas'">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <!-- Columns for Idea Board -->
          <div class="flex flex-col gap-4">
            <BaseHeading size="md" weight="medium" class="text-muted-800 dark:text-white">New Ideas</BaseHeading>
            <BaseCard v-for="idea in ideasByStatus('New')" :key="idea.id" class="p-4">
              <h4 class="font-sans font-semibold text-muted-800 dark:text-white">{{ idea.title }}</h4>
              <p class="text-sm text-muted-500 dark:text-muted-400">{{ idea.description }}</p>
            </BaseCard>
          </div>
          <div class="flex flex-col gap-4">
            <BaseHeading size="md" weight="medium" class="text-muted-800 dark:text-white">Under Review</BaseHeading>
            <BaseCard v-for="idea in ideasByStatus('Reviewing')" :key="idea.id" class="p-4">
              <h4 class="font-sans font-semibold text-muted-800 dark:text-white">{{ idea.title }}</h4>
              <p class="text-sm text-muted-500 dark:text-muted-400">{{ idea.description }}</p>
              <div v-if="idea.feedback" class="mt-3 border-t border-muted-200 pt-3 dark:border-muted-700">
                <div class="flex items-center gap-2">
                  <BaseAvatar src="/img/illustrations/10.png" size="xxs" />
                  <p class="text-xs font-semibold text-primary-500">Agency Feedback</p>
                </div>
                <p class="mt-1 text-xs italic text-muted-500 dark:text-muted-400">"{{ idea.feedback }}"</p>
              </div>
            </BaseCard>
          </div>
          <div class="flex flex-col gap-4">
            <BaseHeading size="md" weight="medium" class="text-muted-800 dark:text-white">Planned</BaseHeading>
            <BaseCard v-for="idea in ideasByStatus('Planned')" :key="idea.id" class="p-4">
              <div class="flex items-center gap-2">
                <Icon name="lucide:check-circle-2" class="h-4 w-4 text-success-500" />
                <h4 class="font-sans font-semibold text-muted-800 dark:text-white">{{ idea.title }}</h4>
              </div>
              <p class="mt-1 text-sm text-muted-500 dark:text-muted-400">{{ idea.description }}</p>
              <p class="mt-2 text-xs font-semibold text-muted-400">Scheduled for: {{ idea.scheduledFor }}</p>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for adding a new idea (no changes) -->
    <BaseModal :open="isIdeaModalOpen" size="sm" @close="isIdeaModalOpen = false">
       <template #header>
        <BaseHeading as="h3" size="md" weight="medium" class="text-muted-800 dark:text-white">Submit a Content Idea</BaseHeading>
      </template>
      <div class="space-y-4">
        <BaseInput v-model="newIdea.title" label="Idea Title" placeholder="e.g., Behind the Scenes video" shape="rounded" />
        <BaseTextarea v-model="newIdea.description" label="Description" placeholder="Describe your content idea in more detail..." shape="rounded" />
      </div>
      <template #footer>
        <BaseButton @click="isIdeaModalOpen = false" shape="rounded">Cancel</BaseButton>
        <BaseButton color="primary" @click="submitIdea" shape="rounded">Submit Idea</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
 layout: 'sidebar'
})

import { ref } from 'vue'
import { useRoute } from 'vue-router';

// Get the project ID from the URL (e.g., the '3' from '/social/3')
const route = useRoute();
const projectId = route.params.id;

// Mock fetching the project name based on the ID
const project = ref({
  name: 'Ongoing Social Management',
});

// The 'activeTab' ref is now used to control the BaseTabSlider
const activeTab = ref('plan')
const isIdeaModalOpen = ref(false)

// All mock data and helper functions remain exactly the same.
const contentPlanItems = ref([
  { id: 1, date: 'Nov 18', task: 'Finalize Carousel Graphics', description: 'Provide final approval on the 5 graphics for the product launch carousel.', assignedTo: 'Client', status: 'Done' },
  { id: 2, date: 'Nov 20', task: 'Shoot B-Roll for Reel', description: 'Our team will be on-site to capture footage for the upcoming reel.', assignedTo: 'Our Team', status: 'Done' },
  { id: 3, date: 'Nov 22', task: 'Provide Testimonial Clip', description: 'Please send over the self-recorded testimonial clip from your CEO.', assignedTo: 'Client', status: 'Pending' },
  { id: 4, date: 'Nov 25', task: 'Review Draft of Reel', description: 'First version of the event reel will be ready for your feedback.', assignedTo: 'Our Team', status: 'Upcoming' },
])

const scheduledPosts = ref([
  { id: 1, platformIcon: 'lucide:instagram', platformColor: 'text-pink-500', scheduledDate: 'Nov 27, 2:00 PM', mediaUrl: '/img/illustrations/7.png', caption: 'Big things are coming! We\'re excited to unveil our latest project next week. Stay tuned for more details. #Innovation #Launch', status: 'Scheduled' },
  { id: 2, platformIcon: 'lucide:facebook', platformColor: 'text-blue-500', scheduledDate: 'Nov 28, 9:00 AM', mediaUrl: '/img/illustrations/8.png', caption: 'A huge thank you to everyone who attended the Spring Gala! It was a night to remember. Check out the full photo album on our website.', status: 'Needs Changes' },
  { id: 3, platformIcon: 'lucide:linkedin', platformColor: 'text-sky-600', scheduledDate: 'Nov 29, 11:00 AM', mediaUrl: '/img/illustrations/9.png', caption: 'We are proud to announce our new partnership with Acme Corp, a leader in the industry. Together, we aim to push the boundaries of technology and deliver exceptional value to our customers.', status: 'Scheduled' },
])

const ideaNotes = ref([
  { id: 1, title: 'AMA with CEO', description: 'An "Ask Me Anything" session with our CEO on Instagram Live?', status: 'New' },
  { id: 2, title: 'Behind the Scenes', description: 'A look at how we manufacture our products.', status: 'Reviewing', feedback: 'Great idea! We think this would be perfect for a short-form reel. We\'re scoping out the logistics now.' },
  { id: 3, title: 'Employee Spotlight', description: 'Feature a long-term employee and tell their story.', status: 'Planned', scheduledFor: 'December' },
  { id: 4, title: 'Customer Testimonial Video', description: 'Create a polished video from a happy customer.', status: 'Reviewing' },
  { id: 5, title: 'Holiday Giveaway', description: 'Run a contest or giveaway for the holiday season.', status: 'New' },
])

const ideasByStatus = (status: 'New' | 'Reviewing' | 'Planned') => ideaNotes.value.filter((idea) => idea.status === status)
const newIdea = ref({ title: '', description: '' })

const submitIdea = () => {
  if (newIdea.value.title && newIdea.value.description) {
    ideaNotes.value.unshift({ id: Math.random(), title: newIdea.value.title, description: newIdea.value.description, status: 'New' })
    newIdea.value = { title: '', description: '' }
    isIdeaModalOpen.value = false
  }
}
const getStatusColor = (status: string) => {
  if (status === 'Done') return 'success'
  if (status === 'Pending') return 'warning'
  if (status === 'Blocked') return 'danger'
  return 'muted'
}
</script>

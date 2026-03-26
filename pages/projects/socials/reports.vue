<template>
  <div class="bg-muted-100 dark:bg-muted-900 p-6 md:p-8">
      <!-- NEW: Contextual Header with Breadcrumbs -->
    <div class="mb-8">
      <div class="flex items-center gap-2 text-sm text-muted-500 dark:text-muted-400">
        <NuxtLink :to="`/projects/${projectId}`" class="hover:text-primary-500">
          Projects
        </NuxtLink>
        <Icon name="lucide:chevron-right" class="h-4 w-4" />
        <span class="font-medium text-muted-800 dark:text-muted-100">
          Reports for {{ project.name }}
        </span>
      </div>
    </div>
    <!-- Page header -->
    <div class="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <BaseHeading as="h1" size="3xl" weight="semibold" class="text-muted-800 dark:text-white">
          <span>Social Media Reports</span>
        </BaseHeading>
        <p class="text-muted-500 dark:text-muted-400 font-sans text-lg">
          Here's your performance summary for the selected period.
        </p>
      </div>
      <div class="w-full md:w-56">
        <BaseSelect v-model="selectedPeriod" label="Time Period" shape="rounded">
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="year">This Year</option>
        </BaseSelect>
      </div>
    </div>

    <!-- KPI Grid (No changes here) -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <BaseCard v-for="kpi in kpiData" :key="kpi.label" shape="rounded" class="p-6">
        <div class="flex items-center gap-3">
          <BaseIconBox :class="kpi.color" size="md" shape="full">
            <Icon :name="kpi.icon" class="h-6 w-6" />
          </BaseIconBox>
          <div>
            <p class="font-sans text-sm text-muted-500 dark:text-muted-400">{{ kpi.label }}</p>
            <h3 class="font-sans text-2xl font-bold text-muted-800 dark:text-white">{{ kpi.value }}</h3>
          </div>
        </div>
        <div class="mt-2 flex items-center gap-1 text-xs">
          <Icon
            :name="kpi.change > 0 ? 'lucide:arrow-up-right' : 'lucide:arrow-down-right'"
            class="h-3 w-3"
            :class="kpi.change > 0 ? 'text-success-500' : 'text-danger-500'"
          />
          <span :class="kpi.change > 0 ? 'text-success-500' : 'text-danger-500'">{{ kpi.change > 0 ? '+' : '' }}{{ kpi.change }}%</span>
          <span class="text-muted-400">vs last period</span>
        </div>
      </BaseCard>
    </div>

    <!-- Charts Grid -->
    <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Follower Growth Chart -->
      <BaseCard shape="rounded" class="p-6">
        <h3 class="mb-4 font-sans font-medium text-muted-800 dark:text-white">Follower Growth</h3>
        <!-- Use the dynamically imported component here -->
        <ApexCharts type="area" height="300" :options="followerChartOptions" :series="followerSeries" />
      </BaseCard>

      <!-- Engagement by Post Type Chart -->
      <BaseCard shape="rounded" class="p-6">
        <h3 class="mb-4 font-sans font-medium text-muted-800 dark:text-white">Engagement by Post Type</h3>
        <ApexCharts type="bar" height="300" :options="engagementChartOptions" :series="engagementSeries" />
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
 layout: 'sidebar'
})

import { ref, defineAsyncComponent } from 'vue'

import { useRoute } from 'vue-router';

const route = useRoute();
const projectId = route.params.id;

// Mock fetching the project name based on the ID
const project = ref({
  name: 'Ongoing Social Management',
});

// This is the key change: We are telling Nuxt to only load this component
// on the client-side, preventing any SSR-related errors.
const ApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'))

const selectedPeriod = ref('30')

// Mock KPI Data (no changes)
const kpiData = ref([
  { label: 'Follower Growth', value: '+842', icon: 'lucide:users', color: 'text-primary-500 bg-primary-500/20', change: 12.5 },
  { label: 'Engagement Rate', value: '4.72%', icon: 'lucide:heart', color: 'text-lime-500 bg-lime-500/20', change: 0.8 },
  { label: 'Video Views', value: '18.2k', icon: 'lucide:play-circle', color: 'text-sky-500 bg-sky-500/20', change: 25.1 },
  { label: 'Reach', value: '76.9k', icon: 'lucide:eye', color: 'text-amber-500 bg-amber-500/20', change: -2.3 },
])

// --- MOCK CHART DATA AND OPTIONS ---

// Follower Chart
const followerSeries = ref([
  { name: 'Instagram', data: [1200, 1250, 1240, 1380, 1500, 1480, 1600, 1750, 1820, 1950, 2042] },
  { name: 'Facebook', data: [3100, 3120, 3150, 3140, 3180, 3200, 3250, 3240, 3280, 3300, 3310] },
])

const followerChartOptions = ref({
  chart: { toolbar: { show: false } },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  tooltip: { theme: 'dark' },
  legend: { labels: { colors: '#94a3b8' } }, // text-slate-400
  grid: { borderColor: '#334155', strokeDashArray: 3 }, // border-slate-700
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    labels: { style: { colors: '#94a3b8' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { labels: { style: { colors: '#94a3b8' } } },
})

// Engagement Chart
const engagementSeries = ref([
  { name: 'Likes', data: [440, 550, 410, 670] },
  { name: 'Comments', data: [130, 230, 200, 80] },
  { name: 'Shares', data: [110, 170, 150, 120] },
])

const engagementChartOptions = ref({
  chart: { type: 'bar', stacked: true, toolbar: { show: false } },
  plotOptions: { bar: { horizontal: false, columnWidth: '35%' } },
  dataLabels: { enabled: false },
  tooltip: { theme: 'dark', y: { formatter: (val: number) => val.toString() } },
  legend: { labels: { colors: '#94a3b8' } },
  grid: { borderColor: '#334155', strokeDashArray: 3 },
  xaxis: {
    categories: ['Image Post', 'Carousel', 'Video Reel', 'Story'],
    labels: { style: { colors: '#94a3b8' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { labels: { style: { colors: '#94a3b8' } } },
  fill: { opacity: 1 },
})
</script>

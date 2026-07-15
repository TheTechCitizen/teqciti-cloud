<template>
  <div class="mx-auto w-full max-w-4xl px-4 py-8 pb-28 sm:px-6 lg:px-8 space-y-10">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-white">Performance Reports</h1>
        <p class="mt-2 text-sm text-slate-400">Monthly breakdowns of campaigns, leads, and deliverables.</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-20">
      <Icon name="lucide:loader-2" class="animate-spin text-purple-500" size="32" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!reports || reports.length === 0" class="flex flex-col items-center justify-center rounded-2xl bg-slate-800/30 p-12 ring-1 ring-slate-700/50 text-center">
      <img src="/img/illustrations/3.png" alt="No reports yet" class="w-40 h-40 opacity-50 mb-6 object-contain" />
      <h3 class="text-lg font-semibold text-white">No reports available</h3>
      <p class="mt-2 text-sm text-slate-400 max-w-sm">Your performance data will appear here once your first campaign cycle completes.</p>
    </div>

    <!-- Reports Feed (Accordion) -->
    <div v-else class="space-y-6">
      <article 
        v-for="(report, index) in reports" 
        :key="report.id"
        class="relative overflow-hidden rounded-2xl bg-slate-800/40 ring-1 transition-all duration-300 backdrop-blur-sm"
        :class="expandedReports.includes(report.id) ? 'ring-purple-500/50 shadow-lg shadow-purple-500/5' : 'ring-slate-700/50 hover:ring-slate-600'"
      >
        <!-- Highlight glow for the most recent report -->
        <div v-if="index === 0" class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-emerald-500"></div>

        <!-- ACCORDION HEADER (Clickable) -->
        <div 
          @click="toggleReport(report.id)"
          class="cursor-pointer border-b border-slate-700/50 bg-slate-800/50 px-6 py-5 flex flex-wrap items-center justify-between gap-4 transition-colors hover:bg-slate-800/80"
        >
          <div class="flex items-center gap-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 ring-1 ring-slate-700">
              <Icon name="lucide:bar-chart-2" size="20" :class="expandedReports.includes(report.id) ? 'text-purple-400' : 'text-slate-400'" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">{{ report.formattedPeriod }}</h2>
              <p class="text-xs text-slate-400">Published: {{ report.publishedAt }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <button @click.stop class="flex items-center gap-2 rounded-lg bg-purple-600/10 px-3 py-1.5 text-sm font-medium text-purple-400 hover:bg-purple-600 hover:text-white transition-colors ring-1 ring-inset ring-purple-500/20">
              <Icon name="lucide:download" size="16" />
              <span class="hidden sm:inline">PDF</span>
            </button>
            
            <!-- Accordion Chevron -->
            <div class="p-1 rounded-full bg-slate-900/50 text-slate-400">
              <Icon 
                name="lucide:chevron-down" 
                size="20" 
                class="transition-transform duration-300"
                :class="expandedReports.includes(report.id) ? 'rotate-180 text-white' : ''" 
              />
            </div>
          </div>
        </div>

        <!-- ACCORDION BODY -->
        <div v-show="expandedReports.includes(report.id)" class="p-6 space-y-8 animate-in slide-in-from-top-2 duration-300">
          
          <!-- ORIGINAL: Executive Summary -->
          <!-- (Using report.executiveSummary - rename this to match your API if needed) -->
          <div v-if="report.executiveSummary" class="relative rounded-xl bg-slate-800/50 p-6 ring-1 ring-slate-700/50">
            <div class="absolute left-0 top-6 bottom-6 w-1 rounded-r-md bg-purple-500"></div>
            <h3 class="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Icon name="lucide:file-search" size="16" class="text-purple-400" />
              Executive Summary
            </h3>
            <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {{ report.executiveSummary }}
            </p>
          </div>

          <!-- NEW: Block Editor Details Field -->
          <div v-if="report.details && report.details.length > 0" class="rounded-xl bg-slate-900/30 p-6 ring-1 ring-slate-700/50">
            <div class="prose prose-invert prose-slate max-w-none prose-p:text-slate-300 prose-headings:text-slate-200 prose-a:text-purple-400">
              <BlockRenderer :blocks="report.details" />
            </div>
          </div>

          <!-- DYNAMIC GRAPH INJECTION -->
          <div v-if="report.chartData || report.chart_data" class="rounded-xl bg-slate-900/50 p-6 ring-1 ring-slate-700/50">
            <h3 class="text-sm font-semibold text-slate-300 mb-4">{{ (report.chartData || report.chart_data).title }}</h3>
            <div class="h-[300px] w-full">
              <ClientOnly>
                <apexchart 
                  type="area" 
                  height="300" 
                  :options="getChartOptions((report.chartData || report.chart_data).categories)" 
                  :series="(report.chartData || report.chart_data).series" 
                />
                <template #fallback>
                  <div class="h-full w-full flex items-center justify-center text-slate-500">Loading chart...</div>
                </template>
              </ClientOnly>
            </div>
          </div>

          <!-- FULL WIDTH: Agency Marketing KPIs -->
          <div v-if="report.agencyMetrics && report.agencyMetrics.length > 0">
            <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Campaign Operations</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div 
                v-for="metric in report.agencyMetrics" 
                :key="metric.label"
                class="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-700/50 flex flex-col justify-between"
              >
                <div class="flex items-center gap-2 text-slate-400 mb-2">
                  <Icon :name="metric.icon || 'lucide:trending-up'" size="14" />
                  <p class="text-xs font-medium uppercase tracking-wider">{{ metric.label }}</p>
                </div>
                <p class="text-2xl font-bold text-white">{{ metric.value }}</p>
              </div>
            </div>
          </div>

          <!-- FULL WIDTH: Client-Side Results -->
          <div v-if="report.clientResults && report.clientResults.length > 0" class="rounded-xl bg-indigo-500/5 p-5 ring-1 ring-indigo-500/20">
            <h3 class="text-sm font-semibold text-indigo-400 flex items-center gap-2 mb-4">
              <Icon name="lucide:briefcase" size="16" />
              Client-Side Outcomes
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div 
                v-for="result in report.clientResults" 
                :key="result.label"
                class="rounded-lg bg-slate-900/40 p-4 ring-1 ring-indigo-500/10"
              >
                <div class="flex items-center gap-2 text-indigo-300/70 mb-1">
                  <Icon :name="result.icon || 'lucide:check-circle'" size="14" />
                  <p class="text-xs font-medium uppercase tracking-wider">{{ result.label }}</p>
                </div>
                <p class="text-xl font-bold text-white">{{ result.value }}</p>
                <p v-if="result.description" class="mt-1 text-xs text-slate-500">{{ result.description }}</p>
              </div>
            </div>
          </div>

          <!-- FULL WIDTH: Task Checklist -->
          <div v-if="report.tasks && report.tasks.length > 0" class="rounded-xl bg-slate-800/50 p-5 ring-1 ring-slate-700/50 h-full">
            <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Icon name="lucide:list-todo" size="16" class="text-slate-400" />
              Deliverables Checklist
            </h3>
            
            <div class="mb-6 space-y-2">
              <div class="flex justify-between items-end">
                <p class="text-xs font-medium text-slate-400">Completion Rate</p>
                <span class="text-sm font-bold text-emerald-400">{{ calculateCompletionRate(report.tasks) }}%</span>
              </div>
              <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-900">
                <div 
                  class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000"
                  :style="{ width: `${calculateCompletionRate(report.tasks)}%` }"
                ></div>
              </div>
            </div>

            <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li v-for="(task, tIndex) in report.tasks" :key="tIndex" class="flex items-start gap-3 group">
                <div class="mt-0.5 shrink-0">
                  <Icon v-if="task.isCompleted" name="lucide:check-circle-2" size="18" class="text-emerald-400" />
                  <Icon v-else name="lucide:circle" size="18" class="text-slate-600" />
                </div>
                <div class="flex flex-col">
                  <span :class="['text-sm font-medium transition-colors', task.isCompleted ? 'text-slate-300' : 'text-slate-400']">
                    {{ task.name }}
                  </span>
                  <span v-if="task.description" class="text-xs text-slate-500 mt-0.5 leading-snug pr-4">
                    {{ task.description }}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <!-- EXTREME BOTTOM: Challenges -->
          <div v-if="report.challenges" class="rounded-xl bg-rose-500/10 p-5 ring-1 ring-rose-500/20 mt-4">
            <h3 class="text-sm font-semibold text-rose-400 flex items-center gap-2 mb-2">
              <Icon name="lucide:alert-triangle" size="16" />
              Challenges & Roadblocks
            </h3>
            <p class="text-sm text-rose-200/80 leading-relaxed whitespace-pre-line">
              {{ report.challenges }}
            </p>
          </div>

        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

definePageMeta({
  requiresAuth: true,
  requiredCapability: 'view_reports',
});

const expandedReports = ref<string[]>([]);

const { orgId } = await useCurrentOrg();
const { reports, pending } = await useReports(orgId.value);

watch(reports, (newReports) => {
  if (newReports && newReports.length > 0 && expandedReports.value.length === 0) {
    expandedReports.value.push(newReports[0].id);
  }
}, { immediate: true });

const toggleReport = (id: string) => {
  const index = expandedReports.value.indexOf(id);
  if (index > -1) {
    expandedReports.value.splice(index, 1);
  } else {
    expandedReports.value.push(id);
  }
};

const calculateCompletionRate = (tasks: any[]) => {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.isCompleted).length;
  return Math.round((completed / tasks.length) * 100);
};

const getChartOptions = (categories: string[]) => {
  return {
    chart: {
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'inherit'
    },
    theme: { mode: 'dark' },
    colors: ['#a855f7', '#34d399', '#6366f1'],
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] }
    },
    xaxis: {
      categories: categories || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#94a3b8' } }
    },
    yaxis: {
      labels: { style: { colors: '#94a3b8' } }
    },
    grid: {
      borderColor: '#334155',
      strokeDashArray: 4,
      yaxis: { lines: { show: true } }
    },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark' }
  };
};
</script>

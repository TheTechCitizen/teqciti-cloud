<template>
  <div class="mx-auto w-full max-w-3xl px-4 py-8 pb-28 sm:px-6 lg:px-8 space-y-10">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-white">Performance Reports</h1>
        <p class="mt-2 text-sm text-slate-400">Monthly breakdowns of campaigns, leads, and deliverables.</p>
      </div>
      <button class="flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors ring-1 ring-slate-600">
        <Icon name="lucide:filter" size="16" />
        Filter by Year
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="reports.length === 0" class="flex flex-col items-center justify-center rounded-2xl bg-slate-800/30 p-12 ring-1 ring-slate-700/50 text-center">
      <img src="/img/illustrations/3.png" alt="No reports yet" class="w-40 h-40 opacity-50 mb-6" />
      <h3 class="text-lg font-semibold text-white">No reports available</h3>
      <p class="mt-2 text-sm text-slate-400 max-w-sm">Your performance data will appear here once your first campaign cycle completes.</p>
    </div>

    <!-- Reports Feed -->
    <div v-else class="space-y-8">
      <article 
        v-for="(report, index) in reports" 
        :key="report.id"
        class="relative overflow-hidden rounded-2xl bg-slate-800/40 ring-1 ring-slate-700/50 backdrop-blur-sm"
      >
        <!-- Highlight glow for the most recent report -->
        <div v-if="index === 0" class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-emerald-500"></div>

        <!-- Report Header -->
        <div class="border-b border-slate-700/50 bg-slate-800/50 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 ring-1 ring-slate-700">
              <Icon name="lucide:bar-chart-2" size="20" class="text-purple-400" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">{{ report.period }}</h2>
              <p class="text-xs text-slate-400">Published: {{ report.publishedAt }}</p>
            </div>
          </div>
          <button class="flex items-center gap-2 rounded-lg bg-purple-600/10 px-3 py-1.5 text-sm font-medium text-purple-400 hover:bg-purple-600 hover:text-white transition-colors ring-1 ring-inset ring-purple-500/20">
            <Icon name="lucide:download" size="16" />
            <span class="hidden sm:inline">Download PDF</span>
            <span class="sm:hidden">PDF</span>
          </button>
        </div>

        <div class="p-6 space-y-8">
          
          <!-- Task Completion Bar (Calculated Dynamically) -->
          <div v-if="report.tasks && report.tasks.length > 0" class="space-y-2">
            <div class="flex justify-between items-end">
              <p class="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Icon name="lucide:check-square" size="16" class="text-emerald-400" />
                Deliverable Completion Rate
              </p>
              <span class="text-lg font-bold text-white">{{ calculateCompletionRate(report.tasks) }}%</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-slate-900 ring-1 ring-inset ring-slate-700/50">
              <div 
                class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000"
                :style="{ width: `${calculateCompletionRate(report.tasks)}%` }"
              ></div>
            </div>
          </div>

          <!-- Agency Marketing KPIs -->
          <div v-if="getVisibleMetrics(report).length > 0">
            <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Agency Campaign Metrics</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div 
                v-for="metric in getVisibleMetrics(report)" 
                :key="metric.label"
                class="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-700/50 flex flex-col justify-between"
              >
                <div class="flex items-center gap-2 text-slate-400 mb-2">
                  <Icon :name="metric.icon" size="14" />
                  <p class="text-xs font-medium uppercase tracking-wider">{{ metric.label }}</p>
                </div>
                <p class="text-2xl font-bold text-white">{{ metric.formattedValue }}</p>
              </div>
            </div>
          </div>

          <!-- Client-Side Results (Distinct Visual Style) -->
          <div v-if="report.clientResults && report.clientResults.length > 0" class="rounded-xl bg-indigo-500/5 p-5 ring-1 ring-indigo-500/20">
            <h3 class="text-sm font-semibold text-indigo-400 flex items-center gap-2 mb-4">
              <Icon name="lucide:briefcase" size="16" />
              Client-Side Outcomes
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div 
                v-for="result in report.clientResults" 
                :key="result.label"
                class="rounded-lg bg-slate-900/40 p-4 ring-1 ring-indigo-500/10"
              >
                <div class="flex items-center gap-2 text-indigo-300/70 mb-1">
                  <Icon :name="result.icon" size="14" />
                  <p class="text-xs font-medium uppercase tracking-wider">{{ result.label }}</p>
                </div>
                <p class="text-xl font-bold text-white">{{ result.value }}</p>
                <p v-if="result.description" class="mt-1 text-xs text-slate-500">{{ result.description }}</p>
              </div>
            </div>
          </div>

          <!-- Task Checklist -->
          <div v-if="report.tasks && report.tasks.length > 0" class="rounded-xl bg-slate-800/50 p-5 ring-1 ring-slate-700/50">
             <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Icon name="lucide:list-todo" size="16" class="text-slate-400" />
              Monthly Deliverables
             </h3>
             <ul class="space-y-3">
               <li v-for="task in report.tasks" :key="task.id" class="flex items-start gap-3 group">
                 <div class="mt-0.5 shrink-0 transition-colors">
                   <Icon 
                    v-if="task.isCompleted" 
                    name="lucide:check-circle-2" 
                    size="18" 
                    class="text-emerald-400" 
                   />
                   <Icon 
                    v-else 
                    name="lucide:circle" 
                    size="18" 
                    class="text-slate-600 group-hover:text-slate-500" 
                   />
                 </div>
                 <div class="flex flex-col">
                    <span :class="['text-sm font-medium transition-colors', task.isCompleted ? 'text-slate-300' : 'text-slate-400']">
                      {{ task.name }}
                    </span>
                    <span v-if="task.description" class="text-xs text-slate-500 mt-0.5">
                      {{ task.description }}
                    </span>
                 </div>
               </li>
             </ul>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Details & Analysis -->
            <div v-if="report.details" class="relative rounded-xl bg-slate-800/50 p-5 ring-1 ring-slate-700/50">
              <div class="absolute left-0 top-5 bottom-5 w-1 rounded-r-md bg-purple-500"></div>
              <h3 class="text-sm font-semibold text-white flex items-center gap-2 mb-2">
                <Icon name="lucide:file-search" size="16" class="text-purple-400" />
                Executive Summary
              </h3>
              <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {{ report.details }}
              </p>
            </div>

            <!-- Challenges / Roadblocks -->
            <div v-if="report.challenges" class="rounded-xl bg-rose-500/10 p-5 ring-1 ring-rose-500/20">
              <h3 class="text-sm font-semibold text-rose-400 flex items-center gap-2 mb-2">
                <Icon name="lucide:alert-triangle" size="16" />
                Challenges & Roadblocks
              </h3>
              <p class="text-sm text-rose-200/80 leading-relaxed whitespace-pre-line">
                {{ report.challenges }}
              </p>
            </div>
          </div>

        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
    requiresAuth: true
});


import { ref } from 'vue'

// --- TYPES ---
interface Task {
  id: string
  name: string
  description?: string
  isCompleted: boolean
}

interface ClientResult {
  label: string
  value: string | number
  icon: string
  description?: string
}

interface PerformanceReport {
  id: string
  period: string
  publishedAt: string
  
  // Quantitative Metrics (Nullable from API)
  leads: number | null
  spend: number | null
  clicks: number | null
  cpl: number | null
  impressions: number | null
  roas: number | null
  
  // Tasks & Deliverables
  tasks: Task[] | null
  
  // Client-Side Business Outcomes
  clientResults: ClientResult[] | null

  // Qualitative Fields
  details: string | null
  challenges: string | null
}

interface VisibleMetric {
  label: string
  formattedValue: string
  icon: string
}

// --- LOGIC ---

// Calculate completion percentage dynamically based on tasks array
const calculateCompletionRate = (tasks: Task[]): number => {
  if (!tasks || tasks.length === 0) return 0
  const completedCount = tasks.filter(task => task.isCompleted).length
  return Math.round((completedCount / tasks.length) * 100)
}

// Safely extracts non-null agency metrics and formats them
const getVisibleMetrics = (report: PerformanceReport): VisibleMetric[] => {
  const metrics: VisibleMetric[] = []

  if (report.leads !== null) {
    metrics.push({ label: 'Leads', formattedValue: report.leads.toString(), icon: 'lucide:users' })
  }
  if (report.spend !== null) {
    metrics.push({ label: 'Ad Spend', formattedValue: `$${report.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: 'lucide:dollar-sign' })
  }
  if (report.cpl !== null) {
    metrics.push({ label: 'Cost/Lead', formattedValue: `$${report.cpl.toFixed(2)}`, icon: 'lucide:target' })
  }
  if (report.roas !== null) {
    metrics.push({ label: 'ROAS', formattedValue: `${report.roas.toFixed(2)}x`, icon: 'lucide:trending-up' })
  }
  if (report.clicks !== null) {
    const formatted = report.clicks > 999 ? `${(report.clicks / 1000).toFixed(1)}k` : report.clicks.toString()
    metrics.push({ label: 'Clicks', formattedValue: formatted, icon: 'lucide:mouse-pointer-click' })
  }
  if (report.impressions !== null) {
    const formatted = report.impressions > 999 ? `${(report.impressions / 1000).toFixed(1)}k` : report.impressions.toString()
    metrics.push({ label: 'Impressions', formattedValue: formatted, icon: 'lucide:eye' })
  }

  return metrics
}

// --- MOCK API DATA ---
const reports = ref<PerformanceReport[]>([
  {
    id: 'rep_002',
    period: 'April 2026',
    publishedAt: 'May 2, 2026',
    
    // Agency Metrics
    leads: 142,
    spend: 1250.00,
    clicks: 4300,
    cpl: 8.80,
    impressions: 45000,
    roas: 3.4,
    
    // Client Side Outcomes
    clientResults: [
      { label: 'Sales Closed', value: 38, icon: 'lucide:badge-dollar', description: 'From generated leads' },
      { label: 'Patient CSAT', value: '4.8/5', icon: 'lucide:smile', description: 'Post-appointment surveys' },
      { label: 'Revenue ROI', value: '+24%', icon: 'lucide:pie-chart', description: 'Net profit increase' }
    ],

    // Deliverables
    tasks: [
      { id: 't1', name: 'Meta & TikTok Campaign Launch', description: 'A/B testing 3 cinematic video variants.', isCompleted: true },
      { id: 't2', name: 'n8n Digital Receptionist Integration', description: 'Routing queries to the CRM.', isCompleted: true },
      { id: 't3', name: 'Landing Page Optimization', description: 'Implement Nuxt image lazy-loading.', isCompleted: true },
      { id: 't4', name: 'End of Month Reporting', isCompleted: true }
    ],

    details: 'April was a record month for the Meta campaign. By shifting budget toward the new Cinematic Video assets created last month, we decreased Cost Per Lead (CPL) by 14% while scaling volume.\n\nThe n8n digital receptionist successfully handled 85% of incoming initial queries without human intervention.',
    challenges: null
  },
  {
    id: 'rep_001',
    period: 'March 2026',
    publishedAt: 'April 3, 2026',
    
    // Agency Metrics (Some missing)
    leads: 89,
    spend: 1000.00,
    clicks: null,
    cpl: 11.23,
    impressions: null,
    roas: null,

    clientResults: null, // No client data recorded yet

    // Deliverables (Some incomplete)
    tasks: [
      { id: 't5', name: 'Initial Meta Ads Setup', isCompleted: true },
      { id: 't6', name: 'Pixel & Conversion Tracking', isCompleted: true },
      { id: 't7', name: 'Video Asset Production', description: 'Shoot and edit 5 short-form clips.', isCompleted: true },
      { id: 't8', name: 'CRM Pipeline Configuration', isCompleted: false }
    ],
    
    details: 'Initial campaign launch for the new clinic workflows. We focused heavily on top-of-funnel awareness and setting up the tracking pixels correctly across the booking engine.',
    challenges: 'TikTok ad review process took 4 days longer than anticipated due to medical-related policy flags. We have appealed and adjusted the copy to ensure smoother approvals moving forward.'
  }
])
</script>

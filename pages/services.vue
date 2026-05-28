<template>
  <div class="mx-auto w-full max-w-4xl px-4 py-8 pb-28 sm:px-6 lg:px-8 relative min-h-screen">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-white">Projects</h1>
        <p class="mt-2 text-sm text-slate-400">Manage your active campaigns, builds, and content shoots.</p>
      </div>
      <button 
        v-if="!isCreating && projects.length > 0"
        @click="startCreation"
        class="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
      >
        <Icon name="lucide:plus" size="18" />
        New Project
      </button>
    </div>

    <!-- MAIN DASHBOARD VIEW -->
    <div v-if="!isCreating" class="animate-in fade-in duration-300">
      
      <!-- Empty State -->
      <div v-if="projects.length === 0" class="flex flex-col items-center justify-center rounded-3xl bg-slate-800/30 py-16 px-6 ring-1 ring-slate-700/50 text-center relative overflow-hidden">
        <!-- Decorative background glow -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <img src="/img/illustrations/4.png" alt="No projects" class="w-48 h-48 object-contain opacity-80 mb-6 drop-shadow-2xl" />
        <h3 class="text-2xl font-bold text-white tracking-tight">Let's build something great.</h3>
        <p class="mt-3 text-sm text-slate-400 max-w-md leading-relaxed">
          You don't have any active projects yet. Browse our services and spin up a new project in seconds. We'll handle the heavy lifting.
        </p>
        
        <button 
          @click="startCreation"
          class="mt-8 flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-purple-500 hover:-translate-y-0.5 transition-all duration-200"
        >
          <Icon name="lucide:rocket" size="20" />
          Explore Services
        </button>
      </div>

      <!-- Projects Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div 
          v-for="project in projects" 
          :key="project.id"
          class="group relative overflow-hidden rounded-2xl bg-slate-800/40 p-6 ring-1 ring-slate-700/50 backdrop-blur-sm transition-all hover:bg-slate-800/60 hover:ring-slate-600 cursor-pointer flex flex-col justify-between min-h-[200px]"
        >
          <!-- Project Status Badge -->
          <div class="absolute top-6 right-6">
            <span :class="['inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset backdrop-blur-md', getStatusStyles(project.status)]">
              <span class="mr-1.5 h-1.5 w-1.5 rounded-full fill-current" :class="getStatusDot(project.status)"></span>
              {{ project.status }}
            </span>
          </div>

          <div class="pr-20">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 ring-1 ring-slate-700 mb-4 group-hover:scale-105 transition-transform duration-300">
              <Icon :name="project.service.icon" size="24" class="text-purple-400" />
            </div>
            <h3 class="text-lg font-bold text-white truncate">{{ project.name }}</h3>
            <p class="text-sm text-slate-400 mt-1">{{ project.service.name }}</p>
          </div>

          <div class="mt-6 flex items-center justify-between border-t border-slate-700/50 pt-4">
            <div>
              <p class="text-xs text-slate-500 uppercase tracking-wider">Est. Cost</p>
              <p class="text-sm font-semibold text-white mt-0.5">
                {{ project.status === 'Pending Setup' ? 'TBD' : `Kes${project.cost.toLocaleString()}` }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-xs text-slate-500 uppercase tracking-wider">Created</p>
              <p class="text-sm font-medium text-slate-300 mt-0.5">{{ project.createdAt }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SERVICE SELECTION (CREATE MODE) -->
    <div v-else class="animate-in slide-in-from-bottom-8 fade-in duration-300">
      <div class="flex items-center gap-4 mb-6">
        <button @click="isCreating = false" class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
          <Icon name="lucide:arrow-left" size="20" />
        </button>
        <div>
          <h2 class="text-xl font-bold text-white">Select a Service</h2>
          <p class="text-sm text-slate-400">Choose a starting point. We'll refine the details together.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div 
          v-for="service in availableServices" 
          :key="service.id"
          @click="selectService(service)"
          class="group relative overflow-hidden rounded-2xl bg-slate-800/40 ring-1 ring-slate-700/50 backdrop-blur-sm transition-all hover:bg-slate-800 hover:ring-purple-500/50 cursor-pointer flex flex-col"
        >
          <div class="h-40 w-full bg-slate-900/50 flex items-center justify-center p-6 relative overflow-hidden">
            <!-- Subtle gradient match to illustration -->
            <div :class="`absolute inset-0 opacity-20 bg-gradient-to-br ${service.colorBg}`"></div>
            <img :src="service.image" :alt="service.name" class="h-full w-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500" />
          </div>
          
          <div class="p-5 flex-1 flex flex-col">
            <div class="flex items-center gap-2 mb-2">
              <Icon :name="service.icon" size="18" :class="service.iconColor" />
              <h3 class="text-base font-bold text-white">{{ service.name }}</h3>
            </div>
            <p class="text-sm text-slate-400 leading-relaxed flex-1">
              {{ service.description }}
            </p>
            <div class="mt-4 flex items-center justify-between border-t border-slate-700/50 pt-4">
              <p class="text-xs text-slate-500">Starting at</p>
              <p class="text-sm font-semibold text-white">${{ service.startingPrice.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FRICTIONLESS CONFIRMATION MODAL -->
    <div v-if="selectedService" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
      
      <div class="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-slate-900 ring-1 ring-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300">
        <!-- Close button -->
        <button @click="closeModal" class="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 z-10 transition-colors">
          <Icon name="lucide:x" size="18" />
        </button>

        <!-- Modal Header Image -->
        <div class="h-32 w-full bg-slate-800 flex items-center justify-center relative overflow-hidden">
          <div :class="`absolute inset-0 opacity-30 bg-gradient-to-br ${selectedService.colorBg}`"></div>
          <img :src="selectedService.image" class="h-24 object-contain opacity-80" />
        </div>

        <div class="p-6 sm:p-8 space-y-6">
          <div>
            <h3 class="text-xl font-bold text-white tracking-tight">Start {{ selectedService.name }}</h3>
            <p class="mt-1 text-sm text-slate-400">Give your project a name to get started.</p>
          </div>

          <!-- The only input needed -->
          <div>
            <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Project Name</label>
            <input 
              v-model="newProjectName" 
              type="text" 
              class="w-full rounded-xl border-0 bg-slate-950 py-3.5 px-4 text-base text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500 transition-shadow"
            />
          </div>

          <!-- Trust / Frictionless Billing Banner -->
          <div class="rounded-xl bg-purple-500/10 p-4 ring-1 ring-purple-500/20 flex gap-3 items-start">
            <Icon name="lucide:shield-check" size="20" class="text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-semibold text-purple-300">No immediate charges</p>
              <p class="mt-1 text-xs text-purple-200/70 leading-relaxed">
                Starting this project is free. We will review your requirements on a kickoff call before any billing occurs.
              </p>
            </div>
          </div>

          <button 
            @click="confirmProject"
            class="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-purple-500 transition-all hover:shadow-purple-500/20"
          >
            <Icon name="lucide:rocket" size="18" />
            Launch Project
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
    requiresAuth: true
});

import { ref } from 'vue'

// --- TYPES ---
interface ServiceDef {
  id: string
  name: string
  description: string
  startingPrice: number
  icon: string
  iconColor: string
  image: string
  colorBg: string // For subtle gradients
}

interface Project {
  id: string
  name: string
  service: ServiceDef
  status: 'Pending Setup' | 'Active' | 'Completed'
  cost: number
  createdAt: string
}

// --- STATE ---
const projects = ref<Project[]>([]) // Starts empty to show off the beautiful zero-state
const isCreating = ref(false)
const selectedService = ref<ServiceDef | null>(null)
const newProjectName = ref('')

// --- MOCK SERVICE DATA ---
const availableServices: ServiceDef[] = [
  {
    id: 'srv_perf_marketing',
    name: 'Performance Marketing',
    description: 'High-converting Meta & TikTok ad campaigns, fully managed with automated lead routing.',
    startingPrice: 850,
    icon: 'lucide:target',
    iconColor: 'text-rose-400',
    image: '/img/illustrations/5.png',
    colorBg: 'from-rose-500 to-orange-500'
  },
  {
    id: 'srv_web_dev',
    name: 'Web Application',
    description: 'Custom Nuxt/Vue applications with modern UI, blazing fast speeds, and deep integrations.',
    startingPrice: 1500,
    icon: 'lucide:layout-template',
    iconColor: 'text-indigo-400',
    image: '/img/illustrations/6.png',
    colorBg: 'from-indigo-500 to-cyan-500'
  },
  {
    id: 'srv_cinematic',
    name: 'Cinematic Content Shoot',
    description: 'Professional on-location video & photography. Edited for social media and web deployment.',
    startingPrice: 1200,
    icon: 'lucide:video',
    iconColor: 'text-emerald-400',
    image: '/img/illustrations/7.png',
    colorBg: 'from-emerald-500 to-teal-500'
  }
]

// --- ACTIONS ---
const startCreation = () => {
  isCreating.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const selectService = (service: ServiceDef) => {
  selectedService.value = service
  // Pre-fill a nice default name to reduce typing friction
  newProjectName.value = `My ${service.name} Project`
}

const closeModal = () => {
  selectedService.value = null
}

const confirmProject = () => {
  if (!selectedService.value) return

  // Add the new project to the dashboard list instantly
  const newProj: Project = {
    id: `proj_${Date.now()}`,
    name: newProjectName.value || `${selectedService.value.name} Project`,
    service: selectedService.value,
    status: 'Pending Setup',
    cost: selectedService.value.startingPrice,
    createdAt: 'Just now'
  }

  projects.value.unshift(newProj)
  
  // Reset and return to dashboard
  selectedService.value = null
  isCreating.value = false
  
  // In a real app, you'd trigger a success toast notification here
  console.log('Project created:', newProj)
}

// --- HELPERS (UI STYLING) ---
const getStatusStyles = (status: Project['status']) => {
  switch (status) {
    case 'Pending Setup': return 'bg-amber-500/10 text-amber-400 ring-amber-500/20'
    case 'Active': return 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
    case 'Completed': return 'bg-slate-500/10 text-slate-400 ring-slate-500/20'
  }
}

const getStatusDot = (status: Project['status']) => {
  switch (status) {
    case 'Pending Setup': return 'bg-amber-400'
    case 'Active': return 'bg-emerald-400'
    case 'Completed': return 'bg-slate-400'
  }
}
</script>

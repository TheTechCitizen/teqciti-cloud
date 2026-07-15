<template>
  <div class="fixed inset-0 z- flex min-h-screen w-full bg-slate-950 font-sans overflow-y-auto overflow-x-hidden">
    
    <div class="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 border-r border-slate-800/80 bg-slate-900/40 overflow-hidden">
      
      <div class="absolute -top-[20%] -left-[10%] h-[70vh] w-[70vw] rounded-full bg-purple-600/10 blur-[120px] mix-blend-screen animate-pulse pointer-events-none"></div>
      <div class="absolute -bottom-[20%] -right-[10%] h-[70vh] w-[70vw] rounded-full bg-emerald-600/10 blur-[120px] mix-blend-screen pointer-events-none"></div>
      
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

      <div class="relative z-10 flex items-center gap-3">
   
      <div class="flex h-12 w-12 items-center justify-center rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)]">
  <img src="/img/logo.png" size="48" class="text-white fill-white/20 animate-pulse duration-1000" />
</div>
        <span class="text-3xl font-bold text-white tracking-tight">Teqciti Cloud</span>
      </div>

      <div class="relative z-10 w-full max-w-2xl mt-12">
        <h1 class="text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
          The ultimate engine for <br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">digital growth.</span>
        </h1>
        <p class="text-lg text-slate-400 max-w-lg leading-relaxed mb-12">
          Stop juggling spreadsheets and scattered emails. Manage your ad campaigns, track every qualified lead, and approve assets from one unified command center.
        </p>

        <div class="relative h-64 w-full perspective-1000">
          
          <div class="absolute top-0 left-0 w-72 rounded-2xl bg-slate-800/80 p-4 ring-1 ring-slate-700 backdrop-blur-xl shadow-2xl transform -rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all duration-500">
            <div class="flex items-center gap-3 mb-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30">
                <Icon name="lucide:target" size="14" />
              </div>
              <div>
                <p class="text-xs font-bold text-white">New Lead Captured</p>
                <p class="text-[10px] text-slate-400">Meta Ads Campaign</p>
              </div>
            </div>
            <div class="rounded-lg bg-slate-900/50 p-3">
              <p class="text-sm font-semibold text-slate-200">Michael Ochieng</p>
              <p class="text-xs text-slate-400 mt-1">Requested: New Booking</p>
            </div>
          </div>

          <div class="absolute top-16 left-48 w-72 rounded-2xl bg-slate-800/80 p-4 ring-1 ring-slate-700 backdrop-blur-xl shadow-2xl transform rotate-3 hover:rotate-0 hover:-translate-y-2 transition-all duration-500 z-10">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <Icon name="lucide:swords" size="16" class="text-purple-400" />
                <p class="text-xs font-bold text-white">Quest Completed</p>
              </div>
              <span class="text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">+50 pts</span>
            </div>
            <p class="text-sm text-slate-300">Approved "Black November" Ad Copy</p>
            <div class="mt-3 h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
              <div class="h-full w-3/4 bg-gradient-to-r from-amber-500 to-orange-400"></div>
            </div>
          </div>

        </div>
      </div>

      <div class="relative z-10 flex items-center gap-6 pt-12">
        <div class="flex -space-x-4">
          <img src="https://i.pravatar.cc/100?img=1" class="h-12 w-12 rounded-full ring-4 ring-slate-900 object-cover" />
          <img src="https://i.pravatar.cc/100?img=2" class="h-12 w-12 rounded-full ring-4 ring-slate-900 object-cover" />
          <img src="https://i.pravatar.cc/100?img=3" class="h-12 w-12 rounded-full ring-4 ring-slate-900 object-cover" />
          <div class="h-12 w-12 rounded-full ring-4 ring-slate-900 bg-slate-800 flex items-center justify-center text-xs font-bold text-white shadow-lg">+2k</div>
        </div>
        <div>
          <div class="flex text-amber-400 mb-1">
            <Icon name="lucide:star" size="16" class="fill-current" v-for="i in 5" :key="i" />
          </div>
          <p class="text-sm text-slate-300 font-medium">Trusted by leading service businesses.</p>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-[45%] flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-32 relative z-10">
      
      <div class="flex lg:hidden items-center gap-3 mb-10">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30">
          <Icon name="lucide:hexagon" size="24" class="text-white fill-white/20" />
        </div>
        <span class="text-2xl font-bold text-white tracking-tight">Teqciti</span>
      </div>

      <div class="mb-8">
        <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
          {{ isLogin ? 'Welcome back' : 'Create an account' }}
        </h2>
        <p class="text-slate-400 text-sm sm:text-base">
          {{ isLogin ? "Enter your credentials to access your workspace." : "Join today and streamline your digital marketing pipeline." }}
        </p>
      </div>

      <div v-if="authError" class="mb-6 rounded-2xl bg-rose-500/10 p-4 ring-1 ring-rose-500/20 flex items-start gap-3 animate-in fade-in duration-200">
        <Icon name="lucide:alert-circle" size="20" class="text-rose-400 shrink-0 mt-0.5" />
        <p class="text-sm text-rose-200">{{ authError }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        
        <div v-if="!isLogin" class="animate-in slide-in-from-top-2 fade-in duration-300">
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
          <div class="relative group">
            <Icon name="lucide:user" size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="e.g. Jane Doe"
              required 
              class="w-full rounded-2xl border-0 bg-slate-900/50 py-4 pl-12 pr-4 text-base text-white ring-1 ring-inset ring-slate-800 placeholder:text-slate-600 focus:bg-slate-900 focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Work Email</label>
          <div class="relative group">
            <Icon name="lucide:mail" size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="you@company.com"
              required 
              class="w-full rounded-2xl border-0 bg-slate-900/50 py-4 pl-12 pr-4 text-base text-white ring-1 ring-inset ring-slate-800 placeholder:text-slate-600 focus:bg-slate-900 focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-all"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2 ml-1">
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
        </div>
          <div class="relative group">
            <Icon name="lucide:lock" size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
            <input 
              v-model="form.password" 
              type="password" 
              placeholder="••••••••"
              required 
              class="w-full rounded-2xl border-0 bg-slate-900/50 py-4 pl-12 pr-4 text-base text-white ring-1 ring-inset ring-slate-800 placeholder:text-slate-600 focus:bg-slate-900 focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-all"
            />
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="group relative w-full flex justify-center items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-4 text-base font-bold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4"
        >
          <span v-if="isLoading">
            <Icon name="lucide:loader-2" size="20" class="animate-spin" />
          </span>
          <span v-else class="flex items-center gap-2">
            {{ isLogin ? 'Sign In to Workspace' : 'Create Free Account' }}
            <Icon name="lucide:arrow-right" size="18" class="group-hover:translate-x-1 transition-transform" />
          </span>
        </button>

      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'blank',
})

import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

// Assuming useAuth is auto-imported or imported via your composables folder
// import { useAuth } from '#imports'

const router = useRouter()
const { signIn, signUp } = useAuth()

// --- STATE ---
const isLogin = ref(true)
const isLoading = ref(false)
const authError = ref<string | null>(null)

const form = reactive({
  name: '',
  email: '',
  password: ''
})

// --- ACTIONS ---
const toggleMode = () => {
  isLogin.value = !isLogin.value
  authError.value = null
  form.name = ''
  form.password = ''
}

const handleSubmit = async () => {
  isLoading.value = true
  authError.value = null
  
  try {
    if (isLogin.value) {
      await signIn({ 
        email: form.email, 
        password: form.password 
      })
    } else {
      // Assuming Directus uses first_name/last_name or similar fields.
      // Adjust the payload mapping if your specific API requires different keys.
      await signUp({ 
        first_name: form.name, 
        email: form.email, 
        password: form.password 
      })
      
      // Auto sign-in immediately after successful sign-up
      await signIn({
        email: form.email,
        password: form.password
      })
    }
    
    // Redirect to home/dashboard on success
    router.push('/')
    
  } catch (error: any) {
    console.error('Auth failed', error)
    
    // Provide a user-friendly error message based on Directus responses
    authError.value = error?.data?.errors?.message 
      || error?.message 
      || 'Authentication failed. Please check your credentials and try again.'
      
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
</style>

<template>
  <div class="mx-auto w-full max-w-7xl px-4 py-8 pb-28 sm:px-6 lg:px-8 space-y-8 relative">
    
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-white">Lead Center</h1>
        <p class="mt-2 text-sm text-slate-400">This page exclusively tracks qualified leads from Teqciti Connect Booking App Service or added manually by our team from direct conversations with clients</p>
      </div>
      
      <div class="flex items-center gap-4">
        <label class="flex items-center gap-2 text-sm text-slate-400 cursor-pointer hover:text-white transition-colors">
          <input type="checkbox" v-model="isOwner" class="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-600 focus:ring-offset-slate-900" />
          Owner View
        </label>
        
        <button class="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors ring-1 ring-slate-700/50 shadow-sm">
          <Icon name="lucide:download-cloud" size="16" />
          Export CSV
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="rounded-2xl bg-slate-800/40 p-5 ring-1 ring-slate-700/50 backdrop-blur-sm">
        <p class="text-sm font-medium text-slate-400 mb-1">Total Leads (30 Days)</p>
        <p class="text-3xl font-bold text-white">{{ leads.length }}</p>
      </div>
      
      <div class="rounded-2xl bg-slate-800/40 p-5 ring-1 ring-slate-700/50 backdrop-blur-sm relative overflow-hidden">
        <div class="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-500" :style="{ width: `${contactRate}%` }"></div>
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-slate-400 mb-1">Contact Rate</p>
            <p class="text-3xl font-bold text-white">{{ contactRate }}%</p>
          </div>
          <div class="h-10 w-10 shrink-0 rounded-full bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20">
            <Icon name="lucide:phone-outgoing" size="20" class="text-emerald-400" />
          </div>
        </div>
      </div>

      <div class="rounded-2xl bg-slate-800/40 p-5 ring-1 ring-slate-700/50 backdrop-blur-sm">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-slate-400 mb-1">Pending Follow-ups</p>
            <p class="text-3xl font-bold text-amber-400">{{ pendingFollowUps }}</p>
          </div>
          <div class="h-10 w-10 shrink-0 rounded-full bg-amber-500/10 flex items-center justify-center ring-1 ring-amber-500/20">
            <Icon name="lucide:clock-alert" size="20" class="text-amber-400" />
          </div>
        </div>
      </div>

      <div class="rounded-2xl bg-slate-800/40 p-5 ring-1 ring-slate-700/50 backdrop-blur-sm">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-slate-400 mb-1">Resolved Follow-ups</p>
            <p class="text-3xl font-bold text-purple-400">{{ completedFollowUps }}</p>
          </div>
          <div class="h-10 w-10 shrink-0 rounded-full bg-purple-500/10 flex items-center justify-center ring-1 ring-purple-500/20">
            <Icon name="lucide:check-circle" size="20" class="text-purple-400" />
          </div>
        </div>
      </div>
    </div>

    <div class="border-b border-slate-700/50 pb-4">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <Icon name="lucide:target" size="20" class="text-purple-400" />
          Qualified Leads
        </h2>
        <p class="mt-1 text-sm text-slate-400 max-w-3xl leading-relaxed">
          These are high-intent contacts who have explicitly submitted a form, requested a booking, or required direct manual intervention. Use the table below to track follow-ups and ensure no opportunity slips through the cracks.
        </p>
      </div>



    <div class="rounded-2xl bg-slate-800/40 ring-1 ring-slate-700/50 backdrop-blur-sm overflow-hidden">
      
      <div class="hidden lg:grid grid-cols-12 gap-6 bg-slate-800/80 px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50">
        <div class="col-span-3">Lead Details</div>
        <div class="col-span-3">Service & Booking</div>
        <div class="col-span-2">Date Received</div>
        <div class="col-span-4 text-right pr-2">Actions</div>
      </div>

      <div class="divide-y divide-slate-700/50">
        <div 
          v-for="lead in leads" 
          :key="lead.id"
          class="group flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6 px-6 py-5 hover:bg-slate-800/60 transition-colors"
        >
          
          <div class="col-span-3 flex items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700/50 ring-1 ring-slate-600 text-slate-300 font-bold uppercase">
              {{ lead.name.charAt(0) }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-bold text-white truncate">{{ lead.name }}</p>
              <a :href="`tel:${lead.phone}`" class="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-0.5 w-max">
                <Icon name="lucide:phone" size="12" />
                {{ lead.phone }}
              </a>
            </div>
          </div>

          <div class="col-span-3 flex flex-col justify-center min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <Icon name="lucide:stethoscope" size="14" class="text-cyan-400 shrink-0" />
              <p class="text-sm font-medium text-slate-200 truncate">{{ lead.service }}</p>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <Icon name="lucide:calendar-check" size="14" class="shrink-0" />
              <span v-if="lead.bookingDate" class="truncate">{{ lead.bookingDate }} at {{ lead.bookingTime }}</span>
              <span v-else class="text-slate-500 italic">Not booked yet</span>
            </div>
          </div>

          <div class="col-span-2 flex flex-col justify-center text-sm text-slate-400">
            <p>{{ lead.dateCreated }}</p>
            <p class="text-xs text-slate-500">{{ lead.timeCreated }}</p>
          </div>

          <div class="col-span-4 flex flex-wrap sm:flex-nowrap items-start lg:justify-end gap-4 mt-2 lg:mt-0">
            
            <div class="flex flex-col items-start lg:items-end w-full sm:w-auto">
              <button 
                @click="toggleAction(lead, 'reachedOut')"
                :class="[
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ring-1 w-full sm:w-auto justify-center',
                  lead.hasReachedOut ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30' : 'bg-slate-800 text-slate-400 ring-slate-700 hover:text-white hover:bg-slate-700'
                ]"
              >
                <Icon :name="lead.hasReachedOut ? 'lucide:check-circle-2' : 'lucide:circle'" size="16" />
                <span>Contacted</span>
              </button>
              
              <p v-if="isOwner && lead.hasReachedOut && lead.reachedOutBy" class="text-[10px] uppercase tracking-wider text-slate-500 mt-1.5 flex items-center gap-1">
                <Icon name="lucide:user" size="10" /> {{ lead.reachedOutBy }}
              </p>
            </div>

            <div class="flex flex-col items-start lg:items-end w-full sm:w-auto">
              <div class="flex items-center gap-1 w-full sm:w-auto">
                
                <button 
                  @click="toggleAction(lead, 'followUp')"
                  :class="[
                    'flex-1 sm:flex-none flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ring-1 justify-center',
                    lead.needsFollowUp ? 'bg-amber-500/10 text-amber-400 ring-amber-500/30' : 'bg-slate-800 text-slate-400 ring-slate-700 hover:text-white hover:bg-slate-700'
                  ]"
                >
                  <Icon :name="lead.needsFollowUp ? 'lucide:clock-4' : 'lucide:clock'" size="16" />
                  <span>Follow-up</span>
                </button>
                
                <button 
                  v-if="lead.needsFollowUp"
                  @click="toggleAction(lead, 'resolveFollowUp')"
                  title="Mark follow-up as resolved"
                  :class="[
                    'flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg transition-all ring-1',
                    lead.followUpDone ? 'bg-purple-600 text-white ring-purple-500' : 'bg-slate-800 text-slate-400 ring-slate-700 hover:text-white hover:bg-slate-700'
                  ]"
                >
                  <Icon name="lucide:check" size="16" />
                </button>
              </div>

              <p v-if="isOwner && lead.needsFollowUp && lead.followUpBy" class="text-[10px] uppercase tracking-wider text-slate-500 mt-1.5 flex items-center gap-1">
                <Icon name="lucide:user" size="10" /> {{ lead.followUpBy }}
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
    requiresAuth: true
});

// --- PERMISSIONS & USER ---
const isOwner = ref(false) 
const currentUser = "Jane (Reception)"

// --- TYPES ---
interface Lead {
  id: string
  name: string
  phone: string
  service: string
  bookingDate: string | null
  bookingTime: string | null
  dateCreated: string
  timeCreated: string
  hasReachedOut: boolean
  reachedOutBy: string | null
  needsFollowUp: boolean
  followUpBy: string | null
  followUpDone: boolean
}

// --- MOCK DATA: OMNICHANNEL METRICS (API Read Only) ---
const channelMetrics = ref([
  { label: 'Website Clicks', value: 2450, icon: 'lucide:mouse-pointer-click', color: 'text-indigo-400' },
  { label: 'Google Ad Leads', value: 142, icon: 'lucide:megaphone', color: 'text-rose-400' },
  { label: 'WhatsApp Inquiries', value: 156, icon: 'lucide:message-square', color: 'text-emerald-400' },
  { label: 'Social DMs', value: 89, icon: 'lucide:message-circle', color: 'text-cyan-400' },
  { label: 'Inbound Calls', value: 45, icon: 'lucide:phone-incoming', color: 'text-blue-400' },
  { label: 'SMS Sent', value: 10500, icon: 'lucide:send', color: 'text-amber-400' }
])

// --- FETCH LEADS FROM DIRECTUS ---
// Ensure you have your Directus API URL set (e.g., via useRuntimeConfig().public.directusUrl)
const directusUrl = 'https://your-directus-instance.com'

const { data: fetchedLeads, pending, error } = await useFetch('/items/temp-bookings', {
  baseURL: 'https://cdn.familyhealthdentalclinic.com',
  // Add headers if your endpoint requires authentication:
  headers: { Authorization: 'Bearer -AxGQWrc6b2EQdK8ItyrrRaBBKtEoGRt' },
  transform: (response: any) => {
    return response.data.map((item: any): Lead => {
      
      // Parse the Directus date_created into standard Date object
      const createdDateObj = new Date(item.date_created)
      
      // Format booking date nicely if it exists
      let formattedBookingDate = null
      if (item.booking_date) {
        const bDate = new Date(item.booking_date)
        formattedBookingDate = bDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }

      // Format booking time (assuming standard SQL time string e.g., "14:30:00")
      let formattedBookingTime = item.booking_time
      if (formattedBookingTime && formattedBookingTime.includes(':')) {
        const [hours, minutes] = formattedBookingTime.split(':')
        const hour = parseInt(hours, 10)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const formattedHour = hour % 12 || 12
        formattedBookingTime = `${formattedHour}:${minutes} ${ampm}`
      }

      return {
        id: item.id.toString(),
        name: item.name,
        phone: item.phone,
        service: item.service,
        bookingDate: formattedBookingDate,
        bookingTime: formattedBookingTime,
        
        // Split Directus date_created into the two distinct UI lines
        dateCreated: createdDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timeCreated: createdDateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        
        // Map the boolean fields directly
        hasReachedOut: !!item.reached_out,
        needsFollowUp: !!item.follow_up,
        
        // The current Directus schema doesn't explicitly track the *user* who reached out,
        // or the followUpDone resolution state. Setting defaults to keep the UI from breaking.
        reachedOutBy: null, 
        followUpBy: null,
        followUpDone: false 
      }
    })
  }
})

// Bind the fetched data to our reactive UI state
const leads = computed<Lead[]>(() => fetchedLeads.value || [])

// --- COMPUTED METRICS ---
const contactRate = computed(() => {
  if (leads.value.length === 0) return 0
  const contacted = leads.value.filter(l => l.hasReachedOut).length
  return Math.round((contacted / leads.value.length) * 100)
})

const pendingFollowUps = computed(() => {
  return leads.value.filter(l => l.needsFollowUp && !l.followUpDone).length
})

const completedFollowUps = computed(() => {
  return leads.value.filter(l => l.needsFollowUp && l.followUpDone).length
})

// --- ACTIONS ---
const toggleAction = async (lead: Lead, action: 'reachedOut' | 'followUp' | 'resolveFollowUp') => {
  
  // 1. Optimistic UI Update (Updates instantly for the user)
  if (action === 'reachedOut') {
    lead.hasReachedOut = !lead.hasReachedOut
    lead.reachedOutBy = lead.hasReachedOut ? currentUser : null
  } 
  else if (action === 'followUp') {
    lead.needsFollowUp = !lead.needsFollowUp
    lead.followUpBy = lead.needsFollowUp ? currentUser : null
    if (!lead.needsFollowUp) lead.followUpDone = false
  }
  else if (action === 'resolveFollowUp') {
    lead.followUpDone = !lead.followUpDone
  }

  // 2. Sync changes back to Directus
  try {
    await $fetch(`/items/leads/${lead.id}`, {
      baseURL: directusUrl,
      method: 'PATCH',
      body: {
        reached_out: lead.hasReachedOut,
        follow_up: lead.needsFollowUp
        // Note: You will need to add 'follow_up_done' and 'reached_out_by' 
        // to your Directus schema to save those specific UI states!
      }
    })
  } catch (err) {
    console.error('Failed to update lead status in Directus:', err)
    // Optionally: Revert the optimistic UI update here if the request fails
  }
}
</script>


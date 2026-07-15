<template>
  <div class="mx-auto w-full max-w-7xl px-4 py-8 pb-28 sm:px-6 lg:px-8 space-y-8 relative">
    
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-white">Lead Center</h1>
        <p class="mt-2 text-sm text-slate-400">This page exclusively tracks qualified bookings and leads from Teqciti Connect Booking App Service or added manually by our team from direct conversations with clients.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="rounded-2xl bg-slate-800/40 p-5 ring-1 ring-slate-700/50 backdrop-blur-sm">
        <p class="text-sm font-medium text-slate-400 mb-2">Total Bookings (30 Days)</p>
        <div v-if="pending" class="h-8 w-16 animate-pulse rounded bg-slate-700/50"></div>
        <p v-else class="text-3xl font-bold text-white">{{ totalLeads30Days }}</p>
      </div>
      
      <div class="rounded-2xl bg-slate-800/40 p-5 ring-1 ring-slate-700/50 backdrop-blur-sm relative overflow-hidden">
        <div class="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-500" :style="{ width: pending ? '0%' : `${contactRate}%` }"></div>
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-slate-400 mb-2">Contact Rate (30 Days)</p>
            <div v-if="pending" class="h-8 w-16 animate-pulse rounded bg-slate-700/50"></div>
            <p v-else class="text-3xl font-bold text-white">{{ contactRate }}%</p>
          </div>
          <div class="h-10 w-10 shrink-0 rounded-full bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20">
            <Icon name="lucide:phone-outgoing" size="20" class="text-emerald-400" />
          </div>
        </div>
      </div>

      <div class="rounded-2xl bg-slate-800/40 p-5 ring-1 ring-slate-700/50 backdrop-blur-sm">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-slate-400 mb-2">Pending Follow-ups</p>
            <div v-if="pending" class="h-8 w-16 animate-pulse rounded bg-slate-700/50"></div>
            <p v-else class="text-3xl font-bold text-amber-400">{{ pendingFollowUps }}</p>
          </div>
          <div class="h-10 w-10 shrink-0 rounded-full bg-amber-500/10 flex items-center justify-center ring-1 ring-amber-500/20">
            <Icon name="lucide:clock-alert" size="20" class="text-amber-400" />
          </div>
        </div>
      </div>

      <div class="rounded-2xl bg-slate-800/40 p-5 ring-1 ring-slate-700/50 backdrop-blur-sm">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-slate-400 mb-2 flex items-center gap-1">
              Avg. Response Time
              <span class="text-[10px] text-slate-500 font-normal">(Working Hrs)</span>
            </p>
            <div v-if="pending" class="h-8 w-24 animate-pulse rounded bg-slate-700/50"></div>
            <p v-else class="text-3xl font-bold text-cyan-400">{{ avgResponseTimeFormatted }}</p>
          </div>
          <div class="h-10 w-10 shrink-0 rounded-full bg-cyan-500/10 flex items-center justify-center ring-1 ring-cyan-500/20">
            <Icon name="lucide:timer" size="20" class="text-cyan-400" />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div class="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-[1px]">
        <div class="relative flex items-center justify-between bg-slate-900 rounded-xl px-5 py-3 h-20">
          <div class="flex items-center gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 ring-1 ring-indigo-500/20">
              <Icon name="lucide:award" size="20" class="text-indigo-400" />
            </div>
            <div>
              <p class="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Qualified Leads</p>
              <p class="text-[8px] uppercase tracking-wider font-semibold text-slate-500">From other sources</p>
              <p class="text-lg font-bold text-white">{{ qualifiedMetrics.label }}</p>
            </div>
          </div>
          <p class="text-3xl font-bold text-indigo-400">{{ qualifiedMetrics.count }}</p>
        </div>
      </div>
    </div>

    <div class="border-b border-slate-700/50 pb-4">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <Icon name="lucide:target" size="20" class="text-purple-400" />
          Qualified Bookings
        </h2>
        <p class="mt-1 text-sm text-slate-400 max-w-3xl leading-relaxed">
          These are high-intent contacts who have explicitly submitted a form with the intent to book or manually assisted by our team to book. Use the table below to track follow-ups and ensure no opportunity slips through the cracks.
        </p>
    </div>

    <div class="rounded-2xl bg-slate-800/40 ring-1 ring-slate-700/50 backdrop-blur-sm overflow-hidden flex flex-col min-h-[500px]">
      
      <div class="hidden lg:grid grid-cols-12 gap-6 bg-slate-800/80 px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50 shrink-0">
        <div class="col-span-3">Lead Details</div>
        <div class="col-span-3">Service & Booking</div>
        <div class="col-span-2">Date Received</div>
        <div class="col-span-4 text-right pr-2">Status & Ownership</div>
      </div>

      <div class="divide-y divide-slate-700/50 flex-1 relative">
        
        <div v-if="pending && leads.length === 0" class="p-6 space-y-6">
          <div v-for="i in 5" :key="i" class="flex gap-6 animate-pulse">
            <div class="h-10 w-10 rounded-full bg-slate-700/50 shrink-0"></div>
            <div class="flex-1 space-y-3 py-1">
              <div class="h-4 bg-slate-700/50 rounded w-1/4"></div>
              <div class="h-3 bg-slate-700/50 rounded w-1/3"></div>
            </div>
            <div class="w-32 h-8 bg-slate-700/50 rounded-lg"></div>
          </div>
        </div>

        <div v-else-if="leads.length === 0 && !pending" class="p-12 text-center text-slate-400">
          No leads found.
        </div>
        
        <div 
          v-for="lead in leads" 
          :key="lead.id"
          class="group flex flex-col lg:grid lg:grid-cols-12 gap-x-6 gap-y-4 px-6 py-5 hover:bg-slate-800/60 transition-colors relative"
        >
          <Transition name="toast">
            <div 
              v-if="feedbackStates[lead.id]" 
              :class="[
                'absolute right-6 top-6 z-10 flex items-center gap-2 rounded-lg backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white shadow-lg',
                feedbackStates[lead.id].type === 'error' ? 'bg-red-500/90 shadow-red-500/20' : 'bg-emerald-500/90 shadow-emerald-500/20'
              ]"
            >
              <Icon :name="feedbackStates[lead.id].type === 'error' ? 'lucide:alert-circle' : 'lucide:check-circle-2'" size="14" />
              {{ feedbackStates[lead.id].msg }}
            </div>
          </Transition>  
         
          <div class="col-span-3 flex items-start gap-3">
            
            <div class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700/50 ring-1 ring-slate-600 text-slate-300 font-bold uppercase">
              {{ lead.name.charAt(0) }}
              <span v-if="!lead.hasReachedOut" class="absolute -top-1 -right-1 flex h-3 w-3" title="Action Required">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500 ring-2 ring-slate-800"></span>
              </span>
            </div>

            <div class="min-w-0 flex flex-col items-start w-full">
              <p class="text-sm font-bold text-white truncate w-full">{{ lead.name }}</p>
              <a :href="`tel:${lead.phone}`" class="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-0.5 w-max">
                <Icon name="lucide:phone" size="12" />
                {{ lead.phone }}
              </a>
              
              <div class="mt-2 flex flex-wrap items-center gap-1.5 w-full relative">
                <span class="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                  <Icon name="lucide:globe" size="10" />
                  {{ lead.source || 'Connect App' }}
                </span>

                <div class="relative flex items-center group/attr">
                  <span v-if="lead.attribution && lead.attribution !== 'unattributed'" class="inline-flex items-center gap-1 rounded-md bg-slate-700/50 px-1.5 py-0.5 text-[10px] font-medium text-slate-300 ring-1 ring-inset ring-slate-600 cursor-pointer hover:bg-slate-700" @click="lead.showAttrMenu = !lead.showAttrMenu">
                    <Icon name="lucide:tag" size="10" />
                    {{ lead.attribution }}
                  </span>
                  <button v-else @click="lead.showAttrMenu = !lead.showAttrMenu" class="inline-flex items-center gap-1 rounded-md bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 ring-1 ring-inset ring-slate-700 hover:text-slate-300 hover:bg-slate-700 transition-colors">
                    <Icon name="lucide:plus" size="10" /> Attribute
                  </button>
                  
                  <div v-if="lead.showAttrMenu" class="absolute left-0 top-full mt-1 z-30 flex flex-col gap-0.5 rounded-lg bg-slate-800 p-1 ring-1 ring-slate-700 shadow-xl w-36">
                    <button @click="handleAttribution(lead, 'Physical Marketing')" class="text-left px-2 py-1.5 text-[10px] text-slate-300 hover:bg-slate-700 rounded transition-colors flex items-center justify-between">
                      Physical Marketing
                      <Icon v-if="lead.attribution === 'Physical Marketing'" name="lucide:check" size="10" class="text-emerald-400"/>
                    </button>
                    <button @click="handleAttribution(lead, 'Referral')" class="text-left px-2 py-1.5 text-[10px] text-slate-300 hover:bg-slate-700 rounded transition-colors flex items-center justify-between">
                      Referral
                      <Icon v-if="lead.attribution === 'Referral'" name="lucide:check" size="10" class="text-emerald-400"/>
                    </button>
                    <button v-if="lead.attribution" @click="handleAttribution(lead, 'unattributed')" class="text-left px-2 py-1.5 text-[10px] text-slate-500 hover:bg-slate-700 rounded transition-colors flex items-center justify-between border-t border-slate-700/50 mt-0.5">
                      Clear
                    </button>
                  </div>
                  <div v-if="lead.showAttrMenu" @click.stop="lead.showAttrMenu = false" class="fixed inset-0 z-20"></div>
                </div>
              </div>

            </div>
          </div>

          <div class="col-span-3 flex flex-col justify-center min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <Icon name="lucide:clipboard-list" size="14" class="text-cyan-400 shrink-0" />
              <p class="text-sm font-medium text-slate-200 truncate">{{ lead.service }}</p>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <Icon name="lucide:calendar-check" size="14" class="shrink-0" />
              <span v-if="lead.bookingDate" class="truncate">{{ lead.bookingDate }} at {{ lead.bookingTime }}</span>
              <span v-else class="text-slate-500 italic">Not booked yet</span>
            </div>
            
            <div class="mt-1.5 flex items-center pl-6">
              <span v-if="lead.first_visit" class="inline-flex items-center rounded-sm bg-emerald-500/10 px-1 py-0.5 text-[9px] font-semibold text-emerald-400/80 uppercase tracking-widest ring-1 ring-inset ring-emerald-500/20">
                New Client
              </span>
              <span v-else class="inline-flex items-center rounded-sm bg-slate-800 px-1 py-0.5 text-[9px] font-semibold text-slate-500 uppercase tracking-widest">
                Returning Client
              </span>
            </div>
          </div>

          <div class="col-span-2 flex flex-col justify-center text-sm text-slate-400">
            <p>{{ lead.dateCreated }}</p>
            <p class="text-xs text-slate-500">{{ lead.timeCreated }}</p>
          </div>
            
          <div class="col-span-4 flex flex-col lg:items-end justify-center gap-2 mt-2 lg:mt-0">
            <div class="flex flex-wrap sm:flex-nowrap items-center lg:justify-end gap-3 w-full">
              
              <button 
                @click="!lead.hasReachedOut ? handleContactedAction(lead) : null"
                :disabled="lead.hasReachedOut"
                :class="[
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ring-1 w-full sm:w-auto justify-center',
                  lead.hasReachedOut 
                    ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30 cursor-default opacity-90' 
                    : 'bg-slate-800 text-slate-400 ring-slate-700 hover:text-white hover:bg-slate-700 active:scale-95 cursor-pointer'
                ]"
              >
                <Icon :name="lead.hasReachedOut ? 'lucide:check-circle-2' : 'lucide:circle'" size="16" />
                <span>Contacted</span>
              </button>  

              <div class="flex items-center gap-1 w-full sm:w-auto">
                <button 
                  @click="toggleAction(lead, 'followUp')"
                  :class="[
                    'flex-1 sm:flex-none flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ring-1 justify-center active:scale-95',
                    lead.needsFollowUp ? 'bg-amber-500/10 text-amber-400 ring-amber-500/30' : 'bg-slate-800 text-slate-400 ring-slate-700 hover:text-white hover:bg-slate-700'
                  ]"
                >
                  <Icon :name="lead.needsFollowUp ? 'lucide:clock-4' : 'lucide:clock'" size="16" />
                  <span>Follow-up</span>
                </button>
                
                <button 
                  v-if="lead.needsFollowUp"
                  @click="toggleAction(lead, 'resolveFollowUp')"
                  :class="[
                    'flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg transition-all duration-200 ring-1 active:scale-95',
                    lead.followUpDone ? 'bg-purple-600 text-white ring-purple-500' : 'bg-slate-800 text-slate-400 ring-slate-700 hover:text-white hover:bg-slate-700'
                  ]"
                >
                  <Icon name="lucide:check" size="16" />
                </button>
              </div>
            </div>

            <div class="flex flex-col items-end gap-1 mt-1 px-1">
              <span v-if="lead.assignedTo" class="text-[10px] uppercase tracking-wider text-slate-500 flex items-center gap-1 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-700">
                <Icon name="lucide:user" size="10" /> 
                Assigned: <span class="font-medium text-slate-400">{{ lead.assignedTo }}</span>
              </span>
              <span v-else class="text-[10px] uppercase tracking-wider text-slate-600 flex items-center gap-1">
                <Icon name="lucide:user-minus" size="10" /> Unassigned
              </span>
              
              <span v-if="isOwner && lead.followUpDone && lead.followUpBy" class="text-[10px] uppercase tracking-wider text-purple-400/70 flex items-center gap-1">
                <Icon name="lucide:check-circle" size="10" /> 
                Resolved By: {{ lead.followUpBy }}
              </span>
            </div>
          </div>
        
          <div class="col-span-full mt-2 lg:mt-0">
            
            <div v-if="!lead.isEditingRemark" class="flex items-start gap-3 rounded-xl bg-slate-900/50 px-4 py-3 ring-1 ring-slate-700/50 group/remark transition-colors hover:ring-slate-600">
              
              <div class="relative flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-800 text-slate-400 ring-1 ring-slate-700 mt-0.5">
                <Icon name="lucide:message-square" size="12" />
                <span v-if="lead.hasReachedOut && !lead.remarks" class="absolute -top-1 -right-1 flex h-2 w-2" title="Remarks Needed">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500 ring-[1.5px] ring-slate-900"></span>
                </span>
              </div>
              
              <div class="flex-1 flex justify-between items-start gap-4">
                
                <div v-if="lead.remarks" class="flex-1 min-w-0">
                  <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Client Remarks</p>
                  
                  <div @click="lead.isExpandedRemark = !lead.isExpandedRemark" class="cursor-pointer">
                    <p :class="[
                      'text-sm text-slate-300 italic leading-relaxed whitespace-pre-wrap transition-all', 
                      !lead.isExpandedRemark ? 'line-clamp-1' : ''
                    ]">
                      {{ lead.remarks }}
                    </p>
                  </div>
                  
                  <button 
                    v-if="lead.remarks.length > 120" 
                    @click="lead.isExpandedRemark = !lead.isExpandedRemark" 
                    class="text-xs font-medium text-indigo-400 hover:text-indigo-300 mt-1.5 transition-colors"
                  >
                    {{ lead.isExpandedRemark ? 'Show less' : 'Read full remark' }}
                  </button>
                </div>

                <div v-else class="flex-1 flex items-center pt-0.5">
                  <button @click="editRemark(lead)" class="text-sm font-medium text-slate-500 hover:text-purple-400 flex items-center gap-2 transition-colors">
                    <Icon name="lucide:plus" size="14" />
                    Add Notes / Remarks
                  </button>
                </div>
                
                <button 
                  v-if="lead.remarks"
                  @click="editRemark(lead)"
                  class="shrink-0 p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-700 opacity-0 group-hover/remark:opacity-100 transition-all"
                  title="Edit Remarks"
                >
                  <Icon name="lucide:pen-line" size="14" />
                </button>
              </div>
            </div>

            <div v-if="lead.isEditingRemark" class="rounded-xl bg-slate-900 px-4 py-4 ring-2 ring-purple-500 shadow-lg">
              <div class="flex items-center justify-between mb-3">
                <p class="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Icon name="lucide:pen-line" size="12" />
                  Editing Notes
                </p>
              </div>
              
              <textarea 
                v-model="lead.draftRemark" 
                rows="5" 
                class="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder:text-slate-500 mb-3 resize-y min-h-[100px] shadow-inner"
                placeholder="Type your notes here..."
              ></textarea>
              
              <div class="flex justify-end gap-2">
                <button @click="lead.isEditingRemark = false" class="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                <button @click="saveRemark(lead)" class="px-4 py-2 text-xs font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors shadow-sm active:scale-95">Save Note</button>
              </div>
            </div>

          </div>
        

        </div>
      </div>

      <div class="flex items-center justify-between border-t border-slate-700/50 bg-slate-800/80 px-6 py-4 shrink-0 mt-auto">
        <div class="hidden sm:block">
          <p class="text-sm text-slate-400">
            Showing 
            <span class="font-medium text-white">{{ totalLeadsCount ? (currentPage - 1) * itemsPerPage + 1 : 0 }}</span> 
            to 
            <span class="font-medium text-white">{{ Math.min(currentPage * itemsPerPage, totalLeadsCount) }}</span> 
            of 
            <span class="font-medium text-white">{{ totalLeadsCount }}</span> 
            results
          </p>
        </div>
        <div class="flex flex-1 justify-between sm:justify-end gap-3">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1 || pending"
            class="relative inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 ring-1 ring-inset ring-slate-700 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            Previous
          </button>
          <button 
            @click="nextPage" 
            :disabled="currentPage >= totalPages || pending"
            class="relative inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 ring-1 ring-inset ring-slate-700 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            Next
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

// Notifications
const { show } = useNotifications();
const { currentOrg } = await useCurrentOrg();

// Destructure composable
const {
  isOwner,
  currentPage,
  itemsPerPage,
  feedbackStates,
  pending,
  leads,
  totalLeadsCount,
  totalPages,
  totalLeads30Days,
  contactRate,
  pendingFollowUps,
  avgResponseTimeFormatted,
  qualifiedMetrics,
  isSocketConnected,
  disconnectRealtime,
  prevPage,
  nextPage,
  toggleAction,
  handleAttribution,
  editRemark,
  saveRemark
} = await useLeadCenter();

// --- ONE WAY CONTACTED ACTION + NOTIFICATION ---
const handleContactedAction = async (lead: any) => {
  if (lead.hasReachedOut) return;
  await toggleAction(lead, 'reachedOut');
  
  show({
    title: "Lead Contacted",
    message: `${lead.name} has been successfully marked as contacted.`,
    type: "success"
  });
};

</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>

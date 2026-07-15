<script setup lang="ts">
import { ref } from 'vue';
import type { Org } from '~/schemas/org.schema'; 

const props = defineProps<{
  organization: Org | null;
}>();

const { invoices, isLoading, amountDue, currentBillingCycle, downloadInvoice } = await useBilling(props.organization?.id);
const expandedInvoiceId = ref<string | number | null>(null);

const toggleInvoice = (id: string | number) => {
  expandedInvoiceId.value = expandedInvoiceId.value === id ? null : id;
};

// Formatter: Kenyan Shillings, No Decimals
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('en-KE', { 
    style: 'currency', 
    currency: 'KES',
    maximumFractionDigits: 0 
  }).format(amount);
};
</script>

<template>
  <div class="space-y-8">
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/80 p-6 sm:p-8 ring-1 ring-white/10 shadow-xl shadow-black/20 backdrop-blur-md flex flex-col justify-between">
        <div class="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>

        <h2 class="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-6">Preferred Payment Method</h2>
        
        <div v-if="organization?.preferred_payment_method" class="flex items-center gap-5 mt-auto">
          <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 ring-1 ring-white/10 shadow-inner">
            <Icon name="lucide:credit-card" size="26" class="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
          </div>
          <div>
            <p class="text-lg font-bold text-white tracking-wide">{{ organization.preferred_payment_method }}</p>
            <p class="text-xs text-slate-400 mt-1">Managed via support</p>
          </div>
        </div>
        
        <div v-else class="flex items-center gap-4 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 p-4 mt-auto transition-colors hover:bg-amber-500/10">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
            <Icon name="lucide:wallet" size="20" />
          </div>
          <div>
            <p class="text-sm font-semibold text-amber-400/90">No payment method</p>
            <p class="text-xs text-amber-500/60 mt-0.5">Please contact support to set this up.</p>
          </div>
        </div>
      </div>

      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-950 p-6 sm:p-8 ring-1 ring-white/10 shadow-xl shadow-black/20 backdrop-blur-md flex flex-col justify-between">
        <div class="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div class="flex justify-between items-start mb-6">
          <h2 class="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Amount Due</h2>
          <span v-if="amountDue > 0" class="flex h-2 w-2 rounded-full bg-rose-500 ring-4 ring-rose-500/20 animate-pulse"></span>
        </div>
        
        <div class="mt-auto min-w-0"> <p class="text-xl sm:text-5xl lg:text-[20px] font-black text-white tracking-tighter truncate pb-2 drop-shadow-sm">
            {{ formatMoney(amountDue) }}
          </p>
          <p class="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Icon name="lucide:calendar-clock" size="16" class="text-slate-500" />
            Amount due since <span class="text-slate-200">{{ currentBillingCycle }}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="rounded-2xl bg-slate-900/40 ring-1 ring-white/5 backdrop-blur-sm overflow-hidden shadow-2xl">
      <div class="px-6 py-5 border-b border-white/5 bg-slate-800/20">
        <h2 class="text-base font-bold text-white">Invoices & History</h2>
      </div>
      
      <div v-if="isLoading" class="p-12 flex flex-col items-center justify-center">
        <Icon name="lucide:loader-2" class="animate-spin text-purple-500 mb-4" size="32" />
        <p class="text-sm font-medium text-slate-400 animate-pulse">Fetching billing history...</p>
      </div>

      <div v-else-if="invoices?.length === 0" class="p-16 text-center flex flex-col items-center justify-center">
        <div class="h-16 w-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 ring-1 ring-white/5 shadow-inner">
          <Icon name="lucide:receipt" size="28" class="text-slate-500" />
        </div>
        <p class="text-base font-bold text-white mb-1">No invoices found</p>
        <p class="text-sm text-slate-400">Your organization currently has no billing history.</p>
      </div>

      <div v-else class="divide-y divide-white/5">
        <div 
          v-for="invoice in invoices" 
          :key="invoice.id" 
          class="group flex flex-col transition-all duration-300 hover:bg-slate-800/40"
        >
          <div 
            @click="toggleInvoice(invoice.id)"
            class="flex items-center justify-between p-5 sm:px-6 cursor-pointer select-none"
          >
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 ring-1 ring-white/5 text-slate-400 group-hover:text-purple-400 group-hover:scale-105 group-hover:bg-slate-800/80 transition-all duration-300 shadow-sm">
                <Icon name="lucide:file-text" size="22" />
              </div>
              
              <div>
                <div class="flex items-center gap-3 mb-1">
                  <p class="text-sm font-bold text-white">{{ invoice.invoiceNumber }}</p>
                  
                  <span v-if="invoice.status === 'paid'" class="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 ring-1 ring-inset ring-emerald-500/20 uppercase tracking-wider">Paid</span>
                  <span v-else-if="invoice.status === 'pending'" class="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 ring-1 ring-inset ring-amber-500/20 uppercase tracking-wider">Pending</span>
                  <span v-else class="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400 ring-1 ring-inset ring-rose-500/20 uppercase tracking-wider">Overdue</span>
                </div>
                <p class="text-xs font-medium text-slate-500">
                  Issued: {{ new Date(invoice.issueDate).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' }) }}
                </p>
              </div>
            </div>
            
            <div class="flex items-center gap-5 text-right">
              <!-- UPDATED: invoice.total_amount -> invoice.totalAmount -->
              <p class="text-sm font-bold text-white tracking-tight">{{ formatMoney(invoice.totalAmount) }}</p>
              <div class="h-8 w-8 rounded-full flex items-center justify-center bg-slate-800/0 group-hover:bg-slate-700/50 transition-colors">
                <Icon 
                  name="lucide:chevron-down" 
                  size="18" 
                  class="text-slate-400 transition-transform duration-300"
                  :class="{ 'rotate-180 text-white': expandedInvoiceId === invoice.id }"
                />
              </div>
            </div>
          </div>

          <div 
            v-show="expandedInvoiceId === invoice.id"
            class="px-5 sm:px-6 pb-6 pt-2"
          >
            <div class="flex flex-col sm:flex-row justify-between items-center gap-5 p-4 rounded-xl bg-slate-900/50 ring-1 ring-white/5">
              
              <div class="flex items-center gap-3 w-full sm:w-auto">
                <div class="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center ring-1 ring-white/5">
                  <Icon name="lucide:briefcase" size="14" class="text-slate-400" />
                </div>
                <div>
                  <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Billed For</p>
                  <p class="text-sm font-medium text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                    {{ invoice.project?.name || 'General Brand Services' }}
                  </p>
                </div>
              </div>
              
              <!-- UPDATED: invoice.pdf_file -> invoice.pdfFileId -->
              <button 
                v-if="invoice.pdfFileId"
                @click.stop="downloadInvoice(invoice.id)"
                class="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-lg bg-white/5 hover:bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 transition-all duration-200"
              >
                <Icon name="lucide:download" size="16" />
                Download PDF
              </button>
              <p v-else class="text-xs font-medium text-slate-500 italic w-full sm:w-auto text-center sm:text-right">No PDF attached</p>
            </div>
          </div>

        </div>
      </div>
    </div>
    
  </div>
</template>

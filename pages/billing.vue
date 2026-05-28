<template>
  <div class="mx-auto w-full max-w-3xl px-4 py-8 pb-28 sm:px-6 lg:px-8 space-y-10 relative">
    
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-white">Billing & Payments</h1>
      <p class="mt-2 text-sm text-slate-400">Manage your billing preferences and invoice history.</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Next / Pending Invoice -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 ring-1 ring-slate-700/50 shadow-lg flex flex-col justify-between">
        <div class="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl"></div>
        <div>
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-slate-400">Amount Due</p>
            <span v-if="hasPendingInvoice" class="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20">
              Pending
            </span>
          </div>
          <p class="mt-2 text-3xl font-bold text-white">${{ pendingAmount.toFixed(2) }}</p>
          <div v-if="hasPendingInvoice" class="mt-2 flex items-center text-xs text-slate-400">
            <Icon name="lucide:calendar" size="14" class="mr-1.5 text-amber-400" />
            Due: {{ nextDueDate }}
          </div>
          <div v-else class="mt-2 text-xs text-slate-500">All caught up!</div>
        </div>

        <!-- Dynamic Pay Action on Dashboard -->
        <div class="mt-5" v-if="hasPendingInvoice">
          <button 
            @click="handlePaymentAction"
            class="w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
          >
            <Icon :name="getPaymentIcon(activePreference)" size="16" />
            {{ getPaymentActionText(activePreference) }}
          </button>
        </div>
      </div>

      <!-- Payment Preference -->
      <div class="rounded-2xl bg-slate-800/50 p-6 ring-1 ring-slate-700/50 backdrop-blur-sm flex flex-col justify-between">
        <div>
          <p class="text-sm font-medium text-slate-400">Preferred Payment Method</p>
          
          <!-- State: No Preference -->
          <div v-if="!activePreference" class="mt-3 flex items-center space-x-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700/50 ring-1 ring-slate-600 border border-dashed border-slate-500">
              <Icon name="lucide:help-circle" size="20" class="text-slate-400" />
            </div>
            <div>
              <p class="font-medium text-slate-300">Not Set</p>
              <p class="text-xs text-slate-500">Choose how you'd like to pay.</p>
            </div>
          </div>

          <!-- State: Preference Selected -->
          <div v-else class="mt-3 flex items-center space-x-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700/50 ring-1 ring-slate-600">
              <Icon :name="getPaymentIcon(activePreference)" size="20" class="text-purple-400" />
            </div>
            <div>
              <p class="font-semibold text-white capitalize">
                {{ activePreference === 'mpesa' ? 'M-Pesa' : activePreference }}
              </p>
              <p class="text-xs text-slate-400">
                {{ getPreferenceDescription(activePreference) }}
              </p>
            </div>
          </div>
        </div>
        
        <button 
          @click="togglePreferenceUpdate"
          class="mt-4 w-full rounded-lg bg-slate-700/50 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors ring-1 ring-slate-600"
        >
          {{ isUpdatingPreference ? 'Cancel' : (activePreference ? 'Update Preference' : 'Set Preference') }}
        </button>
      </div>
    </div>

    <!-- Update Preference Selector -->
    <div v-if="isUpdatingPreference" class="animate-in fade-in slide-in-from-top-4 duration-300">
      <div class="rounded-2xl bg-slate-800/30 p-1 ring-1 ring-slate-700/50">
        <div class="p-5 border-b border-slate-700/50">
          <h3 class="text-lg font-semibold text-white">Select Preferred Method</h3>
          <p class="text-sm text-slate-400 mt-1">We don't store your payment details. You'll be redirected to a secure provider at checkout.</p>
          
          <div class="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button @click="tempPreference = 'card'" :class="['flex flex-col items-center justify-center space-y-2 rounded-xl border p-4 text-sm font-medium transition-all', tempPreference === 'card' ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white']">
              <Icon name="lucide:credit-card" size="24" />
              <span>Credit / Debit Card</span>
            </button>
            <button @click="tempPreference = 'mpesa'" :class="['flex flex-col items-center justify-center space-y-2 rounded-xl border p-4 text-sm font-medium transition-all', tempPreference === 'mpesa' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white']">
              <Icon name="lucide:smartphone" size="24" />
              <span>M-Pesa</span>
            </button>
            <button @click="tempPreference = 'cheque'" :class="['flex flex-col items-center justify-center space-y-2 rounded-xl border p-4 text-sm font-medium transition-all', tempPreference === 'cheque' ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white']">
              <Icon name="lucide:file-text" size="24" />
              <span>Manual Cheque</span>
            </button>
          </div>
        </div>
        <div class="p-5 flex justify-end gap-3">
          <button @click="isUpdatingPreference = false" class="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">Cancel</button>
          <button @click="savePreference" :disabled="!tempPreference" class="rounded-lg bg-purple-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Save Preference</button>
        </div>
      </div>
    </div>

    <!-- Invoice History -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-white">Invoice History</h2>
        <button class="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
          Download All
        </button>
      </div>
      
      <div class="overflow-hidden rounded-2xl bg-slate-800/50 ring-1 ring-slate-700/50 backdrop-blur-sm">
        <ul class="divide-y divide-slate-700/50">
          <!-- List Item acts as the Accordion Wrapper -->
          <li v-for="invoice in invoices" :key="invoice.id" class="group flex flex-col transition-colors hover:bg-slate-800/80">
            
            <!-- Main Row (Clickable) -->
            <div 
              @click="toggleInvoiceExpansion(invoice.id)"
              class="flex flex-col sm:flex-row sm:items-center justify-between p-5 cursor-pointer"
            >
              <div class="flex items-center gap-4">
                <div class="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 ring-1 ring-slate-700">
                  <Icon name="lucide:receipt" size="18" class="text-slate-400 group-hover:text-purple-400 transition-colors" />
                </div>
                <div class="space-y-1">
                  <p class="font-semibold text-white flex items-center gap-2">
                    {{ invoice.invoiceNumber }}
                    <span :class="['inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset', statusConfig[invoice.status].classes]">
                      {{ statusConfig[invoice.status].label }}
                    </span>
                  </p>
                  <p class="text-xs text-slate-400">Due: {{ invoice.dueDate }} • {{ invoice.projects.length }} Project(s)</p>
                </div>
              </div>
              
              <div class="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
                <div class="text-left sm:text-right">
                  <p class="font-semibold text-white">${{ invoice.total.toFixed(2) }}</p>
                </div>
                
                <div class="flex items-center gap-2">
                  <button 
                    v-if="invoice.status === 'pending'"
                    @click.stop="handlePaymentAction(invoice)"
                    class="rounded-md bg-purple-600/20 px-3 py-1.5 text-xs font-semibold text-purple-400 hover:bg-purple-600 hover:text-white transition-colors ring-1 ring-inset ring-purple-600/50"
                  >
                    Pay Now
                  </button>
                  <button @click.stop="downloadInvoice(invoice.id)" class="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-700 hover:text-white transition-colors">
                    <Icon name="lucide:download" size="18" />
                  </button>
                  <Icon 
                    :name="expandedInvoiceId === invoice.id ? 'lucide:chevron-down' : 'lucide:chevron-right'" 
                    size="18" 
                    class="text-slate-500 group-hover:text-white transition-all duration-200 hidden sm:block" 
                  />
                </div>
              </div>
            </div>

            <!-- Accordion Dropdown Content -->
            <div 
              v-show="expandedInvoiceId === invoice.id" 
              class="border-t border-slate-700/50 bg-slate-900/50 animate-in slide-in-from-top-2 fade-in duration-200"
            >
              <!-- Projects Breakdown -->
              <div class="divide-y divide-slate-700/50">
                <div v-for="project in invoice.projects" :key="project.id">
                  
                  <div class="bg-slate-800/30 px-6 py-3 flex items-center gap-3 border-b border-slate-700/50">
                    <Icon name="lucide:folder-kanban" size="14" class="text-purple-400" />
                    <h3 class="text-sm font-semibold text-white">{{ project.name }}</h3>
                  </div>

                  <div class="divide-y divide-slate-700/30">
                    <div v-for="service in project.services" :key="service.id" class="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 hover:bg-slate-800/40 transition-colors">
                      <div class="col-span-1 sm:col-span-8 flex gap-3">
                        <Icon name="lucide:corner-down-right" size="14" class="text-slate-600 shrink-0 mt-0.5 hidden sm:block" />
                        <div>
                          <p class="text-sm font-medium text-slate-200">{{ service.name }}</p>
                          <p v-if="service.description" class="mt-1 text-xs text-slate-500 line-clamp-2">{{ service.description }}</p>
                        </div>
                      </div>
                      <div class="col-span-1 sm:col-span-2 flex justify-between sm:block text-sm text-slate-400 sm:text-right">
                        <span class="sm:hidden">Quantity:</span>{{ service.quantity }}
                      </div>
                      <div class="col-span-1 sm:col-span-2 flex justify-between sm:block text-sm font-medium text-white sm:text-right">
                        <span class="sm:hidden text-slate-400 font-normal">Amount:</span>${{ service.amount.toFixed(2) }}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Inline Totals -->
              <div class="border-t border-slate-700/50 bg-slate-800/50 px-6 py-4">
                <div class="ml-auto w-full sm:w-1/3 space-y-2">
                  <div class="flex justify-between text-sm text-slate-400">
                    <span>Subtotal</span>
                    <span class="text-white">${{ invoice.subtotal.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between text-sm text-slate-400">
                    <span>Tax (16%)</span>
                    <span class="text-white">${{ invoice.tax.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>

          </li>
        </ul>
      </div>
    </section>

    <!-- MANUAL CHEQUE INSTRUCTIONS MODAL -->
    <div v-if="showChequeModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="showChequeModal = false"></div>
      <div class="relative w-full max-w-md rounded-2xl bg-slate-900 ring-1 ring-slate-700 shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-200">
        <div class="flex justify-between items-start mb-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/20">
            <Icon name="lucide:building" size="24" class="text-amber-400" />
          </div>
          <button @click="showChequeModal = false" class="text-slate-400 hover:text-white">
            <Icon name="lucide:x" size="20" />
          </button>
        </div>
        <h3 class="text-lg font-bold text-white">Manual Payment Instructions</h3>
        <p class="text-sm text-slate-400 mt-2">Please issue the cheque to our company and deliver it to the address below. Your invoice will be marked as paid once the funds clear.</p>
        
        <div class="mt-6 space-y-4 rounded-xl bg-slate-800/50 p-4 ring-1 ring-slate-700/50">
          <div>
            <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Payee Name</p>
            <p class="font-medium text-white">Techciti Ltd</p>
          </div>
          <div>
            <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Mailing Address</p>
            <p class="font-medium text-white">123 Tech Hub Avenue<br/>Nairobi, Kenya</p>
          </div>
          <div>
            <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Reference</p>
            <p class="font-medium text-white">Include your Invoice Number</p>
          </div>
        </div>
        
        <button @click="showChequeModal = false" class="mt-6 w-full rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors ring-1 ring-slate-600">
          Got it
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
    requiresAuth: true
})

// --- TYPES ---
type PaymentPreference = 'card' | 'mpesa' | 'cheque' | null
type InvoiceStatus = 'paid' | 'pending' | 'overdue'

interface Service {
  id: string
  name: string
  description?: string
  quantity: number | string
  amount: number
}

interface Project {
  id: string
  name: string
  services: Service[]
}

interface Invoice {
  id: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  status: InvoiceStatus
  projects: Project[]
  subtotal: number
  tax: number
  total: number
}

// --- STATE ---
const activePreference = ref<PaymentPreference>(null)
const tempPreference = ref<PaymentPreference>(null)

const isUpdatingPreference = ref(false)
const showChequeModal = ref(false)
const expandedInvoiceId = ref<string | null>(null)

// --- MOCK INVOICE DATA ---
const invoices = ref<Invoice[]>([
  {
    id: 'inv_1',
    invoiceNumber: 'INV-2026-006',
    issueDate: 'May 20, 2026',
    dueDate: 'May 30, 2026',
    status: 'pending',
    subtotal: 1077.58,
    tax: 172.42,
    total: 1250.00,
    projects: [
      {
        id: 'proj_3',
        name: 'May Retainer & Updates',
        services: [
          {
            id: 'srv_6',
            name: 'Nuxt 3 Dashboard Maintenance',
            description: 'Monthly server management, API checks, and component updates.',
            quantity: 1,
            amount: 750.00
          },
          {
            id: 'srv_7',
            name: 'n8n Workflow Adjustments',
            description: 'Updated routing logic for new digital receptionist triggers.',
            quantity: '4 hrs',
            amount: 327.58
          }
        ]
      }
    ]
  },
  {
    id: 'inv_2',
    invoiceNumber: 'INV-2026-005',
    issueDate: 'May 01, 2026',
    dueDate: 'May 15, 2026',
    status: 'paid',
    subtotal: 3100.00,
    tax: 496.00,
    total: 3596.00,
    projects: [
      {
        id: 'proj_1',
        name: 'Digital Agency Scaling',
        services: [
          {
            id: 'srv_1',
            name: 'Meta & TikTok Ads Management',
            description: 'Campaign setup, daily optimization, and A/B testing for performance marketing.',
            quantity: 1,
            amount: 850.00
          },
          {
            id: 'srv_2',
            name: 'Cinematic Video Production',
            description: 'High-contrast lighting shoot and post-production using DaVinci Resolve.',
            quantity: 2,
            amount: 1200.00
          }
        ]
      },
      {
        id: 'proj_2',
        name: 'Dental Clinic Automation',
        services: [
          {
            id: 'srv_3',
            name: 'n8n Automation Setup',
            description: 'Workflow architecture connecting messaging protocols to the CRM.',
            quantity: 1,
            amount: 650.00
          },
          {
            id: 'srv_4',
            name: 'API Integrations',
            description: 'Custom endpoints to bridge the patient timeline canvas.',
            quantity: '10 hrs',
            amount: 400.00
          }
        ]
      }
    ]
  }
])

// --- COMPUTEDS ---
const pendingInvoices = computed(() => invoices.value.filter(inv => inv.status === 'pending' || inv.status === 'overdue'))
const hasPendingInvoice = computed(() => pendingInvoices.value.length > 0)
const pendingAmount = computed(() => pendingInvoices.value.reduce((sum, inv) => sum + inv.total, 0))
const nextDueDate = computed(() => pendingInvoices.value[0]?.dueDate || '')

// --- ACTIONS ---
const togglePreferenceUpdate = () => {
  isUpdatingPreference.value = !isUpdatingPreference.value
  tempPreference.value = activePreference.value
}

const savePreference = () => {
  activePreference.value = tempPreference.value
  isUpdatingPreference.value = false
}

const handlePaymentAction = (invoiceContext?: Invoice) => {
  if (!activePreference.value) {
    isUpdatingPreference.value = true
    return
  }

  if (activePreference.value === 'cheque') {
    showChequeModal.value = true
  } else {
    alert(`Redirecting to secure ${activePreference.value === 'mpesa' ? 'M-Pesa / Paystack' : 'Stripe'} portal...`)
  }
}

const toggleInvoiceExpansion = (id: string) => {
  if (expandedInvoiceId.value === id) {
    expandedInvoiceId.value = null // Close if already open
  } else {
    expandedInvoiceId.value = id // Open new one
  }
}

const downloadInvoice = (id: string) => {
  console.log('Downloading invoice:', id)
}

// --- HELPERS ---
const getPaymentIcon = (pref: PaymentPreference) => {
  if (pref === 'card') return 'lucide:credit-card'
  if (pref === 'mpesa') return 'lucide:smartphone'
  if (pref === 'cheque') return 'lucide:file-text'
  return 'lucide:wallet'
}

const getPreferenceDescription = (pref: PaymentPreference) => {
  if (pref === 'card') return 'Via secure payment partner'
  if (pref === 'mpesa') return 'Mobile money prompt'
  if (pref === 'cheque') return 'Manual bank deposit / mail'
  return ''
}

const getPaymentActionText = (pref: PaymentPreference) => {
  if (!pref) return 'Select a Payment Method'
  if (pref === 'cheque') return 'View Payment Instructions'
  return `Pay Now with ${pref === 'mpesa' ? 'M-Pesa' : 'Card'}`
}

const statusConfig: Record<InvoiceStatus, { label: string, classes: string }> = {
  paid: { label: 'Paid', classes: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' },
  pending: { label: 'Pending', classes: 'bg-amber-500/10 text-amber-400 ring-amber-500/20' },
  overdue: { label: 'Overdue', classes: 'bg-rose-500/10 text-rose-400 ring-rose-500/20' }
}
</script>

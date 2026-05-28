<template>
  <div class="mx-auto w-full max-w-3xl px-4 py-8 pb-28 sm:px-6 lg:px-8 space-y-8">
    
    <!-- Invoice Header & Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold tracking-tight text-white">{{ invoice.invoiceNumber }}</h1>
          <span class="inline-flex items-center rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            Paid
          </span>
        </div>
        <p class="mt-1 text-sm text-slate-400">Issued on {{ invoice.issueDate }}</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors ring-1 ring-slate-600">
          <Icon name="lucide:printer" size="16" />
          Print
        </button>
        <button class="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors">
          <Icon name="lucide:download" size="16" />
          Download PDF
        </button>
      </div>
    </div>

    <!-- The Breakdown (Projects & Services) -->
    <section class="rounded-2xl bg-slate-800/40 ring-1 ring-slate-700/50 backdrop-blur-sm overflow-hidden">
      
      <!-- Table Header (Hidden on small mobile, visible on sm+) -->
      <div class="hidden sm:grid grid-cols-12 gap-4 bg-slate-800/80 px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700/50">
        <div class="col-span-8">Description</div>
        <div class="col-span-2 text-right">Qty / Hrs</div>
        <div class="col-span-2 text-right">Amount</div>
      </div>

      <div class="divide-y divide-slate-700/50">
        <!-- Iterate through Projects -->
        <div v-for="project in invoice.projects" :key="project.id" class="group">
          
          <!-- Project Header Row -->
          <div class="bg-slate-800/30 px-6 py-4 flex items-center gap-3 border-b border-slate-700/50">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700/50 ring-1 ring-slate-600">
              <Icon name="lucide:folder-kanban" size="16" class="text-purple-400" />
            </div>
            <h3 class="text-sm font-semibold text-white">{{ project.name }}</h3>
          </div>

          <!-- Services under this Project -->
          <div class="divide-y divide-slate-700/30">
            <div v-for="service in project.services" :key="service.id" 
                 class="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 transition-colors hover:bg-slate-800/60">
              
              <!-- Service Details -->
              <div class="col-span-1 sm:col-span-8 flex gap-3">
                <Icon name="lucide:corner-down-right" size="16" class="text-slate-600 shrink-0 mt-0.5 hidden sm:block" />
                <div>
                  <p class="text-sm font-medium text-slate-200">{{ service.name }}</p>
                  <p v-if="service.description" class="mt-1 text-xs text-slate-500 line-clamp-2">
                    {{ service.description }}
                  </p>
                </div>
              </div>

              <!-- Quantity (Mobile: Inline, Desktop: Grid) -->
              <div class="col-span-1 sm:col-span-2 flex justify-between sm:block text-sm text-slate-400 sm:text-right">
                <span class="sm:hidden">Quantity:</span>
                {{ service.quantity }}
              </div>

              <!-- Amount (Mobile: Inline, Desktop: Grid) -->
              <div class="col-span-1 sm:col-span-2 flex justify-between sm:block text-sm font-medium text-white sm:text-right">
                <span class="sm:hidden text-slate-400 font-normal">Amount:</span>
                ${{ service.amount.toFixed(2) }}
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- Totals Footer -->
      <div class="bg-slate-800/80 px-6 py-6 border-t border-slate-700/50">
        <div class="ml-auto w-full sm:w-1/2 lg:w-1/3 space-y-3">
          <div class="flex justify-between text-sm text-slate-400">
            <span>Subtotal</span>
            <span class="text-white">${{ invoice.subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-sm text-slate-400">
            <span>Tax (16%)</span>
            <span class="text-white">${{ invoice.tax.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between border-t border-slate-700/50 pt-3">
            <span class="text-base font-bold text-white">Total</span>
            <span class="text-base font-bold text-purple-400">${{ invoice.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// --- TYPES ---
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

interface InvoiceDetail {
  id: string
  invoiceNumber: string
  issueDate: string
  status: 'paid' | 'pending' | 'overdue'
  projects: Project[]
  subtotal: number
  tax: number
  total: number
}

// --- MOCK API DATA ---
const invoice = ref<InvoiceDetail>({
  id: 'inv_1',
  invoiceNumber: 'INV-2026-005',
  issueDate: 'May 01, 2026',
  status: 'paid',
  subtotal: 3100.00,
  tax: 496.00,
  total: 3596.00,
  projects: [
    {
      id: 'proj_1',
      name: 'Black November Campaign',
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
      name: 'Digital Receptionist Implementation',
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
          quantity: 10, // representing hours
          amount: 400.00
        }
      ]
    }
  ]
})
</script>

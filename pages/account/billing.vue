<template>
  <div class="space-y-8">
    <!-- Active Services Section (Unchanged) -->
    <div>
      <h3 class="font-semibold text-lg text-gray-800 dark:text-gray-100">Active Services</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your active subscriptions and services.</p>

      <!-- Responsive grid for the new glass cards -->
      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TBillingActiveServiceCardA
          v-for="service in activeServices"
          :key="service.id"
          :service="service"
        />
      </div>
    </div>
    <!-- New Invoices Section -->
    <BaseCard class="p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-lg text-gray-800 dark:text-gray-100">Billing History</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Review your past invoices and payments.</p>
        </div>
      </div>
      <div class="mt-6 space-y-3">
        <TBillingInvoiceListItemA
          v-for="invoice in invoices"
          :key="invoice.id"
          :invoice="invoice"
        />
      </div>
    </BaseCard>

     </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// --- Type Definitions (Exported so child components can import them) ---
export interface Invoice {
  id: string;
  invoice_number: string;
  created_date_ago: string;
  amount: number;
  status: 'Paid' | 'Pending';
  billed_to: { name: string; address: string };
  issue_date: string;
  due_date: string;
  line_items: { description: string; quantity: number; rate: number; amount: number }[];
  subtotal: number;
  tax_percent: number;
  tax_amount: number;
  total: number;
}

export interface ActiveService {
  id: string;
  name: string;
  price: number;
  renewalDate: string;
  icon: string; // Must be a string
  glowColor: string; // Must be a string
}

// --- Mock Data ---
const activeServices = ref<ActiveService[]>([
  {
    id: 'sub_1',
    name: 'Pro Workspace',
    price: 25,
    renewalDate: 'Feb 15, 2026',
    // Ensure this property exists and has a value
    icon: 'lucide:briefcase',
    // Ensure this property exists and has a value
    glowColor: 'bg-gradient-to-br from-primary-500 to-purple-500'
  },
  {
    id: 'sub_2',
    name: 'API Access',
    price: 49,
    renewalDate: 'Feb 22, 2026',
    // Ensure this property exists and has a value
    icon: 'lucide:cpu',
    // Ensure this property exists and has a value
    glowColor: 'bg-gradient-to-br from-green-500 to-cyan-500'
  },

]);const invoices = ref<Invoice[]>([
  { id: '1', invoice_number: '#INV-45687', created_date_ago: '25 days ago', amount: 153.49, status: 'Pending', billed_to: { name: 'Maya Rosselini', address: '123 River Road, London, UK' }, issue_date: 'Jan 06, 2026', due_date: 'Feb 05, 2026', line_items: [{description: 'Pro Workspace Seat', quantity: 1, rate: 25, amount: 25}, {description: 'API Access Tier 2', quantity: 1, rate: 49, amount: 49}, {description: 'Data Storage (50GB)', quantity: 5, rate: 15, amount: 75}], subtotal: 149, tax_percent: 3, tax_amount: 4.47, total: 153.47 },
  { id: '2', invoice_number: '#INV-45698', created_date_ago: '30 days ago', amount: 275.00, status: 'Paid', billed_to: { name: 'Maya Rosselini', address: '123 River Road, London, UK' }, issue_date: 'Jan 01, 2026', due_date: 'Jan 31, 2026', line_items: [{description: 'Enterprise License', quantity: 1, rate: 275, amount: 275}], subtotal: 275, tax_percent: 0, tax_amount: 0, total: 275.00 },
  { id: '3', invoice_number: '#INV-45592', created_date_ago: '1 month ago', amount: 912.49, status: 'Paid', billed_to: { name: 'Maya Rosselini', address: '123 River Road, London, UK' }, issue_date: 'Dec 01, 2025', due_date: 'Dec 31, 2025', line_items: [{description: 'Annual Platform Fee', quantity: 1, rate: 899, amount: 899}, {description: 'Transaction Fees', quantity: 1, rate: 13.49, amount: 13.49}], subtotal: 912.49, tax_percent: 0, tax_amount: 0, total: 912.49 },
]);
</script>

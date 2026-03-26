<template>
  <!-- Use a dark background for the entire page -->
  <div v-if="service" class="bg-muted-900 -m-8 p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col">
    <!-- Main Content Area (grows to fill space) -->
    <div class="flex-grow">
      <!-- Header with New Action Buttons -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-x-4">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-muted-800">
            <img :src="service.plans.find(p => p.id === selectedPlanId)?.logo" :alt="service.title" class="size-10 object-contain" />
          </div>
          <div>
            <h1 class="font-sans text-2xl font-bold text-white">{{ service.title }}</h1>
            <div class="mt-1 flex items-center gap-x-2">
              <div class="h-2 w-2 rounded-full" :class="service.status === 'active' ? 'bg-green-500' : 'bg-muted-500'"></div>
              <p class="text-sm font-medium capitalize" :class="service.status === 'active' ? 'text-green-400' : 'text-muted-400'">
                {{ service.status.replace('_', ' ') }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-x-2">
          <BaseButton color="light" size="sm" :to="`/services/${service.id}/dashboard`">
            <Icon name="lucide:layout-dashboard" class="size-4" />
            <span>Go to Service</span>
          </BaseButton>
          <BaseButton v-if="service.status === 'inactive'" color="success" size="sm" @click="toggleServiceStatus">
            <Icon name="lucide:play" class="size-4" />
            <span>Activate</span>
          </BaseButton>
          <BaseButton v-if="service.status === 'active'" color="danger" variant="pastel" size="sm" @click="toggleServiceStatus">
            <Icon name="lucide:square" class="size-4" />
            <span>Disable</span>
          </BaseButton>
        </div>
      </div>

      <!-- Main Two-Column Layout (re-architected for mobile) -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 lg:gap-x-12">
        <!-- Left Column -->
        <div class="flex flex-col gap-y-8 md:col-span-1 lg:col-span-2">
          <PlanSelector v-model="selectedPlanId" :plans="service.plans" />
          
          <!-- This will be BELOW the plan selector on mobile -->
          <div class="block lg:hidden">
            <PlanDetails :plan="selectedPlan" :billing-cycle="billingCycle" />
          </div>

          <!-- Team Seats (Redesigned) -->
          <div class="rounded-xl bg-muted-800 p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-semibold text-white">Team Seats</h3>
                <p class="text-sm text-muted-400">Manage who has access to this service.</p>
              </div>
              <BaseButton size="sm" :to="`/services/${service.id}/team`">
                <span>Manage Members</span>
              </BaseButton>
            </div>
            <div class="mt-4 flex items-center gap-x-3">
              <div class="flex size-10 items-center justify-center rounded-full bg-primary-500/20 text-primary-400 font-bold text-lg">
                {{ service.team.length }}
              </div>
              <p class="text-sm text-muted-400">users currently have access.</p>
            </div>
          </div>

          <!-- Options (Redesigned with new component) -->
          <div class="rounded-xl bg-muted-800 p-6 space-y-4">
            <h3 class="font-semibold text-white mb-2">Options</h3>
            <OptionToggle 
              v-model="options.sendInvoices"
              icon="lucide:mail"
              label="Email Invoices"
              sublabel="Send new invoices to my inbox"
            />
             <OptionToggle 
              v-model="options.warnBeforeBilling"
              icon="lucide:bell-ring"
              label="Billing Reminders"
              sublabel="Warn me before the billing period"
            />
          </div>

          <!-- Billing Cycle -->
          <div class="rounded-xl bg-muted-800 p-6">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-white">Billing Cycle</h3>
              <NuxtLink :to="`${app.dashboardHome}/account/billing`" class="text-sm text-primary-400 hover:underline">My Invoices</NuxtLink>
            </div>
            <div class="mt-4 flex gap-x-4">
              <BaseRadio v-model="billingCycle" name="billing-cycle" value="monthly" label="Monthly" />
              <BaseRadio v-model="billingCycle" name="billing-cycle" value="yearly" label="Yearly" />
            </div>
          </div>
        </div>

        <!-- Right Column (Hidden on mobile) -->
        <div class="hidden lg:block">
          <PlanDetails :plan="selectedPlan" :billing-cycle="billingCycle" />
        </div>
      </div>
    </div>

    <!-- Floating Save Button Bar (Polished) -->
    <div class="sticky bottom-0 mt-12 border-t border-muted-800 bg-muted-900/80 backdrop-blur-sm px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-end">
        <BaseButton color="primary" size="lg" rounded="lg" class="w-full sm:w-auto">
          <Icon name="lucide:check" class="size-4" />
          <span>Save Changes</span>
        </BaseButton>
      </div>
    </div>
  </div>

  <!-- Loading / Not Found States -->
  <div v-else class="p-8 text-center bg-muted-900 -m-8 min-h-screen">
    <p v-if="pending" class="text-muted-400">Loading service...</p>
    <p v-else class="text-white">Service not found.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';

// --- Type Definitions ---
export interface Plan {
  id: string;
  name: string;
  description: string;
  logo: string;
  priceMonthly: number;
  priceYearly: number;
  longDescription: string;
  features: string[];
}
export interface Service {
  id: string;
  title: string;
  plans: Plan[];
  team: { name: string, avatar: string }[];
}

// --- MOCK DATA (In a real app, this would be a single API call for the service) ---
const serviceData: Service = {
  id: 's1',
  title: 'Project Management App',
  status: 'active',
  team: [{ name: 'User 1', avatar: '/img/illustrations/1.png' }, { name: 'User 2', avatar: '/img/avatars/1.png' }, { name: 'User 3', avatar: '/img/avatars/3.png' }],
  plans: [
    { id: 'starter', name: 'Huro Starter', description: 'Plan for starters', logo: '/img/illustrations/1.png', priceMonthly: 0, priceYearly: 0, longDescription: 'A basic plan to get you started with our core features and functionalities.', features: ['2 seats', '5 projects', '10GB storage', 'Live updates', 'Payments', '2 Addons'] },
    { id: 'pro', name: 'Huro Pro', description: 'For professionals', logo: '/img/illustrations/2.png', priceMonthly: 99, priceYearly: 89, longDescription: 'Huro Pro has incredible features and each plan perfectly adapts to your company, whether it is a small business or a bigger one.', features: ['8 seats', '150 projects', '100GB storage', 'Live updates', 'Payments', '3 Addons'] },
    { id: 'business', name: 'Huro Business', description: 'For serious people', logo: '/img/illustrations/3.png', priceMonthly: 199, priceYearly: 179, longDescription: 'Our business plan offers advanced features for growing teams and companies.', features: ['20 seats', 'Unlimited projects', '500GB storage', 'Priority support', 'Advanced analytics', '10 Addons'] },
    { id:- 'enterprise', name: 'Huro Enterprise', description: 'For big companies', logo: '/img/illustrations/4.png', priceMonthly: 399, priceYearly: 349, longDescription: 'The ultimate plan for large organizations requiring dedicated support and infrastructure.', features: ['Unlimited seats', 'Unlimited projects', 'Dedicated storage', '24/7 support', 'SSO', 'All Addons'] },
  ],
};
// --- END MOCK DATA ---

const route = useRoute();
const app = useAppConfig();
const service = ref<Service | null>(null);
const pending = ref(true);

// Page State
const selectedPlanId = ref('pro'); // Default to the 'pro' plan
const billingCycle = ref<'monthly' | 'yearly'>('yearly');
const options = reactive({
  sendInvoices: true,
  warnBeforeBilling: false,
});

// Computed property to get the full object of the selected plan
const selectedPlan = computed(() => {
  return service.value?.plans.find(p => p.id === selectedPlanId.value) || null;
});

onMounted(() => {
  // In a real app, you would fetch the service data here based on route.params.id
  // For now, we'll just use the mock data.
  const serviceId = route.params.id as string;
  if (serviceData.id === serviceId) {
    service.value = serviceData;
  }
  pending.value = false;
});

const toggleServiceStatus = () => {
  if (!service.value) return;
  const wasActive = service.value.status === 'active';
  service.value.status = wasActive ? 'inactive' : 'active';
  notifications.show({
    type: wasActive ? 'warning' : 'success',
    title: `Service ${wasActive ? 'Disabled' : 'Activated'}`,
    message: `${service.value.title} is now ${service.value.status}.`,
  });
}

definePageMeta({
  layout: 'sidebar',
});
</script>

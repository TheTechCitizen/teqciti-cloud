<template>
  <div class="mx-auto w-full max-w-6xl px-4 py-8 pb-28 sm:px-6 lg:px-8 space-y-8 relative">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
  <div>
    <h1 class="text-3xl font-bold tracking-tight text-white">Settings</h1>
    <p class="mt-2 text-sm text-slate-400">Manage your organization, team members, and personal preferences.</p>
  </div>
  
  <div v-if="currentOrg" class="flex items-center gap-3 bg-slate-800/50 px-4 py-2.5 rounded-xl ring-1 ring-slate-700/50 backdrop-blur-sm">
    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 ring-1 ring-slate-700 text-slate-400">
      <Icon name="lucide:shield" size="14" v-if="['Owner', 'Admin'].includes(myOrgRole)" />
      <Icon name="lucide:user" size="14" v-else />
    </div>
    <div class="flex flex-col justify-center">
        <span class="text-[10px] font-medium text-slate-500 uppercase tracking-wider leading-none mb-1">{{ user.first_name }} {{ user.last_name }} </span>
      <span 
        class="text-xs font-bold leading-none"
        :class="{
          'text-amber-400': myOrgRole === 'Owner',
          'text-purple-400': myOrgRole === 'Admin',
          'text-slate-300': !['Owner', 'Admin'].includes(myOrgRole)
        }"
      >
        {{ myOrgRole || 'Member' }}
      </span>
    </div>
  </div>
</div>

    <div class="flex flex-col md:flex-row gap-8 items-start">
      
      <aside class="w-full md:w-64 shrink-0 space-y-1">
        <button 
          v-for="tab in visibleTabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all',
            activeTab === tab.id ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700/50' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          ]"
        >
          <Icon :name="tab.icon" size="18" :class="activeTab === tab.id ? 'text-purple-400' : ''" />
          {{ tab.name }}
        </button>
      </aside>

      <main class="flex-1 w-full min-w-0 space-y-6">
        
          <section v-if="activeTab === 'org'" class="animate-in fade-in duration-300 space-y-6">
              <div class="rounded-2xl bg-slate-800/40 p-6 sm:p-8 ring-1 ring-slate-700/50 backdrop-blur-sm relative overflow-hidden">
                  <div class="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none"></div>

    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700/50 pb-6 mb-6 relative z-10 gap-4">
      <div class="flex items-center gap-4">
        <img src="/img/illustrations/1.png" alt="Company Logo" class="w-16 h-16 rounded-xl object-cover bg-slate-900 ring-1 ring-slate-700 shadow-lg" />
        <div>
          <h2 class="text-xl font-bold text-white">Organization Details</h2>
        </div>
      </div>
      
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
          Active
        </span>
      </div>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
      <div>
        <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Company Name</label>
        <input v-model="orgName" type="text" disabled :class="inputClasses" />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Primary Contact Person</label>
        <input v-model="contactPerson" type="text" disabled :class="inputClasses" />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Physical Location</label>
        <input v-model="address" type="text" disabled :class="inputClasses" />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
        <input v-model="phone" type="text" disabled :class="inputClasses" />
      </div>
      <div class="sm:col-span-2">
        <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Email</label>
        <input v-model="email" type="email" disabled :class="inputClasses" />
      </div>
    </div>

    <div class="mt-8 flex justify-start border-t border-slate-700/50 pt-6 relative z-10">
        <TSupportTriggerD 
      variant="ghost" 
      text="Notice any issues with these details? Let us know." 
      department="manager" 
      icon="lucide:flag" 
      class="!text-slate-400 hover:!text-purple-400 hover:!bg-transparent !px-0"
    />
         </div>
  </div>

  </section>

  <!--

<section v-if="activeTab === 'team' && can('view_team')" class="animate-in fade-in duration-300 space-y-6">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h2 class="text-xl font-bold text-white">Team Members</h2>
      <p class="text-sm text-slate-400 mt-1">Manage who has access to this workspace.</p>
    </div>
  -->
    
    <!--
    <button 
      v-if="can('manage_team')"
      @click="showAddUserModal = true"
      class="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
    >
      <Icon name="lucide:user-plus" size="16" />
      Add User
    </button>
    -->
    <!--
  </div>

  <div class="rounded-2xl bg-slate-800/40 ring-1 ring-slate-700/50 backdrop-blur-sm overflow-hidden">
    <div class="divide-y divide-slate-700/50">
      
      <div v-if="!currentOrg?.clientUser?.length" class="p-8 text-center text-slate-400">
        No team members found.
      </div>
      
      <div v-else v-for="member in currentOrg.clientUser" :key="member.id" class="flex items-center justify-between p-5 hover:bg-slate-800/60 transition-colors">
        <div class="flex items-center gap-4">
          
          <img 
            v-if="member.user.avatar" 
            src="/img/illustrations/1.png" 
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 object-cover ring-1 ring-slate-600" 
            alt="User Avatar"
          />
          <div v-else class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 ring-1 ring-slate-600 text-white font-bold uppercase">
            {{ member.user.firstName.charAt(0) }}
          </div>
          
          <div>
            <div class="flex items-center gap-2">
              <p class="text-sm font-bold text-white max-w-[150px] sm:max-w-xs truncate">
                {{ member.user.firstName }} {{ member.user.lastName }}
              </p>
              
              <span v-if="member.user.id === user?.id" class="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-400 ring-1 ring-inset ring-blue-500/20">
                You
              </span>

              <span 
                class="rounded px-1.5 py-0.5 text-[10px] font-bold ring-1 ring-inset"
                :class="{
                  'bg-amber-500/10 text-amber-400 ring-amber-500/20': member.orgRole === 'Owner',
                  'bg-purple-500/10 text-purple-400 ring-purple-500/20': member.orgRole === 'Admin',
                  'bg-slate-700 text-slate-300 ring-slate-600': member.orgRole === 'Member'
                }"
              >
                {{ member.orgRole }}
              </span>
            </div>
            
            <div class="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span class="truncate">{{ member.user.email }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4 text-right">
          <button 
            v-if="canEdit && member.orgRole !== 'Owner' && member.user.id !== user?.id" 
            @click="removeTeamMember(member.id)"
            :disabled="isRemovingId === member.id"
            class="text-slate-500 hover:text-rose-400 transition-colors p-2 rounded-lg hover:bg-rose-500/10 disabled:opacity-50"
            title="Remove from Workspace"
          >
            <Icon v-if="isRemovingId === member.id" name="lucide:loader-2" class="animate-spin" size="18" />
            <Icon v-else name="lucide:user-minus" size="18" />
          </button>
        </div>
        -->
        <!--
      </div>

    </div>
  </div>
</section>

        -->



       <section v-if="activeTab === 'security'" class="animate-in fade-in duration-300 space-y-6">
  <div class="rounded-2xl bg-slate-800/40 p-6 sm:p-8 ring-1 ring-slate-700/50 backdrop-blur-sm">
    <h2 class="text-xl font-bold text-white mb-1">Change Password</h2>
    <p class="text-sm text-slate-400 mb-6">Ensure your account is using a long, random password to stay secure.</p>
    
    <div 
      v-if="passwordMessage" 
      class="mb-6 rounded-lg p-4 text-sm font-medium ring-1 ring-inset"
      :class="passwordMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' : 'bg-rose-500/10 text-rose-400 ring-rose-500/20'"
    >
      {{ passwordMessage.text }}
    </div>

    <form @submit.prevent="handlePasswordUpdate" class="space-y-4 max-w-md">
    <div>
        <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
          New Password
        </label>
        <input 
          v-model="newPassword"
          type="password" 
          required
          minlength="8"
          class="w-full rounded-xl border-0 bg-slate-900 py-2.5 px-4 text-sm text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500" 
        />
      </div>
      
      <button 
        type="submit"
        :disabled="isUpdatingPassword"
        class="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Icon v-if="isUpdatingPassword" name="lucide:loader-2" class="animate-spin" size="16" />
        {{ isUpdatingPassword ? 'Updating...' : 'Update Password' }}
      </button>
    </form>
  </div>
</section>
      
<section v-if="activeTab === 'notifications'" class="animate-in fade-in duration-300 space-y-6">

    <IUserPreferencesCard 
      title="Notification Preferences"
      description="Choose what updates you want to receive and where."
      :config="notificationSettings"
    />

    <IUserPreferencesCard 
      title="Display Settings"
      description="Customize how the application looks for you."
      :config="displaySettings"
    />

  </section>

  <section v-if="activeTab === 'billing' && can('view_billing')" class="animate-in fade-in duration-300">
    
    <BillingPanel :organization="currentOrg" />

  </section>

  <section v-if="activeTab === 'account'" class="animate-in fade-in duration-300 space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-xl font-bold text-white">Account Manager</h2>
      <p class="text-sm text-slate-400 mt-1">Your dedicated Relationship Manager</p>
    </div>
  </div>

  <div class="rounded-2xl bg-slate-800/40 ring-1 ring-slate-700/50 backdrop-blur-sm overflow-hidden">
    
    <div v-if="manager && manager.length > 0" class="divide-y divide-slate-700/50">
      <div v-for="user in manager" :key="user.id" class="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 hover:bg-slate-800/60 transition-colors gap-5">
        
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-lg font-bold uppercase shadow-lg shadow-purple-500/20">
            {{ user.name.charAt(0) }}
          </div>
          
          <div>
            <div class="flex items-center gap-2 mb-1">
              <p class="text-base font-bold text-white">{{ user.name }}</p>
              <span class="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-400 ring-1 ring-inset ring-purple-500/20 uppercase tracking-wider">
                Relationship Manager
              </span>
            </div>
            
            <div class="flex flex-wrap items-center gap-4 text-sm text-slate-400 mt-1.5">
              <a v-if="user.phone" :href="`tel:${user.phone}`" class="flex items-center gap-1.5 hover:text-white transition-colors">
                <Icon name="lucide:phone" size="14" />
                <span>{{ user.phone }}</span>
              </a>
              <a v-if="user.email" :href="`mailto:${user.email}`" class="flex items-center gap-1.5 hover:text-white transition-colors">
                <Icon name="lucide:mail" size="14" />
                <span>{{ user.email }}</span>
              </a>
            </div>
          </div>
        </div>

        <div class="shrink-0 w-full sm:w-auto">
          <a :href="`mailto:${user.email || ''}`" class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-2.5 sm:py-2 text-sm font-semibold text-white hover:bg-slate-600 transition-colors">
            <Icon name="lucide:message-square" size="16" />
            Send Message
          </a>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center p-10 sm:p-14 text-center">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/80 ring-1 ring-slate-700 text-slate-500 mb-5 shadow-inner">
        <Icon name="lucide:user-minus" size="28" />
      </div>
      <h3 class="text-lg font-bold text-white mb-2">No Manager Assigned</h3>
      <p class="text-sm text-slate-400 max-w-sm mx-auto">
        Your account doesn't have a dedicated relationship manager assigned right now. Our general support team is still here to help!
      </p>
      <button class="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-600 transition-colors">
        <Icon name="lucide:life-buoy" size="16" />
        Contact Support
      </button>
    </div>

  </div>
</section>

<section v-if="activeTab === 'support'" class="animate-in fade-in duration-300">
      <TSupportPanelD :organizationId="currentOrg.id" />
    </section>

      </main>
    </div>


    <TSupportModalD v-if="currentOrg" :organizationId="currentOrg.id" />


    <div v-if="showAddUserModal" class="fixed inset-0 z-30 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" @click="showAddUserModal = false"></div>
      
      <div class="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-slate-900 ring-1 ring-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300">
        <div class="flex items-center justify-between border-b border-slate-700/50 bg-slate-800/90 px-6 py-4 backdrop-blur-md">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <Icon name="lucide:user-plus" size="18" class="text-purple-400" />
            Invite Team Member
          </h3>
          <button @click="showAddUserModal = false" class="text-slate-400 hover:text-white transition-colors">
            <Icon name="lucide:x" size="20" />
          </button>
        </div>

        <div class="p-6 space-y-5">
          <div>
            <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
            <input type="text" placeholder="e.g. Jane Doe" class="w-full rounded-xl border-0 bg-slate-950 py-3 px-4 text-sm text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500" />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Email or Username</label>
            <input type="text" placeholder="e.g. reception@domain.com or jane_r" class="w-full rounded-xl border-0 bg-slate-950 py-3 px-4 text-sm text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500" />
            <p class="mt-1.5 text-[10px] text-slate-500">This connects their actions to task tracking and lead attributions.</p>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Department</label>
            <select class="w-full rounded-xl border-0 bg-slate-950 py-3 px-4 text-sm text-white ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-purple-500 appearance-none">
              <option value="reception">Reception / Front Desk</option>
              <option value="marketing">Marketing</option>
              <option value="management">Management</option>
              <option value="clinical">Clinical Staff</option>
            </select>
          </div>

          <div class="pt-2">
            <button @click="showAddUserModal = false" class="w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-purple-500 transition-all">
              Send Invite
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
    requiresAuth: true
});

import { ref, computed } from 'vue'

const { user, changePassword } = useAuth(); 

const { can } = usePermissions();

const { currentOrg, orgName, myOrgRole, contactPerson, accountManager, address, phone, email, logoReference, pending } = await useCurrentOrg();

// --- STATE: NAVIGATION ---
const rawTabs = [
  { id: 'org', name: 'Organization', icon: 'lucide:building-2' },
  { id: 'team', name: 'Team & Users', icon: 'lucide:users', capability: 'view_team' },
  { id: 'security', name: 'Security', icon: 'lucide:shield-check' },
  { id: 'notifications', name: 'Notifications', icon: 'lucide:bell' },
  { id: 'billing', name: 'Billing', icon: 'lucide:coins', capability: 'view_billing' },
  { id: 'account', name: 'Account Manager', icon: 'lucide:user-star' },
  { id: 'support', name: 'Support', icon: 'lucide:message-circle-question-mark' }
]

// <script setup>
const visibleTabs = computed(() => {
  return rawTabs.filter(tab => {
    // 1. If the tab has no capability requirement, always show it
    if (!tab.capability) return true;
    
    // 2. If it DOES have a requirement, check the engine
    return can(tab.capability);
  });
});

// Set the default active tab to the first visible one
const activeTab = ref(visibleTabs.value[0]?.id || 'org');

// --- STATE: DATA ---
const showAddUserModal = ref(false)


const manager = ref([
  { id: 'a', name: 'Eve', phone: '0740761950' }
])


// 1. Define the configuration for your Notifications block
const notificationSettings = {
  projectUpdates: {
    title: 'Project Updates',
    description: 'Get notified when someone assigns you to a task.',
    enabled: true
  },
  marketing: {
    title: 'Marketing & News',
    description: 'Receive updates about new features and promotions.',
    enabled: false
  },
  securityAlerts: {
    title: 'Security Alerts',
    description: 'Crucial notifications about your account security.',
    enabled: true 
  }
};

// 2. (Example) Define configuration for a future Display block
const displaySettings = {
  compactMode: {
    title: 'Compact Mode',
    description: 'Hide avatars and use less padding in lists.',
    enabled: false
  }
};

// --- REMOVE MEMBER LOGIC ---
const isRemovingId = ref<string | null>(null);

const removeMember = async (junctionId: string) => {
  if (!confirm('Remove this user from the workspace?')) return;
  if (!currentOrg.value?.id) return;

  isRemovingId.value = junctionId;

  try {
    const orgService = useDataService('org');
    
    // We update the organization and tell Directus to sever this specific bridge ID
    await orgService.update(currentOrg.value.id, {
      client_users: {
        delete: [junctionId] 
      }
    });

    // Sync the global memory so the row instantly disappears
    await refresh();
    
  } catch (error) {
    console.error("Failed to remove user", error);
  } finally {
    isRemovingId.value = null;
  }
};

// 1. Changing Password Logic

// Form State
const newPassword = ref('');
const isUpdatingPassword = ref(false);
const passwordMessage = ref<{ type: 'success' | 'error', text: string } | null>(null);

const handlePasswordUpdate = async () => {
  // Basic validation
  if (newPassword.value.length < 8) {
    passwordMessage.value = { type: 'error', text: 'New password must be at least 8 characters.' };
    return;
  }
  
  isUpdatingPassword.value = true;
  passwordMessage.value = null;

  // 2. Pass the new password to your composable method
  const success = await changePassword(newPassword.value);

  // 3. Handle the boolean response
  if (success) {
    passwordMessage.value = { type: 'success', text: 'Password updated successfully.' };
    
    // Clear the form on success
    newPassword.value = '';
  } else {
    // If it returns false, the composable already logged the error, so we just show the UI warning.
    passwordMessage.value = { 
      type: 'error', 
      text: 'Failed to update password. Please ensure your session is active and try again.' 
    };
  }

  isUpdatingPassword.value = false;
};

// --- HELPERS ---
const inputClasses = computed(() => {
  return [
    'w-full rounded-xl border-0 py-2.5 px-4 text-sm ring-1 ring-inset transition-colors bg-slate-800/50 text-slate-400 ring-transparent cursor-not-allowed',
  ]
})
</script>

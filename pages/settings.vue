<template>
  <div class="mx-auto w-full max-w-6xl px-4 py-8 pb-28 sm:px-6 lg:px-8 space-y-8 relative">
    
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p class="mt-2 text-sm text-slate-400">Manage your organization, team members, and personal preferences.</p>
      </div>
      
      <label class="flex items-center gap-2 text-sm text-slate-400 cursor-pointer hover:text-white transition-colors bg-slate-800/50 px-4 py-2 rounded-lg ring-1 ring-slate-700/50">
        <input type="checkbox" v-model="isOwner" class="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-600 focus:ring-offset-slate-900" />
        Simulate Owner Role
      </label>
    </div>

    <div class="flex flex-col md:flex-row gap-8 items-start">
      
      <aside class="w-full md:w-64 shrink-0 space-y-1">
        <button 
          v-for="tab in tabs" 
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
            
            <h2 class="text-xl font-bold text-white mb-6">Organization Details</h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
              <div>
                <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Company Name</label>
                <input v-model="org.name" type="text" :disabled="!isOwner" :class="inputClasses" />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Primary Contact Person</label>
                <input v-model="org.contactPerson" type="text" :disabled="!isOwner" :class="inputClasses" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Physical Location</label>
                <input v-model="org.location" type="text" :disabled="!isOwner" :class="inputClasses" />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                <input v-model="org.phone" type="text" :disabled="!isOwner" :class="inputClasses" />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Billing Email</label>
                <input v-model="org.email" type="email" :disabled="!isOwner" :class="inputClasses" />
              </div>
            </div>

            <div v-if="isOwner" class="mt-8 flex justify-end border-t border-slate-700/50 pt-6">
              <button class="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </section>

        <section v-if="activeTab === 'team'" class="animate-in fade-in duration-300 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-white">Team Members</h2>
              <p class="text-sm text-slate-400 mt-1">Manage who has access to this workspace.</p>
            </div>
            <button 
              v-if="isOwner"
              @click="showAddUserModal = true"
              class="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
            >
              <Icon name="lucide:user-plus" size="16" />
              Add User
            </button>
          </div>

          <div class="rounded-2xl bg-slate-800/40 ring-1 ring-slate-700/50 backdrop-blur-sm overflow-hidden">
            <div class="divide-y divide-slate-700/50">
              <div v-for="user in team" :key="user.id" class="flex items-center justify-between p-5 hover:bg-slate-800/60 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 ring-1 ring-slate-600 text-white font-bold uppercase">
                    {{ user.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <p class="text-sm font-bold text-white">{{ user.name }}</p>
                      <span v-if="user.role === 'Owner'" class="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 ring-1 ring-inset ring-amber-500/20">Owner</span>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{{ user.identifier }}</span>
                      <span>•</span>
                      <span class="capitalize text-purple-400">{{ user.department }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center gap-6 text-right">
                  <div class="hidden sm:block">
                    <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Last Active</p>
                    <p class="text-sm text-slate-300 mt-0.5">{{ user.lastActive }}</p>
                  </div>
                  <button v-if="isOwner && user.role !== 'Owner'" class="text-slate-500 hover:text-rose-400 transition-colors p-2">
                    <Icon name="lucide:trash-2" size="18" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section v-if="activeTab === 'security'" class="animate-in fade-in duration-300 space-y-6">
          <div class="rounded-2xl bg-slate-800/40 p-6 sm:p-8 ring-1 ring-slate-700/50 backdrop-blur-sm">
            <h2 class="text-xl font-bold text-white mb-1">Change Password</h2>
            <p class="text-sm text-slate-400 mb-6">Ensure your account is using a long, random password to stay secure.</p>
            
            <div class="space-y-4 max-w-md">
              <div>
                <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Current Password</label>
                <input type="password" class="w-full rounded-xl border-0 bg-slate-900 py-2.5 px-4 text-sm text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">New Password</label>
                <input type="password" class="w-full rounded-xl border-0 bg-slate-900 py-2.5 px-4 text-sm text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500" />
              </div>
              <button class="rounded-lg bg-slate-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-600 transition-colors mt-2">
                Update Password
              </button>
            </div>
          </div>

          <div class="rounded-2xl bg-slate-800/40 p-6 sm:p-8 ring-1 ring-slate-700/50 backdrop-blur-sm">
            <h2 class="text-xl font-bold text-white mb-1">Active Sessions</h2>
            <p class="text-sm text-slate-400 mb-6">Devices that have recently logged into your account.</p>
            
            <div class="space-y-4">
              <div v-for="session in sessions" :key="session.id" class="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 ring-1 ring-slate-700/50">
                <div class="flex items-center gap-4">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                    <Icon :name="session.device === 'Mobile' ? 'lucide:smartphone' : 'lucide:laptop'" size="20" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-white flex items-center gap-2">
                      {{ session.browser }} on {{ session.os }}
                      <span v-if="session.isCurrent" class="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">Current</span>
                    </p>
                    <p class="text-xs text-slate-400 mt-0.5">{{ session.location }} • {{ session.ip }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-xs text-slate-500">{{ session.lastActive }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section v-if="activeTab === 'notifications'" class="animate-in fade-in duration-300 space-y-6">
          <div class="rounded-2xl bg-slate-800/40 p-6 sm:p-8 ring-1 ring-slate-700/50 backdrop-blur-sm">
            <h2 class="text-xl font-bold text-white mb-1">Notification Preferences</h2>
            <p class="text-sm text-slate-400 mb-6">Choose what updates you want to receive and where.</p>
            
            <div class="space-y-6">
              <div v-for="(setting, key) in notifications" :key="key" class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-bold text-white">{{ setting.title }}</p>
                  <p class="text-xs text-slate-400 mt-0.5">{{ setting.description }}</p>
                </div>
                <button 
                  @click="setting.enabled = !setting.enabled"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                    setting.enabled ? 'bg-purple-500' : 'bg-slate-700'
                  ]"
                >
                  <span 
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      setting.enabled ? 'translate-x-5' : 'translate-x-0'
                    ]"
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>

    <div v-if="showAddUserModal" class="fixed inset-0 z- flex items-end sm:items-center justify-center p-0 sm:p-4">
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

// --- PERMISSIONS ---
const isOwner = ref(true) 

// --- STATE: NAVIGATION ---
type Tab = 'org' | 'team' | 'security' | 'notifications'
const activeTab = ref<Tab>('org')

const tabs = [
  { id: 'org', name: 'Organization', icon: 'lucide:building-2' },
  { id: 'team', name: 'Team & Users', icon: 'lucide:users' },
  { id: 'security', name: 'Security', icon: 'lucide:shield-check' },
  { id: 'notifications', name: 'Notifications', icon: 'lucide:bell' }
]

// --- STATE: DATA ---
const showAddUserModal = ref(false)

const org = ref({
  name: 'Test',
  contactPerson: 'Dr. John Smith',
  location: '123 Health Ave, Nairobi, Kenya',
  phone: '+254 700 000 000',
  email: 'billing@smilecare.co.ke'
})

const team = ref([
  { id: 'u1', name: 'Dr. John Smith', identifier: 'john@smilecare.co.ke', department: 'management', role: 'Owner', lastActive: 'Active now' },
  { id: 'u2', name: 'Jane Doe', identifier: 'reception@smilecare.co.ke', department: 'reception', role: 'Member', lastActive: '2 hours ago' },
  { id: 'u3', name: 'Sarah Admin', identifier: 'sarah_admin', department: 'marketing', role: 'Admin', lastActive: 'Yesterday' }
])

const sessions = ref([
  { id: 's1', browser: 'Chrome', os: 'macOS', device: 'Desktop', ip: '197.232.x.x', location: 'Nairobi, KE', lastActive: 'Current session', isCurrent: true },
  { id: 's2', browser: 'Safari', os: 'iOS', device: 'Mobile', ip: '41.90.x.x', location: 'Nairobi, KE', lastActive: '2 days ago', isCurrent: false }
])

const notifications = ref({
  newLead: { title: 'New Lead Alerts', description: 'Receive a push notification when a new lead enters the CRM.', enabled: true },
  socialFlag: { title: 'Social Media Flags', description: 'Get notified if the agency flags content for your review.', enabled: true },
  weeklyReport: { title: 'Weekly Digest', description: 'Receive an email summary of campaign performance every Monday.', enabled: false },
  billing: { title: 'Billing Updates', description: 'Alerts for upcoming invoices and successful payments.', enabled: true }
})

// --- HELPERS ---
const inputClasses = computed(() => {
  return [
    'w-full rounded-xl border-0 py-2.5 px-4 text-sm ring-1 ring-inset transition-colors',
    isOwner.value 
      ? 'bg-slate-900 text-white ring-slate-700 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500' 
      : 'bg-slate-800/50 text-slate-400 ring-transparent cursor-not-allowed'
  ]
})
</script>

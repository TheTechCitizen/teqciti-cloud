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
      
    <aside class="w-full md:w-64 shrink-0 flex flex-wrap md:flex-col gap-2 md:gap-0 md:space-y-1">
  <button 
    v-for="tab in visibleTabs" 
    :key="tab.id"
    @click="activeTab = tab.id"
    :class="[
      'grow md:grow-0 md:w-full flex items-center justify-center md:justify-start gap-2 md:gap-3 px-4 py-2.5 md:py-3 text-sm font-medium rounded-xl transition-all',
      activeTab === tab.id ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700/50' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
    ]"
  >
    <Icon :name="tab.icon" size="18" :class="activeTab === tab.id ? 'text-purple-400' : ''" />
    <span class="whitespace-nowrap">{{ tab.name }}</span>
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

  <section v-if="activeTab === 'team' && can('view_team')" class="animate-in fade-in duration-300 space-y-6">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h2 class="text-xl font-bold text-white">Team Members</h2>
      <p class="text-sm text-slate-400 mt-1">Manage who has access to this workspace.</p>
    </div>
    
    <button 
      v-if="can('manage_team')"
      @click="showAddUserModal = true"
      class="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
    >
      <Icon name="lucide:user-plus" size="16" />
      Add User
    </button>
  </div>

  <div v-if="isLoading" class="p-12 text-center text-slate-400">
    <Icon name="lucide:loader-2" class="animate-spin mx-auto h-8 w-8 text-purple-500 mb-2" />
    <p>Loading workspace team members...</p>
  </div>

<div v-else class="rounded-2xl bg-slate-800/40 ring-1 ring-slate-700/50 backdrop-blur-sm">
    <div class="divide-y divide-slate-700/50">
      
      <div v-if="!teamMembers?.length" class="p-8 text-center text-slate-400">
        No team members found.
      </div>
      
      <div v-else v-for="member in teamMembers" :key="member.id" class="flex items-center justify-between p-5 hover:bg-slate-800/60 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
        <div class="flex items-center gap-4">
          
          <img 
            v-if="member.avatar" 
            :src="member.avatar" 
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 object-cover ring-1 ring-slate-600" 
            alt="User Avatar"
          />
          <div v-else class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 ring-1 ring-slate-600 text-white font-bold uppercase">
            {{ member.firstName?.charAt(0) || 'U' }}
          </div>
          
          <div>
            <div class="flex items-center gap-2">
              <p class="text-sm font-bold text-white max-w-[150px] sm:max-w-xs truncate">
                {{ member.firstName }} {{ member.lastName }}
              </p>
              
              <span v-if="member.userId === user?.id" class="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-400 ring-1 ring-inset ring-blue-500/20">
                You
              </span>

              <span 
                class="rounded px-1.5 py-0.5 text-[10px] font-bold ring-1 ring-inset"
                :class="{
                  'bg-amber-500/10 text-amber-400 ring-amber-500/20': member.role === 'Owner',
                  'bg-purple-500/10 text-purple-400 ring-purple-500/20': member.role === 'Admin',
                  'bg-slate-700 text-slate-300 ring-slate-600': member.role === 'Member'
                }"
              >
                {{ member.role }}
              </span>
            </div>
            
            <div class="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span class="truncate">{{ member.email }}</span>
            </div>
          </div>
        </div>

     <div v-if="can('manage_team') && member.role !== 'Owner' && member.userId !== user?.id" class="flex items-center gap-1 relative">
          
  <button 
    @click="triggerRemoveMember(member.id, `${member.firstName} ${member.lastName}`)"
    :disabled="isRemoving"
    class="text-slate-500 hover:text-rose-400 transition-colors p-2 rounded-lg hover:bg-rose-500/10 disabled:opacity-50"
    title="Revoke Access"
  >
    <Icon name="lucide:user-minus" size="18" />
  </button>

  <div class="relative menu-container">
    <button 
      @click.stop="toggleMenu(member.id)"
      class="text-slate-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50"
      :class="{ 'bg-slate-700/50 text-white': activeMenuId === member.id }"
    >
      <Icon name="lucide:more-vertical" size="18" />
    </button>
    
    <div 
      v-if="activeMenuId === member.id"
      class="absolute right-0 top-full mt-1 w-48 bg-slate-900 border border-slate-700/70 rounded-xl shadow-2xl z-30 p-1.5 animate-in fade-in zoom-in-95 duration-150"
    >
      <button 
        @click="triggerPasswordReset(member.userId, `${member.firstName} ${member.lastName}`); activeMenuId = null"
        class="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
      >
        <Icon name="lucide:key-round" size="14" class="text-cyan-400" />
        Reset System Password
      </button>
      
      <button 
        @click="handleUpdateRole(member.id, member.role); activeMenuId = null"
        class="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors border-t border-slate-800 mt-1 pt-2"
      >
        <Icon name="lucide:shield-alert" size="14" />
        Toggle to {{ member.role === 'Admin' ? 'Member' : 'Admin' }}
      </button>
    </div>
  </div>

</div>
      </div>

    </div>
  </div>

  <div v-if="showAddUserModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
    <div class="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
      <h3 class="text-lg font-bold text-white mb-2">Add New Team Member</h3>
      <p class="text-xs text-slate-400 mb-6">Creates account immediately. They will access the workspace using your organization's shared default credentials.</p>

      <form @submit.prevent="handleAddUser" class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">First Name</label>
            <input 
              v-model="newUser.firstName"
              type="text" 
              placeholder="Jane"
              class="w-full rounded-xl border-0 bg-slate-950 py-2.5 px-4 text-sm text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500" 
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Last Name</label>
            <input 
              v-model="newUser.lastName"
              type="text" 
              placeholder="Doe"
              class="w-full rounded-xl border-0 bg-slate-950 py-2.5 px-4 text-sm text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500" 
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address <span class="text-rose-500">*</span></label>
          <input 
            v-model="newUser.email"
            type="email" 
            required
            placeholder="jane.doe@company.com"
            class="w-full rounded-xl border-0 bg-slate-950 py-2.5 px-4 text-sm text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500" 
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Role Type <span class="text-rose-500">*</span></label>
          <select 
            v-model="newUser.role"
            class="w-full rounded-xl border-0 bg-slate-950 py-2.5 px-4 text-sm text-white ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-purple-500 appearance-none"
          >
            <option value="Member">Member (Standard Operations)</option>
            <option value="Admin">Admin (Privileged Operations)</option>
          </select>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button 
            type="button" 
            @click="showAddUserModal = false"
            class="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            :disabled="isInviting"
            class="flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white text-sm font-semibold transition-colors shadow-lg shadow-purple-600/20"
          >
            <Icon v-if="isInviting" name="lucide:loader-2" class="animate-spin" size="16" />
            Add Member
          </button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="showRemoveModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
  <div class="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl text-center">
    
    <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 mb-4 ring-8 ring-slate-900">
      <Icon name="lucide:user-x" size="24" class="text-rose-500" />
    </div>

    <h3 class="text-lg font-bold text-white mb-2">Remove Team Member?</h3>
    <p class="text-sm text-slate-400 mb-6 leading-relaxed">
      Are you sure you want to remove <strong class="text-white">{{ selectedRemoveUser?.name }}</strong> from this workspace? They will immediately lose access to all associated projects and resources.
    </p>

    <div class="flex items-center justify-center gap-3">
      <button 
        @click="showRemoveModal = false"
        class="flex-1 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors"
        :disabled="isRemoving"
      >
        Cancel
      </button>
      <button 
        @click="confirmRemoveMember" 
        :disabled="isRemoving"
        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 text-white text-sm font-semibold transition-colors shadow-lg shadow-rose-600/20"
      >
        <Icon v-if="isRemoving" name="lucide:loader-2" class="animate-spin" size="16" />
        Yes, Remove
      </button>
    </div>
    
  </div>
</div>

  <div v-if="showResetPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
    <div class="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
      <h3 class="text-lg font-bold text-white mb-2">Reset User Password</h3>
      
      <div v-if="!tempDefaultPassword" class="space-y-4">
        <p class="text-sm text-slate-300">
          Are you sure you want to alter security authorization and reset credentials for <strong>{{ selectedResetUser?.name }}</strong>
        </p>
        <div class="flex justify-end gap-3 pt-4">
          <button 
            @click="showResetPasswordModal = false"
            class="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="handleConfirmPasswordReset" 
            :disabled="isResettingPassword"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 text-white text-sm font-semibold transition-colors"
          >
            <Icon v-if="isResettingPassword" name="lucide:loader-2" class="animate-spin" size="16" />
            Confirm Override
          </button>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-400 text-sm flex gap-3 items-start">
          <Icon name="lucide:check-circle" size="20" class="shrink-0 mt-0.5" />
          <div>
            <span class="font-bold">Password Overridden!</span> Please manually copy and relay this temporary fallback credential securely to the user.
          </div>
        </div>

        <div class="bg-slate-950 rounded-xl p-3.5 border border-slate-800 text-center select-all">
          <span class="text-[10px] text-slate-500 block uppercase font-mono tracking-wider mb-1">Temporary System Password</span>
          <span class="text-lg font-mono text-cyan-400 font-bold tracking-wide">{{ tempDefaultPassword }}</span>
        </div>

        <div class="flex justify-end pt-2">
          <button 
            @click="showResetPasswordModal = false"
            class="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors"
          >
            Close Panel
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


  </div>
</template>

<script setup lang="ts">
definePageMeta({
    requiresAuth: true
});

import { ref, computed } from 'vue'

const { user, changePassword } = useAuth(); 

const { can } = usePermissions();

const { show: showNotification } = useNotifications();

const { currentOrg, orgName, myOrgRole, contactPerson, accountManager, address, phone, email, logoReference, pending } = await useCurrentOrg();

const {
  teamMembers,
  isLoading,
  isInviting,
  isRemoving,
  isResettingPassword,
  addTeamMember,
  removeTeamMember,
  resetTeamMemberPassword,
  updateTeamMemberRole,
} = await useTeamManagement(currentOrg.value?.id);


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


const manager = ref([
  { id: 'a', name: 'Eve', phone: '0740761950' }
])



// --- MENU: TEAM ---
// 2. Modals UI State
const showAddUserModal = ref(false);
const showResetPasswordModal = ref(false);
const showRemoveModal = ref(false);
const selectedRemoveUser = ref<{ id: string; name: string } | null>(null);

// 3. Form State for Adding User
const newUser = ref({
  email: '',
  role: 'Member', // Default role
  firstName: '',
  lastName: '',
});

// For the hover menu for resetting password
const activeMenuId = ref<string | null>(null);

const toggleMenu = (memberId: string) => {
  if (activeMenuId.value === memberId) {
    activeMenuId.value = null;
  } else {
    activeMenuId.value = memberId;
  }
};

// Optional: Close menu when clicking anywhere else
if (import.meta.client) {
  window.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.menu-container')) {
      activeMenuId.value = null;
    }
  });
}

// 4. State for Password Reset Modal Interaction
const selectedResetUser = ref<{ id: string; name: string } | null>(null);
const tempDefaultPassword = ref<string | null>(null);

// 5. Handlers
const handleAddUser = async () => {
  if (!newUser.value.email.trim()) return;
  
  const success = await addTeamMember(
    newUser.value.email,
    newUser.value.role,
    newUser.value.firstName,
    newUser.value.lastName
  );

  if (success) {
    showNotification({
      title: "User Added",
      message: `${newUser.value.email} has been successfully added to the team.`,
      type: "success"
    });
    // Reset Form
    newUser.value = { email: '', role: 'Member', firstName: '', lastName: '' };
    showAddUserModal.value = false;
  } else {
    showNotification({
      title: "Error",
      message: "Failed to add team member. Please verify your permissions and try again.",
      type: "error"
    });
  }
};

const handleUpdateRole = async (junctionId: string, currentRole: string) => {
  const nextRole = currentRole === 'Admin' ? 'Member' : 'Admin';
  const success = await updateTeamMemberRole(junctionId, nextRole);

  if (success) {
    showNotification({
      title: "Role Updated",
      message: `User role has been updated to ${nextRole}.`,
      type: "success"
    });
  } else {
    showNotification({
      title: "Update Failed",
      message: "Could not update user role.",
      type: "error"
    });
  }
};

const triggerRemoveMember = (junctionId: string, name: string) => {
  selectedRemoveUser.value = { id: junctionId, name };
  showRemoveModal.value = true;
};

// 2. Confirm and execute the removal
const confirmRemoveMember = async () => {
  if (!selectedRemoveUser.value) return;

  const success = await removeTeamMember(selectedRemoveUser.value.id);
  if (success) {
    showNotification({
      title: "Member Removed",
      message: `${selectedRemoveUser.value.name} has been removed from the team.`,
      type: "success"
    });
    // Reset and close
    showRemoveModal.value = false;
    selectedRemoveUser.value = null;
  } else {
    showNotification({
      title: "Error",
      message: "Could not remove member from this workspace.",
      type: "error"
    });
  }
};

const triggerPasswordReset = (userId: string, name: string) => {
  selectedResetUser.value = { id: userId, name };
  tempDefaultPassword.value = null;
  showResetPasswordModal.value = true;
};

const handleConfirmPasswordReset = async () => {
  if (!selectedResetUser.value) return;

  const password = await resetTeamMemberPassword(selectedResetUser.value.id);
  if (password) {
    tempDefaultPassword.value = password;
    showNotification({
      title: "Password Reset Success",
      message: `Password reset successfully for ${selectedResetUser.value.name}.`,
      type: "success"
    });
  } else {
    showNotification({
      title: "Reset Failed",
      message: "Could not reset user's password.",
      type: "error"
    });
  }
};



// --- MENU: NOTIFICATIONS AND PREFERENCES ---
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




// --- MENU: SECURITY MENU ---
// Security Menu - Password Update
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

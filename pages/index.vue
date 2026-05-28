<template>
  <div class="mx-auto w-full max-w-4xl px-4 py-8 pb-28 sm:px-6 lg:px-8 relative min-h-screen space-y-10">
    
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="relative h-14 w-14 rounded-full bg-gradient-to-tr from-purple-500 to-emerald-500 p-0.5">
          <div class="h-full w-full rounded-full bg-slate-900 border-2 border-slate-900 overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=David+M&background=1e293b&color=a855f7&size=150" alt="Profile" class="h-full w-full object-cover" />
          </div>
          <div class="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-950"></div>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-400">{{ greeting }},</p>
          <h1 class="text-2xl font-bold tracking-tight text-white">David</h1>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="showNotifications = true"
          class="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors ring-1 ring-slate-700/50"
        >
          <Icon name="lucide:bell" size="18" />
          <span v-if="unreadCount > 0" class="absolute top-0 right-0 flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 ring-2 ring-slate-950">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          </span>
        </button>
        <NuxtLink to ="/settings">
        <button class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors ring-1 ring-slate-700/50">
          <Icon name="lucide:settings" size="18" />
        </button>
        </NuxtLink>
      </div>
    </header>

    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-white">Your Projects</h2>
      </div>

      <div v-if="projects.length === 0" class="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-slate-800/30 p-6 sm:p-8 ring-1 ring-slate-700/50 relative overflow-hidden">
        <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/10 blur-[50px] pointer-events-none"></div>
        <img src="/img/illustrations/4.png" alt="No projects" class="w-24 h-24 object-contain opacity-80 drop-shadow-xl shrink-0" />
        <div>
          <h3 class="text-lg font-bold text-white">No active projects yet</h3>
          <p class="mt-1 text-sm text-slate-400 max-w-md">
            Select a service or product from the catalog below to launch your first project. We'll handle the setup friction-free.
          </p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div 
          v-for="project in projects" 
          :key="project.id"
          @click="openProjectDetails(project)"
          class="group relative overflow-hidden rounded-2xl bg-slate-800/40 p-5 ring-1 ring-slate-700/50 backdrop-blur-sm transition-all hover:bg-slate-800/60 hover:ring-purple-500/50 cursor-pointer flex flex-col justify-between"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex -space-x-2 overflow-hidden">
              <div 
                v-for="(item, idx) in project.items.slice(0, 3)" 
                :key="idx"
                class="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-800 flex items-center justify-center z-10 relative"
              >
                <Icon :name="item.icon" size="14" :class="item.iconColor" />
              </div>
              <div v-if="project.items.length > 3" class="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-700 flex items-center justify-center z-0 relative">
                <span class="text-[10px] font-bold text-slate-300">+{{ project.items.length - 3 }}</span>
              </div>
            </div>
            <span :class="['inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset', getStatusStyles(project.status)]">
              {{ project.status }}
            </span>
          </div>
          <div>
            <h3 class="text-base font-bold text-white truncate">{{ project.name }}</h3>
            <p class="text-xs text-slate-400 mt-0.5">{{ project.items.length }} Item(s) Included</p>
          </div>
          <div class="mt-4 flex items-center justify-between border-t border-slate-700/50 pt-3">
            <p class="text-xs font-semibold text-white">
              {{ project.status === 'Pending Setup' ? 'Pending' : `Kes${project.totalCost.toLocaleString()}` }}
            </p>
            <Icon name="lucide:chevron-right" size="16" class="text-slate-500 group-hover:text-purple-400 transition-colors" />
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-8">
      <div class="flex items-center justify-between border-b border-slate-700/50 pb-4">
        <h2 class="text-xl font-bold text-white">Discover Solutions</h2>
      </div>

      <div>
        <h3 class="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Icon name="lucide:briefcase" size="16" />
          Agency Services
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <div 
            v-for="item in catalogServices" 
            :key="item.id"
            @click="initiateCreate(item)"
            class="group relative overflow-hidden rounded-2xl bg-slate-800/40 ring-1 ring-slate-700/50 backdrop-blur-sm transition-all hover:bg-slate-800 hover:ring-purple-500/50 cursor-pointer flex flex-col"
          >
            <div class="h-36 w-full bg-slate-900/50 flex items-center justify-center p-4 relative overflow-hidden">
              <div :class="`absolute inset-0 opacity-20 bg-gradient-to-br ${item.colorBg}`"></div>
              <img :src="item.image" :alt="item.name" class="h-full w-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div class="p-5 flex-1 flex flex-col">
              <div class="flex items-center gap-2 mb-2">
                <Icon :name="item.icon" size="18" :class="item.iconColor" />
                <h3 class="text-base font-bold text-white">{{ item.name }}</h3>
              </div>
              <p class="text-sm text-slate-400 leading-relaxed flex-1 line-clamp-2">{{ item.description }}</p>
              <div class="mt-4 flex items-center justify-between border-t border-slate-700/50 pt-4">
                <p class="text-xs text-slate-500">Starting at</p>
                <p class="text-sm font-semibold text-white">${{ item.startingPrice.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2 mt-8">
          <Icon name="lucide:package" size="16" />
          Digital Products
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <div 
            v-for="item in catalogProducts" 
            :key="item.id"
            @click="initiateCreate(item)"
            class="group relative overflow-hidden rounded-2xl bg-slate-800/40 ring-1 ring-slate-700/50 backdrop-blur-sm transition-all hover:bg-slate-800 hover:ring-emerald-500/50 cursor-pointer flex flex-col"
          >
            <div class="h-36 w-full bg-slate-900/50 flex items-center justify-center p-4 relative overflow-hidden">
              <div :class="`absolute inset-0 opacity-20 bg-gradient-to-br ${item.colorBg}`"></div>
              <img :src="item.image" :alt="item.name" class="h-full w-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div class="p-5 flex-1 flex flex-col">
              <div class="flex items-center gap-2 mb-2">
                <Icon :name="item.icon" size="18" :class="item.iconColor" />
                <h3 class="text-base font-bold text-white">{{ item.name }}</h3>
              </div>
              <p class="text-sm text-slate-400 leading-relaxed flex-1 line-clamp-2">{{ item.description }}</p>
              <div class="mt-4 flex items-center justify-between border-t border-slate-700/50 pt-4">
                <p class="text-xs text-slate-500">Fixed Price</p>
                <p class="text-sm font-semibold text-white">${{ item.startingPrice.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="showNotifications" class="fixed inset-0 z- flex items-end sm:items-start sm:justify-end p-0 sm:p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" @click="showNotifications = false"></div>
      
      <div class="relative w-full sm:w-96 rounded-t-3xl sm:rounded-2xl bg-slate-900 ring-1 ring-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-right-8 duration-300 max-h-[85vh] flex flex-col mt-16">
        
        <div class="flex items-center justify-between border-b border-slate-700/50 bg-slate-800/90 px-5 py-4 backdrop-blur-md shrink-0">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <Icon name="lucide:bell" size="18" />
            Notifications
          </h3>
          <div class="flex items-center gap-3">
            <button v-if="unreadCount > 0" @click="markAllRead" class="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors">
              Mark all read
            </button>
            <button @click="showNotifications = false" class="text-slate-400 hover:text-white transition-colors">
              <Icon name="lucide:x" size="20" />
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-2">
          <div v-if="notifications.length === 0" class="p-8 text-center text-slate-400">
            <Icon name="lucide:bell-off" size="32" class="mx-auto mb-3 opacity-50" />
            <p class="text-sm">You're all caught up!</p>
          </div>
          
          <div class="space-y-1">
            <div 
              v-for="notif in notifications" 
              :key="notif.id"
              :class="[
                'group flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer',
                notif.unread ? 'bg-slate-800/80 hover:bg-slate-800' : 'hover:bg-slate-800/40'
              ]"
              @click="notif.unread = false"
            >
              <div :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ring-inset', notif.bg, notif.color, 'ring-current/20']">
                <Icon :name="notif.icon" size="18" />
              </div>
              <div class="flex-1 min-w-0 pt-0.5">
                <div class="flex items-center justify-between gap-2">
                  <p :class="['text-sm truncate', notif.unread ? 'font-bold text-white' : 'font-semibold text-slate-300']">
                    {{ notif.title }}
                  </p>
                  <span class="text-[10px] text-slate-500 whitespace-nowrap">{{ notif.time }}</span>
                </div>
                <p class="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{{ notif.message }}</p>
              </div>
              <div v-if="notif.unread" class="h-2 w-2 rounded-full bg-purple-500 mt-2 shrink-0"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="setupItems.length > 0" class="fixed inset-0 z- flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" @click="closeSetupModal"></div>
      
      <div class="relative w-full max-w-xl rounded-t-3xl sm:rounded-3xl bg-slate-900 ring-1 ring-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        <button @click="closeSetupModal" class="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 z-10 transition-colors backdrop-blur-md">
          <Icon name="lucide:x" size="18" />
        </button>

        <div class="h-24 w-full bg-slate-800 flex items-center justify-center relative overflow-hidden shrink-0 border-b border-slate-700">
          <div :class="`absolute inset-0 opacity-30 bg-gradient-to-br ${setupItems.colorBg}`"></div>
          <h3 class="text-xl font-black text-white relative z-10 tracking-tight">Workspace Setup</h3>
        </div>

        <div class="p-6 sm:p-8 overflow-y-auto flex-1">
          
          <div v-if="!isAddingToSetup" class="space-y-6">
            <div>
              <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Project Name</label>
              <input v-model="newProjectName" type="text" class="w-full rounded-xl border-0 bg-slate-950 py-3.5 px-4 text-base text-white ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-purple-500 transition-shadow"/>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider">Included Items</label>
                <button @click="isAddingToSetup = true" class="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-500/10 px-2.5 py-1.5 rounded-lg transition-colors">
                  <Icon name="lucide:plus" size="14" /> Add Item
                </button>
              </div>
              
              <div class="rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden divide-y divide-slate-700/50">
                <div v-for="item in setupItems" :key="item.id" class="p-3 flex items-center gap-3">
                  <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 ring-1 ring-slate-700">
                    <Icon :name="item.icon" size="14" :class="item.iconColor" />
                  </div>
                  <div class="flex-1 flex items-center gap-2">
                    <p class="text-sm font-bold text-white">{{ item.name }}</p>
                    <span :class="['text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold', item.type === 'service' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400']">{{ item.type }}</span>
                  </div>
                  <p class="text-xs text-slate-400 font-medium">${{ item.startingPrice.toLocaleString() }}</p>
                  <button v-if="setupItems.length > 1" @click="removeItemFromSetup(item.id)" class="text-slate-500 hover:text-rose-400 transition-colors p-1 ml-2">
                    <Icon name="lucide:trash-2" size="16" />
                  </button>
                </div>
              </div>
            </div>

            <div class="rounded-xl bg-purple-500/10 p-4 ring-1 ring-purple-500/20 flex gap-3 items-start">
              <Icon name="lucide:shield-check" size="20" class="text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p class="text-sm font-semibold text-purple-300">Total Est: ${{ currentSetupTotal.toLocaleString() }}</p>
                <p class="mt-1 text-xs text-purple-200/70 leading-relaxed">No charges today. Billing is deferred until project scope is reviewed.</p>
              </div>
            </div>

            <button @click="confirmNewProject" class="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-purple-500 transition-all hover:shadow-purple-500/20">
              <Icon name="lucide:rocket" size="18" /> Launch Workspace
            </button>
          </div>

          <div v-else class="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div class="flex items-center gap-2 mb-2">
              <button @click="isAddingToSetup = false" class="text-slate-400 hover:text-white flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-800 transition-colors">
                <Icon name="lucide:arrow-left" size="18" />
              </button>
              <h3 class="text-base font-bold text-white">Add to bundle</h3>
            </div>

            <div v-if="availableBundleServices.length > 0">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Services</h4>
              <div class="grid grid-cols-1 gap-2">
                <div v-for="item in availableBundleServices" :key="`sb_${item.id}`" @click="addItemToSetup(item)" class="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 p-3 hover:bg-slate-700 hover:border-purple-500/50 cursor-pointer transition-all group">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 group-hover:scale-105 transition-transform">
                    <Icon :name="item.icon" size="18" :class="item.iconColor" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-bold text-white">{{ item.name }}</p>
                    <p class="text-xs text-slate-400">+${{ item.startingPrice.toLocaleString() }}</p>
                  </div>
                  <Icon name="lucide:plus-circle" size="18" class="text-slate-500 group-hover:text-purple-400" />
                </div>
              </div>
            </div>

            <div v-if="availableBundleProducts.length > 0">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Products</h4>
              <div class="grid grid-cols-1 gap-2">
                <div v-for="item in availableBundleProducts" :key="`pb_${item.id}`" @click="addItemToSetup(item)" class="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 p-3 hover:bg-slate-700 hover:border-emerald-500/50 cursor-pointer transition-all group">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 group-hover:scale-105 transition-transform">
                    <Icon :name="item.icon" size="18" :class="item.iconColor" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-bold text-white">{{ item.name }}</p>
                    <p class="text-xs text-slate-400">+${{ item.startingPrice.toLocaleString() }}</p>
                  </div>
                  <Icon name="lucide:plus-circle" size="18" class="text-slate-500 group-hover:text-emerald-400" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div v-if="activeProject" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" @click="closeProjectDetails"></div>
      
      <div class="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 ring-1 ring-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div class="flex items-center justify-between border-b border-slate-700/50 bg-slate-800/90 px-6 py-4 backdrop-blur-md">
          <div>
            <h2 class="text-xl font-bold text-white flex items-center gap-3">
              {{ activeProject.name }}
              <span :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset', getStatusStyles(activeProject.status)]">
                {{ activeProject.status }}
              </span>
            </h2>
            <p class="mt-1 text-xs text-slate-400">Created {{ activeProject.createdAt }}</p>
          </div>
          <button @click="closeProjectDetails" class="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <Icon name="lucide:x" size="20" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div v-if="!isAddingToProject" class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-white">Included Services & Products</h3>
              <button @click="isAddingToProject = true" class="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-500/10 px-2.5 py-1 rounded-md transition-colors">
                <Icon name="lucide:plus" size="14" /> Add Item
              </button>
            </div>

            <div class="rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden divide-y divide-slate-700/50">
              <div v-for="item in activeProject.items" :key="item.id" class="p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 ring-1 ring-slate-700">
                  <Icon :name="item.icon" size="18" :class="item.iconColor" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-bold text-white">{{ item.name }}</p>
                    <span :class="['text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold', item.type === 'service' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400']">{{ item.type }}</span>
                  </div>
                  <p class="text-xs text-slate-400 mt-0.5 line-clamp-1">{{ item.description }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-white">${{ item.startingPrice.toLocaleString() }}</p>
                </div>
              </div>
            </div>

            <div class="rounded-xl bg-slate-800/50 p-4 border border-slate-700/50 flex justify-between items-center mt-6">
              <span class="text-sm text-slate-400">Total Estimated Cost</span>
              <span class="text-lg font-bold text-white">
                {{ activeProject.status === 'Pending Setup' ? 'Pending Review' : `$${activeProject.totalCost.toLocaleString()}` }}
              </span>
            </div>
          </div>

          <div v-else class="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div class="flex items-center gap-2 mb-2">
              <button @click="isAddingToProject = false" class="text-slate-400 hover:text-white flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-800 transition-colors">
                <Icon name="lucide:arrow-left" size="18" />
              </button>
              <h3 class="text-base font-bold text-white">Add to project</h3>
            </div>
            
            <div v-if="availableProjectServices.length > 0">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Services</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div v-for="item in availableProjectServices" :key="`add_s_${item.id}`" @click="addItemToProject(item)" class="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 p-3 hover:bg-slate-700 hover:border-purple-500/50 cursor-pointer transition-all group">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 group-hover:scale-105 transition-transform">
                    <Icon :name="item.icon" size="18" :class="item.iconColor" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-bold text-white">{{ item.name }}</p>
                    <p class="text-xs text-slate-400">+${{ item.startingPrice.toLocaleString() }}</p>
                  </div>
                  <Icon name="lucide:plus-circle" size="18" class="text-slate-500 group-hover:text-purple-400" />
                </div>
              </div>
            </div>

            <div v-if="availableProjectProducts.length > 0">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Products</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div v-for="item in availableProjectProducts" :key="`add_p_${item.id}`" @click="addItemToProject(item)" class="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 p-3 hover:bg-slate-700 hover:border-emerald-500/50 cursor-pointer transition-all group">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 group-hover:scale-105 transition-transform">
                    <Icon :name="item.icon" size="18" :class="item.iconColor" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-bold text-white">{{ item.name }}</p>
                    <p class="text-xs text-slate-400">+${{ item.startingPrice.toLocaleString() }}</p>
                  </div>
                  <Icon name="lucide:plus-circle" size="18" class="text-slate-500 group-hover:text-emerald-400" />
                </div>
              </div>
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

const config = useRuntimeConfig()

type ItemType = 'service' | 'product'

interface CatalogItem {
  id: string; 
  type: ItemType; 
  name: string; 
  description: string; 
  startingPrice: number; 
  icon: string; 
  // Made these optional since they aren't in your Directus DB schema yet
  iconColor?: string; 
  image?: string; 
  colorBg?: string;
}

interface Project {
  id: string; 
  name: string; 
  items: CatalogItem[]; 
  status: 'Pending Setup' | 'Active' | 'Completed'; 
  totalCost: number; 
  createdAt: string;
}

const projects = ref<Project[]>([])
const activeProject = ref<Project | null>(null)
const isAddingToProject = ref(false)


// --- FETCH DATA WITH BEARER TOKEN ---
const { data: catalog, pending, error } = await useFetch<CatalogItem[]>(`${config.public.link}/items/catalog`, {
  headers: {
    Authorization: `Bearer ${config.public.token}`
  },
  transform: (response: any) => response.data
})

// --- COMPUTED CATALOG SPLITS ---
// Safely falls back to an empty array while 'catalog' is pending from the API
const catalogServices = computed(() => (catalog.value || []).filter(c => c.type === 'service'))
const catalogProducts = computed(() => (catalog.value || []).filter(c => c.type === 'product'))

const showNotifications = ref(false)
const notifications = ref([
  { id: 'n1', title: 'Welcome to Teqcit', message: 'Thank you for signing up. We are ready and committed to being with you on this brand journey', time: '2m ago', icon: 'lucide:receipt', color: 'text-emerald-400', bg: 'bg-emerald-500/10', unread: true },
])
const unreadCount = computed(() => notifications.value.filter(n => n.unread).length)
const markAllRead = () => notifications.value.forEach(n => n.unread = false)

const setupItems = ref<CatalogItem[]>([])
const newProjectName = ref('')
const isAddingToSetup = ref(false)

const currentSetupTotal = computed(() => setupItems.value.reduce((sum, item) => sum + item.startingPrice, 0))

const availableBundleServices = computed(() => catalogServices.value.filter(c => !setupItems.value.some(s => s.id === c.id)))
const availableBundleProducts = computed(() => catalogProducts.value.filter(c => !setupItems.value.some(s => s.id === c.id)))

const availableProjectServices = computed(() => {
  if (!activeProject.value) return []
  return catalogServices.value.filter(c => !activeProject.value!.items.some(i => i.id === c.id))
})
const availableProjectProducts = computed(() => {
  if (!activeProject.value) return []
  return catalogProducts.value.filter(c => !activeProject.value!.items.some(i => i.id === c.id))
})

const initiateCreate = (item: CatalogItem) => {
  setupItems.value = [item]
  newProjectName.value = `My ${item.name} Project`
  isAddingToSetup.value = false
}
const addItemToSetup = (item: CatalogItem) => { setupItems.value.push(item); isAddingToSetup.value = false }
const removeItemFromSetup = (itemId: string) => { setupItems.value = setupItems.value.filter(i => i.id !== itemId) }
const closeSetupModal = () => { setupItems.value = [] }
const confirmNewProject = () => {
  if (setupItems.value.length === 0) return
  projects.value.unshift({ id: `proj_${Date.now()}`, name: newProjectName.value || 'New Workspace', items: [...setupItems.value], status: 'Pending Setup', totalCost: currentSetupTotal.value, createdAt: 'Just now' })
  closeSetupModal()
}

const openProjectDetails = (project: Project) => { activeProject.value = project; isAddingToProject.value = false; document.body.style.overflow = 'hidden' }
const closeProjectDetails = () => { activeProject.value = null; isAddingToProject.value = false; document.body.style.overflow = '' }
const addItemToProject = (item: CatalogItem) => {
  if (!activeProject.value) return
  activeProject.value.items.push(item)
  activeProject.value.totalCost = activeProject.value.items.reduce((sum, i) => sum + i.startingPrice, 0)
  isAddingToProject.value = false
}

const hour = new Date().getHours()
const greeting = computed(() => hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening')
const getStatusStyles = (status: Project['status']) => {
  switch (status) { 
    case 'Pending Setup': return 'bg-amber-500/10 text-amber-400 ring-amber-500/20'; 
    case 'Active': return 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'; 
    case 'Completed': return 'bg-slate-500/10 text-slate-400 ring-slate-500/20'; 
  }
}
</script>

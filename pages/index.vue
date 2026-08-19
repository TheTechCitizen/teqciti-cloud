<template>
  <div class="mx-auto w-full max-w-4xl px-4 py-8 pb-28 sm:px-6 lg:px-8 relative min-h-screen space-y-10">

      <!-- ========================================== -->
    <!-- 1. UNIVERSAL HEADER (Seen by everyone)     -->
    <!-- ========================================== -->
    
     <header class="flex items-center justify-between gap-4 w-full">
  <div class="flex items-center gap-3 sm:gap-4 min-w-0">
    <div class="relative h-11 w-11 sm:h-14 sm:w-14 rounded-full bg-gradient-to-tr from-purple-500 to-emerald-500 p-[1.5px] sm:p-0.5 shrink-0">
      <div class="flex h-full w-full items-center justify-center rounded-full border-[1.5px] sm:border-2 border-slate-900 bg-slate-900 overflow-hidden font-bold text-base sm:text-xl text-purple-500 tracking-wide">
        {{ userInitials }}
      </div>
      <div class="absolute bottom-0 right-0 h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-950"></div>
    </div>

    <div class="min-w-0">
      <p class="text-xs sm:text-sm font-medium text-slate-400 truncate">{{ greeting }},</p>
      <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-white truncate">{{ user.first_name }}</h1>
    </div>
  </div>
  
  <div class="flex items-center gap-2 sm:gap-3 shrink-0">
    <NotificationTrayDropdown />

    <NuxtLink to="/settings">
      <button class="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors ring-1 ring-slate-700/50">
        <Icon name="lucide:settings" class="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />
      </button>
    </NuxtLink>
  </div>
</header>
   <!-- ========================================= -->
    <!-- 2. QUICK START (The Zen Welcome)          -->
    <!-- Seen by Agents/Team Members               -->
    <!-- ========================================= -->
    <section v-if="can('access_member_only_view')" class="relative w-full overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 lg:p-12 shadow-xl">
      
      <div class="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
        
        <div class="flex-1 text-center md:text-left space-y-4 max-w-xl">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400">
              {{ orgName || 'Teqciti' }}
          </span>
          
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Welcome to your <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-pink-500">
              Workspace
            </span>
          </h1>
          
          <p class="text-slate-400 text-sm sm:text-base leading-relaxed">
            What would you like to achieve today? 
            Explore your shortcuts down below to get started 
          </p>
        </div>

        <div class="w-full md:w-auto flex justify-center shrink-0">
          <div class="relative z-0 isolate group p-4 sm:p-6 bg-slate-950/40 rounded-3xl border border-slate-800/80 backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-purple-500/30">
            <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-500/40 rounded-tl-xl"></div>
            <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-pink-500/40 rounded-br-xl"></div>
            
            <img 
              src="/img/illustrations/1.png" 
              alt="Workspace Illustration" 
              class="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

      </div>
    </section>
       <!-- ========================================== -->
   <!-- 3. PROJECTS (Seen by only admins and owners)             -->
    <!-- ========================================== -->

    <section v-if="can('view_projects')" >
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
                v-for="(item, idx) in project.servicesIncluded.slice(0, 3)" 
                :key="idx"
                class="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-800 flex items-center justify-center z-10 relative"
              >
                <Icon :name="item.icon" size="14" :class="item.iconColor" />
              </div>
              <div v-if="project.servicesIncluded.length > 3" class="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-700 flex items-center justify-center z-0 relative">
                <span class="text-[10px] font-bold text-slate-300">+{{ project.servicesIncluded.length - 3 }}</span>
              </div>
            </div>
            <span :class="['inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset', getStatusStyles(project.status)]">
              {{ project.status }}
            </span>
          </div>
          <div>
            <h3 class="text-base font-bold text-white truncate">{{ project.name }}</h3>
            <p class="text-xs text-slate-400 mt-0.5">{{ project.servicesIncluded.length }} Item(s) Included</p>
          </div>
          <div class="mt-4 flex items-center justify-between border-t border-slate-700/50 pt-3">
            <p class="text-xs font-semibold text-white">
              {{ getProjectPriceDisplay(project) }}
            </p>
            <Icon name="lucide:chevron-right" size="16" class="text-slate-500 group-hover:text-purple-400 transition-colors" />
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================== -->
    <!-- 4. OWNER CATALOG (Seen by admins and owners)     -->
    <!-- ========================================== -->

    <section v-if="can('view_services')" class="space-y-8">
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
                <p class="text-sm font-semibold text-white">Ksh {{ priceDisplay(item.startingPrice) }}</p>
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
                <p class="text-sm font-semibold text-white">Ksh {{ priceDisplay(item.startingPrice) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

 
 <div v-if="setupItems.length > 0 && can('add_projects')" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
  <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" @click="closeSetupModal"></div>
  
  <div class="relative w-full sm:max-w-xl sm:my-8 rounded-t-3xl sm:rounded-3xl bg-slate-900 ring-1 ring-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300 h-[92vh] sm:h-auto sm:max-h-[85vh] flex flex-col">
    <button @click="closeSetupModal" class="absolute top-3 right-3 sm:top-4 sm:right-4 h-8 w-8 flex items-center justify-center rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 z-10 transition-colors backdrop-blur-md">
      <Icon name="lucide:x" size="18" />
    </button>

    <div class="h-16 sm:h-24 w-full bg-slate-800 flex items-center justify-center relative overflow-hidden shrink-0 border-b border-slate-700">
      <div :class="`absolute inset-0 opacity-30 bg-gradient-to-br ${setupItems.colorBg}`"></div>
      <h3 class="text-lg sm:text-xl font-black text-white relative z-10 tracking-tight">Workspace Setup</h3>
    </div>

    <div class="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 loose-scroll">
      
      <div v-if="!isAddingToSetup" class="space-y-4 sm:space-y-6">
        <div>
          <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Project Name</label>
          <input v-model="newProjectName" type="text" class="w-full rounded-xl border-0 bg-slate-950 py-3 px-4 text-sm sm:text-base text-white ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-purple-500 transition-shadow"/>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider">Included Items</label>
            <button @click="isAddingToSetup = true" class="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-500/10 px-2.5 py-1.5 rounded-lg transition-colors">
              <Icon name="lucide:plus" size="14" /> Add Item
            </button>
          </div>
          
          <div class="rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden divide-y divide-slate-700/50">
            <div v-for="item in setupItems" :key="item.id" class="p-3 flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 ring-1 ring-slate-700">
                <Icon :name="item.icon" size="14" :class="item.iconColor" />
              </div>
              <div class="flex-1 min-w-[120px] flex items-center gap-2">
                <p class="text-sm font-bold text-white truncate">{{ item.name }}</p>
                <span :class="['text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold shrink-0', item.type === 'service' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400']">{{ item.type }}</span>
              </div>
              <div class="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 mt-1 sm:mt-0 pt-2 sm:pt-0 border-t border-slate-800 sm:border-0">
                <p class="text-xs text-slate-400 font-medium sm:text-right">Ksh {{ priceDisplay(item.startingPrice) }}</p>
                <button v-if="setupItems.length > 1" @click="removeItemFromSetup(item.id)" class="text-slate-500 hover:text-rose-400 transition-colors p-1">
                  <Icon name="lucide:trash-2" size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl bg-purple-500/10 p-3 sm:p-4 ring-1 ring-purple-500/20 flex gap-3 items-start">
          <Icon name="lucide:shield-check" size="20" class="text-purple-400 shrink-0 mt-0.5" />
          <div>
            <p class="text-sm font-semibold text-purple-300">Total Est: Ksh {{ currentSetupTotal.toLocaleString() }}</p>
            <p class="mt-0.5 text-xs text-purple-200/70 leading-relaxed">No charges today. Billing is deferred until project scope is reviewed.</p>
          </div>
        </div>

        <button @click="confirmNewProject" class="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 sm:py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-purple-500 transition-all hover:shadow-purple-500/20">
          <Icon name="lucide:rocket" size="18" /> Launch Workspace
        </button>
      </div>

      <div v-else class="space-y-4 sm:space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
        <div class="flex items-center gap-2 mb-2">
          <button @click="isAddingToSetup = false" class="text-slate-400 hover:text-white flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-800 transition-colors">
            <Icon name="lucide:arrow-left" size="18" />
          </button>
          <h3 class="text-base font-bold text-white">Add to bundle</h3>
        </div>

        <div v-if="availableBundleServices.length > 0">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Services</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div v-for="item in availableBundleServices" :key="`sb_${item.id}`" @click="addItemToSetup(item)" class="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 p-2.5 sm:p-3 hover:bg-slate-700 hover:border-purple-500/50 cursor-pointer transition-all group">
              <div class="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 group-hover:scale-105 transition-transform">
                <Icon :name="item.icon" size="16" :class="item.iconColor" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs sm:text-sm font-bold text-white truncate">{{ item.name }}</p>
                <p class="text-[11px] sm:text-xs text-slate-400 truncate">+Ksh {{ priceDisplay(item.startingPrice) }}</p>
              </div>
              <Icon name="lucide:plus-circle" size="18" class="text-slate-500 group-hover:text-purple-400 shrink-0" />
            </div>
          </div>
        </div>

        <div v-if="availableBundleProducts.length > 0">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Products</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div v-for="item in availableBundleProducts" :key="`pb_${item.id}`" @click="addItemToSetup(item)" class="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 p-2.5 sm:p-3 hover:bg-slate-700 hover:border-emerald-500/50 cursor-pointer transition-all group">
              <div class="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 group-hover:scale-105 transition-transform">
                <Icon :name="item.icon" size="16" :class="item.iconColor" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs sm:text-sm font-bold text-white truncate">{{ item.name }}</p>
                <p class="text-[11px] sm:text-xs text-slate-400 truncate">+Ksh {{ priceDisplay(item.startingPrice) }}</p>
              </div>
              <Icon name="lucide:plus-circle" size="18" class="text-slate-500 group-hover:text-emerald-400 shrink-0" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

    <div v-if="activeProject && can('view_projects')" class="fixed inset-0 z-50 flex items-center justify-center p-4">
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
              <div v-for="item in activeProject.servicesIncluded" :key="item.id" class="p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
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
                             </div>
            </div>

            <div class="rounded-xl bg-slate-800/50 p-4 border border-slate-700/50 flex justify-between items-center mt-6">
              <span class="text-sm text-slate-400">Status</span>
              <span class="text-lg font-bold text-white">
                {{ activeProject.status }}
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
                    <p class="text-xs text-slate-400">+Ksh {{ priceDisplay(item.startingPrice) }}</p>
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
                    <p class="text-xs text-slate-400">+Ksh {{ priceDisplay(item.startingPrice) }}</p>
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
import { ref, computed, onMounted } from 'vue';
import type { CatalogItem } from "~/schemas/catalog.schema"; // Assuming this is your exported type
import type { Project } from "~/schemas/project.schema";

definePageMeta({
  requiresAuth: true
});

const config = useRuntimeConfig();
const { user, userInitials } = useAuth(); 

// 1. Instantly grab the global organization context
const { currentOrg, orgId, myOrgRole, orgName } = await useCurrentOrg();
const { can } = usePermissions();
const { show } = useNotifications();

// --- 1. INITIALIZE DATA SERVICES ---
const projectService = useDataService<Project>('projects');
const { catalog, services: catalogServices, products: catalogProducts } = await useCatalog();

// --- 2. STATE MANAGEMENT ---
const projects = ref<Project[]>([]);
const activeProject = ref<Project | null>(null);
const isAddingToProject = ref(false);

const isCreating = ref(false); // Used to disable buttons during API calls
const isUpdating = ref(false);

const setupItems = ref<CatalogItem[]>([]);
const newProjectName = ref('');
const isAddingToSetup = ref(false);

const priceDisplay = computed(() => {
  return (price: any) => {
    // 🚨 FIX: Force it to be a string safely
    const safePrice = String(price ?? '0');
    
    // Regex: Check if the string only contains digits (and optional commas/decimals)
    const isNumeric = /^\d+$/.test(safePrice.replace(/,/g, ''));
    
    if (isNumeric) {
      // It's a number, format it as currency
      return `Ksh ${parseInt(safePrice.replace(/,/g, '')).toLocaleString()}`;
    }
    
    // It's a label like "Variable" or "Pay as you go", return as is
    return safePrice;
  };
});


// Helper function to calculate total price for added services
const getProjectPriceDisplay = (project: Project) => {
  // 1. Handle the "Pending" state first
  if (project.status === 'pending' || !project.servicesIncluded || project.servicesIncluded.length === 0) {
    return 'Pending';
  }

  // 2. Calculate the numeric total safely
  const numericTotal = project.servicesIncluded.reduce((sum, item) => {
    // Force startingPrice to a string safely, fallback to '0' if null/undefined
    const rawPrice = String(item?.startingPrice ?? '0');
    const p = parseInt(rawPrice.replace(/,/g, ''));
    return sum + (isNaN(p) ? 0 : p);
  }, 0);

  // 3. If the total is 0 but there are items, they might be "Variable" strings
  if (numericTotal === 0 && project.servicesIncluded.length > 0) {
    // Safe fallback: grab the price display of the first item
    return String(project.servicesIncluded[0]?.startingPrice ?? 'Variable'); 
  }

  // 4. Otherwise, return the formatted currency
  return `Ksh ${numericTotal.toLocaleString()}`;
};

// Calculate totals dynamically based on included items
const currentSetupTotal = computed(() => {
  return setupItems.value.reduce((sum, item) => {
    // Convert to number; if it's text like "Variable", it becomes NaN
    const price = parseInt(item.startingPrice.replace(/,/g, ''));
    
    // If it's not a number, we add 0 to the total
    return sum + (isNaN(price) ? 0 : price);
  }, 0);
});

const availableBundleServices = computed(() => catalogServices.value.filter(c => !setupItems.value.some(s => s.id === c.id)));
const availableBundleProducts = computed(() => catalogProducts.value.filter(c => !setupItems.value.some(s => s.id === c.id)));

const availableProjectServices = computed(() => {
  if (!activeProject.value) return [];
  return catalogServices.value.filter(c => !activeProject.value!.servicesIncluded.some(i => i.id === c.id));
});
const availableProjectProducts = computed(() => {
  if (!activeProject.value) return [];
  return catalogProducts.value.filter(c => !activeProject.value!.servicesIncluded.some(i => i.id === c.id));
});

// 2. Fetch projects securely based on the composable's orgId
// We use watchEffect so if the orgId takes a moment to hydrate, it automatically runs once available
watchEffect(async () => {
  if (orgId.value) {
    projects.value = await projectService.getFiltered({
      filter: { org: { _eq: orgId.value } },
      fields: ['*', 'services_included.catalog_id.*'] 
    });
  }
});




// --- 4. PROJECT CREATION LOGIC ---
const initiateCreate = (item: CatalogItem) => {
  setupItems.value = [item];
  newProjectName.value = `My ${item.name} Project`;
  isAddingToSetup.value = false;
};

const addItemToSetup = (item: CatalogItem) => { 
  setupItems.value.push(item); 
  isAddingToSetup.value = false; 
};

const removeItemFromSetup = (itemId: string) => { 
  setupItems.value = setupItems.value.filter(i => i.id !== itemId); 
};

const closeSetupModal = () => { 
  setupItems.value = []; 
};

const confirmNewProject = async () => {
  if (setupItems.value.length === 0 || isCreating.value) return;
  if (!orgId.value) {
    console.error("Missing Organization ID! Cannot link this project.");
    return;
  }

  isCreating.value = true;

  try {
    const payload = {
      name: newProjectName.value || 'New Workspace',
      status: 'pending',
      org: orgId.value, // Securely pulled from the composable
      services_included: setupItems.value.map(item => ({ catalog_id: item.id }))
    };

    const newProject = await projectService.create(payload);
    
    if (newProject) {
      // No need to call from we can just use the local setupItems to populate the UI
      const fullyPopulatedProject = {
        ...newProject,
        servicesIncluded: [...setupItems.value],
      };

      // Now inject it into the UI—no missing icons!
      projects.value.unshift(fullyPopulatedProject);
      closeSetupModal();
      show({
        title: "New Project",
        message: "Hooray! Kindly except a reach out to review scope and kick off",
        type: "success",
        showInTray: true,
        nativePush: false 
  });
    }
  } catch (error) {
    console.error("Failed to create project:", error);
    // Handle toast notification here
     show({
        title: "Failed",
        message: "Project creation failed. Please check your network and try again",
        type: "error",
        showInTray: false,
        nativePush: false 
  });

  } finally {
    isCreating.value = false;
  }
};


// --- 5. PROJECT UPDATE LOGIC ---
const openProjectDetails = (project: Project) => { 
  activeProject.value = project; 
  isAddingToProject.value = false; 
  document.body.style.overflow = 'hidden'; 
};

const closeProjectDetails = () => { 
  activeProject.value = null; 
  isAddingToProject.value = false; 
  document.body.style.overflow = ''; 
};

const addItemToProject = async (item: CatalogItem) => {
  if (!activeProject.value || isUpdating.value) return;
  isUpdating.value = true;

  try {
    // In Directus, updating a M2M field requires passing the new item to append.
    // The syntax `{ "+": [...] }` appends to the junction table without deleting existing items.
    const payload = {
      services_included: {
        "+": [{ catalog_id: item.id }]
      }
    };

    const updatedProject = await projectService.update(activeProject.value.id, payload);

    if (updatedProject) {
      // Update local state to immediately reflect the change
      activeProject.value.servicesIncluded.push(item);
      // Re-calculate the total cost or rely on a computed property
      activeProject.value.totalCost = activeProject.value.servicesIncluded.reduce((sum, i) => sum + i.startingPrice, 0);
    }
  } catch (error) {
    console.error("Failed to add item to project:", error);
  } finally {
    isUpdating.value = false;
    isAddingToProject.value = false;
  }
};

const hour = new Date().getHours();
const greeting = computed(() => hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening');

const getStatusStyles = (status: Project['status']) => {
  switch (status) { 
    case 'pending': return 'bg-amber-500/10 text-amber-400 ring-amber-500/20'; 
    case 'active': return 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'; 
    case 'completed': return 'bg-slate-500/10 text-slate-400 ring-slate-500/20'; 
    default: return 'bg-slate-500/10 text-slate-400 ring-slate-500/20';
  }
};
</script>



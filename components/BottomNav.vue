<template>
  <div class="fixed bottom-0 left-0 right-0 z- pb-6 sm:pb-8 px-4 pointer-events-none">
    
    <nav class="mx-auto w-full max-w-lg pointer-events-auto">
      
      <div class="relative flex h-[76px] items-center rounded-full bg-slate-900/90 px-2 backdrop-blur-2xl ring-1 ring-slate-700/50 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(168,85,247,0.3)]">
        
        <div 
          class="absolute inset-y-2 rounded-full bg-gradient-to-b from-purple-500/20 to-purple-600/5 transition-all duration-500 spring-bounce ease-out"
          :class="activeIndex !== -1 ? 'opacity-100' : 'opacity-0'"
          :style="{ 
            width: `calc((100% - 16px) / ${navItems.length})`, 
            transform: `translateX(${activeIndex * 100}%)` 
          }"
        >
          <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-1.5 rounded-b-full bg-gradient-to-r from-fuchsia-400 to-purple-500 shadow-[0_2px_15px_rgba(168,85,247,1)]"></div>
        </div>

        <NuxtLink 
          v-for="(item, index) in navItems" 
          :key="item.path" 
          :to="item.path"
          class="group relative z-10 flex flex-1 flex-col items-center justify-center h-full rounded-full transition-all duration-300 active:scale-90 outline-none -webkit-tap-highlight-transparent min-w-0"
        >
          <div class="relative flex flex-col items-center justify-center gap-1.5 w-full px-1">
            
            <div 
              class="transition-all duration-400 ease-out flex items-center justify-center"
              :class="activeIndex === index ? '-translate-y-1.5 scale-[1.15]' : 'translate-y-0 scale-100 group-hover:-translate-y-0.5'"
            >
              <Icon 
                :name="item.icon" 
                size="24" 
                class="transition-all duration-300"
                :class="activeIndex === index ? 'text-white drop-shadow-[0_0_12px_rgba(168,85,247,0.9)] pop-animation' : 'text-slate-400 group-hover:text-slate-200'" 
              />
            </div>

            <span 
              class="text-[11px] sm:text-xs leading-[1.1] transition-all duration-300 w-full text-center px-0.5 break-words antialiased"
              :class="activeIndex === index ? 'text-white font-bold tracking-tight drop-shadow-md' : 'text-slate-500 font-semibold tracking-normal group-hover:text-slate-300'"
            >
              {{ item.label }}
            </span>
          </div>
        </NuxtLink>

      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const $route = useRoute()

const navItems = [
  { path: '/', icon: 'lucide:home', label: 'Home' },
  { path: '/media', icon: 'lucide:camera', label: 'Media' },
  { path: '/quests', icon: 'lucide:alarm-clock', label: 'Action Center' },
  { path: '/lead-center', icon: 'lucide:user-star', label: 'Lead Center' },
  { path: '/reports', icon: 'lucide:bar-chart-3', label: 'Reports' },
  { path: '/billing', icon: 'lucide:credit-card', label: 'Billing' },
  { path: '/settings', icon: 'lucide:package-search', label: 'Office' },
];


// Dynamically track which index is active to drive the sliding pill
const activeIndex = computed(() => {
  // Use startsWith for nested routes (e.g., /leads/123), or exact match for home
  return navItems.findIndex(item => {
    if (item.path === '/') return $route.path === '/'
    return $route.path.startsWith(item.path)
  })
})
</script>

<style scoped>
.-webkit-tap-highlight-transparent {
  -webkit-tap-highlight-color: transparent;
}

/* Custom Spring Bezier for the sliding pill */
.spring-bounce {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Micro-interaction: When an icon becomes active, it does a tiny "pop" 
  This requires the class to be dynamically applied (which we do above)
*/
.pop-animation {
  animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

@keyframes pop {
  0% { transform: scale(0.9); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>

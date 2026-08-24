<template>
  <div
    class="fixed left-0 right-0 z-50 pointer-events-none px-4 bottom-6 lg:bottom-auto lg:top-6 transition-all duration-500"
  >
    <nav class="mx-auto w-full max-w-[400px] lg:max-w-md pointer-events-auto">
      <!-- 
        FROSTED GLASS CONTAINER: 
        Replaces dark bg with translucent white, soft borders, and Apple-style drop shadows. 
      -->
      <div
        class="relative flex h-[64px] lg:h-[68px] items-center rounded-full bg-white/70 px-1.5 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06),0_1px_3px_rgb(0,0,0,0.02)] border border-black/[0.04]"
      >
        <!-- 
          ACTIVE SLIDER BACKGROUND: 
          Replaces the purple glow with a clean, soft zinc pill that slides behind the active item. 
        -->
        <div
          class="absolute inset-y-1.5 rounded-full bg-zinc-100/80 border border-zinc-200/50 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          :class="activeIndex !== -1 ? 'opacity-100' : 'opacity-0'"
          :style="{
            width: `calc((100% - 12px) / ${visibleNavItems.length})`,
            transform: `translateX(${activeIndex * 100}%)`,
          }"
        >
          <!-- 
            ACTIVE INDICATOR DOT: 
            Replaces the top neon bar with a subtle, sophisticated dark dot at the bottom of the active pill. 
          -->
          <div
            class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-zinc-800"
          ></div>
        </div>

        <NuxtLink
          v-for="(item, index) in visibleNavItems"
          :key="item.path"
          :to="item.path"
          class="group relative z-10 flex flex-1 flex-col items-center justify-center h-full rounded-full transition-all duration-300 active:scale-95 outline-none -webkit-tap-highlight-transparent min-w-0"
        >
          <div
            class="relative flex flex-col items-center justify-center gap-1 w-full px-1"
          >
            <!-- ICON -->
            <div
              class="transition-all duration-400 ease-out flex items-center justify-center"
              :class="
                activeIndex === index
                  ? '-translate-y-1 scale-110'
                  : 'translate-y-0 scale-100 group-hover:-translate-y-0.5'
              "
            >
              <Icon
                :name="item.icon"
                size="22"
                class="transition-colors duration-300"
                :class="
                  activeIndex === index
                    ? 'text-zinc-900'
                    : 'text-zinc-400 group-hover:text-zinc-600'
                "
              />
            </div>

            <!-- LABEL -->
            <span
              class="text-[9px] lg:text-[10px] leading-none transition-all duration-300 w-full text-center px-0.5 antialiased uppercase tracking-widest"
              :class="
                activeIndex === index
                  ? 'text-zinc-900 font-bold'
                  : 'text-zinc-400 font-medium group-hover:text-zinc-600'
              "
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

const { can } = usePermissions()
const route = useRoute()

const rawNavItems = [
  { path: '/', icon: 'lucide:home', label: 'Home' },
  { path: '/media', icon: 'lucide:camera', label: 'Media' },
  {
    path: '/action-center',
    icon: 'lucide:alarm-clock',
    label: 'Action Center',
  },
  { path: '/lead-center', icon: 'lucide:user-star', label: 'Lead Center' },
  {
    path: '/call-center',
    icon: 'lucide:headphones',
    label: 'Call Center',
    capability: 'view_call_center',
  },
  { path: '/live', icon: 'lucide:tv-minimal-play', label: 'Live' },
  {
    path: '/reports',
    icon: 'lucide:bar-chart-3',
    label: 'Reports',
    capability: 'view_reports',
  },
  { path: '/settings', icon: 'lucide:package-search', label: 'Office' },
]

// 2. Filtered array for the template and math
const visibleNavItems = computed(() => {
  return rawNavItems.filter((item) => {
    if (!item.capability) return true
    return can(item.capability)
  })
})

// 3. The merged activeIndex with nested route support
const activeIndex = computed(() => {
  return visibleNavItems.value.findIndex((item) => {
    // Exact match for home to prevent '/' from highlighting on every page
    if (item.path === '/') return route.path === '/'

    // Nested route match for everything else
    return route.path.startsWith(item.path)
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
  0% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>

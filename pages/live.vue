<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

definePageMeta({
  requiresAuth: true,
  requiredCapability: 'view_teqciti_live',
  layout: 'fullscreen',
})

const { currentOrg } = await useCurrentOrg()

const {
  isLoading,
  currentPlan,
  bulletins,
  tasks,
  sprintSummary,
  highlights,
  burndown,
  recentUpdates,
  connectionStatus,
  getMonthOverMonthTrend,
  getNextMonthPlan,
  getPreviousMonthSummary,
  disconnect,
} = await useLiveBulletin(currentOrg.value.id)

const trend = ref<any>(null)
const nextMonthPlan = ref<any[]>([])
const previousSummary = ref<any>(null)

const trendDiff = computed<number | null>(() => {
  if (!trend.value || trend.value.current === null || trend.value.previous === null) return null
  return Math.round(trend.value.current - trend.value.previous)
})

onMounted(async () => {
  try {
    const [trendData, nextData, previousSummaryData] = await Promise.all([
      getMonthOverMonthTrend(currentOrg.value.id),
      getNextMonthPlan(currentOrg.value.id),
      getPreviousMonthSummary(currentOrg.value.id),
    ])
    trend.value = trendData
    nextMonthPlan.value = nextData
    previousSummary.value = previousSummaryData
  } catch (e) {
    console.error('Supplemental data skipped:', e)
  }
})

const currentTime = ref(
  new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }),
)
let clockInterval: ReturnType<typeof setInterval>

onMounted(() => {
  clockInterval = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }, 1000)
})

// 2. TRIGGER THE CLEANUP
onUnmounted(() => {
  clearInterval(clockInterval)
  disconnect() // <--- ADD THIS HERE. It kills the WebSocket connection the moment you leave the page!
})

const formatTime = (isoString: string) => {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// Updated to return a simple dot color for the new minimalist cards
const getPriorityDot = (priority: string | null) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
    case 'medium':
      return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
    default:
      return 'bg-zinc-300'
  }
}
</script>

<template>
  <!-- 
    Mobile Updates: 
    Changed `h-screen overflow-hidden` to `min-h-screen lg:h-screen lg:overflow-hidden overflow-x-hidden`.
    This allows natural vertical scrolling on phones, but locks the screen on Laptops/TVs/Monitors.
  -->
  <div
    class="min-h-screen lg:h-screen w-full bg-[#F5F5F7] text-zinc-900 font-sans p-3 lg:p-4 2xl:p-8 overflow-x-hidden lg:overflow-hidden flex flex-col selection:bg-blue-200 selection:text-blue-900 relative"
  >
    <!-- MINIMALIST MARKETING HEADER (Responsive wrapping) -->
    <header
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 lg:mb-4 2xl:mb-10 z-10 shrink-0 px-1 md:px-2 gap-4 md:gap-0"
    >
      <div>
        <h1
          class="text-3xl lg:text-3xl 2xl:text-4xl font-semibold tracking-tight text-zinc-900"
        >
          Teqciti <span class="text-zinc-400 font-medium">Live.</span>
        </h1>
        <p
          class="text-base lg:text-base 2xl:text-xl font-medium tracking-tight text-zinc-500 mt-1"
        >
          A new era in radical transparency.
        </p>

        <p
          class="text-[8px] lg:text-[9px] 2xl:text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1 lg:mt-1.5"
        >
          Powered by Teqciti Live Sync
        </p>

        <div class="mt-2 lg:mt-3 2xl:mt-5 flex items-center gap-2 opacity-80">
          <span class="w-4 h-[1px] bg-zinc-300"></span>
          <p
            class="text-[9px] 2xl:text-[10px] text-zinc-400 font-bold uppercase tracking-widest"
          >
            {{ currentOrg?.name || 'Client Workspace' }}
          </p>
        </div>
      </div>

      <div
        class="flex items-center gap-4 lg:gap-4 2xl:gap-8 w-full md:w-auto justify-between md:justify-end"
      >
        <div
          class="flex items-center gap-2 lg:gap-2.5 bg-white px-3 lg:px-3 2xl:px-4 py-1.5 lg:py-1.5 2xl:py-2 rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-black/[0.02]"
        >
          <span class="relative flex h-2 w-2 lg:h-1.5 lg:w-1.5 2xl:h-2 2xl:w-2">
            <span
              v-if="connectionStatus === 'connected'"
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-full w-full"
              :class="
                connectionStatus === 'connected'
                  ? 'bg-green-500'
                  : 'bg-amber-500'
              "
            ></span>
          </span>
          <span
            class="text-[9px] lg:text-[10px] 2xl:text-xs font-medium text-zinc-500 tracking-wide"
          >
            {{
              connectionStatus === 'connected'
                ? 'Synchronized'
                : 'Reconnecting...'
            }}
          </span>
        </div>
        <div
          class="text-xl lg:text-xl 2xl:text-2xl font-medium tracking-tight text-zinc-800"
        >
          {{ currentTime }}
        </div>
      </div>
    </header>

    <!-- LOADING SHIELD -->
    <div
      v-if="isLoading"
      class="flex-1 z-20 flex flex-col items-center justify-center min-h-[50vh]"
    >
      <div
        class="w-10 h-10 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin mb-6"
      ></div>
      <div
        class="text-xs font-medium tracking-widest text-zinc-400 animate-pulse uppercase"
      >
        Fetching Telemetry...
      </div>
    </div>

    <!-- MAIN DISPLAY GRID -->
    <main
      v-else
      class="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-4 lg:gap-4 2xl:gap-8 flex-1 z-10 lg:min-h-0 px-1 md:px-2 pb-6 lg:pb-0"
    >
      <!-- LEFT WING -->
      <section
        class="col-span-1 lg:col-span-4 xl:col-span-3 flex flex-col gap-4 lg:gap-4 2xl:gap-6 lg:h-full lg:pb-1 2xl:pb-2"
      >
        <!-- Sprint HUD -->
        <div
          class="bg-white rounded-2xl 2xl:rounded-3xl p-4 lg:p-5 2xl:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.02] shrink-0 relative overflow-hidden"
        >
          <h2
            class="text-[10px] 2xl:text-[11px] text-zinc-400 font-semibold uppercase tracking-widest mb-3 lg:mb-4 2xl:mb-6"
          >
            Current Sprint
          </h2>

          <div class="flex items-baseline gap-2 mb-4">
            <!-- FIXED: taskCompletionPercent -->
            <div
              class="text-4xl lg:text-5xl 2xl:text-6xl font-light text-zinc-900 tracking-tighter"
            >
              {{ sprintSummary?.taskCompletionPercent ?? 0
              }}<span
                class="text-xl lg:text-2xl 2xl:text-3xl text-zinc-300 font-normal"
                >%</span
              >
            </div>
          </div>

          <div
            class="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden mb-5 lg:mb-6 2xl:mb-8"
          >
            <div
              class="h-full bg-zinc-800 rounded-full transition-all duration-1000 ease-out"
              :style="`width: ${sprintSummary?.taskCompletionPercent ?? 0}%`"
            ></div>
          </div>

              <div
                  class="grid grid-cols-2 gap-3 2xl:gap-4 border-t border-zinc-100 pt-3 lg:pt-4 2xl:pt-5"
                  >
                  <div>
                      <div
                          class="text-[8px] lg:text-[9px] 2xl:text-[10px] text-zinc-400 font-medium uppercase tracking-widest mb-1"
                          >
                          Status
                      </div>
                          <div
                              class="text-[11px] lg:text-xs 2xl:text-sm font-medium mt-1"
                              :class="
                              sprintSummary?.onTrack === true ? 'text-green-600' :
                              sprintSummary?.onTrack === false ? 'text-red-500' :
                              'text-zinc-300'
                              "
                              >
                              {{
                              sprintSummary?.onTrack === true ? 'On Track' :
                              sprintSummary?.onTrack === false ? 'Behind' :
                              '--'
                              }}
                          </div>   
                  </div>
                  <div>
                      <div
                          class="text-[8px] lg:text-[9px] 2xl:text-[10px] text-zinc-400 font-medium uppercase tracking-widest mb-1"
                          >
                          Velocity
                      </div>
                          <div class="flex items-end gap-1">
                              <div
                                  class="text-sm lg:text-base 2xl:text-lg font-semibold text-zinc-800"
                                  >
                                  {{
                                  sprintSummary?.velocity
                                  ? sprintSummary.velocity.toFixed(1)
                                  : 0
                                  }}<span
                                      class="text-[9px] lg:text-[10px] 2xl:text-xs font-medium text-zinc-400 ml-1"
                                      >pts/day</span
                                  >
                              </div>
                          </div>
                                  <div
                                      v-if="previousSummary"
                                      class="text-[8px] lg:text-[9px] 2xl:text-[10px] text-zinc-400 font-medium mt-1"
                                      >
                                      Last Mo:
                                      {{
                                      previousSummary.velocity
                                      ? previousSummary.velocity.toFixed(1)
                                      : 0
                                      }}
                                  </div>
                  </div>
              </div>
        </div>

        <!-- Agency Highlights -->
        <div
          class="bg-white rounded-2xl 2xl:rounded-3xl p-4 lg:p-5 2xl:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.02] flex-1 flex flex-col justify-center min-h-[140px] lg:min-h-[160px] 2xl:min-h-[220px]"
        >
          <h2
            class="text-[10px] 2xl:text-[11px] text-zinc-400 font-semibold uppercase tracking-widest mb-3 lg:mb-4 2xl:mb-6"
          >
            Execution Analytics
          </h2>
          <div class="space-y-3 lg:space-y-4 2xl:space-y-6">
            <div class="flex justify-between items-end">
              <div
                class="text-[9px] 2xl:text-[10px] text-zinc-400 font-medium uppercase tracking-widest mb-1"
              >
                Lifetime Output
              </div>
              <div
                class="text-lg lg:text-xl 2xl:text-3xl font-medium text-zinc-900 tracking-tight"
              >
                {{ highlights?.totalCompletedAllTime ?? 0 }}
              </div>
            </div>

            <div
              class="flex justify-between items-end border-t border-zinc-100 pt-2.5 lg:pt-3 2xl:pt-4"
            >
              <div>
                <div
                  class="text-[9px] 2xl:text-[10px] text-zinc-400 font-medium uppercase tracking-widest mb-1"
                >
                  MoM Trend (Completion)
                </div>
                <div
                  class="text-[9px] lg:text-[10px] 2xl:text-xs text-zinc-500 font-medium"
                >
                  Avg Monthly Pace:
                  {{ highlights?.averageItemsCompletedPerMonth ?? 0 }} items
                </div>
              </div>
              <!-- FIXED: Trend Diff Calculation -->
              <div
                class="text-base lg:text-lg 2xl:text-xl font-medium tracking-tight"
                :class="
                  trendDiff !== null && trendDiff >= 0
                    ? 'text-green-600'
                    : 'text-red-500'
                "
              >
                <span v-if="trendDiff !== null"
                  >{{ trendDiff >= 0 ? '+' : '' }}{{ trendDiff }}%</span
                >
                <span v-else class="text-zinc-300">--</span>
              </div>
            </div>

            <div
              class="flex justify-between items-end border-t border-zinc-100 pt-2.5 lg:pt-3 2xl:pt-4"
            >
              <div
                class="text-[9px] 2xl:text-[10px] text-zinc-400 font-medium uppercase tracking-widest mb-1"
              >
                Current Streak
              </div>
              <div class="flex items-baseline gap-1">
                <div
                  class="text-base lg:text-lg 2xl:text-2xl font-medium text-zinc-800 tracking-tight"
                >
                  {{ highlights?.currentStreak ?? 0 }}
                </div>
                <div
                  class="text-[8px] lg:text-[9px] 2xl:text-[10px] font-medium text-zinc-400 uppercase"
                >
                  Months
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CENTER CONSOLE: SPLIT SCROLL ZONES (Col 6) -->
      <section
        class="col-span-1 lg:col-span-8 xl:col-span-6 flex flex-col h-[500px] lg:h-full bg-white rounded-2xl 2xl:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.02] overflow-hidden"
      >
        <div
          class="flex justify-between items-end p-4 lg:p-5 2xl:p-8 pb-3 2xl:pb-4 shrink-0 bg-white z-10 border-b border-zinc-100"
        >
          <h2
            class="text-[10px] 2xl:text-[11px] text-zinc-400 font-semibold uppercase tracking-widest"
          >
            Active Operations Canvas
          </h2>
          <span class="text-[9px] 2xl:text-[10px] font-medium text-zinc-400"
            >{{ currentPlan.length }} Items Synchronized</span
          >
        </div>

        <div
          class="flex-1 flex flex-col min-h-0 p-4 lg:p-5 2xl:p-8 pt-4 2xl:pt-6 gap-3 lg:gap-4 2xl:gap-6 bg-[#FAFAFA]"
        >
          <div
            v-if="currentPlan.length === 0"
            class="h-full flex flex-col items-center justify-center text-zinc-400"
          >
            <svg
              class="w-8 h-8 lg:w-10 lg:h-10 2xl:w-12 2xl:h-12 mb-3 2xl:mb-4 text-zinc-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
            <p
              class="text-[10px] 2xl:text-[11px] uppercase tracking-widest font-medium"
            >
              Canvas is clear
            </p>
          </div>

          <!-- COMPACT BROADCASTS (BULLETINS) -->
          <div
            v-if="bulletins.length > 0"
            class="flex flex-col min-h-0 relative"
            :class="tasks.length > 0 ? 'flex-1' : 'flex-auto'"
          >
            <h3
              class="shrink-0 text-[9px] 2xl:text-[10px] font-medium text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-1.5 2xl:pb-2 mb-2 2xl:mb-3"
            >
              Broadcasts
            </h3>

            <!-- White gradient fade at the bottom to cue scrolling -->
            <div
              class="absolute bottom-0 left-0 w-full h-8 2xl:h-12 bg-gradient-to-t from-[#FAFAFA] to-transparent z-10 pointer-events-none"
            ></div>

            <div
              class="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-2 lg:space-y-2.5 2xl:space-y-3 pb-6 2xl:pb-8 relative z-0"
            >
              <!-- Redesigned, ultra-sleek list item cards -->
              <div
                v-for="item in bulletins"
                :key="item.id"
                class="bg-white rounded-lg 2xl:rounded-xl p-3 lg:p-3.5 2xl:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-zinc-100 transition-all"
              >
                <div class="flex justify-between items-start gap-3 2xl:gap-4">
                  <div class="flex flex-col gap-1 2xl:gap-1.5 flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <span
                        class="w-1.5 h-1.5 rounded-full shrink-0"
                        :class="getPriorityDot(item.priority)"
                      ></span>
                      <h4
                        class="text-[11px] lg:text-xs 2xl:text-sm font-semibold text-zinc-900 tracking-tight leading-tight truncate"
                      >
                        {{ item.title }}
                      </h4>
                      <span
                        v-if="item.pinned"
                        class="shrink-0 ml-1 bg-blue-50 text-blue-600 text-[7px] 2xl:text-[8px] font-bold uppercase tracking-widest px-1 2xl:px-1.5 py-0.5 rounded-sm border border-blue-100"
                      >
                        Pinned
                      </span>
                    </div>

                    <!-- line-clamp-2 keeps descriptions uniformly compact -->
                    <p
                      v-if="item.description"
                      class="text-[9px] lg:text-[10px] 2xl:text-[11px] text-zinc-500 leading-relaxed line-clamp-2 pl-3 border-l border-zinc-100 ml-[2px]"
                    >
                      {{ item.description }}
                    </p>
                  </div>

                  <div
                    v-if="item.dueDate"
                    class="text-[8px] 2xl:text-[9px] font-medium text-zinc-400 uppercase tracking-widest shrink-0 pt-0.5"
                  >
                    {{
                      new Date(item.dueDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SPRINT TASKS -->
          <div
            v-if="tasks.length > 0"
            class="flex flex-col min-h-0 relative"
            :class="bulletins.length > 0 ? 'flex-1' : 'flex-auto'"
          >
            <h3
              class="shrink-0 text-[9px] 2xl:text-[10px] font-medium text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-1.5 2xl:pb-2 mb-2 2xl:mb-3 mt-1 2xl:mt-2"
            >
              Sprint Tasks
            </h3>

            <div
              class="absolute bottom-0 left-0 w-full h-8 2xl:h-12 bg-gradient-to-t from-[#FAFAFA] to-transparent z-10 pointer-events-none"
            ></div>

            <div
              class="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-1.5 lg:space-y-2 pb-6 2xl:pb-8 relative z-0"
            >
              <div
                v-for="task in tasks"
                :key="task.id"
                class="bg-white rounded-md 2xl:rounded-lg p-2 lg:p-2.5 2xl:p-3 shadow-sm border border-zinc-100 flex items-center justify-between group hover:border-zinc-200 transition-colors"
              >
                <div
                  class="flex items-center gap-2 2xl:gap-3 truncate pr-3 2xl:pr-4"
                >
                  <div
                    class="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full flex items-center justify-center border shrink-0"
                    :class="
                      task.status === 'done'
                        ? 'bg-green-500 border-green-600'
                        : 'border-zinc-300 bg-zinc-50'
                    "
                  >
                    <svg
                      v-if="task.status === 'done'"
                      class="w-1.5 h-1.5 lg:w-2 lg:h-2 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h4
                    class="text-[10px] lg:text-[11px] 2xl:text-xs font-medium tracking-tight truncate"
                    :class="
                      task.status === 'done'
                        ? 'text-zinc-400 line-through'
                        : 'text-zinc-800'
                    "
                  >
                    {{ task.title }}
                  </h4>
                </div>
                <div
                  v-if="task.dueDate"
                  class="text-[8px] 2xl:text-[9px] font-medium uppercase tracking-widest shrink-0"
                  :class="
                    task.status === 'done' ? 'text-zinc-300' : 'text-zinc-400'
                  "
                >
                  {{
                    new Date(task.dueDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- RIGHT WING -->
      <section
        class="col-span-1 lg:col-span-12 xl:col-span-3 flex flex-col lg:flex-row xl:flex-col h-full gap-4 lg:gap-4 2xl:gap-6 lg:pb-1 2xl:pb-2"
      >
        <!-- Live Activity Stream -->
        <div
          class="bg-white rounded-2xl 2xl:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.02] flex-1 overflow-hidden relative flex flex-col min-h-[220px] lg:min-h-[250px] 2xl:min-h-[300px]"
        >
          <div
            class="p-4 lg:p-5 2xl:p-6 pb-3 2xl:pb-4 shrink-0 border-b border-zinc-100"
          >
            <h2
              class="text-[10px] 2xl:text-[11px] text-zinc-400 font-semibold uppercase tracking-widest"
            >
              Live Event Stream
            </h2>
          </div>

          <div
            class="absolute bottom-0 left-0 w-full h-12 lg:h-16 2xl:h-24 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"
          ></div>

          <div
            class="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-3 lg:p-4 2xl:p-6 relative"
          >
            <TransitionGroup
              name="feed"
              tag="ul"
              class="space-y-1 flex flex-col relative z-0"
            >
              <li
                v-for="update in recentUpdates"
                :key="`${update.item.id}-${update.receivedAt}`"
                class="p-2.5 lg:p-3 2xl:p-4 rounded-xl 2xl:rounded-2xl transition-colors hover:bg-zinc-50 relative group"
              >
                <div
                  class="flex justify-between items-baseline mb-1 lg:mb-1.5 2xl:mb-2"
                >
                  <span
                    class="text-[8px] 2xl:text-[9px] font-bold tracking-widest uppercase"
                    :class="{
                      'text-green-500': update.event === 'create',
                      'text-amber-500': update.event === 'update',
                      'text-red-500': update.event === 'delete',
                    }"
                  >
                    {{
                      update.event === 'create'
                        ? 'Added'
                        : update.event === 'update'
                          ? 'Updated'
                          : 'Removed'
                    }}
                  </span>
                  <span
                    class="text-[8px] lg:text-[9px] 2xl:text-[10px] font-medium text-zinc-400"
                    >{{ formatTime(update.receivedAt) }}</span
                  >
                </div>
                <div
                  class="text-[10px] lg:text-[11px] 2xl:text-[13px] font-medium text-zinc-800 leading-snug mb-1"
                >
                  {{ update.item.title }}
                </div>
                <div
                  class="text-[9px] lg:text-[10px] 2xl:text-[11px] text-zinc-400 capitalize"
                >
                  {{ update.item.type }}
                  <span v-if="update.item.status" class="mx-1">•</span>
                  <span
                    v-if="update.item.status"
                    class="text-zinc-600 font-medium"
                    >{{ update.item.status.replace('_', ' ') }}</span
                  >
                </div>
              </li>
            </TransitionGroup>

            <div
              v-if="recentUpdates.length === 0"
              class="h-full flex flex-col items-center justify-center text-zinc-300 pb-6 lg:pb-8 2xl:pb-10"
            >
              <svg
                class="w-5 h-5 lg:w-6 lg:h-6 2xl:w-8 2xl:h-8 mb-2 2xl:mb-3 opacity-60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
              <span
                class="text-[8px] lg:text-[9px] 2xl:text-[10px] font-medium tracking-widest uppercase"
                >Monitoring Events...</span
              >
            </div>
          </div>
        </div>

        <!-- Forward Projection -->
        <div
          class="bg-white rounded-2xl 2xl:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.02] p-4 lg:p-5 2xl:p-6 shrink-0 flex items-center justify-between"
        >
          <div>
            <h2
              class="text-[9px] 2xl:text-[10px] text-zinc-400 font-medium uppercase tracking-widest mb-1"
            >
              Pipeline Projection
            </h2>
            <div
              class="text-[11px] lg:text-xs 2xl:text-sm font-semibold text-zinc-800 tracking-tight"
            >
              Scheduled Next Month
            </div>
          </div>
          <div
            class="text-xl lg:text-2xl 2xl:text-3xl font-light text-zinc-900 tracking-tighter"
          >
            {{ nextMonthPlan.length
            }}<span
              class="text-[9px] lg:text-[10px] 2xl:text-sm font-medium text-zinc-400 ml-1 tracking-normal"
              >items</span
            >
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Elegant, slow, sliding transitions for the live feed */
.feed-enter-active,
.feed-leave-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.feed-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
.feed-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
.feed-leave-active {
  position: absolute;
  width: calc(100% - 3rem);
}
</style>

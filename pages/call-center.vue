<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  requiresAuth: true,
  requiredCapability: 'view_call_center',
});

const { 
  currentReport, 
  activeDate,
  systemStatus, 
  outboundProactivity, 
  inboundAnswerRate, 
  generatedInsights,
  isLoading,
  error,
  isDemoMode,
  cycleNext, 
  cyclePrev 
} = await useCallMetrics()

const formatLabel = (str: string) => str.replace(/_/g, ' ').toUpperCase()

// Tooltip dictionary mapping metric keys to standard business definitions
const metricDefinitions: Record<string, string> = {
  global_aht: "Average Handle Time: Total conversation duration divided by total connected calls.",
  outbound_proactivity: "The percentage of total calls initiated by agents rather than reactive inbound traffic.",
  inbound_answer_rate: "The proportion of incoming calls handled successfully by live customer agents.",
  ghosted_leads: "Inbound missed calls or voicemails that have received zero outbound callbacks within a 24-hour SLA.",
  avg_response_time: "The average time elapsed between an inbound dropped call and an agent's return outreach.",
  fcr_failure_rate: "First Contact Resolution Failure: Percentage of clients requiring repeat contacts within 48 hours.",
  repeat_callers: "Deduplicated count of specific clients who established contact multiple times within a rolling window.",
  peak_traffic_hour: "The specific 60-minute daily block that exhibited the highest concentration of incoming traffic.",
  urgent_voicemails: "Voicemail audio files containing high-priority keyword triggers identified locally by speech recognition.",
  dead_air_incidents: "Calls exhibiting uncharacteristic continuous silence segments exceeding a baseline threshold of 15 seconds.",
  language_split: "The localized percentage distribution of system conversations prioritizing English versus Swahili/Sheng."
}

const weeklySummary = ref<string | null>(null)
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-sky-400 font-sans p-4 md:p-6 pb-32 overflow-x-hidden flex flex-col selection:bg-indigo-500 selection:text-white relative">
    
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-[url('https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQ9lQMdimyX1n4m3wt6u6t0nN3Ae4yF2NXTuJWwSq5XvNZfAbLVFV-xF0-Y12574OBbWK-tMq7MVp9vaXM')] bg-cover bg-center bg-no-repeat opacity-[0.15] mix-blend-luminosity"></div>
      <div class="absolute inset-0 bg-slate-950/80"></div>
      <div class="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
    </div>

    <header class="flex flex-col xl:flex-row justify-between items-start xl:items-end border-b border-sky-500/20 pb-4 mb-6 z-10 gap-4">
      <div>
        <div class="flex items-center gap-3">
          <span class="w-2.5 h-2.5 bg-sky-400 rounded-sm shadow-[0_0_8px_#38bdf8]" :class="isDemoMode ? 'animate-none bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'animate-pulse'"></span>
          <h1 class="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-400 to-indigo-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]">
            Call Center
          </h1>
        </div>
        <p class="text-[10px] text-sky-600/80 tracking-widest mt-1 font-mono uppercase">
          Enterprise Communications Hub // Status: {{ isDemoMode ? 'DEMO_MODE_ACTIVE' : 'Live Sync' }}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">
        <div class="flex items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md border border-sky-500/20 rounded p-2 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
          <span class="text-[10px] font-bold tracking-wider font-mono uppercase" :class="isDemoMode ? 'text-amber-400' : 'text-slate-500'">Demo State</span>
          <button @click="isDemoMode = !isDemoMode" class="relative inline-flex h-5 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-slate-800" :class="{ 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]': isDemoMode }">
            <span class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 transition duration-200 ease-in-out" :class="isDemoMode ? 'translate-x-6' : 'translate-x-0'" />
          </button>
        </div>

        <div class="flex items-center justify-between bg-slate-900/80 backdrop-blur-md border border-sky-500/20 rounded p-1 flex-1 sm:flex-initial gap-4 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
          <button @click="cyclePrev" :disabled="isLoading" class="px-3 py-1 text-xs font-bold border border-sky-500/20 hover:border-sky-400 hover:bg-sky-950/40 text-sky-400 transition-all active:scale-95 rounded-sm disabled:opacity-50">
            &lt;&lt; PREV
          </button>
          <div class="text-center px-4 min-w-[140px]">
            <div class="text-white font-bold text-sm tracking-widest font-mono">{{ activeDate || 'LOADING...' }}</div>
            <div class="text-[9px] tracking-widest font-bold uppercase mt-0.5" :class="isDemoMode ? 'text-amber-400' : 'text-indigo-400'">
              {{ currentReport?.reportType || 'TELEMETRY' }}
            </div>
          </div>
          <button @click="cycleNext" :disabled="isLoading" class="px-3 py-1 text-xs font-bold border border-sky-500/20 hover:border-sky-400 hover:bg-sky-950/40 text-sky-400 transition-all active:scale-95 rounded-sm disabled:opacity-50">
            NEXT &gt;&gt;
          </button>
        </div>
      </div>
    </header>

    <div v-if="isLoading" class="flex-1 z-20 flex flex-col items-center justify-center bg-slate-950/50 backdrop-blur-sm rounded-lg border border-sky-500/10 min-h-[350px]">
      <div class="w-10 h-10 border-4 border-sky-500/20 border-t-sky-400 rounded-full animate-spin mb-4" :class="{ 'border-t-amber-400': isDemoMode }"></div>
      <div class="font-mono text-[10px] tracking-widest animate-pulse uppercase" :class="isDemoMode ? 'text-amber-400' : 'text-sky-400'">
        {{ isDemoMode ? 'COMPUTING DEMO MATRIX...' : 'SYNCHRONIZING TELEMETRY NODE...' }}
      </div>
    </div>

    <div v-else-if="!currentReport || error" class="flex-1 z-10 flex items-center justify-center min-h-[350px]">
      <div class="bg-slate-900/80 backdrop-blur-md border border-rose-500/30 p-8 rounded text-center shadow-2xl">
        <div class="text-rose-500 mb-2"><svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div>
        <h2 class="text-sm text-rose-400 font-bold tracking-widest uppercase font-mono mb-1">{{ error || 'NO TELEMETRY RECORDED' }}</h2>
        <p class="text-[10px] text-slate-400 font-mono uppercase">Data payload missing for {{ activeDate }}</p>
      </div>
    </div>

    <main v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 z-10 my-auto">
      
      <section class="flex flex-col justify-center">
        <div class="border border-sky-500/20 bg-slate-900/60 backdrop-blur-md p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative rounded-sm">
          <div class="flex justify-between items-center mb-6 border-b border-sky-500/10 pb-2">
            <h2 class="text-xs text-pink-400 tracking-widest font-bold uppercase">Call Volume</h2>
            <span class="text-[9px] px-1.5 py-0.5 bg-sky-950/50 text-sky-300 border border-sky-500/20 rounded uppercase">{{ isDemoMode ? 'MOCK_DATA' : 'LIVE_DATA' }}</span>
          </div>
          <ul class="space-y-4 font-mono">
            <li class="flex justify-between items-center border-b border-slate-800/50 pb-2">
              <span class="text-xs tracking-wider text-slate-400 font-semibold">INBOUND CALLS</span>
              <span class="text-2xl font-black text-white">{{ currentReport.core.inbound !== null ? currentReport.core.inbound : '--' }}</span>
            </li>
            <li class="flex justify-between items-center border-b border-slate-800/50 pb-2">
              <span class="text-xs tracking-wider text-slate-400 font-semibold">OUTBOUND CALLS</span>
              <span class="text-2xl font-black text-purple-400 drop-shadow-[0_0_6px_rgba(129,140,248,0.3)]">{{ currentReport.core.outbound !== null ? currentReport.core.outbound : '--' }}</span>
            </li>
            <li class="flex justify-between items-center border-b border-slate-800/50 pb-2">
              <span class="text-xs tracking-wider text-slate-400 font-semibold">INTERNAL CALLS</span>
              <span class="text-2xl font-black text-slate-300">{{ currentReport.core.internal !== null ? currentReport.core.internal : '--' }}</span>
            </li>
            <li class="flex justify-between items-center border-b border-slate-800/50 pb-2">
              <span class="text-xs tracking-wider font-semibold" :class="(currentReport.core.missed ?? 0) > 0 ? 'text-rose-400' : 'text-slate-500'">MISSED CALLS</span>
              <span class="text-2xl font-black" :class="(currentReport.core.missed ?? 0) > 0 ? 'text-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]' : 'text-slate-500'">{{ currentReport.core.missed !== null ? currentReport.core.missed : '--' }}</span>
            </li>
          </ul>
        </div>
      </section>

      <section class="flex flex-col items-center justify-center relative z-0 min-h-[320px]">
        <div :class="['w-full max-w-sm mb-6 text-center border p-2 text-[10px] tracking-widest font-bold uppercase transition-all duration-300 rounded-sm font-mono', systemStatus.color]">
          ● {{ systemStatus.text }}
        </div>

        <div class="relative w-64 h-64 rounded-full border border-sky-500/20 flex items-center justify-center bg-slate-900/50 backdrop-blur-md shadow-2xl">
          <div class="absolute inset-2 border border-dashed border-indigo-500/20 rounded-full animate-[spin_40s_linear_infinite]" :class="{ 'border-amber-500/20': isDemoMode }"></div>
          <div class="absolute inset-6 border border-sky-400/20 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
          <div class="absolute inset-10 rounded-full border border-sky-500/30 overflow-hidden shadow-[0_0_20px_rgba(14,165,233,0.15)]">
            <div class="absolute inset-0 bg-[url('https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQ9lQMdimyX1n4m3wt6u6t0nN3Ae4yF2NXTuJWwSq5XvNZfAbLVFV-xF0-Y12574OBbWK-tMq7MVp9vaXM')] bg-cover bg-center mix-blend-screen opacity-50 grayscale-[30%]"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
          </div>
          <div class="z-20 text-center bg-slate-950/80 px-5 py-3 rounded-md border border-sky-500/20 shadow-xl backdrop-blur-md">
            <div class="text-[9px] text-sky-500 tracking-widest font-bold uppercase">Total Interactions</div>
            <div class="text-4xl font-black text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] mt-0.5 font-mono">{{ (currentReport.core.inbound ?? 0) + (currentReport.core.outbound ?? 0) }}</div>
            <div class="text-[8px] text-slate-400 tracking-wider mt-0.5 uppercase">Processed</div>
          </div>
        </div>

        <div class="w-full max-w-sm mt-8 space-y-5 px-4 font-mono">
          <div>
            <div class="flex justify-between text-[10px] mb-1.5 tracking-wider">
              <span class="text-slate-400 uppercase">Outbound Proactivity</span>
              <span class="text-indigo-400 font-bold" :class="{ 'text-amber-400': isDemoMode }">{{ outboundProactivity !== null ? outboundProactivity + '%' : 'N/A' }}</span>
            </div>
            <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r transition-all duration-500 ease-out" :class="isDemoMode ? 'from-amber-600 to-amber-400 shadow-[0_0_8px_#fbbf24]' : 'from-blue-600 to-indigo-400 shadow-[0_0_8px_#818cf8]'" :style="`width: ${outboundProactivity ?? 0}%`"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-[10px] mb-1.5 tracking-wider">
              <span class="text-slate-400 uppercase">Inbound Answer Rate</span>
              <span class="text-emerald-400 font-bold">{{ inboundAnswerRate !== null ? inboundAnswerRate + '%' : 'N/A' }}</span>
            </div>
            <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_8px_#34d399] transition-all duration-500 ease-out" :style="`width: ${inboundAnswerRate ?? 0}%`"></div>
            </div>
          </div>
        </div>

        <div v-if="currentReport.extensions && currentReport.extensions.length > 0" class="w-full max-w-sm mt-6 px-4 font-mono">
          <h3 class="text-[9px] text-sky-600 tracking-widest font-bold uppercase border-b border-sky-500/20 pb-1 mb-2.5">Extension Nodes</h3>
          <div class="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
            <div v-for="ext in currentReport.extensions" :key="ext.id || 'unknown'" class="bg-slate-900/70 border p-2.5 rounded flex flex-col gap-1 shadow-md transition-colors hover:bg-slate-900" :class="isDemoMode ? 'border-amber-500/10' : 'border-sky-500/10'">
              <div class="flex justify-between items-center border-b border-slate-800/60 pb-1">
                <span class="text-xs font-bold text-slate-200">{{ ext.id || 'Unknown' }}</span>
                <span class="text-xs font-black px-1.5 py-0.5 bg-slate-950/80 rounded" :class="isDemoMode ? 'text-amber-400' : 'text-sky-400'">{{ ext.volume !== null ? ext.volume : '--' }} CALLS</span>
              </div>
              <div class="flex justify-between text-[9px] text-slate-400 mt-0.5">
                <div>TALK TIME: <span class="text-slate-200 font-bold">{{ ext.talk_time ?? '--' }}</span></div>
                <div>AHT: <span class="text-slate-200 font-bold">{{ ext.aht ?? '--' }}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="flex flex-col justify-center z-0">
        <div class="border p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative rounded-sm" :class="isDemoMode ? 'border-amber-500/20 bg-slate-900/40' : 'border-indigo-500/20 bg-slate-900/60 backdrop-blur-md'">
          <div class="flex justify-between items-center mb-5 border-b pb-2" :class="isDemoMode ? 'border-amber-500/10' : 'border-indigo-500/10'">
            <h2 class="text-xs tracking-widest font-bold uppercase" :class="isDemoMode ? 'text-amber-400' : 'text-indigo-400'">Key Performance Indicators</h2>
            <span class="text-[9px] px-1.5 py-0.5 rounded uppercase" :class="isDemoMode ? 'bg-amber-950/50 text-amber-300 border border-amber-500/20' : 'bg-indigo-950/50 text-indigo-300 border border-indigo-500/20'">Data Stack</span>
          </div>
          
          <div class="grid grid-cols-2 gap-3 font-mono">
            <template v-for="(value, key) in currentReport.extraMetrics" :key="key">
              <div 
                v-if="value !== null"
                class="p-3 border-l-2 transition-colors rounded-r-sm relative group flex flex-col justify-between min-h-[64px]"
                :class="isDemoMode ? 'bg-slate-900/30 border-amber-500/40 hover:bg-slate-800/40' : 'bg-slate-800/40 border-indigo-500/40 hover:bg-slate-800/70'"
              >
                <div class="flex items-start justify-between gap-1">
                  <div class="text-[9px] text-slate-400 tracking-wide break-words whitespace-normal leading-tight">{{ formatLabel(String(key)) }}</div>
                  
                  <div v-if="metricDefinitions[key]" class="cursor-help text-[9px] text-slate-500 border border-slate-700/60 rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold font-sans hover:text-white hover:border-slate-400 transition-colors">
                    i
                    <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-950 border border-slate-800 text-slate-300 text-[9px] p-2 rounded shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-30 font-sans tracking-normal leading-normal whitespace-normal">
                      {{ metricDefinitions[key] }}
                      <div class="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-950 border-r border-b border-slate-800 rotate-45 -mt-[4px]"></div>
                    </div>
                  </div>
                </div>
                <div class="text-sm font-bold text-slate-100 mt-1 break-words whitespace-normal tracking-wider">{{ value }}</div>
              </div>
            </template>
          </div>

          <div v-if="!Object.values(currentReport.extraMetrics).some(v => v !== null)" class="text-center py-6 border border-dashed border-indigo-500/20 rounded">
            <span class="text-[10px] text-indigo-500/50 font-mono uppercase tracking-widest">No Auxiliary Data Available</span>
          </div>
        </div>
      </section>

    </main>

    <div v-if="currentReport && !isLoading" class="flex flex-col gap-4 mt-6 z-10">
      
      <footer class="border bg-slate-900/80 backdrop-blur-md p-5 relative shadow-2xl rounded-sm" :class="isDemoMode ? 'border-amber-500/20' : 'border-sky-500/20'">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-sky-500/10 pb-3 mb-3 gap-2">
          <div class="flex gap-2 items-center">
            <div class="w-1.5 h-1.5 animate-pulse rounded-full" :class="isDemoMode ? 'bg-amber-400' : 'bg-indigo-400'"></div>
            <h3 class="text-xs tracking-widest font-bold uppercase" :class="isDemoMode ? 'text-amber-400' : 'text-sky-400'">
              Daily Intelligence Summary // <span :class="isDemoMode ? 'text-amber-500' : 'text-indigo-400'">{{ currentReport.reportType || 'COMPUTED' }}</span>
            </h3>
          </div>
        </div>
        <div class="text-sm leading-relaxed text-sky-200/90 font-mono pl-4 border-l-2 py-1 space-y-2" :class="isDemoMode ? 'border-amber-500/30' : 'border-indigo-500/30'">
          <p v-for="(insight, index) in generatedInsights" :key="index">
            &gt; {{ insight }}<span v-if="index === generatedInsights.length - 1" class="animate-[ping_1.5s_infinite] font-black ml-1" :class="isDemoMode ? 'text-amber-400' : 'text-indigo-400'">_</span>
          </p>
        </div>
      </footer>

      <footer v-if="weeklySummary !== null" class="border border-purple-500/20 bg-slate-900/80 backdrop-blur-md p-5 relative shadow-2xl rounded-sm">
        <div class="flex gap-2 items-center border-b border-purple-500/10 pb-3 mb-3">
          <div class="w-1.5 h-1.5 bg-purple-400 animate-pulse rounded-full"></div>
          <h3 class="text-xs tracking-widest font-bold text-purple-400 uppercase">Weekly Synthesis</h3>
        </div>
        <p class="text-sm leading-relaxed text-purple-200/90 font-mono pl-4 border-l-2 border-purple-500/30 py-1">
          &gt; {{ weeklySummary }}<span class="animate-[ping_1.5s_infinite] text-purple-400 font-black ml-1">_</span>
        </p>
      </footer>
      <footer v-else class="border border-dashed border-slate-700/50 bg-slate-900/20 backdrop-blur-sm p-4 relative rounded-sm flex items-center justify-center opacity-70">
        <span class="text-[10px] text-slate-500 tracking-widest uppercase font-mono">Weekly Synthesis // Awaiting Cycle Completion</span>
      </footer>

    </div>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5); 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(14, 165, 233, 0.3); 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(14, 165, 233, 0.5); 
}
</style>

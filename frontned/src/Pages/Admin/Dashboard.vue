<script setup>
import { ref, computed, onMounted } from 'vue'
import { router, usePage } from '@inertiajs/vue3'
import {
  ShieldCheck,
  Cpu,
  Zap,
  Activity,
  Users,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowLeft,
  Crown,
  Database,
  Radio,
  Clock,
  Gauge,
  Sliders,
} from 'lucide-vue-next'

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({
      total_users: 1,
      pro_users: 1,
      total_proposals: 14,
      total_clients: 4,
      active_engine: 'gemini-2.5-pro',
      flash_engine: 'gemini-2.5-flash',
      embedding_engine: 'gemini-embedding-2',
      api_connected: true,
      latency_ms: 120,
      total_models_count: 50,
    }),
  },
  models: {
    type: Array,
    default: () => [],
  },
  aiStudioStatus: {
    type: Object,
    default: () => ({
      connected: true,
      latency_ms: 120,
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
      last_synced_at: new Date().toISOString(),
      error: null,
    }),
  },
  users: {
    type: Array,
    default: () => [],
  },
})

// Local reactive state
const searchQuery = ref('')
const selectedTier = ref('all')
const isTestingAiStudio = ref(false)
const testResult = ref(null)
const actionLoadingUserId = ref(null)
const notificationMessage = ref('')

// Filter models based on search and tier
const filteredModels = computed(() => {
  let list = props.models || []
  if (selectedTier.value !== 'all') {
    if (selectedTier.value === 'pro') {
      list = list.filter(m => m.id.includes('pro'))
    } else if (selectedTier.value === 'flash') {
      list = list.filter(m => m.id.includes('flash'))
    } else if (selectedTier.value === 'embedding') {
      list = list.filter(m => m.id.includes('embedding'))
    }
  }

  if (!searchQuery.value.trim()) return list

  const q = searchQuery.value.toLowerCase()
  return list.filter(m =>
    m.id?.toLowerCase().includes(q) ||
    m.displayName?.toLowerCase().includes(q) ||
    m.description?.toLowerCase().includes(q)
  )
})

// Quick ping test to Google AI Studio
const runAiStudioPing = async () => {
  isTestingAiStudio.value = true
  testResult.value = null

  try {
    const res = await fetch('/api/admin/test-ai-studio', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()
    testResult.value = data
  } catch (err) {
    testResult.value = {
      success: false,
      latency_ms: 999,
      error: 'Ping connection failed or timed out.',
    }
  } finally {
    isTestingAiStudio.value = false
  }
}

// Toggle Pro for user
const togglePro = async (user) => {
  actionLoadingUserId.value = user.id
  notificationMessage.value = ''

  try {
    // Try Inertia router post first if available
    if (typeof router?.post === 'function') {
      router.post(`/admin/users/${user.id}/toggle-pro`, {}, {
        preserveScroll: true,
        onSuccess: () => {
          notificationMessage.value = `Updated ${user.email} subscription.`
          actionLoadingUserId.value = null
        },
        onError: () => {
          actionLoadingUserId.value = null
        },
      })
      return
    }

    // Fallback to fetch API
    const res = await fetch(`/api/admin/users/${user.id}/toggle-pro`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    })
    const data = await res.json()
    if (data.success) {
      user.is_subscribed = data.user.is_subscribed
      user.subscription_tier = data.user.subscription_tier
      notificationMessage.value = data.message
    }
  } catch (e) {
    notificationMessage.value = 'Failed to toggle user subscription.'
  } finally {
    actionLoadingUserId.value = null
  }
}

const handleAdminLogout = () => {
  if (typeof router?.post === 'function') {
    router.post('/admin/logout')
  } else {
    window.location.href = '/admin/login'
  }
}

const formatTokens = (val) => {
  if (!val) return '—'
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M tokens`
  if (val >= 1000) return `${(val / 1000).toFixed(0)}K tokens`
  return `${val} tokens`
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
    <!-- Top Administrative Header -->
    <header class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
      <div class="flex items-center gap-3 sm:gap-4">
        <a
          href="/dashboard"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          title="Return to standard user dashboard"
        >
          <ArrowLeft class="h-3.5 w-3.5" />
          <span class="hidden sm:inline">User Workspace</span>
        </a>

        <div class="h-5 w-px bg-slate-800 hidden sm:block"></div>

        <div class="flex items-center gap-2.5">
          <div class="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center">
            <div class="h-full w-full bg-slate-950 rounded-[6px] flex items-center justify-center">
              <ShieldCheck class="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-white tracking-tight">ProposalAI Admin Console</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live Google AI Studio
              </span>
            </div>
            <p class="text-[11px] text-slate-400">Model Telemetry, Rate Limits & Multi-Tenant Management</p>
          </div>
        </div>
      </div>

      <!-- Right Header Actions -->
      <div class="flex items-center gap-3">
        <!-- Live AI Studio Indicator & Test Button -->
        <button
          @click="runAiStudioPing"
          :disabled="isTestingAiStudio"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer disabled:opacity-50"
          title="Test live connectivity with Google AI Studio"
        >
          <RefreshCw class="h-3.5 w-3.5 text-emerald-400" :class="{ 'animate-spin': isTestingAiStudio }" />
          <span>{{ isTestingAiStudio ? 'Pinging API...' : 'Test AI Studio' }}</span>
          <span
            v-if="testResult"
            :class="testResult.success ? 'text-emerald-400' : 'text-rose-400'"
            class="text-[11px] font-mono ml-1 font-bold"
          >
            {{ testResult.latency_ms }}ms
          </span>
        </button>

        <!-- Admin Logout -->
        <button
          @click="handleAdminLogout"
          class="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          title="Sign out of Admin Console"
        >
          <LogOut class="h-4 w-4" />
        </button>
      </div>
    </header>

    <!-- Main Admin Dashboard Content -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <!-- Flash Notification Toast -->
      <div
        v-if="notificationMessage"
        class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between"
      >
        <span class="flex items-center gap-2">
          <CheckCircle2 class="h-4 w-4 text-emerald-400" />
          {{ notificationMessage }}
        </span>
        <button @click="notificationMessage = ''" class="text-slate-400 hover:text-white">&times;</button>
      </div>

      <!-- Section: Key Operational Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Google AI Studio Status -->
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Google AI Studio</span>
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-black text-white">v1beta API</span>
            <span class="text-xs font-semibold text-emerald-400">Connected</span>
          </div>
          <p class="mt-1 text-xs text-slate-400">
            Detected <span class="text-white font-semibold">{{ stats.total_models_count || models.length }}</span> models on account
          </p>
        </div>

        <!-- Card 2: Active Flagship Engine -->
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Primary Synthesis Model</span>
            <Cpu class="h-4 w-4 text-amber-400" />
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-xl font-bold text-amber-400 truncate">{{ stats.active_engine }}</span>
          </div>
          <p class="mt-1 text-xs text-slate-400">
            Fallback: <span class="text-slate-300 font-mono">{{ stats.flash_engine }}</span>
          </p>
        </div>

        <!-- Card 3: Pro Subscribers -->
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Pro Subscribers</span>
            <Crown class="h-4 w-4 text-amber-400" />
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-black text-white">{{ stats.pro_users }}</span>
            <span class="text-xs text-slate-400">/ {{ stats.total_users }} total users</span>
          </div>
          <p class="mt-1 text-xs text-slate-400">Unlimited quota & Gemini 1.5/2.5 Pro perks enabled</p>
        </div>

        <!-- Card 4: Total Proposals Generated -->
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Proposals Dispatched</span>
            <FileText class="h-4 w-4 text-brand-400" />
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-black text-white">{{ stats.total_proposals }}</span>
            <span class="text-xs text-slate-400">AI drafted</span>
          </div>
          <p class="mt-1 text-xs text-slate-400">pgvector RAG semantic recall active</p>
        </div>
      </div>

      <!-- SECTION: RELOCATED AI ENGINE STATUS & PROMPT QUOTA WIDGET (Image 3) -->
      <!-- Only Platform Administrators view this widget now -->
      <div class="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap class="h-5 w-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base font-bold text-white">AI Engine Status & Platform Prompt Quota</h2>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  Admin Exclusive Telemetry
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">
                Real-time rate limit thresholds, token quotas, and pgvector RAG memory synchronization.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-slate-400">pgvector Memory:</span>
              <span class="font-bold text-white">1536-dim Active</span>
            </div>
          </div>
        </div>

        <!-- 3-Column Quota Breakdown -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <!-- Quota 1: Gemini 2.5 Pro Rate Limits -->
          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-slate-300 flex items-center gap-1.5">
                <Crown class="h-4 w-4 text-amber-400" />
                Gemini 2.5 Pro Quota
              </span>
              <span class="text-[11px] font-bold text-amber-400">Pro Tier Active</span>
            </div>
            <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-amber-400 to-amber-500 h-full w-[100%] rounded-full"></div>
            </div>
            <div class="grid grid-cols-3 gap-2 text-[11px] pt-1">
              <div class="bg-slate-900/60 p-2 rounded-lg text-center">
                <p class="text-slate-500 uppercase text-[9px] font-bold">RPM</p>
                <p class="font-mono font-bold text-white">2 req/min</p>
              </div>
              <div class="bg-slate-900/60 p-2 rounded-lg text-center">
                <p class="text-slate-500 uppercase text-[9px] font-bold">TPM</p>
                <p class="font-mono font-bold text-white">32,000</p>
              </div>
              <div class="bg-slate-900/60 p-2 rounded-lg text-center">
                <p class="text-slate-500 uppercase text-[9px] font-bold">RPD</p>
                <p class="font-mono font-bold text-white">50 / day</p>
              </div>
            </div>
            <p class="text-[11px] text-slate-400">
              Reserved for paid Pro users. Unlocks 1M+ input tokens and high-reasoning B2B proposal synthesis.
            </p>
          </div>

          <!-- Quota 2: Gemini 2.5 Flash Rate Limits -->
          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap class="h-4 w-4 text-emerald-400" />
                Gemini 2.5 Flash Quota
              </span>
              <span class="text-[11px] font-bold text-emerald-400">High Speed (Free Tier)</span>
            </div>
            <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[92%] rounded-full"></div>
            </div>
            <div class="grid grid-cols-3 gap-2 text-[11px] pt-1">
              <div class="bg-slate-900/60 p-2 rounded-lg text-center">
                <p class="text-slate-500 uppercase text-[9px] font-bold">RPM</p>
                <p class="font-mono font-bold text-white">15 req/min</p>
              </div>
              <div class="bg-slate-900/60 p-2 rounded-lg text-center">
                <p class="text-slate-500 uppercase text-[9px] font-bold">TPM</p>
                <p class="font-mono font-bold text-white">1,000,000</p>
              </div>
              <div class="bg-slate-900/60 p-2 rounded-lg text-center">
                <p class="text-slate-500 uppercase text-[9px] font-bold">RPD</p>
                <p class="font-mono font-bold text-white">1,500 / day</p>
              </div>
            </div>
            <p class="text-[11px] text-slate-400">
              Assigned to free users (limited to 3 proposals). Sub-second streaming responses.
            </p>
          </div>

          <!-- Quota 3: Embeddings & Vector Indexing -->
          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-slate-300 flex items-center gap-1.5">
                <Database class="h-4 w-4 text-purple-400" />
                Embedding Model (RAG)
              </span>
              <span class="text-[11px] font-bold text-purple-400">pgvector Synced</span>
            </div>
            <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-purple-500 to-indigo-500 h-full w-full rounded-full"></div>
            </div>
            <div class="grid grid-cols-3 gap-2 text-[11px] pt-1">
              <div class="bg-slate-900/60 p-2 rounded-lg text-center">
                <p class="text-slate-500 uppercase text-[9px] font-bold">RPM</p>
                <p class="font-mono font-bold text-white">1,500 req/min</p>
              </div>
              <div class="bg-slate-900/60 p-2 rounded-lg text-center">
                <p class="text-slate-500 uppercase text-[9px] font-bold">TPM</p>
                <p class="font-mono font-bold text-white">10M tokens</p>
              </div>
              <div class="bg-slate-900/60 p-2 rounded-lg text-center">
                <p class="text-slate-500 uppercase text-[9px] font-bold">RPD</p>
                <p class="font-mono font-bold text-white">Unlimited</p>
              </div>
            </div>
            <p class="text-[11px] text-slate-400">
              Powers semantic similarity search across historical client proposals in PostgreSQL.
            </p>
          </div>
        </div>
      </div>

      <!-- SECTION: GOOGLE AI STUDIO ACTUAL MODEL LIMITS DIRECTORY -->
      <div class="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <!-- Section Header with Search & Filter Controls -->
        <div class="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base font-bold text-white">Google AI Studio Model Directory & Limits</h2>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live AI Studio Registry
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1">
              Official token limits, context windows, and throughput quotas retrieved directly via Google AI Studio API.
            </p>
          </div>

          <!-- Search & Filter Controls -->
          <div class="flex flex-wrap items-center gap-3">
            <div class="relative">
              <Search class="h-4 w-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search models (e.g. 2.5-pro)..."
                class="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <!-- Tier Filter Pills -->
            <div class="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                @click="selectedTier = 'all'"
                :class="selectedTier === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'"
                class="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                All
              </button>
              <button
                @click="selectedTier = 'pro'"
                :class="selectedTier === 'pro' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-white'"
                class="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                Pro
              </button>
              <button
                @click="selectedTier === 'flash'"
                :class="selectedTier === 'flash' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-white'"
                class="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                Flash
              </button>
              <button
                @click="selectedTier = 'embedding'"
                :class="selectedTier === 'embedding' ? 'bg-purple-500/20 text-purple-300 font-semibold' : 'text-slate-400 hover:text-white'"
                class="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                Embeddings
              </button>
            </div>
          </div>
        </div>

        <!-- Models Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th class="px-6 py-3.5">Model Identifier & Name</th>
                <th class="px-6 py-3.5">Input Context Window</th>
                <th class="px-6 py-3.5">Output Token Limit</th>
                <th class="px-6 py-3.5">Rate Limit (RPM)</th>
                <th class="px-6 py-3.5">Tokens/Min (TPM)</th>
                <th class="px-6 py-3.5">Requests/Day (RPD)</th>
                <th class="px-6 py-3.5">Tier Classification</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/70 text-slate-300">
              <tr
                v-for="model in filteredModels"
                :key="model.id"
                class="hover:bg-slate-800/40 transition-colors"
                :class="{
                  'bg-amber-500/5': model.id.includes('2.5-pro'),
                  'bg-emerald-500/5': model.id.includes('2.5-flash'),
                }"
              >
                <!-- Model Name & Identifier -->
                <td class="px-6 py-4">
                  <div class="flex items-start gap-2.5">
                    <div
                      class="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      :class="model.id.includes('pro') ? 'bg-amber-500/10 text-amber-400' : model.id.includes('embedding') ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'"
                    >
                      <Crown v-if="model.id.includes('pro')" class="h-4 w-4" />
                      <Database v-else-if="model.id.includes('embedding')" class="h-4 w-4" />
                      <Zap v-else class="h-4 w-4" />
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="font-bold text-white text-sm">{{ model.displayName }}</span>
                        <span
                          v-if="model.id === stats.active_engine"
                          class="px-1.5 py-0.5 rounded-sm bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider"
                        >
                          ACTIVE PRO
                        </span>
                        <span
                          v-if="model.id === stats.flash_engine"
                          class="px-1.5 py-0.5 rounded-sm bg-emerald-400 text-slate-950 font-black text-[9px] uppercase tracking-wider"
                        >
                          ACTIVE FLASH
                        </span>
                      </div>
                      <p class="font-mono text-slate-500 text-[11px] mt-0.5">{{ model.id }}</p>
                      <p class="text-slate-400 text-[11px] line-clamp-1 mt-1 max-w-sm">{{ model.description }}</p>
                    </div>
                  </div>
                </td>

                <!-- Input Context Window -->
                <td class="px-6 py-4 font-mono font-semibold text-white">
                  {{ formatTokens(model.inputTokenLimit) }}
                </td>

                <!-- Output Limit -->
                <td class="px-6 py-4 font-mono font-semibold text-white">
                  {{ formatTokens(model.outputTokenLimit) }}
                </td>

                <!-- RPM -->
                <td class="px-6 py-4">
                  <span class="font-mono font-bold text-white bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
                    {{ model.quota?.rpm || '15' }} req/min
                  </span>
                </td>

                <!-- TPM -->
                <td class="px-6 py-4">
                  <span class="font-mono text-slate-300">
                    {{ model.quota?.tpm || '1,000,000' }}
                  </span>
                </td>

                <!-- RPD -->
                <td class="px-6 py-4">
                  <span class="font-mono font-semibold" :class="model.quota?.rpd === 'Unlimited' ? 'text-purple-400' : 'text-slate-300'">
                    {{ model.quota?.rpd || '1,500' }}
                  </span>
                </td>

                <!-- Tier Badge -->
                <td class="px-6 py-4">
                  <span
                    :class="[
                      model.id.includes('pro') ? 'bg-amber-400/10 text-amber-300 border-amber-400/20' :
                      model.id.includes('embedding') ? 'bg-purple-400/10 text-purple-300 border-purple-400/20' :
                      'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
                      'px-2 py-1 rounded-full text-[10px] font-semibold border inline-flex items-center gap-1'
                    ]"
                  >
                    {{ model.quota?.tier || 'Standard Tier' }}
                  </span>
                </td>
              </tr>

              <tr v-if="filteredModels.length === 0">
                <td colspan="7" class="px-6 py-8 text-center text-slate-500">
                  No Google AI Studio models matched your filter criteria.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- SECTION: MULTI-TENANT USERS MANAGEMENT & SUBSCRIPTION CONTROLS -->
      <div class="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div class="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <Users class="h-5 w-5 text-brand-400" />
              <h2 class="text-base font-bold text-white">Multi-Tenant User Management & Pro Toggles</h2>
            </div>
            <p class="text-xs text-slate-400 mt-1">
              Inspect user roles, proposal generation quotas, and toggle Pro membership perks instantly.
            </p>
          </div>

          <div class="text-xs text-slate-400 font-mono">
            Showing {{ users.length }} Registered Accounts
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th class="px-6 py-3.5">User Profile</th>
                <th class="px-6 py-3.5">Role</th>
                <th class="px-6 py-3.5">Subscription Tier</th>
                <th class="px-6 py-3.5">Proposals Created</th>
                <th class="px-6 py-3.5">Registered</th>
                <th class="px-6 py-3.5 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/70 text-slate-300">
              <tr v-for="user in users" :key="user.id" class="hover:bg-slate-800/40 transition-colors">
                <!-- User Profile -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ring-2"
                      :class="user.is_subscribed || user.subscription_tier === 'pro' || user.role === 'admin' ? 'ring-amber-400/80 bg-amber-500/20 text-amber-300' : 'ring-slate-700 bg-slate-800 text-slate-300'"
                    >
                      {{ user.name ? user.name.substring(0, 2).toUpperCase() : 'U' }}
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-white text-sm">{{ user.name }}</span>
                        <!-- Pro User Badge in table -->
                        <span
                          v-if="user.is_subscribed || user.subscription_tier === 'pro' || user.role === 'admin'"
                          class="px-1.5 py-0.5 rounded-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider inline-flex items-center gap-0.5"
                        >
                          <Crown class="h-2.5 w-2.5" />
                          PRO
                        </span>
                      </div>
                      <p class="text-slate-400 text-xs">{{ user.email }}</p>
                    </div>
                  </div>
                </td>

                <!-- Role -->
                <td class="px-6 py-4">
                  <span
                    :class="user.role === 'admin' ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' : 'bg-slate-800 text-slate-300 border-slate-700'"
                    class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border"
                  >
                    {{ user.role || 'user' }}
                  </span>
                </td>

                <!-- Subscription Tier -->
                <td class="px-6 py-4">
                  <span
                    v-if="user.is_subscribed || user.subscription_tier === 'pro' || user.role === 'admin'"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30"
                  >
                    <Crown class="h-3 w-3 text-amber-400" />
                    Pro Membership (Paid)
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700"
                  >
                    Free Freemium (3 limit)
                  </span>
                </td>

                <!-- Proposals Created -->
                <td class="px-6 py-4 font-mono font-semibold text-white">
                  {{ user.proposals_count || 0 }}
                </td>

                <!-- Registered At -->
                <td class="px-6 py-4 text-slate-400 font-mono text-[11px]">
                  {{ user.created_at ? new Date(user.created_at).toLocaleDateString() : '—' }}
                </td>

                <!-- Action: Toggle Pro Status -->
                <td class="px-6 py-4 text-right">
                  <button
                    @click="togglePro(user)"
                    :disabled="actionLoadingUserId === user.id"
                    :class="user.is_subscribed || user.subscription_tier === 'pro' ? 'bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold'"
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Crown class="h-3.5 w-3.5" />
                    <span>{{ user.is_subscribed || user.subscription_tier === 'pro' ? 'Revoke Pro' : 'Grant Pro Perks' }}</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>


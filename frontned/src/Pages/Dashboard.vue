<script setup>
import { onMounted, ref, computed } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import { useProposalStore } from '@/stores/proposalStore'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import {
  FileText,
  Users,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
  PlusCircle,
  Crown,
  CheckCircle2,
  Zap,
  ShieldCheck,
  X,
} from 'lucide-vue-next'

const props = defineProps({
  metrics: {
    type: Object,
    default: () => ({}),
  },
  recentProposals: {
    type: Array,
    default: () => [],
  },
  paymentSuccess: {
    type: Boolean,
    default: false,
  },
})

const store = useProposalStore()
const authStore = useAuthStore()
const toast = useToast()

const showSuccessBanner = ref(false)
const showCelebrationModal = ref(false)

const isProUser = computed(() => {
  return Boolean(authStore.user?.is_subscribed || authStore.user?.subscription_tier === 'pro' || store.isSubscribed)
})

onMounted(async () => {
  // Check if user just redirected back from PayMongo with ?payment=success
  const urlParams = new URLSearchParams(window.location.search)
  const isPaid = urlParams.get('payment') === 'success' || props.paymentSuccess

  if (isPaid) {
    showSuccessBanner.value = true
    showCelebrationModal.value = true

    // Upgrade Pinia store states
    store.isSubscribed = true
    store.activeAiModel = 'Gemini 1.5 Pro'

    // Refresh auth user from server to ensure database has updated
    await authStore.checkAuth()

    toast.success('Congratulations! Your Pro membership is now live with unlimited AI generations.', 'Upgraded to PRO!')

    // Clean URL without refreshing page
    const cleanUrl = window.location.pathname
    window.history.replaceState({}, document.title, cleanUrl)
  }
})

const stats = computed(() => {
  const active = Number(props.metrics?.activeProposals || 0)
  const totalVal = Number(props.metrics?.totalWinValue || 0)
  const clients = Number(props.metrics?.clientAccounts || 0)

  return [
    {
      name: 'Active Proposals',
      value: active.toString(),
      change: active > 0 ? `${active} active deal${active === 1 ? '' : 's'}` : '0 active proposals',
      icon: FileText,
    },
    {
      name: 'Total Win Value',
      value: store.formatCurrency(totalVal),
      change: totalVal > 0 ? 'Closed won revenue' : '₱0.00 pipeline won',
      icon: TrendingUp,
    },
    {
      name: 'Client Accounts',
      value: clients.toString(),
      change: clients > 0 ? `${clients} registered account${clients === 1 ? '' : 's'}` : '0 client accounts',
      icon: Users,
    },
    {
      name: 'Avg. AI Turnaround',
      value: active > 0 ? '< 2 mins' : 'Instant AI',
      change: 'Gemini 1.5 Pro synthesis',
      icon: Sparkles,
    },
  ]
})

const recentProposalsList = computed(() => {
  if (props.recentProposals && props.recentProposals.length) {
    return props.recentProposals.map((p) => ({
      id: p.proposal_number || `PROP-${p.id}`,
      client: p.client?.company || p.client?.name || 'Enterprise Client',
      value: `₱${Number(p.grand_total || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
      status: p.status || 'Draft',
      date: new Date(p.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }))
  }
  return []
})
</script>

<template>
  <AppLayout currentRoute="Dashboard">
    <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1700px] mx-auto">
      
      <!-- Pro Upgrade Celebration Alert Banner -->
      <div
        v-if="showSuccessBanner || isProUser"
        class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-brand-500/10 to-emerald-500/10 border border-amber-500/30 p-5 shadow-sm"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-start sm:items-center gap-3.5">
            <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md flex-shrink-0 ring-2 ring-amber-300/40">
              <Crown class="h-5 w-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm sm:text-base font-bold text-slate-900">
                  ProposalAI Pro Active
                </h3>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xs">
                  PRO MEMBER
                </span>
              </div>
              <p class="text-xs text-slate-600 mt-0.5">
                Enjoy unlimited AI drafting, Gemini 1.5 Pro high-reasoning synthesis, and pgvector RAG memory.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="hidden md:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <ShieldCheck class="h-4 w-4 text-emerald-600" />
              <span>Full Perks Unlocked</span>
            </div>
            <a
              href="/proposals/create"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Sparkles class="h-3.5 w-3.5 text-amber-300" />
              <span>Create Pro Proposal</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Dashboard Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">Overview of generated proposals, deal pipeline velocity, and client engagement.</p>
        </div>
        <a
          href="/proposals/create"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all shadow-brand-500/20"
        >
          <PlusCircle class="h-4 w-4" />
          <span>New Proposal</span>
        </a>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="stat in stats"
          :key="stat.name"
          class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2"
        >
          <div class="flex items-center justify-between text-slate-500">
            <span class="text-xs font-semibold text-slate-600">{{ stat.name }}</span>
            <div class="h-8 w-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <component :is="stat.icon" class="h-4 w-4" />
            </div>
          </div>
          <div class="text-2xl font-extrabold text-slate-900">{{ stat.value }}</div>
          <p class="text-[11px] font-medium text-emerald-600">{{ stat.change }}</p>
        </div>
      </div>

      <!-- Recent Proposals Table -->
      <div class="rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Proposals</h2>
          <a href="/proposals" class="text-xs font-semibold text-brand-600 hover:text-brand-700">View All</a>
        </div>
        <div v-if="recentProposalsList.length" class="divide-y divide-slate-100">
          <div
            v-for="p in recentProposalsList"
            :key="p.id"
            class="py-3 flex items-center justify-between text-xs"
          >
            <div>
              <p class="font-bold text-slate-900">{{ p.client }}</p>
              <p class="text-[11px] text-slate-400 font-mono">{{ p.id }} • {{ p.date }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-slate-900">{{ p.value }}</p>
              <span class="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-50 text-brand-700">
                {{ p.status }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="py-8 text-center space-y-3">
          <div class="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
            <FileText class="h-5 w-5" />
          </div>
          <p class="text-xs font-semibold text-slate-700">No proposals created yet</p>
          <p class="text-[11px] text-slate-400 max-w-xs mx-auto">Click "New Proposal" to synthesize your first enterprise proposal with AI.</p>
          <a
            href="/proposals/create"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle class="h-3.5 w-3.5" />
            <span>Create First Proposal</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Celebration Modal (Appears upon redirect with ?payment=success) -->
    <Teleport to="body">
      <div
        v-if="showCelebrationModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      >
        <div class="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center space-y-6">
          <div class="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg ring-4 ring-amber-100">
            <Crown class="h-8 w-8" />
          </div>

          <div class="space-y-2">
            <h2 class="text-xl font-extrabold text-slate-900">Welcome to ProposalAI Pro!</h2>
            <p class="text-xs text-slate-500">
              Your payment has been confirmed by PayMongo. All Pro perks and capabilities have been unlocked on your account.
            </p>
          </div>

          <!-- Unlocked Perks List -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-2.5 text-xs text-slate-700">
            <div class="flex items-center gap-2 font-medium">
              <CheckCircle2 class="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>Unlimited automated AI proposal drafting</span>
            </div>
            <div class="flex items-center gap-2 font-medium">
              <CheckCircle2 class="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>Gemini 1.5 Pro high-reasoning intelligence</span>
            </div>
            <div class="flex items-center gap-2 font-medium">
              <CheckCircle2 class="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>pgvector semantic pitch memory retrieval</span>
            </div>
            <div class="flex items-center gap-2 font-medium">
              <CheckCircle2 class="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>Verified Pro golden badge on corporate profile</span>
            </div>
          </div>

          <button
            type="button"
            @click="showCelebrationModal = false"
            class="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Start Crafting Proposals
          </button>
        </div>
      </div>
    </Teleport>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import {
  Sparkles,
  Crown,
  Check,
  X,
  Zap,
  Shield,
  ArrowRight,
  Lock,
  Loader2,
  CheckCircle2,
} from 'lucide-vue-next'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  limit: {
    type: Number,
    default: 3,
  },
  currentCount: {
    type: Number,
    default: 3,
  },
  errorMessage: {
    type: String,
    default: 'You have reached the free tier limit of 3 proposals.',
  },
})

const emit = defineEmits(['close', 'upgrade'])

const isUpgrading = ref(false)
const billingCycle = ref('monthly') // 'monthly' | 'annually'

const proFeatures = [
  {
    title: 'Unlimited AI Proposals',
    description: 'No more 3-proposal cap. Generate unlimited proposals for all client deals.',
  },
  {
    title: 'Top-Tier AI Engines (Gemini 1.5 Pro & Claude 3.5)',
    description: 'Upgrade from Gemini Flash-Lite to frontier reasoning models for complex proposals.',
  },
  {
    title: 'Domain Knowledge RAG Memory',
    description: 'Autonomous pgvector embeddings trained on your won proposals to boost win rates.',
  },
  {
    title: 'White-Label Branding & Custom PDFs',
    description: 'Remove default watermarks and attach your company domain and letterhead.',
  },
  {
    title: 'Priority 24/7 SLA & Team Workspaces',
    description: 'Sub-minute generation latency and multi-seat collaborative editing.',
  },
]

function handleUpgrade() {
  isUpgrading.value = true
  // Emits upgrade event to parent or triggers checkout
  emit('upgrade', {
    cycle: billingCycle.value,
    plan: 'pro',
  })
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscription-modal-title"
      >
        <!-- Modal Card Container -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="show"
            class="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
          >
            <!-- Decorative Top Gradient Accent -->
            <div class="h-2 w-full bg-gradient-to-r from-amber-400 via-brand-500 to-indigo-600"></div>

            <!-- Close button -->
            <button
              type="button"
              @click="handleClose"
              class="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
              title="Close modal"
            >
              <X class="h-5 w-5" />
            </button>

            <!-- Header Section with Crown Badge -->
            <div class="px-6 pt-7 pb-4 text-center space-y-3">
              <!-- Limit reached badge -->
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                <Crown class="h-4 w-4 text-amber-500" />
                <span>Freemium Limit Reached ({{ currentCount }}/{{ limit }} Proposals Used)</span>
              </div>

              <h2
                id="subscription-modal-title"
                class="text-2xl font-black text-slate-900 tracking-tight leading-tight"
              >
                Upgrade to Pro for Unlimited Generations
              </h2>

              <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                {{ errorMessage }}
                Your free proposal quota has been exhausted. Upgrade now to unlock advanced AI models, domain RAG memory, and unlimited pitching power.
              </p>
            </div>

            <!-- Pricing & Value Showcase -->
            <div class="px-6 py-4 space-y-4 bg-slate-50/70 border-y border-slate-100">
              <!-- Billing cycle selector -->
              <div class="flex items-center justify-center gap-2">
                <button
                  type="button"
                  @click="billingCycle = 'monthly'"
                  :class="[
                    billingCycle === 'monthly'
                      ? 'bg-white text-slate-900 shadow-xs font-bold border-slate-200'
                      : 'text-slate-500 hover:text-slate-800 font-medium border-transparent',
                    'px-3 py-1 rounded-lg text-xs border transition-all'
                  ]"
                >
                  Monthly ($49/mo)
                </button>
                <button
                  type="button"
                  @click="billingCycle = 'annually'"
                  :class="[
                    billingCycle === 'annually'
                      ? 'bg-white text-slate-900 shadow-xs font-bold border-slate-200'
                      : 'text-slate-500 hover:text-slate-800 font-medium border-transparent',
                    'px-3 py-1 rounded-lg text-xs border transition-all relative'
                  ]"
                >
                  <span>Annually ($39/mo)</span>
                  <span class="ml-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">Save 20%</span>
                </button>
              </div>

              <!-- Feature Checkmarks List -->
              <div class="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                <div
                  v-for="(feature, idx) in proFeatures"
                  :key="idx"
                  class="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs"
                >
                  <div class="mt-0.5 h-5 w-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <Check class="h-3 w-3" />
                  </div>
                  <div class="min-w-0 text-left">
                    <p class="text-xs font-bold text-slate-900 leading-snug">{{ feature.title }}</p>
                    <p class="text-[11px] text-slate-500 leading-tight mt-0.5">{{ feature.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Action Buttons -->
            <div class="p-6 space-y-3 bg-white">
              <button
                type="button"
                @click="handleUpgrade"
                :disabled="isUpgrading"
                class="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-brand-500/30 transition-all duration-200 group disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                <Loader2 v-if="isUpgrading" class="h-5 w-5 animate-spin" />
                <Crown v-else class="h-5 w-5 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>{{ isUpgrading ? 'Redirecting to Checkout...' : 'Upgrade to Pro' }}</span>
                <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div class="flex items-center justify-between text-[11px] text-slate-400 px-2">
                <span class="flex items-center gap-1">
                  <Shield class="h-3.5 w-3.5 text-emerald-500" />
                  30-day money-back guarantee
                </span>
                <button
                  type="button"
                  @click="handleClose"
                  class="hover:text-slate-600 hover:underline"
                >
                  Dismiss for now
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>


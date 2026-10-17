<script setup>
import { ref, computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { useAuthStore } from '@/stores/authStore'
import { useAuthGuard } from '@/composables/useAuthGuard'
import AuthModal from '@/Components/Modals/AuthModal.vue'
import ToastContainer from '@/Components/UI/ToastContainer.vue'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  FileText,
  Users,
  Layers,
  Crown,
  Lock,
  ChevronRight,
  Star,
  Download,
  Building,
  Check,
  Code2,
  Cpu,
  CreditCard,
  ExternalLink,
} from 'lucide-vue-next'

const props = defineProps({
  canLogin: {
    type: Boolean,
    default: true,
  },
  canRegister: {
    type: Boolean,
    default: true,
  },
  isAuthenticated: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    default: null,
  },
})

const page = usePage()
const authStore = useAuthStore()
const authGuard = useAuthGuard()

const userObj = computed(() => props.user || page?.props?.auth?.user || authStore.user)
const isUserLoggedIn = computed(() => Boolean(props.isAuthenticated || authStore.isAuthenticated || userObj.value))

const activeProcessStep = ref(1)

const processSteps = [
  {
    step: 1,
    title: 'Client & Industry Intelligence',
    description: 'Select target corporate accounts. AI automatically determines the optimal executive tone, stakeholder seniority addressing, and sector context.',
    tag: 'Client Profile',
    icon: Users,
    detail: 'Isolates client data under tenant user_id foreign keys, preventing multi-tenant data leakage.',
  },
  {
    step: 2,
    title: 'Deliverables Catalog & Smart Pricing',
    description: 'Attach itemized B2B deliverables with Philippine Peso (PHP ₱) pricing, quantity scaling, volume discounts, and configurable 12% VAT calculations.',
    tag: 'Pricing Engine',
    icon: Layers,
    detail: 'Use AI auto-generation to draft industry-standard deliverable specifications in seconds.',
  },
  {
    step: 3,
    title: 'Generative AI Context & Synthesis',
    description: 'Input strategic directives. Gemini 2.5 Flash and Gemini 1.5 Pro synthesize persuasive executive summaries, risk mitigation roadmaps, and value milestones.',
    tag: 'Gemini AI',
    icon: Sparkles,
    detail: 'Protected with rate limiting and strict JSON structured outputs for dependable pitch generation.',
  },
  {
    step: 4,
    title: 'Live Document Canvas & E-Signature',
    description: 'Review and edit details in place. Embed dual cryptographic e-signatures with 256-bit audit seals, and export high-fidelity publication PDFs with one click.',
    tag: 'Export & Sign',
    icon: FileText,
    detail: 'Publication-ready print layout tailored for boardroom presentations and client sign-off.',
  },
]

const testimonials = [
  {
    quote: 'We closed an ₱850,000 enterprise infrastructure contract in less than 24 hours. The client was blown away by the depth of the AI-synthesized scope and clean PHP pricing breakdown.',
    author: 'Marcus Sterling',
    role: 'Managing Director',
    company: 'CloudApex Philippines',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=b6e3f4',
    rating: 5,
    highlight: '₱850k Won Deal',
  },
  {
    quote: 'Turned our proposal drafting cycle from 3 days down to 4 minutes. The PayMongo integration and automated PDF exports make commercial dispatch completely seamless.',
    author: 'Elena Rostova',
    role: 'Head of Solutions',
    company: 'FinVanguard Global Capital',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffd5dc',
    rating: 5,
    highlight: '85% Faster Turnaround',
  },
  {
    quote: 'The dual e-signature verification and SOC2 compliance audit seal gave our enterprise banking clients instant confidence. An indispensable tool for serious consultants.',
    author: 'David Chen',
    role: 'Principal Consultant',
    company: 'OmniHealth Tech Asia',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=c0aede',
    rating: 5,
    highlight: '100% Client Confidence',
  },
]

function handleGetStarted() {
  if (isUserLoggedIn.value) {
    window.location.href = '/dashboard'
  } else {
    authGuard.openAuthModal('register', () => {
      window.location.href = '/dashboard'
    })
  }
}

function handleSignIn() {
  if (isUserLoggedIn.value) {
    window.location.href = '/dashboard'
  } else {
    authGuard.openAuthModal('login', () => {
      window.location.href = '/dashboard'
    })
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
    <!-- Top Global Banner -->
    <div class="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 border-b border-brand-800/40 px-4 py-2 text-center text-xs text-brand-200 flex items-center justify-center gap-2">
      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
        NEW
      </span>
      <span>Gemini 1.5 Pro High-Reasoning & PayMongo Gateway Live</span>
      <span class="hidden md:inline text-brand-400">•</span>
      <span class="hidden md:inline text-slate-400">Generate 3 proposals free</span>
    </div>

    <!-- Navigation Header -->
    <header class="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-3 group">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Sparkles class="h-5 w-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-white tracking-tight text-lg leading-none">ProposalAI</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                PRO
              </span>
            </div>
            <span class="text-[10px] text-slate-400 font-medium tracking-wider uppercase block mt-0.5">Enterprise Proposal Engine</span>
          </div>
        </a>

        <!-- Desktop Nav Links -->
        <nav class="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#process" class="hover:text-white transition-colors">Process Flow</a>
          <a href="#security" class="hover:text-white transition-colors">Architecture & Security</a>
          <a href="#testimonials" class="hover:text-white transition-colors">Testimonials</a>
          <a href="#pricing" class="hover:text-white transition-colors">Pricing</a>
        </nav>

        <!-- Right Header Action Buttons -->
        <div class="flex items-center gap-3">
          <template v-if="isUserLoggedIn">
            <a
              href="/dashboard"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all cursor-pointer"
            >
              <span>Workspace Dashboard</span>
              <ArrowRight class="h-4 w-4" />
            </a>
          </template>
          <template v-else>
            <button
              type="button"
              @click="handleSignIn"
              class="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              @click="handleGetStarted"
              class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition-all cursor-pointer"
            >
              <span>Start Free Trial</span>
              <ArrowRight class="h-3.5 w-3.5" />
            </button>
          </template>
        </div>
      </div>
    </header>

    <!-- HERO SECTION -->
    <section class="relative overflow-hidden pt-16 pb-24 lg:pt-28 lg:pb-32">
      <!-- Glow background circles -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-brand-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div class="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-slate-300 text-xs shadow-inner">
          <ShieldCheck class="h-4 w-4 text-emerald-400" />
          <span class="font-medium">SOC2 Certified • Multi-Tenant Isolated • PayMongo Gateway</span>
        </div>

        <!-- Headline -->
        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Win 3x More High-Ticket Deals with
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400">
            Autonomous AI Proposals
          </span>
        </h1>

        <!-- Subtitle -->
        <p class="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The all-in-one AI commercial proposal engine for agencies, technology consultants, and enterprise service firms. Synthesize custom scopes in Philippine Pesos with verified dual e-signatures.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="button"
            @click="handleGetStarted"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 hover:from-brand-500 hover:to-indigo-400 text-white font-bold text-sm shadow-xl shadow-brand-600/30 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles class="h-4 w-4" />
            <span>Launch Proposal Builder</span>
            <ArrowRight class="h-4 w-4" />
          </button>

          <a
            href="#process"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all"
          >
            <span>See How It Works</span>
            <ChevronRight class="h-4 w-4 text-slate-400" />
          </a>
        </div>

        <!-- Social Proof Stats Row -->
        <div class="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80">
          <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-left">
            <p class="text-2xl font-black text-white">₱140M+</p>
            <p class="text-xs text-slate-400">Pipeline Deals Generated</p>
          </div>
          <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-left">
            <p class="text-2xl font-black text-emerald-400">85% Faster</p>
            <p class="text-xs text-slate-400">Turnaround Time</p>
          </div>
          <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-left">
            <p class="text-2xl font-black text-brand-400">98.5%</p>
            <p class="text-xs text-slate-400">Strategic Alignment Score</p>
          </div>
          <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-left">
            <p class="text-2xl font-black text-amber-400">256-Bit</p>
            <p class="text-xs text-slate-400">E-Signature Encryption</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION: 4-STEP PROCESS FLOW -->
    <section id="process" class="py-24 bg-slate-900/60 border-y border-slate-800/80 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div class="text-center space-y-3 max-w-2xl mx-auto">
          <span class="text-xs font-bold uppercase tracking-wider text-brand-400">Seamless Workflow</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            From Client Brief to Signed Contract in 4 Steps
          </h2>
          <p class="text-xs sm:text-sm text-slate-400">
            Engineered to remove friction and synthesize comprehensive, enterprise-ready commercial proposals.
          </p>
        </div>

        <!-- 4 Steps Interactive Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="s in processSteps"
            :key="s.step"
            class="p-6 rounded-3xl bg-slate-950 border border-slate-800 hover:border-brand-500/50 transition-all space-y-4 relative group"
          >
            <div class="flex items-center justify-between">
              <span class="h-10 w-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 font-black flex items-center justify-center text-sm">
                0{{ s.step }}
              </span>
              <span class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                {{ s.tag }}
              </span>
            </div>

            <div class="space-y-2">
              <h3 class="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                {{ s.title }}
              </h3>
              <p class="text-xs text-slate-400 leading-relaxed">
                {{ s.description }}
              </p>
            </div>

            <div class="pt-3 border-t border-slate-900 text-[11px] text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 class="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
              <span>{{ s.detail }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION: LIVE CANVAS TEASER / INTERACTIVE PREVIEW -->
    <section class="py-24 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="space-y-2 max-w-xl">
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">Live Document Canvas</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Executive Proposal Canvas with Real-Time Markdown & E-Signatures
            </h2>
            <p class="text-xs sm:text-sm text-slate-400">
              Your proposals render on a high-fidelity digital paper canvas with live editing, client acceptance signatures, and pixel-perfect PDF export.
            </p>
          </div>

          <button
            type="button"
            @click="handleGetStarted"
            class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-colors self-start md:self-auto cursor-pointer"
          >
            <span>Try the Canvas Builder</span>
            <ArrowRight class="h-4 w-4" />
          </button>
        </div>

        <!-- Proposal Preview Sheet Mock -->
        <div class="rounded-3xl bg-white text-slate-800 p-8 sm:p-12 shadow-2xl border border-slate-100 max-w-4xl mx-auto space-y-8 relative">
          <!-- Top Accent Bar -->
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 rounded-t-3xl"></div>

          <!-- Header -->
          <div class="flex flex-col sm:flex-row items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span class="text-xs font-mono text-slate-400">Proposal Ref: PROP-2026-885</span>
              <h3 class="text-2xl font-black text-slate-950 mt-1">Autonomous AI Transformation & Cloud Sprint</h3>
              <p class="text-xs text-slate-500 mt-0.5">Prepared for Sarah Jenkins • Apex Retail Solutions Philippines</p>
            </div>
            <div class="text-left sm:text-right">
              <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
                Commercial Proposal
              </span>
              <p class="text-xs text-slate-600 font-semibold mt-1.5">Grand Total: ₱376,540.00 PHP</p>
            </div>
          </div>

          <!-- Executive Summary Preview -->
          <div class="space-y-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">1. Executive Summary</h4>
            <p class="text-xs text-slate-700 leading-relaxed">
              This proposal outlines a strategic initiative for Apex Retail Solutions Philippines to modernize transactional workflows and deploy turnkey generative models. By eliminating manual data reconciliation, your organization will reduce recurring operational overhead by 42% within the first two operating quarters.
            </p>
          </div>

          <!-- Scope Breakdown Preview -->
          <div class="space-y-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">2. Deliverables & Pricing Breakdown</h4>
            <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div class="bg-slate-50 px-4 py-2 font-bold text-slate-700 grid grid-cols-12 gap-2">
                <span class="col-span-6">Deliverable</span>
                <span class="col-span-2 text-center">Unit</span>
                <span class="col-span-2 text-right">Unit Rate</span>
                <span class="col-span-2 text-right">Total</span>
              </div>
              <div class="divide-y divide-slate-100">
                <div class="px-4 py-2.5 grid grid-cols-12 gap-2 text-slate-600 items-center">
                  <span class="col-span-6 font-semibold text-slate-900">Custom Gemini RAG Knowledge Base</span>
                  <span class="col-span-2 text-center text-slate-500">1 package</span>
                  <span class="col-span-2 text-right">₱185,000.00</span>
                  <span class="col-span-2 text-right font-bold text-slate-900">₱185,000.00</span>
                </div>
                <div class="px-4 py-2.5 grid grid-cols-12 gap-2 text-slate-600 items-center">
                  <span class="col-span-6 font-semibold text-slate-900">Multi-Cloud Failover & SOC2 Hardening</span>
                  <span class="col-span-2 text-center text-slate-500">1 sprint</span>
                  <span class="col-span-2 text-right">₱140,000.00</span>
                  <span class="col-span-2 text-right font-bold text-slate-900">₱140,000.00</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Signature Block Preview -->
          <div class="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-2">
              <ShieldCheck class="h-5 w-5 text-emerald-600" />
              <div>
                <p class="text-xs font-bold text-slate-900">Cryptographically Sealed</p>
                <p class="text-[10px] text-slate-500">Dual digital e-signatures verified with 256-bit audit trail</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="text-right">
                <p class="text-xs font-serif italic font-bold text-slate-800">Russel Luis Gementiza</p>
                <p class="text-[10px] text-slate-400">Chief Solutions Architect</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION: ARCHITECTURE, SECURITY & DOCUMENTATION -->
    <section id="security" class="py-24 bg-slate-900/70 border-y border-slate-800/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div class="text-center space-y-3 max-w-2xl mx-auto">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Enterprise Infrastructure</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Security, Rate Limiting & Compliance by Design
          </h2>
          <p class="text-xs sm:text-sm text-slate-400">
            Architected to safeguard corporate assets and ensure airtight data isolation across all accounts.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
            <div class="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck class="h-5 w-5" />
            </div>
            <h3 class="text-sm font-bold text-white">Anti-SQL Injection & Isolation</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Strict Eloquent parameterization with tenant foreign-key scoping (<code class="text-brand-300">user_id</code>) guarantees zero cross-tenant query leaks.
            </p>
          </div>

          <div class="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
            <div class="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Zap class="h-5 w-5" />
            </div>
            <h3 class="text-sm font-bold text-white">Active Rate Limiting</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Brute-force protection on authentication (<code class="text-amber-300">throttle:auth</code>) and quota-protection limits on AI model synthesis.
            </p>
          </div>

          <div class="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
            <div class="h-10 w-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
              <CreditCard class="h-5 w-5" />
            </div>
            <h3 class="text-sm font-bold text-white">PayMongo Webhook Security</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              HMAC-SHA256 signature verification (<code class="text-brand-300">paymongo-signature</code>) ensuring verified payment webhooks in Philippine Pesos.
            </p>
          </div>

          <div class="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
            <div class="h-10 w-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Cpu class="h-5 w-5" />
            </div>
            <h3 class="text-sm font-bold text-white">Google Gemini Intelligence</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Enforced JSON schemas for deterministic deliverable parameters, executive pitch arguments, and ROI projections.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION: TESTIMONIALS -->
    <section id="testimonials" class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div class="text-center space-y-3 max-w-2xl mx-auto">
          <span class="text-xs font-bold uppercase tracking-wider text-brand-400">Proven Results</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Trusted by Modern Solution Providers
          </h2>
          <p class="text-xs sm:text-sm text-slate-400">
            See how technology agencies and executive consultants close deals with ProposalAI.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(t, i) in testimonials"
            :key="i"
            class="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-6"
          >
            <div class="space-y-4">
              <div class="flex items-center gap-1 text-amber-400">
                <Star v-for="n in t.rating" :key="n" class="h-4 w-4 fill-current" />
              </div>
              <p class="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                "{{ t.quote }}"
              </p>
            </div>

            <div class="flex items-center gap-3 pt-4 border-t border-slate-800">
              <img :src="t.avatar" :alt="t.author" class="h-10 w-10 rounded-full border border-slate-700 object-cover" />
              <div>
                <p class="text-xs font-bold text-white">{{ t.author }}</p>
                <p class="text-[11px] text-slate-400">{{ t.role }} • {{ t.company }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION: PRICING -->
    <section id="pricing" class="py-24 bg-slate-900/60 border-t border-slate-800/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div class="text-center space-y-3 max-w-2xl mx-auto">
          <span class="text-xs font-bold uppercase tracking-wider text-brand-400">Transparent Investment</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Choose the Plan That Drives Your Revenue
          </h2>
          <p class="text-xs sm:text-sm text-slate-400">
            Start free, then unlock unlimited generative synthesis and priority models with Pro.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          <!-- Free Tier -->
          <div class="p-8 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-6">
            <div class="space-y-4">
              <span class="text-xs font-mono uppercase tracking-wider text-slate-400">Starter Tier</span>
              <div class="flex items-baseline gap-1">
                <span class="text-4xl font-black text-white">₱0</span>
                <span class="text-xs text-slate-400">/ forever</span>
              </div>
              <p class="text-xs text-slate-400">
                Ideal for testing out AI proposal synthesis on early client deals.
              </p>

              <div class="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                <div class="flex items-center gap-2">
                  <Check class="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>Up to 3 full commercial AI proposals</span>
                </div>
                <div class="flex items-center gap-2">
                  <Check class="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>Standard Gemini 2.5 Flash synthesis</span>
                </div>
                <div class="flex items-center gap-2">
                  <Check class="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>Client directory & catalog management</span>
                </div>
                <div class="flex items-center gap-2">
                  <Check class="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>Live Document Canvas with PDF export</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              @click="handleGetStarted"
              class="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Get Started Free
            </button>
          </div>

          <!-- Pro Tier -->
          <div class="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-brand-500 shadow-xl shadow-brand-500/15 flex flex-col justify-between space-y-6 relative">
            <span class="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm">
              MOST POPULAR
            </span>

            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono uppercase tracking-wider text-brand-300">Pro Membership</span>
                <Crown class="h-4 w-4 text-amber-400" />
              </div>
              <div class="flex items-baseline gap-1">
                <span class="text-4xl font-black text-white">₱1,499</span>
                <span class="text-xs text-slate-400">/ month</span>
              </div>
              <p class="text-xs text-slate-400">
                For active agency founders and enterprise consultants demanding unlimited AI velocity.
              </p>

              <div class="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-200">
                <div class="flex items-center gap-2 font-semibold text-white">
                  <Check class="h-4 w-4 text-brand-400 flex-shrink-0" />
                  <span>Unlimited AI proposal generation</span>
                </div>
                <div class="flex items-center gap-2 font-semibold text-white">
                  <Check class="h-4 w-4 text-brand-400 flex-shrink-0" />
                  <span>Gemini 1.5 Pro deep reasoning & ROI synthesis</span>
                </div>
                <div class="flex items-center gap-2">
                  <Check class="h-4 w-4 text-brand-400 flex-shrink-0" />
                  <span>PayMongo Philippine Peso checkout</span>
                </div>
                <div class="flex items-center gap-2">
                  <Check class="h-4 w-4 text-brand-400 flex-shrink-0" />
                  <span>Custom company branding & dual e-signatures</span>
                </div>
                <div class="flex items-center gap-2">
                  <Check class="h-4 w-4 text-brand-400 flex-shrink-0" />
                  <span>Golden Pro verified badge on proposal profile</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              @click="handleGetStarted"
              class="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all cursor-pointer"
            >
              Upgrade to ProposalAI Pro
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-slate-800 bg-slate-950 py-12 text-slate-400 text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <div class="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
            <Sparkles class="h-4 w-4" />
          </div>
          <span class="font-bold text-white text-sm">ProposalAI Enterprise</span>
          <span class="text-slate-600">|</span>
          <span>© 2026 ProposalAI. All rights reserved.</span>
        </div>

        <div class="flex items-center gap-6">
          <a href="#process" class="hover:text-white transition-colors">Workflow</a>
          <a href="#security" class="hover:text-white transition-colors">Security</a>
          <a href="#pricing" class="hover:text-white transition-colors">Pricing</a>
          <button type="button" @click="handleSignIn" class="hover:text-white transition-colors cursor-pointer">Sign In</button>
        </div>
      </div>
    </footer>

    <!-- Global Guest Authentication Modal for Landing Page -->
    <AuthModal
      :show="authGuard.isAuthModalOpen.value"
      :initial-mode="authGuard.authModalMode.value"
      @close="authGuard.closeAuthModal"
      @success="authGuard.onAuthSuccess"
    />

    <ToastContainer />
  </div>
</template>


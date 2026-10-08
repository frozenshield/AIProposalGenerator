<script setup>
import { ref, computed } from 'vue'
import { useProposalStore } from '@/stores/proposalStore'
import ExecutiveSummarySection from './ExecutiveSummarySection.vue'
import ScopeSection from './ScopeSection.vue'
import PricingTableSection from './PricingTableSection.vue'
import {
  Download,
  Copy,
  Check,
  Share2,
  Sparkles,
  Building,
  Calendar,
  Clock,
  Printer,
  FileCheck2,
  ExternalLink,
} from 'lucide-vue-next'

const store = useProposalStore()
const copied = ref(false)

const currentDate = computed(() => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())
})

const validUntilDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + (store.validDays || 30))
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
})

function copyDocumentText() {
  const text = `# ${store.proposalTitle}
Proposal #: ${store.proposalNumber}
Date: ${currentDate.value}
Prepared For: ${store.selectedClient?.name} (${store.selectedClient?.company})

## 1. Executive Summary
${store.sections.executiveSummary}

## 2. Scope of Work & Deliverables
${store.sections.scope.map((s) => `### ${s.title}\n${s.description}\nTimeline: ${s.duration} | Deliverable: ${s.deliverable}`).join('\n\n')}

## 3. Pricing
Subtotal: $${store.subtotal.toFixed(2)}
Discount: -$${store.totalDiscountAmount.toFixed(2)}
Tax: $${store.taxAmount.toFixed(2)}
Grand Total: $${store.grandTotal.toFixed(2)}
`
  navigator.clipboard.writeText(text).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

function handlePrint() {
  window.print()
}
</script>

<template>
  <div class="space-y-4">
    <!-- Preview Toolbar -->
    <div class="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs">
      <div class="flex items-center gap-2">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-600"></span>
        </span>
        <span class="text-xs font-bold text-slate-800">Live Document Canvas</span>
        <span class="hidden sm:inline-block text-[11px] text-slate-400">|</span>
        <span class="hidden sm:inline-block text-[11px] text-slate-500 font-medium">Syncing with form inputs in real time</span>
      </div>

      <div class="flex items-center gap-1.5">
        <button
          type="button"
          @click="copyDocumentText"
          class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
          title="Copy Markdown"
        >
          <component :is="copied ? Check : Copy" class="h-3.5 w-3.5 text-slate-600" />
          <span class="hidden md:inline">{{ copied ? 'Copied' : 'Copy Text' }}</span>
        </button>

        <button
          type="button"
          @click="handlePrint"
          class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors"
          title="Export as PDF"
        >
          <Download class="h-3.5 w-3.5" />
          <span>Export PDF</span>
        </button>
      </div>
    </div>

    <!-- Paper Document Canvas Wrapper -->
    <div class="bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/60 p-6 sm:p-10 transition-all text-slate-800 relative overflow-hidden">
      <!-- Subtle top decorative bar -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-500"></div>

      <!-- Watermark / Confidentiality header -->
      <div class="flex items-center justify-between pb-6 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
        <span>Proposal Ref: {{ store.proposalNumber }}</span>
        <span>Confidential & Proprietary</span>
      </div>

      <!-- Document Header & Branding -->
      <div class="pt-6 pb-8 space-y-6 border-b border-slate-200">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <div class="h-8 w-8 rounded-lg bg-slate-950 flex items-center justify-center text-white">
                <Sparkles class="h-4 w-4 text-brand-400" />
              </div>
              <span class="font-extrabold text-slate-950 tracking-tight text-lg">RLG Solutions</span>
            </div>
            <p class="text-xs text-slate-500">Autonomous AI & Cloud Architecture Consultancy</p>
            <p class="text-xs text-slate-400">San Francisco • London • Singapore</p>
          </div>

          <div class="text-left sm:text-right space-y-1">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200/80">
              Commercial Proposal
            </span>
            <div class="text-xs text-slate-500 pt-1 flex sm:justify-end items-center gap-1.5">
              <Calendar class="h-3.5 w-3.5 text-slate-400" />
              <span>Issue Date: <strong>{{ currentDate }}</strong></span>
            </div>
            <div class="text-xs text-slate-500 flex sm:justify-end items-center gap-1.5">
              <Clock class="h-3.5 w-3.5 text-slate-400" />
              <span>Valid Until: <strong>{{ validUntilDate }}</strong></span>
            </div>
          </div>
        </div>

        <!-- Proposal Title -->
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {{ store.proposalTitle }}
          </h1>
          <p class="text-xs text-slate-500 mt-1">
            Prepared under strategic AI directive with high-yield operating leverage metrics.
          </p>
        </div>

        <!-- Prepared For Client Card -->
        <div class="rounded-xl bg-slate-50/80 border border-slate-200/90 p-4">
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Prepared Exclusively For:
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <p class="font-bold text-slate-900 text-sm">{{ store.selectedClient.name }}</p>
              <p class="text-slate-600 font-medium">{{ store.selectedClient.role }}</p>
              <p class="text-brand-700 font-semibold">{{ store.selectedClient.company }}</p>
            </div>
            <div class="text-slate-500 sm:text-right space-y-0.5 text-xs">
              <p>{{ store.selectedClient.email }}</p>
              <p>{{ store.selectedClient.phone }}</p>
              <p class="text-slate-400 text-[11px]">{{ store.selectedClient.address }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Document Body: 3 Primary Requested Sections -->
      <div class="py-8 space-y-10">
        <!-- Section 1: Executive Summary -->
        <ExecutiveSummarySection />

        <!-- Section 2: Scope of Work -->
        <ScopeSection />

        <!-- Section 3: Pricing Table -->
        <PricingTableSection />
      </div>

      <!-- Document Sign-off / Footer -->
      <div class="pt-8 mt-6 border-t border-slate-200 text-xs text-slate-500 space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
          <div class="space-y-4">
            <p class="font-semibold text-slate-700">Authorized Solution Representative:</p>
            <div class="h-10 border-b border-slate-300 flex items-end pb-1 font-serif text-slate-800 italic">
              Elena Vance, Lead Architect
            </div>
            <p class="text-[11px] text-slate-400">RLG Enterprise Solutions Inc.</p>
          </div>

          <div class="space-y-4">
            <p class="font-semibold text-slate-700">Client Acceptance Signature:</p>
            <div class="h-10 border-b border-dashed border-slate-300 flex items-end pb-1 text-slate-400 italic">
              Sign & date upon authorization
            </div>
            <p class="text-[11px] text-slate-400">{{ store.selectedClient.company }}</p>
          </div>
        </div>

        <div class="text-center text-[11px] text-slate-400 pt-4 border-t border-slate-100">
          This digital proposal is protected by 256-bit encryption. Page 1 of 1 • ProposalAI Automation Suite
        </div>
      </div>
    </div>
  </div>
</template>


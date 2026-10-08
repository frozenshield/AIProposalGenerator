<script setup>
import { useProposalStore } from '@/stores/proposalStore'
import {
  CheckCircle2,
  FileCheck,
  Send,
  Download,
  Copy,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  User,
  Layers,
  FileText,
} from 'lucide-vue-next'

const store = useProposalStore()

function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold text-slate-900 flex items-center gap-2">
          <FileCheck class="h-5 w-5 text-emerald-600" />
          <span>Step 4: Review & Finalize Proposal</span>
        </h2>
        <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <CheckCircle2 class="h-3.5 w-3.5 text-emerald-600" />
          Ready to Dispatch
        </span>
      </div>
      <p class="text-xs text-slate-500 mt-1">
        Verify proposal details before publishing or downloading. Check the live document preview on the right for final layout.
      </p>
    </div>

    <!-- Summary Checklist Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <!-- Client Summary -->
      <div class="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-slate-500 text-xs">
          <span class="flex items-center gap-1 font-semibold text-slate-700">
            <User class="h-3.5 w-3.5 text-brand-600" />
            Client
          </span>
          <button @click="store.setStep(1)" class="text-[11px] text-brand-600 hover:underline">Edit</button>
        </div>
        <p class="text-xs font-bold text-slate-900 truncate">{{ store.selectedClient.name }}</p>
        <p class="text-[11px] text-slate-500 truncate">{{ store.selectedClient.company }}</p>
      </div>

      <!-- Scope Summary -->
      <div class="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-slate-500 text-xs">
          <span class="flex items-center gap-1 font-semibold text-slate-700">
            <Layers class="h-3.5 w-3.5 text-brand-600" />
            Deliverables
          </span>
          <button @click="store.setStep(2)" class="text-[11px] text-brand-600 hover:underline">Edit</button>
        </div>
        <p class="text-xs font-bold text-slate-900">{{ store.selectedItems.length }} Catalog Items</p>
        <p class="text-[11px] text-slate-500 truncate">{{ store.sections.scope.length }} Phased Milestones</p>
      </div>

      <!-- Pricing Summary -->
      <div class="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
        <div class="flex items-center justify-between text-slate-500 text-xs">
          <span class="flex items-center gap-1 font-semibold text-slate-700">
            <FileText class="h-3.5 w-3.5 text-emerald-600" />
            Grand Total
          </span>
          <button @click="store.setStep(2)" class="text-[11px] text-brand-600 hover:underline">Edit</button>
        </div>
        <p class="text-xs font-bold text-emerald-700">{{ formatCurrency(store.grandTotal) }}</p>
        <p class="text-[11px] text-slate-400">Incl. {{ store.taxRate }}% tax & disc.</p>
      </div>
    </div>

    <!-- AI Prompt Context Review Card -->
    <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1.5">
      <div class="flex items-center justify-between">
        <span class="font-semibold text-slate-700 flex items-center gap-1.5">
          <Sparkles class="h-3.5 w-3.5 text-brand-600" />
          Active AI Strategic Directive
        </span>
        <button @click="store.setStep(3)" class="text-[11px] text-brand-600 hover:underline font-medium">Modify Prompt</button>
      </div>
      <p class="text-slate-600 italic leading-relaxed">
        "{{ store.aiPromptContext }}"
      </p>
    </div>

    <!-- Final Actions -->
    <div class="pt-4 flex items-center justify-between border-t border-slate-100">
      <button
        type="button"
        @click="store.prevStep"
        class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
      >
        <ArrowLeft class="h-4 w-4" />
        <span>Back to AI Prompt</span>
      </button>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="store.resetProposal"
          class="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium transition-colors"
          title="Reset form"
        >
          <RotateCcw class="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all shadow-emerald-600/20"
        >
          <Send class="h-3.5 w-3.5" />
          <span>Publish & Send Client Portal</span>
        </button>
      </div>
    </div>
  </div>
</template>


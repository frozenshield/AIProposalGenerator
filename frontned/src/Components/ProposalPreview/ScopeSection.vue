<script setup>
import { useProposalStore } from '@/stores/proposalStore'
import { Sparkles, RefreshCw, CheckCircle, Calendar, Flag, Layers } from 'lucide-vue-next'

const store = useProposalStore()
</script>

<template>
  <section class="space-y-3">
    <!-- Section Header -->
    <div class="flex items-center justify-between border-b border-slate-200 pb-2">
      <div class="flex items-center gap-2">
        <span class="flex h-6 w-6 items-center justify-center rounded-md bg-brand-50 text-brand-700 font-bold text-xs">
          2
        </span>
        <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Scope of Work & Deliverables
        </h3>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="!store.isGenerating.scope"
          type="button"
          @click="store.generateScope"
          class="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-brand-600 hover:bg-brand-50 px-2 py-1 rounded transition-colors"
          title="Regenerate Scope with AI"
        >
          <RefreshCw class="h-3 w-3" />
          <span>Regenerate</span>
        </button>
      </div>
    </div>

    <!-- AI Loading State (Shimmer Skeleton) -->
    <div
      v-if="store.isGenerating.scope"
      class="rounded-xl border border-brand-200/80 bg-brand-50/30 p-5 space-y-4"
    >
      <div class="flex items-center gap-2 text-xs font-semibold text-brand-700">
        <Sparkles class="h-4 w-4 animate-spin text-brand-600" />
        <span>Aligning technical milestones & scope deliverables...</span>
      </div>

      <!-- Skeleton Cards -->
      <div class="space-y-3 pt-1">
        <div v-for="i in 3" :key="i" class="p-3.5 rounded-lg border border-slate-200/80 bg-white space-y-2">
          <div class="flex justify-between items-center">
            <div class="h-4 ai-skeleton rounded-md w-1/3"></div>
            <div class="h-3 ai-skeleton rounded-md w-16"></div>
          </div>
          <div class="h-3 ai-skeleton rounded-md w-full"></div>
          <div class="h-3 ai-skeleton rounded-md w-4/5"></div>
        </div>
      </div>
    </div>

    <!-- Content Display (Phased Breakdown) -->
    <div
      v-else-if="store.sections.scope && store.sections.scope.length"
      class="space-y-3 pt-1"
    >
      <div
        v-for="(phase, idx) in store.sections.scope"
        :key="idx"
        class="relative pl-5 sm:pl-6 pb-2 border-l-2 border-brand-300 last:border-transparent group"
      >
        <!-- Milestone Dot -->
        <div class="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white border-2 border-brand-600 flex items-center justify-center">
          <div class="h-1.5 w-1.5 rounded-full bg-brand-600"></div>
        </div>

        <div class="bg-slate-50/70 border border-slate-200/90 rounded-xl p-3.5 space-y-2 hover:bg-white hover:shadow-xs transition-all">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h4 class="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              {{ phase.title }}
            </h4>
            <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 bg-brand-100/70 px-2 py-0.5 rounded-md self-start sm:self-auto">
              <Calendar class="h-3 w-3" />
              {{ phase.duration }}
            </span>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed">
            {{ phase.description }}
          </p>

          <div class="flex items-center gap-2 pt-1.5 text-[11px] text-slate-700 font-medium border-t border-slate-200/60">
            <Flag class="h-3 w-3 text-emerald-600 flex-shrink-0" />
            <span class="text-slate-500">Key Milestone:</span>
            <span class="font-semibold text-slate-900">{{ phase.deliverable }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center space-y-2"
    >
      <Layers class="h-6 w-6 text-slate-400 mx-auto" />
      <p class="text-xs text-slate-500">Scope of Work has not been synthesized yet.</p>
      <button
        type="button"
        @click="store.generateScope"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 shadow-2xs"
      >
        <Sparkles class="h-3.5 w-3.5" />
        <span>Generate Scope with AI</span>
      </button>
    </div>
  </section>
</template>


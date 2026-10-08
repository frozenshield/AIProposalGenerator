<script setup>
import { ref } from 'vue'
import { useProposalStore } from '@/stores/proposalStore'
import { Sparkles, RefreshCw, Edit3, Check, FileText } from 'lucide-vue-next'

const store = useProposalStore()
const isEditing = ref(false)
const editedText = ref('')

function startEditing() {
  editedText.value = store.sections.executiveSummary
  isEditing.value = true
}

function saveEdit() {
  store.sections.executiveSummary = editedText.value
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}
</script>

<template>
  <section class="space-y-3">
    <!-- Section Header -->
    <div class="flex items-center justify-between border-b border-slate-200 pb-2">
      <div class="flex items-center gap-2">
        <span class="flex h-6 w-6 items-center justify-center rounded-md bg-brand-50 text-brand-700 font-bold text-xs">
          1
        </span>
        <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Executive Summary
        </h3>
      </div>

      <div class="flex items-center gap-2">
        <!-- Quick regenerate button -->
        <button
          v-if="!store.isGenerating.executiveSummary"
          type="button"
          @click="store.generateExecutiveSummary"
          class="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-brand-600 hover:bg-brand-50 px-2 py-1 rounded transition-colors"
          title="Regenerate Executive Summary with AI"
        >
          <RefreshCw class="h-3 w-3" />
          <span>Regenerate</span>
        </button>

        <!-- Inline Edit Toggle -->
        <button
          v-if="!store.isGenerating.executiveSummary && store.sections.executiveSummary"
          type="button"
          @click="isEditing ? saveEdit() : startEditing()"
          class="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-900 px-2 py-1 rounded transition-colors"
        >
          <component :is="isEditing ? Check : Edit3" class="h-3 w-3" />
          <span>{{ isEditing ? 'Save' : 'Edit' }}</span>
        </button>
      </div>
    </div>

    <!-- AI Loading State (Shimmer Skeleton) -->
    <div
      v-if="store.isGenerating.executiveSummary"
      class="rounded-xl border border-brand-200/80 bg-brand-50/30 p-5 space-y-3"
    >
      <div class="flex items-center gap-2 text-xs font-semibold text-brand-700">
        <Sparkles class="h-4 w-4 animate-spin text-brand-600" />
        <span>Gemini AI is synthesizing strategic executive narrative...</span>
      </div>

      <div class="space-y-2.5 pt-1">
        <div class="h-3.5 ai-skeleton-purple rounded-md w-full"></div>
        <div class="h-3.5 ai-skeleton-purple rounded-md w-11/12"></div>
        <div class="h-3.5 ai-skeleton-purple rounded-md w-4/5"></div>
      </div>

      <div class="space-y-2.5 pt-2">
        <div class="h-3.5 ai-skeleton-purple rounded-md w-full"></div>
        <div class="h-3.5 ai-skeleton-purple rounded-md w-3/4"></div>
      </div>
    </div>

    <!-- Inline Editing Area -->
    <div v-else-if="isEditing" class="space-y-2">
      <textarea
        v-model="editedText"
        rows="5"
        class="w-full text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-300 rounded-lg p-3 leading-relaxed focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-hidden"
      ></textarea>
      <div class="flex justify-end gap-2 text-xs">
        <button
          type="button"
          @click="cancelEdit"
          class="px-3 py-1 rounded text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="saveEdit"
          class="px-3 py-1 rounded bg-brand-600 text-white font-medium hover:bg-brand-500"
        >
          Apply Changes
        </button>
      </div>
    </div>

    <!-- Content Display -->
    <div
      v-else-if="store.sections.executiveSummary"
      class="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2.5 whitespace-pre-line"
    >
      <p>{{ store.sections.executiveSummary }}</p>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center space-y-2"
    >
      <FileText class="h-6 w-6 text-slate-400 mx-auto" />
      <p class="text-xs text-slate-500">Executive Summary has not been generated yet.</p>
      <button
        type="button"
        @click="store.generateExecutiveSummary"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 shadow-2xs"
      >
        <Sparkles class="h-3.5 w-3.5" />
        <span>Generate with AI</span>
      </button>
    </div>
  </section>
</template>


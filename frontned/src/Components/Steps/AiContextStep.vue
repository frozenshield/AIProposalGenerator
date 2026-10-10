<script setup>
import { useProposalStore } from '@/stores/proposalStore'
import {
  Sparkles,
  Wand2,
  BrainCircuit,
  Sliders,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
  HelpCircle,
  Zap,
  Crown,
  Lock,
} from 'lucide-vue-next'

const store = useProposalStore()

const promptPresets = [
  {
    label: 'Cost-Saving & High ROI',
    text: 'Pitch this as a decisive cost-saving measure with an accelerated 6-month ROI. Highlight automated operational efficiencies, reduced manual labor overhead by 42%, and zero-downtime cloud migration guarantee.',
  },
  {
    label: 'Speed-to-Market & Agility',
    text: 'Frame this proposal around aggressive time-to-value. Emphasize that modular AI pipelines allow rapid feature launches in weeks instead of quarters, outpacing key market rivals.',
  },
  {
    label: 'Security & Enterprise Compliance',
    text: 'Prioritize bank-grade data security, strict SOC2 Type II compliance, on-premise model deployment options, and isolated tenant architectures to mitigate all cyber risks.',
  },
  {
    label: 'Modernization & Scalability',
    text: 'Highlight legacy system refactoring into cloud-native microservices. Position this as an investment in sustainable technical equity and multi-year scalability.',
  },
]

const tones = [
  { id: 'persuasive', label: 'Persuasive & ROI' },
  { id: 'cost-saving', label: 'Cost-Saving Focus' },
  { id: 'formal', label: 'Corporate & Formal' },
  { id: 'technical', label: 'Technical & Deep' },
]

function applyPreset(text) {
  store.aiPromptContext = text
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold text-slate-900 flex items-center gap-2">
          <BrainCircuit class="h-5 w-5 text-brand-600" />
          <span>Step 3: AI Prompt Context & Direction</span>
        </h2>
        <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
          <Sparkles class="h-3 w-3" />
          Generative AI Studio
        </span>
      </div>
      <p class="text-xs text-slate-500 mt-1">
        Provide guidance on strategic angles, value propositions, and tone. The generative engine will synthesize this with client data and catalog deliverables.
      </p>
    </div>

    <!-- AI Prompt Context Textarea (Primary Focus) -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <label for="ai-context" class="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          AI Prompt Context
        </label>
        <span class="text-[11px] text-slate-400">
          {{ store.aiPromptContext.length }} characters
        </span>
      </div>

      <div class="relative">
        <textarea
          id="ai-context"
          v-model="store.aiPromptContext"
          rows="4"
          placeholder="e.g., Pitch this as a cost-saving measure with an accelerated 6-month ROI. Highlight guaranteed 99.9% uptime SLA and seamless system migration..."
          class="w-full bg-white border border-slate-300 hover:border-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-xs outline-hidden transition-all leading-relaxed"
        ></textarea>
      </div>

      <!-- Quick Context Preset Chips -->
      <div class="pt-1">
        <span class="text-[11px] font-medium text-slate-500 block mb-1.5">
          Or click to apply strategic angle:
        </span>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="preset in promptPresets"
            :key="preset.label"
            type="button"
            @click="applyPreset(preset.text)"
            class="text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 text-slate-600 transition-colors"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tone & Audience Controls -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
      <!-- Tone Selector -->
      <div class="space-y-2">
        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Narrative Tone
        </label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="tone in tones"
            :key="tone.id"
            type="button"
            @click="store.aiTone = tone.id"
            :class="[
              store.aiTone === tone.id
                ? 'bg-brand-600 text-white border-brand-600 shadow-xs font-semibold'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium',
              'py-2 px-2.5 rounded-lg border text-xs text-center transition-all'
            ]"
          >
            {{ tone.label }}
          </button>
        </div>
      </div>

      <!-- Target Audience Selector -->
      <div class="space-y-2">
        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Executive Audience
        </label>
        <select
          v-model="store.targetAudience"
          class="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-xs font-medium text-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-hidden"
        >
          <option value="C-Suite & Executive Leadership">C-Suite & Board of Directors</option>
          <option value="VP of Engineering / CTO">VP of Engineering / CTO</option>
          <option value="Procurement & Financial Officers">Procurement & CFO Office</option>
          <option value="Operations & Product Management">Operations & Product Management</option>
        </select>

        <p class="text-[11px] text-slate-400 mt-1">
          Adjusts technical depth versus high-level executive financial metrics.
        </p>
      </div>
    </div>

    <!-- AI Generation Trigger Action Card -->
    <div class="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 p-5 text-white shadow-md relative overflow-hidden">
      <!-- Background decorative glow -->
      <div class="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-brand-500/20 blur-2xl"></div>

      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/30 text-brand-200 border border-brand-500/40">
              <Zap class="h-3 w-3 text-amber-300" />
              AI Engine: {{ store.activeAiModel }}
            </span>
            <span
              v-if="store.hasReachedLimit"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/30 text-amber-200 border border-amber-500/40"
            >
              <Crown class="h-3 w-3 text-amber-300" />
              Free Limit Reached (3/3)
            </span>
          </div>
          <h3 class="text-sm font-bold text-white">Generate Real-Time Sections</h3>
          <p class="text-xs text-slate-300 mt-0.5 max-w-sm">
            <span v-if="store.hasReachedLimit" class="text-amber-200 font-medium">
              Free plan limit reached. Further generation is blocked until you upgrade to Pro.
            </span>
            <span v-else>
              Synthesizes Executive Summary, Scope of Work, and calculates final financial schedules instantly.
            </span>
          </p>
        </div>

        <button
          type="button"
          @click="store.generateFullProposal"
          :disabled="store.isGenerating.full || store.isGenerating.executiveSummary || store.isGenerating.scope"
          :class="[
            store.hasReachedLimit
              ? 'bg-gradient-to-r from-amber-500 to-brand-600 hover:from-amber-400 hover:to-brand-500 text-white shadow-amber-500/30 ring-2 ring-amber-400/40'
              : 'bg-gradient-to-r from-brand-500 to-indigo-500 hover:from-brand-400 hover:to-indigo-400 text-white shadow-brand-500/40',
            'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer'
          ]"
        >
          <Loader2
            v-if="store.isGenerating.full || store.isGenerating.executiveSummary || store.isGenerating.scope"
            class="h-4 w-4 animate-spin text-white"
          />
          <Crown v-else-if="store.hasReachedLimit" class="h-4 w-4 text-amber-200" />
          <Sparkles v-else class="h-4 w-4 text-amber-300" />
          <span>
            {{
              store.isGenerating.full
                ? 'Synthesizing with AI...'
                : store.hasReachedLimit
                ? 'Upgrade to Pro to Generate'
                : 'Generate Full Proposal'
            }}
          </span>
        </button>
      </div>
    </div>

    <!-- Navigation Stepper Buttons -->
    <div class="pt-4 flex items-center justify-between border-t border-slate-100">
      <button
        type="button"
        @click="store.prevStep"
        class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
      >
        <ArrowLeft class="h-4 w-4" />
        <span>Back to Catalog</span>
      </button>

      <button
        type="button"
        @click="store.nextStep"
        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all shadow-brand-500/20"
      >
        <span>Review & Export</span>
        <ArrowRight class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>


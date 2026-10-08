<script setup>
import { ref } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import { useProposalStore } from '@/stores/proposalStore'
import ClientStep from '@/Components/Steps/ClientStep.vue'
import CatalogStep from '@/Components/Steps/CatalogStep.vue'
import AiContextStep from '@/Components/Steps/AiContextStep.vue'
import ReviewStep from '@/Components/Steps/ReviewStep.vue'
import DocumentPreview from '@/Components/ProposalPreview/DocumentPreview.vue'
import {
  Check,
  User,
  Layers,
  Sparkles,
  FileCheck2,
  Eye,
  Edit3,
  Loader2,
  AlertCircle,
} from 'lucide-vue-next'

const store = useProposalStore()

// Mobile view tab toggle: 'form' or 'preview'
const mobileActiveTab = ref('form')

const steps = [
  { id: 1, name: 'Client', icon: User },
  { id: 2, name: 'Catalog', icon: Layers },
  { id: 3, name: 'AI Context', icon: Sparkles },
  { id: 4, name: 'Review', icon: FileCheck2 },
]
</script>

<template>
  <AppLayout currentRoute="Create Proposal" subRoute="Create">
    <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1700px] mx-auto">
      <!-- Page Header with Title & Live AI Indicator -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Create AI Proposal
            </h1>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
              Interactive Builder
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Configure client parameters, attach deliverables, and steer generative models with strategic prompt context.
          </p>
        </div>

        <!-- Mobile Tab Switcher (Visible on small screens) -->
        <div class="flex lg:hidden rounded-xl bg-slate-200/80 p-1 self-start sm:self-auto">
          <button
            type="button"
            @click="mobileActiveTab = 'form'"
            :class="[
              mobileActiveTab === 'form'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-medium',
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs transition-all'
            ]"
          >
            <Edit3 class="h-3.5 w-3.5" />
            <span>Form Editor</span>
          </button>

          <button
            type="button"
            @click="mobileActiveTab = 'preview'"
            :class="[
              mobileActiveTab === 'preview'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-medium',
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs transition-all'
            ]"
          >
            <Eye class="h-3.5 w-3.5" />
            <span>Live Document</span>
            <span
              v-if="store.isGenerating.full || store.isGenerating.executiveSummary || store.isGenerating.scope"
              class="h-2 w-2 rounded-full bg-brand-600 animate-pulse"
            ></span>
          </button>
        </div>
      </div>

      <!-- Split Two-Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        <!-- LEFT COLUMN: Multi-Step Proposal Builder Form -->
        <div
          :class="[
            mobileActiveTab === 'preview' ? 'hidden lg:block' : 'block',
            'lg:col-span-6 xl:col-span-5 space-y-6'
          ]"
        >
          <!-- Stepper Progress Bar -->
          <div class="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <div class="flex items-center justify-between">
              <div
                v-for="(step, index) in steps"
                :key="step.id"
                class="flex items-center flex-1 last:flex-none cursor-pointer"
                @click="store.setStep(step.id)"
              >
                <!-- Step Circle -->
                <div class="flex flex-col items-center">
                  <div
                    :class="[
                      store.currentStep === step.id
                        ? 'bg-brand-600 text-white ring-4 ring-brand-100 shadow-xs'
                        : store.currentStep > step.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200',
                      'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200'
                    ]"
                  >
                    <Check v-if="store.currentStep > step.id" class="h-4 w-4" />
                    <component :is="step.icon" v-else class="h-3.5 w-3.5" />
                  </div>
                  <span
                    :class="[
                      store.currentStep === step.id
                        ? 'font-bold text-brand-700'
                        : 'font-medium text-slate-500',
                      'text-[11px] mt-1.5 hidden sm:block'
                    ]"
                  >
                    {{ step.name }}
                  </span>
                </div>

                <!-- Connecting Line -->
                <div
                  v-if="index < steps.length - 1"
                  :class="[
                    store.currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200',
                    'flex-1 h-0.5 mx-2 -mt-4 transition-colors duration-200'
                  ]"
                ></div>
              </div>
            </div>
          </div>

          <!-- Step Form Body Container -->
          <div class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
            <!-- Step 1: Select Client -->
            <ClientStep v-if="store.currentStep === 1" />

            <!-- Step 2: Catalog Items & Pricing -->
            <CatalogStep v-else-if="store.currentStep === 2" />

            <!-- Step 3: AI Prompt Context -->
            <AiContextStep v-else-if="store.currentStep === 3" />

            <!-- Step 4: Final Review -->
            <ReviewStep v-else-if="store.currentStep === 4" />
          </div>

          <!-- Helpful AI Generation Assistant Card -->
          <div class="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50/60 via-purple-50/40 to-white p-4.5 shadow-2xs space-y-2">
            <div class="flex items-center justify-between text-xs font-bold text-brand-900">
              <span class="flex items-center gap-1.5">
                <Sparkles class="h-4 w-4 text-brand-600" />
                Prompt Optimization Tip
              </span>
              <span class="text-[10px] text-slate-500 font-normal">Step {{ store.currentStep }} of 4</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              When entering the AI Prompt Context, consider including client friction points and concrete metric goals (e.g. <em>"save $180k annually in cloud idle capacity"</em>). The right preview pane updates in real time.
            </p>
          </div>
        </div>

        <!-- RIGHT COLUMN: Real-Time Document Preview Pane -->
        <div
          :class="[
            mobileActiveTab === 'form' ? 'hidden lg:block' : 'block',
            'lg:col-span-6 xl:col-span-7 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2'
          ]"
        >
          <DocumentPreview />
        </div>
      </div>
    </div>
  </AppLayout>
</template>


<script setup>
import { ref, computed } from 'vue'
import { useProposalStore } from '@/stores/proposalStore'
import ExecutiveSummarySection from './ExecutiveSummarySection.vue'
import ScopeSection from './ScopeSection.vue'
import PricingTableSection from './PricingTableSection.vue'
import ESignatureModal from '@/Components/Modals/ESignatureModal.vue'
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
  Edit3,
  PenTool,
  ShieldCheck,
  Trash2,
  RotateCcw,
} from 'lucide-vue-next'

const store = useProposalStore()
const copied = ref(false)
const isEditMode = ref(false)

// E-Signature Modal State
const isSignatureModalOpen = ref(false)
const signatureTarget = ref('author') // 'author' or 'client'

function copyDocumentText() {
  const text = `# ${store.proposalTitle}
Proposal #: ${store.proposalNumber}
Company: ${store.companyName}
Date: ${store.issueDate}
Valid Until: ${store.validUntilDate}
Prepared For: ${store.selectedClient?.name} (${store.selectedClient?.company})

## 1. Executive Summary
${store.sections.executiveSummary}

## 2. Scope of Work & Deliverables
${store.sections.scope.map((s) => `### ${s.title}\n${s.description}\nTimeline: ${s.duration} | Deliverable: ${s.deliverable}`).join('\n\n')}

## 3. Pricing
Subtotal: ${store.formatCurrency(store.subtotal)}
Discount: -${store.formatCurrency(store.totalDiscountAmount)}
Tax: ${store.formatCurrency(store.taxAmount)}
Grand Total: ${store.formatCurrency(store.grandTotal)}

Authorized Signer: ${store.representativeName} (${store.representativeCompany})
`
  navigator.clipboard.writeText(text).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

function handlePrint() {
  const previousEditMode = isEditMode.value
  isEditMode.value = false
  setTimeout(() => {
    window.print()
    setTimeout(() => {
      isEditMode.value = previousEditMode
    }, 500)
  }, 120)
}

function openSignatureModal(target = 'author') {
  signatureTarget.value = target
  isSignatureModalOpen.value = true
}

function handleSaveSignature({ dataUrl, type, signerName }) {
  if (signatureTarget.value === 'author') {
    store.setAuthorSignature(dataUrl, type)
    if (signerName && !isEditMode.value) {
      store.representativeName = signerName
    }
  } else {
    store.clientSignature = dataUrl
  }
}

function clearAuthorSignature() {
  store.clearAuthorSignature()
}

function clearClientSignature() {
  store.clientSignature = null
}
</script>

<template>
  <div class="space-y-4">
    <!-- Preview Toolbar with Edit Details Toggle -->
    <div class="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs print:hidden">
      <div class="flex items-center gap-2">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-600"></span>
        </span>
        <span class="text-xs font-bold text-slate-800">Live Document Canvas</span>
        <span class="hidden sm:inline-block text-[11px] text-slate-400">|</span>
        <span class="hidden sm:inline-block text-[11px] text-slate-500 font-medium">Syncing with form inputs in real time</span>
      </div>

      <div class="flex items-center gap-2">
        <!-- Edit Details Toggle Button -->
        <button
          type="button"
          @click="isEditMode = !isEditMode"
          :class="[
            isEditMode
              ? 'bg-brand-600 text-white shadow-xs font-bold'
              : 'border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold',
            'inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer'
          ]"
          title="Toggle inline editing of canvas details (Company, Dates, Signers)"
        >
          <Edit3 class="h-3.5 w-3.5" />
          <span>{{ isEditMode ? 'Done Editing' : 'Edit Canvas Details' }}</span>
        </button>

        <!-- E-Signature Quick Trigger -->
        <button
          type="button"
          @click="openSignatureModal('author')"
          class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 transition-colors cursor-pointer"
          title="Add or update e-signature"
        >
          <PenTool class="h-3.5 w-3.5 text-amber-600" />
          <span>{{ store.authorSignature ? 'Edit Signature' : 'Add E-Signature' }}</span>
        </button>

        <button
          type="button"
          @click="copyDocumentText"
          class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
          title="Copy Markdown"
        >
          <component :is="copied ? Check : Copy" class="h-3.5 w-3.5 text-slate-600" />
          <span class="hidden md:inline">{{ copied ? 'Copied' : 'Copy' }}</span>
        </button>

        <button
          type="button"
          @click="handlePrint"
          class="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer"
          title="Export as PDF"
        >
          <Download class="h-3.5 w-3.5" />
          <span>Export PDF</span>
        </button>
      </div>
    </div>

    <!-- Paper Document Canvas Wrapper -->
    <div
      id="printable-proposal-canvas"
      class="bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/60 p-6 sm:p-10 transition-all text-slate-800 relative overflow-hidden print:p-0 print:border-none print:shadow-none print:rounded-none"
    >
      <!-- Subtle top decorative bar -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-500"></div>

      <!-- Watermark / Confidentiality header -->
      <div class="flex items-center justify-between pb-6 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
        <div class="flex items-center gap-1">
          <span>Proposal Ref:</span>
          <input
            v-if="isEditMode"
            v-model="store.proposalNumber"
            type="text"
            class="px-1.5 py-0.5 rounded border border-brand-300 text-[10px] font-mono text-slate-700 bg-brand-50/50"
          />
          <span v-else class="font-mono text-slate-700">{{ store.proposalNumber }}</span>
        </div>
        <span>Confidential & Proprietary</span>
      </div>

      <!-- Document Header & Branding -->
      <div class="pt-6 pb-8 space-y-6 border-b border-slate-200">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <!-- Left: Issuing Company Details (Editable in place) -->
          <div class="space-y-1 max-w-sm">
            <div class="flex items-center gap-2 mb-2">
              <div class="h-8 w-8 rounded-lg bg-slate-950 flex items-center justify-center text-white flex-shrink-0">
                <Sparkles class="h-4 w-4 text-brand-400" />
              </div>
              <div class="flex-1">
                <input
                  v-if="isEditMode"
                  v-model="store.companyName"
                  type="text"
                  placeholder="Your Company Name"
                  class="font-extrabold text-slate-950 tracking-tight text-lg w-full px-2 py-0.5 rounded border border-brand-400 bg-brand-50/40 focus:ring-1 focus:ring-brand-500"
                />
                <span v-else class="font-extrabold text-slate-950 tracking-tight text-lg block">
                  {{ store.companyName }}
                </span>
              </div>
            </div>

            <div v-if="isEditMode" class="space-y-1">
              <input
                v-model="store.companyTagline"
                type="text"
                placeholder="Company Tagline"
                class="text-xs text-slate-700 w-full px-2 py-0.5 rounded border border-brand-300 bg-brand-50/30"
              />
              <input
                v-model="store.companyAddress"
                type="text"
                placeholder="Locations / Address"
                class="text-xs text-slate-600 w-full px-2 py-0.5 rounded border border-brand-300 bg-brand-50/30"
              />
            </div>
            <div v-else>
              <p class="text-xs text-slate-500">{{ store.companyTagline }}</p>
              <p class="text-xs text-slate-400">{{ store.companyAddress }}</p>
            </div>
          </div>

          <!-- Right: Document Status, Issue Date & Valid Until (Editable in place) -->
          <div class="text-left sm:text-right space-y-1.5">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200/80">
              Commercial Proposal
            </span>
            
            <!-- Issue Date -->
            <div class="text-xs text-slate-500 pt-1 flex sm:justify-end items-center gap-1.5">
              <Calendar class="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              <span>Issue Date: </span>
              <input
                v-if="isEditMode"
                v-model="store.issueDate"
                type="text"
                class="px-1.5 py-0.5 rounded border border-brand-300 text-xs font-semibold text-slate-900 bg-brand-50/40 w-32"
              />
              <strong v-else class="text-slate-900">{{ store.issueDate }}</strong>
            </div>

            <!-- Valid Until Date -->
            <div class="text-xs text-slate-500 flex sm:justify-end items-center gap-1.5">
              <Clock class="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              <span>Valid Until: </span>
              <input
                v-if="isEditMode"
                v-model="store.validUntilDate"
                type="text"
                class="px-1.5 py-0.5 rounded border border-brand-300 text-xs font-semibold text-slate-900 bg-brand-50/40 w-32"
              />
              <strong v-else class="text-slate-900">{{ store.validUntilDate }}</strong>
            </div>
          </div>
        </div>

        <!-- Proposal Title (Editable) -->
        <div>
          <input
            v-if="isEditMode"
            v-model="store.proposalTitle"
            type="text"
            placeholder="Proposal Document Title"
            class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug w-full px-2.5 py-1 rounded-xl border border-brand-400 bg-brand-50/40 focus:ring-2 focus:ring-brand-500"
          />
          <h1 v-else class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
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
            <div class="flex items-center gap-3">
              <img
                :src="store.selectedClient?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'"
                :alt="store.selectedClient?.name || 'Client Avatar'"
                class="h-10 w-10 rounded-xl object-cover ring-2 ring-slate-200"
              />
              <div>
                <p class="font-bold text-slate-900 text-sm">{{ store.selectedClient.name }}</p>
                <p class="text-slate-600 font-medium">{{ store.selectedClient.role }}</p>
                <p class="text-brand-700 font-semibold">{{ store.selectedClient.company }}</p>
              </div>
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

      <!-- Document Sign-off / E-Signature Footer (Image 3) -->
      <div class="pt-8 mt-6 border-t border-slate-200 text-xs text-slate-500 space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
          <!-- Authorized Solution Representative Signature Block -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <p class="font-semibold text-slate-700">Authorized Solution Representative:</p>
              <button
                type="button"
                @click="openSignatureModal('author')"
                class="text-[11px] font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer"
              >
                <PenTool class="h-3 w-3" />
                <span>{{ store.authorSignature ? 'Change' : 'Sign Digitally' }}</span>
              </button>
            </div>

            <!-- Signature Line Box with Embedded E-Signature -->
            <div
              @click="!store.authorSignature && openSignatureModal('author')"
              class="min-h-14 border-b border-slate-300 pb-1 flex flex-col justify-end transition-all relative group cursor-pointer"
              :class="{ 'hover:bg-slate-50/60 rounded-t-lg': !store.authorSignature }"
            >
              <!-- Embedded Signature Image/Data -->
              <div v-if="store.authorSignature" class="flex items-center justify-between">
                <img
                  :src="store.authorSignature"
                  alt="Embedded Representative Signature"
                  class="h-12 max-w-[220px] object-contain drop-shadow-xs"
                />
                <button
                  type="button"
                  @click.stop="clearAuthorSignature"
                  class="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity"
                  title="Remove signature"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </div>
              <div v-else class="text-slate-400 italic text-[11px] flex items-center gap-1.5 py-2">
                <PenTool class="h-3.5 w-3.5 text-slate-300" />
                <span>Click here to embed your digital signature</span>
              </div>
            </div>

            <!-- Representative Name & Company (Editable in place) -->
            <div>
              <div v-if="isEditMode" class="space-y-1">
                <input
                  v-model="store.representativeName"
                  type="text"
                  placeholder="Representative Name & Title"
                  class="w-full px-2 py-0.5 rounded border border-brand-300 text-xs font-semibold text-slate-900 bg-brand-50/30"
                />
                <input
                  v-model="store.representativeCompany"
                  type="text"
                  placeholder="Representative Organization"
                  class="w-full px-2 py-0.5 rounded border border-brand-300 text-[11px] text-slate-600 bg-brand-50/30"
                />
              </div>
              <div v-else>
                <p class="font-serif text-slate-800 italic font-semibold text-sm">{{ store.representativeName }}</p>
                <p class="text-[11px] text-slate-400">{{ store.representativeCompany }}</p>
              </div>

              <!-- Cryptographic Verification Pill -->
              <div v-if="store.authorSignature" class="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-medium">
                <ShieldCheck class="h-3 w-3 text-emerald-600 flex-shrink-0" />
                <span>Verified E-Signature • 256-bit Security Audit</span>
              </div>
            </div>
          </div>

          <!-- Client Acceptance Signature Block -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <p class="font-semibold text-slate-700">Client Acceptance Signature:</p>
              <button
                type="button"
                @click="openSignatureModal('client')"
                class="text-[11px] font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <PenTool class="h-3 w-3" />
                <span>{{ store.clientSignature ? 'Change' : 'Client Sign' }}</span>
              </button>
            </div>

            <!-- Signature Line Box -->
            <div
              @click="!store.clientSignature && openSignatureModal('client')"
              class="min-h-14 border-b border-dashed border-slate-300 pb-1 flex flex-col justify-end transition-all relative group cursor-pointer"
              :class="{ 'hover:bg-slate-50/60 rounded-t-lg': !store.clientSignature }"
            >
              <div v-if="store.clientSignature" class="flex items-center justify-between">
                <img
                  :src="store.clientSignature"
                  alt="Embedded Client Acceptance Signature"
                  class="h-12 max-w-[220px] object-contain drop-shadow-xs"
                />
                <button
                  type="button"
                  @click.stop="clearClientSignature"
                  class="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity"
                  title="Remove client signature"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </div>
              <div v-else class="text-slate-400 italic text-[11px] py-2">
                {{ store.clientSignerName }}
              </div>
            </div>

            <p class="text-[11px] text-slate-400">{{ store.selectedClient.company }}</p>
          </div>
        </div>

        <div class="text-center text-[11px] text-slate-400 pt-4 border-t border-slate-100 flex items-center justify-center gap-2">
          <ShieldCheck class="h-3.5 w-3.5 text-emerald-500" />
          <span>This digital proposal is protected by 256-bit encryption. Page 1 of 1 • ProposalAI Automation Suite</span>
        </div>
      </div>
    </div>

    <!-- E-Signature Modal -->
    <ESignatureModal
      :show="isSignatureModalOpen"
      :default-name="signatureTarget === 'author' ? store.representativeName.split(',')[0] : store.selectedClient.name"
      :title="signatureTarget === 'author' ? 'Add Solution Representative Signature' : 'Add Client Acceptance Signature'"
      @close="isSignatureModalOpen = false"
      @save="handleSaveSignature"
    />
  </div>
</template>

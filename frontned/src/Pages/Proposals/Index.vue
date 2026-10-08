<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import { useProposalStore } from '@/stores/proposalStore'
import {
  FileText,
  PlusCircle,
  Sparkles,
  Search,
  Filter,
  ArrowUpRight,
  Building2,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Send,
  Eye,
  Copy,
  Trash2,
  Download,
  LayoutGrid,
  List,
  MoreVertical,
  X,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from 'lucide-vue-next'

const store = useProposalStore()

// View Mode: 'cards' or 'table'
const viewMode = ref('cards')

// Search & Filter State
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedSort = ref('newest')

// Quick Preview Modal State
const previewModalProposal = ref(null)

const statusFilters = [
  { id: 'all', label: 'All Proposals' },
  { id: 'Drafting', label: 'Drafting' },
  { id: 'In Review', label: 'In Review' },
  { id: 'Sent', label: 'Sent to Client' },
  { id: 'Approved', label: 'Approved & Won' },
  { id: 'Archived', label: 'Archived' },
]

function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)
}

const filteredProposals = computed(() => {
  let list = [...store.proposalsList]

  // Filter by status
  if (selectedStatus.value !== 'all') {
    list = list.filter((p) => p.status === selectedStatus.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.clientCompany.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q)
    )
  }

  // Sorting
  if (selectedSort.value === 'highest-value') {
    list.sort((a, b) => b.total - a.total)
  } else if (selectedSort.value === 'lowest-value') {
    list.sort((a, b) => a.total - b.total)
  } else if (selectedSort.value === 'ai-score') {
    list.sort((a, b) => parseInt(b.aiScore) - parseInt(a.aiScore))
  }

  return list
})

const totalPipelineValue = computed(() => {
  return store.proposalsList.reduce((acc, p) => acc + (p.total || 0), 0)
})

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Approved':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20'
    case 'Sent':
      return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20'
    case 'In Review':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20'
    case 'Drafting':
      return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20'
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200 ring-slate-500/20'
  }
}

function openPreview(proposal) {
  previewModalProposal.value = proposal
}

function closePreview() {
  previewModalProposal.value = null
}
</script>

<template>
  <AppLayout currentRoute="Proposals">
    <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1700px] mx-auto">
      <!-- Page Header with Title and Create Action -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Proposals Directory
            </h1>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
              {{ store.proposalsList.length }} Commercial Deals
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor client approval pipelines, review AI-synthesized scopes, and launch tailored proposals.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a
            href="/proposals/create"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-brand-500/25 transition-all group"
          >
            <PlusCircle class="h-4 w-4 transition-transform group-hover:rotate-90 duration-300" />
            <span>Create Proposal</span>
          </a>
        </div>
      </div>

      <!-- KPI Performance Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Metric 1: Total Deals -->
        <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <div class="flex items-center justify-between text-slate-500">
            <span class="text-xs font-semibold text-slate-600">Total Proposals</span>
            <div class="h-8 w-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <FileText class="h-4 w-4" />
            </div>
          </div>
          <p class="text-xl sm:text-2xl font-extrabold text-slate-900">{{ store.proposalsList.length }}</p>
          <p class="text-[11px] font-medium text-emerald-600">+2 generated this week</p>
        </div>

        <!-- Metric 2: Pipeline Value -->
        <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <div class="flex items-center justify-between text-slate-500">
            <span class="text-xs font-semibold text-slate-600">Active Pipeline Value</span>
            <div class="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign class="h-4 w-4" />
            </div>
          </div>
          <p class="text-xl sm:text-2xl font-extrabold text-slate-900">{{ formatCurrency(totalPipelineValue) }}</p>
          <p class="text-[11px] font-medium text-emerald-600">Across 4 target accounts</p>
        </div>

        <!-- Metric 3: Win Rate -->
        <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <div class="flex items-center justify-between text-slate-500">
            <span class="text-xs font-semibold text-slate-600">Proposal Close Rate</span>
            <div class="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp class="h-4 w-4" />
            </div>
          </div>
          <p class="text-xl sm:text-2xl font-extrabold text-slate-900">72.4%</p>
          <p class="text-[11px] font-medium text-emerald-600">+14% vs. manual drafting</p>
        </div>

        <!-- Metric 4: AI Strategic Score -->
        <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <div class="flex items-center justify-between text-slate-500">
            <span class="text-xs font-semibold text-slate-600">Avg. AI Strategic Fit</span>
            <div class="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles class="h-4 w-4" />
            </div>
          </div>
          <p class="text-xl sm:text-2xl font-extrabold text-slate-900">95.2%</p>
          <p class="text-[11px] font-medium text-purple-600">Gemini 1.5 Pro synthesis</p>
        </div>
      </div>

      <!-- Filters, Status Tabs & Search Toolbar -->
      <div class="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-4">
        <!-- Status Pills Navigation -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100">
          <button
            v-for="tab in statusFilters"
            :key="tab.id"
            type="button"
            @click="selectedStatus = tab.id"
            :class="[
              selectedStatus === tab.id
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium',
              'px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Search & Control Row -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <!-- Search Input -->
          <div class="relative flex-1 max-w-md">
            <Search class="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by proposal #, title, or client company..."
              class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-hidden transition-all"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <!-- Controls: Sort & Grid/Table Toggle -->
          <div class="flex items-center gap-3 self-end md:self-auto">
            <!-- Sort Selector -->
            <div class="flex items-center gap-1.5 text-xs text-slate-500">
              <span class="hidden sm:inline font-medium">Sort:</span>
              <select
                v-model="selectedSort"
                class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:bg-white focus:border-brand-500 outline-hidden cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="highest-value">Highest Deal Value</option>
                <option value="lowest-value">Lowest Deal Value</option>
                <option value="ai-score">AI Strategic Score</option>
              </select>
            </div>

            <!-- View Mode Switcher -->
            <div class="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
              <button
                type="button"
                @click="viewMode = 'cards'"
                :class="[
                  viewMode === 'cards' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900',
                  'p-1.5 rounded-lg transition-colors'
                ]"
                title="Grid Card View"
              >
                <LayoutGrid class="h-4 w-4" />
              </button>
              <button
                type="button"
                @click="viewMode = 'table'"
                :class="[
                  viewMode === 'table' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900',
                  'p-1.5 rounded-lg transition-colors'
                ]"
                title="Table View"
              >
                <List class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty Filter State -->
      <div
        v-if="filteredProposals.length === 0"
        class="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-3"
      >
        <div class="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
          <FileText class="h-6 w-6" />
        </div>
        <h3 class="text-sm font-bold text-slate-800">No matching proposals found</h3>
        <p class="text-xs text-slate-500 max-w-sm mx-auto">
          Try clearing your search query or switching your status filter tab.
        </p>
        <button
          type="button"
          @click="searchQuery = ''; selectedStatus = 'all'"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          Reset Filters
        </button>
      </div>

      <!-- VIEW MODE 1: Grid Cards View -->
      <div
        v-else-if="viewMode === 'cards'"
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        <div
          v-for="proposal in filteredProposals"
          :key="proposal.id"
          class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between space-y-4 group relative"
        >
          <!-- Top Row: ID, Date & Status -->
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span class="font-mono text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-200">
                {{ proposal.id }}
              </span>

              <div class="flex items-center gap-2">
                <span
                  :class="[
                    getStatusBadgeClass(proposal.status),
                    'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ring-1'
                  ]"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                  {{ proposal.status }}
                </span>
              </div>
            </div>

            <!-- Title & AI Summary -->
            <div>
              <h3 class="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
                {{ proposal.title }}
              </h3>
              <p class="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {{ proposal.aiSummary }}
              </p>
            </div>

            <!-- AI Strategic Angle Badge -->
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50/70 border border-purple-100 text-[11px] text-purple-700 font-medium">
              <Sparkles class="h-3 w-3 text-purple-600 flex-shrink-0" />
              <span class="truncate">{{ proposal.aiAngle }}</span>
              <span class="font-bold text-purple-900">• {{ proposal.aiScore }}</span>
            </div>
          </div>

          <!-- Middle: Client Card Mini -->
          <div class="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2.5 min-w-0">
              <img
                :src="proposal.clientAvatar"
                :alt="proposal.clientName"
                class="h-8 w-8 rounded-lg object-cover flex-shrink-0"
              />
              <div class="min-w-0">
                <p class="font-bold text-slate-900 truncate">{{ proposal.clientCompany }}</p>
                <p class="text-[11px] text-slate-500 truncate">{{ proposal.clientName }}</p>
              </div>
            </div>

            <div class="text-right flex-shrink-0">
              <span class="text-[10px] text-slate-400 block">Total</span>
              <span class="font-extrabold text-slate-900 text-sm">
                {{ formatCurrency(proposal.total) }}
              </span>
            </div>
          </div>

          <!-- Bottom: Action Toolbar -->
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-[11px] text-slate-400 flex items-center gap-1">
              <Calendar class="h-3 w-3" />
              {{ proposal.date }}
            </span>

            <div class="flex items-center gap-1.5">
              <!-- Quick Preview Modal Button -->
              <button
                type="button"
                @click="openPreview(proposal)"
                class="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Quick Document Preview"
              >
                <Eye class="h-4 w-4" />
              </button>

              <!-- Duplicate Button -->
              <button
                type="button"
                @click="store.duplicateProposal(proposal.id)"
                class="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                title="Duplicate Proposal"
              >
                <Copy class="h-4 w-4" />
              </button>

              <!-- Delete Button -->
              <button
                type="button"
                @click="store.deleteProposal(proposal.id)"
                class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete Proposal"
              >
                <Trash2 class="h-4 w-4" />
              </button>

              <!-- Edit in Builder Link -->
              <a
                href="/proposals/create"
                class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-600 hover:text-white text-brand-700 font-semibold transition-all shadow-2xs"
              >
                <span>Open</span>
                <ArrowUpRight class="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW MODE 2: Comprehensive Table View -->
      <div
        v-else-if="viewMode === 'table'"
        class="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th class="py-3 px-4">Ref #</th>
                <th class="py-3 px-4">Proposal Title & AI Directive</th>
                <th class="py-3 px-4">Client Company</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Investment</th>
                <th class="py-3 px-4 text-center">AI Fit</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="proposal in filteredProposals"
                :key="proposal.id"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <!-- Proposal ID -->
                <td class="py-3.5 px-4 font-mono font-bold text-brand-700 whitespace-nowrap">
                  {{ proposal.id }}
                </td>

                <!-- Title & Angle -->
                <td class="py-3.5 px-4 max-w-xs">
                  <p class="font-bold text-slate-900 leading-tight truncate">{{ proposal.title }}</p>
                  <p class="text-[11px] text-purple-700 mt-0.5 truncate flex items-center gap-1">
                    <Sparkles class="h-3 w-3 text-purple-500 inline" />
                    {{ proposal.aiAngle }}
                  </p>
                </td>

                <!-- Client -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <img :src="proposal.clientAvatar" class="h-6 w-6 rounded-md object-cover" />
                    <div>
                      <p class="font-semibold text-slate-800">{{ proposal.clientCompany }}</p>
                      <p class="text-[10px] text-slate-400">{{ proposal.clientName }}</p>
                    </div>
                  </div>
                </td>

                <!-- Status -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <span
                    :class="[
                      getStatusBadgeClass(proposal.status),
                      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ring-1'
                    ]"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                    {{ proposal.status }}
                  </span>
                </td>

                <!-- Amount -->
                <td class="py-3.5 px-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                  {{ formatCurrency(proposal.total) }}
                </td>

                <!-- AI Fit -->
                <td class="py-3.5 px-4 text-center whitespace-nowrap font-bold text-purple-700">
                  {{ proposal.aiScore }}
                </td>

                <!-- Actions -->
                <td class="py-3.5 px-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      @click="openPreview(proposal)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                      title="Quick Preview"
                    >
                      <Eye class="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      @click="store.duplicateProposal(proposal.id)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50"
                      title="Duplicate"
                    >
                      <Copy class="h-4 w-4" />
                    </button>
                    <a
                      href="/proposals/create"
                      class="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50"
                      title="Open in Builder"
                    >
                      <ArrowUpRight class="h-4 w-4" />
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Quick Document Preview Modal / Drawer -->
    <div
      v-if="previewModalProposal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                {{ previewModalProposal.id }}
              </span>
              <h2 class="text-base font-bold text-slate-900">{{ previewModalProposal.title }}</h2>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">Prepared for {{ previewModalProposal.clientCompany }}</p>
          </div>

          <button
            type="button"
            @click="closePreview"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Modal Body: Quick Executive Document Preview -->
        <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs sm:text-sm">
          <!-- Client & Metadata banner -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span class="text-[10px] text-slate-400 font-semibold block uppercase">Client Account</span>
              <span class="font-bold text-slate-900">{{ previewModalProposal.clientCompany }}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 font-semibold block uppercase">Total Valuation</span>
              <span class="font-extrabold text-emerald-700">{{ formatCurrency(previewModalProposal.total) }}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 font-semibold block uppercase">Status</span>
              <span class="font-semibold text-slate-800">{{ previewModalProposal.status }}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 font-semibold block uppercase">AI Alignment</span>
              <span class="font-bold text-purple-700">{{ previewModalProposal.aiScore }} Fit</span>
            </div>
          </div>

          <!-- Executive Summary Preview -->
          <div class="space-y-2">
            <h4 class="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <Sparkles class="h-3.5 w-3.5 text-brand-600" />
              Executive AI Synthesis
            </h4>
            <p class="text-slate-700 leading-relaxed bg-brand-50/30 p-4 rounded-xl border border-brand-100 italic">
              "{{ previewModalProposal.aiSummary }}"
            </p>
          </div>

          <!-- Strategic Parameters -->
          <div class="space-y-2">
            <h4 class="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1">
              Strategic Mandate Angle
            </h4>
            <div class="p-3.5 rounded-xl border border-slate-200 bg-white text-xs space-y-1">
              <p class="font-semibold text-slate-800">{{ previewModalProposal.aiAngle }}</p>
              <p class="text-slate-500">
                Engineered with automated failovers, SLA guarantees, and enterprise governance compliance.
              </p>
            </div>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="px-6 py-3.5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <button
            type="button"
            @click="closePreview"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>

          <a
            href="/proposals/create"
            class="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-xs"
          >
            <span>Open in Full Interactive Builder</span>
            <ArrowUpRight class="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

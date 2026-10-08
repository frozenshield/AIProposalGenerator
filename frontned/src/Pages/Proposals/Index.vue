<script setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import { useProposalStore } from '@/stores/proposalStore'
import { FileText, PlusCircle, Sparkles, Search, Filter, ArrowUpRight } from 'lucide-vue-next'

const store = useProposalStore()

const proposals = [
  {
    id: 'PROP-2026-884',
    title: 'Strategic AI Modernization & Cost Optimization Proposal',
    client: 'Apex Retail Solutions',
    status: 'In Review',
    total: '$37,654.50',
    date: 'Oct 08, 2026',
    aiScore: '98% Alignment',
  },
  {
    id: 'PROP-2026-883',
    title: 'Autonomous Healthcare Pipeline & SOC2 Hardening',
    client: 'OmniHealth Technologies',
    status: 'Sent to Client',
    total: '$64,200.00',
    date: 'Oct 05, 2026',
    aiScore: '94% Alignment',
  },
  {
    id: 'PROP-2026-882',
    title: 'FinTech Cloud Infrastructure Resilience Sprint',
    client: 'FinVanguard Global',
    status: 'Approved & Signed',
    total: '$112,000.00',
    date: 'Oct 02, 2026',
    aiScore: '99% Alignment',
  },
  {
    id: 'PROP-2026-881',
    title: 'Supply Chain Automated Dispatcher Model',
    client: 'LogiFlow Supply Corp',
    status: 'Archived',
    total: '$48,500.00',
    date: 'Sep 28, 2026',
    aiScore: '91% Alignment',
  },
]
</script>

<template>
  <AppLayout currentRoute="Proposals">
    <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1700px] mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Proposals Directory</h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">Review active, generated, and dispatched client proposals.</p>
        </div>
        <a
          href="/proposals/create"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all shadow-brand-500/20"
        >
          <PlusCircle class="h-4 w-4" />
          <span>Create Proposal</span>
        </a>
      </div>

      <div class="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div class="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="relative w-full sm:w-72">
            <Search class="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by proposal # or client..."
              class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-brand-500 outline-hidden"
            />
          </div>

          <div class="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-500">
            <span class="font-medium">Filter:</span>
            <select class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <option>All Proposals (4)</option>
              <option>In Review</option>
              <option>Sent</option>
              <option>Approved</option>
            </select>
          </div>
        </div>

        <div class="divide-y divide-slate-100">
          <div
            v-for="p in proposals"
            :key="p.id"
            class="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-mono text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  {{ p.id }}
                </span>
                <span class="text-xs text-slate-400">• {{ p.date }}</span>
              </div>
              <h3 class="font-bold text-slate-900 text-sm leading-snug">{{ p.title }}</h3>
              <p class="text-xs text-slate-500">Client: <strong class="text-slate-700">{{ p.client }}</strong></p>
            </div>

            <div class="flex items-center gap-4 sm:text-right">
              <div>
                <p class="text-sm font-extrabold text-slate-900">{{ p.total }}</p>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <Sparkles class="h-3 w-3 text-brand-500" />
                  <span class="text-[10px] font-semibold text-brand-700">{{ p.aiScore }}</span>
                </div>
              </div>

              <a
                href="/proposals/create"
                class="p-2 rounded-xl bg-slate-100 hover:bg-brand-600 hover:text-white text-slate-600 transition-colors"
                title="Open Proposal"
              >
                <ArrowUpRight class="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>


<script setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import {
  FileText,
  Users,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
  PlusCircle,
} from 'lucide-vue-next'

const stats = [
  { name: 'Active Proposals', value: '14', change: '+18% this month', icon: FileText },
  { name: 'Total Win Value', value: '$284,500', change: '+32% closing rate', icon: TrendingUp },
  { name: 'Client Accounts', value: '42', change: '4 new this week', icon: Users },
  { name: 'Avg. AI Turnaround', value: '3.2 mins', change: '85% faster', icon: Sparkles },
]

const recentProposals = [
  { id: 'PROP-2026-884', client: 'Apex Retail Solutions', value: '$37,600', status: 'Drafting', date: 'Just now' },
  { id: 'PROP-2026-883', client: 'OmniHealth Tech', value: '$64,200', status: 'Sent', date: '2 days ago' },
  { id: 'PROP-2026-882', client: 'FinVanguard Global', value: '$112,000', status: 'Approved', date: 'Oct 04' },
]
</script>

<template>
  <AppLayout currentRoute="Dashboard">
    <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1700px] mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">Overview of generated proposals, deal pipeline velocity, and client engagement.</p>
        </div>
        <a
          href="/proposals/create"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all shadow-brand-500/20"
        >
          <PlusCircle class="h-4 w-4" />
          <span>New Proposal</span>
        </a>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="stat in stats"
          :key="stat.name"
          class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2"
        >
          <div class="flex items-center justify-between text-slate-500">
            <span class="text-xs font-semibold text-slate-600">{{ stat.name }}</span>
            <div class="h-8 w-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <component :is="stat.icon" class="h-4 w-4" />
            </div>
          </div>
          <div class="text-2xl font-extrabold text-slate-900">{{ stat.value }}</div>
          <p class="text-[11px] font-medium text-emerald-600">{{ stat.change }}</p>
        </div>
      </div>

      <!-- Recent Proposals Table -->
      <div class="rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Proposals</h2>
          <a href="/proposals" class="text-xs font-semibold text-brand-600 hover:text-brand-700">View All</a>
        </div>
        <div class="divide-y divide-slate-100">
          <div
            v-for="p in recentProposals"
            :key="p.id"
            class="py-3 flex items-center justify-between text-xs"
          >
            <div>
              <p class="font-bold text-slate-900">{{ p.client }}</p>
              <p class="text-[11px] text-slate-400 font-mono">{{ p.id }} • {{ p.date }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-slate-900">{{ p.value }}</p>
              <span class="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-50 text-brand-700">
                {{ p.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>


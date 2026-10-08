<script setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import { useProposalStore } from '@/stores/proposalStore'
import { Layers, Plus, Tag, Check } from 'lucide-vue-next'

const store = useProposalStore()

function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}
</script>

<template>
  <AppLayout currentRoute="Catalog">
    <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1700px] mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Services & Product Catalog</h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">Configure standard deliverables, engineering packages, and base unit pricing.</p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all shadow-brand-500/20"
        >
          <Plus class="h-4 w-4" />
          <span>New Catalog Item</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="item in store.catalog"
          :key="item.id"
          class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4 hover:border-brand-300 transition-all flex flex-col justify-between"
        >
          <div class="space-y-2">
            <span class="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-brand-50 text-brand-700">
              {{ item.category }}
            </span>
            <h3 class="font-bold text-slate-900 text-base leading-snug">{{ item.name }}</h3>
            <p class="text-xs text-slate-500 leading-relaxed">{{ item.description }}</p>
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-400 block">Rate</span>
              <span class="text-base font-extrabold text-slate-900">{{ formatCurrency(item.unitPrice) }}</span>
              <span class="text-xs text-slate-400"> / {{ item.unit }}</span>
            </div>

            <a
              href="/proposals/create"
              @click="store.addCatalogItem(item); store.setStep(2)"
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold border border-brand-200 transition-colors"
            >
              <Plus class="h-3.5 w-3.5" />
              <span>Use in Proposal</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>


<script setup>
import { ref } from 'vue'
import { useProposalStore } from '@/stores/proposalStore'
import {
  Layers,
  Plus,
  Trash2,
  Percent,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  Tag,
  Sparkles,
} from 'lucide-vue-next'

const store = useProposalStore()
const isCatalogModalOpen = ref(false)

function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

function calculateLineTotal(item) {
  const base = item.unitPrice * item.quantity
  const discountVal = base * ((item.discount || 0) / 100)
  return Math.max(0, base - discountVal)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h2 class="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Layers class="h-5 w-5 text-brand-600" />
          <span>Step 2: Add Catalog Items & Pricing</span>
        </h2>
        <p class="text-xs text-slate-500 mt-1">
          Attach services, software licenses, or engineering sprints. Adjust quantity and customized discounts.
        </p>
      </div>

      <!-- Quick Add from Master Catalog Trigger -->
      <button
        type="button"
        @click="isCatalogModalOpen = !isCatalogModalOpen"
        class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 transition-colors"
      >
        <Plus class="h-4 w-4" />
        <span>{{ isCatalogModalOpen ? 'Hide Catalog' : 'Browse Catalog' }}</span>
      </button>
    </div>

    <!-- Collapsible / In-line Catalog Picker Drawer -->
    <div
      v-if="isCatalogModalOpen"
      class="rounded-xl border border-brand-200 bg-brand-50/40 p-4 space-y-3 transition-all"
    >
      <div class="flex items-center justify-between pb-2 border-b border-brand-100">
        <span class="text-xs font-bold uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
          <Sparkles class="h-3.5 w-3.5 text-brand-600" />
          Available Solutions Catalog
        </span>
        <span class="text-[11px] text-slate-500">Click (+) to insert into proposal</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
        <div
          v-for="item in store.catalog"
          :key="item.id"
          class="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 hover:border-brand-400 hover:shadow-xs transition-all group"
        >
          <div class="min-w-0 pr-2">
            <p class="text-xs font-bold text-slate-900 group-hover:text-brand-700 transition-colors truncate">
              {{ item.name }}
            </p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs font-semibold text-slate-700">{{ formatCurrency(item.unitPrice) }}</span>
              <span class="text-[10px] text-slate-400 font-medium">/ {{ item.unit }}</span>
            </div>
          </div>
          <button
            type="button"
            @click="store.addCatalogItem(item)"
            class="flex-shrink-0 h-8 w-8 rounded-lg bg-slate-100 group-hover:bg-brand-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-colors"
            title="Add to proposal"
          >
            <Plus class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Selected Items Container -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <ShoppingCart class="h-3.5 w-3.5 text-slate-500" />
          <span>Configured Line Items ({{ store.selectedItems.length }})</span>
        </label>
        <span v-if="store.selectedItems.length" class="text-xs text-slate-500">
          Subtotal: <strong class="text-slate-900">{{ formatCurrency(store.subtotal) }}</strong>
        </span>
      </div>

      <!-- Empty State -->
      <div
        v-if="store.selectedItems.length === 0"
        class="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center bg-white"
      >
        <div class="h-10 w-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <ShoppingCart class="h-5 w-5" />
        </div>
        <p class="text-sm font-semibold text-slate-800">No catalog items selected</p>
        <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Add deliverables and services from the catalog above to populate the scope and pricing table.
        </p>
        <button
          type="button"
          @click="isCatalogModalOpen = true"
          class="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 shadow-xs"
        >
          <Plus class="h-3.5 w-3.5" />
          Browse Solutions Catalog
        </button>
      </div>

      <!-- Active Line Items List -->
      <div v-else class="space-y-3">
        <div
          v-for="(item, idx) in store.selectedItems"
          :key="item.id"
          class="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all space-y-3"
        >
          <!-- Top Row: Name, Category & Delete -->
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <span class="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 mb-1">
                {{ item.category }}
              </span>
              <h4 class="text-sm font-bold text-slate-900 leading-tight">{{ item.name }}</h4>
              <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">{{ item.description }}</p>
            </div>
            
            <button
              type="button"
              @click="store.removeSelectedItem(idx)"
              class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Remove item"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>

          <!-- Bottom Row: Quantity, Unit Price, Discount & Line Total Inputs -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
            <!-- Unit Price -->
            <div>
              <label class="block text-[11px] font-medium text-slate-500 mb-1">Unit Price ($)</label>
              <div class="relative">
                <input
                  type="number"
                  min="0"
                  step="100"
                  :value="item.unitPrice"
                  @input="store.updateItem(idx, 'unitPrice', Number($event.target.value))"
                  class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-hidden"
                />
              </div>
            </div>

            <!-- Quantity -->
            <div>
              <label class="block text-[11px] font-medium text-slate-500 mb-1">Quantity</label>
              <div class="flex items-center">
                <input
                  type="number"
                  min="1"
                  max="100"
                  :value="item.quantity"
                  @input="store.updateItem(idx, 'quantity', Math.max(1, Number($event.target.value)))"
                  class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-hidden"
                />
              </div>
            </div>

            <!-- Discount % -->
            <div>
              <label class="block text-[11px] font-medium text-slate-500 mb-1 flex items-center justify-between">
                <span>Discount</span>
                <span class="text-brand-600 font-semibold">%</span>
              </label>
              <div class="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  :value="item.discount"
                  @input="store.updateItem(idx, 'discount', Math.min(100, Math.max(0, Number($event.target.value))))"
                  class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-hidden"
                />
              </div>
            </div>

            <!-- Line Total -->
            <div class="flex flex-col justify-end text-right">
              <span class="text-[10px] text-slate-400 font-medium">Net Total</span>
              <span class="text-xs font-bold text-slate-900 mt-1">
                {{ formatCurrency(calculateLineTotal(item)) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stepper Navigation -->
    <div class="pt-4 flex items-center justify-between border-t border-slate-100">
      <button
        type="button"
        @click="store.prevStep"
        class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
      >
        <ArrowLeft class="h-4 w-4" />
        <span>Back to Client</span>
      </button>

      <button
        type="button"
        @click="store.nextStep"
        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all shadow-brand-500/20"
      >
        <span>Proceed to AI Context</span>
        <ArrowRight class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>


<script setup>
import { useProposalStore } from '@/stores/proposalStore'
import { DollarSign, Tag, ShieldAlert, Sparkles, TrendingDown } from 'lucide-vue-next'

const store = useProposalStore()

function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)
}

function calculateItemNet(item) {
  const base = item.unitPrice * item.quantity
  const discountVal = base * ((item.discount || 0) / 100)
  return Math.max(0, base - discountVal)
}
</script>

<template>
  <section class="space-y-4">
    <!-- Section Header -->
    <div class="flex items-center justify-between border-b border-slate-200 pb-2">
      <div class="flex items-center gap-2">
        <span class="flex h-6 w-6 items-center justify-center rounded-md bg-brand-50 text-brand-700 font-bold text-xs">
          3
        </span>
        <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Investment & Pricing Schedule
        </h3>
      </div>

      <!-- Cost-saving indicator tag if discounts applied -->
      <div
        v-if="store.totalDiscountAmount > 0"
        class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
      >
        <TrendingDown class="h-3 w-3 text-emerald-600" />
        <span>Saved {{ formatCurrency(store.totalDiscountAmount) }} with bundled terms</span>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="store.selectedItems.length === 0"
      class="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center space-y-2"
    >
      <DollarSign class="h-6 w-6 text-slate-400 mx-auto" />
      <p class="text-xs text-slate-500">No investment items added yet.</p>
      <button
        type="button"
        @click="store.setStep(2)"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 shadow-2xs"
      >
        <span>Add Items in Step 2</span>
      </button>
    </div>

    <!-- Active Pricing Table -->
    <div v-else class="space-y-4">
      <div class="overflow-x-auto rounded-xl border border-slate-200">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <th class="py-2.5 px-3.5">Deliverable / Service</th>
              <th class="py-2.5 px-3 hidden sm:table-cell">Category</th>
              <th class="py-2.5 px-3 text-right">Rate</th>
              <th class="py-2.5 px-3 text-center">Qty</th>
              <th class="py-2.5 px-3 text-center">Disc</th>
              <th class="py-2.5 px-3.5 text-right">Net Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="(item, idx) in store.selectedItems"
              :key="item.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <!-- Name & Description -->
              <td class="py-3 px-3.5 font-medium text-slate-900 max-w-[200px]">
                <div class="font-bold text-slate-900 truncate">{{ item.name }}</div>
                <div class="text-[11px] text-slate-500 truncate mt-0.5">{{ item.description }}</div>
              </td>

              <!-- Category -->
              <td class="py-3 px-3 text-slate-600 hidden sm:table-cell">
                <span class="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                  {{ item.category }}
                </span>
              </td>

              <!-- Unit Price -->
              <td class="py-3 px-3 text-right font-medium text-slate-700">
                {{ formatCurrency(item.unitPrice) }}
              </td>

              <!-- Quantity -->
              <td class="py-3 px-3 text-center font-semibold text-slate-800">
                {{ item.quantity }}
              </td>

              <!-- Discount -->
              <td class="py-3 px-3 text-center">
                <span
                  v-if="item.discount > 0"
                  class="font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]"
                >
                  -{{ item.discount }}%
                </span>
                <span v-else class="text-slate-400 text-[11px]">—</span>
              </td>

              <!-- Net Total -->
              <td class="py-3 px-3.5 text-right font-bold text-slate-900">
                {{ formatCurrency(calculateItemNet(item)) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Financial Calculation Summary Card -->
      <div class="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
        <!-- Terms Note -->
        <div class="text-[11px] text-slate-500 max-w-sm space-y-1">
          <p class="font-semibold text-slate-700">Payment & Invoicing Terms:</p>
          <p class="leading-relaxed">
            {{ store.sections.pricingNotes }}
          </p>
        </div>

        <!-- Ledger Totals -->
        <div class="w-full sm:w-64 space-y-2 bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 text-xs">
          <div class="flex justify-between text-slate-600">
            <span>Gross Subtotal</span>
            <span class="font-semibold text-slate-800">{{ formatCurrency(store.subtotal) }}</span>
          </div>

          <div
            v-if="store.totalDiscountAmount > 0"
            class="flex justify-between text-emerald-700 font-medium"
          >
            <span>Bundled Discount</span>
            <span>-{{ formatCurrency(store.totalDiscountAmount) }}</span>
          </div>

          <div class="flex justify-between text-slate-600">
            <span>Estimated Tax ({{ store.taxRate }}%)</span>
            <span class="font-semibold text-slate-800">{{ formatCurrency(store.taxAmount) }}</span>
          </div>

          <div class="border-t border-slate-200 pt-2 flex justify-between items-baseline">
            <span class="font-bold text-slate-900 text-sm">Grand Total</span>
            <span class="font-extrabold text-brand-700 text-base">
              {{ formatCurrency(store.grandTotal) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


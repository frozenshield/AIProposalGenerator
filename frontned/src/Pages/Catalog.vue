<script setup>
import { ref, computed, watch } from 'vue'
import { useForm, router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import { useProposalStore } from '@/stores/proposalStore'
import { useToast } from '@/composables/useToast'
import { Layers, Plus, Tag, Check, X, Loader2, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  catalog: {
    type: Array,
    default: () => [],
  },
})

const store = useProposalStore()
const toast = useToast()
const isModalOpen = ref(false)

// Sync inertia props with pinia store if provided
if (props.catalog && props.catalog.length > 0) {
  store.catalog = props.catalog
}

watch(
  () => props.catalog,
  (newCatalog) => {
    if (newCatalog && newCatalog.length > 0) {
      store.catalog = newCatalog
    }
  },
  { deep: true }
)

const displayedCatalog = computed(() => {
  return props.catalog && props.catalog.length > 0 ? props.catalog : store.catalog
})

function formatCurrency(val) {
  return store.formatCurrency(val)
}

// Inertia useForm setup for Catalog deliverable creation
const form = useForm({
  name: '',
  description: '',
  category: 'Software Engineering',
  unit_price: 150000,
  unit: 'package',
  default_quantity: 1,
})

const categories = [
  'Software Engineering',
  'AI & Data Science',
  'Cloud Infrastructure',
  'Design & Architecture',
  'Consulting & Audit',
]

const unitTypes = ['package', 'sprint', 'hour', 'month', 'milestone', 'seat']

function openModal() {
  form.clearErrors()
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  form.reset()
}

function submitCatalogItem() {
  form.post('/catalog', {
    preserveScroll: true,
    onSuccess: (page) => {
      isModalOpen.value = false
      toast.success(`Catalog item "${form.name}" registered successfully!`, 'Item Created')
      if (page?.props?.catalog) {
        store.catalog = page.props.catalog
      }
      form.reset()
    },
    onError: (errors) => {
      const firstError = Object.values(errors)[0]
      toast.error(firstError || 'Please correct the highlighted form errors.', 'Validation Error')
    },
  })
}

function deleteItem(id, name) {
  if (confirm(`Are you sure you want to delete deliverable "${name}"?`)) {
    router.delete(`/catalog/${id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.info(`Item "${name}" removed from catalog.`, 'Deleted')
        store.catalog = store.catalog.filter((i) => i.id !== id)
      },
      onError: () => {
        toast.error('Failed to remove catalog item.', 'Error')
      },
    })
  }
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
          @click="openModal"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all shadow-brand-500/20 cursor-pointer"
        >
          <Plus class="h-4 w-4" />
          <span>New Catalog Item</span>
        </button>
      </div>

      <!-- Catalog Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="item in displayedCatalog"
          :key="item.id"
          class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4 hover:border-brand-300 transition-all flex flex-col justify-between relative group"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-brand-50 text-brand-700">
                {{ item.category }}
              </span>
              <button
                v-if="item.id > 6"
                type="button"
                @click="deleteItem(item.id, item.name)"
                class="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-all cursor-pointer"
                title="Delete deliverable"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
            <h3 class="font-bold text-slate-900 text-base leading-snug">{{ item.name }}</h3>
            <p class="text-xs text-slate-500 leading-relaxed">{{ item.description }}</p>
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-400 block">Rate</span>
              <span class="text-base font-extrabold text-slate-900">{{ formatCurrency(item.unit_price ?? item.unitPrice) }}</span>
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

    <!-- Inertia useForm Add Catalog Item Modal -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
        role="dialog"
      >
        <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 my-8 space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 class="text-lg font-bold text-slate-900">Create Catalog Deliverable</h2>
              <p class="text-xs text-slate-500">Standardize pricing and scopes for instant AI proposal insertion</p>
            </div>
            <button
              type="button"
              @click="closeModal"
              class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <form @submit.prevent="submitCatalogItem" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Deliverable / Package Name *</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="e.g. AI Workflow Optimization Sprint"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
              <p v-if="form.errors.name" class="text-[11px] text-rose-500 mt-1">{{ form.errors.name }}</p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
              <select
                v-model="form.category"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              >
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
              <p v-if="form.errors.category" class="text-[11px] text-rose-500 mt-1">{{ form.errors.category }}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Unit Price (₱) *</label>
                <input
                  v-model.number="form.unit_price"
                  type="number"
                  min="0"
                  step="1000"
                  required
                  placeholder="150000"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
                <p v-if="form.errors.unit_price" class="text-[11px] text-rose-500 mt-1">{{ form.errors.unit_price }}</p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Billing Unit *</label>
                <select
                  v-model="form.unit"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                >
                  <option v-for="u in unitTypes" :key="u" :value="u">{{ u }}</option>
                </select>
                <p v-if="form.errors.unit" class="text-[11px] text-rose-500 mt-1">{{ form.errors.unit }}</p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Default Qty *</label>
                <input
                  v-model.number="form.default_quantity"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
                <p v-if="form.errors.default_quantity" class="text-[11px] text-rose-500 mt-1">{{ form.errors.default_quantity }}</p>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Description / Deliverable Scope</label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Comprehensive technical architecture, delivery milestones, and handover documentation..."
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500 resize-none"
              ></textarea>
              <p v-if="form.errors.description" class="text-[11px] text-rose-500 mt-1">{{ form.errors.description }}</p>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="form.processing"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm shadow-brand-500/20 disabled:opacity-75 cursor-pointer"
              >
                <Loader2 v-if="form.processing" class="h-4 w-4 animate-spin" />
                <span>{{ form.processing ? 'Saving Deliverable...' : 'Save Deliverable' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </AppLayout>
</template>

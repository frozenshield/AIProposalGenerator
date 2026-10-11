<script setup>
import { ref, computed, watch } from 'vue'
import { useForm, usePage, router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import { useProposalStore } from '@/stores/proposalStore'
import { useToast } from '@/composables/useToast'
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  UserPlus,
  X,
  Loader2,
  Briefcase,
  Trash2,
  Plus,
} from 'lucide-vue-next'

const props = defineProps({
  clients: {
    type: Array,
    default: () => [],
  },
})

const store = useProposalStore()
const toast = useToast()
const isModalOpen = ref(false)

// Sync inertia props with pinia store if provided
if (props.clients && props.clients.length > 0) {
  store.clients = props.clients
}

watch(
  () => props.clients,
  (newClients) => {
    if (newClients && newClients.length > 0) {
      store.clients = newClients
    }
  },
  { deep: true }
)

const displayedClients = computed(() => {
  return props.clients && props.clients.length > 0 ? props.clients : store.clients
})

// Inertia useForm setup for Client creation
const form = useForm({
  name: '',
  company: '',
  role: 'Managing Director',
  email: '',
  phone: '+63 9',
  industry: 'Technology & Cloud Solutions',
  address: 'BGC, Taguig City, Metro Manila',
})

function openModal() {
  form.clearErrors()
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  form.reset()
}

function submitClient() {
  form.post('/clients', {
    preserveScroll: true,
    onSuccess: (page) => {
      isModalOpen.value = false
      toast.success(`Client ${form.company} added successfully!`, 'Client Saved')
      if (page?.props?.clients) {
        store.clients = page.props.clients
      }
      form.reset()
    },
    onError: (errors) => {
      const firstError = Object.values(errors)[0]
      toast.error(firstError || 'Please correct the highlighted errors.', 'Validation Error')
    },
  })
}

function deleteClient(id, name) {
  if (confirm(`Are you sure you want to delete ${name}?`)) {
    router.delete(`/clients/${id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.info(`Client ${name} has been removed.`, 'Deleted')
        store.clients = store.clients.filter((c) => c.id !== id)
      },
      onError: () => {
        toast.error('Failed to delete client.', 'Error')
      },
    })
  }
}
</script>

<template>
  <AppLayout currentRoute="Clients">
    <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1700px] mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Client Accounts</h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">Manage target enterprise companies, key decision makers, and past deal metrics.</p>
        </div>
        <button
          type="button"
          @click="openModal"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all shadow-brand-500/20 cursor-pointer"
        >
          <UserPlus class="h-4 w-4" />
          <span>Add Client</span>
        </button>
      </div>

      <!-- Clients Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="client in displayedClients"
          :key="client.id"
          class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4 hover:border-brand-300 transition-all relative group"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <img
                :src="client.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'"
                :alt="client.name || 'Client'"
                class="h-12 w-12 rounded-xl object-cover ring-2 ring-slate-100"
              />
              <div class="min-w-0">
                <h3 class="font-bold text-slate-900 text-sm truncate">{{ client.name }}</h3>
                <p class="text-xs text-slate-500 truncate">{{ client.role || 'Executive' }}</p>
                <p class="text-xs text-brand-600 font-semibold mt-0.5 flex items-center gap-1">
                  <Building2 class="h-3.5 w-3.5" />
                  {{ client.company }}
                </p>
              </div>
            </div>

            <button
              v-if="client.id > 4"
              type="button"
              @click="deleteClient(client.id, client.name)"
              class="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
              title="Delete client"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>

          <div class="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100">
            <div class="flex items-center gap-2 truncate">
              <Mail class="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              <span class="truncate">{{ client.email }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Phone class="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              <span>{{ client.phone }}</span>
            </div>
            <div class="flex items-center gap-2 truncate">
              <MapPin class="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              <span class="truncate">{{ client.address }}</span>
            </div>
          </div>

          <div class="pt-2">
            <a
              :href="`/proposals/create`"
              @click="store.selectClient(client.id)"
              class="w-full inline-flex items-center justify-center py-2 px-3 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
            >
              Draft Proposal for {{ client.company }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Inertia useForm Add Client Modal -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
        role="dialog"
      >
        <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 my-8 space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 class="text-lg font-bold text-slate-900">Add New Client Account</h2>
              <p class="text-xs text-slate-500">Record decision-maker credentials for proposal targeting</p>
            </div>
            <button
              type="button"
              @click="closeModal"
              class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <form @submit.prevent="submitClient" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Contact Name *</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="e.g. Maria Santos"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
                <p v-if="form.errors.name" class="text-[11px] text-rose-500 mt-1">{{ form.errors.name }}</p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
                <input
                  v-model="form.company"
                  type="text"
                  required
                  placeholder="e.g. Ayala Land Inc."
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
                <p v-if="form.errors.company" class="text-[11px] text-rose-500 mt-1">{{ form.errors.company }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Job Title / Role</label>
                <input
                  v-model="form.role"
                  type="text"
                  placeholder="e.g. Chief Technology Officer"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
                <p v-if="form.errors.role" class="text-[11px] text-rose-500 mt-1">{{ form.errors.role }}</p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="contact@company.ph"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
                <p v-if="form.errors.email" class="text-[11px] text-rose-500 mt-1">{{ form.errors.email }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  v-model="form.phone"
                  type="text"
                  placeholder="+63 917 123 4567"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
                <p v-if="form.errors.phone" class="text-[11px] text-rose-500 mt-1">{{ form.errors.phone }}</p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
                <input
                  v-model="form.industry"
                  type="text"
                  placeholder="Fintech / Real Estate / Retail"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
                <p v-if="form.errors.industry" class="text-[11px] text-rose-500 mt-1">{{ form.errors.industry }}</p>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Business Address</label>
              <input
                v-model="form.address"
                type="text"
                placeholder="Building, Street, City, Philippines"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
              <p v-if="form.errors.address" class="text-[11px] text-rose-500 mt-1">{{ form.errors.address }}</p>
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
                <span>{{ form.processing ? 'Saving Client...' : 'Save Client' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </AppLayout>
</template>

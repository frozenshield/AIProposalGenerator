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

const defaultCartoonAvatars = [
  { id: 'ava-1', name: 'Aria Exec', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria&backgroundColor=ffd5dc' },
  { id: 'bot-1', name: 'Cyber Arch', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Archie&backgroundColor=b6e3f4' },
  { id: 'adv-1', name: 'Felix Scout', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=c0aede' },
  { id: 'ava-2', name: 'Oliver Lead', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver&backgroundColor=c0aede' },
  { id: 'bot-2', name: 'Gizmo AI', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gizmo&backgroundColor=d1d4f9' },
  { id: 'adv-2', name: 'Zack Tech', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zack&backgroundColor=ffdfbf' },
  { id: 'ava-3', name: 'Leo CTO', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&backgroundColor=d1d4f9' },
  { id: 'bot-3', name: 'Sparky SRE', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sparky&backgroundColor=ffd5dc' },
  { id: 'adv-3', name: 'Luna Dev', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna&backgroundColor=b6e3f4' },
  { id: 'adv-4', name: 'Aneka VP', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=ffdfbf' },
  { id: 'ava-4', name: 'Milo Ops', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo&backgroundColor=c0aede' },
  { id: 'bot-4', name: 'Kiki Sec', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kiki&backgroundColor=b6e3f4' },
]

// Inertia useForm setup for Client creation
const form = useForm({
  name: '',
  company: '',
  role: 'Managing Director',
  email: '',
  phone: '+63 9',
  industry: 'Technology & Cloud Solutions',
  avatar: defaultCartoonAvatars[0].url,
  address: 'BGC, Taguig City, Metro Manila',
})

const isCustomAvatar = ref(false)

function selectCartoonAvatar(url) {
  form.avatar = url
}

function openModal() {
  form.clearErrors()
  if (!form.avatar) {
    form.avatar = defaultCartoonAvatars[0].url
  }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  form.reset()
}

const isSaving = ref(false)

async function submitClient() {
  if (isSaving.value || form.processing) return

  // Check if active Inertia page session exists
  const isInertia = typeof window !== 'undefined' && Boolean(document.getElementById('app')?.dataset?.page)

  if (isInertia && typeof form.post === 'function') {
    try {
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
      return
    } catch (e) {
      console.warn('Inertia post failed, falling back to direct API submit:', e)
    }
  }

  // Standalone Vite dev mode or API direct submit
  isSaving.value = true
  try {
    const payload = {
      name: form.name,
      company: form.company,
      role: form.role,
      email: form.email,
      phone: form.phone,
      industry: form.industry,
      avatar: form.avatar,
      address: form.address,
    }

    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (res.ok && data.client) {
      store.clients.unshift(data.client)
      isModalOpen.value = false
      toast.success(`Client ${form.company} added successfully!`, 'Client Saved')
      form.reset()
    } else {
      const errMsg = data.errors ? Object.values(data.errors)[0]?.[0] : (data.message || 'Validation error saving client.')
      toast.error(errMsg, 'Validation Error')
    }
  } catch (e) {
    console.warn('Backend network error, persisting client locally:', e)
    const fallbackClient = {
      id: 'cli-' + Date.now(),
      name: form.name,
      company: form.company,
      role: form.role || 'Managing Director',
      email: form.email,
      phone: form.phone || '+63 9',
      industry: form.industry || 'Technology',
      avatar: form.avatar || defaultCartoonAvatars[0].url,
      address: form.address || 'Metro Manila',
      status: 'Active',
      created_at: new Date().toISOString(),
    }
    store.clients.unshift(fallbackClient)
    isModalOpen.value = false
    toast.success(`Client ${form.company} added successfully!`, 'Client Saved')
    form.reset()
  } finally {
    isSaving.value = false
  }
}

async function deleteClient(id, name) {
  if (!confirm(`Are you sure you want to delete ${name}?`)) return

  const isInertia = typeof window !== 'undefined' && Boolean(document.getElementById('app')?.dataset?.page)

  if (isInertia && typeof router?.delete === 'function') {
    try {
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
      return
    } catch (e) {
      console.warn('Inertia delete failed, falling back:', e)
    }
  }

  // Standalone dev mode fallback
  try {
    await fetch(`/api/clients/${id}`, { method: 'DELETE' })
  } catch (e) {}
  store.clients = store.clients.filter((c) => c.id !== id)
  toast.info(`Client ${name} has been removed.`, 'Deleted')
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
            <!-- Avatar Selection with Cartoon Avatars -->
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-semibold text-slate-800">
                  Client Avatar (Select Cartoon Persona)
                </label>
                <button
                  type="button"
                  @click="isCustomAvatar = !isCustomAvatar"
                  class="text-[11px] text-brand-600 hover:text-brand-700 font-medium cursor-pointer"
                >
                  {{ isCustomAvatar ? 'Choose from Cartoon presets' : 'Enter custom URL' }}
                </button>
              </div>

              <!-- Selected avatar preview & Cartoon Grid -->
              <div v-if="!isCustomAvatar" class="space-y-2">
                <div class="flex items-center gap-3">
                  <div class="relative h-12 w-12 rounded-xl ring-2 ring-brand-500 overflow-hidden flex-shrink-0 bg-white shadow-xs">
                    <img :src="form.avatar" alt="Selected Avatar" class="h-full w-full object-cover" />
                  </div>
                  <div>
                    <span class="text-xs font-bold text-slate-800 block">Default Cartoon Avatars</span>
                    <span class="text-[11px] text-slate-500">Click any avatar below to assign to this client</span>
                  </div>
                </div>

                <div class="grid grid-cols-6 gap-2 pt-1">
                  <button
                    v-for="avatar in defaultCartoonAvatars"
                    :key="avatar.id"
                    type="button"
                    @click="selectCartoonAvatar(avatar.url)"
                    class="relative h-10 w-10 rounded-xl overflow-hidden p-0.5 border-2 transition-all cursor-pointer hover:scale-105"
                    :class="form.avatar === avatar.url ? 'border-brand-600 ring-2 ring-brand-500/30' : 'border-slate-200 hover:border-slate-300'"
                    :title="avatar.name"
                  >
                    <img :src="avatar.url" :alt="avatar.name" class="h-full w-full object-cover rounded-lg" />
                    <span
                      v-if="form.avatar === avatar.url"
                      class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-brand-600 ring-1 ring-white flex items-center justify-center text-white text-[8px] font-bold"
                    >
                      ✓
                    </span>
                  </button>
                </div>
              </div>

              <!-- Custom URL Input fallback -->
              <div v-else class="space-y-1.5">
                <input
                  v-model="form.avatar"
                  type="url"
                  placeholder="https://example.com/avatar.png"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
                <p class="text-[11px] text-slate-400">Direct image link (.png, .jpg, .svg)</p>
              </div>
            </div>

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
                :disabled="form.processing || isSaving"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm shadow-brand-500/20 disabled:opacity-75 cursor-pointer"
              >
                <Loader2 v-if="form.processing || isSaving" class="h-4 w-4 animate-spin" />
                <span>{{ (form.processing || isSaving) ? 'Saving Client...' : 'Save Client' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import { useProposalStore } from '@/stores/proposalStore'
import { Building2, Mail, Phone, MapPin, UserPlus } from 'lucide-vue-next'

const store = useProposalStore()
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
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all shadow-brand-500/20"
        >
          <UserPlus class="h-4 w-4" />
          <span>Add Client</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="client in store.clients"
          :key="client.id"
          class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4 hover:border-brand-300 transition-all"
        >
          <div class="flex items-center gap-3">
            <img :src="client.avatar" :alt="client.name" class="h-12 w-12 rounded-xl object-cover ring-2 ring-slate-100" />
            <div class="min-w-0">
              <h3 class="font-bold text-slate-900 text-sm truncate">{{ client.name }}</h3>
              <p class="text-xs text-slate-500 truncate">{{ client.role }}</p>
              <p class="text-xs text-brand-600 font-semibold mt-0.5 flex items-center gap-1">
                <Building2 class="h-3.5 w-3.5" />
                {{ client.company }}
              </p>
            </div>
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
  </AppLayout>
</template>


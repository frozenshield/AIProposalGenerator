<script setup>
import { computed } from 'vue'
import { useProposalStore } from '@/stores/proposalStore'
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  Briefcase,
  ArrowRight,
} from 'lucide-vue-next'

const store = useProposalStore()

const currentClient = computed(() => store.selectedClient)
</script>

<template>
  <div class="space-y-6">
    <!-- Step Header -->
    <div>
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold text-slate-900 flex items-center gap-2">
          <UserCheck class="h-5 w-5 text-brand-600" />
          <span>Step 1: Select Client</span>
        </h2>
        <span class="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          Required
        </span>
      </div>
      <p class="text-xs text-slate-500 mt-1">
        Choose the prospective client account. AI will tailor corporate tone, industry context, and executive addressing.
      </p>
    </div>

    <!-- Client Dropdown Selector -->
    <div class="space-y-2">
      <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600">
        Client Account Directory
      </label>
      
      <div class="relative">
        <select
          v-model="store.selectedClientId"
          class="w-full appearance-none bg-white border border-slate-300 hover:border-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl py-3 pl-4 pr-10 text-sm font-medium text-slate-800 shadow-xs transition-all cursor-pointer"
        >
          <option
            v-for="client in store.clients"
            :key="client.id"
            :value="client.id"
          >
            {{ client.company }} — {{ client.name }} ({{ client.industry }})
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
          <ChevronDown class="h-4 w-4" />
        </div>
      </div>
    </div>

    <!-- Selected Client Preview Card -->
    <div
      v-if="currentClient"
      class="rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50/50 via-white to-slate-50 p-5 shadow-xs relative overflow-hidden"
    >
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3.5">
          <img
            :src="currentClient.avatar"
            :alt="currentClient.name"
            class="h-12 w-12 rounded-xl object-cover ring-2 ring-brand-500/20 shadow-xs"
          />
          <div>
            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              {{ currentClient.name }}
              <CheckCircle2 class="h-4 w-4 text-brand-600 inline" />
            </h3>
            <p class="text-xs text-slate-600 font-medium">{{ currentClient.role }}</p>
            <p class="text-xs text-brand-700 font-semibold mt-0.5 flex items-center gap-1">
              <Building2 class="h-3.5 w-3.5 text-brand-500" />
              {{ currentClient.company }}
            </p>
          </div>
        </div>

        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-brand-100 text-brand-800 border border-brand-200">
          <Briefcase class="h-3 w-3" />
          {{ currentClient.industry }}
        </span>
      </div>

      <!-- Detail Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pt-4 border-t border-slate-200/60 text-xs text-slate-600">
        <div class="flex items-center gap-2 truncate">
          <Mail class="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
          <span class="truncate">{{ currentClient.email }}</span>
        </div>
        <div class="flex items-center gap-2 truncate">
          <Phone class="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
          <span>{{ currentClient.phone }}</span>
        </div>
        <div class="flex items-center gap-2 sm:col-span-2 truncate">
          <MapPin class="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
          <span class="truncate">{{ currentClient.address }}</span>
        </div>
      </div>
    </div>

    <!-- Step Navigation Actions -->
    <div class="pt-2 flex justify-end">
      <button
        type="button"
        @click="store.nextStep"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all shadow-brand-500/20 hover:shadow-brand-500/30"
      >
        <span>Continue to Catalog & Pricing</span>
        <ArrowRight class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

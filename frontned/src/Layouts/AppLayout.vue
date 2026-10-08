<script setup>
import { ref } from 'vue'
import { Link } from '@inertiajs/vue3'
import {
  LayoutDashboard,
  Users,
  Layers,
  FileText,
  Sparkles,
  Menu,
  X,
  Bell,
  Search,
  PlusCircle,
  ChevronRight,
  ShieldCheck,
  Zap,
  Settings,
  LogOut,
} from 'lucide-vue-next'

const props = defineProps({
  currentRoute: {
    type: String,
    default: 'Proposals',
  },
})

const isMobileMenuOpen = ref(false)

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'Clients',
    href: '/clients',
    icon: Users,
    badge: '4 Active',
  },
  {
    name: 'Catalog',
    href: '/catalog',
    icon: Layers,
    badge: '6 Items',
  },
  {
    name: 'Proposals',
    href: '/proposals',
    icon: FileText,
    badge: 'New',
    highlightBadge: true,
  },
]
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Desktop Persistent Sidebar -->
    <aside
      class="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 bg-slate-900 border-r border-slate-800 text-slate-300 flex-shrink-0 fixed inset-y-0 z-30"
    >
      <!-- Brand Logo & Header -->
      <div class="h-16 flex items-center justify-between px-6 border-b border-slate-800/80 bg-slate-950/40">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
            <Sparkles class="h-5 w-5" />
          </div>
          <div>
            <span class="font-bold text-white tracking-tight text-base leading-none block">ProposalAI</span>
            <span class="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Enterprise GenUI</span>
          </div>
        </div>
        <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
          v2.4
        </span>
      </div>

      <!-- Quick Action: New Proposal Button -->
      <div class="px-4 pt-5 pb-2">
        <a
          href="/proposals/create"
          class="flex items-center justify-center gap-2 w-full py-2.5 px-3.5 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium text-sm shadow-md shadow-brand-900/40 transition-all duration-200 group"
        >
          <PlusCircle class="h-4 w-4 transition-transform group-hover:rotate-90 duration-300" />
          <span>Create Proposal</span>
        </a>
      </div>

      <!-- Main Navigation Menu -->
      <div class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div class="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Core Workspaces
        </div>
        
        <nav class="space-y-1">
          <a
            v-for="item in navigationItems"
            :key="item.name"
            :href="item.href"
            :class="[
              currentRoute === item.name
                ? 'bg-brand-600/15 text-white border-l-4 border-brand-500 font-semibold pl-3'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white pl-4 font-medium',
              'flex items-center justify-between py-2.5 pr-3 rounded-r-lg text-sm transition-colors duration-150 group'
            ]"
          >
            <div class="flex items-center gap-3">
              <component
                :is="item.icon"
                :class="[
                  currentRoute === item.name
                    ? 'text-brand-400'
                    : 'text-slate-400 group-hover:text-slate-200',
                  'h-4 w-4 transition-colors'
                ]"
              />
              <span>{{ item.name }}</span>
            </div>

            <span
              v-if="item.badge"
              :class="[
                item.highlightBadge
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400',
                'text-[10px] px-2 py-0.5 rounded-full font-semibold'
              ]"
            >
              {{ item.badge }}
            </span>
          </a>
        </nav>

        <!-- Secondary Section: AI Insights -->
        <div class="pt-6">
          <div class="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>AI Engine Status</span>
            <span class="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          
          <div class="mx-1 p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 text-xs space-y-2">
            <div class="flex items-center justify-between text-slate-300">
              <span class="flex items-center gap-1.5 font-medium">
                <Zap class="h-3.5 w-3.5 text-amber-400" />
                Prompt Quota
              </span>
              <span class="text-[11px] text-brand-400 font-semibold">92% Available</span>
            </div>
            <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-brand-500 to-emerald-400 h-1.5 rounded-full w-[92%]"></div>
            </div>
            <p class="text-[11px] text-slate-400">
              Gemini 1.5 Pro & Claude 3.5 synthesis ready for fast real-time drafting.
            </p>
          </div>
        </div>
      </div>

      <!-- User Profile & Org Footer -->
      <div class="p-4 border-t border-slate-800/80 bg-slate-950/50 flex items-center justify-between">
        <div class="flex items-center gap-3 min-w-0">
          <div class="h-9 w-9 rounded-full ring-2 ring-brand-500/40 overflow-hidden flex-shrink-0 bg-slate-800">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="User Avatar"
              class="h-full w-full object-cover"
            />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-white truncate leading-snug">Elena Vance</p>
            <p class="text-xs text-slate-400 truncate">Senior Deal Lead</p>
          </div>
        </div>
        <div class="flex items-center gap-1 text-slate-400">
          <button class="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Settings">
            <Settings class="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile Drawer Sidebar (Slide-over) -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-50 lg:hidden flex"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        @click="isMobileMenuOpen = false"
      ></div>

      <div class="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 border-r border-slate-800 text-slate-300">
        <div class="absolute top-0 right-0 -mr-12 pt-4">
          <button
            type="button"
            class="h-10 w-10 rounded-full flex items-center justify-center text-white focus:outline-hidden"
            @click="isMobileMenuOpen = false"
          >
            <X class="h-6 w-6" />
          </button>
        </div>

        <div class="h-16 flex items-center px-6 border-b border-slate-800">
          <div class="flex items-center gap-2.5">
            <div class="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Sparkles class="h-4 w-4" />
            </div>
            <span class="font-bold text-white text-base">ProposalAI</span>
          </div>
        </div>

        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <a
            v-for="item in navigationItems"
            :key="item.name"
            :href="item.href"
            :class="[
              currentRoute === item.name
                ? 'bg-brand-600/20 text-white border-l-4 border-brand-500 font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white font-medium',
              'flex items-center justify-between px-3 py-2.5 rounded-r-lg text-sm'
            ]"
            @click="isMobileMenuOpen = false"
          >
            <div class="flex items-center gap-3">
              <component :is="item.icon" class="h-4 w-4 text-slate-400" />
              <span>{{ item.name }}</span>
            </div>
            <span
              v-if="item.badge"
              class="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-300"
            >
              {{ item.badge }}
            </span>
          </a>
        </nav>
      </div>
    </div>

    <!-- Main Content Area with Desktop Offset -->
    <div class="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72">
      <!-- Top Persistent Navigation Bar -->
      <header class="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <!-- Left: Mobile Menu Trigger + Breadcrumb -->
        <div class="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            class="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            @click="isMobileMenuOpen = true"
          >
            <Menu class="h-5 w-5" />
          </button>

          <nav class="flex items-center text-sm font-medium text-slate-500">
            <a href="/proposals" class="hover:text-slate-900 transition-colors">Proposals</a>
            <ChevronRight class="h-4 w-4 mx-1.5 text-slate-400" />
            <span class="text-slate-900 font-semibold">Create Proposal</span>
          </nav>
        </div>

        <!-- Right: Status Pill & Action Tools -->
        <div class="flex items-center gap-3 sm:gap-4">
          <!-- Live AI Engine Indicator -->
          <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-700">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span class="text-slate-500">Engine:</span>
            <span class="font-semibold text-slate-800 flex items-center gap-1">
              <Sparkles class="h-3 w-3 text-brand-600" />
              Gemini 1.5 Pro
            </span>
          </div>

          <!-- Notification Bell -->
          <button class="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <Bell class="h-4 w-4" />
            <span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-white"></span>
          </button>

          <div class="h-5 w-px bg-slate-200"></div>

          <!-- Quick Help / Security Badge -->
          <div class="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <ShieldCheck class="h-4 w-4 text-emerald-600" />
            <span>SOC2 Certified</span>
          </div>
        </div>
      </header>

      <!-- Page Content View -->
      <main class="flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>


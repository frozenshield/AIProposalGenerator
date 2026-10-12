<script setup>
import { ref } from 'vue'
import { useForm } from '@inertiajs/vue3'
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-vue-next'

const form = useForm({
  email: 'admin@aiproposals.io',
  password: 'password123',
  remember: true,
})

const showPassword = ref(false)
const localError = ref('')
const isSubmitting = ref(false)

const fillCredentials = () => {
  form.email = 'admin@aiproposals.io'
  form.password = 'password123'
}

const submit = async () => {
  localError.value = ''
  isSubmitting.value = true

  // Try standard Inertia POST
  if (typeof form.post === 'function') {
    form.post('/admin/login', {
      onError: (err) => {
        isSubmitting.value = false
        localError.value = err?.email || err?.message || 'Invalid administrative credentials.'
      },
      onFinish: () => {
        isSubmitting.value = false
      },
    })
    return
  }

  // Standalone Vite Dev Mode Fallback
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        remember: form.remember,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      localError.value = data?.message || data?.errors?.email?.[0] || 'Authentication failed.'
      isSubmitting.value = false
      return
    }

    window.location.href = '/admin/dashboard'
  } catch (err) {
    localError.value = 'Failed to connect to authentication server.'
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
    <!-- Ambient glowing backdrop -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none"></div>
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
      <!-- Admin Console Brand Lockup -->
      <div class="flex flex-col items-center text-center">
        <div class="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/20 ring-4 ring-emerald-500/10 mb-4 flex items-center justify-center">
          <div class="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <ShieldCheck class="h-7 w-7 text-emerald-400" />
          </div>
        </div>
        
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Restricted Platform Console
        </div>

        <h1 class="text-2xl font-bold tracking-tight text-white">
          ProposalAI Admin
        </h1>
        <p class="mt-1.5 text-xs text-slate-400 max-w-sm">
          Platform observability, Google AI Studio live model limits, and multi-tenant quota controls.
        </p>
      </div>

      <!-- Login Card -->
      <div class="mt-8 bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80">
        <!-- Error Banner -->
        <div
          v-if="localError || form.errors.email || form.errors.password"
          class="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5"
        >
          <AlertCircle class="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{{ localError || form.errors.email || form.errors.password }}</span>
        </div>

        <form @submit.prevent="submit" class="space-y-4">
          <!-- Email Input -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">
              Administrator Email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail class="h-4 w-4" />
              </div>
              <input
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                placeholder="admin@aiproposals.io"
                class="block w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-semibold text-slate-300">
                Master Security Key
              </label>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock class="h-4 w-4" />
              </div>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="••••••••••••"
                class="block w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                <EyeOff v-if="showPassword" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Quick Test Credentials Pill -->
          <div class="pt-1">
            <button
              type="button"
              @click="fillCredentials"
              class="w-full text-left py-2 px-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-400 flex items-center justify-between transition-colors group cursor-pointer"
            >
              <span class="flex items-center gap-1.5">
                <Sparkles class="h-3 w-3 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Fill Default Platform Admin (admin@aiproposals.io)</span>
              </span>
              <span class="text-emerald-400 font-mono text-[10px]">Autofill</span>
            </button>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="isSubmitting || form.processing"
              class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting || form.processing" class="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              <span v-else class="flex items-center gap-2">
                <span>Access Admin Console</span>
                <ArrowRight class="h-4 w-4" />
              </span>
            </button>
          </div>
        </form>

        <!-- Back to Workspace -->
        <div class="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <a
            href="/dashboard"
            class="text-xs text-slate-400 hover:text-white transition-colors"
          >
            &larr; Return to Client Workspace
          </a>
        </div>
      </div>
    </div>
  </div>
</template>


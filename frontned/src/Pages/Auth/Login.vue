<script setup>
import { useForm } from '@inertiajs/vue3'
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-vue-next'

const form = useForm({
  email: 'admin@aiproposals.io',
  password: 'password123',
  remember: false,
})

function submit() {
  form.post('/login', {
    onFinish: () => form.reset('password'),
  })
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
      <div class="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/20">
        <Sparkles class="h-6 w-6" />
      </div>
      <h2 class="text-3xl font-extrabold text-white tracking-tight">ProposalAI</h2>
      <p class="text-sm text-slate-400">Sign in to your enterprise proposal workspace</p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl py-8 px-6 sm:px-10 shadow-2xl space-y-6">
        <form @submit.prevent="submit" class="space-y-5">
          <!-- Email Field -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-slate-300">Corporate Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail class="h-4 w-4" />
              </div>
              <input
                v-model="form.email"
                type="email"
                required
                autocomplete="username"
                class="block w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="name@company.com"
              />
            </div>
            <p v-if="form.errors.email" class="text-xs text-rose-400 font-medium">{{ form.errors.email }}</p>
          </div>

          <!-- Password Field -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-semibold text-slate-300">Password</label>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock class="h-4 w-4" />
              </div>
              <input
                v-model="form.password"
                type="password"
                required
                autocomplete="current-password"
                class="block w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="••••••••••••"
              />
            </div>
            <p v-if="form.errors.password" class="text-xs text-rose-400 font-medium">{{ form.errors.password }}</p>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between text-xs">
            <label class="flex items-center gap-2 cursor-pointer text-slate-400">
              <input
                v-model="form.remember"
                type="checkbox"
                class="rounded border-slate-800 bg-slate-950 text-brand-600 focus:ring-brand-500"
              />
              <span>Remember this device</span>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="form.processing"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/25 cursor-pointer"
          >
            <span>Sign In to Workspace</span>
            <ArrowRight class="h-4 w-4" />
          </button>
        </form>

        <div class="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
          <span>Don't have an enterprise account? </span>
          <a href="/register" class="text-brand-400 hover:text-brand-300 font-semibold underline">Register here</a>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck class="h-4 w-4 text-emerald-500" />
        <span>Enterprise Isolated Multi-Tenant Cloud</span>
      </div>
    </div>
  </div>
</template>


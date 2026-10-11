<script setup>
import { useForm } from '@inertiajs/vue3'
import { Sparkles, User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-vue-next'

const form = useForm({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

function submit() {
  form.post('/register', {
    onFinish: () => form.reset('password', 'password_confirmation'),
  })
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
      <div class="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/20">
        <Sparkles class="h-6 w-6" />
      </div>
      <h2 class="text-3xl font-extrabold text-white tracking-tight">Create Tenant Workspace</h2>
      <p class="text-sm text-slate-400">Deploy your dedicated AI proposal generator environment</p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl py-8 px-6 sm:px-10 shadow-2xl space-y-6">
        <form @submit.prevent="submit" class="space-y-4">
          <!-- Full Name -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-slate-300">Full Name</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User class="h-4 w-4" />
              </div>
              <input
                v-model="form.name"
                type="text"
                required
                autocomplete="name"
                class="block w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="Sarah Jenkins"
              />
            </div>
            <p v-if="form.errors.name" class="text-xs text-rose-400 font-medium">{{ form.errors.name }}</p>
          </div>

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
                placeholder="s.jenkins@company.com"
              />
            </div>
            <p v-if="form.errors.email" class="text-xs text-rose-400 font-medium">{{ form.errors.email }}</p>
          </div>

          <!-- Password Field -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-slate-300">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock class="h-4 w-4" />
              </div>
              <input
                v-model="form.password"
                type="password"
                required
                autocomplete="new-password"
                class="block w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="••••••••••••"
              />
            </div>
            <p v-if="form.errors.password" class="text-xs text-rose-400 font-medium">{{ form.errors.password }}</p>
          </div>

          <!-- Confirm Password Field -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-slate-300">Confirm Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock class="h-4 w-4" />
              </div>
              <input
                v-model="form.password_confirmation"
                type="password"
                required
                autocomplete="new-password"
                class="block w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="form.processing"
            class="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/25 cursor-pointer"
          >
            <span>Create Account & Launch Workspace</span>
            <ArrowRight class="h-4 w-4" />
          </button>
        </form>

        <div class="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
          <span>Already have an account? </span>
          <a href="/login" class="text-brand-400 hover:text-brand-300 font-semibold underline">Sign in</a>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck class="h-4 w-4 text-emerald-500" />
        <span>Free tier includes 3 full-scope AI proposals</span>
      </div>
    </div>
  </div>
</template>


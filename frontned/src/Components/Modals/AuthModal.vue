<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useAuthGuard } from '@/composables/useAuthGuard'
import { useToast } from '@/composables/useToast'
import {
  X,
  Lock,
  Mail,
  User,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-vue-next'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  initialMode: {
    type: String,
    default: 'login', // 'login' or 'register'
  },
})

const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()
const authGuard = useAuthGuard()
const toast = useToast()

const activeTab = ref('login')
const isSubmitting = ref(false)
const errorMessage = ref('')

// Login Form State
const loginForm = ref({
  email: '',
  password: '',
  remember: true,
})

// Register Form State
const registerForm = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      activeTab.value = props.initialMode || 'login'
      errorMessage.value = ''
    }
  }
)

watch(
  () => props.initialMode,
  (mode) => {
    if (mode) activeTab.value = mode
  }
)

async function handleLogin() {
  if (!loginForm.value.email || !loginForm.value.password) {
    errorMessage.value = 'Please provide both your corporate email and password.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const result = await authStore.login({
      email: loginForm.value.email,
      password: loginForm.value.password,
      remember: loginForm.value.remember,
    })

    if (result.success) {
      emit('success', authStore.user)
      emit('close')
    } else {
      errorMessage.value = result.message || 'Invalid email or password.'
    }
  } catch (err) {
    errorMessage.value = 'An unexpected error occurred. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

async function handleRegister() {
  if (!registerForm.value.name || !registerForm.value.email || !registerForm.value.password) {
    errorMessage.value = 'Please fill out all required fields.'
    return
  }

  if (registerForm.value.password !== registerForm.value.password_confirmation) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  if (registerForm.value.password.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters in length.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const result = await authStore.register({
      name: registerForm.value.name,
      email: registerForm.value.email,
      password: registerForm.value.password,
      password_confirmation: registerForm.value.password_confirmation,
    })

    if (result.success) {
      emit('success', authStore.user)
      emit('close')
    } else {
      errorMessage.value = result.message || 'Registration failed. Please check your inputs.'
    }
  } catch (err) {
    errorMessage.value = 'An unexpected error occurred during account registration.'
  } finally {
    isSubmitting.value = false
  }
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      @click.self="handleClose"
    >
      <div
        class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 transition-all scale-100"
      >
        <!-- Top Gradient Strip -->
        <div class="h-1.5 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600"></div>

        <!-- Close Button -->
        <button
          type="button"
          @click="handleClose"
          class="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <X class="h-4 w-4" />
        </button>

        <div class="p-6 sm:p-8 space-y-6">
          <!-- Header Branding -->
          <div class="text-center space-y-2">
            <div class="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-brand-50 text-brand-600 mb-1 border border-brand-100 shadow-xs">
              <Sparkles class="h-6 w-6" />
            </div>
            <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">
              {{ activeTab === 'login' ? 'Authentication Required' : 'Create Free Account' }}
            </h2>
            <p class="text-xs text-slate-500 max-w-xs mx-auto">
              {{ activeTab === 'login'
                ? 'Sign in to access your tenant workspace, save clients, and synthesize AI proposals.'
                : 'Get started with 3 free AI proposals, client management, and commercial pitch generation.'
              }}
            </p>
          </div>

          <!-- Mode Tab Switcher -->
          <div class="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              @click="activeTab = 'login'; errorMessage = ''"
              :class="[
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-semibold',
                'flex-1 py-2 text-xs rounded-lg transition-all text-center cursor-pointer'
              ]"
            >
              Sign In
            </button>
            <button
              type="button"
              @click="activeTab = 'register'; errorMessage = ''"
              :class="[
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-semibold',
                'flex-1 py-2 text-xs rounded-lg transition-all text-center cursor-pointer'
              ]"
            >
              Create Account
            </button>
          </div>

          <!-- Error Alert Banner -->
          <div
            v-if="errorMessage"
            class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5"
          >
            <AlertCircle class="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-600" />
            <div class="flex-1 font-medium">{{ errorMessage }}</div>
          </div>

          <!-- LOGIN FORM -->
          <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-700">Corporate Email</label>
              <div class="relative">
                <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  v-model="loginForm.email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  class="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-slate-700">Password</label>
              </div>
              <div class="relative">
                <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  v-model="loginForm.password"
                  type="password"
                  required
                  placeholder="••••••••"
                  class="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div class="flex items-center justify-between text-xs pt-1">
              <label class="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  v-model="loginForm.remember"
                  type="checkbox"
                  class="rounded text-brand-600 focus:ring-brand-500 h-3.5 w-3.5"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Loader2 v-if="isSubmitting" class="h-4 w-4 animate-spin" />
              <span v-else>Authenticate & Continue</span>
              <ArrowRight v-if="!isSubmitting" class="h-4 w-4" />
            </button>
          </form>

          <!-- REGISTER FORM -->
          <form v-else @submit.prevent="handleRegister" class="space-y-3.5">
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700">Full Name</label>
              <div class="relative">
                <User class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  v-model="registerForm.name"
                  type="text"
                  required
                  placeholder="Russel Gementiza"
                  class="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700">Work Email</label>
              <div class="relative">
                <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  v-model="registerForm.email"
                  type="email"
                  required
                  placeholder="russel@enterprise.io"
                  class="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2.5">
              <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700">Password</label>
                <div class="relative">
                  <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    v-model="registerForm.password"
                    type="password"
                    required
                    placeholder="••••••••"
                    class="w-full pl-8 pr-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700">Confirm</label>
                <div class="relative">
                  <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    v-model="registerForm.password_confirmation"
                    type="password"
                    required
                    placeholder="••••••••"
                    class="w-full pl-8 pr-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <div class="text-[11px] text-slate-500 pt-1">
              By creating an account, you agree to our Terms of Service & Privacy Policy.
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Loader2 v-if="isSubmitting" class="h-4 w-4 animate-spin" />
              <span v-else>Register & Launch Workspace</span>
              <ArrowRight v-if="!isSubmitting" class="h-4 w-4" />
            </button>
          </form>

          <!-- Security Pill -->
          <div class="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck class="h-3.5 w-3.5 text-emerald-500" />
            <span>256-bit SSL Encryption • Multi-Tenant Isolation</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>


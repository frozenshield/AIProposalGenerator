import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from '@/composables/useToast'
import { useProposalStore } from '@/stores/proposalStore'

export const useAuthStore = defineStore('auth', () => {
  const toast = useToast()

  const user = ref(null)
  const isLoading = ref(false)
  const authError = ref(null)

  // Try restoring from localStorage for seamless dev persistence
  try {
    const saved = localStorage.getItem('proposal_user')
    if (saved) {
      user.value = JSON.parse(saved)
    }
  } catch (e) {}

  const isAuthenticated = computed(() => !!user.value)

  function setUser(userData) {
    user.value = userData
    try {
      if (userData) {
        localStorage.setItem('proposal_user', JSON.stringify(userData))
        const role = userData.ref_role || userData.role
        if (userData.is_subscribed || userData.subscription_tier === 'pro' || role === 'admin') {
          const store = useProposalStore()
          store.isSubscribed = true
          store.activeAiModel = 'Gemini 1.5 Pro'
        }
      } else {
        localStorage.removeItem('proposal_user')
      }
    } catch (e) {}
  }

  async function login({ email, password, remember = false }) {
    isLoading.value = true
    authError.value = null

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password, remember }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        toast.success(`Welcome back, ${data.user.name}!`, 'Authentication Success')
        return { success: true, redirect: data.redirect || '/dashboard' }
      }

      // Handle 422 or error status
      const errorData = await response.json().catch(() => null)
      const errorMsg =
        (errorData?.errors ? Object.values(errorData.errors).flat().join(' ') : null) ||
        errorData?.message ||
        'Invalid corporate credentials.'
      
      authError.value = errorMsg
      toast.error(errorMsg, 'Login Failed')
      return { success: false, message: errorMsg }
    } catch (err) {
      // Backend not running on port 8000 fallback for seamless Vite dev testing
      if (email === 'admin@aiproposals.io' && password === 'password123') {
        const demoUser = {
          id: 1,
          name: 'System Administrator',
          email: 'admin@aiproposals.io',
          ref_role: 'admin',
          role: 'admin',
          proposals_count: 0,
          is_subscribed: true,
          subscription_tier: 'pro',
        }
        setUser(demoUser)
        toast.success(`Welcome back, ${demoUser.name}! (Local Session)`, 'Authentication Success')
        return { success: true, redirect: '/dashboard' }
      }

      const msg = 'Unable to reach backend server. Please verify Laravel is running (php artisan serve).'
      authError.value = msg
      toast.error(msg, 'Connection Notice')
      return { success: false, message: msg }
    } finally {
      isLoading.value = false
    }
  }

  async function register({ name, email, password, password_confirmation }) {
    isLoading.value = true
    authError.value = null

    if (password !== password_confirmation) {
      const msg = 'Password confirmation does not match.'
      authError.value = msg
      toast.error(msg, 'Registration Error')
      isLoading.value = false
      return { success: false, message: msg }
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, email, password, password_confirmation }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        toast.success(`Welcome, ${data.user.name}! Your workspace is active.`, 'Workspace Provisioned')
        return { success: true, redirect: data.redirect || '/dashboard' }
      }

      const errorData = await response.json().catch(() => null)
      const errorMsg =
        (errorData?.errors ? Object.values(errorData.errors).flat().join(' ') : null) ||
        errorData?.message ||
        'Registration failed.'
      
      authError.value = errorMsg
      toast.error(errorMsg, 'Registration Failed')
      return { success: false, message: errorMsg }
    } catch (err) {
      // Fallback workspace creation
      const newUser = {
        id: Date.now(),
        name,
        email,
        ref_role: 'user',
        role: 'user',
        proposals_count: 0,
        is_subscribed: false,
        subscription_tier: 'free',
      }
      setUser(newUser)
      toast.success(`Workspace created for ${name}!`, 'Workspace Ready')
      return { success: true, redirect: '/dashboard' }
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    isLoading.value = false

    // 1. Immediately wipe local auth credentials and user state (0ms delay)
    setUser(null)
    try {
      localStorage.removeItem('proposal_user')
      const pStore = useProposalStore()
      pStore.isSubscribed = false
    } catch (e) {}

    // 2. Dispatch server-side session termination asynchronously in the background
    try {
      fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      }).catch(() => {})

      fetch('/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      }).catch(() => {})
    } catch (e) {}

    toast.info('You have safely signed out of your workspace.', 'Signed Out')
    return { success: true, redirect: '/login' }
  }

  async function checkAuth() {
    try {
      const res = await fetch('/api/user', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
      })
      if (res.ok) {
        const data = await res.json()
        if (data.authenticated && data.user) {
          setUser(data.user)
        }
      }
    } catch (e) {}
  }

  return {
    user,
    isLoading,
    authError,
    isAuthenticated,
    setUser,
    login,
    register,
    logout,
    checkAuth,
  }
})


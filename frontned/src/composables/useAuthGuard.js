import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'

// Singleton reactive state shared across all components
const isAuthModalOpen = ref(false)
const authModalMode = ref('login') // 'login' or 'register'
const postAuthAction = ref(null)

export function useAuthGuard() {
  const authStore = useAuthStore()
  const toast = useToast()

  function requireAuth(actionFn = null, options = {}) {
    // Check if user is authenticated in store or in session
    if (authStore.isAuthenticated && authStore.user) {
      if (typeof actionFn === 'function') {
        actionFn()
      }
      return true
    }

    // User is guest / unauthenticated: trigger login/register modal
    postAuthAction.value = typeof actionFn === 'function' ? actionFn : null
    authModalMode.value = options.mode || 'login'
    isAuthModalOpen.value = true

    if (options.message) {
      toast.info(options.message, 'Sign In Required')
    }

    return false
  }

  function openAuthModal(mode = 'login', callback = null) {
    authModalMode.value = mode
    postAuthAction.value = callback
    isAuthModalOpen.value = true
  }

  function closeAuthModal() {
    isAuthModalOpen.value = false
    postAuthAction.value = null
  }

  function onAuthSuccess(user) {
    isAuthModalOpen.value = false
    if (typeof postAuthAction.value === 'function') {
      const cb = postAuthAction.value
      postAuthAction.value = null
      // Execute post-auth action after tick
      setTimeout(() => {
        cb()
      }, 100)
    }
  }

  return {
    isAuthModalOpen,
    authModalMode,
    requireAuth,
    openAuthModal,
    closeAuthModal,
    onAuthSuccess,
  }
}


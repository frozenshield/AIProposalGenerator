import { ref } from 'vue'

const toasts = ref([])
let toastIdCounter = 0

export function useToast() {
  function addToast({ title = '', message = '', type = 'info', duration = 4500 }) {
    const id = ++toastIdCounter
    const toast = {
      id,
      title,
      message,
      type, // 'success', 'error', 'warning', 'info'
      createdAt: Date.now(),
    }

    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  function removeToast(id) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function clearAll() {
    toasts.value = []
  }

  const success = (message, title = 'Success') => addToast({ title, message, type: 'success' })
  const error = (message, title = 'Error') => addToast({ title, message, type: 'error' })
  const warning = (message, title = 'Warning') => addToast({ title, message, type: 'warning' })
  const info = (message, title = 'Notice') => addToast({ title, message, type: 'info' })

  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info,
  }
}


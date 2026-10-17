import { createApp, h, ref, shallowRef, markRaw } from 'vue'
import { createInertiaApp, router } from '@inertiajs/vue3'
import { createPinia } from 'pinia'
import '@/assets/main.css'
import { useProposalStore } from '@/stores/proposalStore'

// Dynamic resolver for Inertia Pages
const pages = import.meta.glob('./Pages/**/*.vue')

const appEl = document.getElementById('app')

// Global Inertia event listener to catch 'limit_reached' 403 responses
if (typeof window !== 'undefined') {
  router.on('invalid', (event) => {
    const response = event.detail?.response
    if (response && response.status === 403) {
      try {
        const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data
        if (data && data.error === 'limit_reached') {
          const store = useProposalStore()
          store.triggerLimitReached(data.message)
        }
      } catch (e) {
        // Fallback for non-JSON 403
      }
    }
  })

  router.on('exception', (event) => {
    const response = event.detail?.response
    if (response && response.status === 403) {
      try {
        const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data
        if (data && data.error === 'limit_reached') {
          const store = useProposalStore()
          store.triggerLimitReached(data.message)
        }
      } catch (e) {}
    }
  })
}

if (appEl && appEl.dataset.page) {
  // Standard Inertia.js Initialization
  createInertiaApp({
    resolve: (name) => {
      const page = pages[`./Pages/${name}.vue`]
      if (!page) {
        throw new Error(`Page ${name} not found in ./Pages/`)
      }
      return page()
    },
    setup({ el, App, props, plugin }) {
      const pinia = createPinia()
      createApp({ render: () => h(App, props) })
        .use(plugin)
        .use(pinia)
        .mount(el)
    },
  })
} else if (appEl) {
  // Standalone Vite Development Mode SPA Router
  // Enables full client-side navigation between all pages without requiring a backend
  const pinia = createPinia()

  const routeMap = {
    '/': () => import('./Pages/Landing.vue'),
    '/landing': () => import('./Pages/Landing.vue'),
    '/proposals': () => import('./Pages/Proposals/Index.vue'),
    '/proposals/create': () => import('./Pages/Proposals/Create.vue'),
    '/dashboard': () => import('./Pages/Dashboard.vue'),
    '/clients': () => import('./Pages/Clients.vue'),
    '/catalog': () => import('./Pages/Catalog.vue'),
    '/login': () => import('./Pages/Auth/Login.vue'),
    '/register': () => import('./Pages/Auth/Register.vue'),
    '/admin': () => import('./Pages/Admin/Login.vue'),
    '/admin/login': () => import('./Pages/Admin/Login.vue'),
    '/admin/dashboard': () => import('./Pages/Admin/Dashboard.vue'),
  }

  const currentComponent = shallowRef(null)

  function getStoredUser() {
    try {
      const saved = localStorage.getItem('proposal_user')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return null
  }

  function isAdminUser(user) {
    if (!user) return false
    const role = user.ref_role || user.role
    return role === 'admin'
  }

  async function loadRoute(path) {
    let cleanPath = path.replace(/\/$/, '') || '/'

    // Admin Route Separation & Role-Based Access Control
    if (cleanPath.startsWith('/admin')) {
      const user = getStoredUser()
      const isAdmin = isAdminUser(user)

      if (cleanPath === '/admin' || cleanPath === '/admin/login') {
        if (isAdmin) {
          cleanPath = '/admin/dashboard'
          if (window.location.pathname !== '/admin/dashboard') {
            history.replaceState(null, '', '/admin/dashboard')
          }
        } else {
          cleanPath = '/admin/login'
          if (window.location.pathname !== '/admin' && window.location.pathname !== '/admin/login') {
            history.replaceState(null, '', '/admin')
          }
        }
      } else if (cleanPath === '/admin/dashboard') {
        if (!isAdmin) {
          cleanPath = '/admin/login'
          if (window.location.pathname !== '/admin') {
            history.replaceState(null, '', '/admin')
          }
        }
      }
    }

    const loader = routeMap[cleanPath] || routeMap['/proposals']
    try {
      const module = await loader()
      currentComponent.value = markRaw(module.default)
    } catch (err) {
      console.error('Error loading page for route:', path, err)
      const fallback = await routeMap['/proposals']()
      currentComponent.value = markRaw(fallback.default)
    }
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    loadRoute(window.location.pathname)
  })

  // Global click interceptor for instant client-side transitions
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a')
    if (anchor && anchor.getAttribute('href')?.startsWith('/') && !anchor.hasAttribute('target')) {
      const href = anchor.getAttribute('href')
      const cleanHref = href.replace(/\/$/, '') || '/'
      if (routeMap[cleanHref] || routeMap[href]) {
        e.preventDefault()
        if (window.location.pathname !== href) {
          history.pushState(null, '', href)
          loadRoute(href)
        }
      }
    }
  })

  // Initial load based on current browser path
  loadRoute(window.location.pathname).then(() => {
    const app = createApp({
      render() {
        return currentComponent.value ? h(currentComponent.value) : null
      },
    })
    app.use(pinia)
    app.mount(appEl)
  })
}

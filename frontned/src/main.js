import { createApp, h, ref, shallowRef, markRaw } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { createPinia } from 'pinia'
import '@/assets/main.css'

// Dynamic resolver for Inertia Pages
const pages = import.meta.glob('./Pages/**/*.vue')

const appEl = document.getElementById('app')

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
    '/': () => import('./Pages/Proposals/Index.vue'),
    '/proposals': () => import('./Pages/Proposals/Index.vue'),
    '/proposals/create': () => import('./Pages/Proposals/Create.vue'),
    '/dashboard': () => import('./Pages/Dashboard.vue'),
    '/clients': () => import('./Pages/Clients.vue'),
    '/catalog': () => import('./Pages/Catalog.vue'),
  }

  const currentComponent = shallowRef(null)

  async function loadRoute(path) {
    const cleanPath = path.replace(/\/$/, '') || '/'
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

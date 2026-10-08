import { createApp, h } from 'vue'
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
  // Standalone Vite Development Mode Fallback
  // Allows testing and viewing the UI directly without requiring a backend server
  import('./Pages/Proposals/Create.vue').then((module) => {
    const pinia = createPinia()
    const app = createApp(module.default)
    app.use(pinia)
    app.mount(appEl)
  })
}


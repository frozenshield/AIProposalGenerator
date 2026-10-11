<script setup>
import { useToast } from '@/composables/useToast'
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-vue-next'

const { toasts, removeToast } = useToast()

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colorMap = {
  success: {
    bg: 'bg-emerald-950/95 border-emerald-500/40 text-emerald-100',
    icon: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  error: {
    bg: 'bg-rose-950/95 border-rose-500/40 text-rose-100',
    icon: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  warning: {
    bg: 'bg-amber-950/95 border-amber-500/40 text-amber-100',
    icon: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  info: {
    bg: 'bg-slate-900/95 border-slate-700 text-slate-100',
    icon: 'text-brand-400',
    border: 'border-slate-700',
  },
}
</script>

<template>
  <div
    class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    aria-live="polite"
  >
    <TransitionGroup
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-4 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          colorMap[toast.type]?.bg || colorMap.info.bg,
          'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all'
        ]"
      >
        <component
          :is="iconMap[toast.type] || iconMap.info"
          :class="['h-5 w-5 flex-shrink-0 mt-0.5', colorMap[toast.type]?.icon || colorMap.info.icon]"
        />

        <div class="flex-1 min-w-0">
          <p v-if="toast.title" class="text-xs font-bold uppercase tracking-wider mb-0.5">
            {{ toast.title }}
          </p>
          <p class="text-xs text-slate-200 font-medium leading-relaxed break-words">
            {{ toast.message }}
          </p>
        </div>

        <button
          type="button"
          @click="removeToast(toast.id)"
          class="p-1 -mr-1 -mt-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>


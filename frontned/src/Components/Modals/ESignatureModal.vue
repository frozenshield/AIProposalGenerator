<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import {
  PenTool,
  Type,
  Upload,
  RotateCcw,
  Check,
  X,
  ShieldCheck,
  Sparkles,
} from 'lucide-vue-next'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  defaultName: {
    type: String,
    default: 'Elena Vance',
  },
  title: {
    type: String,
    default: 'Add Authorized E-Signature',
  },
})

const emit = defineEmits(['close', 'save'])

const activeTab = ref('draw') // 'draw', 'type', 'upload'
const penColor = ref('#0f172a') // Slate black, navy, royal blue
const penColors = ['#0f172a', '#1e3a8a', '#2563eb', '#047857']

// Draw Tab State
const canvasRef = ref(null)
const isDrawing = ref(false)
const hasDrawn = ref(false)
let ctx = null

// Type Tab State
const typedName = ref(props.defaultName)
const selectedFont = ref('font-cursive-1')
const signatureFonts = [
  { id: 'font-cursive-1', label: 'Calligraphy Script', font: 'Dancing Script, cursive', style: 'italic font-serif text-3xl tracking-wide' },
  { id: 'font-cursive-2', label: 'Executive Brush', font: 'Brush Script MT, cursive', style: 'italic font-serif text-3xl font-light' },
  { id: 'font-cursive-3', label: 'Modern Cursive', font: 'Caveat, cursive', style: 'italic text-4xl' },
  { id: 'font-cursive-4', label: 'Formal Penmanship', font: 'Georgia, serif', style: 'italic font-serif text-2xl font-bold tracking-tight' },
]

// Upload Tab State
const uploadedImageUrl = ref(null)
const uploadError = ref(null)

watch(
  () => props.show,
  async (val) => {
    if (val) {
      if (!typedName.value) {
        typedName.value = props.defaultName
      }
      await nextTick()
      initCanvas()
    }
  }
)

function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  // Handle high-DPI scaling
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * 2
  canvas.height = rect.height * 2
  ctx.scale(2, 2)
  ctx.strokeStyle = penColor.value
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  clearCanvas()
}

function clearCanvas() {
  if (!ctx || !canvasRef.value) return
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  hasDrawn.value = false
}

function setPenColor(color) {
  penColor.value = color
  if (ctx) {
    ctx.strokeStyle = color
  }
}

// Mouse and Touch event handlers
function getPos(e) {
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  }
}

function startDrawing(e) {
  if (e.cancelable) e.preventDefault()
  isDrawing.value = true
  hasDrawn.value = true
  const pos = getPos(e)
  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y)
}

function draw(e) {
  if (!isDrawing.value) return
  if (e.cancelable) e.preventDefault()
  const pos = getPos(e)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
}

function stopDrawing() {
  if (isDrawing.value) {
    isDrawing.value = false
    ctx.closePath()
  }
}

// Handle File Upload
function handleFileUpload(e) {
  const file = e.target.files?.[0]
  uploadError.value = null
  if (!file) return

  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Please select a valid image file (PNG, JPG, or SVG).'
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    uploadedImageUrl.value = event.target.result
  }
  reader.readAsDataURL(file)
}

// Generate image from typed signature using Canvas
function generateTypedSignatureDataUrl() {
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = 600
  tempCanvas.height = 180
  const tempCtx = tempCanvas.getContext('2d')
  
  tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
  tempCtx.fillStyle = penColor.value
  
  const fontObj = signatureFonts.find((f) => f.id === selectedFont.value) || signatureFonts[0]
  tempCtx.font = `italic 54px ${fontObj.font}`
  tempCtx.textAlign = 'center'
  tempCtx.textBaseline = 'middle'
  tempCtx.fillText(typedName.value || 'Authorized Signer', tempCanvas.width / 2, tempCanvas.height / 2)
  
  return tempCanvas.toDataURL('image/png')
}

function applySignature() {
  let signatureDataUrl = null
  let type = activeTab.value

  if (activeTab.value === 'draw') {
    if (!hasDrawn.value) {
      alert('Please draw your signature before applying.')
      return
    }
    signatureDataUrl = canvasRef.value.toDataURL('image/png')
  } else if (activeTab.value === 'type') {
    if (!typedName.value.trim()) {
      alert('Please enter your name.')
      return
    }
    signatureDataUrl = generateTypedSignatureDataUrl()
  } else if (activeTab.value === 'upload') {
    if (!uploadedImageUrl.value) {
      alert('Please upload an image of your signature.')
      return
    }
    signatureDataUrl = uploadedImageUrl.value
  }

  emit('save', {
    dataUrl: signatureDataUrl,
    type,
    signerName: typedName.value || props.defaultName,
  })
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <!-- Header -->
        <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <PenTool class="h-4 w-4" />
            </div>
            <div>
              <h3 class="text-sm font-bold tracking-tight">{{ title }}</h3>
              <p class="text-[11px] text-slate-400">Cryptographically verifiable signature embedded in proposal</p>
            </div>
          </div>
          <button
            type="button"
            @click="emit('close')"
            class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Mode Tabs -->
        <div class="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3 gap-2">
          <button
            type="button"
            @click="activeTab = 'draw'"
            :class="[
              activeTab === 'draw'
                ? 'border-brand-600 text-brand-700 bg-white shadow-2xs font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 font-medium',
              'flex items-center gap-2 px-4 py-2 border-b-2 text-xs transition-colors rounded-t-lg'
            ]"
          >
            <PenTool class="h-3.5 w-3.5" />
            <span>Draw with Pen</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'type'"
            :class="[
              activeTab === 'type'
                ? 'border-brand-600 text-brand-700 bg-white shadow-2xs font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 font-medium',
              'flex items-center gap-2 px-4 py-2 border-b-2 text-xs transition-colors rounded-t-lg'
            ]"
          >
            <Type class="h-3.5 w-3.5" />
            <span>Type Signature</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'upload'"
            :class="[
              activeTab === 'upload'
                ? 'border-brand-600 text-brand-700 bg-white shadow-2xs font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 font-medium',
              'flex items-center gap-2 px-4 py-2 border-b-2 text-xs transition-colors rounded-t-lg'
            ]"
          >
            <Upload class="h-3.5 w-3.5" />
            <span>Upload Image</span>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <!-- TAB 1: DRAW SIGNATURE -->
          <div v-show="activeTab === 'draw'" class="space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-600 font-medium">Draw your signature in the box below:</span>
              <div class="flex items-center gap-2">
                <span class="text-[11px] text-slate-400">Pen Color:</span>
                <div class="flex items-center gap-1.5">
                  <button
                    v-for="color in penColors"
                    :key="color"
                    type="button"
                    @click="setPenColor(color)"
                    class="h-4 w-4 rounded-full border border-slate-300 transition-transform"
                    :class="{ 'scale-125 ring-2 ring-brand-500 ring-offset-1': penColor === color }"
                    :style="{ backgroundColor: color }"
                  ></button>
                </div>
                <button
                  type="button"
                  @click="clearCanvas"
                  class="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium"
                >
                  <RotateCcw class="h-3 w-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            <!-- Canvas Container -->
            <div class="relative w-full h-44 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 overflow-hidden touch-none select-none">
              <canvas
                ref="canvasRef"
                class="w-full h-full cursor-crosshair"
                @mousedown="startDrawing"
                @mousemove="draw"
                @mouseup="stopDrawing"
                @mouseleave="stopDrawing"
                @touchstart="startDrawing"
                @touchmove="draw"
                @touchend="stopDrawing"
              ></canvas>
              <div
                v-if="!hasDrawn"
                class="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-xs italic"
              >
                Sign with your mouse, trackpad, or finger here
              </div>
            </div>
          </div>

          <!-- TAB 2: TYPE SIGNATURE -->
          <div v-show="activeTab === 'type'" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <input
                v-model="typedName"
                type="text"
                placeholder="e.g. Elena Vance"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div class="space-y-2">
              <span class="text-xs font-semibold text-slate-700 block">Choose Calligraphy Script:</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  v-for="font in signatureFonts"
                  :key="font.id"
                  @click="selectedFont = font.id"
                  :class="[
                    selectedFont === font.id
                      ? 'border-brand-600 ring-2 ring-brand-500/20 bg-brand-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white',
                    'border rounded-xl p-3 cursor-pointer transition-all flex flex-col justify-between h-24'
                  ]"
                >
                  <span class="text-[10px] text-slate-400 uppercase font-bold">{{ font.label }}</span>
                  <div :class="font.style" :style="{ color: penColor }" class="truncate text-center py-1">
                    {{ typedName || 'Your Signature' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 3: UPLOAD SIGNATURE -->
          <div v-show="activeTab === 'upload'" class="space-y-3">
            <label class="block text-xs font-semibold text-slate-700">Upload Scanned Signature</label>
            <div class="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 hover:bg-slate-100/50 transition-colors">
              <input
                type="file"
                id="signature-file"
                accept="image/*"
                @change="handleFileUpload"
                class="hidden"
              />
              <label for="signature-file" class="cursor-pointer block space-y-2">
                <Upload class="h-8 w-8 text-slate-400 mx-auto" />
                <span class="text-xs font-semibold text-brand-600 hover:text-brand-700 block">
                  Click to select signature file
                </span>
                <span class="text-[11px] text-slate-400 block">PNG, JPG, or SVG with transparent background recommended</span>
              </label>
            </div>

            <div v-if="uploadedImageUrl" class="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
              <img :src="uploadedImageUrl" alt="Uploaded signature" class="h-12 max-w-[200px] object-contain" />
              <button
                type="button"
                @click="uploadedImageUrl = null"
                class="text-xs text-rose-500 hover:underline"
              >
                Remove
              </button>
            </div>

            <p v-if="uploadError" class="text-xs text-rose-500">{{ uploadError }}</p>
          </div>

          <!-- Security note -->
          <div class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] flex items-center gap-2">
            <ShieldCheck class="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>Digital signatures applied here are formatted with timestamped audit trails and embedded into exported proposals.</span>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="applySignature"
            class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm shadow-brand-500/25 transition-all cursor-pointer"
          >
            <Check class="h-4 w-4" />
            <span>Apply & Embed Signature</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>


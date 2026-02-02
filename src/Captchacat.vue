<template>
  <div
    ref="containerRef"
    class="captcha-widget"
    :data-sitekey="siteKey"
    :data-token-callback="callbackName"
    :style="{ minHeight: '48px' }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const BASE_URL = 'https://challenge.captchacat.com'

const props = defineProps<{
  siteKey: string
}>()

const emit = defineEmits<{
  verify: [token: string]
}>()

declare global {
  interface Window {
    Captchacat?: {
      render: (container?: HTMLElement) => void
    }
    [key: string]: any
  }
}

const containerRef = ref<HTMLDivElement | null>(null)
const callbackName = ref('')

onMounted(() => {
  // Generate unique callback name
  callbackName.value = `captchacat_cb_${Math.random().toString(36).substring(7)}`

  // Set up global callback bridge
  window[callbackName.value] = (token: string) => {
    emit('verify', token)
  }

  // Load widget script if not present
  const scriptUrl = `${BASE_URL}/ray/widget.js`

  const handleInit = () => {
    if (window.Captchacat?.render && containerRef.value) {
      window.Captchacat.render(containerRef.value)
    }
  }

  let script = document.querySelector(
    `script[src="${scriptUrl}"]`
  ) as HTMLScriptElement | null

  if (!script) {
    script = document.createElement('script')
    script.src = scriptUrl
    script.async = true
    script.onload = handleInit
    document.body.appendChild(script)
  } else {
    // Script exists - check if already loaded
    if (window.Captchacat) {
      handleInit()
    } else {
      script.addEventListener('load', handleInit)
    }
  }
})

onUnmounted(() => {
  // Cleanup: remove global callback
  if (callbackName.value && typeof window !== 'undefined') {
    delete window[callbackName.value]
  }

  // Clean up container innerHTML to prevent ghost iframes
  if (containerRef.value) {
    containerRef.value.innerHTML = ''
  }
})

// Watch for siteKey changes and re-render
watch(
  () => props.siteKey,
  () => {
    if (window.Captchacat?.render && containerRef.value) {
      containerRef.value.innerHTML = ''
      window.Captchacat.render(containerRef.value)
    }
  }
)
</script>

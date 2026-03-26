<template>
  <main :style="styles.main">
    <h1 :style="styles.pageTitle">Byebot - Nuxt Demo</h1>

    <div :style="styles.container">
      <form @submit.prevent="handleSubmit" :style="styles.form">
        <input
          v-model="username"
          name="username"
          type="text"
          placeholder="Username"
          required
          :style="styles.input"
        />
        <input
          v-model="password"
          name="password"
          type="password"
          placeholder="Password"
          required
          :style="styles.input"
        />

        <Byebot site-key="bd1cc81b04564d3f899e" @verify="handleVerify" />

        <div :style="styles.statusRow">
          <span
            :style="{
              ...styles.statusDot,
              background: isVerified ? '#10b981' : '#64748b',
            }"
          />
          <span :style="styles.statusText">
            {{ isVerified ? 'Verified' : 'Not verified' }}
          </span>
        </div>

        <button type="submit" :style="styles.button">Submit</button>
      </form>

      <p
        v-if="result"
        :style="{
          ...styles.result,
          color: result.startsWith('Error') ? '#ef4444' : '#10b981',
        }"
      >
        {{ result }}
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Byebot } from '@byebot/vue'

const username = ref('')
const password = ref('')
const result = ref<string | null>(null)
const isVerified = ref(false)
const captchaToken = ref<string | null>(null)

const handleVerify = (token: string) => {
  isVerified.value = true
  captchaToken.value = token
}

const handleSubmit = async () => {
  const formData = new FormData()
  formData.append('username', username.value)
  formData.append('password', password.value)
  if (captchaToken.value) {
    formData.append('byebot-token', captchaToken.value)
  }

  const res = await fetch('/api/login', {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  result.value = res.ok ? 'Success!' : `Error: ${data.message || data.error}`
}

const styles = {
  main: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
    padding: '3rem 2rem',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  pageTitle: {
    color: '#fff',
    fontSize: '2rem',
    fontWeight: 700,
    textAlign: 'center' as const,
    margin: 0,
    marginBottom: '2rem',
  },
  container: {
    width: '100%',
    maxWidth: '360px',
    background: '#1e1e2e',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  input: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    background: '#2a2a3e',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 600,
    marginTop: '0.5rem',
    cursor: 'pointer',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  statusText: {
    color: '#94a3b8',
    fontSize: '0.8rem',
  },
  result: {
    marginTop: '1rem',
    fontSize: '0.85rem',
    textAlign: 'center' as const,
  },
}
</script>

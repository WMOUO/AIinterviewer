import tailwindcss from '@tailwindcss/vite'
import Aura from '@primeuix/themes/aura';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ['~/assets/main.css'],
  modules: [
    '@nuxtjs/supabase',
    '@primevue/nuxt-module',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxthub/core'
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },
  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/',
      callback: '/main'
    },
    clientOptions: {
      auth: {
        autoRefreshToken: true,
        persistSession: true
      }
    }
  },
  primevue: {
    usePrimeVue: true,
    autoImport: true,
    options: {
      theme: {
        preset: Aura
      }
    }
  },
  colorMode: {
    preference: 'light', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode'
  },
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
  }
})
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
    '@nuxtjs/color-mode'
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },
  supabase: {
    redirect: false,
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
}
})
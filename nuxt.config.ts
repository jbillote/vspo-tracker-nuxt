// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxt/eslint',
    '@nuxtjs/color-mode',
    'nuxt-elysia',
  ],
  colorMode: {
    classSuffix: '',
  },
  nitro: {
    preset: 'Bun',
  },
  nuxtElysia: {
    module: '#server',
    path: '/api',
  },
  runtimeConfig: {
    holodexApiKey: '',
  },
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },
  tailwindcss: {
    config: {
      darkMode: 'class',
    },
  },
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,

  extends: [['../../templates/ttc-template/basea', { install: true }]],

  modules: ['@nuxt/eslint'],
})

// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from '@nuxt/kit';

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,
  
  vite: {
    server: {
      fs: {
        // This is the crucial setting.
        // It allows the Vite dev server to access files outside of the
        // default 'src' directory, which is necessary for pnpm's symlinking.
        allow: [resolve(__dirname, '../../templates/ttc-template')],
      },
    },
  },


extends: [
      ['../../templates/ttc-template/basea', { install: true }],
      ['../../templates/ttc-template/data',],
      ['../../templates/ttc-template/auth',],
      ['../teqciti-layer',],
  ],

  site: {
    url: "https://cloudb.teqciti.com",
  },

  modules: ['@nuxt/eslint', 'nuxt-vue3-google-signin'],

  runtimeConfig: {
    
    public: {
      link: process.env.API_URL,
      cloudA: process.env.CLOUD_A,
      streamCustomerSubdomain: 'customer-z4i7hrwnybqp6myv',
      devSystemToken: process.env.NODE_ENV === 'development' 
        ? process.env.API_TOKEN 
        : undefined,
    },

  },


  alias: {
    '@basea-layer': resolve(__dirname, '../../templates/ttc-template/basea'),
    '@data-layer': resolve(__dirname, '../../templates/ttc-template/data'),
    '@ecommerce-layer': resolve(__dirname, '../../templates/ttc-template/ecommerce'),
    '@teqciti-layer': resolve(__dirname, '../teqciti-layer'),
  },

})

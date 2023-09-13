// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  // ...other config options
  devtools: { enabled: true },
   server: {
		middleware: {
      '/api': '~/server.js' // Adjust the path as needed
    }
  },
});

// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
   server: {
		port: 3000,
		middleware: {
      '/api': '~/server.js' // Adjust the path as needed
    }
  },
});

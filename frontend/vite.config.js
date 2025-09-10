import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
 resolve: {
    alias: {
      http: false,
      https: false,
      fs: false,
      net: false,
      tls: false,
    },
  },
})

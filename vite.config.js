import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    port: 5177,
    host: '0.0.0.0',  // Required for Docker container access
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://backend:8000',
        changeOrigin: true,
        secure: process.env.NODE_ENV === 'production',
      }
    },
    // Hot Module Replacement settings for Docker
    hmr: {
      clientPort: 5177,
    },
    // Watch settings for Docker volume mounts
    watch: {
      usePolling: true,
    },
  },
  build: {
    // Source maps are disabled by default in production to reduce bundle size
    // and avoid leaking source code. Set GENERATE_SOURCEMAP=true to override.
    sourcemap: process.env.GENERATE_SOURCEMAP === 'true',
    // Minify output using esbuild (built into Vite, no extra deps required)
    minify: 'esbuild',
  },
})

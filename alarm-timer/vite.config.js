import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tonesManifestPlugin } from './vite/plugins/tonesManifest.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tonesManifestPlugin()],

  // Expose env vars prefixed with VITE_ to the client bundle
  envPrefix: 'VITE_',

  server: {
    host: process.env.VITE_HOST || 'fadzli-homepage',
    port: parseInt(process.env.VITE_PORT || '5173'),
    strictPort: false,
    // Allow the custom hostname through Vite's host check
    allowedHosts: ['fadzli-homepage'],
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          icons: ['lucide-react'],
        },
      },
    },
  },
})

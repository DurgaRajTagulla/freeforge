import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  base: '/freeforge/',
  plugins: [
    react(),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/pdf-lib') || id.includes('node_modules/jspdf') || id.includes('node_modules/html2canvas')) {
            return 'vendor-pdf';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/pdfjs-dist')) {
            return 'vendor-pdfjs';
          }
          if (id.includes('node_modules/@turf') || id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) {
            return 'vendor-geo';
          }
          if (id.includes('node_modules/browser-image-compression') || id.includes('node_modules/react-easy-crop') || id.includes('node_modules/react-dropzone')) {
            return 'vendor-image';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
    target: 'es2020',
    modulePreload: { polyfill: false },
  },
})

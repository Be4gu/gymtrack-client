import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          chart: ['chart.js', 'react-chartjs-2']
        }
      }
    }
  },
  base: './', // Esto asegura que las rutas sean relativas
  server: {
    port: 3000, // Define un puerto si es necesario para el desarrollo local
    open: true // Abre automáticamente el navegador
  },
  resolve: {
    alias: {
      '@': '/src' // Alias común para facilitar la importación
    }
  }
})

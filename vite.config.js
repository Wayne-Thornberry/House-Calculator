import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { copyFileSync } from 'fs'

export default defineConfig({ 
  base: './',
    plugins: [vue()],
  build: {
    outDir: 'dist'
  }
})

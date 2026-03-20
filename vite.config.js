import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/alwin-suhas-portfolio/',
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],
})

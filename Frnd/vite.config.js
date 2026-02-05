import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env,VITE_BASE || "/social_media_engagemant_analysis"
  // server: {
  //   port: 3000,
  //   open: true
  // }
});

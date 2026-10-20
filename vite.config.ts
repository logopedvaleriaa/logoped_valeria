import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// Relative assets support both username.github.io and repository GitHub Pages.
export default defineConfig({ plugins: [react(), tailwindcss()], base: './' });

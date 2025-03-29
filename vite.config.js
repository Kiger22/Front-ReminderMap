import { defineConfig } from 'vite';

export default defineConfig({
  envDir: './',
  define: {
    'process.env': process.env
  }
});
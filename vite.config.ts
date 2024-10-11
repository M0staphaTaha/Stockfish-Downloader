import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: ''
        }
      ]
    })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: 'index.html',            // Popup entry
        background: 'src/extensions/background.ts', // Background script
        content: 'src/extensions/content.ts',       // Content script
        popup: 'src/components/popup.tsx'           // Popup component
      },
      output: {
        entryFileNames: '[name].js',  // Output names to match manifest.json
      }
    }
  }
});

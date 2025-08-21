
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunk splitting to reduce critical request chains
    rollupOptions: {
      output: {
        manualChunks: {
          // Bundle lucide icons together to reduce separate requests
          'lucide': ['lucide-react'],
          // Bundle UI components together
          'ui': [
            '@/components/ui/button',
            '@/components/ui/card',
            '@/components/ui/toast',
            '@/components/ui/toaster'
          ],
          // Bundle React libraries together
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Bundle query and state management
          'query': ['@tanstack/react-query']
        }
      }
    },
    // Optimize asset inlining threshold
    assetsInlineLimit: 4096,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000
  }
}));

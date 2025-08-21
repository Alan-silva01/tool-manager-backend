
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
          // Bundle React libraries together as high priority
          'react-vendor': ['react', 'react-dom'],
          // Bundle router separately to allow lazy loading
          'router': ['react-router-dom'],
          // Bundle query and state management
          'query': ['@tanstack/react-query'],
          // Bundle lucide icons together to reduce separate requests
          'lucide': ['lucide-react'],
          // Bundle UI components together
          'ui': [
            '@/components/ui/button',
            '@/components/ui/card',
            '@/components/ui/toast',
            '@/components/ui/toaster'
          ],
        },
        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          // Use content hash for better caching
          if (chunkInfo.name === 'react-vendor') {
            return 'assets/react-vendor.[hash].js';
          }
          return 'assets/[name].[hash].js';
        }
      }
    },
    // Optimize asset inlining threshold
    assetsInlineLimit: 4096,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Enable source maps for better debugging without affecting performance
    sourcemap: false,
    // Optimize minification
    minify: 'esbuild',
    // Optimize target for modern browsers
    target: 'es2020'
  }
}));

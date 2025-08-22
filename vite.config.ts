
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
        // Optimize chunk naming for better caching with content hashes
        chunkFileNames: (chunkInfo) => {
          // Use long content hashes for better cache invalidation
          const facadeModuleId = chunkInfo.facadeModuleId;
          if (facadeModuleId) {
            const name = path.basename(facadeModuleId, path.extname(facadeModuleId));
            return `assets/${name}-[hash].js`;
          }
          return 'assets/[name]-[hash].js';
        },
        // Optimize asset naming for better caching
        assetFileNames: (assetInfo) => {
          // Use content hashes for all assets to enable long-term caching
          const extType = path.extname(assetInfo.name || '').slice(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(extType)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        // Optimize entry naming
        entryFileNames: 'assets/[name]-[hash].js',
      }
    },
    // Optimize asset inlining threshold for better caching
    assetsInlineLimit: 2048, // Reduced from 4096 to ensure more assets are separate files with cache headers
    // Enable CSS code splitting for better caching granularity
    cssCodeSplit: true,
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Enable source maps for better debugging without affecting performance
    sourcemap: false,
    // Optimize minification
    minify: 'esbuild',
    // Optimize target for modern browsers
    target: 'es2020',
    // Enable asset immutability for better caching
    assetsDir: 'assets',
    // Optimize CSS inlining
    cssMinify: 'esbuild',
  }
}));

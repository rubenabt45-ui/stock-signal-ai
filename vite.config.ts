
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
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Use esbuild for reliability and speed
    minify: 'esbuild',
    // Disable source maps for production builds
    sourcemap: mode === 'development',
    // Modern build target for better tree shaking
    target: 'es2020',
    // Aggressive chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI libraries
          'ui-vendor': ['@radix-ui/react-slot', '@radix-ui/react-dialog', '@radix-ui/react-sheet', '@radix-ui/react-tabs'],
          // Data/state management
          'data-vendor': ['@tanstack/react-query', '@supabase/supabase-js'],
          // i18n
          'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          // Chart/trading components (heavy)
          'trading-vendor': ['recharts'],
        },
      },
    },
    // Drop console and debugger in production
    esbuild: mode === 'production' ? {
      drop: ['console', 'debugger'],
    } : undefined,
  },
  // Enable compression and modern features
  esbuild: {
    target: 'es2020',
  },
}));

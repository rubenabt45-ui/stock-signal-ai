
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Bundle analyzer - generates report in production builds
    mode === 'production' && visualizer({
      filename: 'dist/bundle-report.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    }),
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
    // CSS code splitting
    cssCodeSplit: true,
    // Aggressive chunk splitting for better caching
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal caching
        manualChunks: {
          // React ecosystem - core framework
          'react-vendor': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          
          // UI libraries - separate heavy UI components
          'radix-vendor': [
            '@radix-ui/react-slot', 
            '@radix-ui/react-dialog', 
            '@radix-ui/react-tabs',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-toast',
            '@radix-ui/react-select',
            '@radix-ui/react-accordion',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-label',
            '@radix-ui/react-progress',
            '@radix-ui/react-separator',
            '@radix-ui/react-switch',
            '@radix-ui/react-slider'
          ],
          
          // Data/state management
          'data-vendor': ['@tanstack/react-query'],
          
          // i18n - separate internationalization
          'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          
          // Chart/trading components (heavy) - only loaded when needed
          'chart-vendor': ['recharts'],
          
          // Form handling
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Animation and motion
          'motion-vendor': ['framer-motion'],
          
          // Utilities
          'util-vendor': ['date-fns', 'clsx', 'class-variance-authority', 'tailwind-merge']
        },
      },
    },
    // Drop console and debugger in production
    esbuild: mode === 'production' ? {
      drop: ['console', 'debugger'],
      legalComments: 'none'
    } : undefined,
    // Moved chunkSizeWarningLimit to the correct location
    chunkSizeWarningLimit: 1000,
  },
  // Enable compression and modern features
  esbuild: {
    target: 'es2020',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query'
    ],
    exclude: [
      // Exclude heavy libraries that should be loaded on demand
      'recharts'
    ]
  }
}));

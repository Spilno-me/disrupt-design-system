import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

// Plugin to copy CSS files to dist
function copyCSSFilesPlugin() {
  return {
    name: 'copy-css-files',
    closeBundle() {
      // Copy tokens.css
      const tokensDir = resolve(__dirname, 'dist/styles')
      if (!existsSync(tokensDir)) {
        mkdirSync(tokensDir, { recursive: true })
      }
      copyFileSync(
        resolve(__dirname, 'src/styles/tokens.css'),
        resolve(tokensDir, 'tokens.css')
      )
      console.log('✓ Copied tokens.css to dist/styles/')

      // Copy styles.css (main Tailwind v4 theme with all DDS tokens)
      copyFileSync(
        resolve(__dirname, 'src/styles.css'),
        resolve(tokensDir, 'theme.css')
      )
      console.log('✓ Copied styles.css to dist/styles/theme.css')

      // Copy HeroParticles.css
      const uiDir = resolve(__dirname, 'dist/components/ui')
      if (!existsSync(uiDir)) {
        mkdirSync(uiDir, { recursive: true })
      }
      copyFileSync(
        resolve(__dirname, 'src/components/ui/HeroParticles.css'),
        resolve(uiDir, 'HeroParticles.css')
      )
      console.log('✓ Copied HeroParticles.css to dist/components/ui/')
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
    }),
    copyCSSFilesPlugin(),
    // Bundle analyzer - run with ANALYZE=true npm run build
    process.env.ANALYZE === 'true' &&
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'core/index': resolve(__dirname, 'src/core/index.ts'),
        'flow/index': resolve(__dirname, 'src/flow/index.ts'),
        'partner/index': resolve(__dirname, 'src/partner/index.ts'),
        'market/index': resolve(__dirname, 'src/market/index.ts'),
        // Granular subpath exports for better tree-shaking
        'ui/index': resolve(__dirname, 'src/ui/index.ts'),
        'sections/index': resolve(__dirname, 'src/sections/index.ts'),
        'forms/index': resolve(__dirname, 'src/forms/index.ts'),
      },
      name: 'DisruptDesignSystem',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'motion/react',
        'lucide-react',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-dialog',
        '@radix-ui/react-label',
        '@radix-ui/react-select',
        '@radix-ui/react-separator',
        '@radix-ui/react-slot',
        '@radix-ui/react-tooltip',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || ''

          // Keep logos in logos/ directory
          if (name.includes('logo')) {
            return 'logos/[name][extname]'
          }

          // Keep patterns in patterns/ directory
          if (name.includes('pattern')) {
            return 'patterns/[name][extname]'
          }

          // Everything else in assets/
          return 'assets/[name][extname]'
        },
        chunkFileNames: 'chunks/[name].js',
      },
    },
    cssCodeSplit: false,
    // Ensure assets are copied
    assetsInlineLimit: 0, // Don't inline assets, always emit files
  },
  // Configure public directory
  publicDir: 'public',
})

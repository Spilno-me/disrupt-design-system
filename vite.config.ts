import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

// Plugin to copy tokens.css to dist
function copyTokensPlugin() {
  return {
    name: 'copy-tokens',
    closeBundle() {
      const srcPath = resolve(__dirname, 'src/styles/tokens.css')
      const destDir = resolve(__dirname, 'dist/styles')
      const destPath = resolve(destDir, 'tokens.css')

      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true })
      }
      copyFileSync(srcPath, destPath)
      console.log('✓ Copied tokens.css to dist/styles/')
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
    copyTokensPlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DisruptDesignSystem',
      formats: ['es'],
      fileName: 'index',
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
        assetFileNames: 'assets/[name][extname]',
        chunkFileNames: 'chunks/[name].js',
      },
    },
    cssCodeSplit: false,
  },
})

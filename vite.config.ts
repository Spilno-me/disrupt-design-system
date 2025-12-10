import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
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

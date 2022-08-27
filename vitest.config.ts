import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
      '~~': resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'happy-dom',
    coverage: {
      reporter: ['lcov', 'text'],
      include: ['src/core/*.ts'],
    },
  },
})

import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'lcov'],
      src: ['src'],
    },
  },
})

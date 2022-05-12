import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    coverage: {
      reporter: ['lcov', 'text'],
      include: ['src/plugin.ts', 'src/pick.ts', 'src/normalize.ts'],
    },
  },
})

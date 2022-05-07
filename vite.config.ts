import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
  },
  test: {
    environment: 'happy-dom',
    silent: true,
    coverage: {
      reporter: ['lcov', 'text'],
      include: ['src/plugin.ts', 'src/pick.ts', 'src/normalize.ts'],
    },
  },
})

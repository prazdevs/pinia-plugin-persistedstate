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
      include: ['src/index.ts', 'src/pick.ts'],
    },
    deps: {
      inline: [
        'vue2',
        '@vue/composition-api',
        'vue-demi',
        'pinia',
      ],
    },
  },
})

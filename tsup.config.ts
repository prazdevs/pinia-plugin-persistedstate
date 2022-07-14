import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/nuxt.ts'],
  dts: true,
  format: ['cjs', 'esm'],
})

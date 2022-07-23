import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/helpers/**'],
  dts: true,
  format: ['cjs', 'esm'],
})

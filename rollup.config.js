// @ts-check
import nodeResolve from '@rollup/plugin-node-resolve'
import { defineConfig } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      format: 'iife',
      file: 'dist/index.global.js',
      name: 'piniaPluginPersistedstate',
      exports: 'named',
    },
    {
      format: 'umd',
      file: 'dist/index.umd.js',
      name: 'piniaPluginPersistedstate',
      exports: 'named',
    },
  ],
  plugins: [
    esbuild(),
    nodeResolve(),
  ],
})

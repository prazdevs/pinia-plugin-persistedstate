// @ts-check
import config from '@antfu/eslint-config'

export default config({
  formatters: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
    filesTypeAware: ['src/**/*.ts'],
    overridesTypeAware: {
      'ts/strict-boolean-expressions': 'off',
    },
  },
})

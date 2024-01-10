import config from '@antfu/eslint-config'

export default config({
  ignores: ['**/cache'],
}, {
  files: ['packages/plugin/src/types.ts'],
  rules: {
    'ts/no-unused-vars': [
      'error',
      { varsIgnorePattern: '^S$|^Store$' },
    ],
    'unused-imports/no-unused-vars': [
      'error',
      { varsIgnorePattern: '^S$|^Store$' },
    ],
  },
})

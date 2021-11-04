import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/tests/setup.ts'],
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.ts'],
}

export default config

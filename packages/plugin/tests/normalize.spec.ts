import { describe, expect, it, vi } from 'vitest'

import { normalizeOptions } from '../src/normalize'

it('merges options', () => {
  //* arrange
  const factoryRestore = vi.fn()
  const optionsRestore = vi.fn()

  //* act
  const options = normalizeOptions(
    { afterRestore: optionsRestore },
    { beforeRestore: factoryRestore },
  )

  //* assert
  expect(options.afterRestore).toBe(optionsRestore)
  expect(options.beforeRestore).toBe(factoryRestore)
})

it('overrides factory options', () => {
  //* arrange
  const factoryRestore = vi.fn()
  const optionsRestore = vi.fn()

  //* act
  const options = normalizeOptions(
    { beforeRestore: optionsRestore },
    { beforeRestore: factoryRestore },
  )

  //* assert
  expect(options.beforeRestore).toBe(optionsRestore)
  expect(options.beforeRestore).not.toBe(factoryRestore)
})

describe('factory key option', () => {
  it('defaults to identity', () => {
    //* act
    const options = normalizeOptions({ key: 'mock_key' }, {})

    //* assert
    expect(options.key).toBe('mock_key')
  })

  it('can prefix key', () => {
    //* act
    const options = normalizeOptions(
      { key: 'mock_key' },
      { key: k => `prefixed_${k}` },
    )

    //* assert
    expect(options.key).toBe('prefixed_mock_key')
    expect(options.key).not.toBe('mock_key')
  })
})

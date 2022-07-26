import { expect, it, vi } from 'vitest'

import normalizeOptions from '~/core/normalize'

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

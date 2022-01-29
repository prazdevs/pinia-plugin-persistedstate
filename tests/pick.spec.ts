import { expect, it } from 'vitest'

import pick from '../src/pick'

it('picks nested properties', () => {
  //* arrange
  const object = {
    ignored: 'fake',
    outer1: { inner1: 'mock', inner2: 'mock2', inner3: 'mock3' },
    outer2: 'outer',
  }

  //* act
  const result = pick(object, ['outer1.inner1', 'outer1.inner2', 'outer2'])

  //* assert
  expect(result).to.eql({
    outer1: { inner1: 'mock', inner2: 'mock2' },
    outer2: 'outer',
  })
})

it('avoids prototype pollution', () => {
  //* arrange
  const object = { date: new Date() }

  //* act
  const result = pick(object, ['date.__proto__.constructor'])

  //* assert
  expect(result).to.eql({ date: {} })
})

it('creates paths for undefined values', () => {
  //* arrage
  const object = { ignore: 'mock' }

  //* act
  const result = pick(object, ['not.defined.yet'])

  //* assert
  expect(result).to.eql({ not: { defined: { yet: undefined } } })
})

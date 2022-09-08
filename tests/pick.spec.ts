import { expect, it } from 'vitest'

import pick from '~/core/pick'

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

it('picks child-properties from all of an arrays elements', () => {
  //* arrange
  const object = {
    array: [
      { picked: 'picked0', value: 'value0', ignored: 'ignored0' },
      { picked: 'picked1', value: 'value1', ignored: 'ignored1' },
    ],
    secondArray: [{ hello: 'world' }, { hi: 'planet' }],
  }

  //* act
  const result = pick(object, [
    'array.[].picked',
    'array.[].value',
    'secondArray.[]',
  ])

  //* assert
  expect(result).to.eql({
    array: [
      { picked: 'picked0', value: 'value0' },
      { picked: 'picked1', value: 'value1' },
    ],
    secondArray: [{ hello: 'world' }, { hi: 'planet' }],
  })
})

it('picks all elements from multiple nested arrays', () => {
  //* arrange
  const object = {
    array1: [
      [['picked0', 'picked1', { picked2: 'picked2' }]],
      [['picked3', { picked4: 'picked4', picked5: 'picked5' }, 'picked6']],
    ],
    array2: [
      [{ picked: 'picked0', ignored: 'ignored0' }],
      [{ picked: 'picked1', ignored: 'ignored1' }],
    ],
  }

  //* act
  const result = pick(object, ['array1.[].[].[]', 'array2.[].[].picked'])

  //* assert
  expect(result).to.eql({
    array1: [
      [['picked0', 'picked1', { picked2: 'picked2' }]],
      [['picked3', { picked4: 'picked4', picked5: 'picked5' }, 'picked6']],
    ],
    array2: [[{ picked: 'picked0' }], [{ picked: 'picked1' }]],
  })
})

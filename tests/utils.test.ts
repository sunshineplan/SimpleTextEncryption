import { expect, test } from 'vitest'
import utils from '../src/utils'

test('Compress&Decompress', () => {
  for (let i = 0; i < 100; i++) {
    const str = Buffer.from(utils.random((Math.random() * 10) + 1)).toString('hex')
    const c = utils.compress(str)
    expect(c.compression).toStrictEqual(0)
    expect(Buffer.from(c.content).toString()).toStrictEqual(str)
  }
  for (let i = 0; i < 100; i++) {
    const str = Buffer.from(utils.random((100 + (Math.random() * 100) + 1))).toString('hex')
    const c = utils.compress(str)
    expect(c.compression).toStrictEqual(1)
    expect(utils.decompress(c.content)).toBe(str)
  }
})

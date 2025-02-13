import { expect, test } from 'vitest'
import { decrypt, encrypt } from '../src/ste'
import utils from '../src/utils'

test('Encrypt&Decrypt', async () => {
  for (let i = 0; i < 50; i++) {
    const plaintext = Buffer.from(utils.random((Math.random() * 100) + 1)).toString('hex')
    const key = Buffer.from(utils.random((Math.random() * 10))).toString('hex')
    expect(await decrypt(key, await encrypt(key, plaintext))).toBe(plaintext)
  }
  const plaintext = 'Hello, 世界'
  const key = '测试Key'
  const encrypted = await encrypt(key, plaintext)
  console.log(encrypted)
  expect(await decrypt(key, encrypted)).toBe(plaintext)
}, 600000)

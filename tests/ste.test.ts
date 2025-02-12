import { expect, test } from 'vitest'
import { decrypt, encrypt } from '../src/ste'

test('Encrypt&Decrypt', async () => {
  for (let i = 0; i < 50; i++) {
    const plaintext = Buffer.from(crypto.getRandomValues(new Uint8Array((Math.random() * 100) + 1))).toString('hex')
    const key = Buffer.from(crypto.getRandomValues(new Uint8Array((Math.random() * 10)))).toString('hex')
    expect(await decrypt(key, await encrypt(key, plaintext))).toBe(plaintext)
  }
  const plaintext = '你好世界'
  const key = '测试'
  expect(await decrypt(key, await encrypt(key, plaintext))).toBe(plaintext)
})

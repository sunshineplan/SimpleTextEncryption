import crypto from 'crypto'
import { expect, test } from 'vitest'
import { decrypt, encrypt } from '../src/ste'

test('Encrypt&Decrypt', () => {
  for (let i = 0; i < 50; i++) {
    const plaintext = crypto.randomBytes((Math.random() * 100) + 1).toString('hex')
    const key = crypto.randomBytes(Math.floor((Math.random() * 10))).toString('hex')
    expect(decrypt(key, encrypt(key, plaintext))).toBe(plaintext)
  }

  const plaintext = '你好世界'
  const key = '测试'
  expect(decrypt(key, encrypt(key, plaintext))).toBe(plaintext)
})

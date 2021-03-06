/**
 * @jest-environment ./test/environment
 */
import { encrypt, decrypt } from '../src/ste'

const crypto = require('crypto')

test('Encrypt&Decrypt', () => {
  for (let i = 0; i < 50; i++) {
    const plaintext = crypto.randomBytes((Math.random() * 100) + 1).toString('hex');
    const key = crypto.randomBytes(Math.floor((Math.random() * 10))).toString('hex');
    expect(decrypt(key, encrypt(key, plaintext))).toBe(plaintext)
  }
})

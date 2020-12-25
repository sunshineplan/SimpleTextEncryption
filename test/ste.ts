import { encrypt, decrypt } from '../src/ste'

test('Encrypt&Decrypt', () => {
  const plaintext = 'test', key = 'key'
  expect(decrypt(key, encrypt(key, plaintext))).toBe(plaintext)
})

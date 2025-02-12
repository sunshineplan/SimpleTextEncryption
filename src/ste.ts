import utils from './utils'

const saltLength = 8
const iterations = 4096
const keyLength = 32
const gcmStandardNonceSize = 12

const cryptoKey = async (key: string, salt: Uint8Array | Buffer, usage: KeyUsage) => {
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256'
    },
    await crypto.subtle.importKey(
      'raw',
      Buffer.from(key),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    ),
    { name: 'AES-GCM', length: keyLength * 8 },
    false,
    [usage]
  )
}

export const encrypt = async (key: string, plaintext: string): Promise<string> => {
  if (!key) return Buffer.from(plaintext).toString('base64').replace(/=/g, '')
  const salt = crypto.getRandomValues(new Uint8Array(saltLength))
  const iv = crypto.getRandomValues(new Uint8Array(gcmStandardNonceSize))
  const data = utils.compress(plaintext)
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    await cryptoKey(key, salt, 'encrypt'),
    data.content
  )
  const result = new Uint8Array(saltLength + gcmStandardNonceSize + encrypted.byteLength + 1)
  result.set(salt)
  result.set(iv, saltLength)
  result.set(new Uint8Array(encrypted), saltLength + gcmStandardNonceSize)
  result[saltLength + gcmStandardNonceSize + encrypted.byteLength] = data.compression
  return Buffer.from(result.buffer).toString('base64').replace(/=/g, '')
}

export const decrypt = async (key: string, ciphertext: string) => {
  const data = Buffer.from(ciphertext, 'base64')
  if (!key) return data.toString()
  const salt = data.subarray(0, saltLength)
  const iv = data.subarray(saltLength, saltLength + gcmStandardNonceSize)
  const encrypted = data.subarray(saltLength + gcmStandardNonceSize, data.length - 1)
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    await cryptoKey(key, salt, 'decrypt'),
    encrypted
  )
  return data[data.length - 1]
    ? utils.decompress(decrypted)
    : Buffer.from(decrypted).toString()
}
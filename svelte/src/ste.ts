import sjcl from 'sjcl'
import utils from './utils'

const concat = sjcl.bitArray.concat
const base64 = sjcl.codec.base64

export function encrypt(key: string, plaintext: string): string {
  if (key == '')
    return btoa(unescape(encodeURIComponent(plaintext))).replace(/=/g, '')
  sjcl.misc._pbkdf2Cache = {}
  const data = utils.compress(plaintext)
  const encrypted = sjcl.json._encrypt(key, data.content)
  return base64.fromBits(
    concat(
      concat(encrypted.salt, encrypted.iv),
      concat(encrypted.ct, data.compression)
    )
  ).replace(/=/g, '')
}

export function decrypt(key: string, ciphertext: string): string {
  if (key == '')
    return decodeURIComponent(escape(atob(ciphertext)))
  const cipher = utils.BitsToUint8Array(base64.toBits(ciphertext))
  let data: sjcl.SjclCipherEncrypted = {
    salt: utils.Uint8ArrayToBits(cipher.slice(0, 8)),
    iv: utils.Uint8ArrayToBits(cipher.slice(8, 24)),
    ct: utils.Uint8ArrayToBits(cipher.slice(24, cipher.length - 1))
  }
  if (new TextDecoder().decode(cipher.slice(cipher.length - 1, cipher.length)) == '1')
    return utils.decompress(sjcl.json._decrypt(key, data, { raw: 1 }) as sjcl.BitArray)
  else return sjcl.json._decrypt(key, data) as string
}
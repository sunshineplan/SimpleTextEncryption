import sjcl from 'sjcl'
import { compress, decompress, BitsToUint8Array, Uint8ArrayToBits } from './utils'

const concat = sjcl.bitArray.concat
const base64 = sjcl.codec.base64

export function encrypt(key: string, content: string): string {
  if (key == '')
    return btoa(unescape(encodeURIComponent(content))).replace(/=/g, '')
  sjcl.misc.pa = {}
  const plaintext = compress(content)
  const data = sjcl.json.ja(key, plaintext.content)
  return base64.fromBits(concat(concat(data.salt, data.iv), concat(data.ct, plaintext.compression))).replace(/=/g, '')
}

export function decrypt(key: string, content: string): string {
  if (key == '')
    return decodeURIComponent(escape(atob(content)))
  const cipher = BitsToUint8Array(base64.toBits(content))
  let data: sjcl.SjclCipherEncrypted = {
    salt: Uint8ArrayToBits(cipher.slice(0, 8)),
    iv: Uint8ArrayToBits(cipher.slice(8, 24)),
    ct: Uint8ArrayToBits(cipher.slice(24, cipher.length - 1))
  }
  if (new TextDecoder().decode(cipher.slice(cipher.length - 1, cipher.length)) == '1')
    return decompress(sjcl.json.ia(key, data, { raw: 1 }))
  else return sjcl.json.ia(key, data)
}
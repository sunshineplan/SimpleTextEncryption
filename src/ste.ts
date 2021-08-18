import sjcl from 'sjcl'
import utils from './utils'

const concat = sjcl.bitArray.concat
const base64 = sjcl.codec.base64

export const encrypt = (key: string, plaintext: string) => {
  if (!key) return Buffer.from(plaintext, 'utf8').toString('base64').replace(/=/g, '')
  sjcl.misc.pa = {}
  const data = utils.compress(plaintext)
  const encrypted = sjcl.json.ja(key, data.content)
  return base64.fromBits(
    concat(
      concat(encrypted.salt, encrypted.iv),
      concat(encrypted.ct, data.compression)
    )
  ).replace(/=/g, '')
}

export const decrypt = (key: string, ciphertext: string) => {
  if (!key) return Buffer.from(ciphertext, 'base64').toString('utf8')
  const cipher = utils.BitsToUint8Array(base64.toBits(ciphertext))
  let data: sjcl.SjclCipherEncrypted = {
    salt: utils.Uint8ArrayToBits(cipher.slice(0, 8)),
    iv: utils.Uint8ArrayToBits(cipher.slice(8, 24)),
    ct: utils.Uint8ArrayToBits(cipher.slice(24, cipher.length - 1))
  }
  if (new TextDecoder().decode(cipher.slice(cipher.length - 1, cipher.length)) == '1')
    return utils.decompress(sjcl.json.ia(key, data, { raw: 1 }) as sjcl.BitArray)
  else return sjcl.json.ia(key, data) as string
}
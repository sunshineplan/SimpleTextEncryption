import sjcl from 'sjcl'
import pako from 'pako'

namespace utils {
  export const compress = (str: string) => {
    const uint8array = new TextEncoder().encode(str)
    const deflate = pako.deflate(uint8array)
    if (uint8array.length > deflate.length)
      return { content: Uint8ArrayToBits(deflate), compression: sjcl.codec.utf8String.toBits('1') }
    else return { content: Uint8ArrayToBits(uint8array), compression: sjcl.codec.utf8String.toBits('0') }
  }

  export const decompress = (bits: sjcl.BitArray) => {
    return pako.inflate(BitsToUint8Array(bits), { to: 'string' })
  }

  export const Uint8ArrayToBits = (uint8array: Uint8Array) => {
    let hex = ''
    for (let i = 0; i < uint8array.length; i++)
      hex += (uint8array[i] + 0xF00).toString(16).substr(1)
    return sjcl.codec.hex.toBits(hex)
  }

  export const BitsToUint8Array = (bits: sjcl.BitArray) => {
    const array: number[] = [], hex = sjcl.codec.hex.fromBits(bits)
    for (var i = 0; i < hex.length; i += 2)
      array.push(parseInt(hex.substr(i, 2), 16))
    return new Uint8Array(array)
  }
}

export default utils

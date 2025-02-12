import pako from 'pako'

namespace utils {
  export const compress = (str: string) => {
    const encoder = new TextEncoder()
    const uint8array = encoder.encode(str)
    const deflate = pako.deflate(uint8array)
    if (uint8array.length > deflate.length)
      return { content: deflate, compression: 1 }
    else return { content: uint8array, compression: 0 }
  }

  export const decompress = (data: ArrayBuffer) => {
    return pako.inflate(data, { to: 'string' })
  }
}

export default utils

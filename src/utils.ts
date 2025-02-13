import pako from 'pako'

namespace utils {
  export const random = (length: number) => {
    return crypto.getRandomValues(new Uint8Array(length))
  }
  export const base64encode = (s: string | Uint8Array) => {
    let array: number[]
    if (typeof s === 'string') array = Array.from(new TextEncoder().encode(s))
    else array = Array.from(s)
    return btoa(String.fromCharCode.apply(null, array))
  }
  export const base64decode = (base64: string) => {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0))
  }
  export const compress = (str: string) => {
    const uint8array = new TextEncoder().encode(str)
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

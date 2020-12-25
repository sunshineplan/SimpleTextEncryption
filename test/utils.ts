import sjcl from 'sjcl'
import utils from '../src/utils'

test('ConvertUint8Array&Bits', () => {
    const bits = sjcl.codec.utf8String.toBits('abc')
    const array = new Uint8Array([97, 98, 99])
    expect(utils.Uint8ArrayToBits(array)).toStrictEqual(bits)
    expect(utils.BitsToUint8Array(bits)).toStrictEqual(array)
})

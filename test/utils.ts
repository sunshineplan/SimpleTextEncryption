import crypto from 'crypto'
import sjcl from 'sjcl'
import utils from '../src/utils'

test('Compress&Decompress', () => {
    for (let i = 0; i < 100; i++) {
        const str = crypto.randomBytes(Math.floor((Math.random() * 10) + 1)).toString('hex')
        const c = utils.compress(str)
        expect(c.compression).toStrictEqual(sjcl.codec.utf8String.toBits('0'))
        expect(c.content).toStrictEqual(sjcl.codec.utf8String.toBits(str))
    }
    for (let i = 0; i < 100; i++) {
        const str = crypto.randomBytes(100 + (Math.random() * 100) + 1).toString('hex')
        const c = utils.compress(str)
        expect(c.compression).toStrictEqual(sjcl.codec.utf8String.toBits('1'))
        expect(utils.decompress(c.content)).toBe(str)
    }
})

test('ConvertUint8Array&Bits', () => {
    const bits = sjcl.codec.utf8String.toBits('abc')
    const array = new Uint8Array([97, 98, 99])
    expect(utils.Uint8ArrayToBits(array)).toStrictEqual(bits)
    expect(utils.BitsToUint8Array(bits)).toStrictEqual(array)
})

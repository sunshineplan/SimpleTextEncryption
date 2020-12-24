// Type definitions for sjcl v1.0.8
// Project: http://crypto.stanford.edu/sjcl/
// Definitions by: Eugene Chernyshov <https://github.com/Evgenus>, Vytautas Mizgiris <https://github.com/mizvyt>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export = sjcl;
export as namespace sjcl;

declare namespace sjcl {
    export var bitArray: BitArrayStatic;
    export var codec: SjclCodecs;
    export var misc: SjclMisc;
    export var json: SjclJson;

    // ________________________________________________________________________

    interface BitArray extends Array<number> { }

    interface BitArrayStatic {
        /// Concatenate two bit arrays.
        concat(a1: BitArray, a2: BitArray): BitArray;
    }

    // ________________________________________________________________________

    interface SjclCodec<T> {
        fromBits(bits: BitArray): T;
        toBits(value: T): BitArray;
    }

    interface SjclCodecs {
        utf8String: SjclCodec<string>;
        hex: SjclCodec<string>;
        base64: SjclCodec<string>;
    }

    // ________________________________________________________________________

    interface SjclMisc {
        _pbkdf2Cache: { password?: string }
    }

    // ________________________________________________________________________

    interface SjclCipherParams { }

    interface SjclCipherEncryptParams extends SjclCipherParams {
        salt: BitArray;
        iv: BitArray;
    }

    interface SjclCipherDecryptParams extends SjclCipherParams {
        salt?: BitArray;
        iv?: BitArray;
        raw?: number;
    }

    interface SjclCipherEncrypted extends SjclCipherEncryptParams {
        ct: BitArray;
    }

    interface SjclConvenienceEncryptor {
        (
            password: string,
            plaintext: BitArray,
        ): SjclCipherEncrypted;
    }

    interface SjclConvenienceDecryptor {
        (
            password: string,
            ciphertext: SjclCipherEncrypted,
            params?: SjclCipherDecryptParams,
        ): BitArray | string;
    }

    interface SjclJson {
        _encrypt: SjclConvenienceEncryptor;
        _decrypt: SjclConvenienceDecryptor;
    }
}

import { createHash } from 'crypto'


type Hashable = string | Buffer | Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array | DataView

/**
 * @description Hash content to hex string.
 * @param content Content to be hashed.
 * @param algo Optional. Hash algorithm. Defaults to `md5`.
 */
export function hash(content: Hashable, algo: string = 'md5'): string {
  return createHash('md5').update(content).digest('hex')
}

export default hash
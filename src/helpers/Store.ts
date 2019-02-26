import * as redis from 'redis'
import { promisify } from 'util'
import { Formatable } from '../global'


export function createClient(url: string = process.env.RD_URL): Promise<redis.RedisClient> {
  const client = redis.createClient(url)
  return new Promise((resolve, reject) => {
    client.on('error', err => reject(err))
    .on('connect', () => resolve(client))
  })
}

function stringify(value: Formatable | object) {
  if(typeof (value as any).toJSON == 'function') {
    return JSON.stringify((value as Formatable).toJSON())
  } else {
    return JSON.stringify(value)
  }
}

export class Store {
  client: redis.RedisClient
  url: string
  private _get: (key: string) => Promise<string | null>
  private _set: (key: string, value: string, mode?: string, duration?: number) => Promise<'OK'>
  private _del: (key: string) => Promise<0 | 1>
  private _flushdb: () => Promise<'OK'>

  constructor(url: string = process.env.RD_URL) {
    this.url = url
  }

  async init() {
    if(this.client) return
    const client = this.client = await createClient(this.url)
    this._get = promisify(client.get).bind(client)
    this._set = promisify(client.set).bind(client)
    this._del = promisify(client.del).bind(client)
    this._flushdb = promisify(client.flushdb).bind(client)
    return this
  }
  
  async get(key: string) {
    let res = await this._get(key)
    if(res != null) {
      return res
    } else return null
  }

  async getParsed(key: string) {
    let res = await this._get(key)
    if(res != null) {
      return JSON.parse(res)
    } else return null
  }

  async set(key: string, value: Formatable | object, expire: number = 0) {
    if(expire) await this._set(key, stringify(value), 'EX', expire)
    return await this._set(key, stringify(value))
  }

  async del(key: string) {
    return await this._del(key)
  }

  async flushdb() {
    return await this._flushdb()
  }

  async getAndSet(key: string, value: () => Promise<Formatable | object>, force: boolean = false, expire: number = 0) {
    if(force) {
      const val = await value()
      if(val != null) await this.set(key, val, expire)
      return val
    } else {
      let val: string | Formatable | object = await this.get(key)
      if(val == null) {
        val = await value()
        if(val != null) await this.set(key, val, expire)
      }
      return val as string
    }
  }
}

export default Store
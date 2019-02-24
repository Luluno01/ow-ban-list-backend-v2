import { Formatable } from '../global'
import { Context } from 'koa'
import Store from './Store'
import { Logger } from 'log4js'


export async function getAndCache(ctx: Context, key: string, value: () => Promise<Formatable | object>, force: boolean = false, expire: number = 0) {
  const store: Store = ctx.store
  const logger: Logger = ctx.logger
  return ctx.config.cache ? await store.getAndSet(key, async () => {
    logger.debug(`Cache missed, getting value for key ${key}`)
    return await value()
  }, force, expire) : await value()
}

export default getAndCache
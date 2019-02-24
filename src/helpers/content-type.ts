import { Context } from 'koa'


export function contentType(type: string = 'application/json') {
  if(!type) throw new TypeError('Content type is required')
  return async (ctx: Context, next: () => Promise<void>) => {
    await next()
    ctx.set('Content-Type', type)
  }
}

export default contentType
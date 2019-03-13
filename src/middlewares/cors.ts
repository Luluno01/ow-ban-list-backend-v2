import { Context } from 'koa'
import * as Koa from 'koa'
import * as _log4js from 'koa-log4'
import { Logger, Log4js } from 'log4js'
const log4js: Log4js = _log4js
import { Router } from '../global'


let CORS: string[]

export async function init(_: Koa, __: Router) {
  CORS = (process.env.CORS && process.env.CORS.split(',')) || null
  if(CORS) {
    log4js.getLogger('app').info(`Cross-origin allowed origin(s): ${CORS.join(', ')}`)
  }
}

export async function cors(ctx: Context, next: () => Promise<any>) {
  const origin = ctx.get('Origin')
  try {
    await next()
  } catch(err) {
    if(CORS && CORS.includes(origin)) {
      (ctx.logger as Logger).info(`Cross-origin request from origin ${origin}`)
      err.headers = err.headers || {}
      err.headers['Access-Control-Allow-Credentials'] = true
      err.headers['Access-Control-Allow-Origin'] = origin
    }
    throw err
  }
  if(CORS && CORS.includes(origin)) {
    (ctx.logger as Logger).info(`Cross-origin request from origin ${origin}`)
    ctx.set('Access-Control-Allow-Credentials', 'true')
    ctx.set('Access-Control-Allow-Origin', origin)
  }
}

export default cors
import Store from '../helpers/Store'
import { Router } from '../global'
import * as Koa from 'koa'
import * as _log4js from 'koa-log4'
import { Logger, Log4js } from 'log4js'
const log4js: Log4js = _log4js


export async function init(app: Koa, _: Router) {
  app.context.store = await (new Store).init()
  log4js.getLogger('app').info('Redis store enabled')
}
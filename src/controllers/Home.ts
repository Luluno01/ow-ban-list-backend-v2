import SimpleController from './SimpleController'
import { Method } from '../global'
import { Context } from 'koa'


export default class Home extends SimpleController {
  method: Method = 'get'
  pattern: string = '/'
  async handler(ctx: Context) {
    ctx.body = 'Thanks for using OW-BAN-LIST'
  }
}
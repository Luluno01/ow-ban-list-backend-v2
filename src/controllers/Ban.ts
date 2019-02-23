import SimpleController from './SimpleController'
import { Method } from '../global'
import { Context } from 'koa'
import MBan from '../models/BanBlock'


export default class Ban extends SimpleController {
  method: Method = 'get'
  pattern: string = '/bans/:id(\\d+)'
  async handler(ctx: Context) {
    const id = parseInt(ctx.params.id)
    ctx.assert(id, 400, 'Invalid ban block id')
    const ban = await MBan.findByPk(id) as typeof MBan
    ctx.assert(ban, 404, 'No such ban block')
    ctx.body = ban.toJSON()
  }
}
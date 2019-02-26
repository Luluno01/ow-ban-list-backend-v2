import SimpleController from './SimpleController'
import { Method } from '../global'
import { Context } from 'koa'
import MLastUpdate from '../models/LastUpdate'


export default class LastUpdate extends SimpleController {
  method: Method = 'get'
  pattern: string = '/last-update'
  async handler(ctx: Context) {
    let lastUpdate = await MLastUpdate.getUpdate()
    ctx.body = {
      announcementCount: lastUpdate.announcementCount,
      // err: lastUpdate.err,
      date: lastUpdate.date.getTime()
    }
  }
}
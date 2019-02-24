import { RouterController } from './RouterController'
import { Context } from 'koa'
import * as Router from 'koa-router'
import Ann, { TAnnouncement } from '../models/Announcement'
import { Logger } from 'log4js'
import BanBlock from '../models/BanBlock'
import getAndCache from '../helpers/getAndCache'
import contentType from '../helpers/content-type'
import LastUpdate from '../models/LastUpdate'


const router = new Router

router.use(contentType())

router.get('/:id(\\d+)', async (ctx: Context) => {
  const logger: Logger = ctx.logger
  const id = parseInt(ctx.params.id)
  ctx.assert(id, 400, 'Invalid announcement id')
  const ann = await getAndCache(ctx, `/announcements/${id}`, async () => await Ann.findByPk(id) as TAnnouncement) as string | TAnnouncement
  ctx.assert(ann, 404, 'No such announcement')
  ctx.body = typeof ann == 'string' ? ann : ann.toJSON()
})

router.get('/', async (ctx: Context) => {
  const logger = ctx.logger as Logger
  let { start, limit }: {
    start?: string | number,
    limit?: string | number
  } = ctx.query as { [key: string]: string }
  if(start) ctx.assert(start.match(/\d+/) && (start = parseInt(start)), 400, 'Invalid starting index')
  else start = 0
  if(limit) ctx.assert(limit.match(/\d+/) && (limit = parseInt(limit)) && limit && limit <= 20, 400, 'Invalid limit')
  else limit = 10

  const lastUpdate = await LastUpdate.getUpdate()
  ctx.body = await getAndCache(ctx, `/announcements?start=${start}&limit=${limit}&date=${lastUpdate.date.getTime()}`, async () => {
    const { rows, count } = await Ann.findAndCountAll({
      order: [ [ 'date', 'DESC' ] ],
      limit: limit as number,
      offset: start as number
    })
    ctx.assert(count > 0, 404, 'No announcements found')
    logger.debug(`${count} announcement(s) found, returning from ${start}, limit ${limit}`)
    ctx.assert(count > (start as number), 400, 'Starting index too large')
    ctx.body = {
      self: `start=${start}&limit=${limit}`,
      data: rows.map(ann => (ann as TAnnouncement).toJSON()),
      count
    }
    if(start) {
      // Has previous page
      let prevStart: number = (start as number) - (limit as number)
      let prevLimit: number = limit as number
      if(prevStart < 0) {
        prevLimit += prevStart
        prevStart = 0
      }
      ctx.body.prev = `start=${prevStart}&limit=${prevLimit}`
    }
    let nextStart: number = (start as number) + (limit as number)
    if(count > nextStart) {
      // Has next page
      ctx.body.next = `start=${nextStart}&limit=${limit}`
    }
    return ctx.body
  }, false, 24 * 3600 /* expire in a day */)
})

router.get('/:id(\\d+)/bans', async (ctx: Context) => {
  const logger = ctx.logger as Logger
  // Find announcement first
  const id = parseInt(ctx.params.id)
  ctx.assert(id, 400, 'Invalid announcement id')
  let ann = await getAndCache(ctx, `/announcements/${id}`, async () => await Ann.findByPk(id) as TAnnouncement) as string | TAnnouncement
  ctx.assert(ann, 404, 'No such announcement')
  if(typeof ann == 'string') ann = JSON.parse(ann) as TAnnouncement

  // TODO: code reuse
  let { start, limit }: {
    start?: string | number,
    limit?: string | number
  } = ctx.query as { [key: string]: string }
  if(start) ctx.assert(start.match(/\d+/) && (start = parseInt(start)), 400, 'Invalid starting index')
  else start = 0
  if(limit) ctx.assert(limit.match(/\d+/) && (limit = parseInt(limit)) && limit && limit <= 10, 400, 'Invalid limit')
  else limit = 5

  ctx.body = await getAndCache(ctx, `/announcements/${id}/bans?start=${start}&limit=${limit}`, async () => {
    let rows = await Ann.prototype.getBans.call(ann) as typeof BanBlock[]
    const count = rows.length
    ctx.assert(count > 0, 404, 'No ban blocks found for this announcement')
    const nextStart: number = (start as number) + (limit as number)
    rows = rows.slice(start as number, nextStart)
    logger.debug(`${count} ban block(s) for announcement ${id} found, returning from ${start}, limit ${limit}`)
    ctx.assert(count > (start as number), 400, 'Starting index too large')
    ctx.body = {
      self: `start=${start}&limit=${limit}`,
      data: rows.map(ban => (ban as typeof BanBlock).toJSON()),
      count
    }
    if(start) {
      // Has previous page
      let prevStart: number = (start as number) - (limit as number)
      let prevLimit: number = limit as number
      if(prevStart < 0) {
        prevLimit += prevStart
        prevStart = 0
      }
      ctx.body.prev = `start=${prevStart}&limit=${prevLimit}`
    }
    if(count > nextStart) {
      // Has next page
      ctx.body.next = `start=${nextStart}&limit=${limit}`
    }
    return ctx.body
  })
})

export default class Announcement extends RouterController {
  pattern: string = '/announcements'
  router: Router = router
}
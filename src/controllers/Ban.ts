import { RouterController } from './RouterController'
import { Context } from 'koa'
import * as Router from 'koa-router'
import MBan from '../models/BanBlock'


const router = new Router

router.get('/:id(\\d+)', async (ctx: Context) => {
  const id = parseInt(ctx.params.id)
  ctx.assert(id, 400, 'Invalid ban block id')
  const ann = await MBan.findByPk(id) as typeof MBan
  ctx.assert(ann, 404, 'No such ban block')
  ctx.body = ann.toJSON()
})

router.get('/', async (ctx: Context) => {
  ctx.assert('search' in ctx.query && ctx.query.search, 403, 'Ban blocks listing is available via searching only')
  try {
    let keyWords: string[] = JSON.parse(ctx.query.search)
    keyWords = keyWords.map(keyWord => {
      if(typeof keyWord != 'string' || keyWord.match(/^\s*$/)) throw new Error
      else return keyWord.trim()
    })
    let res = await MBan.search(keyWords)  // Results are limited to 100
    ctx.body = res.map(r => {
      return { ...r, date: r.date.getTime() }
    })
  } catch(err) {
    ctx.throw(400, 'Bad searching key words')
  }
})

export default class Ban extends RouterController {
  pattern: string = '/bans'
  router: Router = router
}
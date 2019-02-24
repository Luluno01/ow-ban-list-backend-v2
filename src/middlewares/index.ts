import * as Router from 'koa-router'
import * as cors from './cors'
import * as responseTime from './responseTime'


const middlewareModules = [
  cors,
  responseTime
]

export const middlewares = (() => middlewareModules.map(mod => mod.default))()

export default function installMiddlewares(router: Router) {
  for(const mod of middlewareModules) {
    mod.init()
    router.use(mod.default)
  }
}
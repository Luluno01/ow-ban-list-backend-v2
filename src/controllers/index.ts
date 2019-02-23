import { Controller } from '../global'
import SimpleController from './SimpleController'
import RouterController from './RouterController'
import * as Router from 'koa-router'
import Home from './Home'
import LastUpdate from './LastUpdate'
import Announcement from './Announcement'
import Ban from './Ban'


export const controllers: Controller[] = [
  new Home,
  new LastUpdate,
  new Announcement,
  new Ban
]

export function installControllers(router: Router) {
  for(let controller of controllers) {
    if(controller instanceof SimpleController) {
      router[controller.method](controller.pattern, controller.handler)
    } else if(controller instanceof RouterController) {
      router.use(controller.pattern, controller.router.routes(), controller.router.allowedMethods())
    }
  }
}

export default installControllers
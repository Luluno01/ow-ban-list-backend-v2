import { Controller } from '../global'
import SimpleController from './SimpleController'
import RouterController from './RouterController'
import * as Router from 'koa-router'
import Home from './Home'


export const controllers: Controller[] = [
  new Home
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
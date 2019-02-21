import { Context } from 'koa'
import { Method } from '../global'


export class SimpleController {
  method: Method
  pattern: string = '/'
  async handler(ctx: Context, next: () => Promise<any>): Promise<any> { throw new Error('Not implemented') }
}

export default SimpleController
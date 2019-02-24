/// <reference path="../ow-ban-list/src/global.d.ts"/>
import SimpleController from './controllers/SimpleController'
import RouterController from './controllers/RouterController'
import * as Koa from 'koa'
import { Context } from 'koa'
import * as KoaRouter from 'koa-router'


declare type Method = 'get' | 'post' | 'put' | 'del' | 'all'
declare type Controller = SimpleController | RouterController
declare interface Formatable {
  toJSON(): object
}
declare type Router = KoaRouter
declare interface MiddlewareModule {
  init?(app: Koa, router: Router): Promise<void>
  default?(ctx: Context, next: () => Promise<any>): Promise<void>
}
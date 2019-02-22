/// <reference path="../ow-ban-list/src/global.d.ts"/>
import SimpleController from "./controllers/SimpleController"
import RouterController from "./controllers/RouterController"


declare type Method = 'get' | 'post' | 'put' | 'del' | 'all'
declare type Controller = SimpleController | RouterController
import { resolve } from 'path'
import Router from 'koa-router'
import glob from 'glob'
import _ from 'lodash'

let routeMap = new Map()
export const prefix = Symbol('prefix')

export const isArray = c => _.isArray(c) ? c : [c]

export class Route {
  constructor (app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new Router()
  }
  init () {
    // import('../routes/wechat')
    glob.sync(resolve(this.apiPath, './*.js')).forEach(require)
    // console.log(routeMap)
    for (let [ conf, controller ] of routeMap) {
      const controllers = isArray(controller)
      let prefixPath = conf.target[prefix]
      const routerPath = prefixPath + conf.path

      this.router[conf.method](routerPath, ...controllers)
    }

    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}

// 第一段路由拼接给下一个路由方法 class上@
export const controller = path => target => {
  target.prototype[prefix] = path
}

// 添加到route队列
export const addRoute = config => (target, key) => {
  var method = target[key] // 方法 被@的方法
  routeMap.set({
    target,
    ...config
  }, method)
}

export const get = path => addRoute({
  method: 'get',
  path
})

export const post = path => addRoute({
  method: 'post',
  path
})

export const put = path => addRoute({
  method: 'put',
  path
})

export const del = path => addRoute({
  method: 'del',
  path
})

export const all = path => addRoute({
  method: 'all',
  path
})

const decorate = (args, middleware) => {
  let [ target, key, descriptor ] = args

  target[key] = isArray(target[key])
  target[key].unshift(middleware)

  return descriptor
}

export const convert = middleware => (...args) => decorate(args, middleware)

export const required = rules => convert(async (ctx, next) => {
  let errors = []
  _.forEach(rules, (_item, key) => {
    _.forEach(_item, item => {
      if (!_.has(ctx.request[key], item)) {
        console.log('item', item, ctx.request[key])
        errors.push(item)
      }
    })
  })
  // console.log(rules, errors)
  if (errors.length) ctx.throw(412, `${errors.join(',')} is required`)
  await next()
})

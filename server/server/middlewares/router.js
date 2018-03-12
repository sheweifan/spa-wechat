import { resolve } from 'path'
import { Route } from '../decorators/router'
// http://ntest.free.ngrok.cc/wechat-redirect?a=1&b=2

export const router = app => {
  const apiPath = resolve(__dirname, '../routes')
  const route = new Route(app, apiPath)
  route.init()
}

// export const router = app => {
//   const router = new Router()
//   router.all('/wechat-hear', wechatMiddle(config.wechat, reply))
//   router.all('/wechat-signature', signature)
//   router.all('/wechat-redirect', redirect)
//   router.all('/wechat-oauth', oauth)
  
//   app.use(router.routes())
//   app.use(router.allowedMethods())
// }


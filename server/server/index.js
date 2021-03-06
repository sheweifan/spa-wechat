import Koa from 'koa'
// import { Nuxt, Builder } from 'nuxt'
import { resolve } from 'path'
import _ from 'lodash'

// let config = require('../nuxt.config.js')
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const MIDDLEWARES = ['cors', 'database', 'router']

class Server {
  constructor() {
    this.app = new Koa()
    this.useMiddleWare(this.app, MIDDLEWARES);
  }
  useMiddleWare(app, arr) {
    return _.map(arr, (item)=>{
      const _path = `${resolve(__dirname, './middlewares')}/${item}`;
      const _middle = require(_path);
      return _.map(_middle, function(item){
        item(app);
      })
    })
  }
  async start() {
    const app = this.app;
    // Import and Set Nuxt.js options
    // config.dev = !(app.env === 'production')

    // Instantiate nuxt.js
    // const nuxt = new Nuxt(config)

    // Build in development
    // if (config.dev) {
    //   const builder = new Builder(nuxt)
    //   builder.build().catch(e => {
    //     console.error(e) // eslint-disable-line no-console
    //     process.exit(1)
    //   })
    // }

    // app.use(ctx => {
    //   ctx.status = 200 // koa defaults to 404 when it sees that status is unset

    //   return new Promise((resolve, reject) => {
    //     ctx.res.on('close', resolve)
    //     ctx.res.on('finish', resolve)
    //     nuxt.render(ctx.req, ctx.res, promise => {
    //       // nuxt.render passes a rejected promise into callback on error.
    //       promise.then(resolve).catch(reject)
    //     })
    //   })
    // })

    app.listen(port, host)
    console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console

  }
}


const app = new Server()
app.start();

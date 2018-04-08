import koaCors from 'koa2-cors'
export const cors = app => {
  console.log('cors middleware')
  app.use(koaCors({
    origin: function (ctx) {
        return '*'
        // if (ctx.url === '/test') {
        //     return "*"; // 允许来自所有域名请求
        // }
        // return 'http://localhost:8080'; / 这样就能只允许 http://localhost:8080 这个域名的请求了
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  }))
}

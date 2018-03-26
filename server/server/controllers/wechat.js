import { parse as urlParse } from 'url'
import { parse as queryParse } from 'querystring'
import * as api from '../api'
import config from '../config'

export async function signature (ctx, next){
  let url = ctx.query.url
  console.log(ctx.query)
  if(!url) ctx.throw(404)
  url = decodeURIComponent(url)
  const data = await api.getSignaturAsync(url)
  ctx.body = {
    data,
    success: true
  }

}

export async function redirect (ctx, next){
  const target = config.SITE_ROOT_URL + '/oauth'
  const scope = 'snsapi_userinfo'
  const { a = 0, b = 0, to } = ctx.query
  const params = `${a}_${b}`
  // const params = ``

  const url = await api.getAuthorizeURL(scope, to, params)

  // ctx.redirect(url)
  ctx.body = {
    url,
    success: true
  }
}

export async function oauth (ctx, next){
  let url = ctx.query.url
  if(!url) ctx.throw(404)

  url = decodeURIComponent(url)

  const urlObj = urlParse(url)

  const { code } = queryParse(urlObj.query)

  const user = await api.getUserByCode(code)

  console.log(user)

  ctx.body = {
    success: true,
    data: user
  }
}


export async function getUserByCode (ctx, next){
  const { code } = ctx.query
  const user = await api.getUserByCode(code)
  ctx.body = {
    success: !!user.openid,
    data: user
  }
}

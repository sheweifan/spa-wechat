import config from '../config'
import wechatMiddle from '../wechat-lib/middleware'
import reply from '../wechat/reply'
import { signature, redirect, oauth, getUserByCode } from '../controllers/wechat'
import { controller, all } from '../decorators/router'

// export const router = app => {
//   router.all('/wechat-hear', )
//   router.all('/wechat-signature', signature)
//   router.all('/wechat-redirect', redirect)
//   router.all('/wechat-oauth', oauth)
// }

@controller('')
export class Wechat{
  @all('/wechat-hear')
  async hear(ctx, next){
    await wechatMiddle(config.wechat, reply)(ctx, next)
  }
  @all('/wechat-signature')
  async signature(ctx, next){
    await signature(ctx, next)
  }
  @all('/wechat-redirect')
  async redirect(ctx, next){
    await redirect(ctx, next)
  }
  @all('/wechat-oauth')
  async oauth(ctx, next){
    await oauth(ctx, next)
  }
  @all('/wechat-getUserByCode')
  async getUserByCode(ctx, next){
    await getUserByCode(ctx, next)
  }
}

 
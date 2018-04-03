import axios from 'axios'
import { prefix } from '@/config'
import store from '@/store'
import { os } from '@/util'
const wx = window.wx
let Wechat = {}

Wechat.install = (Vue, options) => {
  let confined = false
  const wxConfig = () => new Promise((resolve, reject) => {
    // iOS：用第一次进入页面后的 window.location.href.split('#')[0] 请求一次 js_ticket，config 一次，并在每一页设置分享信息。
    // Android: 每次用新的 URL 请求 js_ticket，config 并 设置分享信息。
    const url = os.isIOS ? store.state.entry : window.location.href
    if (os.isAndroid || !confined) {
      return axios.get(prefix + '/wechat-signature', {
        params: {
          url: url.split('#')[0]
        }
      })
        .then(res => {
          const {data, success} = res.data
          const {
            appId,
            noncestr,
            signature,
            timestamp
          } = data
          if (success) {
            wx.config({
              debug: true,
              appId,
              timestamp,
              signature,
              nonceStr: noncestr,
              jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage'
              ]
            })
            confined = true
            resolve()
          }
        })
    } else {
      resolve()
    }
  })

  Vue.prototype.wxShare = (config) => {
    wxConfig().then(() => {
      wx.ready(() => {
        wx.onMenuShareTimeline({
          ...config,
          success: config.success.bind(null, {
            api: 'onMenuShareTimeline',
            desc: '分享到朋友圈成功'
          }),
          cancel: config.cancel.bind(null, {
            api: 'onMenuShareTimeline',
            desc: '分享到朋友圈取消'
          })
        })

        wx.onMenuShareAppMessage({
          ...config,
          success: config.success.bind(null, {
            api: 'onMenuShareAppMessage',
            desc: '分享给朋友成功'
          }),
          cancel: config.cancel.bind(null, {
            api: 'onMenuShareAppMessage',
            desc: '分享给朋友取消'
          })
        })
      })
    })
  }
}

export default Wechat

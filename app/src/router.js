import Vue from 'vue'
import axios from 'axios'
import Router from 'vue-router'
import share from '@/container/share.vue'
import home from '@/container/home.vue'
import store from '@/store'
import { urlParse } from '@/util'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: home
    },
    {
      path: '/share',
      component: share
    }
  ],
  mode: 'history'
})

// router.beforeEach((to, from, next) => {
//   const url = window.location.href
//   const encodeUrl = encodeURIComponent(url.split('#')[0])
//   const { code } = urlParse(url)
//   if (!code) {
//     window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${''}&redirect_uri=${encodeUrl}&response_type=code&scope=snsapi_userinfo`
//   } else {
//     axios.get('http://2bja3s.natappfree.cc/wechat-getUserByCode', {
//       params: {
//         code
//       }
//     })
//       .then(data => {
//         const user = data.data.data
//         store.dispatch('updateUserinfo', user)
//       })
//   }
// })

export default router

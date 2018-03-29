import Vue from 'vue'
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

const redirect = () => {
  const url = window.location.href.split('#')[0]
  const urlParmas = urlParse(url)
  let query = ''
  for (let key in urlParmas) {
    if (key !== 'state' && key !== 'code' && urlParmas.hasOwnProperty(key)) {
      query += `&${key}=${urlParmas[key]}`
    }
  }
  query = query.replace('&', '?')
  window.sessionStorage.setItem('isLogined', true)
  store.dispatch('redirect', {
    to: url.split('?')[0] + query
  })
}

router.beforeEach((to, from, next) => {
  const url = window.location.href.split('#')[0]
  const { code } = urlParse(url)
  const isLogined = window.sessionStorage.getItem('isLogined')
  const { userinfo } = store.state
  store.dispatch('markEntry', url)
  if (!isLogined || (!code && userinfo == null)) {
    redirect()
  } else {
    !userinfo && store.dispatch('updateUserinfo', code).catch(redirect)
    next()
  }
})

router.afterEach((to, from) => {

})

export default router

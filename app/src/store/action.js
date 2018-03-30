import axios from 'axios'
import { prefix } from '@/config'

export const updateUserinfo = ({commit}, code) => axios.get(prefix + '/wechat-getUserByCode', {
  params: { code }
})
  .then(res => {
    const { data, success } = res.data
    if (success) {
      commit('updateUserinfo', data)
      return Promise.resolve(data)
    } else {
      return Promise.reject(data)
    }
  })

export const redirect = ({commit}, params = {a: 1, b: 2}) => axios.get(prefix + '/wechat-redirect', {
  params
})
  .then(data => {
    const { url, success } = data.data
    if (success) {
      window.location.href = url
    }
  })

export const markEntry = ({commit}, url = window.location.href) => {
  commit('markEntry', url)
}

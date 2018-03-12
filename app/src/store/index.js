import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutation'
import * as actions from './action'
import getters from './getter'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userinfo: null
  },
  actions,
  getters,
  mutations
})

export default store

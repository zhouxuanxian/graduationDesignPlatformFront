import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import {localStorage} from '../utils/multiStore'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment: state => {
      const obj = state
      obj.count += 1
    },
    decrement: state => {
      const obj = state
      obj.count -= 1
    }
  },
  plugins: [
    createPersistedState({
      storage: localStorage
    })
  ]
})

export default store

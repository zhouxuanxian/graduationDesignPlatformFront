import Vue from 'vue'
import App from './App'
import MpRouterPatch from 'mpvue-router-patch'
import {localStorage} from './utils/multiStore'

import flyio from './utils/fly'

Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$fly = flyio
Vue.prototype.$storage=localStorage

const app = new Vue(App)
Vue.use(MpRouterPatch)
app.$mount()

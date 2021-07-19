import Vue from 'vue'
import './plugins/axios'
// import Fragment from 'vue-fragment'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/css/global.scss'

// Vue.use(Fragment.Plugin)
Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount('#app')

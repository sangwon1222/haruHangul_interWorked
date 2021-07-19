import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate' // https://uxgjs.tistory.com/207

// import modeCheck from './modeCheck'
import popup from './popup'
import cardView from './cardView'
import parentPage from './parentPage'
import oneday from './oneday'
import timer from './timer'

const modules = {
  // modeCheck,
  popup,
  cardView,
  parentPage,
  oneday,
  timer
}
const plugins = [
  createPersistedState({
    paths: ['timer']
  })
]

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins
})

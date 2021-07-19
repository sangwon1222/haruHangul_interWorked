const initialState = {
  alert: {
    visible: false,
    state: ''
  }
}

const mutations = {
  ALERT_POPUP_CLOSE(state) {
    state.alert.visible = false
    state.alert.state = ''
  },
  ALERT_POPUP_OPEN(state, value) {
    state.alert.visible = true
    state.alert.state = value
    // console.log('state.alert=>', state, value)
  }
}

const actions = {
  alertPopupClose({ commit }) {
    commit('ALERT_POPUP_CLOSE')
  },
  alertPopupOpen({ commit }, $data) {
    commit('ALERT_POPUP_OPEN', $data)
  }
}

export default {
  // strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  state: {
    ...initialState
  },
  mutations,
  actions
}

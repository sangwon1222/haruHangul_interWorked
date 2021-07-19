const initialState = {
  onday: {}
}

const mutations = {
  ONEDAY_UPDATE(state, value) {
    state.onday = value.result
    // console.log('state.onday', state.onday)
  }
}

const actions = {
  ondayUpdate({ commit }, $data) {
    commit('ONEDAY_UPDATE', $data)
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

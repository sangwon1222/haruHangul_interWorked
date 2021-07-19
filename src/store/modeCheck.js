const initialState = {
  viewMode: 'pc'
}

const mutations = {
  UPDATE_ID(state, value) {
    state.viewMode = value
  }
}

const actions = {
  updateId({ commit }, $data) {
    commit('UPDATE_ID', $data)
  }
}

const getters = {
  getMode: (state) => '게터 ' + state.viewMode
}

export default {
  // strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  state: {
    ...initialState
  },
  mutations,
  actions,
  getters
}

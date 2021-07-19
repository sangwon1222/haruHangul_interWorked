const initialState = {
  saveTime: 0
  // startTime: false
}

const mutations = {
  TIME_SAVE(state, value) {
    if (state.saveTime !== 'limit') {
      state.saveTime = value
    }
    if (value === 'reset') {
      state.saveTime = value
    }
    // console.log('변경', state.saveTime)
  }
}

const actions = {
  // timeStart({ commit }) {
  //   commit('TIME_START')
  // },
  timeSave({ commit }, $data) {
    commit('TIME_SAVE', $data)
    // console.log('$data', $data)
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

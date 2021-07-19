const initialState = {
  userInfo: {},
  report: {},
  listen: {},
  read: {},
  write: {},
  listenIndex: 0,
  readIndex: 0,
  writeIndex: 0
}

const mutations = {
  REPORT_UPDATE(state, value) {
    state.report = value
    state.listen = state.report.achievements.filter((w) => w.name === '듣기')
    state.read = state.report.achievements.filter((w) => w.name === '읽기')
    state.write = state.report.achievements.filter((w) => w.name === '쓰기')
    if (state.listen[0]) {
      state.listenIndex = parseInt(state.listen[0].score / 10)
      state.readIndex = parseInt(state.read[0].score / 10)
      state.writeIndex = parseInt(state.write[0].score / 10)
    }
  },
  USER_INFO_UPDATE(state, value) {
    state.userInfo = value.result
  }
}

const actions = {
  reportUpdate({ commit }, $data) {
    commit('REPORT_UPDATE', $data)
  },
  userinfoUpdate({ commit }, $data) {
    commit('USER_INFO_UPDATE', $data)
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

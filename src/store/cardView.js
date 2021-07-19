const initialState = {
  popup: {
    visible: false,
    letter: 0
  },
  viewList: [],
  imgView: true,
  txtView: true
}

const mutations = {
  POPUP_CLOSE(state) {
    state.popup.visible = false
  },
  VIEW_CHNAGE(state, value) {
    value === 'img'
      ? (state.imgView = !state.imgView)
      : (state.txtView = !state.txtView)
  },
  POPUP_OPEN(state, value) {
    state.popup.visible = true
    state.popup.letter = value
  },
  VIEW_LIST_UPDATE(state, value) {
    state.viewList = value
  }
}

const actions = {
  popupClose({ commit }) {
    commit('POPUP_CLOSE')
  },
  viewChange({ commit }, $data) {
    commit('VIEW_CHNAGE', $data)
  },
  popupOpen({ commit }, $data) {
    commit('POPUP_OPEN', $data)
  },
  viewListUpdate({ commit }, $data) {
    commit('VIEW_LIST_UPDATE', $data)
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

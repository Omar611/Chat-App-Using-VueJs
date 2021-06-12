import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  currentUser: null,
  cuurentChannel: null,
  isPrivate: false,
}
const mutations = {
  SET_USER(state, user) {
    state.currentUser = user
  },
  SET_CUURENT_CHANNEL(state, channel) {
    state.cuurentChannel = channel
  },
  SET_PRIVATEL(state, isPrivate) {
    state.isPrivate = isPrivate
  },
}
const actions = {
  setUser({ commit }, user) {
    commit('SET_USER', user)
  },
  setCurrentChannel({ commit }, channel) {
    commit('SET_CUURENT_CHANNEL', channel);
  },
  setPrivate({ commit }, isPrivate) {
    commit('SET_PRIVATEL', isPrivate);
  },
}
const getters = {
  getCurrentUser: state => state.currentUser,
  getCurrentChannel: state => state.cuurentChannel,
  isPrivate: state => state.isPrivate,
}

const store = new Vuex.Store({
  state, mutations, actions, getters
})

export default store

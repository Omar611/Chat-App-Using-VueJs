import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  currentUser: null,
  cuurentChannel: null,
}
const mutations = {
  SET_USER(state, user){
    state.currentUser = user
  },
  SET_CUURENT_CHANNEL(state, channel){
    state.cuurentChannel = channel
  }
}
const actions = {
  setUser({commit}, user){
    commit('SET_USER', user)
  },
  setCurrentChannel({commit}, channel) {
    commit('SET_CUURENT_CHANNEL', channel);
  }

}
const getters = {
  getCurrentUser: state => state.currentUser,
  getCurrentChannel: state => state.cuurentChannel,
}

const store = new Vuex.Store({
  state, mutations, actions, getters
})

export default store

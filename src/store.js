import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  currentUser: null,
}
const mutations = {
  SET_USER(state, user){
    state.currentUser = user
  }
}
const actions = {
  setUser({commit}, user){
    commit('SET_USER', user)
  }
}
const getters = {
  getCurrentUser: state => state.currentUser,
}

const store = new Vuex.Store({
  state, mutations, actions, getters
})

export default store

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  currentUser: "Omar Tarek",
}
const mutations = {

}
const actions = {

}
const getters = {
  getCurrentUser: state => state.currentUser,
}

const store = new Vuex.Store({
  state, mutations, actions, getters
})

export default store

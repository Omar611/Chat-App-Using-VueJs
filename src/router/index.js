import Vue from 'vue'
import Router from 'vue-router'
import chat from '@/pages/chat'
import login from '@/pages/login'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'chat',
      component: chat
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
  ],
  mode: 'history',
})

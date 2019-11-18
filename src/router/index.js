
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Login from '~/views/Login.vue'
import NotFound from '~/views/404.vue'

var constantRouterMap= [
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
]

export default new Router({
  routes: constantRouterMap
})

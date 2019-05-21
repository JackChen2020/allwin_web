import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

import store from './store'
import Vuex from 'vuex'

import router from '~/router'

import '~/icons'

import basicContainer from './components/basic-container/main'

import '~/global'//全局
import '~/promission'

import 'font-awesome/css/font-awesome.min.css'
import md5 from 'js-md5'


import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/theme-chalk/index.css';

Vue.use(Avue);

Vue.use(ElementUI)
Vue.use(Vuex)

Vue.component('basicContainer', basicContainer)

Vue.prototype.$md5 = md5;


// const router = new VueRouter({
//     constantRouterMap
// })
//
// router.beforeEach((to, from, next) => {
//     //NProgress.start();
//     if (to.path == '/login') {
//         localStorage.authorization = ""
//     }
//     let authorization = localStorage.authorization
//     if (!authorization && to.path != '/login') {
//         next({ path: '/login' })
//     } else {
//         next()
//     }
// })

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')


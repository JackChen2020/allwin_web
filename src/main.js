
import Vue from 'vue'
import Element from 'element-ui'
import App from './App.vue'
import store from './store'
import router from '~/router'
import '~/icons'
import basicContainer from './components/basic-container/main'
import '~/global'//全局
import '~/promission'
import md5 from 'js-md5'


Vue.use(window.AVUE)
Vue.use(Element)

Vue.component('basicContainer', basicContainer)

Vue.prototype.$md5 = md5;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')


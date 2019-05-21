

import Login from '../views/Login.vue'
import NotFound from '../views/404.vue'
// import Home from './views/Home'
// import test from './views/test/test'
// import test1 from './views/test1/test1'
// import logquery from './views/models/manage/logquery'
// import manageadd from './views/models/manage/add'
// import paypass from './views/models/pay/paypass'
// import waitbn from './views/models/business/waitbn'
// import bnlist from './views/models/business/bnlist'
// import agentadd from './views/models/agent/agentadd'
// import agentlist from './views/models/agent/agentlist'
// import paytype from './views/models/pay/paytype'

import Router from 'vue-router'
Vue.use(Router)

let routes = [
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
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '首页',
    //     iconCls: 'el-icon-s-home',
    //     children: [
    //         { path: '/test', component: test, iconCls: 'el-icon-s-home',name: '测试' },
    //         { path: '/test1', component: test1, name: '测试1' },
    //     ]
    // },
    // {
    //     path: '/manage',
    //     component: Home,
    //     name: '管理员管理',
    //     iconCls: 'el-icon-s-platform',
    //     children: [
    //         { path: '/logquery', component: logquery ,name: '登录日志' },
    //         { path: '/add', component: manageadd ,name: '添加管理员' },
    //     ]
    // },
    // {
    //     path: '/business',
    //     component: Home,
    //     name: '商户管理',
    //     iconCls: 'el-icon-s-shop',
    //     children: [
    //         { path: '/waitbn', component: waitbn ,name: '待审核商户' },
    //         { path: '/bnlist', component: bnlist ,name: '商户列表' }
    //     ]
    // },
    // {
    //     path: '/agent',
    //     component: Home,
    //     name: '代理人管理',
    //     iconCls: 'el-icon-s-shop',
    //     children: [
    //         { path: '/agentadd', component: agentadd ,name: '待审核代理人' },
    //         { path: '/agentlist', component: agentlist ,name: '代理人列表' }
    //     ]
    // },
    // {
    //     path: '/pay',
    //     component: Home,
    //     name: '支付管理',
    //     iconCls: 'el-icon-s-finance',
    //     children: [
    //         { path: '/paypass', component: paypass ,name: '支付渠道' },
    //         { path: '/paytype', component: paytype ,name: '支付方式' }
    //     ]
    // },
]

export default new Router({
    routes: routes
})

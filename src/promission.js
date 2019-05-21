
import router from './router/index'
import store from './store'

import {getToken, filterAsyncRouter} from '~/api/utils'
import {get_menu} from "~/api/request/request";
import NotFound from "~/views/404";

router.beforeEach((to, from, next) => {


    // console.log("document:",document)
    // document.content = "width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
    const hasToken = getToken()
    // console.log("hasToken:",hasToken)
    if (hasToken && hasToken!='null') {

        if (to.path == '/'){
            next({path : '/dashboard'})
        }

        const hasRouters = store.state.routers && store.state.routers.length > 0
        // console.log("hasRouters",store.state.routers,hasRouters)
        if (hasRouters){
            next()
        }else{

            get_menu({
                callback : (res) => {
                    store.commit('handlerRouters',filterAsyncRouter(res.data.data.router))

                    let accessRoutes = store.state.routers
                    accessRoutes.push({
                        path: '*',
                        component: NotFound,
                        name: '',
                        hidden: true
                    })
                    router.addRoutes(accessRoutes)
                    next({ ...to, replace: true })
                }
            })
        }
    }else{
        // console.log(to.path)
        if (to.path != '/login'){
            next({ path: '/login' })
        } else {
            next()
        }
    }
})

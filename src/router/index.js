import Vue from 'vue';
import Router from 'vue-router';
import fast_routes from './temp/fast_detail';
Vue.use( Router );

let routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/login',
        component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue' ),
        meta: { title: '登录' }
    },
    {
        path: '/',
        component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue' ),
        meta: { title: '自述文件1' },
        children: [
            {
                path: '/dashboard',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue' ),
                meta: { title: '系统首页' }
            }
        ]
    }
]
routes[ 2 ].children.push( ...fast_routes )
routes.push( {
    path: '*',
    name: '/404',
    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue' )
} )


console.log( routes )
let router = new Router( {
    routes: routes
} );
router.addRoutes( routes )
export default router
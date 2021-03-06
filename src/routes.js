import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import store from './store'
import {userRoutes} from './modules/user/UserRoutes'
import {appRoutes} from './modules/app/AppRoutes'
import {customizationRoutes} from './modules/customization/CustomizationRoutes'

const routes = [
    ...appRoutes,
    ...userRoutes,
    ...customizationRoutes
]

const router = new VueRouter({
    mode: 'history',
    routes: routes
})


router.beforeEach((to, from, next) => {

    //CHECK Authentication and Identity to me
    store.dispatch('checkAuth')

    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.

        if (!store.getters.isAuth) {

            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        } else {


            if (to.meta.role && !store.getters.hasRole(to.meta.role)) {
                next({path: '/', query: {redirect: to.fullPath}})
            } else if (to.meta.permission && !store.getters.hasPermission(to.meta.permission)) {
                next({path: '/', query: {redirect: to.fullPath}})
            }else{
                next()
            }

        }
    } else {
        next() // make sure to always call next()!
    }
})


export default router

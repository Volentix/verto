import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store/index.js'
import otherRoutes from './routes'
import login from './login'
import getVtx from './getVtx'
import wallet from './wallet'

const routes = [
  ...otherRoutes,
  ...getVtx,
  ...login,
  ...wallet
]
if (process.env.MODE !== 'ssr') {
  otherRoutes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}
Vue.use(VueRouter)
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes: routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    next()
  })

  Router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.needskeyscreated)) {
      if (!store.state.currentwallet || !store.state.currentwallet.config.keys || store.state.currentwallet.config.keys.length < 1) {
        next({
          path: '/create-wallet-options'
        })
      } else {
        next()
      }
    } else if (to.matched.some(record => record.meta.authRequired)) {
      if (!store.state.currentwallet || store.state.currentwallet.loggedIn === false) {
        next({
          path: '/login',
          params: { nextUrl: to.fullPath }
        })
      } else {
        next()
      }
    } else {
      next()
    }
  })

  return Router
}

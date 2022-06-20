import Vue from 'vue'
import VueRouter from 'vue-router'
import Lib from '@/util/walletlib'
import store from '../store/index.js'
import otherRoutes from './routes'
import login from './_login'
import wallet from './wallet'
const allRoutes = {
  spa: [...otherRoutes], // Staider
  pwa: [ // verto
    ...login,
    ...wallet
  ],
  bex: [ // browser extension
    ...login,
    ...wallet
  ]
}

const routes = allRoutes[process.env.MODE]
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
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => {
    console.log(err, 'err')
    if (err.name !== 'NavigationDuplicated') throw err
  })
}
export const Router = new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes: routes,

  // Leave these as is and change from quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE
})

export default function (/* { store, ssrContext } */) {
  // Router.beforeEach((to, from, next) => {
  //   next()
  // })

  Router.beforeEach((to, from, next) => {
    const appStarted = sessionStorage.getItem('app_started')
    const routerLoaded = sessionStorage.getItem('router_loaded')
    // const lastRoute = localStorage.getItem('last_route') ? JSON.parse(localStorage.getItem('last_route')) : null
    let params = Object.assign({}, from.params)

    if (params.asset) {
      params.asset = Lib.removePrivateData([params.asset])[0]
    }

    if (params.assets) {
      params.assets = Lib.removePrivateData(params.assets)
    }
    const fromRoute = {
      name: from.name,
      params: params,
      query: from.query,
      meta: from.meta,
      path: from.path
    }
    try {
      localStorage.setItem('prev_route', JSON.stringify(fromRoute))
    } catch (error) {
      console.log(error)
    }

    if (appStarted != null && routerLoaded != null && ['connectv1', 'receive'].includes(to.name)) {
      try {
        params = Object.assign({}, to.params)

        if (params.asset) {
          params.asset = Lib.removePrivateData([params.asset])[0]
        }

        if (params.assets) {
          params.assets = Lib.removePrivateData(params.assets)
        }
        const route = {
          name: to.name,
          params: params,
          query: to.query,
          meta: to.meta,
          path: to.path
        }
        localStorage.setItem('last_route', JSON.stringify(route))
      } catch (error) {
        console.log(error)
      }
    }
    if (to.matched.some(record => record.meta.needskeyscreated)) {
      if (!store.state.currentwallet || !store.state.currentwallet.config.keys || store.state.currentwallet.config.keys.length < 1) {
        next({
          // Password set but no wallet
          path: '/create-password'
        })
      } else {
        next()
      }
    } else if (to.matched.some(record => record.meta.authRequired)) {
      if (!store.state.currentwallet || store.state.currentwallet.loggedIn === false) {
        next({
          name: 'login',
          params: { nextUrl: to.path }
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

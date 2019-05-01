import Vue from 'vue'
import Vuex from 'vuex'

// we first import the module
import currentwallet from './currentwallet'
import settings from './settings'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    // then we reference it
    currentwallet,
    settings
  }
})

// if we want some HMR magic for it, we handle
// the hot update like below. Notice we guard this
// code with "process.env.DEV" -- so this doesn't
// get into our production build (and it shouldn't).
if (process.env.DEV && module.hot) {
  module.hot.accept(['./currentwallet', './settings'], () => {
    const newCurrentwallet = require('./currentwallet').default
    const newSettings = require('./settings').default
    store.hotUpdate({ modules: { currentwallet: newCurrentwallet, settings: newSettings } })
  })
}

export default store

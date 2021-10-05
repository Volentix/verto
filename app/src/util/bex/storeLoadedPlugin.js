import configManager from '@/util/ConfigManager'
import { Router } from '../../router'

export default function storeLoadedPlugin (store) {
  const whitelist = ['vweReplaceState']
  store.subscribe(async (mutation, state) => {
    if (whitelist.includes(mutation.type)) {
      if (localStorage.getItem('sync_data')) {
        Router.push({
          name: 'syncExtensionWallet'
        })
      } else {
        if (state.currentwallet && state.currentwallet.loggedIn === true) {
          Router.push({
            path: '/verto/dashboard'
          })
        } else {
          const hasConfig = !!await configManager.hasVertoConfig()
          if (!hasConfig) {
            Router.push({
              name: 'setup',
              params: {
                showConfigStep: true
              }
            })
          } else {
            Router.push({
              name: 'login'
            })
          }
        }
      }
      document.querySelector('#preloader').style.display = 'none'
    }
  })
}

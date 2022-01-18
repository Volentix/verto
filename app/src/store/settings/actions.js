/*
export function someAction (context) {
}
*/
import { Notify } from 'quasar'
import axios from 'axios'
import initWallet from '@/util/Wallets2Tokens'
import {
  version
} from '../../../package.json'
export const setAirplaneMode = ({ commit }, data) => {
  commit('setAirplaneMode', data)
}

export const toggleNetwork = ({ commit }, data) => {
  commit('toggleNetwork', data)
}

export const temporary = ({ commit }, data) => {
  commit('temporary', data)
}

export const rightOrder = ({ commit }, data) => {
  commit('rightOrder', data)
}
const versionToInt = (version) => {
  return parseInt(version.toString().split('.').join(''))
}
export const getSettings = ({ commit }, data) => {
  axios.get('https://cpu.volentix.io/api/global/vertoSettings').then(response => {
    let settings = response.data
    if (!settings || settings.error) {
      settings = localStorage.getItem('globalSettings')
      if (settings) settings = JSON.parse(settings)
    } else {
      if (process.env.QMODE !== 'bex' && version !== settings.vertoVersion && settings.vertoVersion && versionToInt('0.9.260.7') && versionToInt(settings.vertoVersion) > versionToInt(version)) {
        Notify.create({
          message: 'New Version available (v' + settings.vertoVersion + ')',
          color: 'black',
          position: 'top',
          // #SUJAN timeout: 360000,
          timeout: 3600,
          avatar: 'https://verto.volentix.io/statics/icons/vtx-logo-1024x1024.png',
          actions: [
            { label: 'Refresh Page',
              color: 'white',
              handler: () => {
                location.reload(true)
              } }
          ]
        })
      }
    }

    commit('setGlobalSettings', settings)
    initWallet()
  })
}

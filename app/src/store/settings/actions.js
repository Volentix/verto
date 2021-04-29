/*
export function someAction (context) {
}
*/
import axios from 'axios'
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

export const getSettings = ({ commit }, data) => {
  axios.get('https://cpu.volentix.io/api/global/vertoSettings').then(response => {
    let settings = response.data
    if (!settings || settings.error) {
      settings = localStorage.getItem('globalSettings')
      if (settings) settings = JSON.parse(settings)
    }
    commit('setGlobalSettings', settings)
  })
}

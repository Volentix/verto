/*
export function someMutation (state) {
}
*/
import Vue from 'vue'

export const updateCurrentWallet = (state, newwallet) => {
  state.wallet = newwallet
}

export const setUserData = (state, data) => {
  for (let i in data) {
    Vue.set(state.userData, i, data[i])
  }
}
export const updateConfig = (state, newconfig) => {
  state.config = newconfig
}

export const setLoggedIn = (state, loggedIn) => {
  state.loggedIn = loggedIn
}
export const setLoggedData = (state, user) => {
  state.user = user
}

export const updateParams = (state, params) => {
  state.params = params
}

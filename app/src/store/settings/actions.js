/*
export function someAction (context) {
}
*/

export const setAirplaneMode = ({ commit }, data) => {
  commit('setAirplaneMode', data)
}

export const toggleNetwork = ({ commit }, data) => {
  commit('toggleNetwork', data)
}

export const mnemonic = ({ commit }, data) => {
  commit('mnemonic', data)
}

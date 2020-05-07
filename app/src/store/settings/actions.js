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

export const temporary = ({ commit }, data) => {
  commit('temporary', data)
}

export const rightOrder = ({ commit }, data) => {
  commit('rightOrder', data)
}

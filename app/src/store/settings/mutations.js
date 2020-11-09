/*
export function someMutation (state) {
}
*/
export const setAirplaneMode = (state, data) => {
  state.airplaneMode = data
}

export const toggleNetwork = (state, data) => {
  state.network = data
}

export const temporary = (state, data) => {
  state.temporary = data
}

export const rightOrder = (state, data) => {
  state.rightOrder = data
}
export const setCoinData = (state, payload) => {
  state.coins[payload.source] = payload.data
}
export const setDex = (state, data) => {
  console.log(data, 'data')
  if (state.selectedDex !== data.dex) { state.selectedDex = data.dex }
  state.dexData.depositCoin = data.depositCoin
  state.dexData.destinationCoin = data.destinationCoin
}

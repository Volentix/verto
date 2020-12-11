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
  if (data.depositCoin) { state.dexData.depositCoin = data.depositCoin }
  if (data.destinationCoin) { state.dexData.destinationCoin = data.destinationCoin }
  if (data.fromAmount) { state.dexData.fromAmount = data.fromAmount }
  if (state.selectedDex !== data.dex) { state.selectedDex = data.dex }
}

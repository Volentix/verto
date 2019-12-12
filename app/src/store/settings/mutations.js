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

export const mnemonic = (state, data) => {
  state.mnemonic = data
}

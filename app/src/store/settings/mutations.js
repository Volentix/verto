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

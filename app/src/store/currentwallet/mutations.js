/*
export function someMutation (state) {
}
*/
export const updateCurrentWallet = (state, newwallet) => {
  state.wallet = newwallet
}

export const updateConfig = (state, newconfig) => {
  state.config = newconfig
}

export const setLoggedIn = (state, loggedIn) => {
  state.loggedIn = loggedIn
}

export const updateParams = (state, params) => {
  state.params = params
}

export const setTokenList = (state, data) => {
  state.list = data
}
export const setWalletTokensData = (state, data) => {
  state.walletTokensData = state.walletTokensData.concat(data)
}
export const updateState = (state, payload) => {
  state[payload.key] = payload.value
}

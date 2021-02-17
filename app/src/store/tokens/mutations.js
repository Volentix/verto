export const setTokenList = (state, data) => {
  state.list = data
}
export const setWalletTokensData = (state, data) => {
  state.walletTokensData = state.walletTokensData.concat(data)
}

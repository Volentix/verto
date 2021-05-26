import store from '@/store'

export const setTokenList = (state, data) => {
  state.list = data
}
export const setWalletTokensData = (state, data) => {
  state.walletTokensData = state.walletTokensData.concat(data)

  store.state.wallets.tokens.forEach((token, i) => {
    let tokenData = state.walletTokensData.find(o => o.symbol.toLowerCase() === token.type)
    if (tokenData) {
      store.state.wallets.tokens[i].tokenPrice = tokenData.current_price
      store.state.wallets.tokens[i].usd = tokenData.current_price * token.amount
      if (store.state.wallets.tokens[i].icon.includes('empty')) {
        store.state.wallets.tokens[i].icon = tokenData.image
      }
    }
  })
}
export const updateState = (state, payload) => {
  state[payload.key] = payload.value
}

import store from '@/store'
import Lib from '@/util/walletlib'
let noPriceList = {
  bsc: ['flux', 'velo']
}
export const setTokenList = (state, data) => {
  state.list = typeof data === 'string' ? JSON.parse(data) : data
}
export const setWalletTokensData = (state, data) => {
  state.walletTokensData = state.walletTokensData.concat(data)
  if (state.walletTokensData) return
  store.state.wallets.tokens.forEach((token, i) => {
    let tokenData = state.walletTokensData.find(o => o.symbol.toLowerCase() === token.type)
    if (tokenData) {
      let usd = Lib.findInExchangeList(token.chain, token.type, token.contract)

      if (usd && (!noPriceList[token.chain] || !noPriceList[token.chain].includes(token.type))) {
        store.state.wallets.tokens[i].tokenPrice = tokenData.current_price
        store.state.wallets.tokens[i].usd = tokenData.current_price * token.amount
      }
      if (store.state.wallets.tokens[i].icon.includes('empty')) {
        store.state.wallets.tokens[i].icon = tokenData.image
      }
    }
  })
  if (store.state.wallets.tokens && store.state.wallets.tokens.length) { store.commit('wallets/updateTokens', store.state.wallets.tokens) }
}
export const updateState = (state, payload) => {
  state[payload.key] = payload.value
}

export const setEvmsTokensData = (state, payload) => {
  state.evmTokens[payload.chain] = payload.tokens
}

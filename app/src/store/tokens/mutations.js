import store from '@/store'
import Lib from '@/util/walletlib'

export const setTokenList = (state, data) => {
  state.list = typeof data === 'string' ? JSON.parse(data) : data
}
export const updatePending = (pending, payload) => {
  pending = payload
}
export const setWalletTokensData = (state, data) => {
  state.walletTokensData = state.walletTokensData.concat(data)
  if (state.walletTokensData) return
  store.state.wallets.tokens.forEach((token, i) => {
    let tokenData = state.walletTokensData.find(o => o.symbol.toLowerCase() === token.type)
    if (tokenData) {
      let usd = Lib.findInExchangeList(token.chain, token.type, token.contract)
      let foundINBlacklist = store.state.settings.globalSettings.blacklist && store.state.settings.globalSettings.blacklist[token.chain] && store.state.settings.globalSettings.blacklist[token.chain].includes(token.type)
      if (usd && !foundINBlacklist) {
        store.state.wallets.tokens[i].tokenPrice = tokenData.current_price
        store.state.wallets.tokens[i].usd = tokenData.current_price * token.amount
      } else if (foundINBlacklist) {
        store.state.wallets.tokens[i].tokenPrice = 0
        store.state.wallets.tokens[i].usd = 0
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

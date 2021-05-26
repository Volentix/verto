import store from '@/store'

export function getWallet (state) {
  return state.wallet && state.wallet.chain ? store.state.wallets.tokens[state.wallet.index] : {
    empty: true
  }
}

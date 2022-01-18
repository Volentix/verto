import store from '@/store'

export function getWallet (state) {
  let wallet = {
    empty: true
  }
  if (state.wallet && state.wallet.chain) {
    wallet = store.state.wallets.tokens.find(o => o.index === state.wallet.index)
    wallet = !wallet ? state.wallet : wallet
  }
  return wallet
}

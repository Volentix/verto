import axios from 'axios'

export const getTokenList = ({ commit, state }, payload) => {
  axios.get('https://api.coingecko.com/api/v3/coins/list?include_platform=true').then((result) => {
    commit('setTokenList', result.data)
  })
}

export const getTokensMarketsData = ({ commit, state }, tokens) => {
  let list = state.list.filter(t => tokens.find(o => t.symbol === o.type && !isNaN(o.amount) && o.amount !== 0) && !state.walletTokensData.find(a => a.id === t.id))

  if (list.length) {
    list = list.map(l => l.id).join(',')

    axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' + list + '&price_change_percentage=24h').then((result) => {
      commit('setWalletTokensData', result.data)
    })
  }
}

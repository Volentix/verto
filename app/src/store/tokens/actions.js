import axios from 'axios'

export const getTokenList = ({ commit, state }, payload) => {
  axios.get('https://api.coingecko.com/api/v3/coins/list?include_platform=true').then((result) => {
    commit('setTokenList', result.data)
  })
}

export const getTokenMarketData = ({ commit, state }, id) => {
  state.pending = state.pending.concat(['volentix-vtx'])
  axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=volentix-vtx&price_change_percentage=24h').then((result) => {
    commit('setWalletTokensData', result.data)
  })
}
axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=volentix-vtx')

export const getTokensMarketsData = ({ commit, state }, tokens) => {
  if (!state.list) return

  let list = state.list.filter(t => !state.pending.find(o => o === t.id) && tokens.find(o => t.symbol === o.type && ((!t.platforms.hasOwnProperty('eos') && !t.platforms.hasOwnProperty('ethereum')) || o.chain === (t.platforms.hasOwnProperty('eos') ? 'eos' : (t.platforms.hasOwnProperty('ethereum') ? 'eth' : o.chain)))) && !state.walletTokensData.find(a => a.id === t.id))

  if (list.length) {
    list = list.map(l => l.id)

    state.pending = state.pending.concat(list)
    list = list.join(',')

    axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' + list + '&price_change_percentage=24h').then((result) => {
      commit('setWalletTokensData', result.data)
    })
  }
}

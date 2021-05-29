import Lib from '@/util/walletlib'
import axios from 'axios'
import store from '@/store'

export const getTokenList = ({ commit, state }, payload) => {
  axios.get('https://api.coingecko.com/api/v3/coins/list?include_platform=true').then((result) => {
    commit('setTokenList', result.data)
  })
}

export const getTokenMarketData = ({ commit, state }, ids) => {
  state.pending = state.pending.concat(ids)
  axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' + ids.join(',') + '&price_change_percentage=24h').then((result) => {
    commit('setWalletTokensData', result.data)
  })
}

export const getTokensMarketsData = ({ commit, state }, tokens) => {
  if (!state.list) return

  let list = state.list.filter(t => !state.pending.find(o => o === t.id) && tokens.find(o => t.symbol.toLowerCase() === o.type && (o.isEvm || (!t.platforms.hasOwnProperty('eos') && !t.platforms.hasOwnProperty('ethereum')) || o.chain === (t.platforms.hasOwnProperty('eos') ? 'eos' : (t.platforms.hasOwnProperty('ethereum') ? 'eth' : o.chain)))) && !state.walletTokensData.find(a => a.id === t.id))

  if (list.length) {
    list = list.map(l => l.id)

    state.pending = state.pending.concat(list)
    list = list.join(',')

    axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' + list + '&price_change_percentage=24h').then((result) => {
      commit('setWalletTokensData', result.data)
    })
  }
}

export const getEvmsTokensData = ({ commit }) => {
  Lib.evms.filter(m =>
    m.network_id !== 1 // Until eth is integrated into covalent api
  ).forEach(e => {
    let cachedData = localStorage.getItem('evmsTokensData_' + e.chain)
    if (cachedData) {
      commit('setEvmsTokensData', { chain: e.chain, tokens: JSON.parse(cachedData) })
      return
    }
    axios
      .get(
        process.env[store.state.settings.network].CACHE +
        'https://api.covalenthq.com/v1/' + e.network_id +
        '/tokens/tokenlists/all/',
        { auth: { username: 'ckey_a9e6f6ab90584877b86b151eef3' } }
      )
      .then(res => {
        if (res.data.data && res.data.data.items) {
          localStorage.setItem('evmsTokensData_' + e.chain, JSON.stringify(res.data.data.items))
          commit('setEvmsTokensData', { chain: e.chain, tokens: res.data.data.items })
        }
      })
  })
}

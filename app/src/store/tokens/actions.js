import Lib from '@/util/walletlib'
import axios from 'axios'
import store from '@/store'

export const getTokenList = ({ commit, state }, payload) => {
  axios
    .get(process.env[store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/coins/list?include_platform=true')
    .then(result => {
      commit('setTokenList', result.data)
    })
}

export const getTokenMarketData = ({ commit, state }, ids) => {
  state.pending = state.pending.concat(ids)
  axios
    .get(
      process.env[store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' +
        ids.join(',') +
        '&price_change_percentage=24h'
    )
    .then(result => {
      commit('setWalletTokensData', result.data)
    })
}

export const getTokensMarketsData = ({ commit, state }, tokens) => {
  if (!state.list) return

  let list = state.list.filter(
    t =>
      !state.pending.find(o => o === t.id) &&
      tokens.find(
        o =>
          t.symbol.toLowerCase() === o.type &&
          (!o.contract || (JSON.stringify(t.platforms).includes('0x') && JSON.stringify(t.platforms).includes(o.contract)) ||
          (JSON.stringify(t.platforms).includes(o.chain)))
      ) &&
      !state.walletTokensData.find(a => a.id === t.id)
  )

  if (list.length) {
    list = list.map(l => l.id)

    state.pending = state.pending.concat(list)
    list = list.join(',')

    axios
      .get(
        process.env[store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' +
          list +
          '&price_change_percentage=24h'
      )
      .then(result => {
        commit('setWalletTokensData', result.data)
      })
  }
}

export const getEvmsTokensData = ({ commit }) => {
  Lib.evms.forEach(e => {
    let cachedData = localStorage.getItem('evmsTokensData_' + e.chain)
    if (cachedData) {
      commit('setEvmsTokensData', {
        chain: e.chain,
        tokens: JSON.parse(cachedData)
      })
      return
    }
    if ([1, 56, 137].includes(e.network_id)) {
      axios
        .get(
          process.env[store.state.settings.network].CACHE +
            'https://api.1inch.exchange/v3.0/' +
            e.network_id +
            '/tokens'
        )
        .then(res => {
          let coins = res.data.tokens

          coins = Object.keys(coins).map((key, index) => {
            return coins[key]
          })
          if (coins && coins.length) {
            localStorage.setItem(
              'evmTokensData_' + e.chain,
              JSON.stringify(coins)
            )
            commit('setEvmsTokensData', {
              chain: e.chain,
              tokens: coins
            })
          }
        })
    } else {
      axios
        .get(
          process.env[store.state.settings.network].CACHE +
            'https://api.covalenthq.com/v1/' +
            e.network_id +
            '/tokens/tokenlists/all/',
          { auth: { username: 'ckey_a9e6f6ab90584877b86b151eef3' } }
        )
        .then(res => {
          if (res && res.data && res.data.data && res.data.data.items) {
            let tokens = res.data.data.items.map(t => {
              let format = {
                address: t.contract_address,
                decimals: t.contract_decimals,
                logoURI: t.logo_url,
                name: t.contract_name,
                symbol: t.contract_ticker_symbol
              }
              return format
            })
            localStorage.setItem(
              'evmsTokensData_' + e.chain,
              JSON.stringify(tokens)
            )
            commit('setEvmsTokensData', { chain: e.chain, tokens: tokens })
          }
        })
    }
  })
}

export const getTokensMarketsDataBySymbols = ({ commit, state }, tokens) => {
  return new Promise((resolve, reject) => {
    axios.get('https://cache.volentix.io/https://api.coingecko.com/api/v3/coins/list?include_platform=true'
    // https://cache.volentix.io/
    // {
      // headers: { 'Access-Control-Allow-Origin': '*' }
    // }
    ).then((result) => {
      /// commit('setTokenList', result.data)
      // console.log('setTokenList', state.list)
      // console.log('state.walletTokensData before -----', state.walletTokensData)
      if (!state.list) return
      // let list = state.list.filter(t => !state.pending.find(o => o === t.id) && tokens.find(o => t.symbol === o.type) && !state.walletTokensData.find(a => a.id === t.id))
      let list = state.list.filter(t => !state.pending.find(o => o === t.id) && tokens.find(o => t.symbol === o.type && Object.keys(t.platforms).length > 0 && Object.keys(t.platforms).find(chain => t.platforms[chain] === o.address) && (o.chain === (t.platforms.hasOwnProperty('eos') ? 'eos' : (t.platforms.hasOwnProperty('ethereum') ? 'eth' : o.chain)))))
      // console.log('tokens,list,state.walletTokensData', tokens, list, state.walletTokensData)
      if (list.length) {
        list = list.map(l => l.id)
        commit('updatePending', state.pending.concat(list))
        list = list.join(',')
        axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=' + window.localStorage.getItem('currency').toUpperCase() + '&ids=' + list + '&price_change_percentage=24h'
        // https://cache.volentix.io/
        // {
          // headers: { 'Access-Control-Allow-Origin': '*' }
        // }
        ).then((result) => {
          // commit('setWalletTokensData', result.data)
          resolve(result.data)
        })
      }
    })
  })
}

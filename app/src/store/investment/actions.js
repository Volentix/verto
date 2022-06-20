/*
export function someAction (context) {
}
*/
import store from '@/store'
import axios from 'axios'
const config = {
  headers: {
    'api-key': '562eee97-e90e-42ac-8e7b-363cdff5cdaa'
  }
}

export const getGasPrice = ({ commit, state }, payload) => {
  axios.get('https://ethgasstation.info/json/ethgasAPI.json').then((result) => {
    commit('updateGasPrice', result.data)
  })
}

export const getBalancerHistoricalData = ({ rootState, commit, state }, payload) => {
  axios.get(process.env[rootState.settings.network].CACHE + 'https://zapper.fi/api/pool-history/balancer', config).then((result) => {
    if (result.data.length) {
      commit('setPoolHistoricalData', { data: result.data, platform: 'balancer' })
    }
  })
}
export const getUniSwapHistoricalData = ({ rootState, commit, state }, payload) => {
  axios.get(process.env[rootState.settings.network].CACHE + 'https://zapper.fi/api/pool-history/uniswap', config).then((result) => {
    if (result.data.hasOwnProperty('v2History')) {
      commit('setPoolHistoricalData', { data: result.data.v2History, platform: 'UniswapV2' })
    }
  })
}
export const getBalancerPools = ({ rootState, commit, state }, payload) => {
  axios.get(process.env[rootState.settings.network].CACHE + 'https://api.zapper.fi/v1/pool-stats/balancer?api_key=562eee97-e90e-42ac-8e7b-363cdff5cdaa', {}, config).then((result) => {
    if (result.data.length) {
      result.data/* .map((function(e) {
          var t = state.poolDataHistory['balancer'].find((function(t) {
                return t.address === e.address
              }
            )),
            n = t ? t.netValuePerShare : 0,
            a = t ? t.valuePerShare : 0,
            r = e.liquidity / e.supply,
            o = t ? 100 * (r / a - 1) : 0,
            s = t ? 100 * (r / n - 1) : 0;

        e.netROI = s.toFixed(2)
        e.grossROI = o.toFixed(2)
        return e
      }

)) */.forEach((value, index) => {
          let poolTokens = value.tokens.map(o => state.zapperTokens.find(t => t.address.toLowerCase() === o.address.toLowerCase())).filter((val) => val)
          if (!poolTokens.length) return
          let pool = value
          pool.poolName = poolTokens.map(o => o?.label).filter((val) => val).join(' / ')
          pool.icons = poolTokens.map(o => o?.img).filter((val) => val)
          // To be calculated using historical data of the token
          // pool.netROI = value.netROI.toFixed(2) + '%'
          // pool.ROI = value.grossROI.toFixed(2) + '%'
          pool.volume = value.volume
          pool.fees = value.feeVolume
          pool.id = value.address
          pool.tokensData = value.tokens
          pool.tokens = poolTokens.map(o => o?.label).filter((val) => val)
          pool.platform = 'Balancer-labs'
          pool.value = value.address
          pool.liquidity = parseInt(pool.liquidity)
          if (!(poolTokens.length > 1 && !pool.poolName.includes('/'))) {
            commit('updatePools', pool)
          }
        })
    }
  })
}

export const getUniswapPools = ({ rootState, context, commit, state }, payload) => {
  axios.get(process.env[rootState.settings.network].CACHE + 'https://api.zapper.fi/v1/pool-stats/uniswap-v2?api_key=562eee97-e90e-42ac-8e7b-363cdff5cdaa', {}, config).then((result) => {
    result.data/* .map(function (e) {
      if (e.protocol === 'uniswap' && state.poolDataHistory['UniswapV1']) {
        var t = e.liquidity / e.supply,
          n = state.poolDataHistory['UniswapV1'].find(function (t) {
            return t.exchangeAddress === e.exchangeAddress
          }

          ),
          a = n ? n.supply : 0,
          r = n ? n.liquidity : 0,
          o = n ? r / a : 0,
          s = n ? (n.ethBalance * e.ethPrice + n.tokenBalance * e.tokenPrice) / a : 0,
          i = n ? 100 * (t / o - 1) : 0,
          u = n ? 100 * (t / s - 1) : 0

        e.netROI = u.toFixed(2)
        e.grossROI = i.toFixed(2)
        return e
      } else {
        console.log('uniswap v1 history needed')
      }

      if (e.protocol === 'uniswapV2') {
        if (e.value === 'yUSD / ETH') {
          e.netROI = 0
          e.grossROI = 0
          return e
        }
        var l = e.liquidity / e.supply,
          p = state.poolDataHistory['UniswapV2'].find(function (t) {
            return t.address === e.address
          }

          ),
          d = p ? p.value : 0,
          m = p ? (p.reserve0 * e.price0 + p.reserve1 * e.price1) / p.supply : 0,
          f = p ? 100 * (l / d - 1) : 0,
          y = p ? 100 * (l / m - 1) : 0
        e.netROI = y.toFixed(2)
        e.grossROI = f.toFixed(2)
        return e
      }
    }
    ) */.filter(function (actualPool) {
        return !actualPool.isBlocked
      }).filter(function (actualPool) {
        return !actualPool.hideFromExplore
      }).forEach((value, index) => {
        let pool = value
        pool.poolName = value.label
        pool.icons = value.tokens.map(o => 'https://zapper.fi/images/' + o.symbol + '-icon.png')
        // To be calculated using historical data of the token
        // pool.netROI = value.netROI.toFixed(2) + '%'
        // pool.ROI = value.grossROI.toFixed(2) + '%'
        pool.volume = value.volume
        pool.fees = value.feeVolume
        pool.id = value.address
        pool.value = value.address
        pool.tokensData = value.tokens
        // pool.tokens = poolTokens.map(o => o?.label).filter((val) => val)
        pool.platform = 'Uniswap V2'
        pool.chain = 'eth'
        pool.liquidity = parseInt(pool.liquidity)
        // if (!(poolTokens.length > 1 && !pool.poolName.includes('/'))) {
        commit('updatePools', pool)
        // }
      })
  })
}
export const getYvaultsPools = ({ rootState, commit, state }, payload) => {
  axios.get(process.env[rootState.settings.network].CACHE + 'https://api.zapper.fi/v1/vault-stats/yearn?api_key=562eee97-e90e-42ac-8e7b-363cdff5cdaa', config).then((result) => {
    if (result.data.length) {
      result.data.filter(function (e) {
        return !e.isBlocked
      }).filter(function (e) {
        return !e.hideFromExplore
      }).forEach((value, index) => {
        let poolTokens = value.tokens.map(o => state.zapperTokens.find(t => t.address.toLowerCase() === o.address.toLowerCase())).filter((val) => val)

        if (!poolTokens.length) return
        let pool = value
        pool.poolName = poolTokens.map(o => o?.label).filter((val) => val).join(' / ')
        pool.icons = poolTokens.map(o => o?.img).filter((val) => val)

        // To be calculated using historical data of the token
        // pool.netROI = value.netROI.toFixed(2) + '%'
        // pool.ROI = value.grossROI.toFixed(2) + '%'
        pool.volume = value.volume
        pool.fees = value.feeVolume
        pool.id = value.address
        pool.tokensData = value.tokens
        pool.tokens = poolTokens.map(o => o?.label).filter((val) => val)
        pool.platform = 'yEarn'
        pool.liquidity = parseInt(pool.liquidity)
        pool.value = value.address
        console.log(!(poolTokens.length > 1 && !pool.poolName.includes('/')))
        // if (!(poolTokens.length > 1 && !pool.poolName.includes('/'))) {
        commit('updatePools', pool)
        //   }
      })
    }
  })
}
export const getCurvesPools = ({ rootState, commit, state }, payload) => {
  axios.get(process.env[rootState.settings.network].CACHE + 'https://api.zapper.fi/v1/pool-stats/curve?api_key=562eee97-e90e-42ac-8e7b-363cdff5cdaa', config).then((result) => {
    if (result.data.length) {
      result.data.forEach((value, index) => {
        let poolTokens = value.tokens.map(o => state.zapperTokens.find(t => t.address.toLowerCase() === o.address.toLowerCase())).filter((val) => val)

        if (!poolTokens.length) return
        let pool = value
        pool.poolName = poolTokens.map(o => o?.label).filter((val) => val).join(' / ')
        pool.icons = poolTokens.map(o => o?.img).filter((val) => val)

        // To be calculated using historical data of the token
        // pool.netROI = value.netROI.toFixed(2) + '%'
        // pool.ROI = value.grossROI.toFixed(2) + '%'
        pool.volume = value.volume
        pool.fees = value.feeVolume
        pool.value = value.contractAddress
        pool.tokensData = value.tokens
        pool.tokens = poolTokens.map(o => o?.label).filter((val) => val)
        pool.platform = 'Curve'
        pool.id = value.contractAddress
        pool.liquidity = parseInt(pool.liquidity)

        if (!(poolTokens.length > 1 && !pool.poolName.includes('/'))) {
          commit('updatePools', pool)
        }
      })
    }
  })
}
export const getZapperTokens = (context /*, payload */) => {
  let address = '0x915f86d27e4e4a58e93e59459119faaf610b5be1'
  axios.get(process.env[context.rootState.settings.network].CACHE + 'https://api.zapper.fi/v1/balances/tokens?addresses%5B%5D=' + address + '&api_key=562eee97-e90e-42ac-8e7b-363cdff5cdaa', config).then((result) => {
    if (result.data) {
      for (var prop in result.data) {
        context.commit('setTokens', result.data[prop])
        break
      }

      // Current;y only usiswap is working

      // context.dispatch('getYvaultsPools')
      // context.dispatch('getCurvesPools')
      context.dispatch('getUniswapPools')
      // context.dispatch('getBalancerPools')
    }
  })
}

export const getMarketDataVsUSD = (context, payload) => {
  let coingeckoEndpoint = process.env[store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd'
  axios.get(coingeckoEndpoint)
    .then(function (result) {
      if (result.data.length) {
        context.commit('setMarketData', result.data)
      }
    }).catch(error => {
      console.log(error, 'Cannot get market data')
    })
}

export const getTransactions = (context, payload) => {
  let transactionEndpoint = process.env[context.rootState.settings.network].CACHE + 'https://api.zapper.fi/v1/transactions/' + payload.value + '?api_key=562eee97-e90e-42ac-8e7b-363cdff5cdaa'
  axios.get(transactionEndpoint, config)
    .then(function (result) {
      if (result.data.length) {
        context.commit('setTransactions', result.data)
      }
    }).catch(error => {
      console.log(error, 'Cannot get market transactions')
    })
}

export const getETHTransactions = async (context, address) => {
  let transactions = []

  let transactionEndpoint = process.env[context.rootState.settings.network].CACHE + 'https://api.zapper.fi/v1/transactions/?addresses[]=' + address + '&api_key=cbaadb5b-92d2-4479-9a96-ee804989e27a&network=ethereum'
  let result = (await axios.get(transactionEndpoint, config)
    .catch(error => {
      console.log(error, 'Cannot get transactions')
    }))

  if (result && result.data) {
    transactions = result.data
  }

  return transactions
}

export const getInvestments = (context, payload) => {
  let transactionEndpoint = process.env[context.rootState.settings.network].CACHE + 'https://api.zapper.fi/v1/protocols/' + payload.platform + '/balances?addresses%5B%5D=' + payload.value + '&network=ethereum&api_key=562eee97-e90e-42ac-8e7b-363cdff5cdaa'
  // let transactionEndpoint = process.env[context.rootState.settings.network].CACHE + 'https://api.zapper.fi/v1/balances/' + payload.platform + '?addresses%5B%5D=' + payload.value + '&api_key=562eee97-e90e-42ac-8e7b-363cdff5cdaa'

  axios.get(transactionEndpoint, config)
    .then(function (result) {
      let a = result.data[payload.value.toLowerCase()]

      if (a && a.products.length && a.products[0] && a.products[0].assets) {
        a.products[0].assets = a.products[0].assets.map(o => {
          o.owner = payload.value.toLowerCase()
          return o
        })
        context.commit('setInvestments', a.products[0].assets)
      }
    }).catch(error => {
      console.log(error, 'Cannot get market Investments')
    })
}
export const getDebts = (context, payload) => {
  let transactionEndpoint = process.env[context.rootState.settings.network].CACHE + 'https://api.zapper.fi/v1/balances/' + payload.platform + '?addresses%5B%5D=' + payload.value + '&api_key=562eee97-e90e-42ac-8e7b-363cdff5cdaa'
  axios.get(transactionEndpoint, config)
    .then(function (result) {
      context.commit('setDebts', result.data[payload.value.toLowerCase()])
    }).catch(error => {
      console.log(error, 'Cannot get Debts')
    })
}
export const getEOSInvestments = (context, payload) => {
  let transactionEndpoint = process.env[context.rootState.settings.network].CACHE + 'https://defibox.io/api/swap/account/capital'
  axios.post(transactionEndpoint, payload)
    .then(function (result) {
      context.commit('setEOSInvestments', result.data.data)
    }).catch(error => {
      console.log(error, 'Cannot get EOSInvestments')
    })
}
export const getAllEOSInvestments = (context, accounts) => {
  let transactionEndpoint = process.env[context.rootState.settings.network].CACHE + 'https://defibox.io/api/swap/account/capital'
  accounts.forEach(account => {
    axios.post(transactionEndpoint, { owner: account })
      .then(function (result) {
        if (result.data.data && result.data.data.length) { context.commit('setAllEOSInvestments', result.data.data) }
      }).catch(error => {
        console.log(error, 'Cannot get EOSInvestments')
      })
  })
}

/*
export function someAction (context) {
}
*/
import axios from 'axios'
const config = {
  headers: {
    'api-key': 'b7575aeb-b8a2-4360-88ab-400d1fba3aec'
  }
}

export const getGasPrice = ({ commit, state }, payload) => {
  axios.get('https://gasprice.poa.network/').then((result) => {
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
  axios.post(process.env[rootState.settings.network].CACHE + 'https://zapper.fi/api/pool-stats/balancer', {}, config).then((result) => {
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
            pool.index = state.pools.length
            commit('updatePools', pool)
          }
        })
    }
  })
}

export const getUniswapPools = ({ rootState, context, commit, state }, payload) => {
  axios.post(process.env[rootState.settings.network].CACHE + 'https://zapper.fi/api/pool-stats/uniswap', {}, config).then((result) => {
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
        pool.value = value.address
        pool.tokensData = value.tokens
        pool.tokens = poolTokens.map(o => o?.label).filter((val) => val)
        pool.platform = 'Uniswap V2'
        pool.liquidity = parseInt(pool.liquidity)
        if (!(poolTokens.length > 1 && !pool.poolName.includes('/'))) {
          pool.index = state.pools.length
          commit('updatePools', pool)
        }
      })
  })
}
export const getYvaultsPools = ({ rootState, commit, state }, payload) => {
  axios.get(process.env[rootState.settings.network].CACHE + 'https://zapper.fi/api/yvaults', config).then((result) => {
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
        if (!(poolTokens.length > 1 && !pool.poolName.includes('/'))) {
          pool.index = state.pools.length
          commit('updatePools', pool)
        }
      })
    }
  })
}
export const getCurvesPools = ({ rootState, commit, state }, payload) => {
  axios.get(process.env[rootState.settings.network].CACHE + 'https://zapper.fi/api/pool-stats/curve', config).then((result) => {
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
          pool.index = state.pools.length
          commit('updatePools', pool)
        }
      })
    }
  })
}
export const getZapperTokens = (context, payload) => {
  // context.commit('setTokens',fallBackTokens)
  axios.get(process.env[context.rootState.settings.network].CACHE + 'https://zapper.fi/api/account-balance/tokens?addresses=0x358A6C0F7614C44b344381b0699E2397b1483252', config).then((result) => {
    if (result.data) {
      context.commit('setTokens', result.data['0x358A6C0F7614C44b344381b0699E2397b1483252'])
    }
  })
}

export const getMarketDataVsUSD = (context, payload) => {
  let coingeckoEndpoint = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd'
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
  let transactionEndpoint = process.env[context.rootState.settings.network].CACHE + 'https://zapper.fi/api/transactionss?address=' + payload.address
  axios.get(transactionEndpoint, config)
    .then(function (result) {
      if (result.data.length) {
        context.commit('setTransactions', result.data)
      }
    }).catch(error => {
      console.log(error, 'Cannot get market transactions')
    })
}

export const getInvestments = (context, payload) => {
  let transactionEndpoint = process.env[context.rootState.settings.network].CACHE + 'https://zapper.fi/api/account-balance/' + payload.platform + '?addresses=' + payload.address
  axios.get(transactionEndpoint, config)
    .then(function (result) {
      context.commit('setInvestments', result.data[payload.address])
    }).catch(error => {
      console.log(error, 'Cannot get market Investments')
    })
}
export const getDebts = (context, payload) => {
  let transactionEndpoint = process.env[context.rootState.settings.network].CACHE + 'https://zapper.fi/api/account-balance/' + payload.platform + '?addresses=' + payload.address
  axios.get(transactionEndpoint, config)
    .then(function (result) {
      context.commit('setDebts', result.data[payload.address])
    }).catch(error => {
      console.log(error, 'Cannot get Debts')
    })
}

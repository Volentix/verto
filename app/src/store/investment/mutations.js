/*
export function someMutation (state) {
}
*/

export const setSelectedPool = (state, pool) => {
  state.selectedPool = pool
}
export const setInvestmentTotal = (state, total) => {
  state.investmentTotal = total
}

export const setPools = (state, pools) => {
  state.pools = pools
}
export const setEOSPools = (state, pools) => {
  state.eosPools = pools
}
export const updateEOSPools = (state, pool) => {
  state.eosPools.push(pool)
}
export const setSelectedEOSPool = (state, pool) => {
  state.selectedEOSPool = pool
}
export const updateTestnetEOSInvestments = (state, data) => {
  state.testnetEOSInvestments.push(data)
}

export const updatePools = (state, pool) => {
  let item = state.pools.find(o => o.poolName === pool.poolName)
  if (item) return

  let volume = parseInt(pool.volume)
  if (pool.chain === 'eth' && pool.liquidity !== 0 && volume !== 0 && !isNaN(volume)) {
    state.pools.push(pool)
    /*
    state.pools = state.pools.sort((a, b) => a.poolName.includes('VTX') ? -1 : parseInt(b.liquidity) - parseInt(a.liquidity)).map((o, index) => {
      o.index = index
      return o
    }) */
  } else if (pool.chain === 'eos') {
    state.pools[pool.poolName.includes('VTX') ? 'unshift' : 'push'](pool)
    state.pools.sort((a, b) => {
      let prop = a.reserve0.includes('VTX') ? 'reserve0' : (a.reserve1.includes('VTX') ? 'reserve1' : false)
      let value = 0
      if (prop) {
        value = parseInt(a[prop].split(' ')[0]) * -1
      }
      return value
    })
  }
}
export const setTokens = (state, tokens) => {
  state.zapperTokens = tokens
}
export const updateGasPrice = (state, gasPrice) => {
  let prices = {
    fast: gasPrice.fast / 10,
    instant: gasPrice.fastest / 10,
    slow: gasPrice.average / 10
  }
  state.gasPrice = prices
}
export const setMetamaskConnectionStatus = (state, status) => {
  state.metamaskConnected = status
}
export const setStakeData = (state, index) => {
  state.stakeData = state.investmentOpportunities[index]
}
export const getRois = (state, updated) => {
  var grossROI = 0, netROI = 0
  let index = state.pools.findIndex(o => o.contractAddress === updated.contractAddress)
  if (updated.platform === 'Uniswap V2') {
    if (updated.value === 'WBTC / ETH') {
      var l = parseFloat(updated.liquidity) / updated.supply,
        historical = state.poolDataHistory[updated.platform.replace(/[^a-z0-9+]+/gi, '')].find(function (t) {
          return t.address.toLowerCase() === updated.contractAddress.toLowerCase()
        }
        )
      if (historical) {
        var d = state.pools[index] ? historical.value : 0,
          m = state.pools[index] ? (historical.reserve0 * updated.price0 + historical.reserve1 * updated.price1) / historical.supply : 0
        grossROI = state.pools[index] ? 100 * (l / d - 1) : 0
        netROI = state.pools[index] ? 100 * (l / m - 1) : 0
      }
    }
    state.pools[index].ROI = grossROI
    state.pools[index].netROI = netROI
  }
}
export const setPoolHistoricalData = (state, payload) => {
  state.poolDataHistory[payload.platform] = payload.data
}
export const resetAccountDetails = (state, payload) => {
  state.investments = []
  state.transactions = []
  state.debts = []
  state.defaultAccount = payload
}
export const setMarketData = (state, payload) => {
  state.marketData = payload
}
export const setInvestments = (state, payload) => {
  state.investments = state.investments.concat(payload.pools ? payload.pools : payload).map((o, index) => {
    o.index = index
    o.chain = 'eth'
    return o
  }).filter(o => !o.canStake).filter((investment, index, self) => self.findIndex(t => t.address === investment.address) === index)
  state.investmentOpportunities = state.investmentOpportunities.concat(payload.pools ? payload.pools : payload).map((o, index) => {
    o.index = index
    return o
  }).filter(o => o.canStake).filter((investment, index, self) => self.findIndex(t => t.address === investment.address) === index)
}
export const setTransactions = (state, payload) => {
  state.transactions = state.transactions.concat(payload.filter(item => !state.transactions.find(o => o.hash === item.hash))).map((o, index) => {
    o.index = index
    return o
  })
}
export const setDebts = (state, payload) => {
  state.debts = state.debts.concat(payload.filter(item => !state.debts.find(o => o.hash === item.hash))).map((o, index) => {
    o.index = index
    return o
  })
}
export const setDefaultAccount = (state, payload) => {
  console.log(payload, 'payload')
  state.defaultAccount = payload
}
export const setAccountTokens = (state, payload) => {
  state.accountTokens = payload
}

export const setTableLoadingStatus = (state, payload) => {
  state.tableLoading = payload
}
export const setAllEOSInvestments = (state, payload) => {
  state.allEosWalletsInvestments = state.allEosWalletsInvestments.concat(payload)
}

export const setEOSInvestments = (state, payload) => {
  state.eosInvestments = payload.map((o, index) => {
    o.index = index
    return o
  })
}

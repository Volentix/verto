/*
export function someMutation (state) {
}
*/

export const setSelectedPool = (state, pool) => {
    state.selectedPool = pool
    }
export const setPools = (state, pools) => {
    state.pools = pools
    }
export const updatePools = (state, pool) => {
    state.pools.push(pool)
   }
export const setTokens = (state, tokens) => {
    state.zapperTokens = tokens
   }
export const  updateGasPrice  = (state, gasPrice) => {
    state.gasPrice = gasPrice
   }
export const  getRois  = (state, updated) => {
     var  grossROI = 0, netROI = 0
     let index = state.pools.findIndex(o => o.contractAddress == updated.contractAddress)
    if ("Uniswap V2" === updated.platform) {
        if ("WBTC / ETH" == updated.value) {
          var l = parseFloat(updated.liquidity) / updated.supply,
          historical = state.poolDataHistory[updated.platform.replace(/[^a-z0-9+]+/gi, '')].find((function(t) {
              return t.address.toLowerCase() == updated.contractAddress.toLowerCase()
            }
          ))
            if(historical){
             
               
          var d = state.pools[index] ? historical.value : 0,
          m = state.pools[index] ? (historical.reserve0 * updated.price0 + historical.reserve1 * updated.price1) / historical.supply : 0 ;
          grossROI = state.pools[index] ? 100 * (l / d - 1) : 0
          netROI = state.pools[index] ? 100 * (l / m - 1) : 0 
          console.log( l , m, d , m/d,  updated.poolName , updated)
     }
        }
          
     state.pools[index].ROI = grossROI 
     state.pools[index].netROI = netROI
    
} 
}
export const  setPoolHistoricalData  = (state, payload) => {
    state.poolDataHistory[payload.platform] = payload.data
   }
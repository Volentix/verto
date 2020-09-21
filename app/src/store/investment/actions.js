/*
export function someAction (context) {
}
*/
import axios from 'axios'
const config = {
    headers: {
        'api-key': 'b7575aeb-b8a2-4360-88ab-400d1fba3aec',
    }
}
export const getGasPrice = ({ commit , state }, payload) => {

    axios.get('https://gasprice.poa.network/').then((result) => {
        commit("updateGasPrice", result.data)      
    });
}

export const getUniSwapHistoricalData = ({ commit , state }, payload) => {

    axios.get('https://cors-anywhere.herokuapp.com/https://zapper.fi/api/pool-history/uniswap', config).then((result) => {
        if (result.data.hasOwnProperty('v2History') ) {
       
            commit("setPoolHistoricalData", {data:result.data.v2History, platform:'UniswapV2'})

        }
    });
}
export const getBalancerPools = ({ commit , state }, payload) => {

    axios.post('https://api.thegraph.com/subgraphs/name/balancer-labs/balancer', {
        query: `{
            pools(
              block: { number: 10651780 }
              first: 250
              orderBy: liquidity
              orderDirection: desc
              where: { publicSwap: true }
            ) {
              id
              tokensList
              totalShares
              swapsCount
              liquidity
              tokens {
                address
                balance
              }
            }
          }`
    }).then((result) => {
        if (result.data.hasOwnProperty('data') && result.data.data.pools) {
       
            result.data.data.pools.forEach((value, index) => {

                let pair = value.tokensList.map(o => state.zapperTokens.find(t => t.address.toLowerCase() == o.toLowerCase()))
                let pool = value
                pool.contractAddress = value.id
                pool.poolName = pair.map(o => o?.label).filter((val) => val).join(' / ')
                pool.icons = pair.map(o => o?.img).filter((val) => val)
                
                //To be calculated using historical data of the token
                pool.netROI = '0.'+Math.floor((Math.random()*30) + 1)+'%'
                pool.ROI = '0.'+Math.floor((Math.random()*30) + 1)+'%'

                pool.tokens = pair.map(o => o?.label).filter((val) => val)
                pool.platform = 'Balancer-labs'
                pool.liquidity = parseInt(pool.liquidity).toLocaleString()

                //Validate pool, Add only pool with valid labels
                if (!(pair.length > 1 && !pool.poolName.includes('/')))

                    commit("updatePools", pool)
            })

        }
    });
}

export const getUniswapPools = ({commit, state}, payload) => {
	// https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2
	axios.post('https://cors-anywhere.herokuapp.com/https://zapper.fi/api/pool-stats/uniswap', {}, config).then((result) => {
		result.data = result.data.map((function(e) {
			if("uniswapV2" === e.protocol) {
				if("yUSD / ETH" === e.value) {
					e.netROI = 0
					e.grossROI = 0
					return e
				}
				var l = e.liquidity / e.supply,
					p = state.poolDataHistory['UniswapV2'].find((function(t) {
						return t.address === e.address
					})),
					d = p ? p.value : 0,
					m = p ? (p.reserve0 * e.price0 + p.reserve1 * e.price1) / p.supply : 0,
					f = p ? 100 * (l / d - 1) : 0,
					y = p ? 100 * (l / m - 1) : 0;
				e.netROI = y.toFixed(2)
				e.grossROI = f.toFixed(2)
				return e
			}
		})).filter((function(e) {
            return !e.isBlocked
        })).filter((function(e) {
            return !e.hideFromExplore
        }))
		if(result.data.length) {
			result.data.forEach((value, index) => {
				let poolTokens = value.tokens.map(o => state.zapperTokens.find(t => t.address.toLowerCase() == o.address.toLowerCase())).filter((val) => val)
				if(!poolTokens.length) return
				let pool = value
				pool.poolName = poolTokens.map(o => o?.label).filter((val) => val).join(' / ')
				pool.icons = poolTokens.map(o => o?.img).filter((val) => val)
				//To be calculated using historical data of the token
				pool.netROI = value.netROI + '%'
				pool.ROI = value.grossROI + '%'
				pool.id = value.address
				pool.tokens = poolTokens.map(o => o?.label).filter((val) => val)
				pool.platform = 'Uniswap V2'
				pool.liquidity = parseInt(pool.liquidity).toLocaleString()
				if(!(poolTokens.length > 1 && !pool.poolName.includes('/'))) {
					commit("updatePools", pool)
				
				}
			})
		}
	});
}
export const getYvaultsPools = ({ commit , state }, payload) => {
    axios.get('https://cors-anywhere.herokuapp.com/https://zapper.fi/api/yvaults', config).then((result) => {
        if (result.data.length) {

            result.data.filter((function(e) {
                return !e.isBlocked
            })).filter((function(e) {
                return !e.hideFromExplore
            })).forEach((value, index) => {

                let poolTokens = value.tokens.map(o => state.zapperTokens.find(t => t.address.toLowerCase() == o.address.toLowerCase())).filter((val) => val)

                if (!poolTokens.length) return
                let pool = value
                pool.poolName = poolTokens.map(o => o?.label).filter((val) => val).join(' / ')
                pool.icons = poolTokens.map(o => o?.img).filter((val) => val)

                //To be calculated using historical data of the token
                pool.netROI = value.netROI.toFixed(2)+'%'
                pool.ROI = value.grossROI.toFixed(2)+'%'

                pool.id = value.address
                pool.tokens = poolTokens.map(o => o?.label).filter((val) => val)
                pool.platform = 'yEarn'
                pool.liquidity = parseInt(pool.liquidity).toLocaleString()
               
                if (!(poolTokens.length > 1 && !pool.poolName.includes('/')))
                    commit("updatePools", pool)

            })

        }

    });
}
export const getCurvesPools = ({ commit , state }, payload) => {

    axios.get('https://cors-anywhere.herokuapp.com/https://zapper.fi/api/pool-stats/curve', config).then((result) => {
        if (result.data.length) {

            result.data.forEach((value, index) => {

                let poolTokens = value.tokens.map(o => state.zapperTokens.find(t => t.address.toLowerCase() == o.address.toLowerCase())).filter((val) => val)

                if (!poolTokens.length) return
                let pool = value
                pool.poolName = poolTokens.map(o => o?.label).filter((val) => val).join(' / ')
                pool.icons = poolTokens.map(o => o?.img).filter((val) => val)

                //To be calculated using historical data of the token
                pool.netROI = value.netROI+'%'
                pool.ROI = value.grossROI+'%'

                pool.tokens = poolTokens.map(o => o?.label).filter((val) => val)
                pool.platform = 'Curve'
                pool.id = value.contractAddress
                pool.liquidity = parseInt(pool.liquidity).toLocaleString()

                if (!(poolTokens.length > 1 && !pool.poolName.includes('/')))
                   commit("updatePools", pool)

            })

        }

    });
}
export const getZapperTokens = (context, payload) => {

    axios.get('https://cors-anywhere.herokuapp.com/https://zapper.fi/api/account-balance/tokens?addresses=0x358A6C0F7614C44b344381b0699E2397b1483252', config).then((result) => {
        if (result.data) {
            context.commit("setTokens", result.data['0x358A6C0F7614C44b344381b0699E2397b1483252'])
      }

    });
}

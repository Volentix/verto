/*
export function someAction (context) {
}
*/
import axios from 'axios'
const config = {
    headers: {
        'api-key': '22779110-b1a7-4b99-ac6e-827d0a39ef70',
    }
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
                pool.poolName = pair.map(o => o?.label).filter((val) => val).join(' / ')
                pool.icons = pair.map(o => o?.img).filter((val) => val)
                pool.netROI = '0.14%'
                pool.ROI = '0.14%'
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

export const getUniswapPools = ({ commit , state }, payload) => {

    axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', {
        query: `{
            pairs(first: 250, orderBy: reserveUSD, orderDirection: desc) {
              id
              reserve0
              reserve1
              totalSupply
              reserveUSD
              token0 {
                id
                symbol
                decimals
              }
              token1 {
                id
                symbol
                decimals
              }
            }
          }`
    }).then((result) => {
        if (result.data.hasOwnProperty('data') && result.data.data.pairs) {

            result.data.data.pairs.forEach((value, index) => {

                let pair = [state.zapperTokens.find(t => t.address.toLowerCase() == value['token0'].id.toLowerCase()), state.zapperTokens.find(t => t.address.toLowerCase() == value['token1'].id.toLowerCase())].filter((val) => val)
                if (pair.length != 2) return
                let pool = value
                pool.poolName = pair.map(o => o?.label).filter((val) => val).join(' / ')
                pool.icons = pair.map(o => o?.img).filter((val) => val)
                pool.netROI = '0.14%'
                pool.ROI = '0.14%'
                pool.tokens = pair.map(o => o?.label).filter((val) => val)
                pool.platform = 'Uniswap V2'
                pool.liquidity = parseInt(pool.reserveUSD).toLocaleString()


                if (!(pair.length > 1 && !pool.poolName.includes('/')))
                    commit("updatePools", pool)

            })

        }

    });
}
export const getYvaultsPools = ({ commit , state }, payload) => {
    axios.get('https://cors-anywhere.herokuapp.com/https://zapper.fi/api/yvaults', config).then((result) => {
        if (result.data.length) {

            result.data.forEach((value, index) => {

                let poolTokens = value.tokens.map(o => state.zapperTokens.find(t => t.address.toLowerCase() == o.address.toLowerCase())).filter((val) => val)

                if (!poolTokens.length) return
                let pool = value
                pool.poolName = poolTokens.map(o => o?.label).filter((val) => val).join(' / ')
                pool.icons = poolTokens.map(o => o?.img).filter((val) => val)
                pool.netROI = '0.14%'
                pool.ROI = '0.14%'
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
                pool.netROI = '0.14%'
                pool.ROI = '0.14%'
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

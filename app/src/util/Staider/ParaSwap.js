const axios = require('axios')
const BN = require('bignumber.js')

const API_URL = 'https://apiv4.paraswap.io/v2'

const SLIPPAGE = 3// 1%

const networks = {
  MAINNET: 1,
  POLYGON: 137
}

const tokens = {
  [networks.MAINNET]: [
    {
      'decimals': 18,
      'symbol': 'ETH',
      'address': '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    },
    {
      'decimals': 6,
      'symbol': 'USDC',
      'address': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    },
    {
      'decimals': 18,
      'symbol': 'DAI',
      'address': '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    }
  ],
  [networks.POLYGON]: [
    {
      'decimals': 18,
      'symbol': 'MATIC',
      'address': '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    },
    {
      'decimals': 8,
      'symbol': 'WBTC',
      'address': '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6'
    }
  ]
}

class ParaSwapper {
  constructor (network) {
    this.network = 1
    this.userAddress = '0x915f86d27e4E4A58E93E59459119fAaF610B5bE1'
  }
  setUserAddress (address) {
    this.userAddress = address
  }

  t (symbol, network) {
    network = network || networks.MAINNET

    return tokens[network].find(t => t.symbol === symbol)
  }
  async getRate (from, to, fromAmount) {
    const excludeDEXS = [
      'paraswappool',
      'paraswappool2',
      'paraswappool3',
      'paraswappool4',
      'paraswappool5',
      'uniswap'
    ].join(',')
    const pricesURL = `${API_URL}/prices/?version=4.0.0&from=${from.address}&to=${to.address}&amount=${fromAmount}&fromDecimals=${from.decimals}&toDecimals=${to.decimals}&side=SELL&network=1&excludeDEXS=${excludeDEXS}`

    const { data: { priceRoute } } = await axios.get(pricesURL, { headers: { 'X-Partner': 'avantgarde' } })

    return priceRoute
  }

  async buildSwap (from, to, srcAmount, minAmount, priceRoute) {
    const txURL = `${API_URL}/transactions/${this.network}?skipChecks=true`

    const txConfig = {
      priceRoute,
      srcToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      referrer: 'avantgarde',
      destToken: to.address,
      srcAmount,
      destAmount: minAmount,
      userAddress: this.userAddress
    }

    const { data } = await axios.post(txURL, txConfig)

    return data
  }

  async swap (_srcAmount, from, to, network) {
    try {
      const srcAmount = new BN(_srcAmount).times(10 ** from.decimals).toFixed(0)

      const ps = new ParaSwapper(1)

      const priceRoute = await ps.getRate(from, to, srcAmount)

      const minAmount = new BN(priceRoute.destAmount).times(1 - SLIPPAGE / 100).toFixed(0)

      const transaction = await ps.buildSwap(from, to, srcAmount, minAmount, priceRoute)

      return { transaction, minAmount, priceRoute }
    } catch (error) {
      console.error(error.response.data)
    }
  }
}
window.ParaSwapper = new ParaSwapper()
export default window.ParaSwapper

import {
  JsonRpc
} from 'eosjs'
import EOSContract from './EOSContract'
import Formatter from './Formatter'
import CrosschainDex from '@/util/CrosschainDex'
export default {
  data () {
    return {
      dex: null
    }
  },
  watch: {
    depositCoin (val) {
      this.error = null

      if (!this.destinationCoinOptions) {
        this.destinationCoinOptions = this.getAllCoins()
        this.destinationCoinOptions = this.destinationCoinOptions.filter(o => o.value !== this.depositCoin.value)
      }

      if (this.destinationCoin && this.depositCoin && this.destinationCoin.value.toLowerCase() === this.depositCoin.value.toLowerCase()) {
        this.destinationCoin = this.destinationCoinOptions.find(o => o.value.toLowerCase() !== this.depositCoin.value.toLowerCase())
      }
      this.checkBalance()
      if (val) {
        this.checkPair()
      }
    },
    '$store.state.settings.coins': function () {
      this.checkPair()
    },
    /*
    '$store.state.investment.accountTokens': function (val) {
      this.coins = this.$store.state.settings.coins.oneinch
      this.depositCoinOptions = this.getUniqueTokens(this.coins).filter(t => val.find(o => o.type === t.value)).map(o => {
        let token = this.$store.state.investment.accountTokens.find(t => t.type === o.value)
        o.usd = token.usd
        o.amount = token.amount
        return o
      })

      this.depositCoinUnfilter = this.depositCoinOptions

      if (!this.depositCoin || !this.depositCoinOptions.find(v => v.value.toLowerCase() === this.depositCoin.value.toLowerCase())) {
        let item = this.depositCoinOptions.find(v => v.value === this.$store.state.investment.defaultAccount.chain)
        if (item) { this.depositCoin = item }
      } else if (this.depositCoin && this.depositCoin.value) {
        this.depositCoin = this.depositCoinOptions.find(v => v.value.toLowerCase() === this.depositCoin.value.toLowerCase())
      }
    },
    */
    '$store.state.wallets.tokens': function (val) {
      if (val && !this.$store.state.settings.coins.coinswitch.length) {
        this.getGodexCoins()
        this.get1inchCoins()
        this.getDefiboxCoins()
      }
    },
    destinationCoin (val) {
      if (val) {
        this.checkPair()
        this.checkBalance()
      }
    }
  },
  methods: {
    checkBalance () {
      this.error = ''

      if (((!this.swapData || this.swapData.fromAmount !== 0) && this.depositCoin && (!this.depositCoin.amount || parseFloat(this.depositCoin.amount) === 0))) {
        this.error = 'Insuficient ' + this.depositCoin.value.toUpperCase() + ' balance'
      } else if ((this.tab === 'liquidity' && (!this.destinationCoin.amount || parseFloat(this.depositCoin.amount) === 0))) {
        this.error = 'Insuficient ' + this.destinationCoin.value.toUpperCase() + ' balance'
      }
    },
    getCoinsData () {
      let depositCoin = this.depositCoin ? this.$store.state.settings.coins[this.$store.state.settings.selectedDex].find(o => o.value.toLowerCase() === this.depositCoin.value.toLowerCase()) : 0
      let destinationCoin = this.destinationCoin ? this.$store.state.settings.coins[this.$store.state.settings.selectedDex].find(o => o.value.toLowerCase() === this.destinationCoin.value.toLowerCase()) : 0
      if (depositCoin) this.depositCoin = depositCoin
      if (destinationCoin) this.destinationCoin = destinationCoin
    },
    getUniqueTokens (coins) {
      if (!coins) return

      let duplicates = []

      return coins.map((el) => {
        let search = coins.filter(o => el.value.toLowerCase() === o.value.toLowerCase() && el.contract === o.contract)
        let value = search[0]

        if (search.length !== 1 && !duplicates.includes(el.value.toLowerCase())) {
          duplicates.push(el.value.toLowerCase())
        } else if (search.length !== 1) {
          value = null
        }
        return value
      }).filter(o => o != null)
    },
    checkContractFormat (contract) {
      return (typeof contract === 'undefined' || contract === 'undefined' || !contract) ? 'eosio.token' : contract
    },
    getCoinsByAccount (dex, accountName) {
      let coins = this.$store.state.settings.coins[dex]

      coins = this.getUniqueTokens(coins).filter(o => !(this.$store.state.wallets.tokens.filter(x => x.chain === 'eos' && x.name === accountName).map(w => w.type.toLowerCase()).includes(o.value.toLowerCase())))

      this.$store.state.wallets.tokens.filter(o => o.chain === 'eos' && o.type !== 'verto' && o.name === accountName).forEach((coin) => {
        let row = {
          'label': coin.type.toUpperCase(),
          'name': coin.name,
          'value': coin.type,
          'contract': coin.contract,
          'precision': coin.precision,
          'image': coin.chain === 'eos' ? 'https://defibox.oss-accelerate.aliyuncs.com/eos/' + this.checkContractFormat(coin.contract) + '-' + coin.type.toLowerCase() + '.png' : 'https://files.coinswitch.co/public/coins/' + coin.type.toLowerCase() + '.png',
          'dex': coin.chain === 'eos' ? 'defibox' : 'coinswitch',
          'amount': parseFloat(coin.amount),
          'amountUSD': coin.usd
        }

        coins.unshift(row)
      })

      // coins = this.getUniqueTokens(coins)

      return coins.sort(function (a, b) {
        return a.name ? -1 : 1
      })
    },

    getAllCoins (dex = false) {
      let coins = this.$store.state.settings.coins.coinswitch.concat(this.$store.state.settings.coins.oneinch).concat(this.$store.state.settings.coins.defibox).concat(this.$store.state.settings.coins.godex)

      coins = coins.filter(o => !(this.$store.state.wallets.tokens.filter(x => x.chain === 'eos').map(w => w.type.toLowerCase()).includes(o.value.toLowerCase())))

      this.$store.state.wallets.tokens.filter(o => o.chain === 'eos' && o.type !== 'verto').forEach((coin) => {
        let row = {
          'label': coin.type.toUpperCase(),
          'name': coin.name,
          'value': coin.type,
          'contract': coin.contract,
          'precision': coin.precision,
          'image': coin.icon,
          // 'image': 'https://defibox.oss-accelerate.aliyuncs.com/eos/' + coin.contract + '-' + coin.type + '.png',
          'dex': 'coinswitch',
          'amount': parseFloat(coin.amount),
          'amountUSD': coin.usd
        }

        coins.unshift(row)
      })
      // coins = this.getUniqueTokens(coins)
      return coins.sort(function (a, b) {
        return a.name ? -1 : 1
      })
    },
    sleep (milliseconds) {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    },
    checkPair () {
      this.dex = null
      this.error = false
      let crosschain = ['eth', 'btc']

      if (!this.destinationCoin || !this.depositCoin) return

      // let from = this.$store.state.settings.coins.defibox.find(o => o.value.toLowerCase() === this.depositCoin.value.toLowerCase())
      // let to = this.$store.state.settings.coins.defibox.find(o => o.value.toLowerCase() === this.destinationCoin.value.toLowerCase())

      if ((!this.$store.state.investment.defaultAccount || this.$store.state.investment.defaultAccount.chain !== 'eos') && this.destinationCoin && this.depositCoin && this.$store.state.settings.coins.oneinch.find(o => o.value.toLowerCase() === this.depositCoin.value.toLowerCase()) &&
        this.$store.state.settings.coins.oneinch.find(o => o.value.toLowerCase() === this.destinationCoin.value.toLowerCase())) {
        this.dex = 'oneinch'
        this.setDefaultWallet('eth')
      } else if ((this.$store.state.investment.defaultAccount && this.$store.state.investment.defaultAccount.chain === 'eos') || (this.destinationCoin && this.destinationCoin && !crosschain.includes(this.depositCoin.value.toLowerCase()) && !crosschain.includes(this.destinationCoin.value.toLowerCase()) && this.$store.state.settings.coins.defibox.find(o => o.value.toLowerCase() === this.depositCoin.value.toLowerCase()) &&
        this.$store.state.settings.coins.defibox.find(o => o.value.toLowerCase() === this.destinationCoin.value.toLowerCase()))) {
        this.dex = 'defibox'
        this.setDefaultWallet('eos')
      } else if (this.$store.state.settings.coins.godex.find(o => o.value.toLowerCase() === this.depositCoin.value.toLowerCase()) &&
        this.$store.state.settings.coins.godex.find(o => o.value.toLowerCase() === this.destinationCoin.value.toLowerCase())) {
        this.dex = 'godex'
      }

      /* else if (this.$store.state.investment.defaultAccount && this.$store.state.investment.defaultAccount.isEvm) {
        this.dex = 'oneinch'
      } */
      if (this.destinationCoin.value === 'vtx' && this.depositCoin.value === 'eth') {
        this.dex = 'coinswitch'
      }
      if (!this.dex) {
        if (this.$store.state.settings.coins.oneinch.length && this.destinationCoin && this.depositCoin) { this.error = 'Cannot swap ' + this.depositCoin.value.toUpperCase() + ' to ' + this.destinationCoin.value.toUpperCase() }
      } else {
        this.$store.commit('settings/setDex', {
          dex: this.dex,
          destinationCoin: this.destinationCoin,
          depositCoin: this.depositCoin,
          fromAmount: this.depositCoin.fromAmount
        })
      }
    },
    getGodexCoins () {
      CrosschainDex.setDex('godex')
      CrosschainDex.getCoinList('godex').then((res) => {
        this.depositCoinOptions = res.coins
        this.$store.commit('settings/setCoinData', {
          source: 'godex',
          data: res.coins
        })
      })
      /*
      const url = 'https://api.coinswitch.co'
      let headers = {
        'x-api-key': process.env[this.$store.state.settings.network].COINSWITCH_APIKEY
      }
      this.$axios.get(url + '/v2/coins', {
        headers
      }).then((result) => {
        let coins = result.data.data
        coins.push({
          isActive: true,
          isFiat: false,
          logoUrl: 'https://raw.githubusercontent.com/BlockABC/eos-tokens/master/tokens/volentixgsys/VTX.png',
          name: 'VTX',
          symbol: 'vtx'
        })
        coins = coins.map((coin) => {
          let item = this.$store.state.wallets.tokens.find(o => o.type.toLowerCase() === coin.symbol.toLowerCase())
          if (coin.isActive === true) {
            let row = {
              'label': coin.name.toUpperCase(),
              'value': coin.symbol,
              'image': coin.logoUrl,
              'dex': 'coinswitch',
              'amount': item ? item.amount : 0,
              'contract': item ? item.contract : null,
              'amountUSD': item ? item.usd : 0
            }
            return row
          }
        }).filter(function (el) {
          return el != null
        }).sort(function (a, b) {
          if (a.label.toLowerCase() < b.label.toLowerCase()) {
            return -1
          }
          return 1
        })

        this.$store.commit('settings/setCoinData', {
          source: 'coinswitch',
          data: coins
        })
      })
      */

      let coins = []

      coins.push({
        isActive: true,
        isFiat: false,
        logoUrl: 'https://raw.githubusercontent.com/BlockABC/eos-tokens/master/tokens/volentixgsys/VTX.png',
        name: 'VTX',
        chain: 'eos',
        symbol: 'vtx'
      })
      coins.push({
        isActive: true,
        isFiat: false,
        chain: 'eth',
        logoUrl: 'https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png',
        name: 'ETH',
        symbol: 'eth'
      })

      coins = coins.map((coin) => {
        let item = this.$store.state.wallets.tokens.find(o => o.type.toLowerCase() === coin.symbol.toLowerCase())
        if (coin.isActive === true) {
          let row = {
            'label': coin.name.toUpperCase(),
            'value': coin.symbol,
            'image': coin.logoUrl,
            'dex': 'coinswitch',
            'chain': [coin.chain],
            'amount': item ? item.amount : 0,
            'contract': item ? item.contract : null,
            'amountUSD': item ? item.usd : 0
          }
          return row
        }
      })

      this.$store.commit('settings/setCoinData', {
        source: 'coinswitch',
        data: coins
      })

      return coins
    },
    get1inchCoinsByChain (chain) {
      let coins = this.$store.state.tokens.evmTokens[chain]
      if (coins) {
        coins = Object.keys(coins).map((key, index) => {
          let item = this.$store.state.wallets.tokens.find(o => o.type.toLowerCase() === coins[key].symbol.toLowerCase() && o.chain === chain)
          let row = {
            'label': coins[key].name.toUpperCase(),
            'value': coins[key].symbol,
            'image': coins[key].logoURI,
            'address': coins[key].address,
            'chains': ['eth', 'matic'],
            'price': item ? item.tokenPrice : 0,
            'dex': 'oneinch',
            'amount': item ? item.amount : 0,
            'contract': item ? item.address : null,
            'amountUSD': item ? item.usd : 0
          }

          return row
        })
        coins = coins.filter(function (el) {
          return el != null
        }).sort(function (a, b) {
          if (a.label && b.label && a.label.toLowerCase() < b.label.toLowerCase()) {
            return -1
          }
          return 1
        })
      }
      return coins || []
    },
    get1inchCoins (chain = 1) {
      const _1inch = process.env[this.$store.state.settings.network].CACHE + 'https://api.1inch.exchange'
      this.$axios.get(_1inch + '/v3.0/' + chain + '/tokens').then((result) => {
        // will be using this coins array later with the destination select
        let coins = result.data.tokens

        coins = Object.keys(coins).filter(o => coins[o].symbol.toLowerCase() !== 'vtx').map((key, index) => {
          let item = this.$store.state.wallets.tokens.find(o => o.type.toLowerCase() === coins[key].symbol.toLowerCase() && o.chain === 'eth')
          let image = coins[key].symbol.toLowerCase() === 'eth' ? 'https://s3.amazonaws.com/token-icons/eth.png' : 'https://tokens.1inch.exchange/' + coins[key].address.toLowerCase() + '.png'

          let row = {
            'label': coins[key].name.toUpperCase(),
            'value': coins[key].symbol,
            'image': image,
            'address': coins[key].address,
            'decimals': coins[key].decimals,
            'chains': ['eth', 'matic'],
            'price': coins[key].current_price,
            'dex': 'oneinch',
            'priority': ['eth', 'dai', 'hex', 'usdt', 'usdc'].reverse().indexOf(coins[key].symbol.toLowerCase()),
            'amount': item ? item.amount : 0,
            'contract': item ? item.address : null,
            'amountUSD': item ? item.usd : 0
          }

          return row
        })
        coins = coins.filter(function (el) {
          return el != null
        }).sort(function (a, b) {
          if (a.label && b.label && a.label.toLowerCase() < b.label.toLowerCase()) {
            return -1
          }
          return 1
        }).sort((a, b) => b.priority - a.priority)
        this.$store.commit('settings/setCoinData', {
          source: 'oneinch',
          data: coins
        })
      })
    },
    getHistoricalValue (token) {
      let tokenData = this.$store.state.tokens.walletTokensData.find(a => a.symbol === token.type)

      if (tokenData) {
        let change = tokenData.price_change_24h * token.amount
        token.change24h = (change > 0 ? '+' : '-') + '$' + this.formatNumber(Math.abs(change), 2)
        token.change24hValue = (change > 0 ? '' : '-') + this.formatNumber(Math.abs(change), 2)
        token.change24hPercentage = (change > 0 ? '+' : '-') + this.formatNumber(Math.abs(tokenData.price_change_percentage_24h), 2) + '%'
        token.color = change > 0 ? 'text-green-6' : 'text-pink-12'
      }
      return token
    },
    initAssetTable (chain) {
      this.assets = []

      if (this.tableData) {
        this.assets = this.tableData
        this.loaded = false
        return
      }
      let account = null

      if (this.$store.state.currentwallet.wallet && this.$store.state.currentwallet.wallet.name) {
        account = this.$store.state.currentwallet.wallet
      }

      JSON.parse(JSON.stringify(this.$store.state.wallets.tokens.filter(o => (!account && !chain) || (chain && o.chain === chain) || (account && o.chain === account.chain && o.name === account.name)))).forEach((token, i) => {
        token.amount = parseFloat(token.amount)
        token.usd = parseFloat(token.usd)

        if (!isNaN(token.amount) && token.amount !== 0) {
          if (this.assets.find(o => o.type === token.type && (token.chain !== 'eos' || o.contract === token.contract))) {
            let index = this.assets.findIndex(o => o.type === token.type)

            this.assets[index].amount += token.amount
            this.assets[index].usd += isNaN(token.usd) ? 0 : token.usd
            this.assets[index].rateUsd = isNaN(token.usd) ? 0 : (token.usd / token.amount)
            this.assets[index].percentage = this.assets[index].usd / parseFloat(this.$store.state.wallets.portfolioTotal) * 100
            this.assets[index] = this.getHistoricalValue(this.assets[index])
          } else {
            token.percentage = token.usd / parseFloat(this.$store.state.wallets.portfolioTotal) * 100
            token.index = this.assets.length
            token.rateUsd = isNaN(token.usd) ? 0 : (token.usd / token.amount)
            token.friendlyType = token.type.length > 6 ? token.type.substring(0, 6) + '...' : token.type
            token = this.getHistoricalValue(token)

            this.assets.push(token)
          }
          this.assets.sort((a, b) => (isNaN(parseFloat(b.usd)) ? 0 : parseFloat(b.usd)) - (isNaN(parseFloat(a.usd)) ? 0 : parseFloat(a.usd)))
        }

        this.loaded = false
      })

      return this.assets
    },
    async getDefiboxPairs () {
      let rpc = new JsonRpc(process.env[this.$store.state.settings.network].CACHE + 'https://eos.greymass.com:443')
      let pairs = (await rpc.get_table_rows({
        json: true,
        code: 'swap.defi',
        scope: 'swap.defi',
        table: 'pairs',
        limit: -1
      })).rows

      if (pairs && pairs.length) {
        this.$store.commit('settings/setGlobalSettingsItem', { key: 'defiboxPairs', data: pairs })
      }
      return pairs
    },
    async getDefiboxCoins () {
      let pairs = await this.getDefiboxPairs()
      let coins = []

      pairs.forEach((value, index, array) => {
        let eosPool = { ...value, ...{ chain: 'eos', protocol: 'Defibox', liquidity: this.formatDefiboxPool(value.reserve0) + ' / ' + this.formatDefiboxPool(value.reserve1), volume: '-', yearlyROI: '-', poolName: [value.token0, value.token1].map(o => o.symbol.split(',')[1]).join(' / '), icons: [this.getEOSTokenImageUrl(value.token0.symbol.split(',')[1], value.token0.contract), this.getEOSTokenImageUrl(value.token1.symbol.split(',')[1], value.token1.contract)], fees: '-', platform: 'Defibox' } }
        if (eosPool.poolName.includes('VTX')) { this.$store.commit('investment/updatePools', eosPool) }

        let val = this.addCoinToGlobalList(value, 'token0', coins)
        if (val && val.contract !== 'issue.newdex') {
          coins.push(val)
        }
        val = this.addCoinToGlobalList(value, 'token1', coins)
        if (val && val.contract !== 'issue.newdex') {
          coins.push(val)
        }
      })

      this.$store.commit('settings/setCoinData', {
        source: 'defibox',
        data: coins
      })
    },
    getEosPairData (paymentOption, buyingOption = 'eos', pairs, amount) {
      let pairData = false

      if (
        paymentOption !== buyingOption
      ) {
        pairData = pairs.find(
          (w) =>
            (w.token1.symbol.split(',')[1].toLowerCase() === buyingOption &&
              paymentOption.toLowerCase() ===
                w.token0.symbol.split(',')[1].toLowerCase()) ||
            (w.token0.symbol.split(',')[1].toLowerCase() === buyingOption &&
              paymentOption.toLowerCase() ===
                w.token1.symbol.split(',')[1].toLowerCase())
        )

        if (pairData && parseFloat(pairData.liquidity_token) !== 0) {
          let multiplier = parseFloat(pairData.price1_last)
          let contract = pairData.token0.contract
          let precision = pairData.token0.symbol.split(',')[0]
          if (
            pairData.token0.symbol.split(',')[1].toLowerCase() === buyingOption
          ) {
            multiplier = parseFloat(pairData.price0_last)
            contract = pairData.token1.contract
            precision = pairData.token1.symbol.split(',')[0]
          }

          pairData.contract = contract
          pairData.toEquivalent = parseFloat(amount * multiplier).toFixed(precision)
        }
      }
      return pairData
    },
    addCoinToGlobalList (value, key, data) {
      let infosArray = value[key].symbol.split(',')
      let item = data.find(o => o.value.toLowerCase() === infosArray[1].toLowerCase())
      if (!item && !isNaN(value.price0_last)) {
        let url = this.getEOSTokenImageUrl(infosArray[1], value[key].contract)
        // let account = null // this.eosAccounts.find(o => o.type === infosArray[1].toLowerCase())
        let item = this.$store.state.wallets.tokens.find(o => o.type.toLowerCase() === infosArray[1].toLowerCase())
        let option = {
          label: infosArray[1]?.toUpperCase(),
          precision: infosArray[0],
          value: infosArray[1],
          contract: value[key].contract,
          image: url,
          chains: ['eos'],
          dex: 'defibox',
          priority: ['eos', 'vtx', 'dai', 'usdt'].reverse().indexOf(infosArray[1].toLowerCase()),
          amount: item ? item.amount : 0,
          amountUSD: item ? item.usd : 0

        }

        return option
      }
    }
  },
  mixins: [EOSContract, Formatter]
}

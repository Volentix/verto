import {
  JsonRpc
} from 'eosjs'
import EOSContract from './EOSContract'
export default {
  data () {
    return {
      dex: null
    }
  },
  watch: {
    depositCoin (val) {
      this.error = null

      if (!this.destinationCoinOptions) this.destinationCoinOptions = this.getAllCoins()
      this.destinationCoinOptions = this.destinationCoinOptions.filter(o => o.value !== this.depositCoin.value)

      if (this.destinationCoin.value.toLowerCase() === this.depositCoin.value.toLowerCase()) {
        this.destinationCoin = this.destinationCoinOptions.find(o => o.value.toLowerCase() !== this.depositCoin.value.toLowerCase())
      }
      this.checkBalance()
      if (val) {
        this.checkPair()
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
      if ((this.depositCoin && (!this.depositCoin.amount || parseFloat(this.depositCoin.amount) === 0))) {
        this.error = 'Insuficient ' + this.depositCoin.value.toUpperCase() + ' balance'
      } else if ((this.tab === 'liquidity' && (!this.destinationCoin.amount || parseFloat(this.depositCoin.amount) === 0))) {
        this.error = 'Insuficient ' + this.destinationCoin.value.toUpperCase() + ' balance'
      }
    },
    getCoinsData () {
      let depositCoin = this.$store.state.settings.coins[this.$store.state.settings.selectedDex].find(o => o.value.toLowerCase() === this.depositCoin.value.toLowerCase())
      let destinationCoin = this.$store.state.settings.coins[this.$store.state.settings.selectedDex].find(o => o.value.toLowerCase() === this.destinationCoin.value.toLowerCase())
      if (depositCoin) this.depositCoin = depositCoin
      if (destinationCoin) this.destinationCoin = destinationCoin
    },
    getUniqueTokens (coins) {
      let duplicates = []

      return coins.map((el) => {
        let search = coins.filter(o => el.value.toLowerCase() === o.value.toLowerCase())
        let value = search[0]

        if (search.length !== 1 && !duplicates.includes(el.value.toLowerCase())) {
          duplicates.push(el.value.toLowerCase())
        } else if (search.length !== 1) {
          value = null
        }
        return value
      }).filter(o => o != null)
    },
    getAllCoins () {
      let coins = this.$store.state.settings.coins.coinswitch.concat(this.$store.state.settings.coins.oneinch).concat(this.$store.state.settings.coins.defibox)

      coins = this.getUniqueTokens(coins).filter(o => !(this.$store.state.wallets.tokens.filter(x => x.chain === 'eos').map(w => w.type.toLowerCase()).includes(o.value.toLowerCase())))
      console.log(this.$store.state.wallets.tokens)
      this.$store.state.wallets.tokens.filter(o => o.chain === 'eos').forEach((coin) => {
        let row = {
          'label': coin.type,
          'name': coin.name,
          'value': coin.type,
          'contract': coin.contract,
          'precision': coin.precision,
          'image': 'https://ndi.340wan.com/eos/' + coin.contract + '-' + coin.type + '.png',
          'dex': 'coinswitch',
          'amount': parseFloat(coin.amount),
          'amountUSD': coin.usd
        }

        coins.unshift(row)
      })

      return coins.sort(function (a, b) {
        return a.name ? -1 : 1
      })
    },
    checkPair () {
      this.dex = null
      if (this.$store.state.settings.coins.oneinch.find(o => o.value.toLowerCase() === this.depositCoin.value.toLowerCase()) &&
        this.$store.state.settings.coins.oneinch.find(o => o.value.toLowerCase() === this.destinationCoin.value.toLowerCase())) {
        this.dex = 'oneinch'
      } else if (this.depositCoin.value.toLowerCase() !== 'eth' && this.destinationCoin.value.toLowerCase() !== 'eth' && this.$store.state.settings.coins.defibox.find(o => o.value.toLowerCase() === this.depositCoin.value.toLowerCase()) &&
        this.$store.state.settings.coins.defibox.find(o => o.value.toLowerCase() === this.destinationCoin.value.toLowerCase())) {
        this.dex = 'defibox'
        console.log(this.$store.state.settings.coins.defibox.find(o => o.value.toLowerCase() === this.destinationCoin.value.toLowerCase()), this.$store.state.settings.coins.defibox.find(o => o.value.toLowerCase() === this.depositCoin.value.toLowerCase()))
      } else if (this.$store.state.settings.coins.coinswitch.find(o => o.value.toLowerCase() === this.depositCoin.value.toLowerCase()) &&
        this.$store.state.settings.coins.coinswitch.find(o => o.value.toLowerCase() === this.destinationCoin.value.toLowerCase())) {
        this.dex = 'coinswitch'
      }

      console.log(this.dex, ' this.dex')
      if (!this.dex) {
        this.error = 'Cannot swap ' + this.depositCoin.value.toUpperCase() + ' to ' + this.destinationCoin.value
      } else {
        this.$store.commit('settings/setDex', { dex: this.dex, destinationCoin: this.destinationCoin, depositCoin: this.depositCoin })
      }
    },
    getCoinswitchCoins () {
      const url = 'https://api.coinswitch.co'
      let headers = {
        'x-api-key': process.env[this.$store.state.settings.network].COINSWITCH_APIKEY
      }
      this.$axios.get(url + '/v2/coins', { headers }).then((result) => {
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
              'label': coin.name,
              'value': coin.symbol,
              'image': coin.logoUrl,
              'dex': 'coinswitch',
              'amount': item ? item.amount : 0,
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

        this.$store.commit('settings/setCoinData', { source: 'coinswitch', data: coins })
      })
    },
    get1inchCoins () {
      const _1inch = 'https://api.1inch.exchange'
      this.$axios.get(_1inch + '/v1.1/tokens').then((result) => {
        // will be using this coins array later with the destination select
        let coins = result.data

        coins = Object.keys(coins).map((key, index) => {
          let item = this.$store.state.wallets.tokens.find(o => o.type.toLowerCase() === coins[key].symbol.toLowerCase())
          let image = coins[key].symbol.toLowerCase() === 'eth' ? 'https://1inch.exchange/assets/images/eth.png' : 'https://1inch.exchange/assets/token-logo/' + coins[key].address.toLowerCase() + '.png'

          let row = {
            'label': coins[key].name,
            'value': coins[key].symbol,
            'image': image,
            'address': coins[key].address,
            'price': coins[key].current_price,
            'dex': 'oneinch',
            'amount': item ? item.amount : 0,
            'amountUSD': item ? item.usd : 0
          }

          return row
        })
        coins = coins.filter(function (el) {
          return el != null
        }).sort(function (a, b) {
          if (a.label.toLowerCase() < b.label.toLowerCase()) {
            return -1
          }
          return 1
        })
        this.$store.commit('settings/setCoinData', { source: 'oneinch', data: coins })
      })
    },
    async getDefiboxCoins () {
      let rpc = new JsonRpc(process.env[this.$store.state.settings.network].CACHE + 'https://eos.greymass.com:443')
      let pairs = (await rpc.get_table_rows({
        json: true,
        code: 'swap.defi',
        scope: 'swap.defi',
        table: 'pairs',
        limit: -1
      })).rows
      let coins = []
      pairs.forEach((value, index, array) => {
        let val = this.addCoinToGlobalList(value, 'token0', coins)
        if (val) { coins.push(val) }
        val = this.addCoinToGlobalList(value, 'token1', coins)
        if (val) { coins.push(val) }
      })
      this.$store.commit('settings/setCoinData', { source: 'defibox', data: coins })
    },
    addCoinToGlobalList (value, key, data) {
      let infosArray = value[key].symbol.split(',')
      let item = data.find(o => o.value.toLowerCase() === infosArray[1].toLowerCase())
      if (!item && !isNaN(value.price0_last)) {
        let url = this.getEOSTokenImageUrl(infosArray[1], value[key].contract)
        // let account = null // this.eosAccounts.find(o => o.type === infosArray[1].toLowerCase())
        let item = this.$store.state.wallets.tokens.find(o => o.type.toLowerCase() === infosArray[1].toLowerCase())
        let option = {
          label: infosArray[1],
          precision: infosArray[0],
          value: infosArray[1],
          contract: value[key].contract,
          image: url,
          dex: 'defibox',
          amount: item ? item.amount : 0,
          amountUSD: item ? item.usd : 0

        }

        return option
      }
    }
  },
  mixins: [EOSContract]
}

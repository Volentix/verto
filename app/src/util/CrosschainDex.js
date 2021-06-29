import axios from 'axios'
import store from '@/store'
import { computeForward } from '@/util/VolentixPools'
import { number_to_asset, asset } from 'eos-common'
import {
  JsonRpc
} from 'eosjs'
const Web3 = require('web3')
class Crosschaindex {
  constructor () {
    this.base = {
      godex: 'https://api.godex.io/api/v1/',
      oneinch: 'https://api.1inch.exchange/v3.0/'
    }
    this.exchanges = ['godex']
    this.coinList = {
      godex: []
    }
    this.vtxEquiv = null
    this.getVtxEquivalent()
    this.currentExchange = null
  }
  setDex = exchange => {
    this.currentExchange = exchange
  }
  getTxStatus = (order_id, exchange) => {
    const self = this
    let list = {
      godex () {
        return new Promise(async (resolve, reject) => {
          axios.get(self.base[exchange] + 'transaction/' + order_id).then(res => {
            if (res && res.data && res.data.status) {
              let data = {
                status: res.data.status
              }
              if (res.data.real_deposit_amount) {
                data.depositQuantity = parseFloat(res.data.real_deposit_amount)
                data.destinationQuantity = parseFloat(res.data.real_withdrawal_amount)
              }
              resolve(data)
            }
          })
        })
      }
    }

    return list[exchange]()
  };
  getCoinList = exchange => {
    const self = this
    let list = {
      godex () {
        return new Promise(async (resolve, reject) => {
          axios.get(self.base[exchange] + 'coins').then(res => {
            self.coinList[exchange] = []
            if (res && res.data && res.data.length) {
              // Remove support for multi address tokens (Ex. ZEC - Extra UI needed)
              res.data.filter(o => !o.multi).forEach(el => {
                let token = {
                  value: el.code.toLowerCase(),
                  image: el.icon,
                  label: el.name,
                  minimum: el.min_amount
                }
                self.coinList[exchange].push(token)
              })
              resolve({
                coins: self.coinList[exchange]
              })
            }
          })
        })
      }
    }
    return list[exchange]()
  };

  getAllCoins (unique = true, dex = false) {
    let coins = store.state.settings.coins.coinswitch.concat(store.state.settings.coins.oneinch).concat(store.state.settings.coins.defibox).concat(store.state.settings.coins.godex)

    coins = coins.filter(o => !(store.state.wallets.tokens.filter(x => x.chain === 'eos').map(w => w.type.toLowerCase()).includes(o.value.toLowerCase())))

    store.state.wallets.tokens.filter(o => o.chain === 'eos' && o.type !== 'verto').forEach((coin) => {
      let row = {
        'label': coin.type.toUpperCase(),
        'name': coin.name,
        'value': coin.type,
        'contract': coin.contract,
        'precision': coin.precision,
        'image': coin.icon,
        // 'image': 'https://ndi.340wan.com/eos/' + coin.contract + '-' + coin.type + '.png',
        'dex': 'coinswitch',
        'amount': parseFloat(coin.amount),
        'amountUSD': coin.usd
      }

      coins.unshift(row)
    })
    // coins = this.getUniqueTokens(coins)
    return coins.sort(function (a, b) {
      return a.name ? -1 : 1
    }).filter((o, i) => !unique || coins.findIndex(a => a.value === o.value && a.contract === o.contract) === i)
  }
  async getDefiboxPairs () {
    let rpc = new JsonRpc(process.env[store.state.settings.network].CACHE + 'https://eos.greymass.com:443')
    let pairs = (await rpc.get_table_rows({
      json: true,
      code: 'swap.defi',
      scope: 'swap.defi',
      table: 'pairs',
      limit: -1
    })).rows

    return pairs
  }
  async getDefiboxPairData (to, from) {
    this.ErrorMessage = null
    let pairs = await this.getDefiboxPairs()
    return pairs.find(
      (w) =>
        (w.token1.symbol.split(',')[1].toLowerCase() === from &&
            to ===
              w.token0.symbol.split(',')[1].toLowerCase()) ||
          (w.token0.symbol.split(',')[1].toLowerCase() === from &&
            to ===
              w.token1.symbol.split(',')[1].toLowerCase())
    )
  }
  getDex = (from, to) => {
    let dex = []
    let crosschains = ['eth', 'btc']
    if (store.state.settings.coins.oneinch.find(o => o.value.toLowerCase() === from.toLowerCase() && !crosschains.includes(from.toLowerCase())) &&
      store.state.settings.coins.oneinch.find(o => o.value.toLowerCase() === to.toLowerCase() && !crosschains.includes(to.toLowerCase()))) {
      dex.push({ chain: 'eth', dex: 'oneinch' })
    }
    if (store.state.settings.coins.defibox.find(o => o.value.toLowerCase() === from.toLowerCase() && !crosschains.includes(from.toLowerCase())) &&
      store.state.settings.coins.defibox.find(o => o.value.toLowerCase() === to.toLowerCase() && !crosschains.includes(to.toLowerCase()))) {
      dex.push({ chain: 'eos', dex: 'defibox' })
    }
    if ((store.state.settings.coins.godex.find(o => o.value.toLowerCase() === from.toLowerCase()) &&
      store.state.settings.coins.godex.find(o => o.value.toLowerCase() === to.toLowerCase())) || (store.state.settings.coins.godex.find(o => o.value.toLowerCase() === from.toLowerCase()) &&
      store.state.settings.coins.defibox.find(o => o.value.toLowerCase() === to.toLowerCase()))) {
      dex.push({ chain: false, dex: 'godex' })
    }
    return dex
  }
   getPair = (from, to, amount) => {
     const self = this
     let list = {
       oneinch () {
         return new Promise(async (resolve, reject) => {
           let fromToken = store.state.settings.coins.oneinch.find(o => o.value.toLowerCase() === from.toLowerCase())
           let toToken = store.state.settings.coins.oneinch.find(o => o.value.toLowerCase() === to.toLowerCase())
           let data = {
             fromTokenAddress: fromToken.address,
             toTokenAddress: toToken.address,
             amount: Web3.utils.toWei(amount.toString(), 'ether')
           }
           axios
             .get(self.base.oneinch + '1/quote?' + new URLSearchParams(data).toString())
             .then(res => {
               data.amount = parseFloat(Web3.utils.fromWei(res.data.toTokenAmount.toString(), 'ether'))
               data.fromChains = ['eth', 'matic', 'bsc']
               data.toChains = ['eth', 'matic', 'bsc']
               data.isCrosschain = false
               data.limitMaxDepositCoin = 0
               data.limitMinDepositCoin = 0
               data.rate = parseFloat(Web3.utils.fromWei(res.data.toTokenAmount.toString(), 'ether')) / amount
               resolve({
                 pair: data
               })
             })
             .catch(e => {
               reject({
                 error: e
               })
             })
         })
       },
       async defibox () {
         return new Promise(async (resolve, reject) => {
           let pairData = await self.getDefiboxPairData(to, from)
           let poolOne, poolTwo, toAmount
           let input = 'pool1'

           pairData.pool1 = asset(pairData.reserve0)
           pairData.pool2 = asset(pairData.reserve1)
           // let mul = 0.0001
           if (pairData.pool1.symbol.code().to_string() === from.toUpperCase()) {
             poolOne = pairData.pool1
             poolTwo = pairData.pool2
             // mul = 10000
           } else {
             poolOne = pairData.pool2
             poolTwo = pairData.pool1
           }
           // console.log(parseFloat(this.swapData.fromAmount), parseFloat(poolTwo.amount), parseFloat(poolOne.amount), parseFloat(mul), 'mul')
           pairData.price = (poolTwo.amount / poolOne.amount)

           pairData.fee = 0

           let a = (parseFloat(amount) || 0).toFixed(poolOne.symbol.precision())

           a = asset(a + ' ' + poolOne.symbol.code().to_string()).amount

           const p1 = poolOne.amount
           const p2 = poolTwo.amount

           if (input === 'pool1') {
             const r = number_to_asset(0, poolTwo.symbol)
             r.set_amount(Math.abs(computeForward(a.multiply(-1), p2, p1.plus(a), pairData.fee)))

             toAmount = r.to_string().split(' ')[0]
           } else {
             const result = computeForward(
               a.multiply(-1),
               pairData.pool1.amount,
               pairData.pool2.amount + a,
               pairData.fee
             ).abs()

             const r = number_to_asset(0, pairData.pool1.symbol)
             r.set_amount(result)

             toAmount = r.to_string().split(' ')[0]
           }
           let data = {}
           data.amount = parseFloat(toAmount)
           data.fromChains = ['eos']
           data.toChains = ['eos']
           data.isCrosschain = false
           data.limitMaxDepositCoin = 0
           data.limitMinDepositCoin = 0
           data.pair_id = pairData.id
           resolve({
             pair: data
           })
         })
       },
       godex () {
         return new Promise(async (resolve, reject) => {
           let data = {
             from: from.toUpperCase(),
             to: to.toUpperCase(),
             amount: amount
           }
           axios
             .post(self.base[self.currentExchange] + 'info', data)
             .then(async res => {
               data.minimum = parseFloat(res.data.min_amount)
               data.amount = res.data.amount
               data.fromAmount = res.data.amount
               data.fromChains = res.data.networks_from ? res.data.networks_from.map(o => o.network.toLowerCase()) : []
               data.toChains = res.data.networks_to ? res.data.networks_to.map(o => o.network.toLowerCase()) : []
               data.limitMaxDepositCoin = res.data.max_amount
               data.isCrosschain = true
               data.limitMinDepositCoin = res.data.min_amount
               data.minerFee = res.data.fee
               data.rate = res.data.rate
               resolve({
                 pair: data
               })
             })
             .catch(e => {
               reject({
                 error: e
               })
             })
         })
       }
     }
     return list[this.currentExchange]()
   }
  getVtxEquivalent = () => {
    axios.get(process.env[store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/simple/price?ids=volentix-vtx&vs_currencies=eth,eos')
      .then(res => {
        if (res && res.data && res.data['volentix-vtx']) { this.vtxEquiv = res.data['volentix-vtx'] }
      })
  }
  createTransaction = (from, to, amount, toAddress, fromChain, toChain, refundAddress) => {
    this.setDex('godex')
    const self = this
    let list = {
      godex () {
        return new Promise(async (resolve, reject) => {
          let data = {
            coin_from: from.toUpperCase(),
            coin_to: to.toUpperCase(),
            deposit_amount: amount,
            withdrawal: toAddress,
            return: refundAddress,
            refundAddress: refundAddress,
            coin_from_network: fromChain.toUpperCase(),
            coin_to_network: toChain.toUpperCase(),
            withdrawal_extra_id: null
          }
          axios
            .post(self.base[self.currentExchange] + 'transaction', data)
            .then(res => {
              let tx = {
                status: res.data.status,
                from: res.data.coin_from,
                to: res.data.coin_to,
                depositQuantity: res.data.deposit_amount,
                destinationAddress: res.data.withdrawal,
                destinationQuantity: res.data.withdrawal_amount,
                depositAddress: res.data.deposit,
                memo: res.data.deposit_extra_id,
                rate: res.data.rate,
                fee: res.data.fee,
                order_id: res.data.transaction_id
              }
              resolve({
                tx: tx
              })
            })
            .catch(e => {
              reject({
                error: e
              })
            })
        })
      }
    }
    return list['godex']()
  }
}
window.CrosschainDex = new Crosschaindex()
export default window.CrosschainDex

import axios from 'axios'
import store from '@/store'
import Lib from '@/util/walletlib'
// import coinsNames from '@/util/coinsNames'
import Web3 from 'web3'
import EosWrapper from '@/util/EosWrapper'
// import wallet from '../router/wallet'
const eos = new EosWrapper()

class Wallets2Tokens {
  constructor () {
    // console.log('wallets in the config', store.state.currentwallet.config.keys)
    // let list = ''
    // axios.get('https://api.coingecko.com/api/v3/coins/list').then(res => list = res.data)
    store.commit('wallets/setLoadingState', { eos: true, eth: true })
    const self = this
    this.eosUSD = 0
    axios.get(process.env[store.state.settings.network].CACHE + 'https://api.newdex.io/v1/price?symbol=eosio.token-eos-usdt').then(res => { self.eosUSD = res.data.data.price })
    store.state.wallets.portfolioTotal = 0
    this.tableData = [ ...store.state.currentwallet.config.keys ]
    /* this.tableData.push({
      key: '0x915f86d27e4E4A58E93E59459119fAaF610B5bE1',
      type: 'eth',
      chain: 'eth',
      name: 'ETH WALLET'
    })
    */

    this.tableData.map(wallet => {
      // let vtxCoin = wallet.type === 'verto' ? 'vtx' : wallet.type
      // let coinSlug = coinsNames.data.find(coin => coin.symbol.toLowerCase() === vtxCoin.toLowerCase())

      // let vespucciScore = 0
      // this.getCoinScore(coinSlug.slug).then(result => {
      //   vespucciScore = result.vespucciScore
      //   wallet.vespucciScore = vespucciScore
      // })
      if (!wallet.hasOwnProperty('type')) {
        wallet.type = 'verto'
      }

      if (wallet.type === 'eos') {
        wallet.to = '/verto/wallets/eos/eos/' + wallet.name.toLowerCase()
        wallet.icon = 'https://files.coinswitch.co/public/coins/' + wallet.type.toLowerCase() + '.png'
        wallet.chain = 'eos'
      } else if (wallet.type === 'verto') {
        wallet.to = '/verto/wallets/eos/verto/' + wallet.name.toLowerCase()
        wallet.icon = '/statics/icon.png'
        wallet.chain = 'eos'
      } else {
        wallet.to = '/verto/wallets/' + wallet.type + '/' + wallet.type + '/' + wallet.key
        wallet.chain = wallet.type
        wallet.disabled = wallet.type !== 'eth'
        wallet.icon = 'https://files.coinswitch.co/public/coins/' + wallet.type.toLowerCase() + '.png'
        // wallet.vespucciScore = vespucciScore
      }
      wallet.disabled = false

      if (wallet.type === 'btc' || wallet.type === 'ltc' || wallet.type === 'bnb' || wallet.type === 'dash') {
        Lib.balance(wallet.type, wallet.key).then(result => {
          // console.log('libwallet', result)
          // static value for recording video purpos
          // wallet.amount = wallet.type === 'btc' ? '0.23000000' : result.amount
          wallet.amount = result.amount
          wallet.usd = result.usd
        })
      }
    })

    store.state.currentwallet.config.keys.map(async (wallet) => {
      if (wallet.type.toLowerCase() === 'eos') {
        // If tokens are missing from this API, anyone can add them using this contract: https://bloks.io/account/customtokens?loadContract=true&tab=Actions&account=customtokens&scope=customtokens&limit=100&action=set
        await axios.post('https://eos.greymass.com/v1/chain/get_currency_balances', { 'account': wallet.name }).then(balances => {
          // console.log('eos balances', balances)
          // let balances = balancesArray.data.length === 0 ?
          if (balances.data.length === 0) {
            balances.data = [
              { amount: '0.0000', code: 'eosio.token', symbol: 'EOS' }
            ]
          }
          balances.data.map((t, index) => {
            // console.log('eos token', t)
            if (t.symbol.toLowerCase() !== 'eos') {
              if (+t.amount !== 0) {
                let name = wallet.name.toLowerCase()
                let type = t.symbol.toLowerCase()
                // let coinSlug = coinsNames.data.find(coin => coin.symbol.toLowerCase() === type.toLowerCase())
                // let vespucciScore = 0
                // if (coinSlug) {
                //   this.getCoinScore(coinSlug.slug).then(result => {
                //     vespucciScore = result.vespucciScore
                //   })
                // }

                let usdValue = 0
                this.getUSD(t.code, type).then(result => {
                  usdValue = result
                  // console.log('this.eosUSD $$$$$ ', usdValue)
                  self.tableData.push({
                    selected: false,
                    disabled: false,
                    type,
                    name,
                    // vespucciScore,
                    key: wallet.key,
                    privateKey: wallet.privateKey,
                    privateKeyEncrypted: wallet.privateKeyEncrypted,
                    amount: t.amount,
                    usd: usdValue * t.amount,
                    contract: t.code,
                    precision: t.amount.split('.')[1].length,
                    chain: 'eos',
                    to: '/verto/wallets/eos/' + type + '/' + name,
                    icon: 'https://ndi.340wan.com/eos/' + t.code + '-' + t.symbol.toLowerCase() + '.png'
                  })
                  store.state.wallets.portfolioTotal += usdValue * t.amount
                })
              }
              if (index === balances.data.length - 1) {
                store.commit('wallets/setLoadingState', { eos: true })
                this.updateWallet()
              }
            } else {
              eos.getAccount(wallet.name).then(a => {
                self.tableData.filter(w => w.key === wallet.key && w.type === 'eos').map(async eos => {
                  // let coinSlug = coinsNames.data.find(coin => coin.symbol.toLowerCase() === 'eos')
                  // eos.vespucciScore = (await this.getCoinScore(coinSlug.slug)).vespucciScore
                  eos.amount = t.amount ? t.amount : 0
                  eos.usd = this.eosUSD * t.amount
                  eos.contract = 'eosio.token'
                  eos.precision = t.amount.split('.')[1].length
                  // console.log('a ---------------------', a)
                  eos.proxy = a.voter_info ? a.voter_info.proxy : ''
                  eos.staked = a.voter_info ? a.voter_info.staked / 10000 : 0
                  // console.log('eos eos eos  ', eos)
                  store.state.wallets.portfolioTotal += this.eosUSD * t.amount
                })
              })
              // console.log('else EOS self.tableData', t.symbol, self.tableData)
            }
            if (index === balances.data.length - 1) {
              store.commit('wallets/setLoadingState', { eos: true })
              this.updateWallet()
            }
          })
        })
      } else if (wallet.type === 'eth') {
      //  wallet.key = '0x915f86d27e4E4A58E93E59459119fAaF610B5bE1'

        axios.get(process.env[store.state.settings.network].CACHE + 'https://api.ethplorer.io/getAddressInfo/' + wallet.key + '?apiKey=freekey').then(res => {
          let ethplorer = res.data

          /* self.tableData.filter(w => w.key === wallet.key).map(eth => {
            eth.amount = ethplorer.ETH.balance
            eth.usd = ethplorer.ETH.balance * ethplorer.ETH.price.rate
          })
           */
          // console.log('ethplorer', ethplorer)

          axios.get(process.env[store.state.settings.network].CACHE + 'https://api.tokensets.com/v1/rebalancing_sets', {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
          }).then(res => {
            let tokenSets = res.data.rebalancing_sets

            if (ethplorer.tokens) {
              ethplorer.tokens.filter(t => t.balance > 0 && t.tokenInfo.symbol).map(async (t, index) => {
                const csa = Web3.utils.toChecksumAddress(t.tokenInfo.address)
                let token = tokenSets.find(s => s.address.toLowerCase() === t.tokenInfo.address.toLowerCase())
                t.tokenInfo.image = t.tokenInfo.image && t.tokenInfo.image.includes('https') ? t.tokenInfo.image : (token && token.image ? token.image : false)

                if (!t.tokenInfo.image) {
                  try {
                    await axios.get(t.tokenInfo.image, { validateStatus: false }).then(result => {
                      if (result.status !== 200) {
                        t.tokenInfo.image = 'https://etherscan.io/images/main/empty-token.png'
                      }
                    })
                  } catch (error) {
                    console.log('eth token not on 1inch', t.tokenInfo.image, csa, error)
                  }
                }

                self.tableData.push({
                  selected: false,
                  disabled: false,
                  type: t.tokenInfo.symbol ? t.tokenInfo.symbol.toLowerCase() : '',
                  name: t.tokenInfo.name,
                  key: wallet.key,
                  privateKey: wallet.privateKey,
                  amount: t.balance / (10 ** t.tokenInfo.decimals),
                  usd: (t.balance / (10 ** t.tokenInfo.decimals)) * t.tokenInfo.price.rate,
                  contract: t.tokenInfo.address,
                  chain: 'eth',
                  to: '/verto/wallets/eth/' + t.tokenInfo.symbol.toLowerCase() + '/' + wallet.key,
                  icon: t.tokenInfo.image
                })

                if (index === ethplorer.tokens.length - 1) {
                  store.commit('wallets/setLoadingState', { eth: true })
                  this.updateWallet()
                }
              })
            }
          })
        })
      }
    })

    this.tableData.sort(function (a, b) {
      if (a.name && b.name && a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1
      }
      return 1
    })

    // this.$store.state.wallets.portfolioTotal = this.$store.state.wallets.portfolioTotal + usdValue * t.amount
    // console.log('this.$store.state.wallets', this.$store.state)
    store.commit('wallets/updateTokens', this.tableData)
    store.commit('wallets/updatePortfolioTotal', store.state.wallets.portfolioTotal)
  }
  async getAllAssets () {
    await axios.get('https://volentix.info/get_assets')
      .then(response => {
        // console.log('this.getAllAssets()->response--------', response.data.data)
        return response.data.data
      })
  }
  updateWallet () {
    this.tableData.sort(function (a, b) {
      if (a.name && b.name && a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1
      }
      return 1
    })
    this.tableData = this.tableData.map(o => {
      if (o.type === 'eth') {
        o.total = parseFloat(this.tableData.filter(f => f.key === o.key).map(o => isNaN(o.usd) ? 0 : o.usd).reduce((a, c) => a + c))
      }
      return o
    })

    this.tableData = this.tableData.map(o => {
      if (o.type === 'eos') {
        o.total = parseFloat(this.tableData.filter(f => f.chain === 'eos' && f.name === o.name).map(o => isNaN(o.usd) ? 0 : o.usd).reduce((a, c) => a + c))
      }
      return o
    })

    store.commit('wallets/updateTokens', this.tableData)
    store.commit('wallets/updatePortfolioTotal', store.state.wallets.portfolioTotal)
  }
  async getUSD (contract, coin) {
    if (coin === 'usdt' || coin === 'eosdt') {
      return 1
    }

    // 'https://api.coingecko.com/api/v3/simple/price?ids=' + +'&vs_currencies=usd'
    let coinEOS = (await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.newdex.io/v1/price?symbol=' + contract + '-' + coin + '-eos')).data.data.price
    let coinUSD = coinEOS * this.eosUSD
    // console.log(coin, ' --> USD', coinUSD)

    return coinUSD
  }
  async getCoinScore (coin) {
    let currentAsset = null
    await axios.get('https://volentix.info/get_asset_data?asset=' + coin)
      .then(response => {
        let mydata = response.data.data
        let scoreVespucci = 0
        for (let accuracy of mydata.rating) {
          if (accuracy.accuracy !== 0) {
            scoreVespucci = accuracy.accuracy
          }
        }
        let marketCap = mydata.marketcap.current_marketcap_usd
        currentAsset = {
          'buySupport': mydata.market_data.volume_last_24_hours,
          'currentPrice': mydata.market_data.price_usd,
          'marketCap': marketCap,
          'c24hChange': mydata.market_data.percent_change_usd_last_24_hours,
          'c24hChange2': (mydata.market_data.volume_last_24_hours_overstatement_multiple === undefined) ? 0 : mydata.market_data.volume_last_24_hours_overstatement_multiple,
          'vespucciScore': scoreVespucci
        }
        // console.log('self.currentAsset', self.currentAsset)
      })
    return currentAsset
  }
}
const initWallet = async () => {
  let wallet = await (new Wallets2Tokens())
  return wallet
}
export default initWallet

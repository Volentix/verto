import axios from 'axios'
import store from '@/store'
import Lib from '@/util/walletlib'
import coinsNames from '@/util/coinsNames'
import Web3 from 'web3'
import EosWrapper from '@/util/EosWrapper'
const eos = new EosWrapper()

class Wallets2Tokens {
  constructor () {
    console.log('wallets in the config', store.state.currentwallet.config.keys)
    // let list = ''
    // axios.get('https://api.coingecko.com/api/v3/coins/list').then(res => list = res.data)

    const self = this
    this.eosUSD = 0
    axios.get('https://cors-anywhere.herokuapp.com/https://api.newdex.io/v1/price?symbol=eosio.token-eos-usdt').then(res => { self.eosUSD = res.data.data.price })

    this.tableData = [ ...store.state.currentwallet.config.keys ]
    this.tableData.map(wallet => {
      wallet.type = wallet.type ? wallet.type : 'verto'

      let vtxCoin = wallet.type === 'verto' ? 'vtx' : wallet.type
      let coinSlug = coinsNames.data.find(coin => coin.symbol.toLowerCase() === vtxCoin.toLowerCase())

      let vespucciScore = 0
      this.getCoinScore(coinSlug.slug).then(result => {
        vespucciScore = result.vespucciScore
        wallet.vespucciScore = vespucciScore
      })
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
        wallet.icon = 'https://files.coinswitch.co/public/coins/' + wallet.type.toLowerCase() + '.png'
        wallet.vespucciScore = vespucciScore
      }

      if (wallet.type === 'btc' || wallet.type === 'ltc' || wallet.type === 'dash') {
        Lib.Wallet(wallet.type, wallet.key).then(result => {
          console.log('libwallet', result)
          wallet.amount = result.amount
          wallet.usd = result.usd
        })
      }
    })

    store.state.currentwallet.config.keys.map(async (wallet) => {
      if (wallet.type.toLowerCase() === 'eos') {
        // If tokens are missing from this API, anyone can add them using this contract: https://bloks.io/account/customtokens?loadContract=true&tab=Actions&account=customtokens&scope=customtokens&limit=100&action=set
        axios.post('https://eos.greymass.com/v1/chain/get_currency_balances', { 'account': wallet.name }).then(balances => {
          console.log('eos balances', balances)
          // let balances = balancesArray.data.length === 0 ?
          if (balances.data.length === 0) {
            balances.data = [
              { amount: '0.0000', code: 'eosio.token', symbol: 'EOS' }
            ]
          }
          balances.data.map(t => {
            console.log('eos token', t)
            if (t.symbol.toLowerCase() !== 'eos') {
              if (+t.amount !== 0) {
                let name = wallet.name.toLowerCase()
                let type = t.symbol.toLowerCase()
                let coinSlug = coinsNames.data.find(coin => coin.symbol.toLowerCase() === type.toLowerCase())
                let vespucciScore = 0
                if (coinSlug) {
                  this.getCoinScore(coinSlug.slug).then(result => {
                    vespucciScore = result.vespucciScore
                  })
                }

                let usdValue = 0
                this.getUSD(t.code, type).then(result => {
                  usdValue = result
                  console.log('usdValue', usdValue, t.amount, usdValue * t.amount)

                  self.tableData.push({
                    selected: false,
                    type,
                    name,
                    vespucciScore,
                    key: wallet.key,
                    privateKey: wallet.privateKey,
                    privateKeyEncrypted: wallet.privateKeyEncrypted,
                    amount: t.amount,
                    usd: usdValue * t.amount,
                    contract: t.code,
                    precision: t.amount.split('.')[1].length,
                    chain: 'eos',
                    to: '/verto/wallets/eos/' + type + '/' + name,
                    icon: 'https://raw.githubusercontent.com/BlockABC/eos-tokens/master/tokens/' + t.code + '/' + t.symbol + '.png'
                  })
                })
              }
            } else {
              eos.getAccount(wallet.name).then(a => {
                self.tableData.filter(w => w.key === wallet.key && w.type === 'eos').map(async eos => {
                  let coinSlug = coinsNames.data.find(coin => coin.symbol.toLowerCase() === 'eos')
                  eos.vespucciScore = (await this.getCoinScore(coinSlug.slug)).vespucciScore
                  eos.amount = t.amount ? t.amount : 0
                  eos.usd = this.eosUSD * t.amount
                  eos.contract = 'eosio.token'
                  eos.precision = t.amount.split('.')[1].length
                  console.log('a ---------------------', a)
                  eos.proxy = a.voter_info ? a.voter_info.proxy : ''
                  eos.staked = a.voter_info ? a.voter_info.staked / 10000 : 0
                })
              })
              console.log('else EOS self.tableData', t.symbol, self.tableData)
            }
          })
        })
      } else if (wallet.type === 'eth') {
        // wallet.key = '0x3aA6B43DC5e1fAAeAae6347ad01d0713Cf64A929' // temporary account override for testing
        axios.get('https://api.ethplorer.io/getAddressInfo/' + wallet.key + '?apiKey=freekey').then(res => {
          let ethplorer = res.data
          self.tableData.filter(w => w.key === wallet.key).map(eth => {
            eth.amount = ethplorer.ETH.balance
            eth.usd = ethplorer.ETH.balance * ethplorer.ETH.price.rate
          })

          console.log('ethplorer', ethplorer)

          axios.get('https://cors-anywhere.herokuapp.com/https://api.tokensets.com/v1/rebalancing_sets', {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
          }).then(res => {
            let tokenSets = res.data.rebalancing_sets
            // console.log('tokenSets', tokenSets)
            if (ethplorer.tokens) {
              ethplorer.tokens.filter(t => t.balance > 0).map(t => {
                t.tokenInfo.image = t.tokenInfo.image ? t.tokenInfo.image : 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/' + Web3.utils.toChecksumAddress(t.tokenInfo.address) + '/logo.png'
                const csa = Web3.utils.toChecksumAddress(t.tokenInfo.address)

                if (!t.tokenInfo.image) {
                  try {
                    const status = (axios.get('https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/' + csa + '/logo.png')).status
                    if (status === 200) {
                      t.tokenInfo.image = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/' + csa + '/logo.png'
                    }
                  } catch (error) {
                    t.tokenInfo.image = tokenSets.find(s => s.address === t.tokenInfo.address).image
                    console.log('eth token not on trustwallet', t, csa)
                  }
                }

                self.tableData.push({
                  selected: false,
                  type: t.tokenInfo.symbol.toLowerCase(),
                  name: t.tokenInfo.name,
                  amount: t.balance / (10 ** t.tokenInfo.decimals),
                  contract: t.tokenInfo.address,
                  chain: 'eth',
                  to: '/verto/wallets/eth/' + t.tokenInfo.symbol.toLowerCase() + '/' + wallet.key,
                  icon: t.tokenInfo.image ? t.tokenInfo.image : ''
                })
              })
            }
          })
        })
      }
    })

    this.tableData.sort(function (a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1
      }
      return 1
    })

    store.commit('wallets/updateTokens', this.tableData)
  }
  async getAllAssets () {
    await axios.get('https://volentix.info/get_assets')
      .then(response => {
        // console.log('this.getAllAssets()->response--------', response.data.data)
        return response.data.data
      })
  }
  async getUSD (contract, coin) {
    if (coin === 'usdt' || coin === 'eosdt') {
      return 1
    }

    // 'https://api.coingecko.com/api/v3/simple/price?ids=' + +'&vs_currencies=usd'
    let coinEOS = (await axios.get('https://cors-anywhere.herokuapp.com/https://api.newdex.io/v1/price?symbol=' + contract + '-' + coin + '-eos')).data.data.price
    let coinUSD = coinEOS * this.eosUSD
    console.log(coin, ' --> USD', coinUSD)

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

export default new Wallets2Tokens()

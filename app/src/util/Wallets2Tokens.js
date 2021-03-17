import axios from 'axios'
import store from '@/store'
import Lib from '@/util/walletlib'
// import coinsNames from '@/util/coinsNames'
import Web3 from 'web3'
import EosWrapper from '@/util/EosWrapper'

class Wallets2Tokens {
  constructor (walletName = null) {
    let data = this.getWalletFromCache()

    this.tableDataCache = []
    this.tableData = []

    store.state.wallets.portfolioTotal = 0

    if (data) {
      this.tableDataCache = data.filter(w => w.name !== walletName || !walletName)

      if (!walletName) {
        this.updateWallet()
        return
      }
    }

    this.eos = new EosWrapper()
    const self = this
    self.eosUSD = 0
    this.getEosUSD()

    this.tableData = [ ...store.state.currentwallet.config.keys ].filter(w => w.name === walletName || !walletName)

    if (store.state.settings.network === 'testnet') {
      this.tableData = this.tableData.filter(o => o.origin === 'eos_testnet')
      this.tableData.map(async wallet => {
        if (wallet.type === 'eos') {
          wallet.to = '/verto/wallets/eos/eos/' + wallet.name.toLowerCase()
          wallet.icon = 'https://files.coinswitch.co/public/coins/' + wallet.type.toLowerCase() + '.png'
          wallet.chain = 'eos'
        }

        wallet.disabled = false
        let balances = {
          data: []
        }
        if (wallet.type.toLowerCase() === 'eos') {
        // It should be better to get all balances eosio.token is not deployed

          let vtxbalance = await this.eos.getCurrencyBalanceP(wallet.name, 'volentixtsys', 'VTX')
          // let eosbalance = 0 //eosTestnet.getCurrencyBalanceP(wallet.name, 'eosio', 'VTX')
          // console.log('eos balances', balances)
          vtxbalance = vtxbalance.length ? vtxbalance[0].split(' ')[0] : 0
          // console.log(vtxbalance, 'vtxbalance')
          balances.data = [
            { amount: '0.0000', code: 'eosio.token', symbol: 'EOS' },
            { amount: vtxbalance, code: 'volentixgsys', symbol: 'VTX' }
          ]
          // console.log('eos balances', balances)

          if (wallet.privateKey) {
            let value = wallet.privateKey.split('_')
            wallet.privateKey = value[value.length - 1]
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
                    precision: t.amount ? t.amount.split('.')[1].length : 0,
                    chain: 'eos',
                    to: '/verto/wallets/eos/' + type + '/' + name,
                    icon: 'https://ndi.340wan.com/eos/' + t.code + '-' + t.symbol.toLowerCase() + '.png'
                  })
                  store.state.wallets.portfolioTotal += usdValue * t.amount
                  this.updateWallet()
                })
              }
            } else {
              this.eos.getAccount(wallet.name).then(async a => {
                if (this.eosUSD === 0) {
                  await this.getEosUSD()
                }

                self.tableData.filter(w => w.key === wallet.key && w.type === 'eos' && w.name === wallet.name).map(async eos => {
                // let coinSlug = coinsNames.data.find(coin => coin.symbol.toLowerCase() === 'eos')
                // eos.vespucciScore = (await this.getCoinScore(coinSlug.slug)).vespucciScore
                  eos.amount = t.amount ? t.amount : 0
                  eos.usd = this.eosUSD * t.amount
                  eos.contract = 'eosio.token'
                  eos.privateKey = wallet.privateKey
                  eos.privateKeyEncrypted = wallet.privateKeyEncrypted
                  eos.precision = t.amount.split('.')[1].length
                  // console.log('a ---------------------', a)
                  eos.proxy = a.voter_info ? a.voter_info.proxy : ''
                  eos.staked = a.voter_info ? a.voter_info.staked / 10000 : 0
                  // console.log('eos eos eos  ', eos)
                  store.state.wallets.portfolioTotal += this.eosUSD * t.amount
                })
              })
              this.updateWallet()
            }
          })

          this.updateWallet()
        }
      })
    } else if (store.state.settings.network === 'mainnet') {
      this.tableData = this.tableData.filter(o => o.origin !== 'eos_testnet')
      // console.log(this.tableData.map(o => o.name + ' ' + o.privateKey), 99)
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
          wallet.disabled = wallet.type !== 'eth' && wallet.type !== 'dot'

          if (wallet.type === 'ksm') {
            wallet.icon = 'https://assets.coingecko.com/coins/images/9568/small/m4zRhP5e_400x400.jpg'
          } else if (wallet.type === 'avax') {
            wallet.icon = 'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png'
          } else {
            wallet.icon = 'https://files.coinswitch.co/public/coins/' + wallet.type.toLowerCase() + '.png'
          }
        // wallet.vespucciScore = vespucciScore
        }
        wallet.disabled = false

        if (wallet.type === 'btc' || wallet.type === 'ltc' || wallet.type === 'bnb' || wallet.type === 'dash' || wallet.type === 'dot' || wallet.type === 'ksm') {
          Lib.balance(wallet.type, wallet.key).then(result => {
          // console.log('libwallet', result)
          // static value for recording video purpos
          // wallet.amount = wallet.type === 'btc' ? '0.23000000' : result.amount
            wallet.amount = result.amount
            wallet.usd = result.usd
          })
        }
      })
    }
    store.state.currentwallet.config.keys.filter(w => w.name === walletName || !walletName).filter(o => store.state.settings.network === 'mainnet' && o.origin !== 'eos_testnet').map(async (wallet) => {
      if (wallet.type.toLowerCase() === 'eos') {
        // If tokens are missing from this API, anyone can add them using this contract: https://bloks.io/account/customtokens?loadContract=true&tab=Actions&account=customtokens&scope=customtokens&limit=100&action=set
        await axios.post('https://eos.greymass.com/v1/chain/get_currency_balances', { 'account': wallet.name }).then(balances => {
          if (balances.data.filter(o => o.code === 'eosio.token').length === 0) {
            balances.data.push(
              { amount: '0.0000', code: 'eosio.token', symbol: 'EOS' }
            )
          }

          let privateKeysAttrs = this.extractEOSPrivateKey(wallet.privateKey, wallet.key)

          if (privateKeysAttrs) {
            wallet.privateKey = privateKeysAttrs.privateKey
            wallet.privateKeyEncrypted = privateKeysAttrs.privateKeyEncrypted
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
                if (wallet.privateKey) {
                  let value = wallet.privateKey.split('_')
                  wallet.privateKey = value[value.length - 1]
                }
                let usdValue = 0
                this.getUSD(t.code, type).then(result => {
                  usdValue = result

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
                    precision: t.amount.split('.')[1] ? t.amount.split('.')[1].length : 0,
                    chain: 'eos',
                    to: '/verto/wallets/eos/' + type + '/' + name,
                    icon: 'https://ndi.340wan.com/eos/' + t.code + '-' + t.symbol.toLowerCase() + '.png'
                  })

                  this.updateWallet()
                })
              }
            } else {
              try {
                this.getEOSTokens(wallet)
              } catch (error) {
                this.eos.getAccount(wallet.name).then(async a => {
                  if (this.eosUSD === 0) {
                    await this.getEosUSD()
                  }

                  self.tableData.filter(w => w.key === wallet.key && w.type === 'eos' && w.name === wallet.name).map(async eos => {
                  // let coinSlug = coinsNames.data.find(coin => coin.symbol.toLowerCase() === 'eos')
                  // eos.vespucciScore = (await this.getCoinScore(coinSlug.slug)).vespucciScore

                    eos.amount = t.amount ? t.amount : 0
                    eos.usd = this.eosUSD * t.amount
                    eos.contract = 'eosio.token'
                    eos.privateKey = wallet.privateKey
                    eos.privateKeyEncrypted = wallet.privateKeyEncrypted
                    eos.precision = t.amount.split('.')[1] ? t.amount.split('.')[1].length : 0
                    // console.log('a ---------------------', a)
                    eos.proxy = a.voter_info ? a.voter_info.proxy : ''
                    eos.staked = a.voter_info ? a.voter_info.staked / 10000 : 0
                    // console.log('eos eos eos  ', eos)
                    store.state.wallets.portfolioTotal += this.eosUSD * t.amount
                  })
                })
                this.updateWallet()
              }
            }
          })
        })
        this.updateWallet()
      } else if (wallet.type === 'eth') {
        // Getting balance using zapper

        axios.get(process.env[store.state.settings.network].CACHE + 'https://api.ethplorer.io/getAddressInfo/' + wallet.key + '?apiKey=EK-kJ7LW-wCWTsAy-ALujf').then(res => {
          let ethplorer = res ? res.data : false

          if (!ethplorer || !ethplorer.ETH) return this.getEthBalanceFromZapper(wallet)

          self.tableData.filter(w => w.key === wallet.key).map(eth => {
            eth.amount = ethplorer.ETH.balance
            eth.key = wallet.key.toLowerCase()
            eth.usd = ethplorer.ETH.balance * ethplorer.ETH.price.rate
            eth.icon = 'https://zapper.fi/images/ETH-icon.png'
          })
          let ethBalance = ethplorer.ETH.balance * ethplorer.ETH.price.rate
          store.state.wallets.portfolioTotal += isNaN(ethBalance) ? 0 : ethBalance
          // console.log('ethplorer', ethplorer)
          if (ethplorer) {
            axios.get(process.env[store.state.settings.network].CACHE + 'https://api.tokensets.com/v1/rebalancing_sets', {
              headers: { 'X-Requested-With': 'XMLHttpRequest' }
            }).then(res => {
              let tokenSets = res.data.rebalancing_sets

              if (ethplorer.tokens) {
                ethplorer.tokens.filter(t => t.balance > 0 && t.tokenInfo.symbol).map(async (t, index) => {
                  const csa = Web3.utils.toChecksumAddress(t.tokenInfo.address)
                  let token = tokenSets.find(s => s.address.toLowerCase() === t.tokenInfo.address.toLowerCase())
                  t.tokenInfo.image = t.tokenInfo.image && t.tokenInfo.image.includes('https') ? t.tokenInfo.image : (token && token.image ? token.image : 'https://zapper.fi/images/' + t.tokenInfo.symbol.toUpperCase() + '-icon.png')

                  if (t.tokenInfo.image) {
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
                  let amount = (t.balance / (10 ** t.tokenInfo.decimals)) * t.tokenInfo.price.rate
                  self.tableData.push({
                    selected: false,
                    disabled: false,
                    type: t.tokenInfo.symbol ? t.tokenInfo.symbol.toLowerCase() : '',
                    name: wallet.name,
                    key: wallet.key.toLowerCase(),
                    privateKey: wallet.privateKey,
                    amount: t.balance / (10 ** t.tokenInfo.decimals),
                    usd: amount,
                    contract: t.tokenInfo.address,
                    chain: 'eth',
                    to: '/verto/wallets/eth/' + t.tokenInfo.symbol.toLowerCase() + '/' + wallet.key,
                    icon: t.tokenInfo.image
                  })
                  store.state.wallets.portfolioTotal += isNaN(amount) ? 0 : amount
                  this.updateWallet()
                })
              }
            })
          }
        })
      }
    })

    this.tableData.sort(function (a, b) {
      if (a.name && b.name && a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1
      }
      return 1
    })
    this.updateWallet()
    // this.$store.state.wallets.portfolioTotal = this.$store.state.wallets.portfolioTotal + usdValue * t.amount
    // console.log('this.$store.state.wallets', this.$store.state)
    // store.commit('wallets/updateTokens', this.tableData)
    // store.commit('wallets/updatePortfolioTotal', store.state.wallets.portfolioTotal)
  }

  getEOSTokens (wallet) {
    axios.get('https://www.api.bloks.io/account/' + wallet.name + '?type=getAccountTokens&coreSymbol=EOS')
      .then((response) => {
        if (response.data && response.data.tokens) {
          response.data.tokens.forEach(token => {
            let image = token.metadata.logo.split('https:').length === 3 ? token.metadata.logo : 'https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/placeholder.png'

            this.tableData.push({
              selected: false,
              disabled: false,
              type: token.currency.toLowerCase(),
              name: wallet.name,
              // vespucciScore,
              key: wallet.key,
              privateKey: wallet.privateKey,
              privateKeyEncrypted: wallet.privateKeyEncrypted,
              amount: token.amount,
              usd: token.usd_value,
              contract: token.contract,
              precision: token.decimals,
              chain: 'eos',
              to: '/verto/wallets/eos/' + token.currency.toLowerCase() + '/' + wallet.name,
              icon: image
            })
            this.updateWallet()
          })
        }
      })
  }
  getWalletFromCache () {
    let data = localStorage.getItem('walletPublicData')

    if (data) {
      data = JSON.parse(data)

      data.map(o => {
        let wallet = store.state.currentwallet.config.keys.find(a => a.key === o.key)

        if (wallet === undefined) return

        if (wallet.chain === 'eos' && wallet.privateKey) {
          let privateKeysAttrs = this.extractEOSPrivateKey(wallet.privateKey, wallet.key)

          if (privateKeysAttrs) {
            wallet.privateKey = null
            wallet.privateKeyEncrypted = true
          }

          let value = wallet.privateKey.split('_')
          wallet.privateKey = value[value.length - 1]
        }

        o.privateKey = wallet.privateKey
        o.privateKeyEncrypted = wallet.privateKeyEncrypted
      })
    }

    return data
  }
  async getEosUSD () {
    await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.newdex.io/v1/price?symbol=eosio.token-eos-usdt').then(res => { this.eosUSD = res.data.data.price })
  }

  getEthBalanceFromZapper (wallet) {
    axios.get(process.env[store.state.settings.network].CACHE + 'https://api.zapper.fi/v1/balances/tokens?addresses%5B%5D=' + wallet.key + '&api_key=5d1237c2-3840-4733-8e92-c5a58fe81b88').then(res => {
      let ethBalance = {
        usd: 0,
        ammount: 0
      }

      if (!res.data[wallet.key.toLowerCase()] || !res.data[wallet.key.toLowerCase()].length) return

      let e = res.data[wallet.key.toLowerCase()].find(o => o.symbol.toLowerCase() === 'eth')
      if (e) {
        ethBalance.usd = e.balanceUSD
        ethBalance.ammount = e.balance
      }

      this.tableData.filter(w => w.key.toLowerCase() === wallet.key.toLowerCase()).map(eth => {
        eth.amount = ethBalance.ammount
        eth.usd = ethBalance.usd
        eth.icon = 'https://zapper.fi/images/ETH-icon.png'
      })

      res.data[wallet.key.toLowerCase()].filter(o => o.symbol.toLowerCase() !== 'eth').forEach(t => {
        this.tableData.push({
          selected: false,
          disabled: false,
          type: t.symbol ? t.symbol.toLowerCase() : '',
          name: wallet.name,
          key: wallet.key,
          privateKey: wallet.privateKey,
          amount: t.balance,
          usd: t.balanceUSD,
          contract: t.tokenAddress,
          chain: 'eth',
          to: '/verto/wallets/eth/' + t.symbol.toLowerCase() + '/' + wallet.key,
          icon: 'https://zapper.fi/images/' + t.img
        })
        store.state.wallets.portfolioTotal += isNaN(t.balanceUSD) ? 0 : t.balanceUSD
        this.updateWallet()
      })
    })
  }
  extractEOSPrivateKey (privateKey, key) {
    // Looking for existing Private key format {"keys":[{},{}]}
    let data = null

    if ((typeof privateKey === 'string' || privateKey instanceof String) && privateKey.includes(key)) {
      data = JSON.parse(privateKey)
    } else if (typeof privateKey === 'object') {
      data = privateKey
    }

    try {
      let value = false
      if (data && data.hasOwnProperty('keys')) {
        let wallet = data.keys.find(w => w.key === key)
        if (wallet) {
          value = {
            privateKey: wallet.privateKey,
            privateKeyEncrypted: wallet.privateKeyEncrypted
          }
        }
      }
      return value
    } catch (e) {
      return false
    }
  }
  async getAllAssets () {
    await axios.get('https://volentix.info/get_assets')
      .then(response => {
        // console.log('this.getAllAssets()->response--------', response.data.data)
        return response.data.data
      })
  }
  updateWallet () {
    let data = this.tableData.concat(this.tableDataCache)
    store.commit('wallets/updateTokens', data)
    store.commit('wallets/updatePortfolioTotal', store.state.wallets.portfolioTotal)
  }
  async getUSD (contract, coin) {
    if (coin === 'usdt' || coin === 'eosdt') {
      return 1
    }

    // 'https://api.coingecko.com/api/v3/simple/price?ids=' + +'&vs_currencies=usd'
    let coinEOS = (await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.newdex.io/v1/price?symbol=' + contract + '-' + coin + '-eos'))

    coinEOS = (coinEOS && coinEOS.data) ? coinEOS.data.data.price : 0

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
const initWallet = async (walletName) => {
  let wallet = await (new Wallets2Tokens(walletName))
  return wallet
}
export default initWallet

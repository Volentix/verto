import axios from 'axios'
import store from '@/store'
import Lib from '@/util/walletlib'
// import coinsNames from '@/util/coinsNames'

import EosWrapper from '@/util/EosWrapper'

class Wallets2Tokens {
  constructor (walletName = null) {
    if (walletName) {
      walletName = null
      localStorage.removeItem('walletPublicDatav2')
    }
    let watchAccounts = localStorage.getItem('watchAccounts')
    watchAccounts = watchAccounts ? JSON.parse(watchAccounts) : []
    watchAccounts = watchAccounts.filter(o => !store.state.currentwallet.config.keys || ![...store.state.currentwallet.config.keys].find(a => a.key === o.key.toLowerCase()))
    let data = this.getWalletFromCache()
    let existingWallet = null
    let ethWallet = null
    this.tableDataCache = []
    this.tableData = []

    // store.state.wallets.portfolioTotal = 0
    /*
    store.state.currentwallet.config.keys.push({
      chain: 'eth',
      type: 'eth',
      name: 'test',
      key: '0x508f51c6fe10E5117caaEF3306fd2126A161825a'
    })
    store.state.currentwallet.config.keys.push({
      chain: 'eth',
      type: 'eth 2',
      name: 'test',
      key: '0xf4dcb9ca53b74e039f5fcfccd4f0548547a25772'
    })
    */

    if (data) {
      walletName = walletName ? walletName.toLowerCase() : walletName

      existingWallet = store.state.wallets.tokens.find(w => w.name.toLowerCase() === walletName)
      // Refresh ETh wallet if refresh is requested for an evm wallet
      if (existingWallet && existingWallet.isEvm) {
        ethWallet = store.state.wallets.tokens.find(w => w.key.toLowerCase() === existingWallet.key.toLowerCase() && w.chain === 'eth' && w.type === 'eth')
      }

      this.tableDataCache = data.filter(
        w => ((!walletName || (w.name.toLowerCase() !== walletName && !ethWallet)) || (ethWallet && w.key.toLowerCase() !== ethWallet.key.toLowerCase()))
      )

      if (!walletName) {
        this.updateWallet()
        return
      }
    }

    this.eos = new EosWrapper()
    const self = this
    self.eosUSD = 0
    this.getEosUSD()
    let accounts = [...store.state.currentwallet.config.keys].concat(watchAccounts)
    this.fetchCustomTokens(accounts)
    // if (accounts) return
    this.tableData = accounts.filter(
      w => (!walletName || (w.name.toLowerCase() === walletName.toLowerCase() && !ethWallet)) || (ethWallet && w.key.toLowerCase() === ethWallet.key.toLowerCase())
    )

    if (store.state.settings.network === 'testnet') {
      this.tableData = this.tableData.filter(o => o.origin === 'eos_testnet')
      this.tableData.map(async wallet => {
        if (wallet.type === 'eos') {
          wallet.to = '/verto/wallets/eos/eos/' + wallet.name.toLowerCase()
          wallet.icon =
            'https://files.coinswitch.co/public/coins/' +
            wallet.type.toLowerCase() +
            '.png'
          wallet.chain = 'eos'
          // wallet.name = 'crosschainfx'
        }

        wallet.disabled = false
        let balances = {
          data: []
        }
        if (wallet.type.toLowerCase() === 'eos') {
          // It should be better to get all balances eosio.token is not deployed

          let vtxbalance = await this.eos.getCurrencyBalanceP(
            wallet.name,
            'volentixtsys',
            'VTX'
          )
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
                let usd = Lib.findInExchangeList('eos', type, t.code)
                this.getUSD(t.code, type).then(result => {
                  usdValue = result
                  // console.log('this.eosUSD $$$$$ ', usdValue)
                  self.tableData.push({
                    disabled: false,
                    type,
                    name,
                    // vespucciScore,
                    key: wallet.key,
                    privateKey: wallet.privateKey,
                    privateKeyEncrypted: wallet.privateKeyEncrypted,
                    amount: t.amount,
                    tokenPrice: usd ? usdValue : usd,
                    usd: usd ? usdValue * t.amount : 0,
                    contract: t.code,
                    precision: t.amount ? t.amount.split('.')[1].length : 0,
                    chain: 'eos',
                    to: '/verto/wallets/eos/' + type + '/' + name,
                    icon:
                      'https://defibox.s3.ap-northeast-1.amazonaws.com/eos/' +
                      t.code +
                      '-' +
                      t.symbol.toLowerCase() +
                      '.png'
                  })
                  // store.state.wallets.portfolioTotal += usdValue * t.amount
                  this.updateWallet()
                })
              }
            } else {
              this.eos.getAccount(wallet.name).then(async a => {
                if (this.eosUSD === 0) {
                  await this.getEosUSD()
                }

                self.tableData
                  .filter(
                    w =>
                      w.key === wallet.key &&
                      w.type === 'eos' &&
                      w.name === wallet.name
                  )
                  .map(async eos => {
                    // let coinSlug = coinsNames.data.find(coin => coin.symbol.toLowerCase() === 'eos')
                    // eos.vespucciScore = (await this.getCoinScore(coinSlug.slug)).vespucciScore
                    eos.amount = t.amount ? t.amount : 0
                    eos.usd = this.eosUSD * t.amount
                    eos.contract = 'eosio.token'
                    eos.privateKey = wallet.privateKey
                    eos.privateKeyEncrypted = wallet.privateKeyEncrypted
                    eos.precision = t.amount.split('.')[1].length
                    eos.tokenPrice = this.eosUSD
                    eos.proxy = a.voter_info ? a.voter_info.proxy : ''
                    eos.staked = a.voter_info ? a.voter_info.staked / 10000 : 0
                    // console.log('eos eos eos  ', eos)
                    // store.state.wallets.portfolioTotal += this.eosUSD * t.amount
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
        if (Lib.evms.find(f => f.chain === wallet.type) && wallet.type !== 'eth') {
          wallet.type = 'eth'
        }

        if (wallet.type === 'eos') {
          wallet.to = '/verto/wallets/eos/eos/' + wallet.name.toLowerCase()
          wallet.icon =
            'https://files.coinswitch.co/public/coins/' +
            wallet.type.toLowerCase() +
            '.png'
          wallet.chain = 'eos'
        } else if (wallet.type === 'verto') {
          wallet.to = '/verto/wallets/eos/verto/' + wallet.name.toLowerCase()
          wallet.icon = 'https://files.coinswitch.co/public/coins/eos.png'
          wallet.chain = 'eos'
        } else {
          wallet.to =
            '/verto/wallets/' +
            wallet.type +
            '/' +
            wallet.type +
            '/' +
            wallet.key
          wallet.chain = wallet.type

          wallet.disabled =
            wallet.type !== 'eth' &&
            wallet.type !== 'dot' &&
            wallet.type !== 'ksm' &&
            wallet.type !== 'bnb' &&
            wallet.type !== 'sol'

          if (wallet.type === 'ksm') {
            wallet.icon =
              'https://assets.coingecko.com/coins/images/9568/small/m4zRhP5e_400x400.jpg'
          } else if (wallet.type === 'avax') {
            wallet.icon =
              'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png'
          } else if (wallet.type === 'sol') {
            wallet.icon =
              'https://assets.coingecko.com/coins/images/4128/small/coinmarketcap-solana-200.png'
          } else {
            wallet.icon =
              'https://files.coinswitch.co/public/coins/' +
              wallet.type.toLowerCase() +
              '.png'
          }
          // wallet.vespucciScore = vespucciScore
        }
        if (wallet.type === 'sol') {
          // wallet.key = 'HekM1hBawXQu6wK6Ah1yw1YXXeMUDD2bfCHEzo25vnEB'
        }
        wallet.disabled = false

        if (
          wallet.type === 'btc' ||
          wallet.type === 'ltc' ||
          wallet.type === 'bnb' ||
          wallet.type === 'dash' ||
          wallet.type === 'dot' ||
          wallet.type === 'ksm' ||
          wallet.type === 'sol'
        ) {
          Lib.balance(wallet.type, wallet.key).then(result => {
            // console.log('libwallet', result)
            // static value for recording video purpos
            // wallet.amount = wallet.type === 'btc' ? '0.23000000' : result.amount
            wallet.amount = result.amount
            wallet.tokenPrice = result.tokenPrice || 0
            wallet.usd = result.usd
          })
        }
      })
    }
    store.state.currentwallet.config.keys
      .concat(watchAccounts).filter(w => (!walletName || (w.name.toLowerCase() === walletName.toLowerCase() && !ethWallet)) || (ethWallet && w.key.toLowerCase() === ethWallet.key.toLowerCase()))
      .filter(
        o =>
          store.state.settings.network === 'mainnet' &&
          o.origin !== 'eos_testnet'
      )
      .map(async wallet => {
        if (wallet.type.toLowerCase() === 'eos') {
          // If tokens are missing from this API, anyone can add them using this contract: https://bloks.io/account/customtokens?loadContract=true&tab=Actions&account=customtokens&scope=customtokens&limit=100&action=set
          let eosBalance = await this.eos.getCurrencyBalanceP(
            wallet.name,
            'eosio.token',
            'EOS'
          )

          let balances = []

          eosBalance =
            !eosBalance || !eosBalance[0] || isNaN(eosBalance[0].split(' ')[0])
              ? 0
              : eosBalance[0].split(' ')[0]

          balances.push({
            amount: eosBalance,
            code: 'eosio.token',
            symbol: 'EOS'
          })

          let privateKeysAttrs = this.extractEOSPrivateKey(
            wallet.privateKey,
            wallet.key
          )

          if (privateKeysAttrs) {
            wallet.privateKey = privateKeysAttrs.privateKey
            wallet.privateKeyEncrypted = privateKeysAttrs.privateKeyEncrypted
          }
          this.getEOSTokens(wallet, balances)
        } else if (wallet.type === 'eth') {
          // wallet.key = '0x181717bab64928669f606ee8b266502aaa2f6608'
          Lib.evms.filter(m =>
            ![1, 940].includes(m.network_id) // Until eth is integrated into covalent api
          ).forEach(e => {
            axios
              .get(
                process.env[store.state.settings.network].CACHE +
                  'https://api.covalenthq.com/v1/' + e.network_id +
                  '/address/' + wallet.key + '/balances_v2/',
                { auth: { username: 'ckey_a9e6f6ab90584877b86b151eef3' } }
              )
              .then(res => {
                res.data.data.items.map(t => {
                  let amount = (t.balance / 10 ** t.contract_decimals) * t.quote_rate
                  /* const getLogo = (chainId, t) => {
                    let url = null
                    if(chainId === 56){
                      url = 'https://pancakeswap.finance/images/tokens/'+t.contract_address+'.svg'
                    } else {
                    url = t.logo_url && t.logo_url.length ? t.logo_url : self.getTokenImage(e.chain, t.contract_ticker_symbol.toLowerCase())
                  }
                } */
                  self.tableData.push({
                    isEvm: true,
                    disabled: false,
                    type: t.contract_ticker_symbol
                      ? t.contract_ticker_symbol.toLowerCase()
                      : '',
                    name: wallet.name,
                    tokenPrice: t.quote_rate,
                    key: wallet.key.toLowerCase(),
                    privateKey: wallet.privateKey,
                    amount: t.balance / 10 ** t.contract_decimals,
                    usd: amount,
                    watch: wallet.watch,
                    decimals: t.contract_decimals,
                    contract: t.contract_address,
                    chain: e.chain,
                    to:
                      '/verto/wallets/' + e.chain + '/' +
                      t.contract_ticker_symbol.toLowerCase() +
                      '/' +
                      wallet.key,
                    icon: self.getTokenImage(e.chain, t.contract_ticker_symbol.toLowerCase())
                  })
                })
                this.updateWallet()
              }).catch(e => {
                console.log(e, 'covalenthq')
              })
          })

          // Getting balance using zapper
          axios
            .get(
              process.env[store.state.settings.network].CACHE +
                'https://api.ethplorer.io/getAddressInfo/' +
                wallet.key +
                '?apiKey=EK-kJ7LW-wCWTsAy-ALujf'
            )
            .then(res => {
              let ethplorer = res ? res.data : false

              if (!ethplorer || !ethplorer.ETH) { return this.getEthBalanceFromZapper(wallet) }

              self.tableData
                .filter(w => w.key === wallet.key && w.type === 'eth' && w.chain === 'eth')
                .map(eth => {
                  eth.amount = ethplorer.ETH.balance
                  eth.isEvm = true
                  eth.decimals = 18
                  eth.key = wallet.key.toLowerCase()
                  eth.usd = ethplorer.ETH.balance * ethplorer.ETH.price.rate
                  eth.tokenPrice = ethplorer.ETH.price.rate
                  eth.icon = 'https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png'
                })
              // let ethBalance = ethplorer.ETH.balance * ethplorer.ETH.price.rate
              // store.state.wallets.portfolioTotal += isNaN(ethBalance) ? 0 : ethBalance
              // console.log('ethplorer', ethplorer)
              if (ethplorer) {
                axios
                  .get(
                    process.env[store.state.settings.network].CACHE +
                      'https://api.tokensets.com/v1/rebalancing_sets',
                    {
                      headers: { 'X-Requested-With': 'XMLHttpRequest' }
                    }
                  )
                  .then(res => {
                    // let tokenSets = res.data.rebalancing_sets

                    this.getPulseBalance(wallet, ethplorer)

                    if (ethplorer.tokens) {
                      ethplorer.tokens
                        .filter(t => t.balance > 0 && t.tokenInfo.symbol)
                        .map(async (t, index) => {
                          t.tokenInfo.image =
                            t.tokenInfo.image &&
                            t.tokenInfo.image.includes('https')
                              ? t.tokenInfo.image
                              : t.tokenInfo.image
                                ? 'https://ethplorer.io' + t.tokenInfo.image
                                : Lib.getDefaultToken('eth')

                          let usd = t.tokenInfo.symbol ? Lib.findInExchangeList('eth', t.tokenInfo.symbol.toLowerCase(), t.tokenInfo.address) : false
                          let amount =
                            (t.balance / 10 ** t.tokenInfo.decimals) *
                            t.tokenInfo.price.rate
                          self.tableData.push({
                            isEvm: true,
                            disabled: false,
                            type: t.tokenInfo.symbol
                              ? t.tokenInfo.symbol.toLowerCase()
                              : '',
                            name: wallet.name,
                            tokenPrice: usd ? t.tokenInfo.price.rate : 0,
                            key: wallet.key.toLowerCase(),
                            decimals: parseInt(t.tokenInfo.decimals),
                            privateKey: wallet.privateKey,
                            amount: t.balance / 10 ** t.tokenInfo.decimals,
                            usd: amount || 0,
                            contract: t.tokenInfo.address,
                            chain: 'eth',
                            to:
                              '/verto/wallets/eth/' +
                              t.tokenInfo.symbol.toLowerCase() +
                              '/' +
                              wallet.key,
                            icon: t.tokenInfo.image
                          })

                          // store.state.wallets.portfolioTotal += isNaN(amount) ? 0 : amount
                          this.updateWallet()
                        })
                    }
                  })
              }
            })
        } else if (wallet.type === 'bnb') {
          // self.tableData.push({
          //   selected: false,
          //   disabled: false,
          //   type: t.tokenInfo.symbol ? t.tokenInfo.symbol.toLowerCase() : '',
          //   name: wallet.name,
          //   tokenPrice: t.tokenInfo.price.rate,
          //   key: wallet.key.toLowerCase(),
          //   privateKey: wallet.privateKey,
          //   amount: t.balance / (10 ** t.tokenInfo.decimals),
          //   usd: amount,
          //   contract: t.tokenInfo.address,
          //   chain: 'eth',
          //   to: '/verto/wallets/eth/' + t.tokenInfo.symbol.toLowerCase() + '/' + wallet.key,
          //   icon: t.tokenInfo.image
          // })
          // // store.state.wallets.portfolioTotal += isNaN(amount) ? 0 : amount
          // this.updateWallet()
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
    // store.commit('wallets/updatePortfolioTotal',// store.state.wallets.portfolioTotal)
  }
  fetchCustomTokens (wallets) {
    let data = localStorage.getItem('customTokens')
    let tokens = (data ? JSON.parse(data) : [])
    wallets.filter(o => Lib.isEvm(o.type)).forEach(wallet => {
      tokens.map(async (t, i) => {
        let balance = await Lib.getEvmTokenBalance(t.address, wallet.key, t.chain)
        this.tableData.push({
          isEvm: true,
          disabled: false,
          type: t.type,
          name: wallet.name,
          watch: wallet.watch,
          tokenPrice: 0,
          key: wallet.key.toLowerCase(),
          privateKey: wallet.privateKey,
          amount: balance,
          usd: 0,
          decimals: t.decimals,
          contract: t.address,
          chain: t.chain,
          icon: this.getTokenImage(t.chain, t.type)
        })

        if (tokens.length - 1 === i) { this.updateWallet() }
      })
    })
  }

  async getPulseBalance (wallet, ethExplorer) {
    let balance = await Lib.balance('tpls', wallet.key)

    this.tableData.push({
      isEvm: true,
      disabled: false,
      type: 'tpls',
      name: wallet.name,
      tokenPrice: 0,
      key: wallet.key.toLowerCase(),
      privateKey: wallet.privateKey,
      amount: balance,
      usd: 0,
      decimals: 18,
      contract: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      chain: 'tpls',
      icon: 'https://pbs.twimg.com/profile_images/1412839310106234882/Z4H3-LxW_400x400.jpg'
    })
    if (ethExplorer && ethExplorer.tokens) {
      ethExplorer.tokens.map(async (t, i) => {
        let balance = await Lib.getEvmTokenBalance(t.tokenInfo.address, wallet.key, 'tpls')
        t.tokenInfo.image =
        t.tokenInfo.image &&
        t.tokenInfo.image.includes('https')
          ? t.tokenInfo.image
          : t.tokenInfo.image
            ? 'https://ethplorer.io' + t.tokenInfo.image
            : Lib.getDefaultToken('eth')
        this.tableData.push({
          isEvm: true,
          disabled: false,
          type: t.tokenInfo.symbol
            ? t.tokenInfo.symbol.toLowerCase()
            : '',
          name: wallet.name,
          watch: wallet.watch,
          tokenPrice: 0,
          key: wallet.key.toLowerCase(),
          privateKey: wallet.privateKey,
          amount: balance,
          usd: 0,
          decimals: 18,
          contract: t.tokenInfo.address,
          chain: 'tpls',
          icon: t.tokenInfo.image
        })

        if (ethExplorer.tokens.length - 1 === i) { this.updateWallet() }
      })
    }
    /*
    axios
      .get(
        process.env[store.state.settings.network].CACHE + 'https://scan.v2.testnet.pulsechain.com/address/' + wallet.key + '/token-balances')
      .then(res => {
        var html = new DOMParser().parseFromString(res.data, 'text/html')
        let rawTokenData = html.querySelectorAll('.border-bottom')

        for (let i = 0; i < rawTokenData.length; ++i) {
          let tokens = rawTokenData[i].querySelectorAll('p')
          let address = rawTokenData[i].querySelector('a').getAttribute('href').split('/')[2]
          let symbol = rawTokenData[i].getAttribute('data-token-symbol')
          let amount = parseFloat(tokens[1].innerText)

          this.tableData.push({
            isEvm: true,
            disabled: false,
            type: symbol.toLowerCase(),
            name: wallet.name,
            watch: wallet.watch,
            tokenPrice: 0,
            key: wallet.key.toLowerCase(),
            privateKey: wallet.privateKey,
            amount: amount,
            usd: 0,
            decimals: 18,
            contract: address,
            chain: 'tpls',
            icon: this.getTokenImage('eth', symbol.toLowerCase())
          })
        }
        this.updateWallet()
      }).catch(e => {
        console.log(e, 'e')
      })
      */
  }
  getTokenImage (chain, type) {
    if (type === 'tpls') type = 'eth'
    let image = Lib.getDefaultToken(chain)

    if (Lib.evms.find(o => o.chain === chain) && store.state.tokens.evmTokens[chain]) {
      let token = store.state.tokens.evmTokens[chain].find(o => o.symbol && type && o.symbol.toLowerCase() === type.toLowerCase())
      if (token) image = token.logoURI
      // Set bnb token image temp
    //  if (type === 'bnb') image = 'https://nownodes.io/images/binance-smart-chain/bsc-logo.png'
    }
    return image
  }

  async getEOSTokensV2 (wallet, balances, fetchTokens) {
    const self = this

    let response = await axios.get(process.env[store.state.settings.network].CACHE + 'https://eosx-apigw.eosx.io/api/balance/mainnet/' + wallet.name)
    if (response && response.data && response.data.data && response.data.data.balances) {
      response.data.data.balances.forEach(el => {
        balances.push({
          amount: el.amount,
          code: el.contract,
          symbol: el.currency,
          decimals: el.decimals
        })
      })
    }

    balances
      .filter(
        o => o.symbol.toLowerCase() === 'eos' || fetchTokens === true
      )
      .map((t, index) => {
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

              if (type === 'vtx') {
                let vtxData = store.state.tokens.walletTokensData.find(
                  o => o.symbol === 'vtx'
                )
                if (vtxData) {
                  usdValue = vtxData.current_price
                }
              }
              let usd = Lib.findInExchangeList('eos', type, t.code)
              self.tableData.push({
                disabled: false,
                type,
                name,
                // vespucciScore,
                key: wallet.key,
                privateKey: wallet.privateKey,
                privateKeyEncrypted: wallet.privateKeyEncrypted,
                amount: t.amount,
                watch: wallet.watch,
                tokenPrice: usd ? usdValue : usd,
                usd: usd ? usdValue * t.amount : 0,
                contract: t.code,
                precision: t.decimals ? t.decimals : (t.amount.toString().split('.')[1]
                  ? t.amount.split('.')[1].length
                  : 0),
                chain: 'eos',
                to: '/verto/wallets/eos/' + type + '/' + name,
                icon:
                'https://defibox.s3.ap-northeast-1.amazonaws.com/eos/' +
                t.code +
                '-' +
                t.symbol.toLowerCase() +
                '.png'
              })

              this.updateWallet()
            })
          }
        } else {
          this.getEosMainBalance(wallet, t.amount, 45567)
        }
      })
  }
  getEosMainBalance (wallet, amount, test) {
    this.tableData
      .filter(w => w.key === wallet.key && w.type === 'eos' && w.name === wallet.name)
      .map(eos => {
        this.eos.getAccount(wallet.name).then(async a => {
          if (this.eosUSD === 0) {
            await this.getEosUSD()
          }

          eos.amount = amount || '0.0000'
          eos.usd = this.eosUSD * amount
          eos.contract = 'eosio.token'
          eos.tokenPrice = this.eosUSD
          eos.precision = 4
          eos.accountData = a
          eos.proxy = a.voter_info ? a.voter_info.proxy : ''
          eos.staked = a.voter_info
            ? a.voter_info.staked / 10000
            : 0
        })
      })
  }
  getEOSTokens (wallet, balances) {
    axios
      .get('https://www.api.bloks.io/account/' +
          wallet.name +
          '?type=getAccountTokens&coreSymbol=EOS'
      )
      .then(response => {
        if (response && response.data && response.data.tokens) {
          response.data.tokens.forEach((token, i) => {
            let image =
              token.metadata.logo.split('https:').length === 3
                ? token.metadata.logo
                : 'https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/placeholder.png'
            let data = token
            let exchange = token.exchanges.find(
              o => o.name.toLowerCase() === 'defibox'
            )
            data.tokenPrice =
            exchange ? exchange.price : (token.exchanges && token.exchanges[0]
              ? token.exchanges[0].price
              : 0)
            if (token.currency.toLowerCase() === 'vtx') {
              let vtxData = store.state.tokens.walletTokensData.find(
                o => o.symbol === 'vtx'
              )
              if (vtxData) {
                data.tokenPrice = vtxData.current_price
              } else if (data.tokenPrice) {
                data.tokenPrice = token.exchanges.find(
                  o => o.name.toLowerCase() === 'defibox'
                ).price
              }
            }
            let usd = Lib.findInExchangeList('eos', token.currency, token.contract)
            this.tableData.push({
              disabled: false,
              type: token.currency.toLowerCase(),
              name: wallet.name,
              watch: wallet.watch,
              key: wallet.key,
              privateKey: wallet.privateKey,
              privateKeyEncrypted: wallet.privateKeyEncrypted,
              amount: token.amount,
              usd: usd ? token.amount * data.tokenPrice : 0,
              tokenPrice: data.tokenPrice,
              contract: token.contract,
              precision: token.decimals,
              chain: 'eos',
              to:
                '/verto/wallets/eos/' +
                token.currency.toLowerCase() +
                '/' +
                wallet.name,
              icon: image
            })

            if (i === response.data.tokens.length - 1) {
              this.getEosMainBalance(wallet, balances.find(o => o.symbol === 'EOS').amount, 12345)
            }
          })
          this.updateWallet()
        } else {
          this.getEOSTokensV2(wallet, balances, true)
        }
      }).catch(e => {
        this.getEOSTokensV2(wallet, balances, true)
      })
  }
  getWalletFromCache () {
    let data = localStorage.getItem('walletPublicDatav2')

    if (data) {
      data = JSON.parse(data)

      data.map(o => {
        let wallet = (store.state.currentwallet.config.keys || []).find(
          a => a.key === o.key
        )

        if (wallet === undefined) return

        if (wallet.chain === 'eos' && wallet.privateKey) {
          let privateKeysAttrs = this.extractEOSPrivateKey(
            wallet.privateKey,
            wallet.key
          )

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
    await axios
      .get(
        process.env[store.state.settings.network].CACHE +
          'https://api.newdex.io/v1/price?symbol=eosio.token-eos-usdt'
      )
      .then(res => {
        this.eosUSD = res.data.data.price
      })
  }
  getEthBalanceFromZapper (wallet) {
    // not working currently
    axios
      .get(
        process.env[store.state.settings.network].CACHE +
          'https://api.zapper.fi/v1/balances/tokens?addresses%5B%5D=' +
          wallet.key +
          '&api_key=5d1237c2-3840-4733-8e92-c5a58fe81b88'
      )
      .then(res => {
        let ethBalance = {
          usd: 0,
          ammount: 0
        }

        if (
          !res.data[wallet.key.toLowerCase()] ||
          !res.data[wallet.key.toLowerCase()].length
        ) { return }

        let e = res.data[wallet.key.toLowerCase()].find(
          o => o.symbol.toLowerCase() === 'eth'
        )
        if (e) {
          ethBalance.usd = e.balanceUSD
          ethBalance.ammount = e.balance
        }

        this.tableData
          .filter(w => w.key.toLowerCase() === wallet.key.toLowerCase() && w.type === 'eth' && w.chain === 'eth')
          .map(eth => {
            eth.amount = ethBalance.ammount
            eth.usd = ethBalance.usd
            eth.isEvm = true
            eth.icon = 'https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png'
          })

        res.data[wallet.key.toLowerCase()]
          .filter(o => o.symbol.toLowerCase() !== 'eth')
          .forEach(t => {
            this.tableData.push({
              disabled: false,
              isEvm: true,
              type: t.symbol ? t.symbol.toLowerCase() : '',
              name: wallet.name,
              key: wallet.key,
              privateKey: wallet.privateKey,
              amount: t.balance,
              watch: wallet.watch,
              usd: t.balanceUSD,
              contract: t.tokenAddress,
              chain: 'eth',
              to:
                '/verto/wallets/eth/' +
                t.symbol.toLowerCase() +
                '/' +
                wallet.key,
              icon: 'https://zapper.fi/images/' + t.img
            })
          })
        this.updateWallet()
      })
  }
  extractEOSPrivateKey (privateKey, key) {
    // Looking for existing Private key format {"keys":[{},{}]}
    let data = null

    if (
      (typeof privateKey === 'string' || privateKey instanceof String) &&
      privateKey.includes(key)
    ) {
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
    await axios.get('https://volentix.info/get_assets').then(response => {
      // console.log('this.getAllAssets()->response--------', response.data.data)
      return response.data.data
    })
  }
  updateWallet () {
    let data = this.tableData.concat(this.tableDataCache)
    store.commit('wallets/updateTokens', data)
    // store.commit('wallets/updatePortfolioTotal',// store.state.wallets.portfolioTotal)
  }
  async getUSD (contract, coin) {
    if (coin === 'usdt' || coin === 'eosdt') {
      return 1
    }

    // 'https://api.coingecko.com/api/v3/simple/price?ids=' + +'&vs_currencies=usd'

    let coinEOS = await axios.get(
      process.env[store.state.settings.network].CACHE +
        'https://api.newdex.io/v1/price?symbol=' +
        contract +
        '-' +
        coin +
        '-eos'
    )
    let coinUSD = 0
    if (coinEOS) {
      coinEOS = coinEOS && coinEOS.data ? coinEOS.data.data.price : 0
      coinUSD = coinEOS * this.eosUSD
    // console.log(coin, ' --> USD', coinUSD)
    }

    return coinUSD
  }
  async getCoinScore (coin) {
    let currentAsset = null
    await axios
      .get('https://volentix.info/get_asset_data?asset=' + coin)
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
          buySupport: mydata.market_data.volume_last_24_hours,
          currentPrice: mydata.market_data.price_usd,
          marketCap: marketCap,
          c24hChange: mydata.market_data.percent_change_usd_last_24_hours,
          c24hChange2:
            mydata.market_data.volume_last_24_hours_overstatement_multiple ===
            undefined
              ? 0
              : mydata.market_data.volume_last_24_hours_overstatement_multiple,
          vespucciScore: scoreVespucci
        }
        // console.log('self.currentAsset', self.currentAsset)
      })
    return currentAsset
  }
}
const initWallet = async walletName => {
  let wallet = await new Wallets2Tokens(walletName)
  return wallet
}
export default initWallet

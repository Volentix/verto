import axios from 'axios'
import store from '@/store'
import Lib from '@/util/walletlib'
import CW20s from '@/statics/json/cw20.json'

import EosWrapper from '@/util/EosWrapper'
/*
refresParams = {
  chains:[]
  acount:null
}
*/
class Wallets2Tokens {
  constructor (refresParams = null) {
    if (!refresParams || typeof refresParams === 'string') {
      refresParams = {
        chains: [],
        acount: null
      }
    }

    if (!refresParams) {
      refresParams.fromCache = true
    }

    if (!refresParams.chains) {
      refresParams.chains = []
    }
    this.refresParams = refresParams
    this.tableDataCache = []
    this.tableData = []
    this.cw20Pairs = CW20s
    this.eos = new EosWrapper()
    this.vtxPrice = 0

    this.initWallet()
  }
  isFoundInCache (wallet, cacheData = []) {
    let found = cacheData.find(o => o.key.toLowerCase() === wallet.key.toLowerCase() && o.name.toLowerCase() === wallet.name.toLowerCase() && o.chain.toLowerCase() === wallet.type.toLowerCase())
    console.log(found, cacheData, wallet)
    return found
  }
  initWallet () {
    // store.state.currentwallet.config.keys = '[{"name":"EOS Key","type":"verto","origin":"mnemonic","key":"EOS6UPTaGfmnFaZSonHeJGoThQUtvzMofVg2R2ShD5RKFP1uXMNnZ","defaultKey":true},{"name":"Bitcoin","type":"btc","origin":"mnemonic","key":"1BfUMHXcS3RoZYvFT3nYTwQDb27RAxqy9J","defaultKey":false,"to":"/verto/wallets/btc/btc/1BfUMHXcS3RoZYvFT3nYTwQDb27RAxqy9J","chain":"btc","disabled":false,"icon":"https://files.coinswitch.co/public/coins/btc.png","index":"1BfUMHXcS3RoZYvFT3nYTwQDb27RAxqy9J-btc","multitoken":false,"amount":0,"tokenPrice":39520,"usd":0},{"name":"Account 1","type":"eth","origin":"mnemonic","key":"0xcedb32e1f02a27d42f5f5023ae530077d4a8b71f","defaultKey":false,"to":"/verto/wallets/eth/eth/0xcedb32e1f02a27d42f5f5023ae530077d4a8b71f","chain":"eth","disabled":false,"icon":"https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png","index":"0xcedb32e1f02a27d42f5f5023ae530077d4a8b71f-eth","isEvm":true,"multitoken":true,"total":3278.1176760469725,"amount":1.2423390414449704,"decimals":18,"usd":3278.023698916368,"tokenPrice":2638.5902636559526},{"name":"Binance Chain","type":"bnb","origin":"mnemonic","key":"bnb1je2jftxphqvfx45y8v4tzwf9tl0t8ax76xfm7d","defaultKey":false,"to":"/verto/wallets/bnb/bnb/bnb1je2jftxphqvfx45y8v4tzwf9tl0t8ax76xfm7d","chain":"bnb","disabled":false,"icon":"https://files.coinswitch.co/public/coins/bnb.png","index":"bnb1je2jftxphqvfx45y8v4tzwf9tl0t8ax76xfm7d-bnb","multitoken":false,"amount":0,"tokenPrice":371.65,"usd":0},{"name":"Litecoin","type":"ltc","origin":"mnemonic","key":"LYSZCcJqpjQpUvTppwX322GpDHgPUefkEa","defaultKey":false,"to":"/verto/wallets/ltc/ltc/LYSZCcJqpjQpUvTppwX322GpDHgPUefkEa","chain":"ltc","disabled":false,"icon":"https://files.coinswitch.co/public/coins/ltc.png","index":"LYSZCcJqpjQpUvTppwX322GpDHgPUefkEa-ltc","multitoken":false,"amount":0,"tokenPrice":107.53,"usd":0},{"name":"DASH","type":"dash","origin":"mnemonic","key":"XoNz5qG9t8K4LK5MP1GQQ3vCR2aUAQddRC","defaultKey":false,"to":"/verto/wallets/dash/dash/XoNz5qG9t8K4LK5MP1GQQ3vCR2aUAQddRC","chain":"dash","disabled":false,"icon":"https://files.coinswitch.co/public/coins/dash.png","index":"XoNz5qG9t8K4LK5MP1GQQ3vCR2aUAQddRC-dash","multitoken":false,"amount":0,"tokenPrice":96,"usd":0},{"name":"Avalanche","type":"avax","origin":"mnemonic","key":"X-avax1m5x5w9lvst4xfrw7ayzd7gg68wwvh58u5radlq","defaultKey":false,"to":"/verto/wallets/avax/avax/X-avax1m5x5w9lvst4xfrw7ayzd7gg68wwvh58u5radlq","chain":"avax","disabled":false,"icon":"https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png","index":"X-avax1m5x5w9lvst4xfrw7ayzd7gg68wwvh58u5radlq-avax","multitoken":true},{"name":"Polkadot","type":"dot","origin":"mnemonic","key":"12izQG9wLpiaAYdPD9oVQGGJQ7Qgo5Bg2E6XybDqAtz7tvEF","defaultKey":false,"to":"/verto/wallets/dot/dot/12izQG9wLpiaAYdPD9oVQGGJQ7Qgo5Bg2E6XybDqAtz7tvEF","chain":"dot","disabled":false,"icon":"https://files.coinswitch.co/public/coins/dot.png","index":"12izQG9wLpiaAYdPD9oVQGGJQ7Qgo5Bg2E6XybDqAtz7tvEF-dot","multitoken":true,"amount":0,"tokenPrice":17.86,"usd":0},{"name":"Kusama","type":"ksm","origin":"mnemonic","key":"EJJvFEk7QU2UfSK2DZYA4o9h5hGuSSiQ7CoCxWS6cB6TdpA","defaultKey":false,"to":"/verto/wallets/ksm/ksm/EJJvFEk7QU2UfSK2DZYA4o9h5hGuSSiQ7CoCxWS6cB6TdpA","chain":"ksm","disabled":false,"icon":"https://assets.coingecko.com/coins/images/9568/small/m4zRhP5e_400x400.jpg","index":"EJJvFEk7QU2UfSK2DZYA4o9h5hGuSSiQ7CoCxWS6cB6TdpA-ksm","multitoken":true,"amount":0,"tokenPrice":121.5,"usd":0},{"name":"Solana","type":"sol","origin":"mnemonic","key":"DjbXv4FE267QWJk54ddKAKfZHEsd7DeEbtyUjxzLZ1ku","defaultKey":false,"to":"/verto/wallets/sol/sol/DjbXv4FE267QWJk54ddKAKfZHEsd7DeEbtyUjxzLZ1ku","chain":"sol","disabled":false,"icon":"https://assets.coingecko.com/coins/images/4128/small/coinmarketcap-solana-200.png","index":"DjbXv4FE267QWJk54ddKAKfZHEsd7DeEbtyUjxzLZ1ku-sol","multitoken":true,"amount":0,"tokenPrice":84.01,"usd":0},{"name":"Stellar Lumens","type":"xlm","origin":"mnemonic","key":"GBI7IFJRR5A3WIMC6IOB6OAO6ZNT3IH6LYJVLNUEKPN7KHPUA6NIXWCH","defaultKey":false,"to":"/verto/wallets/xlm/xlm/GBI7IFJRR5A3WIMC6IOB6OAO6ZNT3IH6LYJVLNUEKPN7KHPUA6NIXWCH","chain":"xlm","disabled":false,"icon":"https://files.coinswitch.co/public/coins/xlm.png","index":"GBI7IFJRR5A3WIMC6IOB6OAO6ZNT3IH6LYJVLNUEKPN7KHPUA6NIXWCH-xlm","multitoken":false},{"name":"Terra","type":"terra","origin":"mnemonic","key":"terra1dhyqt7qrex4m4g9sehdj3tqyxzwnzjlq9u8uzx","defaultKey":false,"to":"/verto/wallets/terra/terra/terra1dhyqt7qrex4m4g9sehdj3tqyxzwnzjlq9u8uzx","chain":"terra","disabled":false,"icon":"https://files.coinswitch.co/public/coins/terra.png","index":"terra1dhyqt7qrex4m4g9sehdj3tqyxzwnzjlq9u8uzx-terra","multitoken":true},{"name":"Tezos","type":"xtz","origin":"mnemonic","key":"tz1XMqDP2r3eUUmqScZZVaxhVHNLF3si8mPC","defaultKey":false,"to":"/verto/wallets/xtz/xtz/tz1XMqDP2r3eUUmqScZZVaxhVHNLF3si8mPC","chain":"xtz","disabled":false,"icon":"https://files.coinswitch.co/public/coins/xtz.png","index":"tz1XMqDP2r3eUUmqScZZVaxhVHNLF3si8mPC-xtz","multitoken":false},{"name":"victoreosvtx","type":"eos","origin":"mnemonic","key":"EOS6UPTaGfmnFaZSonHeJGoThQUtvzMofVg2R2ShD5RKFP1uXMNnZ","defaultKey":false,"to":"/verto/wallets/eos/eos/victoreosvtx","icon":"https://files.coinswitch.co/public/coins/eos.png","chain":"eos","disabled":false,"index":"EOS6UPTaGfmnFaZSonHeJGoThQUtvzMofVg2R2ShD5RKFP1uXMNnZ-eos-victoreosvtx","multitoken":true,"vtxStakes":2300000,"vtxStakesUsd":20000.064000000002,"amount":"0.0000","usd":0,"contract":"eosio.token","tokenPrice":1.99555511,"precision":4,"vtx":4,"accountData":{"account_name":"victoreosvtx","head_block_num":236418652,"head_block_time":"2022-03-15T20:38:41.500","privileged":false,"last_code_update":"1970-01-01T00:00:00.000","created":"2022-03-02T06:42:42.000","ram_quota":6699,"net_weight":11639,"cpu_weight":33708864,"net_limit":{"used":129,"available":21737,"max":21866},"cpu_limit":{"used":197,"available":2837,"max":3034},"ram_usage":3574,"permissions":[{"perm_name":"active","parent":"owner","required_auth":{"threshold":1,"keys":[{"key":"EOS6UPTaGfmnFaZSonHeJGoThQUtvzMofVg2R2ShD5RKFP1uXMNnZ","weight":1}],"accounts":[],"waits":[]}},{"perm_name":"owner","parent":"","required_auth":{"threshold":1,"keys":[{"key":"EOS6UPTaGfmnFaZSonHeJGoThQUtvzMofVg2R2ShD5RKFP1uXMNnZ","weight":1}],"accounts":[],"waits":[]}}],"total_resources":{"owner":"victoreosvtx","net_weight":"1.1639 EOS","cpu_weight":"3370.8864 EOS","ram_bytes":5299},"self_delegated_bandwidth":{"from":"victoreosvtx","to":"victoreosvtx","net_weight":"0.1000 EOS","cpu_weight":"0.1000 EOS"},"refund_request":null,"voter_info":{"owner":"victoreosvtx","proxy":"","producers":[],"staked":2000,"last_vote_weight":"0.00000000000000000","proxied_vote_weight":"0.00000000000000000","is_proxy":0,"flags1":0,"reserved2":0,"reserved3":"0 "},"rex_info":null,"subjective_cpu_bill_limit":{"used":0,"available":0,"max":0}},"proxy":"","staked":0.2}]'
    // store.state.currentwallet.config.keys = JSON.parse(store.state.currentwallet.config.keys)
    let watchAccounts = localStorage.getItem('watchAccounts')
    watchAccounts = watchAccounts ? JSON.parse(watchAccounts) : []

    watchAccounts = watchAccounts.filter(o => !store.state.currentwallet.config.keys || store.state.currentwallet.config.keys.filter(a => a[o.type === 'eos' ? 'name' : 'key'].toLowerCase() === o[o.type === 'eos' ? 'name' : 'key'].toLowerCase()).length === 0)
    watchAccounts.map(a => {
      a.key = a.key.trim()
      a.name = a.name.trim()
    })
    let accounts = (store.state.currentwallet.config.keys || []).concat(watchAccounts).filter(c => !this.refresParams.chains.length || this.refresParams.chains.includes(c.type))
    let eosCount = accounts.filter(o => !o.watch && o.type === 'eos' && o.name !== 'EOS Key').length
    console.log(watchAccounts.length, eosCount, 'eosCount', accounts, store.state.currentwallet.config.keys)
    if (eosCount) {
      accounts = accounts.filter(o => o.name !== 'EOS Key')
    }
    console.log(this.tableData.length, eosCount, 'eosCount', accounts)

    this.tableDataCache = this.getWalletFromCache()
    const self = this

    this.tableData = !this.refresParams.account && !this.refresParams.chains.length && !this.refresParams.fromCache ? accounts : accounts.filter(
      w => !this.isFoundInCache(w, this.tableDataCache)
    )
    console.log(this.tableDataCache.length, this.tableData.length, Object.assign([], this.tableData), 'wallet', this.refresParams)
    this.tableData.sort(function (a, b) {
      return a.type === 'eth' ? -1 : 1
    })
    this.fetchCustomTokens(this.tableData)

    this.tableData.map(wallet => {
      if (!wallet.hasOwnProperty('type')) {
        wallet.type = 'verto'
      }
      if (Lib.evms.find(f => f.chain === wallet.type) && wallet.type !== 'eth') {
        wallet.type = 'eth'
      }

      if (wallet.type === 'eos') {
        self.eosUSD = 0
        this.getEosUSD()

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
      } else if (wallet.type === 'terra') {
        console.log(wallet, 'terra')
        this.getTerraBalance(wallet)
      }
    })
    console.log(Object.assign([], this.tableData, 2))
    this.tableData
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
          Lib.evms.filter(m =>
            ![1, 940].includes(m.network_id) && ((!this.refresParams.chains.length || this.refresParams.chains.includes(m.chain)) && (!this.refresParams.account || this.refresParams.account.isEvm)) // Until eth is integrated into covalent api
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
                  eth.icon = 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png'
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
                          t.tokenInfo.image = 'https://tokens.1inch.io/' + t.tokenInfo.address + '.png'

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
  async getCw20TokenPrice (amount, contract, decimals = 6) {
    let val = 0
    if (!this.cw20Pairs.length) {
      let res = await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.terraswap.io/pairs')
      if (res && res.data) {
        this.cw20Pairs = res.data.pairs
      }
    }

    let contr = this.cw20Pairs.find(o => o.asset_infos.find(a => a.token) && o.asset_infos.find(i => i.token).token.contract_addr === contract)

    if (contr) {
      let asset = contr.asset_infos.find(o => o.native_token)
      let token = contr.asset_infos.find(o => o.token && o.token.contract_addr !== contract)
      if (asset) {
        let res = await axios.get(process.env[store.state.settings.network].CACHE + 'https://fcd.terra.dev/wasm/contracts/' + contr.contract_addr + '/store?query_msg={"simulation":{"offer_asset":{"amount":"' + amount + '","info":{"' + (asset ? 'native_token' : 'token') + '":{"' + (asset ? 'denom' : 'contract_addr') + '":"' + (asset ? asset.native_token.denom : token.token.contract_addr) + '"}}}}}')
        if (res.data && res.data.result) {
          val = 1 / (res.data.result.return_amount / amount)
        }
      }
    }

    return val
  }
  async getTerraBalance (wallet) {
    axios.get(process.env[store.state.settings.network].CACHE + 'https://fcd.terra.dev/v1/market/swaprate/uusd').then(async res => {
      let marketPrice = res.data
      axios.get(process.env[store.state.settings.network].CACHE + 'https://assets.terra.money/cw20/tokens.json').then(async resTokens => {
        let response = (await axios.get(process.env[store.state.settings.network].CACHE + 'https://fcd.terra.dev/v1/bank/' + wallet.key))
        if (response.data && response.data.balance) {
          let alltokens = Object.keys(resTokens.data.mainnet)
          for (let i = 0, counter = 20; i <= alltokens.length; i = i + counter) {
            let resEc20s = await axios.post('https://mantle.terra.dev/', Lib.getCw20TokenBalanceQuery(alltokens.slice(i, i + counter), wallet.key))
            if (resEc20s && resEc20s.data && resEc20s.data.data) {
              let tokensWIthBlance = Object.keys(resEc20s.data.data).filter(o => parseFloat(JSON.parse(resEc20s.data.data[o].Result).balance))
              tokensWIthBlance.map(async o => {
                let tkData = resTokens.data.mainnet[Object.keys(resTokens.data.mainnet).find(x => resTokens.data.mainnet[x].token.toLowerCase() === o)]
                let amount = parseFloat(JSON.parse(resEc20s.data.data[o].Result).balance)
                let decimals = tkData.decimals || 6
                let usd = 0

                if (tkData.symbol.toLowerCase() === 'aust') {
                  usd = await Lib.getUstState() || 0
                } else {
                  usd = await this.getCw20TokenPrice(amount, o, decimals)
                }

                amount = amount / 10 ** decimals
                let total = usd * amount
                let n = {
                  contract: o,
                  isCw20: true,
                  amount: amount,
                  icon: tkData.icon,
                  type: tkData.symbol,
                  name: wallet.name,
                  watch: wallet.watch,
                  tokenPrice: usd || 0,
                  key: wallet.key.toLowerCase(),
                  privateKey: wallet.privateKey,
                  usd: total || 0,
                  decimals: tkData.decimals,
                  chain: 'terra'
                }

                this.tableData.push(n)
                this.updateWallet()
              })
            }
          }
          response.data.balance.forEach(t => {
            let priceData = marketPrice.find(o => o.denom === t.denom)

            if (t.denom === 'uusd') {
              priceData = { swaprate: 1 }
            } else {
              priceData.swaprate = 1 / priceData.swaprate
            }
            let sym = t.denom === 'uluna' ? 'Luna' : t.denom.substring(1).toUpperCase().substring(0, t.denom.length - 2) + 'T'
            let total = priceData ? priceData.swaprate * (t.available / 10 ** 6) : 0
            let data = {
              type: sym,
              contract: t.denom,
              name: wallet.name,
              watch: wallet.watch,
              tokenPrice: priceData ? priceData.swaprate : 0,
              key: wallet.key.toLowerCase(),
              privateKey: wallet.privateKey,
              amount: t.available / 10 ** 6,
              usd: total || 0,
              decimals: 6,
              chain: 'terra',
              icon: 'https://assets.terra.money/icon/60/' + sym + '.png'
            }
            if (t.denom === 'uusd') {
              let i = this.tableData.findIndex(o => o.type === 'terra')
              this.tableData[i] = data
            } else {
              this.tableData.push(data)
            }
          })
          this.updateWallet()
        }
      })
    })
    /*
    let config = {
      method: 'get',
      url: process.env[store.state.settings.network].CACHE + 'https://api.apeboard.finance/wallet/terra/' + wallet.key,
      headers: {
        'accept': 'application/json, text/plain,',
        'ape-secret': 'U2FsdGVkX1+oVNvU20qw1VOBRyzXTuprRlQFR0Babg2IIWNUNBIAW4cfzxoNbpjOMj9kQ0ZmklkFLHOfkwjcT4HYPq3ufVJiQ4HTzFQUA/nCCDchgwU/avzsXs9n+U0zpO/5GmZfvivjFH3icgOS6A==',
        'passcode': 'A63uGa8775Ne89wwqADwKYGeyceXAxmHL'
      }
    }

    axios(config).then(async res => {
      res.data.filter(a => !a.isNative).map(async o => {
        let n = {
          contract: wallet.address,
          isCw20: !o.isNative,
          amount: o.balance,
          icon: o.logo,
          type: o.symbol,
          name: wallet.name,
          watch: wallet.watch,
          tokenPrice: o.price || 0,
          key: wallet.key.toLowerCase(),
          privateKey: wallet.privateKey,
          usd: o.price * o.balance,
          decimals: o.decimals,
          chain: 'terra'
        }

        this.tableData.push(n)
      })
      this.updateWallet()
    }) */
  }
  async getVtxStakes (f) {
    if (!this.vtxPrice) {
      this.vtxPrice = (await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/simple/price?ids=volentix-vtx&vs_currencies=usd')).data['volentix-vtx'].usd
    }

    let stakes = await this.eos.getTable('vertostaking', f.name, 'accountstake')
    let stakedAmounts = 0
    if (stakes.length) {
      stakes.forEach(s => {
        s.stake_amount = Math.round(+s.amount.split(' ')[0] * 10000) / 10000
        // s.subsidy = Math.round(+s.subsidy.split(' ')[0] * 10000) / 10000
        stakedAmounts += +s.stake_amount
      })
    }
    f.vtxStakes = stakedAmounts
    f.vtxStakesUsd = stakedAmounts * this.vtxPrice
    return f
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
    } else {
      let i = Lib.getTokenImage(type)
      if (i) {
        image = i
      }
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
          eos = await this.getVtxStakes(eos)

          eos.amount = amount || '0.0000'
          eos.usd = this.eosUSD * amount
          eos.contract = 'eosio.token'
          eos.tokenPrice = this.eosUSD
          eos.precision = 4
          eos.vtx = 4
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
  isRefreshable (account) {
    let toBeRefreshed = true
    if ((this.refresParams.chains.includes(account.chain) || !this.refresParams.chains.length) &&
     (!this.refresParams.account || (this.refresParams.account.name.toLowerCase() === account.name.toLowerCase() && this.refresParams.account.chain === account.chain))) {
      toBeRefreshed = false
    }
    return toBeRefreshed
  }
  getWalletFromCache () {
    let data = localStorage.getItem('walletPublicDatav2')

    if (data) {
      data = JSON.parse(data)

      data.filter(o => !this.isRefreshable(o)).map(o => {
        let wallet = (store.state.currentwallet.config.keys || []).find(
          a => a.key === o.key && o.name.toLowerCase() === a.name.toLowerCase()
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

    return data || []
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
          '&api_key=562eee97-e90e-42ac-8e7b-363cdff5cdaa'
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
            eth.icon = 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png'
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
const initWallet = async (refresParams, chains) => {
  let wallet = new Wallets2Tokens(refresParams, chains)
  return wallet
}
export default initWallet

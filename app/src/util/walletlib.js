import EosWrapper from '@/util/EosWrapper'
import axios from 'axios'
import store from '@/store'

import {
  userError
} from '@/util/errorHandler'
import {
  date
} from 'quasar'
import abiArray from '@/statics/abi/erc20.json'
const Web3 = require('web3')
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
class Lib {
  constructor (evms) {
    this.evms = [{
      name: 'Ethereum Chain',
      chain: 'eth',
      nativeToken: 'eth',
      icon: 'https://zapper.fi/images/ETH-icon.png',
      provider: 'https://mainnet.infura.io/v3/a66f85635aef42758bc4aeed2f295645',
      explorer: 'https://etherscan.io/tx/',
      gas: 'https://data-api.defipulse.com/api/v1/egs/api/ethgasAPI.json?api-key=61cb5f87d40937069b831354a3d9e8a5c1f1e69ebb755140b79e555249a8',
      network_id: 1
    }, {
      name: 'Binance Smart Chain',
      chain: 'bsc',
      nativeToken: 'bnb',
      icon: 'https://nownodes.io/images/binance-smart-chain/bsc-logo.png',
      provider: 'https://bsc-dataseed1.binance.org:443',
      explorer: 'https://bscscan.com/tx/',
      gas: 'https://api.bscscan.com/api?module=proxy&action=eth_gasPrice&apikey=JK2Z5XQYR1FMCAQFQDBFNS5FJM6XC7ETTB',
      network_id: 56
    }, {
      name: 'Polygon Chain',
      chain: 'matic',
      nativeToken: 'matic',
      icon: 'https://seeklogo.com/images/P/polygon-matic-logo-86F4D6D773-seeklogo.com.png',
      provider: 'https://rpc-mainnet.maticvigil.com/v1/08e234538a11a966248fd358b3b135c4aeb6924b',
      explorer: 'https://explorer-mainnet.maticvigil.com/tx/',
      gas: 'https://gasstation-mainnet.matic.network/',
      network_id: 137
    }, {
      name: 'Avalanche C-Chain',
      chain: 'avaxc',
      nativeToken: 'avax',
      icon: 'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png',
      provider: 'https://api.avax.network/ext/bc/C/rpc',
      explorer: 'https://cchain.explorer.avax.network/tx/',
      gas: '', // The C-Chain gas price is 225 nAVAX (225 GWei). The C-Chain gas limit is 8 * 10e6 (8,000,000).
      network_id: 43114
    }, {
      name: 'Fantom Chain',
      chain: 'ftm',
      nativeToken: 'ftm',
      icon: 'https://assets.coingecko.com/coins/images/4001/large/Fantom.png?1558015016',
      provider: 'https://rpcapi.fantom.network/',
      explorer: 'https://ftmscan.com/tx/',
      gas: '', // FTM tokens are required to pay gas fees. The Covalent API response returns gas_* fields in fiat units
      network_id: 250
    // }, { // Commented until they go live
    //   name: 'Moonbeam Polkadot',
    //   chain: 'mbp',
    //   network_id: 1284
    // }, {
    //   name: 'Moonriver Kusama',
    //   chain: 'mrk',
    //   network_id: 1285
    }]
    // instance = this
  }

  async getRawETHTransaction (token, from, to, value, key, contract, origin = 'mnemonic', evm = 'eth') {
    const Web3 = require('web3')
    let evmData = this.evms.find(o => o.chain === evm)
    let localWeb3 = new Web3(new Web3.providers.HttpProvider(evmData.provider))
    if (origin === 'metamask' && window.web3 && window.web3.currentProvider.isMetaMask) {
      localWeb3 = new Web3(window.web3.currentProvider)
    }

    let nonce = await localWeb3.eth.getTransactionCount(from)

    let web3Value = localWeb3.utils.toHex(localWeb3.utils.toWei(!value ? '0' : value.toString()))

    let sendTo = to
    let data = null

    if (token !== evmData.nativeToken) {
      let web3Contract = new localWeb3.eth.Contract(abiArray, contract)
      data = web3Contract.methods.transfer(to, web3Value).encodeABI()

      /* web3Contract.methods.transfer(to, web3Value).estimateGas(function (error, gasAmount) {
        console.log(error, gasAmount, 'error, gasAmount)')
      }) */
      sendTo = contract
      web3Value = '0x00'
    }

    let rawTx = {
      from,
      to: sendTo,
      nonce,
      value: web3Value,
      chainId: evmData.network_id
    }
    if (data) {
      rawTx.data = data
    }

    return rawTx
  }
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
  }

  getAllCoins (dex) {
    let coins = store.state.settings.coins.coinswitch.concat(store.state.settings.coins.oneinch).concat(store.state.settings.coins.defibox)

    coins = this.getUniqueTokens(coins).filter(o => !(store.state.wallets.tokens.filter(x => x.chain === 'eos').map(w => w.type.toLowerCase()).includes(o.value.toLowerCase())))

    store.state.wallets.tokens.filter(o => o.chain === 'eos' && o.type !== 'verto').forEach((coin) => {
      coin.contract = (typeof coin.contract === 'undefined' || coin.contract === 'undefined' || !coin.contract) ? 'eosio.token' : coin.contract

      let row = {
        'label': coin.type.toUpperCase(),
        'name': coin.name,
        'value': coin.type,
        'contract': coin.contract,
        'precision': coin.precision,
        'image': coin.chain === 'eos' ? 'https://ndi.340wan.com/eos/' + coin.contract + '-' + coin.type.toLowerCase() + '.png' : 'https://files.coinswitch.co/public/coins/' + coin.type.toLowerCase() + '.png',
        'dex': 'coinswitch',
        'amount': parseFloat(coin.amount),
        'amountUSD': coin.usd
      }

      if (dex !== 'coinswitch' || !coins.find(c => c.value.toLowerCase() === coin.type.toLowerCase())) {
        coins.unshift(row)
      }
    })
    return coins.sort(function (a, b) {
      return a.name ? -1 : 1
    })
  }
  getTransactionDirection (from, to, nameOrKey) {
    let direction = 'incoming'

    if (nameOrKey === from) {
      direction = 'outgoing'
    }

    return direction
  }

  removeExpiredData (days = 1) {
    const keepData = [
      'skin',
      'hideEosSetup',
      'disableIntro_defi',
      'closewizard',
      'disable_freeospopup',
      'globalSettings',
      'version'
    ]
    let date = localStorage.getItem('walletDataExpiration')
    let now = new Date()
    let saved = null
    if (date) {
      saved = new Date(date)
      saved.setDate(saved.getDate() + days)
    }
    console.log(date, now, saved)
    if (!date || now.getTime() > saved.getTime()) {
      let keys = Object.keys(localStorage),
        i = keys.length

      while (i--) {
        if (!keepData.includes(keys[i])) {
          localStorage.removeItem(keys[i])
        }
      }
    }
    localStorage.setItem('walletDataExpiration', now)
  }
  getTokenImage (type) {
    let token = this.getAllCoins().find((o) => o.value.toLowerCase() === type.toLowerCase())
    return token ? (type.toLowerCase() === 'eth' ? 'https://s3.amazonaws.com/token-icons/eth.png' : token.image) : 'https://etherscan.io/images/main/empty-token.png'
  }

  cacheWalletHistoryData (data, key, chain) {
    data.then(o => {
      if (o && o.hasOwnProperty('history') && key) { localStorage.setItem(chain + '_history_' + key, JSON.stringify(o)) }
    })
  }

  deleteWalletHistoryData (key, chain) {
    localStorage.removeItem(chain + '_history_' + key)
  }

  /*
  removeDuplicateTransactions (history) {
    // let duplicates = []
    //
    return history // .filter((el) => !duplicates.find(e => e === el.transID) && duplicates.push(el.transID))
  }
  */

  history = async (chain, key, token, data = null) => {
    const self = this
    const wallet = {
      async eos (token, key, data) {
        return new Promise(async (resolve, reject) => {
          let actions = []
          axios.post(process.env[store.state.settings.network].CACHE + process.env[store.state.settings.network].EOS_HISTORYAPI + '/v1/history/get_actions', {
            'account_name': key,
            pos: data.position,
            offset: data.offset
          })
            .then(function (result) {
              if (result.length !== 0) {
                result.data.actions.reverse().map(a => {
                // console.log('split', a.action_trace.act.name === 'transfer' ? a.action_trace.act.data.quantity.toString().split(' ')[1].toLowerCase() : 'not transfer')
                  if (token === 'eos' && (
                    a.action_trace.act.name === 'transfer' &&
                    a.action_trace.receiver === key && typeof a.action_trace.act.data.from !== 'undefined' && typeof a.action_trace.act.data.to !== 'undefined')) {
                  // console.log('walletlib history actions', a)

                    let amount = ''
                    switch (a.action_trace.act.name) {
                      case 'transfer':
                        amount = a.action_trace.act.data.to !== key ? '-' + a.action_trace.act.data.quantity : a.action_trace.act.data.quantity
                        break
                      case 'deposit':
                        amount = a.action_trace.act.data.to !== key ? '-' + a.action_trace.act.data.amount : a.action_trace.act.data.amount
                        break
                      case 'rentcpu':
                        amount = a.action_trace.act.data.to !== key ? '-' + a.action_trace.act.data.loan_payment : a.action_trace.act.data.loan_payment
                        break
                    }

                    let tx = {}

                    let date = new Date(a.block_time)
                    tx.timeStamp = date.getTime() / 1000
                    tx.chain = token
                    tx.friendlyHash = a.action_trace.trx_id.substring(0, 6) + '...' + a.action_trace.trx_id.substr(a.action_trace.trx_id.length - 5)
                    tx.to = tx.friendlyTo = a.action_trace.act.data.to
                    tx.hash = a.action_trace.trx_id
                    tx.explorerLink = 'https://bloks.io/transaction/' + tx.hash
                    tx.from = tx.friendlyFrom = a.action_trace.act.data.from
                    tx.time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                    tx.image = self.getTokenImage(amount.split(' ')[1])
                    tx.amount = amount.split(' ')[0]
                    tx.memo = a.action_trace.act.data.memo
                    tx.symbol = amount.split(' ')[1]
                    tx.direction = self.getTransactionDirection(tx.from, tx.to, key)
                    tx.dateFormatted = date.toISOString().split('T')[0]
                    tx.amountFriendly = parseFloat(Math.abs(tx.amount)).toFixed(6)

                    actions.push(tx)
                  }
                })
                resolve({
                  history: actions
                })
              }
            }).catch(function (error) {
              reject({
                error: error
              })
            })
        })
      },
      async bsc (token, key) {
        let data = chainsWallets.eth(chain, key)
        return data
      },
      async matic (token, key) {
        let data = chainsWallets.eth(chain, key)
        return data
      },
      async ftm (token, key) {
        let data = chainsWallets.eth(chain, key)
        return data
      },
      async avaxc (token, key) {
        let data = chainsWallets.eth(chain, key)
        return data
      },
      async eth (token, key, evm) {
        return new Promise(async (resolve, reject) => {
          let evmData = self.getEvmData(token)
          axios
            .get(
              process.env[store.state.settings.network].CACHE +
          'https://api.covalenthq.com/v1/' + evmData.network_id +
          '/address/' + key + '/transactions_v2/',
              { auth: { username: 'ckey_a9e6f6ab90584877b86b151eef3' } }
            )
            .then(res => {
              if (res.data.data.items) {
                let transactions = []
                res.data.data.items.filter(o => o.successful).forEach((a, index) => {
                  let tx = {}

                  let date = new Date(a.block_signed_at)
                  tx.timeStamp = date.getTime() / 1000
                  tx.chain = token
                  tx.friendlyHash = a.tx_hash.substring(0, 6) + '...' + a.tx_hash.substr(a.tx_hash.length - 5)
                  let decodedBlock = null
                  if (a.log_events && a.value === '0') {
                    decodedBlock = a.log_events.find(o => o.decoded && o.decoded.name === 'Transfer')
                    if (decodedBlock) {
                      tx.to = decodedBlock.decoded.params.find(o => o.name === 'to').value
                      tx.amount = decodedBlock.decoded.params.find(o => o.name === 'value').value
                      tx.amount = Web3.utils.fromWei(tx.amount.toString(), 'ether')
                      tx.symbol = 'N/A'
                      tx.image = ''
                      if (store.state.tokens.evmTokens[chain]) {
                        let foundToken = store.state.tokens.evmTokens[chain].find(o => o.address === a.to_address)
                        tx.symbol = foundToken ? foundToken.symbol : tx.symbol
                        tx.image = foundToken ? foundToken.logoURI : tx.image
                      }
                    }
                  }
                  if (!decodedBlock) {
                    tx.to = a.to_address
                    tx.amount = Web3.utils.fromWei(a.value.toString(), 'ether')
                    tx.symbol = evmData.nativeToken.toUpperCase()
                    tx.image = evmData.icon
                  }
                  tx.hash = a.tx_hash
                  tx.explorerLink = evmData.explorer + '/' + tx.hash
                  tx.from = a.from_address
                  tx.friendlyTo = tx.to.length ? tx.to.substring(0, 6) + '...' + tx.to.substr(tx.to.length - 5) : ''
                  tx.friendlyFrom = tx.from.substring(0, 6) + '...' + tx.from.substr(tx.from.length - 5)
                  tx.time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

                  // tx.memo = a.action_trace.act.data.memo

                  tx.direction = self.getTransactionDirection(tx.from, tx.to, key)
                  tx.dateFormatted = date.toISOString().split('T')[0]
                  tx.amountFriendly = parseFloat(Math.abs(tx.amount)).toFixed(6)
                  tx.active = false
                  tx.gasTotal = tx.gas_spent
                  tx.dateFormatted = date.toISOString().split('T')[0]
                  tx.amountFriendly = parseFloat(tx.amount).toFixed(6)

                  transactions.push(tx)
                })
                resolve({
                  history: transactions
                })
              }
            }).catch(error => {
              reject({
                error: error
              })
            })
        })
      },
      async btc (token, key, evmData) {
        key = '15urYnyeJe3gwbGJ74wcX89Tz7ZtsFDVew'
        return new Promise(async (resolve, reject) => {
          axios
            .get(
              process.env[store.state.settings.network].CACHE +
          'https://chain.api.btc.com/v3/address/' + key + '/tx'
            )
            .then(res => {
              if (res.data && res.data.data && res.data.data.list) {
                let transactions = []
                res.data.data.list.forEach((a, index) => {
                  let tx = {}

                  let date = new Date(a.block_time)
                  tx.timeStamp = date.getTime() / 1000
                  console.log(a.inputs, 1, a.outputs, 3)
                  // if (tx) return
                  let spender = a.inputs[0].prev_addresses[0]
                  let receiver = a.outputs[0].addresses[0]
                  tx.chain = token
                  tx.friendlyHash = a.hash.substring(0, 6) + '...' + a.hash.substr(a.hash.length - 5)

                  tx.to = receiver
                  tx.amount = a.outputs_value / 100000000
                  tx.symbol = token.toUpperCase()
                  tx.image = 'https://files.coinswitch.co/public/coins/btc.png'

                  tx.hash = a.hash
                  tx.explorerLink = 'https://www.blockchain.com/btc/block/' + a.block_hash
                  tx.from = spender
                  tx.friendlyTo = tx.to.length ? tx.to.substring(0, 6) + '...' + tx.to.substr(tx.to.length - 5) : ''
                  tx.friendlyFrom = tx.from.substring(0, 6) + '...' + tx.from.substr(tx.from.length - 5)
                  tx.time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

                  // tx.memo = a.action_trace.act.data.memo

                  tx.direction = self.getTransactionDirection(tx.from, tx.to, key)
                  tx.dateFormatted = date.toISOString().split('T')[0]
                  tx.amountFriendly = parseFloat(Math.abs(tx.amount)).toFixed(6)
                  tx.active = false
                  tx.gasTotal = tx.fee
                  tx.dateFormatted = date.toISOString().split('T')[0]
                  tx.amountFriendly = parseFloat(tx.amount).toFixed(6)

                  transactions.push(tx)
                })
                resolve({
                  history: transactions
                })
              }
            }).catch(error => {
              reject({
                error: error
              })
            })
        })
      },
      async dot (token, key) {
        let actions = []
        await axios.post('https://cache.volentix.io/https://polkadot.api.subscan.io/api/scan/transfers', {
          'X-API-Key': key
        })
          .then(function (result) {
            if (result.length !== 0) {
              result.data.transfers.map(a => {
                actions.push({
                  date: date.formatDate(a.block_timestamp * 1000, 'YYYY-MM-DD HH:mm'),
                  transID: a.hash,
                  from: a.from,
                  to: a.to,
                  typeTran: a.module,
                  desc: '',
                  amount: (a.amount / 10000000000) + ' DOT'
                })
              })
              return actions
            }
          }).catch(function (error) {
            // TODO: Exception handling
            // console.log('history error', error)
            userError(error)
            return false
          })

        return {
          history: actions
        }
      },
      async ksm (token, key) {
        let actions = []
        await axios.post('https://kusama.api.subscan.io/api/scan/transfers', {
          'X-API-Key': key
        })
          .then(function (result) {
            if (result.length !== 0) {
              result.data.transfers.map(a => {
                actions.push({
                  date: date.formatDate(a.block_timestamp * 1000, 'YYYY-MM-DD HH:mm'),
                  transID: a.hash,
                  from: a.from,
                  to: a.to,
                  typeTran: a.module,
                  desc: '',
                  amount: (a.amount / 1000000000000) + ' KSM'
                })
              })
              return actions
            }
          }).catch(function (error) {
            // TODO: Exception handling
            // console.log('history error', error)
            userError(error)
            return false
          })

        return {
          history: actions
        }
      }
    }
    let chainsWallets = wallet
    let cachedData = localStorage.getItem(chain + '_history_' + key)
    let historyData = {}
    let h = JSON.parse(cachedData)

    if (!cachedData || !h.history) {
      historyData = wallet[chain] ? wallet[chain](token, key, data) : []
      this.cacheWalletHistoryData(historyData, key, chain)
    }

    return cachedData ? JSON.parse(cachedData) : historyData
  }

  balance = async (chain, key, token) => {
    const wallet = {
      async eos (key, token) {
        let float = 0
        const tokenContract = {
          eos: 'eosio.token',
          vtx: 'volentixgsys'
        }
        const eos = new EosWrapper()
        // const balProm =
        await eos.getCurrencyBalanceP(key, tokenContract[token])
          .then(function (result) {
            /// /console.log('walletlib', key, tokenContract[token], bal)
            if (result.length) {
              float = result[0].split(' ')[0]
              return float
            }
          }).catch(function (error) {
            // TODO: Exception handling
            userError(error)
            return false
          })

        // Promise.all(balProm)
        return {
          balance: float
        }
      },
      async dot (key, token) {
      /*  const { ApiPromise, WsProvider } = require('@polkadot/api')
        const provider = new WsProvider('wss://rpc.polkadot.io/')
        const api = await ApiPromise.create({ provider })

        */

        // let balance = await substrate.query.balances.freeBalance("EGVQCe73TpFyAZx5uKfE1222XfkT3BSKozjgcqzLBnc5eYo")
        // balance.toNumber()
        //  let { data: { free: amount } } = await api.query.system.account(key)

        let res = await axios.get(process.env[store.state.settings.network].CACHE + 'https://explorer-32.polkascan.io/api/v1/polkadot/account/' + key)
        let amount = 0
        if (res && res.data && res.data.data) {
          amount = res.data.data.attributes.balance_free / 1000000000000
        }
        /*

        Unsolved mystery

        let test = await api.query.system.account(key)
        // let account = await api.query.system.account(key)
        const BN = require('bn.js')
        let number = new BN(test.data.free.toBigInt(), 'u128')
        let number2 = new BN(test.data.feeFrozen.toBigInt(), 'u128')
        let number3 = new BN(test.data.reserved.toBigInt(), 'u128')
        let number4 = new BN(test.data.miscFrozen.toBigInt(), 'u128')
        console.log(number.toString(10), number2.toString(10), number3.toString(10), number4.toString(10))

        api.query.system.account(key, ({ data: { free: currentFree }, nonce: currentNonce }) => {
          console.log(`New balance  ${currentFree}, nonce ${currentNonce}`)
        })
         let amount = account.data.free.toNumber() / 10000000000

        */

        let tokenPrice = (await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd')).data.polkadot.usd
        const usd = amount * tokenPrice

        return {
          amount,
          usd,
          tokenPrice
        }
      },
      async ksm (key, token) {
        /*
        const { ApiPromise, WsProvider } = require('@polkadot/api')
        const provider = new WsProvider('wss://kusama-rpc.polkadot.io/')
        const api = await ApiPromise.create({ provider })
        console.log(key, 'ksm key')
        let { data: { free: amount } } = await api.query.system.account(key)
        amount = amount / 1000000000000

        */

        let res = await axios.get('https://explorer-32.polkascan.io/api/v1/kusama/account/' + key)
        let amount = 0
        if (res && res.data && res.data.data) {
          amount = res.data.data.attributes.balance_free / 1000000000000
        }
        let tokenPrice = (await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=kusama&vs_currencies=usd')).data.kusama.usd
        const usd = amount * tokenPrice
        return {
          amount,
          usd,
          tokenPrice
        }
      },
      async eth (key, token) {
        // const Web3 = require('web3')
        // const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/54b0a9c16bc94aeb908616525203c9da"))
        // var balance = web3.eth.getBalance(key)

        // return { balance: float }
      },
      async btc (key) {
        key = '15urYnyeJe3gwbGJ74wcX89Tz7ZtsFDVew'
        const amount = (await axios.get('https://blockchain.info/q/addressbalance/' + key, {
          'cors': 'true'
        })).data / 100000000
        let tokenPrice = (await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')).data.bitcoin.usd
        const usd = amount * tokenPrice
        return {
          amount,
          usd,
          tokenPrice
        }
      },
      async ltc (key) {
        const amount = (await axios.get('https://chainz.cryptoid.info/ltc/api.dws?key=9e24784791a6&q=getbalance&a=' + key)).data
        let tokenPrice = (await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd')).data.litecoin.usd
        const usd = amount * tokenPrice
        return {
          amount,
          usd,
          tokenPrice
        }
      },
      async bnb (key, token) {
        let amount = 0
        try {
          const balances = (await axios.get('https://dex.binance.org/api/v1/account/' + key)).data.balances
          if (balances) {
            balances.filter(b => b.symbol === token.toUpperCase()).map(b => {
              amount = +b.free + +b.frozen + +b.locked
            })
          }
          /// /console.log('bnb', balances, amount)
        } catch (err) {
          /// /console.log('', err)
        }
        let tokenPrice = (await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd')).data.binancecoin.usd
        const usd = amount * tokenPrice
        return {
          amount,
          usd,
          tokenPrice
        }
      },
      async ada (key, token) {
        let amount = 0
        try {
          const balances = (await axios.get('https://cardano-mainnet.blockfrost.io/api/v0/addresses/' + key, { project_id: 'hFiQ3t403yXFYs3bfOKDwVX9BMGpJbDH' })).data.amount
          if (balances) {
            balances.filter(b => b.unit === token).map(b => {
              amount = +b.quantity
            })
          }
          console.log('ada', balances, amount)
        } catch (err) {
          console.log('ada catch', err)
        }
        let tokenPrice = (await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd')).data.cardano.usd
        const usd = amount * tokenPrice
        return {
          amount,
          usd,
          tokenPrice
        }
      },
      async dash (key) {
        const amount = (await axios.get('https://chainz.cryptoid.info/dash/api.dws?key=9e24784791a6&q=getbalance&a=' + key)).data
        let tokenPrice = (await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=dash&vs_currencies=usd')).data.dash.usd
        const usd = amount * tokenPrice
        return {
          amount,
          usd,
          tokenPrice
        }
      }
    }[chain]

    return wallet ? wallet(key, token) : {}
  }
  getEvmData (chain) {
    return this.evms.find(o => o.chain === chain)
  }
  async checkEvmTxStatus (transactonHash, chain) {
    let web3 = this.getWeb3Instance(chain)
    const expectedBlockTime = 5000

    let transactionReceipt = null
    while (transactionReceipt == null) {
      transactionReceipt = await web3.eth.getTransactionReceipt(transactonHash)

      await sleep(expectedBlockTime)
    }
    return transactionReceipt.status
  }
  getWeb3Instance (chain) {
    return (new Web3(new Web3.providers.HttpProvider(this.getEvmData(chain).provider)))
  }
  gas = async (chain, transaction, type, tokenPrice) => {
    let evmData = this.getEvmData(chain)
    let response = null
    const web3 = this.getWeb3Instance(chain)
    // const self = this
    if (evmData.gas && evmData.gas.length) { response = await axios.get(evmData.gas) }

    let gasData = {
      gas: 21000,
      gasPrice: null,
      label: 'Fee',
      value: 0, // USD Price
      nativeToken: evmData.nativeToken
    }

    const convertGasPrice = (gasObj) => {
      // Return gas price in USD if tokenPrice is valid, otherwise return the value in native token unit
      gasObj.isUsd = tokenPrice
      gasObj.value = web3.utils.fromWei(gasObj.gasPrice.toString(), 'ether') * gasObj.gas * (gasObj.isUsd ? tokenPrice : 1)
      return gasObj
    }

    const wallet = {
      async ftm () {
        gasData.gasPrice = await web3.eth.getGasPrice()

        if (type !== evmData.nativeToken) {
          let gas = await web3.eth.estimateGas(transaction)
          gasData.gas = gas
        }
        gasData = convertGasPrice(gasData)
        return [gasData]
      },
      async matic () {
        let gasOptions = []
        if (type !== evmData.nativeToken || transaction.data) {
          let gas = await web3.eth.estimateGas(transaction)
          gasData.gas = gas
        }

        if (!response.data) {
          gasData.gasPrice = await web3.eth.getGasPrice()
          gasData.label = 'Fee'
          gasOptions.push(gasData)
        } else {
          ['standard', 'fast', 'fastest'].forEach((option) => {
            let gasOption = Object.assign({}, gasData)
            gasOption.gasPrice = response.data[option] * 1000000000 // To wei
            gasOption.label = option
            gasOption = convertGasPrice(gasOption)
            gasOptions.push(gasOption)
          })
        }
        return gasOptions
      },
      async eth () {
        let gasOptions = []
        if (type !== evmData.nativeToken || transaction.data) {
          let gas = await web3.eth.estimateGas(transaction)
          gasData.gas = gas
          console.log('gas', gas, response.data)
        }

        if (!response.data) {
          gasData.gasPrice = await web3.eth.getGasPrice()
          gasData.label = 'Fee'
          gasOptions.push(gasData)
        } else {
          ['average', 'fast', 'fastest'].forEach((option) => {
            let gasOption = Object.assign({}, gasData)
            gasOption.gasPrice = response.data[option] / 10 * 1000000000 // To wei
            gasOption.label = option
            gasOption = convertGasPrice(gasOption)
            gasOptions.push(gasOption)
          })
        }
        return gasOptions
      },
      async avaxc () {
        gasData.gasPrice = await web3.eth.getGasPrice()

        if (type !== evmData.nativeToken || transaction.data) {
          let gas = await web3.eth.estimateGas(transaction)
          gasData.gas = gas
        }
        gasData = convertGasPrice(gasData)
        return [gasData]
      },
      async bsc () {
        /*
          The difference between Binance Chain and Ethereum is that there is no notion of gas.
          As a result, fees for the rest transactions are fixed.
          https://docs.binance.org/guides/concepts/fees.html
          */

        if (type !== evmData.nativeToken || transaction.data) {
          let gas = await web3.eth.estimateGas(transaction)
          gasData.gas = gas
        }

        if (response.data.result) {
          gasData.gasPrice = web3.utils.hexToNumber(response.data.result)
        }
        gasData = convertGasPrice(gasData)
        return [gasData]
      }

    }

    let value = await wallet[chain]()
    return value
  }

  send = async (chain, token, from, to, value, memo, key, contract, data) => {
    const self = this
    // console.log(chain, token, from, to, value, memo, key, contract, data, 'chain, token, from, to, value, memo, key, contract, data')
    const wallet = {
      async btc (token, from, to, value, memo, key) {
        // const bitcore = require('bitcore-lib')
        const bitcoin = require('bitcoinjs-lib')
        const explorers = require('bitcore-explorers')
        const insight = new explorers.Insight(process.env[store.state.settings.network].CACHE + 'https://explorer.btc.zelcore.io/') // 'https://insight.bitpay.com')
        const network = store.state.settings.network === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
        const keyPair = bitcoin.ECPair.fromWIF(key)
        const returnedUTXOS = await insight.getUtxos(from)

        const psbt = new bitcoin.Psbt({
          network
        })

        // const p2sh = bitcoin.payments.p2sh({
        //   redeem: bitcoin.payments.p2wpkh({
        //     pubkey: keyPair.publicKey,
        //     network
        //   }),
        //   network
        // })

        returnedUTXOS.forEach((UTXO) => {
          console.log('UTXO', UTXO)
          let formattedWitnessUtxo = {
            script: Buffer.from(UTXO.witnessUtxo.script),
            value: UTXO.witnessUtxo.value
          }
          psbt.addInput({
            hash: UTXO.hash,
            index: UTXO.index,
            witnessUtxo: formattedWitnessUtxo
          })
        })

        psbt.addOutput({
          address: to,
          value: value * 100000000
        })

        // psbt.addInput({
        //   hash: 'xxxx',
        //   index: 0,
        //   redeemScript: p2sh.redeem.output,
        //   witnessUtxo: {
        //     script: p2sh.output,
        //     value: 10000
        //   }
        // })

        psbt.signAllInputs(keyPair)
        psbt.finalizeAllInputs()
        const tx = psbt.extractTransaction()

        let message, success
        try {
          Promise(async (resolve, reject) => {
            insight.broadcast(tx, function (error, transactionId) {
              if (error) {
                // console.log(error)
                return reject()
              } else {
                // console.log(transactionId)
                resolve({
                  message: `https://www.blockchain.com/btc/tx/${transactionId}`,
                  success: true
                })
              }
            })
          })
        } catch (err) {
          message = err
          success = false
        }

        return {
          success,
          message
        }
      },
      async dot (token, from, to, value, memo, key, contract) {
        const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api')
        const provider = new WsProvider('wss://rpc.polkadot.io/')
        const api = await ApiPromise.create({ provider })

        const keyring = new Keyring({ type: 'sr25519' })
        keyring.setSS58Format(0)
        const mnemonic = store.state.currentwallet.config.mnemonic
        const pair = keyring.createFromUri(mnemonic)

        // On the Polkadot network, an address is only active when it holds a
        // minimum amount (currently set at 1 DOT). This minimum amount is called
        // an existential deposit (ED).
        // https://support.polkadot.network/support/solutions/articles/65000168651-what-is-the-existential-deposit-#

        let message, success
        try {
          value = value * 10000000000
          const transfer = api.tx.balances.transfer(to, value)
          const hash = await transfer.signAndSend(pair)

          message = 'https://polkadot.subscan.io/extrinsic/' + hash
          success = true
        } catch (err) {
          message = err
          success = false
        }

        return {
          success,
          message
        }
      },
      async ksm (token, from, to, value, memo, key, contract) {
        const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api')
        const provider = new WsProvider('wss://kusama-rpc.polkadot.io/')
        const api = await ApiPromise.create({ provider })

        const keyring = new Keyring({ type: 'sr25519' })
        keyring.setSS58Format(2)
        const mnemonic = store.state.currentwallet.config.mnemonic
        const pair = keyring.createFromUri(mnemonic)

        let message, success
        try {
          value = value * 1000000000000
          const transfer = api.tx.balances.transfer(to, value)
          const hash = await transfer.signAndSend(pair)

          message = 'https://kusama.subscan.io/extrinsic/' + hash
          success = true
        } catch (err) {
          message = err
          success = false
        }

        return {
          success,
          message
        }
      },
      async bnb (token, from, to, value, memo, key, contract) {
        const { BncClient } = require('@binance-chain/javascript-sdk')
        const api = 'https://dex.binance.org/'

        const bnbClient = new BncClient(api)
        const httpClient = axios.create({ baseURL: api })
        const sequenceURL = `${api}api/v1/account/${from}/sequence`

        bnbClient.chooseNetwork('mainnet') // or this can be "testnet"
        bnbClient.setPrivateKey(key)
        await bnbClient.initChain()

        let message, success
        try {
          const res = await httpClient.get(sequenceURL)
          const sequence = res.data.sequence || 0
          const result = await bnbClient.transfer(
            from,
            to,
            value,
            token.toUpperCase(),
            memo,
            sequence
          )

          console.log(result)
          if (result.status === 200) {
            console.log('success', result.result[0].hash)

            message = 'https://explorer.binance.org/tx/' + result.result[0].hash
            success = true
          } else {
            console.error('error else', result.message)

            message = result.message
            success = false
          }
        } catch (error) {
          console.error('error catch', error)

          message = error
          success = false
        }

        return {
          message,
          success
        }
      },
      async ada (token, from, to, value, memo, key, contract) {
        let message, success
        // try {
        //   const res = await httpClient.get(sequenceURL)
        //   const sequence = res.data.sequence || 0
        //   const result = await bnbClient.transfer(
        //     from,
        //     to,
        //     value,
        //     token.toUpperCase(),
        //     memo,
        //     sequence
        //   )

        //   console.log(result)
        //   if (result.status === 200) {
        //     console.log('success', result.result[0].hash)

        //     message = 'https://explorer.binance.org/tx/' + result.result[0].hash
        //     success = true
        //   } else {
        //     console.error('error else', result.message)

        //     message = result.message
        //     success = false
        //   }
        // } catch (error) {
        //   console.error('error catch', error)

        //   message = error
        //   success = false
        // }

        return {
          message,
          success
        }
      },
      async eos (token, from, to, value, memo, key, contract) {
        let message, success
        try {
          const formatedAmount = await formatAmountString(value, token, from)
          const transaction = await (new EosWrapper()).transferToken(
            contract,
            from.toLowerCase(),
            to.toLowerCase(),
            formatedAmount,
            memo,
            key
          )

          message = process.env[store.state.settings.network].EOS_TRANSACTION_EXPLORER + transaction.transaction_id
          success = true
        } catch (err) {
          message = err
          success = false
        }

        return {
          success,
          message
        }

        async function formatAmountString (value, token, from) {
          let numberOfDecimals = 0
          let tableData = await store.state.wallets.tokens
          // Can't try to find using privateKey since legacy wallets use encrypted keys
          let currentAccount = tableData.find(w => w.name === from && w.type === token)
          let stringAmount = (Math.round(+value * Math.pow(10, currentAccount.precision)) / Math.pow(10, currentAccount.precision)).toString()

          const amountParsed = stringAmount.split('.')
          if (amountParsed && amountParsed.length > 1) {
            numberOfDecimals = amountParsed[1].length
          } else {
            stringAmount += '.'
          }
          for (; numberOfDecimals < currentAccount.precision; numberOfDecimals++) {
            stringAmount += '0'
          }

          return stringAmount + ' ' + token.toUpperCase()
        }
      },
      async bsc (token, from, to, value, info, key, contract, evm = 'bsc') {
        return chainsWallets.eth(token, from, to, value, info, key, contract, evm)
      },
      async avaxc (token, from, to, value, info, key, contract, evm = 'avaxc') {
        return chainsWallets.eth(token, from, to, value, info, key, contract, evm)
      },
      async matic (token, from, to, value, info, key, contract, evm = 'matic') {
        return chainsWallets.eth(token, from, to, value, info, key, contract, evm)
      },
      async plg (token, from, to, value, info, key, contract, evm = 'plg') {
        await this.eth(token, from, to, value, info, key, contract, evm)
      },
      async acc (token, from, to, value, info, key, contract, evm = 'acc') {
        await this.eth(token, from, to, value, info, key, contract, evm)
      },
      async ftm (token, from, to, value, info, key, contract, evm = 'ftm') {
        return chainsWallets.eth(token, from, to, value, info, key, contract, evm)
      },
      async eth (token, from, to, value, info, key, contract, evm = 'eth') {
        // console.log('(token, from, to, value, gas, key, contract, info)', token, from, to, value, info, key, contract)

        const Web3 = require('web3')
        let evmData = self.evms.find(o => o.chain === evm)
        const EthereumTx = require('ethereumjs-tx').Transaction
        const web3 = new Web3(new Web3.providers.HttpProvider(evmData.provider))

        let nonce = await web3.eth.getTransactionCount(from)

        let data = '0x'
        let web3Value = !value.toString().includes('0x') ? web3.utils.toHex(web3.utils.toWei(value.toString())) : value
        // let transactionHash = ''
        let sendTo = to

        if (token !== evmData.nativeToken && !(info && info.txData)) {
          let web3Contract = new web3.eth.Contract(abiArray, contract)
          data = web3Contract.methods.transfer(to, web3Value).encodeABI()

          sendTo = contract
          web3Value = '0x00'
        } else if (info && info.txData) {
          data = info.txData
        }

        let rawTx = {
          from,
          to: sendTo,
          value: web3Value,
          data,
          nonce,
          chainId: evmData.network_id
        }

        if (info && (typeof info === 'object') && info.gasData) {
          rawTx.gas = info.gasData.gas
          rawTx.gasPrice = info.gasData.gasPrice
          if (info.gasLimit) {
            rawTx.gasLimit = info.gasLimit
          }
        } else if (evmData.nativeToken === 'eth') {
          // Gas Price for non-eth tokens should be paased as params (-> Calculation in gas class property)
          let gasPrices = await getCurrentGasPrices()
          rawTx.gasPrice = gasPrices.high * 1000000000
          let gas = await web3.eth.estimateGas(rawTx)
          rawTx.gas = gas
        }
        let serializedTransaction = null
        if (evmData.nativeToken !== 'eth') {
          let raw = await web3.eth.accounts.signTransaction(rawTx, key)
          serializedTransaction = raw.rawTransaction
        } else {
          // EthereumTx currently works with ETH only
          const transaction = new EthereumTx(rawTx)
          transaction.sign(Buffer.from(key.substring(0, 2) === '0x' ? key.substring(2) : key, 'hex'))
          serializedTransaction = transaction.serialize()
          serializedTransaction = '0x' + serializedTransaction.toString('hex')
        }

        return sendSingleTransaction(serializedTransaction)

        // web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'), (err, id) => {
        //   if (err) {
        //     //console.log(err)
        //     return reject()
        //   }
        //   resolve({
        //     message: process.env[store.state.settings.network].ETH_TRANSACTION_EXPLORER + id,
        //     success: true
        //   })
        // })

        /*
            let tx = web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))

            tx.on('confirmation', (confirmationNumber, receipt) => {
              if (confirmationNumber > 2) {
                resolve({
                  message: process.env[store.state.settings.network].ETH_TRANSACTION_EXPLORER + transactionHash,
                  success: true
                })
              }
              //console.log('receipt:', confirmationNumber, receipt)
            })

            tx.on('transactionHash', hash => {
              transactionHash = hash
              //console.log('hash:', hash)
            })
          })
        } catch (err) {
          let message = err
          let success = false

          return {
            success,
            message
          }

        */

        async function getCurrentGasPrices () {
          let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
          let prices = {
            low: response.data.safeLow / 10,
            medium: response.data.average / 10,
            high: response.data.fast / 10
          }
          return prices
        }

        function sendSingleTransaction (serializedTransaction) {
          let jsonRpc = evmData.provider

          let data = createParams('eth_sendRawTransaction', serializedTransaction)

          return new Promise(async (resolve, reject) => {
            const response = await axios.post(jsonRpc, data).catch(error => {
              reject({
                message: error,
                success: false
              })
            })
            // Solution take in count number of pending transaction in nonce
            const erroMessages = [
              {
                string: 'insufficient funds for gas',
                text: 'You have a pending transaction. Please wait and try again.'
              }
            ]

            if (response.data.error) {
              let message = erroMessages.find(o => response.data.error.message.includes(o.string))

              reject({
                message: message ? message.text : response.data.error.message,
                success: false
              })
            } else if (response.data.result) {
              let hash = response.data.result

              resolve({
                message: evmData.explorer + hash,
                success: true,
                transaction_id: hash,
                status: 'pending'
              })

              // Status fetching to be implemented
              /*
                  let data = createParams('eth_getTransactionReceipt', serializedTransaction)
                  let interval = setInterval(() => {
                    axios.post(infuraEndpoint, data).then((response) => {
                      let reseipt = response.result
                      if (reseipt) {
                        if (reseipt.status == 0) {
                          resolve({
                            message: process.env[store.state.settings.network].ETH_TRANSACTION_EXPLORER + id,
                            success: true
                          })
                        } else if (transactionStatus == 1) {
                          return reject()
                        }
                        clearInterval(interval)
                      }
                    }).catch(error => {
                      //console.log(error)
                      return reject()
                    })
                  }, 5000)
                  */
            }
          })
        }

        function createParams (action, data) {
          return {
            jsonrpc: '2.0',
            method: action,
            params: [data],
            id: 1
          }
        }

        // return { send }
      },
      async ltc (key) {},
      async dash (key) {}
    }
    let chainsWallets = wallet

    return wallet[chain] ? wallet[chain](token, from, to, value, memo, key, contract) : {}
  }
}
window.Lib = new Lib()
export default window.Lib

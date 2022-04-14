import EosWrapper from '@/util/EosWrapper'
import axios from 'axios'
import store from '@/store'
import * as solanaWeb3 from '@solana/web3.js'
import abiHex from '@/statics/abi/hex.json'
import abiEnz from '@/statics/abi/enz.json'
import {
  userError
} from '@/util/errorHandler'
import {
  date
} from 'quasar'
import abiArray from '@/statics/abi/erc20.json'
import initWallet from './_Wallets2Tokens'
import { LCDClient, MsgSend, RawKey, Coins, MsgExecuteContract, isTxError } from '@terra-money/terra.js'
import { toAmount } from '@terra.kitchen/utils'
const Web3 = require('web3')
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
class Lib {
  constructor () {
    this.evms = this.getEvms()
  }
  getEvms () {
    let evms = [{
      name: 'Ethereum',
      chain: 'eth',
      nativeToken: 'eth',
      icon: 'https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png',
      provider: 'https://mainnet.infura.io/v3/0dd5e7c7cbd14603a5c20124a76afe63',
      explorer: 'https://etherscan.io/tx/',
      gas: 'https://ethgas.watch/api/gas',
      network_id: 1,
      coinGeckoId: 'ethereum'
    }, {
      name: 'Binance Smart Chain',
      chain: 'bsc',
      nativeToken: 'bnb',
      icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png',
      provider: 'https://bsc-dataseed1.binance.org:443',
      explorer: 'https://bscscan.com/tx/',
      gas: 'https://api.bscscan.com/api?module=proxy&action=eth_gasPrice&apikey=JK2Z5XQYR1FMCAQFQDBFNS5FJM6XC7ETTB',
      network_id: 56,
      coinGeckoId: 'binancecoin'
    }, {
      name: 'Polygon',
      chain: 'matic',
      nativeToken: 'matic',
      icon: 'https://cdnwp-s3.benzinga.com/wp-content/uploads/2021/04/29083434/polygon.png',
      provider: 'https://rpc-mainnet.maticvigil.com/v1/08e234538a11a966248fd358b3b135c4aeb6924b',
      explorer: 'https://explorer-mainnet.maticvigil.com/tx/',
      gas: 'https://gasstation-mainnet.matic.network/',
      network_id: 137,
      coinGeckoId: 'matic-network'
    }, {
      name: 'Avalanche C-Chain',
      chain: 'avaxc',
      nativeToken: 'avax',
      icon: 'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png',
      provider: 'https://api.avax.network/ext/bc/C/rpc',
      explorer: 'https://cchain.explorer.avax.network/tx/',
      gas: '', // The C-Chain gas price is 225 nAVAX (225 GWei). The C-Chain gas limit is 8 * 10e6 (8,000,000).
      network_id: 43114,
      coinGeckoId: 'avalanche-2'
    }, {
      name: 'PulseChain',
      chain: 'tpls',
      nativeToken: 'tpls',
      icon: 'https://pbs.twimg.com/profile_images/1412839310106234882/Z4H3-LxW_400x400.jpg',
      provider: 'https://rpc.v2b.testnet.pulsechain.com',
      explorer: 'https://scan.v2b.testnet.pulsechain.com/tx/',
      gas: '', // The C-Chain gas price is 225 nAVAX (225 GWei). The C-Chain gas limit is 8 * 10e6 (8,000,000).
      network_id: 940,
      testnet: true
    }, {
      name: 'Fantom',
      chain: 'ftm',
      nativeToken: 'ftm',
      icon: 'https://assets.coingecko.com/coins/images/4001/large/Fantom.png?1558015016',
      provider: 'https://rpcapi.fantom.network/',
      explorer: 'https://ftmscan.com/tx/',
      gas: '', // FTM tokens are required to pay gas fees. The Covalent API response returns gas_* fields in fiat units
      network_id: 250,
      coinGeckoId: 'fantom'
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

    let localSettings = localStorage.getItem('chainSettings')
    if (localSettings) {
      localSettings = JSON.parse(localSettings)

      evms.forEach((e, i) => {
        if (localSettings[e.chain] && localSettings[e.chain].provider) {
          evms[i] = localSettings[e.chain]
        }
      })
    }
    return evms
  }
  async getEtherereumPriceGasPrices () {
    let data = false
    let res = await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.gasprice.io/v1/estimates')
    if (res && res.data && res.data.result) {
      data = {
        normal: {
          gwei: res.data.result.eco.feeCap
        },
        fast: {
          gwei: res.data.result.fast.feeCap
        },
        instant: {
          gwei: res.data.result.instant.feeCap
        }
      }
    }
    return data
  }
  async getEtherereumPriceGas () {
    let gas = null
    let res = await this.getEtherereumPriceGasPrices()
    if (res) {
      gas = res.instant.gwei
    } else {
      alert('Error fetching gas price')
    }
    return gas
  }
  async hexStake (address) {
    let locked = 0
    let res = await axios.post('https://cpu.volentix.io/api/global/hexStats', { address: address })
    if (res.data.locked) {
      locked = parseFloat(res.data.locked)
    }
    return locked
  }
  async checkPulseMethods () {
    let add = '0x7e6d3b1161DF9c9c7527F68d651B297d2Fdb820B'
    const compiledContractABI = JSON.parse(abiEnz.result)
    const Web3 = require('web3')
    const web3 = new Web3(this.getEvmData('tpls').provider)
    let hex = new web3.eth.Contract(compiledContractABI, add)

    let data = await hex.methods.getCreator().call()
    console.log(data, 'data')
  }
  async getHexStakeData (addr) {
    const compiledContractABI = JSON.parse(abiHex.result)
    const hexAddr = '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39'
    const Web3 = require('web3')
    const web3 = new Web3(this.getEvmData('eth').provider)
    let hex = new web3.eth.Contract(compiledContractABI, hexAddr)
    let stakeCount = await hex.methods.stakeCount(addr).call()
    /* /* global BigInt
    const getLastDataDay = async (hex) => {
      let globalInfo = await hex.methods.globalInfo().call()
      const lastDay = globalInfo[4]
      return Number.parseInt(lastDay)
    }
    const getDataRange = async (hex, b, e) => {
      const dataRange = await hex
        .methods
        .dailyDataRange(b, e)
        .call()
      const data = []
      for (let i = 0; i < dataRange.length; i++) {
        data.push(decodeDailyData(dataRange[i]))
      }

      return data
    }

    const HEARTS_UINT_SHIFT = 72n

    const SATS_UINT_SHIFT = 56n
    const SATS_MASK = (1n << SATS_UINT_SHIFT) - 1n

      const HEARTS_MASK = (1n << HEARTS_UINT_SHIFT) - 1n

      const decodeDailyData = (encDay) => {
      let v = BigInt(encDay)
      let payout = v & HEARTS_MASK
      v = v >> HEARTS_UINT_SHIFT
      let shares = v & HEARTS_MASK
      v = v >> HEARTS_UINT_SHIFT
      let sats = v & SATS_MASK
      return { payout, shares, sats }
    }

    const getStake = async (hex, addr, sid) => {
      let stakeCount = await hex.methods.stakeCount(addr).call()
      for (let i = 0; i < stakeCount; i++) {
        let stake = await hex.methods.stakeLists(addr, i).call()
        if (stake.stakeId === sid.toString()) {
          return stake
        }
      }
    }
    const getStakeByIndex = async (hex, addr, idx) => {
      let stake = await hex.methods.stakeLists(addr, idx).call()
      return stake
    }

    const getInterestToDate = async (hex, addr, stakeId, stakeIndex, stake) => {
      let s
      if (stake !== undefined) {
        s = stake
      } else if (stakeIndex !== undefined) {
        s = await getStakeByIndex(hex, addr, stakeIndex)
      } else {
        s = await getStake(hex, addr, stakeId)
      } // Not validating that I have both things correct/matching, error detection needed

      const b = Number.parseInt(s.lockedDay)
      const e = await getLastDataDay(hex)

      if (b >= e) {
        // not started - error
        return 0n
      } else {
        const data = await getDataRange(hex, b, e)

        let i = interestForRange(data.slice(-1), BigInt(s.stakeShares)) * (BigInt(s.stakedDays) - BigInt(e + Number.parseInt(s.lockedDay)))
        return interestForRange(data, BigInt(s.stakeShares)) + i
      }
    }
    const interestForRange = (dailyData, myShares) => {
      return dailyData.reduce((s, d) => s + interestForDay(d, myShares), 0n)

    const interestForDay = (dayObj, myShares) => {
      let i = myShares * dayObj.payout / dayObj.shares

      return i
    }
    } */

    // let total = 0n
    let stakeData = []
    for (let i = 0; i < stakeCount; i++) {
      let stake = await hex.methods.stakeLists(addr, i).call()
      // let interest = 0n

      // let interest = await getInterestToDate(hex, addr, undefined, i, undefined)
      // interest = Number((interest) / BigInt(10 ** 8))

      stakeData.push({
        startDate: parseInt(stake.lockedDay) + 1,
        endDate: parseInt(stake.lockedDay) + parseInt(stake.stakedDays) + 1,
        principal: parseInt(stake.stakedHearts) / 10 ** 8,
        stakeshares: stake.stakeShares,
        //  interest: interest,
        index: i,
        stakeId: stake.stakeId
      })
    }
    //  total = Number(total)

    return stakeData
  }
  async getHexStake (addr) {
    let val = await this.hexStake(addr)
    return val
  }
  getDefaultToken (chain) {
    let defaultImg = 'statics/empty-token.png'
    let values = {
      eos: 'https://defibox.s3.ap-northeast-1.amazonaws.com/defibox-eos-web/static/img/eos.png',
      eth: 'https://etherscan.io/images/main/empty-token.png'
    }
    if (values[chain]) {
      defaultImg = values[chain]
    }
    return defaultImg
  }
  getWallets (chain = null) {
    let watchAccounts = localStorage.getItem('watchAccounts')
    watchAccounts = watchAccounts ? JSON.parse(watchAccounts) : []
    return (store.state.currentwallet.config.keys ? [...store.state.currentwallet.config.keys] : []).concat(watchAccounts).filter(o => o.chain === chain || !chain)
  }
  async fetchNfts (address) {
    let nfts = []
    if (!address) {
      let url = 'https://api.zapper.fi/v1/protocols/nft/balances?addresses%5B%5D=' + address + '&network=ethereum&api_key=562eee97-e90e-42ac-8e7b-363cdff5cdaa&newBalances=true'
      let res = await axios.get(url)

      if (res.data && res.data[address] && res.data[address].products.length) {
        nfts = res.data[address].products[0].assets
        nfts = nfts.map(n => {
          if (n.tokens[0].assets[0] && n.tokens[0].assets[0].assetImg.length) { return n.tokens[0].assets[0] }
        }).filter(o => o)
      }
    }
    return nfts
  }
  removePrivateData (data) {
    if (typeof data !== 'object' && !data.length) return data
    return Object.assign([], data).map(o => {
      o.privateKeyEncrypted = null
      delete o.privateKeyEncrypted
      o.privateKey = null
      delete o.privateKey
      return o
    })
  }
  async getRawETHTransaction (token, from, to, value, key, contract, origin = 'mnemonic', evm = 'eth') {
    const Web3 = require('web3')
    let evmData = this.evms.find(o => o.chain === evm)
    let localWeb3 = new Web3(new Web3.providers.HttpProvider(evmData.provider))
    if (origin === 'metamask' && window.web3 && window.web3.currentProvider.isMetaMask) {
      localWeb3 = new Web3(window.web3.currentProvider)
    }

    let nonce = await localWeb3.eth.getTransactionCount(from)
    let toToken = {
      decimals: 18
    }
    if (contract) {
      toToken = store.state.wallets.tokens.find(a => a.contract && a.contract.toLowerCase() === contract.toLowerCase())
      if (!toToken) {
        toToken = store.state.wallets.tokens.find(o => o.value.toLowerCase() === token.toLowerCase())
      }
    }

    let web3Value = localWeb3.utils.toHex(parseInt(value * 10 ** toToken.decimals).toString())

    let sendTo = to
    let data = null

    if (token !== evmData.nativeToken) {
      let web3Contract = new localWeb3.eth.Contract(abiArray, contract)
      data = web3Contract.methods.transfer(to, web3Value).encodeABI()

      /* web3Contract.methods.transfer(to, web3Value).estimateGas(function (error, gasAmount) {
        //console.log(error, gasAmount, 'error, gasAmount)')
      }) */
      sendTo = contract
      web3Value = '0x0'
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

  findInExchangeList (chain, type, contract) {
    let found = false
    if (chain === 'eos' || chain === 'eth') {
      found = store.state.settings.coins[chain === 'eos' ? 'defibox' : 'oneinch'].find(o => o.value.toLowerCase() === type.toLowerCase() /* && o.contract === contract */)
    } else {
      found = true
    }
    return found
  }
  getAllCoins (dex) {
    let coins = store.state.settings.coins.godex.concat(store.state.settings.coins.oneinch).concat(store.state.settings.coins.defibox)

    coins = this.getUniqueTokens(coins).filter(o => !(store.state.wallets.tokens.filter(x => x.chain === 'eos').map(w => w.type.toLowerCase()).includes(o.value.toLowerCase())))

    store.state.wallets.tokens.filter(o => o.chain === 'eos' && o.type !== 'verto').forEach((coin) => {
      coin.contract = (typeof coin.contract === 'undefined' || coin.contract === 'undefined' || !coin.contract) ? 'eosio.token' : coin.contract

      let row = {
        'label': coin.type.toUpperCase(),
        'name': coin.name,
        'value': coin.type,
        'contract': coin.contract,
        'precision': coin.precision,
        'image': coin.chain === 'eos' ? 'https://defibox.s3.ap-northeast-1.amazonaws.com/eos/' + coin.contract + '-' + coin.type.toLowerCase() + '.png' : 'https://files.coinswitch.co/public/coins/' + coin.type.toLowerCase() + '.png',
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

  removeExpiredData (days = 3) {
    const removeData = [
      'walletPublicDatav2'
    ]
    let date = localStorage.getItem('walletDataExpiration')
    let now = new Date()
    let saved = null
    if (date) {
      saved = new Date(date)
      saved.setDate(saved.getDate() + days)
    }

    if (!date || now.getTime() > saved.getTime()) {
      removeData.forEach((key) => {
        localStorage.removeItem(key)
      })
    }

    localStorage.setItem('walletDataExpiration', now)
  }
  getCoingeckoChain (chain) {
    let nameToChain = {
      ethereum: 'eth',
      binancesmartchain: 'bsc',
      fantom: 'ftm',
      polkadot: 'dot',
      avalanche: 'avax',
      binancecoin: 'bnb',
      eos: 'eos',
      solana: 'sol'
    }

    return nameToChain[chain.replace(/-/g, '')]
  }
  getTokenImage (type) {
    let token = this.getAllCoins().find((o) => o.value.toLowerCase() === type.toLowerCase())
    return token ? (type.toLowerCase() === 'eth' ? 'https://s3.amazonaws.com/token-icons/eth.png' : token.image) : 'https://etherscan.io/images/main/empty-token.png'
  }

  cacheWalletHistoryData (data, key, chain) {
    // console.log(data, 'data 123')
    data.then(o => {
      // console.log(o, 'o 321')
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
      async tpls (token, key, data) {
        return new Promise(async (resolve, reject) => {
          let actions = []
          axios.get(process.env[store.state.settings.network].CACHE + 'https://api.solscan.io/account/transaction?address=' + key)
            .then(function (result) {
              result.data.data.filter(o => o.parsedInstruction[0].type.toLowerCase() === 'sol-transfer').map(a => {
                let tx = {}

                let date = new Date(a.blockTime * 1000)
                tx.timeStamp = date.getTime() / 1000
                tx.chain = token
                tx.friendlyHash = a.txHash.substring(0, 6) + '...' + a.txHash.substr(a.txHash.length - 5)
                tx.to = tx.friendlyTo = a.parsedInstruction[0].programId
                tx.hash = a.txHash
                tx.explorerLink = 'https://solscan.io/tx/' + tx.hash
                tx.from = a.signer[0]
                tx.time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                tx.image = 'https://solana.com/branding/new/exchange/exchange-black.png' // self.getTokenImage(amount.split(' ')[1])
                tx.amount = a.slot * 0.000000001
                tx.symbol = 'SOL'
                tx.direction = self.getTransactionDirection(a.signer[0], a.parsedInstruction[0].programId, key)
                tx.dateFormatted = date.toISOString().split('T')[0]
                tx.amountFriendly = parseFloat(Math.abs(tx.amount)).toFixed(6)

                actions.push(tx)
              })

              resolve({
                history: actions
              })
            }).catch(function (error) {
              reject({
                error: error
              })
            })
        })
      },
      async sol (token, key, data) {
        return new Promise(async (resolve, reject) => {
          let actions = []
          axios.get(process.env[store.state.settings.network].CACHE + 'https://api.solscan.io/account/transaction?address=' + key)
            .then(function (result) {
              result.data.data.filter(o => o.parsedInstruction[0].type.toLowerCase() === 'sol-transfer').map(a => {
                let tx = {}

                let date = new Date(a.blockTime * 1000)
                tx.timeStamp = date.getTime() / 1000
                tx.chain = token
                tx.friendlyHash = a.txHash.substring(0, 6) + '...' + a.txHash.substr(a.txHash.length - 5)
                tx.to = tx.friendlyTo = a.parsedInstruction[0].programId
                tx.hash = a.txHash
                tx.explorerLink = 'https://solscan.io/tx/' + tx.hash
                tx.from = a.signer[0]
                tx.time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                tx.image = 'https://solana.com/branding/new/exchange/exchange-black.png' // self.getTokenImage(amount.split(' ')[1])
                tx.amount = a.slot * 0.000000001
                tx.symbol = 'SOL'
                tx.direction = self.getTransactionDirection(a.signer[0], a.parsedInstruction[0].programId, key)
                tx.dateFormatted = date.toISOString().split('T')[0]
                tx.amountFriendly = parseFloat(Math.abs(tx.amount)).toFixed(6)

                actions.push(tx)
              })

              resolve({
                history: actions
              })
            }).catch(function (error) {
              reject({
                error: error
              })
            })
        })
      },
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
                // //console.log('split', a.action_trace.act.name === 'transfer' ? a.action_trace.act.data.quantity.toString().split(' ')[1].toLowerCase() : 'not transfer')
                  if (token === 'eos' && (
                    a.action_trace.act.name === 'transfer' &&
                    a.action_trace.receiver === key && typeof a.action_trace.act.data.from !== 'undefined' && typeof a.action_trace.act.data.to !== 'undefined')) {
                  // //console.log('walletlib history actions', a)

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
              console.log(res.data, 'res.data')
              if (res.data.data.items) {
                let transactions = []
                res.data.data.items.filter(o => o.successful).forEach((a, index) => {
                  let tx = {}
                  console.log(11, 'tx')
                  let date = new Date(a.block_signed_at)
                  tx.timeStamp = date.getTime() / 1000
                  tx.chain = token
                  tx.failed = !a.successful
                  tx.friendlyHash = a.tx_hash.substring(0, 6) + '...' + a.tx_hash.substr(a.tx_hash.length - 5)
                  let decodedBlock = null
                  console.log(13, 'tx')
                  if (a.log_events && a.value === '0') {
                    decodedBlock = a.log_events.find(o => o.decoded && o.decoded.name === 'Transfer')
                    if (decodedBlock) {
                      tx.to = decodedBlock.decoded.params.find(o => o.name === 'to').value
                      tx.amount = decodedBlock.decoded.params.find(o => o.name === 'value').value
                      tx.amount = tx.amount ? tx.amount : 0
                      tx.amount = Web3.utils.fromWei(tx.amount?.toString(), 'ether')
                      tx.symbol = 'N/A'
                      tx.image = '/statics/empty-token.png'
                      if (store.state.tokens.evmTokens[chain]) {
                        let foundToken = store.state.tokens.evmTokens[chain].find(o => o.address === a.to_address)
                        tx.symbol = foundToken ? foundToken.symbol : tx.symbol
                        tx.image = foundToken ? foundToken.logoURI : tx.image
                      }
                    } else {
                      tx.symbol = 'ETH'
                      tx.image = '/statics/empty-token.png'
                    }
                  }
                  console.log(14, 'tx')
                  if (!decodedBlock) {
                    tx.to = a.to_address
                    tx.amount = Web3.utils.fromWei(a.value?.toString(), 'ether')
                    tx.symbol = evmData.nativeToken.toUpperCase()
                    tx.image = evmData.icon
                  }
                  console.log(15, 'tx')
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
                  tx.gasTotal = tx.gas_spent ? tx.gas_spent : 0
                  tx.dateFormatted = date.toISOString().split('T')[0]
                  tx.amountFriendly = parseFloat(tx.amount).toFixed(6)
                  console.log(15, 'tx')
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
        // key = '15urYnyeJe3gwbGJ74wcX89Tz7ZtsFDVew'
        return new Promise(async (resolve, reject) => {
          axios
            .get(
              process.env[store.state.settings.network].CACHE +
         // 'https://chain.api.btc.com/v3/address/' + key + '/tx'
         'https://api.blockchain.info/haskoin-store/btc/address/' + key + '/transactions/full?limit=100&offset=0'
            )
            .then(res => {
              if (res.data) {
                let transactions = []
                res.data.filter(o => o.inputs && o.outputs).forEach((a, index) => {
                  let tx = {}

                  let date = new Date(a.time)
                  tx.timeStamp = a.time
                  // TO DO - LIST through all outputs and save them as separate transactions when key === spender
                  // if (tx) return

                  let spender = a.inputs[0].address
                  let receiver = a.outputs[0].address
                  tx.chain = token
                  tx.friendlyHash = a.txid.substring(0, 6) + '...' + a.txid.substr(a.txid.length - 5)

                  tx.to = receiver
                  tx.amount = spender !== key ? a.outputs.find(o => o.address === key).value / 100000000 : a.outputs[0].value / 100000000
                  tx.symbol = token.toUpperCase()
                  tx.image = 'https://files.coinswitch.co/public/coins/btc.png'

                  tx.hash = a.txid
                  tx.explorerLink = 'https://www.blockchain.com/btc/block/' + a.txid
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
            // //console.log('history error', error)
            userError(error)
            return false
          })

        return {
          history: actions
        }
      },
      async ksm (token, key) {
        let actions = []
        await axios.post(process.env[store.state.settings.network].CACHE + 'https://kusama.api.subscan.io/api/scan/transfers', {
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
            // //console.log('history error', error)
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

    if (!cachedData || !h || !h.history) {
      historyData = wallet[chain] ? wallet[chain](token, key, data) : []

      // this.cacheWalletHistoryData(historyData, key, chain)
    }

    return cachedData ? JSON.parse(cachedData) : historyData
  }

  balance = async (chain, key, token) => {
    const self = this
    const wallet = {

      async sol (key, token) {
        let connection = new solanaWeb3.Connection(
          solanaWeb3.clusterApiUrl('mainnet-beta'),
          'confirmed'
        )
        let Pkey = new solanaWeb3.PublicKey(key)

        let amount = await connection.getBalance(Pkey)
        let tokenPrice = (await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')).data.solana.usd
        amount = amount * 0.000000001
        const usd = amount * tokenPrice

        return {
          amount,
          usd,
          tokenPrice
        }
      },
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
            /// ///console.log('walletlib', key, tokenContract[token], bal)
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
        //console.log(number.toString(10), number2.toString(10), number3.toString(10), number4.toString(10))

        api.query.system.account(key, ({ data: { free: currentFree }, nonce: currentNonce }) => {
          //console.log(`New balance  ${currentFree}, nonce ${currentNonce}`)
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
        //console.log(key, 'ksm key')
        let { data: { free: amount } } = await api.query.system.account(key)
        amount = amount / 1000000000000

        */

        let res = await axios.get(process.env[store.state.settings.network].CACHE + 'https://explorer-32.polkascan.io/api/v1/kusama/account/' + key)
        let amount = 0
        if (res && res.data && res.data.data) {
          amount = res.data.data.attributes.balance_free / 1000000000000
        }
        let tokenPrice = (await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/simple/price?ids=kusama&vs_currencies=usd')).data.kusama.usd
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
      async tpls (key, token) {
        let web3 = self.getWeb3Instance(chain)
        var balance = await web3.eth.getBalance(key)

        return web3.utils.fromWei(balance.toString(), 'ether')
      },
      async btc (key) {
        // key = '15urYnyeJe3gwbGJ74wcX89Tz7ZtsFDVew'
        const amount = (await axios.get(process.env[store.state.settings.network].CACHE + 'https://blockchain.info/q/addressbalance/' + key, {
          'cors': 'true'
        })).data / 100000000
        let tokenPrice = (await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')).data.bitcoin.usd
        const usd = amount * tokenPrice
        return {
          amount,
          usd,
          tokenPrice
        }
      },
      async ltc (key) {
        const amount = (await axios.get(process.env[store.state.settings.network].CACHE + 'https://chainz.cryptoid.info/ltc/api.dws?key=9e24784791a6&q=getbalance&a=' + key)).data
        let tokenPrice = (await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd')).data.litecoin.usd
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
          const balances = (await axios.get(process.env[store.state.settings.network].CACHE + 'https://dex.binance.org/api/v1/account/' + key)).data.balances
          if (balances) {
            balances.filter(b => b.symbol === token.toUpperCase()).map(b => {
              amount = +b.free + +b.frozen + +b.locked
            })
          }
          /// ///console.log('bnb', balances, amount)
        } catch (err) {
          /// ///console.log('', err)
        }
        let tokenPrice = (await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd')).data.binancecoin.usd
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
          const balances = (await axios.get(process.env[store.state.settings.network].CACHE + 'https://cardano-mainnet.blockfrost.io/api/v0/addresses/' + key, { project_id: 'hFiQ3t403yXFYs3bfOKDwVX9BMGpJbDH' })).data.amount
          if (balances) {
            balances.filter(b => b.unit === token).map(b => {
              amount = +b.quantity
            })
          }
          // console.log('ada', balances, amount)
        } catch (err) {
          // console.log('ada catch', err)
        }
        let tokenPrice = (await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd')).data.cardano.usd
        const usd = amount * tokenPrice
        return {
          amount,
          usd,
          tokenPrice
        }
      },
      async dash (key) {
        const amount = (await axios.get(process.env[store.state.settings.network].CACHE + 'https://chainz.cryptoid.info/dash/api.dws?key=9e24784791a6&q=getbalance&a=' + key)).data
        let tokenPrice = (await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/simple/price?ids=dash&vs_currencies=usd')).data.dash.usd
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
  getEvmData (chainOrChainId) {
    return this.getEvms().find(o => o[isNaN(chainOrChainId) ? 'chain' : 'network_id'] === chainOrChainId)
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
  isEvm (chain) {
    return this.evms.find(o => o.chain === chain)
  }
  getWeb3Instance (chain) {
    let evmData = this.getEvmData(chain)
    return evmData ? (new Web3(new Web3.providers.HttpProvider(this.getEvmData(chain).provider))) : null
  }
  gas = async (chain, transaction, type, tokenPrice, gasLimit) => {
    let evmData = this.getEvmData(chain)
    let response = null, gasData = null
    let txData = {}

    if (transaction && typeof transaction === 'object') {
      let excludes = ['chainId', 'gas']
      for (let key in transaction) {
        if (!excludes.includes(key)) { txData[key] = transaction[key] }
      }
    }
    transaction = txData

    const web3 = this.getWeb3Instance(chain)
    if (evmData) {
      if (evmData.gas && evmData.gas.length) {
        if (chain === 'eth') {
          response = {
            data: await this.getEtherereumPriceGasPrices()
          }
        } else {
          response = await axios.get(process.env[store.state.settings.network].CACHE + evmData.gas)
        }
      }
      let gas = gasLimit || 21000, gasPrice = null
      if (transaction.gas) {
        gas = transaction.gas
      }
      if (transaction.gasPrice) {
        gasPrice = transaction.gasPrice
      }

      gasData = {
        gas: gas,
        gasPrice: gasPrice,
        label: 'Fee',
        value: 0, // USD Price
        nativeToken: evmData.nativeToken
      }

      if (!tokenPrice) {
        tokenPrice = await this.getCoinGeckoPrice(evmData.coinGeckoId)
      }
    }
    const convertGasPrice = (gasObj, nativeTokenPrice = tokenPrice) => {
      // Return gas price in USD if tokenPrice is valid, otherwise return the value in native token unit

      gasObj.isUsd = nativeTokenPrice || tokenPrice
      gasObj.value = web3.utils.fromWei(parseInt(gasObj.gasPrice).toString(), 'ether') * gasObj.gas * (gasObj.isUsd ? gasObj.isUsd : 1)
      gasObj.requiredNativeAmount = web3.utils.fromWei(parseInt(gasObj.gasPrice).toString(), 'ether') * gasObj.gas
      gasObj.nativeToken = evmData.nativeToken
      return gasObj
    }

    const wallet = {
      async ftm () {
        gasData.gasPrice = await web3.eth.getGasPrice()

        if ((type !== evmData.nativeToken || transaction.data) && !gasLimit) {
          let gas = await web3.eth.estimateGas(transaction)
          gasData.gas = gas
        }
        gasData = convertGasPrice(gasData)
        return [gasData]
      },
      async tpls () {
        gasData.gasPrice = await web3.eth.getGasPrice()
        transaction.value = 0
        if ((type !== evmData.nativeToken || transaction.data) && !gasLimit) {
          let gas = await web3.eth.estimateGas(transaction)
          gasData.gas = gas
        }
        gasData = convertGasPrice(gasData)
        return [gasData]
      },
      async matic () {
        let gasOptions = []
        if ((type !== evmData.nativeToken || transaction.data) && !gasLimit) {
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

        if ((type !== evmData.nativeToken || transaction.data) && !gasLimit) {
          let gas = await web3.eth.estimateGas(transaction)
          gasData.gas = gas
        }

        if (!response.data) {
          gasData.gasPrice = await web3.eth.getGasPrice()
          gasData.label = 'Fee'
          gasOptions.push(gasData)
        } else {
          let gasStationData = response.data

          let speed = ['normal', 'fast', 'instant']
          speed.forEach((option) => {
            let gasOption = Object.assign({}, gasData)
            gasOption.gasPrice = parseInt(gasStationData[option].gwei * 1000000000) // To wei
            gasOption.label = option
            gasOption = convertGasPrice(gasOption, response.data.ethPrice)
            gasOptions.push(gasOption)
          })
        }
        console.log(gasOptions, 'gasOptions')
        return gasOptions
      },
      async avaxc () {
        gasData.gasPrice = await web3.eth.getGasPrice()

        if ((type !== evmData.nativeToken || transaction.data) && !gasLimit) {
          let gas = await web3.eth.estimateGas(transaction)
          gasData.gas = gas
        }
        gasData = convertGasPrice(gasData)
        return [gasData]
      },
      async btc () {
        let gasOptions = []

        let response = await axios.get(process.env[store.state.settings.network].CACHE + 'https://bitcoinfees.billfodl.com/api/fees/')

        /* {
            "fastestFee": "78",
            "halfHourFee": "76",
            "hourFee": "67",
            "BTCUSD": "32996.9"
        } */
        const getBtcFeeObject = (fee, label, bytes = 250) => {
          let gasOption = {}
          gasOption.gasPrice = fee
          gasOption.label = label
          gasOption.isUsd = true
          gasOption.value = bytes * response.data.BTCUSD * fee / 100000000 / 2

          return gasOption
        }

        gasOptions.push(getBtcFeeObject(response.data.fastestFee, 'Fastest'))
        gasOptions.push(getBtcFeeObject(response.data.halfHourFee, '30 minutes'))
        gasOptions.push(getBtcFeeObject(response.data.hourFee, '1 hour'))

        return gasOptions
      },
      async bsc () {
        /*
          The difference between Binance Chain and Ethereum is that there is no notion of gas.
          As a result, fees for the rest transactions are fixed.
          https://docs.binance.org/guides/concepts/fees.html
          */
        console.log(transaction, 'transaction')
        if ((type !== evmData.nativeToken || transaction.data) && !gasLimit) {
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
  getCoinGeckoId (asset) {
    if (asset.contract) {
      asset.address = asset.contract
    }
    let tokens = store.state.tokens.list.map((o) => {
      o.platforms2 = Object.keys(o.platforms).map(a => o.platforms[a] ? o.platforms[a].toLowerCase() : '')
      return o
    })

    let token = tokens.find(
      (t) =>
        t.symbol.toLowerCase() === asset.type.toLowerCase() &&
      (
        (asset.address && t.platforms2.includes(asset.address.toLowerCase())) ||
        (!t.platforms2.join(',').includes('0x'))
      ))

    return token ? token.id : null
  }
  async getCoinGeckoPrice (asset) {
    let id = typeof asset === 'string' ? asset : this.getCoinGeckoId(asset)
    return id ? (await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/simple/price?ids=' + id + '&vs_currencies=usd')).data[id].usd : null
  }
  isEthValidAddress (rawInput) {
    let valid = false
    try {
      const address = Web3.utils.toChecksumAddress(rawInput)
      valid = address
    } catch (e) {

    }
    return valid
  }
  async getEvmToken (tokenAddress, chain) {
    const web3 = new Web3(this.getEvmData(chain).provider)
    let decimals = null, symbol = null, contract = null
    try {
      contract = new web3.eth.Contract(abiArray, tokenAddress)

      decimals = parseInt(await contract.methods.decimals().call())
      symbol = await contract.methods.symbol().call()
    } catch (e) {

    }
    return {
      decimals,
      symbol,
      contract
    }
  }
  async getEvmTokenBalance (tokenAddress, walletAddress, chain) {
    const token = await this.getEvmToken(tokenAddress, chain)
    let balance = await token.contract.methods.balanceOf(walletAddress).call()
    return balance / (10 ** token.decimals)
  }
  setDemoMode () {
    store.state.currentwallet.config = {
      mnemonic: 'xxx',
      keys: [
        {
          chain: 'eth',
          key: '0x4a02dEADD223E106185144181B0816549Edec862',
          name: 'SIF Private Vault',
          type: 'eth'
        },
        {
          chain: 'eos',
          key: 'xxxxx',
          name: 'crosschainfx',
          type: 'eos'
        }, {
          chain: 'eos',
          key: 'xxxxx',
          name: 'vtxisforhodl',
          type: 'eos'
        }, {
          chain: 'eos',
          key: 'xxxxx',
          name: 'staiderprm11',
          type: 'eos'
        }, {
          chain: 'eos',
          key: 'xxxxx',
          name: 'staiderx1m24',
          type: 'eos'
        }, {
          chain: 'eos',
          key: 'xxxxx',
          name: 'staiderx2m35',
          type: 'eos'
        }, {
          chain: 'eos',
          key: 'xxxxx',
          name: 'staiderx3m4o',
          type: 'eos'
        }, {
          chain: 'eos',
          key: 'xxxxx',
          name: 'master1xxxxx',
          type: 'eos'
        }, {
          chain: 'eos',
          key: 'xxxxx',
          name: 'master2xxxxx',
          type: 'eos'
        }, {
          chain: 'eos',
          key: 'xxxxx',
          name: 'master3xxxxx',
          type: 'eos'
        }, {
          chain: 'eos',
          key: 'xxxxx',
          name: 'master4xxxxx',
          type: 'eos'
        }, {
          chain: 'eos',
          key: 'xxxxx',
          name: 'master5xxxxx',
          type: 'eos'
        }, {
          chain: 'eos',
          key: 'xxxxx',
          name: 'imresistance',
          type: 'eos'
        }, {
          chain: 'eos',
          key: 'xxxxx',
          name: 'volentixp2pb',
          type: 'eos'
        },
        {
          chain: 'eos',
          key: 'xxxxx',
          name: 'cryptoninja1',
          type: 'eos'
        },
        {
          chain: 'eos',
          key: 'xxxxx',
          name: 'vtxtothemoon',
          type: 'eos'
        },
        {
          chain: 'eos',
          key: 'xxxxx',
          name: 'vtxnightnday',
          type: 'eos'
        },
        {
          chain: 'eos',
          key: 'xxxxx',
          name: 'vdexchinavtx',
          type: 'eos'
        },
        {
          chain: 'eos',
          key: 'xxxxx',
          name: 'vtxarmychina',
          type: 'eos'
        },
        {
          chain: 'eos',
          key: 'xxxxx',
          name: '4tunadineros',
          type: 'eos'
        },
        {
          chain: 'eos',
          key: 'xxxxx',
          name: 'ciaociaobell',
          type: 'eos'
        },
        {
          chain: 'eos',
          key: 'xxxxx',
          name: '4theluvofcrp',
          type: 'eos'
        },
        {
          chain: 'eos',
          key: 'xxxxx',
          name: 'excellenceit',
          type: 'eos'
        }

      ]
    }
    store.state.settings.isDemo = true
    store.state.currentwallet.loggedIn = true
    initWallet('init')
  }
  async getUstState (key = 'exchange_rate') {
    let s = await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.anchorprotocol.com/api/v1/market/ust'), val = 0
    if (s && s.data && s.data[key]) {
      val = parseFloat(s.data[key])
    }
    return val
  }
  getCw20TokenBalanceQuery (tokens, userAddres) {
    let r = { variables: {}, query: {} }, str = '{'
    tokens.forEach(t => {
      // x.test = `   ` + t + `: WasmContractsContractAddressStore(     ContractAddress: "` + t + `"     QueryMsg: "{"balance":{"address":"` + userAddres + `"}}"  ) {     Height    Result     __typename   }`
      str += `\n  ` + t + `: WasmContractsContractAddressStore(\n    ContractAddress: "` + t + `"\n    QueryMsg: "{\\"balance\\":{\\"address\\":\\"` + userAddres + `\\"}}"\n  ) {\n    Height\n    Result\n    __typename\n  }`
    })
    str += '}'
    r.query = str /// .replace(/\\"/g, '\\\\\\')

    return r
  }
  async getCw20TokensBalance (tokens, key) {
    let resEc20s = await axios.post('https://mantle.terra.dev/', this.getCw20TokenBalanceQuery(tokens, key)), v = {}
    if (resEc20s && resEc20s.data && resEc20s.data.data) {
      tokens = Object.keys(resEc20s.data.data).map(o => {
        v[o] = parseFloat(JSON.parse(resEc20s.data.data[o].Result).balance) / (10 ** 6)
        return v
      })
    }
    return v
  }
  setWallets (wallets) {
    store.commit('currentwallet/updateConfig', {
      keys: wallets
    })
    store.state.settings.isDemo = true
    store.state.currentwallet.loggedIn = true
    initWallet('init', ['eth', 'tpls'])
  }
  send = async (chain, token, from, to, value, memo, key, contract, decimals) => {
    const self = this

    const wallet = {
      async terra (token, from, to, value, memo, key) {
        return new Promise(async (resolve, reject) => {
          try {
            const gasPrices = (await axios('https://fcd.terra.dev/v1/txs/gas_prices')).data
            const gasPricesCoins = new Coins(gasPrices)

            const terra = new LCDClient({
              URL: 'https://lcd.terra.dev',
              chainID: 'columbus-5',
              gasPrices: gasPricesCoins
              //    gasAdjustment: '1.5',
              //   gas: 10000000
            })
            /* const coins = await terra.bank.balance(from)
            console.log(coins)
            if (coins) return
            */
            key = !key ? store.state.currentwallet.config.keys.find(o => o.type === 'terra' && from === o.key).privateKey : key
            const wallet = terra.wallet(new RawKey(Buffer.from(key, 'hex')))
            decimals = decimals || 6
            let send = null
            if (typeof memo === 'object' && memo.txData) {
              send = memo.txData
              memo = null
            } else if (contract.length > 6) {
              const amount = toAmount(value, { decimals })
              const execute_msg = { transfer: { recipient: to, amount } }

              send = new MsgExecuteContract(
                wallet.key.accAddress,
                contract,
                execute_msg
              )
            } else {
              let tk = {}
              tk[contract] = value * (10 ** decimals)
              send = new MsgSend(
                from,
                to,
                tk
              )
            }

            wallet
              .createAndSignTx({
                msgs: [send]
                // memo: memo
              })
              .then(async tx => {
                let data = await terra.tx.broadcast(tx)

                if (!isTxError(data)) {
                  resolve({
                    message: `https://finder.terra.money/mainnet/tx/${data.txhash}`,
                    success: true,
                    transaction_id: data.txhash
                  })
                } else {
                  reject({
                    message: 'Transaction failed',
                    success: false
                  })
                }
              }).catch(error => {
                reject({
                  message: error,
                  success: false
                })
              })
          } catch (error) {
            reject({
              message: error.message,
              success: false
            })
          }
        })
      },
      async sol (token, from, to, value, memo, key) {
        let account = new solanaWeb3.Account(JSON.parse(key).data)

        // Connect to cluster
        var connection = new solanaWeb3.Connection(
          solanaWeb3.clusterApiUrl('mainnet-beta'),
          'confirmed'
        )
        let tx = solanaWeb3.SystemProgram.transfer({
          fromPubkey: account.publicKey,
          toPubkey: to,
          lamports: solanaWeb3.LAMPORTS_PER_SOL * value
        })
        // Add transfer instruction to transaction
        var transaction = new solanaWeb3.Transaction().add(
          tx
        )

        // Sign transaction, broadcast, and confirm
        var signature = await solanaWeb3.sendAndConfirmTransaction(
          connection,
          transaction,
          [account]
        )

        return new Promise((resolve, reject) => {
          resolve({
            message: `solscan.io/tx/${signature}`,
            success: true,
            transaction_id: signature
          })
        })
      },
      async btc (token, from, to, value, memo, key) {
        const bitcoin = require('bitcoinjs-lib')
        const CryptoAccount = require('send-crypto').default
        const keyPair = bitcoin.ECPair.fromWIF(key)

        const account = new CryptoAccount(keyPair.privateKey, {
          network: ''
        })
        let fee = memo && memo.fee ? memo.fee : 10000

        return new Promise((resolve, reject) =>
          account.send(to, value, 'BTC', { fee: fee })
            .on('transactionHash', (tx_hash) => {
              resolve({
                message: `https://blockstream.info/tx/${tx_hash}`,
                success: true,
                transaction_id: tx_hash
              })
            })
            .on('confirmation', confirmations => {
              // console.log(confirmations, 'confirmations')
            })
            .catch(reject)
        )

        /*
        // const bitcore = require('bitcore-lib')

        const explorers = require('bitcore-explorers')
        const insight = new explorers.Insight(process.env[store.state.settings.network].CACHE + 'https://explorer.btc.zelcore.io/') // 'https://insight.bitpay.com')
        const network = store.state.settings.network === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin

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
          //console.log('UTXO', UTXO)
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
                // //console.log(error)
                return reject()
              } else {
                // //console.log(transactionId)
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
        */
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

          // console.log(result)
          if (result.status === 200) {
            // console.log('success', result.result[0].hash)

            message = 'https://explorer.binance.org/tx/' + result.result[0].hash
            success = true
          } else {
            message = result.message
            success = false
          }
        } catch (error) {
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

        //   //console.log(result)
        //   if (result.status === 200) {
        //     //console.log('success', result.result[0].hash)

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
      async tpls (token, from, to, value, info, key, contract, evm = 'tpls') {
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
        const Web3 = require('web3')
        key = !key ? store.state.currentwallet.config.keys.find(o => o.type === evm && from === o.key).privateKey : key

        let evmData = self.evms.find(o => o.chain === evm)
        const EthereumTx = require('ethereumjs-tx').Transaction
        const web3 = new Web3(new Web3.providers.HttpProvider(evmData.provider))

        let nonce = await web3.eth.getTransactionCount(from)

        let data = '0x'
        let toToken = {
          decimals: 18
        }
        if (contract) {
          toToken = store.state.wallets.tokens.find(a => a.contract && a.contract.toLowerCase() === contract.toLowerCase())
          if (!toToken) {
            toToken = store.state.wallets.tokens.find(o => o.value.toLowerCase() === token.toLowerCase())
          }
        }

        let web3Value = !value.toString().includes('0x') ? web3.utils.toHex((value * 10 ** toToken.decimals).toString()) : value

        // let transactionHash = ''
        let sendTo = to

        if (token !== evmData.nativeToken && !(info && info.txData)) {
          let web3Contract = new web3.eth.Contract(abiArray, contract)
          data = web3Contract.methods.transfer(to, web3Value).encodeABI()

          sendTo = contract
          web3Value = '0x0'
        } else if (info && info.txData) {
          data = typeof info.txData === 'object' ? info.txData.data : info.txData
        }

        let rawTx = {
          from,
          to: sendTo,
          value: web3Value,
          data,
          nonce,
          chainId: evmData.network_id
        }

        console.log(rawTx, 'rawTx')
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
        //     ////console.log(err)
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
              ////console.log('receipt:', confirmationNumber, receipt)
            })

            tx.on('transactionHash', hash => {
              transactionHash = hash
              ////console.log('hash:', hash)
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
                text: 'Insufficient funds for gas'
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
                      ////console.log(error)
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

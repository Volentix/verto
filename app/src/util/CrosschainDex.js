import axios from 'axios'
import store from '@/store'
import { computeForward } from '@/util/VolentixPools'
import { number_to_asset, asset } from 'eos-common'
import RenJS from '@renproject/ren'
import { Bitcoin, Ethereum } from '@renproject/chains'
import Lib from '@/util/walletlib'
import HD from '@/util/hdwallet'
import abiArray from '@/statics/abi/erc20.json'
const _1inch = process.env[store.state.settings.network].CACHE + 'https://api.1inch.exchange'
import {
  JsonRpc
} from 'eosjs'

class Crosschaindex {
  constructor () {
    this.base = {
      godex: 'https://api.godex.io/api/v1/',
      oneinch: 'https://api.1inch.exchange/v3.0/'
    }
    this.cache = {}
    this.exchangeLogo = {
      oneinch: 'https://duneanalytics.com/projects/pages/1inch/1inch.svg',
      defibox: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiUSq9pt4nXXFxXuyWhIxw7mOB1oH0wRgw6tBtb0bfLZAMX3aqTKjz6V4oma4u3zVYOfA&usqp=CAU',
      godex: 'https://api.bytecoin.org/storage/godex2.png',
      coinswitch: 'statics/icons/vtx-logo-1024x1024.png',
      renbridge: 'https://images.saymedia-content.com/.image/t_share/MTgxNzU2MTk4NTExNTg0ODc1/ren-cryptocurrency.png'
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
  getRenMintTx (deposit, fromChain) {
    let amount = deposit._state.queryTxResult.out.amount
    let nhash = deposit._state.queryTxResult.out.nhash
    let sig = deposit._state.queryTxResult.out.signature

    // console.log(deposit, fromChain, 'mint, fromChain')
    // const utils_1 = require('@renproject/utils')
    const web3 = Lib.getWeb3Instance(fromChain)
    let params = deposit.params.contractCalls[0]
    let contractFn = params.contractFn
    const ABI = '[{"inputs":[{"internalType":"contract IGatewayRegistry","name":"_registry","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldRelayHub","type":"address"},{"indexed":true,"internalType":"address","name":"newRelayHub","type":"address"}],"name":"RelayHubChanged","type":"event"},{"constant":true,"inputs":[{"internalType":"address","name":"relay","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"bytes","name":"encodedFunction","type":"bytes"},{"internalType":"uint256","name":"transactionFee","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"uint256","name":"gasLimit","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"approvalData","type":"bytes"},{"internalType":"uint256","name":"maxPossibleCharge","type":"uint256"}],"name":"acceptRelayedCall","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"bytes","name":"_to","type":"bytes"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getHubAddr","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"address","name":"_recipient","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"bytes32","name":"_nHash","type":"bytes32"},{"internalType":"bytes","name":"_sig","type":"bytes"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"context","type":"bytes"},{"internalType":"bool","name":"success","type":"bool"},{"internalType":"uint256","name":"actualCharge","type":"uint256"},{"internalType":"bytes32","name":"preRetVal","type":"bytes32"}],"name":"postRelayedCall","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"context","type":"bytes"}],"name":"preRelayedCall","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"relayHubVersion","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"setDefaultRelayHub","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]'

    // let a = utils_1.payloadToABI(contractFn, params.contractParams)

    const contract = new web3.eth.Contract(JSON.parse(ABI), params.sendTo)
    let from = params.contractParams.find(o => o.name === '_address').value
    let symbol = params.contractParams.find(o => o.name === '_symbol').value
    // let callParams = params.contractParams.map((value) => value.value)
    //  console.log(callParams, symbol, from, amount, nhash, sig, contractFn)
    const txData = contract.methods[contractFn](symbol, from, amount, nhash, sig).encodeABI()

    let tx = {
      from: from,
      to: params.sendTo,
      data: txData,
      amount: parseFloat(deposit.depositDetails.amount) / 100000000,
      value: 0
    }
    return tx
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
  }

  format1InchTokens (coins, chain) {
    coins = Object.keys(coins).map((key, index) => {
      let image = coins[key].symbol.toLowerCase() === 'eth' ? 'https://s3.amazonaws.com/token-icons/eth.png' : 'https://tokens.1inch.io/' + coins[key].address + '.png'

      let row = {
        'label': coins[key].name.toUpperCase(),
        'value': coins[key].symbol,
        'image': image,
        'address': coins[key].address,
        'decimals': coins[key].decimals,
        'price': coins[key].current_price,
        'dex': 'oneinch',
        'priority': ['eth', 'dai', 'hex', 'usdt', 'usdc'].reverse().indexOf(coins[key].symbol.toLowerCase())
      }
      return row
    })
    return coins.filter(function (el) {
      return el != null && el.address.toString() !== 'unknown'
    }).sort(function (a, b) {
      if (a.label && b.label && a.label.toLowerCase() < b.label.toLowerCase()) {
        return -1
      }
      return 1
    }).sort((a, b) => b.priority - a.priority)
  }
  async getCoinByChain (chain) {
    let self = this
    let coins = {
      eth () {
        return store.state.settings.coins.oneinch
      },
      eos () {
        return store.state.settings.coins.defibox.sort((a, b) => b.priority - a.priority)
      },
      async bsc () {
        let result = await axios.get(_1inch + '/v3.0/56/tokens')
        coins = result.data.tokens
        return self.format1InchTokens(coins, 'bsc')
      },
      async matic () {
        let result = await axios.get(_1inch + '/v3.0/137/tokens')
        coins = result.data.tokens
        return self.format1InchTokens(coins, 'matic')
      }
    }
    let v = coins[chain]
    let data = null
    if (v) {
      data = await coins[chain]()
    } else if (!Lib.isEvm(chain)) {
      let x = HD.names.find(o => o.value === chain)
      if (x) {
        x.image = x.icon ? x.icon : 'https://files.coinswitch.co/public/coins/' + x.value + '.png'
        data = [x]
      }
    }
    console.log(data, 'data')
    return data
  }
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
        // 'image': 'https://defibox.s3.ap-northeast-1.amazonaws.com/eos/' + coin.contract + '-' + coin.type + '.png',
        'dex': 'coinswitch',
        'amount': parseFloat(coin.amount),
        'amountUSD': coin.usd
      }

      coins.unshift(row)
    })
    const getImage = (type) => {
      let images = {
        eth: 'https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png',
        btc: 'https://api.godex.io/storage/coins/nlQJWbSb5SZ0CsXk0RTDFH2Tsg4bcRKuZLZwVyKr.png',
        usdc: 'https://tokens.1inch.exchange/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png'
      }
      if (images[type]) {
        return images[type]
      }
    }
    coins.map(o => {
      let image = getImage(o.value.toLowerCase())
      o.image = image || o.image
    })
    // coins = this.getUniqueTokens(coins)
    return coins.sort(function (a, b) {
      return a.name ? -1 : 1
    }).filter((o, i) => !unique || coins.findIndex(a => a.value.toLowerCase() === o.value.toLowerCase()) === i)
  }

  getApprovalDataV3 (tokenAddress, evmData) {
    let response = axios.get('https://api.1inch.exchange/v3.0/' + evmData.network_id + '/approve/calldata?tokenAddress=' + tokenAddress)
    return response
  }

  getSpender1Inchv3 (evmData) {
    let response = axios.get('https://api.1inch.exchange/v3.0/' + evmData.network_id + '/approve/spender')
    return response
  }
  async isOneinchApprovalRequired (fromUserAddress, fromToken, toToken, amountToSend, fromChain) {
    let transactionObject = {}
    let check = {
      required: false,
      error: false,
      transactionObject: null
    }
    const web3 = Lib.getWeb3Instance(fromChain)
    let evmData = Lib.evms.find(o => o.chain === fromChain)
    let tokenData = await this.getOneInchCoinData(fromToken, toToken, evmData.network_id)

    if (tokenData && tokenData.fromData && tokenData.toData && evmData.nativeToken !== fromToken.toLowerCase()) {
      const tokenContract = new web3.eth.Contract(abiArray, tokenData.fromData.address)

      let spenderData = await this.getSpender1Inchv3(evmData)

      if (spenderData.data && spenderData.data.address) {
        let toAddress = spenderData.data.address

        const allowance = await tokenContract.methods.allowance(fromUserAddress, toAddress).call()

        if (parseFloat(allowance) === 0 || parseFloat(allowance) < parseFloat(amountToSend)) {
          let nonce = await web3.eth.getTransactionCount(fromUserAddress, 'latest')

          transactionObject = {
            from: fromUserAddress,
            nonce: nonce
          }
          check.required = true

          let approvalData = await this.getApprovalDataV3(tokenData.fromData.address, evmData)

          if (approvalData.data && approvalData.data.data) {
            transactionObject.data = approvalData.data.data
            transactionObject.value = web3.utils.toHex(approvalData.data.value)
            transactionObject.gasPrice = web3.utils.toHex(approvalData.data.gasPrice)
          }
          transactionObject.to = tokenData.fromData.address
          transactionObject.chainId = evmData.network_id
          check.transactionObject = transactionObject
        }
      } else {
        check.error = 'Spender address not found'
      }
    } else {
      check.error = 'Token not found'
    }

    return check
  }
  async getDefiboxPairs () {
    let pairs = []

    if (store.state.settings.globalSettings && store.state.settings.globalSettings.defiboxPairs) {
      pairs = store.state.settings.globalSettings.defiboxPairs
    } else {
      let rpc = new JsonRpc(process.env[store.state.settings.network].CACHE + 'https://eos.greymass.com:443')

      let pairs = this.cache['defibox_pairs']
      if (!pairs) {
        pairs = (await rpc.get_table_rows({
          json: true,
          code: 'swap.defi',
          scope: 'swap.defi',
          table: 'pairs',
          limit: -1
        })).rows
        this.cache['defibox_pairs'] = pairs
      }
    }

    return pairs
  }
  async getDefiboxPairData (to, from) {
    this.ErrorMessage = null
    let pairs = await this.getDefiboxPairs()
    let pair = pairs.find(
      (w) =>
        (w.token1.symbol.split(',')[1].toLowerCase() === from &&
            to ===
              w.token0.symbol.split(',')[1].toLowerCase()) ||
          (w.token0.symbol.split(',')[1].toLowerCase() === from &&
            to ===
              w.token1.symbol.split(',')[1].toLowerCase())
    )
    if (pair && pair.liquidity_token === 0) {
      pair = false
    }
    return pair
  }
   getDex = async (from, to) => {
     let dex = []
     let pairDefibox = await this.getDefiboxPairData(to, from)

     if (store.state.settings.coins.oneinch.find(o => o.value.toLowerCase() === from.toLowerCase()) &&
      store.state.settings.coins.oneinch.find(o => o.value.toLowerCase() === to.toLowerCase())) {
       dex.push({ chains: ['eth', 'matic', 'bsc'], dex: 'oneinch' })
     }
     if (store.state.settings.coins.defibox.find(o => o.value.toLowerCase() === from.toLowerCase()) &&
      store.state.settings.coins.defibox.find(o => o.value.toLowerCase() === to.toLowerCase()) && pairDefibox) {
       dex.push({ chains: ['eos'], dex: 'defibox' })
     }

     if (['btc'].includes(from.toLowerCase()) && ['renbtc'].includes(to.toLowerCase())) {
       dex.push({ chains: [], dex: 'renbridge' })
     }

     if (store.state.settings.coins.godex.find(o => o.value.toLowerCase() === from.toLowerCase()) &&
      store.state.settings.coins.godex.find(o => o.value.toLowerCase() === to.toLowerCase())) {
       dex.push({ chains: [], dex: 'godex' })
     }
     return dex
   }
   async getOneInchCoinData (from, to, chainId) {
     let coins = this.cache['oneinch_' + chainId]
     if (!coins) {
       let result = await axios.get(_1inch + '/v3.0/' + chainId + '/tokens')
       coins = result.data.tokens
       this.cache['oneinch_' + chainId] = coins
     }

     let fromData = Object.keys(coins).filter(o => coins[o].symbol.toLowerCase() === from.toLowerCase()).map(o => coins[o])
     let toData = Object.keys(coins).filter(o => coins[o].symbol.toLowerCase() === to.toLowerCase()).map(o => coins[o])

     let pair = {
       fromData: fromData ? fromData[0] : null,
       toData: toData ? toData[0] : null
     }

     return pair
   }
   getPair = (from, to, amount) => {
     const self = this

     let list = {
       oneinch () {
         return new Promise(async (resolve, reject) => {
           let fromToken = store.state.settings.coins.oneinch.find(o => o.value.toLowerCase() === from.toLowerCase())
           let toToken = store.state.settings.coins.oneinch.find(o => o.value.toLowerCase() === to.toLowerCase())
           let validChains = []
           let evmData = {
             network_id: 1
           }
           await Promise.all(['eth', 'matic', 'bsc'].map(async chain => {
             let evm = Lib.evms.find(o => o.chain === chain)
             let pair = await self.getOneInchCoinData(from, to, evm.network_id)

             if (pair.fromData && pair.toData) {
               validChains.push(evm.chain)
             }
           }))

           if (amount < 0.0000001) {
             reject()
             return
           }
           // if (validChains.length) { evmData = Lib.evms.find(o => o.chain === validChains[0]) }
           let data = {
             fromTokenAddress: fromToken.address,
             toTokenAddress: toToken.address,
             amount: Math.round(amount * 10 ** fromToken.decimals)
           }
           axios
             .get(process.env[store.state.settings.network].CACHE + self.base.oneinch + evmData.network_id + '/quote?' + new URLSearchParams(data).toString())
             .then(res => {
               data.amount = res.data.toTokenAmount.toString() / (10 ** toToken.decimals)
               data.fromChains = validChains
               data.toChains = validChains
               data.isCrosschain = false
               data.limitMaxDepositCoin = 0
               data.limitMinDepositCoin = 0

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
           if (!pairData || pairData.liquidity_token === 0) {
             resolve({
               pair: false
             })
             return
           }

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
           data.limitMaxDepositCoin = parseFloat(poolOne.amount)
           data.limitMinDepositCoin = 0
           data.pair_id = pairData.id
           data.pairData = pairData
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
  renDepositListener (mint) {
    mint.on('deposit', async (deposit) => {
      // Details of the deposit are available from `deposit.depositDetails`.

      const hash = deposit.txHash()
      const depositLog = (msg) => console.log(`[${hash.slice(0, 8)}][${deposit.status}] ${msg}`)

      await deposit.confirmed()
        .on('target', (confs, target) => depositLog(`${confs}/${target} confirmations`))
        .on('confirmation', (confs, target) => depositLog(`${confs}/${target} confirmations`))

      await deposit.signed()
        // Print RenVM status - "pending", "confirming" or "done".
        .on('status', (status) => depositLog(`Status: ${status}`))

      await deposit.mint()
        // Print Ethereum transaction hash.
        .on('transactionHash', (txHash) => depositLog(`Mint tx: ${txHash}`))
        .on('tx_details', (tx_details) => {
          console.log(tx_details, 'tx_details')
        })
    })
  }

  createTransaction = (from, to, amount, toAddress, fromChain, toChain, refundAddress, fromAddress) => {
    const self = this

    let list = {
      oneinch () {
        return new Promise(async (resolve, reject) => {
          let web3 = Lib.getWeb3Instance(fromChain)
          let evmData = Lib.evms.find(o => o.chain === fromChain)
          let pair = await self.getOneInchCoinData(from, to, evmData.network_id)
          if (!pair.fromData || !pair.toData) {
            reject('Data not available')
            return
          }
          let params = {
            fromTokenAddress: pair.fromData.address,
            toTokenAddress: pair.toData.address,
            amount: Math.round(amount * 10 ** pair.fromData.decimals),
            slippage: 2,
            fromAddress: fromAddress,
            disableEstimate: true,
            referrerAddress: '0x91B9dAda77e2eb76d6F36B96F448c1F9A066BE74',
            fee: store.state.settings.globalSettings ? store.state.settings.globalSettings.fee1inch : 0.75
          }
          let swapRequestUrl = _1inch + '/v3.0/' + evmData.network_id + '/swap?' + new URLSearchParams(params).toString()
          axios.get(swapRequestUrl)
            .then(async function (result) {
              let nonce = await web3.eth.getTransactionCount(fromAddress, 'latest')
              let txObject = result.data.tx
              txObject.nonce = nonce
              txObject.value = web3.utils.toHex(txObject.value)
              txObject.chainId = evmData.network_id
              resolve(txObject)
            })
        })
      },
      renbridge () {
        return new Promise(async (resolve, reject) => {
          let mintFromChain = {
            async btc () {
              let minToChain = {
                async eth () {
                  const ren = new RenJS()
                  // await window.ethereum.enable()
                  let web3 = Lib.getWeb3Instance('eth')

                  // if (account) return

                  web3.eth.defaultAccount = toAddress

                  let mint = await ren.lockAndMint({
                    asset: from.toUpperCase(),
                    from: Bitcoin(),
                    to: Ethereum(web3.currentProvider)
                      .Address(toAddress)
                  })

                  return mint
                }
              }
              const mint = await minToChain[toChain]()

              //   self.renDepositListener(mint)

              let tx = {
                mintObject: mint,
                status: 'wait',
                from: from,
                to: to,
                depositQuantity: amount,
                depositAddress: mint.gatewayAddress,
                destinationAddress: toAddress,
                order_id: parseInt(Date.now() + Math.random())
              }

              resolve({
                tx: tx
              })
            }
          }
          mintFromChain[fromChain]()
        })
      },
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
                fetchStatus: true,
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
    return list[ this.currentExchange ]()
  }
}
window.CrosschainDex = new Crosschaindex()
export default window.CrosschainDex

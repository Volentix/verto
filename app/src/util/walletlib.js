import EosWrapper from '@/util/EosWrapper'
import axios from 'axios'
import store from '@/store'
import { userError } from '@/util/errorHandler'
import { date } from 'quasar'
import abiArray from '@/statics/abi/erc20.json'

class Lib {
  history = async (walletType, key, token) => {
    const wallet = {
      async eos (token, key) {
        // console.log('history eos!', key, token)
        let actions = []
        await axios.post(process.env[store.state.settings.network].CACHE + process.env[store.state.settings.network].EOS_HISTORYAPI + '/v1/history/get_actions', { 'account_name': key })
          .then(function (result) {
            if (result.length !== 0) {
              result.data.actions.reverse().map(a => {
                // console.log('split', a.action_trace.act.name === 'transfer' ? a.action_trace.act.data.quantity.toString().split(' ')[1].toLowerCase() : 'not transfer')
                if (token === 'eos' || (
                  a.action_trace.act.name === 'transfer' &&
                    a.action_trace.receiver === key &&
                    a.action_trace.act.data.quantity.toString().split(' ')[1].toLowerCase() === token)
                ) {
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

                  actions.push({
                    date: date.formatDate(a.block_time, 'YYYY-MM-DD HH:mm'),
                    transID: a.action_trace.trx_id,
                    from: a.action_trace.act.data.from,
                    to: a.action_trace.act.data.to,
                    typeTran: a.action_trace.act.name,
                    desc: a.action_trace.act.data.memo ? a.action_trace.act.data.memo.substring(0, 20) : '',
                    amount
                  })
                }
              })
              return actions
            }
          }).catch(function (error) {
            // TODO: Exception handling
            // console.log('history error', error)
            userError(error)
            return false
          })

        // Promise.all(balProm)
        return { history: actions }
      },
      async eth (token, key) {
        // console.log('history eth!', key)
        let actions = []
        await axios.get('http://api.etherscan.io/api?module=account&action=txlist&startblock=0&endblock=99999999&sort=desc&address=' + key)
          .then(function (result) {
            if (result.length !== 0) {
              result.data.result.map(a => {
                actions.push({
                  date: date.formatDate(a.timeStamp * 1000, 'YYYY-MM-DD HH:mm'),
                  transID: a.hash,
                  from: a.from,
                  to: a.to,
                  typeTran: '',
                  desc: '',
                  amount: (a.value / 1000000000000000000) + ' ETH'
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

        return { history: actions }
      }
    }[walletType]

    return wallet ? wallet(key, token) : {}
  }

  balance = async (walletType, key, token) => {
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
            // //console.log('walletlib', key, tokenContract[token], bal)
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
        return { balance: float }
      },
      async eth (key, token) {
        // const Web3 = require('web3')
        // const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/54b0a9c16bc94aeb908616525203c9da"))
        // var balance = web3.eth.getBalance(key)

        // return { balance: float }
      },
      async btc (key) {
        const amount = (await axios.get('https://blockchain.info/q/addressbalance/' + key, { 'cors': 'true' })).data / 100000000
        const usd = amount * (await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')).data.bitcoin.usd
        return { amount, usd }
      },
      async ltc (key) {
        const amount = (await axios.get('https://chainz.cryptoid.info/ltc/api.dws?key=9e24784791a6&q=getbalance&a=' + key)).data
        const usd = amount * (await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd')).data.litecoin.usd
        return { amount, usd }
      },
      async bnb (key) {
        let amount = 0
        try {
          const balances = (await axios.get('https://dex.binance.org/api/v1/account/' + key)).data.balances
          if (balances) {
            balances.filter(b => b.symbol === 'BNB').map(b => {
              amount = +b.free + +b.frozen + +b.locked
            })
          }
          // //console.log('bnb', balances, amount)
        } catch (err) {
          // //console.log('', err)
        }
        const usd = amount * (await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd')).data.binancecoin.usd
        return { amount, usd }
      },
      async dash (key) {
        const amount = (await axios.get('https://chainz.cryptoid.info/dash/api.dws?key=9e24784791a6&q=getbalance&a=' + key)).data
        const usd = amount * (await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=dash&vs_currencies=usd')).data.dash.usd
        return { amount, usd }
      }
    }[walletType]

    return wallet ? wallet(key, token) : {}
  }

  send = async (walletType, token, from, to, value, memo, key, contract) => {
    const wallet = {
      async btc (token, from, to, value, memo, key) {
        // const bitcore = require('bitcore-lib')
        const bitcore = require('bitcore-lib')
        const explorers = require('bitcore-explorers')
        const insight = new explorers.Insight(process.env[store.state.settings.network].CACHE + 'https://explorer.btc.zelcore.io/') // 'https://insight.bitpay.com')

        let message, success
        try {
          // eslint-disable-next-line new-cap
          let privateKey = new bitcore.PrivateKey.fromWIF(key)
          let address = bitcore.Address.fromString(from)
          // console.log('privateKey', privateKey)

          insight.getUnspentUtxos(from, function (error, utxos) {
            if (error) {
              console.log(error)
            } else {
              console.log(utxos)
              var tx = new bitcore.Transaction()
                .from(utxos)
                .to(to, value * 100000000)
                .change(address)
                .sign(privateKey)
                .serialize()

              return new Promise(async (resolve, reject) => {
                insight.broadcast(tx, function (error, transactionId) {
                  if (error) {
                    console.log(error)
                    return reject()
                  } else {
                    console.log(transactionId)
                    resolve({
                      message: `https://www.blockchain.com/btc/tx/${transactionId}`,
                      success: true
                    })
                  }
                })
              })
            }
          })
        } catch (err) {
          message = err
          success = false
        }

        return { success, message }
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

        return { success, message }

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
          for (;numberOfDecimals < currentAccount.precision; numberOfDecimals++) {
            stringAmount += '0'
          }

          return stringAmount + ' ' + token.toUpperCase()
        }
      },
      async eth (token, from, to, value, memo, key, contract) {
        console.log('token, from, to, value, memo, key, contract', token, from, to, value, memo, key, contract)
        console.log('abiArray', abiArray)

        const Web3 = require('web3')
        const EthereumTx = require('ethereumjs-tx').Transaction
        const web3 = new Web3(new Web3.providers.HttpProvider('https://main-rpc.linkpool.io'))

        let nonce = await web3.eth.getTransactionCount(from)
        let gasPrices = await getCurrentGasPrices()
        let data = '0x00'
        let web3Value = web3.utils.toHex(web3.utils.toWei(value.toString()))
        let transactionHash = ''
        let sendTo = to

        if (token !== 'eth') {
          let web3Contract = new web3.eth.Contract(abiArray, contract)
          data = web3Contract.methods.transfer(to, web3Value).encodeABI()
          console.log('data for', token, data)
          sendTo = contract
          web3Value = '0x00'
        }

        let rawTx = {
          from,
          to: sendTo,
          value: web3Value,
          data,
          gasPrice: gasPrices.medium * 1000000000,
          nonce,
          chainId: 1
        }
        console.log('rawTx:', rawTx)

        let gas = await web3.eth.estimateGas(rawTx)
        console.log('gas:', gas)
        rawTx.gas = gas

        try {
          const transaction = new EthereumTx(rawTx)
          transaction.sign(Buffer.from(key.substring(2), 'hex'))
          const serializedTransaction = transaction.serialize()
          console.log('serializedTransaction', serializedTransaction)

          return new Promise(async (resolve, reject) => {
            // web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'), (err, id) => {
            //   if (err) {
            //     console.log(err)
            //     return reject()
            //   }
            //   resolve({
            //     message: process.env[store.state.settings.network].ETH_TRANSACTION_EXPLORER + id,
            //     success: true
            //   })
            // })
            let tx = web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))

            tx.on('confirmation', (confirmationNumber, receipt) => {
              if (confirmationNumber > 2) {
                resolve({
                  message: process.env[store.state.settings.network].ETH_TRANSACTION_EXPLORER + transactionHash,
                  success: true
                })
              }
              console.log('receipt:', confirmationNumber, receipt)
            })

            tx.on('transactionHash', hash => {
              transactionHash = hash
              console.log('hash:', hash)
            })
          })
        } catch (err) {
          let message = err
          let success = false

          return { success, message }
        }
        async function getCurrentGasPrices () {
          let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
          let prices = {
            low: response.data.safeLow / 10,
            medium: response.data.average / 10,
            high: response.data.fast / 10
          }
          return prices
        }

        // return { send }
      },
      async ltc (key) {
      },
      async dash (key) {
      }
    }[walletType]

    return wallet ? wallet(token, from, to, value, memo, key, contract) : {}
  }
}
window.Lib = new Lib()
export default window.Lib

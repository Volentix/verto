import EosWrapper from '@/util/EosWrapper'
import axios from 'axios'
import store from '@/store'
import { userError } from '@/util/errorHandler'

class Lib {
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
            // console.log('walletlib', key, tokenContract[token], bal)
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
          // console.log('bnb', balances, amount)
        } catch (err) {
          // console.log('', err)
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
        const insight = new explorers.Insight()

        let message, success
        try {
          let privateKey = new bitcore.PrivateKey(key)

          insight.getUnspentUtxos(from, function (error, utxos) {
            if (error) {
              // console.log(error)
            } else {
              // console.log(utxos)
              var tx = new bitcore.Transaction()
                .from(utxos)
                .to(to, value * 100000000)
                .change(from)
                .sign(privateKey)
                .serialize()

              return new Promise(async (resolve, reject) => {
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
          const formatedAmount = await formatAmountString(value, token, key)
          const transaction = await (new EosWrapper()).transferToken(
            contract,
            from.toLowerCase(),
            to.toLowerCase(),
            formatedAmount,
            memo,
            key
          )

          message = `https://bloks.io/transaction/${transaction.transaction_id}`
          success = true
        } catch (err) {
          message = err
          success = false
        }

        return { success, message }

        async function formatAmountString (value, token, key) {
          let numberOfDecimals = 0
          let tableData = await store.state.wallets.tokens
          let currentAccount = tableData.find(w => w.privateKey === key && w.type === token)
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
      async eth (token, from, to, value, memo, key) {
        const Web3 = require('web3')
        const EthereumTx = require('ethereumjs-tx').Transaction
        const web3 = new Web3(new Web3.providers.HttpProvider('https://main-rpc.linkpool.io'))

        let nonce = await web3.eth.getTransactionCount(from)
        let gasPrices = await getCurrentGasPrices()

        try {
          let details = {
            from,
            to,
            value: web3.utils.toHex(web3.utils.toWei(value.toString())),
            gas: 21000,
            gasPrice: gasPrices.low * 1000000000, // converts the gwei price to wei
            nonce,
            chainId: 1 // EIP 155 chainId - mainnet: 1, rinkeby: 4,  Ropsten: 3
          }

          // console.log('details', details)

          const transaction = new EthereumTx(details)
          transaction.sign(Buffer.from(key.substring(2), 'hex'))
          const serializedTransaction = transaction.serialize()

          return new Promise(async (resolve, reject) => {
            web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'), (err, id) => {
              if (err) {
                // console.log(err)
                return reject()
              }
              resolve({
                message: `https://etherscan.io/tx/${id}`,
                success: true
              })
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

import EosWrapper from '@/util/EosWrapper'
import axios from 'axios'
import store from '@/store'

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
        const bal = await eos.getCurrencyBalanceP(key, tokenContract[token])
        console.log('walletlib', key, tokenContract[token], bal)
        if (bal) {
          float = bal[0].split(' ')[0]
        }

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

          console.log('details', details)

          const transaction = new EthereumTx(details)
          transaction.sign(Buffer.from(key.substring(2), 'hex'))
          const serializedTransaction = transaction.serialize()

          return new Promise(async (resolve, reject) => {
            web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'), (err, id) => {
              if (err) {
                console.log(err)
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
      async btc (key) {
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

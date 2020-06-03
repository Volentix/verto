import EosWrapper from '@/util/EosWrapper'
import axios from 'axios'

class Lib {
  Wallet = async (walletType, key, token) => {
    const balance = {
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

    const send = {
      async eos (key, token) {
      },
      async eth (from, to, value, token, key) {
        // const Web3 = require('web3')
        // const web3 = new Web3(new Web3.providers.HttpProvider('https://main-rpc.linkpool.io'))
        // const rawTransaction = {
        //   from,
        //   to,
        //   value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
        //   gas: 200000,
        //   chainId: 3
        // }

        // let send = ''
        // web3.eth.accounts.signTransaction(rawTransaction, key)
        //   .then(signedTx => web3.eth.sendSignedTransaction(signedTx.rawTransaction))
        //   .then(receipt => send = receipt)
        //   .catch(error => send = error)

        // return { send }
      },
      async btc (key) {
      },
      async ltc (key) {
      },
      async dash (key) {
      }
    }[walletType]

    console.log(send)
    return balance ? balance(key, token) : {}
  }
}
window.Lib = new Lib()
export default window.Lib

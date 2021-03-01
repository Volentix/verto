import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/0dd5e7c7cbd14603a5c20124a76afe63'))
import axios from 'axios'
import store from '@/store'

class ExternalWallets {
  constructor (walletName) {
    this.tableData = []
    this.walletName = walletName
  }

pushTransaction = (transactionObject) => {
  const wallet = {
    async metamask () {
      return new Promise(async (resolve, reject) => {
        try {
          if (window.web3 && window.web3.currentProvider.isMetaMask) {
            let localWeb3 = new Web3(window.web3.currentProvider)

            let tx = localWeb3.eth.sendTransaction(transactionObject)
            resolve({
              transaction: tx,
              success: true
            })
          } else {
            // Non-dapp browsers...
            reject({
              message: 'Metamask not detected',
              success: false
            })
          }
        } catch (error) {
          reject({
            message: error.message,
            success: false
          })
        }
      })
    }
  }[this.walletName]

  return this.walletName ? wallet() : {}
}

connect = () => {
  const self = this
  const wallet = {
    async metamask () {
      return new Promise(async (resolve, reject) => {
        try {
          window.ethereum.enable().then(async (accounts) => {
            store.commit('wallets/updateExternalWalletAccounts', { wallet: self.walletName,
              accounts: accounts.map((o) => {
                let item = {}
                item.label = o.substring(0, 10) + '...' + o.substr(o.length - 5)
                item.value = o
                item.image = 'https://files.coinswitch.co/public/coins/eth.png'
                return item
              }) })

            accounts.map(async (o, index) => {
              let item = {}

              await web3.eth.getBalance(o, async (err, balance) => {
                if (err) {
                  reject({
                    message: err,
                    success: false
                  })
                } else {
                  item.balance = web3.utils.fromWei(balance, 'ether')
                  item.label = o.substring(0, 6) + '...' + o.substr(o.length - 5)
                  item.value = o
                  item.amount = isNaN(item.balance) ? 0 : item.balance
                  item.symbol = 'ETH'
                  item.type = 'eth'
                  item.icon = item.image = 'https://files.coinswitch.co/public/coins/eth.png'
                  item.chain = 'eth'
                  item.origin = 'metamask'
                  item.key = item.value
                  item.color = 'amber-5'
                  self.tableData.push(item)
                  await self.getEthWalletData(item)
                  if (index + 1 === accounts.length) {
                    resolve({
                      data: self.tableData,
                      success: true
                    })
                  }
                }
              }
              )
            })
          })
        } catch (error) {
          reject({
            message: error.message,
            success: false
          })
        }
      })
    }
  }[this.walletName]

  return this.walletName ? wallet() : {}
}

async getEthWalletData (wallet) {
  await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.ethplorer.io/getAddressInfo/' + wallet.key + '?apiKey=EK-kJ7LW-wCWTsAy-ALujf').then(async res => {
    let ethplorer = res ? res.data : false
    this.tableData.filter(w => w.key === wallet.key).map(eth => {
      eth.amount = ethplorer.ETH.balance
      eth.total = ethplorer.ETH.balance * ethplorer.ETH.price.rate
      eth.usd = ethplorer.ETH.balance * ethplorer.ETH.price.rate
    })
    store.commit('wallets/updateExternalWalletTokens', { wallet: this.walletName, tokens: this.tableData })
    if (ethplorer) {
      await axios.get(process.env[store.state.settings.network].CACHE + 'https://api.tokensets.com/v1/rebalancing_sets', {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(res => {
        let tokenSets = res.data.rebalancing_sets
        if (ethplorer.tokens) {
          ethplorer.tokens.filter(t => t.balance > 0 && t.tokenInfo.symbol).map(async (t, index) => {
            const csa = Web3.utils.toChecksumAddress(t.tokenInfo.address)
            let token = tokenSets.find(s => s.address.toLowerCase() === t.tokenInfo.address.toLowerCase())
            t.tokenInfo.image = t.tokenInfo.image && t.tokenInfo.image.includes('https') ? t.tokenInfo.image : (token && token.image ? token.image : 'https://zapper.fi/images/' + t.tokenInfo.symbol.toUpperCase() + '-icon.png')
            if (t.tokenInfo.image) {
              try {
                await axios.get(t.tokenInfo.image, {
                  validateStatus: false
                }).then(result => {
                  if (result.status !== 200) {
                    t.tokenInfo.image = 'https://etherscan.io/images/main/empty-token.png'
                  }
                })
              } catch (error) {
                console.log('eth token not on 1inch', t.tokenInfo.image, csa, error)
              }
            }
            let amount = (t.balance / (10 ** t.tokenInfo.decimals)) * t.tokenInfo.price.rate

            this.tableData.push({
              type: t.tokenInfo.symbol ? t.tokenInfo.symbol.toLowerCase() : '',
              key: wallet.key,
              amount: t.balance / (10 ** t.tokenInfo.decimals),
              address: t.tokenInfo.address ? t.tokenInfo.address : null,
              usd: amount,
              value: t.tokenInfo.symbol ? t.tokenInfo.symbol.toLowerCase() : '',
              chain: 'eth',
              icon: t.tokenInfo.image,
              image: t.tokenInfo.image
            })
            store.commit('wallets/updateExternalWalletTokens', { wallet: this.walletName, tokens: this.tableData })
          })
        }
      })
    }
  })
}
}
export default ExternalWallets

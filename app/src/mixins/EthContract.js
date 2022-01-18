/*
let apiUrlV3 = {
  eth: 'https://api.1inch.exchange/v3.0/1/',
  bsc: 'https://api.1inch.exchange/v3.0/56/'
}
*/
import Lib from '@/util/walletlib'
import abiArray from '@/statics/abi/erc20.json'
export default {
  data () {
    return {
      poolContractABIS: {},
      transactionStatus: 'Pending',
      transactionHash: null
    }
  },
  methods: {
    async getContractABI (address, isERC20 = false) {
      let abi = this.poolContractABIS[address]
      let abiCall = isERC20 ? abiArray : 'https://api.etherscan.io/api?apikey=YBABRIF5FBIVNZZK3R8USGI94444WQHHBN&module=contract&action=getabi&address=' + address + ''

      if (!abi) {
        try {
          let result = await this.$axios.get(abiCall)
          abi = isERC20 ? result.data : result.data.result
          this.poolContractABIS[address] = abi
        } catch (error) {
          console.log(error)
        }
      }

      return abi
    },
    getSpender1Inchv3 (chain = 'eth') {
      let response = this.$axios.get('https://api.1inch.exchange/v3.0/' + this.evmData.network_id + '/approve/spender')
      return response
    },
    getApprovalDataV3 (tokenAddress, chain = 'eth') {
      let response = this.$axios.get('https://api.1inch.exchange/v3.0/' + this.evmData.network_id + '/approve/calldata?tokenAddress=' + tokenAddress)
      return response
    },
    async isApprovalRequired (fromTokenAddress, toAddress, amountToSend, setGas = false, nonce = false, account, calculateGas = true) {
      let transactionObject = {}
      if (!account) {
        account = Array.isArray(this.ethAccount) ? this.ethAccount.find(o => o.type === 'eth') : this.ethAccount
      }

      this.approvalRequired = false
      const tokenContract = new this.web3.eth.Contract(abiArray, fromTokenAddress)

      let spenderData = await this.getSpender1Inchv3(fromTokenAddress)

      if (spenderData.data && spenderData.data.address) toAddress = spenderData.data.address

      const allowance = await tokenContract.methods.allowance(account.key, toAddress).call()

      if (parseFloat(allowance) === 0 || parseFloat(allowance) < parseFloat(amountToSend)) {
        nonce = !nonce ? await this.web3.eth.getTransactionCount(account.key, 'latest') : nonce

        transactionObject = {
          from: account.key,
          nonce: nonce
        }
        this.approvalRequired = true

        // let value = this.web3.utils.toWei(amountToSend.toString(), 'ether')

        let approvalData = await this.getApprovalDataV3(fromTokenAddress)

        if (approvalData.data && approvalData.data.data) {
          transactionObject.data = approvalData.data.data
          transactionObject.value = this.web3.utils.toHex(approvalData.data.value)
          transactionObject.gasPrice = this.web3.utils.toHex(approvalData.data.gasPrice)
        }
        /*
        tx = tokenContract.methods.approve(
          toAddress,
          this.web3.utils.toHex(value)
        )
         */
        transactionObject.to = fromTokenAddress
        // transactionObject.data = tx.encodeABI()

        if (setGas) {
          transactionObject.gas = this.web3.utils.toHex(this.gasSelected.gas)
          // transactionObject.gasPrice = this.web3.utils.toHex(this.gasSelected.gasPrice)
        } else if (calculateGas) {
          this.getGasOptions(transactionObject)
        }
      } else {
        this.approvalRequired = false
      }

      return this.approvalRequired ? transactionObject : this.approvalRequired
    },
    async getTxStatus (transactonHash) {
      const expectedBlockTime = 5000
      const Web3 = require('web3')
      this.web3 = this.web3 ? this.web3 : new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/0dd5e7c7cbd14603a5c20124a76afe63'))
      const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }

      let transactionReceipt = null
      while (transactionReceipt == null) {
        transactionReceipt = await this.web3.eth.getTransactionReceipt(transactonHash)
        await sleep(expectedBlockTime)
      }
      this.transactionStatus = transactionReceipt.status ? 'Success' : 'Failed'
    },
    async getGasOptions (transactionObject, customGas = false, evm = 'eth') {
      const self = this
      let evmData = Lib.evms.find(o => o.chain === evm)
      const Web3 = require('web3')

      this.web3 = this.web3 ? this.web3 : new Web3(new Web3.providers.HttpProvider(evmData.provider))

      // let gasPrice = await this.web3.eth.getGasPrice()

      this.web3.eth.estimateGas(transactionObject).then(function (gasAmount) {
        // if (customGas) gasAmount = customGas

        if (transactionObject.data) gasAmount += 21000

        self.gasOptions = [{
          label: 'Slow',
          value: self.converGasPriceToUSD(self.$store.state.investment.gasPrice.slow, gasAmount).toFixed(2),
          gasPrice: self.$store.state.investment.gasPrice.slow * 1000000000,
          gas: gasAmount
        },
        {
          label: 'Fast',
          value: self.converGasPriceToUSD(self.$store.state.investment.gasPrice.fast, gasAmount).toFixed(2),
          gasPrice: self.$store.state.investment.gasPrice.fast * 1000000000,
          gas: gasAmount
        },
        {
          label: 'Instant',
          value: self.converGasPriceToUSD(self.$store.state.investment.gasPrice.instant, gasAmount).toFixed(2),
          gasPrice: self.$store.state.investment.gasPrice.instant * 1000000000,
          gas: gasAmount
        }
        ]

        if (!self.gasSelected && self.gasOptions[1]) {
          self.gasSelected = self.gasOptions[1]
          if (self.gasPriceGwei) { self.gasPriceGwei = self.$store.state.investment.gasPrice.fast }
        }
        self.invalidTransaction = false
      })
        .catch((error) => {
          this.error = error.toString().includes('insufficient funds') ? 'Insufficient funds insufficient funds for transfer (gas + amount)' : error
          self.invalidTransaction = true
        })
    },
    async sendSignedTransaction (transactionObject, metamask = false, key = false, account = null) {
      this.transactionStatus = 'Pending'

      account = this.$store.state.wallets.tokens.find(a => a.isEvm && ((key && a.key.toLowerCase() === key.toLowerCase()) || (account && account.key.toLowerCase() && a.key.toLowerCase())))
      console.log(account, 'account', key, account, transactionObject)
      if (metamask) {
        /* global web3 */
        const Web3 = require('web3')
        if (window.web3 && window.web3.currentProvider.isMetaMask) {
          let localWeb3 = new Web3(web3.currentProvider)

          let tx = await localWeb3.eth.sendTransaction(transactionObject)
          tx.on('confirmation', (confirmationNumber, receipt) => {
            if (confirmationNumber > 2) {
              this.transactionStatus = 'Confirmed'
            }
          })

          tx.on('transactionHash', hash => {
            this.transactionStatus = 'Pending'
            this.transactionHash = hash
          })

          tx.on('receipt', receipt => {
            this.transactionStatus = 'Success'
            console.log(receipt, 'success')
          })

          tx.on('error', error => {
            this.error = error
            this.transactionStatus = null
            console.log(error)
          })
        } else { // Non-dapp browsers...
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      }

      const EthereumTx = require('ethereumjs-tx').Transaction
      var transaction = new EthereumTx(transactionObject)

      if (account) {
        transaction.sign(Buffer.from(account.privateKey.substring(0, 2) === '0x' ? account.privateKey.substring(2) : account.privateKey, 'hex'))
        const serializedTransaction = transaction.serialize()

        let tx = this.web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))

        tx.on('confirmation', (confirmationNumber, receipt) => {
          if (confirmationNumber > 2) {
            this.transactionStatus = 'Successfull'
          }
          console.log(receipt)
        })

        tx.on('transactionHash', hash => {
          this.transactionStatus = 'Pending'
          this.transactionHash = hash
          var receipt = this.web3.eth.getTransactionReceipt(hash)
            .then(console.log)

          console.log(receipt)
        })

        tx.on('error', error => {
          this.error = error
          this.transactionStatus = 'Failed'
        })
      }
      // */
    },
    converGasPriceToUSD (gweiPrice, gasNumber) {
      let ethToUsd = this.$store.state.investment.marketData.find(o => o.symbol.toLowerCase() === 'eth').current_price
      return this.web3.utils.fromWei(Math.round((gweiPrice * gasNumber * 1000000000)).toString(), 'ether') * ethToUsd
    }
  }
}

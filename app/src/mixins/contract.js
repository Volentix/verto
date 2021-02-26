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
      let abiCall = isERC20 ? 'https://gist.githubusercontent.com/veox/8800debbf56e24718f9f483e1e40c35c/raw/f853187315486225002ba56e5283c1dba0556e6f/erc20.abi.json' : 'https://api.etherscan.io/api?apikey=YBABRIF5FBIVNZZK3R8USGI94444WQHHBN&module=contract&action=getabi&address=' + address + ''

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
    async isApprovalRequired (fromTokenAddress, toAddress, amountToSend, setGas = false, nonce = false) {
      let tx = null, transactionObject = {}
      let account = Array.isArray(this.ethAccount) ? this.ethAccount.find(o => o.type === 'eth') : this.ethAccount
      let tokenABI = await this.getContractABI('default', true)
      this.approvalRequired = false
      const tokenContract = new this.web3.eth.Contract(tokenABI, fromTokenAddress)

      const allowance = await tokenContract.methods.allowance(account.key, toAddress).call()

      if (allowance === 0 || allowance < amountToSend) {
        nonce = !nonce ? await this.web3.eth.getTransactionCount(account.key, 'latest') : nonce

        transactionObject = {
          from: account.key,
          nonce: nonce
        }
        this.approvalRequired = true
        tx = tokenContract.methods.approve(
          toAddress,
          this.web3.utils.toHex(amountToSend * 10 ** 18 * 100)
        )
        transactionObject.to = fromTokenAddress
        transactionObject.data = tx.encodeABI()

        if (setGas) {
          transactionObject.gas = this.web3.utils.toHex(this.gasSelected.gas)
          transactionObject.gasPrice = this.web3.utils.toHex(this.gasSelected.gasPrice)
        } else {
          this.getGasOptions(transactionObject)
        }
      } else {
        this.approvalRequired = false
      }
      return this.approvalRequired ? transactionObject : this.approvalRequired
    },
    async getGasOptions (transactionObject, customGas = false) {
      const self = this
      const Web3 = require('web3')
      console.log(transactionObject, 'transactionObject')
      this.web3 = this.web3 ? this.web3 : new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/0dd5e7c7cbd14603a5c20124a76afe63'))
      this.web3.eth.estimateGas(transactionObject).then(function (gasAmount) {
        if (customGas) gasAmount = customGas
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
        }
        self.invalidTransaction = false
      })
        .catch((error) => {
          this.error = 'gas'
          console.log(error)
          self.invalidTransaction = true
        })
    },
    async sendSignedTransaction (transactionObject, metamask = false, key = false) {
      this.transactionStatus = 'Pending'
      let account = Array.isArray(this.ethAccount) ? this.ethAccount.find(o => o.type === 'eth') : this.ethAccount
      if (key) {
        account = this.$store.state.wallets.tokens.find(a => a.key === key)
      }

      if (metamask) {
        /* global web3 */
        const Web3 = require('web3')
        if (window.web3 && window.web3.currentProvider.isMetaMask) {
          let localWeb3 = new Web3(web3.currentProvider)

          let tx = await localWeb3.eth.sendTransaction(transactionObject)
          tx.on('confirmation', (confirmationNumber, receipt) => {
            if (confirmationNumber > 2) {
              this.transactionSTatus = 'Confirmed'
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
        console.log(account)
        transaction.sign(Buffer.from(account.privateKey.substring(2), 'hex'))
        const serializedTransaction = transaction.serialize()
        console.log(serializedTransaction, account)

        let tx = this.web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))

        tx.on('confirmation', (confirmationNumber, receipt) => {
          if (confirmationNumber > 2) {
            this.transactionSTatus = 'Successfull'
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

        tx.on('receipt', receipt => {
          console.log(receipt, 'success')
          this.transactionStatus = 'Success'
        })

        tx.on('error', error => {
          console.log(error, 'error')
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

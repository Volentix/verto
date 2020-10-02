<template>
<q-card class="q-pa-lg modal-dialog-wrapper" style="width: 800px; max-width: 90vw;">
    <q-toolbar>
        <q-toolbar-title><span class="text-weight-bold q-pl-sm">Add Liquidity</span></q-toolbar-title>
        <q-select v-if="externalWallets.metamask.length" borderless v-model="currentExrternalWallet" :options="externalWallets.metamask" label="Account" />
        <q-item dense>
            <q-item-section class="text-body1 q-pr-sm">
                <q-btn v-if="!transactionStatus" :loading="connectLoading.metamask" :class="externalWallets.metamask.length ? 'bg-green-1' : 'bg-red-1'" @click="conectWallet('metamask')" flat icon="fiber_manual_record" :color="!externalWallets.metamask.length ? 'red' : 'green'" :label="!externalWallets.metamask.length ? 'Connect' : 'Connected'">
                    <img style="width: 35px;" class="q-pl-sm" src="https://cdn.freebiesupply.com/logos/large/2x/metamask-logo-png-transparent.png">
                </q-btn>
            </q-item-section>

        </q-item>
        <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>
    <q-card-section class="text-h6" v-if="!transactionStatus">
        <div v-if="currentToken" class="text-h6 q-mb-md q-pl-sm flex items-center">
            <h4 class="lab-title q-pr-md">Available {{currentToken.label}}:</h4> {{ currentToken.amount}}
            <span class="link-to-exchange" @click="goToExchange" v-if="!tokenInWallet && false">Get {{currentToken.label}}</span>
        </div>
        <div class="row">
            <div class="col col-3">
                <!-- <q-input class="input-input" filled rounded outlined color="purple" value="0.1" suffix="MAX" /> -->
                <q-input @input="validateInput() ; error = null ; getGas()" v-model="sendAmount" filled rounded outlined class="input-input" color="purple" type="number">
                    <template v-slot:append>
                        <div class="flex justify-end items-center q-pb-xs">
                            <q-btn color="white" rounded class="mt-5" @click="getMaxBalance()" outlined unelevated flat text-color="black" label="Max" />
                        </div>
                    </template>
                </q-input>
            </div>
            <div class="col col-3 q-ml-md">
                <q-select class="select-input" @input="getMaxBalance() ; error = null" filled rounded outlined color="purple" v-model="currentToken" :options="tokenOptions" />
                <div class="text-body2 col-12 q-pt-sm text-red" v-if="!tokenInWallet && false">
                    Token not in wallet
                </div>
            </div>

        </div>
        <hr style="opacity: .1" class="q-mt-lg">
        <h4 class="lab-title">Choose your Allocation</h4>
        <div class="row">
            <div class="col col-4 q-pr-md">
                <strong class="lab-sub q-pl-md">Platform</strong>
                <q-select class="select-input full-width" filled v-model="platform" color="purple" @input="filterPoolsByPlatform() ; getGas() ; error = null" :options="['Any','Uniswap V2','Balancer-labs','yEarn','Curve']" />
            </div>
            <div class="col col-4 q-pr-md">
                <strong class="lab-sub q-pl-md">Pool</strong>
                <q-select class="select-input full-width" @filter="filterPoolsByUserInput" input-debounce="0" use-input filled @input="$store.commit('investment/setSelectedPool', pool);getGas();error = null " v-model="pool" color="purple" :options="poolOptions">
                    <template v-slot:no-option>
                        <q-item>
                            <q-item-section class="text-grey">
                                No results
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>

            </div>
            <!-- <div class="col col-3 q-pr-md text-center">
                <strong class="lab-sub q-pl-md text-center">Allocation</strong>
                <div class="lab-value flex flex-center text-center q-pl-lg q-pr-sm">90 % RPL 10% WETH</div>
            </div> -->
            <div v-if="pool === 'DAI/ETH'" class="col col-4 q-pl-md">
                <strong class="lab-sub q-pl-lg">Approx. Pool Output</strong>
                <div class="lab-value output column q-pl-lg q-pr-sm">
                    <span class="flex flex-start q-mb-sm"><img src="https://zapper.fi/images/ETH-icon.png" class="q-mr-sm" alt=""> 1.4922 ETH</span>
                    <span class="flex flex-start"><img src="https://zapper.fi/images/DAI-icon.png" class="q-mr-sm" alt=""> 703.0724 DAI</span>
                </div>
            </div>
            <div class="col-md-18 q-pt-md" v-if="gasOptions">
                <h4 class="lab-title">Set gas price</h4>
                <!-- <q-select  class="select-input full-width" filled v-model="gasSelected" color="purple" :options="gasOptions">
                    <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                            <q-item-section>
                                <q-item-label v-html="scope.opt.label" />
                                <q-item-label caption>{{ scope.opt.value }} USD</q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                    <template v-if="gasOptions" v-slot:selected>
                        <q-item>
                            <q-item-section>
                                <q-item-label class="full-width no-margin" v-html="gasSelected.label+' - '+gasSelected.value+' USD'" />
                            </q-item-section>
                        </q-item>
                        <q-item>
                        </q-item>
                    </template>
                </q-select>
                -->
                <q-list class="gasfield" separator>
                    <q-item dense class="gasSelector">
                        <q-item-section v-for="(gas, index) in gasOptions" :key="index">
                            <q-item :class="[gasSelected.label == gas.label ? 'selected bg-black text-white' : '' , gas.label]" @click="gasSelected = gas" clickable separator v-ripple>
                                <q-item-section>
                                    <q-item-label>${{gas.value }}</q-item-label>
                                    <q-item-label class="text-body1 text-grey"> {{gas.label }}</q-item-label>
                                </q-item-section>
                                <q-item-section avatar>
                                    <q-icon color="primary" name="local_gas_station" />
                                </q-item-section>
                            </q-item>
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>

            <div class="text-red q-mt-md" v-if="error">{{error}}</div>

        </div>
        <!-- <hr style="opacity: .1" class="q-mt-lg">
            <h4 class="lab-title q-pb-md">Select Gas Setting</h4>
            <div class="row">
              <div class="col col-4">
                <q-btn color="white" flat class="btn-gas full-width" outlined rounded size="lg" text-color="black" label="Slow (36 Gwei ~ 12.3 Min)" />
              </div>
              <div class="col col-4 q-pl-md q-pr-md">
                <q-btn color="white" flat class="btn-gas full-width" outlined rounded size="lg" text-color="black" label="Slow (36 Gwei ~ 12.3 Min)" />
              </div>
              <div class="col col-4">
                <q-btn color="white" flat class="btn-gas full-width" outlined rounded size="lg" text-color="black" label="Slow (36 Gwei ~ 12.3 Min)" />
              </div>
            </div> -->
    </q-card-section>
    <q-card-section class="text-h6" v-else>
        <div class="row">

            <div class="progress-custom-volentix column flex-center col-md-12 q-pb-md">
                <svg class="svg_logo" fill="#7272FA" width="80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58">
                    <path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path>
                </svg>
                <span class="title">Pending</span>
                <q-linear-progress style="max-width:300px;" stripe rounded size="md" indeterminate class="q-mt-md" />
            </div>
            <div class="col-12 col-md-6 offset-md-3 text-center text-h6" v-if="transactionHash">
                <q-input filled v-model="transactionHash" hint="Readonly" label="Your transaction hash" readonly>
                    <template v-slot:counter>
                        <a :href="'https://etherscan.io/tx/'+transactionHash" class="text-body2 text-black" target="_black">
                            <img width="80" src="https://etherscan.io/images/logo-ether.png?v=0.0.2" />
                            <q-icon name="arrow_right_alt" />
                        </a>

                    </template>
                </q-input>
            </div>

        </div>

    </q-card-section>
    <q-card-actions align="right" class="q-pr-sm q-mb-sm q-mt-xl" v-if="!transactionStatus">
        <q-btn label="Cancel" flat class="qbtn-start q-mr-sm cancel" color="black" v-close-popup />
        <q-btn unelevated class="qbtn-start" :disable="sendAmount == 0" color="black" text-color="white" label="Confirm" @click="doTransaction()" />
    </q-card-actions>
</q-card>
</template>

<script>
import {
  mapState
} from 'vuex'
export default {
  name: 'AddLiquidityDialog',
  data () {
    return {
      gasInterval: null,
      gasOptions: null,
      transactionStatus: null,
      gasSelected: null,
      externalWallets: {
        metamask: []
      },
      pool: '',
      transactionHash: null,
      error: null,
      sendAmount: 0,
      poolOptions: [],
      tokenOptions: [],
      currentExrternalWallet: '',
      connectLoading: {
        metamask: false
      },
      currentToken: '',
      platform: 'Any',
      ethTokens: [],
      ethAccount: null,
      availableAmount: 0,
      tokenInWallet: false,
      processWithMetamask: false,
      web3: null,
      contractAddress: {
        uniswapv2: '0x80c5e6908368cb9db503ba968d7ec5a565bfb389',
        uniswapv1: '0x5e6531d99e9099cb3936c048daf6ba0b3f79b9e2',
        balancerlabs: '0xA3128cC400E2878571368ae0a83F588Eb838552b',
        curve: '0x5A4972b19De19F6117E02aeB54e37E9e6cEe3187',
        yearn: '0x9c57618bfCDfaE4cE8e49226Ca22A7837DE64A2d'

      }
    }
  },
  props: ['notWidget'],
  updated () {},
  destroyed () {
    clearInterval(this.gasInterval)
  },
  async created () {
    let tableData = await this.$store.state.wallets.tokens
    this.ethAccount = tableData.filter(w => w.chain === 'eth')
      .filter(w => this.$store.state.investment.zapperTokens.find(o => o.symbol.toLowerCase() === w.type.toLowerCase()))

    if (this.notWidget === null) {
      await this.$store.dispatch('investment/getZapperTokens')
    } else {
      this.setDialogData()
    }

    const Web3 = require('web3')
    this.web3 = new Web3('https://mainnet.infura.io/v3/0dd5e7c7cbd14603a5c20124a76afe63')
    // let t = this.web3.eth.getTransaction('0x51c32feefe4bcfac06b19364e07b7f261138e1760da96a827d6c0954dcb47059')
    if (this.$store.state.investment.metamaskConnected) this.conectWallet('metamask')

    this.gasInterval = setInterval(() => {
      this.$store.dispatch('investment/getGasPrice')
    }, 2000)
  },
  computed: {
    ...mapState('investment', ['zapperTokens', 'selectedPool', 'gasPrice'])
  },
  watch: {
    zapperTokens (newVal, old) {
      if (!newVal.length) return

      this.$store.dispatch('investment/getBalancerPools')
      this.$store.dispatch('investment/getUniswapPools')
      this.$store.dispatch('investment/getYvaultsPools')
      this.$store.dispatch('investment/getCurvesPools')
      this.$store.commit('investment/setSelectedPool', this.$store.state.investment.pools[0])
      this.setDialogData()
    },
    sendAmount (newVal, old) {
      if (newVal) this.getGas()
    },
    gasPrice (newVal, old) {
      if (newVal) this.getGas()
    }

  },
  methods: {
    yearnTokenTypeToNumber (type) {
      let val = 1
      if (type === 'LP') {
        val = 2
      } else if (type === 'token') {
        val = 0
      }
      return val
    },
    conectWallet (walletType) {
      if (walletType === 'metamask') {
        this.connectLoading.metamask = true
        window.ethereum.enable()
          .then(async (accounts) => {
            this.connectLoading.metamask = false
            await accounts.map(async (o, index) => {
              let item = {}
              await this.web3.eth.getBalance(o, (err, balance) => {
                item.balance = this.web3.utils.fromWei(balance, 'ether')
                item.label = o.substring(0, 10) + '...' + o.substr(o.length - 5)
                item.value = o
                console.log(err)
              })
              if (index === 0) {
                this.currentExrternalWallet = item
                this.currentToken.amount = item.balance
                this.currentToken.symbol = 'ETH'
                this.currentToken.key = item.value
                this.currentToken.metamask = true
                this.sendAmount = this.currentToken.amount
                this.$store.commit('investment/setMetamaskConnectionStatus', true)
              }
              this.externalWallets.metamask.push(item)
            })
          }).catch((e) => {
            this.connectLoading.metamask = false
            console.log(e)
          })
      }
      console.log(this.externalWallets)
    },
    async getContractABI (address) {
      let abi = null
      await this.$axios.post('https://api.etherscan.io/api?apikey=YBABRIF5FBIVNZZK3R8USGI94444WQHHBN&module=contract&action=getabi&address=' + address + '')
        .then((result) => {
          abi = result.data.result
        })

      return abi
    },
    setDialogData () {
      if (this.$store.state.investment.selectedPool) {
        this.tokenOptions = this.ethAccount.map(o => {
          o.label = o.type.toUpperCase()
          o.value = o.contract
          return o
        })
        console.log(this.ethAccount)
        this.currentToken = this.tokenOptions[0]
        this.sendAmount = this.currentToken.amount
        this.getGas()
        this.getTokenAvailableAmount()
        this.poolOptions = this.$store.state.investment.pools.map(o => {
          o.label = o.poolName
          o.value = o.id
          return o
        })
        this.pool = this.$store.state.investment.selectedPool
        this.platform = this.pool.platform
        this.isTokenInWallet()
      }
    },
    async doERC20ToCurveTransaction () {
      /*
                                                                                                                                                                                                      const web3 = new Web3(provider.wallet.provider)
                                                                                                                                                                                                      const address = provider.address
                                                                                                                                                                                                      const curveCurvePipeAddress = '0x66895417881B1d77Ca71bd9e5Ba1E729f3Aa44D3'
                                                                                                                                                                                                      const curveCurvePipeContract = new web3.eth.Contract(curveCurvePipeABI, curveCurvePipeAddress)
                                                                                                                                                                                                      const crvTokenContract = new web3.eth.Contract(ERC20ABI, fromCurveTokenAddress)
                                                                                                                                                                                                      const valueToSend = (5 * 10 ** 18).toFixed(0)
                                                                                                                                                                                                      const tx = await curveCurvePipeContract.methods.Curve2Curve(
                                                                                                                                                                                                        address,
                                                                                                                                                                                                        'a5407eae9ba41422680e2e00537571bcc53efbfd', // sUSD curve pool
                                                                                                                                                                                                        valueToSend,
                                                                                                                                                                                                        'bbc81d23ea2c3ec7e56d39296f0cbb648873a5d3' // y Curve pool
                                                                                                                                                                                                      )
                                                                                                                                                                                                      const allowance = await getAllowance(web3, fromCurveTokenAddress, address, curveCurvePipeAddress)
                                                                                                                                                                                                      if (allowance < value) {
                                                                                                                                                                                                        const approvalAmount = '100000000000000000000'
                                                                                                                                                                                                        let approveTx = await crvTokenContract.methods.approve(
                                                                                                                                                                                                          curveCurvePipeAddress,
                                                                                                                                                                                                          web3.utils.toWei(approvalAmount, 'ether')
                                                                                                                                                                                                        )
                                                                                                                                                                                                        approveTx
                                                                                                                                                                                                          .send({
                                                                                                                                                                                                            from: address,
                                                                                                                                                                                                            gasPrice
                                                                                                                                                                                                          })
                                                                                                                                                                                                          .on('transactionHash', async (txHash) => {
                                                                                                                                                                                                            await sendTransaction(address, 0, tx, gasPrice, 2000000) // Rely on nonce for tx ordering to avoid waiting for approval to confirm
                                                                                                                                                                                                          })
                                                                                                                                                                                                      } else await sendTransaction(address, 0, tx, gasPrice) // Contract already has approval, gas estimates will not fail
                                                                                                                                                                                                      */
    },
    async getTransactionObject (setGas = true) {
      if (!this.pool.platform) return

      let poolContractABI = null,
        fromTokenAddress = '0x0000000000000000000000000000000000000000'
      let toAddress = this.contractAddress[this.pool.platform.replace(/[^0-9a-z]/gi, '').toLowerCase()]
      await this.getContractABI(toAddress).then(value => {
        poolContractABI = value
      })
      // await this.getContractABI(fromTokenAddress).then(value => { tokenABI = value })
      let nonce = await this.web3.eth.getTransactionCount(this.currentToken.key) + 1

      const poolContract = new this.web3.eth.Contract(JSON.parse(poolContractABI), toAddress)
      // const tokenContract = new this.web3.eth.Contract(JSON.parse(tokenABI), fromTokenAddress)
      let transactionObject = {
        from: this.currentToken.key,
        to: toAddress,
        value: this.web3.utils.toHex(this.sendAmount * 1000000000000000000),
        nonce: this.web3.utils.toHex(nonce)
      }
      if (setGas) {
        transactionObject.gas = this.web3.utils.toHex(this.gasSelected.gas)
        transactionObject.gasPrice = this.web3.utils.toHex(this.gasSelected.gasPrice)
      }
      let tx = null
      /*
                                                                                                                                                                                                      let approveTx = await tokenContract.methods.approve(
                                                                                                                                                                                                        toAddress,
                                                                                                                                                                                                        this.web3.utils.toWei(100, 'ether')
                                                                                                                                                                                                      )
                                                                                                                                                                                                      console.log(approtxveTx, 'approveTx')
                                                                                                                                                                                                      */

      if (this.pool.platform === 'Uniswap V2') {
        tx = poolContract.methods.ZapIn(this.currentToken.key, fromTokenAddress, this.pool.tokensData[0].address, this.pool.tokensData[1].address, transactionObject.value, 0)
      } else if (this.pool.platform === 'Balancer-labs') {
        tx = poolContract.methods.ZapIn(fromTokenAddress, this.pool.contractAddress, transactionObject.value, 0)
      } else if (this.pool.platform === 'Curve') {
        tx = poolContract.methods.ZapIn(this.currentToken.key, fromTokenAddress, this.pool.contractAddress, transactionObject.value, 0)
      } else if (this.pool.platform === 'yEarn') {
        console.log(this.yearnTokenTypeToNumber(this.pool.type), this.pool)
        tx = poolContract.methods.ZapIn(this.currentToken.key, this.pool.contractAddress, this.yearnTokenTypeToNumber(this.pool.type), fromTokenAddress, transactionObject.value, 0)
      }

      // const allowance = await getAllowance(web3, fromTokenAddress, toAddress, this.pool.contractAddress)
      transactionObject.data = tx.encodeABI()

      return transactionObject
    },
    async sendTransaction () {
      let transactionObject = await this.getTransactionObject(true)
      this.transactionStatus = 'Pending'
      if (this.currentToken.metamask) {
        /* global web3  */
        const Web3 = require('web3')
        if (window.web3 && window.web3.currentProvider.isMetaMask) {
          let localWeb3 = new Web3(web3.currentProvider)

          let tx = await localWeb3.eth.sendTransaction(transactionObject)
          tx.on('confirmation', (confirmationNumber, receipt) => {
            this.transactionSTatus = 'Confirmed'
          })

          tx.on('transactionHash', hash => {
            this.transactionStatus = 'Pending'
            this.transactionHash = hash
          })

          tx.on('receipt', receipt => {
            this.transactionStatus = 'Success'
          })

          tx.on('error', error => {
            this.error = error
            this.transactionStatus = null
          })
        } else { // Non-dapp browsers...
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
        return
      }
      const EthereumTx = require('ethereumjs-tx').Transaction
      var transaction = new EthereumTx(transactionObject)
      // console.log(await this.web3.eth.getPendingTransactions())
      transaction.sign(Buffer.from(this.currentToken.privateKey.substring(2), 'hex'))
      const serializedTransaction = transaction.serialize()
      console.log(transactionObject, 'sending')
      let tx = this.web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))

      tx.on('confirmation', (confirmationNumber, receipt) => {
        this.transactionSTatus = 'Confirmed'
      })

      tx.on('transactionHash', hash => {
        this.transactionStatus = 'Pending'
        this.transactionHash = hash
      })

      tx.on('receipt', receipt => {
        this.transactionStatus = 'Success'
      })

      tx.on('error', error => {
        this.error = error
        this.transactionStatus = null
      })
      /*
        self.web3.eth.accounts.signTransaction(transactionObject, this.currentToken.privateKey, function (error, signedTx) {
        if (error) {
        console.log(error);
         } else {
       self.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('receipt', function (receipt) {
            console.log(receipt)
      });
      }})

          console.log(encoded_tx)
    */
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async waitTransaction (txHash) {
      let tx = null
      while (tx == null) {
        tx = await this.web3.eth.getTransactionReceipt(txHash)
        await this.sleep(2000)
      }
      console.log('Transaction ' + txHash + ' was mined.')
      return (tx.status)
    },
    async doErc20Transaction (transactionObject) {
      /* let tableData = await this.$store.state.wallets.tokens
      let account = tableData.find(w => w.chain === 'eth' && w.defaultKey == true)
      if (account === null) return console.log('NO ETH ACCOUNT')
      let tokenAddress = this.currentToken.contract
      transactionObject.from = account.key
      console.log(transactionObject, this.currentToken)
      let decimals = this.web3.utils.toBN(18)
      let value = (this.sendAmount * 10 ** 18).toFixed(0)
      let minABI = []
      // this.getGas(transactionObject.to, this.sendAmount )
      // Get ERC20 Token contract instance

       if (window.ethereum) {
        window.web3 = new Web3(ethereum);

        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed

         let contract = new window.web3.eth.Contract(tokenABI, tokenAddress);
          const self = this
          contract.methods.transfer(transactionObject.to, value).send({
          from: transactionObject.from,
          value:value
        })
        .on('transactionHash', function(hash) {
          console.log(hash, transactionObject);

        }).on('error', function(error, a) {

         self.error = error
        })
      /*
        await web3.eth.sendTransaction(transactionObject).then(function(receipt) {
          console.log(receipt)
        }).catch((error) => {
          this.error = error

        });

      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
         let contract = new window.web3.eth.Contract(tokenABI, tokenAddress);
          const self = this
          contract.methods.transfer(transactionObject.to, value).send({
          from: transactionObject.from,
          value:value
        })
        .on('transactionHash', function(hash) {
          console.log(hash, transactionObject);

        }).on('error', function(error, a) {

         self.error = error
        })
        /*
        await web3.eth.sendTransaction(transactionObject).then(function(receipt) {
          console.log(receipt)
        }).catch((error) => {
          this.error = error

        });

      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }

    return

      let contract = new this.web3.eth.Contract(tokenABI, tokenAddress)
      let poolContract = new this.web3.eth.Contract(minABI, transactionObject.to)
      console.log(contract.methods, 'contract.methods')
      const self = this
      contract.methods.transfer(transactionObject.to, value).send({
        from: transactionObject.from,
        value: value
      })
        .on('transactionHash', function (hash) {
          console.log(hash, transactionObject)
        }).on('error', function (error, a) {
          self.error = error
        })
        */
    },
    async getGas () {
      const self = this
      let transactionObject = await this.getTransactionObject(false)

      if (this.sendAmount === 0 || !transactionObject) return
      // console.log(transactionObject)
      this.web3.eth.estimateGas(transactionObject).then(function (gasAmount) {
        self.gasOptions = [{
          label: 'Slow',
          value: self.getUSDGasPrice(self.$store.state.investment.gasPrice.slow, gasAmount).toFixed(2),
          gasPrice: self.$store.state.investment.gasPrice.slow * 1000000000,
          gas: gasAmount
        },
        {
          label: 'Fast',
          value: self.getUSDGasPrice(self.$store.state.investment.gasPrice.fast, gasAmount).toFixed(2),
          gasPrice: self.$store.state.investment.gasPrice.fast * 1000000000,
          gas: gasAmount
        },
        {
          label: 'Instant',
          value: self.getUSDGasPrice(self.$store.state.investment.gasPrice.instant, gasAmount).toFixed(2),
          gasPrice: self.$store.state.investment.gasPrice.instant * 1000000000,
          gas: gasAmount
        }
        ]
        if (!self.gasSelected && self.gasOptions[1]) {
          self.gasSelected = self.gasOptions[1]
        }
      })
        .catch((error) => {
          console.log('estimateGas error', error)
        })
    },
    getUSDGasPrice (gweiPrice, gasNumber) {
      let ethToUsd = this.$store.state.investment.marketData.find(o => o.symbol.toLowerCase() === 'eth').current_price
      return this.web3.utils.fromWei(Math.round((gweiPrice * gasNumber * 1000000000)).toString(), 'ether') * ethToUsd
    },
    async doTransaction () {
      return this.sendTransaction()
      /*
      const EthereumTx = require('ethereumjs-tx').Transaction
      console.log(this.pool)

      let poolData = this.$store.state.investment.pools.find(v => v.contractAddress == this.pool.value)
      console.log(this.pool, poolData)
      let toAddress = this.contractAddress[poolData.platform.replace(/[^0-9a-z]/gi, '').toLowerCase()]
      if (!toAddress) console.log('toAddress not found')
      let nonce = await this.web3.eth.getTransactionCount(this.currentToken.key) + 1

      let transactionObject = {
        from: this.currentToken.key,
        to: toAddress,
        gas: this.gasSelected.gas,
        value: this.sendAmount * 1000000000000000000,
        gasPrice: this.gasSelected.gasPrice,
        nonce: nonce,
        chain: 1

      }
      if (this.currentToken.type.toLowerCase() != 'eth') return this.doErc20Transaction(transactionObject)

      if (this.processWithMetamask) {
        transactionObject.from = null
        if (window.ethereum) {
          window.web3 = new Web3(ethereum)

          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          await web3.eth.sendTransaction(transactionObject).then(function (receipt) {
            console.log(receipt)
          }).catch((error) => {
            this.error = error
          })
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          await web3.eth.sendTransaction(transactionObject).then(function (receipt) {
            console.log(receipt)
          }).catch((error) => {
            this.error = error
          })
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      }
      if (this.currentToken.type.toLowerCase() != 'eth') return this.doErc20Transaction(transactionObject)

      console.log(transactionObject, this.gasSelected)
      const transaction = new EthereumTx(transactionObject)

      transaction.sign(Buffer.from(this.currentToken.privateKey.substring(2), 'hex'))
      const serializedTransaction = transaction.serialize()
      /*
         let p =  new Promise(async (resolve, reject) => {
            this.web3.eth.sendRawTransaction('0x' + serializedTransaction.toString('hex'), (err, id) => {
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

    console.log(p)

      this.web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'), (err, hash) => {
        if (!err) {
          this.transactionSent = hash
          console.log(hash)
        } else {
          this.error = err
        }
      })
       */
    },
    async isTokenInWallet () {
      let tableData = await this.$store.state.wallets.tokens
      this.ethTokens = tableData.filter(w => w.chain === 'eth')
      // this.tokenInWallet =  this.ethTokens.find(w =>  this.tokenOptions.find(o => o.toLowerCase() == w.type.toLowerCase()))
      // this.currentToken = this.tokenInWallet ? this.tokenInWallet.name : this.tokenOptions[0] ;
      // this.sendAmount = this.tokenInWallet ? this.tokenInWallet.amount : 0
    },
    async getCurrentGasPrices () {
      let response = await this.$axios.get('https://ethgasstation.info/json/ethgasAPI.json')
      let prices = {
        low: response.data.safeLow / 10,
        medium: response.data.average / 10,
        high: response.data.fast / 10
      }
      return prices
    },
    getMaxBalance () {
      this.sendAmount = this.currentToken.amount
    },
    validateInput () {
      if (this.sendAmount <= 0) {
        this.sendAmount = 0
      } else {
        this.sendAmount = this.tokenInWallet && this.sendAmount > this.tokenInWallet.amount ? this.tokenInWallet.amount : this.sendAmount
      }
    },
    filterPoolsByUserInput (val, update) {
      if (val === '') {
        update(() => {
          self.poolOptions = this.$store.state.investment.pools.map(o => {
            o.label = o.poolName
            o.value = o.id
            return o
          })
        })
        return
      }
      this.pool = ''
      update(() => {
        const needle = val.toLowerCase()
        this.poolOptions = this.$store.state.investment.pools.filter(v => v.poolName.toLowerCase().indexOf(needle) > -1).map(o => {
          o.label = o.poolName
          o.value = o.id
          return o
        })
      })
    },
    filterPoolsByPlatform () {
      this.poolOptions = this.$store.state.investment.pools.filter(o => this.platform === 'Any' || o.platform.toLowerCase() === this.platform.toLowerCase()).map(o => {
        o.label = o.poolName
        o.value = o.id
        return o
      })
      this.pool = this.poolOptions[0]
      //  this.tokenOptions = this.pool.tokens ;
      this.isTokenInWallet()
    },
    getTokenAvailableAmount () {
      let found = this.ethTokens.find(o => o.type.toLowerCase() === this.currentToken.toLowerCase())
      this.availableAmount = found ? found.amount : 0
    },
    goToExchange () {
      // console.log('this.depositCoin', this.depositCoin)
      let depositCoin = {
        image: 'https://files.coinswitch.co/public/coins/btc.png',
        label: 'Bitcoin',
        value: 'btc'
      }
      let destinationCoin = {
        image: 'https://files.coinswitch.co/public/coins/eth.png',
        label: 'Ethereum',
        value: 'eth'
      }
      this.$router.push({
        path: '/verto/exchange/:coinToSend/:coinToReceive',
        name: 'exchange-v3',
        params: {
          depositCoin: depositCoin,
          destinationCoin: destinationCoin
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.etherscan a {
    color: black;
    text-decoration: none;
}

.gasSelector .q-item {
    border: 1px solid #f1e7e7
}

.Slow i {
    color: #a0afae !important;
}

.Fast i {
    color: #00d0ca !important;
}

.Instant i {
    color: #7272fa !important;
}

@import "~@/assets/styles/variables.scss";

.link-to-exchange {
    text-decoration: underline;
    color: blue;
    padding-left: 15px;
    font-size: 14px;
    cursor: pointer;
    font-weight: $bold;
}

.modal-dialog-wrapper {
    .qbtn-start {
        border-radius: 30px;
        height: 44px;
        background: #00D0CA !important;
        width: 120px;
        margin-left: 0px;
        padding: 5px 10px;

        &.cancel {
            background: #CCC !important;
            width: 100px;
        }

        /deep/ .q-btn__wrapper {
            min-height: unset;
            padding: 0px 10px;

            .q-btn__content {
                text-transform: initial;
                font-size: 14px;
            }
        }
    }

    .lab-title {
        font-weight: $bold;
        font-size: 18px;
        font-family: $Titillium;
        color: #7272FA;
        margin: 0px;
    }

    /deep/ .btn-gas {
        border: 2px solid #CCC;

        &.active {
            border-color: #00D0CA;
        }

        .q-btn__content {
            @extend .lab-title;
            font-size: 14px;
            text-transform: initial;
        }
    }

    .lab-sub {
        font-size: 14px;
    }

    .lab-value {
        @extend .lab-title;
        font-size: 16px;
        color: #627797;
        line-height: 24px;

        &.output {
            font-size: 12px;
        }

        img {
            max-width: 25px;
        }
    }

    .input-input {
        height: 50px;

        /deep/ .q-field__control {
            height: 50px;
            min-height: unset;
            border-radius: 50px;
        }

        .btn-copy {
            height: 30px;
            position: relative;
            top: -3px;
            margin-right: 0px;
            padding: 6px 13px;
        }

        .qr-btn {
            width: 30px;
            height: 30px;
            padding-right: 8px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            img {
                width: 25px;
                height: 25px;
                position: relative;
                right: -5px;
                transform: scale3d(1, 1, 1);
            }
        }
    }

    .select-input {
        // border-radius: 100px !important;
        $height: 50px;
        height: $height;

        /deep/ .q-field__marginal {
            height: $height;
            min-height: unset;
        }

        /deep/ .q-field__control {
            // border-radius: 50px;
            height: $height;
            min-height: unset;

            .q-field__native {
                padding-left: 0px;
                padding-top: 0px;
                padding-bottom: 0px;
                height: $height;
                min-height: unset;

                .q-item {
                    padding: 0px;
                    padding-left: 18px;
                    min-height: $height;
                    padding-bottom: 0px;

                    .q-item__section {
                        padding-right: 0px;
                        min-width: 36px;

                        .q-item__label+.q-item__label {
                            margin-top: 0px;
                        }
                    }
                }
            }
        }
    }
}

.select-input {
    border-radius: 100px !important;
    $height: 35px;
    width: 140px;
    height: $height;

    /deep/ .q-field__marginal {
        height: $height;
        min-height: unset;
    }

    /deep/ .q-field__control {
        height: $height;
        min-height: unset;
        border-radius: 50px;

        .option--avatar__custom {
            font-size: 19px;
            max-width: 20px;
            max-height: 20px;
            border: none;
            margin-left: 0px;
        }

        .q-field__native {
            padding-left: 0px;
            padding-top: 0px;
            padding-bottom: 0px;
            height: $height;
            min-height: unset;

            .q-field__input {
                max-width: 50px !important;
                min-width: unset !important;
                position: absolute;
                left: 60px;
                font-size: 10px;
            }

            .q-item__label {

                font-weight: 600;
                margin-bottom: -2px;
                margin-left: -10px;
            }

            .q-item {
                padding: 0px;
                padding-left: 0px;
                min-height: $height;
                padding-bottom: 0px;

                .q-item__section {
                    padding-right: 0px;
                    min-width: 36px;

                    .q-item__label+.q-item__label {
                        margin-top: 0px;
                    }
                }
            }
        }
    }
}
</style>

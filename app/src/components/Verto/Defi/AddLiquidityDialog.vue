<template>
<q-card :dark="$store.state.settings.lightMode === 'true'" class="q-pa-lg modal-dialog-wrapper" style="width: 800px; max-width: 90vw;" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <q-toolbar class="my-toolbar">
        <q-toolbar-title><span class="text-weight-bold q-pl-sm">Add Liquidity</span></q-toolbar-title>
        <q-select :dark="$store.state.settings.lightMode === 'true'" v-if="ethWallets.length" borderless v-model="currentEthWallet" :options="ethWallets" label="Account" />
        <q-item  v-if="screenSize > 1024" dense class="metamask-btn">
            <q-item-section class="text-body1 q-pr-sm">
                <q-btn v-if="!transactionStatus" :loading="connectLoading.metamask" :class="ethWallets.find(o => o.origin == 'metamask') ? 'bg-green-1' : 'bg-red-1'" @click="conectWallet('metamask')" flat icon="fiber_manual_record" :color="!ethWallets.find(o => o.origin == 'metamask') ? 'red' : 'green'" :label="!ethWallets.find(o => o.origin == 'metamask') ? 'Connect' : 'Connected'">
                    <img style="width: 35px;" class="q-pl-sm" src="https://cdn.freebiesupply.com/logos/large/2x/metamask-logo-png-transparent.png">
                </q-btn>
            </q-item-section>
        </q-item>
        <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>
    <q-card-section class="text-h6" v-if="!transactionStatus && currentToken">
        <div class="text-h6 q-mb-md q-pl-sm flex items-center">
            <h4 class="lab-title q-pr-md">Available {{currentToken.symbol}}:</h4> {{ currentToken.amount}}
            <span class="link-to-exchange" @click="goToExchange" v-if="!tokenInWallet && false">Get {{currentToken.label}}</span>
        </div>
        <div class="row">
            <div class="col col-12 col-md-3">
                <!-- <q-input class="input-input" filled rounded outlined color="purple" value="0.1" suffix="MAX" /> -->
                <q-input :dark="$store.state.settings.lightMode === 'true'" :rules="[ val => !currentToken.isERC20 || currentToken.isERC20 && val % 1 == 0 || 'Whole numbers only']" @input="validateInput() ; error = null ;" v-model="sendAmount" filled rounded outlined class="input-input" color="purple" type="number">
                    <template v-slot:append>
                        <div class="flex justify-end items-center q-pb-xs">
                            <q-btn :dark="$store.state.settings.lightMode === 'true'" color="white" rounded class="mt-5" @click="getMaxBalance()" outlined unelevated flat :text-color="$store.state.settings.lightMode === 'true' ? 'white' : 'black'" label="Max" />
                        </div>
                    </template>
                </q-input>
            </div>
            <div class="col col-12 col-md-3 q-ml-md rm-q-ml-md">
                <q-select :dark="$store.state.settings.lightMode === 'true'" v-if="currentToken" class="select-input" @input="getMaxBalance() ; approvalRequired = false; getGas();  error = null; " filled rounded outlined color="purple" v-model="currentToken" :options="tokenOptions">
                    <template v-slot:prepend>
                        <q-avatar>
                            <img :src="'https://zapper.fi/images/'+currentToken.label+'-icon.png'">
                        </q-avatar>
                    </template>
                    <template v-slot:option="scope">
                      <q-item class="custom-menu"  v-bind="scope.itemProps" v-on="scope.itemEvents">
                        <q-item-section avatar>
                          <q-icon :name="`img:${scope.opt.icon}`" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label v-html="scope.opt.label.toUpperCase()" />

                          <q-item-label v-if="scope.opt.amount" caption>{{ parseFloat(scope.opt.amount).toFixed(8) }}</q-item-label>

                        </q-item-section>
                      </q-item>
                    </template>
                </q-select>
                 <div class="text-body2 col-12 q-pt-sm text-red" v-if="!tokenInWallet && false">
                   Insufficient funds
                </div>
                <div class="text-body2 col-12 q-pt-sm text-red" v-if="!tokenInWallet && false">
                    Token not in wallet
                </div>
            </div>
            <div class="text-body2 text-red" v-if="approvalRequired">
                <span>
                    Before adding Liquidity to the {{pool.label}} pool from {{platform.label}},<br> you need to process an approval transaction for your {{currentToken.label}} token
                </span>
            </div>
        </div>
        <hr style="opacity: .1">
        <h4 class="lab-title">Choose your Allocation</h4>
        <div class="row">
            <div class="col-12 col-md-8 row">
                <div class="col col-12 col-md-6 q-pr-md">
                    <strong class="lab-sub q-pl-md">Platform</strong>
                    <q-select :dark="$store.state.settings.lightMode === 'true'" class="select-input full-width" filled v-model="platform" color="purple" @input="approvalRequired = false; filterPoolsByPlatform() ; getGas() ; error = null" :options="platformOptions">
                        <template v-slot:prepend>
                            <q-avatar>
                                <img :src="'https://zapper.fi/images/'+platform.icon">
                            </q-avatar>
                        </template>
                    </q-select>
                </div>
                <div class="col col-12 col-md-6 q-pr-md">
                    <strong class="lab-sub q-pl-md">Pool</strong>
                    <q-select :dark="$store.state.settings.lightMode === 'true'" class="select-input full-width" @filter="filterPoolsByUserInput" input-debounce="0" use-input filled @input="$store.commit('investment/setSelectedPool', pool);getGas();error = null " v-model="pool" color="purple" :options="poolOptions">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    No results
                                </q-item-section>
                            </q-item>
                        </template>
                          <template v-slot:option="scope">
                        <q-item class="custom-menu"  v-bind="scope.itemProps" v-on="scope.itemEvents">
                        <q-item-section class="pools" v-if="scope.opt.icons.length" avatar>
                          <q-icon :key="index" v-for="(icon, index) in scope.opt.icons" :name="`img:https://zapper.fi/images/`+icon" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label v-html="scope.opt.poolName.toUpperCase()" />
                       </q-item-section>
                      </q-item>
                        </template>
                    </q-select>

                </div>
            </div>
            <!-- <div class="col col-3 q-pr-md text-center">
                <strong class="lab-sub q-pl-md text-center">Allocation</strong>
                <div class="lab-value flex flex-center text-center q-pl-lg q-pr-sm">90 % RPL 10% WETH</div>
            </div> -->
            <div class="col col-12 col-md-4 q-pl-md" v-if="!isNaN(getPoolOutput(0))">
                <strong class="lab-sub lab-sub2 q-pl-lg">Approx. Pool Output</strong>
                <div class="lab-value output column q-pl-lg q-pr-sm" v-if="pool.tokensData &&  pool.tokensData.length">
                    <span class="flex flex-start q-mb-sm" v-for="(icon, index) in pool.tokensData" :key="index"><img :src="'https://zapper.fi/images/'+pool.icons[index]" class="q-mr-sm" alt=""> {{getPoolOutput(index)}} {{pool.tokensData[index].symbol}}</span>
                </div>
            </div>
            <div class="col-12 col-md-12 col-md-18 q-pt-md" v-if="gasOptions">
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
                                    <q-item-label :class="[gasSelected.label == gas.label ? 'text-black' : 'text-body1 text-black']">${{gas.value }}</q-item-label>
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

            <div class="text-red q-mt-md col-12 col" v-if="error">{{error}}</div>
            <div v-if="transactionHash" class="col-12">
                <a :href="'https://etherscan.io/tx/'+transactionHash" class="flex text-body2 text-black q-mt-md" target="_blank">
                    <div>Last transaction:</div> <img width="80" src="https://etherscan.io/images/logo-ether.png?v=0.0.2" class="q-ml-sm" />
                </a>
            </div>
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
                <span class="title">Transaction submitted</span>
                <span class="title">Status: {{transactionStatus}}</span>
                <q-linear-progress v-if="transactionStatus == 'Pending'" style="max-width:300px;" stripe rounded size="md" indeterminate class="q-mt-md" />
            </div>
            <div class="col-12 col-md-6 offset-md-3 text-center text-h6" v-if="transactionHash">
                <q-input bottom-slots filled v-model="transactionHash" label="Your transaction hash" readonly>
                    <template v-slot:counter>
                        <a :href="'https://etherscan.io/tx/'+transactionHash" class="text-body2 text-black " target="_blank">
                            <img width="80" src="https://etherscan.io/images/logo-ether.png?v=0.0.2" />
                        </a>
                    </template>
                    <template v-slot:hint>
                        <div class="cursor-pointer" @click="transactionStatus = null ; ">
                            <q-icon name="keyboard_backspace" /> Go Back
                        </div>
                    </template>
                </q-input>
            </div>

        </div>

    </q-card-section>
    <q-card-actions align="right" class="q-pr-sm" v-if="!transactionStatus">
        <q-btn label="Cancel" flat class="qbtn-start q-mr-sm cancel" color="black" v-close-popup />
        <q-btn unelevated class="qbtn-start" :disable="sendAmount == 0 || invalidTransaction" color="black" text-color="white" :label="approvalRequired ? 'Approve '+currentToken.label : 'Confirm'" @click="doTransaction()" />
    </q-card-actions>
</q-card>
</template>

<script>
import {
  mapState
} from 'vuex'
import contract from '../../../mixins/EthContract'
export default {
  name: 'AddLiquidityDialog',
  data () {
    return {
      transactionStatus: false,
      screenSize: 0,
      invalidTransaction: false,
      gasSelected: null,
      gasOptions: null,
      ethWallets: [],
      pool: '',
      approvalRequired: false,
      transactionHash: null,
      error: null,
      sendAmount: 0,
      poolOptions: [],
      tokenOptions: [],
      currentEthWallet: null,
      connectLoading: {
        metamask: false
      },
      platformOptions: [{
        label: 'Uniswap V2',
        value: 'Uniswap V2',
        icon: 'UNI-icon.svg'

      }, {
        label: 'Balancer',
        value: 'Balancer-labs',
        icon: 'BAL-icon.svg'
      }, {
        label: 'yEarn',
        value: 'yEarn',
        icon: 'YFI-icon.svg'
      }, {
        label: 'Curve',
        value: 'Curve',
        icon: 'Curve-icon.svg'
      }],
      currentToken: '',
      platform: 'Any',
      ethTokens: [],
      ethAccount: null,
      availableAmount: 0,
      tokenInWallet: false,
      processWithMetamask: false,
      web3Instance: null,
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
    this.getWindowWidth()
    this.$store.dispatch('investment/getGasPrice')
    let tableData = await this.$store.state.wallets.tokens
    this.ethTokens = tableData.filter(w => w.chain === 'eth')

    this.ethWallets = tableData.filter(w => w.chain === 'eth' && w.type === 'eth').map(o => {
      o.value = o.key
      o.label = o.key.substring(0, 10) + '...' + o.key.substr(o.key.length - 5)
      o.origin = 'verto'
      return o
    })

    if (this.ethWallets.length) {
      this.currentEthWallet = this.ethWallets[0]
    }
    if (this.notWidget !== null) {
      this.setDialogData()
    }

    this.approvalRequired = false
    const Web3 = require('web3')
    this.platformOptions = this.platformOptions.filter(w => this.$store.state.investment.pools.find(o => o.platform.toLowerCase() === w.value.toLowerCase()))
    this.web3Instance = new Web3('https://mainnet.infura.io/v3/0dd5e7c7cbd14603a5c20124a76afe63')
    // let t = this.web3Instance.eth.getTransaction('0x51c32feefe4bcfac06b19364e07b7f261138e1760da96a827d6c0954dcb47059')
    if (this.$store.state.investment.metamaskConnected) this.conectWallet('metamask')

    this.gasInterval = setInterval(() => {
      this.$store.dispatch('investment/getGasPrice')
    }, 10000)
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
      this.getGas()
    }

  },
  methods: {
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    },
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
              await this.web3Instance.eth.getBalance(o, (err, balance) => {
                item.balance = this.web3Instance.utils.fromWei(balance, 'ether')
                item.label = o.substring(0, 10) + '...' + o.substr(o.length - 5)
                item.value = o
                console.log(err)
              })
              if (index === 0) {
                this.currentEthWallet = item
                this.currentToken.amount = item.balance
                this.currentToken.symbol = 'ETH'
                this.currentToken.key = item.value
                this.currentToken.metamask = true
                this.sendAmount = this.currentToken.amount
                this.$store.commit('investment/setMetamaskConnectionStatus', true)
              }
              this.ethWallets.push({
                label: item.value.substring(0, 10) + '...' + item.value.substr(item.value.length - 5),
                value: item.value,
                privateKey: false,
                origin: 'metamask'
              })
            })
          }).catch((e) => {
            this.connectLoading.metamask = false
            console.log(e)
          })
      }
    },

    setDialogData () {
      if (!this.$store.state.investment.selectedPool) {
        this.$store.commit('investment/setSelectedPool', this.$store.state.investment.pools[0])
      }
      // let tokens = this.$store.state.investment.zapperTokens

      this.tokenOptions = this.ethTokens.map(o => {
        o.label = o.type.toUpperCase()
        o.value = o.contract ? o.contract : o.key
        o.key = this.currentEthWallet.key
        // o.data = o.label === 'ETH' ? tokens.find(t => t.address.toLowerCase() === '0x0000000000000000000000000000000000000000') : tokens.find(t => t.address.toLowerCase() === o.value.toLowerCase())
        o.isERC20 = !!o.contract
        return o
      })

      this.currentToken = this.tokenOptions[0]

      this.sendAmount = this.currentToken.isERC20 ? 1 : 0.001 // this.currentToken.amount / 100
      this.getTokenAvailableAmount()
      this.pool = this.$store.state.investment.selectedPool
      this.platform = this.platformOptions.find(o => o.value.toLowerCase() === this.pool.platform.toLowerCase())
      this.poolOptions = this.poolOptions = this.$store.state.investment.pools.filter(o => o.platform.toLowerCase() === this.platform.value.toLowerCase()).map(o => {
        o.label = o.poolName
        o.value = o.id
        return o
      })

      this.isTokenInWallet()
      this.getGas()
    },

    async getTransactionObject (setGas = true, send = false) {
      if (!this.pool.platform) return

      let poolContractABI = null,
        tokenABI = null,
        fromTokenAddress = this.currentToken.contract ? this.currentToken.contract : '0x0000000000000000000000000000000000000000'
      let toAddress = this.contractAddress[this.pool.platform.replace(/[^0-9a-z]/gi, '').toLowerCase()]
      poolContractABI = await this.getContractABI(toAddress)

      let nonce = await this.web3Instance.eth.getTransactionCount(this.currentToken.key, 'latest')
      const poolContract = new this.web3Instance.eth.Contract(JSON.parse(poolContractABI), toAddress)

      let transactionObject = {
        from: this.currentToken.key,
        to: toAddress,
        value: this.web3Instance.utils.toHex(this.currentToken.isERC20 ? 0 : this.sendAmount * 10 ** 18),
        nonce: nonce
      }
      if (setGas) {
        transactionObject.gas = this.web3Instance.utils.toHex(this.gasSelected.gas)
        transactionObject.gasPrice = this.web3Instance.utils.toHex(this.gasSelected.gasPrice)
      }
      let tx = null

      if (this.currentToken.isERC20) {
        tokenABI = await this.getContractABI('default', true)
        const tokenContract = new this.web3Instance.eth.Contract(tokenABI, fromTokenAddress)

        const allowance = parseInt(await tokenContract.methods.allowance(this.currentToken.key, toAddress).call())

        if (allowance === 0 || allowance < this.sendAmount) {
          this.approvalRequired = true
          tx = tokenContract.methods.approve(
            toAddress,
            this.web3Instance.utils.toHex(this.sendAmount * 10 ** 18 * 100)
          )
          transactionObject.to = fromTokenAddress
        } else {
          this.approvalRequired = false
        }
      }

      let amount = this.currentToken.isERC20 ? this.web3Instance.utils.toHex(this.sendAmount * 10 ** 18) : transactionObject.value

      if (this.approvalRequired === false) {
        if (this.pool.platform === 'Uniswap V2') {
          tx = await poolContract.methods.ZapIn(this.currentToken.key, fromTokenAddress, this.pool.tokensData[0].address, this.pool.tokensData[1].address, amount, 0)
        } else if (this.pool.platform === 'Balancer-labs') {
          tx = await poolContract.methods.ZapIn(fromTokenAddress, this.pool.contractAddress, amount, 0)
        } else if (this.pool.platform === 'Curve') {
          tx = await poolContract.methods.ZapIn(this.currentToken.key, fromTokenAddress, this.pool.contractAddress, amount, 0)
        } else if (this.pool.platform === 'yEarn') {
          console.log(this.yearnTokenTypeToNumber(this.pool.type), this.pool)
          tx = await poolContract.methods.ZapIn(this.currentToken.key, this.pool.contractAddress, this.yearnTokenTypeToNumber(this.pool.type), fromTokenAddress, amount, 0)
        }
      }
      transactionObject.data = tx.encodeABI()

      return transactionObject
    },
    getPoolOutput (index) {
      return (this.sendAmount * (this.currentToken.tokenPrice / this.pool.tokensData[index].price) / 2).toFixed(4)
    },
    async sendTransaction () {
      let transactionObject = await this.getTransactionObject(true, true)

      // /*
      this.transactionStatus = 'Pending'
      if (this.currentEthWallet.origin === 'metamask') {
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
      let account = this.currentEthWallet

      if (account) {
        transaction.sign(Buffer.from(account.privateKey.substring(0, 2) === '0x' ? account.privateKey.substring(2) : account.privateKey, 'hex'))
        const serializedTransaction = transaction.serialize()
        console.log(transactionObject, 'sending')

        let tx = this.web3Instance.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))

        tx.on('confirmation', (confirmationNumber, receipt) => {
          if (confirmationNumber > 2) {
            this.transactionStatus = 'Successfull'
          }
        })

        tx.on('transactionHash', hash => {
          this.transactionStatus = 'Pending'
          this.transactionHash = hash
          var receipt = this.web3Instance.eth.getTransactionReceipt(hash)
            .then(console.log)

          console.log(receipt)
        })

        tx.on('error', error => {
          this.error = error
          this.transactionStatus = null
        })
      }
      // */
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async waitTransaction (txHash) {
      let tx = null
      while (tx == null) {
        tx = await this.web3Instance.eth.getTransactionReceipt(txHash)
        await this.sleep(2000)
      }
      console.log('Transaction ' + txHash + ' was mined.')
      return (tx.status)
    },
    async doErc20Transaction (transactionObject) {

    },
    async getGas () {
      const self = this

      let transactionObject = await this.getTransactionObject(false)

      if (this.sendAmount === 0 || !transactionObject) return

      this.web3Instance.eth.estimateGas(transactionObject).then(function (gasAmount) {
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
        self.invalidTransaction = false
      })
        .catch((error) => {
          console.log('estimateGas error', error)
          self.invalidTransaction = true
        })
    },
    getUSDGasPrice (gweiPrice, gasNumber) {
      let ethToUsd = this.$store.state.investment.marketData.find(o => o.symbol.toLowerCase() === 'eth').current_price
      return this.web3Instance.utils.fromWei(Math.round((gweiPrice * gasNumber * 1000000000)).toString(), 'ether') * ethToUsd
    },
    async doTransaction () {
      return this.sendTransaction()
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
      this.sendAmount = this.currentToken.isERC20 ? 1 : this.sendAmount
    },
    validateInput () {
      if (this.sendAmount <= 0) {
        this.sendAmount = 0
      } else {
        this.sendAmount = this.currentToken && this.sendAmount > this.currentToken.amount ? this.currentToken.amount : this.sendAmount
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
      this.poolOptions = this.$store.state.investment.pools.filter(o => o.platform.toLowerCase() === this.platform.value.toLowerCase()).map(o => {
        o.label = o.poolName
        o.value = o.id
        return o
      })
      console.log(this.platform.value, this.poolOptions)
      if (this.poolOptions.length) {
        this.pool = this.poolOptions[0]
      } else {
        this.error = 'There is no ' + this.platform.value + ' pools available'
      }
      //  this.tokenOptions = this.pool.tokens ;
      this.isTokenInWallet()
    },
    getTokenAvailableAmount () {
      let found = this.ethTokens.find(o => o.type.toLowerCase() === this.currentToken.type.toLowerCase())
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
  },
  mixins: [contract]
}
</script>

<style lang="scss" scoped>
a {
    text-decoration: none;
}
.pools img {
  -webkit-filter: drop-shadow(5px 5px 1px #7272fa);
  filter: drop-shadow(1px 1px 4px #7272fa);
}
.pools img:nth-child(2) {
    margin-left:-9px;
}
.custom-menu {
    border-bottom:1px solid #e4e4e4
}
.pools {
        display: table;
}
.q-field__messages.col {
    margin-top: 5px;
}

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

.gasfield .selected {
    background: #dfdff1 !important;
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
    &.dark-theme{
      background: #04111F;
      border: 1px solid #627797;
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

.modal-dialog-wrapper .input-input {
    height: auto;
}

.gasfield {
    /deep/ .q-item.gasSelector {
        padding-left: 0px;
        padding-right: 0px;

        .q-item__section {
            .q-item--clickable {
                border-radius: 40px;
                margin-right: 20px;
                padding: 15px 30px;
            }
        }
    }
}
.q-card__section{
  @media screen and (max-width: 768px) {
    padding: 0px;
  }
}
.rm-q-ml-md{
  @media screen and (max-width: 768px) {
    margin-left: 0px;
  }
}
.lab-sub2{
  @media screen and (max-width: 768px) {
    padding-left: 0px;
  }
}
.modal-dialog-wrapper .lab-value.output{
  @media screen and (max-width: 768px) {
    padding-left: 0px;
  }
}
.my-toolbar{
  @media screen and (max-width: 768px) {
    margin-bottom: 60px;
    padding-left: 0px;
    padding-right: 0px;
    /deep/ .metamask-btn{
      position: absolute;
      left: -10px;
      transform: translate(0px, 50px);
    }
  }
}
</style>

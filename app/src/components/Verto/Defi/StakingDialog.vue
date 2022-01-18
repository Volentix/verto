<template>
<q-card :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" class="q-pa-lg modal-dialog-wrapper" style="width: 800px; max-width: 90vw;">
    <q-toolbar>
        <q-toolbar-title><span class="text-weight-bold q-pl-sm">Stake</span></q-toolbar-title>
        <q-select :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-model="currentExrternalWallet" label="Account" />
        <q-item dense v-if="false">
            <q-item-section class="text-body1 q-pr-sm">
                <q-btn v-if="!transactionStatus" :loading="connectLoading.metamask" :class="externalWallets.metamask.length ? 'bg-green-1' : 'bg-red-1'" @click="conectWallet('metamask')" flat icon="fiber_manual_record" :color="!externalWallets.metamask.length ? 'red' : 'green'" :label="!externalWallets.metamask.length ? 'Connect' : 'Connected'">
                    <img style="width: 35px;" class="q-pl-sm" src="https://cdn.freebiesupply.com/logos/large/2x/metamask-logo-png-transparent.png">
                </q-btn>
            </q-item-section>
        </q-item>
        <q-btn :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" flat round dense icon="close" v-close-popup />
    </q-toolbar>
    <q-card-section class="text-h6" v-if="!transactionStatus">

        <div class="row">
            <div class="col-12 text-h6 q-mb-md q-pl-sm flex items-center">
                <h4 class="lab-title q-pr-md">Staking: <span class="text-grey">{{stakeData.balance.toFixed(8)}} {{stakeData.label}} </span></h4>
                <span class="link-to-exchange" @click="goToExchange" v-if="!tokenInWallet && false">Get {{currentToken.label}}</span>
            </div>
            <div class="col col-6">
                <!-- <q-input class="input-input" filled rounded outlined color="purple" value="0.1" suffix="MAX" /> -->
                <q-input readonly :rules="[ val => !currentToken.isERC20 || currentToken.isERC20 && val % 1 == 0 || 'Whole numbers only']" @input="validateInput() ; error = null ;" v-model="sendAmount" filled rounded outlined class="input-input" color="purple" type="number">
                    <template v-slot:prepend>
                        <div class="flex justify-end items-center q-pb-xs">
                            <img style="max-width:50px;" :src="'https://zapper.fi/images/'+stakeData.lpRewards.rewardToken+'-icon.png'" alt="">
                        </div>
                    </template>

                </q-input>
            </div>

            <div class="text-body2 text-red" v-if="approvalRequired">
                <span>
                    You need to process an approval transaction before proceeding to your current action
                </span>
            </div>
        </div>
        <hr style="opacity: .1">

        <div class="row">

            <div class="col-md-18 q-pt-md" v-if="gasOptions">
                <h4 class="lab-title">Set gas price</h4>

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

            <div class="text-red q-mt-md" v-if="error">{{error}}</div>
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
    <q-card-actions align="right" class="q-pr-sm q-mb-sm q-mt-xl" v-if="!transactionStatus">
        <q-btn label="Cancel" flat class="qbtn-start q-mr-sm cancel" color="black" v-close-popup />
        <q-btn unelevated class="qbtn-start" :disable="sendAmount == 0 || invalidTransaction" color="black" text-color="white" :label="approvalRequired ? 'Approve ' : 'Confirm'" @click="doTransaction()" />
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
      invalidTransaction: false,
      gasSelected: null,
      gasOptions: null,
      externalWallets: {
        metamask: []
      },
      pool: '',
      approvalRequired: false,
      transactionHash: null,
      error: null,
      sendAmount: 0,
      poolOptions: [],
      tokenOptions: [],
      currentExrternalWallet: null,
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
    this.$store.dispatch('investment/getGasPrice')
    let tableData = await this.$store.state.wallets.tokens
    this.ethAccount = tableData.filter(w => w.chain === 'eth' && w.type === 'eth')
    this.currentExrternalWallet = this.ethAccount[0].key
    this.setDialogData()

    this.approvalRequired = false
    const Web3 = require('web3')

    this.web3 = new Web3('https://mainnet.infura.io/v3/0dd5e7c7cbd14603a5c20124a76afe63')
    // let t = this.web3.eth.getTransaction('0x51c32feefe4bcfac06b19364e07b7f261138e1760da96a827d6c0954dcb47059')
    if (this.$store.state.investment.metamaskConnected) this.conectWallet('metamask')

    this.gasInterval = setInterval(() => {
      this.$store.dispatch('investment/getGasPrice')
    }, 10000)
  },
  computed: {
    ...mapState('investment', ['zapperTokens', 'selectedPool', 'gasPrice', 'stakeData'])
  },
  methods: {
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
    },

    async setDialogData () {
      if (this.stakeData) {
        let tokens = this.$store.state.investment.zapperTokens
        let account = this.ethAccount.find(o => o.chain === 'eth' && o.type === 'eth')
        this.tokenOptions = this.ethAccount.map(o => {
          o.label = o.type.toUpperCase()
          o.value = o.contract ? o.contract : o.key
          o.key = account.key
          o.data = o.label === 'ETH' ? tokens.find(t => t.address.toLowerCase() === '0x0000000000000000000000000000000000000000') : tokens.find(t => t.address.toLowerCase() === o.value.toLowerCase())
          o.isERC20 = !!o.contract
          return o
        })
        this.sendAmount = this.$store.state.investment.stakeData.balance
        this.currentToken = this.tokenOptions[0]
        let approvalRequired = await this.isApprovalRequired(this.stakeData.contractAddress, this.stakeData.lpRewards.rewardAddress, this.sendAmount)

        if (!approvalRequired) {
          this.getTransactionObject()
        }
      }
    },
    async getTransactionObject (setGas = false, send = false) {
      let toAddress = this.stakeData.lpRewards.rewardAddress

      let nonce = await this.web3.eth.getTransactionCount(this.currentToken.key, 'latest') + 1
      const poolContract = new this.web3.eth.Contract(this.stakeData.lpRewards.abi, toAddress)

      let transactionObject = {
        from: this.currentToken.key,
        to: toAddress,
        value: 0,
        nonce: nonce
      }

      let tx = null

      let amount = this.web3.utils.toHex(this.sendAmount * 10 ** 18)

      tx = await poolContract.methods.stake(amount)
      console.log(this.sendAmount, 'this.sendAmount')
      transactionObject.data = tx.encodeABI()
      if (setGas) {
        transactionObject.gas = this.web3.utils.toHex(this.gasSelected.gas)
        transactionObject.gasPrice = this.web3.utils.toHex(this.gasSelected.gasPrice)
      } else {
        this.getGasOptions(transactionObject)
      }
      console.log(transactionObject)
      return transactionObject
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

    },
    getUSDGasPrice (gweiPrice, gasNumber) {
      let ethToUsd = this.$store.state.investment.marketData.find(o => o.symbol.toLowerCase() === 'eth').current_price
      return this.web3.utils.fromWei(Math.round((gweiPrice * gasNumber * 1000000000)).toString(), 'ether') * ethToUsd
    },
    async doTransaction () {
      if (this.approvalRequired) {
        this.sendSignedTransaction(await this.isApprovalRequired(this.stakeData.contractAddress, this.stakeData.lpRewards.rewardAddress, this.sendAmount, true))
      } else {
        this.sendSignedTransaction(await this.getTransactionObject(true))
      }
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
      this.poolOptions = this.$store.state.investment.pools.filter(o => o.platform.toLowerCase() === this.platform.value.toLowerCase()).map(o => {
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
  },
  mixins: [contract]
}
</script>

<style lang="scss" scoped>
.gasfield .selected {
    background: #dfdff1 !important;
}

a {
    text-decoration: none;
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

.modal-dialog-wrapper .input-input {
    height: auto;
}
</style>

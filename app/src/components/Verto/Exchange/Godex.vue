<template>
<div class="" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <!-- $q.screen.width > 1024 && -->
    <div class="row">
        <div class="col col-md-12">
            <div class="apps-section q-mb-sm">

                <!-- 1inch component -->
                <!-- add your code here -->

                <!-- Vdex component -->
                <div class="">
                    <!-- <div class="standard-content"></div> -->
                    <div class="chain-tools-wrapper--list open" :class="{'minimode': miniMode}">
                        <div class="list-wrapper">
                            <div class="row">
                                <div class="col col-12">
                                    <div class="trade-component">

                                        <!-- <img src="statics/theme1/Screenshot_208.png" alt="" style="opacity: .1"> -->
                                        <div v-if="step === 1" class="prototype">
                                            <div class="head" v-if="!miniMode">Token swap</div>
                                            <div class="you-pay">
                                                <div class="you-pay-head row items-center">
                                                    <div class="col col-4" v-if="!miniMode">You Pay</div>
                                                    <div :class="{'flex-end col-8': !miniMode, 'flex-center col-12 q-pt-md': miniMode}" class="col red text-right float-right text-body1" ><AccountSelector :autoSelectChain="chain" :chains="['eth','matic', 'bsc']"   :showAllWallets="true" class="float-right"  /></div>
                                                    <!-- <div class="col col-6 red text-right text-red">Max 0 USDT</div> -->
                                                </div>
                                                <div class="you-pay-body row items-center">
                                                    <div class="col col-3 choose-coin">
                                                     <div class="col col-4 text-body2" v-if="miniMode" >You Pay</div>
                                                        <span class="cursor">
                                                            <q-select class="select-input" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" separator use-input borderless rounded v-model="depositCoin" @input="swapData.error = false; getSwapQuote()" @filter="filterDepositCoin" :disabled="!depositCoinOptions" :loading="!depositCoinOptions" :options="depositCoinOptions">
                                                                <template v-slot:option="scope">
                                                                    <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                        <q-item-section avatar>
                                                                            <q-icon :name="`img:${scope.opt.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section>
                                                                            <q-item-label   v-html="scope.opt.label.toUpperCase()" />
                                                                            <q-item-label  v-if="scope.opt.amount" caption>{{ formatNumber(scope.opt.amount, 7) }}</q-item-label>
                                                                        </q-item-section>
                                                                    </q-item>
                                                                </template>
                                                                <template v-slot:selected>
                                                                    <span class="text-h5">{{depositCoin.value.toUpperCase()}}</span>
                                                                    <q-item-label   caption>{{ formatNumber(depositCoin.amount, 5) }}</q-item-label>

                                                                </template>
                                                            </q-select>
                                                        </span>
                                                    </div>
                                                    <div class="col col-8 offset-1">
                                                         <q-input rounded :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" outlined class="text-h5" ref="depositQuantity" @input="swapData.fromAmount = isNaN(swapData.fromAmount) ? 0 : swapData.fromAmount ; swapData.error = false; getSwapQuote()" v-model="swapData.fromAmount" :disabled="spinnervisible" :loading="spinnervisible" :rules="[ val => val <= depositCoin.amount || 'Insufficient funds']">
                                                            <div class="flex justify-end items-center" style="width: 60px">
                                                                <q-icon v-if="depositCoin" class="option--avatar" :name="`img:${depositCoin.image}`" />
                                                            </div>
                                                        </q-input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="you-receive">
                                                <br>
                                                <q-btn outline round :color="$store.state.settings.lightMode === 'true' ? 'white':'black'" icon="swap_vert" @click="switchAmounts()" class="swap_vert" />
                                                <div class="you-receive-head row items-center">
                                                    <div class="col col-6">You Receive</div>
                                                    <div v-if="rateData" class="col col-6 info_rate_holder small text-right flex justify-end items-center" :class="{'_loading': fetchingRate}">
                                                        <!-- 1 ETH = 374.705 USDT -->
                                                        <span>{{ '1 ' + fromCoinType.toUpperCase() + '&nbsp;= &nbsp;' + rateData.rate.toFixed(5) + ' ' + destinationCoinType.toUpperCase() }}</span>
                                                        <div class="info_rate">
                                                            <span class="i-btn">i
                                                                <!-- <img src="statics/theme1/rate-info.png" class="rate-info-prototype" alt=""> -->
                                                                <div class="info_rate_wrapper text-left">
                                                                    <div class="title">We got you the best price</div>
                                                                    <hr>
                                                                    <div class="lineheight flex justify-between items-center">
                                                                        <span>Max Deposit</span>
                                                                        <span>{{rateData.limitMaxDepositCoin}} {{fromCoinType.toUpperCase()}}</span>
                                                                    </div>
                                                                    <div class="lineheight flex justify-between items-center">
                                                                        <span>Max Destination</span>
                                                                        <span>{{rateData.limitMaxDestinationCoin}} {{destinationCoinType.toUpperCase()}}</span>
                                                                    </div>
                                                                    <div class="lineheight flex justify-between items-center">
                                                                        <span>Min Deposit</span>
                                                                        <span>{{rateData.limitMinDepositCoin}} {{fromCoinType.toUpperCase()}}</span>
                                                                    </div>
                                                                    <div class="lineheight flex justify-between items-center">
                                                                        <span>Min Destination</span>
                                                                        <span>{{rateData.limitMinDestinationCoin}} {{destinationCoinType.toUpperCase()}}</span>
                                                                    </div>
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="you-receive-body row items-center">
                                                    <div class="col col-3 choose-coin"><span class="cursor">
                                                            <q-select v-if="destinationCoinOptions" class="select-input" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" separator use-input rounded borderless @input="swapData.error = false; getSwapQuote()" @filter="filterDestinationCoin" v-model="destinationCoin" :disabled="!destinationCoinOptions" :loading="false" :options="destinationCoinOptions.filter(o => o.value != depositCoin.value)">
                                                                <template v-slot:option="scope">
                                                                    <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                                                        <q-item-section avatar>
                                                                            <q-icon :name="`img:${scope.opt.image}`" />
                                                                        </q-item-section>
                                                                        <q-item-section>
                                                                            <q-item-label v-html="scope.opt.label" />
                                                                            <q-item-label caption>{{ scope.opt.value }}</q-item-label>
                                                                        </q-item-section>
                                                                    </q-item>
                                                                </template>
                                                                <template v-slot:selected>
                                                                    <span class="text-h5">{{destinationCoin.value}}</span>
                                                                </template>
                                                            </q-select>
                                                        </span></div>
                                                    <div class="col col-8 offset-1">
                                                        <q-input rounded :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" disable outlined class="text-h5" ref="destinationQuantity" :loading="spinnervisible" v-model="swapData.toAmount" >
                                                            <div class="flex justify-end items-center" style="width: 60px">
                                                                <q-icon v-if="destinationCoin" class="option--avatar" :name="`img:${destinationCoin.image}`" />
                                                            </div>
                                                            <template v-slot:hint>
                                                                ~ USD {{swapData.toAmount * destinationCoin.price }}
                                                            </template>
                                                        </q-input>
                                                    </div>
                                                </div>
                                                <div class="text-red text-body1 q-mt-sm q-pl-md" v-if="error">

                                                    <span v-if="error == 'gas'">
                                                        {{swapData.errorText.replace('[from]',depositCoin.value).replace('[to]',destinationCoin.value)}}
                                                    </span>
                                                    <span v-else>
                                                        {{error}}
                                                    </span>
                                                </div>

                                                <div class="text-body2 text-red q-pa-md" v-if="approvalRequired  == true && !error">
                                                    <span>
                                                        Before swaping {{depositCoin.value}} with {{destinationCoin.value}}, you need to process an approval transaction
                                                    </span>
                                                </div>
                                                <q-list class="gasfield q-mt-md" v-if="gasOptions.length" separator>
                                                    <span class="text-body1 q-pl-md q-mb-md">Select gas price option </span>
                                                    <q-item dense class="gasSelector q-pt-sm">
                                                          <q-item-section v-for="(gas, index) in gasOptions" :key="index">
                                                            <q-item :class="[gasSelected.label == gas.label  ? 'selected bg-black text-white' : '' , gas.label]" @click="gasSelected = gas" clickable separator v-ripple>
                                                                <q-item-section>
                                                                    <q-item-label :class="[gasSelected.label == gas.label ? 'text-black' : 'text-body1 text-black']">{{gas.isUsd ? '$'+formatNumber(gas.value,4) : gas.nativeToken.toUpperCase()+ ' '+gas.value  }}</q-item-label>
                                                                    <q-item-label class="text-body1 text-grey text-capitalize"> {{gas.label }}</q-item-label>
                                                                </q-item-section>
                                                                <q-item-section v-if="!miniMode" avatar>
                                                                    <q-icon color="primary" name="local_gas_station" />
                                                                </q-item-section>
                                                            </q-item>
                                                        </q-item-section>
                                                    </q-item>
                                                </q-list>
                                                <q-btn
                                                v-if="approvalRequired"
                                                unelevated @click="processERC20Approval()"
                                                :loading="spinnervisible"
                                                :disable=" spinnervisible || gasOptions.length == 0"
                                                outline
                                                rounded
                                                color="purple"
                                                label="Approve token"
                                                class="text-capitalize chose_accounts full-width" />

                                                <q-btn
                                                v-else
                                                unelevated
                                                @click="doSwap()"
                                                :loading="spinnervisible"
                                                :disable="error && error.lenght || gasOptions.length == 0 || spinnervisible || depositCoin.amount < swapData.fromAmount "
                                                outline
                                                rounded
                                                color="purple"
                                                label="Swap now" class="text-capitalize chose_accounts full-width" />
                                            </div>
                                        </div>

                                        <div v-if="step === 2 || transactionHash" class="prototype">
                                            <div class="head">
                                                <q-btn v-if="step != 1" flat @click=" step = 1 ; getSwapQuote();" unelevated icon="keyboard_arrow_left" rounded color="grey" label="Back"  class="--next-btn q-mr-md" />
                                               <span v-if="!miniMode">Order status : {{transactionStatus}}</span>
                                            </div>
                                            <div class="standard-content--body">
                                                <div class="standard-content--body__form q-pa-xl">
                                                    <div class="progress-custom-volentix column flex-center">
                                                        <svg class="svg_logo" fill="#7272FA" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58">
                                                            <path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path>
                                                        </svg>
                                                        <span class="title">{{transactionStatus}}</span>
                                                    </div>
                                                    <div style="max-width:300px; margin: 0 auto" >
                                                        <q-linear-progress v-if="transactionStatus != 'Success' && transactionStatus != 'Failed'" :class="{ 'text-white': $store.state.settings.lightMode === 'true'}" :value="progress" indeterminate class="q-mt-lg" />
                                                        <p class="text-center q-pt-md" v-if="!approvalRequired">Swaping {{swapData.fromAmount}} {{depositCoin.value.toUpperCase()}} to {{destinationCoin.value}}</p>
                                                        <p class="text-center q-pt-md" v-else>Approval transaction</p>
                                                        <p class="text-center q-pt-md" v-if="approvalRequired && transactionStatus == 'Success'">Approval succeeded. <q-btn flat @click="step = 1 ; getSwapQuote()" label="Click here" /> to go back and select gas fee for the swap</p>
                                                        <div class="text-h4 --subtitle">{{''}}</div>
                                                        <q-input  :dark="$store.state.settings.lightMode === 'true'"  v-if="transactionHash" bottom-slots v-model="transactionHash" readonly rounded outlined type="text">
                                                            <template v-slot:append>
                                                                <div class="flex justify-end">
                                                                    <q-btn flat unelevated text-color="grey" @click="copyToClipboard(transactionHash , 'Transaction  hash')" round class="btn-copy" icon="file_copy" />
                                                                </div>
                                                            </template>
                                                            <template v-slot:hint>
                                                                <div  :class="{ 'text-white': $store.state.settings.lightMode === 'true'}"  class="cursor-pointer" @click="getSwapQuote() ; step = 1">
                                                                    <q-icon name="keyboard_backspace" /> Go Back
                                                                </div>
                                                            </template>
                                                            <template v-slot:counter>
                                                                <a  :href="evmData.explorer+transactionHash" class="text-body2 text-black text-body2" target="_blank">
                                                                   Details
                                                                </a>
                                                            </template>
                                                        </q-input>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- <div class="col col-6">
                      <img src="statics/theme1/Screenshot_208.png" alt="">
                    </div> -->
                            </div>

                            <!-- <br><br><br> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
// import store from '@/store'
// import { userError } from '@/util/errorHandler'
const baseUrl = 'https://api.1inch.exchange'
import Lib from '@/util/walletlib'
// const url = 'https://api.coinswitch.co'
// let headers = {
//   'x-api-key': process.env[store.state.settings.network].COINSWITCH_APIKEY
// }
import CrosschainDex from '@/util/CrosschainDex'
const typeUpper = function (thing) {
  if (typeof thing === 'string' && thing.length >= 1) {
    return thing.toUpperCase()
  } else {
    return ''
  }
}
import DexInteraction from '../../../mixins/DexInteraction'
import AccountSelector from './AccountSelector.vue'
const baseUrlApprovalAddress = '0xe4c9194962532feb467dce8b3d42419641c6ed2e'
import contract from '../../../mixins/EthContract'
const Web3 = require('web3')
let web3
import initWallet from '@/util/_Wallets2Tokens'
export default {
  name: 'Oneinch',
  components: { AccountSelector },
  props: ['disableDestinationCoin', 'crossChain', 'miniMode', 'chain', 'tokenType'],
  data () {
    return {
      tableData: null,
      evmData: {},
      fromCoinType: '',
      gasOptions: [],
      invalidTransaction: false,
      gasSelected: null,
      gasInterval: null,
      payCoin: 'BTC',
      fromCoinMemo: '',
      disclaimerCheck: '',
      destinationCoinMemo: '',
      fromCoin: {},
      destinationCoin: {
        value: 'dai'
      },

      progress: 0.02,
      approvalRequired: false,
      error: false,
      swapData: {
        marketData: [],
        fromAmount: 0,
        toAmount: 0,
        errorText: 'Converting [from] to [to] cannot be done at this moment please try another coin',
        error: false,
        customPriceSlipage: null,
        termsAccepted: false,
        gasPrice: null,
        gas: null,
        ethToUsd: null,
        limitMinDepositCoin: 0,
        limitMaxDepositCoin: 2,
        limitMinDestinationCoin: 1,
        limitMaxDestinationCoin: 2,
        showDisclaimerWrapper: false,
        gasUsd: null
      },
      step: 1,
      web3: null,
      ethTokens: [],
      optionsSanitize: false,
      spinnervisible: false,
      lastChangedValue: 'deposit',
      coins: [],
      transactionObject: null,
      depositCoin: {
        value: 'eth'
      },
      depositQuantity: 0,
      depositCoinOptions: [],
      depositCoinUnfilter: null,
      toCoin: null,
      destinationQuantity: 0,
      destinationCoinOptions: [],
      destinationCoinUnfilter: null,
      rateData: null,
      rateDataTemplate: {
        rate: 1,
        minerFee: 0,
        limitMinDepositCoin: 0,
        limitMaxDepositCoin: 1,
        limitMinDestinationCoin: 1,
        limitMaxDestinationCoin: 2
      },
      destinationAddress: {
        address: '',
        tag: null
      },
      refundAddress: {
        address: '',
        tag: null
      },
      exchangeAddress: {
        address: '',
        tag: null
      },
      expectedDepositCoinAmount: 0,
      expectedDestinationCoinAmount: 0,
      orderId: null,
      status: null,
      requestStop: false,
      exchangesList: [],
      columns: [{
        name: 'exchange',
        required: true,
        label: 'Exchange',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true,
        headerClasses: 'text-h6'
      },
      {
        name: 'rate',
        align: 'left',
        label: 'Rate',
        field: 'rate',
        sortable: true
      },
      {
        name: 'txgas',
        label: 'Tx Gas',
        field: 'txgas',
        sortable: true
      },
      {
        name: 'diff',
        label: 'Diff',
        field: 'difference'
      }
      ],
      data: [{
        name: '1inch',
        rate: '47.4328584311 AAPL/aDAI',
        txgas: '≈ $17.54',
        difference: 'MATCH'
      }]
    }
  },
  computed: {
    getStatus () {
      let value = 0
      switch (this.status) {
        case null:
        case 'no_deposit':
        case 'failed':
        case 'refunded':
        case 'timeout':
          value = 0
          break
        case 'confirming':
          value = 25
          break
        case 'exchanging':
          value = 50
          break
        case 'sending':
          value = 75
          break
        case 'complete':
          value = 100
          break
      }
      return value
    },
    friendlyStatus () {
      let value = ''
      switch (this.status) {
        case null:
          value = ''
          break
        case 'no_deposit':
          value = 'No deposit detected yet'
          break
        case 'failed':
          value = 'The transaction has failed'
          break
        case 'refunded':
          value = 'The transaction has been refunded'
          break
        case 'timeout':
          value = 'The transaction has timed out'
          break
        case 'confirming':
          value = 'The transaction is confirming'
          break
        case 'exchanging':
          value = 'The transaction is exchanging'
          break
        case 'sending':
          value = 'The coins are being sent'
          break
        case 'complete':
          value = 'The transaction is complete'
          break
      }
      return value
    },
    trackColor () {
      let value = ''
      switch (this.status) {
        case null:
        case 'no_deposit':
        case 'confirming':
        case 'exchanging':
        case 'sending':
        case 'complete':
          value = 'white'
          break
        case 'failed':
        case 'refunded':
        case 'timeout':
          value = 'red'
          break
      }
      return value
    },
    logoUrl () {
      if (this.destinationCoin != null) {
        return '' // this.coins.filter(coins => coins.symbol === this.destinationCoin.value)[0].logoUrl
      } else {
        return '/static/icon.png'
      }
    },
    exchangeLabel () {
      if (this.depositCoin != null) {
        return 'Complete this exchange by sending ' + this.expectedDepositCoinAmount + ' ' + typeUpper(this.depositCoin.value) + ' to this address within the next 12 hours'
      } else {
        return 'Complete this exchange by sending the coins to this address within the next 12 hours'
      }
    },
    depositQuantityLabel () {
      if (this.depositCoin != null) {
        return typeUpper(this.depositCoin.value) + ' to Send'
      } else {
        return 'Coin to Send'
      }
    },
    destinationQuantityLabel () {
      if (this.destinationCoin != null) {
        return typeUpper(this.destinationCoin.value) + ' to Receive'
      } else {
        return 'Coin to Receive'
      }
    },
    returnAddressLabel () {
      if (this.depositCoin != null) {
        return 'Your ' + typeUpper(this.depositCoin.value) + ' return address [in case the transaction does not complete]'
      } else {
        return 'Your return address [in case the transaction does not complete]'
      }
    },
    destinationAddressLabel () {
      if (this.destinationCoin != null) {
        return 'Address to receive new ' + typeUpper(this.destinationCoin.value)
      } else {
        return 'Address to receive new coin'
      }
    }
  },
  async created () {
    this.$store.commit('settings/setDex', {
      dex: 'oneinch'
    })

    let tokens = this.get1inchCoinsByChain('eth')

    if (this.$store.state.settings.dexData.depositCoin && this.crossChain) {
      this.depositCoin = tokens.find(o => o.value.toLowerCase() === this.$store.state.settings.dexData.depositCoin.value.toLowerCase())
    }

    if (this.$store.state.settings.dexData.destinationCoin && this.crossChain) {
      this.destinationCoin = tokens.find(o => o.value.toLowerCase() === this.$store.state.settings.dexData.destinationCoin.value.toLowerCase())
    }

    if (this.$store.state.settings.dexData.depositCoin && this.$store.state.settings.dexData.fromAmount) {
      this.depositQuantity = this.$store.state.settings.dexData.fromAmount
      this.swapData.fromAmount = this.$store.state.settings.dexData.fromAmount
    }
  },
  async mounted () {
    this.$store.dispatch('investment/getGasPrice')
    this.getMarketDataVsUSD()
    this.getCoins()
    setTimeout(() => {
      this.checkBalance()
    }, 300)
  },
  watch: {
    step (newVal, oldVal) {
      // Remove selected coin from array of receiving coins
      if (newVal === 2) {
        this.destinationCoinOptions = this.destinationCoinUnfilter.filter(o => o.value.toLowerCase() !== this.depositCoin.value.toLowerCase())
      }
    },
    'swapData.toAmount': function (newVal, oldVal) {
      if (newVal != null && this.step === 2) {
        // this.$refs.stepper.next()
      }
    },
    '$store.state.investment.accountTokens': function (val) {
      this.getCoins()
    }
  },
  methods: {
    getChainData () {
      this.evmData = Lib.evms.find(o => o.chain === this.$store.state.investment.defaultAccount.chain)
      if (this.evmData) {
        web3 = new Web3(this.evmData.provider)
        this.web3 = web3
      }
    },
    switchAmounts () {
      /* let depositCoinVar = this.depositCoin
      this.depositCoin = this.destinationCoin
      this.destinationCoin = depositCoinVar
      let fromCoinTypeVar = this.fromCoinType
      this.fromCoinType = this.toCoinType
      this.toCoinType = fromCoinTypeVar
      */
      let depositQuantityVar = this.swapData.fromAmount
      this.swapData.fromAmount = this.swapData.toAmount
      this.swapData.toAmount = depositQuantityVar
      this.getSwapQuote()
    },
    getCoins () {
      let defaultToken = {
        bsc: ['bnb', 'dai'],
        eth: ['eth', 'dai'],
        matic: ['matic', 'quick']
      }
      if (!this.$store.state.investment.defaultAccount || !this.$store.state.investment.defaultAccount.chain) return
      let val = this.$store.state.investment.accountTokens
      let chain = this.$store.state.investment.defaultAccount.chain
      chain = chain || 'eth'
      this.getChainData()
      CrosschainDex.getCoinList('godex').then(res => {
        let coins = res.coins
        this.gasOptions = []
        // coins = this.getUniqueTokens(coins)

        if (coins.length) {
          this.destinationCoin = coins[0]
          this.destinationCoinUnfilter = coins
          this.destinationCoinOptions = coins
        }
        this.depositCoinOptions = coins.filter(t => val.find(o => o.type.toLowerCase() === t.value.toLowerCase()))
        this.depositCoinOptions.map(o => {
          o.amount = val.find(t => t.type.toLowerCase() === o.value.toLowerCase()).amount

          if (this.crossChain) { o.address = coins.find(t => t.value.toLowerCase() === o.value.toLowerCase()).address }

          return o
        })

        this.depositCoinUnfilter = this.depositCoinOptions

        this.getSwapQuote()

        if (this.depositCoinOptions.length) {
          let token = this.depositCoinOptions.find(o => !this.tokenType || this.tokenType === o.value.toLowerCase())
          let defaultFrom = this.depositCoinOptions.find((o, i) => defaultToken[chain].includes(o.value.toLowerCase()))

          this.depositCoin = this.tokenType && token ? token : (defaultFrom || this.depositCoinOptions[0])

          let defaultTo = coins.find((o, i) => defaultToken[chain].includes(o.value.toLowerCase()) && o.value.toLowerCase() !== this.depositCoin.value.toLowerCase())
          let tokenToBuy = coins.find(o => !token && this.tokenType === o.value.toLowerCase())
          this.destinationCoin = tokenToBuy && this.tokenType ? tokenToBuy : (defaultTo || coins.find(o => o.value.toLowerCase() !== this.depositCoin.value.toLowerCase()))
          console.log(defaultTo, 'defaultTo', tokenToBuy, 'tokenToBuy', defaultFrom, 'defaultFrom', this.destinationCoin)
          this.getSwapQuote()
          this.checkBalance()
        }
        /*
      if (!this.depositCoin || !this.depositCoinOptions.find(v => v.value.toLowerCase() === this.depositCoin.value.toLowerCase())) {
        let item = this.depositCoinOptions.find(v => v.value.toLowerCase() === this.$store.state.investment.defaultAccount.chain)
        if (item) {
          this.depositCoin = item
          this.getSwapQuote()
        } else {
          this.depositCoin = this.depositCoinOptions[0]
          this.checkPair()
        }
      } else if (this.depositCoin && this.depositCoin.value) {
        let item = this.depositCoinOptions.find(v => v.value.toLowerCase() === this.depositCoin.value.toLowerCase())
        if (item) {
          this.depositCoin = item
        } else {
          this.depositCoin = this.depositCoinOptions[0]
          this.checkPair()
        }
      }
      */
        setTimeout(() => {
          this.checkBalance()
        }, 300)

      /* let chain = this.$store.state.investment.defaultAccount.chain
      chain = chain || 'eth'
      this.getChainData()
      let coins = this.get1inchCoinsByChain(chain)

      //  this.depositCoinOptions = coins
      if (coins.length) {
        this.destinationCoin = coins[coins.length - 1]
      }

      this.depositCoinUnfilter = this.depositCoinOptions
      this.destinationCoinUnfilter = coins
      if (setDeposit) { this.depositCoin = !this.depositCoin ? coins[0] : this.depositCoinUnfilter.find(o => o.value.toLowerCase() === this.depositCoin.value.toLowerCase()) }
      if (this.depositCoin) {
        this.getSwapQuote()
      } */
      })
    },
    getExchanges () {
      const self = this
      this.$axios.get(baseUrl + '/v1.1/exchanges').then(function (result) {
        self.exchangesList = result.data.map(function (exchange) {
          let row = {
            'label': exchange.name,
            'value': true
          }
          return row
        }).filter(function (el) {
          return el != null
        }).sort(function (a, b) {
          if (a.label.toLowerCase() < b.label.toLowerCase()) {
            return -1
          }
          return 1
        })
      })
    },
    getSwapQuote () {
      const self = this
      this.error = false
      let trial = false
      self.gasOptions = []
      self.error = null
      self.transactionObject = null
      // this.getCoinsData()

      if (!self.depositCoin || !self.destinationCoin || !self.depositCoin.address || !self.destinationCoin.address) return
      if (self.swapData.fromAmount <= 0) return
      self.spinnervisible = true

      let data = {
        fromTokenAddress: self.depositCoin.address,
        toTokenAddress: self.destinationCoin.address,
        amount: web3.utils.toWei(self.swapData.fromAmount.toString(), 'ether'),
        slippage: 2,
        fromAddress: self.$store.state.investment.defaultAccount.key,
        disableEstimate: true,
        referrerAddress: '0x91B9dAda77e2eb76d6F36B96F448c1F9A066BE74',
        fee: this.$store.state.settings.globalSettings ? this.$store.state.settings.globalSettings.fee1inch : 0.75
      }
      let swapRequestUrl = baseUrl + '/v3.0/' + this.evmData.network_id + '/swap?' + new URLSearchParams(data).toString()
      this.$axios.get(swapRequestUrl)
        .then(async function (result) {
          if (!result.data && !trial) {
            trial = true
            return this.getSwapQuote()
          }
          let nonce = await web3.eth.getTransactionCount(self.$store.state.investment.defaultAccount.key, 'latest').catch(o => console.log(o))
          self.swapData.toAmount = parseFloat(web3.utils.fromWei(result.data.toTokenAmount.toString(), 'ether'))
          self.spinnervisible = false
          self.swapData.gas = result.data.tx.gas
          self.swapData.gasPrice = result.data.tx.gasPrice
          self.approvalRequired = false
          self.approvalRequired = false
          let isERC2O = self.depositCoin.value.toLowerCase() !== self.evmData.nativeToken

          if (isERC2O) {
            self.transactionObject = await self.isApprovalRequired(self.depositCoin.address, baseUrlApprovalAddress, self.swapData.fromAmount, false, nonce, self.$store.state.investment.defaultAccount, false)
          }

          // if (!approvalRequired) return

          let value = isERC2O ? 0 : self.swapData.fromAmount
          if (!self.transactionObject) {
            self.transactionObject = {
              from: self.$store.state.investment.defaultAccount.key,
              to: result.data.tx.to,
              value: web3.utils.toWei(value.toString(), 'ether'),
              data: result.data.tx.data,
              nonce: nonce
            }
          }
          let nativeTokenData = self.$store.state.wallets.tokens.find(a => a.type === self.evmData.nativeToken && a.chain === self.evmData.chain)
          Lib.gas(self.evmData.chain, self.transactionObject, self.depositCoin.value.toLowerCase(), nativeTokenData?.tokenPrice).then(res => {
            self.gasOptions = res
            self.gasSelected = res[0]
          })

          // Calculate total gas price and convert it to USD
          //   self.swapData.gasUsd = self.convertETHToUSD(web3.utils.fromWei((result.data.estimatedGas * self.$store.state.investment.gasPrice.fast * 1000000000).toString()))
        }).catch(error => {
          console.log(error, 'error')
          if (error.toString().includes('Cannot read property')) {
            error = 'Exchange service currently unavailable for this pair'
          }

          self.approvalRequired = false
          self.spinnervisible = false
          self.swapData.toAmount = null
          self.error = error
        })
    },
    async processERC20Approval () {
      if (this.depositCoin.value.toLowerCase() !== this.evmData.nativeToken) {
        this.step = 2
        const self = this
        let data = {
          gasData: this.gasSelected,
          txData: this.transactionObject.data
        }

        let account = self.$store.state.wallets.tokens.find(a => a.chain === self.evmData.chain && a.isEvm && ((a.key.toLowerCase() === self.$store.state.investment.defaultAccount.key.toLowerCase())))

        Lib.send(
          self.evmData.chain,
          self.destinationCoin.value.toLowerCase(),
          self.transactionObject.from,
          self.transactionObject.to,
          self.transactionObject.value,
          data,
          account.privateKey,
          ''
        ).then(async (result) => {
          console.log(result, 'result')
          if (result.success) {
            self.transactionHash = result.transaction_id
            self.transactionStatus = 'Submitted'
            let status = await Lib.checkEvmTxStatus(self.transactionHash, self.evmData.chain)
            if (status) {
              self.transactionStatus = 'Success'
            } else {
              self.transactionStatus = 'Failed'
            }
            initWallet(account.name)
          } else {
            self.error = result.message
            self.step = 1
          }
        }).catch((error) => {
          console.log(error, 'error')
          self.step = 1
          self.error = error
        })
      }
    },
    triggerPayCoinSelect () {
      // console.log('triggerPayCoinSelect triggered')
      document.querySelector('.pay-coin-select .q-field__control').dispatchEvent(new Event('click'))
      setTimeout(() => {
        let payCoinSelectPopup = document.querySelector('.pay-coin-select-popup')
        let paycoinSearch = document.querySelector('.paycoin-search').cloneNode(true)
        // console.log('paycoinSearch', paycoinSearch)
        payCoinSelectPopup.prepend(paycoinSearch)
        payCoinSelectPopup.querySelector('.paycoin-search').classList.remove('hidden')
      }, 100)
      // paycoin-search
      // pay-coin-select-popup
    },
    copyToClipboard (key, copied) {
      this.$clipboardWrite(key)
      this.$q.notify({
        message: copied ? copied + ' Copied' : 'Key Copied',
        timeout: 2000,
        icon: 'check',
        textColor: 'white',
        type: 'warning',
        position: 'top'
      })
    },
    triggerDestinationCoin () {
      // console.log('triggerReceiveCoinSelect triggered')
      document.querySelector('.receive-coin-select .q-field__control').dispatchEvent(new Event('click'))
      setTimeout(() => {
        let receiveCoinSelectPopup = document.querySelector('.receive-coin-select-popup')
        let receivecoinSearch = document.querySelector('.receivecoin-search').cloneNode(true)
        // console.log('receivecoinSearch', receivecoinSearch)
        receiveCoinSelectPopup.prepend(receivecoinSearch)
        receiveCoinSelectPopup.querySelector('.receivecoin-search').classList.remove('hidden')
      }, 100)
      // paycoin-search
      // pay-coin-select-popup
    },
    doSwap () {
      const self = this
      this.step = 2
      this.spinnervisible = true
      this.transactionStatus = 'Pending'
      let data = {
        fromTokenAddress: self.depositCoin.address,
        toTokenAddress: self.destinationCoin.address,
        amount: web3.utils.toWei(this.swapData.fromAmount.toString(), 'ether'),
        slippage: 1,
        fromAddress: self.$store.state.investment.defaultAccount.key,
        disableEstimate: true,
        referrerAddress: '0x91B9dAda77e2eb76d6F36B96F448c1F9A066BE74',
        fee: this.$store.state.settings.globalSettings ? this.$store.state.settings.globalSettings.fee1inch : 0.75
      }

      let swapRequestUrl = baseUrl + '/v3.0/' + this.evmData.network_id + '/swap?' + new URLSearchParams(data).toString()

      // JSON.stringify for easy copy paste
      this.$axios.get(swapRequestUrl)
        .then(async function (result) {
          self.spinnervisible = false
          let nonce = await self.web3.eth.getTransactionCount(self.$store.state.investment.defaultAccount.key, 'latest')
          let transactionObject = {
            from: self.$store.state.investment.defaultAccount.key,
            to: result.data.tx.to,
            value: parseInt(result.data.tx.value),
            gas: web3.utils.toHex(self.gasSelected.gas),
            gasPrice: web3.utils.toHex(self.gasSelected.gasPrice),
            data: result.data.tx.data,
            nonce: nonce
          }

          let data = {
            gasData: self.gasSelected,
            txData: transactionObject.data
          }
          console.log(data, 'data 3')
          let account = self.$store.state.wallets.tokens.find(a => a.chain === self.evmData.chain && a.isEvm && ((a.key.toLowerCase() === self.$store.state.investment.defaultAccount.key.toLowerCase())))

          Lib.send(
            self.evmData.chain,
            self.destinationCoin.value.toLowerCase(),
            transactionObject.from,
            transactionObject.to,
            transactionObject.value,
            data,
            account.privateKey,
            ''
          ).then(async (result) => {
            if (result.success) {
              self.transactionHash = result.transaction_id
              self.transactionStatus = 'Submitted'
              let status = await Lib.checkEvmTxStatus(self.transactionHash, self.evmData.chain)
              if (status) {
                self.transactionStatus = 'Success'
              } else {
                self.transactionStatus = 'Failed'
              }
              // initWallet(account.name)
            } else {
              self.error = result.message
              self.step = 1
            }
          }).catch((error) => {
            self.step = 1
            self.error = error
          })
        }).catch(error => {
          self.step = 1
          self.spinnervisible = false
          self.error = error
        })
    },
    convertETHToUSD (ethAmount) {
      const self = this
      let ethToUsd = self.swapData.marketData.find(o => o.symbol.toLowerCase() === 'eth').current_price
      return ethToUsd ? `~ USD ${ethToUsd * ethAmount}` : null
    },
    async sendTransaction (rawTransaction) {
      let receipt = await web3.eth.sendSignedTransaction(rawTransaction, (error, txHash) => {
        if (error) {
          return console.error(error, 'sendSignedTransaction error', receipt)
        }
      })
    },
    getMarketDataVsUSD () {
      const self = this
      let coingeckoEndpoint =  process.env[this.$store.state.settings.network].CACHE +'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd'
      this.$axios.get(coingeckoEndpoint)
        .then(function (result) {
          if (result.data.length) {
            self.swapData.marketData = result.data
          }
        }).catch(error => {
          console.log(error, 'Cannot get market data')
        })
    },
    convertWeiToUsd (weiAmount) {
      const self = this
      const ethAmount = parseFloat(web3.utils.fromWei(weiAmount.toString(), 'ether'))
      let ethToUsd = self.swapData.marketData.find(o => o.symbol.toLowerCase() === 'eth').current_price

      return '~ USD ' + (ethToUsd * ethAmount)
    },
    filterDepositCoin (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.depositCoinOptions = this.depositCoinUnfilter.filter(v => v.value.toLowerCase().indexOf(needle) > -1 || v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterDestinationCoin (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.destinationCoinOptions = this.destinationCoinUnfilter.filter(v => v.value.toLowerCase().indexOf(needle) > -1 || v.label.toLowerCase().indexOf(needle) > -1)
      })
    }
  },
  mixins: [contract, DexInteraction]
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
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

/deep/ .wallets-wrapper {
    padding-bottom: 0px !important;
}

/deep/ .wallets-wrapper--list {
    box-shadow: none;
    margin-top: 0px;
}

.marg {
    /deep/ .profile-wrapper {
        &--header {
            margin-bottom: 0px;
        }
    }
}

.mobile-pad {
    padding-bottom: 100px;
    background: #f3f3f3 !important
}

.desktop-card-style {
    height: 100%;
}

.standard-content {
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    // justify-content: space-start;
    // min-height: calc(100vh + 100px) !important;
    // padding-bottom: 100px;
    @media screen and (min-width: 768px) {
        padding: 2%;
        flex-direction: column;
        justify-content: flex-start;
        min-height: unset !important;
        padding-bottom: 20px;
    }

    .exchange_picto {
        margin-top: -60px;

        img {
            width: 100%;
            max-width: 270px;
            margin-top: 20px;
            margin-bottom: -30px;
        }

        @media screen and (min-width: 768px) {
            margin-top: -20px;

            img {
                width: 100%;
                max-width: 380px;
            }
        }
    }

    &--title {
        font-size: 35px;
        font-weight: $bold;
        position: relative;
        line-height: 50px;
        font-family: $Titillium;
        margin-top: 0px;
        margin-bottom: 0px;

        @media screen and (min-width: 768px) {
            margin-top: -20px;
            font-size: 25px;
        }

        .btn-align-left {
            position: absolute;
            left: -15px;
            top: 10px;
        }
    }

    &--desc {
        margin-top: -20px;
        margin-bottom: 40px;
        font-size: 18px;
        font-weight: $regular;
        position: relative;
        line-height: 26px;
        font-family: $Titillium;
        color: $mainColor;
    }

    &--body {
        .progress-custom-volentix {
            max-width: 150px;
            margin: auto;
            margin-top: 20px;

            .title {
                font-size: 13px;
                color: #7272FA;
                font-weight: $light;
                font-family: $Titillium;
                margin-bottom: -10px;
                margin-top: 10px;
            }

            /deep/ .q-linear-progress__model {
                background: #7272FA;
            }
        }

        &__img {
            min-height: 250px;

            img {
                max-width: 90%;
            }
        }

        .rate-value {
            padding: 0px 0px;
            font-family: $Titillium;
            font-weight: $regular;
            color: #B0B0B0;
            font-size: 16px;
            margin-bottom: -20px;
            margin-top: -20px;
        }

        &__form {
            .pay-get-wrapper {
                // border-bottom: 1px solid rgba(#707070, .4);
                padding: 0px;
                padding-bottom: 10px;
                margin-bottom: 20px;

                .pay-wrapper {}

                .exchange-btn {
                    height: fit-content;
                    align-self: flex-end;
                    padding-top: 15px;
                    transform: rotate(90deg);
                    margin: auto;
                    margin-top: 10px;
                    padding: 12px 10px 0px 10px;

                    .left-icon {
                        transform: scaleX(-1);
                        margin-left: 0px;
                        margin-right: -26px;
                        margin-top: -24px;
                        color: #7272FA;
                    }

                    .right-icon {
                        color: #7272FA;
                    }
                }

                .label {
                    font-size: 17px;
                    color: #2A2A2A;
                    font-family: $Titillium;
                    font-weight: $light;
                }

                .value {
                    font-size: 33px;
                    color: #B0B0B0;
                    font-family: $Titillium;
                    font-weight: $regular;
                }

                .get-wrapper {}
            }

            /deep/ .q-field__native {
                padding-left: 8px;
                font-size: 16px;
                font-weight: $regular;
            }

            /deep/ .q-field__label {
                font-family: $Titillium;
                font-weight: $regular;
                font-size: 18px;
                padding-left: 10px;
                margin-top: -2px;
            }

            .input-input {
                height: 50px;
                padding-bottom: 0px;

                /deep/ .q-field__control {
                    height: 50px;
                    min-height: unset;

                    @media screen and (min-width: 1024px) {
                        margin-left: 20px;
                    }
                }

                .btn-copy {
                    // height: 30px;
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

            /deep/ .option--avatar {
                border: 1px solid;
                width: 35px;
                height: 35px;
                max-width: 40px;
                padding: 0px;
                min-width: unset;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border-radius: 50px;
                overflow: hidden;
                margin-left: -10px;
                padding-right: 0px;

                &.vtx {
                    background-color: #000;
                    padding: 3px;
                }
            }
        }
    }

    &--footer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        min-height: 100px;

        .action-link {
            height: 54px;
            text-transform: initial !important;
            font-size: 16px;
            letter-spacing: .5px;
            border-radius: 40px;
            width: fit-content;
            margin-left: 0px;
            padding-left: 20px;
            padding-right: 20px;
            background-color: #7272FA !important;

            .left-icon {
                transform: scaleX(-1);
                margin-left: 6px;
                margin-right: 6px;
                margin-top: -1px;
            }

            // &.next{
            //   background-color: #7900FF !important;
            // }
            // &.back{
            //   background-color: #B0B0B0 !important;
            // }
        }
    }
}

.select-input {
    border-radius: 100px !important;
    $height: 50px;
    height: $height;

    /deep/ .q-field__marginal {
        height: $height;
        min-height: unset;
    }

    /deep/ .q-field__control {
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

.lab-input {
    font-family: $Titillium;
    font-weight: $regular;
    font-size: 16px;
    color: black;
    padding-left: 20px;
    padding-bottom: 5px;
    display: block;
    margin-top: 10px;
    line-height: 17px;
}

.tlab-input {
    font-family: $Titillium;
    font-weight: $bold;
    font-size: 26px;
    color: black;
    padding-left: 20px;
    padding-bottom: 25px;
    display: block;
    margin-top: 0px;
    line-height: 17px;
}

.sublab-input {
    font-family: $Titillium;
    font-weight: $regular;
    font-size: 14px;
    color: #333;
    padding-left: 20px;
    padding-bottom: 5px;
    display: block;
    margin-top: -50px;
    line-height: 17px;
}

.mw200 {
    max-width: 220px;
}

.mw160 {
    max-width: 160px;
}

.mw100 {
    max-width: 110px;
}

.pl0 {
    padding-left: 0px !important;

    /deep/ .q-field__native {
        padding-left: 1px !important;
    }
}

.align-left {
    /deep/ .q-btn__content {
        text-align: left;
        justify-content: start;
        padding-left: 7px;

        .q-icon {
            font-size: 1em;
        }
    }
}

.--next-btn {
    text-transform: initial !important;
}

.chain-tools-wrapper {

    // padding: 0px 6%;
    &--list {
        &__hide-chain-tools {
            text-transform: initial !important;
            margin-top: 0px;
            margin-bottom: 10px;
            color: #7272FA !important;
        }

        .list-wrapper {
            overflow: hidden;
            visibility: hidden;
            height: 0px;
            opacity: 0;
            transform: translateY(-20px) scaleY(.5);
            transform-origin: top;
            transition: ease transform .3s, ease opacity .4s;

            @media screen and (min-width: 1024px) {
                overflow: visible;
            }

            &--chain {
                &__type {
                    background-color: #fff;
                    margin-bottom: 10px;
                    border-radius: 0px 0px 10px 10px;
                    padding: 3% 8%;
                    box-shadow: 0px 4px 16px 0px rgba(black, .09);
                    font-family: $Titillium;
                    font-size: 20px;
                    color: #2A2A2A;
                    font-weight: $bold;

                    b {
                        color: #7272FA;
                        text-transform: uppercase;
                    }

                    .chain {}

                    .token {}
                }

                &__coming-soon {
                    ul {
                        list-style: none;
                        padding: 0px;
                        margin: 0px;
                        padding: 5% 6%;

                        li {
                            &:not(:last-child) {
                                border-bottom: 1px solid #707070;
                            }

                            .btn-soon {
                                text-transform: initial !important;
                                padding: 20px 10px;
                                border-radius: 0px;

                                /deep/ .q-btn__content {
                                    display: flex;
                                    justify-content: space-between;
                                    flex-direction: row;
                                    align-items: center;
                                    align-content: center;
                                }

                                .title {
                                    font-size: 20px;
                                    color: #454F63;
                                    font-weight: $bold;
                                    margin-right: auto;
                                }

                                .soon {
                                    font-size: 16px;
                                    color: #B0B0B0;
                                    display: flex;
                                    justify-content: space-between;
                                    flex-direction: row;
                                    align-items: center;
                                    align-content: center;
                                }

                                .icon {
                                    color: #78849E;
                                    position: relative;
                                    top: 2px;
                                    margin-left: 20px;
                                }
                            }
                        }
                    }
                }

                &__eos-to-vtx-convertor {
                    background-color: #fff;
                    margin-bottom: 10px;
                    border-radius: 10px;
                    padding: 1% 2%;
                    box-shadow: 0px 4px 16px 0px rgba(black, .09);

                    @media screen and (min-width: 1024px) {
                        box-shadow: none;
                    }

                    &--title {
                        font-size: 22px;
                        font-family: $Titillium;
                        font-weight: $bold;
                        color: #2A2A2A;
                        margin: 0px;
                        padding-left: 22px;
                        margin-top: 3px;
                        position: relative;
                    }

                    /deep/ .q-stepper__step {
                        position: relative;
                    }

                    /deep/ .q-stepper--vertical .q-stepper__dot:before,
                    /deep/ .q-stepper--vertical .q-stepper__dot:after {
                        content: '';
                        transform: translateX(-50%);
                        width: 18px;
                        background: #F3F3F3;
                        // margin-top: -4px;
                        // margin-bottom: -4px;
                    }

                    /deep/ .q-stepper__tab {
                        .q-stepper__title {
                            font-size: 20px;
                            font-family: $Titillium;
                            font-weight: $bold;
                            color: #2A2A2A;
                        }

                        &.q-stepper__tab--active,
                        &.q-stepper__tab--done {
                            .q-stepper__title {
                                color: #7272FA;
                            }

                            .q-stepper__dot {
                                background: #7272FA;
                            }
                        }
                    }

                    .--input {
                        margin-top: 20px;

                        /deep/ .q-field {
                            height: 40px;
                        }

                        /deep/ .q-field__native,
                        /deep/ .q-field__prefix,
                        /deep/ .q-field__suffix {
                            padding-top: 10px;
                            padding-bottom: 0px;
                        }

                        /deep/ .q-field__label {
                            top: 10px;
                            font-size: 12px;
                            font-weight: $bold;
                            font-family: $Titillium;
                        }

                        /deep/ .q-field__marginal {
                            height: 40px;
                        }

                        /deep/ .q-field__control {
                            height: 40px;
                        }
                    }

                    .--slider {
                        /deep/ &.q-slider--dark {
                            .q-slider__track-container {
                                background: rgba(0, 0, 0, 0.3);
                            }

                            .q-slider__pin-value-marker-text {
                                font-weight: $bold;
                                font-size: 11px;
                            }

                            .q-slider__pin-value-marker-bg {
                                background: #FFB200 !important;
                            }

                            .text-green {
                                background: #FFB200 !important;
                            }
                        }
                    }

                    .--next-btn {
                        width: 100px;
                        text-transform: initial !important;
                    }

                    .--progress {
                        height: 20px;

                        /deep/ .q-linear-progress {
                            margin-top: 8px;
                            height: 5px !important;
                            max-width: 90%;
                            margin-left: auto;
                            margin-right: auto;

                            .q-linear-progress__track {
                                background: #FFB200;
                            }

                            .q-linear-progress__model--indeterminate:before,
                            .q-linear-progress__model--indeterminate:after {
                                background: #FFB200;
                            }
                        }
                    }

                    .--back-btn {
                        position: absolute;
                        right: 0px;
                        top: 6px;

                        @media screen and (min-width: 1024px) {
                            right: unset;
                            left: 5px;
                            top: 5px;
                            width: 90px;

                            /deep/ .q-focus-helper {
                                display: none !important;
                            }

                            /deep/ .q-btn__wrapper {
                                padding-left: 0px;
                                padding-right: 0px;
                            }
                        }
                    }

                    .--subtitle {
                        font-size: 16px;
                        color: #000;
                        font-family: $Titillium;
                        font-weight: $light;
                        line-height: 20px;
                        margin-top: 10px;
                        margin-bottom: 10px;

                        ul {
                            padding: 0px;
                            margin: 0px;
                            margin-left: 20px;

                            li {
                                font-size: 15px;
                                font-weight: $light;
                                margin-bottom: 10px;
                                line-height: 21px;
                                color: #FFB200;

                                span {
                                    color: #2A2A2A;
                                }
                            }
                        }

                        &__success {
                            color: #00D0CA;
                            font-weight: $bold;
                            margin-bottom: 20px;
                        }

                        &__faild {
                            color: #FFB200;
                            font-weight: $bold;
                            margin-bottom: 20px;
                        }

                        &__transLink {
                            color: #2A2A2A;
                            border-bottom: 1px solid;
                            width: fit-content;
                            font-weight: $bold;
                            margin-bottom: 20px;
                        }

                        &__summary {
                            margin-bottom: 20px;
                            font-weight: $bold;
                        }

                        &__summary--list {
                            list-style: disc;
                            padding-left: 24px;
                            margin-top: -10px;

                            li {
                                color: #B0B0B0;
                            }
                        }

                        &__success {
                            color: #00D0CA;
                            font-weight: $bold;
                            margin-bottom: 20px;
                        }

                        &__faild {
                            color: #FFB200;
                            font-weight: $bold;
                            margin-bottom: 20px;
                        }

                        &__transLink {
                            color: #2A2A2A;
                            border-bottom: 1px solid;
                            width: fit-content;
                            font-weight: $bold;
                            margin-bottom: 20px;
                        }

                        &__summary {
                            margin-bottom: 20px;
                            font-weight: $bold;
                        }

                        &__summary--list {
                            list-style: disc;
                            padding-left: 24px;
                            margin-top: -10px;

                            li {
                                color: #B0B0B0;
                            }
                        }
                    }

                    .--title,
                    .--amount {
                        font-size: 13px;
                        font-family: $Titillium;
                        font-weight: $bold;
                        color: #B0B0B0;
                        text-transform: initial !important;
                        line-height: 20px;
                    }

                    .--amount {
                        color: #2A2A2A !important;
                    }
                }
            }
        }

        &.open {
            margin-bottom: 0px;
            padding-left: 0%;
            padding-right: 0%;

            .list-wrapper {
                visibility: visible;
                height: auto;
                opacity: 1;
                transform: translateY(0px) scaleY(1);
                margin-bottom: 10px;
            }
        }
    }
}

.q-card {
    border-radius: 25px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 35px rgba(0, 0, 0, 0.14), 0 1px 10px rgba(0, 0, 0, 0.12);
}

.accept-disclaimer {
    color: #FFF !important;
    background-color: #00D0DF !important;
    text-transform: initial !important;
    padding: 10px 30px;
    border-radius: 50px;
    font-weight: $light;
}

.parg {
    font-size: 16px;
    font-weight: $regular;
    font-family: $Titillium;
    line-height: 22px;

    a {
        font-weight: $bold;
        border-bottom: 1px solid;
        text-decoration: none;
    }
}

.lower {
    text-transform: initial !important;
}

.bold {
    font-weight: $bold !important;
}

.stepper--desktop {
    /deep/ .q-stepper__content {
        max-width: 600px;
        margin: auto;
        margin-top: 50px;

        .q-stepper__step-inner {
            padding-top: 60px;
        }
    }

    /deep/ .q-stepper__header {
        // padding: 0px 10%;
        background-color: #F6F6F6;
        margin-bottom: 0px;
        border-radius: 40px;
        height: 40px;
        position: relative;

        &:before {
            content: '';
            width: 12%;
            position: absolute;
            left: 0px;
            top: 18px;
            height: 3px;
            background-color: #F6F6F6;
            transform: translateX(-100%);
        }

        &:after {
            content: '';
            width: 12%;
            position: absolute;
            right: 0px;
            top: 18px;
            height: 3px;
            background-color: #F6F6F6;
            transform: translateX(100%);
        }

        .q-stepper__tab {
            height: 40px;
            min-height: 40px;
            padding: 0px 10px;
            display: flex;
            flex-direction: row;
            align-items: center;

            &--active,
            &--done {
                .q-stepper__label {
                    .q-stepper__title {
                        font-size: 12px;
                        font-weight: bold;
                    }
                }
            }
        }

        .q-stepper__dot {
            &:after {
                display: none;
            }
        }

        .q-stepper__label {
            margin-top: 0px;
            padding-left: 6px;

            .q-stepper__title {
                font-size: 12px;
                font-weight: normal;
            }
        }
    }
}

.trade-component {
    position: relative;
    // font-family: $Franklin;
    font-size: 18px;
    font-weight: $bold;
    // border: 1px solid #CCC;
    border-radius: 10px;
    // max-width: 500px;
    padding-bottom: 10px;

    .prototype {
        // position: absolute;
        z-index: 0;
        left: 0px;
        top: 0px;

        .--subtitle {
            font-size: 14px;
            // font-family: $Franklin;
            font-weight: $light;
            line-height: 20px;
            margin-bottom: 20px;
            text-align: center;
            padding-left: 10px;
            padding-right: 10px;
        }

        /deep/ .q-field--with-bottom {
            .q-field__messages.col div {
                padding-bottom: 0px;
                margin-bottom: 0px;
                margin-top: -8px;
                font-size: 10px;
                margin-left: -13px;
                @media screen and (max-width: 1024px) {
                    margin-top: -1px;
                    font-size: 12px;
                    margin-left: -7px;
                }
            }
        }

        .head {
            padding: 16px 30px;
            border-bottom: 1px solid #f6f6f9;
            margin-bottom: 15px;
            font-size: 16px;
        }

        .you-pay {
            &-head {
                padding: 0px 30px;
                margin-bottom: 18px;
                font-size: 16px;

                .col {
                    &.red {
                        font-size: 12px;
                        font-weight: $light;
                    }
                }
            }

            &-body {
                padding: 0px 30px;
                font-size: 24px;
                font-weight: $bold;
            }
        }

        .choose-coin {
            cursor: pointer;

            &:hover {
                opacity: .7;
            }

            position: relative;
        }

        .pay-coin {
            position: relative;

            .pay-coin-select {
                position: absolute;
                left: -29px;
                top: 40px;
                z-index: -10;
                width: 348px;
                opacity: 0;
            }

            .receive-coin-select {
                position: absolute;
                left: -29px;
                top: 40px;
                z-index: -10;
                width: 348px;
                opacity: 0;
            }
        }

        .you-receive {
            background-color: #f6f6f9;
            margin: 0px 10px;
            margin-top: 20px;
            padding: 15px 10px;
            border-radius: 10px;
            position: relative;
            @media screen and (max-width: 1024px) {
                padding-bottom: 25px !important;
            }

            /deep/ .chose_accounts {
                background-color: transparent !important;
                font-size: 14px !important;
                height: 35px;
                color: #7272FA !important;
                border-radius: 10px;
                margin-top: 20px;
                height: 40px !important;
            }

            /deep/.swap_vert {
                position: absolute;
                top: 0px;
                left: 20px;
                transform: translateY(-50%) scale(1.15);
                background-color: #FFF !important;

                .q-btn__wrapper:before {
                    border: 3px solid #f4f4f4;
                }
            }

            &-head {
                padding: 0px 15px;
                margin-bottom: 18px;
                font-size: 16px;

                .col {
                    &.small {
                        font-size: 11px;
                        font-weight: $light;
                    }

                    &._loading {
                        -webkit-animation: infiniteRotate 1s linear infinite;
                        /* Safari */
                        animation: infiniteRotate 1s linear infinite;
                    }
                }
            }

            &-body {
                padding: 0px 15px;
                font-size: 24px;
                font-weight: $bold;
            }
        }
    }
}

.info_rate_holder {
    .i-btn {
        &:hover {
            .info_rate_wrapper {
                visibility: visible;
                opacity: 1;
                transform: translateY(-10px);
            }
        }
    }
}

.info_rate {
    position: relative;

    .i-btn {
        width: 20px;
        height: 20px;
        border-radius: 20px;
        border: 1px solid rgba(black, .2);
        display: flex;
        justify-content: center;
        margin-left: 10px;
    }

    .rate-info-prototype {
        position: absolute;
        left: -220px;
        top: 0px;
        z-index: 9;
        display: none;
    }

    .info_rate_wrapper {
        position: absolute;
        right: 0px;
        top: 30px;
        z-index: 9;
        width: 220px;
        background-color: #fff;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0px 10px 10px 0px rgba(black, .1);
        // font-family: $Franklin;
        font-weight: $regular;
        visibility: hidden;
        opacity: 0;
        transform: translateY(0px);
        transition: ease opacity .3s, transform ease .3s;

        hr {
            opacity: .2;
        }

        .title {
            font-size: 15px;
            padding-top: 5px;
            padding-bottom: 5px;
            // font-weight: $semibold;
        }
    }
}

.disclaimer-wrapper {
    font-size: 14px;
    // font-family: $Franklin;
    font-weight: $light;
}

/* Safari 4.0 - 8.0 */
@-webkit-keyframes infiniteRotate {
    0% {
        opacity: 1;
    }

    100% {
        opacity: .3;
    }
}

/* Standard syntax */
@keyframes infinite-rotate {
    0% {
        opacity: 1;
    }

    100% {
        opacity: .3;
    }
}

.option--avatar {
    border: 1px solid rgba(black, .1);
    width: 35px;
    height: 35px;
    max-width: 40px;
    padding: 0px;
    min-width: unset;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    overflow: hidden;

    &__custom {
        border: 1px solid;
        margin-left: -10px;
        padding-right: 0px;
    }

    &.vtx {
        background-color: #000;
        padding: 3px;
    }
}

.q-field__messages {
    margin-top: 5px;
}
.gasSelector{
    @media screen and (max-width: 768px) {
        flex-direction: column;
        .q-item__section{
            margin-left: 0px;
            margin-bottom: 10px;
        }
    }
}
.you-receive{
    @media screen and (max-width: 768px) {
        padding-bottom: 50px !important;
    }
}
.dark-theme{
    .trade-component {
        .prototype .head{
            color: #FFF;
            border-bottom: 1px solid rgba(#CCC, .3);
            margin-bottom: 40px;
        }
        .prototype .you-receive-head,
        .prototype .you-pay-head{
            color: #FFF;
        }
        .prototype .you-receive{
            background-color: rgba(white, .05);
            .swap_vert{
            background-color: #04111F !important;
            }
        }
        .prototype .you-receive .chose_accounts{
            background-color: #FFF !important;
            font-size: 14px !important;
            color: #04111F !important;
            border-radius: 40px;
            margin-top: 40px;
            height: 36px;
            font-weight: 400;
            width: 150px !important;
            letter-spacing: .3px;
            float: right;
        }
    }
}
</style>

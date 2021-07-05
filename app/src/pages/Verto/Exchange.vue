<template>
<q-page class="column" :class="{'desktop-marg':screenSize > 1024, 'miniMode': miniMode, 'mobile-pad': screenSize < 1024 , 'text-black bg-grey-12': $store.state.settings.lightMode === 'false'}">
    <!-- padding-bottom: 100px;background: #f3f3f3 !important -->
    <div :class="{'dark-theme': $store.state.settings.lightMode === 'true'}" style="height: 100vh;">
        <div class="desktop-version full-height" v-if="screenSize > 1024">
            <div class="row full-height">
                <div class="col col-md-3" v-if="!miniMode">
                    <div class="wallets-container" style="height: 100%">
                        <profile-header :isMobile="false" class="marg" version="type2222" />
                        <wallets :isMobile="false" class="full-height max-height" :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
                        <!-- <img src="statics/prototype_screens/wallets.jpg" alt=""> -->
                    </div>
                </div>
                <div class="col" :class="{'col-md-9': !miniMode, 'col-md-12': miniMode}">
                    <div class="desktop-card-style apps-section q-mb-sm"  :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
                        <!-- <q-scroll-area :visible="true" style="height: 80vh;"> -->
                        <div class="chain-tools-wrapper">
                            <div class="standard-content">
                            <q-breadcrumbs class="col-12 q-pt-md q-pl-md  breadcrumbs cursor-pointer">
                              <q-breadcrumbs-el  class="cursor-pointer" @click="miniMode ? $emit('setStep', 0) : $router.push('/verto/dashboard')" label="Back"  icon="keyboard_backspace" />
                            </q-breadcrumbs>
                                <!-- <div class="exchange_picto flex flex-center"><img src="statics/exchange_picto.svg" alt=""></div> -->
                            </div>
                            <div class="chain-tools-wrapper--list chain-tools-wrapper--list___2 open">
                                <div class="list-wrapper">
                                    <div class="list-wrapper--chain__eos-to-vtx-convertor">
                                        <!-- <div class="row q-mb-md">
                                            <q-select class="default-view col-md-3 col-6 offset-md-9" v-model="defaultView" :options="['Coinswitch', '1Inch', 'Swap EOS']" label="Default view" />
                                        </div> -->

                                        <VolentixLiquidity v-if="vpoolsTestMode" />
                                        <Oneinch class="oneinch-wrapper" :crossChain="true" v-else-if="$store.state.settings.selectedDex == 'oneinch'"></Oneinch>
                                        <Swapeos :crossChain="true" v-else-if="$store.state.settings.selectedDex == 'defibox'"></Swapeos>
                                        <Coinswitch class="coinswitch-wrapper" :crossChain="true" v-else></Coinswitch>
                                    </div>
                                    <br><br><br>
                                </div>
                            </div>
                        </div>
                        <!-- </q-scroll-area> -->
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="mobile-version chain-tools-wrapper" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
          <div class="chain-tools-wrapper">
            <div class="standard-content">
                <h2 class="standard-content--title flex justify-start">vDex</h2>
                <!-- <div class="exchange_picto flex flex-center"><img src="statics/exchange_picto.svg" alt=""></div> -->
            </div>
            <div class="chain-tools-wrapper--list chain-tools-wrapper--list___2 open">
                <div class="list-wrapper">
                    <div class="list-wrapper--chain__eos-to-vtx-convertor">
                        <!-- <div class="row q-mb-md">
                            <q-select class="default-view col-md-3 col-6 offset-md-9" v-model="defaultView" :options="['Coinswitch', '1Inch', 'Swap EOS']" label="Default view" />
                        </div> -->
                        <VolentixLiquidity v-if="vpoolsTestMode" />
                        <Oneinch class="oneinch-wrapper" :crossChain="true" v-else-if="$store.state.settings.selectedDex == 'oneinch'"></Oneinch>
                        <Swapeos :crossChain="true" v-else-if="$store.state.settings.selectedDex == 'defibox'"></Swapeos>
                        <Coinswitch class="coinswitch-wrapper" :crossChain="true" v-else-if="$store.state.settings.selectedDex == 'coinswitch'"></Coinswitch>
                    </div>
                    <br><br><br>
                </div>
            </div>
          </div>
        </div>
    </div>
    <q-dialog persistent v-model="showDisclaimerWrapper">
        <q-card class="q-pa-md" style="width: 700px; max-width: 92vw;">
            <q-toolbar>
                <q-avatar><img src="statics/icon.png"></q-avatar>
                <q-toolbar-title><span class="text-weight-bold">Disclaimer</span> </q-toolbar-title>
            </q-toolbar>
            <q-card-section class="text-h6">
                <div class="parg">
                    This transaction is carried out using an <a href="https://coinswitch.co/terms" target="_blank">open API</a> linked to various Exchanges.<br>
                    By sending coins to the above address, you agreed to <a href="https://eos.io/legal/important-notice/" target="_blank">the terms and conditions</a> of the selected provider.<br>
                    I have read the terms and conditions and I agree
                </div>
            </q-card-section>
            <q-card-actions align="right" class="q-pr-sm">
                <q-btn flat label="Accept" class="accept-disclaimer" @click="disclaimerCheck = true" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</q-page>
</template>

<script>
// import { QScrollArea } from 'quasar'

import store from '@/store'
// import { userError } from '@/util/errorHandler'

const url = 'https://api.coinswitch.co'
let headers = {
  'x-api-key': process.env[store.state.settings.network].COINSWITCH_APIKEY
}

const typeUpper = function (thing) {
  if (typeof thing === 'string' && thing.length >= 1) {
    return thing.toUpperCase()
  } else {
    return ''
  }
}
import {
  osName
} from 'mobile-device-detect'
import Lib from '@/util/walletlib'
import Wallets from '../../components/Verto/Wallets'
import Oneinch from '../../components/Verto/Exchange/Oneinch'
import Coinswitch from '../../components/Verto/Exchange/Coinswitch'
import Swapeos from '../../components/Verto/Exchange/Swapeos'
import VolentixLiquidity from '../../components/Verto/Exchange/VolentixLiquidity'
import ProfileHeader from '../../components/Verto/ProfileHeader'
import EosWrapper from '@/util/EosWrapper'
const eos = new EosWrapper()

export default {
  props: ['miniMode'],
  components: {
    // desktop components
    // QScrollArea,
    ProfileHeader,
    Wallets,
    VolentixLiquidity,
    Oneinch,
    Swapeos,
    Coinswitch
  },
  data () {
    return {
      osName: '',
      disclaimerCheck: false,
      showDisclaimerWrapper: false,
      fromCoin: null,
      defaultView: '1Inch',
      vpoolsTestMode: false,
      fromCoinAmount: 0,
      toCoinAmount: 0,
      fromCoinType: 'EOS',
      toCoinType: 'VTX',
      toCoin: null,
      progress: 0.2,
      to: '',
      amount: '',
      memo: '',
      optionsFrom: [],
      optionsTo: [],
      minimizedModal: false,
      params: null,
      tableData: [],
      currentAccount: null,
      goBack: '/verto/dashboard',
      fetchCurrentWalletFromState: true,
      fromCoinMemo: false,
      toCoinMemo: false,
      // -------------------------
      timeoutNotif: 0,
      notif: false,
      step: 1,
      optionsSanitize: false,
      spinnervisible: false,
      lastChangedValue: 'deposit',
      coins: [],
      depositCoin: null,
      depositQuantity: 0,
      depositCoinOptions: null,
      depositCoinUnfilter: null,
      destinationCoin: null,
      destinationQuantity: 0,
      destinationCoinOptions: null,
      destinationCoinUnfilter: null,
      destinationCoinAmount: null,
      vtxEosPrice: null,
      rateDataVtx: null,
      rateDataEos: null,
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
      requestStop: false
    }
  },
  updated () {},
  watch: {
    fromCoin (val) {
      if (val.type !== 'new_public_key') {
        this.fromCoinType = this.fromCoin.type
      } else {
        return 'EOS'
      }
    },
    toCoin (val) {
      if (val.type !== 'new_public_key') {
        this.toCoinType = this.toCoin.type
      } else {
        return 'VTX'
      }
    }
  },
  // beforeRouteLeave (to, from, next) {
  // console.log('to', to)
  // console.log('from', from)
  // console.log('next', next)
  // window.removeEventListener('resize', this.getWindowWidth)
  // const dismiss = this.$q.notify({ type: 'my-notif' })
  // dismiss()
  // this.timeoutNotif = 100
  // console.log('beforeRouteLeave')
  // this.$router.push({ path: to.fullPath })
  // this.$router.push({
  //     path: `/verto/card-wps/public-proposals/${item.proposal_name}`
  //   })
  // },
  // beforeUpdate () {
  //   if (this.notif) {
  //     window.removeEventListener('resize', this.getWindowWidth)
  //     const dismiss = this.$q.notify({ type: 'my-notif' })
  //     dismiss()
  //     // console.log('beforeUpdate')
  //     this.timeoutNotif = 100
  //   }
  // },
  async created () {
    this.osName = osName
    this.getWindowWidth()

    window.addEventListener('resize', this.getWindowWidth)
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
        case 'limit_exceeded':
          value = 'The destination amount limit was exceeded'
          break
        case 'invalid_address':
          value = 'The destination address is invalid'
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
        case 'limit_exceeded':
        case 'invalid_address':
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
        return this.coins.filter(coins => coins.symbol === this.destinationCoin.value)[0].logoUrl
      } else {
        return '/static/icon.png'
      }
    },
    exchangeLabel () {
      if (this.depositCoin != null) {
        return 'Complete this exchange by sending ' + this.expectedDepositCoinAmount + ' ' + typeUpper(this.depositCoin.value) + ' to this address within the next 1 hour'
      } else {
        return 'Complete this exchange by sending the coins to this address within the next 1 hour'
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
  mounted () {

  },
  methods: {
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
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
    checkAddressMatchCoins () {
      this.postOrder()
      this.$refs.stepper.next()
    },
    checkDepositAndDestination () {
      if (this.destinationAddress.address === '' || this.depositCoin.address === '') {}
    },
    updateCoinName () {
      if (this.destinationCoin !== null) {
        this.toCoinType = this.destinationCoin.value
        this.getPairs()
      } else {
        this.toCoinType = this.toCoin.type
      }
    },
    checkGetPairs () {
      if (this.depositCoin !== null) {
        this.fromCoinType = this.depositCoin.value
        this.getPairs()
      } else {
        this.fromCoinType = this.fromCoin.type
      }
    },
    switchAmounts () {
      // let fromCoinTypeVar = this.fromCoinType
      // this.fromCoinType = this.toCoinType
      // this.toCoinType = fromCoinTypeVar

      let depositCoinVar = this.depositCoin
      this.depositCoin = this.destinationCoin
      this.destinationCoin = depositCoinVar

      let fromCoinTypeVar = this.fromCoinType
      this.fromCoinType = this.toCoinType
      this.toCoinType = fromCoinTypeVar

      let depositQuantityVar = this.depositQuantity
      this.depositQuantity = this.destinationQuantity
      this.destinationQuantity = depositQuantityVar
    },
    filterDepositCoin (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.depositCoinOptions = this.depositCoinUnfilter.filter(v => v.value.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterDestinationCoin (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.destinationCoinOptions = this.destinationCoinUnfilter.filter(v => v.value.toLowerCase().indexOf(needle) > -1)
      })
    },
    copy2clip (value) {
      // more generic copy
      this.$clipboardWrite(value)
      this.$q.notify({
        message: this.$t('Main.copied'),
        color: 'positive'
      })
    },
    checkToPostOrder () {
      if (this.$refs.depositQuantity.hasError || this.$refs.destinationQuantity.hasError) {
        // userError()
        // console.error('There is a problem with the quantities')
      } else {
        this.postOrder()
        this.$refs.stepper.next()
      }
    },
    checkToGetPairs () {
      if (this.depositCoin === null) {
        // userError('There is a problem with the coin selection')
        // console.error('There is a problem with the coin selection')
      } else {
        this.getPairs()
        this.$refs.stepper.next()
      }
    },
    checkToGetRate () {
      // if (this.$refs.destinationAddressAddress.hasError || this.destinationAddress.address === '' ||
      // console.log('this.depositCoin.value', this.depositCoin.value)
      let self = this
      this.optionsFrom = []
      this.optionsTo = []
      this.tableData.map(token => {
        if (this.depositCoin.value.toLowerCase() === token.type) {
          self.optionsFrom.push({
            label: token.name.toLowerCase(),
            value: token.chain === 'eos' ? token.name.toLowerCase() : token.key,
            key: token.key,
            image: token.icon,
            type: token.type
          })
        }
        if ((this.destinationCoin.value.toLowerCase() === token.type) || (this.destinationCoin.value.toLowerCase() === 'vtx' && token.type === 'eos')) {
          self.optionsTo.push({
            label: token.name.toLowerCase(),
            value: token.chain === 'eos' ? token.name.toLowerCase() : token.key,
            key: token.key,
            privateKey: token.privateKey,
            image: token.icon,
            type: token.type
          })
        }
      })
      this.optionsFrom.unshift({
        label: 'Other public key / Account',
        value: '',
        image: '/statics/img/door-key.png',
        type: 'new_public_key'
      })
      this.optionsTo.unshift({
        label: 'Other public key / Account',
        value: '',
        image: '/statics/img/door-key.png',
        type: 'new_public_key'
      })
      if (this.destinationCoin === null) {
        // userError()
        // console.error('There is a problem with the destination address or the coin is not selected')
      } else {
        this.getRate()
        this.$refs.stepper.next()
      }
    },
    verifyAddress () {
      // check validity of all keys
    },
    quantityFromDeposit () {
      // deal with precision
      this.destinationQuantity = (+this.depositQuantity * +this.rateData.rate) - +this.rateData.minerFee
      this.lastChangedValue = 'deposit'
    },
    quantityFromDestination () {
      // deal with precision
      this.depositQuantity = (+this.destinationQuantity + +this.rateData.minerFee) / +this.rateData.rate
      this.lastChangedValue = 'destination'
    },
    orderStatus () {
      const self = this
      this.$axios.get(url + '/v2/order/' + this.orderId, {
        headers
      }).then(function (result) {
        self.status = result.data.data.status
        if (self.status === 'no_deposit') {
          if (!self.notif) {
            self.triggerCustomRegisteredType1()
          }
        } else {
          self.timeoutNotif = 1000
        }
        if (self.status === 'no_deposit' ||
                    self.status === 'confirming' ||
                    self.status === 'exchanging' ||
                    self.status === 'sending') {
          setTimeout(() => {
            self.orderStatus()
          }, 30000)
        }
        if (self.status === 'complete' && self.destinationCoin.value === 'vtx') {
          self.destinationCoinAmount = Math.trunc(result.data.data.destinationCoinAmount * 10000) / 10000
          self.orderVTX()
        }
      })
    },
    async orderVTX () {
      // check balance then...
      // let eosBal = Lib.balance('eos', this.toCoin.value, 'eos')
      let eosBal = (await eos.getCurrencyBalanceP(this.toCoin.value)).toString().split(' ')[0]
      console.log('eosBal', eosBal)

      if (+eosBal < +this.destinationCoinAmount) {
        console.log('eos balance is yet to low to proceed: ', eosBal)
        setTimeout(() => {
          self.orderVTX()
        }, 1000)
      } else {
        Lib.send(
          'eos',
          'eos',
          this.toCoin.value,
          'swap.defi', // 'newdexpublic',
          this.destinationCoinAmount,
          'swap,0,448', // '{"type":"buy-market","symbol":"volentixgsys-vtx-eos","price":"0.00000","channel":"dapp","ref":"verto"}',
          this.toCoin.privateKey,
          'eosio.token'
        ).then(result => {
          console.log('send result', result)
          if (result.success) {
            this.$q.notify({
              message: 'Your VTX have been received',
              color: 'positive'
            })
          } else {
            this.$q.notify({
              message: 'Could not convert EOS to VTX',
              color: 'negative',
              type: 'warning'
            })
          }
        })
      }
    },
    postOrder () {
      const self = this
      let depositCoinAmount = null
      let destinationCoinAmount = null

      if (self.lastChangedValue === 'deposit') {
        depositCoinAmount = self.depositQuantity
      } else {
        destinationCoinAmount = self.destinationCoin.value === 'vtx' ? self.destinationQuantity * self.vtxEosPrice : self.destinationQuantity
      }

      this.refundAddress.address = this.refundAddress.address === '' ? this.fromCoin.value : this.refundAddress.address
      // console.log('this.refundAddress', this.refundAddress)
      this.destinationAddress.address = this.destinationAddress.address === '' ? this.toCoin.value : this.destinationAddress.address

      this.$axios.post(url + '/v2/order', {
        depositCoin: self.depositCoin.value,
        destinationCoin: self.destinationCoin.value === 'vtx' ? 'eos' : self.destinationCoin.value,
        depositCoinAmount,
        destinationCoinAmount,
        destinationAddress: self.destinationAddress,
        refundAddress: self.refundAddress
      }, {
        headers
      })
        .then((response) => {
          // console.log('response - order', response)
          self.orderId = response.data.data.orderId
          self.exchangeAddress = response.data.data.exchangeAddress
          self.expectedDepositCoinAmount = response.data.data.expectedDepositCoinAmount
          self.expectedDestinationCoinAmount = response.data.data.expectedDestinationCoinAmount

          this.orderStatus()
        })
        .catch((err) => {
          if (err) {}
          // userError()
          // console.error('There was a problem posting the order', err)
        })
    },
    getPairs () {
      const self = this
      this.$axios.post(url + '/v2/pairs', {
        depositCoin: self.depositCoin.value
      }, {
        headers
      })
        .then((response) => {
          // console.log('------------Response------------', response)
          let inject = {}
          self.destinationCoinOptions = response.data.data.map(function (coin) {
            if (coin.isActive === true) {
              let row = {
                'label': self.coins.filter(coins => coins.symbol === coin.destinationCoin)[0].name,
                'value': coin.destinationCoin,
                'image': self.coins.filter(coins => coins.symbol === coin.destinationCoin)[0].logoUrl
              }

              if (coin.destinationCoin === 'eos') {
                inject = {
                  'label': 'Volentix',
                  'value': 'vtx',
                  'chain': 'eos',
                  'image': '/statics/vtx_icon.png'
                }
              }

              return row
            } // deal with false, should not create empty option.
          }).filter(function (el) {
            return el != null
          }).sort(function (a, b) {
            if (a.label.toLowerCase() < b.label.toLowerCase()) {
              return -1
            }
            return 1
          })

          self.destinationCoinOptions.push(inject)
          self.destinationCoinOptions.sort(function (a, b) {
            if (a.label.toLowerCase() < b.label.toLowerCase()) {
              return -1
            }
            return 1
          })

          self.destinationCoinUnfilter = self.destinationCoinOptions
        })
        .catch((err) => {
          if (err) {}
          // userError()
          // console.error('There was a problem getting the destination coins', err)
        })
    },
    async getRate () {
      const self = this

      if (self.destinationCoin.value === 'vtx') {
        this.vtxEosPrice = (await this.$axios.get(process.env[this.$store.state.settings.network].CACHE + 'https://api.newdex.io/v1/price?symbol=volentixgsys-vtx-eos')).data.data.price
      }

      this.$axios.post(url + '/v2/rate', {
        depositCoin: self.depositCoin.value,
        destinationCoin: self.destinationCoin.value === 'vtx' ? 'eos' : self.destinationCoin.value
      }, {
        headers
      })
        .then((response) => {
          self.rateData = response.data.data

          if (self.destinationCoin.value === 'vtx') {
            self.rateDataVtx = {
              limitMaxDepositCoin: self.rateData.limitMaxDepositCoin,
              limitMaxDestinationCoin: self.rateData.limitMaxDestinationCoin / self.vtxEosPrice,
              limitMinDepositCoin: self.rateData.limitMinDepositCoin,
              limitMinDestinationCoin: self.rateData.limitMinDestinationCoin / self.vtxEosPrice,
              minerFee: self.rateData.minerFee,
              rate: self.rateData.rate / self.vtxEosPrice
            }

            self.rateDataEos = self.rateData
            self.rateData = self.rateDataVtx
          }

          console.log('self.rateData -------------- ', self.rateData)
        })
        .catch((err) => {
          if (err) {}
          // userError()
          // console.error('There was a problem getting the rate data', err)
        })
    },
    triggerCustomRegisteredType1 () {
      this.notif = true
      this.$q.notify({
        type: 'my-notif',
        closeBtn: '+',
        classes: 'exchange-notif',
        message: `This may take a few minutes.`,
        caption: 'If you leave this page, you will no longer be able to track the status of this transaction.'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

/deep/ .wallets-wrapper {
    padding-bottom: 0px !important;
    height: 100%;
    .walletsScrollArea{
      &.short{
        height: 420px !important;
      }
      &.long{
        height: 450px !important;
      }
    }
}

/deep/ .wallets-wrapper--list {
    box-shadow: none;
    margin-top: 0px;
}
.marg {
    /deep/ .profile-wrapper {
        &--header {
            margin-bottom: 0px;
            border: 1px solid rgb(235, 235, 235);
            // border-bottom: none;
            border-radius: 10px 10px 0px 0px !important;
        }
    }
}
.miniMode .desktop-version.full-height {
    padding: 0;

}
.miniMode  .desktop-card-style {
  border:none
}
.mobile-pad {
    padding-bottom: 60px;
    background: #f3f3f3 !important;
    @media screen and (max-width: 768px) {
        padding-bottom: 0px;
    }
}

.desktop-version{
    background: #E7E8E8;
    padding-top: 13vh;
    padding-left: 18vh;
    padding-bottom: 50px;
    padding-right: 2%;
    @media screen and (min-width: 768px) {
      padding-top: 11vh;
      padding-bottom: 0px;
    }
}

.accountOptionOneinch{
    // border: 1px solid rgba(#CCC, .3);
    margin: 0px 20px;
    border-radius: 10px;
    padding-right: 20px;
    padding-top: 8px;
    /deep/ .trade-component {
      .prototype .head{
        // color: #FFF;
        // border-bottom: 1px solid rgba(#CCC, .3);
        margin-bottom: 40px;
      }
      .prototype .you-receive-head,
      .prototype .you-pay-head{
        // color: #FFF;
      }
      .prototype .you-receive{
        // background-color: rgba(white, .05);
        .swap_vert{
          // background-color: #04111F !important;
        }
      }
      .prototype .you-receive .chose_accounts{
        // background-color: #FFF !important;
        font-size: 16px !important;
        // font-family: $Franklin !important;
        // color: #04111F !important;
        border-radius: 40px;
        margin-top: 40px;
        height: 54px;
        width: fit-content !important;
        float: right;
      }
    }
  }
  /deep/ .summary-wrapper{
    // background-color: rgba(white, .06);
    // color: #FFF;
    .q-item{
      // border-top: 1px solid rgba(white,.12) !important;
      .q-item__label{
        // color: #FFF;
      }
      &:first-child{
        border-top: none !important;
      }
    }
  }
  /deep/ .oneinch-wrapper,
  /deep/ .coinswitch-wrapper,
  /deep/ .swapeos-component{
    margin: 0px;
    border-radius: 10px;
    .q-field--outlined .q-field__control{
      // background: #CCC;
    }
    .bg-white{
      background: transparent !important;
    }
    .prototype .q-tabs{
      box-shadow: none !important;
      margin-bottom: 10px;
    }
    .trade-component{
      border: none;
    }
    .trade-component .prototype .you-receive .chose_accounts{
      // background-color: #FFF !important;
      font-size: 16px !important;
      // font-family: $Franklin !important;
      color: #04111F !important;
      border-radius: 40px;
      margin-top: 40px;
      height: 54px;
      width: fit-content !important;
      float: right;
      font-size: 14px !important;
      height: 35px;
      color: #7272FA !important;
      height: 40px !important;
    }
    .trade-component .prototype .you-receive-head,
    .trade-component .prototype .you-pay-head{
      // color: #FFF;
    }
    .trade-component .prototype .you-receive{
      // background-color: rgba(white, .05);
      .swap_vert{
        // background-color: #04111F !important;
      }
    }
    .q-tab{
      // color: #FFF;
      opacity: .2;
      box-shadow: none !important;
      background: transparent;
      &.q-tab--active{
        opacity: 1;
      }
    }
  }

/deep/ .swapeos-component,
/deep/ .oneinch-wrapper,
/deep/ .coinswitch-wrapper{
  .trade-component .prototype .you-receive .chose_accounts{
    font-size: 16px !important;
    border-radius: 40px;
    margin-top: 40px;
    height: 54px;
    width: fit-content !important;
    float: right;
    font-size: 14px !important;
    height: 35px;
    // color: #7272FA !important;
    height: 40px !important;
  }
  .trade-component .prototype .you-receive{
    .q-btn:not(.swap_vert){
      font-size: 16px !important;
      border-radius: 40px;
      margin-top: 40px;
      height: 54px;
      width: fit-content !important;
      float: right;
    }
  }
  .q-tab{
    &.q-tab--active{
      opacity: 1;
    }
  }
}

.dark-theme{
  /deep/ .summary-wrapper{
    background-color: rgba(white, .06);
    color: #FFF;
    .q-item{
      border-top: 1px solid rgba(white,.12) !important;
      .q-item__label{
        color: #FFF;
      }
      &:first-child{
        border-top: none !important;
      }
    }
  }
  /deep/ .swapeos-component,
  /deep/ .oneinch-wrapper,
  /deep/ .coinswitch-wrapper{
    .text-caption{
      color: #FFF;
      margin-top: 5px;
    }
    .trade-component .prototype .head{
      color: #FFF;
    }
    .trade-component .prototype .you-receive .chose_accounts{
      background-color: #FFF !important;
      font-size: 16px !important;
      // font-family: $Franklin !important;
      color: #04111F !important;
      border-radius: 40px;
      margin-top: 40px;
      height: 54px;
      width: fit-content !important;
      float: right;
      font-size: 14px !important;
      height: 35px;
      color: #7272FA !important;
      height: 40px !important;
    }
    .trade-component .prototype .you-receive-head,
    .trade-component .prototype .you-pay-head{
      color: #FFF;
    }
    .trade-component .prototype .you-receive{
      background-color: rgba(white, .05);
      .q-btn:not(.swap_vert){
        background-color: #FFF !important;
        font-size: 16px !important;
        // font-family: $Franklin !important;
        color: #04111F !important;
        border-radius: 40px;
        margin-top: 40px;
        height: 54px;
        width: fit-content !important;
        float: right;
      }
      .swap_vert{
        background-color: #04111F !important;
      }
    }
    .q-tab{
      color: #FFF;
      opacity: .2;
      background: transparent;
      &.q-tab--active{
        opacity: 1;
      }
    }
  }
  /deep/ .q-checkbox__label{
    color: #FFF;
  }
  /deep/ .q-tab--active{
    color: #FFF;
    background: #627797;
  }
  /deep/ .q-tab--inactive{
    color: #627797;
  }
  /deep/ .summary-wrapper__list{
    color: #CCC;
    .q-item__label + .q-item__label{
      color: #FFF;
    }
  }
  /deep/ .multi-swap-path--list{
    .q-item__label{
      color: #CCC;
    }
    .q-item__section{
      align-items: center;
      justify-content: flex-end;
    }
  }
  /deep/ .trade-component {
    .prototype{
      .you-receive{
        background-color: #04111F;
      }
      .head{
        color: #FFF;
      }
      .you-receive-head{
        color: #FFF;
      }
      .you-pay-head{
        color: #FFF;
      }
      .you-pay-body{

      }
      /deep/.swap_vert {
        background-color: #04111F !important;

        .q-btn__wrapper:before {
          border: 3px solid #627797;
        }
      }
    }
    .select-input{
      /deep/ .q-field__control .q-field__native .q-item__label.q-item__label--caption{
        color: #CCC;
      }
    }
  }
  .desktop-version{
      background: #04111F;
      padding-bottom: 8px;
      min-height: 102vh;
      overflow: hidden;
      position: relative;
      scrollbar-width: 0px;
      .col-title h4{
          color: #FFF;
      }
  }
  .chain-tools-wrapper--list .list-wrapper--chain__eos-to-vtx-convertor{
      background-color: #04111F;
  }
  &.mobile-version{
      .chain-tools-wrapper--list .list-wrapper--chain__eos-to-vtx-convertor{
          background-color: #04111F;
      }
      .chain-tools-wrapper--list .list-wrapper--chain__eos-to-vtx-convertor .--subtitle{
          color: #CCC;
      }
      .chain-tools-wrapper--list .list-wrapper .select-input .q-field__control .q-field__native .q-item .q-item__section .q-item__label + .q-item__label{
          color: #CCC !important;
      }
      .chain-tools-wrapper--list .list-wrapper--chain__eos-to-vtx-convertor .--amount{
          color: #FFF !important;
      }
      .chain-tools-wrapper--list .list-wrapper--chain__eos-to-vtx-convertor .--subtitle ul li span{
          color: #CCC;
      }
      /deep/ .q-stepper{
          &.q-dark{
              background: #04111F;
              .q-tab-panels{
                  background: #04111F;
              }
              .q-stepper__title{
                  color: #CCC !important;
              }
          }
      }
      &.chain-tools-wrapper{
          background-color: #04111F;
          .standard-content--title{
              color: #FFF;
              margin-bottom: 10px;
          }
      }
  }
}

.desktop-card-style{
    height: 100%;
    max-height: 95%;
    @media screen and (min-height: 700px) {
        // height: 54.5vh;
        max-height: 95%;
    }
    @media screen and (min-height: 760px) {
        // height: 54vh;
        max-height: 94%;
    }
    @media screen and (min-height: 800px) {
        // height: 55vh;
        max-height: 96%;
    }
    @media screen and (min-height: 870px) {
        // height: 56vh;
        max-height: 94.6%;
    }
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

    &__form {
        /deep/ .q-field__bottom {
            font-size: 10px;
        }

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
                margin-bottom: 40px;
                font-size: 18px;
                font-weight: $regular;
                position: relative;
                line-height: 26px;
                font-family: $Titillium;
                color: $mainColor;
            }
        }
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
        }

        // margin-left: 20px;
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

        .select-provider-wrapper {
            position: absolute;
            right: 20px;
            z-index: 999;
            top: -40px;

            .choice {
                font-size: 14px;
                font-weight: $bold;
                border: 1px solid rgba($mainColor, .2);
                opacity: .5;
                border-radius: 4px;
                box-shadow: 0px 2px 5px 0px rgba(black, .2);
                cursor: pointer;

                &:hover {
                    background-color: rgba($mainColor, .1);
                }

                &.active {
                    opacity: 1;
                    background-color: $mainColor;
                    color: #FFF;
                    box-shadow: 0px 2px 5px 0px rgba($mainColor, .2);
                }
            }
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
                width: 150px;
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
                @media screen and (max-width: 768px) {
                    transform: rotate(90deg);
                }

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

                        span {}
                    }
                }
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
            padding-left: 6%;
            padding-right: 6%;

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
    margin-top: 30px;

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
</style><style lang="scss">
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

.default-view {
    max-width: 200px;
}

body .chain-tools-wrapper--list___2.chain-tools-wrapper--list.open {
  padding-left: 0%;
  padding-right: 0%;
  margin-top: -20px;
}
body .chain-tools-wrapper--list___1.chain-tools-wrapper--list.open {
  padding-left: 0%;
  padding-right: 0%;
  margin-top: -20px;
  @media screen and (max-width: 768px) {
    /deep/ .you-receive-head{
      margin-top: 20px;
    }
    br{
      display: none;
    }
  }
  /deep/ .summary-wrapper{
    padding-bottom: 80px;
  }
  /deep/ .trade-component .prototype .head{
    padding: 5px 0px;
    .--next-btn{
      width: 120px;
      margin-left: -10px;
    }
  }
}
</style>

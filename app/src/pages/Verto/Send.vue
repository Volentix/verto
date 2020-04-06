<template>
  <q-page class="text-black bg-white">
    <div class="send-modal flex flex-center" :class="{'open' : openModal}">
      <div v-if="getPassword" class="send-modal__content column flex-center">
        <div class="send-modal__content--head">
          <span class="text-h5 --amount">Private key password</span>
          <q-btn color="white" rounded flat unelevated @click="hideModalFun()" class="close-btn" text-color="black" label="+" />
        </div>
        <div class="send-modal__content--body column flex-center full-width">
          <q-input
            v-model="privateKeyPassword"
            light
            rounded
            outlined
            class="full-width"
            color="green"
            label="Private Key Password"
            @input="checkPrivateKeyPassword"
            debounce="500"
            @keyup.enter="toSummary"
            :type="isPwd ? 'password' : 'text'"
            :error="invalidPrivateKeyPassword"
            error-message="The private key password is invalid"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div class="flex justify-start full-width">
            <q-btn @click="openModal = false" unelevated color="grey" class="--next-btn mr10" rounded label="Cancel" />
            <q-btn @click="toSummary()" unelevated color="deep-purple-14" class="--next-btn" rounded label="Submit transaction" />
          </div>

        </div>
        <div class="send-modal__content--footer">
          <div class="text-h4 --error">{{ ErrorMessage }}</div>
        </div>
      </div>
      <div v-else class="send-modal__content column flex-center">
        <div class="send-modal__content--head">
          <span class="text-h5 --amount">25.5 VTX</span>
          <q-btn color="white" rounded flat unelevated @click="hideModalFun()" class="close-btn" text-color="black" label="+" />
        </div>
        <div class="send-modal__content--body column flex-center">
          <q-circular-progress
              :value="progressValue"
              size="100px"
              :thickness="0.05"
              color="cyan-5"
              track-color="grey-3"
              class="q-ma-md" />
          <svg class="svg_logo" fill="#7272FA" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58"><path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path></svg>
          <div class="--label text-cyan-5 text-h6">Sent Successfully</div>
        </div>
        <div class="send-modal__content--footer">
          <div class="text-h4 --email">To Mojgan@verto.crux</div>
        </div>
      </div>
    </div>
    <div class="standard-content">
      <h2 class="standard-content--title flex justify-center"><q-btn flat unelevated class="btn-align-left" to="/verto/dashboard" text-color="black" icon="keyboard_backspace" /> Send </h2>
      <div class="standard-content--body">
        <div class="standard-content--body__form">
          <span class="lab-input">From</span>
          <q-input v-model="from" rounded class="input-input pr80" outlined color="purple" type="text" label="Current EOS Account">
            <template v-slot:append>
              <div class="flex justify-end">
                <q-btn flat unelevated text-color="grey" round class="btn-copy" icon="o_file_copy" />
              </div>
            </template>
          </q-input>
          <span class="lab-input">Amount</span>
          <q-input v-model="sendAmount" class="input-input" rounded outlined color="purple" type="number">
            <template v-slot:append>
              <div class="flex justify-end">
                <span class="tokenID">{{ params.tokenID }}</span>
                <q-btn color="white" rounded class="mt-5" @click="getMaxBalance()" outlined unelevated flat text-color="black" label="Max" />
               </div>
            </template>
          </q-input>

          <span class="lab-input">To</span>
          <q-input ref="sendTo" v-model="sendTo" @input="checkTo()" rounded class="input-input pr80" outlined color="purple" type="text" label="Account name">
            <template v-slot:append>
              <div class="flex justify-end">
                <!-- <q-btn flat unelevated round class="btn-copy"><span class="qr-btn"><img src="statics/qr-icon.png" alt=""></span> </q-btn> -->
                <q-btn flat unelevated text-color="grey" round class="btn-copy" icon="o_file_copy" />
              </div>
            </template>
          </q-input>

          <span class="lab-input">Memo</span>
          <q-input ref="sendMemo" v-model="sendMemo" @input="checkMemo" error-message="Memo is required on this exchange, check your deposit instructions" rounded outlined class="" color="purple" type="textarea"/>

        </div>
        <br>
        <!-- <div class="total-fee flex justify-between">
          <span class="label">Total Fee</span>
          <span class="value">0.03254 {{ params.tokenID }}</span>
        </div> -->
      </div>
      <div class="standard-content--footer">
         <q-btn flat class="action-link next" color="black" @click="openModalFun()" text-color="white" label="Transfer" />
      </div>
    </div>
  </q-page>
</template>

<script>
// import RadialProgressBar from 'vue-radial-progress'
import configManager from '@/util/ConfigManager'
import EosWrapper from '@/util/EosWrapper'
// const eos = new EosWrapper()
import { version } from '../../../package.json'
let platformTools = require('../../util/platformTools')
if (platformTools.default) platformTools = platformTools.default

export default {
  components: {
    // RadialProgressBar
  },
  data () {
    return {
      progressValue: 20,
      openModal: false,
      currentWallet: null,
      sendTo: '',
      to: '',
      from: '',
      isPwd: true,
      sendAmount: 1,
      formatedAmount: '',
      // { selected: false, slug: 'btc-xyz', name: 'BTC xyz', purcent: '1.02%', to: '/verto/wallets/btc-xyz', icon: 'statics/coins_icons/btc.png', amount: '0.023 BTC', amountUSD: '$235.21' },
      // { selected: false, slug: 'vtx', name: 'VTX', purcent: '1.02%', to: '/verto/wallets/vtx', icon: 'statics/coins_icons/vtx.png', amount: '0.023 BTC', amountUSD: '$235.21' },
      // { selected: false, slug: 'eth', name: 'ETH', purcent: '1.02%', to: '/verto/wallets/eth', icon: 'statics/coins_icons/eth.png', amount: '0.023 BTC', amountUSD: '$235.21' },
      // { selected: false, slug: 'dash', name: 'DASH', purcent: '1.02%', to: '/verto/wallets/dash', icon: 'statics/coins_icons/dash.png', amount: '0.023 BTC', amountUSD: '$235.21' },
      // { selected: false, slug: 'riple', name: 'Riple', purcent: '1.02%', to: '/verto/wallets/riple', icon: 'statics/coins_icons/ripple.png', amount: '0.023 BTC', amountUSD: '$235.21' }
      options: [],
      optionsStatic: [
        {
          label: 'BTC xyz',
          value: 'btc-xyz',
          image: 'statics/coins_icons/btc.png'
        },
        {
          label: 'VTX',
          value: 'vtx',
          image: 'statics/coins_icons/vtx.png'
        },
        {
          label: 'ETH',
          value: 'eth',
          image: 'statics/coins_icons/eth.png'
        },
        {
          label: 'DASH',
          value: 'dash',
          image: 'statics/coins_icons/dash.png'
        },
        {
          label: 'Riple',
          value: 'riple',
          image: 'statics/coins_icons/ripple.png'
        }
      ],
      minimizedModal: false,
      message: '',
      version: {},
      network: this.$store.state.settings.network,
      configPath: '',
      tableData: [],
      sendMemo: '',
      chainID: '',
      tokenID: '',
      accountName: '',
      params: null,
      getPassword: false,
      invalidPrivateKeyPassword: false,
      privateKeyPassword: '',
      unknownError: false,
      ErrorMessage: '',
      invalidEosName: false,
      tokenPrecision:
      {
        'EOS': 4,
        'VTX': 8
      },
      tokenContract:
      {
        'EOS': 'eosio.token',
        'VTX': 'volentixgsys'
      }
    }
  },
  created () {
    this.params = this.$store.state.currentwallet.params
    this.from = this.params.accountName
    this.chainID = this.params.chainID
    this.tokenID = this.params.tokenID
    this.accountName = this.params.accountName
    // let self = this
  },
  mounted () {
    this.version = version
    this.setupPlatformPath()
  },
  methods: {
    checkMemo () {
      if (this.sendMemo.length > 0) {
        this.$refs.sendMemo.error = false
      } else if (this.sendTo.toLowerCase() === 'stexofficial') {
        this.$refs.sendMemo.error = true
      }
    },
    checkTo () {
      this.invalidEosName = false
      if (this.sendTo.length === 12) {
        if (this.sendTo.toLowerCase() === 'stexofficial') {
          this.$refs.sendMemo.error = true
        }
      } else {
        this.$refs.sendMemo.error = false
      }
    },
    getMaxBalance () {
      this.sendAmount = this.params.balance
    },
    getImages (symbol) {
      console.log('symbol', symbol)
      if (symbol === 'verto') {
        return '/statics/icon.png'
      } else {
        return symbol ? 'https://files.coinswitch.co/public/coins/' + symbol.toLowerCase() + '.png' : false
      }
    },
    async setupPlatformPath () {
      this.configPath = await platformTools.filePath()
    },
    goChangePassword: function () {
      this.$router.push({ path: '/change-password' })
    },
    setNetwork: function () {
      this.$store.dispatch('settings/toggleNetwork', this.network)
      this.$q.notify({ message: `Network changed to ${this.network}`, color: 'positive' })
    },
    async backupConfig () {
      try {
        await configManager.backupConfig()
        if (this.$q.platform.is.android) {
          this.$q.notify({ color: 'positive', message: 'Config Saved' })
        }
      } catch (e) {
        // TODO: Exception handling
      }
    },
    openModalFun: function (item) {
      if (this.$store.state.currentwallet.wallet.privateKey) {
        this.sendTokens()
      } else {
        this.getPassword = true
        this.openModal = true
      }
    },
    checkPrivateKeyPassword () {
      console.log('this.$store.state.currentwallet.wallet.privateKeyEncrypted', this.$store.state.currentwallet.wallet.privateKeyEncrypted)
      console.log('this.privateKeyPassword', this.privateKeyPassword)
      const privateKey = JSON.stringify(this.$store.state.currentwallet.wallet.privateKeyEncrypted)
      const result = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKey)

      if (!result.success) {
        this.invalidPrivateKeyPassword = true
      }
    },
    async sendTokens () {
      this.unknownError = false
      this.invalidEosName = false
      let privateKey = null
      let result = null
      if (this.$store.state.currentwallet.wallet.privateKey) {
        result = {
          success: true,
          key: this.$store.state.currentwallet.wallet.privateKey
        }
      } else {
        privateKey = JSON.stringify(this.$store.state.currentwallet.wallet.privateKeyEncrypted)
        result = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKey)
      }
      // Remove the private key immediately so it
      // does not stick around any longer than it has to

      // this.showSpinners(true)
      console.log('result', result)

      try {
        const transaction = await (new EosWrapper()).transferToken(
          this.tokenContract[this.params.tokenID.toUpperCase()],
          this.params.accountName,
          this.sendTo.toLowerCase(),
          this.formatedAmount,
          this.sendMemo,
          result.key
        )
        this.transactionId = transaction.transaction_id
        // this.showSpinners(false)
        // this.navigation.paymentSuccessful = true
        this.getPassword = false
      } catch (err) {
        console.log('err', err)
        if (err && err.message && err.message.startsWith('Invalid character')) {
          this.invalidEosName = true
        } else if (err.includes('account does not exist')) {
          this.invalidEosName = true
        } else if (err.includes('maximum billable CPU time')) {
          this.unknownError = true
          this.ErrorMessage = 'Your EOS account does not have enough CPU staked to process the transaction.'
        } else if (err.includes('has insufficient ram')) {
          this.unknownError = true
          this.ErrorMessage = 'Your EOS account does not have enough RAM staked to process the transaction.'
        } else {
          this.unknownError = true
          this.ErrorMessage = 'Unknown Error'
        }
        // this.showSpinners(false)
        return false
      }
    },
    toSummary () {
      if (!this.invalidPrivateKeyPassword) {
        this.formatedAmount = this.formatAmountString()
        this.sendTokens()
      }
    },
    formatAmountString () {
      let numberOfDecimals = 0
      let stringAmount = (Math.round(+this.sendAmount * Math.pow(10, this.tokenPrecision[this.params.tokenID.toUpperCase()])) / Math.pow(10, this.tokenPrecision[this.params.tokenID.toUpperCase()])).toString()

      const amountParsed = stringAmount.split('.')
      if (amountParsed && amountParsed.length > 1) {
        numberOfDecimals = amountParsed[1].length
      } else {
        stringAmount += '.'
      }
      for (;numberOfDecimals < this.tokenPrecision[this.params.tokenID.toUpperCase()]; numberOfDecimals++) {
        stringAmount += '0'
      }
      return stringAmount + ' ' + this.params.tokenID.toUpperCase()
    },
    hideModalFun: function () {
      this.openModal = false
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "~@/assets/styles/variables.scss";
  .standard-content{
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh !important;
    padding-bottom: 100px;
    &--title{
      font-size: 35px;
      font-weight: $bold;
      position: relative;
      line-height: 50px;
      font-family: $Titillium;
      margin-top: 0px;
      margin-bottom: 0px;
      .btn-align-left{
        position: absolute;
        left: -15px;
        top: 10px;
      }
    }
    &--desc{
      margin-top: -20px;
      margin-bottom: 40px;
      font-size: 18px;
      font-weight: $regular;
      position: relative;
      line-height: 26px;
      font-family: $Titillium;
      color: $mainColor;
    }
    &--body{
      &__img{
        min-height: 250px;
        img{
          max-width: 90%;
        }
      }
      .total-fee{
        padding: 0px 20px;
        font-family: $Titillium;
        font-weight: $regular;
        color: #B0B0B0;
        font-size: 16px;
      }
      &__form{
        .tokenID{
          text-transform: uppercase;
          font-size: 20px;
          font-weight: 900;
          color: #7271fa;
          padding-top: 0px;
          margin-top: -2px;
        }
        /deep/ .q-field__native{
          padding-left: 8px;
          font-size: 16px;
          font-weight: $regular;
        }
        /deep/ .q-field__label{
          font-family: $Titillium;
          font-weight: $regular;
          font-size: 18px;
          padding-left: 10px;
          margin-top: -2px;
        }
        .input-input{
          height: 50px;
          /deep/ .q-field__control{
            height: 50px;
            min-height: unset;
          }
          .btn-copy{
            height: 30px;
            position: relative;
            top: -3px;
            margin-right: 0px;
            padding: 6px 13px;
          }
          .qr-btn{
            width: 30px;
            height: 30px;
            padding-right: 8px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img{
              width: 25px;
              height: 25px;
              position: relative;
              right: -5px;
              transform: scale3d(1, 1, 1);
            }
          }
        }
        .select-input{
          border-radius: 100px !important;
          $height: 50px;
          height: $height;
          /deep/ .q-field__marginal{
            height: $height;
            min-height: unset;
          }
          /deep/ .q-field__control{
            height: $height;
            min-height: unset;
            .q-field__native{
              padding-left: 0px;
              padding-top: 0px;
              padding-bottom: 0px;
              height: $height;
              min-height: unset;
              .q-item{
                padding: 0px;
                padding-left: 18px;
                min-height: $height;
                padding-bottom: 0px;
                .q-item__section{
                  padding-right: 0px;
                  min-width: 36px;
                  .q-item__label + .q-item__label {
                    margin-top: 0px;
                  }
                }
              }
            }
          }
        }
        .lab-input{
          font-family: $Titillium;
          font-weight: $regular;
          font-size: 16px;
          color: black;
          padding-left: 20px;
          padding-bottom: 5px;
        }
        /deep/ .option--avatar{
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
        }
      }
    }
    &--footer{
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: flex-end;
      min-height: fit-content;
      .action-link{
        height: 50px;
        text-transform: initial !important;
        font-size: 16px;
        letter-spacing: .5px;
        border-radius: 40px;
        width: 150px;
        margin-left: 10px;
        background-color: #7272FA !important;
        // &.next{
        //   background-color: #7900FF !important;
        // }
        // &.back{
        //   background-color: #B0B0B0 !important;
        // }
      }

    }
  }
  .send-modal{
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(black, .5);
    left: 0px;
    top: 0px;
    z-index: 999999;
    visibility: hidden;
    opacity: 0;
    transition: opacity ease .4s;
    &.open{
      visibility: visible;
      opacity: 1;
      .send-modal__content{
        transform: scale(1);
      }
    }
    &__content{
      background-color: #fff;
      border-radius: 20px;
      max-width: 85%;
      padding: 20px;
      width: 100%;
      box-shadow: 0px -2px 9px 0px rgba(black, .29);
      position: relative;
      transform: scale(0);
      transition: ease transform .3s, opacity ease .2s;
      &--head{
        margin-bottom: 20px;
        .close-btn{
          position: absolute;
          right: 10px;
          top: 10px;
          font-size: 40px;
          font-weight: $light;
          font-family: $Titillium;
          height: 40px;
          width: 40px;
          min-height: unset;
          opacity: .3;
          /deep/ .q-btn__content{
            transform: rotate(45deg);
            min-height: unset;
            line-height: 30px;
            margin-left: 5px;
            margin-top: -4px;
          }
        }
        .--amount{
          font-size: 25px;
          font-weight: $bold;
          font-family: $Titillium;
          margin-top: 20px;
          position: relative;
          top: -9px;
        }
      }
      &--body{
        position: relative;
        .svg_logo{
          fill: #00D0CA;
          position: absolute;
          margin-top: 5px;
          width: 50px;
        }
        .--label{
          font-size: 14px;
          font-weight: $regular;
          font-family: $Titillium;
          position: absolute;
          bottom: -15px;
        }
      }
      &--footer{
        .--email{
          font-size: 16px;
          font-weight: $bold;
          font-family: $Titillium;
          margin-top: 20px;
        }
        .--error{
          color: red;
          font-size: 14px;
          margin-top: 20px;
          font-weight: $bold;
          font-family: $Titillium;
          line-height: 16px;
        }
      }
    }
  }
  .max200{
    max-width: 200px;
  }
  .mt-5{
    margin-top: -5px;
  }
  .mr10{
    margin-right: 10px;
  }
</style>

<template>
  <q-page v-if="false" class="column items-center justify-start create-keys-page">
    <div class="q-pa-md">
      <img src="statics/icons/icon-256x256.png"  width="150" alt="logo"/>
    </div>
    <notify-message/>
    <div style="flex-grow: 1;display: flex;flex-direction: column; width: 100%">
      <div v-if="step===2" class="vert-page-content" style="padding-bottom: 0px">
          <div class="vert-page-content--body">
              <h2 class="vert-page-content--title"> Creating keys... </h2>
              <!-- <p class="diclaimer"> {{ status }} </p> -->
              <div class="standard-content--body">
                  <div class="send-modal__content--body column flex-center">
                      <q-circular-progress :value="progress" size="120px" :thickness="0.05" color="blue" track-color="blue-1" class="q-ma-md" show-value font-size="20px" />
                      <!-- <svg class="svg_logo" fill="#7272FA" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58">-->
                      <!-- <path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path>-->
                      <!-- </svg>-->
                      <div class="--label text-h6">{{ progress }} %</div>
                  </div>
                  <div class="send-modal__content--footer" v-if="status">
                      <div class="text-h6 q-mb-none --status">Creating keys for: </div>
                      <div class="text-h6 text-center --name">
                        <q-icon class="q-pr-sm" size="sm" :name="'img:'+ (status.icon ?  status.icon : 'https://files.coinswitch.co/public/coins/'+status.value+'.png')"/>{{status.label}}
                      </div>
                  </div>
                  <div class="flex-end flex justify-end" v-if="false">
                      <q-btn class="action-link next" color="deep-purple-14" text-color="white" label="Next" @click="step=3" :disable="!mapped" />
                  </div>
              </div>
          </div>
      </div>
      <div v-if="step===3" class="vert-page-content" style="">
  <!--            <div class="vert-page-content&#45;&#45;body">-->
              <h2 v-if="$store.getters['notify/message']==''" class="vert-page-content--title  text-center">Congratulations!</h2>
        <div class="vert-page-content--body" style="justify-content: start">
          <p class="vert-page-content--desc">
            Disclaimer
            <br/>
            <span v-if="$store.state.settings.backupConfig">
                    Download your new config. <br>
                    It contains your old config accounts and your newly created accounts.
                    Save your 24 words and your new config. If you restore your wallet without using this new config, it will not include the newly created accounts.
                    <br>
                    <q-btn @click="backupConfig" label="Click to Download" icon="file_download" class="q-mt-md" color="red" flat/>
                  </span>
            <span v-else>
                  Your 24 words are very important! <br>
                  Keep them stored somewhere safe. <br>
                  The position of each word is critical and should be stored in the correct sequence.<br><br>
                  Anyone with access to these 24 words will be able to recover this Verto app and the private keys it is associated with,
                  so keep in a safe place that only you have access to.
                  </span>
          </p>
              <p  class="q-py-sm text-bold" v-if="$store.state.settings.dexData.depositCoin && $store.state.settings.dexData.depositCoin && false"> Click go to exchange to swap {{$store.state.settings.dexData.fromAmount}}  {{$store.state.settings.dexData.depositCoin.value.toUpperCase()}} to {{$store.state.settings.dexData.destinationCoin.value.toUpperCase()}}</p>
          </div>
        <div class="vert-page-content--footer" style="padding-bottom: 30px">
          <q-btn class="btn__blue" size="lg" @click="dataRefresh()" unelevated label="Start Trading"/>
        </div>
      </div>
    </div>
  </q-page>
  <q-page v-else class="column items-center justify-start login-page restore-page-wrapper" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <div class="full-width full-height">
      <img :src="'statics/login_ui_' + ($store.state.settings.lightMode === 'true' ? 'dark':'light') +'.png'" alt="head-login" class="head-login" />
      <div class="form_wrapper full-height column q-pa-lg">
        <span class="text-h2 q-pl-md">VERTO</span>
        <span class="text-h3 q-pl-md q-pr-md q-mt-md" v-if="step===2">Creating keys</span>
        <span class="text-h3 q-pl-md q-pr-md q-mt-md" v-if="$store.getters['notify/message']=='' && step===3">Congratulations!</span>
        <!-- <p class="q-pl-md q-pr-md q-mt-md" v-if="status && step===2">Creating keys ({{ progress }} %)</p> -->
        <div class="password_wrapper q-pl-md q-pr-md">
          <div v-if="step==2" class="full-width">
            <div class="full-width q-pt-md">
              <q-circular-progress center-color="transparent" font-size="14px" show-value dark :value="progress" size="90px" :thickness="0.06" color="white" track-color="transparent"/>
              <div v-if="status">
                <div class="q-mt-md flex justify-start items-center">
                  <q-icon class="q-pr-sm q_icon_coin" size="sm" :name="'img:'+ (status.icon ?  status.icon : 'https://files.coinswitch.co/public/coins/'+status.value+'.png')"/>
                  <p class="text-grey-4"> {{status.label}}</p>
                </div>
              </div>
            </div>
            <div class="unlock_restore flex justify-between items-end q-mt-sm">
              <q-btn unelevated class="btn__blue unlock_btn" color="grey-4" outline size="md" label="Next" no-caps @click="step=3" :disable="!mapped" />
              <b></b>
            </div>
          </div>
          <div v-if="step==3" class="full-width">
            <div class="full-width">
              <p class="q-mt-md text-bold">Disclaimer</p>
              <p v-if="$store.state.settings.backupConfig" class="q-mt-md">
                Download your new config. <br>
                It contains your old config accounts and your newly created accounts.
                Save your 24 words and your new config. If you restore your wallet without using this new config, it will not include the newly created accounts. <br>
              </p>
              <p v-else class="q-mt-md">
                Your 24 words are very important! <br>
                Keep them stored somewhere safe.<br><br>
                Anyone with access to these 24 words will be able to recover this Verto app and the private keys it is associated with,
                so keep in a safe place that only you have access to.
              </p>
              <p class="q-mt-md" v-if="$store.state.settings.dexData.depositCoin && $store.state.settings.dexData.depositCoin && false">Click go to exchange to swap {{$store.state.settings.dexData.fromAmount}}  {{$store.state.settings.dexData.depositCoin.value.toUpperCase()}} to {{$store.state.settings.dexData.destinationCoin.value.toUpperCase()}}</p>
            </div>
            <div class="unlock_restore unlock_restore2 flex justify-between items-end q-mt-sm">
              <q-btn @click="dataRefresh()" unelevated label="Get Started" class="btn__blue unlock_btn" color="grey-4" outline size="md" no-caps />
              <q-btn @click="backupConfig" label="Download" icon="file_download" class="q-mt-md" no-caps color="red-5" outline />
            </div>
          </div>
        </div>
      </div>
    </div>
    <notify-message/>
  </q-page>
</template>

<script>
import Vue from 'vue'
import VideoBg from 'vue-videobg'
import Lib from '@/util/walletlib'
Vue.component('video-bg', VideoBg)
import HD from '@/util/hdwallet'
// const localStorageKeysToDelete = ['walletPublicDatav2', 'hideEosSetup', 'disableIntros_home', 'disableIntro_defi', 'closewizard', 'disable_freeospopup']
// I have setup your symbols into a sandbox wallet named testwallet.
// You can proceed with development with this as your walletName.
// IDs will be created as foo@testwallet.crux
import EosWrapper from '@/util/EosWrapper'
import NotifyMessage from '../../../components/notify/NotifyMessage'
const eos = new EosWrapper()
export default {
  components: { NotifyMessage },
  data () {
    return {
      step: 2,
      error: false,
      errorMessage: '',
      walletClientName: 'verto', // should be 'verto' when in prod // testwallet
      vertoPassword: this.$store.state.settings.temporary, // TODO empty temporary
      config: this.$store.state.currentwallet.config,
      loading: false,
      mapped: false,
      addressMap: null,
      showMap: false,
      state: null,
      status: null,
      progress: 0,
      available: false,
      assets: {},
      names: [{
        'value': 'btc',
        'label': 'Bitcoin'
      },
      {
        'value': 'eth',
        'label': 'Account 1'
      },
      {
        'value': 'bnb',
        'label': 'Binance Chain'
      },
      {
        'value': 'ltc',
        'label': 'Litecoin'
      },
      {
        'value': 'dash',
        'label': 'DASH'
      },
      // { 'value': 'eos', 'label': 'EOS Key' },
      // { 'value': 'steem', 'label': 'STEEM Key' },
      // { 'value': 'xrp', 'label': 'Ripple' },
      // { 'value': 'ada', 'label': 'Cardano' },
      {
        'icon': 'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png',
        'value': 'avax',
        'label': 'Avalanche'
      },
      {
        'value': 'dot',
        'label': 'Polkadot'
      },
      { 'icon': 'https://verto.volentix.io/statics/img/terra.png',
        'value': 'terra',
        'label': 'Terra'
      },
      { 'icon': 'https://assets.coingecko.com/coins/images/9568/small/m4zRhP5e_400x400.jpg',
        'value': 'ksm',
        'label': 'Kusama'
      },
      {
        'icon': 'https://assets.coingecko.com/coins/images/4128/small/coinmarketcap-solana-200.png',
        'value': 'sol',
        'label': 'Solana'
      },
      {
        'value': 'xlm',
        'label': 'Stellar Lumens'
      },
      {
        'value': 'xtz',
        'label': 'Tezos'
      }
      ],
      message: '',
      messageType: 'success'
    }
  },
  created () {},
  async mounted () {
    this.step = 2
    this.putAddress()
    // //console.log('addressMap', this.addressMap, 'show?', this.showMap)
  },
  computed: {},
  methods: {

    async backupConfig () {
      try {
        await this.$configManager.backupConfig()
        if (this.$q.platform.is.android) {
          this.$store.dispatch('notify/success', 'Config Saved')
          // this.$q.notify({ color: 'positive', message: 'Config Saved' })
        }
      } catch (e) {
        // TODO: Exception handling
      }
    },
    copyToClipboard (key, copied) {
      this.$clipboardWrite(key)
      this.$store.dispatch('notify/success', copied ? copied + ' Copied' : 'Key Copied')
      // this.$q.notify({
      //   message: copied ? copied + ' Copied' : 'Key Copied',
      //   timeout: 2000,
      //   icon: 'check',
      //   textColor: 'white',
      //   type: 'warning',
      //   position: 'top'
      // })
    },
    async putAddress () {
      const self = this
      let count = this.names.length
      let i = 0

      for (const name of this.names) {
        i++
        this.progress = Math.round(i / count * 10000) / 100

        this.status = name

        await HD.Wallet(name.value).then(async keys => {
          return self.$configManager.saveWalletAndKey(name.label, self.vertoPassword, null, keys.publicKey, keys.privateKey, name.value, 'mnemonic')
        })
      }

      // //console.log('map', map)
      // this.mapped = true
      this.step = 3
    },
    associateEOSAccount () {
      let tableData = [ ...this.$store.state.currentwallet.config.keys ]
      let currentAccount = tableData.find(w => w.chain === 'eos' && w.type === 'verto')
      if (!currentAccount) return
      eos.getAccountNamesFromPubKeyP(currentAccount.key)
        .then((result) => {
          if (result.account_names.length) {
            currentAccount.type = 'eos'
            currentAccount.name = result.account_names[0]
            currentAccount.to = `/verto/wallets/${currentAccount.chain}/${currentAccount.type}/${currentAccount.name}`
            currentAccount.icon = 'https://files.coinswitch.co/public/coins/eos.png'
            this.$configManager.updateConfig(this.vertoPassword, this.$store.state.currentwallet.config)
          }
        }).catch((err) => {
          this.$store.dispatch('notify/error', err)
          this.$q.notify({
            color: 'negative',
            message: err
          })
        })
    },
    async dataRefresh (to = '/verto/dashboard') {
      const self = this
      this.$store.state.wallets.tokens = []

      try {
        /*
        localStorageKeysToDelete.forEach(key => {
          localStorage.removeItem(key)
        })
        */
        this.associateEOSAccount()
      } catch (error) {
        // console.log('initWallet error', error)
      }
      this.$store.dispatch('notify/success', 'Application refreshing')
      // this.$q.notify({
      //   color: 'positive',
      //   position: 'top',
      //   message: 'Application refreshing'
      // })

      this.$store.state.currentwallet.wallet = {
        empty: true
      }
      Lib.removeExpiredData(0)
      setTimeout(function () {
        self.$router.push({
          path: to
        })
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
@import "~@/assets/styles/auth_page.scss";

.create-keys-page{
  background: #F5F5FE
}
//.vert-page-content {
//  padding: 0 10% 10% 10%;
//  flex-grow: 1;
//  width: 100%;
//  display: flex;
//  flex-direction: column;
//  justify-content: flex-start;
//
//  &--title {
//    font-size: 18px;
//    font-weight: 600;
//    line-height: 24px;
//    font-family: $Franklin;
//    position: relative;
//    margin-left: 0%;
//    margin-top: 0px;
//    text-align: center;
//
//    &__sub {
//      font-size: 14px;
//      font-weight: 400;
//      text-align: center;
//      line-height: 14px;
//      margin-top: 0px;
//    }
//  }
//
//  &--desc {
//    font-size: 14px;
//    font-weight: $regular;
//    line-height: 16px;
//    font-family: $Titillium;
//  }
//
//  &--body {
//    flex-grow: 1;
//    display: flex;
//    flex-direction: column;
//    justify-content: space-evenly;
//    margin-top: 5%;
//    margin-bottom: 5%;
//
//    @media screen and (min-width: 768px) {
//      margin-top: 5%;
//      margin-bottom: 0%;
//      max-width: 400px;
//      margin-left: auto !important;
//      margin-right: auto !important;
//    }
//
//    &.extra__px {
//      padding: 0 70px;
//    }
//  }
//
//  &--footer {
//    padding: 0 70px;
//    display: flex;
//    flex-direction: column;
//    justify-content: center;
//  }
//  /deep/ .q-field--focused .q-field__label {
//  }
//  /deep/ .q-field--outlined .q-field__control{
//    background-color: #fff
//  }
//  /deep/ .q-field--outlined .q-field__control:after {
//    border: 2px solid #E1E1E9;
//    //background-color: #fff;
//    //box-shadow: 0px 0px 10px 0px #E1E1E9;
//  }
//
//  /deep/ .q-field--outlined .q-field__control:before {
//    border: 2px solid #E1E1E9;
//    //background-color: #fff;
//    //box-shadow: 0px 0px 10px 0px #E1E1E9;
//  }
//
//  /deep/ .q-field--outlined.q-field--focused .q-field__control:after {
//    border: 2px solid #c4c4c6;
//    //background-color: #fff;
//    //box-shadow: 0px 0px 10px 0px #d4d4db;
//  }
//
//  /deep/ .q-field--outlined.q-field--focused .q-field__control:before {
//    border: 2px solid #c4c4c6;
//    //background-color: #fff;
//    //box-shadow: 0px 0px 10px 0px #d4d4db;
//  }
//
//  /deep/ .q-field--dark:not(.q-field--focused) .q-field__label,
//  /deep/ .q-field--dark .q-field__marginal,
//  /deep/ .q-field--dark .q-field__bottom {
//  }
//}
.row {
    .col {
      &.menu {
        a {
          font-weight: $regular;
          font-family: $Titillium;
          font-size: 16px;
          color: #333;
          text-decoration: none;
          padding: 5px 10px;
          border-radius: 5px;

          &:hover {
            background-color: rgba(black, 0.02);
          }
        }
      }

      &.app-logo {
        a {
          font-weight: $lighter;
          text-transform: uppercase;
          font-family: $Titillium;
          font-size: 25px;
          color: #FFF;
          text-decoration: none;
        }
      }

      cursor: pointer;
      position: relative;
    }
  }
.standard-content {
    padding: 5%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // min-height: 50vh !important;
    max-width: 800px;
    margin: auto;

    @media screen and (min-width: 768px) {
        padding-top: 20px;
        padding-bottom: 20px !important;
    }

    &--title {
        font-size: 27px;
        font-weight: $bold;
        position: relative;
        line-height: 40px;
        font-family: $Titillium;
        margin-top: 20px;
        margin-bottom: 30px;

        // word-break: break-all;
        .cruxid {
            font-size: 18px;
            font-weight: $light;
            // display: block;
            background-color: rgba(black, .02);
            padding: 0px 20px;
            border-radius: 10px;
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
        min-height: 90vh;

        @media screen and (min-width: 768px) {
            min-height: 50vh;
        }

        .diclaimer {
            strong {
                display: block;
                font-size: 18px;
                font-family: $Titillium;
                font-weight: $bold;
                margin-bottom: 10px;
            }
        }

        &__img {
            // min-height: 200px;
            $width: 170px;
            width: $width;
            height: $width;
            border-radius: $width;
            overflow: hidden;
            margin: 0px auto;
            margin-top: 30px;
            margin-bottom: 40px;

            img {
                max-width: 100%;
            }
        }

        &__form {
            .label {
                padding-left: 21px;
                font-size: 18px;
                margin-bottom: 5px;
                display: block;
            }

            /deep/ .q-field__messages {
                font-size: 14px;
                font-weight: 600;
                color: #FFB200;
                padding-left: 11px;
            }

            /deep/ .q-field__native {
                padding-left: 8px;
                font-size: 16px;
                font-weight: $regular;
            }

            /deep/ .q-field__label {
                font-family: $Titillium;
                font-weight: $bold;
                font-size: 18px;
                padding-left: 10px;
            }

            .flex-end {
                margin-top: 0px;
            }

            .action-link {
                height: 50px;
                text-transform: initial !important;
                font-size: 16px;
                letter-spacing: .5px;
                border-radius: 40px;
                width: 210px;
                margin-left: 10px;
                margin-top: 10px;
            }
        }
    }

    &--footer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-end;
        min-height: 50px;

        .crux-label {
            font-size: 14px;
            color: #B0B0B0;
            font-weight: $light;
            font-family: $Titillium;
        }
    }
}

.send-modal {
    &__content {
        &--body {
            /deep/ .q-circular-progress__text {
                display: none !important;
            }

            position: relative;

            .svg_logo {
                fill: #00D0CA;
                position: absolute;
                margin-top: 5px;
                width: 90px;
            }

            .--label {
                font-size: 18px;
                font-weight: $light;
                font-family: $Titillium;
                position: absolute;
                //bottom: -20px;
            }
        }

        &--footer {
            .--status {
                font-size: 18px;
                font-family: $Titillium;
                margin-top: 40px;
                text-align: center;

            }
            .--name{
              font-size: 18px;
            }
        }
    }
}

.cruxid-input {
    width: 81%;

    /deep/ .q-field__native {
        color: #6200ea !important;
    }

    /deep/ .q-field__control:before {
        border: none;
    }
}
.dark-theme{
  background: #04111F !important;
  .send-modal__content--footer .--status{
    color: #FFF;
  }
  .diclaimer{
    color: #CCC;
  }
  .standard-content--title{
    color: #FFF;
  }
}
.app-logo-row{
  position: relative;
  width: 60%;
  .app-logo{
    position: absolute !important;
    left: 0px;
    z-index: 9;
  }
}
.restore-page-wrapper{
  background: #F9F9F9;
  .head-login{
    max-width: 100%;
    position: relative;
    transform: scale3d(1,1,1);
  }
  .form_wrapper{
    border-radius: 50px 50px 0px 0px;
    margin-top: -100px;
    background: #F9F9F9;
    position: relative;
    z-index: 2;
    box-shadow: 0px -30px 50px 0px rgba(black, .1);
    .text-h2{
      font-family: $Franklin;
      font-weight: $black;
      font-size: 20px;
      line-height: 30px;
      color: #04111F;
    }
    .text-h3{
      font-family: $Franklin;
      font-weight: $lighter;
      font-size: 30px;
      line-height: 35px;
      color: #04111F;
    }
    p{
      font-family: $Franklin;
      font-weight: $lighter;
      font-size: 14px;
      line-height: 22px;
      color: #04111F;
    }
    .unlock_restore{
      min-height: 95px;
      &.unlock_restore2{
        min-height: 95px;
      }
      .unlock_btn{
        width: 49%;
        font-weight: $lighter;
        font-family: $Franklin;
        font-size: 14px !important;
        /deep/ .q-btn__wrapper:before{
          border: 2px solid #CCC !important;
        }
      }
      .restore_btn{
        width: 30%;
        height: 45px;
        letter-spacing: 1px;
        font-weight: $lighter;
        font-family: $Franklin;
        font-size: 16px !important;
      }
    }
  }
  &.dark-theme{
    background: #04111F;
    .form_wrapper{
      background: #04111F;
      .text-h2{
        color: #FFF;
      }
      .text-h3{
        color: #FFF;
      }
      p{
        color: #FFF;
      }
      .restore_btn{
        // color: #FFF !important;
      }
    }
  }
}
.password_wrapper{
  /deep/ .q-field__messages{
    color: #929398;
    font-size: 14px;
    margin-left: -10px;
    margin-top: -4px;
  }
  /deep/ .text-negative {
    color: #929398 !important;
  }
  /deep/ .q-field__native{
    div{
      font-size: 12px;
      opacity: .7;
    }
  }
}
.dark-theme{
  .password_wrapper{
    /deep/ .q-field__messages{
      color: #FFF;
    }
    /deep/ .text-negative {
      color: #FFF !important;
    }
  }
}
.q_icon_coin{
  position: relative;
  top: -7px;
}
/deep/ .q-circular-progress__text{
  color: #FFF !important;
}
</style>

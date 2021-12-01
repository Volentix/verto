<template>
  <q-page :class="{'dark-theme': $store.state.settings.lightMode === 'true', 'text-black bg-white': $store.state.settings.lightMode === 'false'}">
    <div class="row app-logo-row">
      <div class="col col-md-12 app-logo flex q-pl-lg q-ml-sm q-mt-lg items-center justify-start">
        <img src="statics/icons/vtx-logo-1024x1024.png" class="q-mr-sm" width="40" alt="logo"/>
        <router-link to="/verto/dashboard">VERTO</router-link>
      </div>
    </div>
    <video-bg :sources="[require('assets/mp4/create-keys2.mp4')]" img="">
      <div class="video-page-wrapper q-pt-md q-pb-md">
        <div v-if="step===2" class="standard-content" style="padding-bottom: 0px">
          <div class="standard-content--body">
            <h2 class="standard-content--title text-center text-white"> Creating keys... </h2>
            <!-- <p class="diclaimer"> {{ status }} </p> -->
            <div class="standard-content--body__form">
              <div class="send-modal__content--body column flex-center">
                <q-circular-progress :value="progress" size="170px" :thickness="0.05" color="cyan-5" track-color="grey-3" class="q-ma-md" show-value font-size="20px" />
                <svg class="svg_logo" fill="#7272FA" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58">
                  <path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path>
                </svg>
                <div class="--label text-cyan-5 text-h6">{{ progress }} %</div>
              </div>
              <div class="send-modal__content--footer" v-if="status">
                <div class="text-h4 text-h4 q-mb-none text-white --status">Creating keys for: </div>
                <div class="text-h6 text-center text-white"><q-icon class="q-pr-sm" size="sm" :name="'img:'+ (status.icon ?  status.icon : 'https://files.coinswitch.co/public/coins/'+status.value+'.png')"/>{{status.label}}</div>
              </div>
              <div class="flex-end flex justify-end" v-if="false">
                <q-btn class="action-link next" color="deep-purple-14" text-color="white" label="Next" @click="step=3" :disable="!mapped" />
              </div>
            </div>
          </div>
        </div>
        <div v-if="step===3" class="standard-content" style="padding-bottom: 0px">
          <div class="standard-content--body">
            <h2 class="standard-content--title text-white perpleGlow text-center">Congratulations !<br>Launch your VERTO ...</h2>
            <br>
            <p class="diclaimer text-white">
              <strong class="perpleGlow">Disclaimer</strong>
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
            <div class="standard-content--body__form">
              <div class="flex-end flex justify-center q-pt-md q-mb-md">
                <q-btn class="action-link next" rounded flat outline color="deep-purple-14" text-color="white" label="Start Trading" @click="dataRefresh()" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </video-bg>
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
const eos = new EosWrapper()
export default {
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
        'label': 'Ethereum'
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
      ]
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
          this.$q.notify({ color: 'positive', message: 'Config Saved' })
        }
      } catch (e) {
        // TODO: Exception handling
      }
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
    async putAddress () {
      const self = this
      let count = this.names.length
      let i = 0

      for (const name of this.names) {
        i++
        this.progress = Math.round(i / count * 10000) / 100

        this.status = name
        name.label = name.value === 'eth' ? 'Account 1' : name.label
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

      this.$q.notify({
        color: 'positive',
        message: 'Application refreshing'
      })

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
        font-size: 20px;
        font-weight: $light;
        font-family: $Titillium;
        position: absolute;
        bottom: -20px;
      }
    }

    &--footer {
      .--status {
        font-size: 20px;
        font-weight: $bold;
        font-family: $Titillium;
        margin-top: 40px;
        text-align: center;

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
/deep/ .video-page-wrapper{
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.5);
  background-color: rgba(black, .5);
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
}
/deep/ .VideoBg__content{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img{}
  h1{
    font-family: $Franklin;
    color: #FFF;
    font-weight: 100;
    font-size: 45px;
    text-align: center;
    line-height: 55px;
  }
}
.video-page-wrapper{
  .or-text{
    margin-left: 10px;
    font-size: 16px;
    // margin-top: -10px;
    // margin-bottom: 10px;
  }
  /deep/ .q-field--focused .q-field__label{
    color: #FFF !important;
  }
  .next {
    box-shadow: 0px 0px 10px 0px #6200ea;
    border: 1px solid #B0B0B0 !important;
  }
  .back {
    box-shadow: 0px 0px 10px 0px #4caf50;
  }
  /deep/ .q-field--outlined.q-field--focused .q-field__control:after{
    border: 1px solid #FFF;
    box-shadow: 0px 0px 10px 0px #6200ea;
  }
  /deep/ .q-field--dark:not(.q-field--focused) .q-field__label,
  /deep/ .q-field--dark .q-field__marginal,
  /deep/ .q-field--dark .q-field__bottom{
    color: #FFF !important;
  }
  .perpleGlow{
    text-shadow: 2px 2px 2px #6200ea;
  }
}
</style>

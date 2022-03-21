<template>
  <q-page class="text-black bg-white" :class="$q.screen.width > 1024 ? 'desktop-marg': 'mobile-pad'">
    <div :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'bg-white text-black'" style="height: 99vh;">
      <q-header v-if="($q.platform.is.mobile||$isbex)">
          <q-toolbar :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'bg-white text-black'">
            <q-btn flat round dense icon="arrow_back_ios" class="q-mr-sm" @click="goBackPage()"/>
               <q-item
                  dense
                  :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'bg-white text-black'"
                >
                  <q-item-section avatar>
                    <q-icon class="option--avatar" :name="`img:${currentToken.image}`" />
                  </q-item-section>
                  <q-item-section dark>
                    <q-item-label v-html="currentToken.label" />
                    <q-item-label caption class="ellipsis mw200" :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'bg-white text-black'">{{getKeyFormat(currentToken.value) }}</q-item-label>
                  </q-item-section>
                </q-item>
        </q-toolbar>
      </q-header>
      <div class="desktop-version full-height" v-if="$q.screen.width > 1024" style="height: 100vh;">
        <div class="row full-height">
          <div class="col col-md-3">
            <div class="wallets-container" style="height: 100%">
              <profile-header :isMobile="false" class="marg" version="type2222" />
              <wallets :isMobile="false" class="full-height max-height" :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
              <!-- <img src="statics/prototype_screens/wallets.jpg" alt=""> -->
            </div>
          </div>
          <div class="col col-md-9">
            <div class="desktop-card-style apps-section q-mb-sm" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
              <div class="standard-content">
                <h2 class="standard-content--title flex">Receive</h2>
                <div class="standard-content--body">
                  <div class="standard-content--body__form">
                    <div class="row">
                      <div class="col col-6 q-pr-md">
                        <span class="lab-input">To <b class="verto-id">{{existingCruxID}}</b></span>
                        <q-select
                            :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                            separator
                            rounded
                            outlined
                            class="select-input"
                            v-model="currentToken"
                            :options="options"
                        >
                          <template v-slot:option="scope">
                            <q-item
                              class="custom-menu"
                              v-bind="scope.itemProps"
                              v-on="scope.itemEvents"
                            >
                              <q-item-section avatar>
                                <q-icon class="option--avatar" :name="`img:${scope.opt.image}`" />
                              </q-item-section>
                              <q-item-section dark>
                                <q-item-label v-html="scope.opt.label" />
                                <q-item-label caption class="ellipsis mw200">{{ scope.opt.value }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </template>
                          <template v-slot:selected>
                            <q-item
                              v-if="currentToken"
                            >
                              <q-item-section avatar>
                                <q-icon class="option--avatar" :name="`img:${currentToken.image}`" />
                              </q-item-section>
                              <q-item-section>
                                <q-item-label v-html="currentToken.label" />
                                <q-item-label caption class="ellipsis mw200">{{ currentToken.value }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item
                              v-else>
                            </q-item>
                          </template>
                        </q-select>
                      </div>
                      <div class="col col-6 flex justify-end">
                        <div class="standard-content--footer ">
                          <q-btn flat class="action-link next" @click="toggleShare()" color="black" text-color="white" label="Share" />
                        </div>
                        <!-- <span class="lab-input">Or Via Verto ID (Cruxpay)</span> -->
                        <!-- <q-input v-model="vertoID" class="input-input" rounded readonly outlined color="purple" type="text"/> -->
                      </div>
                    </div>
                    <div class="row">
                      <div class="col col-6 q-pr-md q-pt-md">
                        <div class="qrcode-wrapper">
                          <div class="q-mb-md wallet-address flex justify-between">
                            <span class="title">Wallet address</span>
                            <q-btn round flat unelevated @click="copyToClipboard(exchangeAddress , 'Address')" class="btn-copy" :text-color="$store.state.settings.lightMode === 'true' ? 'white' : 'grey'" icon="o_file_copy" />
                          </div>
                          <span class="qrcode-widget q-pt-md">
                            <qrcode class="q-mb-md" v-if="currentToken && currentToken.type" dark :value="currentToken.type === 'eos' ? currentToken.label : currentToken.value" :options="{size: 200}"></qrcode>
                            <qrcode v-if="configData && false" v-show="false" dark :value="configData" :options="{size: 200}"></qrcode>
                            <span class="exchange-address full-width text-center">{{currentToken.type === 'eos' ? currentToken.label : currentToken.value}}</span>
                          </span>
                        </div>
                      </div>
                      <!-- <div class="col col-6 column justify-end items-end items-end"> -->
                        <!-- <div class="standard-content--footer">
                          <q-btn flat class="action-link next" @click="toggleShare()" color="black" text-color="white" label="Share" />
                        </div> -->
                      <!-- </div> -->
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="standard-content_ mobile-version q-pa-lg">
        <!-- <h2 class="standard-content--title flex justify-center">
          <q-btn flat unelevated class="btn-align-left" to="/verto/dashboard" :text-color="$store.state.settings.lightMode === 'true' ? 'white':'black'" icon="keyboard_backspace" />
          Receive
        </h2> -->
        <div class="standard-content--body">
          <div class="standard-content--body__form">
            <span class="lab-input" v-if="!$q.platform.is.mobile">To</span>
            <q-select
                :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                separator
                rounded
                outlined
                class="select-input"
                v-model="currentToken"
                :options="options"
                v-if="!$q.platform.is.mobile"
            >
              <template v-slot:option="scope">
                <q-item
                  class="custom-menu"
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section avatar>
                    <q-icon class="option--avatar" :name="`img:${scope.opt.image}`" />
                  </q-item-section>
                  <q-item-section dark>
                    <q-item-label v-html="scope.opt.label" />
                    <q-item-label caption class="ellipsis mw200">{{ scope.opt.value }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:selected>
                <q-item
                  v-if="currentToken"
                >
                  <q-item-section avatar>
                    <q-icon class="option--avatar" :name="`img:${currentToken.image}`" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label v-html="currentToken.label" />
                    <q-item-label caption class="ellipsis mw200">{{ currentToken.value }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item
                  v-else>
                </q-item>
              </template>
            </q-select>
            <div >

            </div>

            <!-- <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-model="vertoID" class="input-input" rounded readonly outlined color="purple" type="text"/> -->
            <br>
            <div class="qrcode-wrapper">
              <div class="wallet-address flex justify-between">
                <span class="title">Wallet address</span>
                <q-btn round flat unelevated @click="copyToClipboard(exchangeAddress , 'Address')" class="btn-copy"  :text-color="$store.state.settings.lightMode === 'true' ? 'white' : 'grey'" icon="o_file_copy" />
              </div>
              <span class="qrcode-widget q-pt-md">
                <qrcode   class="q-mb-md" v-if="currentToken.value" :value="currentToken.type === 'eos' ? currentToken.label : currentToken.value" :options="{size: 200}"></qrcode>
                <span class="exchange-address full-width text-center">{{currentToken.type === 'eos' ? currentToken.label : currentToken.value}}</span>
              </span>
            </div>
          </div>
        </div>

        <div class="standard-content--footer" v-if="false">
          <q-btn flat class="action-link next" @click="toggleShare()" color="black" text-color="white" label="Share" />
        </div>
      </div>
    </div>

    <q-dialog v-model="showShareWrapper">
      <q-card class="q-pa-lg" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"  :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
        <q-toolbar>
          <q-avatar><img src="statics/icon.png"></q-avatar>
          <q-toolbar-title><span class="text-weight-bold">Share</span> Public Key</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class=" text-h6">
          <!-- <span style="font-size: 1em">Select your prefered method</span> -->
          <div class="social-media-wrapper">
            <span class="submenu-wrapper">

                <social-sharing
                  class="share_wrapper text-black flex column justify-even content-start item-start"
                  :url="`${currentToken.type} address: ${exchangeAddress}`"
                  title="Verto | Multi-currency wallet"
                  :description="`Receive ${currentToken.type} token from my address `"
                  quote=""
                  media="http://localhost:8080/statics/screens/screen_iphone.png"
                  hashtags=""
                  twitter-user=""
                  inline-template>
                  <div class="social_share">
                    <network network="email" class="span-wrapper">
                      <template>
                        <button data-v-b854f566="" tabindex="0" type="button" class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-accent text-white q-btn--actionable q-focusable q-hoverable q-btn--wrap">
                          <div tabindex="-1" class="q-focus-helper"></div>
                          <div class="q-btn__wrapper col row q-anchor--skip">
                            <div class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                              <!-- <i aria-hidden="true" class="fas fa-at q-icon"></i> -->
                              <img src="/statics/social/mail.svg" alt="">
                            </div>
                          </div>
                        </button>
                      </template>
                    </network>
                    <network network="skype">
                      <template>
                        <button data-v-b854f566="" tabindex="0" type="button" class="border q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-accent text-white q-btn--actionable q-focusable q-hoverable q-btn--wrap">
                          <div tabindex="-1" class="q-focus-helper"></div>
                            <div class="q-btn__wrapper col row q-anchor--skip">
                              <div class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                                <!-- <i aria-hidden="true" class="fab fa-skype q-icon"></i> -->
                                <img src="/statics/social/skype.svg" alt="">
                              </div>
                            </div>
                        </button>
                      </template>
                    </network>
                    <network network="sms">
                      <template>
                        <button data-v-b854f566="" tabindex="0" type="button" class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-accent text-white q-btn--actionable q-focusable q-hoverable q-btn--wrap">
                          <div tabindex="-1" class="q-focus-helper"></div>
                            <div class="q-btn__wrapper col row q-anchor--skip">
                              <div class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                                <!-- <i aria-hidden="true" class="fas fa-sms q-icon"></i> -->
                                <img src="/statics/social/sms.svg" alt="">
                              </div>
                            </div>
                        </button>
                      </template>
                    </network>
                    <network network="telegram">
                      <template>
                        <button data-v-b854f566="" tabindex="0" type="button" class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-accent text-white q-btn--actionable q-focusable q-hoverable q-btn--wrap">
                          <div tabindex="-1" class="q-focus-helper"></div>
                            <div class="q-btn__wrapper col row q-anchor--skip">
                              <div class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                                <!-- <i aria-hidden="true" class="fab fa-telegram q-icon"></i> -->
                                <img src="/statics/social/telegram.svg" alt="">
                              </div>
                            </div>
                        </button>
                      </template>
                    </network>
                    <network network="reddit">
                      <template>
                        <button data-v-b854f566="" tabindex="0" type="button" class="border q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-accent text-white q-btn--actionable q-focusable q-hoverable q-btn--wrap">
                          <div tabindex="-1" class="q-focus-helper"></div>
                            <div class="q-btn__wrapper col row q-anchor--skip">
                              <div class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                                <!-- <i aria-hidden="true" class="fab fa-reddit-alien q-icon"></i> -->
                                <img src="/statics/social/reddit.svg" alt="">
                              </div>
                            </div>
                        </button>
                      </template>
                    </network>
                    <network network="twitter">
                      <template>
                        <button data-v-b854f566="" tabindex="0" type="button" class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-accent text-white q-btn--actionable q-focusable q-hoverable q-btn--wrap">
                          <div tabindex="-1" class="q-focus-helper"></div>
                            <div class="q-btn__wrapper col row q-anchor--skip">
                              <div class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                                <!-- <i aria-hidden="true" class="fab fa-twitter q-icon"></i> -->
                                <img src="/statics/social/twitter.svg" alt="">
                              </div>
                            </div>
                        </button>
                      </template>
                    </network>
                    <network network="whatsapp">
                      <template>
                        <button data-v-b854f566="" tabindex="0" type="button" class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-accent text-white q-btn--actionable q-focusable q-hoverable q-btn--wrap">
                          <div tabindex="-1" class="q-focus-helper"></div>
                            <div class="q-btn__wrapper col row q-anchor--skip">
                              <div class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                                <!-- <i aria-hidden="true" class="fab fa-whatsapp q-icon"></i> -->
                                <img src="/statics/social/whatsapp.svg" alt="">
                              </div>
                            </div>
                        </button>
                      </template>
                    </network>
                  </div>
                </social-sharing>
              </span>
              <div id="copy-btn flex">
                <q-btn :color="$store.state.settings.lightMode === 'true' ? 'black':'white'" :text-color="$store.state.settings.lightMode === 'true' ? 'white':'black'"  @click="copyToClipboard(exchangeAddress , 'Link')" class="copy-link-button" flat label="Copy address">
                  <img src="/statics/social/copy.svg" alt="">
                </q-btn>
                <q-btn  v-if="false" :color="$store.state.settings.lightMode === 'true' ? 'black':'white'" :text-color="$store.state.settings.lightMode === 'true' ? 'white':'black'"  @click="copyToClipboard(existingCruxID , 'Link')" class="copy-link-button q-ml-sm" flat label="Copy VERTO ID">
                  <img src="/statics/social/copy.svg" alt="">
                </q-btn>
              </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
// import { osName } from 'mobile-device-detect'
import Wallets from '../../components/Verto/Wallets'
import ProfileHeader from '../../components/Verto/ProfileHeader'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import Vue from 'vue'
/// import sjcl from 'sjcl'

Vue.component(VueQrcode.name, VueQrcode)
var SocialSharing = require('vue-social-sharing')
Vue.use(SocialSharing)

// mport { CruxPay } from '@cruxpay/js-sdk'
import Formatter from '@/mixins/Formatter'

// let cruxClient

export default {
  mixins: [Formatter],
  components: {
    // desktop components
    ProfileHeader,
    Wallets
  },
  data () {
    return {
      osName: '',
      configData: false,
      existingCruxID: null,
      currentToken: {
        label: '',
        value: '',
        image: '',
        type: ''
      },
      currentAccount: null,
      to: '',
      params: null,
      tableData: [],
      vertoID: this.$store.state.currentwallet.config.cruxID,
      goBack: '/verto/dashboard',
      fetchCurrentWalletFromState: true,
      exchangeAddress: '',
      memo: '',
      options: [],
      minimizedModal: false,
      // vertoLink: 'https://volentix.io?verto-app',
      showShareWrapper: false,
      message: ''
    }
  },
  watch: {
    /* currentToken: function (newVal) {
      this.exchangeAddress = newVal.type === 'eos' || newVal.type === 'vtx' ? newVal.label : newVal.value
      this.currentAccount = this.tableData.find(w => w.chain === newVal.chainID && w.type === newVal.type && (
        w.chain === 'eos' ? w.name.toLowerCase() === newVal.label : w.key === newVal.label)
      )

      // this.$store.state.currentwallet.wallet = this.currentAccount
    } */
  },
  computed: {
    wallet () {
      return this.$store.state.currentwallet.wallet || undefined
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowWidth)
  },
  async created () {
    /* let exchangeNotif = document.querySelector('.exchange-notif'); if (exchangeNotif !== null) { exchangeNotif.querySelector('.q-btn').dispatchEvent(new Event('click')) }
    this.osName = osName
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)
    this.params = this.$store.state.currentwallet.params

    this.tableData = await this.$store.state.wallets.tokens
    let self = this
    let firstItem = null
    let count = 0
    this.tableData.map(token => {
      if (token.type.toLowerCase() !== 'verto') {
        if (count === 0) { firstItem = token }
        self.options.push({
          label: token.name.toLowerCase(),
          value: token.chain !== 'eos' ? token.key : token.key + ' - ' + token.type.toUpperCase(),
          image: token.type !== 'usdt' ? token.icon : 'https://assets.coingecko.com/coins/images/325/small/tether.png',
          type: token.type,
          chainID: token.chain
        })
      }
      count++
    })
    if (this.wallet) {
      this.currentAccount = this.wallet
      this.currentToken = {
        label: this.wallet.name,
        value: this.wallet.chain !== 'eos' ? this.wallet.key : this.wallet.key + ' - ' + this.wallet.type.toUpperCase(),
        image: this.wallet.type !== 'usdt' ? this.wallet.icon : 'https://assets.coingecko.com/coins/images/325/small/tether.png',
        type: this.wallet.type,
        chainID: this.wallet.chain
      }
    } else {
      this.currentAccount = this.tableData.find(w => w.chain === this.params.chainID && w.type === this.params.tokenID && w.name.toLowerCase() === this.params.accountName.toLowerCase())

      // console.log('this.currentAccount sur la page send', this.currentAccount)
      this.currentToken = {
        label: this.currentAccount !== undefined ? this.currentAccount.name : firstItem.name,
        value: this.currentAccount !== undefined ? this.currentAccount.key : firstItem.key,
        image: this.currentAccount !== undefined ? this.currentAccount.icon : firstItem.icon,
        type: this.currentAccount !== undefined ? this.currentAccount.type : firstItem.type,
        chainID: this.currentAccount !== undefined ? this.currentAccount.chain : firstItem.chain
      }
    }

    this.goBack = this.fetchCurrentWalletFromState ? `/verto/wallets/${this.params.chainID}/${this.params.tokenID}/${this.params.accountName}` : '/verto/dashboard'
    */
  },
  async mounted () {
    this.$set(this, 'currentToken', {
      label: this.$route.params.name,
      value: this.$route.params.value,
      image: this.$route.params.icon,
      type: this.$route.params.tokenID,
      chainID: this.$route.params.chainID
    }
    )

    this.currentAccount = this.currentToken
    this.exchangeAddress = this.currentAccount.chainID !== 'eos' ? this.currentAccount.value : this.currentAccount.label

    /*
    let cruxKey = await HD.Wallet('crux')

    cruxClient = new CruxPay.CruxClient({
      walletClientName: 'verto',
      privateKey: cruxKey.privateKey
    })

    await cruxClient.init()
    this.existingCruxID = (await cruxClient.getCruxIDState()).cruxID
    */
    /* QR mnemonic
    let qrData =
      {
        keys: JSON.parse(JSON.stringify(this.$store.state.currentwallet.config.keys)).map(o => o.name + '-' + o.chain + '-' + o.privateKey).join(','),
        mnemonic: this.$store.state.currentwallet.config.mnemonic
      }

    qrData = JSON.stringify(qrData)
    let encrypted = sjcl.encrypt(Math.random().toString(36).substring(7), JSON.stringify(qrData))
    this.configData = encrypted
    // length of encrypted and non-encrypted PV key (Testing)
    console.log(qrData.length, encrypted.length, 'length')

    */
    /* var CryptoJS = require('crypto-js')

    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(qrData), 'testing').toString()
    var bytes = CryptoJS.AES.decrypt(ciphertext, 'testing')
    var originalText = bytes.toString(CryptoJS.enc.Utf8)

    console.log(ciphertext, 'cypher', ciphertext.length)
    */
  },
  updated () {
    // this.exchangeAddress = this.exchangeAddress === '' ? this.currentToken.chain !== 'eos' ? this.currentToken.key : this.currentToken.name : ''
  },
  methods: {
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    },
    toggleShare () {
      this.showShareWrapper = !this.showShareWrapper
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
    goBackPage () {
      console.log(this.$route.params.return, 'tes', this.$route)
      this.$router.push(this.$route.params.return ? this.$route.params.return.path : { name: 'wallets', params: { openDialog: true } })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "~@/assets/styles/variables.scss";
  /deep/ .wallets-wrapper{
    padding-bottom: 0px !important;
  }
  /deep/ .wallets-wrapper--list{
    box-shadow: none;
    margin-top: 0px;
  }
  .marg{
    /deep/ .profile-wrapper{
      &--header{
        margin-bottom: 0px;
      }
    }
  }
  .mobile-pad {
    padding-bottom: 50px;
    background: #FFF !important;
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
  .dark-theme{
    .select-input{
      /deep/ .q-field__control{
        .q-field__native{
          .q-item{
            .q-item__section{
              .q-item__label + .q-item__label {
                color: #CCC;
              }
            }
          }
        }
      }
    }
    .mobile-version{
      background: #04111F;
      .standard-content--body__form .qrcode-wrapper .title{
        color: #FFF;
      }
      .standard-content--title{
        color: #FFF;
      }
      .standard-content--body__form .lab-input{
        color: #FFF;
      }
      .standard-content--body__form .input-input{
        /deep/ button{
          color: #FFF !important;
        }
      }
    }
    &.q-card{
      border: 1px solid #627797;
    }
    .standard-content--body__form .qrcode-wrapper{
      border: 1px solid #627797;
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
      .standard-content--body__form .lab-input{
        color: #FFF;
      }
      .standard-content--body__form .select-input .q-field__control .q-field__native .q-item .q-item__section .q-item__label + .q-item__label{
        color: #CCC;
      }
    }
  }
  .desktop-card-style{
    height: 100%;
  }
  .standard-content{
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh !important;
    padding-bottom: 100px;
    @media screen and (min-width: 768px) {
      padding: 2%;
      flex-direction: column;
      justify-content: flex-start;
      min-height: unset !important;
      padding-bottom: 20px;
    }
    &--title{
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
        .verto-id{
          font-size: 14px;
          font-family: $Titillium;
          padding-left: 26px;
        }
        .qrcode-wrapper{
          border: 1px solid rgba(black,.24);
          border-radius: 30px;
          padding: 20px 18px;
          .wallet-address{}
          .title{
            font-family: $Titillium;
            font-size: 17px;
            font-weight: $light;
          }
          .btn-copy{
            margin-top: -10px;
            margin-right: -10px;
          }
          .qrcode-widget{
            /deep/ canvas{
              height: auto !important;
              width: 60% !important;
              margin: auto;
              display: block;
            }
            .exchange-address{
              font-size: 9px;
              font-family: $Titillium;
              font-weight: $light;
              color: #B0B0B0;
              margin-bottom: 20px;
              margin-top: 20px;
              display: block;
              word-wrap: break-word;
            }
          }
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
      margin-top: 20px;
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
  .social-media-wrapper{
    margin-top: 0px;
    .share_wrapper{
      display: flex;
      flex-direction: row !important;
      justify-content: flex-start;
      // background-color: #fff;
      // box-shadow: 0px 1px 1px 0px rgba(black, .04);
      padding: 10px 0px;
      margin-left: 0px;
      margin-right: 0px;
      margin-bottom: 20px;
      border-bottom: 1px solid #efefef;
      border-radius: 0px;
      // width: 33%;
      /deep/  & > span{
        flex-basis: 20%;
        width: 100px;
        max-width: 68px;
        min-width: unset;
        padding: 0px 2px;
      }
      /deep/ .q-btn.q-btn-item{
        color: #433afb !important;
        background: rgba(239, 239, 239, 0.13) !important;
        // transform: scale3d(.7,.7,.7);
        box-shadow: none !important;
        width: 100%;
        border-radius: 0px !important;
        .q-btn__wrapper{
          width: 55px;
          height: 55px;
          margin-left: -11px;
        }
        img{
          width: 55px;
          height: 55px;
          min-width: 55px;
          max-width: 55px;
          margin-left: 30px;
        }
        // &.border{
        //   border-right: 1px solid rgb(226, 226, 226);
        //   border-left: 1px solid rgb(226, 226, 226);
        // }
        margin-bottom: 10px;
        /deep/ .q-btn__wrapper:before{
          box-shadow: none !important;
        }
      }
    }
  }
  .mw200{
    max-width: 220px;
  }
  .social-media-wrapper{
    /deep/ .share_wrapper .q-btn.q-btn-item img{
      @media screen and (max-width: 768px) {
        margin-left: 20px;
      }
    }
  }
  /deep/ .copy-link-button{
    border: 1px solid #f7f7f7;
    background: #fdfdfd;
    border-radius: 0px;
    @media screen and (max-width: 768px) {
      margin-left: 0px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .q-btn__content{
      flex-direction: row-reverse !important;
      font-size: 18px;
      text-transform: initial;
      img{
        width: 55px;
        height: 46px;
        margin-left: -20px;
        margin-top: 2px;
      }
    }
  }
  .lower{
    text-transform: initial !important;
  }
  .fsz16{
    font-size: 16px;
    font-weight: $regular;
    font-family: $Titillium;
  }
  .pd20{
    padding-left: 20px;
    padding-right: 20px;
  }
  .q-dark{
    /deep/ .copy-link-button{
      background-color: #04111F !important;
      border: 1px solid #7272FA !important;;
    }
  }
  .max-height{
    max-height: 80.80%;
    @media screen and (min-height: 700px) {
        // height: 54.5vh;
        max-height: 84.70%;
    }
    @media screen and (min-height: 760px) {
        // height: 54vh;
        max-height: 88.55%;
    }
    @media screen and (min-height: 800px) {
        // height: 55vh;
        max-height: 88.40%;
    }
    @media screen and (min-height: 870px) {
        // height: 56vh;
        max-height: 90%;
    }
  }
</style>

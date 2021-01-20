
<template>
<div :class="{'dark-theme': $store.state.lightMode.lightMode === 'true'}">
  <div class="profile-wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="profile-wrapper--list">
      <q-list :dark="$store.state.lightMode.lightMode === 'true'" bordered separator>
        <q-item v-for="(item, index) in menu" :key="index" clickable v-ripple :active="active" :to="(item.to !== 'backup' && item.to !== 'logout' && item.to !== 'restore' && item.to !== 'share') ? item.to : ''" @click="item.to === 'backup' ? backupConfig() : item.to === 'logout' ? logout() : item.to === 'restore' ? startRestoreConfig() : item.to === 'share' ? toggleShare() : empty()">
          <q-item-section avatar>
            <q-icon class="icons" :class="{'reverse' : item.icon === 'exit_to_app'}" v-if="item.icon !== 'vtx'" :name="item.icon" />
            <img v-else class="vtx_logo" width="15px" :src="$store.state.lightMode.lightMode === 'true' ? 'statics/vtx.png' : 'statics/vtx_black.svg'" alt="">
          </q-item-section>
          <q-item-section class="item-name">
            <div>{{item.name}}</div>
            <div v-if="screenSize <= 1024 && item.info === 'Linked'" class="flex flex-center q-mr-md text-grey">{{existingCruxID}}</div>
            <div v-if="screenSize <= 1024 && item.info === 'darkmode'" class="flex flex-center q-mr-md text-grey"></div>
          </q-item-section>
          <q-item-section>
            <div class="flex justify-end">
              <div v-if="screenSize > 1024 && item.info === 'Linked'" class="flex flex-center q-mr-md text-grey">{{existingCruxID}}</div>
              <q-btn v-if="item.info === 'Linked'" flat unelevated text-color="grey" @click="copyToClipboard(existingCruxID , 'Verto ID')" round class="btn-copy" icon="o_file_copy" />
            </div>
          </q-item-section>
          <q-item-section class="profile-wrapper--list__item-info" :class="{'hide': item.info === '' || item.info === 'darkmode', 'text-orange': item.info !== 'Linked', 'text-green' : item.info === 'Linked'}">{{item.info}}</q-item-section>
          <q-item-section v-if="screenSize <= 1024 && item.info === 'darkmode'" class="flex justify-end darkmode-option">
            <q-toggle
              v-model="lightMode"
              checked-icon="wb_sunny"
              @input="toggleLightDarkMode"
              color="grey"
              size="lg"
              class="darkmode-btn"
              unchecked-icon="brightness_3">
              <q-tooltip v-if="$store.state.lightMode.lightMode === 'false'" content-class="black" :offset="[10, 10]">
                Dark mode
              </q-tooltip>
              <q-tooltip v-else content-class="black" :offset="[10, 10]">
                Light mode
              </q-tooltip>
            </q-toggle>
          </q-item-section>
          <q-item-section v-if="item.name === 'Network'" class="flex justify-end darkmode-option">
            <q-btn-toggle
            v-model="network"
            unelevated
            @input="setNetwork"
            :options="[
              {label: 'Main Net', value: 'mainnet'},
              {label: 'Test Net', value: 'testnet'}
            ]"
          />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <span v-if="screenSize <= 1024" class="version full-width text-center text-grey column q-pt-md q-pl-xl q-pr-xl q-pb-xl q-mt-md">
      <span class="q-mb-md q-mt-md"><strong>{{version}}</strong></span>
      <span class="q-pa-sm">
        This app is in beta, please send us bug reports if you find any. <b><a target="_blank" :class="{'text-white':$store.state.lightMode.lightMode === 'true'}" href="https://t.me/vertosupport">t.me/vertosupport</a></b>
      </span>
    </span>
  </div>
  <q-dialog v-model="showShareWrapper">
    <q-card :dark="$store.state.lightMode.lightMode === 'true'" class="q-pa-lg" :class="{'dark-theme': $store.state.lightMode.lightMode === 'true'}">
      <q-toolbar>
        <q-avatar><img src="statics/icon.png"></q-avatar>
        <q-toolbar-title><span class="text-weight-bold">Share</span> VERTO</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section class=" text-h6">
        <!-- <span style="font-size: 1em">Select your prefered method</span> -->
        <div class="social-media-wrapper">
           <span class="submenu-wrapper">
              <social-sharing
                class="share_wrapper text-black flex column justify-even content-start item-start"
                :url="vertoLink"
                title="Verto | Multi-currency wallet"
                description="DOWNLOAD VERTO WALLET THE SECURE USER FRIENDLY WALLET"
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
            <div id="copy-btn">
              <q-btn :color="$store.state.lightMode.lightMode === 'true' ? 'black':'white'" :text-color="$store.state.lightMode.lightMode === 'true' ? 'white':'black'" @click="copyToClipboard(vertoLink , 'Link')" class="copy-link-button" flat label="Copy link">
                <img src="/statics/social/copy.svg" alt="">
              </q-btn>
            </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <!-- <q-dialog v-model="confirmLogout" persistent>
    <q-card class="q-pa-md" style="width: 700px; max-width: 90vw;">
      <q-card-section class="row items-center">
        <q-avatar icon="exit_to_app" color="deep-purple-14" text-color="white" />
        <span class="q-ml-sm">Please Confirm !</span>
      </q-card-section>
      <br>
      <q-card-actions align="right">
        <q-btn rounded outline unelevated label="Cancel" class="lower fsz16 pd20" color="deep-purple-14" v-close-popup />
        <q-btn flat rounded unelevated label="Logout" class="lower fsz16 pd20" color="grey" v-close-popup @click="logout()" />
      </q-card-actions>
    </q-card>
  </q-dialog> -->
</div>
</template>

<script>
import { version } from '../../../package.json'

import configManager from '@/util/ConfigManager'
import Vue from 'vue'
var SocialSharing = require('vue-social-sharing')
Vue.use(SocialSharing)

import { CruxPay } from '@cruxpay/js-sdk'
import HD from '@/util/hdwallet'
let cruxClient

export default {
  name: 'Profile',
  data () {
    return {
      lightMode: false,
      vertoLink: 'https://volentix.io?verto-app',
      active: true,
      network: this.$store.state.settings.network,
      version: {},
      existingCruxID: null,
      screenSize: 0,
      menu: [],
      showShareWrapper: false
    }
  },
  async mounted () {
    let cruxKey = await HD.Wallet('crux')
    this.version = version
    cruxClient = new CruxPay.CruxClient({
      walletClientName: 'verto',
      privateKey: cruxKey.privateKey
    })

    await cruxClient.init()
    this.existingCruxID = (await cruxClient.getCruxIDState()).cruxID
    if (this.existingCruxID) {
      // console.log('existingCruxID', this.existingCruxID)
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowWidth)
  },
  created () {
    window.localStorage.setItem('skin', window.localStorage.getItem('skin') !== null ? window.localStorage.getItem('skin') : false)
    this.$store.state.lightMode.lightMode = window.localStorage.getItem('skin') !== null ? window.localStorage.getItem('skin') : false
    // console.log('this.$store.state.lightMode.lightMode', this.$store.state.lightMode.lightMode)
    this.lightMode = window.localStorage.getItem('skin') !== 'false'
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)
    this.menu = [
      { name: 'Trade', to: '/verto/exchange', icon: 'compare_arrows', info: '' },
      { name: 'Personalize your wallet', to: '', icon: 'o_perm_media', info: 'soon' },
      { name: 'Backup Config', to: 'backup', icon: 'o_get_app', info: '' },
      { name: 'Restore Config', to: 'restore', icon: 'cloud_upload', info: '' },
      { name: 'Add EOS Account', to: '/verto/import-private-key/eos', icon: 'label', info: '' },
      { name: 'Add ETH Account', to: '/verto/import-private-key/eth', icon: 'label', info: '' },
      { name: 'Add HD Account', to: '/verto/create-hd-account', icon: 'label', info: '' },
      { name: 'Change Password', to: '/verto/profile/change-password', icon: 'lock_open', info: '' },
      { name: 'Network', to: '', icon: 'public_off', info: 'darkmode' },
      { name: 'Link to Verto ID', to: '', icon: 'vtx', info: 'soon' },
      { name: 'share Verto wallet', to: 'share', icon: 'share', info: '' }
    ]
    if (this.screenSize <= 1024) {
      this.menu.unshift({ name: 'Wallets', to: '/verto/wallets', icon: 'o_account_balance_wallet', info: '' })
      this.menu.push({ name: 'Theme', to: '', icon: 'format_paint', info: 'darkmode' })
    }
    this.menu.push({ name: 'Log Out', to: 'logout', icon: 'exit_to_app', info: '' })

    // screenSize > 1024
  },
  methods: {
    setNetwork: function () {
      this.$store.dispatch('settings/toggleNetwork', this.network)
      this.$q.notify({ message: `Network changed to ${this.network}`, color: 'positive' })
    },
    toggleLightDarkMode (val) {
      window.localStorage.setItem('skin', val)
      this.$store.state.lightMode.lightMode = window.localStorage.getItem('skin')
    },
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
    toggleShare () {
      this.showShareWrapper = !this.showShareWrapper
    },
    async startRestoreConfig () {
      this.$router.push({
        name: 'restoreWallet',
        params: { returnto: 'profile' }
      })
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
    logout () {
      // configManager.logout()
      this.$router.push({
        path: '/login'
      })
    },
    empty () {
      // console.log('empty')
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .profile-wrapper{
    padding: 0px 6%;
    padding-bottom: 30px;
    position: relative;
    overflow: hidden;
    .darkmode-option{
      margin-right: -60px;
    }
    &--list{
      /deep/ .q-list--bordered {
          border: none;
          .q-item{
            &:not(:first-child){
              .q-link {
                border-top: 1px solid rgba(0,0,0,0.02);
              }
            }
          }
          .q-link {
            border-top: 1px solid rgba(0,0,0,0.04);
          }
          .q-item{
            &:first-child{
              border-top: 1px solid rgba(0,0,0,0);
            }
          }
          .q-item__section{
            &.hide{
              display: none !important;
            }
          }
      }
      &__item-info{
        border: 2px solid;
        border-radius: 9px;
        text-align: center;
        width: fit-content;
        min-width: fit-content;
        max-width: fit-content;
        padding: 0px 10px;
      }
      .vtx_logo{
        margin-left: 4px;
        opacity: .4;
      }
      .icons{
        opacity: .4;
        &.reverse{
          transform: scaleX(-1);
        }
      }
      .item-name{
        font-size: 16px;
      }
    }
  }
  .dark-theme{
    &.q-card{
      border: 1px solid #627797;
    }
    /deep/ .copy-link-button{
      background-color: #04111F;
      border: 1px solid #627797;
    }
  }
  .icon-alert{
    padding-top: 25px;
    padding-bottom: 0px;
    img{
      width: 50px;
    }
  }
  .q-card{
    border-radius: 25px;
    box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 35px rgba(0,0,0,0.14), 0 1px 10px rgba(0,0,0,0.12);
  }
  .go-to-security{
    color: #FFF !important;
    background-color: #00D0DF !important;
    text-transform: initial !important;
    padding: 10px 30px;
    border-radius: 50px;
    font-weight: $light;
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
  /deep/ .copy-link-button{
    border: 1px solid #f7f7f7;
    background: #fdfdfd;
    border-radius: 0px;
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
  .btn-copy{
    width: 40px;
    position: relative;
    // top: -3px;
    margin-right: 0px;
    // padding: 6px 13px;
  }
  .version{
    background-color: rgba(#CCC, .05);
  }
</style>

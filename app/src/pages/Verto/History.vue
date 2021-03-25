<template>
  <q-page class="" :class="{'desktop-marg': screenSize > 1024, 'mobile-pad': screenSize < 1024, 'text-black bg-white': $store.state.settings.lightMode === 'false'}">
    <div :class="{'dark-theme': $store.state.settings.lightMode === 'true'}" style="height: 100vh;">
      <div class="desktop-version full-height" v-if="screenSize > 1024">
        <div class="row full-height">
          <div class="col col-md-3">
            <div class="wallets-container" style="height: 100%">
              <profile-header :isMobile="false" class="marg" version="type2222" />
              <wallets :isMobile="false" :showWallets="false" class="full-height max-height" :isWalletsPage="false" :isWalletDetail="false" />
              <!-- <img src="statics/prototype_screens/wallets.jpg" alt=""> -->
            </div>
          </div>
          <div class="col col-md-9">
            <div class="desktop-card-style apps-section history-card" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}" style="height: 100%;">
              <q-banner inline-actions class="text-white bg-red q-my-md " v-if="false">
                Section currently in development: currently showing ETH wallets history
              </q-banner>
              <div class="row">
                <div class="standard-content--title col-md-4 float-left flex justify-start q-pl-md q-pt-lg" >History  <q-icon name="cached"  @click="refresh++" class="refresh-history q-pl-sm"/></div>

                <div class="col flex justify-end q-pr-md"><AccountSelector  :autoSelectChain="'eos'" class="q-mr-md" :showAllWallets="true"/></div>
              </div>

              <div class="standard-content--body" style="height: 100%;">
                <History :refresh="refresh" :key="refresh" :isMobile="false" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mobile-version full-height" v-else>
        <div class="desktop-card-style apps-section history-card" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}" style="height: 100%;">
          <q-banner inline-actions class="text-white bg-red q-my-md " v-if="false">
            Section currently in development: currently showing ETH wallets history
          </q-banner>
          <div class="row">
            <div class="standard-content--title col-md-4 float-left flex justify-start q-pl-md q-pt-lg" >History  <q-icon name="cached"  @click="refresh++" class="refresh-history q-pl-sm"/></div>

            <div class="col flex justify-end q-pr-md"><AccountSelector  :autoSelectChain="'eos'" class="q-mr-md" :showAllWallets="true"/></div>
          </div>

          <div class="standard-content--body" style="height: 100%;">
            <History :refresh="refresh" :key="refresh" :isMobile="false" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import History from '../../components/Verto/History'
import Wallets from '../../components/Verto/Wallets'
import ProfileHeader from '../../components/Verto/ProfileHeader'
import configManager from '@/util/ConfigManager'
import AccountSelector from '../../components/Verto/Exchange/AccountSelector'

import { version } from '../../../package.json'
let platformTools = require('../../util/platformTools')
if (platformTools.default) platformTools = platformTools.default

export default {
  components: {
    History,
    ProfileHeader,
    Wallets,
    AccountSelector
  },
  data () {
    return {
      pword: '',
      refresh: 0,
      screenSize: 1024,
      minimizedModal: false,
      message: '',
      version: {},
      network: this.$store.state.settings.network,
      configPath: ''
    }
  },
  mounted () {
    this.version = version
    this.setupPlatformPath()
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)
  },
  methods: {
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    },
    async setupPlatformPath () {
      // this.configPath = await platformTools.filePath()
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
    }
  }
}
</script>
<style lang="scss" scoped>

.desktop-card-style{
    height: 101.5%;
    max-height: 101.5%;
    @media screen and (min-height: 700px) {
        // height: 54.5vh;
        max-height: 96.6%;
    }
    @media screen and (min-height: 760px) {
        // height: 54vh;
        max-height: 95%;
    }
    @media screen and (min-height: 800px) {
        // height: 55vh;
        max-height: 93.4%;
    }
    @media screen and (min-height: 870px) {
        // height: 56vh;
        max-height: 92%;
    }
  }
 .refresh-history {
   top: 25%;
 }
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
    padding-left: 20vh;
    padding-bottom: 50px;
    padding-right: 18px;
    @media screen and (min-width: 768px) {
      padding-top: 11vh;
      padding-bottom: 0px;
    }
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
  }
  .dark-theme{
    .desktop-version{
      background: #04111F;
    }
    .history-card{

    }
    /deep/ .profile-wrapper {
      &--header {
        margin-bottom: 0px;
        border: 1px solid #627797;
        // border-bottom: none;
        border-radius: 10px 10px 0px 0px !important;
      }
    }
    /deep/ .transaction-wrapper--list {
      background-color: #04111F;
      .q-list--bordered .q-link {
        border-top: 1px solid rgba(white, 0.06);
      }
    }
  }
  .max-height{
    max-height: 72vh;
  }
</style>

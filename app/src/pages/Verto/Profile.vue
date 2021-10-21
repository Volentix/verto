<template>
  <q-page class="column" :class="{'text-black': $store.state.settings.lightMode === 'false', 'bg-white': $store.state.settings.lightMode === 'false','desktop-marg':screenSize > 1024, 'mobile-pad---':screenSize < 1024, 'dark-theme': $store.state.settings.lightMode === 'true'}" :style="$store.state.settings.lightMode === 'true' ? 'background-color: #04111F !important;': ''">
    <div :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
      <div class="desktop-version" v-if="screenSize > 1024">
        <div class="row">
          <div class="col col-md-3" v-if="false">
            <div class="wallets-container">
              <profile-header :isMobile="false" class="marg" version="type2222" />
              <wallets :isMobile="false" :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
              <!-- <img src="statics/prototype_screens/wallets.jpg" alt=""> -->
            </div>
          </div>
          <div class="col col-md-12">
            <div class="desktop-card-style apps-section q-mb-sm" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
              <div class="standard-content-x q-pt-md">
                <h2 class="standard-content--title flex justify-start">Profile</h2>
                <profile />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="mobile-version">
        <q-header >
          <q-toolbar  :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'text-black'">
            <q-btn flat round dense icon="arrow_back_ios" class="q-mr-sm" to="/verto/dashboard"/>
            <q-toolbar-title> Profile</q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup to="/verto/dashboard"/>
          </q-toolbar>
        </q-header>

        <div >
          <profile />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import Profile from '../../components/Verto/Profile'
import ProfileHeader from '../../components/Verto/ProfileHeader'
import configManager from '@/util/ConfigManager'
import { version } from '../../../package.json'
let platformTools = require('../../util/platformTools')
if (platformTools.default) platformTools = platformTools.default
import { osName } from 'mobile-device-detect'
import Wallets from '../../components/Verto/Wallets'

export default {
  components: {
    Profile,
    ProfileHeader,
    // desktop components
    Wallets
  },
  data () {
    return {
      osName: '',
      pword: '',
      minimizedModal: false,
      message: '',
      version: {},
      network: this.$store.state.settings.network,
      configPath: ''
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowWidth)
  },
  created () {
    let exchangeNotif = document.querySelector('.exchange-notif'); if (exchangeNotif !== null) { exchangeNotif.querySelector('.q-btn').dispatchEvent(new Event('click')) }
    this.osName = osName
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)
  },
  mounted () {
    this.version = version
    this.setupPlatformPath()
  },
  methods: {
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
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
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "~@/assets/styles/variables.scss";
  .mobile-pad{
    padding-bottom: 50px;
    background: #FFF !important;
  }
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
  /deep/ .wallets-wrapper--list{
    box-shadow: none;
    margin-top: 0px;
  }
  .marg {
    /deep/ .profile-wrapper {
      &--header {
        margin-bottom: 0px;
        border: 1px solid #627797;
        // border-bottom: none;
        border-radius: 10px 10px 0px 0px !important;
      }
    }
  }
  .desktop-version{
    background: #FFF;
    padding-top: 13vh;
    padding-left: 18vh;
    padding-bottom: 50px;

    @media screen and (min-width: 768px) {
      padding-top: 11vh;
      padding-bottom: 0px;
    }
  }
  .dark-theme{
    background: #04111F;
    height: fit-content;
    /deep/ .mobile-version{
      background: #04111F;
    }
    .mobile-version{
      background: #04111F;
      /deep/ .profile-wrapper{
        &--list{
          .item-name{
            color: #FFF;
          }
          .icons{
            color: #FFF;
          }
        }
      }
    }
    .desktop-version{
      background: #04111F;
      padding-bottom: 8px;
      min-height: unset;
      overflow: hidden;
      position: relative;
      scrollbar-width: 0px;
      .col-title h4{
          color: #FFF;
      }
      /deep/ .profile-wrapper--list{
        .item-name{
          color: #FFF;
        }
        .icons{
          color: #FFF;
        }
      }
    }
  }
  .desktop-card-style{
    height: 100%;
  }
  /deep/ .profile-wrapper{
    padding: 0px 0%;
    padding-bottom: 30px;
  }
  .standard-content{
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh !important;
    padding-bottom: 100px;
    @media screen and (min-width: 768px) {

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
    }
  }
  .desktop-card-style {
    border-radius: 0px;
  }
  .desktop-version {
    padding-top: 20px !important;
    padding-left: 15px !important;
    margin-bottom: 0px !important;
  }
  .desktop-card-style.dark-theme {
    border: none;
    padding-left: 20px;
    border-radius: 0px;
  }
  .desktop-card-style{
    box-shadow: none;
    padding-left: 20px;
  }
</style>

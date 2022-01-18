<template>
  <q-page class="" :class="{'desktop-marg': screenSize > 1024, 'mobile-pad': screenSize < 1024, 'text-black bg-white': $store.state.settings.lightMode === 'false'}" :style="$store.state.settings.lightMode === 'true' ? 'background-color: #04111F !important;': 'background: #f2f2f2 !important'" >
    <div :class="{'dark-theme': $store.state.settings.lightMode === 'true', 'history-main-top-wrapper': !$q.platform.is.mobile}"  :style="!$q.platform.is.mobile ? 'height: 100vh;': 'height: 85vh;'">
      <!-- class="history-main-top-wrapper_" style="height: 100vh;" -->
      <div class="desktop-version full-height" v-if="screenSize > 1024">
        <div class="row full-height">
          <div class="col col-md-3" v-if="false">
            <div class="wallets-container" style="height: 100%">
              <profile-header :isMobile="false" class="marg" version="type2222" />
              <wallets :isMobile="false" :showWallets="false" class="full-height max-height" :isWalletsPage="false" :isWalletDetail="false" />
              <!-- <img src="statics/prototype_screens/wallets.jpg" alt=""> -->
            </div>
          </div>
          <div class="col col-md-12">
            <div class="desktop-card-style apps-section history-card" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}" style="height: 100%;">
              <div class="row">
                <div class="standard-content--title col-md-4 float-left flex justify-start q-pl-md q-pt-lg" >History  <q-icon name="cached"  @click="refresh++" class="refresh-history q-pl-sm"/></div>

                <div class="col flex justify-end q-pr-md"><AccountSelector  style="width: 330px;" :autoSelectChain="'eos'" class="q-mr-md" :showAllWallets="true"/></div>
              </div>

              <div class="standard-content--body" style="height: 100%;">
                <History :refresh="refresh" :key="refresh" :isMobile="false" />
              </div>
            </div>
          </div>
        </div>
      </div>
       <div class="mobile-version" style="height: inherit;" v-else >
         <q-header>
            <q-toolbar id="scrollToID3" class="back_button_wrapper q-pb-sm bg-grey-1" :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'text-black'">
                <!-- <q-toolbar-title style="margin-left: -25px"> Back  </q-toolbar-title> -->
                <div class="row flex justify-between items-center full-width" style="margin-bottom: -10px;">
                  <q-btn no-caps flat dense icon="arrow_back_ios" label="Back" class="q-pl-sm q-pr-sm q-mr-sm" @click="closeDialog()" />
                  <q-btn round outline icon="cached" @click="refresh++" class="refresh-history" size="sm"/>
                  <!-- <q-icon name="cached"  @click="refresh++" class="refresh-history"/> -->
                </div>
            </q-toolbar>
             <AccountSelector :autoSelectChain="'eos'" class="" :showAllWallets="true" :titleView='false'/>
         </q-header>
        <div class=" apps-section- history-card-" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}" style="height: 100%;">
          <q-banner inline-actions class="text-white bg-red q-my-md " v-if="false">
            Section currently in development: currently showing ETH wallets history
          </q-banner>

          <div class="standard-content--body-" style="height: 100%">
            <History :refresh="refresh" :key="refresh" :isMobile="true" />
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
    if (this.$q.platform.is.mobile || this.$isbex) document.getElementById('scrollToID3').scrollIntoView()

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
    },
    // goBackPage () {
    //   this.$router.push({ name: 'wallets', params: { openDialog: true } })
    // }
    closeDialog () {
      if (!this.$route.query.hasOwnProperty('return')) {
        this.$router.push({
          path: '/verto/dashboard'
        })
      } else {
        // this.$router.push({
        //   path: `/verto/${this.$route.query.return}`
        // })
        this.$router.push({ name: 'wallets', params: { openDialog: true } })
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
  .mobile-version{
    /deep/ .transaction-wrapper{
      padding: 0px 0%;
      margin-top: 0px;
      .transaction-wrapper--list{
        padding: 4% 3%;
        box-shadow: none;
        margin-bottom: 0px;
        .list-wrapper .history-item-wrapper{
          height: 110px;
          .history-item {
            height: 60px;
            margin-top: 0px;
            margin-bottom: 10px;
          }
          .active .history-item__detail{
            padding-top: 10px;
          }
          &:hover{
            height: auto;
          }
        }
        .history-item{
          .row{
            .row{
              flex-direction: column;
              align-items: flex-start;
              padding-left: 20px;
              .col.col-6,
              .col.col-9{
                width: 100%;
                &.justify-end{
                  display: block;
                }
                .q-mr-md{
                  margin-right: 9px;
                }
              }
              .col.col-3{
                width: 100%;
                display: block;
              }
            }
          }
        }
      }
    }
  }
  .history-main-top-wrapper{
    @media screen and (max-width: 1024px) {
      height: 93vh !important;
    }
  }
  .desktop-card-style.dark-theme {
    border: none;
    margin-left: 40px;
    margin-top: 40px;
    border-radius: 0px;
  }
  .back_button_wrapper{}
</style>

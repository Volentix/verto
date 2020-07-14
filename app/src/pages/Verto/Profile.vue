<template>
  <q-page class="column text-black bg-white" :class="osName.toLowerCase() === 'windows' ? 'desktop-marg': 'mobile-pad'">
    <div class="desktop-version" v-if="osName.toLowerCase() === 'windows'">
      <div class="row">
        <div class="col col-md-3">
          <div class="wallets-container">
            <profile-header :isMobile="false" class="marg" version="type2222" />
            <wallets :isMobile="false" :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
            <!-- <img src="statics/prototype_screens/wallets.jpg" alt=""> -->
          </div>
        </div>
        <div class="col col-md-9">
          <div class="desktop-card-style apps-section q-mb-sm">
            <div class="standard-content">
              <h2 class="standard-content--title flex justify-start">Profile</h2>
              <profile />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <profile-header />
      <profile />
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
  created () {
    this.osName = osName
  },
  mounted () {
    this.version = version
    this.setupPlatformPath()
  },
  methods: {
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
  .desktop-version{
    background: #E7E8E8;
    padding-top: 13vh;
    padding-left: 12vh;
    padding-bottom: 50px;
    padding-right: 2%;
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
    }
  }
</style>

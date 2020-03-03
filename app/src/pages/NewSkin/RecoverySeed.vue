<template>
  <q-page class="text-black bg-white">
    <div class="standard-content">
      <h2 class="standard-content--title">This is your 24 - word recovery seed phrase.</h2>
      <h2 class="standard-content--desc">Save these words in the right order in a secure location.Nobody will be able to help if you lose them!</h2>
      <div class="standard-content--body">
        <div class="standard-content--body__mnemonic">
          <h4 class="standard-content--body__mnemonic--title">Mnemonic</h4>
          <p class="standard-content--body__mnemonic--desc">voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
      </div>
      <div class="standard-content--footer">
         <q-btn flat class="action-link next" color="black" text-color="white" label="Verify" />
      </div>
    </div>
  </q-page>
</template>

<script>
import configManager from '@/util/ConfigManager'
import { version } from '../../../package.json'
let platformTools = require('../../util/platformTools')
if (platformTools.default) platformTools = platformTools.default

export default {
  components: {},
  data () {
    return {
      text: '',
      password: '',
      isPwd: true,
      secrectWordsToken: 'voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur ',
      pword: '',
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
.standard-content{
  padding: 5% 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh !important;
  &--title{
    font-size: 35px;
    font-weight: $bold;
    position: relative;
    line-height: 50px;
    font-family: $Titillium;
    margin-top: 40px;
    margin-bottom: 40px;
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
    &__mnemonic{
      border-radius: 20px;
      border: 1px solid #B0B0B0;
      padding: 20px 30px;
      &--title{
        color: #B0B0B0;
        font-size: 20px;
        font-weight: $bold;
        line-height: 20px;
        font-family: $Titillium;
        margin-top: 0px;
        margin-bottom: 20px;
      }
      &--desc{
        font-size: 16px;
        font-weight: $regular;
        line-height: 25px;
        font-family: $Titillium;
        margin-bottom: 0px;
      }
    }
  }
  &--footer{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    min-height: 100px;
    .action-link{
      height: 50px;
      text-transform: initial !important;
      font-size: 16px;
      letter-spacing: .5px;
      border-radius: 40px;
      width: 110px;
      margin-left: 10px;
      &.next{
        background-color: #7900FF !important;
      }
      &.back{
        background-color: #B0B0B0 !important;
      }
    }

  }
}
</style>

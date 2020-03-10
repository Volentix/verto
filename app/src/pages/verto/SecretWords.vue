<template>
  <q-page class="text-black bg-white">
    <div class="standard-content">
      <h2 class="standard-content--title">Put the words in the right order</h2>
      <div class="standard-content--body">
        <words-order :words="secrectWordsToken" />
      </div>
      <div class="standard-content--footer">
         <q-btn flat class="action-link back" color="black" text-color="white" label="Back" />
         <q-btn flat class="action-link next" color="black" text-color="white" label="Next" />
      </div>
    </div>
  </q-page>
</template>

<script>
import WordsOrder from '../../components/Verto/WordsOrder'
import configManager from '@/util/ConfigManager'
import { version } from '../../../package.json'
let platformTools = require('../../util/platformTools')
if (platformTools.default) platformTools = platformTools.default

export default {
  components: {
    WordsOrder
  },
  data () {
    return {
      secrectWordsToken: 'voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur ',
      mnemonic: this.$store.state.settings.mnemonic,
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
    flex-basis: 20%;
    height: 100%;
    margin-top: 40px;
    margin-bottom: 40px;
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

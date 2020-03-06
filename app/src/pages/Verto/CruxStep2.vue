<template>
  <q-page class="text-black bg-white">
    <div class="standard-content" style="padding-bottom: 70px">
      <div class="standard-content--body">
        <h2 class="standard-content--title">You're all set. <br>Enjoy using verto</h2>
        <p class="diclaimer"><strong>Disclaimer</strong> These words are important. Write them down and store them safely.These words are important. Write them down and store them safely.These words are important. Write them down and store them safely.These words are important. Write them down and store them safely.These words are important. Write them down and store them safely.</p>
        <div class="standard-content--body__form">
          <div class="flex-end flex justify-end">
            <q-btn flat class="action-link next" color="black" text-color="white" label="Next" />
          </div>
        </div>
      </div>
      <div class="standard-content--footer">
        <p class="crux-label">Powered by cruxpay.</p>
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
      cruxID: '',
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
    min-height: 62vh;
    .diclaimer{
      font-family: $Titillium;
      font-size: 16px;
      font-weight: $light;
      strong{
        font-size: 20px;
        display: block;
        font-weight: $bold;
      }
    }
    &__img{
      // min-height: 200px;
      $width: 170px;
      width: $width;
      height: $width;
      border-radius: $width;
      overflow: hidden;
      margin: 0px auto;
      margin-top: -10px;
      margin-bottom: 40px;
      img{
        max-width: 100%;
      }
    }
    &__form{
      .label{
        padding-left: 21px;
        font-size: 18px;
        margin-bottom: 5px;
        display: block;
      }
      /deep/ .q-field__messages{
        font-size: 14px;
        font-weight: 600;
        color: #FFB200;
        padding-left: 11px;
      }
      /deep/ .q-field__native{
        padding-left: 8px;
        font-size: 16px;
        font-weight: $regular;
      }
      /deep/ .q-field__label{
        font-family: $Titillium;
        font-weight: $bold;
        font-size: 18px;
        padding-left: 10px;
      }
      .flex-end{
        margin-top: 30px;
      }
      .action-link{
        height: 50px;
        text-transform: initial !important;
        background-color: #7272FA !important;
        font-size: 16px;
        letter-spacing: .5px;
        border-radius: 40px;
        width: 110px;
        margin-left: 10px;
      }
    }
  }
  &--footer{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
    min-height: 50px;
    .crux-label{
      font-size: 14px;
      color: #B0B0B0;
      font-weight: $light;
      font-family: $Titillium;
    }
  }
}
</style>

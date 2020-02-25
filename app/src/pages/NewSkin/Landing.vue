<template>
  <q-page class="column flex-center text-black bg-white">
    <div class="landing" style="background: url('statics/landing_bg.png');">
      <h2 class="landing--title"><strong>VERTO</strong> Wallet</h2>
      <h3 class="landing--title__sub">The easiest and most secure<br>crypto wallet</h3>
      <div class="landing--volentix-logo">
          <img src="statics/vtx_black.svg" class="svg" />
      </div>
      <span class="landing--bottom-bar"></span>
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
  .landing{
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    background-repeat: no-repeat !important;
    background-size: cover !important;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &--title{
      font-size: 30px;
      font-weight: 100;
      position: relative;
      padding-left: 20px;
      line-height: 40px;
      font-family: $Titillium;
      &__sub{
        font-size: 18px;
        text-align: center;
        line-height: 30px;
        margin-top: 0px;
      }
      strong{
        font-weight: bold;
      }
      :before {
        content: "";
        width: 14px;
        height: 100%;
        position: absolute;
        left: 0px;
        top: 0px;
        background: #7900FF;
        background: transparent linear-gradient(180deg, #7900FF 0%, #00D0DF 100%) 0% 0% no-repeat padding-box;
      }
    }
    &--volentix-logo{
      margin-top: 9px; text-decoration: none; color: #000 !important; font-size: 29px; position: relative; text-transform: uppercase;
      margin-top: 0px;color: #000 !important;
      position: absolute;
      bottom: 50px;
      img{top: 7px;position: relative; width: 40px;}
      &:after { content: "Volentix"; font-family: $Titillium; font-weight: $light; position: relative; left: 0px; top: 0px;margin-left: 10px; }
      &:after {top: -8px;}
    }
    &--bottom-bar{
      position: absolute;
      bottom: 10px;
      width: 130px;
      height: 4px;
      background-color: #555869;
      opacity: .2;
    }
  }
</style>

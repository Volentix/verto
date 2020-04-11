<template>
  <q-page class="column text-black bg-grey-12" style="padding-bottom: 50px">
    <profile-header class="marg" />
    <wallets :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
    <convert-any-coin />
    <br>
    <card-create-wallet />
    <br>
    <card-import-EOS-account />
    <br><br>
    <card-convert-any-to-VTX />
    <br><br>
    <card-make-VTX />
    <br><br>
    <card-WPS />
    <br><br><br>
  </q-page>
</template>

<script>
import ProfileHeader from '../../components/Verto/ProfileHeader'
import CardMakeVTX from '../../components/Verto/CardMakeVTX'
import CardWPS from '../../components/Verto/CardWPS'
import CardConvertAnyToVTX from '../../components/Verto/CardConvertAnyToVTX'
import CardImportEOSAccount from '../../components/Verto/CardImportEOSAccount'
import CardCreateWallet from '../../components/Verto/CardCreateWallet'
import Wallets from '../../components/Verto/Wallets'
import ConvertAnyCoin from '../../components/Verto/ConvertAnyCoin'
import configManager from '@/util/ConfigManager'
import { version } from '../../../package.json'
let platformTools = require('../../util/platformTools')
if (platformTools.default) platformTools = platformTools.default

export default {
  components: {
    ConvertAnyCoin,
    ProfileHeader,
    Wallets,
    CardCreateWallet,
    CardImportEOSAccount,
    CardConvertAnyToVTX,
    CardMakeVTX,
    CardWPS
  },
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
</style>

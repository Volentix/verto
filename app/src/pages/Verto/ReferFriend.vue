<template>
  <q-page class="column text-black bg-grey-12" style="padding-bottom: 50px">
    <profile-header version="type6" />
    <div class="refer-wrapper">
        <div class="text-h4 title">Referral link</div>
        <p class="desc">Please insert your Verto ID, <a href="#">to get your Verto ID click here.</a></p>
        <q-input readonly class="max-width btn text-white" rounded outlined bottom-slots v-model="referralLink">
            <template v-slot:append>
                <q-btn round dense flat @click="copyReferralLink()" color="white" icon="file_copy" />
                <q-btn round dense flat icon="share" color="white" />
            </template>
        </q-input>
        <div class="link flex justify-end">
            <a href="javascript:void(0)">Learn more</a>
        </div>
    </div>
    <br><br>
  </q-page>
</template>

<script>
import ProfileHeader from '../../components/Verto/ProfileHeader'
import configManager from '@/util/ConfigManager'
import { version } from '../../../package.json'
let platformTools = require('../../util/platformTools')
if (platformTools.default) platformTools = platformTools.default

export default {
  components: {
    ProfileHeader
  },
  data () {
    return {
      referralLink: 'https://docs.google.com/document/d/1BKSd...',
      fromCoin: null,
      toCoin: null,
      progress: 0.2,
      to: '',
      amount: '',
      memo: '',
      optionsFrom: [
        {
          label: 'Ethereum',
          value: 'eth',
          image: 'https://files.coinswitch.co/public/coins/eth.png'
        },
        {
          label: 'Bitcoin',
          value: 'btc',
          image: 'https://files.coinswitch.co/public/coins/btc.png'
        }
      ],
      optionsTo: [
        {
          label: 'Volentix',
          value: 'vtx',
          image: 'statics/coins_icons/svg_logo_white.svg'
        },
        {
          label: 'Bitcoin',
          value: 'btc',
          image: 'https://files.coinswitch.co/public/coins/btc.png'
        }
      ],
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
  .refer-wrapper{
    padding: 2% 10%;
    .title{
        color: #2A2A2A;
        font-size: 30px;
        font-family: $Titillium;
        font-weight: $bold;
        margin-bottom: 10px;
    }
    .desc{
        color: #2A2A2A;
        font-size: 17px;
        font-family: $Titillium;
        font-weight: $regular;
        margin-bottom: 10px;
        a{
            color: #2A2A2A;
            text-decoration: none;
            border-bottom: 1px solid;
        }
    }
    .btn{
        margin-top: 40px;
        color: white !important;
        /deep/ .q-field__control{
            background-color: rgba(#B0AFAF, .5) !important;
        }
        /deep/ .q-field__control:before{
            border: none !important;
            box-shadow: 0px 4px 15px 0px rgba(#000000,.1);
        }
        /deep/ .q-field__native{
            color: white !important;
        }
    }
    .link{
        a{
            color: #7900FF;
            text-decoration: none;
            font-size: 17px;
            font-family: $Titillium;
            font-weight: $regular;
        }
    }
  }
</style>

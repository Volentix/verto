<template>
  <div class="flex flex-center text-center">

    <Landing
      :noRedirect="true"
      v-if="!$store.state.currentwallet.config.keys"
    />
    <Sign
      style="height: 100vh;"
      :payloadId="$route.params.payloadId"
      :tx="$route.params.txObject"
      v-else-if="$route.params.txObject"
    />
    <div v-else-if="qr">
      <div class="flex flex-center text-center full-width q-pt-lg">
        <img
          class=" verto-logo"
          src="statics/icons/icon-256x256.png"
          width="60"
          alt="logo"
        />
      </div>
      <div
        style="width:100px;margin: 0 auto;"
        class="flex flex-center text-center q-pt-lg"
        v-html="qr"
      ></div>
      <div
        class="standard-content--body full-width q-pb-lg flex flex-center"
        v-if="loggedIn"
      >
        <div class="standard-content--body__form row">
          <q-list flat class="text-left offset-md-4 col-md-4">
            <q-select
      @input="setDefaultChoice"
      :dark="$store.state.settings.lightMode === 'true'"
      :light="$store.state.settings.lightMode === 'false'"
      separator
      rounded
      dense
      outlined
      class="select-input q-pt-md"
      v-model="currentChain"
      :options="chainsData"
    >
      <template v-slot:option="scope">
        <q-item
          class="custom-menu"
          v-bind="scope.itemProps"
          v-on="scope.itemEvents"
        >
          <q-item-section avatar>
            <q-icon class="option--avatar" :name="`img:${scope.opt.icon}`" />
          </q-item-section>
          <q-item-section dark>
            <q-item-label class="ellipsis" v-html="scope.opt.label" />

          </q-item-section>
        </q-item>
      </template>

      <template v-slot:selected>
        <q-item v-if="currentChain">
          <q-item-section avatar>
            <q-icon
                size="md"
               :name="`img:${currentChain.icon}`"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="ellipsis" v-html="currentChain.label" />

          </q-item-section>
        </q-item>
        <q-item v-else> </q-item>
      </template>
    </q-select>

            <q-item-label
              v-if="!connected && accounts && accounts.length"
              class="text-bold text-h6 text-center"
              header
              >Choose account</q-item-label
            >

            <q-item
              v-show="!connected"
              tag="label"
              class="bg-white rounded-borders shadow-1"
              :key="index"
              v-ripple
              v-for="(account, index) in accounts"
            >
              <q-item-section side top>
                <q-radio v-model="accountValue" :val="account" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-bold">{{
                  account.name
                }}</q-item-label>
                <q-item-label caption>
                  {{ getKeyFormat(account.key, 16) }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <div class="q-mt-md" v-if="accounts && accounts.length">
              <q-btn
                v-if="!connected"
                size="lg"
                @click="
                  shouldConnect = true;
                  connectWallet();
                "
                :loading="spinnerVisible && this.shouldConnect"
                label="Connect"
                class="full-width"
                color="deep-purple-12"
              />
              <q-btn
                v-if="!connected"
                size="lg"
                @click="
                  shouldConnect = false;
                  connectWallet();
                "
                :loading="spinnerVisible && !this.shouldConnect"
                label="Reject"
                class="full-width q-mt-md"
                color="deep-purple-12"
                outline
              />
              <div class="text-center flex flex-center" v-else>
                <div class="text-h6 text-bold">You are connected</div>
              </div>

            </div>
            <div class="q-pt-md text-h6" v-if="!(accounts && accounts.length)"> <span class=" text-bold">No account found</span> <br/>for the {{currentChain.label}} chain </div>
          </q-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeDecoder from 'qrcode-decoder'
import configManager from '@/util/ConfigManager'
import Landing from './Landing'
import Lib from '@/util/walletlib'
import HD from '@/util/hdwallet'
import initWallet from '@/util/_Wallets2Tokens'
import DexInteraction from '../../../mixins/DexInteraction'
import Formatter from '../../../mixins/Formatter'
import Vue from 'vue'
import VideoBg from 'vue-videobg'

// import WalletConnect from '@walletconnect/client'
import Sign from '../../../components/Verto/ETH/Sign'
Vue.component('video-bg', VideoBg)
export default {
  name: 'Login',
  components: { Landing, Sign },
  computed: {
    accounts () {
      return [
        ...this.$store.state.currentwallet.config.keys
      ].filter(o => o && (this.currentChain && ((o.type === this.currentChain.chain) || (this.currentChain.isEvm && o.type === 'eth'))))
    }
  },
  data () {
    return {
      chainsData: [],
      currentChain: null,
      hasConfig: false,
      accountValue: null,
      qr: null,
      loggedIn: true,
      spinnerVisible: false,
      connected: false,
      passHasError: false,
      password: '',
      isPwd: true,
      deleteConfigFail: false,
      deleteConfig: false,
      version: {},
      restoreFromWords: false,
      showSubmit: false
    }
  },
  watch: {
    '$store.state.currentwallet.config.keys': function () {
      this.setDefaultChoice()
    }
  },
  async mounted () {
    if (this.$route.params.svgData) {
      this.qr = JSON.parse(decodeURIComponent(escape(this.$route.params.svgData))).qr
    }

    this.chainsData = HD.getVertoChains()

    this.currentChain = this.chainsData.find(o => o.chain === 'eth')

    this.setDefaultChoice()
    /*
    this.hasConfig = !!await configManager.hasVertoConfig()
    if (!this.hasConfig) {
      this.$router.push({
        name: 'setup',
        params: {
          showConfigStep: true
        }
      })
    }
    this.$q.notify.registerType('my-notif', {
      icon: 'announcement',
      progress: true,
      color: 'deep-purple-14',
      textColor: 'white',
      position: 'top'
    })
    this.triggerCustomRegisteredType1()
    this.getGodexCoins()
    this.get1inchCoins()
    this.getDefiboxCoins()

    this.version = version

    let oldVersion = localStorage.getItem('version')

    if (oldVersion) {
      oldVersion = oldVersion.substring(4)

      if (+oldVersion <= 237 && +(version.substring(4)) > 327) {
        localStorage.removeItem('walletPublicDatav2')
      }
    }

    localStorage.setItem('version', version)

    this.$refs.psswrd.focus()
    */
  },
  created () {
    Lib.removeExpiredData()
    this.$store.dispatch('tokens/getTokenList')
    this.$store.dispatch('settings/getSettings')
    let ids = ['volentix-vtx']
    this.$store.dispatch('tokens/getTokenMarketData', ids)
    this.$store.dispatch('tokens/getEvmsTokensData')
    document.querySelector('#preloader').style.display = 'none'
  },
  methods: {
    interact () {},
    setDefaultChoice () {
      if (this.$store.state.currentwallet.config.keys) {
        if (this.accounts.length) {
          this.accountValue = this.accounts[0]
        } else {
          this.accountValue = null
        }
      }
    },
    async connectWallet () {
      this.spinnerVisible = true
      var qr = new QrcodeDecoder()
      var svgToImage = require('save-svg-as-png')

      let image = await svgToImage.svgAsDataUri(
        document.querySelector('.walletconnect-qrcode__image')
      )

      qr.decodeFromImage(image).then(async res => {
        await this.connect(res.data)
      })
    },
    async connect (uri) {
      this.$q.bex
        .send('connector.listener', {
          uri: uri,
          chain: this.currentChain.chain,
          chainId: this.currentChain.chainId,
          provider: this.currentChain.provider,
          domain: this.$route.params.domain,
          accept: this.shouldConnect,
          accounts: [this.accountValue.key]
        })
        .then(o => {
          localStorage.removeItem('walletconnect')

          setTimeout(
            () => {
              if (this.shouldConnect) {
                this.connected = true
              } else {
                window.close()
              }

              this.spinnerVisible = false
            },
            this.shouldConnect ? 3000 : 0
          )
        })
        .catch(() => {
          this.spinnerVisible = false
        })
    },
    pageStyle () {
      return {
        minWidth: '400px',
        minHeight: '700px'
      }
    },
    checkPassword () {
      if (this.password.length > 1) {
        this.showSubmit = true
      } else {
        this.showSubmit = false
      }
    },
    async startRestoreConfig () {
      // this.$router.push({
      //   name: 'restoreWallet',
      //   params: {
      //     returnto: 'settings'
      //   }
      // })
      this.$router.push({
        name: 'import-restore',
        params: {
          returnto: 'settings'
        }
      })
    },
    async login () {
      this.passHasError = false
      if (!this.password) {
        this.passHasError = true
        return
      }
      this.spinnerVisible = true
      const results = await configManager.login(this.password)
      if (results.success) {
        this.$store.commit('settings/temporary', this.password)
        if (
          this.$route.params.nextUrl &&
          this.$route.params.nextUrl.includes('dashboard')
        ) { initWallet() }
        setTimeout(() => {
          this.$store.dispatch('investment/getMarketDataVsUSD')
          // always redirect to dashboard for now : pending issue
          this.$router.push({
            path:
            /*  this.$route.params.nextUrl ? this.$route.params.nextUrl : */ '/verto/dashboard'
          })
        }, 100)
        // this.$router.push({ path: 'vertomanager' })
      } else {
        if (results.message === 'no_default_key') {
          this.$router.push({
            path: 'vertomanager'
          })
        } else {
          // this.startRestoreConfig()
          this.passHasError = true
        }
        this.spinnerVisible = false
      }
    },
    async destroyData () {
      try {
        await configManager.destroyConfig()
        this.hasConfig = false
        this.deleteConfig = false
        this.$q.notify({
          color: 'positive',
          message: 'Config successfully deleted'
        })
        this.$router.push({
          name: 'create-password'
        })
      } catch (e) {
        this.deleteConfigFail = true
        this.deleteConfig = false
      }
    },
    triggerCustomRegisteredType1 () {
      // this.$store.dispatch('notify/banner', `This app is in beta, use at your own risk.`)
      // this.$q.notify({
      //   type: 'my-notif',
      //   message: `This app is in beta, use at your own risk.`
      // })
    }
  },
  mixins: [DexInteraction, Formatter]
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.verto-logo {
  background: #fffffff2;
  border-radius: 50%;
  padding: 12px;
}
.login-page {
  background: #f5f5fe;
}
.landing {
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
  padding: 30px;

  &--title {
    font-size: 30px;
    font-weight: bold;
    line-height: 24px;
    font-family: $Franklin;
    position: relative;
    margin-left: 0%;
    margin-top: 0px;
    text-align: center;

    b.version {
      // position: absolute;
      // right: 0px;
      // bottom: -26px;
      font-weight: $regular;
      font-size: 15px;
      margin-left: 10px;
    }

    span {
      font-size: 20px;
      margin-top: 8px;
      display: block;
      color: #000000;
      font-weight: $regular;
    }

    &__sub {
      font-size: 18px;
      text-align: center;
      line-height: 30px;
      margin-top: 0px;
    }

    strong {
      font-weight: $light;
    }

    &:before {
      content: "";
      width: 14px;
      height: 100%;
      position: absolute;
      left: 0px;
      top: 0px;
      background: #7900ff;
      background: transparent linear-gradient(180deg, #7900ff 0%, #00d0df 100%)
        0% 0% no-repeat padding-box;
      display: none;
    }
  }

  &--volentix-logo {
    margin-top: 9px;
    text-decoration: none;
    color: #000 !important;
    font-size: 20px;
    position: relative;
    text-transform: uppercase;
    margin-top: 0px;
    color: #000 !important;
    position: absolute;
    bottom: 20px;
    transform: scale(0.55);

    img {
      top: 7px;
      position: relative;
      width: 40px;
    }

    // &:after {
    //     content: "Volentix";
    //     font-family: $Franklin;
    //     font-weight: $light;
    //     position: relative;
    //     left: 0px;
    //     top: 0px;
    //     margin-left: 10px;
    // }

    &:after {
      top: -8px;
    }
  }

  &--bottom-bar {
    position: absolute;
    bottom: 10px;
    width: 130px;
    height: 4px;
    background-color: #555869;
    opacity: 0.2;
  }

  @media screen and (min-width: 768px) {
    &--title {
      margin-left: 0%;
      padding-left: 0%;
      text-align: center;
    }
  }
}

.standard-content {
  padding: 0 10% 10% 10%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &--body {
    margin-top: 5%;
    margin-bottom: 5%;

    @media screen and (min-width: 768px) {
      margin-top: 5%;
      margin-bottom: 0%;
      max-width: 400px;
      margin-left: auto !important;
      margin-right: auto !important;
    }
  }

  &--footer {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    &.auto {
      min-height: unset;
    }

    @media screen and (min-width: 768px) {
      max-width: 400px;
      margin-left: auto !important;
      margin-right: auto !important;
    }

    .action-link {
      height: 50px;
      text-transform: initial !important;
      font-size: 16px;
      letter-spacing: 0.5px;
      border-radius: 10px;
      margin-left: 0px;
    }
  }
}

.q-card {
  border-radius: 25px;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 35px rgba(0, 0, 0, 0.14),
    0 1px 10px rgba(0, 0, 0, 0.12);
}

.yes-btn {
  color: #fff !important;
  background-color: #00d0df !important;
  text-transform: initial !important;
  padding: 10px 30px;
  border-radius: 50px;
  font-weight: $light;
}

.dark-theme {
  .svg_logo {
    fill: #fff;
  }

  &.q-card {
    border: 1px solid #627797;
  }

  .landing {
    background: #04111f !important;

    .svg_logo {
      fill: #fff;
    }

    .landing--volentix-logo:after {
      color: #fff;
    }

    .landing--title {
      color: #fff;

      span {
        color: #fff;
      }
    }
  }
}

.app-logo-row {
  position: relative;
  width: 97%;

  .app-logo {
    position: absolute !important;
    left: 0px;
    z-index: 9;

    a {
      font-weight: $lighter;
      text-transform: uppercase;
      font-family: $Titillium;
      font-size: 25px;
      color: #fff;
      text-decoration: none;
    }
  }
}

.login-page {
  .or-text {
    margin-left: 10px;
    font-size: 16px;
    // margin-top: -10px;
    // margin-bottom: 10px;
  }

  /deep/ .q-field--focused .q-field__label {
  }
  & .q-field--outlined .q-field__control {
    background-color: #fff;
  }
  /deep/ .q-field--outlined .q-field__control:after {
    border: 2px solid #e1e1e9;
    //background-color: #fff;
    //box-shadow: 0px 0px 10px 0px #E1E1E9;
  }

  /deep/ .q-field--outlined .q-field__control:before {
    border: 2px solid #e1e1e9;
    //background-color: #fff;
    //box-shadow: 0px 0px 10px 0px #E1E1E9;
  }

  /deep/ .q-field--outlined.q-field--focused .q-field__control:after {
    border: 2px solid #c4c4c6;
    //background-color: #fff;
    //box-shadow: 0px 0px 10px 0px #d4d4db;
  }

  /deep/ .q-field--outlined.q-field--focused .q-field__control:before {
    border: 2px solid #c4c4c6;
    //background-color: #fff;
    //box-shadow: 0px 0px 10px 0px #d4d4db;
  }

  /deep/ .q-field--dark:not(.q-field--focused) .q-field__label,
  /deep/ .q-field--dark .q-field__marginal,
  /deep/ .q-field--dark .q-field__bottom {
  }
}
</style>

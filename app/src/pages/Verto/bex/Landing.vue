<template>
  <div v-if="false" class="column items-center justify-start login-page full-width">
    <div class="q-pa-md">
      <img src="statics/icons/icon-256x256.png" width="170" alt="logo"/>
    </div>
    <notify-message/>
    <div class="standard-content col-grow">
      <h2 class="landing--title">
        Verto 2
      </h2>
      <h2 class="landing--title__sub">
        <span class="">Multi-chain wallet manager</span>
      </h2>
      <div class="standard-content--body full-width">
        <div class="standard-content--body__form">
          <label class="ver-label">Enter your password</label>
          <q-input autofocus bg-color="white" ref="psswrd" v-model="password" @keyup.enter="login" error-message="Your password is wrong" @input="checkPassword" :error="passHasError"
                   outlined :type="isPwd ? 'password' : 'text'">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="standard-content--footer full-width justify-end">
        <q-btn unelevated class="btn__blue block"  size="lg"  :loading="spinnerVisible" @click="login" label="Unlock"/>
        <span class="q-pa-xs"></span>
        <q-btn flat size="md" class="btn-flat__blue" label="import or Restore" @click="startRestoreConfig"/>
      </div>
    </div>
  </div>
  <q-page class="column items-center justify-start login-page login-page-wrapper" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}" v-else>
    <div class="full-width full-height">
      <img :src="'statics/login_ui_' + ($store.state.settings.lightMode === 'true' ? 'dark':'light') +'.png'" alt="head-login" class="head-login" />
      <div class="form_wrapper full-height column q-pa-lg">
        <span class="text-h2 q-pl-md">VERTO</span>
        <span class="text-h3 q-pl-md q-pr-md q-mt-md">Multi-chain wallet manager</span>
        <p class="q-pl-md q-pr-md q-mt-md">Store, trade, generate yield from your digital assets. One app for the multi-chain universe</p>
        <div class="password_wrapper q-pl-md q-pr-md">
          <label class="ver-label">Enter your password</label>
          <q-input :dark="$store.state.settings.lightMode === 'true'" :bg-color="$store.state.settings.lightMode === 'true' ? 'transparent':'white'" ref="psswrd" v-model="password" @keyup.enter="login" error-message="Your password is wrong" @input="checkPassword" :error="passHasError" outlined :type="isPwd ? 'password' : 'text'">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd"/>
            </template>
          </q-input>
          <div class="unlock_restore flex justify-between q-mt-sm">
            <q-btn unelevated class="btn__blue unlock_btn" color="grey-4" outline size="md" no-caps :loading="spinnerVisible" @click="login">
              <div class="flex justify-center items-center">
                <span class="q-ml-md q-mr-md">Unlock</span>
                <svg width="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.72 41.21"><path class="cls-1" :fill="$store.state.settings.lightMode === 'true' ? '#FFF':'#555'" d="M325.25,1207.35c0-1.12,0-2.23,0-3.34a53.91,53.91,0,0,1,.19-6.51,9.74,9.74,0,0,1,10.25-8.19,10,10,0,0,1,9.3,9,1.89,1.89,0,0,1,0,.91c-.16.33-.49.78-.76.78s-.71-.4-.82-.72a12.48,12.48,0,0,1-.21-1.65,8.22,8.22,0,0,0-16.28,1.43c0,2.76,0,5.52,0,8.4h18.43c3,0,4.64,1.67,4.64,4.6q0,6.95,0,13.9c0,3-1.67,4.59-4.64,4.59H324.93c-3,0-4.64-1.65-4.64-4.68q0-6.82,0-13.65c0-3.08,1.48-4.62,4.56-4.78C325,1207.41,325.06,1207.38,325.25,1207.35Zm9.83,21.5h10.55a2.47,2.47,0,0,0,2.71-2.7q0-7.16,0-14.31a2.51,2.51,0,0,0-2.76-2.75H324.73a2.53,2.53,0,0,0-2.79,2.81q0,7.07,0,14.15a2.52,2.52,0,0,0,2.85,2.82Z" transform="translate(-320.28 -1189.3)"/><path fill="#FFF" class="cls-1" d="M336,1220.6c0,1.29,0,2.55,0,3.8,0,.58-.1,1.12-.8,1.14s-.88-.52-.87-1.15c0-1.25,0-2.51,0-3.74-2.73-1.35-3.71-3-3.16-5.18a4.12,4.12,0,0,1,4.25-3.07,4.06,4.06,0,0,1,3.79,3.4C339.54,1218,338.44,1219.66,336,1220.6Zm-.8-6.55a2.45,2.45,0,1,0,2.45,2.44A2.47,2.47,0,0,0,335.17,1214.05Z" transform="translate(-320.28 -1189.3)"/></svg>
              </div>
            </q-btn>
            <q-btn flat size="md" no-caps class="restore_btn" label="Restore" @click="startRestoreConfig"/>
          </div>
        </div>
      </div>
    </div>
    <notify-message/>
  </q-page>
</template>

<script>
import configManager from '@/util/ConfigManager'
import {
  version
} from '../../../../package.json'
import Lib from '@/util/walletlib'
import initWallet from '@/util/Wallets2Tokens'
import DexInteraction from '../../../mixins/DexInteraction'
import NotifyMessage from '../../../components/notify/NotifyMessage'

export default {
  props: ['noRedirect'],
  name: 'Login',
  components: { NotifyMessage },
  data () {
    return {
      hasConfig: false,
      passHasError: false,
      password: '',
      isPwd: true,
      deleteConfigFail: false,
      deleteConfig: false,
      version: {},
      restoreFromWords: false,
      spinnerVisible: false,
      showSubmit: false
    }
  },
  async mounted () {
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

    // this.$refs.psswrd.focus()
  },
  created () {
    Lib.removeExpiredData()
    this.$store.dispatch('tokens/getTokenList')
    this.$store.dispatch('settings/getSettings')
    let ids = ['volentix-vtx']
    this.$store.dispatch('tokens/getTokenMarketData', ids)
    this.$store.dispatch('tokens/getEvmsTokensData')
  },
  methods: {
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
        if (this.$route.params.nextUrl && this.$route.params.nextUrl.includes('dashboard')) initWallet()
        setTimeout(() => {
          this.$store.dispatch('investment/getMarketDataVsUSD')
          // always redirect to dashboard for now : pending issue
          if (!this.noRedirect) {
            this.$router.push({
              path: /*  this.$route.params.nextUrl ? this.$route.params.nextUrl : */ '/verto/dashboard'
            })
          }
        },
        100)
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
  mixins: [DexInteraction]
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.login-page{
  background: #F5F5FE
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
      background: #7900FF;
      background: transparent linear-gradient(180deg, #7900FF 0%, #00D0DF 100%) 0% 0% no-repeat padding-box;
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
    transform: scale(.55);

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
    opacity: .2;
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
      letter-spacing: .5px;
      border-radius: 10px;
      margin-left: 0px;
    }

  }
}

.q-card {
  border-radius: 25px;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 35px rgba(0, 0, 0, 0.14), 0 1px 10px rgba(0, 0, 0, 0.12);
}

.yes-btn {
  color: #FFF !important;
  background-color: #00D0DF !important;
  text-transform: initial !important;
  padding: 10px 30px;
  border-radius: 50px;
  font-weight: $light;
}

.dark-theme {
  .svg_logo {
    fill: #FFF;
  }

  &.q-card {
    border: 1px solid #627797;
  }

  .landing {
    background: #04111F !important;

    .svg_logo {
      fill: #FFF;
    }

    .landing--volentix-logo:after {
      color: #FFF;
    }

    .landing--title {
      color: #FFF;

      span {
        color: #FFF;
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
      color: #FFF;
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
  & .q-field--outlined .q-field__control{
   background-color: #fff
  }
  /deep/ .q-field--outlined .q-field__control:after {
    border: 2px solid #E1E1E9;
    //background-color: #fff;
    //box-shadow: 0px 0px 10px 0px #E1E1E9;
  }

  /deep/ .q-field--outlined .q-field__control:before {
    border: 2px solid #E1E1E9;
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
.login-page-wrapper{
  background: #F9F9F9;
  .head-login{
    max-width: 100%;
    position: relative;
    transform: scale3d(1,1,1);
  }
  .form_wrapper{
    border-radius: 50px 50px 0px 0px;
    margin-top: -80px;
    background: #F9F9F9;
    position: relative;
    z-index: 2;
    box-shadow: 0px -30px 50px 0px rgba(black, .1);
    .text-h2{
      font-family: $Franklin;
      font-weight: $black;
      font-size: 20px;
      line-height: 30px;
      color: #04111F;
    }
    .text-h3{
      font-family: $Franklin;
      font-weight: $lighter;
      font-size: 30px;
      line-height: 35px;
      color: #04111F;
    }
    p{
      font-family: $Franklin;
      font-weight: $lighter;
      font-size: 14px;
      line-height: 22px;
      color: #04111F;
    }
    .unlock_restore{
      .unlock_btn{
        width: 65%;
        height: 45px;
        letter-spacing: 1px;
        font-weight: $lighter;
        font-family: $Franklin;
        font-size: 16px !important;
        /deep/ .q-btn__wrapper:before{
          border: 2px solid #CCC !important;
        }
      }
      .restore_btn{
        width: 30%;
        height: 45px;
        letter-spacing: 1px;
        font-weight: $lighter;
        font-family: $Franklin;
        font-size: 16px !important;
      }
    }
  }
  &.dark-theme{
    background: #04111F;
    .form_wrapper{
      background: #04111F;
      .text-h2{
        color: #FFF;
      }
      .text-h3{
        color: #FFF;
      }
      p{
        color: #FFF;
      }
      .restore_btn{
        color: #FFF !important;
      }
    }
  }
}
.password_wrapper{
  /deep/ .q-field__messages{
    color: #929398;
    font-size: 14px;
    margin-left: -10px;
    margin-top: -4px;
  }
  /deep/ .text-negative {
    color: #929398 !important;
  }
}
.dark-theme{
  .password_wrapper{
    /deep/ .q-field__messages{
      color: #FFF;
    }
    /deep/ .text-negative {
      color: #FFF !important;
    }
  }
}
</style>

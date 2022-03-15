<template>
<q-page class="column flex-center" :class="{'dark-theme': $store.state.settings.lightMode === 'true', 'text-black bg-white': $store.state.settings.lightMode === 'false'}">
    <div class="landing" style="background: url('statics/landing_bg.png');">
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <h2 class="landing--title">
                <strong>VERTO</strong> <b class="version">{{ version }}</b>
                <span>Multi-Currency wallet</span>
                <img src="statics/picto_verto.svg" alt="">
            </h2>
        </transition>
        <div class="standard-content--body full-width">
            <div class="standard-content--body__form">
                <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" ref="psswrd" v-model="password" @keyup.enter="login" @input="checkPassword" :error="passHasError" rounded outlined color="deep-purple-14" :type="isPwd ? 'password' : 'text'" label="Verto Password" hint="*Minimum of 8 characters">
                    <template v-slot:append>
                        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                    </template>
                </q-input>
            </div>
        </div>
        <div class="standard-content--footer full-width justify-end">
            <span v-show="!passHasError" class="q-pl-md q-pt-md cursor-pointer text-grey" @click="passHasError = true">Restore</span>
            <q-btn v-show="passHasError" flat class="action-link back" color="grey" text-color="white" label="Restore Config" @click="startRestoreConfig" />
            <q-btn class="action-link next" :loading="spinnerVisible" color="deep-purple-14" text-color="white" label="Connect" @click="login()" />
        </div>
        <div class="standard-content--footer auto full-width justify-center">
            <span></span>
            <q-btn flat v-show="passHasError" @click="restoreFromWords = true" outline class="back" text-color="deep-purple-14" label="Restore from 24 Words" />
            <span></span>
        </div>
        <div class="landing--volentix-logo">
            <a href="https://www.volentix.io" target="_blank">
              <!-- <img src="statics/vtx_black.svg" class="svg" /> -->
              <svg class="svg_logo q-mr-sm" width="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58"> <path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path> </svg>
            </a>
        </div>
        <span class="landing--bottom-bar"></span>
    </div>
    <q-dialog v-model="restoreFromWords">
        <q-card class="q-pa-lg" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
            <q-toolbar>
                <q-avatar><img src="statics/icon.png"></q-avatar>
                <q-toolbar-title><span class="text-weight-bold">Restore from</span> 24 Words</q-toolbar-title>
                <q-btn flat round dense icon="close" v-close-popup />
            </q-toolbar>
            <q-card-section class="text-h6">
                Are you sure? This is irriversible! Current config will be errased and Restore process will begin after selecting a new verto password.
            </q-card-section>
            <q-card-actions align="right" class="q-pr-sm">
                <q-btn label="Yes" flat @click="destroyData()" class="yes-btn" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</q-page>
</template>

<script>
import configManager from '@/util/ConfigManager'
import {
  version
} from '../../../package.json'
import initWallet from '@/util/_Wallets2Tokens'
import DexInteraction from '../../mixins/DexInteraction'
export default {
  name: 'Login',
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
        name: 'create-password'
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
  },
  created () {
    this.$store.dispatch('tokens/getTokenList')
    this.$store.dispatch('settings/getSettings')
    this.$store.dispatch('tokens/getTokenMarketData', 'volentix-vtx')
  },
  methods: {
    checkPassword () {
      if (this.password.length > 1) {
        this.showSubmit = true
      } else {
        this.showSubmit = false
      }
    },
    async startRestoreConfig () {
      this.$router.push({
        name: 'restoreWallet',
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
          this.$router.push({
            path: /*  this.$route.params.nextUrl ? this.$route.params.nextUrl : */ '/verto/dashboard'
          })
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
      this.$q.notify({
        type: 'my-notif',
        message: `This app is in beta, use at your own risk.`
      })
    }
  },
  mixins: [DexInteraction]
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

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
        font-weight: 100;
        position: relative;
        padding-left: 20px;
        line-height: 24px;
        font-family: $Franklin;
        position: relative;
        margin-left: 32%;

        img {
            position: absolute;
            max-width: 170px;
            right: 100%;
            top: -60px;
            width: 200px;
            opacity: .6;
        }

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
            font-weight: bold;
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
        }
    }

    &--volentix-logo {
        margin-top: 9px;
        text-decoration: none;
        color: #000 !important;
        font-size: 29px;
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

        &:after {
            content: "Volentix";
            font-family: $Franklin;
            font-weight: $light;
            position: relative;
            left: 0px;
            top: 0px;
            margin-left: 10px;
        }

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
            margin-left: 8%;
        }
    }
}

.standard-content {
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &--body {
        margin-top: 35%;
        margin-bottom: 5%;

        @media screen and (min-width: 768px) {
            margin-top: 5%;
            margin-bottom: 0%;
            max-width: 400px;
        }
    }

    &--footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-center;
        min-height: 100px;

        &.auto {
            min-height: unset;
        }

        @media screen and (min-width: 768px) {
            max-width: 400px;
        }

        .action-link {
            height: 50px;
            text-transform: initial !important;
            font-size: 16px;
            letter-spacing: .5px;
            border-radius: 40px;
            width: 48%;
            margin-left: 0px;

            &.back {
                background-color: #B0B0B0 !important;
            }
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
.dark-theme{
  &.q-card{
    border: 1px solid #627797;
  }
  .landing{
    background: #04111F !important;
    .svg_logo{
      fill: #FFF;
    }
    .landing--volentix-logo:after{
      color: #FFF;
    }
    .landing--title{
      color: #FFF;
      span{
        color: #FFF;
      }
    }
  }
}
</style>

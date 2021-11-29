<template>
  <q-page v-if="false" class="column items-center justify-start create-password-page">
    <div class="q-pa-md">
      <img src="statics/icons/icon-256x256.png" width="80" alt="logo"/>
    </div>
    <notify-message/>
    <div class="vert-page-content">
      <h2 class="vert-page-content--title">
        Create your Verto Password 2
      </h2>
      <h2
        class="vert-page-content--desc"
      >
        Please write down your password and store it somewhere safe. Only
        you know your password.
      </h2>
      <!-- The seed phrase will now be added to your config after confirming the password. -->
      <div class="vert-page-content--body">
        <!-- <div class="standard-content--body__img column flex-center gt-xs" v-if="!passwordsMatch"> -->
        <!-- <img src="statics/password_bg.svg" alt=""> -->
        <!-- </div> -->
        <div class="standard-content--body__form">
          <div>
            <label class="ver-label">
              Enter your password
            </label>
            <q-input
              ref="psswrd"
              v-model="password"
              @input="passwordCheck"
              @keyup.enter="gotoSecondScreen"
              autofocus
              outlined
              :error="passHasError"
              :error-message="passwordError"
              :type="isPwd ? 'password' : 'text'"
              class="q-mt-sm"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
          <div class="q-pt-xs">
            <label class="ver-label">
              Re-type your password
            </label>
            <q-input
              ref="psswrdConfirm"
              v-model="confirmPassword"
              @input="confirmPasswordCheck"
              @keyup.enter="submit"
              outlined
              :error="(!passHasError)&&!passwordsMatch"
              error-message="Password mismatched"
              :color="passwordsMatch ? 'green' : 'deep-red-14'"
              :type="isPwd ? 'password' : 'text'"
              class="q-mt-sm"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
        </div>
      </div>
      <span class="q-pa-xs"/>
      <div class="vert-page-content--footer q-mb-md">
        <q-btn unelevated class="btn__blue block" @click="submit(2)" size="lg" label="Continue"/>
        <span class="q-pa-xs"/>
        <q-btn outline unelevated size="lg" class="btn--outline__blue" label="Back" @click="$router.back()"/>
      </div>
    </div>
  </q-page>
  <q-page v-else class="column items-center justify-start login-page restore-page-wrapper2" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <div class="full-width full-height">
      <img :src="'statics/login_ui_' + ($store.state.settings.lightMode === 'true' ? 'dark':'light') +'.png'" alt="head-login" class="head-login" />
      <div class="form_wrapper full-height column q-pa-lg">
        <span class="text-h2 q-pl-md">VERTO</span>
        <span class="text-h3 q-pl-md q-pr-md q-mt-md" v-if="false">Create your Verto Password</span>
        <p class="q-pl-md q-pr-md q-mt-md q-mb-xs">Please write down your password and store it somewhere safe. Only you know your password.</p>
        <div class="password_wrapper q-pl-md q-pr-md">
          <div class="full-width">
            <div class="full-width">
              <div>
                <label class="ver-label">Enter your password</label>
                <q-input
                  ref="psswrd"
                  v-model="password"
                  @input="passwordCheck"
                  @keyup.enter="gotoSecondScreen"
                  autofocus
                  outlined
                  :error="passHasError"
                  :error-message="passwordError"
                  :type="isPwd ? 'password' : 'text'"
                  class="q-mt-sm"
                  :dark="$store.state.settings.lightMode === 'true'"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
              <div class="">
                <label class="ver-label">Re-type your password</label>
                <q-input
                  ref="psswrdConfirm"
                  v-model="confirmPassword"
                  @input="confirmPasswordCheck"
                  @keyup.enter="submit"
                  outlined
                  :error="(!passHasError)&&!passwordsMatch"
                  error-message="Password mismatched"
                  :color="passwordsMatch ? 'green' : 'deep-red-14'"
                  :type="isPwd ? 'password' : 'text'"
                  class="q-mt-sm"
                  :dark="$store.state.settings.lightMode === 'true'"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="unlock_restore flex justify-between items-end q-mt-sm">
              <q-btn @click="submit(2)" unelevated class="btn__blue unlock_btn" color="grey-4" outline size="md" no-caps label="Continue" />
              <q-btn flat size="md" no-caps class="restore_btn" color="grey-8" label="Back" @click="$router.back()" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <notify-message/>
  </q-page>
</template>

<script>
// app/src/pages/Intro/CreatePassword.vue
import configManager from '@/util/ConfigManager'
// import FileSelect from '@/components/FileSelect.vue'
import Vue from 'vue'
import VideoBg from 'vue-videobg'
import Lib from '@/util/walletlib'
import store from '@/store'
import NotifyMessage from '../../../components/notify/NotifyMessage'

Vue.component('video-bg', VideoBg)

export default {
  name: 'CreatePassword',
  components: {
    NotifyMessage
    // FileSelect
  },
  data () {
    return {
      isPwd: true,
      hasConfig: false,
      sourceVideo: 'statics/mp4/create-password.mp4',
      step: 1,
      passLabel: 'Type your password here',
      password: '',
      passHasError: false,
      passwordError: '',
      confirmPassword: '',
      wrongPasswordError: 'Password Incorrect',
      confirmPasswordError: '',
      doesNotMatch: false,
      iunderstand: true,
      passwordApproved: false,
      applicationRefreshing: false,
      confirmColor: 'white',
      passwordsMatch: true,
      file: null,
      contractable: true,
      isRecovering: false
    }
  },
  watch: {
    passwordsMatch (newVal) {
      if (!newVal) {
        this.sourceVideo = 'statics/mp4/create-password.mp4'
      } else {
        this.sourceVideo = 'statics/mp4/create-password2.mp4'
      }
    }
  },
  async mounted () {
    if (this.$route.params.recover && this.$route.params.recover === 'recover') {
      this.isRecovering = true
    }
    this.hasConfig = !!await configManager.hasVertoConfig()
  },
  methods: {
    setDemoMode () {
      Lib.removeExpiredData(0)
      store.state.currentwallet.config = {
        mnemonic: 'xxx',
        keys: [
          {
            chain: 'eth',
            key: '0x915f86d27e4E4A58E93E59459119fAaF610B5bE1',
            name: 'ETH Wallet',
            type: 'eth'
          },
          {
            chain: 'eth',
            key: '0xaCd398c95D7fb6fb4071C2892eADdaD12778dfDb',
            name: 'ETH Wallet 2',
            type: 'eth'
          },
          {
            chain: 'btc',
            key: '15urYnyeJe3gwbGJ74wcX89Tz7ZtsFDVew',
            name: 'BTC Wallet',
            type: 'btc'
          },
          {
            chain: 'eos',
            key: 'xxxx',
            name: 'crosschainfx',
            type: 'eos'
          },
          {
            chain: 'eos',
            key: 'xxxx2',
            name: 'berthonythe2',
            type: 'eos'
          }
        ]
      }
      store.state.settings.isDemo = true
      store.state.currentwallet.loggedIn = true
      this.$router.push({
        path: '/verto/dashboard'
      })
    },
    gotoSecondScreen () {
      if (this.passwordApproved) {
        //  this.step = 2
        this.$nextTick(() => {
          this.$refs.psswrdConfirm.focus()
        })
      }
    },
    /*
    async startRestoreConfig (step) {
      this.$router.push({
        name: 'restoreWallet',
        params: { returnto: 'create-password', step: step }
      })
    }, */
    confirmPasswordCheck () {
      if (this.password === this.confirmPassword) {
        this.passwordsMatch = true
      } else {
        this.passwordsMatch = false
      }
    },
    passwordCheck: function () {
      this.passwordApproved = false
      if (this.password.length > 7) {
        this.contains_long = true
        this.passHasError = false
        this.passwordApproved = true
      } else {
        this.contains_long = false
        this.passHasError = true
        this.passwordError = 'Password should be more than 8 symbols'
      }
    },
    submit: async function (step) {
      this.passwordCheck()
      this.confirmPasswordCheck()
      if (this.isRecovering) {
        step = 4
      }
      if (this.passwordsMatch && this.passwordApproved) {
        try {
          this.$store.commit('settings/temporary', this.password)
          await configManager.createWallet(this.password)
          this.$router.push({
            name: 'recovery-seed',
            params: { step: step }
          })
        } catch (e) {
        }
      }
    },
    checked () {
      if (this.iunderstand) {
        this.buttonsAreDisabled = false
      } else {
        this.buttonsAreDisabled = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
@import "~@/assets/styles/auth_page.scss";

.create-password-page {
  background: #F5F5FE
}

.vert-page-content--title {
  margin-bottom: 0;
}

.config-restore {
  border-left: 1px solid #ababab;
  padding-left: 20px;
}

.max-width {
  max-width: 1200px;
}

.app-logo-row {
  position: relative;
  width: 60%;

  .app-logo {
    position: absolute !important;
    left: 0px;
    z-index: 9;
  }
}

/deep/ .video-page-wrapper {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.5);
  background-color: rgba(black, 0.5);
  border-radius: 20px;
}

/deep/ .VideoBg__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
  }

  h1 {
    font-family: $Franklin;
    color: #fff;
    font-weight: 100;
    font-size: 45px;
    text-align: center;
    line-height: 55px;
  }
}

.next-step {
  // background: #f7f7f7;
  border-radius: 12px;
}

.row {
  .col {
    &.menu {
      a {
        font-weight: $regular;
        font-family: $Titillium;
        font-size: 16px;
        color: #333;
        text-decoration: none;
        padding: 5px 10px;
        border-radius: 5px;

        &:hover {
          background-color: rgba(black, 0.02);
        }
      }
    }

    &.app-logo {
      a {
        font-weight: $lighter;
        text-transform: uppercase;
        font-family: $Titillium;
        font-size: 25px;
        color: #fff;
        text-decoration: none;
      }
    }

    cursor: pointer;
    position: relative;
  }
}

.standard-content {
  padding: 5%;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: auto;
  @media screen and (min-width: 768px) {
    padding-top: 20px;
  }
  // justify-content: space-between;
  // height: 100vh !important;
  &--title {
    font-size: 20px;
    font-weight: $bold;
    position: relative;
    line-height: 40px;
    font-family: $Titillium;
    letter-spacing: 1px;
    margin-top: 20px;
    margin-bottom: 30px;
  }

  &--desc {
    margin-top: -20px;
    margin-bottom: 0px;
    font-size: 16px;
    font-weight: $regular;
    position: relative;
    line-height: 26px;
    font-family: $Titillium;
    color: rgba(white, 1);
  }

  &--body {
    &__img {
      min-height: 250px;

      img {
        max-width: 90%;
        width: 100%;
      }
    }

    &__form {
      /deep/ .q-field__native {
        padding-left: 8px;
        font-size: 16px;
        font-weight: $regular;
      }

      /deep/ .q-field__label {
        font-family: $Titillium;
        font-weight: $regular;
        font-size: 14px;
        padding-left: 10px;
      }
    }
  }

  &--footer {
    // display: flex;
    // flex-direction: row;
    // justify-content: flex-center;
    // align-items: flex-center;
    min-height: 0px;
    margin-bottom: 0px;
    margin-top: auto;

    .action-link {
      height: 40px;
      text-transform: initial !important;
      font-size: 15px;
      line-height: 15px;
      letter-spacing: 0.5px;
      border-radius: 40px;
      min-width: 140px;
      padding-left: 20px;
      padding-right: 20px;
      margin-left: 10px;
      border: 1px solid #b0b0b0 !important;

      &.back {
        // background-color: #B0B0B0 !important;
      }
    }
  }
}

.dark-theme {
  background: #04111f !important;

  .standard-content--title {
    color: #fff;
  }
}

.video-page-wrapper {
  .or-text {
    margin-left: 10px;
    font-size: 16px;
    // margin-top: -10px;
    // margin-bottom: 10px;
  }

  /deep/ .q-field--focused .q-field__label {
    color: #fff !important;
  }

  .next {
    box-shadow: 0px 0px 10px 0px #6200ea;
  }

  .back {
    box-shadow: 0px 0px 10px 0px #4caf50;
  }

  /deep/ .q-field--outlined.q-field--focused .q-field__control:after {
    border: 1px solid #fff;
    box-shadow: 0px 0px 10px 0px #6200ea;
  }

  /deep/ .q-field--dark:not(.q-field--focused) .q-field__label,
  /deep/ .q-field--dark .q-field__marginal,
  /deep/ .q-field--dark .q-field__bottom {
    color: #fff !important;
  }

  .perpleGlow {
    text-shadow: 2px 2px 2px #6200ea;
  }
}
.restore-page-wrapper2{
  background: #F9F9F9;
  .head-login{
    max-width: 100%;
    position: relative;
    transform: scale3d(1,1,1);
  }
  .form_wrapper{
    border-radius: 50px 50px 0px 0px;
    margin-top: -100px;
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
      // min-height: 102px;
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
        // color: #FFF !important;
      }
    }
  }
}
.q-mt--md{
  margin-top: -15px;
}
.password_wrapper{
  /deep/ .q-field__messages{
    color: #929398;
    font-size: 12px;
    margin-left: -7px;
    margin-top: -3px;
  }
  /deep/ .text-negative {
    color: #929398 !important;
  }
  /deep/ .q-field__native{
    div{
      font-size: 12px;
      opacity: .7;
    }
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

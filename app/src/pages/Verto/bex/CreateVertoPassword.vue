<template>
  <q-page
    class="column items-center justify-start create-password-page"
  >
    <div class="q-pa-md">
      <img src="statics/icons/icon-256x256.png" width="100" alt="logo"/>
    </div>
    <notify-message/>
    <div class="vert-page-content">
      <h2 class="vert-page-content--title">
        Create your Verto Password
      </h2>
      <h2
        class="vert-page-content--desc"
      >
        Please write down your password and store it somewhere safe. Only
        you know your password. There is no way to recover a Verto
        password yet, we are working on an exciting new solution for you
        that's coming soon.
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
              dense
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
              dense
              @input="confirmPasswordCheck"
              @keyup.enter="submit"
              outlined
              :error="(!passHasError)&&!passwordsMatch"
              error-message="Password mismatched"
              :color="passwordsMatch ? 'green' : 'deep-purple-14'"
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
      <div class="vert-page-content--footer q-mb-xs">
        <q-btn unelevated class="btn__blue block" @click="submit(2)" size="lg" label="Continue"/>
        <span class="q-pa-xs"/>
        <q-btn outline unelevated size="lg" class="btn--outline__blue" label="Back" @click="$router.back()"/>
      </div>
    </div>
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
</style>

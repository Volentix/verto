<template>
  <q-page
    :class="{
      'dark-theme': $store.state.settings.lightMode === 'true',
      'text-black bg-white': $store.state.settings.lightMode === 'false',
    }"
  >
    <div class="row app-logo-row">
      <div
        class="col col-md-12 app-logo flex q-pl-lg q-ml-sm q-mt-lg items-center justify-start"
      >
        <img
          src="statics/icons/vtx-logo-1024x1024.png"
          class="q-mr-sm"
          width="40"
          alt="logo"
        />
        <router-link to="/verto/dashboard">VERTO</router-link>
      </div>
    </div>
    <video-bg :sources="[require('assets/mp4/'+sourceVideo)]" img="">
      <div class="video-page-wrapper q-pt-md q-pb-md">
        <q-btn flat v-if="hasConfig" unelevated class="btn-align-left q-pl-lg absolute" @click=" $router.push('/login')" text-color="white" icon="keyboard_backspace" />
        <!-- <h1>Discover<br>the crypto space</h1> -->
        <div class="row max-width">

          <div v-if="step === 1" class="standard-content" :class="[$route.params.showConfigStep || !hasConfig ? 'col-md-7' : 'col-md-12']">

            <h2 class="standard-content--title text-white">
              Create your Verto Password
            </h2>
            <h2
              class="standard-content--desc q-pb-md"
              :class="{ 'gt-xs': passwordsMatch }"
            >
              Please write down your password and store it somewhere safe. Only
              you know your password. There is no way to recover a Verto
              password yet, we are working on an exciting new solution for you
              that's coming soon.
            </h2>
            <!-- The seed phrase will now be added to your config after confirming the password. -->
            <div class="standard-content--body">
              <!-- <div class="standard-content--body__img column flex-center gt-xs" v-if="!passwordsMatch"> -->
              <!-- <img src="statics/password_bg.svg" alt=""> -->
              <!-- </div> -->
              <div class="standard-content--body__form">
                <q-input
                  dark
                  ref="psswrd"
                  v-show="!passwordsMatch"
                  v-model="password"
                  @input="passwordCheck"
                  @keyup.enter="gotoSecondScreen"
                  rounded
                  autofocus
                  outlined
                  :color="passwordsMatch ? 'green' : 'deep-purple-14'"
                  :type="isPwd ? 'password' : 'text'"
                  :label="passwordsMatch ? 'Password confirmed' : passLabel"
                  @focus="
                    passLabel =
                      'Write it down somewhere safe for the love of crypto!'
                  "
                  @blur="passLabel = 'Type your password here'"
                  hint="*Minimum of 8 characters"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
                <q-input
                  v-show="!passwordsMatch && passwordApproved"
                  dark
                  ref="psswrdConfirm"
                  v-model="confirmPassword"
                  @input="confirmPasswordCheck"
                  @keyup.enter="submit"
                  rounded
                  outlined
                  :color="passwordsMatch ? 'green' : 'deep-purple-14'"
                  :type="isPwd ? 'password' : 'text'"
                  :label="
                    passwordsMatch ? 'Password confirmed' : 'Confirm password'
                  "
                  :hint="
                    confirmPassword.trim().length
                      ? passwordsMatch
                        ? 'Matched '
                        : 'Does not match'
                      : ''
                  "
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
            <p class="text-white perpleGlow q-pt-sm" v-if="passwordsMatch">
              Reminder: If you lose your password you will be locked out of
              Verto. No one will be able to help you recover a lost Verto
              password.
            </p>

            <div class="next-step" v-if="passwordsMatch">
              <div class="text-h6 q-pt-md text-white text-bold">
                Password set ! Next ?
              </div>
              <p class="text-body1 text-white q-pb-lg">
                Do you want to create or restore your 24 word mnemonic secret
                seed phrase?
              </p>
              <div
                class="standard-content--footer flex flex-center items-center"
                v-if="passwordsMatch"
              >
                <q-btn
                  class="action-link back"
                  rounded
                  flat
                  outline
                  text-color="white"
                  label="Restore"
                  @click="submit(4)"
                />
                <span class="text-h6 text-white or-text">or</span>
                <q-btn
                  class="action-link next"
                  rounded
                  flat
                  outline
                  text-color="white"
                  label="Create"
                  @click="submit(2)"
                  :disable="!passwordsMatch"
                />
              </div>
            </div>
          </div>
          <div
            class="col-md-4 standard-content"
            v-if="$route.params.showConfigStep || !hasConfig "
            :class="{ 'config-restore': $q.screen.gt.sm }"
          >

            <div class="standard-content--body">
              <div class="standard-content--body__form">
                <div class="text-h6 text-white q-pb-md">
                  Restore from  config
                </div>
                <q-btn
                  flat
                  class="action-link back"
                  color="grey"
                  text-color="white"
                  label="Restore Config"
                  @click="
                    $router.push({
                      name: 'restoreWallet',
                      params: {
                        returnto: 'settings',
                      },
                    })
                  "
                />
                <div class="text-h6 text-white q-py-lg">
                  Demo Mode
                </div>
                <q-btn
                  rounded
                  @click="setDemoMode()"
                  outline
                  no-caps
                  flat
                  class="action-link back q-mb-lg"
                  color="grey"
                  text-color="white"
                  label="Demo Mode" />
              </div>
              <p class="q-pt-md text-body1 text-white" v-if="false">
                A config file is a private file that contains all your accounts
                information and can be used at anytime to restore your wallet
              </p>
            </div>
          </div>
        </div>
      </div>
    </video-bg>
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
Vue.component('video-bg', VideoBg)

export default {
  name: 'CreatePassword',
  components: {
    // FileSelect
  },
  data () {
    return {
      isPwd: true,
      hasConfig: false,
      sourceVideo: 'create-password.mp4',
      step: 1,
      passLabel: 'Type your password here',
      password: '',
      passwordError: '',
      confirmPassword: '',
      wrongPasswordError: 'Password Incorrect',
      confirmPasswordError: '',
      doesNotMatch: false,
      iunderstand: true,
      passwordApproved: false,
      applicationRefreshing: false,
      confirmColor: 'white',
      passwordsMatch: false,
      file: null,
      contractable: true
    }
  },
  watch: {
    passwordsMatch (newVal) {
      if (!newVal) {
        this.sourceVideo = 'create-password.mp4'
      } else {
        this.sourceVideo = 'create-password2.mp4'
      }
    }
  },
  created () {},
  async mounted () {
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
            key: '0x4a02dEADD223E106185144181B0816549Edec862',
            name: 'SIF Private Vault',
            type: 'eth'
          },
          {
            chain: 'eos',
            key: 'xxxxx',
            name: 'crosschainfx',
            type: 'eos'
          }, {
            chain: 'eos',
            key: 'xxxxx',
            name: 'vtxisforhodl',
            type: 'eos'
          }, {
            chain: 'eos',
            key: 'xxxxx',
            name: 'staiderprm11',
            type: 'eos'
          }, {
            chain: 'eos',
            key: 'xxxxx',
            name: 'staiderx1m24',
            type: 'eos'
          }, {
            chain: 'eos',
            key: 'xxxxx',
            name: 'staiderx2m35',
            type: 'eos'
          }, {
            chain: 'eos',
            key: 'xxxxx',
            name: 'staiderx3m4o',
            type: 'eos'
          }, {
            chain: 'eos',
            key: 'xxxxx',
            name: 'master1xxxxx',
            type: 'eos'
          }, {
            chain: 'eos',
            key: 'xxxxx',
            name: 'master2xxxxx',
            type: 'eos'
          }, {
            chain: 'eos',
            key: 'xxxxx',
            name: 'master3xxxxx',
            type: 'eos'
          }, {
            chain: 'eos',
            key: 'xxxxx',
            name: 'master4xxxxx',
            type: 'eos'
          }, {
            chain: 'eos',
            key: 'xxxxx',
            name: 'master5xxxxx',
            type: 'eos'
          }, {
            chain: 'eos',
            key: 'xxxxx',
            name: 'imresistance',
            type: 'eos'
          }, {
            chain: 'eos',
            key: 'xxxxx',
            name: 'volentixp2pb',
            type: 'eos'
          },
          {
            chain: 'eos',
            key: 'xxxxx',
            name: 'cryptoninja1',
            type: 'eos'
          },
          {
            chain: 'eos',
            key: 'xxxxx',
            name: 'vtxtothemoon',
            type: 'eos'
          },
          {
            chain: 'eos',
            key: 'xxxxx',
            name: 'vtxnightnday',
            type: 'eos'
          },
          {
            chain: 'eos',
            key: 'xxxxx',
            name: 'vdexchinavtx',
            type: 'eos'
          },
          {
            chain: 'eos',
            key: 'xxxxx',
            name: 'vtxarmychina',
            type: 'eos'
          },
          {
            chain: 'eos',
            key: 'xxxxx',
            name: '4tunadineros',
            type: 'eos'
          },
          {
            chain: 'eos',
            key: 'xxxxx',
            name: 'ciaociaobell',
            type: 'eos'
          },
          {
            chain: 'eos',
            key: 'xxxxx',
            name: '4theluvofcrp',
            type: 'eos'
          },
          {
            chain: 'eos',
            key: 'xxxxx',
            name: 'excellenceit',
            type: 'eos'
          }

        ]
      }
      let k = '[{"type":"eth","name":"A1 Jakiero 772","key":"0xf4dcb9ca53b74e039f5fcfccd4f0548547a25772","chain":"eth"},{"type":"eos","name":"againagain11","key":"EOS8NCGrujCqJsnW4rrY2NrADy8gWoUhXD9kYpPVk9ATVFA3PCN8V","chain":"eos"},{"type":"eth","name":"ALBB205","key":"0x4973620b527cd74034f70c00b80d90b25a05d205","chain":"eth"},{"type":"avax","name":"Avalanche","key":"X-avax1m0dgdaqwd8tqqz86equqk3z9serhy3teg5k5ng","chain":"avax"},{"type":"eth","name":"BBMM 28","key":"0x76aa4f986154436e950604d59b5c6a54369b1e28","chain":"eth"},{"type":"btc","name":"Berthonytest","key":"12DbqbSgGu1naXHyGBdi3tVCJtVyw7PVxb","chain":"btc"},{"type":"bnb","name":"Binance Coin","key":"bnb1yzvev7j4lg0ah4v0tytg8ann7pftpu8kdw06z4","chain":"bnb"},{"type":"btc","name":"Bitcoin","key":"1Q4o6tBhsFx227aqUDtoqKtspMrPWTgSwT","chain":"btc"},{"type":"eth","name":"Chrome RoG ","key":"0x59e1a680bca30548e9d9a7f84db457cdbce9f41f","chain":"eth"},{"type":"eth","name":"CNVRT E74","key":"0x91b9dada77e2eb76d6f36b96f448c1f9a066be74","chain":"eth"},{"type":"eos","name":"crosschainfx","key":"EOS5if8Nkc8Uz1srNcdeMfSeBk19qFueYqjzduCiKzGc4Uharoecr","chain":"eos"},{"type":"dash","name":"DASH","key":"XecPhYXfWD9YKEBmneYoygFCJZd5mfbKCm","chain":"dash"},{"type":"eth","name":"ETH VTX 8B4","key":"0xcd41c348dc78869a93bc9571f3c175e1997048b4","chain":"eth"},{"type":"eos","name":"haydqmjyhage","key":"EOS8Y39ewxVunTZ8MhCqfA4DNXU52BaHJMktaHePVEduPKRanztuk","chain":"eos"},{"type":"eth","name":"JAK 6608","key":"0x181717bab64928669f606ee8b266502aaa2f6608","chain":"eth"},{"type":"eos","name":"lovevolentix","key":"EOS7N5KMPP5P9kFJhe7NPRTVC326oMjvuqgwiozk1ZYcPKUBf74Jc","chain":"eos"},{"type":"eth","name":"MLBSC 25a","key":"0x508f51c6fe10e5117caaef3306fd2126a161825a","chain":"eth"},{"type":"eos","name":"newvertoacct","key":"EOS8NCGrujCqJsnW4rrY2NrADy8gWoUhXD9kYpPVk9ATVFA3PCN8V","chain":"eos"},{"type":"eos","name":"newvertoeth1","key":"EOS5if8Nkc8Uz1srNcdeMfSeBk19qFueYqjzduCiKzGc4Uharoecr","chain":"eos"},{"type":"dot","name":"Polkadot","key":"1ERSWijTyngFo4ke1yaQbDzwmBMgSgRLpExxJd7yfJW6NMg","chain":"dot"},{"type":"eth","name":"SAM B73","key":"0x1ebc811a09175243dff76db56dd2d1eb5aef7b73","chain":"eth"},{"type":"eth","name":"SCI 688D","key":"0xef2ed8be426cd7057eb4fe5d636a03ff49b4688d","chain":"eth"},{"type":"eth","name":"SIF 232","key":"0x8a1bdb4feed4faf85a75b5fca07215e41f98d232","chain":"eth"},{"type":"sol","name":"Solana","key":"876EhcAoFA3HVyaFkxepHoTXXnK9nhYHMZMYUnudxgSD","chain":"sol"},{"type":"eth","name":"STAIDER 862","key":"0x4a02deadd223e106185144181b0816549edec862","chain":"eth"},{"type":"eth","name":"TIP1 DAC","key":"0x08eaac8841bafe6410d4a1f4338ee5a85cda3dac","chain":"eth"},{"type":"eth","name":"TR1 EF5","key":"0x104b7742725bb51c294e00e7922b74a89352aef5","chain":"eth"},{"type":"eth","name":"Tr2 13b","key":"0x3cf778ddc622f3ba7a4370fcb07e624de72fe13b","chain":"eth"},{"type":"eth","name":"TrezD87","key":"0xa551fb91e64e50e444a2292c6c598f02140dfd87","chain":"eth"},{"type":"eos","name":"vdex4freedom","key":"EOS6H5PophycCTismhywrguZ2N5VBSe3u5MRzFpL3hZH62de5ti2L","chain":"eos"},{"type":"eos","name":"vertofreeacc","key":"EOS5if8Nkc8Uz1srNcdeMfSeBk19qFueYqjzduCiKzGc4Uharoecr","chain":"eos"},{"type":"eos","name":"volentixcltw","key":"EOS6qw32CdRGMhAhFfKgSo7L5ArQCszbaQ9ye3c9Ym1nLEasAAJrr","chain":"eos"},{"type":"eos","name":"volentixdart","key":"EOS7N5KMPP5P9kFJhe7NPRTVC326oMjvuqgwiozk1ZYcPKUBf74Jc","chain":"eos"},{"type":"eos","name":"volentixdnhw","key":"EOS688emkMYqbedGSiNWvDFgAW56WmC4G2nTqshV4Gi1UZKFddGXx","chain":"eos"},{"type":"eos","name":"volentixeduv","key":"EOS7LaNePyHTeTTHw9gC3iYGXsNXjuk5xd2WKLfKviSm791hRW51Q","chain":"eos"},{"type":"eos","name":"volentixjeud","key":"EOS6iEvHXoDa4wSEvJ5eY1p6JBJzo1Ymm4p4Dm8MbAzHjNHnjnYsw","chain":"eos"},{"type":"eos","name":"volentixogym","key":"EOS7i2grApxwbHZzHVmheVHjRncRwqcnp63uVUskL1gAKAdrqx7q7","chain":"eos"},{"type":"eos","name":"volentixprvt","key":"EOS8KpH6xqu9CyjvwX6vkNX8LND25Sr41pDo8EK5HRi6zDiYXCg88","chain":"eos"},{"type":"eos","name":"volentixsekf","key":"EOS7RbAVp2jRVFeuTUznjBa66xnmFAxsAEZRgDJBdXxEqbawZRkdL","chain":"eos"},{"type":"eos","name":"volentixsema","key":"EOS77q3WNk6jsXB6kCUvQXanFwfWMR5hom4DtToUQscn77GsjJtGS","chain":"eos"},{"type":"eos","name":"volentixtvgd","key":"EOS8T97E5qJNdaLbZKDZBXSP6qFuVf3b86c41FdrqHqQAWV2ieb2f","chain":"eos"},{"type":"eos","name":"volentixwcrf","key":"EOS76vFHiiHiZP8e8rLGQynbqGMVzmjvKbGrRkTf8WC9URCCFbT8E","chain":"eos"},{"type":"eos","name":"volentixwufa","key":"EOS6cfHkzvTUgEaAzMH6DA8i73VF2S2T4BYc4FXYqHwpACtKvzv4U","chain":"eos"},{"type":"eos","name":"volentixwugn","key":"EOS8R6xGUE9yM1SeP4XKRKLFkbN6Sbon1yrTEsf35fJAZqgBP1Zkk","chain":"eos"},{"type":"eos","name":"volentixxjav","key":"EOS6qLzvCSo8HuTPFgZc5g5Mi2JEPuMnY6bAZ6pUaTYYVP2DUExBH","chain":"eos"},{"type":"eos","name":"volentixzfqi","key":"EOS8hdL4KK7QPxFLZpCgAA3RjyW3qq5kape4KJNjcbPy2r5FtutiG","chain":"eos"},{"type":"eos","name":"","key":"EOS6H5PophycCTismhywrguZ2N5VBSe3u5MRzFpL3hZH62de5ti2L","chain":"eos"},{"type":"eth","name":"A1 Jakiero 772","key":"0xf4dcb9ca53b74e039f5fcfccd4f0548547a25772","chain":"eth"}]'
      store.state.currentwallet.config.keys = JSON.parse(k)
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
        this.passwordApproved = true
      } else {
        this.contains_long = false
        this.passHasError = true
        this.passwordError = 'Password should be more than 8 symbols'
      }
    },
    submit: async function (step) {
      if (!this.passwordsMatch) {
        return
      }
      try {
        this.$store.commit('settings/temporary', this.password)
        await configManager.createWallet(this.password)
        this.$router.push({
          name: 'recovery-seed',
          params: { step: step }
        })
      } catch (e) {}
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

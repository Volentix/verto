<template>
  <q-page class="column items-center justify-start recovery-seed-page">
    <div class="q-pa-lg">
      <img src="statics/icons/icon-256x256.png" class="q-mr-sm" width="200" alt="logo"/>
    </div>
    <div class="vert-page-content">
      <div v-if="step===0" class="standard-content">
        <h2 class="standard-content--desc"></h2>
        <div class="standard-content--body">
          <div class="standard-content--body__img column flex-center">
            <img src="statics/create_restore_bg.svg" class="full-width" alt="">
          </div>
        </div>
        <h2 class="standard-content--title">Do you want to create or restore your 24 word mnemonic secret seed
          phrase?</h2>
        <div class="standard-content--footer">
          <q-btn class="action-link restore purple" color="grey" text-color="white" label="Restore" @click="step=4"/>
          <q-btn class="action-link create purple" color="deep-purple-14" text-color="white" label="Create"
                 @click="createMnemonic()"/>
        </div>
      </div>
      <div v-if="step===2">
        <div>
          <h2 class="vert-page-content--title">Recovery seed phrase.</h2>
          <p class="vert-page-content--desc">This list of words is used to generate all your HD wallets.
<!--            <span class="chain-icons-wrapper">-->
<!--                <img src="https://files.coinswitch.co/public/coins/eos.png" :class="{'active': chainCoin === 1}"-->
<!--                     width="20" alt="">-->
<!--                <img src="statics/icons/icon-128x128.png" :class="{'active': chainCoin === 2}" width="20" alt="">-->
<!--                <img src="https://files.coinswitch.co/public/coins/dot.png" :class="{'active': chainCoin === 3}"-->
<!--                     width="20" alt="">-->
<!--                <img src="https://assets.coingecko.com/coins/images/9568/small/m4zRhP5e_400x400.jpg"-->
<!--                     :class="{'active': chainCoin === 4}" class="radius" width="20" alt="">-->
<!--                <img src="https://files.coinswitch.co/public/coins/bnb.png" :class="{'active': chainCoin === 5}"-->
<!--                     width="20" alt="">-->
<!--                <img src="https://assets.coingecko.com/coins/images/4128/small/coinmarketcap-solana-200.png?1616489452"-->
<!--                     :class="{'active': chainCoin === 6}" width="20" alt="">-->
<!--                <img src="https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png"-->
<!--                     :class="{'active': chainCoin === 7}" width="20" alt="">-->
<!--                <img src="https://zapper.fi/images/ETH-icon.png" :class="{'active': chainCoin === 8}" width="20" alt="">-->
<!--                <img src="https://files.coinswitch.co/public/coins/btc.png" :class="{'active': chainCoin === 9}"-->
<!--                     width="20" alt="">-->
<!--                <img src="https://files.coinswitch.co/public/coins/dash.png" :class="{'active': chainCoin === 10}"-->
<!--                     width="20" alt="">-->
<!--                <img src="https://files.coinswitch.co/public/coins/ltc.png" :class="{'active': chainCoin === 11}"-->
<!--                     width="20" alt="">-->
<!--                <img src="https://files.coinswitch.co/public/coins/xrp.png" :class="{'active': chainCoin === 12}"-->
<!--                     width="20" alt="">-->
<!--                <img src="https://files.coinswitch.co/public/coins/xlm.png" :class="{'active': chainCoin === 13}"-->
<!--                     width="20" alt="">-->
<!--                <img src="https://files.coinswitch.co/public/coins/xtz.png" :class="{'active': chainCoin === 14}"-->
<!--                     width="20" alt="">-->
<!--              </span>-->
            You can use them to restore and access your wallet at any time. Save these words in the right order in a
            secure location. Nobody will be able to help if you lose them !
          </p>
        </div>
        <div class="vert-page-content--body">
          <div class="">
            <div class="flex justify-between">
              <q-btn flat  label="Download" class="btn-flat__blue"
                     @click="downloadMnemonic()" icon="get_app"/>
              <q-btn flat unelevated label="Copy" class="btn-flat__blue"
                     @click="copy2clip(mnemonic)" icon="o_file_copy"/>
            </div>
            <q-input
              ref="mnemonic"
              type="textarea"
              readonly
              outlined
              class="mnemonic"
              v-model="mnemonic"
              @focus="$event.target.select()"
            />
            <q-btn label="Regenerate" flat @click="createMnemonic" icon="cached"
                   class="btn-flat__blue"/>
<!--            <q-btn rounded flat unelevated text-color="grey" label="Import" @click="mnemonic = ''; step = 4"-->
<!--                   icon="publish" class="q-mt-md"/>-->
          </div>
        </div>
        <div class="vert-page-content--footer">
          <q-btn class="btn__blue" size="lg" unelevated :loading="spinnervisible"
                 :label="downloaded ? 'Next': 'Verify'"
                 @click="downloaded ? saveMnemonic() : step=3"/>
          <span class="q-pa-sm"></span>
          <q-btn class="btn--outline__blue" size="lg" outline  unelevated label="Back"
                 to="/create-password"/>
        </div>
      </div>
      <div v-if="step===3">
        <h2 class="vert-page-content--title">Select the first and the last word</h2>
        <div class="vert-page-content--body">
          <words-order :words="mnemonic"/>
          <div v-if="!vertoPassword">
            <q-input
              v-model="vertoPasswordTemp"
              dark
              color="green"
              label="Verto Password"
              debounce="500"
              :error="!goodPassword"
              error-message="The password is incorrect"
              @input="checkVertoPassword"
              :type="isPwd ? 'password' : 'text'"
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
        <div class="vert-page-content--footer">
          <q-btn class="btn__blue" size="lg" unelevated label="Next"
                 @click="saveMnemonic()"/>
          <span class="q-pa-xs"></span>
          <q-btn outline unelevated size="lg" class="btn--outline__blue"  label="Back" @click="step=2"/>
        </div>
      </div>
      <div v-if="step===4" class="standard-content">
        <div>
          <h2 class="standard-content--title text-white">Paste your recovery seed phrase.</h2>
          <h2 class="standard-content--desc text-white perpleGlow q-pt-sm">If you do not have a recovery seed, go back
            and choose create.</h2>
          <ul class="text-white">
            <li v-for="(word, index) in wordOptions" :key="index" class=""> {{ word.label }}</li>
          </ul>
          <!-- q-option-group
            name="words"
            v-model="words"
            :options="wordOptions"
            color="primary"
            inline
          / -->
        </div>
        <div class="standard-content--body">
          <div class="standard-content--body__mnemonic">
            <h4 class="standard-content--body__mnemonic--title flex justify-between">
              Mnemonic
            </h4>
            <q-input

              ref="mnemonic"
              type="textarea"
              color="black"
              @input="validateMnemonic()"
              v-model="mnemonic"
              autofocus
              error-message="The mnemonic seed is invalid"
              :error="!mnemonicValidated"
            />
          </div>
        </div>
        <div class="standard-content--footer">
          <q-btn class="action-link back" rounded flat outline color="black" text-color="white" label="Back"
                 to="/create-password"/>
          <q-btn class="action-link next" rounded flat outline color="deep-purple-14" text-color="white" label="Next"
                 @click="saveMnemonic(true)" :disable="!mnemonicValidated"/>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>

import Vue from 'vue'
import VideoBg from 'vue-videobg'

Vue.component('video-bg', VideoBg)

const bip39 = require('bip39')
import HD from '@/util/hdwallet'
import WordsOrder from '../../components/Verto/WordsOrder'
// import { userError } from '@/util/errorHandler'
let platformTools = require('@/util/platformTools')
if (platformTools.default) platformTools = platformTools.default
export default {
  components: {
    WordsOrder
  },
  data () {
    return {
      step: 2,
      chainCoin: 1,
      isPwd: true,
      words: 24,
      downloaded: false,
      wordOptions: [
        {
          label: 'Verto (24 words)',
          value: 24
        },
        {
          label: 'Metamask (12 words)',
          value: 12
        }
      ],
      mnemonicValidated: '',
      goodPassword: true,
      vertoPassword: this.$store.state.settings.temporary,
      vertoPasswordTemp: '',
      config: this.$store.state.currentwallet.config,
      chip: null,
      spinnervisible: false,
      mnemonic: this.$store.state.currentwallet.config.mnemonic,
      arrayMnemonic: [],
      arrayShuffled: [],
      arrayOrdered: [],
      arrayShuffleShow: [],
      arrayTest2: [],
      arrayTest3: [],
      master: null,
      myWallet: null
    }
  },
  async created () {
    if (!this.vertoPassword) {
      this.$router.push({ path: '/' })
    }
    if (this.$route.params.step) {
      this.step = parseInt(this.$route.params.step)
      if (this.step === 2) {
        this.createMnemonic()
      }
    }
    setInterval(() => {
      if (this.chainCoin < 14) {
        this.chainCoin++
      } else {
        this.chainCoin = 1
      }
    }, 500)
  },
  async mounted () {
    // console.log('mnemonic', this.mnemonic, 'config', this.config, 'verto password', this.vertoPassword)
  },
  watch: {},
  computed: {},
  methods: {
    async downloadMnemonic () {
      try {
        var today = new Date()
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0')
        var yyyy = today.getFullYear()

        today = mm + '_' + dd + '_' + yyyy + '_' + today.getHours() + 'h_' + today.getMinutes() + 'm'

        await platformTools.downloadFile(this.mnemonic, 'Verto_mnemonic_' + today + '.txt')
        this.downloaded = true
      } catch (error) {
        this.$q.notify({
          color: 'negative',
          message: 'Please copy the list of words, an error occured during the download'
        })
      }
    },
    validateMnemonic () {
      this.mnemonic = this.mnemonic ? this.mnemonic.trim() : this.mnemonic
      this.mnemonicValidated = bip39.validateMnemonic(this.mnemonic)
    },
    async createMnemonic () {
      this.downloaded = false
      this.mnemonic = bip39.generateMnemonic(256)

      this.step = 2
    },
    async saveMnemonic (isRecovering = false) {
      if ((this.goodPassword && (this.$store.state.settings.rightOrder || this.step === 4)) || this.downloaded === true) {
        // console.log('we are good with order')

        if (this.vertoPassword) {
          this.spinnervisible = true
          this.config.mnemonic = this.mnemonic
          await this.$configManager.updateConfig(this.vertoPassword, this.config)
          const keys = await HD.Wallet('eos')
          const result = await this.$configManager.saveWalletAndKey('EOS Key', this.vertoPassword, null, keys.publicKey, keys.privateKey, 'verto', 'mnemonic')

          if (result && result.success) {
            //   try {
            //     await this.$configManager.backupConfig()
            //     if (this.$q.platform.is.android) {
            //       this.$q.notify({ color: 'positive', message: 'Config Saved' })
            //     }
            //   } catch (e) {
            //     // TODO: Exception handling
            //   }

            this.$q.notify({ color: 'positive', message: 'EOS Keys created' })
            //   this.$router.push('wallet')
          }
          this.$router.push({ path: '/create-keys' })
        }
      } else {
        this.$q.notify({ color: 'negative', message: 'The words are not yet in the right order' })
      }
      this.spinnervisible = false
    },
    checkVertoPassword () {
      const self = this

      try {
        this.$configManager.getConfig(this.vertoPasswordTemp).then(result => {
          self.goodPassword = true
          // self.config = result.config
          self.vertoPassword = self.vertoPasswordTemp
          self.$store.commit('settings/temporary', self.vertoPassword)
        }).catch(error => {
          self.goodPassword = false
          if (error) this.$q.notify({ color: 'negative', message: error })
          return false
        })
      } catch (error) {
        self.goodPassword = false
        if (error) this.$q.notify({ color: 'negative', message: error })
        return false
      }
    },
    copy2clip (value) {
      this.$clipboardWrite(value)
      this.$q.notify({
        message: this.$t('Main.copied'),
        color: 'positive'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.recovery-seed-page {
  background: #F5F5FE
}

.vert-page-content {
  padding: 0 5% 10% 5%;
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  &--title {
    font-size: 24px;
    font-weight: 600;
    line-height: 24px;
    font-family: $Franklin;
    position: relative;
    margin-left: 0%;
    margin-top: 0px;
    text-align: center;

    &__sub {
      font-size: 18px;
      font-weight: 400;
      text-align: center;
      line-height: 30px;
      margin-top: 0px;
    }
  }

  &--desc {
    font-size: 14px;
    font-weight: $regular;
    line-height: 16px;
    font-family: $Titillium;
  }

  &--body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-top: 5%;
    margin-bottom: 5%;

    @media screen and (min-width: 768px) {
      margin-top: 5%;
      margin-bottom: 0%;
      max-width: 400px;
      margin-left: auto !important;
      margin-right: auto !important;
    }

    &.extra__px {
      padding: 0 70px;
    }
  }

  &--footer {
    padding: 0 70px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /deep/ .q-field--focused .q-field__label {
  }

  /deep/ .q-field--outlined .q-field__control {
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

/deep/ .q-field__native {
  font-size: 18px;
  line-height: 2;
  padding: 2px;
}

/deep/ .q-textarea .q-field__native {
  max-height: 132px;
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
  background-color: rgba(black, .5);
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
    color: #FFF;
    font-weight: 100;
    font-size: 45px;
    text-align: center;
    line-height: 55px;
  }
}

.mnemonic /deep/ textarea {
  line-height: 32px !important;
  height: 140px !important;
  //color: #FFF !important;
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
        color: #FFF;
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
  // justify-content: space-between;
  max-width: 800px;
  margin: auto;
  @media screen and (min-width: 768px) {
    padding-top: 20px;
  }

  &--title {
    font-size: 22px;
    font-weight: $bold;
    position: relative;
    line-height: 40px;
    font-family: $Titillium;
    margin-top: 20px;
    margin-bottom: 25px;
  }

  &--desc {
    margin-top: -10px;
    margin-bottom: 25px;
    font-size: 18px;
    font-weight: $regular;
    position: relative;
    line-height: 26px;
    font-family: $Titillium;
    color: $mainColor;
  }

  &--body {
    &__img {
      min-height: 250px;

      img {
        max-width: 90%;
        width: 100%;
      }
    }

    &__mnemonic {
      border-radius: 20px;
      border: 1px solid #B0B0B0;
      padding: 20px 30px;

      &--title {
        color: #B0B0B0;
        font-size: 20px;
        font-weight: $bold;
        line-height: 20px;
        font-family: $Titillium;
        margin-top: 0px;
        margin-bottom: 20px;

        .btn-copy {
          margin-top: -10px;
          margin-right: -5px;
        }
      }

      &--desc {
        font-size: 16px;
        font-weight: $regular;
        line-height: 25px;
        font-family: $Titillium;
        margin-bottom: 0px;
      }
    }
  }

  &--footer {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    min-height: 100px;
    margin-bottom: 0px;
    margin-top: auto;

    .action-link {
      height: 40px;
      text-transform: initial !important;
      font-size: 15px;
      line-height: 15px;
      letter-spacing: .5px;
      border-radius: 40px;
      min-width: 100px;
      padding-left: 20px;
      padding-right: 20px;
      margin-left: 10px;
      border: 1px solid #B0B0B0 !important;
      // &.next{
      //   background-color: #7900FF !important;
      // }
      &.back {
        // background-color: #B0B0B0 !important;
      }

      // &.purple{
      //   background-color: #7900FF !important;
      // }
    }

  }
}

.dark-theme {
  background: #04111F !important;

  ul {
    li {
      color: #FFF;
    }
  }

  .standard-content--title {
    color: #FFF;
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
    color: #FFF !important;
  }

  .next {
    box-shadow: 0px 0px 10px 0px #6200ea;
  }

  .back {
    box-shadow: 0px 0px 10px 0px #4caf50;
  }

  /deep/ .q-field--outlined.q-field--focused .q-field__control:after {
    border: 1px solid #FFF;
    box-shadow: 0px 0px 10px 0px #6200ea;
  }

  /deep/ .q-field--dark:not(.q-field--focused) .q-field__label,
  /deep/ .q-field--dark .q-field__marginal,
  /deep/ .q-field--dark .q-field__bottom {
    color: #FFF !important;
  }

  .perpleGlow {
    text-shadow: 2px 2px 2px #6200ea;
  }
}

.chain-icons-wrapper {
  width: 20px;
  height: 20px;
  display: inline-flex;
  position: relative;
  background: #FFF;
  border-radius: 30px;

  img {
    position: absolute;
    visibility: hidden;

    &.active {
      visibility: visible;
    }
  }
}
</style>

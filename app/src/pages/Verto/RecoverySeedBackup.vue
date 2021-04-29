<template>
  <q-page :class="{'dark-theme': $store.state.settings.lightMode === 'true', 'text-black bg-white': $store.state.settings.lightMode === 'false'}">
    <div class="row">
      <div class="col col-md-4 app-logo flex q-pa-md items-center">
        <!-- <img src="statics/vtx_black.svg" alt="" class="q-mr-sm" style="width: 30px; height: 30px;"> -->
        <svg
          class="svg_logo q-mr-sm"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 20.58"
        >
          <path
            d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z"
            transform="translate(-183 -18.21)"
          ></path>
        </svg>
        <router-link to="/verto/dashboard">VERTO</router-link>
      </div>
    </div>
     <div v-if="step===1" class="standard-content">
      <h2 class="standard-content--desc"></h2>
      <div class="standard-content--body">
        <div class="standard-content--body__img column flex-center">
          <img src="statics/create_restore_bg.svg" class="full-width" alt="">
        </div>
      </div>
      <h2 class="standard-content--title">Do you want to create or restore your 24 word mnemonic secret seed phrase?</h2>
      <div class="standard-content--footer">
        <q-btn class="action-link restore purple" color="grey" text-color="white" label="Restore" @click="step=4"/>
        <q-btn class="action-link create purple" color="deep-purple-14" text-color="white" label="Create" @click="createMnemonic()" />
      </div>
    </div>
    <div v-if="step===2" class="standard-content">
      <div>
        <h2 class="standard-content--title">24 - word recovery seed phrase.</h2>
        <p class="text-body1">This list of words is used to generate all your HD wallets. You can use them to restore and access your wallet at any time</p>
        <h2 class="standard-content--desc q-pa-md text-red rounded-borders shadow-1">Save these words in the right order in a secure location. Nobody will be able to help if you lose them!</h2>
      </div>
      <div class="standard-content--body">
        <div class="standard-content--body__mnemonic">
          <h4 class="standard-content--body__mnemonic--title flex justify-between">
            Mnemonic

             <q-btn round flat unelevated text-color="grey" label="Download" class="btn-copy q-pr-md gt-xs" @click="downloadMnemonic()" icon="get_app" />
            <q-btn round flat unelevated text-color="grey" label="Copy" class="btn-copy q-pr-md" @click="copy2clip(mnemonic)" icon="o_file_copy" />
          </h4>
          <q-input
            :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
            ref="mnemonic"
            type="textarea"
            readonly
            class="text-h6 mnemonic"
            v-model="mnemonic"
            @focus="$event.target.select()"
          />
          <q-btn label="Regenerate"  @click="createMnemonic" icon="cached" flat /> <q-btn label="Import"  @click="mnemonic = ''; step = 4" icon="publish" flat />
        </div>
      </div>
      <div class="standard-content--footer">
         <q-btn flat class="action-link back" color="black" text-color="white" label="Back" @click="step=1" />
         <q-btn class="action-link next" color="deep-purple-14" :loading="spinnervisible" text-color="white" :label="downloaded ? 'Next': 'Verify'" @click="downloaded ? saveMnemonic() : step=3" />
      </div>
    </div>
    <div v-if="step===3" class="standard-content">
      <h2 class="standard-content--title">Select the first and the last word</h2>
      <div class="standard-content--body">
        <words-order :words="mnemonic" />
        <div v-if="!vertoPassword">
          <q-input
            v-model="vertoPasswordTemp"
            :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
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
      <div class="standard-content--footer">
         <q-btn flat class="action-link back" color="black" text-color="white" label="Back" @click="step=2" />
         <q-btn class="action-link next" color="deep-purple-14" text-color="white" label="Next" @click="saveMnemonic()" />
      </div>
    </div>
    <div v-if="step===4" class="standard-content">
      <div>
        <h2 class="standard-content--title">Paste your recovery seed phrase.</h2>
        <h2 class="standard-content--desc">If you do not have a recovery seed, go back and choose create.</h2>
        <ul><li v-for="(word, index) in wordOptions" :key="index" class=""> {{ word.label }} </li></ul>
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
            :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
            ref="mnemonic"
            type="textarea"
            @input="validateMnemonic()"
            v-model="mnemonic"
            autofocus
            error-message="The mnemonic seed is invalid"
            :error="!mnemonicValidated"
          />
        </div>
      </div>
      <div class="standard-content--footer">
         <q-btn flat class="action-link back" color="black" text-color="white" label="Back" @click="step=1" />
         <q-btn class="action-link next" color="deep-purple-14" text-color="white" label="Next" @click="saveMnemonic(true)" :disable="!mnemonicValidated" />
      </div>
    </div>
  </q-page>
</template>

<script>
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
      step: 1,
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
    if (this.$route.params.step) {
      this.step = parseInt(this.$route.params.step)
      if (this.step === 2) { this.createMnemonic() }
    }
  },
  async mounted () {
    // console.log('mnemonic', this.mnemonic, 'config', this.config, 'verto password', this.vertoPassword)
  },
  watch: {
  },
  computed: {
  },
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
        this.$q.notify({ color: 'negative', message: 'Please copy the list of words, an error occured during the download' })
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
.mnemonic /deep/ textarea {
  line-height: 28px  !important
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
        svg {
          fill: #000;
        }
        a {
          font-weight: $bold;
          text-transform: uppercase;
          font-family: $Titillium;
          font-size: 20px;
          color: #333;
          text-decoration: none;
        }
      }

      cursor: pointer;
      position: relative;
    }
  }
.standard-content{
  padding: 5% 10%;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;

  max-width: 800px;
  margin: auto;
  @media screen and (min-width: 768px) {
    padding-top: 30px;
  }
  &--title{
    font-size: 22px;
    font-weight: $bold;
    position: relative;
    line-height: 40px;
    font-family: $Titillium;
    margin-top: 20px;
    margin-bottom: 25px;
  }
  &--desc{
    margin-top: -10px;
    margin-bottom: 25px;
    font-size: 18px;
    font-weight: $regular;
    position: relative;
    line-height: 26px;
    font-family: $Titillium;
    color: $mainColor;
  }
  &--body{
    &__img{
      min-height: 250px;
      img{
        max-width: 90%;
        width: 100%;
      }
    }
    &__mnemonic{
      border-radius: 20px;
      border: 1px solid #B0B0B0;
      padding: 20px 30px;
      &--title{
        color: #B0B0B0;
        font-size: 20px;
        font-weight: $bold;
        line-height: 20px;
        font-family: $Titillium;
        margin-top: 0px;
        margin-bottom: 20px;
        .btn-copy{
          margin-top: -14px;
          margin-right: -25px;
        }
      }
      &--desc{
        font-size: 16px;
        font-weight: $regular;
        line-height: 25px;
        font-family: $Titillium;
        margin-bottom: 0px;
      }
    }
  }
  &--footer{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    min-height: 100px;
    margin-bottom: 0px;
    margin-top: auto;
    .action-link{
      height: 50px;
      text-transform: initial !important;
      font-size: 16px;
      letter-spacing: .5px;
      border-radius: 40px;
      width: 110px;
      margin-left: 10px;
      // &.next{
      //   background-color: #7900FF !important;
      // }
      &.back{
        background-color: #B0B0B0 !important;
      }
      // &.purple{
      //   background-color: #7900FF !important;
      // }
    }

  }
}
.dark-theme{
  background: #04111F !important;
  ul{
    li{
      color: #FFF;
    }
  }
  .standard-content--title{
    color: #FFF;
  }
}
</style>

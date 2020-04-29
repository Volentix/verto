<template>
  <q-page class="text-black bg-white">
    <div v-if="step===1" class="standard-content">
      <h2 class="standard-content--desc"></h2>
      <div class="standard-content--body">
        <div class="standard-content--body__img column flex-center">
          <img src="statics/create_restore_bg.svg" class="full-width" alt="">
        </div>
      </div>
      <h2 class="standard-content--title">Do you want to create or restore your 24 word mnemonic secret seed phrase?</h2>
      <div class="standard-content--footer">
        <q-btn flat class="action-link restore purple" color="black" text-color="white" label="Restore" @click="step=4"/>
        <q-btn flat class="action-link create purple" color="black" text-color="white" label="Create" @click="createMnemonic()" />
      </div>
    </div>
    <div v-if="step===2" class="standard-content">
      <h2 class="standard-content--title">This is your 24 - word recovery seed phrase.</h2>
      <h2 class="standard-content--desc">Save these words in the right order in a secure location. Nobody will be able to help if you lose them!</h2>
      <div class="standard-content--body">
        <div class="standard-content--body__mnemonic">
          <h4 class="standard-content--body__mnemonic--title flex justify-between">
            Mnemonic
            <q-btn round flat unelevated text-color="grey" class="btn-copy" @click="copy2clip(mnemonic)" icon="o_file_copy" />
          </h4>
          <q-input
            ref="mnemonic"
            type="textarea"
            v-model="mnemonic"
            @focus="$event.target.select()"
          />
        </div>
      </div>
      <div class="standard-content--footer">
         <q-btn flat class="action-link back" color="black" text-color="white" label="Back" @click="step=1" />
         <q-btn flat class="action-link next" color="black" text-color="white" label="Verify" @click="step=3" />
      </div>
    </div>
    <div v-if="step===3" class="standard-content">
      <h2 class="standard-content--title">Put the words in the right order</h2>
      <div class="standard-content--body">
        <words-order :words="mnemonic" />
        <div v-if="!vertoPassword">
          <q-input
            v-model="vertoPasswordTemp"
            light
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
         <q-btn flat class="action-link next" color="black" text-color="white" label="Next" @click="saveMnemonic()" :disable="!goodPassword" />
      </div>
    </div>
    <div v-if="step===4" class="standard-content">
      <h2 class="standard-content--title">Paste your 24 word recovery seed phrase.</h2>
      <h2 class="standard-content--desc">If you do not have a recovery seed, go back and choose create.</h2>
      <div class="standard-content--body">
        <div class="standard-content--body__mnemonic">
          <h4 class="standard-content--body__mnemonic--title flex justify-between">
            Mnemonic
          </h4>
          <q-input
            ref="mnemonic"
            type="textarea"
            @input="validateMnemonic()"
            v-model="mnemonic"
            error-message="The mnemonic seed is invalid"
            :error="!mnemonicValidated"
          />
        </div>
      </div>
      <div class="standard-content--footer">
         <q-btn flat class="action-link back" color="black" text-color="white" label="Back" @click="step=1" />
         <q-btn flat class="action-link next" color="black" text-color="white" label="Next" @click="saveMnemonic()" :disable="!mnemonicValidated" />
      </div>
    </div>
  </q-page>
</template>

<script>
const bip39 = require('bip39')
import HD from '@/util/hdwallet'
import WordsOrder from '../../components/Verto/WordsOrder'
import { userError } from '@/util/errorHandler'

export default {
  components: {
    WordsOrder
  },
  data () {
    return {
      step: 1,
      isPwd: true,
      mnemonicValidated: '',
      goodPassword: false,
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
  },
  async mounted () {
    console.log('mnemonic', this.mnemonic, 'config', this.config)
  },
  computed: {
    rightOrder () {
      if (JSON.stringify(this.arrayMnemonic) === JSON.stringify(this.arrayOrdered)) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    validateMnemonic () {
      this.mnemonicValidated = bip39.validateMnemonic(this.mnemonic)
    },
    chooseMe (word, index, show) {
      if (show) {
        this.arrayOrdered.push(word)
        this.$set(this.arrayShuffleShow, index, show)
      } else {
        this.arrayOrdered = this.arrayOrdered.filter(e => e !== word)
        let unset = this.arrayShuffled.indexOf(word)
        this.$set(this.arrayShuffleShow, unset, show)
      }

      this.$set(this.arrayOrdered)
    },
    async createMnemonic () {
      console.log('generating mnemonic')
      this.mnemonic = bip39.generateMnemonic(256)
      this.arrayMnemonic = this.mnemonic.split(' ')
      this.arrayShuffled = [...this.arrayMnemonic]
      this.shuffle(this.arrayShuffled)

      this.step = 2
    },
    async saveMnemonic () {
      if (this.vertoPassword) {
        this.config.mnemonic = this.mnemonic
        await this.$configManager.updateConfig(this.vertoPassword, this.config)
        const keys = await HD.Wallet('eos')
        const result = await this.$configManager.saveWalletAndKey('EOS Key - HD', this.vertoPassword, null, keys.publicKey, keys.privateKey, 'verto', 'mnemonic')

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
        this.$router.push('cruxpay')
      }
    },
    checkVertoPassword () {
      const self = this

      try {
        this.$configManager.getConfig(this.vertoPasswordTemp).then(result => {
          self.goodPassword = true
          self.config = result.config
          self.vertoPassword = self.vertoPasswordTemp
          this.$store.commit('settings/temporary', this.password)
        }).catch(error => {
          self.goodPassword = false
          userError(error)
          return false
        })
      } catch (error) {
        self.goodPassword = false
        userError(error)
        return false
      }
    },
    shuffle (array) {
      var currentIndex = array.length, temporaryValue, randomIndex

      // While there remain elements to shuffle...
      while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
      }

      return array
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
.standard-content{
  padding: 5% 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh !important;
  &--title{
    font-size: 35px;
    font-weight: $bold;
    position: relative;
    line-height: 50px;
    font-family: $Titillium;
    margin-top: 40px;
    margin-bottom: 40px;
  }
  &--desc{
    margin-top: -20px;
    margin-bottom: 10px;
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
    .action-link{
      height: 50px;
      text-transform: initial !important;
      font-size: 16px;
      letter-spacing: .5px;
      border-radius: 40px;
      width: 110px;
      margin-left: 10px;
      &.next{
        background-color: #7900FF !important;
      }
      &.back{
        background-color: #B0B0B0 !important;
      }
      &.purple{
        background-color: #7900FF !important;
      }
    }

  }
}
</style>

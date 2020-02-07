<template>
  <q-page class="column flex-center text-white bg-black">
    <q-card flat class="bg-black" style="width: 100%; max-width: 700px;">
      <q-card-section class="text-weight-bold text-center flex justify-between">
        <q-icon name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('wallet/makepayment')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium text-uppercase col">HD Wallet Setup</big>
        <q-icon name="close" size="2.5rem" color="white" @click.native="$router.push('/wallet')"/>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-black" style="width: 100%; max-width: 700px;">
      <q-inner-loading :visible="spinnervisible">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <q-stepper active-color="green" done-color="green" ref="stepper" alternative-labels animated v-model="step">

        <q-step default :name="1" :done="step>1" title="Create or Restore" class=" bg-black workflow-step">
          <q-card-section>
            <div class="text-center text-white text-uppercase">
              <div class="row">
                <div class="col text-center">
                  <h5>Do you want to Create or Restore your 24 word Mnemonic Secret Seed Phrase?</h5>
                  <div class="row">
                    <div class="col q-pa-md">
                      <q-btn color="white" glossy outline @click="createMnemonic()">
                        {{ $t('create') }}
                      </q-btn>
                    </div>
                    <div class="col q-pa-md">
                      <q-btn color="white" glossy outline @click="create = false; step = 2">
                        {{ $t('restore') }}
                      </q-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-step>

        <q-step default :name="2" :done="step>2" title="Mnemonic" class=" bg-black workflow-step">
          <q-card-section>
            <div class="text-center text-white text-uppercase">

              <q-item-section>
                <q-item-label>Write down your 24 words in a safe place</q-item-label>
              </q-item-section>

              <div class="q-pa-md">
                <q-input type="textarea" dark filled v-model="mnemonic" label="Mnemonic"/>
              </div>

              <q-btn color="white" glossy outline @click="step = 3">
                {{ $t('verify') }}
              </q-btn>
            </div>
          </q-card-section>
        </q-step>

        <q-step default :name="3" :done="step>3" title="Verify" class=" bg-black workflow-step">
          <q-card-section>
            <div class="text-center text-white text-uppercase">

              <q-item-section>
                <q-item-label>Reorder your 24 words to prove you stored them by clicking on them in the rigth order</q-item-label>
              </q-item-section>

              <div class="q-pa-md">
                <q-chip v-for="(word, index) in arrayOrdered" :key="index"
                  v-show="arrayOrdered[index]"
                  v-model="arrayTest3[index]"
                  dark color="green" icon="cancel"
                  clickable @click="chooseMe(word, index, false)"
                >
                  {{ word }}
                </q-chip>
              </div>

              <q-separator dark />

              <div class="q-pa-md">
                <q-chip v-for="(word, index) in arrayShuffled" :key="index"
                  v-show="!arrayShuffleShow[index]"
                  v-model="arrayTest2[index]"
                  dark color="orange"
                  clickable @click="chooseMe(word, index, true)"
                >
                  {{ word }}
                </q-chip>
              </div>

              <div v-show="rightOrder" class="q-pa-sm" @click="step=4" >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('next') }}</q-tooltip>
                </q-icon>
              </div>

            </div>
          </q-card-section>
        </q-step>

        <q-step default :name="4" :done="step>4" title="Password" class=" bg-black workflow-step">
          <q-card-section class="text-center text-white">

              <q-item-section>
                <q-item-label>The Seed Phrase will now be added to your config after confirming the Verto password</q-item-label>
              </q-item-section>

              <q-input
                v-model="vertoPassword"
                dark
                color="green"
                label="Verto Password"
                @input="checkVertoPassword"
                @keyup.enter="saveMnemonic"
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
            <div v-show="!goodPassword" class="text-h6 text-uppercase text-red  q-pa-md">
              {{ $t('SaveToFile.password_incorrect') }}
            </div>
            <div class="q-pa-md text-center" v-show="goodPassword" @click="saveMnemonic" >
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('WalletManager.submit') }}</q-tooltip>
              </q-icon>
            </div>
          </q-card-section>
        </q-step>
      </q-stepper>
    </q-card>
  </q-page>
</template>

<script>
const bip39 = require('bip39')
import configManager from '@/util/ConfigManager'
import HD from '@/util/hdwallet'

export default {
  data () {
    return {
      step: 1,
      isPwd: true,
      goodPassword: false,
      vertoPassword: null,
      config: null,
      chip: null,
      spinnervisible: false,
      mnemonic: this.$store.state.settings.mnemonic,
      arrayMnemonic: [],
      arrayShuffled: [],
      arrayOrdered: [],
      arrayShuffleShow: [],
      arrayTest2: [],
      arrayTest3: [],
      master: null,
      myWallet: null,
      myBTCAddress: null,
      myLTCAddress: null,
      myETHAddress: null,
      myXRPAddress: null,
      myXLMAddress: null,
      myXTZAddress: null,
      myADAAddress: null,
      myBNBAddress: null,
      myDASHAddress: null,
      myEOSAddress: null
    }
  },
  async created () {
  },
  async mounted () {
    if (!this.mnemonic) {

    }

    // ['xtz', 'eos', 'ltc', 'dash', 'btc', 'xrp', 'xlm', 'eth', 'bnb', 'ada'].forEach(async (currencyCode) => {
    //   const currencyKeys = await HD.Wallet(currencyCode)
    //   this[`my${currencyCode.toUpperCase()}Address`] = `${currencyKeys.publicKey} ${currencyKeys.privateKey}`
    // })
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
      this.mnemonic = bip39.generateMnemonic(256)
      this.arrayMnemonic = this.mnemonic.split(' ')
      this.arrayShuffled = [...this.arrayMnemonic]
      this.shuffle(this.arrayShuffled)

      this.step = 2
    },
    async saveMnemonic () {
      if (this.goodPassword) {
        this.config.mnemonic = this.mnemonic
        // this.$store.commit('settings/mnemonic', this.mnemonic)
        await this.$configManager.updateConfig(this.vertoPassword, this.config)
        const keys = await HD.Wallet('eos')
        // Need to pass type? // private key gets saved if no pass?
        const result = await this.$configManager.saveWalletAndKey('HD EOS Key', this.vertoPassword, null, keys.publicKey, keys.privateKey, 'verto')

        if (result && result.success) {
          try {
            await configManager.backupConfig()
            if (this.$q.platform.is.android) {
              this.$q.notify({ color: 'positive', message: 'Config Saved' })
            }
          } catch (e) {
            // TODO: Exception handling
          }
          this.vertoPassword = ''
          this.$q.notify({ color: 'positive', message: 'EOS Keys created' })
          this.$router.push('wallet')
        }
      }
    },
    async checkVertoPassword () {
      const results = await configManager.getConfig(this.vertoPassword)
      if (results.success) {
        this.goodPassword = true
        this.config = results.config
      } else {
        this.goodPassword = false
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
    }
  }
}
</script>

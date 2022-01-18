<template>
  <q-page class="flex flex-center text-white bg-black">
    <q-card flat class="bg-black">
      <q-card-section class="bg-black text-weight-bold text-center text-uppercase">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('addwallets/createLedgerWriteItDown')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium">Write It Down</big>
        <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('create-wallet-options')"/>
      </q-card-section>
      <q-stepper  v-model="step" done-color="green" active-color="green" color="green bg-white" ref="stepper" alternative-labels animated>
        <!--
          Step 1: Display Private Key
        -->
        <q-step default :name="1" :done="step > 1" title="Private Key" class=" bg-black workflow-step">
          <q-card-section class=" text-white"  >
            <div class="float-center text-center">
              <div style='border-style: solid;' class="q-pa-md">
            <div v-show="privateKey" class="float-right" >
              <img src="@/assets/copy.svg" @click="copyToClipboard(privateKey)">
            </div>
            <div class="flex text-center text-h6" v-for="part in privatekeyParts"  :key="part">
                <br><br>
                {{ part }}
            </div>
          </div>
          <div class="q-pa-xl">
            <q-btn color="white" glossy outline @click="$refs.stepper.next()">
              {{ $t('SaveYourKeys.done') }}
            </q-btn>
          </div>
            </div>
          </q-card-section>
        </q-step>
        <!--
          Step 2: Display Private Key
        -->
        <q-step default :name="2" :done="step > 2" title="Wallet Name" class=" bg-black workflow-step">
          <q-card-section class=" text-white"  >
            <div class="float-center text-center">
              <div class="">
                <span class="q-pa-sm">
                  <q-input
                    v-model="walletName"
                    dark
                    color="green"
                    @input="checkName"
                    @keyup.enter="showTheSaveScreen"
                    :label="$t('DisplayKey.walletname')"
                  />
                </span>
                <div class="q-pa-sm" v-show="showNameSubmit" @click="showTheSaveScreen" >
                  <q-icon name="navigate_next" size="3.2rem" color="green"   >
                    <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                  </q-icon>
                </div>
              </div>
              <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
            </div>
          </q-card-section>
        </q-step>
        <!--
          Step 3: Display Private Key
        -->
        <q-step default :name="3" :done="step > 3" title="VertoPassword" class=" bg-black workflow-step">
          <q-card-section class=" text-white"  >
            <div class="float-center text-center">
              <div class="text-white">
                <span class="q-pa-sm">
                  <q-input
                    v-model="vertoPassword"
                    dark
                    color="green"
                    @input="checkPassword"
                    @keyup.enter="submit"
                    :label="$t('DisplayKey.verto_password')"
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
                </span>
                <div v-show="nameAlreadyUsed" class="text-h6 text-uppercase text-red">
                  {{ $t('DisplayKey.name_is_used') }}
                </div>
                <div v-show="passwordInvalid" class="text-h6 text-uppercase text-red">
                  {{ $t('SaveToFile.password_incorrect') }}
                </div>
                <div class="q-pa-sm" v-show="showPasswordSubmit" @click="submit" >
                  <q-icon name="navigate_next" size="3.2rem" color="green"   >
                    <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                  </q-icon>
                </div>
              </div>
              <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
            </div>
          </q-card-section>
        </q-step>
      </q-stepper>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      privatekeyParts: [],
      showKeyScreen: true,
      showSaveScreen: false,
      showNameScreen: false,
      buttonsAreDisabled: true,
      privateKey: '',
      publicKey: '',
      walletName: '',
      vertoPassword: '',
      errorMessage: '',
      iunderstand: false,
      showNameSubmit: false,
      showPasswordSubmit: false,
      nameAlreadyUsed: false,
      passwordInvalid: false,
      isPwd: true,
      step: 1
    }
  },
  mounted () {
    this.generateKeys()
  },
  methods: {
    showTheSaveScreen () {
      if (this.showNameSubmit) {
        this.$refs.stepper.next()
      }
    },
    resetErrors: function () {
      this.passwordInvalid = false
      this.nameAlreadyUsed = false
    },
    checkName () {
      if (this.walletName && this.walletName.length > 2) {
        this.showNameSubmit = true
      } else {
        this.showNameSubmit = false
      }
    },
    checkPassword () {
      this.resetErrors()
      if (this.vertoPassword && this.vertoPassword.length > 2) {
        this.showPasswordSubmit = true
      } else {
        this.showPasswordSubmit = false
      }
    },
    generateKeys () {
      const ecc = require('eosjs-ecc')
      ecc.randomKey().then(privateKey => {
        this.privateKey = privateKey
        this.publicKey = ecc.privateToPublic(privateKey)
        this.breakPrivateKeyDown()
      })
    },
    breakPrivateKeyDown () {
      this.privatekeyParts = []
      this.privatekeyParts.push(this.privateKey.substring(0, 14))
      this.privatekeyParts.push(this.privateKey.substring(14, 29))
      this.privatekeyParts.push(this.privateKey.substring(29, 44))
      if (this.privateKey.length > 44) {
        this.privatekeyParts.push(this.privateKey.substring(44))
      }
      // this.privatekeyParts.push(privateKey.spi) 5KZsPhg7d3AGbijowNc1r8kwbzmmw7qjnCkEQPzDHdzELrX3qQD
    },
    checked () {
      if (this.iunderstand) {
        this.buttonsAreDisabled = false
      } else {
        this.buttonsAreDisabled = true
      }
    },
    submit: async function () {
      if (!this.showPasswordSubmit) {
        return
      }
      this.resetErrors()
      const result = await this.$configManager.saveWalletAndKey(this.walletName, this.vertoPassword, null, this.publicKey, this.privateKey, 'verto')
      if (result && result.success) {
        this.walletName = ''
        this.vertoPassword = ''
        this.publicKey = ''
        this.privateKey = ''
        this.$q.notify({ color: 'positive', message: 'Wallet created' })
        this.$router.push('wallet')
      } else {
        if (result && result.message === 'name_already_used') {
          this.nameAlreadyUsed = true
        } else {
          this.passwordInvalid = true
        }
      }
    },
    copyToClipboard (key) {
      this.$clipboardWrite(key)
      this.$q.notify({
        message: this.$t('DisplayKey.copied'),
        timeout: 2000,
        icon: 'check',
        textColor: 'black',
        type: 'warning',
        position: 'top'
      })
    },
    cancel () {
      this.$router.push('vertomanager')
    }
  }
}
</script>

<style>
img {
  width: 3rem;
}
.key-input {
  border: 1px solid yellow;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  min-height: 2.5rem;
  max-width: 90vw;
}
.key-input div{
  max-width: 70vw;
  overflow: hidden;
  text-overflow: ellipsis;
}
.key-input img {
  width: 1.2rem;
  cursor: pointer;
}
</style>

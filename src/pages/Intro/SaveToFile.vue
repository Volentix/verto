<template>
  <q-page class="flex flex-center text-white bg-black">
    <q-card flat>
      <q-card-title class="text-weight-bold text-center uppercase">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('addwallets/createLedgerSaveFile')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium">Save To File</big>
        <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('create-wallet-options')"/>
      </q-card-title>
      <q-stepper dark color="green bg-white" ref="stepper" alternative-labels :contractable="contractable">
        <!--
          Step 1: Name
        -->
        <q-step default name="first" title="Wallet Name" class=" bg-black workflow-step">
          <q-card-main class=" text-white"  >
          <div class="text-left">
              <div class="q-py-xs">
                <q-field>
                  <q-input
                    v-model="walletName"
                    dark
                    color="green"
                    float-label="Give Wallet A Name. ie: Savings"
                    @input="checkName"
                    @keyup.enter="showThePasswordScreen"
                  />
                </q-field>
              </div>
              <div
                v-show="showNextButtonToPassword"
                class="text-center q-pa-sm"
                @click="showThePasswordScreen"
              >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('next') }}</q-tooltip>
                </q-icon>
              </div>
          </div>
          </q-card-main>
        </q-step>
        <!--
          Step 2: File Password
        -->
        <q-step default name="second" title="File Password" class=" bg-black workflow-step">
          <q-card-main class=" text-white"  >
          <div>
            <div class="q-py-sm uppercase">
              <q-item>
                <q-item-side>
                  <q-chip dense color="red" class="shadow-1">&nbsp;</q-chip>
                </q-item-side>
                <q-item-main label="Is eight characters or more" />
              </q-item>
              <q-item>
                <q-item-side>
                  <q-chip dense color="amber" class="shadow-1">&nbsp;</q-chip>
                </q-item-side>
                <q-item-main label="Should be different than the wallet password"/>
              </q-item>
            </div>
            <div class="text-left">
                <div class="q-py-xs">
                  <q-field  >
                    <q-input
                    v-model="password"
                    type="password"
                    dark
                    color="green"
                    float-label="Choose Private Key Passwords"
                    @input="checkPassword"
                  />
                  </q-field>
                </div>
                <div class="q-py-xs">
                  <q-field>
                    <q-input
                      v-model="confirmPassword"
                      type="password"
                      dark
                      color="green"
                      float-label="Confirm Private Key Password"
                      @input="checkPassword"
                      @keyup.enter="showTheVertoPasswordScreen"
                    />
                  </q-field>
                </div>
                <div
                  v-show="showNextButtonToVertoPassword"
                  class="text-center q-pt-md"
                  @click="showTheVertoPasswordScreen"
                >
                  <q-icon name="navigate_next" size="3.2rem" color="green"   >
                    <q-tooltip>{{ $t('next') }}</q-tooltip>
                  </q-icon>
                </div>
            </div>
          </div>
          </q-card-main>
        </q-step>
        <!--
          Step 3: Verto Password
        -->
        <q-step default name="third" title="Verto Password" class=" bg-black workflow-step">
          <q-card-main class=" text-white"  >
            <div>
            <div class="">
              <q-field>
                <q-input
                  v-model="vertoPassword"
                  type="password"
                  dark
                  color="green"
                  float-label="Verto Password"
                  @input="checkVertoPassword"
                  @keyup.enter="submit"
                />
              </q-field>
            </div>
            <div v-show="nameAlreadyUsed" class="q-title uppercase text-red q-pa-md">
              {{ $t('DisplayKey.name_is_used') }}
            </div>
            <div v-show="passwordInvalid" class="q-title uppercase text-red  q-pa-md">
              {{ $t('SaveToFile.password_incorrect') }}
            </div>
            <div
              v-show="showSubmitButton"
              class="text-center q-pa-md"
              @click="submit"
            >
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('next') }}</q-tooltip>
              </q-icon>
            </div>
          </div>
          </q-card-main>
        </q-step>
      </q-stepper>
    </q-card>
  </q-page>
</template>

<script>
import configManager from '../../util/ConfigManager'

export default {
  // name: 'ComponentName',
  data () {
    return {
      privateKey: '',
      publicKey: '',
      walletName: '',
      password: '',
      confirmPassword: '',
      vertoPassword: '',
      showNextButtonToVertoPassword: false,
      showNextButtonToPassword: false,
      showSubmitButton: false,
      nameAlreadyUsed: false,
      passwordInvalid: false,
      contractable: true
    }
  },
  mounted () {
    const ecc = require('eosjs-ecc')
    ecc.randomKey().then(privateKey => {
      this.privateKey = privateKey
      this.publicKey = ecc.privateToPublic(privateKey)
    })
  },
  methods: {
    showThePasswordScreen () {
      if (this.showNextButtonToPassword) {
        this.$refs.stepper.next()
      }
    },
    showTheVertoPasswordScreen () {
      if (this.showNextButtonToVertoPassword) {
        this.$refs.stepper.next()
      }
    },
    checkVertoPassword () {
      this.passwordInvalid = false
      this.nameAlreadyUsed = false
      if (this.vertoPassword && this.vertoPassword.length > 2) {
        this.showSubmitButton = true
      } else {
        this.showSubmitButton = false
      }
    },
    checkName () {
      if (this.walletName && this.walletName.length > 2) {
        this.showNextButtonToPassword = true
      } else {
        this.showNextButtonToPassword = false
      }
    },
    checkPassword () {
      if (this.password.length > 7 && this.password === this.confirmPassword) {
        this.showNextButtonToVertoPassword = true
      } else {
        this.showNextButtonToVertoPassword = false
      }
    },
    resetErrors () {
      this.passwordInvalid = false
      this.nameAlreadyUsed = false
    },
    cancel () {
      this.$router.push('vertomanager')
    },
    async submit () {
      if (!this.showSubmitButton) {
        return
      }
      this.resetErrors()

      if (this.$store.state.settings.airplaneMode) {
        window.cordova.plugins.settings.open('airplane_mode')
      }
      try {
        const result = await configManager.saveWalletAndKey(this.walletName, this.vertoPassword, this.password, this.publicKey, this.privateKey)
        if (result.success) {
          this.walletName = ''
          this.vertoPassword = ''
          this.password = ''
          this.publicKey = ''
          this.privateKey = ''
          if (this.$q.platform.is.android) {
            this.$q.dialog({
              title: this.$t('CreateVertoPassword.wallet_created'),
              message: this.$t('CreateVertoPassword.file_location', { location: window.cordova.file.externalRootDirectory + 'Download/' }),
              ok: true
            })
          } else {
            this.$q.notify({type: 'positive', message: this.$t('CreateVertoPassword.wallet_created')})
          }
          this.$router.push('wallet')
        } else {
          if (result.message === 'name_already_used') {
            this.nameAlreadyUsed = true
            this.showSubmitButton = false
          }
        }
      } catch (e) {
        if (!this.nameAlreadyUsed) {
          this.passwordInvalid = true
          this.showSubmitButton = false
        }
      }
    }
  }
}
</script>

<style>
.modal-content {
  word-wrap: break-word;
}
</style>

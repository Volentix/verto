<template>
  <q-page class="flex flex-center text-white bg-black  text-white">
    <q-card style="max-width: 500px;" flat>
      <q-card-title class="text-weight-bold text-center uppercase">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('addwallets/addLedger')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium q-pa-xl">{{ $t('CreateVertoPassword.addwallet') }}</big>
        <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('create-wallet-options')"/>
      </q-card-title>
      <q-stepper dark color="green bg-white" ref="stepper" alternative-labels :contractable="contractable">
        <q-step default name="first" title="Wallet Name" class=" bg-black workflow-step">
          <q-card-main class="text-center text-white"  >
            <q-field>
              <q-input
                v-model="wallet.name"
                dark
                color="green"
                @input="checkName"
                @keyup.enter="showEnterKeyScreen"
                :float-label="$t('DisplayKey.walletname')"
              />
            </q-field>
            <div class="q-pa-md" v-show="showSubmit.name" @click="showEnterKeyScreen" >
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
              </q-icon>
            </div>
          </q-card-main>
        </q-step>
        <q-step default name="second" title="Public Address" class=" bg-black workflow-step">
          <q-card-main class="text-white text-center">
            <q-item>
              <q-item-side>
                <q-chip v-show="!this.showSubmit.address" dense color="red" class="shadow-1">&nbsp;</q-chip>
                <q-chip v-show="this.showSubmit.address" dense color="green" class="shadow-1">&nbsp;</q-chip>
              </q-item-side>
              <q-item-main label="Must be a valid EOS public key" />
            </q-item>
            <q-field>
              <q-input
                v-model="wallet.address"
                dark
                color="green"
                @input="checkAddress"
                @keyup.enter="showVertoPasswordScreen"
                :float-label="$t('WalletManager.keyhere')"
              />
            </q-field>
            <div class="q-pa-md" v-show="showSubmit.address" @click="showVertoPasswordScreen" >
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
              </q-icon>
            </div>
            <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
          </q-card-main>
        </q-step>
        <q-step default name="thrird" title="Verto Password" class=" bg-black workflow-step">
          <q-card-main class="text-white text-center">
            <q-field>
              <q-input
                v-model="wallet.vertoPassword"
                type="password"
                dark
                color="green"
                @input="checkVertoPassword"
                @keyup.enter="submit"
                :float-label="$t('CreateVertoPassword.vertopassword')"
              />
            </q-field>
            <div v-show="errors.nameUsed" class="q-title uppercase text-red q-pa-md">
              {{ $t('DisplayKey.name_is_used') }}
            </div>
            <div v-show="errors.badPassword" class="q-title uppercase text-red  q-pa-md">
              {{ $t('SaveToFile.password_incorrect') }}
            </div>
            <div v-show="errors.unknown" class="q-title uppercase text-red  q-pa-md">
              Unkown Error.
            </div>
            <div class="q-pa-md" v-show="showSubmit.vertoPassword" @click="submit" >
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
              </q-icon>
            </div>
            <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
          </q-card-main>
        </q-step>
      </q-stepper>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      contractable: true,
      wallet: {
        name: '',
        address: '',
        vertoPassword: ''
      },
      showSubmit: {
        name: false,
        address: false,
        vertoPassword: false
      },
      errors: {
        nameUsed: false,
        badPassword: false,
        unknown: false
      },
      showNameSubmit: false
    }
  },
  mounted () {
  },
  methods: {
    checkName () {
      if (this.wallet.name && this.wallet.name.length > 2) {
        this.showSubmit.name = true
      } else {
        this.showSubmit.name = false
      }
    },
    checkAddress () {
      if (this.wallet.address &&
       this.wallet.address.length === 53 &&
       this.wallet.address.includes('EOS')) {
        this.showSubmit.address = true
      } else {
        this.showSubmit.address = false
      }
    },
    checkVertoPassword () {
      this.resetErrors()
      if (this.wallet.vertoPassword && this.wallet.vertoPassword.length > 2) {
        this.showSubmit.vertoPassword = true
      } else {
        this.showSubmit.vertoPassword = false
      }
    },
    showEnterKeyScreen () {
      if (this.showSubmit.name) {
        this.$refs.stepper.next()
      }
    },
    showVertoPasswordScreen () {
      if (this.showSubmit.address) {
        this.$refs.stepper.next()
      }
    },
    resetErrors () {
      this.errors.nameUsed = false
      this.errors.badPassword = false
      this.errors.unknown = false
    },
    async submit () {
      if (this.showSubmit.vertoPassword) {
        this.resetErrors()
        const result = await this.$configManager.addWallet(this.wallet.name, this.wallet.vertoPassword, this.wallet.address)
        if (result.success) {
          let wallet = {
            'key': this.wallet.address,
            'name': this.wallet.name,
            'type': 'verto'
          }
          this.$configManager.updateCurrentWallet(wallet)
          this.$router.push({path: '/wallet'})
        } else if (result.message === 'bad_password') {
          this.showSubmit.vertoPassword = false
          this.errors.badPassword = true
        } else if (result.message === 'name_already_used') {
          this.errors.nameUsed = true
        } else {
          this.showSubmit.vertoPassword = false
          this.errors.unknown = true
        }
      }
    }
  }
}
</script>

<style>
</style>

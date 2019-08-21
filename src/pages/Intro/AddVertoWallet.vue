<template>
  <q-page class="column flex-center text-white bg-black">
    <q-card flat class="bg-black" style="width: 100%; max-width: 500px;">
      <q-card-section class="text-weight-bold text-center text-uppercase">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('addwallets/addLedger')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium q-pa-xl">{{ $t('CreateVertoPassword.addwallet') }}</big>
        <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('create-wallet-options')"/>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-black" style="width: 100%; max-width: 500px;">
      <q-stepper done-color="green" active-color="green" ref="stepper" alternative-labels animated v-model="step">
        <q-step :name="1" title="Wallet Name" class="bg-black workflow-step" :done="step>1">
          <q-card-section class="text-center text-white"  >
              <q-input
                v-model="wallet.name"
                dark
                color="green"
                @input="checkName"
                @keyup.enter="showEnterKeyScreen"
                :label="$t('DisplayKey.walletname')"
              />
            <div class="q-pa-md" v-show="showSubmit.name" @click="showEnterKeyScreen" >
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
              </q-icon>
            </div>
          </q-card-section>
        </q-step>
        <q-step :name="2" title="Public Address" class="bg-black workflow-step" :done="step>2">
          <q-card-section class="text-white text-center">
            <q-item class="flex-center">
              <q-item-section class="col-auto q-mr-md">
                <q-chip v-if="!this.showSubmit.address" dense color="red" class="shadow-1">&nbsp;</q-chip>
                <q-chip v-else dense color="green" class="shadow-1">&nbsp;</q-chip>
              </q-item-section>
              <q-item-label>Must be a valid EOS public key</q-item-label>
            </q-item>
              <q-input
                v-model="wallet.address"
                dark
                color="green"
                @input="checkAddress"
                @keyup.enter="showVertoPasswordScreen"
                :label="$t('WalletManager.keyhere')"
              />
            <div class="q-pa-md" v-show="showSubmit.address" @click="showVertoPasswordScreen" >
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
              </q-icon>
            </div>
            <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
          </q-card-section>
        </q-step>
        <q-step :name="3" title="Verto Password" class=" bg-black workflow-step" :done="step>3">
          <q-card-section class="text-white text-center">
              <q-input
                v-model="wallet.vertoPassword"
                dark
                color="green"
                @input="checkVertoPassword"
                @keyup.enter="submit"
                :label="$t('CreateVertoPassword.vertopassword')"
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
            <div v-show="errors.nameUsed" class="text-h6 text-uppercase text-red q-pa-md">
              {{ $t('DisplayKey.name_is_used') }}
            </div>
            <div v-show="errors.badPassword" class="text-h6 text-uppercase text-red  q-pa-md">
              {{ $t('SaveToFile.password_incorrect') }}
            </div>
            <div v-show="errors.unknown" class="text-h6 text-uppercase text-red  q-pa-md">
              Unkown Error.
            </div>
            <div class="q-pa-md" v-show="showSubmit.vertoPassword" @click="submit" >
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
              </q-icon>
            </div>
            <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
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
      step: 1,
      isPwd: true,
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
          this.$router.push({ path: '/wallet' })
        } else if (result.message === 'bad_password') {
          this.showSubmit.vertoPassword = false
          this.errors.badPassword = true
        } else if (result.message === 'name_already_used') {
          this.errors.nameUsed = true
        } else {
          this.showSubmit.vertoPassword = false
          this.errors.unknown = true
          console.log('result', result)
        }
      }
    }
  }
}
</script>

<style>
</style>

<template>
  <q-page class="flex flex-center text-white bg-black" >
  <div class="fixed-center text-center bg-primary q-pa-lg" style="max-width: 700px; margin: 0 auto; ">
    <q-card-section class="text-weight-bold text-center text-uppercase">
      <big class="titillium q-pa-lg">Update Config</big>
      <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('/associations')"/>
    </q-card-section>
    <q-stepper done-color="green" active-color="green" ref="stepper" alternative-labels :contractable="contractable">
        <q-step default name="first" title="Verto Password" class=" bg-black workflow-step">
          <q-card-section class="text-center text-white"  >
            <q-field
        >
            <q-input
              type="password"
              dark
              v-model="password"
              @input="checkPassword"
              @keyup.enter="submit"
              color="green"
              v-bind:label="$t('ChangeVertoPassword.current')"
            />
        </q-field>
        <div v-show="badPassword" class="text-h6 text-uppercase text-red  q-pa-md">
          {{ $t('SaveToFile.password_incorrect') }}
        </div>
        <div v-show="unknownError" class="text-h6 text-uppercase text-red  q-pa-md  text-center">
          Unkown Error
        </div>
        <div class="q-pa-md text-center" v-show="submitBtn" @click="submit" >
          <q-icon name="navigate_next" size="3.2rem" color="green"   >
            <q-tooltip>{{ $t('WalletManager.submit') }}</q-tooltip>
          </q-icon>
        </div>
          </q-card-section>
        </q-step>
    </q-stepper>
  </div>
  </q-page>
</template>

<script>
import configManager from '../../util/ConfigManager'

export default {
  name: 'blocktopus-success',
  data () {
    return {
      password: '',
      submitBtn: false,
      passHasError: false,
      modal: false,
      badPassword: false,
      unknownError: false,
      contractable: true
    }
  },
  methods: {
    submit: async function () {
      this.badPassword = false
      this.passHasError = false
      this.unknownError = false
      try {
        const result = await configManager.addAssociationToWallet(this.$store.state.currentwallet.wallet.key, this.password, 'Blocktopus', {})
        if (result.success) {
          this.$router.push('/associations')
        } else if (result.message === 'bad_password') {
          this.badPassword = true
        } else {
          this.unknownError = true
        }
      } catch (err) {
        this.badPassword = true
      }
    },
    checkPassword () {
      this.badPassword = false
      this.unknownError = false
      if (this.password && this.password.length > 2) {
        this.submitBtn = true
      } else {
        this.submitBtn = false
      }
    },
    ok: function () {
      this.$router.push({ path: '/associations' })
    }
  }
}
</script>

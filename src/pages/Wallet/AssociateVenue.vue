<template>
  <q-page class="flex flex-center text-white bg-black">
    <q-card flat>
      <q-card-section class="text-weight-bold text-center">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('associations/index')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium text-uppercase q-pa-lg">{{ $t('VenueAssignAddress.header') }}</big>
        <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('/associations')"/>
      </q-card-section>
      <q-stepper dark color="green bg-white" ref="stepper" alternative-labels :contractable="contractable">
        <!--
          1. Paid to
        -->
        <q-step default name="frsure" title="Username" class=" bg-black workflow-step">
          <q-card-section>
            <div class="text-center text-white text-uppercase">
              <q-item>
                <q-item-section>
                  <q-chip dense color="green" class="shadow-1">&nbsp;</q-chip>
                </q-item-section>
                <q-item-label>
                  {{ $t('VenueAssignAddress.important_info') }}
                </q-item-label>
              </q-item>
              <q-field>
                <q-input
                  dark
                  type="text"
                  v-model="venueUserName"
                  color="greeen"
                  v-bind:label="$t('VenueAssignAddress.venue_username')"
                  @input="checkUsername"
                  @keyup.enter="gotToVenuePassword()"
                />
              </q-field>
              <div class="q-pa-sm text-center" v-show="showButtons.username" @click="gotToVenuePassword()" >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                </q-icon>
              </div>
            </div>
          </q-card-section>
        </q-step>
        <!--
          2. Venue Password
        -->
        <q-step name="password" title="Password" class=" bg-black workflow-step">
          <q-card-section>
            <div class="text-center text-white text-uppercase">
              <q-inner-loading :visible="spinnervisible">
                <q-spinner size="50px" color="primary" />
              </q-inner-loading>
              <q-field>
                <q-input
                  dark
                  type="password"
                  v-model="venuePassword"
                  color="green"
                  v-bind:label="$t('VenueAssignAddress.venue_password')"
                  @input="checkVenuePassword"
                  @keyup.enter="gotoVertoPassword()"
                />
              </q-field>
              <div v-show="wrongCredentials" class="text-h6 text-uppercase text-red q-pa-md text-center">
                {{ $t('VenueAssignAddress.bad_credentials') }}
              </div>
              <div v-show="emailVerificationRequired" class="text-h6 text-uppercase text-red q-pa-md text-center">
                {{ $t('VenueAssignAddress.email_verification_required') }}
              </div>
              <div v-show="addressNotUnique" class="text-h6 text-uppercase text-red q-pa-md text-center">
                {{ $t('VenueAssignAddress.verto_address_not_unique') }}
              </div>
              <div v-show="userDeactivated" class="text-h6 text-uppercase text-red q-pa-md text-center">
                {{ $t('VenueAssignAddress.user_deactivated') }}
              </div>
              <div v-show="somethingwrong" class="text-h6 text-uppercase text-red q-pa-md text-center">
                An unforseen error has occured. Please see your system admin.
              </div>
              <div class="q-pa-sm text-center" v-show="showButtons.password" @click="gotoVertoPassword()" >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                </q-icon>
              </div>
              <div class="q-pa-sm text-center">
                <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
              </div>
            </div>
          </q-card-section>
        </q-step>
        <!--
          3. Verto Password
        -->
        <q-step name="vertopassword" title="Verto Password" class=" bg-black workflow-step">
          <q-card-section>
            <div class="text-center text-white text-uppercase">
              <q-field>
                <q-input
                  dark
                  type="password"
                  v-model="vertopassword"
                  color="green"
                  v-bind:label="$t('ChangeVertoPassword.current')"
                  @input="checkVertoPassword"
                  @keyup.enter="addToVerto()"
                />
              </q-field>
              <div v-show="vertoPasswordWrong" class="text-h6 text-uppercase text-red q-pa-md text-center">
                Password Incorrect
              </div>
              <div class="q-pa-sm text-center" v-show="showButtons.vertoPassword" @click="addToVerto()" >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                </q-icon>
              </div>
              <div class="q-pa-sm text-center">
                <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
              </div>
            </div>
          </q-card-section>
        </q-step>
      </q-stepper>
    </q-card>
  </q-page>
</template>

<script>
import configManager from '../../util/ConfigManager'

export default {
  name: 'AssociateVenue',
  data () {
    return {
      contractable: false,
      spinnervisible: false,
      vertopassword: '',
      usernamenull: false,
      vertoPasswordWrong: false,
      appVersion: this.$appVersion,
      appName: this.$appName,
      notMatchingPass: false,
      venueUserName: '',
      venuePassword: '',
      fillAllFields: false,
      wrongCredentials: false,
      emailVerificationRequired: false,
      addressNotUnique: false,
      userDeactivated: false,
      somethingwrong: false,
      showButtons: {
        username: false,
        password: false,
        vertoPassword: false
      }
    }
  },
  methods: {
    checkVertoPassword () {
      this.vertoPasswordWrong = false
      this.showButtons.vertoPassword = false
      if (this.vertopassword.length > 3) {
        this.showButtons.vertoPassword = true
      }
    },
    async addToVerto () {
      if (!this.showButtons.vertoPassword) {
        return
      }
      try {
        await configManager.addAssociationToWallet(this.$store.state.currentwallet.wallet.key, this.vertopassword, 'Venue', {})
        this.$router.push('/associations')
      } catch (err) {
        this.vertoPasswordWrong = true
        this.showButtons.vertoPassword = false
      }
    },
    checkUsername () {
      this.resetErrors()
      this.showButtons.username = false
      if (this.venueUserName.length > 3) {
        this.showButtons.username = true
      }
    },
    gotToVenuePassword () {
      if (this.showButtons.username) {
        this.$refs.stepper.next()
      }
    },
    checkVenuePassword () {
      this.resetErrors()
      this.showButtons.password = false
      if (this.venuePassword.length > 3) {
        this.showButtons.password = true
      }
    },
    resetErrors () {
      this.usernamenull = false
      this.wrongCredentials = false
      this.vertoPasswordWrong = false
      this.emailVerificationRequired = false
      this.addressNotUnique = false
      this.userDeactivated = false
      this.somethingwrong = false
    },
    gotoVertoPassword () {
      if (!this.showButtons.password) {
        return
      }
      this.resetErrors()
      this.showButtons.password = false
      this.spinnervisible = true
      const self = this
      this.$axios.post(
        process.env[this.$store.state.settings.network].VENUE_URL + 'api/assign-verto-address',
        {
          verto_address: this.$store.state.currentwallet.wallet.key,
          username: this.venueUserName,
          password: this.venuePassword
        }
      ).then(function (res) {
        self.spinnervisible = false
        self.$refs.stepper.next()
      }).catch(function (err) {
        if (err.response.data.error_code === 'wrong_credentials') {
          self.wrongCredentials = true
        } else if (err.response.data.error_code === 'email_verification_required') {
          self.emailVerificationRequired = true
        } else if (err.response.data.error_code === 'verto_address_not_unique') {
          self.addressNotUnique = true
        } else if (err.response.data.error_code === 'user_deactivated') {
          self.userDeactivated = true
        }
        self.spinnervisible = false
      })
    },
    associateWithVenue: async function () {
      this.usernamenull = false
      this.wrongCredentials = false
      this.vertoPasswordWrong = false
      this.emailVerificationRequired = false
      this.addressNotUnique = false
      this.userDeactivated = false
      this.somethingwrong = false

      if (this.venueUserName === '') {
        this.usernamenull = true
        return
      }
      if (this.venuePassword === '') {
        this.wrongCredentials = true
        return
      }
      if (this.vertopassword === '') {
        this.vertoPasswordWrong = true
        return
      }
      const result = await configManager.getConfig(this.vertopassword)
      if (!result.success) {
        this.vertoPasswordWrong = true
        return
      }
      const self = this
      this.$axios.post(
        process.env[this.$store.state.settings.network].VENUE_URL + '/api/assign-verto-address',
        {
          verto_address: self.$store.state.currentwallet.wallet.key,
          username: self.venueUserName,
          password: self.venuePassword
        }
      ).then(function (res) {
        return configManager.addAssociationToWallet(self.$store.state.currentwallet.wallet.key, self.vertopassword, 'Venue', {})
      }).then(function (result) {
        if (result.success) {
          self.$router.push('/associations')
        } else {
          self.somethingwrong = true
        }
      }).catch(function (err) {
        if (err.response.data.error_code === 'wrong_credentials') {
          self.wrongCredentials = true
        } else if (err.response.data.error_code === 'email_verification_required') {
          self.emailVerificationRequired = true
        } else if (err.response.data.error_code === 'verto_address_not_unique') {
          self.addressNotUnique = true
        } else if (err.response.data.error_code === 'user_deactivated') {
          self.userDeactivated = true
        }
      })
    }
  }
}
</script>

<style>
</style>

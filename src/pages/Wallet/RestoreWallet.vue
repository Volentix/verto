<template>
<q-page class="column flex-center text-white bg-black">
  <q-card flat class="bg-black" style="width: 100%; max-width: 500px;">
    <q-card-section class="text-weight-bold text-center text-uppercase">
      <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('settings/restoreConfig')">
        <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
      </q-icon>
      <big class="titillium q-pa-xl">{{ $t('SettingsView.restore_config') }}</big>
      <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="goback"/>
    </q-card-section>
  </q-card>
  <q-card flat class="bg-black" style="width: 100%; max-width: 500px;">
      <q-inner-loading :visible="spinnervisible">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <q-stepper done-color="green" active-color="green" ref="stepper" alternative-labels animated v-model="step">
        <q-step :name="1" :done="step>1" title="Select Config File" class=" bg-black workflow-step">
          <q-card-section class="text-white text-center">
            <div class="flex flex-center text-white q-pa-sm">
             <file-select @input="checks" @keyup.enter="showThePasswordScreen" v-model="file"></file-select>
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
          </q-card-section>
        </q-step>
        <q-step :name="2" :done="step>2" title="Verto Password" class=" bg-black workflow-step">
          <q-card-section class=" text-white text-center"  >
            <div>
                <q-input
                  dark
                  v-model="addWallet.vertoPassword"
                  type="password"
                  color="green"
                  @input="showSubmitKey"
                  @keyup.enter="restoreConfig"
                  v-bind:label="$t('CreateVertoPassword.vertopassword')"
                />
            </div>
            <div v-show="incorrectPassword" class="text-h6 text-uppercase text-red q-pa-lg">
              {{ $t('Welcome.incorrect') }}
            </div>
            <div v-show="fileEmpty" class="text-h6 text-uppercase text-red q-pa-lg">
              You have to select a config file
            </div>
            <div v-show="unknownError" class="text-h6 text-uppercase text-red q-pa-lg">
              Unknown Error
            </div>
            <div v-show="submitKey" class="q-pa-md" @click="restoreConfig">
              <q-icon name="navigate_next" size="3.2rem" color="green" >
                <q-tooltip>{{ $t('next') }}</q-tooltip>
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
import FileSelect from '@/components/FileSelect.vue'
import configManager from '@/util/ConfigManager'
import { userError } from '@/util/errorHandler'

export default {
  name: 'RestoreConfig',
  components: {
    FileSelect
  },
  data () {
    return {
      step: 1,
      spinnervisible: false,
      contractable: true,
      submitKey: false,
      fileEmpty: false,
      unknownError: false,
      incorrectPassword: false,
      showNextButtonToPassword: false,
      file: null,
      returnto: '',
      addWallet: {
        walletName: '',
        address: '',
        addressPriv: '',
        vertoPassword: '',
        vertoPasswordError: ''
      }
    }
  },
  created () {
    this.returnto = this.$route.params.returnto
  },
  methods: {
    goback () {
      if (this.returnto === 'settings') {
        this.$router.push('/settings')
      } else {
        this.$router.push(this.returnto)
      }
    },
    showThePasswordScreen () {
      if (this.showNextButtonToPassword) {
        this.$refs.stepper.next()
      }
    },
    showSubmitKey () {
      this.resetErrors()
      if (this.addWallet.vertoPassword.length > 2) {
        this.submitKey = true
      } else {
        this.submitKey = false
      }
    },
    resetErrors () {
      this.incorrectPassword = false
      this.fileEmpty = false
      this.unknownError = false
    },
    checks: function () {
      if (!this.file) {
        this.fileEmpty = true
        this.showNextButtonToPassword = false
      } else {
        this.fileEmpty = false
        this.showNextButtonToPassword = true
      }
    },
    async restoreConfig () {
      const that = this
      const reader = new FileReader()
      reader.onload = async function () {
        try {
          this.spinnervisible = true
          const results = await configManager.restoreConfig(reader.result, that.addWallet.vertoPassword)
          if (results.message === 'bad_password') {
            // that.startRestoreConfig()
            this.spinnervisible = false
            throw new Error('Incorrect Password')
          }
          // updateProgress(1)
          this.applicationRefreshing = true
          that.$q.notify({ color: 'positive', message: 'Application refreshing' })
          setTimeout(function () {
            that.$router.push({ name: 'wallet' })
            this.spinnervisible = false
          }, 300)
        } catch (e) {
          this.spinnervisible = false
          userError(e)
        }
      }
      reader.readAsText(this.file)
    }
  }
}
</script>

<style lang="stylus" scoped>
a
  cursor: pointer
</style>

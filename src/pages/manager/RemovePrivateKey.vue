<template>
  <q-page class="flex flex-center text-white bg-black">
    <q-card flat>
      <q-card-section class="text-weight-bold text-center">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('walletmanager/deletePrivateKey')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium text-uppercase q-pa-lg">Delete Private Key</big>
        <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('/vertomanager')"/>
      </q-card-section>
    <q-stepper dark color="green bg-white" ref="stepper" alternative-labels :contractable="contractable">
        <!--
          1. Paid to
        -->
        <q-step default name="download" title="Download" class=" bg-black workflow-step">
          <q-card-section>
          <div class="text-center text-white text-uppercase">
            <div class="text-h4 text-uppercase q-pa-md">
                Download Backup
              </div>
              <div v-show="errorDownloadingFile" class="text-h6 text-uppercase text-red q-pa-md text-center">
                Error Downloading File
              </div>
              <div class="flex flex-center text-white q-pa-md">
                <q-btn class="" glossy outline color="white" label="Yes" @click="downloadPrivateKey()" />
              </div>
              <div class="flex flex-center text-white q-pa-md">
                <q-btn color="white" glossy outline  @click="$refs.stepper.next()" label="No" />
              </div>
          </div>
          </q-card-section>
        </q-step>
        <!--
          3
        -->
        <q-step name="vertoPassword" title="Verto Password" class=" bg-black workflow-step">
          <q-card-section>
            <div class="text-h6  text-white text-uppercase text-center">
                <q-field>
                  <q-input
                    v-model="vertoPassword"
                    dark
                    type="password"
                    color="green"
                    label="Verto Password"
                    @input="checkVertoPassword"
                    @keyup.enter="submit()"
                  />
                </q-field>
            </div>
            <div v-show="vertoPasswordWrong" class="text-h6 text-uppercase text-red q-pa-md text-center">
              Password Incorrect
            </div>
            <div class="q-pa-sm text-center" v-show="vertoPassordValid" @click="submit()" >
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
              </q-icon>
            </div>
            <div class="q-pa-sm text-center">
              <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
            </div>
          </q-card-section>
        </q-step>
    </q-stepper>
  </q-card>
</q-page>
</template>

<script>
// import FileSelect from '@/components/FileSelect.vue'

export default {
  components: {
    // FileSelect
  },
  data () {
    return {
      file: null,
      iunderstand: false,
      contractable: true,
      gotfile: false,
      privateKeyPasswordValid: false,
      privateKeyPassword: '',
      privateKeyFromFile: '',
      passwordFileError: false,
      invalidPrivateKeyPassword: false,
      vertoPassword: '',
      vertoPassordValid: false,
      vertoPasswordWrong: false,
      errorDownloadingFile: false
    }
  },
  created () {
    this.wallet = this.$store.state.currentwallet.wallet
  },
  methods: {
    async downloadPrivateKey () {
      this.errorDownloadingFile = false
      try {
        const self = this
        this.$configManager.downloadFile(this.wallet.privateKeyEncrypted, this.wallet.name + '.priv')
          .then(function (results) {
            self.$refs.stepper.next()
          }).catch(function (err) {
            console.log('results: ', err)
            self.errorDownloadingFile = true
          })
      } catch (err) {
        this.errorDownloadingFile = true
        console.log(err)
      }
    },
    async submit () {
      if (!this.vertoPassordValid) {
        return
      }
      this.vertoPassordValid = false
      try {
        const result = await this.$configManager.removePrivateKeyInWallet(this.vertoPassword, this.wallet.name)
        if (result.success) {
          this.$router.push({ path: 'vertomanager' })
        } else {
          this.vertoPasswordWrong = true
        }
      } catch (err) {
        this.vertoPasswordWrong = true
      }
    },
    checkVertoPassword () {
      this.vertoPasswordWrong = false
      this.vertoPassordValid = false
      if (this.vertoPassword.length > 7) {
        this.vertoPassordValid = true
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
a
  cursor: pointer
</style>

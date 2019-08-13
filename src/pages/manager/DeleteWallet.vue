<template>
  <q-page class="column flex-center text-white bg-black">
    <q-card flat class="bg-black" style="width: 100%; max-width: 500px;">
      <q-card-section class="text-weight-bold text-center">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('walletmanager/deleteWallet')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium text-uppercase q-pa-xl">Delete Wallet</big>
        <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('/vertomanager')"/>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-black" style="width: 100%; max-width: 500px;">
    <q-stepper active-color="green" done-color="green" ref="stepper" alternative-labels animated v-model="step">
        <!--
          1. Paid to
        -->
        <q-step :name="1" :done="step>1" title="Last Chance" class="bg-black workflow-step">
          <q-card-section>
          <div class="text-center text-white text-uppercase">
            <div class="text-h4 text-uppercase q-pa-md">
                Are you sure?
              </div>
              <div class="flex flex-center text-white q-pa-md">
                <q-btn color="white" glossy outline  @click="$refs.stepper.next()" label="Yes" />
              </div>
          </div>
          </q-card-section>
        </q-step>
        <!--
          2
        -->
        <q-step :name="2" :done="step>2" title="Verto Password" class="bg-black workflow-step">
          <q-card-section>
            <div class="text-h6  text-white text-uppercase text-center">
              <q-input
                v-model="vertoPassword"
                dark
                type="password"
                color="green"
                label="Verto Password"
                @input="checkVertoPassword"
                @keyup.enter="submit()"
              />
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
      step: 1,
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
    this.wallet = this.$route.params.wallet
    this.wallet.defaultKey = false
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
            console.log(err)
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
        const result = await this.$configManager.deleteWallet(this.vertoPassword, this.wallet)
        if (result.success) {
          this.$router.push({ name: 'vertomanager' })
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

<template>
  <q-page class="column flex-center text-white bg-black">
    <q-card flat class="bg-black" style="width: 100%; max-width: 500px;">
      <q-card-section class="text-weight-bold text-center">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('walletmanager/addPrivateKey')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium text-uppercase q-pa-lg">Add Private Key</big>
        <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('/vertomanager')"/>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-black" style="width: 100%; max-width: 500px;">
    <q-stepper active-color="green" done-color="green" ref="stepper" alternative-labels animated v-model="step">
        <!--
          1. Paid to
        -->
        <q-step :name="1" title="Choose File" class=" bg-black workflow-step" :done="step>1">
          <q-card-section>
          <div class="text-center text-white text-uppercase">
            <div class="text-h6 text-uppercase q-pa-md">
                Choose Private Key Encrypted File
              </div>
              <div class="flex flex-center text-white q-pa-sm">
                <file-select @input="checksFile" v-model="file"></file-select>
              </div>
              <div v-show="passwordFileError" class="text-h6 text-uppercase text-red q-pa-md">
                Error Getting File
              </div>
              <div class="q-pa-md" v-show="gotfile && !passwordFileError" @click="gottoFilePassword()">
                <q-icon name="navigate_next" size="3.2rem" color="green" >
                  <q-tooltip>{{ $t('next') }}</q-tooltip>
                </q-icon>
              </div>
          </div>
          </q-card-section>
        </q-step>
        <!--
          2
        -->
        <q-step :name="2" title="Validate" class=" bg-black workflow-step" icon="fas fa-check-double" :done="step>2">
          <q-card-section>
            <div class="text-h6  text-white text-uppercase text-center">
                  <q-input
                    v-model="privateKeyPassword"
                    dark
                    color="green"
                    label="Private Key Password"
                    @input="checkPrivateKeyPassword"
                    @keyup.enter="gotoVertoPassword()"
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
            </div>
            <div v-show="invalidPrivateKeyPassword" class="text-h6 text-uppercase text-red q-pa-md text-center">
              Password Incorrect
            </div>
            <div class="q-pa-sm text-center" v-show="privateKeyPasswordValid" @click="gotoVertoPassword()" >
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
              </q-icon>
            </div>
            <div class="q-pa-sm text-center">
              <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
            </div>
          </q-card-section>
        </q-step>
        <!--
          3
        -->
        <q-step :name="3" title="Verto Password" class=" bg-black workflow-step" icon="fas fa-lock" :done="step>3">
          <q-card-section>
            <div class="text-h6  text-white text-uppercase text-center">
                  <q-input
                    v-model="vertoPassword"
                    dark
                    color="green"
                    label="Verto Password"
                    @input="checkVertoPassword"
                    @keyup.enter="submit()"
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
import sjcl from 'sjcl'
import FileSelect from '@/components/FileSelect.vue'

export default {
  components: {
    FileSelect
  },
  data () {
    return {
      step: 1,
      file: null,
      isPwd: true,
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
      vertoPasswordWrong: false
    }
  },
  created () {
    this.wallet = this.$store.state.currentwallet.wallet
  },
  methods: {
    async submit () {
      if (!this.vertoPassordValid) {
        return
      }
      try {
        const result = await this.$configManager.addPrivateKeyToWallet(this.vertoPassword, this.wallet.name, this.privateKeyFromFile)
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
      this.vertoPassordValid = false
      if (this.vertoPassword.length > 7) {
        this.vertoPassordValid = true
      }
    },
    gottoFilePassword () {
      const that = this
      const reader = new FileReader()
      this.passwordFileError = false
      reader.onload = async function () {
        try {
          that.privateKeyFromFile = reader.result
          that.$refs.stepper.next()
        } catch (e) {
          console.log(e)
          that.passwordFileError = true
          // userError(e)
        }
      }
      reader.readAsText(this.file)
    },
    gotoVertoPassword () {
      if (!this.privateKeyPasswordValid) {
        return
      }
      this.invalidPrivateKeyPassword = false
      let privateKeyEncrypted = ''
      if (this.privateKeyFromFile.constructor === String) {
        // In case it was previously useleslly stringified
        privateKeyEncrypted = this.privateKeyFromFile.replace(/\\"/g, '"')
        console.log('its a String')
      } else if (this.privateKeyFromFile.constructor === Object) {
        privateKeyEncrypted = JSON.stringify(this.privateKeyFromFile)
        console.log('its a Object')
      }
      const result = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)
      if (!result.success) {
        this.invalidPrivateKeyPassword = true
        this.privateKeyPasswordValid = false
        return
      } else {
        // This block is to support an old file format of keys found in the wild
        if (result.key.indexOf('privatekey') !== -1) {
          const key = JSON.parse(result.key)
          this.privateKeyFromFile = JSON.parse(sjcl.encrypt(this.privateKeyPassword, '"' + key.privatekey + '"'))
          console.log('found problem and fixed it')
        }
      }
      // Remove the private key immediately so it
      // does not stick around any longer than it has to
      this.privateKeyPassword = ''
      this.$refs.stepper.next()
    },
    checkPrivateKeyPassword () {
      this.invalidPrivateKeyPassword = false
      this.privateKeyPasswordValid = false
      if (this.privateKeyPassword.length > 7) {
        this.privateKeyPasswordValid = true
      }
    },
    checksFile () {
      this.passwordFileError = false
      this.gotfile = false
      if (this.file) {
        this.gotfile = true
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
a
  cursor: pointer
</style>

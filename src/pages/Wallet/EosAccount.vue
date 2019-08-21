<template>
<q-page class="column flex-center text-white bg-black">
  <q-card flat class="bg-black" style="width: 100%; max-width: 700px;">
    <div v-show="showMainSteps">
      <q-card-section class="text-weight-bold text-center text-uppercase">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('addwallets/addEos')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium">Import EOS Account</big>
        <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('create-wallet-options')"/>
      </q-card-section>
    </div>
  </q-card>
  <q-card flat class="bg-black" style="width: 100%; max-width: 700px;">
    <div v-show="showMainSteps">
        <q-stepper done-color="green" active-color="green" color="green" ref="stepper" alternative-labels v-model="step">
          <!--
            1.Private key
            -->
          <q-step :done="step>1" :name="1" title="Private Key" order="10" class="bg-black workflow-step" >
            <q-card-section class="text-white"  >
              <div class="float-center text-center">
                <div class="q-py-sm text-uppercase">
                  <q-item class="flex-center">
                    <q-item-section class="col-auto q-mr-md">
                      <q-chip v-if="!eosKeyNext || eosKeyInvalid" dense color="red" class="shadow-1">&nbsp;</q-chip>
                      <q-chip v-else dense color="green" class="shadow-1">&nbsp;</q-chip>
                    </q-item-section>
                    <q-item-label>A valid EOS active key</q-item-label>
                  </q-item>
                </div>
                <div>
                    <q-input
                      dark
                      v-model="addWallet.addressPriv"
                      :error="addWallet.addressError"
                      @input="showEosKeyNext"
                      @keyup.enter="nextFromPriv"
                      color="green"
                      :label="$t('EosAccount.enter_private_key')"
                    />
                </div>
                <div v-show="eosKeyInvalid" class="text-h6 text-uppercase text-red">
                  Key invalid
                </div>
                <div v-show='eosKeyNext && !eosKeyInvalid' @click="nextFromPriv">
                  <q-icon name="navigate_next" size="3.2rem" color="green" >
                    <q-tooltip>{{ $t('next') }}</q-tooltip>
                  </q-icon>
                </div>
              </div>
            </q-card-section>
          </q-step>
          <!--
            2. Account Name
            -->
          <q-step :done="step>2" :name="2"  title="Account Name" order="20" class="bg-black workflow-step">
            <q-card-section class="text-white text-center"  >
              <div>
                <q-select
                  dark
                  stack-label
                  label="EOS Account Name"
                  color="green"
                  separator
                  v-model="addWallet.walletName"
                  :options="accountNames"
                  :error="addWallet.walletNameEmpty"
                />
              </div>
              <div v-show="addWallet.walletName" class="q-pa-md" @click="$refs.stepper.next()">
                <q-icon name="navigate_next" size="3.2rem" color="green" >
                  <q-tooltip>{{ $t('next') }}</q-tooltip>
                </q-icon>
              </div>
              <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
            </q-card-section>
          </q-step>
          <!--
            3. Save Key Encrypted
            -->
          <q-step :done="step>3" :name="3"  title="Save Key" order="30" class="bg-black workflow-step">
            <q-card-section class="text-white text-center">
              <div class="text-h4 q-pa-lg text-uppercase">
                Save Private Key
              </div>
                <q-item class="flex-center">
                  <q-item-section class="col-auto">
                    <span class="q-pa-sm">
                      <q-chip dense color="green" class="shadow-1">&nbsp;</q-chip>
                    </span>
                  </q-item-section>
                  <q-item-label>
                    Password Encrypted
                  </q-item-label>
                </q-item>
              <div class="q-pa-sm">
                <div class="text-center">
                  <q-btn color="white" glossy outline @click="showMainSteps = false">
                    <div class="q-mr-lg q-ml-lg">Yes</div>
                  </q-btn>
                </div>
              </div>
              <div class="q-pa-sm">
                <div class="text-center q-pa-sm">
                  <q-btn color="white" glossy outline @click="$refs.stepper.next()">
                    <div class="q-mr-lg q-ml-lg">No</div>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-step>
          <!--
            4. Verto Password
            -->
          <q-step :done="step>4" :name="4"  title="Verto Password" order="40" class="bg-black workflow-step">
            <q-card-section class="text-white text-center"  >
              <div>
                  <q-input
                    dark
                    v-model="addWallet.vertoPassword"
                    color="green"
                    @input="showSubmitKey"
                    @keyup.enter="addEosAddress"
                    v-bind:label="$t('CreateVertoPassword.vertopassword')"
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
              <div v-show="incorrectPassword" class="text-h6 text-uppercase text-red q-pa-lg">
                {{ $t('Welcome.incorrect') }}
              </div>
              <div v-show="walletNameUsed" class="text-h6 text-uppercase text-red q-pa-lg">
                {{ $t('DisplayKey.name_is_used') }}
              </div>
              <div v-show="unknownError" class="text-h6 text-uppercase text-red q-pa-lg">
                Unknown Error
              </div>
              <div v-show="submitKey" class="q-pa-md" @click="addEosAddress">
                <q-icon name="navigate_next" size="3.2rem" color="green" >
                  <q-tooltip>{{ $t('next') }}</q-tooltip>
                </q-icon>
              </div>
              <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
            </q-card-section>
          </q-step>
        </q-stepper>
    </div>
    <div v-show="!showMainSteps">
      <q-card-section class="text-weight-bold text-center text-uppercase">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('addwallets/addEos')">
               <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
             </q-icon>
        <big class="titillium">Save Private Key</big>
        <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('create-wallet-options')"/>
      </q-card-section>
      <q-stepper done-color="green" active-color="green" color="green" ref="stepperFilePassword" alternative-labels v-model="step2">
        <!--
          1.Private key
          -->
        <q-step :done="step2>1" :name="1"  title="File Password" class="bg-black workflow-step">
          <q-card-section class="text-white"  >
            <div class="float-center text-center">
                <div class="text-uppercase text-h6 q-pa-md">
                  Recommended to be different than your wallet password
                </div>
              <div class="q-py-sm text-uppercase">
                <q-item class="flex-center">
                  <q-item-section class="col-auto">
                    <span class="q-pa-sm" v-show="!filePasswordApproved">
                      <q-chip dense color="red" class="shadow-1">&nbsp;</q-chip>
                    </span>
                    <span class="q-pa-sm" v-show="filePasswordApproved">
                      <q-chip dense color="green" class="shadow-1">&nbsp;</q-chip>
                    </span>
                  </q-item-section>
                  <q-item-label>
                    Minimum 8 Digits
                  </q-item-label>
                </q-item>
              </div>
              <div class="text-center text-white">
                <span class="q-pa-sm">
                    <q-input
                      dark
                      v-model="addWallet.filePassword"
                      @input="filePasswordCheck"
                      color="green"
                      label="Password For The File"
                      @keyup.enter="gotoFileConfirmPassword()"
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
                <div class="q-pa-sm" v-show="filePasswordApproved" @click="gotoFileConfirmPassword()" >
                  <q-icon name="navigate_next" size="3.2rem" color="green"   >
                    <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                  </q-icon>
                </div>
                <q-btn color="white" flat @click="showMainSteps = true" label="Back" />
              </div>
            </div>
          </q-card-section>
        </q-step>
        <!--
          2. Confirm
          -->
        <q-step :done="step2>2" :name="2" title="Confiirm Password" class="bg-black workflow-step">
          <q-card-section class="text-white"  >
            <div class="float-center text-center">
              <div class="q-py-sm text-uppercase">
              </div>
              <div class="text-center text-white">
                <span class="q-pa-sm">
                    <q-input
                      dark
                      v-model="addWallet.filePasswordConfirm"
                      @input="filePasswordConfirmCheck"
                      color="green"
                      label="Confirm Password For The File"
                      @keyup.enter="gotToSaveFileInWallet()"
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
                <div class="q-pa-sm" v-show="filePasswordConfirmApproved" @click="gotToSaveFileInWallet()" >
                  <q-icon name="navigate_next" size="3.2rem" color="green"   >
                    <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                  </q-icon>
                </div>
                <q-btn color="white" flat @click="$refs.stepperFilePassword.previous()" label="Back" />
              </div>
            </div>
          </q-card-section>
        </q-step>
        <!--
          3. Save File In Wallet
          -->
        <q-step :done="step2>3" :name="3" title="Save In Wallet" class="bg-black workflow-step">
          <q-card-section class="text-white"  >
            <div class="float-center text-center">
              <div class="text-h6 text-uppercase q-pa-md">
                Encrypt the private key in the wallet?
              </div>
              <div class="text-center text-white q-pa-md">
                <q-btn color="white" glossy outline @click="gotToVertoPassword(true)">
                  <div class="q-mr-lg q-ml-lg">Yes</div>
                </q-btn>
              </div>
              <div class="text-center text-white  q-pa-md">
                <q-btn color="white" glossy outline @click="gotToVertoPassword(false)">
                  <div class="q-mr-lg q-ml-lg">No</div>
                </q-btn>
              </div>
              <div class="text-center text-white  q-pa-md">
                <q-btn color="white" flat @click="$refs.stepperFilePassword.previous()" label="Back" />
              </div>
            </div>
          </q-card-section>
        </q-step>
      </q-stepper>
    </div>
  </q-card>
</q-page>
</template>

<script>
import EosWrapper from '@/util/EosWrapper'

export default {
  data () {
    return {
      step: 1,
      step2: 1,
      isPwd: true,
      contractable: true,
      showMainSteps: true,
      filePasswordApproved: false,
      filePasswordConfirmApproved: false,
      eosKeyNext: false,
      submitKey: false,
      eosKeyInvalid: false,
      incorrectPassword: false,
      unknownError: false,
      walletNameUsed: false,
      enableImport: true,
      confirmPassword: false,
      accountNames: [],
      wrongPrivateKey: false,
      accountIsNotValid: true,
      enteredPrivateKey: '',
      showSaveKey: false,
      addWallet: {
        walletName: '',
        address: '',
        addressPriv: '',
        vertoPassword: '',
        vertoPasswordError: '',
        filePassword: '',
        filePasswordConfirm: '',
        storeInWallet: false
      }
    }
  },
  methods: {
    createKeys () {
      this.$router.push('create-keys')
    },
    filePasswordCheck: function () {
      this.filePasswordApproved = false
      if (this.addWallet.filePassword.length > 7) {
        this.filePasswordApproved = true
      }
    },
    filePasswordConfirmCheck () {
      this.filePasswordConfirmApproved = false
      if (this.addWallet.filePassword === this.addWallet.filePasswordConfirm) {
        this.filePasswordConfirmApproved = true
      }
    },
    gotoFileConfirmPassword () {
      if (this.filePasswordApproved) {
        this.$refs.stepperFilePassword.next()
      }
    },
    gotToSaveFileInWallet () {
      if (this.filePasswordConfirmApproved) {
        this.$refs.stepperFilePassword.next()
      }
    },
    gotToVertoPassword (saveFile) {
      this.addWallet.storeInWallet = saveFile
      this.showMainSteps = true
      this.$refs.stepperFilePassword.goTo(1)
      this.$refs.stepper.next()
    },
    createAccount () {
      this.$router.push('create-eos-account')
    },
    nextFromName () {
      this.addWallet.walletNameEmpty = false
      this.confirmPassword = true
    },
    nextFromPriv () {
      if (!this.eosKeyNext) {
        return
      }
      if ((new EosWrapper()).isPrivKeyValid(this.addWallet.addressPriv)) {
        this.importPrivateKey()
        this.$refs.stepper.next()
      } else {
        this.eosKeyInvalid = true
      }
    },
    showEosKeyNext () {
      this.eosKeyInvalid = false
      if (this.addWallet.addressPriv.length === 51) {
        this.eosKeyNext = true
      } else {
        this.eosKeyNext = false
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
      this.walletNameUsed = false
      this.unknownError = false
    },
    addEosAddress: async function () {
      if (this.submitKey) {
        this.resetErrors()
        const result = await this.$configManager.createEosWallet(this.addWallet)
        console.log(result)
        if (result.success) {
          this.$router.push({ path: '/wallet' })
        } else {
          this.submitKey = false
          if (result.message === 'bad_password') {
            this.incorrectPassword = true
          } else if (result.message === 'name_already_used') {
            this.walletNameUsed = true
          } else {
            this.unknownError = true
          }
        }
        /*
        // const result = await configManager.addWallet(this.addWallet.walletName, this.addWallet.vertoPassword, this.addWallet.address, this.addWallet.addressPriv)
        if (result.success) {
          /*
          let wallet = {
            'priv': this.addWallet.addressPriv,
            'key': this.addWallet.address,
            'name': this.addWallet.walletName
          }
          configManager.updateCurrentWallet(wallet)
          */ /*
          this.$router.push({path: '/wallet'})
        } else {
          this.submitKey = false
          if (result.message === 'bad_password') {
            this.incorrectPassword = true
          } else if (result.message === 'name_already_used') {
            this.walletNameUsed = true
          } else {
            this.unknownError = true
          }
        }
        */
      }
    },
    cancelAddVertoAddress: function () {
      this.addWallet.walletNameEmpty = false
      this.addWallet.addressEmpty = false
      this.addWallet.vertoPasswordEmpty = false
      this.addWallet.walletName = ''
      this.addWallet.address = ''
      this.addWallet.addressPriv = ''
      this.addWallet.vertoPassword = ''
      this.addingWallet = false
    },
    importPrivateKey () {
      const eos = new EosWrapper()
      this.addWallet.address = eos.fromPrivToPub(this.addWallet.addressPriv)
      var self = this
      eos.getAccountNamesFromPubKeyP(this.addWallet.address)
        .then(function (result) {
          self.accountNames = []
          for (var i = 0; i < result.account_names.length; i++) {
            self.accountNames.push({ label: result.account_names[i], value: result.account_names[i] })
          }
          self.walletName = result.account_names[0]
        })
      // this.enableImport = false
      this.linkAccount = true
    },
    cancel () {
      this.$router.push('vertomanager')
    }
  }
}
</script>

<style lang="stylus" scoped>
a
  cursor: pointer
</style>

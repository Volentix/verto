<template>
  <q-page class="column flex-center text-white bg-black">
    <q-card flat class="bg-black" style="width: 100%; max-width: 700px;">
      <q-card-section class="text-weight-bold text-center flex justify-between">
        <q-icon name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('wallet/makepayment')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium text-uppercase col">Create EOS Account</big>
        <q-icon name="close" size="2.5rem" color="white" @click.native="$router.push('/wallet')"/>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-black" style="width: 100%; max-width: 700px;">
      <q-inner-loading :visible="spinnervisible">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <q-stepper active-color="green" done-color="green" ref="stepper" alternative-labels animated v-model="step">

        <q-step default :name="1" :done="step>1" title="Paid To" class=" bg-black workflow-step">
          <q-card-section>
          <div class="text-center text-white text-uppercase">
            <q-item class="flex-center">
              <q-item-section class="col-auto">
                <q-chip v-show="inError" dense color="red" class="shadow-1">&nbsp;</q-chip>
                <q-chip v-show="!inError" dense color="green" class="shadow-1">&nbsp;</q-chip>
              </q-item-section>
              <q-item-label>Choose a 12 Letter and/or (1-5) Eos Account Name</q-item-label>
            </q-item>
            <q-item class="flex-center">
              <q-item-section class="col-auto">
                <q-chip v-show="!hasEOS" dense color="red" class="shadow-1">&nbsp;</q-chip>
                <q-chip v-show="hasEOS" dense color="green" class="shadow-1">&nbsp;</q-chip>
              </q-item-section>
              <q-item-label>0.35 EOS is required to be transfered to the new account</q-item-label>
            </q-item>
            <div class="q-pa-md">

                  <q-input
                    ref="account"
                    v-model="account"
                    dark
                    color="green"
                    label="Account Name"
                    :error="inError"
                    :error-message="errorMessage"
                    @input="checkName"
                    @keyup.enter="goToMemo()"
                  />

              </div>
              <div class="q-pa-sm" v-show="!inError && hasEOS" @click="step = 2" >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                </q-icon>
              </div>
          </div>
          </q-card-section>
        </q-step>
        <q-step default :name="2" :done="step>2" title="Sign & Submit" class=" bg-black workflow-step">
          <q-card-section>
            <div class="text-center text-white text-uppercase">

              <q-item-section>
                <q-item-label>Enter your private key password to sign the transaction</q-item-label>
              </q-item-section>

              <div class="q-pa-md">
                <q-input
                  v-model="privateKeyPassword"
                  dark
                  color="green"
                  label="Private Key Password"
                  debounce="500"
                  :error="invalidPrivateKeyPassword"
                  error-message="The password is incorrect"
                  @input="checkPrivateKeyPassword"
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

              <div v-show="privateKey.success" class="q-pa-sm" @click="sendTransaction()" >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                </q-icon>
              </div>
            </div>
          </q-card-section>
        </q-step>

        <q-step default :name="3" :done="step>3" title="Result" class=" bg-black workflow-step">
          <q-card-section>
            <div class="text-center text-white text-uppercase">
              <q-inner-loading :visible="spinnervisible">
                <q-spinner size="50px" color="primary" />
              </q-inner-loading>

              <q-item-section>
                <q-item-label>Processing the transaction</q-item-label>
              </q-item-section>

              <div v-show="!transactionError" class="text-h6 text-uppercase text-green q-pa-md">
                {{ SuccessMessage }}
              </div>

              <div v-show="transactionError" class="text-h6 text-uppercase text-red q-pa-md">
                {{ ErrorMessage }}
              </div>
            </div>
          </q-card-section>
        </q-step>
      </q-stepper>
    </q-card>
  </q-page>
</template>

<script>
import EosWrapper from '@/util/EosWrapper'
const eos = new EosWrapper()

export default {
  data () {
    return {
      step: 1,
      errorMessage: '',
      ErrorMessage: null,
      SuccessMessage: null,
      inError: true,
      isPwd: true,
      walletName: null,
      account: null,
      privateKeyPassword: null,
      invalidPrivateKeyPassword: false,
      hasPrivateKeyInWallet: null,
      privateKey: {
        success: null
      },
      transactionId: null,
      transactionError: false,
      spinnervisible: false,
      eosbalance: 0,
      hasEOS: false
    }
  },
  async created () {
    this.eosbalance = this.$route.params.eosbalance
    console.log('this.eosbalance', this.eosbalance)
    if (this.eosbalance >= 0.35) {
      this.hasEOS = true
    }

    this.hasPrivateKeyInWallet = this.$store.state.currentwallet.wallet.privateKeyEncrypted
  },
  async mounted () {
    this.walletName = this.$store.state.currentwallet.wallet.name
  },
  methods: {
    checkPrivateKeyPassword () {
      const privateKeyEncrypted = JSON.stringify(this.$store.state.currentwallet.wallet.privateKeyEncrypted)
      this.privateKey = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)
      if (this.privateKey.success) {
        this.invalidPrivateKeyPassword = false
      } else {
        this.invalidPrivateKeyPassword = true
        return false
      }
    },
    async checkName () {
      this.inError = false
      if (this.account.length === 12) {
        if (/(^[a-z1-5]{1}([a-z1-5.]{0,10}[a-z1-5])?$)/g.test(this.account)) {
          try {
            const exists = await eos.getAccount(this.account)
            this.inError = true
            this.errorMessage = 'Account Name Taken'
            console.log('valid', exists)
          } catch (error) {
            this.inError = false
            console.log('error', error)
          }
        } else {
          this.inError = true
          this.errorMessage = 'Invalid Account Name'
        }
      } else {
        this.inError = true
        this.errorMessage = 'You need exactly 12 characters'
      }
    },
    async sendTransaction () {
      try {
        this.step = 3
        this.showSpinners(true)

        this.formatedAmount = this.formatAmountString()
        const transaction = await eos.transferToken(
          'eosio.token',
          this.walletName,
          'signupeoseos',
          '0.3500 EOS',
          this.account + '-' + this.publickey,
          this.privateKey.key
        )
        this.transactionId = transaction.transaction_id
        this.showSpinners(false)
        this.SuccessMessage = 'Congratulations, your transactions have been recorded on the blockchain. You can check it on this <a href="https://bloks.io/transaction/' + this.transactionId + '">block explorer</a>'
      } catch (error) {
        this.showSpinners(false)
        if (error.includes('maximum billable CPU time')) {
          this.transactionError = true
          this.ErrorMessage = 'Your EOS account does not have enough CPU staked to process the transaction.'
        } else if (error.includes('Sorry, Newdex trade is pause')) {
          this.transactionError = true
          this.ErrorMessage = 'Convertion is suspended at the moment, it`s not your fault.  Try again later'
        }
      }

      this.privateKey.key = null
    }
  }
}
</script>

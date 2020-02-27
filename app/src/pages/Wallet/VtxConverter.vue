<template>
  <q-page class="column flex-center text-white bg-black">
    <q-card flat class="bg-black" style="width: 100%; max-width: 700px;">
      <q-card-section class="text-weight-bold text-center flex justify-between">
        <q-icon name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('wallet/makepayment')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium text-uppercase col">EOS to VTX Converter</big>
        <q-icon name="close" size="2.5rem" color="white" @click.native="$router.push('/wallet')"/>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-black" style="width: 100%; max-width: 700px;">
      <q-inner-loading :visible="spinnervisible">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <q-stepper active-color="green" done-color="green" ref="stepper" alternative-labels animated v-model="step">

        <q-step default :name="1" :done="step>1" title="How many EOS" class=" bg-black workflow-step">
          <q-card-section>
          <div class="text-center text-white text-uppercase">
            <div class="row">
              <div class="col text-center">
                <span class="row text-h6 text-center">
                  EOS
                </span>
                <span class="row text-h4">
                  {{ eosbalance }}
                </span>
              </div>
              <div class="col">
                <q-linear-progress indeterminate rounded color="green" size="xl" class="q-mt-md" />
              </div>
              <div class="col text-center">
                <span class="row text-h6 text-center">
                  VTX
                </span>
                <span class="row text-h4">
                  {{ vtxbalance }}
                </span>
              </div>
            </div>
            <div>
              <br>
              <q-slider
                v-model="slider"
                :label-value="slider + '%'"
                :min="0"
                :max="100"
                :step="5"
                color="orange"
                dark
                markers
                label
                label-always
                @input="changeSlider()"
              />
              <q-input
                type="number"
                v-model="sendAmount"
                dark
                color="green"
                label="Amount"
                @input="checkAmount"
                @keyup.enter="goToPassword()"
              />
              </div>
              <div v-show="navigationButtons.amount" class="q-pa-sm" @click="step = 2" >
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
    <q-dialog v-model="showSendModal">
      <q-card class="bg-black text-white q-pa-lg">
        <div class="text-center">
          <div>
            <div class="text-h5 qr-wallet-title">Sending Transaction</div>
            <p class="wallet-address-qr q-pr-md q-py-md q-ma-none" >Please Wait</p>
            <p class="text-h6">
            </p>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import EosWrapper from '@/util/EosWrapper'
const eos = new EosWrapper()

export default {
  data () {
    return {
      step: 1,
      slider: 0,
      eosbalance: 0,
      vtxbalance: 0,
      vtxprice: 0,
      sendAmount: null,
      formatedAmount: null,
      ErrorMessage: null,
      SuccessMessage: null,
      invalidPrivateKeyPassword: false,
      privateKey: {
        success: null
      },
      transactionId: null,
      transactionError: false,
      spinnervisible: false,
      isPwd: true,
      account: null,
      privateKeyPassword: null,
      showSendModal: false,
      navigationButtons: {
        to: false,
        token: false,
        amount: false,
        privateKeyPasswordBtn: false,
        showNextButtonToPassword: false
      }
    }
  },
  computed: {
    showNext: function () {
      if (!this.voted && !this.proxyModel) {
        return false
      } else {
        return true
      }
    }
  },
  async created () {
    this.eosbalance = this.$route.params.eosbalance
    this.hasPrivateKeyInWallet = this.$store.state.currentwallet.wallet.privateKeyEncrypted
  },
  async mounted () {
    this.walletName = this.$store.state.currentwallet.wallet.name
    this.account = await eos.getAccount(this.walletName)

    let result = await this.$axios.get('https://cors-anywhere.herokuapp.com/https://api.newdex.io/v1/price?symbol=volentixgsys-vtx-eos')
    this.vtxprice = result.data.data.price

    // let result = await eos.getCurrencyBalanceP(this.walletName)
    // console.log('result', result)
    // if (result.length) {
    //   this.eosBalance = result[0].split(' ')[0]
    // }
  },
  methods: {
    goToPassword () {
      if (this.navigationButtons.amount) {
        this.step = 2
      }
    },
    changeSlider () {
      this.sendAmount = Math.round(10000 * this.eosbalance * (this.slider / 100)) / 10000
      this.checkAmount()
    },
    checkAmount () {
      this.navigationButtons.amount = false
      this.vtxbalance = Math.round(100000000 * (this.sendAmount / this.vtxprice)) / 100000000

      if (this.sendAmount > 0.0 && this.sendAmount <= this.eosbalance) {
        this.navigationButtons.amount = true
      }
    },
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
    showSpinners (visible) {
      this.spinnervisible = visible
      this.showSendModal = visible
    },
    formatAmountString () {
      let numberOfDecimals = 0
      let stringAmount = this.sendAmount.toString()
      const amountParsed = stringAmount.split('.')
      if (amountParsed && amountParsed.length > 1) {
        numberOfDecimals = amountParsed[1].length
      } else {
        stringAmount += '.'
      }
      for (;numberOfDecimals < 4; numberOfDecimals++) {
        stringAmount += '0'
      }

      return stringAmount + ' EOS'
    },
    async sendTransaction () {
      try {
        this.step = 3
        this.showSpinners(true)

        this.formatedAmount = this.formatAmountString()
        const transaction = await eos.transferToken(
          'eosio.token',
          this.walletName,
          'newdexpublic',
          this.formatedAmount,
          '{"type":"buy-market","symbol":"volentixgsys-vtx-eos","price":"0.00000","channel":"dapp","ref":"verto"}',
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

<style lang="stylus">
.q-item__label--caption
  color: grey
</style>

<template>
  <q-page class="flex flex-center text-white bg-black">
    <q-card flat>
      <q-inner-loading :visible="spinnervisible">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <q-card-title class="text-weight-bold text-center">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('wallet/makepayment')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium uppercase">Make Payment</big>
        <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('/wallet')"/>
      </q-card-title>
      <q-stepper dark color="green bg-white" ref="stepper" alternative-labels :contractable="contractable">
        <!--
          1. Paid to
        -->
        <q-step default name="first" title="Paid To" class=" bg-black workflow-step">
          <q-card-main>
          <div class="text-center text-white uppercase">
            <q-item>
              <q-item-side>
                <q-chip v-show="!navigationButtons.to" dense color="red" class="shadow-1">&nbsp;</q-chip>
                <q-chip v-show="navigationButtons.to" dense color="green" class="shadow-1">&nbsp;</q-chip>
              </q-item-side>
              <q-item-main label="12 Digit Eos Account Name" />
            </q-item>
            <div class="q-pa-md">
                <q-field>
                  <q-input
                    v-model="sendTo"
                    dark
                    color="green"
                    float-label="To"
                    @input="checkTo"
                    @keyup.enter="goToMemo()"
                  />
                </q-field>
              </div>
              <div class="q-pa-md">
                <q-field>
                  <q-input
                    v-model="sendMemo"
                    dark
                    color="green"
                    float-label="Memo"
                    @keyup.enter="$refs.stepper.next()"
                  />
                </q-field>
              </div>
              <div class="q-pa-sm" v-show="navigationButtons.to" @click="goToMemo()" >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                </q-icon>
              </div>
          </div>
          </q-card-main>
        </q-step>
        <!--
          2. Amount
        -->
        <q-step name="fourth" title="Amount" class=" bg-black workflow-step">
          <q-card-main>
          <div class="text-center text-white uppercase">
            <div v-show="tokenSymbol === 'VTX'">
              <span class="q-title q-pa-md">
                vtx
              </span>
              <span class="q-display-1">
                {{ vtxbalance }}
              </span>
            </div>
            <div v-show="tokenSymbol === 'EOS'">
              <span class="q-title q-pa-md">
                eos
              </span>
              <span class="q-display-1">
                {{ eosbalance }}
              </span>
            </div>
            <div>
                <q-field>
                  <q-input
                    type="number"
                    v-model="sendAmount"
                    dark
                    color="green"
                    float-label="Amount"
                    @input="checkAmount"
                    @keyup.enter="showSummary"
                  />
                </q-field>
              </div>
              <div class="q-pa-sm" v-show="navigationButtons.amount" @click="showSummary()" >
                <q-icon name="navigate_next" size="3.2rem" color="green"   >
                  <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                </q-icon>
              </div>
            <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
          </div>
          </q-card-main>
        </q-step>
        <!--
          3. Key Password
        -->
        <q-step name="second" title="Key Password" class=" bg-black workflow-step">
          <q-card-main>
          <div class="text-center text-white uppercase"  v-show="hasPrivateKeyInWallet">
            <div>
              <q-item>
              <q-item-side>
                <q-chip dense color="amber" class="shadow-1">&nbsp;</q-chip>
              </q-item-side>
              <q-item-main label="Private Key Password" />
            </q-item>
            </div>
            <div>
                <q-field>
                  <q-input
                    type="password"
                    v-model="privateKeyPassword"
                    dark
                    color="green"
                    float-label="Private Key Password"
                    @input="checkPrivateKeyPassword"
                    @keyup.enter="toSummary"
                  />
                </q-field>
              </div>
              <!--
              <div class="q-pa-lg q-subtitle">
                <span class="q-pa-md">
                  <q-checkbox v-model="saveKeyInWallet" color="blue" @input="changeDefault(props.row)" />
                </span>
                <span class="q-pa-md">
                  Store Encrypted Private Key in verto
                </span>
              </div>
              -->
            <div class="q-pa-sm" v-show="navigationButtons.privateKeyPasswordBtn" @click="toSummary()" >
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
              </q-icon>
            </div>
            <q-btn color="white" flat @click="hasPrivateKeyInWallet = false" label="Back" />
          </div>
          <div class="text-center text-white uppercase" v-show="!hasPrivateKeyInWallet">
            <div class="float-center text-center">
              <div class="q-title uppercase q-pa-md">
                Choose Private Key Encrypted File
              </div>
              <div class="flex flex-center text-white q-pa-sm">
                <file-select @input="checksFile" v-model="file"></file-select>
              </div>
              <div class="q-pa-md" v-show="this.navigationButtons.showNextButtonToPassword" @click="chooseKeyFile">
                <q-icon name="navigate_next" size="3.2rem" color="green" >
                  <q-tooltip>{{ $t('next') }}</q-tooltip>
                </q-icon>
              </div>
              <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
            </div>
          </div>
          </q-card-main>
        </q-step>
        <q-step name="fifth" title="Submit" class=" bg-black workflow-step">
          <q-card-main>
          <div class="text-center text-white uppercase"  v-show="!navigation.paymentSuccessful">
            <table style="width:100%;">
              <tr>
                <td>
                  <span class="q-title q-pa-md">
                    To
                  </span>
                </td>
                <td>
                  <span class="q-display-1">
                    {{ sendTo }}
                  </span>
                </td>
              </tr>
              <tr v-show="sendMemo"  >
                <td>
                  <span class="q-title q-pa-md">
                    Memo
                  </span>
                </td>
                <td>
                  <span class="q-display-1">
                    {{ sendMemo }}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="q-title q-pa-md">
                    Token
                  </span>
                </td>
                <td>
                  <span class="q-display-1">
                    {{ tokenSymbol }}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="q-title q-pa-md">
                    Amount
                  </span>
                </td>
                <td>
                  <span class="q-display-1">
                    {{ sendAmount }}
                  </span>
                </td>
              </tr>
            </table>
            <div class="q-pa-md">
            <div v-show="invalidEosName" class="q-title uppercase text-red q-pa-md">
              Invalid EOS Account Name
            </div>
            <div v-show="invalidPrivateKeyPassword" class="q-title uppercase text-red q-pa-md">
              Private Key Password Incorrect
            </div>
            <div v-show="unknownError" class="q-title uppercase text-red q-pa-md">
              Unknown Error
            </div>
            <div class="q-pa-sm" v-show="navigationButtons.privateKeyPasswordBtn" @click="sendTokens()" >
              <q-icon name="navigate_next" size="3.2rem" color="green"   >
                <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
              </q-icon>
            </div>
            <q-btn color="white" flat @click="$refs.stepper.previous()" label="Back" />
            </div>
          </div>
          <div class="text-center text-white" v-show="navigation.paymentSuccessful">
            <div class="q-display-3 uppercase text-green q-pa-lg">
                Success
              </div>
              <div class="q-pa-md">
                <q-btn color="white" outline glossy flat @click="launchEosExplorer()">
                  <div class="q-headline uppercase">
                    View Transaction
                  </div>
                </q-btn>
              </div>
              <div class="q-pa-md">
                <q-btn color="white" outline glossy flat @click="navigation.paymentSuccessful = false; $refs.stepper.reset()">
                  <div class="q-headline uppercase">
                    Another Payment
                  </div>
                </q-btn>
              </div>
              <div class="q-pa-md">
                <q-btn color="white" outline glossy flat @click="$router.push('/wallet')">
                  <div class="q-headline uppercase">
                    Done
                  </div>
                </q-btn>
              </div>
          </div>
          </q-card-main>
        </q-step>
      </q-stepper>
      </q-card>
    <q-modal v-model="navigation.showSendModal">
      <div>
        <div class="text-center">
          <div>
            <div class="q-headline qr-wallet-title">Sending Transaction</div>
            <p class="wallet-address-qr q-pr-md q-py-md q-ma-none" >Please Wait</p>
            <p class="q-title">
            </p>
          </div>
        </div>
      </div>
    </q-modal>
  </q-page>
</template>

<script>
import FileSelect from '@/components/FileSelect.vue'
import EosWrapper from '@/util/EosWrapper'
import { openURL } from 'quasar'

export default {
  components: {
    FileSelect
  },
  data () {
    return {
      file: null,
      saveKeyInWallet: false,
      hasPrivateKeyInWallet: false,
      invalidEosName: false,
      eosbalance: 0,
      vtxbalance: 0,
      contractable: true,
      spinnervisible: false,
      navigation: {
        mainpage: true,
        transactions: false,
        makepayment: false,
        makepaymentmemo: false,
        makepaymentAmount: false,
        makepaymentToken: false,
        makepaymentSummary: false,
        showSendModal: false,
        paymentSuccessful: false
      },
      navigationButtons: {
        to: false,
        token: false,
        amount: false,
        privateKeyPasswordBtn: false,
        showNextButtonToPassword: false
      },
      showTransactionProgress: false,
      dark: true,
      eosEndpoints: process.env[this.$store.state.settings.network].EOS_ENDPOINTS.split(','),
      currentEosEndpointIndex: 0,
      activeTransaction: null,
      endOfAddressList: false,
      walletName: '',
      privateKeyPassword: '',
      showLedgerPullProgress: false,
      tokenContract:
      {
        'EOS': 'eosio.token',
        'VTX': 'volentixgsys'
      },
      tokenSymbol: 'EOS',
      options: [
        {
          label: 'VTX',
          value: 'VTX'
        },
        {
          label: 'EOS',
          value: 'EOS'
        }
      ],
      tableData: [],
      transactions: [],
      vtxTotal: 0,
      balance: 0,
      vtxBalance: 0,
      eosBalance: 0,
      currentBtcValue: 0,
      sendAmount: null,
      sendTo: '',
      sendMemo: '',
      isCardModalActive: false,
      currentEosAdddress: '',
      transactionId: '',
      invalidPrivateKeyPassword: false,
      unknownError: false
    }
  },
  created () {
    this.eosbalance = this.$route.params.eosbalance
    this.vtxbalance = this.$route.params.vtxbalance
    this.hasPrivateKeyInWallet = this.$store.state.currentwallet.wallet.privateKeyEncrypted
  },
  mounted () {
    this.walletName = this.$store.state.currentwallet.wallet.name
  },
  methods: {
    chooseKeyFile () {
      const that = this
      const reader = new FileReader()
      reader.onload = async function () {
        try {
          that.privateKeyFromFile = reader.result
          that.hasPrivateKeyInWallet = true
        } catch (e) {
          console.log(e)
          that.hasPrivateKeyInWallet = false
          // userError(e)
        }
      }
      reader.readAsText(this.file)
    },
    checksFile: function () {
      if (!this.file) {
        this.navigationButtons.showNextButtonToPassword = false
      } else {
        this.navigationButtons.showNextButtonToPassword = true
      }
    },
    checkPrivateKeyPassword () {
      this.invalidPrivateKeyPassword = false
      this.navigationButtons.privateKeyPasswordBtn = false
      if (this.privateKeyPassword.length > 7) {
        this.navigationButtons.privateKeyPasswordBtn = true
      }
    },
    toSummary () {
      if (this.navigationButtons.privateKeyPasswordBtn) {
        this.$refs.stepper.next()
      }
    },
    showSummary () {
      if (this.navigationButtons.amount) {
        this.$refs.stepper.next()
        this.navigation.makepaymentAmount = false
        this.navigation.makepaymentSummary = true
      }
    },
    checkAmount () {
      this.navigationButtons.amount = false
      const balance = this.tokenSymbol === 'EOS' ? this.eosbalance : this.vtxbalance
      if (this.sendAmount > 0.0 && this.sendAmount <= balance) {
        this.navigationButtons.amount = true
      }
    },
    checkTo () {
      this.invalidEosName = false
      if (this.sendTo.length === 12) {
        this.navigationButtons.to = true
      } else {
        this.navigationButtons.to = false
      }
    },
    goToMemo () {
      if (this.navigationButtons.to) {
        this.$refs.stepper.next()
        this.navigation.makepayment = false
        this.navigation.makepaymentmemo = true
      }
    },
    formatAmount: function () {
      return parseInt(this.sendAmount = Math.abs(Number(this.sendAmount) || 0).toFixed(4)).toString()
    },
    /**
     * Formats the amount into a string supported by EOS.
     * Must have 4 decimal places
     * Must have the token (EOS, VTX) attached.
     */
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
      return stringAmount + ' ' + this.tokenSymbol
    },
    showSpinners (visible) {
      this.spinnervisible = visible
      this.navigation.showSendModal = visible
    },
    launchEosExplorer (event) {
      openURL(process.env[this.$store.state.settings.network].EOS_TRANSACTION_EXPLORER + this.transactionId)
    },
    async sendTokens () {
      if (!this.navigationButtons.privateKeyPasswordBtn) {
        return
      }
      this.invalidPrivateKeyPassword = false
      this.unknownError = false
      this.invalidEosName = false
      let privateKey = null
      if (this.privateKeyFromFile) {
        privateKey = this.privateKeyFromFile
      } else {
        privateKey = JSON.stringify(this.$store.state.currentwallet.wallet.privateKeyEncrypted)
      }
      const result = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKey)
      // Remove the private key immediately so it
      // does not stick around any longer than it has to
      this.privateKeyPassword = ''
      if (!result.success) {
        this.invalidPrivateKeyPassword = true
        return
      }
      this.showSpinners(true)
      const formatedAmount = this.formatAmountString()
      try {
        const transaction = await (new EosWrapper()).transferToken(
          this.tokenContract[this.tokenSymbol],
          this.walletName,
          this.sendTo.toLowerCase(),
          formatedAmount,
          this.sendMemo,
          result.key
        )
        this.transactionId = transaction.transaction_id
        this.showSpinners(false)
        this.navigation.paymentSuccessful = true
      } catch (err) {
        if (err && err.message && err.message.startsWith('Invalid character')) {
          this.invalidEosName = true
        } else if (err.includes('account does not exist')) {
          this.invalidEosName = true
        } else {
          this.unknownError = true
        }
        this.showSpinners(false)
        return false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.q-data-table th
  text-align right
.close-button
  position absolute
  right 5px
  top 5px
.wallet-address-qr
  max-width 40vw
  overflow hidden
  text-overflow ellipsis
.qr-wallet-title
  word-wrap normal
.bg-blue-grey-1 .q-btn
  max-width 12rem
  height 4.5rem
.q-table-container
  max-width: 90vw
  padding: 1rem
.table
  width:100%;
  table-layout: fixed;
  overflow-wrap: break-word;

</style>

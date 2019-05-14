<template>
  <q-page class="flex flex-center text-white bg-black">
    <q-card flat class="bg-black">
      <!--
        1. Main
      -->
        <q-inner-loading :visible="spinnervisible">
            <q-spinner size="50px" color="primary" />
          </q-inner-loading>
      <div v-show="navigation.mainpage">
        <q-card-section class="text-weight-bold text-center text-uppercase">
          <div>
            <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('wallet/index')">
              <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
            </q-icon>
            <big class="titillium q-pa-md">Wallet</big>
            <q-icon class="float-right" name="refresh" size="2.5rem" @click.native="retrieveBalance()" >
              <q-tooltip>Refresh</q-tooltip>
            </q-icon>
          </div>
        </q-card-section>
        <q-card-section class="text-center">
          <div class="text-center text-weight-bold text-uppercase q-pa-md" >
            <div v-if="isEosWallet()" >
              <div>
                <span class="text-h3">
                  {{ currentBtcValue.toFixed(4) }}
                </span>
                <span class="q-subtilte">BTC</span>
              </div>
              <br>
              <div class="row justify-center q-col-gutter-sm">
                <div class="float-left text-center q-ml-sm q-pa-xl">
                  <p class="text-h3"> {{ balance }} </p>
                  <p class="q-subtitle">VTX Promise</p>
                </div>
                <div class="float-left text-center q-ml-sm  q-pa-xl">
                  <p class="text-h3"> {{ vtxBalance }} </p>
                  <p class="q-subtitle">VTX Balance</p>
                </div>
                <div class="float-left text-center q-ml-sm  q-pa-xl">
                  <p class="text-h3"> {{ eosBalance }} </p>
                  <p class="q-subtitle">EOS Balance</p>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="row justify-center q-col-gutter-sm">
                <div class="float-left text-center q-ml-sm q-px-xl q-pb-xl q-pt-md">
                  <span class="text-h3"> {{ balance }} </span>
                  <span class="q-subtitle">VTX</span>
                </div>
                <div class="float-left text-center q-ml-sm q-px-xl q-pb-xl q-pt-md">
                <span class="text-h3">
                  {{ currentBtcValue.toFixed(4) }}
                </span>
                <span class="q-subtilte">BTC</span>
                </div>
              </div>
            </div>
            <div class="row justify-center q-col-gutter-sm">
              <div>
                <q-btn :disabled="spinnervisible" outline @click="isCardModalActive = true">View Address</q-btn>
              </div>
              <div>
                <q-btn
                  :disabled="spinnervisible"
                  outline
                  @click="$router.push('associations')"
                >
                  KYC & Tools
                </q-btn>
              </div>
              <div>
                <q-btn
                  :disabled="spinnervisible"
                  outline
                  @click="$router.push('view-ledger-transactions')"
                >
                  View History
                </q-btn>
              </div>
              <div>
                <q-btn
                  v-if="isEosWallet()"
                  :disabled="spinnervisible"
                  outline
                  @click="$router.push({name: 'eos-make-payment', params: {vtxbalance: vtxBalance,eosbalance: eosBalance}})"
                >
                  Make Payment
              </q-btn>
              </div>
              <!-- <div>
                  @click="$router.push({name: 'eos-make-payment', params: {vtxbalance: vtxBalance,eosbalance: eosBalance}})"
                <q-btn outline label="Scan QR" @click="isCardModalActive = true"/>
              </div> -->
            </div>
            <div class="q-pa-lg">
              <q-btn
                :disabled="spinnervisible"
                outline
                glossy
                @click="$router.push('summary-vtx')"
              >
              <img src="statics/vtx.png" width="52">
              <span class="q-pa-lg">View Crowdfund</span>
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </div>
    </q-card>
    <q-dialog v-model="isCardModalActive">
      <q-card class="bg-black text-white q-pa-lg" style="max-width: 800px; width: 100%;">
        <q-icon class="float-right q-mt-md" name="close" size="1.5rem" color="white" @click.native="isCardModalActive = false" />
        <div class="row gutter-sm q-pa-lg text-white">
          <div class="col-auto flex flex-center">
            <div class="q-pr-md">
              <qrcode :value=walletKey :options="{size: 150}"></qrcode>
            </div>
          </div>
          <div class="col flex items-center">
            <div class="full-width">
              <div class="text-h5 qr-wallet-title q-mb-md">{{ $t('Main.address') }}</div>
              <q-input class="bg-white full-width q-pl-md q-mb-md" readonly :value="walletKey" />
              <q-btn flat icon="file_copy" label="Copy Key" @click="copyKey(walletKey)" />
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showLedgerPullProgress">
      <q-card class="bg-black text-white q-pa-lg">
        <div class="text-center">
          <div>
            <div class="text-h5 qr-wallet-title">Getting Ledger Information</div>
            <p class="wallet-address-qr q-pr-md q-py-md q-ma-none" >Pulling From:</p>
            <p class="text-h6">
               {{ currentEosAdddress }}
            </p>
          </div>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showTransactionProgress">
      <q-card class="bg-black text-white q-pa-lg">
        <div class="text-center">
          <div>
            <div class="text-h5 qr-wallet-title">Getting Transactions</div>
            <p class="wallet-address-qr q-pr-md q-py-md q-ma-none" >Pulling From: {{ currentEosAdddress }}</p>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
// import configManager from '../../util/ConfigManager'
import EosWrapper from '@/util/EosWrapper'
import { userError } from '@/util/errorHandler'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import Vue from 'vue'
import moment from 'moment'
import store from '@/store'

Vue.component(VueQrcode.name, VueQrcode)

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(value).format('MMM DD, YYYY')
  }
})

Vue.filter('formatTime', function (value) {
  if (value) {
    return moment(value).format('h:mm A')
  }
})

export default {
  // name: 'ComponentName',
  data () {
    return {
      spinnervisible: true,
      navigation: {
        mainpage: true,
        transactions: false
      },
      navigationButtons: {
        to: false,
        token: false,
        amount: false
      },
      showTransactionProgress: false,
      dark: true,
      eosEndpoints: process.env[store.state.settings.network].EOS_ENDPOINTS.split(','),
      currentEosEndpointIndex: 0,
      activeTransaction: null,
      endOfAddressList: false,
      walletName: '',
      showLedgerPullProgress: false,
      walletKey: this.$store.state.currentwallet.wallet.key,
      tokenSymbol: 'VTX',
      tokenContract:
      {
        'EOS': 'eosio.token',
        'VTX': 'volentixgsys'
      },
      transactions: [],
      vtxTotal: 0,
      balance: 0,
      vtxBalance: 0,
      eosBalance: 0,
      currentBtcValue: 0,
      isCardModalActive: false,
      currentEosAdddress: ''
    }
  },
  mounted () {
    this.setConnectionOn()
    this.walletName = this.$store.state.currentwallet.wallet.name
    this.walletKey = this.$store.state.currentwallet.wallet.key
    this.retrieveBalance()
  },
  methods: {
    isEosWallet () {
      return this.$store.state.currentwallet.wallet.type === 'eos'
    },
    showSummary () {
      if (this.navigationButtons.amount) {
        this.navigation.makepaymentAmount = false
        this.navigation.makepaymentSummary = true
      }
    },
    checkAmount () {
      if (this.sendAmount > 0.0) {
        this.navigationButtons.amount = true
      } else {
        this.navigationButtons.amount = false
      }
    },
    checkTo () {
      if (this.sendTo.length === 12) {
        this.navigationButtons.to = true
      } else {
        this.navigationButtons.to = false
      }
    },
    goToMemo () {
      if (this.navigationButtons.to) {
        this.navigation.makepayment = false
        this.navigation.makepaymentmemo = true
      }
    },
    setConnectionOn () {
      if (this.$q.platform.is.electron) {
        let command = 'networksetup -setairportpower airport on'
        let exec = require('child_process').exec
        exec(command)
      }
    },
    copyWalletKey () {
      this.$clipboardWrite(this.activeTransaction.sToKey)
      this.$q.notify({ color: 'positive', message: this.$t('DisplayKey.copied') })
    },
    truncate (text, len) {
      if (text.length >= len) return text.substr(0, len) + '...'
      return text
    },
    showTransactionDetails (transaction) {
      this.activeTransaction = transaction
    },
    async retrieveBalance () {
      this.spinnervisible = true
      var self = this
      try {
        let result = await this.$axios.get(process.env[this.$store.state.settings.network].DEMUX_API + '/ledger/balance/' + this.walletKey)
        self.balance = parseFloat(result.data.balance).toFixed(4)
        self.vtxTotal = self.balance
        let vtxProm = 0
        let eosProm = 0
        if (this.$store.state.currentwallet.wallet.type === 'eos') {
          const eos = new EosWrapper()
          vtxProm = eos.getCurrencyBalanceP(this.walletName, this.tokenContract['VTX'])
            .then(function (result) {
              if (result.length) {
                self.vtxBalance = result[0].split(' ')[0]
              }
              self.vtxTotal = parseFloat(+self.vtxBalance + +self.vtxTotal).toFixed(4)
            }).catch(function (error) {
              // TODO: Exception handling
              userError(error)
              return false
            })
          // get EOS Balance on EOS Account
          eosProm = eos.getCurrencyBalanceP(this.walletName)
            .then(function (result) {
              if (result.length) {
                self.eosBalance = result[0].split(' ')[0]
              }
            })
        }
        // get EOS Balance on EOS Account
        Promise.all([vtxProm, eosProm]).then(async values => {
          let results = await this.$axios.get(process.env[store.state.settings.network].CROWDFUND_URL + '/public/api/summary/')
          let eos2btc = await this.$axios.get('https://api.coingecko.com/api/v3/simple/price?ids=eos&vs_currencies=btc')
          let eosBtcTotals = parseFloat(+eos2btc.data.eos.btc * +self.eosBalance).toFixed(4)
          let vtxBtcTotals = parseFloat((+results.data.crowdsale.current_price * +self.vtxTotal) / 100000000).toFixed(4)
          self.currentBtcValue = +eosBtcTotals + +vtxBtcTotals || 0
        })
        this.spinnervisible = false
        return true
      } catch (error) {
        this.spinnervisible = false
        userError(error)
        return false
        // TODO: Exception handling
        // Can't retrieve the balance
      }
    },
    copyKey (key) {
      this.$clipboardWrite(key)
      this.$q.notify({
        message: this.$t('DisplayKey.copied'),
        color: 'positive'
      })
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
</style>

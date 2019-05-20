<template>
  <q-page class="flex flex-center text-white">
    <q-card flat class="bg-black">
      <!--
        1. Main
      -->
      <q-inner-loading :visible="spinnervisible">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <!--
      2.Transactions
      -->
      <div >
        <q-card-section class="text-weight-bold text-center text-uppercase">
          <div>
            <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('wallet/ledgertransactions')">
              <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
            </q-icon>
            <big class="titillium q-pa-xl">VTX Transactions</big>
            <q-icon class="float-right" name="close" size="2.5rem" color="white" @click.native="$router.push('wallet')"/>
          </div>
        </q-card-section>
        <q-card-section class="text-center">
        <div class="row items-cente q-pa-sm"
            style="width:30vw;" >
          <q-table
            class="bg-black"
            :dark="dark"
            :data="tableData"
            :columns="columns"
            row-key="name"
          >
            <q-tr :id="props.row.id" slot="body" slot-scope="props" :props="props" class="cursor-pointer" @click.native="showTransactionDetails(props.row)">
              <q-td
                class="text-white"
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
              >
                <div v-if="col.name === 'icon'" class="text-center">
                  <div v-if="props.row.amount < 0">
                    <span class="fa-stack text-red" style="font-size: 15px;">
                      <i class="text-red far fa-circle fa-stack-2x"></i>
                      <i class="text-red fas fa-arrow-up fa-stack-1x text-primary" ></i>
                    </span>
                  </div>
                  <div v-else>
                    <span class="fa-stack" style="font-size: 15px;">
                      <i class="text-blue far fa-circle fa-stack-2x"></i>
                      <i class="text-blue fas fa-arrow-down fa-stack-1x text-primary"></i>
                    </span>
                  </div>
                </div>
                <div v-if="col.name === 'desc'" class="text-left text-weight-medium text-h6 text-uppercase">
                  <div v-if="props.row.amount < 0">
                    <div>
                      Sent
                    </div>
                  </div>
                  <div v-else>
                    <div>
                      Received
                    </div>
                  </div>
                </div>
                <div v-if="col.name === 'vtx'" class="text-right text-weight-medium text-h6">
                  <div v-if="col.value > 0">
                    + {{ parseFloat(props.row.amount).toFixed(2) }} VTX
                  </div>
                  <div v-else>
                    {{ parseFloat(props.row.amount).toFixed(2) }} VTX
                  </div>
                </div>
                <div v-if="col.name === 'date'" class="text-right text-weight-medium">
                  <div class="text-h6">
                    {{ col.value | formatDate }}
                  </div>
                  <div>
                    {{ col.value | formatTime }}
                  </div>
                </div>
              </q-td>
            </q-tr>
          </q-table>
        </div>
      </q-card-section>
      </div>
    </q-card>
    <q-dialog v-model="isCardModalActive">
      <q-card class="bg-black text-white q-pa-lg">
        <q-icon class="float-right q-mt-md" name="close" size="1.5rem" color="white" @click.native="isCardModalActive = false" />
        <div class="row gutter-sm bg-dark q-pa-lg text-white">
          <div class="col-auto flex flex-center">
            <div class="q-pr-md">
              <qrcode :value=walletKey :options="{size: 150}"></qrcode>
            </div>
          </div>
          <div class="col flex items-center">
            <div>
              <div class="text-h5 qr-wallet-title">{{ $t('Main.address') }}</div>
              <p class="wallet-address-qr q-pr-md q-py-md q-ma-none" >{{walletKey}}</p>
              <q-btn flat icon="file_copy" label="Copy Key" @click="copyKey(walletKey)" />
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog border v-model="checkActiveTransaction" v-if="activeTransaction" no-refocus @hide="activeTransaction = null">
      <q-card>
        <q-toolbar>
          <q-toolbar-title><span class="text-weight-bold">Transaction Record</span></q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
          <q-markup-table>
            <tbody>
              <tr>
                <td class="text-left">Amount:</td>
                <td class="text-right">{{parseFloat(activeTransaction.amount).toFixed(4).toString()}}</td>
              </tr>
              <tr>
                <td class="text-left">From:</td>
                <td class="text-right">
                  <q-btn outline dense icon="file_copy" @click="copy2clip(activeTransaction.fromaccount)" no-caps >
                    &nbsp;{{truncate(activeTransaction.fromaccount, 12)}}
                  </q-btn>
                </td>
              </tr>
              <tr>
                <td class="text-left">To:</td>
                <td class="text-right">
                  <q-btn outline dense icon="file_copy" @click="copy2clip(activeTransaction.tokey)" no-caps >
                    &nbsp;{{truncate(activeTransaction.tokey, 12)}}
                  </q-btn>
                </td>
              </tr>
              <tr>
                <td class="text-left">Transaction Id:</td>
                <td class="text-right">
                  <q-btn outline dense icon="file_copy" @click="copy2clip(activeTransaction.trx_id)" no-caps >
                    &nbsp;{{truncate(activeTransaction.trx_id, 12)}}
                  </q-btn>
                </td>
              </tr>
              <tr>
                <td class="text-left">Block #:</td>
                <td class="text-right">{{activeTransaction.blockNumber}}</td>
              </tr>
              <tr>
                <td class="text-left">Transaction Time:</td>
                <td class="text-right">{{ activeTransaction.timestamp | formatDate }} {{ activeTransaction.timestamp | formatTime }}</td>
              </tr>
              <tr>
                <td class="text-left">Memo:</td>
                <td class="text-right">{{activeTransaction.comment}}</td>
              </tr>
            </tbody>
          </q-markup-table>
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
  computed: {
    checkActiveTransaction: {
      get () {
        return !!this.activeTransaction
      },
      set () {}
    }
  },
  data () {
    return {
      spinnervisible: true,
      navigation: {
        mainpage: true,
        transactions: false,
        makepayment: false,
        makepaymentmemo: false,
        makepaymentAmount: false,
        makepaymentToken: false,
        makepaymentSummary: false
      },
      navigationButtons: {
        to: false,
        token: false,
        amount: false
      },
      showTransactionProgress: false,
      dark: true,
      activeTransaction: null,
      walletName: '',
      showLedgerPullProgress: false,
      walletKey: store.state.currentwallet.wallet.key,
      columns: [
        {
          name: 'date',
          required: true,
          align: 'center',
          field: 'timestamp',
          sortable: false,
          classes: 'my-class',
          style: 'width: 15rem'
        }, {
          name: 'icon',
          required: true,
          align: 'center',
          field: 'type',
          sortable: false,
          classes: 'my-class',
          style: 'width: 1rem'
        },
        {
          name: 'desc',
          required: true,
          align: 'center',
          field: 'name',
          sortable: false,
          classes: 'my-class',
          style: 'width: 25rem'
        },
        {
          name: 'vtx',
          required: true,
          align: 'center',
          field: 'amount',
          sortable: true,
          classes: 'my-class',
          style: 'width: 500px'
        }
      ],
      tokenSymbol: 'VTX',
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
      tokenContract:
        {
          'EOS': 'eosio.token',
          'VTX': 'volentixgsys'
        },
      tableData: [],
      transactions: [],
      vtxTotal: 0,
      currentBtcValue: 0,
      sendAmount: 0.0,
      sendTo: '',
      sendMemo: '',
      isCardModalActive: false,
      currentEosAdddress: ''
    }
  },
  mounted () {
    this.setConnectionOn()
    this.walletName = store.state.currentwallet.wallet.name
    this.walletKey = store.state.currentwallet.wallet.key
    this.getTransactionHistory()
  },
  methods: {
    isEosWallet () {
      return store.state.currentwallet.wallet.type === 'eos'
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
    truncate (text, len) {
      // Just a little modification to not truncate a eos account name.
      if (text.length > len) return text.substr(0, len) + '...'
      return text
    },
    showTransactionDetails (transaction) {
      this.activeTransaction = transaction
    },
    async getTransactionHistory () {
      // get them from the demux api of the vtx ledger contract
      let result = await this.$axios.get(process.env[this.$store.state.settings.network].DEMUX_API + '/ledger/' + this.walletKey + '?skip=0&limit=100')

      if (this.$store.state.currentwallet.wallet.type === 'eos') {
        // get them from the eos token side of things
        let eosresult = await this.$axios.get(process.env[this.$store.state.settings.network].DEMUX_API + '/eos/' + this.walletName + '?skip=0&limit=100')

        // the two APIs don't have the same output so let's map it out.
        var self = this
        let ledgerformatedresult = eosresult.data.data.map(function (eos) {
          if (eos.from === self.walletName) { eos.quantity = -eos.quantity }
          let row = {
            'amount': eos.quantity,
            'comment': eos.memo,
            'toaccount': eos.to,
            'fromaccount': eos.from,
            'timestamp': eos.timestamp,
            'blockNumber': eos.blockNumber,
            'trx_id': eos.trx_id,
            'tokey': eos.to
          }
          return row
        })

        result.data.data = result.data.data.concat(ledgerformatedresult)
      }
      // sort the transactions from the newest to the oldest
      this.tableData = result.data.data.sort((a, b) => a.blockNumber - b.blockNumber).reverse()
      return true
    },
    showDetails () {
    },
    copy2clip (value) {
      // more generic copy
      this.$clipboardWrite(value)
      this.$q.notify({
        message: this.$t('Main.copied'),
        color: 'positive'
      })
    },
    sendTokens () {
      const AmountSymbol = this.sendAmount + ' ' + this.tokenSymbol
      try {
        (new EosWrapper()).transferToken(this.tokenContract[this.tokenSymbol], this.walletName, this.sendTo, AmountSymbol, this.sendMemo, store.state.currentwallet.wallet.priv)
      } catch (error) {
        // TODO: Exception handling
        userError(error)
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
</style>

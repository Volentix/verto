<template>
  <q-page class="flex flex-center text-white bg-black">
  <div class="flex flex-center text-white bg-black">
    <q-card style="max-width: 1000px; border-style: solid;"  class="q-pa-sm" flat>
      <q-card-section class="text-center text-white">
        <div class="text-weight-bold text-uppercase q-pa-lg">
          <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('getvtx/viewhistory')">
            <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
          </q-icon>
          <big>Get VTX Transaction History</big>
          <div class="float-right">
            Refreshing In
            <span
              class="timestandard"
            >
            {{ refreshCounter }}
            </span>
          </div>
        </div>
      <div class="row justify-stretch content-center q-pa-sm" style=''>
          <div class="col-4 text-right">
              {{ $t('Transactions.filter_by') }}
          </div>
          <div class="col-1 ">
            &nbsp;
          </div>
          <div class="col-3 text-left">
              <q-select
                separator
                dark
                v-model="transactionStatus"
                :options="options"
                @input="refreshContent"
                />
          </div>
      </div>
      <br>
      <br>
      <div class="row items-center">
        <div v-if="transactionStatus === 'CANCELLED'">
          <q-table
            :dark='dark'
            :data="tableData"
            :columns="cancelledColumns"
            class=""
            row-key="name"
          >
              <q-tr :id="props.row.id" slot="body" slot-scope="props" :props="props" class="text-h4" @click.native="showTransactionDetails(props.row)">
                  <q-td
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  >
                  <div v-if="col.name === 'vtxAmount'" class="vtxamount">
                    {{ col.value }}
                  </div>
                  <div v-else>
                     <div class="text-h5">
                      {{ col.value  | formatDate }}
                    </div>
                    <div class="timestandard">
                      {{ col.value  | formatTime }}
                    </div>
                  </div>
                  </q-td>
              </q-tr>
          </q-table>
        </div>
        <div v-if="transactionStatus === 'CONVERTED'">
          <q-table
            :data="tableData"
            :columns="pendingColumns"
            :dark='dark'
            row-key="name"

          >
              <q-tr :id="props.row.id" slot="body" slot-scope="props" :props="props" class="cursor-pointer" @click.native="showTransactionDetails(props.row)">
                  <q-td
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  >
                  <div v-if="col.name === 'conversionTime'">
                    <div class="text-h5">
                      {{ col.value  | formatDate }}
                    </div>
                    <div class="timestandard">
                      {{ col.value  | formatTime }}
                    </div>
                  </div>
                  <div v-if="col.name === 'conversionCount'" class="text-h5">
                    <div v-if="props.row.entry_path === 'manual'">
                      N / A
                    </div>
                    <div v-else>
                        {{ col.value }} / 6
                    </div>
                  </div>
                  <div v-if="col.name === 'timeRemaining'">
                    <div v-if="props.row.entry_path === 'manual'">
                      <countdown :time="props.row.timeremaining" :transform="transform" >
                        <template slot-scope="propsss">
                          <div >
                            <div v-if="propsss.totalDays > 0" class="text-h5" >
                              {{ propsss.days }} Days
                            </div>
                            <span v-if="propsss.totalHours > 0" class="timestandard"
                              >{{ propsss.hours }}:</span>
                            <span v-if="propsss.totalMinutes > 0"
                              v-bind:class="{ timestandard:  propsss.totalMinutes > 0, minutesleft: propsss.totalHours <= 0 }"
                            >
                              {{ propsss.minutes }}:
                            </span>
                            <span
                              v-bind:class="{ timestandard:  propsss.totalMinutes > 0, secondsleft:  propsss.totalMinutes <= 0, minutesleft: propsss.totalHours <= 0 }"
                            >
                              {{ propsss.seconds }}
                            </span>
                          </div>
                        </template>
                      </countdown>
                    </div>
                    <div v-else>
                        N/A
                    </div>
                  </div>
                  <div v-if="col.name === 'vtxAmount'" class="vtxamount">
                    {{ col.value }}
                  </div>
                  </q-td>
              </q-tr>
          </q-table>
        </div>
        <div v-if="transactionStatus === 'CONFIRMED'">
          <q-table
            :data="tableData"
            :columns="confirmedColumns"
            :dark='dark'
            row-key="name"
          >
              <q-tr :id="props.row.id" slot="body" slot-scope="props" :props="props" class="cursor-pointer" @click.native="showTransactionDetails(props.row)">
                  <q-td
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  >
                  <div v-if="col.name === 'vtxAmount'" class="vtxamount">
                    {{ col.value }}
                  </div>
                  <div v-else>
                     <div class="text-h5">
                      {{ col.value  | formatDate }}
                    </div>
                    <div class="timestandard">
                      {{ col.value  | formatTime }}
                    </div>
                  </div>
                  </q-td>
              </q-tr>
          </q-table>
        </div>
        <div v-if="transactionStatus === 'COMPLETED'">
          <q-table
            :data="tableData"
            :columns="completedColumns"
            :dark='dark'
            row-key="name"
          >
              <q-tr :id="props.row.id" slot="body" slot-scope="props" :props="props" class="cursor-pointer" @click.native="showTransactionDetails(props.row)">
                  <q-td
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  >
                  <div v-if="col.name === 'vtxAmount'" class="vtxamount">
                    {{ col.value }}
                  </div>
                  <div v-else>
                     <div class="text-h5">
                      {{ col.value  | formatDate }}
                    </div>
                    <div class="timestandard">
                      {{ col.value  | formatTime }}
                    </div>
                  </div>
                  </q-td>
              </q-tr>
          </q-table>
        </div>
      </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="activeTransaction" v-if="activeTransaction" content-classes="bg-dark" content-css="max-height: 90vh;" no-refocus>
      <q-btn flat dense round icon="close" color="white" class="modal-close-button" @click="activeTransaction = null" />
      <div class="row gutter-sm q-pa-lg text-white" style="max-width: 550px; width: 100vw;">
        <q-list no-border dark class="full-width">
          <q-item-label header>Completed</q-item-label>
          <q-item>
            <q-item-label label="Native Currency:" />
            <q-item-section right>
              <q-item-tile stamp>{{activeTransaction.native_currency}}</q-item-tile>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-label label="Native Amount:" />
            <q-item-section right>
              <q-item-tile stamp>{{activeTransaction.native_amount}}</q-item-tile>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-label label="Conversion Rate:" />
            <q-item-section right>
              <q-item-tile stamp>{{activeTransaction.conversion_rate}}</q-item-tile>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-label label="Confirmations Count:" />
            <q-item-section right>
              <q-item-tile stamp >{{activeTransaction.confirmations_count}}</q-item-tile>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-label label="Ledger Transaction Id:" />
            <q-item-section right>
              <q-item-tile stamp>
                <q-tooltip anchor="top right" self="bottom right">
                  {{activeTransaction.ledger_transaction_id}}
                </q-tooltip>
                <q-btn outline dense icon="file_copy" @click="copyLedgerId()" no-caps >
                  &nbsp;{{truncate(activeTransaction.ledger_transaction_id, 10)}}
                </q-btn>
              </q-item-tile>
            </q-item-section>
          </q-item>

          <q-item-label header>VTX</q-item-label>

          <q-item>
            <q-item-label label="Pre Bonus Vtx Amount:" />
            <q-item-section right>
              <q-item-tile stamp >{{activeTransaction.pre_bonus_vtx_amount}}</q-item-tile>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-label label="Phase Bonus Vtx Amount:" />
            <q-item-section right>
              <q-item-tile stamp >{{activeTransaction.phase_bonus_vtx_amount}}</q-item-tile>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-label label="Additional Bonus Vtx Amount:" />
            <q-item-section right>
              <q-item-tile stamp >{{activeTransaction.additional_bonus_vtx_amount}}</q-item-tile>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-label label="Total Vtx Amount:" />
            <q-item-section right>
              <q-item-tile stamp >{{activeTransaction.vtx_amount}}</q-item-tile>
            </q-item-section>
          </q-item>

          <q-item-label header>Steps</q-item-label>

          <q-item>
            <q-item-label label="Transaction Time:" />
            <q-item-section right>
              <q-item-tile stamp >{{activeTransaction.native_transaction_time}}</q-item-tile>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-label label="Conversion Time:" />
            <q-item-section right>
              <q-item-tile stamp >{{activeTransaction.conversion_time}}</q-item-tile>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-label label="Confirmation Time:" />
            <q-item-section right>
              <q-item-tile stamp >{{activeTransaction.confirmation_time}}</q-item-tile>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-label label="Approved Time:" />
            <q-item-section right>
              <q-item-tile stamp >{{activeTransaction.approved_time}}</q-item-tile>
            </q-item-section>
          </q-item>

        </q-list>
      </div>
    </q-dialog>
  </div>
  </q-page>
</template>

<script>
// import configManager from '@/util/ConfigManager'
import axios from 'axios'
import countdown from '@chenfengyuan/vue-countdown'

export default {
  // name: 'ComponentName',
  // v-bind:class="{ oneminuteleft: minutesleft, overoneminuteleft: !underOneMinuteLeftInTimer }"
  data () {
    return {
      dark: true,
      activeTransaction: null,
      transactionStatus: 'CONVERTED',
      hasTransactions: false,
      timer: '',
      refreshTimer: '',
      options: [
        {
          label: 'Cancelled',
          value: 'CANCELLED'
        },
        {
          label: 'Pending',
          value: 'CONVERTED'
        },
        {
          label: 'Accepted',
          value: 'CONFIRMED'
        },
        {
          label: 'Completed',
          value: 'COMPLETED'
        }
      ],
      pendingColumns: [
        {
          name: 'conversionTime',
          required: true,
          align: 'center',
          field: 'conversion_time',
          label: 'Transaction Received',
          sortable: false,
          classes: 'my-class',
          style: 'width: 500px'
        },
        {
          name: 'conversionCount',
          required: true,
          align: 'center',
          field: 'confirmations_count',
          label: 'Confirmation Count',
          sortable: false,
          classes: 'my-class',
          style: 'width: 500px'
        },
        {
          name: 'timeRemaining',
          required: true,
          align: 'center',
          field: 'timeremaining',
          label: 'Time Remaining',
          sortable: false,
          classes: 'my-class',
          style: 'width: 500px'
        },
        {
          name: 'vtxAmount',
          required: true,
          align: 'center',
          label: 'VTX',
          field: 'vtx_amount',
          sortable: false,
          classes: 'my-class',
          style: 'width: 500px'
        }
      ],
      cancelledColumns: [
        {
          name: 'conversionTime',
          required: true,
          align: 'center',
          field: 'conversion_time',
          label: 'Transaction Received',
          sortable: false,
          classes: 'my-class',
          style: 'width: 500px'
        },
        {
          name: 'canceltime',
          required: true,
          align: 'center',
          field: 'cancel_time',
          label: 'Cancel Time',
          sortable: false,
          classes: 'my-class',
          style: 'width: 500px'
        },
        {
          name: 'vtxAmount',
          required: true,
          align: 'center',
          label: 'VTX',
          field: 'vtx_amount',
          sortable: false,
          classes: 'my-class',
          style: 'width: 500px'
        }
      ],
      confirmedColumns: [
        {
          name: 'conversionTime',
          required: true,
          align: 'center',
          field: 'conversion_time',
          label: 'Transaction Received',
          sortable: false,
          classes: 'my-class',
          style: 'width: 500px'
        },
        {
          name: 'confirmedTime',
          required: true,
          align: 'center',
          field: 'confirmation_time',
          label: 'Confirmed Time',
          sortable: false,
          classes: 'my-class',
          style: 'width: 500px'
        },
        {
          name: 'vtxAmount',
          required: true,
          align: 'center',
          label: 'VTX',
          field: 'vtx_amount',
          sortable: false,
          classes: 'my-class',
          style: 'width: 500px'
        }
      ],
      completedColumns: [
        {
          name: 'conversionTime',
          required: true,
          align: 'center',
          field: 'conversion_time',
          label: 'Transaction Received',
          sortable: false,
          classes: 'my-class',
          style: 'width: 500px'
        },
        {
          name: 'completedTime',
          required: true,
          align: 'center',
          field: 'approved_time',
          label: 'Completed Time',
          sortable: false,
          classes: 'my-class',
          style: 'width: 500px'
        },
        {
          name: 'vtxAmount',
          required: true,
          align: 'center',
          label: 'VTX',
          field: 'vtx_amount',
          sortable: false,
          classes: 'my-class',
          style: 'width: 500px'
        }
      ],
      tableData: [],
      countdownTimerInterval: 15000,
      refreshCounter: 30
    }
  },
  components: {
    countdown
  },
  created () {
    this.getPendingTransactions()
    this.timer = setInterval(this.getPendingTransactions, 30000)
    this.refreshTimer = setInterval(this.refreshTheCounter, 1000)
  },
  methods: {
    refreshTheCounter () {
      this.refreshCounter = this.refreshCounter - 1
      if (this.refreshCounter < 0) {
        this.refreshCounter = 0
      }
    },
    transform (props) {
      Object.entries(props).forEach(([key, value]) => {
        if (key !== 'days') {
          let digits = value < 10 ? `0${value}` : value
          if (key === 'totalMinutes' && value <= 0) {
            // this.underOneMinuteLeftInTimer = true
          } else if (key === 'totalSeconds' && value <= 0) {
            // this.doneCountdown = true
          }
          props[key] = `${digits}`
        }
      })

      return props
    },
    copyLedgerId (address) {
      this.$clipboardWrite(this.activeTransaction.ledger_transaction_id)
      this.$q.notify({ color: 'positive', message: 'Successfully copied ledger transaction id' })
    },
    truncate (text, len) {
      if (text.length >= len) return text.substr(0, len) + '...'
      return text
    },
    showTransactionDetails (transaction) {
      this.activeTransaction = transaction
    },
    setTimeRemaining (transaction) {
      const potentialTimeRemaining = Date.parse(transaction.countdown_time_ends) - Date.parse(transaction.server_time)
      if (potentialTimeRemaining > 0) {
        transaction.timeremaining = potentialTimeRemaining
      } else {
        transaction.timeremaining = 0
      }
    },
    async getPendingTransactions () {
      const url = process.env[this.$store.state.settings.network].CROWDFUND_URL + '/public/api/investor-transactions?verto_public_address=' + this.$store.state.currentwallet.wallet.key + '&status_code=' + this.transactionStatus
      let results = await axios.get(url)
      this.tableData = results.data
      if (this.transactionStatus === 'CONVERTED') {
        for (let i = 0; i < this.tableData.length; i++) {
          const item = this.tableData[i]
          if (item.entry_path === 'manual') {
            this.setTimeRemaining(item)
          } else {
            item.timeremaining = 0
          }
        }
      }
      this.refreshCounter = 30
      /*
        {
            "id": 98,
            "status": "COMPLETED",
            "pool": "private",
            "entry_path": "verto",
            "native_chain_address": "0x6507f7dacfc2c98a00964d2dd9e6cc5211304d590798114d57ba665c34087e76",
            "native_currency": "ethereum",
            "native_amount": 0.1,
            "conversion_rate": 2590,
            "pre_bonus_vtx_amount": 134.45684882,
            "phase_bonus_vtx_amount": 0,
            "additional_bonus_vtx_amount": 0,
            "vtx_amount": 134.45684882,
            "confirmations_count": 7,
            "native_transaction_time": "2019-01-10T16:49:25Z",
            "conversion_time": "2019-01-10T16:49:50.888775Z",
            "confirmation_time": "2019-01-10T16:51:10.971257Z",
            "ledger_transaction_id": "30359b02fb565a48bab5dd37b28a2d2dd072f950824959f656edf3bcc02ad498",
            "approved_time": "2019-01-10T16:51:17.643652Z",
            "countdown_time_ends": null,
            "cancel_time": null,
            "server_time": "2019-01-16T22:32:54.664557Z"
        }
        */
    },
    refreshContent () {
      this.hasTransactions = false
      this.transactions = []
      this.getPendingTransactions()
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
    clearInterval(this.refreshTimer)
  }
}
</script>
<style scoped>
.vtxamount {
  font-size: 1.5em;
}
.timestandard {
  font-size: 1.5em;
}
.minutesleft {
  color: red;
  font-size: 2.5em;
}
.secondsleft {
  color: red;
  font-size: 5em;
}
</style>

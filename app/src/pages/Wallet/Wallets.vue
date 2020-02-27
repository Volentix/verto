<template>
  <q-page class="flex justify-between text-white bg-black">
    <div class="wallets_list_wrapper">
      <div class="text-white text-center">
        <q-list dark separator style="max-width: 318px">
          <q-item
            clickable
            v-ripple
            active-class="my-menu-link"
            v-for="col in tableDataWallets"
            :active="link === col.wallet.name"
            @click="link = col.wallet.name"
            :key="col.wallet.name"
          >
            <q-item-section @click="changeCurrentWallet(col.wallet)">
              <q-item-label>{{col.wallet.name}}</q-item-label>
              <q-item-label caption>{{col.balance}} VTX</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    <q-card flat class="bg-black wallet_details_wrapper">
      <!--1. Main-->
      <q-inner-loading :visible="spinnervisible">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <div v-show="navigation.mainpage">
        <q-card-section class="text-weight-bold text-center text-uppercase">
          <div class="wallet_title_wrapper">
            <div class="flex justify-between">
              <div class="wallet_title flex flex-center">Wallet {{walletName}}</div>
              <div class="wallet_address flex flex-center justify-end">
                <div class="address">
                  Wallet Address:
                  <span class="ellipsis">{{walletKey}}</span>
                </div>
                <div class="copy_address_wrapper">
                  <q-btn flat icon="file_copy" @click="copyKey(walletKey)" />
                </div>
                <div class="qr_code_wrapper">
                  <q-btn :disabled="spinnervisible" outline @click="isCardModalActive = true">
                    <qrcode :value="walletKey" :options="{size: 30}"></qrcode>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
          <div class="vtx_btc_summary_wrapper">
            <div class="vtx_amount_wrapper">
              <span class="text-h3">{{ balance }}</span>
              <span class="q-subtitle-vtx">VTX</span>
            </div>
            <div class="vtx_amount_to_btc_wrapper flex justify-center">
              <div class="btc_amount">
                <span class="text-h3">{{ currentBtcValue.toFixed(4) }}</span>
                <span class="q-subtitle-btc">BTC VALUE</span>
              </div>
              <div class="refresh_amount_wrapper">
                <q-icon
                  class="float-right"
                  name="refresh"
                  size="2.5rem"
                  @click.native="retrieveBalance()"
                >
                  <q-tooltip>Refresh</q-tooltip>
                </q-icon>
              </div>
            </div>
          </div>
          <div class="call_to_action_btns_wrapper">
            <div class="row justify-center q-col-gutter-sm">
              <div class="commun_btn">
                <q-btn
                  outline
                  @click="$router.push({name: 'eos-make-payment', params: {vtxbalance: vtxBalance,eosbalance: eosBalance}})"
                >Send</q-btn>
              </div>
              <div class="commun_btn">
                <q-btn :disabled="spinnervisible" outline @click="isCardModalActive = true">Receive</q-btn>
              </div>
              <div class="commun_btn hide">
                <q-btn
                  :disabled="spinnervisible"
                  outline
                  @click="$router.push('associations')"
                >KYC & Tools</q-btn>
              </div>
              <div class="commun_btn active">
                <q-btn outline @click="goToLink()">Trade</q-btn>
              </div>
            </div>
          </div>
          <div class="chart_btc_vtx_wrapper flex flex-center justify-center text-black">
            <!-- <apexchart width="500" type="area" :options="optionsChartBtc2" :series="seriesChartBtc2"></apexchart> -->
            <!-- <apexchart type=area height=350 :options="optionsChartBtc2" :series="seriesChartBtc2" /> -->
            <div id="chart">
              <div class="toolbar">
                <!-- <button @click="updateData('one_month')" id="one_month" :class="{active: selection==='one_month'}">1M</button>
                <button @click="updateData('six_months')" id="six_months" :class="{active: selection==='six_months'}">6M</button>
                <button @click="updateData('one_year')" id="one_year" :class="{active: selection==='one_year'}">1Y</button>
                <button @click="updateData('ytd')" id="ytd" :class="{active: selection==='ytd'}">YTD</button>
                <button @click="updateData('all')" id="all" :class="{active: selection==='all'}">ALL</button>-->
              </div>
              <apexchart
                width="500"
                height="250"
                type="area"
                :options="optionsChartBtc3"
                :series="seriesChartBtc3"
              ></apexchart>
              <!-- <apexchart type=area height=350 :options="chartOptions" :series="series" /> -->
            </div>
          </div>
          <div class="vtx_on_btc_help text-white flex justify-center">
            <span class="flex justify-center flex-center">VTX/BTC</span>
          </div>
          <div class="transactions_wrapper flex flex-center justify-center">
            <q-card-section class="text-center">
              <div class="row items-cente q-pa-sm max-width-custom">
                <div class="list_of_transactions_wrapper">
                  <q-list dark separator>
                    <q-item
                      clickable
                      v-ripple
                      active-class="my-menu-link2"
                      v-for="col in tableData"
                      :active="link2 === col.blockNumber"
                      @click="changeCurrentItem(col.blockNumber)"
                      :key="col.blockNumber"
                    >
                      <q-item-section>
                        <q-item-label class="short_version">
                          <div class="flex item-center justify-between">
                            <div class="date">{{ col.timestamp | formatDate2 }}</div>
                            <div class="type_icon">
                              <div v-if="col.amount < 0">
                                <q-btn flat color="gray" icon="input" class="icon_received"/>
                                <q-btn flat color="gray" label="Received" />
                              </div>
                              <div v-else>
                                <q-btn flat color="gray" icon="input" class="icon_sent"/>
                                <q-btn flat color="gray" label="Sent" />
                              </div>
                            </div>
                            <div class="amount_wrapper flex justify-end">
                              <div class="amount">
                                <div
                                  v-if="col.value > 0"
                                >+ {{ parseFloat(col.amount).toFixed(2) }} {{ col.currency || 'VTX' }}</div>
                                <div
                                  v-else
                                >{{ parseFloat(col.amount).toFixed(2) }} {{ col.currency || 'VTX' }}</div>
                              </div>
                              <div class="more_details_btn_wrapper">
                                <q-icon name="font_expand_more" class="text-white" style="font-size: 20px;" />
                              </div>
                            </div>
                          </div>
                        </q-item-label>
                        <q-item-label class="long_version column">
                          <div class="flex flex_item  item-center justify-between">
                            <div class="type_icon">
                              <div v-if="col.amount < 0">
                                <q-btn flat color="green-12" icon="input" class="icon_received"/>
                                <q-btn flat color="green-12" label="Received" />
                              </div>
                              <div v-else>
                                <q-btn flat color="green-12" icon="input" class="icon_sent"/>
                                <q-btn flat color="green-12" label="Sent" />
                              </div>
                            </div>
                            <div class="date">{{ col.timestamp | formatDate3 }} <span class="time_ext">{{ col.timestamp | formatTime }}</span></div>
                            <div class="amount_wrapper text-green-12 flex justify-end">
                              <div class="amount">
                                <div
                                  v-if="col.value > 0"
                                >+ {{ parseFloat(col.amount).toFixed(2) }} {{ col.currency || 'VTX' }}</div>
                                <div
                                  v-else
                                >{{ parseFloat(col.amount).toFixed(2) }} {{ col.currency || 'VTX' }}</div>
                              </div>
                              <div class="more_details_btn_wrapper">
                                <q-icon name="font_expand_less" class="text-white" style="font-size: 20px;" />
                              </div>
                            </div>
                          </div>
                          <div class="from_to_wrapper flex">
                            <div class="row text-left">
                              <div class="col col-7">
                                <label class="from_label">From : </label><br>
                                <label class="from_value">{{ col.fromaccount }}</label>
                              </div>
                              <div class="col col-2">
                                <label class="from_label">Transaction # : </label><br>
                                <label class="from_value">{{ truncate(col.trx_id, 12) }}</label>
                              </div>
                              <div class="col col-3 qrcode_col text-right">
                                <qrcode :value="col.tokey" :options="{size: 100}"></qrcode>
                              </div>
                            </div>
                            <div class="row text-left">
                              <div class="col col-7">
                                <label class="from_label">To : </label><br>
                                <label class="from_value">{{ col.tokey }}</label>
                              </div>
                              <div class="col col-2">
                                <label class="from_label">Block # : </label><br>
                                <label class="from_value">{{ col.blockNumber }}</label>
                              </div>
                              <div class="col col-3 text-right zindex999">
                                <div class="">
                                  <q-btn @click="shareBtn()" class="share_btn" outline icon-right="share">Share</q-btn>
                                </div>
                                <social-sharing
                                  class="share_wrapper text-black flex column justify-even content-start item-start"
                                  :class="{'hide': !DisplaySocial}"
                                  :url="'https://bloks.io/transaction/'+ col.trx_id "
                                  title="Transaction"
                                  description=""
                                  quote=""
                                  hashtags=""
                                  twitter-user=""
                                  inline-template>
                                    <div>
                                      <network network="email">Email</network>
                                      <network network="skype">Skype</network>
                                      <network network="sms">SMS</network>
                                      <network network="telegram">Telegram</network>
                                      <network network="whatsapp">Whatsapp</network>
                                    </div>
                                  </social-sharing>
                              </div>
                            </div>
                          </div>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <!-- <q-table
                  class="bg-black"
                  :dark="dark"
                  :data="tableData"
                  :columns="columns"
                  row-key="name"
                >
                  <q-tr
                    :id="props.row.id"
                    slot="body"
                    slot-scope="props"
                    :props="props"
                    class="cursor-pointer"
                    @click.native="showTransactionDetails(props.row)"
                  >
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
                            <i class="text-red fas fa-arrow-up fa-stack-1x text-primary"></i>
                          </span>
                        </div>
                        <div v-else>
                          <span class="fa-stack" style="font-size: 15px;">
                            <i class="text-blue far fa-circle fa-stack-2x"></i>
                            <i class="text-blue fas fa-arrow-down fa-stack-1x text-primary"></i>
                          </span>
                        </div>
                      </div>
                      <div
                        v-if="col.name === 'desc'"
                        class="text-left text-weight-medium text-h6 text-uppercase"
                      >
                        <div v-if="props.row.amount < 0">
                          <div>Sent</div>
                        </div>
                        <div v-else>
                          <div>Received</div>
                        </div>
                      </div>
                      <div v-if="col.name === 'vtx'" class="text-right text-weight-medium text-h6">
                        <div
                          v-if="col.value > 0"
                        >+ {{ parseFloat(props.row.amount).toFixed(2) }} {{ props.row.currency || 'VTX' }}</div>
                        <div
                          v-else
                        >{{ parseFloat(props.row.amount).toFixed(2) }} {{ props.row.currency || 'VTX' }}</div>
                      </div>
                      <div v-if="col.name === 'date'" class="text-right text-weight-medium">
                        <div class="text-h6">{{ col.value | formatDate }}</div>
                        <div>{{ col.value | formatTime }}</div>
                      </div>
                    </q-td>
                  </q-tr>
                </q-table> -->
              </div>
            </q-card-section>
          </div>
          <!-- End transactions_wrapper -->
          <div class="iam_here hide">
            <q-icon
              class="float-left"
              name="help_outline"
              size="2.5rem"
              color="white"
              @click.native="$documentationManger.openDocumentation('wallet/index')"
            >
              <q-tooltip v-if="!$q.platform.is.cordova">{{ $t('SettingsView.help') }}</q-tooltip>
            </q-icon>
            <big class="titillium q-pa-md">Wallet</big>
            <q-icon
              class="float-right"
              name="refresh"
              size="2.5rem"
              @click.native="retrieveBalance()"
            >
              <q-tooltip>Refresh</q-tooltip>
            </q-icon>
          </div>
        </q-card-section>
        <q-card-section class="text-center">
          <div class="text-center text-weight-bold text-uppercase q-pa-md">
            <div v-if="isEosWallet()">
              <div class="hide">
                <span class="text-h3">{{ currentBtcValue.toFixed(4) }}</span>
                <span class="q-subtilte">BTC</span>
              </div>
              <br />
              <div class="row justify-center q-col-gutter-sm">
                <div class="float-left text-center q-ml-sm q-pa-xl">
                  <p class="text-h3">{{ balance }}</p>
                  <p class="q-subtitle">VTX Promise</p>
                </div>
                <div class="float-left text-center q-ml-sm q-pa-xl">
                  <p class="text-h3">{{ vtxBalance }}</p>
                  <p class="q-subtitle">VTX Balance</p>
                </div>
                <div class="float-left text-center q-ml-sm q-pa-xl">
                  <p class="text-h3">{{ eosBalance }}</p>
                  <p class="q-subtitle">EOS Balance</p>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="hide row justify-center q-col-gutter-sm">
                <div class="float-left text-center q-ml-sm q-px-xl q-pb-xl q-pt-md">
                  <span class="text-h3">{{ balance }}</span>
                  <span class="q-subtitle">VTX</span>
                </div>
                <div class="float-left text-center q-ml-sm q-px-xl q-pb-xl q-pt-md">
                  <span class="text-h3">{{ currentBtcValue.toFixed(4) }}</span>
                  <span class="q-subtilte">BTC</span>
                </div>
              </div>
            </div>
            <div class="hide row justify-center q-col-gutter-sm">
              <div>
                <q-btn
                  :disabled="spinnervisible"
                  outline
                  @click="isCardModalActive = true"
                >View Address</q-btn>
              </div>
              <div>
                <q-btn
                  :disabled="spinnervisible"
                  outline
                  @click="$router.push('associations')"
                >KYC & Tools</q-btn>
              </div>
              <div>
                <q-btn
                  :disabled="spinnervisible"
                  outline
                  @click="$router.push('view-ledger-transactions')"
                >View History</q-btn>
              </div>
              <div>
                <q-btn
                  v-if="isEosWallet()"
                  :disabled="spinnervisible"
                  outline
                  @click="$router.push({name: 'eos-make-payment', params: {vtxbalance: vtxBalance,eosbalance: eosBalance}})"
                >Make Payment</q-btn>
              </div>
              <!-- <div>
                  @click="$router.push({name: 'eos-make-payment', params: {vtxbalance: vtxBalance,eosbalance: eosBalance}})"
                <q-btn outline label="Scan QR" @click="isCardModalActive = true"/>
              </div>-->
            </div>
            <div class="hide q-pa-lg">
              <q-btn outline glossy @click="goToLink()">
                <img src="statics/vtx.png" width="52" />
                <span class="q-pa-lg">Trade VTX</span>
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </div>
    </q-card>
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
                <td class="text-right">{{parseFloat(activeTransaction.amount).toFixed(8).toString()}}</td>
              </tr>
              <tr>
                <td class="text-left">Currency:</td>
                <td class="text-right">{{activeTransaction.currency || 'VTX'}}</td>
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
    <q-dialog v-model="isCardModalActive">
      <q-card class="bg-black text-white q-pa-lg" style="max-width: 800px; width: 100%;">
        <q-icon
          class="float-right q-mt-md"
          name="close"
          size="1.5rem"
          color="white"
          @click.native="isCardModalActive = false"
        />
        <div class="row gutter-sm q-pa-lg text-white">
          <div class="col-auto flex flex-center">
            <div class="q-pr-md">
              <qrcode :value="walletKey" :options="{size: 150}"></qrcode>
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
            <p class="wallet-address-qr q-pr-md q-py-md q-ma-none">Pulling From:</p>
            <p class="text-h6">{{ currentEosAdddress }}</p>
          </div>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showTransactionProgress">
      <q-card class="bg-black text-white q-pa-lg">
        <div class="text-center">
          <div>
            <div class="text-h5 qr-wallet-title">Getting Transactions</div>
            <p
              class="wallet-address-qr q-pr-md q-py-md q-ma-none"
            >Pulling From: {{ currentEosAdddress }}</p>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
// import configManager from '../../util/ConfigManager'
import EosWrapper from '@/util/EosWrapper'
import { openURL } from 'quasar'
import { userError } from '@/util/errorHandler'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import Vue from 'vue'
import moment from 'moment'
import VueApexCharts from 'vue-apexcharts'

var SocialSharing = require('vue-social-sharing')

Vue.use(SocialSharing)

Vue.component('apexchart', VueApexCharts)

Vue.component(VueQrcode.name, VueQrcode)

Vue.filter('formatDate3', function (value) {
  if (value) {
    return moment(value).format('dddd, MMM DD, YYYY')
  }
})

Vue.filter('formatDate2', function (value) {
  if (value) {
    return moment(value).format('MMM DD')
  }
})

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
      // Added by Youssef
      DisplaySocial: false,
      link: this.$store.state.currentwallet.wallet.name,
      link2: 'test',
      link2Bool: true,
      selection: 'one_year',
      seriesChartBtc3: [[1361919600000, 39.6], [1332019600000, 29.6]],
      optionsChartBtc3: {
        annotations: {
          yaxis: [
            {
              y: 30,
              borderColor: '#999',
              label: {
                show: true,
                text: 'Support',
                style: {
                  color: '#fff',
                  background: '#00E396'
                }
              }
            }
          ],
          xaxis: [
            {
              // x: new Date('14 Nov 2019').getTime(),
              borderColor: '#999',
              yAxisIndex: 0
              // label: {
              //   show: true,
              //   text: 'Rally',
              //   style: {
              //     color: '#fff',
              //     background: '#775DD0'
              //   }
              // }
            }
          ]
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: 'hollow'
        },
        xaxis: {
          type: 'datetime',
          // min: new Date('01 Jun 2019').getTime(),
          tickAmount: 6
        },
        tooltip: {
          x: {
            format: 'dd MMM yyyy'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.2,
            // stops: [0, 100]
            stops: [0, 100, 100, 100]
          }
        }
      },
      navigation: {
        mainpage: true,
        transactions: false,
        makepayment: false,
        makepaymentmemo: false,
        makepaymentAmount: false,
        makepaymentToken: false,
        makepaymentSummary: false
      },
      columns: [
        {
          name: 'date',
          required: true,
          align: 'center',
          field: 'timestamp',
          sortable: false,
          classes: 'my-class',
          style: 'width: 15rem'
        },
        {
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
      tableDataWallets: [],
      // Added by Youssef
      spinnervisible: true,
      // Edited by Youssef
      // navigation: {
      //   mainpage: true,
      //   transactions: false
      // },
      navigationButtons: {
        to: false,
        token: false,
        amount: false
      },
      showTransactionProgress: false,
      dark: true,
      activeTransaction: null,
      endOfAddressList: false,
      walletName: '',
      showLedgerPullProgress: false,
      walletKey: this.$store.state.currentwallet.wallet.key,
      tokenSymbol: 'VTX',
      tokenContract: {
        EOS: 'eosio.token',
        VTX: 'volentixgsys'
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
  computed: {
    checkActiveTransaction: {
      get () {
        return !!this.activeTransaction
      },
      set () {}
    }
  },
  mounted () {
    this.setConnectionOn()
    this.walletName = this.$store.state.currentwallet.wallet.name
    this.walletKey = this.$store.state.currentwallet.wallet.key
    this.retrieveBalance()
    this.retrieveVTXBTC()
    this.getTransactionHistory()
    // this.loadTableData()
    this.loadTableDataWallets()
  },
  methods: {
    // Added by Youssef
    shareBtn () {
      this.link2Bool = true
      if (this.DisplaySocial) {
        this.DisplaySocial = false
      } else {
        this.DisplaySocial = true
      }
    },
    shareBtn2 () {
      this.link2Bool = true
      this.DisplaySocial = false
      console.log('this.DisplaySocial', this.DisplaySocial)
    },
    changeCurrentItem (name) {
      if (this.link2Bool) {
        this.link2 = name
        this.link2Bool = false
      } else {
        this.link2 = ''
        this.link2Bool = true
        this.DisplaySocial = false
      }
    },
    updateChart () {
      const max = 90
      const min = 20
      const newData = this.series[0].data.map(() => {
        return Math.floor(Math.random() * (max - min + 1)) + min
      })
      // In the same way, update the series option
      this.series = [
        {
          data: newData
        }
      ]
    },
    updateData: function (timeline) {
      this.selection = timeline

      switch (timeline) {
        case 'one_month':
          this.chartOptions = {
            xaxis: {
              min: new Date('28 Jan 2013').getTime(),
              max: new Date('27 Feb 2013').getTime()
            }
          }
          break
        case 'six_months':
          this.chartOptions = {
            xaxis: {
              min: new Date('27 Sep 2012').getTime(),
              max: new Date('27 Feb 2013').getTime()
            }
          }
          break
        case 'one_year':
          this.chartOptions = {
            xaxis: {
              min: new Date('27 Feb 2012').getTime(),
              max: new Date('27 Feb 2013').getTime()
            }
          }
          break
        case 'ytd':
          this.chartOptions = {
            xaxis: {
              min: new Date('01 Jan 2013').getTime(),
              max: new Date('27 Feb 2013').getTime()
            }
          }
          break
        case 'all':
          this.chartOptions = {
            xaxis: {
              min: undefined,
              max: undefined
            }
          }
          break
        default:
      }
    },
    async retrieveVTXBTC () {
      // let startTime = ''
      // let startTime = ''
      let result = await this.$axios.get(
        'https://api3.stex.com/public/chart/1058/5?timeStart=1567367779&timeEnd=1569527779&limit=100'
      )
      let chartDataArray = []
      for (var item of result.data.data) {
        const varArray = [item.time, item.open]
        chartDataArray.push(varArray)
      }
      this.seriesChartBtc3 = [{ data: chartDataArray }]
    },
    async getTransactionHistory () {
      // get them from the demux api of the vtx ledger contract
      let result = await this.$axios.get(
        process.env[this.$store.state.settings.network].DEMUX_API +
          '/ledger/' +
          this.walletKey +
          '?skip=0&limit=100'
      )

      if (this.$store.state.currentwallet.wallet.type === 'eos') {
        // get them from the eos token side of things
        let eosresult = await this.$axios.get(
          process.env[this.$store.state.settings.network].DEMUX_API +
            '/eos/' +
            this.walletName +
            '?skip=0&limit=100'
        )

        // the two APIs don't have the same output so let's map it out.
        var self = this
        let ledgerformatedresult = eosresult.data.data.map(function (eos) {
          if (eos.from === self.walletName) {
            eos.quantity = -eos.quantity
          }
          let row = {
            amount: eos.quantity,
            currency: eos.currency,
            comment: eos.memo,
            toaccount: eos.to,
            fromaccount: eos.from,
            timestamp: eos.timestamp,
            blockNumber: eos.blockNumber,
            trx_id: eos.trx_id,
            tokey: eos.to
          }
          return row
        })

        result.data.data = result.data.data.concat(ledgerformatedresult)
      }
      // sort the transactions from the newest to the oldest
      this.tableData = result.data.data
        .sort((a, b) => a.blockNumber - b.blockNumber)
        .reverse()
      return true
    },
    async loadTableDataWallets () {
      this.tableDataWallets = this.$store.state.currentwallet.config.keys
      let tableDataWalletsCustom = []
      for (var item of this.tableDataWallets) {
        let balanceByWallet = await this.getBalanceByWalletKey(item.key)
        // console.log('balanceByWallet', balanceByWallet.data.balance)
        let balancaValue = balanceByWallet.data.balance
        tableDataWalletsCustom.push({ 'wallet': item, 'balance': balancaValue })
      }
      // console.log('tableDataWalletsCustom', tableDataWalletsCustom)
      this.tableDataWallets = tableDataWalletsCustom
    },
    changeCurrentWallet: function (row) {
      this.$configManager.updateCurrentWallet(row)
      this.$router.push({ path: '/wallets' })
      this.walletName = row.name
      this.walletKey = row.key
      this.retrieveBalance()
      this.getTransactionHistory()
    },
    async getBalanceByWalletKey (walletKey) {
      const result = await this.$axios.get(
        process.env[this.$store.state.settings.network].DEMUX_API +
            '/ledger/balance/' + walletKey
      )
      return result
    },
    // Added by Youssef
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
    goToLink () {
      openURL('https://app.stex.com/en/basic-trade/pair/BTC/VTX')
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
      this.$q.notify({
        color: 'positive',
        message: this.$t('DisplayKey.copied')
      })
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
        // Getting the account balance from demux in case of the ledger contract
        let result = await this.$axios.get(
          process.env[this.$store.state.settings.network].DEMUX_API +
            '/ledger/balance/' +
            this.walletKey
        )
        self.balance = parseFloat(result.data.balance).toFixed(2)
        // self.balance = parseFloat(result.data.balance).toFixed(8)
        self.vtxTotal = self.balance
        let vtxProm = 0
        let eosProm = 0
        if (this.$store.state.currentwallet.wallet.type === 'eos') {
          const eos = new EosWrapper()
          vtxProm = eos
            .getCurrencyBalanceP(this.walletName, this.tokenContract['VTX'])
            .then(function (result) {
              if (result.length) {
                self.vtxBalance = result[0].split(' ')[0]
              }
              self.vtxTotal = parseFloat(
                +self.vtxBalance + +self.vtxTotal
              ).toFixed(8)
            })
            .catch(function (error) {
              // TODO: Exception handling
              userError(error)
              return false
            })
          // get EOS Balance on EOS Account
          eosProm = eos
            .getCurrencyBalanceP(this.walletName)
            .then(function (result) {
              if (result.length) {
                self.eosBalance = result[0].split(' ')[0]
              }
            })
        }
        // get EOS Balance on EOS Account
        Promise.all([vtxProm, eosProm]).then(async values => {
          let results = await this.$axios.get(
            'https://api3.stex.com/public/ticker/1059'
          )
          let eos2btc = await this.$axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=eos&vs_currencies=btc'
          )
          let eosBtcTotals = parseFloat(
            +eos2btc.data.eos.btc * +self.eosBalance
          ).toFixed(8)
          let vtxBtcTotals = parseFloat(
            (+results.data.data.ask * +self.vtxTotal) / 10000
          ).toFixed(8)
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
// var resetCssClasses = function (activeEl) {
//   var els = document.querySelectorAll('button')
//   Array.prototype.forEach.call(els, function (el) {
//     el.classList.remove('active')
//   })

//   activeEl.target.classList.add('active')
// }
</script>

<style lang="stylus" scoped>
.q-data-table th {
  text-align: right;
}

.close-button {
  position: absolute;
  right: 5px;
  top: 5px;
}

.wallet-address-qr {
  max-width: 40vw;
  overflow: hidden;
  text-overflow: ellipsis;
}

.qr-wallet-title {
  word-wrap: normal;
}

.bg-blue-grey-1 .q-btn {
  max-width: 12rem;
  height: 4.5rem;
}

.q-table-container {
  max-width: 90vw;
  padding: 1rem;
}
</style>
<style lang="scss" scoped>
.wallet_details_wrapper {
  flex-basis: 87%;
}
.wallet_title_wrapper {
  border-top: 4px solid #8deade;
  width: 100%;
  height: 70px;
  max-width: 90%;
  margin: auto;
  margin-top: 20px;
  font-weight: 100;
  text-transform: initial;
  .wallet_title {
    font-weight: 600;
    letter-spacing: 1px;
  }
  .wallet_address {
    text-transform: normal;
    .address {
      text-transform: normal;
      display: flex;
      letter-spacing: 0.5px;
      span {
        width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        margin-right: 0px;
        margin-left: 10px;
      }
    }
    .copy_address_wrapper {
      button {
        padding: 0px 5px;
        border-radius: 5px;
        margin-left: 5px;
      }
    }
  }

  .qr_code_wrapper {
    padding: 10px;
    padding-bottom: 6px;
    padding-right: 0px;
    button {
      border: none;
      padding: 0px 6px;
      position: relative;
      border-radius: 5px;
      top: -2px;
      margin-left: -10px;
      margin-right: -5px;
    }
    canvas {
      width: 24px !important;
      height: 24px !important;
    }
  }
  .copy_address_wrapper {
  }
}

.vtx_btc_summary_wrapper {
  width: 100%;
  height: auto;
  max-width: 90%;
  margin: auto;
  margin-top: 20px;
}
.vtx_amount_wrapper {
  .text-h3 {
    font-size: 32px;
    letter-spacing: 2px;
    font-weight: 700;
  }
  .q-subtitle-vtx {
    font-size: 30px;
    font-weight: 700;
    text-transform: uppercase;
  }
}
.vtx_amount_to_btc_wrapper {
}
.btc_amount {
  margin-right: 40px;
  position: relative;
  top: -10px;
  color: #57ffE9;
  .text-h3 {
    font-size: 22px;
    letter-spacing: 2px;
    font-weight: 100;
  }
  .q-subtitle-btc {
    font-size: 20px;
    font-weight: 100;
    text-transform: uppercase;
    margin-left: 5px;
  }
}
.refresh_amount_wrapper {
  i {
    font-size: 20px;
    height: 30px;
  }
}
.hide {
  display: none !important;
}
.call_to_action_btns_wrapper {
  width: 100%;
  height: auto;
  max-width: 90%;
  margin: auto;
  margin-top: 20px;
}
.commun_btn {
  button {
    border-radius: 40px;
    width: 130px;
    border-color: #25fde1;
    border-width: 2px;
    text-transform: initial !important;
  }
  &.active {
    button {
      background-color: #25fde1 !important;
      color: #000;
      font-weight: 700;
    }
  }
}
.chart_btc_vtx_wrapper {
  padding: 50px 0px;
  padding-right: 30px;
}
.apexcharts-tooltip {
  color: #000 !important;
}
.apexcharts-tooltip.light .apexcharts-tooltip-title {
  color: #000 !important;
}
.apexcharts-tooltip .apexcharts-tooltip-title {
  color: #000 !important;
}
.apexcharts-tooltip.light {
  color: #000 !important;
}
.apexcharts-menu {
  color: #000 !important;
}
.apexcharts-gridline {
  display: none !important;
}
.apexcharts-series {
  path:first-child {
    stroke: rgb(37, 253, 225) !important;
    stroke-width: 0.5px !important;
  }
}
#SvgjsPath4662 {
  stroke: rgb(37, 253, 225) !important;
  stroke-width: 0.5px !important;
}
.wallets_list_wrapper {
  .q-list--separator > .q-item-type + .q-item-type {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
  }
}
.wallets_list_wrapper {
  flex-basis: 13%;
  background-color: #17181a;
  .q-item.q-item-type {
    padding: 30px 0px;
    &.q-item--active {
      background: #000;
      &:before {
        content: "";
        position: absolute;
        left: 0px;
        top: 0px;
        width: 10px;
        height: 100%;
        background: #adf8ee;
        background: -moz-linear-gradient(top, #adf8ee 0%, #0ffedf 100%);
        background: -webkit-linear-gradient(top, #adf8ee 0%, #0ffedf 100%);
        background: linear-gradient(to bottom, #adf8ee 0%, #0ffedf 100%);
      }
    }
    .q-item__label {
      color: #6f7071;
      &:not(.q-item__label--caption) {
        font-weight: bold;
        color: #a5a5a5;
        margin-bottom: 7px;
        letter-spacing: 0.5px;
      }
    }
  }
}
.vtx_on_btc_help {
  margin-top: -50px;
  span {
    position: relative;
    &:after {
      content: "";
      position: absolute;
      left: 120%;
      width: 14px;
      height: 4px;
      background-color: #008ffb;
      border-radius: 5px;
    }
  }
}
.transactions_wrapper {
  .max-width-custom {
    width: auto;
    max-width: 690px;
  }
}
.list_of_transactions_wrapper{
  width: 100%;
  width: 800px;
  margin-bottom: 70px;
  .date{
    width: 80px;
    text-align: left;
  }
  .q-list{
    width: 100%;
  }
  .short_version{
    margin-top: 7px;
  }
  .long_version{
    display: none;
    .flex_item{
      width: 100%;
    }
    .type_icon{
      pointer-events: none;
      margin-left: -15px;
      margin-top: -11px;
      margin-bottom: -5px;
      width: 150px;
      text-align: left;
    }
    &:before {
      content: "";
      position: absolute;
      left: 0px;
      top: 0px;
      width: 100%;
      height: 100%;
      border: 1px solid #4ab983;
    }
    .date{
      width: auto;
      text-align: left;
      color: #FFF;
      .time_ext{
        margin-left: 20px;
      }
    }
  }
  .q-item.q-router-link--active,
  .q-item--active {
      // color: #050a10;
      color: #adadad;
      .short_version{
        display: none;
      }
      .long_version{
        display: flex;
      }
  }
}
.amount_wrapper {
  width: 250px;
  .amount {
    margin-right: 10px;

  }
}
.more_details_btn_wrapper{
  position: relative;
  opacity: .7;
  .q-icon{
    left: -50px;
  }
}
.type_icon{
  pointer-events: none;
  margin-left: -150px;
  margin-top: -11px;
  margin-bottom: -5px;
  width: 150px;
  text-align: left;
}
.from_to_wrapper{
  width: 100%;
  margin-top: 50px;
  .row{
    width: 100%;
    .col{
      margin-bottom: 10px;
      &.qrcode_col{
        position: relative;
        margin-top: -30px;
        right: 5px;
        canvas{
          width: 50px !important;
          height: 50px !important;
          position: absolute !important;
          right: 0px;
          top: 0px;
        }
      }
    }
    .from_label{
      font-size: 10px;
      letter-spacing: .5px;
      font-weight: 600;
      text-transform: initial;
      opacity: .5;
    }
    .from_value{
      font-size: 10px;
      letter-spacing: .5px;
      font-weight: 200;
    }
  }
}
.icon_received{
  transform: rotate(180deg);
  margin-right: -20px;
}
.icon_sent{
  margin-right: -20px;
}
.apexcharts-canvas{
  display: none !important;
}
.zindex999{
  position: relative;
  z-index: 999;
}

.share_btn {
    font-size: 12px;
    border-radius: 40px;
    width: 100px;
    border-color: #25fde1;
    border-width: 2px;
    text-transform: initial !important;
    color: #FFF;
    padding: 0px 0px;
    i{
      font-size: 15px;
      margin-left: 5px;
    }
}
.share_wrapper{
  position: absolute;
  right: 0px;
  top: 40px;
  background-color: #fff;
  width: 90px;
  min-height: 100px;
  border-radius: 6px;
}
</style>

<style>
.share_wrapper span{
  font-size: 12px;
  color: #000;
  display: block;
  width: 100%;
  padding: 5px 10px;
  text-transform: capitalize;
  border-bottom: 1px solid rgba(0,0,0,.03);
}
.share_wrapper span:hover{
  background-color: rgba(0,0,0,.02);
}
.share_btn i{
  font-size: 15px !important;
  margin-left: 5px;
}
.apexcharts-zoom-icon.selected svg,
.apexcharts-selection-icon.selected svg,
.apexcharts-reset-zoom-icon.selected svg {
  fill: #57ffE9 !important;
}
.apexcharts-series path{
  stroke: #F600FF !important;
  stroke-width: 1 !important;
}
.apexcharts-gridlines-horizontal{
  display: none !important;
}
</style>

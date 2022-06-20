<template>
  <div>
    <q-btn
      label="Back"
      to="/staider"
      flat
      dense
      color="white"
      icon="keyboard_backspace"
      class="q-pb-md"
      style="margin-left: -80px"
      v-if="false"
    />
    <div
      :class="{ 'dark-theme': true }"
      class="wrapper q-pr-md"
      style="border-radius: 30px"
      v-if="!($q.platform.is.mobile || $isbex)"
    >
      <div class="row" style="padding-bottom: 20px; padding-top: 20px">
        <div class="left-area col-md-12 row q-mb-md">
          <div
            class="left q-ml-md q-py-md q-pr-lg"
            :class="{
              'col-md-5': $store.state.currentwallet.user || $route.params.fundID == 'private',
              'col-md-9': !$store.state.currentwallet.user && $route.params.fundID !== 'private',
            }"
          >
           <q-item v-if="!(fundRefData && fundRefData.staiderData) && $route.params.fundID !== 'private'">
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>
      </q-item>

            <span class="z-max" v-else>
              <div class="text-h6 text-bold">
                <span v-if="$route.params.fundID == 'private'">{{
                  fundData.name
                }}</span>
                <span
                  v-else-if="fundRefData && fundRefData.staiderData"
                  >{{ fundRefData.staiderData.name }}</span
                >

              </div>
              <div class="row flex items-center">
                <h2>
                  <img
                    v-if="fundData.icon"
                    onerror="this.src='https://etherscan.io/images/main/empty-token.png';"
                    :src="fundData.icon"
                    style="max-width: 40px"
                    alt="image"
                  />
                  <img
                    v-if="false"
                    style="max-width: 0px"
                    :src="
                      $store.state.settings.lightMode === 'true'
                        ? 'statics/verified-badge-2-866240.png'
                        : 'https://cdn.iconscout.com/icon/free/png-256/verified-badge-1-866240.png'
                    "
                    alt=""
                  />
                </h2>
                <h3 class="q-pl-lg q-pr-md fundDetails">
                  <span
                    class="historicalPrice"
                    v-if="$route.params.fundID == 'private'"
                  >
                  <span class="text-h3 total" >
                    ${{fundTotal }}
                  </span>
  <br/>
                    <span class="totalLabel" v-if="$store.state.wallets.customTotal.show">{{$store.state.wallets.customTotal.label.replace('balance', 'assets value')}}</span>
                  <span class="totalLabel" v-else>Total value</span>

                  </span>
                  <span
                    class="value"
                    v-if="
                      fundRefData &&
                      fundRefData.staiderData && fundRefData.staiderData.calculations
                    "
                    > <span
                          class="value"
                          v-if="
                            Object.keys(fundRefData.staiderData.calculations)
                              .length > 0
                          "
                          >{{
                            formatNumber(
                              fundRefData.staiderData.calculations[
                                fundRefData.currentCurrency
                              ].price,
                              2
                            )
                          }}
                          {{ fundRefData.currency.toUpperCase() }}
                          </span
                        >

                    <span v-else> 0 USD</span>
                      <span v-if="
                      fundRefData &&
                      fundRefData.staiderData
                    " class="aum"> Daily change:
                      <span
                        :class="[
                          fundRefData.change24h >= 0
                            ? 'text-green-6'
                            : 'text-pink-12',
                        ]"
                        style="font-weight: 400"
                        >{{ fundRefData.change24h }}%</span
                      ></span>
                    </span
                  >
                  <br />
                  <span
                    class="q-pl-md text-h6"
                    v-if="!$store.state.tokens.historicalPrice && marketData"
                    :class="marketData.color"
                    >{{ marketData.change_24h }}</span
                  >
                </h3>

              </div>

              <p class="text-body1" v-if="fundRefData && fundRefData.staiderData && fundRefData.staiderData.calculations">
                Asset under management: <span class="text-bold text-green-6 text-body1" v-if="fundRefData.staiderData.calculations &&
                      Object.keys(fundRefData.staiderData.calculations)
                        .length > 0">
                    {{
                      formatNumber(
                        fundRefData.staiderData.calculations[
                          fundRefData.currentCurrency
                        ].gav,
                        2
                      )
                    }} {{ fundRefData.currency.toUpperCase() }}

                    </span>
                    <span v-else>0</span> <br/>
<span class="text-body2 text-grey q-mt-md"> This fund accepts deposits in {{fundRefData.staiderData.denominationAsset.symbol}} or ETH.</span>
              </p>
              <p>

              </p>
            </span>

            <div
              v-if="false"
              class="token-chart q-mt-lg"
              @mouseleave="
                $store.commit('tokens/updateState', {
                  key: 'historicalPrice',
                  value: null,
                })
              "
            >
              <!--  <q-spinner-dots color="deep-purple-12" v-if="!chartData" /> -->
              <span class="text-caption" v-if="!chartData && chartAvailable">
                Loading historical price (1 month period)</span
              >
              <span class="text-caption" v-else-if="!chartAvailable">
                Historical price not available for this token
              </span>
              <q-linear-progress
                indeterminate
                color="grey-5"
                size="xs"
                class="q-mt-sm"
                v-if="!chartData && chartAvailable"
              />

              <PriceChart
                :key="intervalHistory"
                :dataType="'price'"
                class="q-mt-md"
                :data="chartData"
                v-else-if="chartAvailable"
              />
              <PriceChart :dataType="'volume'" v-if="false" />
            </div>

            <ul class="tab-btn" v-if="false">
              <li @click="getHistoriclPrice(1)">
                <a
                  href="javascript:void(0)"
                  :class="{ 'active-tab': intervalHistory == 1 }"
                  >1D</a
                >
              </li>
              <li @click="getHistoriclPrice(7)">
                <a
                  href="javascript:void(0)"
                  :class="{ 'active-tab': intervalHistory == 7 }"
                  >1W</a
                >
              </li>
              <li @click="getHistoriclPrice(30)">
                <a
                  href="javascript:void(0)"
                  :class="{ 'active-tab': intervalHistory == 30 }"
                  >1M</a
                >
              </li>
              <li @click="getHistoriclPrice(180)">
                <a
                  href="javascript:void(0)"
                  :class="{ 'active-tab': intervalHistory == 180 }"
                  >6M</a
                >
              </li>
              <li @click="getHistoriclPrice(365)">
                <a
                  href="javascript:void(0)"
                  :class="{ 'active-tab': intervalHistory == 365 }"
                  >1Y</a
                >
              </li>
            </ul>
          </div>
          <div
            v-if="$route.params.fundID !== 'private'"
            class="right-area q-pr-lg col text-center"
          >
            <div class="bid-main">
              <div class="bid-otr flex flex-center">
                <div class="bid-inr" v-if="$store.state.currentwallet.user">
                  <p class="text heading-M">My shares</p>
                  <h3 class="price heading-h3">
                    {{ formatNumber(sharesNumber, 2) }}
                  </h3>
                  <p
                    class="text heading-M"
                    v-if="
                      fundRefData &&
                      fundRefData.staiderData &&
                      fundRefData.staiderData.calculations &&
                      fundRefData.staiderData.calculations[
                        fundRefData.currentCurrency
                      ]
                    "
                  >
                    ${{
                      formatNumber(
                        fundRefData.staiderData.calculations[
                          fundRefData.currentCurrency
                        ].price * sharesNumber,
                        2
                      )
                    }}
                  </p>
                </div>
                <div class="bid-inr bid-inr2 ">
                  <div id="clock" class="timer "  style="width:300px">

                  <div class="text-body1" v-if="whitelistStatus == 'pending' && $store.state.currentwallet.user" >
<span class="text-bold">Fetching whitelist status</span>
                   <q-linear-progress
                indeterminate
                color="grey-5"
                size="xs"
                class="q-mt-sm"

              />
               <q-linear-progress
                indeterminate
                color="grey-5"
                size="xs"
                class="q-mt-sm"

              />
               <q-linear-progress
                indeterminate
                color="grey-5"
                size="xs"
                class="q-mt-sm"

              />
              </div>
              <div class="text-body1" v-else-if="whitelistStatus == false">
              <span class="text-bold">Whitelisting required</span>
              <q-btn
                      style="width: 250px"
                      label="Submit request"
                      size="lg"
                      color="white"
                      class="q-mt-md"
                      text-color="black"
                      @click="
                        openPopup(
                            'whitelistBtn'
                        )
                      "
                    />
              </div>
                    <q-btn
                      v-if="!$store.state.currentwallet.user || whitelistStatus == 'whitelisted'"
                      style="width: 250px"
                      :label="
                        $store.state.currentwallet.user
                          ? 'Deposit'
                          : 'Connect wallet'
                      "
                      size="lg"
                      color="white"
                      text-color="black"
                      @click="
                        openPopup(
                          $store.state.currentwallet &&
                            $store.state.currentwallet.user
                            ? 'depositBtn'
                            : 'connectBtn'
                        )
                      "
                    /><br />
                    <q-btn
                      v-if="$store.state.currentwallet.user && whitelistStatus == 'whitelisted'"
                      style="width: 250px"
                      label="Withdraw"
                      @click="
                        openPopup(
                          $store.state.currentwallet &&
                            $store.state.currentwallet.user
                            ? 'withdrawBtn'
                            : 'connectBtn'
                        )
                      "
                      size="lg"
                      class="q-mt-md"
                      outline
                    />
                    <div class="hours-main main" v-if="false">
                      <p class="heading-h3 time-inr" id="hours">00</p>
                      <p class="hours-p time-text heading-M">Hours</p>
                    </div>
                    <div class="minutes-main main" v-if="false">
                      <p class="heading-h3 time-inr" id="minutes">00</p>
                      <p class="minutes-p time-text heading-M">Minutes</p>
                    </div>
                    <div class="seconds-main main" v-if="false">
                      <p class="heading-h3 time-inr" id="seconds">00</p>
                      <p class="seconds-p time-text heading-M">Seconds</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="action" v-if="false">
                <a href="" class="btn-primary-1 upload-btn heading-SB"
                  >Place a Bid</a
                >
              </div>
            </div>
          </div>
          <div
            v-else
            class="right-area q-pr-lg col text-center"
          >
            <div class="bid-main q-pa-md text-body1 text-left">
            <p class="text-bold ">About this fund:</p>
          <p class=""> The Staider Private Vault tracks the original accounts of the Founders private group that was initially among friends and Family only. The Rebalancing idea started in 2018.</p>
            </div>
          </div>
          <div class="full-width">
            <div
              class="left left2 col-md-6"
              v-if="$store.state.investment.defaultAccount && false"
            >
              <table>
                <tr>
                  <td>
                    <h3>
                      <span class="text-bold q-pr-md"> Equity</span>
                    </h3>
                    <span class="percentage percent-portfolio"
                      >{{ formatNumber(asset.percentage, 2) }}% of
                      Portfolio</span
                    >
                    <h2>
                      ${{ formatNumber(asset.usd, 18).split(".")[0]
                      }}<span>{{
                        formatNumber(asset.usd, 3).split(".")[1]
                          ? "." + formatNumber(asset.usd, 3).split(".")[1]
                          : ""
                      }}</span>
                    </h2>
                    <h4>
                      {{ formatNumber(asset.amount, 3) }}
                      {{ asset.type.toUpperCase() }}
                    </h4>
                  </td>

                  <td class="m-left q-pt-md">
                    <h5 class="text-bold">
                      Profit/Loss
                      <span><i class="far fa-question-circle"></i></span>
                    </h5>
                    <p>-</p>

                    <h5 class="text-bold">24-hour Return</h5>
                    <p v-if="asset.change24hPercentage">
                      {{ asset.change24h }}
                      <span :class="'pair q-pr-xs allocation ' + asset.color"
                        >({{ asset.change24hPercentage }})</span
                      >
                    </p>
                    <p v-else>
                      <span :class="'pair q-pr-xs allocation ' + asset.color"
                        >-</span
                      >
                    </p>
                  </td>

                  <td class="m-left q-pt-md">
                    <h5 class="text-bold">
                      Average Cost
                      <span><i class="far fa-question-circle"></i></span>
                    </h5>
                    <p>-</p>

                    <h5 class="text-bold">
                      Fees
                      <span><i class="far fa-question-circle"></i></span>
                    </h5>
                    <p>-</p>
                  </td>
                </tr>
              </table>
            </div>
            <ChartFund
              class="col-md-12"
              v-if="$route.params.fundID !== 'private' && false"
              height="300"
              chartColor="#2ec183"
              :fundID="$route.params.fundID"
            />

            <div
              class="col col-12 col-md-12 history-container"
              v-if="fundRefData"
            >
              <div class="left q-pl-lg left3">
                <table>
                  <tr>
                    <td>
                      <h5 v-if="fundRefData.staiderData">
                        Denomination asset
                      </h5>
                      <span
                        v-if="fundRefData.staiderData"
                        class="text-green-6 text-h6"
                        style="font-weight: 400"
                        ><img
                          data-v-9a54ee10=""
                          :src="
                            'https://token.enzyme.finance/' +
                            fundRefData.staiderData.denominationAsset.id
                          "
                          alt=""
                          style="width: 30px"
                        />
                        {{
                          fundRefData.staiderData.denominationAsset.symbol
                        }}</span
                      >

                    </td>

                    <td>
                      <h5>Initial investments</h5>
                      <span  @click="clickBtn('connectBtn')"  class="text-green-6 cursor-pointer" v-if="!$store.state.currentwallet.user">Connect wallet</span>
                      <span
                        v-else
                        :class="'text-green-6'"
                        style="font-weight: 400"
                        >{{!totalInvestments || !fundRefData || !fundRefData.staiderData ? '-' : fundRefData.staiderData.denominationAsset.symbol +' '+formatNumber(totalInvestments,2)}}</span
                      >

                    </td>

                    <td>
                      <h5 >APY</h5>
                        <span  @click="clickBtn('connectBtn')"  class="text-green-6 cursor-pointer" v-if="!$store.state.currentwallet.user">Connect wallet</span>
                      <span
                        v-else-if="userAPY"
                       :class="[
                          userAPY >= 0
                            ? 'text-green-6'
                            : 'text-pink-12',
                        ]"
                        style="font-weight: 400"
                      >
                        {{userAPY > 0? '+': ''}}{{formatNumber(userAPY, 2)}}%
                      </span>
                      <span v-else class="text-green-6">-</span>

                    </td>

                    <td>
                      <h5>Average Month</h5>
                      <p>
                        <span
                        :class="[
                          fundRefData.sharePriceMetrics.averageMonth[
                                fundRefData.currentCurrency
                              ].price * 100 >= 0
                            ? 'text-green-6'
                            : 'text-pink-12'
                        ]"
                          v-if="
                      fundRefData &&
                      fundRefData.staiderData && Object.keys(fundRefData.sharePriceMetrics)
                              .length > 0
                          "
                          >{{
                            formatNumber(
                              fundRefData.sharePriceMetrics.averageMonth[
                                fundRefData.currentCurrency
                              ].price * 100,
                              2
                            )
                          }}
                          %</span
                        >
                        <span v-else>N/A</span>
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="wrapper" v-if="$route.params.fundID !== 'private'">
      <div class="tabs">
        <div class="tab" @click="tab = 'assets'">
          <input
            type="radio"
            name="css-tabs"
            id="tab-0"
            checked
            class="tab-switch"
          />
          <label for="tab-0" class="tab-label text-h6"
            >Assets in Portfolio</label
          >
        </div>
        <div class="tab" @click="tab = 'trades'">
          <input
            type="radio"
            name="css-tabs"
            id="tab-1"

            class="tab-switch"
          />
          <label for="tab-1" class="tab-label text-h6">Trades</label>
        </div>
        <div class="tab" @click="tab = 'deposits'">
          <input type="radio" name="css-tabs" id="tab-2" class="tab-switch" />
          <label for="tab-2" class="tab-label text-h6">Deposits</label>
        </div>
        <div class="tab" @click="tab = 'returns'">
          <input type="radio" name="css-tabs" id="tab-3" class="tab-switch" />
          <label for="tab-3" class="tab-label text-h6">Monthly Returns</label>
        </div>
      </div>
      <div></div>

      <div v-show="tab == 'deposits'">
        <Deposits :key="$route.params.fundID" />
      </div>

      <div class="full-width" v-show="tab == 'assets'">
        <AssetsTable ref="fundData" />
      </div>
      <div class="full-width" v-show="tab == 'trades'">
        <Trades class="full-width" :key="$route.params.fundID + 'trades'" />
      </div>
      <div class="full-width" v-show="tab == 'returns'">
        <q-table
          v-if="fundRefData && fundRefData.MonthlyReturnsData"
          flat
          :dark="$store.state.settings.lightMode === 'true'"
          table-style="box-shadow: none;"
          :title="'Monthly Returns (' + currency.toUpperCase() + ')'"
          :data="fundRefData.MonthlyReturnsData"
          :columns="fundRefData.MonthlyReturnscolumns"
          row-key="year"
        />
      </div>
    </div>

    <AssetsExplorer
      v-else
      :settings="{ showAllChains: true, readOnly: true, listViewMode: 'list' }"
      ref="assetsComponent"
      @setAsset="setAsset"
    />
    <div v-if="$q.platform.is.mobile || $isbex">
      <SignleTokenDialog
        :marketData="marketData"
        :asset="asset"
        :formatNumber="formatNumber"
        :chartData="chartData"
        :chartAvailable="chartAvailable"
        :intervalHistory="intervalHistory"
        :getHistoriclPrice="getHistoriclPrice"
        :nFormatter2="nFormatter2"
        :tab.sync="tab"
        :success.sync="success"
        :error.sync="error"
        :exchangeToken="exchangeToken"
        :setAsset.sync="setAsset"
        :fromPreview.sync="fromPreview"
        :depositQuantity.sync="depositQuantity"
        :assetBalance="assetBalance"
        :destinationCoin.sync="destinationCoin"
        :destinationCoinOptions="destinationCoinOptions"
        :sendTo.sync="sendTo"
        :memo.sync="memo"
        :isTxValid="isTxValid"
        :triggerAction="triggerAction"
        :goToExchange="goToExchange"
        :spinnerVisible.sync="spinnerVisible"
        :filterDestinationCoin="filterDestinationCoin"
        :setSuccessData="setSuccessData"
        :getTxData="getTxData"
      />
    </div>
  </div>
</template>
<script>
import AssetsExplorer from '../../components/Verto/Token/AssetsExplorer'
// import Oneinch from '../../components/Verto/Exchange/Oneinch'

import Deposits from './Fund/Deposits.vue'
import Trades from './Fund/Trades.vue'
import AssetsTable from './Fund/AssetsTable.vue'
import Formatter from '@/mixins/Formatter'
// import ImportView from '../Verto/Token/ImportView.vue'
// import TokenByAccount from '../Verto/Token/TokenByAccount'
// import History from '../../components/Verto/History'
// import SendComponent from '../../pages/Verto/Send'
import PriceChart from '../../components/Verto/Token/PriceChart'
import DexInteraction from '../../mixins/DexInteraction'
// import AccountSelector from '../Verto/Exchange/AccountSelector.vue'
// import AssetBalancesTable from '../../components/Verto/AssetBalancesTable'
// import liquidityPoolsTable from '../../components/Verto/Defi/LiquidityPoolsTable'
// import { JsonRpc } from 'eosjs'
import ChartFund from './Fund/ChartFund'
import SignleTokenDialog from '../Verto/MobileUI/SingleTokenDialog.vue'

// import Godex from './Exchange/Godex.vue'
import Lib from '@/util/walletlib'
import Enzyme from '../../util/Staider/Enzyme'
export default {
  components: {
    // TokenByAccount,
    Deposits,
    Trades,
    ChartFund,
    AssetsTable,
    // Oneinch,
    //   AccountSelector,
    //  ImportView,
    AssetsExplorer,
    // AssetBalancesTable,
    // History,
    PriceChart,

    // liquidityPoolsTable,
    // SendComponent,
    SignleTokenDialog
    // Godex
  },
  watch: {
    $route: function () {
      if (this.$route.params.asset) {
        this.setAsset(this.$route.params.asset)
      }
    },
    '$store.state.currentwallet.user': async function (val) {
      if (val && this.$route.params.fundID !== 'private') {
        this.getInvestments()
        this.getUserAPY()
        this.sharesNumber = await Enzyme.getUserShares(
          this.$route.params.fundID,
          this.$store.state.currentwallet.user.address
        )
        this.whitelistStatus = await Enzyme.isInvestor(this.$route.params.fundID,
          this.$store.state.currentwallet.user.address
        )
      }
    },
    /*  'fundRefData.MonthlyReturnsData': {
      handler: (newProp, oldProp) => {
        if (newProp) {
          console.log(newProp, 'newProp', this.fundRefData)
        }
      },
      deep: true,
      immediate: false
    }, */
    '$store.state.investment.accountTokens': function () {
      this.setPaymentOptions()
    },
    asset () {
      if (this.asset) {
        this.$route.params.asset = this.asset
        this.$store.state.wallets.customTotal.usd = this.asset.usd
        this.$store.state.wallets.customTotal.show = true
        this.$store.state.wallets.customTotal.label =
          this.asset.type.toUpperCase() + ' balance'
      }
    } /*
    '$store.state.currentwallet.wallet': function (val) {
      let assets = this.initAssetTable()
      if (val.chain !== this.asset.chain) {
        this.$emit('setAsset', null)
        return
      }
      let item = assets.find(
        (o) => o.chain === this.asset.chain && o.type === this.asset.type
      )
      if (item) {
        this.asset = item
      } else {
        this.asset.usd = 0
        this.asset.amount = 0
      }
    } */
  },
  computed: {
    fundRefData () {
      return this.$store.state.investment.fundData ? this.$store.state.investment.fundData[this.$route.params.fundID] : null
    },
    isTxValid () {
      let valid = false

      if (this.tab === 'send') {
        valid =
          this.sendTo.trim().length !== 0 &&
          parseFloat(this.depositQuantity) !== 0 &&
          parseFloat(this.assetBalance) !== 0
      } else if (
        this.tab === 'sell' ||
        this.tab === 'buy' ||
        this.tab === 'add liquidity'
      ) {
        valid = true
      }
      return valid
    }

  },
  async created () {
    // this.setAssetData()

    if (this.$route.params.fundID === 'private') {
      this.fundData = {
        icon: 'https://verto.volentix.io/statics/img/staider-logo.png',
        name: 'Staider Private vault',
        id: this.$route.params.fundID,
        investors: 108
      }
      Lib.setDemoMode()
    } else if (this.$store.state.currentwallet.user) {
      this.sharesNumber = await Enzyme.getUserShares(
        this.$route.params.fundID,
        this.$store.state.currentwallet.user.address
      )
      this.getInvestments()
      this.getUserAPY()
      this.whitelistStatus = await Enzyme.isInvestor(this.$route.params.fundID,
        this.$store.state.currentwallet.user.address
      )
    }
  },
  methods: {
    setAsset () {

    },
    async getUserAPY () {
      if (this.userAPY) return
      let data = (await Enzyme.getUserInvestments(this.$store.state.currentwallet.user.address))
      if (data && data.funds) {
        let fund = data.funds.find(a => a.address.toLowerCase() === this.$route.params.fundID.toLowerCase())
        if (fund) {
          this.userAPY = fund.performance['1y'].USD.price * 100
        }
      }
    },
    async getInvestments () {
      if (!this.$store.state.currentwallet.user || this.totalInvestments) return

      let deposits = await Enzyme.getDeposits(this.$route.params.fundID)
      deposits = deposits.filter(o => (o.investor.id.toLowerCase() === this.$store.state.currentwallet.user.address.toLowerCase()) && ['SharesBoughtEvent', 'SharesRedeemedEvent'].includes(o.__typename))

      let totalDeposits = deposits.filter(o => ['SharesBoughtEvent'].includes(o.__typename)).reduce((a, b) => a + (b ? parseFloat(b.investmentAmount) : 0), 0)
      let totalWithdrawals = deposits.filter(o => ['SharesRedeemedEvent'].includes(o.__typename)).reduce((a, b) => a + (b ? parseFloat(b.payoutAssetAmounts[0].amount) : 0), 0)
      this.totalInvestments = totalDeposits - totalWithdrawals
    },
    openPopup (id) {
      document.getElementById(id).click()
    }

  },
  destroyed () {
    this.$store.state.wallets.customTotal.show = false
    if (this.$store.state.investment.fundData && this.$store.state.investment.fundData[this.$route.params.fundID]) {
      this.$store.state.investment.fundData[this.$route.params.fundID] = null
    }
  },
  data () {
    return {
      totalInvestments: null,
      userTotalInvestment: null,
      fundData: {
        icon: '/statics/img/staider-logo.png',
        name: 'Staider Private vault',
        id: this.$route.params.fundID,
        investors: 108
      },
      userAPY: null,
      whitelistStatus: 'pending',
      currency: 'usd',
      tab: 'assets',
      marketData: null,
      isValuable: true,
      asset: {},
      fromPreview: false,
      assetBalance: null,
      sharesNumber: 0,
      chartAvailable: true,
      refresh: 0,
      chartData: false,
      pairData: false,
      tokenTabOption: 'history',
      depositCoinUnfilter: [],
      destinationCoinOptions: [],
      paymentOption: null,
      intervalHistory: 30,
      sendTo: '',
      pairs: [],
      extrasInfos: false,
      success: false,
      spinnerVisible: false,
      memo: '',
      error: false,
      dex: null,
      paymentOptions: [],
      depositQuantity: 0,
      destinationQuantity: 'Click the Buy button',
      depositCoin: null,
      destinationCoin: {
        label: 'ETH',
        value: 'eth',
        image:
          'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png'
      }
    }
  },
  props: ['assetData'],
  mixins: [Formatter, DexInteraction]
}
</script>
<style lang="scss" scoped>
.aum {
    display: block;
    font-size: 15px;
}
.tabs {
  position: relative;
  margin: 3rem 0;
}
.tabs::before,
.tabs::after {
  content: "";
  display: table;
}
.tabs::after {
  clear: both;
}
.tab {
  float: left;
}
.tab-switch {
  display: none;
}
.tab-label {
  position: relative;
  display: block;
  line-height: 2.75em;
  height: 3em;
  padding: 0 1.618em;
  background: #1e2935;
  border-right: 0.125rem solid #000000;
  color: #fff;
  cursor: pointer;
  top: -5px;
  transition: all 0.25s;
}
.tab-label:hover {
  top: -0.25rem;
  transition: top 0.25s;
}
.tab-content {
  position: absolute;
  z-index: 1;
  top: 2.75em;
  left: 0;

  background: #a0d4ec;
  color: #2c3e50;
  border-bottom: 0.25rem solid #bdc3c7;
  opacity: 0;
  padding-right: 0px;
  padding-left: 0px;
  transition: all 0.35s;
}
.tab-switch:checked + .tab-label {
  background: #a0d4ec;
  color: #2c3e50;
  border-bottom: 0;
  border-right: 0.125rem solid #fff0;
  transition: all 0.35s;
  z-index: 1;
  top: -10px;
}
.tab-switch:checked + label + .tab-content {
  z-index: 2;
  opacity: 1;
  transition: all 0.35s;
}
.set-max {
  margin-top: -10px;
  font-size: 12px;
}
.from-input {
  margin-bottom: 15px !important;
}
/deep/.q-table__top {
  display: none;
}
/deep/ .gasSelector * {
  font-size: 11px;
}
.wrapper {
  background: #fff;
  // min-height: 78vh;
}
.left.left2 {
  margin-top: 0px;
}
.destination {
  display: contents;
}

.showhistory /deep/ .col.col-6.flex.justify-end {
  display: none;
}

.showhistory /deep/ .row.items-center .col.col-6 {
  width: 100%;
}

.showhistory /deep/ .row.items-center .col.col-3.flex.justify-end,
.showhistory /deep/ .row.items-center .col.q-pl-xl:nth-child(1) {
  display: none;
}

.showhistory /deep/ .col.q-mr-xl.q-pl-xl:nth-child(1) {
  display: none;
}
.showhistory /deep/ .col.col-4.q-pl-xl.flex.items-center {
  padding-left: 0 !important;
  padding-top: 10px;
}
.showhistory /deep/ .history-item-wrapper {
  padding-top: 10px !important;
}
.showhistory /deep/ .col.col-4.q-pl-xl:nth-child(1) .text-grey {
  display: none;
}
.showhistory /deep/ .col.col-4.q-pl-xl.flex.items-center {
  width: 100%;
}
.showhistory /deep/ .txLabel {
  display: none;
}
.showhistory /deep/ .col.col-9 {
  width: 100%;
}

.active-card {
  opacity: 1;
  display: block;
}

.inactive-card {
  display: none;
  transition: opacity 1s ease-out;
  opacity: 0;
}
.cropped {
  height: 195px !important;
}

.token-chart /deep/ canvas {
  height: 200px !important;
  margin-top: -100px;
}
.showhistory {
  display: block;
  width: 100%;
  height: 100%;
  z-index: 9999;
}
.wrapper {
  background: #fff;
  padding-bottom: 1vh;
}

.wrapper .left-area {
  background: #fff;
  // float: left;
}

.left {
  background: #fff;
}

.left span img {
  vertical-align: middle;
  margin-right: 5px;
}

.left ul.icon-ul {
  position: absolute;
  margin-left: auto;
  display: inline-block;
  right: 33.5%;
}

.left ul.icon-ul li {
  display: inline-block;
}

.left ul.icon-ul li i {
  font-size: 19px;
  color: #000;
  line-height: 170%;
  padding-left: 8px;
}

.left ul.icon-ul li a {
  background: transparent;
  width: 33px;
  height: 33px;
  border-radius: 50%;
  border: 1px solid #c7c7c9;
  display: inline-block;
  margin-right: 10px;
}

.left ul.tab-btn {
  margin-top: 30px;
}

.left ul.tab-btn li {
  display: inline-block;
}

.left ul.tab-btn li a {
  font-size: 12px;
  line-height: 0px;
  font-weight: 500;
  border-radius: 25px;
  background: #f8f8f8;
  padding: 10px 15px 10px;
  color: #8a8a8f;
  height: 20px;
  display: inline-block;
  margin-right: 13px;
  text-decoration: none;
}

.left ul.tab-btn li .active-tab {
  background: #7272fa;
  color: #fff;
}

.left h2 {
  font-size: 35px;
  line-height: 45px;
  font-weight: 600;
  letter-spacing: normal;
  color: #000;
  margin-top: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.left h3 {
  font-size: 35px;
  line-height: 45px;
  font-weight: 500;
  letter-spacing: normal;
  color: #000;
  margin-top: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.left table h3 {
  font-size: 20px;
  line-height: 24px;
  font-weight: 500;
  letter-spacing: normal;
  color: #000;
  margin-bottom: 10px;
}

.left table h3 span.percentage {
  font-size: 14px;
  line-height: 12px;
  font-weight: 500;
  color: #000;
  padding: 6px;
  border-radius: 3px;
  background: transparent;
  opacity: 0.8;
}

.left2 {
  border: 1px solid #e8e8e8;
  border-radius: 17px;
  padding: 0px 10px 0;
  margin: 0 20px;
  margin-bottom: 20px;
}

.left table h2 {
  font-size: 28px;
  line-height: 32px;
  font-weight: 500;
  letter-spacing: normal;
  color: #000;
  margin-top: 5px;
  margin-bottom: 5px;
}

.left table h2 span {
  font-size: 28px;
  line-height: 32px;
  font-weight: 500;
  color: #363636;
}

.left table h4 {
  color: #737379;
  margin-top: 4px;
  margin-bottom: 42px;
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
  margin-bottom: 0px;
}

.left table h5 {
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: #000;
  margin: 0px;
}

.left table h5 i {
  color: #ceced1;
  margin-left: 5px;
}

.left table p {
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
  color: #000;
  margin: 5px 0 15px;
}

.left td > span {
  margin: 8px 0 25px;
  display: block;
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
}
.percent-portfolio {
  margin: -2px 0 10px;
}

.left table {
  width: 100%;
}

.left tr td {
  width: 37.33%;
}

.m-left {
  padding-left: 4%;
}

.left3 tr td {
  width: 25%;
}

.left3 h3 {
  font-size: 20px;
  line-height: 24px;
  font-weight: 500;
  color: #000;
  margin-bottom: 10px;
}

.left3 a {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #000;
  border-radius: 10000px;
  padding: 3px 11px 3px 7px;
  border: 1px solid #e8e8e9;
  margin-bottom: 40px;
  display: inline-block;
}

.left3 a span {
  font-size: 18px;
  font-weight: 700;
  color: #2962ef;
  margin-right: 5px;
}

.left3 table p {
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  color: #000;
  margin: 8px 0 15px;
}

.left4 {
  border-top: 1px solid #f5f3f5;
}

.left4 tr td {
  width: 50%;
}

.left4 h3 {
  font-size: 20px;
  line-height: 24px;
  font-weight: 500;
  color: #000;
  margin-bottom: 40px;
}

.left4 h6 {
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  color: #000;
}

.left4 table p {
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  color: #8a8a8f;
}

.t-right {
  text-align: right;
}

.left4 table td {
  padding-bottom: 10px;
}

.view {
  text-align: center;
}
.left4 a {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #000;
  border-radius: 10000px;
  padding: 13px 50px;
  border: 1px solid #e8e8e9;
  margin-bottom: 40px;
  display: inline-block;
  transition: all 0.3s ease;
}

.left ul.icon-ul a:hover,
.left3 a:hover,
.left4 a:hover {
  color: #000;
  background: #e8e8e9;
}

.wrapper .right-area {
  background: #fff;
  // float: left;
}
.history-container {
  background: #0a1830;
  padding-top: 15px;
  border-radius: 20px;
  h3 {
    font-size: 20px;
    line-height: 32px;
    font-weight: 500;
    letter-spacing: normal;
    color: #000;
    margin-top: 0px;
  }
}
/deep/ .history-component {
  height: auto !important;
  padding-left: 8px;
  padding-right: 8px;
  .transaction-wrapper {
    height: auto !important;
    .transaction-wrapper--list.open {
      height: auto !important;
      .q-scrollarea {
        height: auto !important;
        .scroll.relative-position {
          height: auto !important;
          overflow: visible;
          .absolute.full-width {
            position: relative;
          }
        }
      }
    }
  }
}

.right {
  background: #fff;
  border: 1px solid #e9e9ea;
  border-radius: 12px;
  margin-top: 8px;

  box-shadow: 0 4px 16px rgba(24, 52, 123, 0.1);
}
.right ul {
  border-bottom: 1px solid #efefef;
}

.right ul li {
  display: inline-block;
  width: 48%;
  text-align: center;
}

.right ul li a {
  text-decoration: none;
  background: transparent;
  color: #000;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  padding: 14px;
  text-align: center;
  display: inline-block;
}

.active-b a {
  color: #2962ef !important;
}

.active-b {
  border-bottom: 2px solid #2962ef;
}

.right form .input-bg {
  padding: 8px 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: #f3f3f4;
  color: #737379;
  margin: 15px 0;
  position: relative;
}

.right form label p {
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
}

.right form input {
  background: transparent;
  border: none;
  font-size: inherit;
  font-weight: 600;
  color: #000;
  margin-top: 10px;
}

::placeholder {
  color: #737379;
  opacity: 1;
}

.half {
  width: 60%;
}

.select-op {
  font-size: 16px;
  font-weight: 500;
}

.select-op select {
  color: #000;
  font-size: 16px;
  font-weight: 600;
  width: 27%;
  position: absolute;
  right: 5px;
  top: 34px;
  font-size: 16px;
  font-weight: 500;
  background: transparent;
  border: none;
  line-height: 20px;
}

.select-eth {
  font-size: 16px;
  font-weight: 500;
  position: absolute;
  right: 5px;
  top: 34px;
  line-height: 20px;
}

.buy {
  text-align: center;
  background: transparent;
}

.buy a {
  display: block;
  font-size: 15px;
  line-height: 20px;
  font-weight: 500;
  color: #fff;
  background: #7272fa;
  border-radius: 10000px;
  padding: 13px 50px;
  border: 1px solid #e8e8e9;

  text-align: center;
  transition: all 0.3s ease;
  text-decoration: none;
  text-transform: capitalize !important;
  background: transparent !important;
  border: 1px solid rgba(0, 0, 0, 0.7);
  font-size: 16px !important;
  color: #000 !important;
  border-radius: 40px;
  font-weight: 700;
  min-height: 20px;
  margin-bottom: 5px;
  min-width: fit-content;
}

.buy a:hover {
  color: #000;
  background: #e8e8e9;
}

@media screen and (min-width: 768px) and (max-width: 1199px) {
  .wrapper {
    width: 93.15%;
    background: #fff;
    margin: 0 15px;
  }
  .left {
    padding: 20px 0;
  }

  .right {
    padding: 20px 15px;
  }

  .m-left {
    padding-left: 4%;
  }

  .left table h2 {
    font-size: 26px;
    margin-top: 19px;
  }

  .right {
    margin-left: 15px;
  }

  .select-op select {
    width: 42%;
    font-size: 16px;
  }
}
.wrapper .row {
  max-width: 1100px;
  margin: 0 auto;
}
@media screen and (max-width: 767px) {
  .wrapper {
    width: 100%;
    background: #fff;
    margin: 0 0%;
  }

  .wrapper .left-area {
    width: 100%;
    float: none;
  }

  .wrapper .right-area {
    width: 100%;
    float: none;
  }

  .left ul.icon-ul {
    right: 8px;
  }

  .left2 {
    padding: 15px;
    margin: 15px;
  }

  .left tr td {
    width: 100%;
    display: block;
    margin-bottom: 20px;
  }

  .m-left {
    padding-left: 0;
  }

  .left4 table td {
    padding-bottom: 30px;
    width: 50% !important;
    display: table-cell !important;
  }

  .right {
    margin: 15px;
  }
}
.token-chart {
  position: relative;
  &:before {
    content: "";
    width: 30px;
    height: 100%;
    position: absolute;
    right: 0px;
    top: 0px;
    z-index: 9;
    background-color: #fff;
  }
}
.dark-theme {
  .left table h4 {
    color: rgb(221, 221, 221);
  }
  .buy a {
    border: 1px solid rgba(204, 204, 204, 0.7);
    color: #fff !important;
  }
  .left table h3 span.percentage {
    color: #fff;
  }
  .left table h2 span {
    color: rgb(240, 240, 240);
  }
  .g-txt {
    color: rgb(240, 240, 240);
  }
  .left h3 {
    color: #fff;
  }
  .history-container {
    h3 {
      font-size: 28px;
      line-height: 32px;
      font-weight: 500;
      letter-spacing: normal;
      color: #fff;
      margin-top: 0px;
    }
  }
  /deep/ .history-component {
    height: auto !important;
    padding-left: 8px;
    padding-right: 8px;
    .transaction-wrapper {
      height: auto !important;
      .transaction-wrapper--list.open {
        height: auto !important;
        .q-scrollarea {
          height: auto !important;
          .scroll.relative-position {
            height: auto !important;
            overflow: visible;
            .absolute.full-width {
              position: relative;
            }
          }
        }
      }
    }
  }
  .showhistory {
    border: 1px solid #627797 !important;
    border-radius: 10px !important;
    margin-top: 10px;
    overflow: hidden;
  }
  .wrapper {
    background-color: #04111f;
    // border: 1px solid #627797;
    .left2 {
      border: 1px solid #627797;
    }
    .left ul.tab-btn li a {
    }
    .left-area,
    .right-area,
    .left,
    .text-body2,
    .right.active-card {
      background: transparent !important;
    }
    .left {
      .token-chart {
        position: relative;
        &:before {
          content: "";
          width: 30px;
          height: 100%;
          position: absolute;
          right: 0px;
          top: 0px;
          z-index: 9;
          background-color: #04111f;
        }
      }
    }
    /deep/ .q-dark {
      background-color: #04111f !important;
    }
    color: #fff;
    .left table h3,
    .left table h5,
    .left table p,
    .left h2,
    .main h6,
    .main h2 {
      color: #fff;
    }
  }
}
.g-txt {
  color: #363636;
  margin-left: -1px;
}
/deep/ .q-card__section--vert {
  padding: 0px !important;
}
/deep/ .q-scrollarea {
  height: 100vh !important;
  @media screen and (min-height: 700px) {
    height: 79.7vh !important;
  }
  @media screen and (min-height: 760px) {
    height: 79.7vh !important;
  }
  @media screen and (min-height: 800px) {
    height: 77.7vh !important;
  }
  @media screen and (min-height: 870px) {
    height: 76.7vh !important;
  }
}
/deep/ .tokenbyaccount .q-item__label--header {
  font-size: 20px;
  line-height: 24px;
  font-weight: 500;
  margin-bottom: 10px;
}
.dark-theme /deep/ .tokenbyaccount .q-item__label--header {
  color: #fff;
}

.bid-main h3,
.bid-main h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
}
.bid-main h3 {
  font-size: calc(1.3rem + 0.6vw);
}
@media (min-width: 1200px) {
  .bid-main h3 {
    font-size: 1.75rem;
  }
}
.bid-main h4 {
  font-size: calc(1.275rem + 0.3vw);
}
@media (min-width: 1200px) {
  .bid-main h4 {
    font-size: 1.5rem;
  }
}
.bid-main p {
  margin-top: 0;
  margin-bottom: 1rem;
}
.bid-main a {
  color: #0d6efd;
  text-decoration: underline;
}
.bid-main a:hover {
  color: #0a58ca;
}
::-moz-focus-inner {
  padding: 0;
  border-style: none;
}

.heading {
  color: #ffffff;
}
.bid-main {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
}
@media (max-width: 575px) {
  .bid-main {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
  }
}
.bid-main .heading {
  color: #ffffff;
}
.bid-main .bid-otr {
  display: flex;
  align-items: center;
  margin: 24px 0 36px 0;
}
@media (min-width: 992px) and (max-width: 1199px) {
  .bid-main .bid-otr {
    flex-direction: column;
    align-items: flex-start;
  }
}
@media (max-width: 575px) {
  .bid-main .bid-otr {
    flex-direction: column;
    align-items: flex-start;
  }
}
.bid-main .bid-otr .bid-inr {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px 24px;
}
@media (min-width: 992px) and (max-width: 1199px) {
  .bid-main .bid-otr .bid-inr {
    width: 100%;
  }
}
@media (max-width: 575px) {
  .bid-main .bid-otr .bid-inr {
    width: 100%;
  }
}
.bid-main .bid-otr .bid-inr:not(:last-child) {
  margin: 0 24px 0 0;
}
@media (min-width: 992px) and (max-width: 1199px) {
  .bid-main .bid-otr .bid-inr:not(:last-child) {
    margin: 0 0 24px 0;
  }
}
@media (max-width: 575px) {
  .bid-main .bid-otr .bid-inr:not(:last-child) {
    margin: 0 0 24px 0;
  }
}
.bid-main .bid-otr .bid-inr .text {
  color: #b7b7b7;
}
.bid-main .bid-otr .bid-inr .price {
  color: #ffffff;
  margin: 6px 0;
}
.bid-main .bid-otr .bid-inr2 .timer {
  align-items: center;
  margin: 6px 0 0 0;
}
.bid-main .bid-otr .bid-inr2 .timer .main:not(:last-child) {
  margin: 0 24px 0 0;
}
.bid-main .bid-otr .bid-inr2 .timer .main .time-inr {
  color: #ffffff;
  margin: 0 0 6px 0;
}
.bid-main .bid-otr .bid-inr2 .timer .main .time-text {
  color: #b7b7b7;
}
@media (max-width: 420px) {
  .bid-main .bid-otr .bid-inr2 .timer .main .time-text {
    font-size: 16px;
    line-height: 28px;
    font-family: "Poppins-Regular";
  }
}
.bid-main .action {
  text-align: center;
}

.bid-main a {
  display: block;
  text-decoration: none;
}
.bid-main a:hover {
  text-decoration: none;
}
.bid-main h3,
.bid-main h4 {
  margin: 0px;
  padding: 0px;
}
.heading-h3 {
  font-size: 32px;
  line-height: 48px;
  font-family: "Montserrat-Bold";
}
@media (max-width: 575px) {
  .heading-h3 {
    font-size: 24px;
    line-height: 40px;
  }
}
.heading-h4 {
  font-size: 24px;
  line-height: 40px;
  font-family: "Montserrat-Bold";
}
@media (max-width: 575px) {
  .heading-h4 {
    font-size: 20px;
    line-height: 36px;
  }
}
.heading-M {
  font-size: 18px;
  line-height: 32px;
  font-family: "Poppins-Medium";
}
.heading-SB {
  font-size: 16px;
  line-height: 28px;
  font-family: "Poppins-Medium";
}
.btn-primary-1 {
  padding: 13px 24px 13px 24px;
  border-radius: 12px;
  background-color: #019dea;
  color: #ffffff;
  text-transform: capitalize;
  font-family: "Poppins-Medium";
  border: 1px solid transparent;
  transition: 0.2s;
}
.btn-primary-1:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid #019dea;
  color: #ffffff;
}
span.totalLabel {
    font-size: 17px;
    display: block;
    color: #009dea;
}
.fundDetails {
margin-block-end: 0em;
}

/deep/ .q-virtual-scroll__content /deep/ .q-item__label {
    color: white !important
}
</style>

<template>
<div>
  <div
    :class="{ 'dark-theme': $store.state.settings.lightMode === 'true' }"
    class="wrapper q-pr-md"
    v-if="asset.type && !($q.platform.is.mobile||$isbex)"
  >
    <q-scroll-area :visible="true" :dark="$store.state.settings.lightMode === 'true'" style="margin-left: 15px; height: 77vh;">
      <div class="row" >
        <div class="left-area col-md-8">
          <div class="left q-ml-md q-py-md">

            <span class="z-max">
             <div class="text-h6 text-bold">
              {{marketData && marketData.tokenName ? marketData && marketData.tokenName:  asset.type.toUpperCase()}}

                <q-btn-dropdown class="float-right q-pr-lg" dense flat color="primary" icon="more_horiz" label="Options">
      <q-list>
        <q-item clickable v-close-popup >
          <q-item-section>
            <q-item-label @click="markAsNotValuable()" v-if="isValuable">Mark as not valuable</q-item-label>
             <q-item-label @click="markAsValuable()" v-else>Mark as valuable</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="asset.coinGeckoId" @click.native="goToLink('https://www.coingecko.com/en/search_redirect?id='+asset.coinGeckoId+'&type=coin')" clickable v-close-popup >
          <q-item-section>
            <q-item-label>Check in Coingecko</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-btn-dropdown>
              </div>
              <div class="row q-pb-xl flex items-center">

                <h2>

                  <img v-if="asset.icon" onerror="this.src='https://etherscan.io/images/main/empty-token.png';" :src="asset.icon" style="max-width: 40px" alt="image" />
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
                <h3   class="q-pl-lg q-pr-md">

                 <span class="historicalPrice"> ${{ $store.state.tokens.historicalPrice ? formatNumber($store.state.tokens.historicalPrice,18).split(".")[0] : formatNumber(asset.rateUsd, 18).split(".")[0]
                  }} </span><span
                  class="g-txt"
                    style="
                      font-size: 35px;
                      line-height: 45px;
                      font-weight: 600;
                      letter-spacing: normal;
                    "
                    >.{{ $store.state.tokens.historicalPrice ? formatNumber($store.state.tokens.historicalPrice, 3, false, true).split(".")[1] : formatNumber(asset.rateUsd, 3 , false, true).split(".")[1] }}</span
                  >
                  <span class="q-pl-md text-h6" v-if="!$store.state.tokens.historicalPrice && marketData" :class="marketData.color">{{
                    marketData.change_24h
                  }}</span>
                </h3>
              </div>
            </span>

            <div class="token-chart q-mt-lg" @mouseleave="$store.commit('tokens/updateState', { key: 'historicalPrice', value: null })">
              <!--  <q-spinner-dots color="deep-purple-12" v-if="!chartData" /> -->
              <span class="text-caption" v-if="!chartData && chartAvailable">
                Loading historical price (1 month period)</span
              >
              <span class="text-caption" v-else-if="!chartAvailable">
                Historical price not available for this token </span
              >
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

            <ul class="tab-btn" >
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
           <div class="left left2"  v-if="$store.state.investment.defaultAccount">
            <table>
              <tr>
                <td>
                  <h3>
                    <span class="text-bold q-pr-md"> Equity</span>

                  </h3>
                  <span class="percentage percent-portfolio"
                      >{{ formatNumber(asset.percentage, 2) }}% of Portfolio</span
                    >
                  <h2>
                    ${{ formatNumber(asset.usd, 18).split(".")[0]}}<span>{{
                      formatNumber(asset.usd, 3).split(".")[1] ? '.'+formatNumber(asset.usd, 3).split(".")[1] : ''
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
             <div
          class="col col-12 history-container"

        >

         <div class="left q-pl-lg left3" v-if="marketData">
            <h3 class="text-body text-bold">Stats</h3>

            <table>
              <tr>
                <td>
                  <h5>1 Day</h5>
                  <span :class="[marketData.change_24h && marketData.change_24h.substr(0,1) == '+' ? 'text-green-6' : 'text-pink-12']" style="font-weight: 400">{{marketData.change_24h}}%</span>
                  <h5>Market Cap</h5>
                  <p>${{nFormatter2(marketData.market_cap)}}</p>
                </td>

                <td>
                  <h5>1 Week</h5>
                  <span :class="[marketData.change_7d && marketData.change_7d.substr(0,1) == '+' ? 'text-green-6' : 'text-pink-12']" style="font-weight: 400">{{marketData.change_7d}}%</span>
                  <h5>High 24h</h5>
                  <p>{{marketData.high_24h}}</p>
                </td>

                <td>
                  <h5>1 Month</h5>
                  <span :class="[marketData.change_30d && marketData.change_30d.substr(0,1) == '+' ? 'text-green-6' : 'text-pink-12']" style="font-weight: 400">{{marketData.change_30d}}%</span>
                  <h5>Total Supply</h5>
                  <p>{{marketData.total_supply}}</p>
                </td>

                <td>
                  <h5>1 Year</h5>
                  <span :class="[marketData.change_1y && marketData.change_1y.substr(0,1) == '+' ? 'text-green-6' : 'text-pink-12']" style="font-weight: 400"
                    >{{marketData.change_1y}}</span
                  >
                  <h5>Total volume</h5>
                  <p>{{marketData.total_volume}}</p>
                </td>
              </tr>
            </table>
          </div>

        </div>

          <div class="left left3" style="border: none" v-if="false">
            <h3>Tags</h3>

            <a href="#"><span>#</span>Token</a>
          </div>

          <div class="left left4" v-if="false">
            <h3>History</h3>

            <table>
              <tr>
                <td>
                  <h6>Send at $1,751.81</h6>
                  <p>Mar 12, 2021, 09:56 AM</p>
                </td>

                <td class="t-right">
                  <h6>-1 eth</h6>
                  <p>$1751.81</p>
                </td>
              </tr>

              <tr>
                <td>
                  <h6>Send at $1,735.98</h6>
                  <p>Mar 12, 2021, 09:56 AM</p>
                </td>

                <td class="t-right">
                  <h6>-0.299 eth</h6>
                  <p>$520.79</p>
                </td>
              </tr>

              <tr>
                <td>
                  <h6>Send at $1,751.81</h6>
                  <p>Mar 12, 2021, 09:56 AM</p>
                </td>

                <td class="t-right">
                  <h6>-0.275 eth</h6>
                  <p>$1751.81</p>
                </td>
              </tr>

              <tr>
                <td>
                  <h6>Send at $1,735.98</h6>
                  <p>Mar 12, 2021, 09:56 AM</p>
                </td>

                <td class="t-right">
                  <h6>-0.275 eth</h6>
                  <p>$520.79</p>
                </td>
              </tr>

              <tr>
                <td>
                  <h6>Send at $1,735.98</h6>
                  <p>Mar 12, 2021, 09:56 AM</p>
                </td>

                <td class="t-right">
                  <h6>-0.389 eth</h6>
                  <p>$520.79</p>
                </td>
              </tr>
            </table>

            <div class="view">
              <a href="#">View more transactions</a>
            </div>
          </div>
        </div>

        <div class="right-area q-pr-lg col" >
          <transition name="fade" mode="out-in">
            <div
              class="right"
              :class="{
                'active-card': !extrasInfos,
                'inactive-card': extrasInfos,
              }"
            >
              <ul v-if="false">
                <li @click="tab = 'buy'" :class="{ 'active-b': tab == 'buy' }">
                  <a href="javascript:void(0)">sell</a>
                </li>
                <li
                  @click="tab = 'sell'"
                  :class="{ 'active-b': tab == 'sell' }"
                >
                  <a href="javascript:void(0)">Send</a>
                </li>
              </ul>
              <q-tabs
                v-model="tab"
                @click="error = false ; success = false"
                inline-label
                mobile-arrows
                :set="show1inch = ['bsc','matic','eth'].includes(asset.chain)"
              >

               <q-tab v-if="!$store.state.wallets.portfolioTotal" name="import" label="Import" />
                <q-tab v-if="$store.state.wallets.portfolioTotal" name="send" label="Send" />
           <!--     <q-tab name="swap" v-if="asset.chain != 'eos'  && show1inch" label="Swap" />-->
                <q-tab name="buy" v-if="$store.state.wallets.portfolioTotal" @click="exchangeToken({asset:asset, action: 'buy'})"  label="Buy" />
                <q-tab v-if="$store.state.investment.defaultAccount && $store.state.investment.defaultAccount.key && $store.state.wallets.portfolioTotal" name="sell" @click="exchangeToken({asset:asset, action: 'sell'})" label="Sell" />
              </q-tabs>

              <ImportView class="q-pa-md" v-if="!$store.state.wallets.portfolioTotal" :chain="asset.chain" :key="asset.chain" />
              <div class="text-center " v-if="tab != 'import'" >
                   <AccountSelector  :withTokenBalance="asset.type" :chains="[asset.chain]"  v-show="tab != 'swap' && !fromPreview"   :key="asset.chain +'-'+asset.type" :chain="asset.chain" class="q-pt-lg" />
              </div>

              <div v-if="tab == 'send' && asset.chain != 'eos' && $store.state.investment.defaultAccount && $store.state.wallets.portfolioTotal" class="q-px-md" >
                <SendComponent @setAsset="setAsset" :token="asset.type" :miniMode="true" :key="$store.state.investment.defaultAccount.key+$store.state.investment.defaultAccount.name+$store.state.investment.defaultAccount.chain"  />
              </div>

              <div v-if="show1inch && tab == 'swap'" >
               <Oneinch :miniMode="true" :tokenType="asset.type"  :chain="asset.chain" class="oneinch-wrapper"></Oneinch>
              </div>

              <div v-else-if="tab != 'send' && tab != 'import' || (tab == 'send' && asset.chain == 'eos')" class="q-pa-md">
              <p class="q-pt-md text-purple-12" v-if="tab != 'send' && !['bsc','matic','eth','eos'].includes(asset.chain)"> Buying and selling {{asset.type.toLowerCase()}} will be available very soon</p>
              <div class="row" v-if="!fromPreview ">

                <q-input
                  :dark="$store.state.settings.lightMode === 'true'"
                  bottom-slots
                  :label="asset.type.toUpperCase() + ' amount to '+tab"
                  class="col-12 q-px-md q-pt-md q-pb-lg from-input"
                  v-show="asset.chain == 'eos'"
                  v-model="depositQuantity"
                >
                 <template v-slot:hint>
                  <q-btn class="set-max" label="Set max" @click="depositQuantity = parseFloat(assetBalance)" dense flat />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      size="1rem"
                      class="q-pl-sm"
                      :name="`img:${asset.icon}`"
                    />
                    <span
                      class="text-body2"
                      :class="{
                        'text-white':
                          $store.state.settings.lightMode === 'true',
                        'text-black':
                          $store.state.settings.lightMode === 'false',
                      }"
                      >{{ asset.type.toUpperCase() }}</span
                    >
                  </template>
                  <template v-slot:counter>
                    <span v-if="assetBalance"></span>Balance:
                    {{ formatNumber(assetBalance, 2) }}
                    {{ asset.type.toUpperCase() }}
                  </template>
                </q-input><br/>

                <q-select
                  v-if="
                    (tab == 'sell' || tab == 'buy' || tab == 'add liquidity') &&
                    destinationCoin
                  "
                  :light="$store.state.settings.lightMode === 'false'"
                  :dark="$store.state.settings.lightMode === 'true'"
                  separator
                  rounded
                  :label="tab == 'buy' ? 'Pay with' : ' You receive'"
                  outlined
                  class="select-input q-mt-md"
                  use-input
                  @input="error = false"
                  @filter="filterDestinationCoin"
                  v-model="destinationCoin"
                  :disabled="!destinationCoinOptions"
                  :loading="!destinationCoinOptions"
                  :options="
                    destinationCoinOptions.filter(
                      (o) =>
                        ['eos', 'usdt'].includes(o.value.toLowerCase()) ||
                        asset.type != 'vtx'
                    )
                  "
                >
                  <template v-slot:option="scope">
                    <q-item
                      class="custom-menu"
                      v-bind="scope.itemProps"
                      v-on="scope.itemEvents"
                    >
                      <q-item-section avatar>
                        <q-icon
                          class="option--avatar option--avatar__custom"
                          :name="`img:${scope.opt.image}`"
                        />
                      </q-item-section>
                      <q-item-section dark>
                        <q-item-label v-html="scope.opt.label" />
                        <q-item-label
                          v-if="
                            scope.opt.value.toLowerCase() !==
                            scope.opt.label.toLowerCase()
                          "
                          caption
                          >{{ scope.opt.value }}</q-item-label
                        >
                        <q-item-label v-if="scope.opt.amount" caption>{{
                          scope.opt.amount
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:selected>
                    <q-item v-if="destinationCoin">
                      <q-item-section avatar>
                        <q-icon
                          class="option--avatar option--avatar__custom"
                          :name="`img:${destinationCoin.image}`"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label v-html="destinationCoin.value" />
                      </q-item-section>
                    </q-item>
                    <q-item v-else> </q-item>
                  </template>
                </q-select>

                <q-input

                  :dark="$store.state.settings.lightMode === 'true'"
                  v-if="tab == 'send'"
                  label="To : Enter account name"
                  v-show="asset.chain == 'eos'"
                  class="col-12 q-px-md"
                  v-model="sendTo"
                >

                </q-input>
                <q-input
                  :dark="$store.state.settings.lightMode === 'true'"
                  v-if="
                    asset.chain == 'eos' &&
                    tab == 'send' &&
                    sendTo &&
                    sendTo.length
                  "
                  label="Memo (Optional)"
                  class="col-12 q-px-md"
                  v-model="memo"
                />
              </div>
              <div v-else>
                <q-item-label class="q-pt-md"> <q-btn @click="fromPreview = false; success = false" flat dense size="sm" class="q-pr-sm" icon="keyboard_backspace" label="Back" />| Transaction summary</q-item-label>
                 <q-list :dark="$store.state.settings.lightMode === 'true'" bordered separator  style="max-width: 318px" class="q-mt-md rounded-borders">
                  <q-item clickable v-ripple>
                    <q-item-section>
                      <q-item-label overline>From</q-item-label>
                      <q-item-label>{{$store.state.investment.defaultAccount.name}}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple>
                    <q-item-section>
                      <q-item-label overline>To</q-item-label>
                      <q-item-label>{{sendTo}}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple>
                    <q-item-section>
                      <q-item-label overline>Amount</q-item-label>
                      <q-item-label>{{depositQuantity}} {{asset.type.toUpperCase()}}</q-item-label>
                    </q-item-section>
                  </q-item>
                   <q-item clickable v-ripple>
                    <q-item-section>
                      <q-item-label overline>Memo</q-item-label>
                      <q-item-label caption>{{memo.trim().length ? memo : '(Empty)'}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <form action="#" method="#" v-if="tab == 'send'" >
                <transactEOS
                  :hideLabels="true"
                  :key="$store.state.investment.defaultAccount.key"
                  v-if="$store.state.investment.defaultAccount && isTxValid && fromPreview"
                  @setSuccessData="setSuccessData"
                  ref="transact"
                  class="q-pt-md"
                />

                <span
                  v-if="success && false"
                  class="cursor-pointer q-pt-sm"
                  @click="success = false"
                  >Reset</span
                >
              </form>
              <p
                class="text-red q-pt-md q-py-none q-my-none"
                v-if="error == 'unswappable' && tab == 'buy'"
              >
                Cannot swap {{ destinationCoin.value.toUpperCase() }} to
                {{ asset.type.toUpperCase() }}
              </p>
              <p
                class="text-red q-pt-md q-py-none q-my-none"
                v-else-if="error == 'unswappable'"
              >
                Cannot swap {{ asset.type.toUpperCase() }} to
                {{ destinationCoin.value.toUpperCase() }}
              </p>
              <div
               :class="{'q-pt-md' : !fromPreview}"
                class="buy text-capitalize"
                v-if="!spinnerVisible && !success && !asset.isEvm"
              >
                <a
                  href="javascript:void(0)"
                  @click="isTxValid && triggerAction()"
                  >{{ tab === 'send' ? (!fromPreview ? 'Preview' : 'Send') :tab }}</a
                >
              </div>
            </div>
            </div>
          </transition>
          <div
            class="col-12 col-md-12 row showhistory q-pt-md"
            :class="{ cropped: extrasInfos == false }"
            v-if="false"
            @mouseover="extrasInfos = true"
            @mouseleave="extrasInfos = false"
          >
            <q-tabs
              class="z-top bg-white"
              v-if="false"
              v-model="tokenTabOption"
              inline-label
              mobile-arrows
              align="left"
            >
              <q-tab
                name="history"
                label="History"
                :class="{ 'bg-grey-3': tokenTabOption == 'history' }"
              />
              <q-tab
                name="opportunities"
                label="Opportunities"
                :class="{ 'bg-grey-3': tokenTabOption == 'opportunities' }"
              />
            </q-tabs>
            <!-- <div class="text-body2 bg-grey-3 q-px-md q-pb-md q-pt-sm" >History</div> -->
            <!-- <History v-if="tokenTabOption == 'history'" :isMobile="false" /> -->
            <!-- <AssetBalancesTable v-if="tokenTabOption == 'assets'" @setAsset="setAsset" :rowsPerPage="6"/>
          <liquidityPoolsTable  v-else-if="tokenTabOption == 'opportunities'"  :asset="asset" :rowsPerPage="7"   /> -->
          </div>

          <TokenByAccount :type="asset.type" :chain="asset.chain" class="tokenbyaccount2 right-area q-mt-lg col" />
        </div>

      </div>
    </q-scroll-area>
  </div>
  <div v-if="$q.platform.is.mobile||$isbex">
    <SignleTokenDialog :marketData="marketData" :asset="asset" :formatNumber="formatNumber" :chartData="chartData" :chartAvailable="chartAvailable" :intervalHistory="intervalHistory" :getHistoriclPrice="getHistoriclPrice" :nFormatter2="nFormatter2" :tab.sync="tab" :success.sync="success" :error.sync="error" :exchangeToken="exchangeToken" :setAsset.sync="setAsset" :fromPreview.sync="fromPreview" :depositQuantity.sync="depositQuantity" :assetBalance="assetBalance" :destinationCoin.sync="destinationCoin" :destinationCoinOptions="destinationCoinOptions" :sendTo.sync="sendTo" :memo.sync="memo" :isTxValid="isTxValid" :triggerAction="triggerAction" :goToExchange="goToExchange" :spinnerVisible.sync="spinnerVisible" :filterDestinationCoin="filterDestinationCoin" :setSuccessData="setSuccessData" :getTxData="getTxData"/>
  </div>
</div>
</template>
<script>
import transactEOS from './transactEOS'
import Oneinch from '../../components/Verto/Exchange/Oneinch'
import Formatter from '@/mixins/Formatter'
import ImportView from './Token/ImportView.vue'
import TokenByAccount from './Token/TokenByAccount'
// import History from '../../components/Verto/History'
import SendComponent from '../../pages/Verto/Send'
import PriceChart from '../../components/Verto/Token/PriceChart'
import DexInteraction from '../../mixins/DexInteraction'
import AccountSelector from './Exchange/AccountSelector.vue'
// import AssetBalancesTable from '../../components/Verto/AssetBalancesTable'
// import liquidityPoolsTable from '../../components/Verto/Defi/LiquidityPoolsTable'
import { JsonRpc } from 'eosjs'
import { QScrollArea } from 'quasar'
import SignleTokenDialog from './MobileUI/SingleTokenDialog.vue'
import initWallet from '@/util/Wallets2Tokens'
// import Godex from './Exchange/Godex.vue'

export default {
  components: {
    TokenByAccount,
    Oneinch,
    AccountSelector,
    ImportView,
    // AssetBalancesTable,
    // History,
    PriceChart,
    transactEOS,
    // liquidityPoolsTable,
    SendComponent,
    QScrollArea,
    SignleTokenDialog
    // Godex
  },
  watch: {
    '$route': function () {
      if (this.$route.params.asset) { this.setAsset(this.$route.params.asset) }
    },
    '$store.state.investment.accountTokens': function () {
      this.setPaymentOptions()
    },
    asset () {
      if (this.asset) {
        this.$route.params.asset = this.asset
        this.$store.state.wallets.customTotal.usd = this.asset.usd
        this.$store.state.wallets.customTotal.show = true
        this.$store.state.wallets.customTotal.label = this.asset.type.toUpperCase() + ' balance'
      }
    }/*
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
    this.setAssetData()
    this.isTokenValuable()
  },
  methods: {
    isTokenValuable () {
      let not_valuable = localStorage.getItem('not_valuable')
      let found = -1
      if (not_valuable) {
        not_valuable = JSON.parse(not_valuable)
        console.log(not_valuable, 'not_valuable')
        found = not_valuable.findIndex(o => o.chain === this.asset.chain && o.type === this.asset.type)
      }
      if (found >= 0) {
        this.isValuable = false
      } else {
        this.isValuable = true
      }
      return found
    },
    markAsValuable () {
      let not_valuable = localStorage.getItem('not_valuable')
      if (not_valuable) {
        not_valuable = JSON.parse(not_valuable)
        let found = this.isTokenValuable()
        if (found === -1) return
        not_valuable.splice(found, 1)
        localStorage.setItem('not_valuable', JSON.stringify(not_valuable))
        this.isValuable = true
      }
      initWallet()
    },
    markAsNotValuable () {
      let not_valuable = localStorage.getItem('not_valuable')
      if (not_valuable) {
        not_valuable = JSON.parse(not_valuable)
        not_valuable.push(this.asset)
        localStorage.setItem('not_valuable', JSON.stringify(not_valuable))
      } else {
        localStorage.setItem('not_valuable', JSON.stringify([this.asset]))
      }
      this.isValuable = false
      this.asset.usd = 0
      initWallet()
    },
    setAsset (asset) {
      try {
        let data = (this.$route.params.assets || []).find(o => o.type === asset.type && o.chain === asset.chainID)

        if (data) {
          this.setAssetData(data)
        } else if (asset) {
          this.setAssetData(asset)
        }
      } catch (e) {
        console.log('e', e)
      }
    },
    async setAssetData (data) {
      let asset = data || this.assetData
      if (asset && asset.chainID) {
        asset.chain = asset.chainID
      }
      if (!asset && this.$route.params.asset) {
        this.asset = this.$route.params.asset
      } else {
        this.asset = asset
      }
      if (this.asset.type === 'vtx') {
        this.$store.state.settings.defaultChainData = this.asset
      }
      this.depositCoin = {
        label: this.asset.type.toUpperCase(),
        value: this.asset.type,
        icon: this.asset.icon
      }

      this.destinationCoinOptions = this.$store.state.settings.coins[this.asset.chain === 'eos' ? 'defibox' : 'oneinch'].filter(
        (o) =>
          ['eos', 'usdt'].includes(o.value.toLowerCase()) ||
        this.asset.type !== 'vtx'
      )

      this.destinationCoinUnfilter = this.destinationCoinOptions
      if (this.asset.chain === 'eth' || this.asset.chain === 'eos') {
        let pref = {
          eth: ['usdt', 'link'],
          eos: ['eos', 'vtx', 'uni']
        }
        if (pref[this.asset.chain]) {
          let preferredToken = pref[this.asset.chain].filter(
            (o) => o !== this.asset.type
          )[0]
          this.destinationCoin = this.destinationCoinOptions.find(
            (o) => preferredToken === o.value.toLowerCase()
          )
        }
      }
      if (this.asset.chain !== 'eos') {
        this.tab = 'send'
      } else {
        let rpc = new JsonRpc(
          process.env[this.$store.state.settings.network].CACHE +
          'https://eos.greymass.com:443'
        )
        this.pairs = (
          await rpc.get_table_rows({
            json: true,
            code: 'swap.defi',
            scope: 'swap.defi',
            table: 'pairs',
            limit: -1
          })
        ).rows
      }

      if (this.depositCoin.value === this.destinationCoin.value) {
        this.depositCoin = this.destinationCoinOptions.find(
          (o) => o.value.toLowerCase() !== this.depositCoin.value
        )
      }
      if (!this.$store.state.wallets.tokens.find(o => o.chain === this.asset.chain && o.type !== 'verto') || !this.$store.state.wallets.portfolioTotal) {
        this.tab = 'import'
      }
      this.setPaymentOptions()
      this.getHistoriclPrice()
    },
    exchangeToken (params) {
      this.$router.push({
        name: 'crosschain-exchange',
        params: params
      })
    },
    getEchangeData () {
    /*  const self = this
      let exchange = {
        eos () {
          let from = this.tab === 'buy' ? this.asset.type : this.destinationCoin.value.toLowerCase()
          let to = this.tab === 'sell' ? this.destinationCoin.value.toLowerCase() : this.asset.type
          return self.getEosPairData(
            from,
            to,
            this.pairs,
            1
          )
        }
      }
      // console.log(exchange[this.asset.chain]())
      */
    },
    getTxData () {
      let transactionObject = {
        actions: [],
        send: false
      }

      if (this.tab === 'send') {
        transactionObject.actions.push({
          account: this.asset.contract,
          name: 'transfer',
          authorization: [
            {
              actor: this.$store.state.investment.defaultAccount.name,
              permission: 'active'
            }
          ],
          data: {
            from: this.$store.state.investment.defaultAccount.name,
            to: this.sendTo.trim(),
            memo: this.memo,
            quantity:
              parseFloat(this.depositQuantity).toFixed(this.asset.precision) +
              ' ' +
              this.asset.type.toUpperCase()
          }
        })
        transactionObject.send = true
      }

      return transactionObject
    },
    getMarketData (id) {
      this.marketData = null
      this.$axios
        .get(
          process.env[this.$store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' +
          id +
          '&price_change_percentage=24h,7d,30d,200d,1y'
        ).then(res => {
          if (res && res.data && res.data[0]) {
            let data = res.data[0]
            if (!this.asset.icon) {
              this.asset.icon = data.image
            }
            if (!this.asset.rateUsd) {
              this.asset.rateUsd = data.current_price
            }
            this.marketData = {
              change_24h: this.formatNumberWithSign(data.price_change_percentage_24h, 1),
              change_30d: this.formatNumberWithSign(data.price_change_percentage_30d_in_currency, 1),
              change_7d: this.formatNumberWithSign(data.price_change_percentage_7d_in_currency, 1),
              change_1y: this.formatNumberWithSign(data.price_change_percentage_1y_in_currency, 1),
              high_24h: this.formatNumberWithSign(data.high_24h),
              total_volume: this.nFormatter2(data.total_volume),
              total_supply: this.nFormatter2(data.total_supply),
              market_cap: this.nFormatter2(data.market_cap),
              // tokenName: data.name,
              color: data.price_change_percentage_24h >= 0 ? 'text-green-6' : 'text-pink-12'
            }
          }
        })
    },
    async getHistoriclPrice (days = 30) {
      console.log('getHistoriclPrice called')
      this.chartData = false
      this.chartAvailable = true
      let id = this.asset.coinGeckoId
      try {
        if (!id) {
          let token = this.$store.state.tokens.list.find(
            (t) =>
              t.symbol.toLowerCase() === this.asset.type &&
            ((!t.platforms.hasOwnProperty('eos') &&
              !t.platforms.hasOwnProperty('ethereum')) ||
              this.asset.chain ===
                (t.platforms.hasOwnProperty('eos')
                  ? 'eos'
                  : this.asset.chain)))

          id = token ? token.id : null
          // console.log('token ', token)
        }
        if (id) {
          this.getMarketData(id)
          let response = await this.$axios.get(
            process.env[this.$store.state.settings.network].CACHE + 'https://api.coingecko.com/api/v3/coins/' +
              id +
              '/market_chart?vs_currency=usd&days=' +
              days
          )
          this.chartData = response.data
          this.intervalHistory = days

          if (response.data.prices && !this.asset.rateUsd) {
            this.asset.rateUsd =
              response.data.prices[response.data.prices.length - 1][1]
          }
        } else {
          this.chartAvailable = false
        }
      } catch (e) { console.log('e', e) }
    },
    setSuccessData (status) {
      this.success = status
      this.spinnerVisible = false
    },
    filterDestinationCoin (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.destinationCoinOptions = this.destinationCoinUnfilter.filter(
          (v) =>
            v.value.toLowerCase().indexOf(needle) > -1 ||
            v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    getBalance () {
      let item = this.paymentOptions.find(
        (o) =>
          this.$store.state.investment.defaultAccount.name && o.name.toLowerCase() ===
            this.$store.state.investment.defaultAccount.name.toLowerCase() &&
          o.type === this.asset.type
      )
      if (item) this.assetBalance = item.amount
    },
    setPaymentOptions () {
      this.paymentOptions = this.$store.state.investment.accountTokens.map(
        (o, i, all) => {
          o.label = o.type
          o.value = o.type
          o.amount = isNaN(o.amount) ? 0 : o.amount
          o.image = o.icon
          return o
        }
      )
      if (this.paymentOptions.length) {
        this.paymentOption = this.paymentOptions.find(
          (o) => o.type === this.paymentOptions[0].chain
        )
        if (
          !this.paymentOption &&
          this.paymentOptions.length === 1 &&
          this.paymentOptions[0].chain === 'eos'
        ) {
          this.paymentOption = this.paymentOptions[0]
        }
      }
      this.getBalance()
    },
    triggerAction () {
      this.error = false
      if (
        this.tab === 'sell' ||
        this.tab === 'buy' ||
        this.tab === 'add liquidity'
      ) {
        this.goToExchange()
      } else if (this.tab === 'send' && this.fromPreview) {
        this.spinnerVisible = true
        this.$refs.transact.setTxData(this.getTxData())
      } else if (this.tab === 'send' && !this.fromPreview) {
        this.fromPreview = true
      }
    },
    goToExchange () {
      if (this.tab === 'buy') {
        let temp = this.destinationCoin
        this.destinationCoin = this.depositCoin
        this.depositCoin = temp
      } else {
        this.depositCoin.fromAmount = this.depositQuantity
      }

      this.checkPair()
      if (this.dex) {
        let depositCoin = this.depositCoin
        let destinationCoin = this.destinationCoin
        this.$router.push({
          path: '/verto/exchange/:coinToSend/:coinToReceive',
          name: 'exchange-v3',
          params: {
            depositCoin: depositCoin,
            destinationCoin: destinationCoin,
            dex: this.dex,
            tab: this.tab
          }
        })
      } else {
        this.error = 'unswappable'
      }
    }
  },
  destroyed () {
    this.$store.state.wallets.customTotal.show = false
  },
  data () {
    return {
      tab: 'send',
      marketData: null,
      isValuable: true,
      asset: {},
      fromPreview: false,
      assetBalance: null,
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
        image: 'https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png'
      }
    }
  },
  props: ['assetData'],
  mixins: [Formatter, DexInteraction]
}
</script>
<style lang="scss" scoped>
 .set-max {
                margin-top: -10px;
                font-size: 12px;
                }
 .from-input {
 margin-bottom: 15px !important;
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
  opacity: .8;
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
  margin: 8px 0 35px;
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
    background-color: #FFF;
  }
}
.dark-theme {
  .left table h4{
    color: rgb(221, 221, 221);
  }
  .buy a {
    border: 1px solid rgba(204, 204, 204, 0.7);
    color: #FFF !important;
  }
  .left table h3 span.percentage {
    color: #FFF;
  }
  .left table h2 span{
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
  height: 81.6vh !important;
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
  color: #FFF;
}
</style>

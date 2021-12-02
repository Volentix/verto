<template>
    <div>
        <q-dialog
          v-model="dialog"
          persistent
          :maximized="maximizedToggle"
          transition-show="slide-up"
          transition-hide="slide-down"
        >
        <q-card :class="$store.state.settings.lightMode === 'true' ? 'text-white':'text-black'" :style="$store.state.settings.lightMode === 'true' ? 'background-color: #04111F !important;': 'background: #FFFFFF !important'">
            <q-header class="bg-white full-width header_header">
              <q-toolbar class="flex justify-between full-width" :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'bg-white text-black'">
                <q-btn flat dense label="Back" no-caps icon="arrow_back_ios" class="q-mr-sm" @click="closeDialog"/>
                <q-toolbar-title v-if="false"> Token Details </q-toolbar-title>
                <q-btn flat round dense icon="close" v-close-popup @click="closeDialog"/>
              </q-toolbar>
              <AccountSelector v-if="tab != 'import'" :withTokenBalance="asset.type" :chains="[asset.chain]"  v-show="tab != 'swap' && !fromPreview"   :key="asset.chain +'-'+asset.type" :chain="asset.chain"  />
            </q-header>
            <q-card-section class="q-mt-xl" :class="{'top-space': $store.state.wallets.portfolioTotal}">
                <q-item style="margin-left: -14px;">
                    <q-item-section side>
                      <q-avatar rounded>
                        <img v-if="asset.icon" :src="asset.icon" style="max-width: 40px" alt="icon" onerror="this.src='https://etherscan.io/images/main/empty-token.png';"/>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label class="text-h6">{{marketData && marketData.tokenName ? marketData && marketData.tokenName : asset.type.toUpperCase()}}</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                        <div class="text-bold text-h6 ">
                            ${{ $store.state.tokens.historicalPrice ? formatNumber($store.state.tokens.historicalPrice,18).split(".")[0] : formatNumber(asset.rateUsd, 18).split(".")[0]}} .{{ $store.state.tokens.historicalPrice ? formatNumber($store.state.tokens.historicalPrice, 3, false, true).split(".")[1] : formatNumber(asset.rateUsd, 3 , false, true).split(".")[1] }}
                        </div>
                        <div class="text-bold text-h7 text-green">
                            {{ getChange_24h()}}
                        </div>
                    </q-item-section>
                </q-item>
                <div>
                    <div :class="$store.state.settings.lightMode === 'true' ? 'dark_bg_transparent':'bg-grey-2'" class="rounded q-pl-md q-pr-md q-pb-xl q-mb-md" @mouseleave="$store.commit('tokens/updateState', { key: 'historicalPrice', value: null })">
                        <!--  <q-spinner-dots color="deep-purple-12" v-if="!chartData" /> -->
                        <span class="text-caption" v-if="!chartData && chartAvailable">
                          Loading historical price (1 month period)
                        </span>
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
                            style="height: 200px"
                        />
                    </div>
                    <div class="toggle_btns_wrapper" v-if="chartAvailable">
                        <q-btn-toggle
                            @click="getHistoriclPrice(historicalLimit)"
                            v-model="historicalLimit"
                            style="width: 68%; justify-content: space-evenly;"
                            class="q-mb-sm toggle_btns"
                            no-caps
                            dense
                            unelevated
                            toggle-color="grey-8"
                            :color="$store.state.settings.lightMode === 'true' ? 'grey-2': 'grey-2'"
                            text-color="black"
                            :options="historicalOptions"
                        />
                    </div>
                </div>
                <!-- EQUITY SECTION  START-->
                <q-item v-if="$store.state.investment.defaultAccount" style="margin-left: -14px;">
                    <q-item-section>
                        <q-item-label class="text-h5">Equity</q-item-label>
                        <q-item-label caption>{{ formatNumber(asset.percentage, 2) }}% of Portfolio</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                        <div class="text-bold text-h6 ">
                             ${{ formatNumber(asset.usd, 18).split(".")[0]}}<span>{{
                            formatNumber(asset.usd, 3).split(".")[1] ? '.'+formatNumber(asset.usd, 3).split(".")[1] : ''
                            }}</span>
                        </div>
                        <div class="text-bold text-h7 text-green">
                            {{ formatNumber(asset.amount, 3) }}
                            {{ asset.type.toUpperCase() }}
                        </div>
                    </q-item-section>
                </q-item>
                <q-card :dark="$store.state.settings.lightMode === 'true'" flat bordered separator class="q-pa-md  rounded-borders" :class="$store.state.settings.lightMode === 'true' ? 'mobile-card': ' bg-white text-black'" v-if="$store.state.investment.defaultAccount && false">
                    <div class=" row">
                        <div class="col-6">
                            Profit/Loss <span><i class="far fa-question-circle"></i></span>
                            <p>-</p>
                        </div>
                        <div class="col-6">
                            Average Cost <span><i class="far fa-question-circle"></i></span>
                            <p>-</p>
                        </div>
                    </div>
                    <div class=" row">
                        <div class="col-6">
                             24-hour Return
                            <p v-if="asset.change24hPercentage">
                                {{ asset.change24h }}
                                <span :class="'pair q-pr-xs allocation text-bold' + asset.color" >({{ asset.change24hPercentage }})</span >
                            </p>
                            <p v-else>
                                <span :class="'pair q-pr-xs allocation ' + asset.color">-</span>
                            </p>
                        </div>
                        <div class="col-6">
                            Fees <span><i class="far fa-question-circle"></i></span>
                            <p>-</p>
                        </div>
                    </div>
                </q-card>
                <!-- EQUITY SECTION  END-->
                <!-- STATS SECTION START -->
                <q-item v-if="marketData" style="margin-left: -14px;">
                    <q-item-section>
                        <q-item-label class=" text-h5">Stats</q-item-label>
                        <q-item-label caption>Token Statistics</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                    </q-item-section>
                </q-item>
                <q-list :dark="$store.state.settings.lightMode === 'true'" bordered separator class="rounded-borders" :class="$store.state.settings.lightMode === 'true' ? '': ' bg-white text-black'" v-if="marketData">
                    <q-item>
                        <q-item-section>
                            <q-item-label lines="1">1 Day</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <span :class="[marketData.change_24h && marketData.change_24h.substr(0,1) == '+' ? 'text-green-6' : 'text-pink-12']" style="font-weight: 400">{{marketData.change_24h}}%</span>
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section>
                            <q-item-label lines="1">1 Week</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <span :class="[marketData.change_7d && marketData.change_7d.substr(0,1) == '+' ? 'text-green-6' : 'text-pink-12']" style="font-weight: 400">{{marketData.change_7d}}%</span>
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section>
                            <q-item-label lines="1">1 Month</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <span :class="[marketData.change_30d && marketData.change_30d.substr(0,1) == '+' ? 'text-green-6' : 'text-pink-12']" style="font-weight: 400">{{marketData.change_30d}}%</span>
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section>
                            <q-item-label lines="1">1 Year</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <span :class="[marketData.change_1y && marketData.change_1y.substr(0,1) == '+' ? 'text-green-6' : 'text-pink-12']" style="font-weight: 400">{{marketData.change_1y}}</span>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section>
                            <q-item-label lines="1">Market Cap</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            ${{nFormatter2(marketData.market_cap)}}
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section>
                            <q-item-label lines="1">High 24h</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            {{marketData.high_24h}}
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section>
                            <q-item-label lines="1">Total Supply</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            {{marketData.total_supply}}
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section>
                            <q-item-label lines="1">Total volume</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            {{marketData.total_volume}}
                        </q-item-section>
                    </q-item>
                </q-list>
                <!-- STATS SECTION END -->
                <!-- ACCOUNT LIST PANEL -->
                <div class="row tokenbyaccount1 items-center justify-center q-mb-xl">
                  <TokenByAccount :type="asset.type" :chain="asset.chain" class="right-area q-mt-lg col" />
                </div>
                <q-page-sticky expand position="bottom" style="margin-bottom: 0px;">
                    <q-toolbar class="q-pa-md" :class="$store.state.settings.lightMode === 'true' ? 'bg-blue-verto':'bg-white text-white'">
                        <q-btn outline icon-right="send" color="blue-4" label="Send" unelevated class="full-width send_btn" @click="dialogSend = true; setAssetLocalCount = 1"/>
                    </q-toolbar>
                </q-page-sticky>
            </q-card-section>

            <SendComponent v-if="!dialogSend" style="visibility: hidden" @setAsset="setAssetLocal" :token="asset.type" :miniMode="true" :key="getSendKey()"  />
        </q-card>
        </q-dialog>

        <!-- SEND/BUY/SELL START-->
        <q-dialog
            v-model="dialogSend"
            persistent

            :maximized="maximizedToggle"
            transition-show="slide-up"
            transition-hide="slide-down"
        >
            <q-card   class="send" :class="$store.state.settings.lightMode === 'true' ? 'text-white':'text-black'" :style="$store.state.settings.lightMode === 'true' ? 'background-color: #04111F !important;': 'background: #f2f2f2 !important'">
                <q-header class="bg-white">
                    <q-toolbar :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'bg-white text-black'">
                        <q-btn flat round dense icon="arrow_back_ios" class="q-mr-sm" @click="back() ; dialogSend =false"/>
                        <q-toolbar-title> Send token</q-toolbar-title>
                        <q-btn flat round dense icon="close" v-close-popup @click="back(); dialogSend = false"/>
                    </q-toolbar>
                </q-header>

                <q-card-section class="q-mt-xl">
                    <div>
                        <q-card :dark="$store.state.settings.lightMode === 'true'" flat bordered :class="$store.state.settings.lightMode === 'true' ? 'q-pa-md text-white': 'q-pa-md text-black' " :style="$store.state.settings.lightMode === 'true' ? 'background-color: #04111F !important;': ''">
                            <div>
                                <q-tabs
                                    v-model="tabLocal"
                                    @click="resetTab"
                                    inline-label
                                    mobile-arrows
                                    :set="show1inch = ['bsc','matic','eth'].includes(asset.chain)"
                                    @input="$emit('update:tab', tabLocal)"
                                >
                                <q-tab v-if="!$store.state.wallets.portfolioTotal" name="import" label="Import" />
                                    <q-tab v-if="$store.state.wallets.portfolioTotal" name="send" label="Send" />
                                    <!--     <q-tab name="swap" v-if="asset.chain != 'eos'  && show1inch" label="Swap" />-->
                                    <q-tab name="buy" v-if="$store.state.wallets.portfolioTotal && !$isbex" @click="exchangeToken({to:asset.type})"  label="Buy" />
                                    <q-tab v-if="$store.state.investment.defaultAccount && $store.state.investment.defaultAccount.key && $store.state.wallets.portfolioTotal  && !$isbex" name="sell" @click="exchangeToken({from:asset.type})" label="Sell" />
                                </q-tabs>

                                <ImportView class="q-pa-md" v-if="!$store.state.wallets.portfolioTotal" :chain="asset.chain" :key="asset.chain" />
                                <div class="text-center " v-if="tab != 'import'" >
                                    <AccountSelector  :withTokenBalance="asset.type" :chains="[asset.chain]"  v-show="tab != 'swap' && !fromPreview"   :key="asset.chain +'-'+asset.type" :chain="asset.chain" class="q-pt-lg" />
                                </div>
                                <div v-if="tab == 'send' && asset.chain != 'eos' && $store.state.investment.defaultAccount && $store.state.wallets.portfolioTotal"  >
                                    <SendComponent  class="send" @setAsset="setAssetLocal" :token="asset.type" :miniMode="true" :key="getSendKey()"   />
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
                                        v-model="depositQuantityLocal"
                                        @input="$emit('update:depositQuantity', depositQuantityLocal)"
                                        >
                                        <template v-slot:hint>
                                        <q-btn class="set-max" label="Set max" @click="$emit('update:depositQuantity',  parseFloat(assetBalance))" dense flat />
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
                                            @input="changeDestinationCoin"
                                            @filter="filterDestinationCoin"
                                            v-model="destinationCoinLocal"
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
                                        v-model="sendToLocal"
                                        @input="$emit('update:sendTo', sendToLocal)"
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
                                        v-model="memoLocal"
                                        @input="$emit('update:memo', memoLocal)"
                                        />
                                    </div>
                                    <div v-else>
                                        <q-item-label class="q-pt-md"> <q-btn @click="$emit('update:fromPreview', false); $emit('update:success', false)" flat dense size="sm" class="q-pr-sm" icon="keyboard_backspace" label="Back" />| Transaction summary</q-item-label>
                                        <q-list :dark="$store.state.settings.lightMode === 'true'" bordered separator  style="max-width: 318px" class="q-mt-md rounded-borders">
                                            <q-item clickable v-ripple>
                                                <q-item-section>
                                                <q-item-label overline></q-item-label>
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
                                        @click="$emit('update:success',  false)"
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
                                         :style="$store.state.settings.lightMode === 'true' ? 'color: white !important':''"
                                    >
                                        <a
                                        href="javascript:void(0)"
                                        @click="isTxValid && triggerActionLocal()"
                                        :style="$store.state.settings.lightMode === 'true' ? 'color: white !important':''"
                                        >{{ tab === 'send' ? (!fromPreview ? 'Preview' : 'Send') :tab }}</a>
                                    </div>
                                </div>
                            </div>
                        </q-card>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import ImportView from '../Token/ImportView.vue'
import TokenByAccount from '../Token/TokenByAccount'
import transactEOS from '../transactEOS.vue'
import SendComponent from '../../../pages/Verto/Send.vue'
import AccountSelector from '../Exchange/AccountSelector.vue'
import PriceChart from '../Token/PriceChart.vue'

export default {
  name: 'TokenDialogMobile',
  props: ['marketData', 'asset', 'formatNumber', 'chartData', 'chartAvailable', 'intervalHistory', 'getHistoriclPrice', 'nFormatter2', 'tab', 'success', 'error', 'exchangeToken', 'setAsset', 'fromPreview', 'depositQuantity', 'assetBalance', 'destinationCoin', 'destinationCoinOptions', 'sendTo', 'memo', 'isTxValid', 'triggerAction', 'goToExchange', 'spinnerVisible', 'filterDestinationCoin', 'setSuccessData', 'getTxData'],
  components: { PriceChart, ImportView, SendComponent, AccountSelector, transactEOS, TokenByAccount },
  data () {
    return {
      maximizedToggle: true,
      open: false,
      tabIndex: 'assets',
      previousTab: '',
      dialog: true,
      historicalLimit: 1,
      depositQuantityLocal: 0,
      memoLocal: '',
      sendToLocal: '',
      tabLocal: 'send',
      destinationCoinLocal: {
        label: 'ETH',
        value: 'eth',
        image: 'https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png'
      },
      historicalOptions: [
        { label: '1D', value: 1 },
        { label: '1W', value: 7 },
        { label: '1M', value: 30 },
        { label: '6M', value: 180 },
        { label: '1Y', value: 365 }
      ],
      dialogSend: false,
      setAssetLocalCount: 0
    }
  },
  mounted () {
    this.tabLocal = this.tab
    this.destinationCoinLocal = this.destinationCoin
    if (this.$route.params.openDialog) {
      this.dialogSend = true
      this.setAssetLocalCount = 1
    }
  },
  methods: {
    resetTab () {
      this.$emit('update:error', false)
      this.$emit('update:success', false)
    },
    changeDestinationCoin () {
      this.$emit('update:error', false)
      this.$emit('update:destinationCoin', this.destinationCoinLocal)
    },
    getChange_24h () {
      try {
        return this.marketData.change_24h
      } catch (e) {}
    },
    triggerActionLocal () {
      this.$emit('update:error', false)
      if (
        this.tab === 'sell' ||
        this.tab === 'buy' ||
        this.tab === 'add liquidity'
      ) {
        this.goToExchange()
      } else if (this.tab === 'send' && this.fromPreview) {
        this.$emit('update:spinnerVisible', true)
        this.$refs.transact.setTxData(this.getTxData())
      } else if (this.tab === 'send' && !this.fromPreview) {
        this.$emit('update:fromPreview', true)
      }
    },
    closeDialog () {
      this.dialog = false
      this.$router.push({ name: 'dashboard', params: { tab: 'assets' } })
    },
    closeSendDialog () {
      this.dialogSend = false
    },
    setAssetLocal () {
      this.setAssetLocalCount++
      if (this.setAssetLocalCount < 2) { this.setAsset() } else console.log('setAssetLocal count ', this.setAssetLocalCount)
    },
    back () {
      if (this.$route.params.openDialog) {
        this.$router.push('/verto/dashboard')
      } else {
        this.dialogSend = false
      }
    },
    getSendKey () {
      try {
        return this.$store.state.investment.defaultAccount.key + this.$store.state.investment.defaultAccount.name + this.$store.state.investment.defaultAccount.chain
      } catch (e) {
        return Math.floor(Math.random() * 100000)
      }
    }
  }

}
</script>

<style lang="scss" scoped>
 .send /deep/ .q-card__section--vert {
    padding: 0px !important

}
.q-select__dialog {
    width: 90vw !important;
    max-width: 100vw !important;
    max-height: calc(100vh - 70px) !important;
    background: rgb(212, 11, 11);
    display: flex;
    flex-direction: column;
    height: 100vh;
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
.mobile-card{
    background-color: #04111F !important;
  }
.top-space {
    margin-top: 110px;
}
/deep/ .q-tabs--horizontal {
    display: none;
}
.rounded{
  border-radius: 10px;
}
.dark_bg_transparent{
  background: rgba(white, .1);
}
.toggle_btns_wrapper{
  position: relative;
  .toggle_btns{
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateY(-100%) translateX(-50%);
    /deep/ .q-btn-item{
      border-radius: 5px !important;
      padding-left: 5px;
      padding-right: 5px;
    }
  }
}
.send_btn{
  height: 50px;
  font-size: 18px;
  letter-spacing: 1px;
  font-weight: 300;
  /deep/ .material-icons{
    font-size: 18px;
  }
}
.bg-blue-verto{
  background: #04111f;
}
</style>

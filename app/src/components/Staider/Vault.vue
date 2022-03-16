<template>
  <div class="vault-section">
    <div class="fluid-container">
      <div class="row justify-between items-center sticky-header">
        <div class="col-4 flex vault-dropdown-col text-white">
          <q-btn-dropdown
            class="vault-dropdown-wrapper-btn" :class="{'active': toggleActive}"
            flat
            no-caps
            @click="toggleActive = !toggleActive"
            @hide="toggleActive = false"
            dark
            content-class="vault-dropdown-wrapper"
          >
            <template v-slot:label>
              <div class="flex text-white justify-start">
                <span class="imgs flex flex-center" :class="{'q-mr-md': $q.screen.width >= 768}">
                  <img :height="$q.screen.width >= 768 ? 45:26" :src="currentVault.vaultIcon" alt="">
                </span>
                <span class="column pairs vault-name justify-center items-start">
                  <span class="pair flex justify-start">Vault</span>
                  <span class="value flex justify-start text-capitalize">{{currentVault.vault}}</span>
                </span>
                <span v-if="$q.screen.width < 768" class="daily-change">Daily change: <b :class="currentVault.dailyChangeStyle">{{currentVault.dailyChange}}</b></span>
              </div>
            </template>
            <div class="column no-wrap dropdown-content">
              <div class="column nav q-pa-md text-white">
                <router-link to="/vault/0x185a02fd5576817fa0c9847cd6f2acc6707bfa0a" class="text-white">SIF USDC Vault</router-link>
                <router-link to="/vault/0xe00d15b722a3c3a5ae2d4dd68a302ec8fdc2ccba" class="text-white">PulseChain Vault</router-link>
              </div>
            </div>
          </q-btn-dropdown>
        </div>
        <div class="col-4 column items-center share-price-wrapper text-white">
          <span class="label">Share Price</span>
          <span class="value" v-if="currentVault && currentVault.sharePrice">{{
            currentVault.sharePrice}} <small>$US</small></span>
          <span v-if="$q.screen.width >= 768" class="daily-change">Daily change: <b :class="currentVault.dailyChangeStyle">{{currentVault.dailyChange}}</b></span>
          <div v-if="$store.state.currentwallet.user" class="flex flex-center action-btn-wrapper">
           <span v-if="investorStatus == 'pending'">Investor status <q-spinner-dots

          color="white"
          size="2em"
        />
          </span>
            <q-btn  @click="actionType = 'whitelistRequired'" color="white" v-else-if="!investorStatus" class="q-mt-sm" :class="{'q-pl-md q-pr-md': $q.screen.width >= 768}" no-caps text-color="white" outline rounded label="Whitelist to deposit" />
          </div>

          <div v-if="investorStatus == 'whitelisted'"  class="flex flex-center action-btn-wrapper">

            <q-btn  @click="actionType = 'deposit'" color="white" class="q-mt-sm q-ml-sm q-mr-sm" :class="{'q-pl-md q-pr-md': $q.screen.width >= 768}" no-caps text-color="white" outline rounded label="Deposit" />
            <q-btn  @click="actionType = 'withdraw'" color="white" class="q-mt-sm q-ml-sm q-mr-sm" :class="{'q-pl-md q-pr-md': $q.screen.width >= 768}" no-caps text-color="white" outline rounded label="Withdraw" />

          </div>
        </div>
        <div class="col-4 network-wrapper text-white">
          <span class="column pairs items-end">
            <span class="pair flex items-center net-label">
              <img width="11" :src="'statics/staider/networks/'+currentVault.network+'.svg'" class="q-mr-sm" alt=""> Network
            </span>
            <span class="value text-bold net-value">{{currentVault.network}}</span>
          </span>
        </div>
      </div>
      <div class="row chart-row">
        <div class="col-12">
            <ChartFund :height="$q.screen.width > 768 ? '300':'250'" chartColor="#2EC083" :fundID="'0x185a02fd5576817fa0c9847cd6f2acc6707bfa0a'" />
        </div>
      </div>
      <div class="row q-pl-lg q-pr-lg" :class="{'q-mt-lg q-pt-md': $q.screen.width > 768}">
        <div :class="{'col q-pr-md': $q.screen.width > 768,'col-6 q-pr-sm': $q.screen.width < 768}">
          <div class="stats-wrapper q-pa-sm q-pl-md apy flex items-center text-white">
            <img src="statics/staider/icon_apy.svg" class="q-mr-md" width="40" alt="">
            <div class="column justify-center">
              <span class="label">APY</span>
              <span class="value" :class="[currentVault.apyStyle]">{{currentVault.apy}}%</span>
            </div>
          </div>
        </div>
        <div :class="{'col q-pr-md': $q.screen.width > 768,'col-6 q-pl-sm': $q.screen.width < 768}">
          <div class="stats-wrapper q-pa-sm q-pl-md denomination flex items-center text-white">
            <img :src="currentVault.icon" class="q-mr-md" width="40" alt="">
            <div class="column justify-center">
              <span class="label">Denomination <br>Asset</span>
            </div>
          </div>
        </div>
        <div :class="{'col-4': $q.screen.width > 768,'col-12': $q.screen.width < 768}">
          <div class="stats-wrapper q-pa-sm q-pl-md assets-under-management flex items-center text-white" :class="{'hovered': $q.screen.width < 768}">
            <img src="statics/staider/icon_assets.svg" class="q-mr-md" width="40" alt="">
            <div class="column justify-center">
              <span class="label">Assets Under Management</span>
              <span class="value">{{currentVault.aum}} <small>$US</small></span>
            </div>
          </div>
        </div>
        <div :class="{'col q-pl-md': $q.screen.width > 768,'col-12': $q.screen.width < 768}">
          <div class="stats-wrapper q-pa-sm q-pl-md investors flex items-center text-white">
            <img src="statics/staider/icon_invest.svg" class="q-mr-md" width="40" alt="">
            <div class="column justify-center">
              <span class="label">investors</span>
              <span class="value">{{currentVault.investors}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="row q-pl-lg q-pr-lg">
        <div class="col-12">
          <q-tabs
              v-model="tab"
              dense
              dark
              no-caps
              :inline-label="$q.screen.width > 768"
              indicator-color="transparent"
              :align="$q.screen.width > 768 ? 'left':'center'"
              active-color="white"
              class="text-grey-6 q-mt-lg q-pa-md vaults-tabs-wrapper" :class="{'full-width': $q.screen.width < 768}"
            >
            <q-tab dark name="vault-holdings" icon="img:statics/staider/icon_my_vaults.svg" label="Vault Holdings" />
            <q-tab dark name="activity" icon="img:statics/staider/icon_trades.svg" label="Activity" />
            <q-tab dark name="deposits" icon="img:statics/staider/icon_my_deposits.svg" label="Deposits" />
            <q-tab dark name="monthly-returns" icon="img:statics/staider/icon_returns.svg" label="Monthly Returns" />
          </q-tabs>
        </div>
        <div class="col-12">
          <q-tab-panels class="bg-transparent vaults-tabs-centent" dark v-model="tab" animated>
            <q-tab-panel dark name="vault-holdings" class="flex full-width">
              <q-table
                flat
                dark
                table-style="box-shadow: none;"
                title=""
                :data="datasCoins"
                :columns="columns"
                :loading="datasCoins.length === 0"
                row-key="asset"
                bordered
                v-if="$q.screen.width >= 768"
                class="q-mt-lg bg-transparent vaults-table full-width"
              >
                <template v-slot:body-cell-asset="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="imgs q-mr-sm">
                        <img :src="props.row.icon" alt="">
                      </span>
                      <span class="column pairs">
                        <span class="pair text-bold">{{props.row.assetThicker.toUpperCase()}}</span>
                        <span :class="{
                          'text-grey-5': $store.state.settings.lightMode === 'true',
                          'text-light-blue-9': $store.state.settings.lightMode === 'true'
                          }" class="value text-capitalize">{{props.row.assetName}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-balance="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="column pairs">
                        <span  class="pair q-pr-xs allocation text-grey-3">{{formatNumber(props.row.allocation, 2)}}% </span>
                        <span class="pair text-bold">{{props.row.balance > 0 ? formatNumber(props.row.balance, 3) : 0}} {{props.row.assetThicker.toUpperCase()}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-price="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="column pairs">
                        <span class="pair text-bold">{{formatNumber(props.row.price, 2)}} {{props.row.currency.toUpperCase()}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-dailyChange="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="column pairs">
                        <span class="pair text-bold" :class="{'text-pink-12': parseFloat(props.row.dailyChange) < 0, 'green plus-sign': parseFloat(props.row.dailyChange) > 0}">{{formatNumber(props.row.dailyChange, 2) + "%"}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-value="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="column pairs">
                        <span class="pair text-bold">{{formatNumber(props.row.value, 2)}} {{props.row.currency.toUpperCase()}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
              </q-table>
              <div v-else class="mobile-table full-width">
                <div class="row q-pa-md" v-for="(coin, index) in datasCoins" :key="'coin'+index">
                  <div class="col-12 q-pt-md q-pb-md flex items-center">
                    <span class="imgs q-mr-sm">
                      <img height="40px" :src="coin.icon" alt="">
                    </span>
                    <span class="column pairs">
                      <span class="pair text-bold">{{coin.assetThicker.toUpperCase()}}</span>
                      <span :class="{
                        'text-grey-5': $store.state.settings.lightMode === 'true',
                        'text-light-blue-9': $store.state.settings.lightMode === 'true'
                        }" class="value text-capitalize">{{coin.assetName}}</span>
                    </span>
                  </div>
                  <div class="col-6 q-pb-sm">
                    <span class="column pairs standard-label">
                      <span class="pair text-grey-5"><small>Allocation</small></span>
                      <span class="pair text-bold standard-label text-grey-5">Balance</span>
                    </span>
                  </div>
                  <div class="col-6">
                    <span class="column pairs items-end standard-value">
                      <span class="pair q-pb-xs allocation text-grey-3">{{formatNumber(coin.allocation, 2)}}% </span>
                      <span class="pair text-bold">{{coin.balance > 0 ? formatNumber(coin.balance, 3) : 0}} {{coin.assetThicker.toUpperCase()}}</span>
                    </span>
                  </div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Price</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair">{{formatNumber(coin.price, 2)}} {{coin.currency.toUpperCase()}}</span></span></div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Daily Change</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair text-bold" :class="{'text-pink-12': parseFloat(coin.dailyChange) < 0, 'green plus-sign': parseFloat(coin.dailyChange) > 0}">{{formatNumber(coin.dailyChange, 2) + "%"}}</span></span></div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Value</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair">{{formatNumber(coin.value, 2)}} {{coin.currency.toUpperCase()}}</span></span></div>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel dark name="trades" class="q-pa-md">
             Coming soon...
            </q-tab-panel>
            <q-tab-panel dark name="deposits">
              <q-table
                flat
                dark
                table-style="box-shadow: none;"
                title=""
                :data="dataDeposits.filter( o => o.__typename == 'SharesBoughtEvent')"
                :columns="columnsDeposits"
                :loading="loading"
                row-key="tx"
                bordered
                v-if="$q.screen.width >= 768"
                class="q-mt-lg bg-transparent vaults-table"
              >
                <template v-slot:body-cell-asset="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="imgs desktop q-mr-lg flex flex-center">
                        <!-- <span class="identicon" v-html="avatar(props.row.vault)" /> -->
                        <img :src="props.row.icon" alt="">
                      </span>
                      <span class="column pairs justify-center">
                        <span class="pair text-bold">{{props.row.amount}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-shares="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="column pairs">
                        <span class="pair text-bold">{{props.row.shares}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-sharePrice="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="column pairs">
                        <span class="pair text-bold">{{props.row.sharePrice}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-value="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="column pairs">
                        <span class="pair text-bold">{{props.row.value}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-apy="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="column pairs">
                        <span class="pair text-bold" :class="props.row.apyStyle">{{props.row.apy}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
              </q-table>
              <div v-else class="mobile-table full-width">
                <div class="row q-pa-md" v-for="(deposit, index) in dataDeposits.filter( o => o.__typename == 'SharesBoughtEvent')" :key="'depositvault'+index">
                  <!-- icon: 'statics/staider/coins/usdc.svg',
                  vault: 'SIF USDC',
                  denominationCoin: 'USDC',
                  myshares: '19,774.25 $US',
                  sharePrice: '0.78 $US',
                  value: '15,451.85 $US',
                  apy: '-14.48%',
                  apyStyle: 'red' -->
                  <div class="col-6 q-pt-md q-pb-md flex items-center">
                    <span class="imgs q-mr-md flex flex-center">
                      <img height="35" :src="deposit.icon" alt="">
                    </span>
                    <span class="column pairs vault-name justify-center">
                      <span class="pair">{{deposit.denominationCoin}}</span>
                      <span class="text-grey-5 value text-capitalize" v-if="false">{{deposit.denominationCoin}}</span>
                    </span>
                  </div>
                  <div class="col-6 q-pt-md q-pb-md">x
                    <span class="column pairs items-end">
                      <span class="pair flex items-center net-label"><img width="11" :src="'statics/staider/networks/'+deposit.network+'.svg'" class="q-mr-sm" alt=""> Network</span>
                      <span class="pair text-bold net-value">{{deposit.network}}</span>
                    </span>
                  </div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Amount</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair">{{deposit.amount}}</span></span></div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Share price</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair">{{deposit.price}}</span></span></div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Shares</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair">{{deposit.shares}}</span></span></div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Date</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair" >{{deposit.date}}</span></span></div>
                         <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Tx</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair" >{{deposit.tx}}</span></span></div>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel dark name="activity">
              <div class="q-mt-md">
                <q-btn-dropdown
                  class="activity-filter-dropdown-wrapper-btn q-pa-none"
                  flat
                  no-caps
                  dark
                  align="left"
                  content-class="vault-dropdown-wrapper"
                >
                  <template v-slot:label>
                    <span class="text-bold filter-title">Filter by</span>
                  </template>
                  <div class="column no-wrap dropdown-content q-pt-sm q-pb-sm coin-dropdown">
                    <div class="flex text-white q-pl-md q-pr-md q-pb-xs q-pt-xs coin-item justify-start">
                      <span class="text-bold filter-title">Trades</span>
                    </div>
                    <div class="flex text-white q-pl-md q-pr-md q-pb-xs q-pt-xs coin-item justify-start">
                      <span class="text-bold filter-title">Deposits</span>
                    </div>
                  </div>
                </q-btn-dropdown>
              </div>
              <ActivityItem :data="activity" v-for="(activity, index) in depositActivityData" :key="'activy_'+index" />
            </q-tab-panel>
            <q-tab-panel dark name="monthly-returns">
             <q-table
                flat
                dark
                table-style="box-shadow: none;"
                title=""
                :data="monthlyReturns"
                :columns="MonthlyReturnscolumns"
                :loading="loading"
                row-key="tx"
                bordered
                v-if="$q.screen.width >= 768"
                class="q-mt-lg bg-transparent vaults-table"
              >
                <template v-slot:body-cell-asset="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="imgs desktop q-mr-lg flex flex-center">
                        <!-- <span class="identicon" v-html="avatar(props.row.vault)" /> -->
                        <img :src="props.row.icon" alt="">
                      </span>
                      <span class="column pairs justify-center">
                        <span class="pair text-bold">{{props.row.amount}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-shares="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="column pairs">
                        <span class="pair text-bold">{{props.row.shares}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-sharePrice="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="column pairs">
                        <span class="pair text-bold">{{props.row.sharePrice}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-value="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="column pairs">
                        <span class="pair text-bold">{{props.row.value}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-apy="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="column pairs">
                        <span class="pair text-bold" :class="props.row.apyStyle">{{props.row.apy}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
              </q-table>
              <div v-else class="mobile-table full-width">
                <div class="row q-pa-md" v-for="(deposit, index) in dataDeposits.filter( o => o.__typename == 'SharesBoughtEvent')" :key="'depositvault'+index">
                  <!-- icon: 'statics/staider/coins/usdc.svg',
                  vault: 'SIF USDC',
                  denominationCoin: 'USDC',
                  myshares: '19,774.25 $US',
                  sharePrice: '0.78 $US',
                  value: '15,451.85 $US',
                  apy: '-14.48%',
                  apyStyle: 'red' -->
                  <div class="col-6 q-pt-md q-pb-md flex items-center">
                    <span class="imgs q-mr-md flex flex-center">
                      <img height="35" :src="deposit.icon" alt="">
                    </span>
                    <span class="column pairs vault-name justify-center">
                      <span class="pair">{{deposit.denominationCoin}}</span>
                      <span class="text-grey-5 value text-capitalize" v-if="false">{{deposit.denominationCoin}}</span>
                    </span>
                  </div>
                  <div class="col-6 q-pt-md q-pb-md">x
                    <span class="column pairs items-end">
                      <span class="pair flex items-center net-label"><img width="11" :src="'statics/staider/networks/'+deposit.network+'.svg'" class="q-mr-sm" alt=""> Network</span>
                      <span class="pair text-bold net-value">{{deposit.network}}</span>
                    </span>
                  </div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Amount</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair">{{deposit.amount}}</span></span></div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Share price</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair">{{deposit.price}}</span></span></div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Shares</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair">{{deposit.shares}}</span></span></div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Date</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair" >{{deposit.date}}</span></span></div>
                         <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Tx</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair" >{{deposit.tx}}</span></span></div>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
   <DepositPopup @hide="actionType =  null" :key="actionType" v-if="$store.state.currentwallet.user && currentVault && currentVault.comptroller && actionType" :vault="currentVault" :actionType="actionType " />
  </div>
</template>

<script>
import DepositPopup from './Fund/DepositPopupV4.vue'
import ChartFund from 'components/StaiderPrototype/ChartFund'
import EnzymeV4 from '@/util/Staider/EnzymeV4'
import Formatter from '@/mixins/Formatter'
import ActivityItem from 'components/StaiderPrototype/ActivityItem'
export default {
  name: 'VaultPage',
  mixins: [Formatter],
  components: {
    ChartFund,
    ActivityItem,
    DepositPopup
  },
  destroyed () {
    this.$store.commit('settings/setComponentState', { key: this.fundID, data: this })
  },
  data () {
    return {
      slippage: '3%',
      depositActivityData: [
        {
          type: 'deposit',
          title: 'Deposit',
          date: '24 Feb 2022 14:00',
          transactionHash: '#',
          amountBalance: '4,500 USDC',
          amountCoin: 'statics/staider/coins/usdc.svg',
          amountEquivalent: '4,480.56 $US',
          sharesReceived: '9,262.2413',
          depositor: '0xcedb...b71f'
        },
        {
          type: 'entrance-fee',
          title: 'Entrance Fee',
          date: '24 Feb 2022 14:00',
          shares: '27.8703',
          transactionHash: '#'
        },
        {
          type: 'protocol-fee-collected',
          title: 'Protocol Fee Collected',
          date: '24 Feb 2022 14:00',
          shares: '0.63935602',
          transactionHash: '#'
        },
        {
          type: 'management-fee-paid-out',
          title: 'Management Fee Paid Out',
          date: '24 Feb 2022 14:00',
          transactionHash: '#',
          fee: '2.00%',
          shares: '2.58499555',
          recipient: '0xcedb...b71f'
        },
        {
          type: 'swap',
          title: 'Swap',
          date: '24 Feb 2022 14:00',
          transactionHash: '#',
          protocol: {
            name: 'ParaSwap v5',
            logo: 'statics/staider/coins/usdc.svg'
          },
          outgoingAsset: {
            balance: '9,262.2413',
            equivalent: '4,480.56 $US',
            coin: 'statics/staider/coins/usdc.svg'
          },
          incommingAsset: {
            balance: '0.1232 YFI',
            equivalent: '2,540.80 $US',
            coin: 'statics/staider/coins/usdc.svg'
          }
        },
        {
          type: 'vault-migration-executed',
          title: 'Vault Migration Executed',
          date: '24 Feb 2022 14:00',
          transactionHash: '#'
        },
        {
          type: 'vault-migration-signalled',
          title: 'Vault Migration Signalled',
          date: '24 Feb 2022 14:00',
          transactionHash: '#'
        },
        {
          type: 'redemption',
          title: 'Redemption',
          date: '24 Feb 2022 14:00',
          transactionHash: '#',
          amountBalance: '0.0201 USDC',
          amountCoin: 'statics/staider/coins/usdc.svg',
          amountEquivalent: '0.02 $US',
          sharesReceived: '0.02',
          depositor: '0xcedb...b71f'
        },
        {
          type: 'vault-created',
          title: 'Vault Created',
          date: '24 Feb 2022 14:00',
          transactionHash: '#'
        }
      ],
      loading: true,
      actionType: null,
      advancedSettings: false,
      termsConditionPopup: false,
      showInfo: false,
      showInfoSlippage: false,
      termsConditions: false,
      amount: '0 USDC',
      amountWithdraw: '206.4221858288598535031',
      depositPopup: false,
      withdrawPopup: false,
      canDeposit: true,
      fundID: null,
      tab: 'vault-holdings',
      toggleActive: false,
      upgrading: false,
      currentVault: {},
      monthlyReturns: [],
      MonthlyReturnscolumns: [
        { name: 'year', align: 'left', label: 'Year', field: 'year', sortable: false },
        { name: 'jan', align: 'left', label: 'Jan', field: 'jan', sortable: false, classes: val => val.jan < 0 ? 'text-red' : 'text-green', format: val => val ? this.formatNumber(val * 100, 2) + '%' : '-' },
        { name: 'feb', align: 'left', label: 'Feb', field: 'feb', sortable: false, classes: val => val.feb < 0 ? 'text-red' : 'text-green', format: val => val ? this.formatNumber(val * 100, 2) + '%' : '-' },
        { name: 'mar', align: 'left', label: 'Mar', field: 'mar', sortable: false, classes: val => val.mar < 0 ? 'text-red' : 'text-green', format: val => val ? this.formatNumber(val * 100, 2) + '%' : '-' },
        { name: 'apr', align: 'left', label: 'Apr', field: 'apr', sortable: false, classes: val => val.apr < 0 ? 'text-red' : 'text-green', format: val => val ? this.formatNumber(val * 100, 2) + '%' : '-' },
        { name: 'may', align: 'left', label: 'May', field: 'may', sortable: false, classes: val => val.may < 0 ? 'text-red' : 'text-green', format: val => val ? this.formatNumber(val * 100, 2) + '%' : '-' },
        { name: 'jun', align: 'left', label: 'Jun', field: 'jun', sortable: false, classes: val => val.jun < 0 ? 'text-red' : 'text-green', format: val => val ? this.formatNumber(val * 100, 2) + '%' : '-' },
        { name: 'jul', align: 'left', label: 'Jul', field: 'jul', sortable: false, classes: val => val.jul < 0 ? 'text-red' : 'text-green', format: val => val ? this.formatNumber(val * 100, 2) + '%' : '-' },
        { name: 'aug', align: 'left', label: 'Aug', field: 'aug', sortable: false, classes: val => val.aug < 0 ? 'text-red' : 'text-green', format: val => val ? this.formatNumber(val * 100, 2) + '%' : '-' },
        { name: 'sep', align: 'left', label: 'Sep', field: 'sep', sortable: false, classes: val => val.sep < 0 ? 'text-red' : 'text-green', format: val => val ? this.formatNumber(val * 100, 2) + '%' : '-' },
        { name: 'oct', align: 'left', label: 'Oct', field: 'oct', sortable: false, classes: val => val.oct < 0 ? 'text-red' : 'text-green', format: val => val ? this.formatNumber(val * 100, 2) + '%' : '-' },
        { name: 'nov', align: 'left', label: 'Nov', field: 'nov', sortable: false, classes: val => val.nov < 0 ? 'text-red' : 'text-green', format: val => val ? this.formatNumber(val * 100, 2) + '%' : '-' },
        { name: 'dec', align: 'left', label: 'Dec', field: 'dec', sortable: false, classes: val => val.dec < 0 ? 'text-red' : 'text-green', format: val => val ? this.formatNumber(val * 100, 2) + '%' : '-' }
      ],
      columns: [
        { headerClasses: 'th-header-style', name: 'asset', align: 'left', label: 'Asset', field: row => row.name, sortable: true, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'balance', align: 'left', label: 'Balance', field: row => row.name, sortable: true, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'price', align: 'left', label: `Price(USD)`, field: row => row.name, sortable: true, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'value', align: 'left', label: `Value(USD)`, field: row => row.name, sortable: true, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'dailyChange', align: 'left', label: 'Daily Change', field: row => row.name, sortable: true, format: val => `${val}` }
        // { headerClasses: 'th-header-style', name: 'allocation', align: 'left', label: 'Allocation', field: row => row.name, sortable: true, format: val => `${val}` }
      ],

      columnsDeposits: [
        // { name: 'asset', align: 'left', label: 'Asset', field: row => row.name, sortable: true, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'asset', label: 'Asset', align: 'left', field: row => row, sortable: false },
        // { headerClasses: 'th-header-style', name: 'Amount', align: 'left', label: 'Amount', field: 'amount', sortable: true },
        { headerClasses: 'th-header-style', name: 'shares', align: 'left', label: 'Shares', field: row => row.shares, sortable: true },
        { headerClasses: 'th-header-style', name: 'price', align: 'left', label: 'Share Price', field: 'sharePrice', sortable: true },
        { headerClasses: 'th-header-style', name: 'date', align: 'left', label: 'Date', field: 'date', sortable: true },
        { headerClasses: 'th-header-style', name: 'tx', align: 'left', label: 'Tx', field: 'tx' }
      ],
      dataDeposits: [],
      datasCoins: [
        { asset: 'AAVE', assetThicker: 'AAVE', assetName: 'Aave Token', balance: '400', price: 6.0, dailyChange: 24, value: 4.0, allocation: 87, currency: 'USD', icon: 'https://token.enzyme.finance//0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9' },
        { asset: 'aREN', assetThicker: 'aREN', assetName: 'Aave interest bearing REN', balance: '90909091', price: 6.0, dailyChange: 24, value: 4.0, allocation: 87, currency: 'USD', icon: 'https://token.enzyme.finance//0xcc12abe4ff81c9378d670de1b57f8e0dd228d77a' },
        { asset: 'LRC', assetThicker: 'LRC', assetName: 'LoopringCoin V2', balance: '5556', price: 6.0, dailyChange: 24, value: 4.0, allocation: 87, currency: 'USD', icon: 'https://token.enzyme.finance//0xbbbbca6a901c926f240b89eacb641d8aec7aeafd' },
        { asset: 'Link', assetThicker: 'Link', assetName: 'ChainLink Token', balance: '100000', price: 6.0, dailyChange: 24, value: 4.0, allocation: 87, currency: 'USD', icon: 'https://token.enzyme.finance//0x514910771af9ca656af840dff83e8264ecf986ca' },
        { asset: 'USDC', assetThicker: 'USDC', assetName: 'USD Coin', balance: '100000', price: 6.0, dailyChange: 24, value: 4.0, allocation: 87, currency: 'USD', icon: 'https://token.enzyme.finance//0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' }
      ],
      seriesGeneral: [59, 41],
      investorStatus: 'pending',
      chartOptionsGeneral: {
        chart: {
          type: 'pie'
        },
        tooltip: {
          enabled: true
        },
        theme: {
          palette: 'palette10'
        },
        colors: ['#2775CA', '#E418E4'],
        labels: ['SIF USDC Vault', 'SPF PulseChain Vault'],
        dataLabels: {
          // enabled: false,
          enabled: true,
          enabledOnSeries: undefined,
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600',
            colors: ['#FFFFFF', '#FFFFFF']
          }
        },
        legend: {
          position: 'right',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400
        },
        responsive: [{
          breakpoint: 520,
          options: {
            chart: {
              width: '100%'
            },
            legend: false
          }
        }]
      }
    }
  },
  watch: {
    '$store.state.currentwallet.user': {
      handler (val) {
        console.log(val, 'val')
        if (val) {
          this.isInvestor()
        }
      },
      deep: true,
      immediate: false
    },
    depositPopup: function (val) {
      if (val) {
        document.querySelector('.scroll_area_wrapper').classList.add('blur-effect')
      } else {
        document.querySelector('.scroll_area_wrapper').classList.remove('blur-effect')
      }
    },
    withdrawPopup: function (val) {
      if (val) {
        document.querySelector('.scroll_area_wrapper').classList.add('blur-effect')
      } else {
        document.querySelector('.scroll_area_wrapper').classList.remove('blur-effect')
      }
    }
  },
  mounted () {
  },
  async created () {
    this.fundID = this.$route.params.fundID
    this.loading = true

    if (this.$store.state.settings.components[this.fundID]) {
      for (let i in this.$store.state.settings.components[this.fundID].$data) {
        this.$set(this, i, this.$store.state.settings.components[this.fundID].$data[i])
      }
    }

    let balance = (await EnzymeV4.getVaultBalance(this.fundID))

    this.datasCoins = balance.assets
    let data = await EnzymeV4.getVaultData(this.fundID)
    this.isInvestor()
    let performance = await EnzymeV4.getVaultPerformance(this.fundID)

    data = { ...data, ...performance }

    // this.currentVault = data
    this.$set(this, 'currentVault', data)

    this.dataDeposits = await EnzymeV4.getActivity(this.fundID, 'deposit')

    this.loading = false
    this.monthlyReturns = await EnzymeV4.getMonthlyReturns(this.fundID)
  },
  methods: {
    async isInvestor () {
      this.investorStatus = 'pending'
      if (this.$store.state.currentwallet.user && this.investorStatus === 'pending') { this.investorStatus = await EnzymeV4.isInvestor(this.fundID, this.$store.state.currentwallet.user.address) }
    },
    formatNumber (number, tofix) {
      const val = (number / 1).toFixed(tofix).replace(',', ' ')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "assets/styles/staider_theme/helpers.scss";
  .vault-section{
    min-height: 600px;
    .vaults-tabs-centent{
      /deep/ .q-tab-panel{
        padding: 0px !important;
        @media screen and (max-width: 768px) {
          margin-top: 20px;
        }
      }
      .body-table-col .imgs {
        margin-top: 5px;
        min-width: 30px;
      }
      .body-table-col .imgs img {
        border-radius: 40px;
        height: 30px;
      }
    }
    .vaults-tabs-wrapper{
      width: fit-content;
      border: 2px solid #2D2D30;
      border-radius: 6px;
      /deep/ .q-tab{
        margin-right: 20px;
        border-radius: 6px !important;
        @media screen and (max-width: 768px) {
          margin-right: 0px;
          .q-tab__label {
            font-size: 12px !important;
            line-height: 1.715em;
            font-weight: 500;
          }
        }
      }
      /deep/ .q-tab--active{
        img{
          opacity: 1;
        }
      }
      /deep/ .q-tab--inactive{
        img{
          opacity: .5;
        }
      }
    }
    .vaults-table{
      width: 96%;
      /deep/ .th-header-style{
        color: rgba(white, .4);
        font-family: $MainFont;
        font-size: 14px;
        font-weight: 400;
      }
      /deep/ .q-table__control{
        opacity: .5;
      }
    }
    .mobile-table{
      border: 1px solid #2D2D30;
      border-radius: 10px;
      font-family: $MainFont;
      font-weight: 400;
      font-size: 12px;
      .row{
        border-bottom: 1px solid #2D2D30;
      }
      .net-label{
        font-size: 12px;
      }
      .net-value{
        font-size: 14px;
        font-weight: 600;
      }
      .vault-name{
        font-size: 16px;
        line-height: 20px;
      }
      .standard-label{
        font-size: 16px;
        font-weight: 600;
      }
      .standard-value{
        font-size: 14px;
        font-weight: 400;
      }
    }
    .stats-wrapper{
      border: 2px solid #2D2D30;
      border-radius: 6px;
      min-height: 80px;
      margin-top: 15px;
      cursor: default;
      transition: border ease .3s;
      .label{
        font-family: $MainFont;
        font-size: 15px;
        font-weight: 400;
      }
      .value{
        font-family: $MainFont;
        font-size: 18px;
        font-weight: 700;
      }
      &.hovered,
      &:hover{
        border: 2px solid $MainYellow;
      }
    }
    .sticky-header{
      position: sticky;
      top: 0px;
      border-radius: 20px 20px 0px 0px;
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      z-index: 999;
      background: rgba(#1D1D21, .6);
      padding-top: 10px;
      padding-bottom: 10px;
      @media screen and (max-width: 768px) {
        padding-top: 5px;
        padding-bottom: 5px;
      }
    }
    .vault-dropdown-col{
      margin-top: 0px;
      @media screen and (max-width: 768px) {
        margin-top: -20px;
      }
      .daily-change{
        position: absolute;
        top: 80%;
        left: 21px;
        font-size: 11px;
        font-family: $MainFont;
      }
      .imgs{
        margin-top: -10px;
        @media screen and (max-width: 768px) {
          margin-top: -10px;
        }
      }
      .coin-name{
        font-family: $MainFont;
      }
      .vault-name{
        font-family: $MainFont;
        .pair{
          font-size: 14px;
          font-weight: 200;
          @media screen and (max-width: 768px) {
            display: none;
          }
        }
        .value{
          font-size: 16px;
          font-weight: 600;
          margin-top: -5px;
          @media screen and (max-width: 768px) {
            font-size: 12px;
            margin-top: 0px;
          }
        }
      }
    }
    .share-price-wrapper{
      position: relative;
      z-index: 10;
      transform: scale(.85);
      @media screen and (max-width: 768px) {
        margin-top: 5px;
      }
      .label{
        font-family: $MainFont;
        font-size: 14px;
        font-weight: 200;
        margin-bottom: -5px;
      }
      .value{
        font-family: $MainFont;
        font-size: 32px;
        font-weight: 700;
        small{
          font-size: 16px;
          font-weight: 600;
        }
      }
      .daily-change{
        font-size: 12px;
        font-family: $MainFont;
        font-weight: 400;
        margin-top: -5px;
      }
      .action-btn-wrapper{
        position: absolute;
        top: calc(100% + 15px);
        /deep/ button{
          background: #1D1D21 !important;
        }
      }
    }
    .network-wrapper{
      padding-right: 0px;
      transform: translateX(-25px);
      margin-top: 0px;
      @media screen and (max-width: 768px) {
        margin-top: 5px;
      }
      .pair{
        font-size: 14px;
        font-family: $MainFont;
        font-weight: 200;
        @media screen and (max-width: 768px) {
          font-size: 12px;
        }
      }
      .value{
        font-size: 17px;
        @media screen and (max-width: 768px) {
          font-size: 14px;
        }
        font-family: $MainFont;
        font-weight: 600;
      }
    }
    .chart-row{
      margin-top: 0px;
    }
  }
  .deposit-withdraw-popup-wrapper{
    background: #1D1D21;
    width: 100%;
    min-height: 274px;
    max-width: 600px;
    border-radius: 20px;
    box-shadow: 0px 36px 36px 0px #000 !important;
    .popup-title{
      font-size: 12px;
      font-family: $MainFont;
      font-weight: 600;
    }
    .action-label{
      font-size: 12px;
      font-family: $MainFont;
      font-weight: 400;
      opacity: 1;
      .cancel{
        background: #2D2D30 !important;
        opacity: .8;
      }
    }
    .input-wrapper{
      position: relative;
      .max-wrapper{
        position: absolute;
        top: 0px;
        left: 100%;
        width: 52%;
        height: 44px;
        &.withdraw{
          width: auto;
        }
        @media screen and (max-width: 643px) {
          &:not(.withdraw){
            position: relative;
            top: 0px;
            left: 0%;
            width: 100%;
            height: 44px;
            margin-top: 10px;
          }
        }
        .max-btn{
          background: rgba(#2D2D30, .8) !important;
          font-family: $MainFont !important;
          font-weight: 400 !important;
          font-size: 12px !important;
          border-radius: 7px !important;
          margin-left: 5px;
          height: 44px;
          &.yellow{
            background: $MainYellow !important;
          }
          /deep/ .q-btn__wrapper{
            padding: 0px 10px !important;
          }
        }
        .coin-dropdown-wrapper-btn{
          background: rgba(#2D2D30, .8) !important;
          font-family: $MainFont !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          border-radius: 7px !important;
          margin-left: 5px;
          height: 44px;
          @media screen and (max-width: 643px) {
            margin-left: 0px;
          }
        }
      }
    }
    .instruction{
      font-size: 16px;
      font-family: $MainFont;
      font-weight: 400;
    }
    .connecting-wrapper{
      min-height: 140px;
      .name{
        font-family: $MainFont;
        font-size: 14px;
        font-weight: 600;
      }
    }
    /deep/ .advanced-settings-btn{
      color: $MainYellow !important;
      font-family: $MainFont !important;
      font-size: 14px !important;
      font-weight: 400 !important;
      opacity: .6;
      width: fit-content;
      margin-left: -15px;
      &:hover{
        opacity: 1;
      }
      .q-focus-helper{
        display: none;
      }
    }
    .share-lockup-time{
      position: relative;
      width: fit-content;
      .infobull-wrapper{
        position: absolute;
        left: calc(100% + 10px);
        top: 50%;
        color: #FFF;
        font-family: $MainFont;
        font-size: 12px;
        font-weight: 200;
        background: #1D1D21 !important;
        box-shadow: 0px 14px 14px 0px rgba(#000, .5) !important;
        padding: 10px 15px;
        border-radius: 8px;
        transition: transform ease .3s, opacity ease .3s;
        opacity: 0;
        transform: translate(10px,-50%);
        visibility: hidden;
        width: 244px;
        &.show{
          opacity: 1;
          transform: translate(0px,-50%);
          visibility: visible;
        }
      }
      .info{
        background: #FFF;
        display: inline-flex;
        width: 20px;
        height: 20px;
        border-radius: 20px;
        justify-content: center;
        color: #333;
        font-family: $MainFont;
        font-size: 13px;
        align-items: center;
        font-weight: 700;
        margin-left: 10px;
        cursor: pointer;
        &:hover{
          background: $MainYellow;
        }
      }
    }
    /deep/ .termsConditions{
      margin-left: -9px;
      opacity: .8;
      .q-checkbox__inner--truthy .q-checkbox__bg,
      .q-checkbox__inner--indet .q-checkbox__bg {
          background: rgba($MainYellow, .4);
          border-color: $MainYellow;
      }
      .q-checkbox__bg{
        border-color: #333;;
      }
      a{
        color: $MainYellow;
        text-decoration: none;
      }
    }
    /deep/ .amount-input{
      background: #16161A !important;
      font-family: $MainFont !important;
      font-size: 16px !important;
      border-radius: 8px !important;
      margin-left: -2px;
      height: 44px;
      /deep/ .q-input__wrapper:before {
        border: 2px solid #2D2D2D !important;
      }
      &.q-field--dark .q-field__control{
        height: 44px;
        .q-field__native{
          font-weight: 700 !important;
        }
        &:before{
          border: 2px solid #2D2D2D !important;
        }
        &:hover:before{
          border: 2px solid #353535 !important;
        }
      }
    }
  }
  .terms_scroll{
    border-radius: 20px;
    overflow: hidden;
    // max-width: calc(100% - 180px);
    max-height: 50vh;
    margin-left: auto;
    margin-right: auto;
    margin-top: 0px;
    border-radius: 20px;
    // padding: 0px;
    padding-bottom: 20px;
    margin-left: -8px !important;
    margin-right: -8px !important;
    &.height-auto{
      margin-top: 0px;
      border-radius: 0px;
      max-width: 100%;
      height: calc(100vh - 101px) !important;
    }
    p{
      font-family: $MainFont;
      font-size: 12px;
      font-weight: 400;
      opacity: .8;
      line-height: 20px;
      text-align: justify;
    }
    h4{
      font-family: $MainFont;
      font-size: 16px;
      font-weight: 600;
      margin: 0px;
      padding: 0px;
      opacity: .8;
    }
    &.blur-effect{
      filter: blur(5px);
    }
  }
  /deep/ .q-scrollarea--dark .q-scrollarea__thumb {
    background: #fff;
    right: 0px;
    border-radius: 20px;
    width: 10px;
    transform: scale(0.8);
    z-index: 9999;
  }
  /deep/ .q-page-container{
    padding-top: 0px !important;
  }
</style>
<style>
.vault-dropdown-wrapper{
  background: #1D1D21 !important;
  box-shadow: 0px 36px 36px 0px !important;
}
.vault-dropdown-wrapper.coin-drop{
  width: 180px !important;
  max-width: 180px !important;
  margin-top: 10px !important;
  transform: translateX(48px);
}
.vault-dropdown-wrapper .dropdown-content{
  background: #1D1D21 !important;
}
.vault-dropdown-wrapper .dropdown-content.coin-dropdown{
  border: 2px solid #F6F973;
  border-radius: 10px;
}
.vault-dropdown-wrapper .dropdown-content hr{
  opacity: .2 !important;
}
.vault-dropdown-wrapper-btn .q-btn-dropdown__arrow-container{
  /* display: none !important; */
}
.vault-dropdown-wrapper-btn {
  margin-left: 0px;
  opacity: .9;
  transform: scale(1);
}
.vault-dropdown-wrapper-btn:hover {
  opacity: 1;
}
.vault-dropdown-wrapper-btn .q-focus-helper{
  display: none;
}
.vault-dropdown-wrapper-btn.active{
  /* border: 3px solid #F6F973; */
}
.vault-dropdown-wrapper .vault-name.coin .value{
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
}
.vault-dropdown-wrapper .coin-item{
  cursor: pointer;
  opacity: .7;
}
.vault-dropdown-wrapper .coin-item:hover{
  opacity: 1;
}
.vault-dropdown-wrapper .dropdown-content a{
  text-decoration: none;
  padding: 5px 15px;
  margin-bottom: 5px;
  margin-top: 5px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  letter-spacing: .2px;
  font-weight: 400;
  opacity: .7;
}
.vault-dropdown-wrapper .dropdown-content a:hover{
  opacity: 1;
}
</style>

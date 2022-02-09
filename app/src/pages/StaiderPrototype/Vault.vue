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
                <router-link to="/funds/sif-usdc-vault" class="text-white">SIF USDC Vault</router-link>
                <router-link to="/funds/pulsechain-vault" class="text-white">PulseChain Vault</router-link>
              </div>
            </div>
          </q-btn-dropdown>
        </div>
        <div class="col-4 column items-center share-price-wrapper text-white">
          <span class="label">Share Price</span>
          <span class="value">{{currentVault.sharePrice}} <small>$US</small></span>
          <span v-if="$q.screen.width >= 768" class="daily-change">Daily change: <b :class="currentVault.dailyChangeStyle">{{currentVault.dailyChange}}</b></span>
          <div class="flex flex-center action-btn-wrapper">
            <q-btn color="white" class="q-mt-sm" :class="{'q-pl-md q-pr-md': $q.screen.width >= 768}" no-caps text-color="white" outline rounded label="Whitelist to deposit" />
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
            <ChartFund :height="$q.screen.width > 768 ? '300':'250'" chartColor="#2EC083" fundID="0x185a02fd5576817fa0c9847cd6f2acc6707bfa0a" />
        </div>
      </div>
      <div class="row q-pl-lg q-pr-lg" :class="{'q-mt-lg q-pt-md': $q.screen.width > 768}">
        <div :class="{'col q-pr-md': $q.screen.width > 768,'col-6 q-pr-sm': $q.screen.width < 768}">
          <div class="stats-wrapper q-pa-sm q-pl-md apy flex items-center text-white">
            <img src="statics/staider/icon_apy.svg" class="q-mr-md" width="40" alt="">
            <div class="column justify-center">
              <span class="label">APY</span>
              <span class="value red">-3.89%</span>
            </div>
          </div>
        </div>
        <div :class="{'col q-pr-md': $q.screen.width > 768,'col-6 q-pl-sm': $q.screen.width < 768}">
          <div class="stats-wrapper q-pa-sm q-pl-md denomination flex items-center text-white">
            <img src="statics/staider/coins/usdc.svg" class="q-mr-md" width="40" alt="">
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
              <span class="value">23,505.28 <small>$US</small></span>
            </div>
          </div>
        </div>
        <div :class="{'col q-pl-md': $q.screen.width > 768,'col-12': $q.screen.width < 768}">
          <div class="stats-wrapper q-pa-sm q-pl-md investors flex items-center text-white">
            <img src="statics/staider/icon_invest.svg" class="q-mr-md" width="40" alt="">
            <div class="column justify-center">
              <span class="label">investors</span>
              <span class="value">256</span>
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
            <q-tab dark name="trades" icon="img:statics/staider/icon_trades.svg" label="Trades" />
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
            <q-tab-panel dark name="trades">
              <div class="text-h6 q-mt-md">Trades</div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>
            <q-tab-panel dark name="deposits">
              <div class="text-h6 q-mt-md">Deposits</div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>
            <q-tab-panel dark name="monthly-returns">
              <div class="text-h6 q-mt-md">Monthly Returns</div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChartFund from 'components/StaiderPrototype/ChartFund'
export default {
  name: 'VaultPage',
  components: {
    ChartFund
  },
  data () {
    return {
      fundID: '0x185a02fd5576817fa0c9847cd6f2acc6707bfa0a',
      tab: 'vault-holdings',
      toggleActive: false,
      currentVault: {
        vaultIcon: 'statics/staider/sif_logo_white.svg',
        icon: 'statics/staider/coins/usdc.svg',
        vault: 'SIF USDC',
        denominationCoin: 'USDC',
        investors: '256',
        assetsUnderManagment: '23,505.28',
        sharePrice: '0.82',
        apy: '-3.89%',
        apyStyle: 'red',
        dailyChange: '-3.80%',
        dailyChangeStyle: 'red',
        network: 'Ethereum'
      },
      columns: [
        { headerClasses: 'th-header-style', name: 'asset', align: 'left', label: 'Asset', field: row => row.name, sortable: true, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'balance', align: 'left', label: 'Balance', field: row => row.name, sortable: true, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'price', align: 'left', label: `Price(${window.localStorage.getItem('currency').toUpperCase()})`, field: row => row.name, sortable: true, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'value', align: 'left', label: `Value(${window.localStorage.getItem('currency').toUpperCase()})`, field: row => row.name, sortable: true, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'dailyChange', align: 'left', label: 'Daily Change', field: row => row.name, sortable: true, format: val => `${val}` }
        // { headerClasses: 'th-header-style', name: 'allocation', align: 'left', label: 'Allocation', field: row => row.name, sortable: true, format: val => `${val}` }
      ],
      datasCoins: [
        { asset: 'AAVE', assetThicker: 'AAVE', assetName: 'Aave Token', balance: '400', price: 6.0, dailyChange: 24, value: 4.0, allocation: 87, currency: 'USD', icon: 'https://token.enzyme.finance//0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9' },
        { asset: 'aREN', assetThicker: 'aREN', assetName: 'Aave interest bearing REN', balance: '90909091', price: 6.0, dailyChange: 24, value: 4.0, allocation: 87, currency: 'USD', icon: 'https://token.enzyme.finance//0xcc12abe4ff81c9378d670de1b57f8e0dd228d77a' },
        { asset: 'LRC', assetThicker: 'LRC', assetName: 'LoopringCoin V2', balance: '5556', price: 6.0, dailyChange: 24, value: 4.0, allocation: 87, currency: 'USD', icon: 'https://token.enzyme.finance//0xbbbbca6a901c926f240b89eacb641d8aec7aeafd' },
        { asset: 'Link', assetThicker: 'Link', assetName: 'ChainLink Token', balance: '100000', price: 6.0, dailyChange: 24, value: 4.0, allocation: 87, currency: 'USD', icon: 'https://token.enzyme.finance//0x514910771af9ca656af840dff83e8264ecf986ca' },
        { asset: 'USDC', assetThicker: 'USDC', assetName: 'USD Coin', balance: '100000', price: 6.0, dailyChange: 24, value: 4.0, allocation: 87, currency: 'USD', icon: 'https://token.enzyme.finance//0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' }
      ],
      seriesGeneral: [59, 41],
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
  mounted () {
  },
  async created () {
  },
  methods: {
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
</style>
<style>
.vault-dropdown-wrapper{
  background: #1D1D21 !important;
  box-shadow: 0px 36px 36px 0px !important;
}
.vault-dropdown-wrapper .dropdown-content{
  background: #1D1D21 !important;
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

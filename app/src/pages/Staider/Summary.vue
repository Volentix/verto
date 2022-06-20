<template>
  <div class="summary-section">
    <div class="fluid-container">
    <div v-if="!$store.state.currentwallet.user" class="text-h6 text-white flex flex-center">Connect your wallet</div>
     <div v-if="$store.state.currentwallet.user && datasVaults == null">  <q-linear-progress indeterminate color="grey" /></div>

      <div class="row" v-if="$store.state.currentwallet.user">
        <div class="col-12 col-sm-12 col-md-5 col-lg-5" v-if="investorData">
          <div class="main-title column text-white q-mb-lg" :class="{'items-center': $q.screen.width < 768, 'q-pb-lg' : seriesGeneral.length < 2}">
            <span>Portfolio summary</span>
            <span class="number">{{investorData.totalPValue}} <small>$US</small></span>
          </div>
          <apexcharts v-if="seriesGeneral.length > 1" width="88%" type="pie" :options="chartOptionsGeneral" :series="seriesGeneral"></apexcharts>
          <div v-if="$q.screen.width < 520" class="chart-summary-mobile q-mt-lg q-mb-md">
            <ul class="flex flex-center text-white">
              <li class="flex flex-center" v-for="(label, index) in chartOptionsGeneral.labels" :key="'label'+index">
                <b :style="'background-color:'+chartOptionsGeneral.colors[index]"></b><span>{{label}}</span>
              </li>
            </ul>
          </div>
          <div class="row stats-wrapper text-white q-mt-lg">
            <div class="col-6 column items-start stat-item q-mb-md">
              <span>Average APY</span>
              <span :class="['number',investorData.avApy.color]" >{{investorData.avApy.value}}%</span>
            </div>
            <div class="col-6 column items-end stat-item q-mb-md">
              <span>This month</span>
              <span :class="['number',investorData.thisMonth.color]" >{{investorData.thisMonth.value}}%</span>
            </div>
            <div class="col-6 column items-start stat-item q-mb-md">
              <span>Average Share Price</span>
              <span class="number">{{investorData.avgSharePrice}} <small>$US</small></span>
            </div>
            <div class="col-6 column items-end stat-item q-mb-md">
              <span>Change to date</span>
              <span :class="['number',investorData.sinceInception.color]" >{{investorData.sinceInception.value}} <small>%</small></span>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-12 col-md-7 col-lg-7">
          <q-tabs
              v-model="tab"
              dense
              dark
              no-caps
              inline-label
              indicator-color="transparent"
              align="right"
              active-color="white"
              class="text-grey-6 q-mt-lg vaults-tabs-wrapper"
            >
            <q-tab dark name="vaults" icon="img:statics/staider/icon_my_vaults.svg" :label="$q.screen.width >= 768 ? 'My Vaults' : 'Vaults'" />
            <q-tab dark name="deposits" icon="img:statics/staider/icon_my_deposits.svg" :label="$q.screen.width >= 768 ? 'My Deposits' : 'Deposits'" />
            <q-tab dark name="withdrawals" icon="img:statics/staider/icon_my_withdrawls.svg" :label="$q.screen.width >= 768 ? 'My Withdrawals' : 'Withdrawals'" />
          </q-tabs>
          <q-tab-panels class="bg-transparent vaults-tabs-centent" dark v-model="tab" animated>
            <q-tab-panel dark name="vaults" class="flex justify-end">
              <q-table
                flat
                dark
                table-style="box-shadow: none;"
                title=""
                :data="datasVaults"
                :columns="columns"
                :loading="loading"
                row-key="asset"
                @row-click="onRowClick"
                bordered
                v-if="$q.screen.width >= 768"
                class="q-mt-lg bg-transparent vaults-table"
              >
                <template v-slot:body-cell-vault="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="imgs desktop q-mr-lg flex flex-center">
                        <!-- <span class="identicon" v-html="avatar(props.row.vault)" /> -->
                        <img :src="props.row.icon" alt="">
                      </span>
                      <span class="column pairs justify-center">
                        <span class="pair text-bold">{{props.row.vault}}</span>
                        <span class="text-grey-5 value text-capitalize">{{props.row.denominationCoin}}</span>
                      </span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-myshares="props">
                  <q-td :props="props" class="body-table-col">
                    <div class="col-3 flex items-center">
                      <span class="column pairs">
                        <span class="pair text-bold">{{props.row.myshares}}</span>
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
                <div class="row q-pa-md" v-for="(vault, index) in datasVaults" :key="'vault'+index">
                  <!-- icon: 'statics/staider/coins/usdc.svg',
                  vault: 'SIF USDC',
                  denominationCoin: 'USDC',
                  myshares: '19,774.25 $US',
                  sharePrice: '0.78 $US',
                  value: '15,451.85 $US',
                  apy: '-14.48%',
                  apyStyle: 'red' -->
                  <div class="col-6 q-pt-md q-pb-md flex items-center">
                    <span class="imgs  q-mr-md flex flex-center">
                      <img height="35" :src="vault.icon" alt="">
                    </span>
                    <span class="column pairs vault-name justify-center">
                      <span class="pair">{{vault.vault}}</span>
                      <span class="text-grey-5 value text-capitalize">{{vault.denominationCoin}}</span>
                    </span>
                  </div>
                  <div class="col-6 q-pt-md q-pb-md">
                    <span class="column pairs items-end">
                      <span class="pair flex items-center net-label"><img width="11" :src="'statics/staider/networks/'+vault.network+'.svg'" class="q-mr-sm" alt=""> Network</span>
                      <span class="pair text-bold net-value">{{vault.network}}</span>
                    </span>
                  </div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">My shares</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair">{{vault.myshares}}</span></span></div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Share price</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair">{{vault.sharePrice}}</span></span></div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">Value</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair">{{vault.value}}</span></span></div>
                  <div class="col-6 q-pb-sm"><span class="pair text-bold standard-label text-grey-5">APY</span></div>
                  <div class="col-6"><span class="column pairs items-end standard-value"><span class="pair" :class="vault.apyStyle">{{vault.apy}}</span></span></div>
                </div>
              </div>
            </q-tab-panel>
             <q-tab-panel dark name="deposits" class="flex justify-end">
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
                      <span class="pair">{{deposit.vault}}</span>
                      <span class="text-grey-5 value text-capitalize">{{deposit.denominationCoin}}</span>
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
            <q-tab-panel dark name="withdrawals" class="flex justify-end">
              <q-table
                flat
                dark
                table-style="box-shadow: none;"
                title=""
                :data="dataDeposits.filter( o => o.__typename == 'SharesRedeemedEvent')"
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
                      <span class="pair">{{deposit.vault}}</span>
                      <span class="text-grey-5 value text-capitalize">{{deposit.denominationCoin}}</span>
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
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import { toSvg } from 'jdenticon'
// import Enzyme from '@/util/Staider/Enzyme'
import EnzymeV4 from '@/util/Staider/EnzymeV4'
import Formatter from '@/mixins/Formatter'
export default {
  mixins: [Formatter],
  name: 'SummaryPage',
  components: {
    apexcharts: VueApexCharts
  },
  data () {
    return {
      columns: [
        { headerClasses: 'th-header-style', name: 'vault', label: 'Vault', align: 'left', field: row => row.name, sortable: false, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'myshares', label: 'My Shares', align: 'left', field: row => row.name, sortable: false, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'sharePrice', label: 'Share Price', align: 'left', field: row => row.name, sortable: false, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'value', label: 'Value', align: 'left', field: row => row.name, sortable: false, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'apy', label: 'APY', align: 'left', field: row => row.name, sortable: false, format: val => `${val}` }
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
      datasVaults: [],
      dataDeposits: [],
      tab: 'vaults',
      loading: true,
      seriesGeneral: [],
      investorData: null,
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
        colors: ['#1f2e6a', '#365c3f'],
        labels: [],
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
    if (this.$store.state.settings.components[this.$options.name]) {
      for (let i in this.$store.state.settings.components[this.$options.name].$data) {
        this.$set(this, i, this.$store.state.settings.components[this.$options.name].$data[i])
      }
    }
  },
  destroyed () {
    this.$store.commit('settings/setComponentState', { key: this.$options.name, data: this })
  },
  watch: {
    '$store.state.currentwallet.user': function (val) {
      if (val) {
        this.getUserData()
      }
    } },
  async  created () {
    if (this.$store.state.currentwallet.user) {
      this.getUserData()
    }
  },
  methods: {
    async getUserData () {
      let data = (await EnzymeV4.getUserVaults(this.$store.state.currentwallet.user.address))

      if (data.length) {
        console.log(data, 'data')

        let ids = Object.assign([], data).map(f => f.vault.id)
        this.investorData = await EnzymeV4.getAggregateVaultsData(ids)

        this.datasVaults = await EnzymeV4.getInvestorData(this.$store.state.currentwallet.user.address)
        this.investorData.totalPValue = this.formatNumber(this.datasVaults.reduce((a, b) => a + b.totalUsd, 0), 2)
        this.seriesGeneral = this.investorData.repartition
        this.chartOptionsGeneral.labels = Object.assign([], data).map(f => f.vault.name)
        data.forEach(async f => {
        // .dataDeposits = this.dataDeposits.concat(await Enzyme.getDeposits(f.address))
          this.dataDeposits = this.dataDeposits.concat(await EnzymeV4.getActivity(f.vault.id, 'deposit', this.$store.state.currentwallet.user.address))
        })
        // this.$set(this, 'investorData', data)
      } else {
        this.investorData = {
          repartition: 0,
          totalPValue: 0,
          avApy: 0,
          sinceInception: 0,
          thisMonth: 0
        }
      }
      this.loading = false
    },
    onRowClick (evt, row) {
      this.$router.push('/vault/' + row.address)
    },
    avatar (name) {
      return toSvg(name, 30)
    },
    formatNumber (number, tofix) {
      const val = (number / 1).toFixed(tofix).replace(',', ' ')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
<style lang="scss" scoped>
.imgs.desktop img {
width: 30px
}
  @import "assets/styles/staider_theme/helpers.scss";
  .summary-section{

      min-height: 600px;
    padding: 30px;
    .main-title{
      span{
        font-family: $MainFont;
        font-weight: 200;
        font-size: 16px;
      }
      .number{
        font-weight: 700;
        font-size: 30px;
        .small{
          font-weight: 600;
          font-size: 20px;
        }
      }
    }
    .stats-wrapper{
      .stat-item{}
      span{
        font-family: $MainFont;
        font-weight: 400;
        font-size: 14px;
        opacity: .7;
        &.number{
          opacity: 1;
          font-size: 24px;
          font-weight: 200;
          .small{
            font-weight: 400;
            font-size: 18px;
          }
        }
      }
    }
    .vaults-tabs-centent{
      /deep/ .q-tab-panel{
        @media screen and (max-width: 768px) {
          padding: 0px !important;
          margin-top: 20px;
        }
      }
    }
    .vaults-tabs-wrapper{
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
    .identicon{
      overflow: hidden;
      outline: 1px solid rgb(71, 71, 71);
      background: transparent;
      border-radius: 30px;
      display: block;
      width: 30px;
      height: 30px;
      padding: 2px;
      /deep/ svg{
        width: 26px;
        position: relative;
        top: -2px;
      }
    }
    .chart-summary-mobile{
      ul{
        list-style: none;
        padding: 0px;
        margin: 0px;
        li{
          margin-left: 10px;
          margin-right: 10px;
          b{
            width: 10px;
            height: 10px;
            border-radius: 10px;
            margin-right: 10px;
          }
          span{
            font-family: $MainFont;
            font-size: 14px;
            font-weight: 400;
          }
        }
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
  }
</style>
<style>
  .summary-section .apexcharts-gridline{stroke: rgb(49 49 49) !important;}
  .summary-section .apexcharts-pie path{stroke: #1D1D21;}
  .summary-section .apexcharts-legend-text{color: #FFF !important;}
  .summary-section .apexcharts-legend{top: 0px !important;right: 0px !important;display: flex !important;flex-direction: column !important;justify-content: center !important;}
</style>

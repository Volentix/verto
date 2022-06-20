<template>
  <div v-if="trades">
    <q-table
      flat
      :dark="$store.state.settings.lightMode === 'true'"
      table-style="box-shadow: none;"
      title="Trades"

      :data="trades"
      :columns="columns"
      row-key="date"
    >
      <template v-slot:body-cell-depositor="props">
        <q-td v-if="props.row.investor && props.row.investor.id"  :props="props" class="body-table-col ">
          <q-btn dense color="white" flat @click="openURL('https://etherscan.io/address/'+props.row.investor.id)" size="sm" icon-right="open_in_new" :text-color="$store.state.settings.lightMode === 'true' ? 'white':'black'" :label="getKeyFormat(props.row.investor.id)" />
        </q-td>
      </template>
      <template v-slot:body-cell-tx="props">
        <q-td  :props="props" class="body-table-col ">
          <q-btn dense color="white" flat @click="openURL('https://etherscan.io/tx/'+props.row.id)" size="sm" icon-right="open_in_new" :text-color="$store.state.settings.lightMode === 'true' ? 'white':'black'" :label="getKeyFormat(props.row.id)" />
        </q-td>
      </template>
      <template v-slot:body-cell-exchange="props">
        <q-td v-if="props.value" :props="props" class="body-table-col flex flex-left">
        <q-avatar size="sm">
          <img :src="props.value.image">
        </q-avatar>
          <div class="q-pl-sm q-pt-xs">{{props.value.name}}</div>
        </q-td>
      </template>
        <template v-slot:body-cell-trade="props">
        <q-td v-if="props.value" :props="props" class="body-table-col row">
         <q-item class="col-md-6">
        <q-item-section style="min-width:20px" avatar>
          <q-icon color="primary" :name="'img:https://token.enzyme.finance/'+props.row.outgoingAssetAmount.asset.id" />
        </q-item-section>
        <q-item-section>
        <q-item-label >{{formatNumber(props.row.outgoingAssetAmount.amount, 2)}} {{props.row.outgoingAssetAmount.asset.symbol}}</q-item-label>
         <q-item-label caption v-if="false">$1200</q-item-label>
         </q-item-section>
        <q-item-section side>
          <q-item-label > <q-icon name="arrow_forward_ios"/></q-item-label>
        </q-item-section>
      </q-item>
    <q-item class="col-md-6">
        <q-item-section style="min-width:20px" dense avatar>
          <q-icon color="primary" :name="'img:https://token.enzyme.finance/'+props.row.incomingAssetAmount.asset.id" />
        </q-item-section>
        <q-item-section>
        <q-item-label >{{formatNumber(props.row.incomingAssetAmount.amount, 2)}} {{props.row.incomingAssetAmount.asset.symbol}}</q-item-label>
         <q-item-label caption v-if="false">$1200</q-item-label>
         </q-item-section>

      </q-item>
        </q-td>
      </template>

      <template v-slot:body-cell-asset="props">
        <q-td v-if="props.row.asset && props.row.asset.id" :props="props" class="body-table-col ">
          <div class="col-3 flex row items-center">
            <span class="imgs q-mr-lg">
              <img style="width: 40px;" :src="'https://token.enzyme.finance/'+props.row.asset.id" alt="">
            </span>
            <span class="column pairs">
              <span class="pair text-bold">{{props.row.asset.symbol}}</span>
              <span :class="{
                'text-grey-5': $store.state.settings.lightMode === 'true',
                'text-light-blue-9': $store.state.settings.lightMode === 'true'
                }" class="value text-capitalize">Deposit</span>
            </span>
          </div>
        </q-td>
          <q-td v-else>
          Shares redeemed
        </q-td>
      </template>
    </q-table>
  </div>
</template>
<script>
import Enzyme from '../../../util/Staider/Enzyme'
import Formatter from '../../../mixins/Formatter'
import { openURL } from 'quasar'

let exchanges = {
  CURVE_LIQUIDITY_STETH: {
    image: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/curve.fi.png',
    name: 'Curve Steth Pool'
  },
  CURVE_EXCHANGE: {
    image: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/curve.fi.png',
    name: 'Curve'
  },
  ZERO_EX_V2: {
    image: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/0x.org.png',
    name: '0x'
  },
  PARA_SWAP_V4: {
    image: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/app.paraswap.io.png',
    name: 'ParaSwap V4'
  },
  UNISWAP_V2: {
    image: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/app.uniswap.org.png',
    name: 'Uniswap'
  },
  TRACKED_ASSETS: {
    image: 'https://token.enzyme.finance//0xea05f4a383adce7f1e9cc1b6029b51d7260e53aa',
    name: 'Tracked Asset'
  }
}
let tradeType = {
  AddTrackedAssetsTrade: 'Track asset',
  TokenSwapTrade: 'Swap',
  LendAndStakeTrade: 'Deposit and Stake',
  UnstakeAndRedeemTrade: '',
  ClaimRewardsAndReinvestTrade: 'Claim Rewards and Reinvest'
}
export default {
  mixins: [Formatter],
  data () {
    return {
      tab: 'mails',
      trades: [],
      columns: [
        { name: 'date', align: 'left', label: 'Date', field: row => (new Date(row.timestamp * 1000)).toLocaleString() },
        { name: 'exchange', align: 'left', label: 'exchange', field: row => exchanges[row.adapter.identifier] },
        { name: 'type', align: 'left', label: 'type', sortable: true, field: val => tradeType[val.__typename] },
        { name: 'trade', align: 'left', label: 'Trade', field: row => row, format: val => `${val}` },
        // { name: 'rate', align: 'left', label: 'Rate', field: row => row },
        { name: 'tx', align: 'left', label: 'Tx', field: row => this.getKeyFormat(row.id) }
      ]
    }
  },
  methods: {
    openURL
  },
  async created () {
    this.trades = await Enzyme.getTrades(this.$route.params.fundID)

    if (this.trades) {
      this.trades = this.trades.filter(o => ['TokenSwapTrade', 'LendAndStakeTraded'].includes(o.__typename))
    }
  }
}
</script>
<style scoped>
a {
text-decoration: none;
}
</style>
<style lang="scss" scoped>
  .dark_theme{
    /deep/ .q-table__title,
    /deep/ .section-title{
        color: #FFF !important;
    }
  }

</style>

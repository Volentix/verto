<template>
  <div>
    <q-tabs v-if="false" v-model="tab" inline-label class="bg-primary text-white shadow-2">
      <q-tab name="all" icon="mail" label="All deposits" />
      <q-tab name="user_deposits" icon="alarm" label="My deposit" />
    </q-tabs>
    <q-table
      flat
      :dark="$store.state.settings.lightMode === 'true'"
      table-style="box-shadow: none;"
      :data="deposits"
       @row-click="onRowClick"
      :columns="columns"
      no-data-label="No investments have been made for this account"
    >

      <template v-slot:body-cell-asset="props">
        <q-td v-if="props.row.denominationAsset && props.row.denominationAsset.id" :props="props" class="body-table-col ">
          <div class="col-3 flex row items-center">
            <span class="imgs q-mr-lg"> 
              <img style="width: 40px;" :src="'https://env.enzyme.finance/ethereum/assets/' + props.row.denominationAsset.id + '/logo.png'" alt="">
            </span>
            <span class="column pairs">
              <span class="pair text-bold">{{props.row.name}}</span>
              <span :class="{
                'text-grey-5': $store.state.settings.lightMode === 'true',
                'text-light-blue-9': $store.state.settings.lightMode === 'true'
                }" class="value text-capitalize">{{props.row.denominationAsset.symbol}}</span>
            </span>
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>
<script>

import Enzyme from '../../../util/Staider/Enzyme'
import Formatter from '../../../mixins/Formatter'
import { openURL } from 'quasar'

export default {
  mixins: [Formatter],
  props: ['userAddress'],
  data () {
    return {
      tab: 'mails',
      deposits: [],
      columns: [
        { name: 'asset', align: 'left', label: 'Fund', field: row => row.name, sortable: true, format: val => `${val}` },
        { name: 'myShares', align: 'left', label: 'My Shares', field: 'investorShares', sortable: true, format: val => `${this.formatNumber(val, 2)}` },
        { name: 'sharePrice', align: 'left', label: 'Share Price', field: row => row.calculations.USD.price, sortable: true, format: val => `$${this.formatNumber(val, 2)}` },
        { name: 'value', align: 'left', label: 'Value', field: row => row.calculations.USD.price * row.investorShares, sortable: true, format: val => `$${this.formatNumber(val, 2)}` },
        { name: 'apy', align: 'left', label: 'APY', field: row => row.performance['1y'].USD.price * 100, sortable: true, classes: row => row.performance['1y'].USD.price < 0 ? 'text-pink-12' : 'text-green-6', format: val => `${this.formatNumber(val, 2)}%` }
        /* { name: 'depositor', align: 'left', label: 'Actor', field: row => this.getKeyFormat(row.investor.id), sortable: true, format: val => `${val}` },
        { name: 'shares', align: 'left', label: 'Shares', field: row => row.shares, sortable: true, format: val => `${this.formatNumber(val, 4)}` },
        { name: 'price', align: 'left', label: 'Price', field: row => '$' + row.fundState.currencyPrices.find(o => o.currency.id === 'USD').price, sortable: true, format: val => `${val}` },
        { name: 'date', align: 'left', label: 'Date', field: row => (new Date(row.timestamp * 1000)).toLocaleString(), sortable: true, format: val => `${val}` },
        { name: 'tx', align: 'left', label: 'Tx', field: row => this.getKeyFormat(row.transaction.id), sortable: true, format: val => `${val}` } */
      ]
    }
  },
  methods: {
    openURL,
    onRowClick (evt, row) {
      this.$router.push('/staider/fund/' + row.address)
    }
  },
  async created () {
    let data = (await Enzyme.getUserInvestments(this.userAddress))
    if (data && data.funds) {
      this.deposits = data.funds
      this.$emit('setInvestorData', data)
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
/deep/ .q-table tbody td {
    font-size: 17px;
}
</style>

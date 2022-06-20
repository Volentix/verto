<template>
  <div>

    <q-table
      flat
      :dark="$store.state.settings.lightMode === 'true'"
      table-style="box-shadow: none;"
      :data="userDeposits"
      :visible-columns="visibleColumns"
      :columns="columns"
      row-key="date"
     :no-data-label="'No '+(action == 'deposits' ? 'deposits' : 'withdrawals')+' have been made for this account'"
    >
      <template v-slot:body-cell-depositor="props">
        <q-td v-if="props.row.investor && props.row.investor.id"  :props="props" class="body-table-col ">
          <q-btn dense color="white" flat @click="openURL('https://etherscan.io/address/'+props.row.investor.id)" size="sm" icon-right="open_in_new" :text-color="$store.state.settings.lightMode === 'true' ? 'white':'black'" :label="getKeyFormat(props.row.investor.id)" />
        </q-td>
      </template>
      <template v-slot:body-cell-tx="props">
        <q-td v-if="props.row.transaction && props.row.transaction.id" :props="props" class="body-table-col ">
          <q-btn dense color="white" flat @click="openURL('https://etherscan.io/tx/'+props.row.transaction.id)" size="sm" icon-right="open_in_new" :text-color="$store.state.settings.lightMode === 'true' ? 'white':'black'" :label="getKeyFormat(props.row.transaction.id)" />
        </q-td>
      </template>
      <template v-slot:body-cell-asset="props">
        <q-td v-if="props.row.asset && props.row.asset.id" :props="props" class="body-table-col ">
          <div class="col-3 flex row items-center">
            <span class="imgs q-mr-sm">
              <img style="width: 30px;" :src="'https://env.enzyme.finance/ethereum/assets/' + props.row.asset.id + '/logo.png'" alt="">
            </span>
            <span class="column pairs">
              <span class="pair text-bold">{{props.row.asset.symbol}}</span>

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

export default {
  props: ['funds', 'action', 'userAddress'],
  mixins: [Formatter],
  computed: {
    userDeposits () {
      let u = []
      if (this.deposits) {
        u = this.deposits.filter(o => (this.action ? [(this.action === 'deposits' ? 'SharesBoughtEvent' : 'SharesRedeemedEvent')] : ['SharesBoughtEvent', 'SharesRedeemedEvent']).includes(o.__typename))

        u = u.filter(c => !this.userAddress || c.investor.id.toLowerCase() === this.userAddress.toLowerCase()).map(d => {
          if (d.__typename === 'SharesRedeemedEvent') {
            d.investmentAmount = this.formatNumber(d.shares, 4)
          }
          return d
        })
      }

      return u
    }
  },
  data () {
    return {
      tab: 'mails',
      visibleColumns: ['asset', 'Amount', 'depositor', 'shares', 'price', 'date', 'tx'],
      deposits: [],
      columns: [
        { name: 'asset', align: 'left', label: 'Asset', field: row => row.name, sortable: true, format: val => `${val}` },
        { name: 'Amount', align: 'left', label: 'Amount', field: 'investmentAmount', sortable: true, format: val => `${this.formatNumber(val, 4)}` },
        { name: 'depositor', align: 'left', label: 'Actor', field: row => this.getKeyFormat(row.investor.id), sortable: true, format: val => `${val}` },
        { name: 'shares', align: 'left', label: 'Shares', field: row => row.shares, sortable: true, format: val => `${this.formatNumber(val, 4)}` },
        { name: 'price', align: 'left', label: 'Price', field: row => '$' + row.fundState.currencyPrices.find(o => o.currency.id === 'USD').price, sortable: true, format: val => `${val}` },
        { name: 'date', align: 'left', label: 'Date', field: row => (new Date(row.timestamp * 1000)).toLocaleString().substring(0, 9), sortable: true, format: val => `${val}` },
        { name: 'tx', align: 'left', label: 'Tx', field: row => this.getKeyFormat(row.transaction.id), sortable: true, format: val => `${val}` }
      ]
    }
  },
  methods: {
    openURL
  },
  async created () {
    if (this.funds) {
      this.visibleColumns = ['asset', 'Amount', 'shares', 'price', 'date', 'tx']
      let data = this.funds.map(async f => {
        this.deposits = this.deposits.concat(await Enzyme.getDeposits(f.address))

        return f
      })
      await Promise.all(data)
    } else {
      this.deposits = await Enzyme.getDeposits(this.$route.params.fundID)
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

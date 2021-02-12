<template>
  <div>
     <VolentixLiquidity :showLiquidity="true" v-if="openDialog" />
      <q-table :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" :pagination="initialPagination"  :loading="!$store.state.investment.eosPools.length" :grid="$q.screen.xs" title="Explore Opportunities" :data="$store.state.investment.eosPools" :columns="columns" row-key="index" :filter="filter" :filter-method="filterTable" flat class="desktop-card-style current-investments explore-opportunities">
            <template v-slot:body-cell-name="props">
              <q-td :props="props" class="body-table-col">
                  <div class="col-3 flex items-center">
                      <span class="imgs q-mr-lg" >
                          <img style="width:30px;" v-for="(icon) in props.row.images" :key="icon" :src="icon" alt="">
                      </span>
                      <span class="column pairs">
                          <span class="pair">{{props.row.pool1.quantity.symbol.code().to_string()}} + {{props.row.pool2.quantity.symbol.code().to_string()}} </span>

                      </span>
                  </div>
              </q-td>
          </template>

          <template v-slot:body-cell-action="props">
              <q-td :props="props" class="body-table-col">
                  <div class="col-2 flex justify-end">

                      <q-btn  unelevated @click=" $store.commit('settings/setDex', {
                            dex: 'defibox',
                            destinationCoin: {
                              value : props.row.pool2.quantity.symbol.code().to_string()
                            },
                            depositCoin: {
                              value : props.row.pool1.quantity.symbol.code().to_string()
                            }
                          }); openDialog = true; $store.commit('investment/setSelectedEOSPool', props.row);" class="qbtn-custom q-pl-sm q-pr-sm q-mr-sm" color="black" text-color="grey" label="Add Liquidity" />
                  </div>
              </q-td>
          </template>

          <template v-slot:top-right>
              <q-input borderless dense :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" filled debounce="300" v-model="filter" placeholder="Search">
                  <template v-slot:append>
                      <q-icon name="search" />
                  </template>
              </q-input>
          </template>
      </q-table>

  </div>
</template>
<script>
import VolentixLiquidity from '../Exchange/VolentixLiquidity'
import {
  EosRPC //, EosAPI
} from '@/util/EosInterac'
import { asset } from 'eos-common'
import { preparePool } from '@/util/VolentixPools'
// const api = new EosAPI('5JDCvBSasZRiyHXCkGNQC7EXdTNjima4MXKoYCbs9asRiNvDukc', 'http://140.82.56.143:8888')
const testnetRpc = new EosRPC('http://140.82.56.143:8888')
import DexInteraction from '../../../mixins/DexInteraction'
export default {
  components: {
    VolentixLiquidity
  },
  props: ['showAddLiquidity'],
  data () {
    return {
      eosAccount: 'berthonytha1',
      tokensBalance: [],
      openChannels: [],
      tab: 'tokens',
      balanceStatus: 'Fetching...',
      balances: {

      },
      tokenInfos: {
        chain: ''
      },
      initialPagination: {
        rowsPerPage: 10
      },
      poolsData: [],
      filter: '',
      columns: [{
        name: 'index',
        required: true,
        label: '#',
        align: 'left',
        field: 'index',
        format: val => `${val + 1}`,
        sortable: true
      },
      {
        name: 'name',
        required: true,
        label: 'Available pools',
        align: 'left',
        field: row => row,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: 'Supply',
        align: 'center',
        label: 'Supply',
        field: 'supply',
        sortable: true,
        format: val => `${parseInt(val.amount).toLocaleString() + ' ' + val.symbol.code()}`
      },
      {
        name: 'Max Supply',
        label: 'Max Supply',
        field: 'max_supply',
        sortable: true,
        format: val => `${parseInt(val.split(' ')[0]).toLocaleString()}`
      }, {
        name: 'token',
        label: 'Token',
        field: 'max_supply',
        sortable: true,
        format: val => `${val.split(' ')[1]}`
      }, {
        name: 'fees',
        label: 'Fees(24h)',
        field: 'fee',
        sortable: true,
        format: val => `${val * 0.01}`

      },
      {
        name: 'action',
        label: '',
        sortable: false
      }
      ],
      openDialog: false

    }
  },
  methods: {
    async  getBalance (currency, contract) {
      let balance = (await testnetRpc.rpc.get_currency_balance(contract, this.eosAccount, currency))[0]
      this.$set(this.balances, currency + '_' + contract, balance)
    },
    filterTable (rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : ''
      return rows.filter(
        row => row.poolName.toLowerCase().includes(lowerTerms)
      )
    }
  },
  async created () {
    this.openDialog = this.showAddLiquidity

    if (!this.$store.state.investment.eosPools.length) {
      this.accounts = await testnetRpc.getTableByScope(
        'vpools2',
        'stat',
        'accounts'
      )
      this.$store.commit('investment/setEOSPools', [])

      this.accounts.forEach(async o => {
        let balances = await testnetRpc.getTable(
          'vpools2',
          o.payer,
          'accounts'
        )
        this.coins = this.getAllCoins()
        balances.forEach(async (o, i) => {
          let token = asset(o.balance)
          let pool = await testnetRpc.getTable(
            'vpools2',
            token.symbol.code().to_string(),
            'stat'
          )
          // pool[0].pool2.quantity = '4.3898 EOS'
          // pool[0].pool1.quantity = '7.7223 USD'
          // pool[0].fee = 1
          pool[0].index = i
          pool[0].images = []
          let image = this.coins.find((w) => w.value.toLowerCase() === pool[0].pool1.quantity.split(' ')[1].toLowerCase())
          if (image) { pool[0].images.push(image.image) }
          image = this.coins.find((w) => w.value.toLowerCase() === pool[0].pool2.quantity.split(' ')[1].toLowerCase())
          if (image) { pool[0].images.push(image.image) }
          // pool[0].image = coins.find((w) => w.value.toLowerCase() === token.balance.quantity.split(' ')[1].toLowerCase()).image
          if (pool[0]) {
            this.$store.commit('investment/updateEOSPools', preparePool(pool[0]))
          }
        })
      })
    }
  },
  mixins: [DexInteraction]
}
</script>
<style >
 .qbtn-custom {
    border-radius: 30px;
    height: 34px;
    background: #eff5f9 !important;
}
</style>

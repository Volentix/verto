<template>
  <div>
    <div :visible="true" class="bg-grey-11" style="height: 838px;">
      <q-table :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" :pagination="initialPagination"  :loading="!$store.state.investment.eosPools.length" :grid="$q.screen.xs" title="Investments" :data="$store.state.investment.testnetEOSInvestments" :columns="columns" row-key="index" :filter="filter" :filter-method="filterTable" flat class="desktop-card-style current-investments explore-opportunities">
            <template v-slot:body-cell-name="props">
              <q-td :props="props" class="body-table-col">
                  <div class="col-3 flex items-center">
                      <span class="imgs q-mr-lg" >
                          <img style="width:30px;" v-for="(icon) in props.row.images" :key="icon" :src="icon" alt="">
                      </span>
                      <span class="column pairs">
                          <span class="pair">{{props.row.pool1.quantity.split(' ')[1]}} + {{props.row.pool2.quantity.split(' ')[1]}} </span>

                      </span>
                  </div>
              </q-td>
          </template>

          <template v-slot:body-cell-action="props">
              <q-td :props="props" class="body-table-col">
                  <div class="col-2 flex justify-end">
                      <q-btn unelevated @click="$store.commit('investment/setSelectedPool', props.row); openDialog = true" class="qbtn-custom q-pl-sm q-pr-sm q-mr-sm" color="black" text-color="grey" label="Add Liquidity" />
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
    <q-dialog v-model="openDialog">
        <AddLiquidityDialog :notWidget="true" v-if="$store.state.investment.selectedPool" />
    </q-dialog>
  </div>
</template>
<script>
import {
  EosRPC //, EosAPI
} from '@/util/EosInterac'

let testnetRpc
import DexInteraction from '../../../mixins/DexInteraction'
export default {
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
        name: 'balance',
        align: 'center',
        label: 'Balance',
        field: 'balance',
        sortable: true
      },
      {
        name: 'liquidity',
        label: 'Modify liquidity',
        field: row => row,
        sortable: true
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
    testnetRpc = new EosRPC(process.env[this.$store.state.settings.network].EOS_HISTORYAPI)

    if (!this.$store.state.investment.testnetEOSInvestments.length) {
      this.coins = this.getAllCoins()
      this.tokensBalance = await testnetRpc.getTable('vpools2', this.eosAccount, 'accounts')

      this.tokensBalance.forEach(async (token, index) => {
        let data = (await testnetRpc.getTable('vpools2', token.balance.split(' ')[1], 'stat'))[0]
        data.index = index
        this.tokensBalance[index].images = []
        this.tokensBalance[index].images.push(this.coins.find((w) => w.value.toLowerCase() === data.pool1.quantity.split(' ')[1].toLowerCase()).image)
        this.tokensBalance[index].images.push(this.coins.find((w) => w.value.toLowerCase() === data.pool2.quantity.split(' ')[1].toLowerCase()).image)
        this.tokensBalance[index] = { ...this.tokensBalance[index], ...data }
        console.log(this.tokensBalance[index])
        this.$store.commit('investment/updateTestnetEOSInvestments', this.tokensBalance[index])
      })
    }
  },
  mixins: [DexInteraction]
}
</script>

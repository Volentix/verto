<template>
<div>
    <q-table :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" :loading="$store.state.investment.tableLoading" :grid="$q.screen.xs" title="EOS ivestments" :data="$store.state.investment.eosInvestments" :columns="columns" row-key="index" :filter="filter" :filter-method="filterTable" flat class="desktop-card-style current-investments explore-opportunities">
        <template v-slot:body-cell-asset="props">
            <q-td :props="props" class="body-table-col">
                <div class="col-3 flex items-center">
                    <span class="imgs q-mr-lg">
                        <img :src="'https://ndi.340wan.com/eos/'+ props.row.contract0 +'-'+ props.row.symbol0.toLowerCase() +'.png'" alt="">
                        <img :src="'https://ndi.340wan.com/eos/'+ props.row.contract1 +'-'+ props.row.symbol1.toLowerCase() +'.png'" alt="">
                    </span>
                    <span class="column pairs">
                        <span class="pair">{{props.row.symbol0 + ' + ' + props.row.symbol1}}</span>

                    </span>
                    <q-chip color="cyan-7" text-color="white" class="cursor-pointer" @click.native="stakeData = props.row ; openDialog = true">
                        Unstake
                    </q-chip>

                </div>
            </q-td>
        </template>
        <template v-slot:top-right>
            <q-input :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
        </template>
    </q-table>
    <q-dialog v-model="openDialog">
        <EOSStakingDialog :notWidget="true" :stakeData="stakeData" />
    </q-dialog>
</div>
</template>

<script>
import {
  mapState
} from 'vuex'
import EOSStakingDialog from './EOSStakingDialog'
export default {
  components: {
    EOSStakingDialog
  },
  data () {
    return {
      openDialog: false,
      poolsData: [],
      stakeData: null,
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
        name: 'asset',
        required: true,
        label: 'Asset',
        align: 'left',
        field: row => row,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: 'capital',
        align: 'center',
        label: 'Capital',
        field: row => row.count0 + ' ' + row.symbol0 + ' / ' + row.count1 + ' ' + row.symbol1

      },
      {
        name: 'token',
        align: 'center',
        label: 'Token',
        field: row => row.token + ' ' + row.code

      },
      {
        name: 'owner',
        align: 'center',
        label: 'Owner',
        field: 'owner'

      },
      {
        name: 'action',
        label: '',
        sortable: false
      }
      ]

    }
  },
  methods: {
    filterTable (rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : ''
      return rows.filter(
        row => row.label && row.label.toLowerCase().includes(lowerTerms)
      )
    }
  },
  computed: {
    ...mapState('investment', ['zapperTokens', 'poolDataHistory', 'pools'])
  },
  async created () {
    let tableData = await this.$store.state.wallets.tokens
    console.log(tableData, 'tableData')
    let eosAccount = tableData.find(w => w.chain === 'eos' && w.type === 'eos')

    this.$store.dispatch('investment/getEOSInvestments', {
      owner: eosAccount.name
    })
  }
}
</script>

<style lang="scss" scoped>
.desktop-card-style.current-investments .body-table-col .pairs .pair {
    font-weight: 700;
    color: inherit;
    margin-bottom: -2px;
}

.desktop-card-style.current-investments .body-table-col .pairs .value {
    color: #627797;
}

.desktop-card-style.current-investments .body-table-col .imgs {
    margin-top: 5px;
    min-width: 30px;
}

.desktop-card-style.current-investments .body-table-col .imgs img {
    border-radius: 40px;
    height: 25px;
}

.desktop-card-style.current-investments .body-table-col .imgs:first-child img {
    margin-right: -10px;
}

.desktop-card-style.current-investments .qbtn-custom {
    border-radius: 30px;
    height: 34px;
    background: #eff5f9 !important;
}

.desktop-card-style.current-investments .qbtn-custom .q-btn__wrapper {
    min-height: unset;
    padding: 0px 5px;
}

.desktop-card-style.current-investments .qbtn-custom .q-btn__wrapper .q-btn__content {
    text-transform: none;
    font-size: 10px;
}
</style>

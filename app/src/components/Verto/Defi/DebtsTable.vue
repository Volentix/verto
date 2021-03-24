<template>
<div class="full-height">
    <q-table :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" :loading="$store.state.investment.tableLoading" :grid="$q.screen.xs" title="Debts" :data="$store.state.investment.debts" :columns="columns" row-key="index" :filter="filter" :filter-method="filterTable" flat class="desktop-card-style current-debts explore-opportunities full-height">
        <template v-slot:body-cell-asset="props">
            <q-td :props="props" class="body-table-col">
                <div class="col-3 flex items-center">
                    <span class="imgs q-mr-lg">
                      <img  :src="'https://zapper.fi/images/'+props.row.img" alt="">
                     <img  :src="'https://zapper.fi/images/'+props.row.protocolImg" alt="">
                     </span>
                    <span class="column pairs">
                        <span class="pair">{{props.row.label}}</span>
                        <span class="value">{{props.row.protocolDisplay}}</span>
                    </span>
                </div>
            </q-td>
        </template>

        <template v-slot:body-cell-action="props">
            <q-td :props="props" class="body-table-col" v-if="false">
                <div class="col-2 flex justify-end">
                    <q-btn unelevated @click="$store.commit('debt/setSelectedPool', props.row); openDialog = true" class="qbtn-custom q-pl-sm q-pr-sm q-mr-sm" color="black" text-color="grey" label="Add" />
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
</div>
</template>

<script>
import {
  mapState
} from 'vuex'
export default {
  components: {

  },
  data () {
    return {
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
        name: 'asset',
        required: true,
        label: 'Asset',
        align: 'left',
        field: row => row,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: 'balance',
        align: 'center',
        label: 'Balance',
        field: 'balanceUSD',
        sortable: true,
        format: val => `$${val}`
      },
      {
        name: 'value',
        label: 'Value',
        field: 'debtValue',
        align: 'left',
        sortable: true,
        format: val => `$${val.toLocaleString()}`
      },
      {
        name: 'collateral',
        label: 'Collateral',
        field: 'collateralType',
        align: 'left'

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
  }
}
</script>

<style lang="scss" scoped>
.desktop-card-style.current-investments .body-table-col .pairs .pair {
    font-weight: 700;
    color: #2a2a2a;
    margin-bottom: -2px;
}

.desktop-card-style.current-investments .body-table-col .pairs .value {
    color: #627797;
}

.desktop-card-style.current-investments .body-table-col .imgs {
    margin-top: 5px;
    min-width: 30px;
}

 .imgs img {
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
 .q-dark{
  &.current-debts{
    background: #04111F !important;
    // padding: 20px;
    border-radius: 0px;
    // border: 1px solid rgba(#CCC, .2);
  }
}
</style>

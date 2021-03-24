<template>
<div :class="{'dark-theme': $store.state.settings.lightMode === 'true'}" class="full-height">
    <q-table :pagination="initialPagination"  :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" :loading="$store.state.investment.tableLoading" :grid="$q.screen.xs" title="Investments" :data="$store.state.investment.investments" :columns="columns"  :filter="filter" :filter-method="filterTable" flat class="desktop-card-style current-investments explore-opportunities full-height">
        <template v-slot:body-cell-asset="props">
            <q-td :props="props" class="body-table-col">
                <div class="col-3 flex items-center">
                    <span class="imgs q-mr-lg" v-if="props.row.tokens.length">
                        <img v-for="(token, index) in props.row.tokens" :key="index+token.symbol" :src="'https://zapper.fi/images/'+token.symbol+'-icon.png'" alt="">
                    </span>
                    <span class="column pairs">
                        <span class="pair">{{props.row.label}}</span>
                       <span class="value">{{props.row.tokens.map(o => o.balance.toFixed(4)+' '+o.symbol).join(' / ')}}</span>
                    </span>
                    <q-chip outline  color="cyan-7"  text-color="white" v-if="props.row.isStaked">
                        Staked
                    </q-chip>

                </div>
            </q-td>
        </template>

         <template v-slot:body-cell-price="props">
            <q-td :props="props" class="body-table-col">
                <div class="col-3 flex items-center">
                    <span class="column pairs">
                        <span class="value">{{props.row.tokens.map(o => '$' + o.balanceUSD.toFixed(2)+' '+o.symbol).join(' / ')}}</span>
                    </span>
                   </div>
            </q-td>
        </template>

        <template v-slot:body-cell-action="props">
            <q-td :props="props" class="body-table-col" v-if="false">
                <div class="col-2 flex justify-end">
                    <q-btn unelevated @click="$store.commit('investment/setSelectedPool', props.row); openDialog = true" class="qbtn-custom q-pl-sm q-pr-sm q-mr-sm" color="black" text-color="grey" label="Add" />
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
import Formatter from '../../../mixins/Formatter'
export default {
  components: {

  },
  data () {
    return {
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
        name: 'asset',
        required: true,
        label: 'Asset',
        align: 'left',
        field: row => row,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: 'price',
        required: true,
        label: 'USD Equ.',
        align: 'left',
        field: row => row,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: 'protocol',
        align: 'center',
        label: 'Protocol',
        field: 'protocol',
        sortable: true
      },
      {
        name: 'value',
        label: 'Value',
        field: 'balanceUSD',
        sortable: true,
        format: val => `$${this.formatNumber(val, 2)}`
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
  mixins: [Formatter]
}
</script>

<style lang="scss" scoped>
.dark-theme{

}
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
td.text-center {
    text-transform: capitalize;
}
</style>

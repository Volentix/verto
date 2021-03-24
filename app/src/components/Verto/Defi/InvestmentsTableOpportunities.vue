<template>
<div class="full-height">
    <q-table :pagination="initialPagination"  :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" :loading="$store.state.investment.tableLoading" :grid="$q.screen.xs" title="Staking Opportunities" :data="$store.state.investment.investmentOpportunities" :columns="columns" row-key="index" :filter="filter" :filter-method="filterTable" flat class="desktop-card-style current-investments explore-opportunities full-height">
        <template v-slot:body-cell-asset="props">
            <q-td :props="props" class="body-table-col">
                <div class="col-3 flex items-center">
                    <span class="imgs q-mr-lg" v-if="props.row.tokens.length">
                        <img v-for="(token, index) in props.row.tokens" :key="index" :src="'https://zapper.fi/images/'+token.symbol+'-icon.png'" alt="">
                    </span>
                    <span class="column pairs">
                        <span class="pair">{{props.row.label}}</span>
                        <span class="value">${{props.row.balanceUSD.toFixed(4)}}</span>
                    </span>
                    <q-chip color="cyan-7" text-color="white" class="cursor-pointer" @click.native="$store.commit('investment/setStakeData', props.row.index); openDialog = true">
                        Stake
                    </q-chip>

                </div>
            </q-td>
        </template>
        <template v-slot:body-cell-reward="props">
            <q-td :props="props" class="body-table-col">
                <div class="col-3 flex items-center">
                    <span class="imgs q-mr-lg" v-if="props.row.tokens.length">
                        <img :src="'https://zapper.fi/images/'+props.row.lpRewards.rewardToken+'-icon.png'" alt="">
                    </span>
                    <span class="column pairs">
                        <span class="pair">{{props.row.lpRewards.rewardToken}}</span>

                    </span>

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
        <StakingDialog :notWidget="true" v-if="$store.state.investment.stakeData" />
    </q-dialog>
</div>
</template>

<script>
import {
  mapState
} from 'vuex'
import StakingDialog from './StakingDialog'
export default {
  components: {
    StakingDialog
  },
  data () {
    return {
      initialPagination: {
        rowsPerPage: 10
      },
      openDialog: false,
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
        name: 'pool',
        align: 'center',
        label: 'Pool',
        field: row => row.lpRewards.name,
        sortable: true
      },
      {
        name: 'reward',
        label: 'Reward',
        field: row => row,
        sortable: true,
        format: val => `${Math.round(val)}`
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

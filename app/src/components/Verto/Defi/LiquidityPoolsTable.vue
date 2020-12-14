<template>
  <div>
    <q-scroll-area :visible="true" :class="{'desktop-size': screenSize > 1024, 'mobile-size': screenSize < 1024}">
      <!-- :grid="$q.screen.xs" -->
      <q-table :light="$store.state.lightMode.lightMode === 'false'" :dark="$store.state.lightMode.lightMode === 'true'" :pagination="initialPagination" :loading="!$store.state.investment.pools.length" title="Explore Opportunities" :data="$store.state.investment.pools.slice(0,20)" :columns="columns" row-key="index" :filter="filter" :filter-method="filterTable" flat class="desktop-card-style current-investments explore-opportunities">
        <template v-slot:body-cell-name="props">
          <q-td :props="props" class="body-table-col">
            <div class="col-3 flex items-center">
              <span class="imgs q-mr-lg" v-if="props.row.icons.length">
                <img v-for="(icon, index) in props.row.icons" :key="index" :src="'https://zapper.fi/images/'+icon" alt="">
              </span>
              <span class="column pairs">
                <span class="pair">{{props.row.poolName}}</span>
                <span class="value">{{props.row.platform}}</span>
              </span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-Liquidity="props">
          <q-td :props="props">
            <div class="column items-start justify-center q-pl-md">
              <q-btn v-if="screenSize <= 1024" unelevated @click="$store.commit('investment/setSelectedPool', props.row); openDialog = true" class="qbtn-custom qbtn-custom2 q-pl-sm q-pr-sm q-mr-sm" color="black" text-color="grey" label="Add" />
              <span class="value">{{props.value}}</span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props" class="body-table-col">
            <div v-if="screenSize > 1024" class="col-2 flex justify-end">
              <q-btn unelevated @click="$store.commit('investment/setSelectedPool', props.row); openDialog = true" class="qbtn-custom q-pl-sm q-pr-sm q-mr-sm" color="black" text-color="grey" label="Add" />
            </div>
          </q-td>
        </template>
        <template v-slot:top-right>
          <q-input borderless dense :light="$store.state.lightMode.lightMode === 'false'" :dark="$store.state.lightMode.lightMode === 'true'" filled debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </q-scroll-area>
    <q-dialog v-model="openDialog">
        <AddLiquidityDialog :notWidget="true" v-if="$store.state.investment.selectedPool" />
    </q-dialog>
  </div>
</template>

<script>
import AddLiquidityDialog from './AddLiquidityDialog'
import {
  QScrollArea
} from 'quasar'
import {
  mapState
} from 'vuex'
export default {
  components: {
    AddLiquidityDialog,
    QScrollArea

  },
  props: ['rowsPerPage'],
  data () {
    return {
      initialPagination: {
        rowsPerPage: 10
      },
      poolsData: [],
      screenSize: 0,
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
        name: 'Liquidity',
        align: 'center',
        label: 'Liquidity',
        field: 'liquidity',
        sortable: true,
        format: val => `${typeof val === 'undefined' ? 0 : '$' + parseInt(val).toLocaleString()}`
      },
      {
        name: 'volume',
        label: 'Volume(24h)',
        field: 'volume',
        sortable: true,
        format: val => `${typeof val === 'undefined' ? 0 : '$' + parseInt(val).toLocaleString()}`
      },
      {
        name: 'fees',
        label: 'Fees(24h)',
        field: 'fees',
        sortable: true,
        format: val => `${typeof val === 'undefined' ? 0 : '$' + parseInt(val).toLocaleString()}`
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
  computed: {
    ...mapState('investment', ['zapperTokens', 'poolDataHistory', 'pools'])
  },
  created () {
    this.getWindowWidth()
    if (this.rowsPerPage) { this.initialPagination.rowsPerPage = this.rowsPerPage }
    if (!this.$store.state.investment.zapperTokens.length) {
      this.$store.dispatch('investment/getZapperTokens')
    }
  },
  methods: {
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
      console.log('this.screenSize', this.screenSize)
    },
    filterTable (rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : ''
      return rows.filter(
        row => row.poolName.toLowerCase().includes(lowerTerms)
      )
    }
  }
}

</script>

<style lang="scss" scoped>

.desktop-size{
  height: 338px;
}
.mobile-size{
  height: 818px;
}

.desktop-card-style{
  box-shadow: none !important;
  &:after{
    display: none !important;
  }
}
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
.explore-opportunities{
  .qbtn-custom {
    border-radius: 30px;
    height: 34px;
    width: 70px;
    font-size: 12px !important;
    &.qbtn-custom2 {
      width: 60px;
      height: 30px;
      margin-bottom: 5px;
      margin-right: 0px;
      margin-top: 5px;
      /deep/ .q-btn__wrapper{
        min-height: unset;
      }
    }
  }
  &.dark-theme{
    .qbtn-custom {
      border-radius: 30px;
      height: 34px;
      width: 70px;
      font-size: 12px !important;
      border: 1px solid #627797 !important;
      background: #0a2138 !important;
      &.qbtn-custom2 {
        width: 60px;
        height: 30px;
        margin-bottom: 5px;
        margin-right: 0px;
      }
    }
  }
}
</style>

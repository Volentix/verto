<template>
  <div class="full-height">

      <q-table :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" :pagination="initialPagination" :loading="!$store.state.investment.pools.length" title="Explore Opportunities" :data="chainPools" :columns="columns" row-key="index" :filter="filter" :filter-method="filterTable" flat class="desktop-card-style current-investments explore-opportunities full-height" :class="{'dark-theme': $store.state.settings.lightMode === 'false'}">
        <template v-slot:body-cell-name="props">
          <q-td :props="props" class="body-table-col">
            <div class="col-3 flex items-center">
              <span class="imgs q-mr-lg" v-if="props.row.icons.length">
                <img v-for="(icon, index) in props.row.icons" :key="index" :src="icon" alt="">
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
              <q-btn v-if="screenSize <= 1024" unelevated @click="$store.commit('investment/setSelectedPool', props.row); openDialog = true" class="qbtn-custom qbtn-custom2 q-pl-sm q-pr-sm q-mr-sm" color="black" text-color="grey" label="Add liquidity" />
              <span class="value" v-if="props.row.chain != 'eos'">${{formatNumber(props.value, 0)}}</span>
              <span class="value" v-else>{{props.value}}</span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-volume="props">
          <q-td :props="props">
            <div class="column items-end justify-center q-pl-md">
              <span class="value" v-if="props.row.chain != 'eos'">${{formatNumber(props.value, 0)}}</span>
              <span class="value" v-else>{{props.value}}</span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-fees="props">
          <q-td :props="props">
            <div class="column items-end justify-center q-pl-md">
              <span class="value" v-if="props.row.chain != 'eos'">${{formatNumber(props.value, 0)}}</span>
              <span class="value" v-else>{{props.value}}</span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props" class="body-table-col">
            <div v-if="screenSize > 1024" class="col-2 flex justify-end">
              <q-btn unelevated @click="$store.commit('investment/setSelectedPool', props.row); openDialog = true" class="qbtn-custom q-pl-sm q-pr-sm q-mr-sm text-bold" color="black" text-color="white" label="Add liquidity" />
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

    <q-dialog v-model="openDialog">
        <AddLiquidityDialog :notWidget="true" v-if="$store.state.investment.selectedPool && $store.state.investment.selectedPool.chain == 'eth'" />
       <q-card class="eos-popup" v-else-if="$store.state.investment.selectedPool && $store.state.investment.selectedPool.chain == 'eos'" >
        <Swapeos :pool="$store.state.investment.selectedPool" :notWidget="true" />
        </q-card>
    </q-dialog>
  </div>
</template>

<script>
import AddLiquidityDialog from './AddLiquidityDialog'
import Swapeos from '@/components/Verto/Exchange/Swapeos'

import {
  mapState
} from 'vuex'
import Formatter from '../../../mixins/Formatter'
export default {
  components: {
    AddLiquidityDialog,
    Swapeos
  },
  props: ['rowsPerPage', 'chain', 'asset'],
  data () {
    return {
      initialPagination: {
        rowsPerPage: 10
      },
      poolsData: [],
      screenSize: 0,
      chainPools: [],
      filter: '',
      columns: [
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
          format: val => `${typeof val === 'undefined' ? 0 : val}`
        },
        {
          name: 'volume',
          label: 'Volume(24h)',
          field: 'volume',
          sortable: true,
          format: val => `${typeof val === 'undefined' ? 0 : val}`
        },
        {
          name: 'fees',
          label: 'Fees(24h)',
          field: 'fees',
          sortable: true,
          format: val => `${typeof val === 'undefined' ? 0 : val}`
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
    ...mapState('investment', ['zapperTokens', 'poolDataHistory', 'pools', 'defaultAccount'])
  },
  watch: {
    '$store.state.investment.pools': function () {
      this.chainPools = this.$store.state.investment.pools.filter(o => o.chain === this.chain || !this.chain).slice(0, 30)
    },
    defaultAccount () {
      this.chainPools = this.$store.state.investment.pools.filter(o => o.chain === this.chain || !this.chain).slice(0, 30)
    }
  },
  async created () {
    this.getWindowWidth()

    this.chainPools = this.$store.state.investment.pools.filter(o => o.chain === this.chain || (this.asset && o.poolName.toLowerCase().includes(this.asset.type)) || (!this.chain && !this.asset)).slice(0, 30)
    if (this.rowsPerPage) { this.initialPagination.rowsPerPage = this.rowsPerPage }

    await this.$store.dispatch('investment/getUniswapPools')
  },
  methods: {
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    },
    filterTable (rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : ''
      return rows.filter(
        row => row.poolName.toLowerCase().includes(lowerTerms)
      )
    }
  },
  mixins: [Formatter]
}

</script>

<style lang="scss" scoped>
.eos-popup {
  max-width: 760px;
  width: 100%;
}
/deep/ .row.swdapeos-component--row{
    display: flex;
    justify-content: center;
}
.desktop-size{
  height: 560px  !important;
}
.mobile-size{
  height: 818px !important;
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
    @media screen and (max-width: 1023px) {
      min-width: 48px;
      margin-right: 0px;
    }
}

.desktop-card-style.current-investments .body-table-col .imgs img {
    border-radius: 40px;
    height: 55px;
}

.desktop-card-style.current-investments .body-table-col .imgs:first-child img {
    margin-right: -10px;
}

.desktop-card-style.current-investments .qbtn-custom {
    border-radius: 30px;
    height: 34px;
    text-transform: initial !important;
    background: transparent !important;
    color: #04111F !important;
    border: 1px solid #04111F;
}
.desktop-card-style.current-investments{
  /deep/ .q-table{
    th{
      font-size: 15px;
    }
  }
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
    width: auto;
    font-size: 12px !important;
    text-transform: initial !important;
    &.qbtn-custom2 {
      width: auto;
      height: 30px;
      margin-bottom: 5px;
      margin-right: 0px;
      margin-top: 5px;
      /deep/ .q-btn__wrapper{
        min-height: unset;
      }
    }
  }
  &.q-table--dark{
    .qbtn-custom {
      border-radius: 30px;
      height: 34px;
      width: auto;
      font-size: 12px !important;
      color: #FFF !important;
      border: 1px solid #FFF !important;
      background: transparent !important;
      text-transform: initial !important;
      font-weight: normal;
      &.qbtn-custom2 {
        width: auto;
        height: 30px;
        margin-bottom: 5px;
        margin-right: 0px;
      }
    }
  }
}
</style>

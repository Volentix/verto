<template>
  <div>

      <q-table v-if="assets.length"  @row-click="onRowClick" :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" :pagination="initialPagination" :loading="loaded" :data="assets" :columns="columns" :filter="filter" :filter-method="filterTable" flat class="desktop-card-style current-investments explore-opportunities" :class="{'dark-theme': $store.state.settings.lightMode === 'false', 'chains' : type == 'chains'}">
        <template v-slot:body-cell-name="props">
          <q-td :props="props" class="body-table-col _coin_type cursor-pointer" @click="$emit('showTokenPage', props.row)">
            <div class="col-1 flex items-center">
              <span class="imgs">
                <img :src="props.row.icon" alt="">
              </span>
              <span class="flex items-center pairs thicker">
                <span class="pair q-pr-xs">{{props.row.friendlyType.toUpperCase()}}<q-tooltip>{{props.row.type.toUpperCase()}}</q-tooltip></span> <span class="text-grey"></span><br/>
                <q-item-label class="text-caption chain-label" :class="{'text-white':$store.state.settings.lightMode === 'true'}" >{{props.row.chainLabel.replace('Chain', '')}}</q-item-label>
              </span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-currentPrice="props">
          <q-td :props="props" class="body-table-col _rate_usd">
            <div class="col-3 flex items-center">
              <span class="flex items-center pairs">
                <span class="q-pl-xs qmtxs current_price" :class="{'text-grey-3': $store.state.settings.lightMode === 'true', 'text-grey-8': $store.state.settings.lightMode === 'false'}">${{formatNumber(props.row.rateUsd,2)}}<q-tooltip>Current price</q-tooltip></span>
              </span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-amount="props">
          <q-td :props="props" class="body-table-col">
            <div class="col-3 flex items-center">
              <span class="column items-start">
                <span class="pair q-pr-xs allocation" :class="{'text-grey-3': $store.state.settings.lightMode === 'true', 'text-grey-8': $store.state.settings.lightMode === 'false'}">{{ formatNumber(props.row.percentage, 2)}}% <q-tooltip>% of Portfolio</q-tooltip></span>
                <span class="pair q-pr-xs balance text-bold">
                  {{formatNumber(props.row.amount, 2).split('.')[0]}}.<span :class="{'text-grey-5': $store.state.settings.lightMode === 'true', 'text-grey-8': $store.state.settings.lightMode === 'false'}">{{formatNumber(props.row.amount, 2).split('.')[1]}}</span>
                  {{" "+props.row.friendlyType.toUpperCase()}}<q-tooltip>{{props.row.type.toUpperCase()}}</q-tooltip></span>
              </span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-average_cost="props">
          <q-td :props="props" class="body-table-col">
            <div class="col-3 flex items-center">
              <span class="column items-start">
                <span class="pair q-pr-xs allocation" :class="{'text-grey-3': $store.state.settings.lightMode === 'true', 'text-grey-8': $store.state.settings.lightMode === 'false'}">-</span>
              </span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-usd="props">
          <q-td :props="props" class="body-table-col">
            <div class="col-3 flex items-center">
              <span class="column items-start">
                <span class="pair q-pr-xs balance text-bold">
                  ${{formatNumber(props.row.usd, 2).split('.')[0]}}.<span class="text-grey-5">{{formatNumber(props.row.usd, 2).split('.')[1]}}</span>
                </span>
              </span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-dailyChange="props">
          <q-td :props="props" class="body-table-col _daily_change">
            <div class="col-3 flex items-center">
              <span v-if="props.row.change24h" class="column items-start">
                <span :class="'pair q-pr-xs allocation '+props.row.color">({{props.row.change24hPercentage}})</span>
                <span :class="'pair q-pr-xs balance text-bold '+props.row.color">{{props.row.change24h}}</span>
                <!-- text-pink-12 for red color (- sign) -->
                <!-- text-green-6 for green color (+ sign) -->
              </span>
            </div>
          </q-td>
        </template>
        <template v-slot:top-right>
          <q-input v-if="!tableData" borderless dense :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" filled debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

      </q-table>

  </div>
</template>

<script>
import DexInteraction from '@/mixins/DexInteraction'
import Formatter from '@/mixins/Formatter'
export default {
  props: ['rowsPerPage', 'tableData', 'type'],
  data () {
    return {
      initialPagination: {
        rowsPerPage: this.rowsPerPage
      },
      loaded: true,
      assets: [],
      poolsData: [],
      screenSize: 0,
      filter: '',
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Asset',
          align: 'left',
          field: row => row,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'currentPrice',
          align: 'left',
          label: 'Price',
          field: 'currentPrice',
          format: val => `${this.formatNumber(val, 2)}`,
          sortable: true
        }, {
          name: 'amount',
          align: 'left',
          label: 'Balance',
          field: 'amount',
          sortable: true,
          format: val => `${this.formatNumber(val, 2)}`
        },
        {
          name: 'usd',
          align: 'left',
          label: 'Value',
          field: 'usd',
          format: val => `${this.formatNumber(val, 2)}`,
          sortable: true
        },
        {
          name: 'dailyChange',
          align: 'left',
          label: 'Daily Change',
          field: 'dailyChange',
          format: val => `${val}`,
          sortable: true
        },

        /*  {
          name: 'average_cost',
          align: 'left',
          label: 'Average Cost',
          field: 'average_cost',
          format: val => `${val}`,
          sortable: true
        } , */
        {
          name: 'action',
          label: '',
          sortable: false
        }
      ],
      openDialog: false
    }
  },
  created () {
    this.getWindowWidth()

    this.initAssetTable()
    if (this.type === 'chains') {
      this.columns = this.columns.filter(o => !['currentPrice', 'amount', 'dailyChange'].includes(o.field))
      this.assets.map(c => {
        c.friendlyType = c.label
        c.chainLabel = ''
        c.usd = c.chainTotal
        return c
      })
    }
    this.$bus.$on('selectedChain', () => {
      let chain = localStorage.getItem('selectedChain')

      this.initAssetTable(chain)
    })
  },
  watch: {
    '$store.state.wallets.tokens': function () {
      this.initAssetTable()
    },
    '$store.state.tokens.walletTokensData': function () {
      this.initAssetTable()
    },
    '$store.state.currentwallet.wallet': function (val) {
      this.initAssetTable()
    }
  },
  methods: {
    onRowClick (evt, row) {
      this.$emit('showTokenPage', row)
    },
    getIncomingTransaction (ethAddress) {
      let request = {
        jsonrpc: '2.0',
        id: 0,
        method: 'alchemy_getAssetTransfers',
        params: [
          {
            fromBlock: '0xff',
            toBlock: 'latest',
            fromAddress: '',
            toAddress: ethAddress,
            excludeZeroValue: true
          }
        ]
      }
      this.$axios.post('https://eth-mainnet.alchemyapi.io/v2/Le_8-Zg9gV0p_gRbw3kpCJj94eH6Fjg_', request)
        .then((res) => {
          console.log(res)
        })
    },
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
  },
  mixins: [Formatter, DexInteraction]
}

</script>

<style lang="scss" scoped>
.chain-label {
      font-size: 0.6rem;
}
.desktop-size{
  height: 360px;
}
.mobile-size{
  height: 818px;
}

.desktop-card-style{
  box-shadow: none !important;
  cursor: default;
  &:after{
    display: none !important;
  }
}
.desktop-card-style.current-investments .body-table-col .pairs{
  margin-bottom: -2px;
}
.chains ._coin_type{
    width: 210px !important
}
.desktop-card-style.current-investments .body-table-col{
  &._coin_type{
    width: 110px;
    position: relative;
    .thicker{
      position: absolute;
      left: 50px;
    }
  }
  &._rate_usd{
    width: 150px;
  }
  &._daily_change{
    width: 80px;
  }
}
.desktop-card-style.current-investments .body-table-col .pairs .pair {
    font-weight: 700;
    color: inherit;
    font-size: 14px;
}
.current_price{
  font-size: 12px;
  &.qmtxs{
    margin-top: 1px;
  }
}
.allocation{
  font-size: 12px;
}
.balance{
    font-size: 14px;
}
.desktop-card-style.current-investments .body-table-col .pairs .value {
    color: #627797;
}

.desktop-card-style.current-investments .body-table-col .imgs {
    margin-top: 5px;
    min-width: 20px;
    margin-right: -25px;
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

<template>
  <div>
    <q-scroll-area :visible="true" :class="{'desktop-size': screenSize > 1024, 'mobile-size': screenSize < 1024}">
      <!-- :grid="$q.screen.xs" -->
      <q-table :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" :pagination="initialPagination" :loading="!assets.length" :data="assets" :columns="columns" row-key="index" :filter="filter" :filter-method="filterTable" flat class="desktop-card-style current-investments explore-opportunities" :class="{'dark-theme': $store.state.settings.lightMode === 'false'}">
        <template v-slot:body-cell-name="props">
          <q-td :props="props" class="body-table-col">
            <div class="col-3 flex items-center">
              <span class="imgs">
                <img :src="props.row.icon" alt="">
              </span>
              <span class="flex items-center pairs">
                <span class="pair q-pr-xs">{{props.row.type.toUpperCase()}}</span> <span class="text-grey"></span> <span class="q-pl-xs qmtxs current_price text-grey-8">(${{formatNumber(props.row.rateUsd,2)}}<q-tooltip>Current price</q-tooltip>)</span>
              </span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-amount="props">
          <q-td :props="props" class="body-table-col">
            <div class="col-3 flex items-center">
              <span class="column items-start">
                <span class="pair q-pr-xs allocation text-grey-8">{{ formatNumber(props.row.percentage, 2)}}% <q-tooltip>% of Portfolio</q-tooltip></span>
                <span class="pair q-pr-xs balance text-bold">
                  {{formatNumber(props.row.amount, 2).split('.')[0]}}.<span class="text-grey-8">{{formatNumber(props.row.amount, 2).split('.')[1]}}</span>
                  {{" "+props.row.type.toUpperCase()}}</span>
              </span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-usd="props">
          <q-td :props="props" class="body-table-col">
            <div class="col-3 flex items-center">
              <span class="column items-start">
                <span class="pair q-pr-xs allocation text-green" v-if="props.row.change24h">{{props.row.change24hPercentage}} ({{props.row.change24h}}) <q-tooltip>Daily change</q-tooltip></span>
                <span class="pair q-pr-xs balance text-bold">
                  ${{formatNumber(props.row.usd, 2).split('.')[0]}}.<span class="text-grey-8">{{formatNumber(props.row.usd, 2).split('.')[1]}}</span>
                </span>
              </span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-dailyChange="props">
          <q-td :props="props" class="body-table-col">
            <div class="col-3 flex items-center">
              <span class="column items-start">
                <span class="pair q-pr-xs allocation text-green-6">+1.29%</span>
                <span class="pair q-pr-xs balance text-bold text-green-6">$4.48</span>
                <!-- text-pink-12 for red color (- sign) -->
                <!-- text-green-6 for green color (+ sign) -->
              </span>
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
    </q-scroll-area>
  </div>
</template>

<script>
import {
  QScrollArea
} from 'quasar'
import Formatter from '@/mixins/Formatter'
export default {
  components: {
    QScrollArea
  },
  props: ['rowsPerPage'],
  data () {
    return {
      initialPagination: {
        rowsPerPage: 10
      },
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
          label: 'USD Equivalent',
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
    this.initTable()
  },
  watch: {
    '$store.state.wallets.tokens': function () {
      this.initTable()
    },
    '$store.state.tokens.walletTokensData': function () {
      this.initTable()
    }
  },
  methods: {
    formatNumber (number, tofix) {
      let val = (number / 1).toFixed(tofix).replace(',', ' ')
      val = isNaN(val) ? 'N/A' : val
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    initTable () {
      this.assets = []
      JSON.parse(JSON.stringify(this.$store.state.wallets.tokens)).forEach((token, i) => {
        token.amount = parseFloat(token.amount)
        token.usd = parseFloat(token.usd)

        if (!isNaN(token.amount) && token.amount !== 0) {
          if (this.assets.find(o => o.type === token.type)) {
            let index = this.assets.findIndex(o => o.type === token.type)

            this.assets[index].amount += token.amount
            this.assets[index].usd += isNaN(token.usd) ? 0 : token.usd
            this.assets[index].rateUsd = isNaN(token.usd) ? 0 : (token.usd / token.amount)
            this.assets[index].percentage = this.assets[index].usd / parseFloat(this.$store.state.wallets.portfolioTotal) * 100
            this.assets[index] = this.getHistoricalValue(this.assets[index])
          } else {
            token.percentage = token.usd / parseFloat(this.$store.state.wallets.portfolioTotal) * 100
            token.index = this.assets.length
            token.rateUsd = isNaN(token.usd) ? 0 : (token.usd / token.amount)

            token = this.getHistoricalValue(token)

            this.assets.push(token)
          }
          this.assets.sort((a, b) => parseFloat(b.usd) - parseFloat(a.usd))
        }
      })
    },
    getHistoricalValue (token) {
      let tokenData = this.$store.state.tokens.walletTokensData.find(a => a.symbol === token.type)

      if (tokenData) {
        let change = tokenData.price_change_24h * token.amount
        console.log(change, Math.abs(change), token.type, tokenData, tokenData.price_change_24h, tokenData.price_change_percentage_24h, token.amount)
        token.change24h = (change > 0 ? '+' : '-') + '$' + this.formatNumber(Math.abs(change), 2)
        token.change24hPercentage = (change > 0 ? '+' : '-') + this.formatNumber(Math.abs(tokenData.price_change_percentage_24h), 2) + '%'
      }
      return token
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
  mixins: [Formatter]
}

</script>

<style lang="scss" scoped>

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

<template>
  <div>
    <q-scroll-area :visible="true" :class="{'desktop-size': screenSize > 1024, 'mobile-size': screenSize < 1024}">
      <!-- :grid="$q.screen.xs" -->
      <q-table :light="$store.state.lightMode.lightMode === 'false'" :dark="$store.state.lightMode.lightMode === 'true'" :pagination="initialPagination" :loading="!assets.length" title="Explore Opportunities" :data="assets" :columns="columns" row-key="index" :filter="filter" :filter-method="filterTable" flat class="desktop-card-style current-investments explore-opportunities" :class="{'dark-theme': $store.state.lightMode.lightMode === 'false'}">
        <template v-slot:body-cell-name="props">
          <q-td :props="props" class="body-table-col">
            <div class="col-3 flex items-center">
              <span class="imgs q-mr-lg" >
                <img :src="props.row.icon" alt="">
              </span>
              <span class="column pairs">
                <span class="pair">{{props.row.type.toUpperCase()}}</span>
              </span>
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
  </div>
</template>

<script>
import {
  QScrollArea
} from 'quasar'
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
        label: 'Asset',
        align: 'left',
        field: row => row,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: 'usd',
        align: 'left',
        label: 'USD',
        field: 'usd',
        format: val => `$${val}`,
        sortable: true
      },
      {
        name: 'amount',
        align: 'left',
        label: 'Amount',
        field: 'amount',
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
    }
  },
  methods: {
    initTable () {
      this.assets = []
      this.$store.state.wallets.tokens.forEach((token, i) => {
        if (!isNaN(token.amount) && token.amount !== 0) {
          if (this.assets.find(o => o.type === token.type)) {
            let index = this.assets.findIndex(o => o.type === token.type)
            this.assets[index].amount += this.assets[index].amount ? 0 : token.amount
            this.assets[index].usd += isNaN(token.usd) ? '-' : token.usd
          } else {
            token.index = this.assets.length
            this.assets.push(token)
          }
          this.assets.sort((a, b) => parseFloat(b.usd) - parseFloat(a.usd))
        }
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
  }
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

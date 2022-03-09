<template>
  <div class="full-height">
    <q-table
      style="max-width:800px; "
      :light="$store.state.settings.lightMode === 'false'"
      :dark="$store.state.settings.lightMode === 'true'"
      :pagination="initialPagination"
      :loading="!farm.length"
      title="Explore Opportunities"
      :data="farm"
      :columns="columns"

      :filter="filter"
      :filter-method="filterTable"
      flat
      class="q-pl-lg desktop-card-style current-investments explore-opportunities full-height"
      :class="{ 'dark-theme': $store.state.settings.lightMode === 'false' }"
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props" class="body-table-col">
          <div class="col-3 flex items-center">
            <span class="imgs q-mr-lg">
              <img :src="props.row.icon" alt="" />
            </span>
            <span class="column pairs">
              <span class="pair text-h6">{{ props.row.type }}</span>
              <span v-if="props.row.protocol" class="value">{{
                props.row.protocol
              }}</span>
            </span>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-Liquidity="props">
        <q-td :props="props">
          <div class="column items-start justify-center q-pl-md">
            <q-btn
              v-if="screenSize <= 1024"
              unelevated
              @click="
                $store.commit('investment/setSelectedPool', props.row);
                openDialog = true;
              "
              class="qbtn-custom qbtn-custom2 q-pl-sm q-pr-sm q-mr-sm"
              color="black"
              text-color="grey"
              label="Add liquidity"
            />
            <span class="value" v-if="props.row.chain != 'eos'"
              >${{ formatNumber(props.value, 0) }}</span
            >
            <span class="value" v-else>{{ props.value }}</span>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-volume="props">
        <q-td :props="props">
          <div class="column items-end justify-center q-pl-md">
            <span class="value" v-if="props.row.chain != 'eos'"
              >${{ formatNumber(props.value, 0) }}</span
            >
            <span class="value" v-else>{{ props.value }}</span>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-apy="props">
        <q-td :props="props">
          <div class="column items-end justify-center q-pl-md">
            <span class="value text-h6 text-green">{{ props.value }}%</span>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props" class="body-table-col">
          <div v-if="screenSize > 1024" class="col-2 flex ">
            <q-btn
              size="lg"
              unelevated
              @click="
               triggerAction(props.row)
              "
              class="qbtn-custom q-pl-sm q-pr-sm q-mr-sm text-bold"
              color="black"
              text-color="white"
              :label="props.row.action"
            />
            <q-btn
              v-if="props.row.buy"
              outline
              rounded
              unelevated
              @click="tokenAction(props.row)"
              class="q-pl-sm q-pr-sm q-mr-sm text-bold"

              :label="'Buy ' + props.row.type"
            />
          </div>
        </q-td>
      </template>
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          :light="$store.state.settings.lightMode === 'false'"
          :dark="$store.state.settings.lightMode === 'true'"
          filled
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>

    <q-dialog v-model="openDialog" v-if="error.msg">

     <q-card :dark="$store.state.settings.lightMode === 'true'" class="text-body1">
      <q-toolbar >
        <q-toolbar-title><span class="text-weight-bold q-pl-sm">Before you {{error.data.token.action.toLowerCase()}}</span></q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>
      <div class="q-pa-md">
         {{error.msg}}
      </div>
      <div class="q-pa-md">
     <q-btn outline @click="$router.push(getImportLink(error.data.token.chain))" class="q-mr-md" :label="'Import '+error.data.token.chain+' wallet'" />
     <q-btn  @click="tokenAction(error.data.token)"  outline :label="'Buy '+error.data.token.type" />
     </div>
     </q-card>

    </q-dialog>
  </div>
</template>

<script>

import Formatter from '../../../mixins/Formatter'
export default {

  props: ['rowsPerPage', 'chain', 'asset'],
  data () {
    return {
      initialPagination: {
        rowsPerPage: 10
      },
      poolsData: [],
      error: {
        msg: null,
        data: {
          token: null,
          import: true,
          buy: true
        }
      },
      farm: [
        {
          apy: '19',
          chain: 'terra',
          chainLabel: 'Terra',
          protocol: 'Anchor Protocol',
          type: 'UST',
          icon: 'https://assets.terra.money/icon/60/UST.png',
          action: 'Deposit',
          experience: 'deposit_ust',
          buy: true
        },
        {
          apy: '39',
          chain: 'eth',
          chainLabel: 'Ethereum',

          type: 'HEX',
          icon:
            'https://s2.coinmarketcap.com/static/img/coins/200x200/5015.png',
          action: 'Stake',
          buy: true,
          actionTrigger: {
            type: 'link',
            path: '/verto/stake/eth/hex'
          }
        },
        {
          apy: '8',
          chain: 'eth',
          chainLabel: 'Ethereum',
          protocol: 'Enzyme',
          type: 'Staider Index Funds',
          icon:
            'http://newstaider-dev.s3-website-us-east-1.amazonaws.com/statics/staider/sif_logo_white.svg',
          action: 'Deposit'

        },
        {
          apy: '20',
          chain: 'eos',
          chainLabel: 'EOS',
          protocol: 'Volentix',
          type: 'VTX',
          icon:
            'data:image/png;base64,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',
          action: 'Stake',
          actionTrigger: {
            type: 'link',
            path: '/verto/stake/eos/vtx'
          },
          buy: true
        }
      ],
      screenSize: 0,
      chainPools: [],
      filter: '',
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Token',
          align: 'left',
          field: row => row,
          format: val => `${val}`,
          sortable: true
        },

        {
          name: 'chain',
          align: 'left',
          label: 'Chain',
          field: 'chainLabel',
          sortable: true
        },
        {
          name: 'apy',
          label: 'APY',
          field: 'apy',
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
    // ...mapState('investment', ['zapperTokens', 'poolDataHistory', 'pools', 'defaultAccount'])
  },
  watch: {},
  async created () {
    this.getWindowWidth()

    // this.chainPools = this.$store.state.investment.pools.filter(o => o.chain === this.chain || (this.asset && o.poolName.toLowerCase().includes(this.asset.type)) || (!this.chain && !this.asset)).slice(0, 30)
    // if (this.rowsPerPage) { this.initialPagination.rowsPerPage = this.rowsPerPage }

    // await this.$store.dispatch('investment/getUniswapPools')
  },
  methods: {
    tokenAction (token, action = 'buy', experience = 'exchange') {
      this.setDefaultWallet(token.chain)
      token.type = token.type.toUpperCase()
      setTimeout(() => {
        this.$router.push({
          name: 'crosschain-exchange',
          params: { asset: token, after_experience: experience === 'exchange' ? token.after_experience : null, action: action, experience: experience }
        })
      }, 100)
    },
    triggerAction (token) {
      let found = this.$store.state.wallets.tokens.find(o => o.type.toLowerCase() === token.type.toLowerCase() && o.chain === token.chain.toLowerCase())
      if (!found) {
        this.error.msg = 'You seems very excited to ' + token.action.toLowerCase() + ' ' + token.type + '. However your wallet balance for this token is zero.'
        this.error.data.token = token
        this.openDialog = true
        return
      }

      if (token.actionTrigger && token.actionTrigger.type === 'link') {
        this.setDefaultWallet(token.chain)
        this.$router.push(token.actionTrigger.path)
      } else if (token.experience === 'deposit_ust') {
        this.tokenAction(token, 'sell', token.experience)
      }
    },
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    },
    filterTable (rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : ''
      return rows.filter(row => row.type.toLowerCase().includes(lowerTerms))
    }
  },
  mixins: [Formatter]
}
</script>

<style lang="scss" scoped>
/deep/ .q-dark {
    background: #04121f;
}
.eos-popup {
  max-width: 760px;
  width: 100%;
}
/deep/ .row.swdapeos-component--row {
  display: flex;
  justify-content: center;
}
.desktop-size {
  height: 560px !important;
}
.mobile-size {
  height: 818px !important;
}

.desktop-card-style {
  box-shadow: none !important;
  &:after {
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
  height: 49px;
  text-transform: initial !important;
  background: transparent !important;
  color: #04111f !important;
  border: 1px solid #04111f;
}
.desktop-card-style.current-investments {
  /deep/ .q-table {
    th {
      font-size: 15px;
    }
  }
}
.desktop-card-style.current-investments .qbtn-custom .q-btn__wrapper {
  min-height: unset;
  padding: 0px 5px;
}

.desktop-card-style.current-investments
  .qbtn-custom
  .q-btn__wrapper
  .q-btn__content {
  text-transform: none;
  font-size: 10px;
}
.explore-opportunities {
  .qbtn-custom {
    border-radius: 30px;
    height: 34px;
    width: auto;
    font-size: 18px !important;
    text-transform: initial !important;
    &.qbtn-custom2 {
      width: auto;
      height: 30px;
      margin-bottom: 5px;
      margin-right: 0px;
      margin-top: 0px;
      /deep/ .q-btn__wrapper {
        min-height: unset;
      }
    }
  }
  &.q-table--dark {
    .qbtn-custom {
      border-radius: 30px;
      height: 49px;
      width: auto;
      font-size: 18px !important;
      color: #fff !important;
      border: 1px solid #fff !important;
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

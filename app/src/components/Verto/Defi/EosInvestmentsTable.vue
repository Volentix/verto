<template>
  <div class="full-height">
    <q-table v-if="mobile" :pagination="initialPagination" :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" :loading="$store.state.investment.tableLoading" title="EOS ivestments" :data="$store.state.investment.eosInvestments" :columns="columns" row-key="index" :filter="filter" :filter-method="filterTable" flat class="desktop-card-style current-investments current-investments--mobile explore-opportunities full-height">
        <!-- <template v-slot:body-cell-index /> -->
        <template v-slot:body-cell-asset="props">
            <q-td :props="props" class="body-table-col">
                <div class="col-3 flex items-center">
                      <span class="imgs q-mr-lg">
                        <img :src="'https://defibox.s3.ap-northeast-1.amazonaws.com/eos/'+ props.row.contract0 +'-'+ props.row.symbol0.toLowerCase() +'.png'" alt="">
                        <img :src="'https://defibox.s3.ap-northeast-1.amazonaws.com/eos/'+ props.row.contract1 +'-'+ props.row.symbol1.toLowerCase() +'.png'" alt="">
                    </span>
                    <span class="column pairs">
                        <span class="pair">{{props.row.symbol0 + ' + ' + props.row.symbol1}}</span>
                    </span>
                </div>
            </q-td>
        </template>
        <template v-slot:body-cell-capital="props">
            <q-td :props="props" class="body-table-col --action">
                <div class="col-5 flex items-center">
                  <div class="column">
                    <span class="pair">{{props.row.count0 + ' ' + props.row.symbol0 + ' / ' + props.row.count1 + ' ' + props.row.symbol1}}</span>
                    <div class="flex">
                      <q-chip :color="$store.state.settings.lightMode === 'false' ? 'black':'white'" outline text-color="black" @click.native="stakeData = props.row ; openDialog = true">
                        <q-icon name="add"/>
                      </q-chip>
                      <q-chip :color="$store.state.settings.lightMode === 'false' ? 'black':'white'" outline text-color="black" @click.native="stakeData = props.row ; unstakeDialog = true">
                        <q-icon name="remove"/>
                      </q-chip>
                    </div>
                  </div>
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
    <q-table v-else :pagination="initialPagination" :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" :loading="$store.state.investment.tableLoading" title="EOS ivestments" :data="$store.state.investment.eosInvestments" :columns="columns" row-key="index" :filter="filter" :filter-method="filterTable" flat class="desktop-card-style current-investments explore-opportunities full-height">
        <template v-slot:body-cell-asset="props">
            <q-td :props="props" class="body-table-col">
                <div class="col-3 flex items-center">
                      <span class="imgs q-mr-lg">
                        <img :src="'https://defibox.s3.ap-northeast-1.amazonaws.com/eos/'+ props.row.contract0 +'-'+ props.row.symbol0.toLowerCase() +'.png'" alt="">
                        <img :src="'https://defibox.s3.ap-northeast-1.amazonaws.com/eos/'+ props.row.contract1 +'-'+ props.row.symbol1.toLowerCase() +'.png'" alt="">
                    </span>
                    <span class="column pairs">
                        <span class="pair">{{props.row.symbol0 + ' + ' + props.row.symbol1}}</span>
                    </span>
                </div>
            </q-td>
        </template>
         <template v-slot:body-cell-owner="props">
            <q-td :props="props" class="body-table-col">
                <div class="col-3 flex items-center">
                  <q-chip color="black" outline text-color="black" class="cursor-pointer" @click.native="stakeData = props.row ; unstakeDialog = true">
                      <q-icon name="remove"/>
                    </q-chip>
                    <span class="column pairs">
                        <span class="pair">MODIFY</span>
                    </span>
                    <q-chip color="black" outline text-color="black" class="cursor-pointer" @click.native="stakeData = props.row ; openDialog = true">
                      <q-icon name="add"/>
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
        <EOSStakingDialog :notWidget="true" :stakeData="stakeData"  v-if="false"/>
         <q-card class="eos-popup"  >
        <Swapeos v-if="stakeData" :pool="{reserve0 : stakeData.count0 +' '+ stakeData.symbol0 , reserve1 : stakeData.count +' '+ stakeData.symbol1 }" :notWidget="true" />
        </q-card>
    </q-dialog>
    <q-dialog v-model="unstakeDialog">
      <EOSStakingDialog :notWidget="true" :stakeData="stakeData"  />
    </q-dialog>
  </div>
</template>

<script>
import {
  mapState
} from 'vuex'
import EOSStakingDialog from './EOSStakingDialog'
import Swapeos from '@/components/Verto/Exchange/Swapeos'
export default {
  props: {
    mobile: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  components: {
    EOSStakingDialog,
    Swapeos
  },
  data () {
    return {
      openDialog: false,
      unstakeDialog: false,
      initialPagination: {
        rowsPerPage: 10
      },
      poolsData: [],
      stakeData: null,
      filter: '',
      columns: [
        // {
        //   name: 'index',
        //   required: true,
        //   label: '#',
        //   align: 'left',
        //   field: 'index',
        //   format: val => `${val + 1}`,
        //   sortable: true
        // },
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
  watch: {
    '$store.state.investment.eosInvestments': function () {
      this.$store.commit('investment/setTableLoadingStatus', false)
    }
  },
  computed: {
    ...mapState('investment', ['zapperTokens', 'poolDataHistory', 'pools'])
  },
  async created () {
    this.$store.dispatch('investment/getEOSInvestments', {
      owner: this.$store.state.investment.defaultAccount.name
    })
  }
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
.desktop-card-style.current-investments--mobile{
  height: auto !important;
}
.desktop-card-style.current-investments .body-table-col{
  &.--action{
    width: 200px;
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
</style>

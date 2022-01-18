<template>
  <div
    class="row q-gutter-lg text-white"
    v-if="$store.state.currentwallet.user"
  >
    <div class="col-md-4 offset-md-1 q-pa-lg one-row">
      <div class="text-h6 q-pb-md text-center heading summary">
        Portfolio summary
      </div>
      <div class="text-h6 q-pb-md text-center heading heading-h2">
        USD {{ formatNumber(totalPValue, 2) }}
      </div>

      <div
        v-if="false"
        class="profile-nav text-center q-mb-lg"
        @click="
          $store.state.currentwallet && $store.state.currentwallet.user
            ? ''
            : clickBtn('connectBtn')
        "
      >
        <div class="img-otr text-body1 flex">
          <img
            width="30"
            class="nav-prof-img rounded-borders q-mr-md"
            src="https://i.gadgets360cdn.com/large/cryptopunk_6046_twitter_small_1634554158507.jpg"
            alt="Avatar"
          />
          <span
            v-if="$store.state.currentwallet && $store.state.currentwallet.user"
            class="desc heading-SB"
            @click="clickBtn('logoutBtn')"
            >{{ $store.state.currentwallet.user.addressFriendly }}
            <q-icon size="sm" name="logout"
          /></span>
        </div>
      </div>

      <q-list bordered separator>

        <q-item clickable v-ripple>
          <q-item-section class="text-body1">Average APY</q-item-section>
          <q-item-section class="text-h6" :class="{'text-green-6':avApy >= 0,'text-pink-12':avApy < 0 }" side
            >{{ formatNumber(avApy, 2) }}%</q-item-section
          >
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section class="text-body1">Change to date</q-item-section>
          <q-item-section :class="{'text-green-6':changeInceptionUSD >= 0,'text-pink-12':changeInceptionUSD < 0 }" class="text-h6 text-white" side
            >USD {{ formatNumber(changeInceptionUSD, 2) }}</q-item-section
          >
        </q-item>
        <q-item>
           <div  class="flex flex-center chart">
      <PortfolioChart :fundData="myFunds"  v-if="$store.state.currentwallet.user  && myFunds.length" />
      </div>
      </q-item>
        <q-item clickable v-ripple>
          <q-item-section class="text-body1">Average Share Price</q-item-section>
          <q-item-section class="text-h6 text-white" side
            >USD {{ formatNumber(avgSharePrice, 2) }}</q-item-section
          >
        </q-item>

         <q-item clickable v-ripple>
          <q-item-section class="text-body1">This month</q-item-section>
          <q-item-section class="text-h6 text-white" :class="{'text-green-6':changeMonthly >= 0,'text-pink-12':changeMonthly < 0 }" side
            > {{ formatNumber(changeMonthly, 2) }}%</q-item-section
          >
        </q-item>
      </q-list>
    </div>
    <div class="col-md-6 one-row">
      <q-tabs v-model="tab" inline-label align="left" v-if="false">
        <q-tab name="funds" icon="account_balance" label="Funds & Shares" />
        <q-tab name="deposits" icon="add" label="Deposits" />
        <q-tab name="redeem" icon="remove" label="Withdrawals" />
      </q-tabs>
      <div class="text-h6 text-white q-pa-md">My funds</div>
      <MyDeposits  :userAddress="$store.state.currentwallet.user.address"  @setInvestorData="setInvestorData" />
      <div class="text-h6 text-white q-pa-md"  v-if="$store.state.currentwallet.user  && myFunds.length">My deposits</div>
       <Deposits
        :userAddress="$store.state.currentwallet.user.address"
        v-if="$store.state.currentwallet.user  && myFunds.length"
        :action="'deposits'"
        :key="'deposits'"
        :funds="myFunds"

      />
       <div class="text-h6 text-white q-pa-md"  v-if="$store.state.currentwallet.user && myFunds.length">My withdrawals</div>
      <Deposits
        v-if="$store.state.currentwallet.user && myFunds.length"
        :userAddress="$store.state.currentwallet.user.address"
        :action="'redeem'"
        :key="'redeem'"
        :funds="myFunds"

      />
    </div>
  </div>
</template>
<script>
import MyDeposits from './MyDeposits.vue'
import Formatter from '../../../mixins/Formatter'
import Deposits from './Deposits'
import PortfolioChart from './PortfolioChart'
export default {
  components: {
    MyDeposits,
    Deposits,
    PortfolioChart
  },
  mixins: [Formatter],
  data () {
    return {
      totalPValue: 0,
      avApy: 0,
      changeInceptionUSD: 0,
      myFunds: [],
      tab: 'funds',
      avgSharePrice: 0,
      changeMonthly: 0
    }
  },
  methods: {
    setInvestorData (data) {
      if (data && data.funds.length) {
        /*  this.totalPValue = data.funds.map(row => row && row.calculations && row.calculations.USD ? row.calculations.USD.price * row.investorShares : 0)
          .reduce((a, b) => a + b, 0)
        */
        this.myFunds = data.funds
        this.totalPValue = data.aggregate.value.current.USD
        this.avApy = this.myFunds.reduce((a, b) => (a ? a.performance['1y'].USD.price : 0) + (b ? b.performance['1y'].USD.price : 0), 0) * 100 / this.myFunds.length
        this.changeInceptionUSD = data.aggregate.value.current.USD - data.aggregate.value.previous.USD
        this.avgSharePrice = this.myFunds.reduce((a, b) => (a ? a.calculations.USD.price : 0) + (b ? b.calculations.USD.price : 0), 0) / this.myFunds.length
        this.changeMonthly = this.myFunds.reduce((a, b) => (a ? a.performance['1m'].USD.price : 0) + (b ? b.performance['1m'].USD.price : 0), 0) * 100 / this.myFunds.length
      }
    }
  }
}
</script>
<style scoped>
.one-row {
  background: #16243b;
  border-radius: 29px;
}
.img-otr.text-body1.flex {
  background: #648696;
  display: inline-flex;
  border-radius: 10px;
  padding: 5px;
}
.heading-h2 {
  font-size: 40px;
  line-height: 52px;
  font-family: "Montserrat-Bold";
}
.summary {
  color: #009dea;
  font-family: "Montserrat-Bold";
}
/deep/ canvas {
    display: block;
    height: 200px !important ;
    width: auto !important

    }
     .chart {
         width: 200px;
         margin: 0 auto;
    }
</style>

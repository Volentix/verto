<template>
  <div class="q-pa-md">
    <div class="mncright">
      <div class="mncright-left">
        <div class="dashboard-area">
          <div class="dashboard-left">
            <div class="dashboard-left_abc1">
              <p>Arya Wijaya</p>
              <h2>Dashboard</h2>
            </div>

            <div class="dashboard-left_abc2">
              <div class="dashboard-left_abcc1">
                <img
                  :src="require('assets/heartdefi/img/Ethereum-ETH-icon.png')"
                  alt="images not found" />
              </div>
              <div class="dashboard-left_abcc2">
                <h5>
                  Ethereum
                  <sup>#2</sup>
                </h5>
                <h2>
                  $2,400.80
                  <sup>
                    <i class="fas fa-sort-up"></i>
                    0.50%
                  </sup>
                </h2>
              </div>
            </div>

            <div class="dashboard-left_abc3 q-mb-lg">
              <div class="dashboard-left_abbc3">
                <div class="dashboard-left_abbc3a1">
                  <a href="" @click.prevent="">
                    <div class="dashboard-left_abbc3a2">
                      <img
                        :src="require('assets/heartdefi/img/hex-hex.png')"
                        alt="images not found" />
                    </div>
                    <p>Price Alert</p>
                  </a>
                </div>
                <div class="dashboard-left_abbc3a1">
                  <a href="" @click.prevent="">
                    <div class="dashboard-left_abbc3a2">
                      <img
                        :src="require('assets/heartdefi/img/hex-hex.png')"
                        alt="images not found" />
                    </div>
                    <p>Compare</p>
                  </a>
                </div>
                <div class="dashboard-left_abbc3a1">
                  <a href="" @click.prevent="">
                    <div class="dashboard-left_abbc3a2">
                      <img
                        :src="require('assets/heartdefi/img/hex-hex.png')"
                        alt="images not found" />
                    </div>
                    <p>Convert</p>
                  </a>
                </div>
                <div class="dashboard-left_abbc3a1">
                  <a href="" @click.prevent="">
                    <div class="dashboard-left_abbc3a2">
                      <img
                        :src="require('assets/heartdefi/img/hex-hex.png')"
                        alt="images not found" />
                    </div>
                    <p>Watchlist</p>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="dashboard-right">
            <ExchangeForm/>
          </div>
        </div>
        <PortfolioArea/>
        <BitCoinList v-for="i in 2" :key="i"/>
        <DefiList
          v-for="i in 2"
          :key="'defi-'+i"
          :type="i" />
      </div>

      <div class="mncright-right">
        <div class="mncright-right2">
          <RightSideTop/>
          <UpcomingEvents/>
          <RecentTransactions/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ExchangeForm from 'components/heartdefi/ExchangeForm'
import PortfolioArea from 'components/heartdefi/PortfolioArea'
import BitCoinList from 'components/heartdefi/BitCoinList'
import DefiList from 'components/heartdefi/DefiList'
import RightSideTop from 'components/heartdefi/RightSideTop'
import UpcomingEvents from 'components/heartdefi/UpcomingEvents'
import RecentTransactions from 'components/heartdefi/RecentTransactions'
export default {
  mixins: [],
  components: {
    ExchangeForm,
    BitCoinList,
    DefiList,
    RightSideTop,
    UpcomingEvents,
    RecentTransactions,
    PortfolioArea
  },
  data () {
    return {

    }
  },
  watch: {

  },
  computed: {

  },
  created () {

  },
  mounted () {

  },
  methods: {

  },
  destroyed () {

  }

}
</script>

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
                  :src="require('assets/Heartdefi/img/Ethereum-ETH-icon.png')"
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
                        :src="require('assets/Heartdefi/img/hex-hex.png')"
                        alt="images not found" />
                    </div>
                    <p>Price Alert</p>
                  </a>
                </div>
                <div class="dashboard-left_abbc3a1">
                  <a href="" @click.prevent="">
                    <div class="dashboard-left_abbc3a2">
                      <img
                        :src="require('assets/Heartdefi/img/hex-hex.png')"
                        alt="images not found" />
                    </div>
                    <p>Compare</p>
                  </a>
                </div>
                <div class="dashboard-left_abbc3a1">
                  <a href="" @click.prevent="">
                    <div class="dashboard-left_abbc3a2">
                      <img
                        :src="require('assets/Heartdefi/img/hex-hex.png')"
                        alt="images not found" />
                    </div>
                    <p>Convert</p>
                  </a>
                </div>
                <div class="dashboard-left_abbc3a1">
                  <a href="" @click.prevent="">
                    <div class="dashboard-left_abbc3a2">
                      <img
                        :src="require('assets/Heartdefi/img/hex-hex.png')"
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
        <AssetsExplorer />

        <AssetList />
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
import Lib from '@/util/walletlib'
import ExchangeForm from '../../components/HeartDefi/ExchangeForm'
import AssetsExplorer from '../../components/Verto/Token/AssetsExplorer'
import AssetList from '../../components/HeartDefi/AssetList'
import DefiList from '../../components/HeartDefi/DefiList'
import RightSideTop from '../../components/HeartDefi/RightSideTop'
import UpcomingEvents from '../../components/HeartDefi/UpcomingEvents'
import RecentTransactions from '../../components/HeartDefi/RecentTransactions'
export default {
  mixins: [],
  components: {
    AssetsExplorer,
    ExchangeForm,
    AssetList,
    DefiList,
    RightSideTop,
    UpcomingEvents,
    RecentTransactions
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
    Lib.setDemoMode()
  },
  mounted () {

  },
  methods: {

  }

}
</script>

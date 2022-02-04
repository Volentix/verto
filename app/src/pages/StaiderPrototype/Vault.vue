<template>
  <div class="vault-section">
    <div class="fluid-container">
      <div class="row justify-between items-center">
        <div class="col flex vault-dropdown-col text-white">
          <q-btn-dropdown
            class="vault-dropdown-wrapper-btn" :class="{'active': toggleActive}"
            flat
            @click="toggleActive = !toggleActive"
            @hide="toggleActive = false"
            dark
            content-class="vault-dropdown-wrapper"
          >
            <template v-slot:label>
              <div class="flex text-white justify-start">
                <span class="imgs q-mr-md flex flex-center">
                  <img height="45" :src="currentVault.vaultIcon" alt="">
                </span>
                <span class="column pairs vault-name justify-center">
                  <span class="pair">Vault</span>
                  <span class="value text-capitalize">{{currentVault.vault}}</span>
                </span>
              </div>
            </template>
            <div class="column no-wrap dropdown-content">
              <div class="column nav q-pa-md text-white">
                <router-link to="/funds" class="text-white">Explore funds</router-link>
                <router-link to="/faq" class="text-white">FAQs</router-link>
              </div>
              <q-separator dark horizontal inset class="q-mx-none" />
              <div class="column items-center q-pa-md">
                <q-btn
                  color="white"
                  label="Disconnect"
                  rounded
                  @click="connected = false;connectingMetamask = false;connectingWalletConnect = false;toggleActive = false"
                  no-caps
                  flat
                  icon="img:statics/staider/icon_disconnect.svg"
                  class="full-width disconnect-btn"
                  v-close-popup
                />
              </div>
            </div>
          </q-btn-dropdown>
        </div>
        <div class="col column items-center share-price-wrapper text-white">
          <span class="label">Share Price</span>
          <span class="value">{{currentVault.sharePrice}} <small>$US</small></span>
          <span class="daily-change">Daily change: <b :class="currentVault.dailyChangeStyle">{{currentVault.dailyChange}}</b></span>
          <q-btn color="white" class="" no-caps text-color="white" outline rounded label="Whitelist to deposit" />
        </div>
        <div class="col network-wrapper text-white">
          <span class="column pairs items-end">
            <span class="pair flex items-center net-label"><img width="11" :src="'statics/staider/networks/'+currentVault.network+'.svg'" class="q-mr-sm" alt=""> Network</span>
            <span class="pair text-bold net-value">{{currentVault.network}}</span>
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-12"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import VueApexCharts from 'vue-apexcharts'
export default {
  name: 'VaultPage',
  components: {
    // apexcharts: VueApexCharts
  },
  data () {
    return {
      currentVault: {
        vaultIcon: 'statics/staider/sif_logo_white.svg',
        icon: 'statics/staider/coins/usdc.svg',
        vault: 'SIF USDC',
        denominationCoin: 'USDC',
        investors: '256',
        assetsUnderManagment: '23,505.28',
        sharePrice: '0.82',
        apy: '-3.89%',
        apyStyle: 'red',
        dailyChange: '-3.80%',
        dailyChangeStyle: 'red',
        network: 'Ethereum'
      },
      columns: [
        { headerClasses: 'th-header-style', name: 'vault', label: 'Vault', align: 'left', field: row => row.name, sortable: false, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'myshares', label: 'My Shares', align: 'left', field: row => row.name, sortable: false, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'sharePrice', label: 'Share Price', align: 'left', field: row => row.name, sortable: false, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'value', label: 'Value', align: 'left', field: row => row.name, sortable: false, format: val => `${val}` },
        { headerClasses: 'th-header-style', name: 'apy', label: 'APY', align: 'left', field: row => row.name, sortable: false, format: val => `${val}` }
      ],
      datasVaults: [
        {
          icon: 'statics/staider/coins/usdc.svg',
          vault: 'SIF USDC',
          denominationCoin: 'USDC',
          myshares: '19,774.25 $US',
          sharePrice: '0.78 $US',
          value: '15,451.85 $US',
          apy: '-14.48%',
          apyStyle: 'red',
          network: 'Ethereum'
        },
        {
          icon: 'statics/staider/coins/pulsechain.svg',
          vault: 'SPF PulseChain',
          denominationCoin: 'USDC',
          myshares: '19,774.25 $US',
          sharePrice: '1.78 $US',
          value: '15,451.85 $US',
          apy: '+10.48%',
          apyStyle: 'green',
          network: 'Ethereum'
        }
      ],
      tab: 'vaults',
      seriesGeneral: [59, 41],
      chartOptionsGeneral: {
        chart: {
          type: 'pie'
        },
        tooltip: {
          enabled: true
        },
        theme: {
          palette: 'palette10'
        },
        colors: ['#2775CA', '#E418E4'],
        labels: ['SIF USDC Vault', 'SPF PulseChain Vault'],
        dataLabels: {
          // enabled: false,
          enabled: true,
          enabledOnSeries: undefined,
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600',
            colors: ['#FFFFFF', '#FFFFFF']
          }
        },
        legend: {
          position: 'right',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400
        },
        responsive: [{
          breakpoint: 520,
          options: {
            chart: {
              width: '100%'
            },
            legend: false
          }
        }]
      }
    }
  },
  mounted () {
  },
  created () {
  },
  methods: {
    formatNumber (number, tofix) {
      const val = (number / 1).toFixed(tofix).replace(',', ' ')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "assets/styles/staider_theme/helpers.scss";
  .vault-section{
    min-height: 600px;
    .vault-dropdown-col{
      .imgs{
        margin-top: -10px;
      }
      .vault-name{
        font-family: $MainFont;
        .pair{
          font-size: 12px;
          font-weight: 200;
        }
        .value{
          font-size: 14px;
          font-weight: 600;
        }
      }
    }
    .share-price-wrapper{}
    .network-wrapper{}
  }
</style>
<style>
.vault-dropdown-wrapper{
  background: #1D1D21 !important;
  box-shadow: 0px 36px 36px 0px !important;
}
.vault-dropdown-wrapper .dropdown-content{
  background: #1D1D21 !important;
}
.vault-dropdown-wrapper .dropdown-content hr{
  opacity: .2 !important;
}
.vault-dropdown-wrapper-btn .q-btn-dropdown__arrow-container{
  /* display: none !important; */
}
.vault-dropdown-wrapper-btn {}
.vault-dropdown-wrapper-btn.active{
  border: 3px solid #F6F973;
}
.vault-dropdown-wrapper .dropdown-content a{
  text-decoration: none;
  padding: 5px 15px;
  margin-bottom: 5px;
  margin-top: 5px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  letter-spacing: .2px;
  font-weight: 400;
  opacity: .7;
}
.vault-dropdown-wrapper .dropdown-content a:hover{
  opacity: 1;
}
</style>

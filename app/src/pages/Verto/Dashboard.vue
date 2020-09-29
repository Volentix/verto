<template>
  <q-page class="column text-black bg-white" :class="screenSize > 1024 ? 'desktop-marg': 'mobile-pad'">
    <div class="desktop-version" v-if="screenSize > 1024">
      <div class="row">
        <div class="col col-md-3">
          <div class="wallets-container">
            <profile-header :isMobile="false" class="marg" version="type2222" />
            <!-- ssdsd <br>{{$store.state.currentwallet.wallet}} -->
            <wallets :isMobile="false" :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
            <!-- <img src="statics/prototype_screens/wallets.jpg" alt=""> -->
          </div>
        </div>
        <div class="col col-md-6">
          <appsSection />
          <startNodeSection :banner="1" />
          <chainToolsSection />
          <div class="desktop-card-style current-investments explore-opportunities q-mb-sm">
            <h4 class="q-pl-md">Explore Opportunities</h4>
            <div class="header-table-col row q-pl-md">
              <div class="col-1"><h3>#</h3></div>
              <div class="col-3"><h3>Available pools</h3></div>
              <div class="col-2"><h3>Liquidity</h3></div>
              <div class="col-2"><h3>Volume(24h)</h3></div>
              <div class="col-2"><h3>Fees(24h)</h3></div>
              <div class="col-2"></div>
            </div>
            <q-scroll-area :visible="true" class="q-pr-lg q-mr-sm" style="height: 392px;">
              <div v-for="(pool, index) in $store.state.investment.pools" :key="index" class="body-table-col border row items-center q-pl-md q-pb-lg q-pt-lg">
                <div class="col-1 flex items-center">
                  <strong>{{(index + 1)}}</strong>
                </div>
                <div class="col-3 flex items-center">
                  <span class="imgs q-mr-lg">
                    <img  v-if="icon" v-for="(icon, index) in pool.icons" :key="index" :src="'https://zapper.fi/images/'+icon" alt="">

                  </span>
                  <span class="column pairs">
                    <span class="pair">{{pool.poolName}}</span>
                    <span class="value">{{pool.platform}}</span>
                  </span>
                </div>
                <div class="col-2 q-pl-sm">
                  <span class="column pairs">
                    <span class="pair">${{pool.liquidity}}</span>
                  </span>
                </div>
                <div class="col-2 q-pl-md">
                  <span class="column pairs">
                    <span class="value">${{pool.volume}}</span>
                  </span>
                </div>
                <div class="col-2 q-pl-lg">
                  <span class="column pairs">
                    <span class="value">${{pool.fees}}</span>
                  </span>
                </div>
                <div class="col-2 flex justify-end">
                  <q-btn unelevated @click="$store.commit('investment/setSelectedPool', pool); openDialog = true" class="qbtn-custom q-pl-sm q-pr-sm q-mr-sm" color="black" text-color="white" label="Add Liquidity" />
                </div>
              </div>
            </q-scroll-area>
          </div>
          <!-- <transactionsSection /> -->
          <!-- <venueSection /> -->
        </div>
        <div class="col q-pl-sm q-pr-md col-md-3">
          <ExchangeSection />
          <makeVTXSection />
          <LiquidityPoolsSection />
        </div>
      </div>
      <q-dialog v-model="openDialog">
        <AddLiquidityDialog :notWidget="true" v-if="$store.state.investment.selectedPool"/>
      </q-dialog>
    </div>
    <div class="mobile-version" v-else>
      <profile-header class="marg" version="type2222" />
      <!-- <q-btn color="white" flat text-color="black" class="full-width" label="Public Proposals" to="/verto/card-wps/public-proposals" /> -->
      <wallets :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
      <div class="cards-wrapper--content">
        <card-make-VTX />
        <hr style="height:0px;opacity:0" />
        <card-WPS />
        <hr style="height:0px;opacity:0" />
        <card-convert-any-to-VTX />
        <hr style="height:0px;opacity:0" />
        <card-import-EOS-account />
        <!-- <hr style="height:0px;opacity:0" /> -->
        <!-- <card-create-wallet /> -->
        <!-- <hr style="height:0px;opacity:0" /> -->
        <!-- <convert-any-coin /> -->
      </div>
      <br><br>
    </div>
  </q-page>
</template>

<script>
import store from '../../store'
import ProfileHeader from '../../components/Verto/ProfileHeader'
import CardMakeVTX from '../../components/Verto/CardMakeVTX'
import CardWPS from '../../components/Verto/CardWPS'
import CardConvertAnyToVTX from '../../components/Verto/CardConvertAnyToVTX'
import CardImportEOSAccount from '../../components/Verto/CardImportEOSAccount'
// import CardCreateWallet from '../../components/Verto/CardCreateWallet'
import Wallets from '../../components/Verto/Wallets'
import AppsSection from '../../components/Verto/AppsSection'
import StartNodeSection from '../../components/Verto/StartNodeSection'
import ChainToolsSection from '../../components/Verto/ChainToolsSection'
// import TransactionsSection from '../../components/Verto/TransactionsSection'
import LiquidityPoolsSection from '../../components/Verto/LiquidityPoolsSection'
import MakeVTXSection from '../../components/Verto/MakeVTXSection'
import ExchangeSection from '../../components/Verto/ExchangeSection'
import AddLiquidityDialog from '../../components/Verto/AddLiquidityDialog'
import { mapState } from 'vuex'
// import VespucciRatingSection from '../../components/Verto/VespucciRatingSection'
import { QScrollArea } from 'quasar'

// import ConvertAnyCoin from '../../components/Verto/ConvertAnyCoin'
import HD from '@/util/hdwallet'
import { CruxPay } from '@cruxpay/js-sdk'
let cruxClient

import EosWrapper from '@/util/EosWrapper'
const eos = new EosWrapper()

let platformTools = require('@/util/platformTools')
if (platformTools.default) platformTools = platformTools.default

import { osName } from 'mobile-device-detect'

export default {
  components: {
    // ConvertAnyCoin,
    QScrollArea,
    ProfileHeader,
    Wallets,
    // CardCreateWallet,
    CardImportEOSAccount,
    CardConvertAnyToVTX,
    CardMakeVTX,
    CardWPS,
    // desktop components
    AddLiquidityDialog,
    AppsSection,
    StartNodeSection,
    ChainToolsSection,
    // TransactionsSection,
    LiquidityPoolsSection,
    MakeVTXSection,
    ExchangeSection
    // VespucciRatingSection

  },
  data () {
    return {
      pools: [],
      rawPools: [],
      cruxKey: {},
      osName: '',
      screenSize: 0,
      openDialog: false,
      exploreFakeData: [
        {
          img1: 'https://zapper.fi/images/Y-icon.png',
          img2: '',
          pair: 'Y Curve',
          pool: 'Curve',
          liquidity: '$681,655,993',
          netROI: '0.30%',
          ROI: '0.30%'
        },
        {
          img1: 'https://zapper.fi/images/ETH-icon.png',
          img2: 'https://zapper.fi/images/USDT-icon.png',
          pair: 'ETH / USDT',
          pool: 'Uniswap V2',
          liquidity: '$211,413,116',
          netROI: '7.66%',
          ROI: '18.42%'
        },
        {
          img1: 'https://zapper.fi/images/sBTC-icon.png',
          img2: '',
          pair: 'sBTC Curve',
          pool: 'Curve',
          liquidity: '$190,773,204',
          netROI: '0.14%',
          ROI: '0.14%'
        },
        {
          img1: 'https://zapper.fi/images/USDC-icon.png',
          img2: 'https://zapper.fi/images/ETH-icon.png',
          pair: 'USDC / ETH',
          pool: 'Uniswap V2',
          liquidity: '$190,399,817',
          netROI: '5.50%',
          ROI: '16.56%'
        },
        {
          img1: 'https://zapper.fi/images/SUSHI-icon.png',
          img2: 'https://zapper.fi/images/ETH-icon.png',
          pair: 'SUSHI / ETH',
          pool: 'Uniswap V2',
          liquidity: '$172,518,133',
          netROI: 'N/A',
          ROI: 'N/A'
        }
      ],
      walletClientName: 'verto' // should be 'verto' when in prod
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowWidth)
  },
  beforeCreate () {
    // console.log('beforeCreate event')
  },
  async created () {
    let exchangeNotif = document.querySelector('.exchange-notif')
    if (exchangeNotif !== null) {
      exchangeNotif.querySelector('.q-btn').dispatchEvent(new Event('click'))
    }
    // Check if mnemonic exists
    // console.log('this.$store.state.currentwallet.wallet = undefined called')
    this.osName = osName
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)
    // console.log('this.osName', this.osName)
    // console.log('store.state.currentwallet.config', store.state.currentwallet.config)
    if (!store.state.currentwallet.config.mnemonic) {
      this.$router.push('recovery-seed')
    } else {
      let wallets2Tokens = require('@/util/Wallets2Tokens')
      if (!store.state.wallets.tokens && wallets2Tokens.default) wallets2Tokens = wallets2Tokens.default
    }
    this.$store.dispatch('investment/getMarketDataVsUSD')
    // Adds the eos account name when it is found to the cruxID
    this.tableData = await store.state.wallets.tokens.map(token => {
      token.selected = false
      if (token.hidden === undefined) {
        token.hidden = false
      }
    })
    this.$store.state.currentwallet.wallet = {
      empty: true
    }
    Promise.all(this.tableData)
    let eosAccount = this.tableData.find(w => w !== undefined && w.chain === 'eos' && w.type === 'eos' && w.origin === 'mnemonic')
    // console.log('this.tableData', this.tableData)

    if (eosAccount) {
      let accountNames = await eos.getAccountNamesFromPubKeyP(eosAccount.key)

      // May be we could auto convert an eos key to an account if discovered here
      if (accountNames.account_names.includes(eosAccount.name)) {
        // console.log('we have an upgraded account', accountNames, eosAccount.name)

        this.cruxKey = await HD.Wallet('crux')
        cruxClient = new CruxPay.CruxClient({
          walletClientName: this.walletClientName,
          privateKey: this.cruxKey.privateKey
        })
        await cruxClient.init()

        let addressMap = await cruxClient.getAddressMap()
        // console.log('addressMap', addressMap)

        if (!addressMap.hasOwnProperty('eos')) {
          addressMap['eos'] = {
            'addressHash': eosAccount.name
          }
          cruxClient.putAddressMap(addressMap)
        }
      }
    }

    this.$store.dispatch('investment/getZapperTokens')
    //this.$store.dispatch('investment/getUniSwapHistoricalData')
   // this.$store.dispatch('investment/getBalancerHistoricalData')
  },
  methods: {
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    }

  },
  watch: {
    zapperTokens (newVal, old) {
      if (!newVal.length) return

      this.$store.dispatch('investment/getBalancerPools')
      this.$store.dispatch('investment/getYvaultsPools')
      this.$store.dispatch('investment/getCurvesPools')
      this.$store.dispatch('investment/getUniswapPools')
      this.$store.commit('investment/setSelectedPool', this.$store.state.investment.pools[0])
    },
    poolDataHistory (newVal, old) {

    }
  },
  computed: {
    ...mapState('investment', ['zapperTokens', 'poolDataHistory'])
  }
}
</script>
<style lang="scss" scoped>
  .cards-wrapper--content{
    @media screen and (min-width: 768px) {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      max-width: 1200px;
      margin: auto;
      /deep/ .card-create-wallet--wrapper{
        height: 100%;
        &--header_btn{
          margin-top: 9px;
        }
      }
      /deep/ .card-convert-any-to-VTX--wrapper{
        height: 100%;
      }
      /deep/ .card-make-VTX--wrapper{
        height: 100%;
        &--header_btn{
          margin-top: 0px;
        }
      }
      > div{
        flex-basis: 25%;
        max-width: 25%;
        width: 100%;
        margin-bottom: 2%;
      }
      br,hr{
        display: none;
      }
    }
  }
  /deep/ .wallets-wrapper{
    padding-bottom: 0px !important;
  }
  /deep/ .wallets-wrapper--list{
    box-shadow: none;
    margin-top: 0px;
  }
  .marg{
    /deep/ .profile-wrapper{
      &--header{
        margin-bottom: 0px;
      }
    }
  }
</style>

<style lang="scss" scoped>
  @import "~@/assets/styles/variables.scss";
  .desktop-version{
    background: #E7E8E8;
    padding-top: 13vh;
    padding-left: 12vh;
    padding-bottom: 50px
  }
  .mobile-pad{
    padding-bottom: 50px
  }
  .desktop-card-style{
    // height: 100%;
    &.current-investments{
      &.wallet-col{
        h4{
          margin-bottom: -8px;
        }
        .body-table-col{
          .imgs{
            img{
              margin-right: 10px !important;
            }
          }
        }
        .header-table-col{
          h3{
            font-size: 16px;
            line-height: 20px;
          }
        }
      }
      h4{
        margin-bottom: -20px;
      }
      .header-table-col{
        h3{
          font-weight: $bold;
          color: #7272FA;
          font-size: 14px;
          margin-top: 20px;
          line-height: 30px;
          margin-bottom: -5px;
          padding-bottom: 10px;
        }
      }
      .body-table-col{
        &:hover{
          background-color: rgba(black, .01);
        }
        &.border{
          border-bottom: 1px solid rgba(black, .04);
        }
        .pairs{
          .pair{
            font-weight: $bold;
            color: #2A2A2A;
            margin-bottom: -2px;
          }
          .value{
            color: #627797;
          }
        }
        .imgs{
          margin-top: 5px;
          min-width: 30px;
          img{
            border-radius: 40px;
            height: 25px;
          }
          &:first-child{
            img{
              margin-right: -10px;
            }
          }
        }
      }
      .qbtn-custom{
        border-radius: 30px;
        height: 34px;
        background: #EFF5F9 !important;
        /deep/ .q-btn__wrapper{
          min-height: unset;
          padding: 0px 5px;
          .q-btn__content{
            text-transform: initial;
            font-size: 10px;
            color: #627797;
          }
        }
      }
    }
    &.yearn-finance{
      img{
        width: 30px;
        margin-right: 10px;
      }
      strong{
        position: relative;
        margin-top: -13px;
        b{
          position: absolute;
          right: 0px;
          bottom: -5px;
          font-size: 12px;
          font-weight: $regular;
          line-height: 20px;
        }
      }
      h4{
        margin-bottom: 0px;
      }
      .qbtn-download{
        border-radius: 30px;
        height: 34px;
        background: #EFF5F9 !important;
        padding-left: 10px;
        padding-right: 10px;
        /deep/ .q-btn__wrapper{
          min-height: unset;
          padding: 0px 10px;
          .q-btn__content{
            text-transform: initial;
            font-size: 14px;
            color: #627797;
          }
        }
      }
      /deep/ .transaction-section{
        box-shadow: none;
        .history-icon{
          display: none;
        }
      }
    }
    &.wallet-snapshot{
      padding-bottom: 8px;
      padding-top: 8px;
      h3{
        font-size: 16px;
        font-weight: $bold;
        position: relative;
        line-height: 40px;
        font-family: $Titillium;
        margin-top: 0px;
        margin-bottom: 0px;
      }
      .amount{
        font-size: 16px;
        font-weight: $bold;
        position: relative;
        line-height: 40px;
        font-family: $Titillium;
        .interest_rate{
          font-size: 16px;
          font-weight: $regular;
          position: relative;
          margin-top: -15px;
          .thicker{
            position: relative;
            top: 7px;
            margin-right: 10px;
          }
          .p-abs{
            position: absolute;
            bottom: -17px;
            right: 17px;
            font-size: 12px;
            font-weight: $regular;
            opacity: .7;
          }
          img{
            width: 30px;
            margin-right: 6px;
            position: relative;
            top: 7px;
          }
        }
      }
    }
    h4{
      font-size: 16px;
      font-weight: $bold;
      position: relative;
      line-height: 40px;
      font-family: $Titillium;
      margin-top: 0px;
      margin-bottom: 20px;
    }
  }
</style>
<style>
  .q-scrollarea__bar--v, .q-scrollarea__thumb--v{
    width: 6px !important;
    border-radius: 10px;
  }
  .q-scrollarea__bar{
    background: rgb(183, 183, 183) !important;
  }
  .exchange-notif button{
    opacity: 0;
  }
</style>

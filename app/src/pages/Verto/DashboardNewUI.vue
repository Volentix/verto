<template>
<q-page class="column" :class="{'dark-theme': $store.state.settings.lightMode === 'true', 'text-black bg-white': $store.state.settings.lightMode === 'false', 'desktop-marg' : screenSize > 1024, 'mobile-pad': screenSize < 1024}">
<div :class="{'dark-theme': $store.state.settings.lightMode === 'true'}" style="height: 100vh;">
    <div class="desktop-version full-height" v-if="screenSize > 1024">
        <div class="row full-height">
            <div class="col col-md-3">
                <div class="wallets-container" style="height: 100%">
                    <profile-header @setAsset="setAsset"  :isMobile="false" class="marg" version="type2222" />
                    <wallets data-title="Interact with your account" class="full-height max-height" data-intro="Click on an account/token to see all actions you can perform. Click SETUP to associate EOS account(s) to account names" :isMobile="false" :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
                </div>
            </div>
            <div class="col col-md-9 q-pr-md bg-white">
              <div class="row dashboard-ui-tokens">
       <q-tabs
        v-if="!assetSelected "
        v-model="tab"
        inline-label

        :class="{'text-white': $store.state.settings.lightMode === 'true'}"
      >
        <q-tab name="dashboard" icon="dashboard" label="Dashboard" />
         <q-tab name="exchange" icon="swap_horiz" label="Exchange"  @click="show.exchange = true"/>
        <q-tab name="vtxstaking" icon="trending_up" label="VTX Staking" @click="show.vtxstaking = true" />
        <q-tab name="tokens" icon="trending_up" label="Token watcher" @click="show.tokens = true"/>
      </q-tabs>
          <GodexV2  v-show="tab == 'exchange'" v-if="show.exchange" />
              <VTXStakeState v-show="tab == 'vtxstaking'"  v-if="show.vtxstaking"   />
              <TokenPrices v-show="tab == 'tokens'" class="full-width" v-if="show.tokens"    />
                <q-breadcrumbs class="col-12 q-pt-md q-pl-md bg-white breadcrumbs" v-if="assetSelected">
                  <q-breadcrumbs-el  class="cursor-pointer" @click="assetSelected = null" label="Back"  icon="keyboard_backspace" />
                </q-breadcrumbs>
               <NftsExplorer v-if="false && $store.state.settings.network != 'mainnet'" />
                <AssetsExplorer @assetsChanged="assetsChanged" ref="assetsComponent" v-show="!assetSelected  && tab == 'dashboard'" @setAsset="setAsset" />

                <SingleToken   ref="singleTokenComponent" @setAsset="setAsset"  :assetData="assetSelected" class="col-md-12" v-if="assetSelected" />

              </div>
            </div>
        </div>
    </div>
    <div class="mobile-version" v-else>
        <!-- <profile-header class="marg" version="type2222" /> -->
        <!-- <q-btn color="white" flat text-color="black" class="full-width" label="Public Proposals" to="/verto/card-wps/public-proposals" /> -->
        <!-- <wallets :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" /> -->
        <div class="wallets-container" style="height: 100%">
            <profile-header class="marg" version="type2222" />
             <AssetsExplorer v-show="!assetSelected" @setAsset="setAsset" v-if="false" />
            <wallets :showWallets="true" :isWalletsPage="false" :isWalletDetail="false" />
        </div>
        <div class="cards-wrapper--content q-pl-md q-pr-md" v-if="$store.state.currentwallet.wallet.empty" >
            <!-- <startNodeSection :banner="1" /> -->
            <!-- <hr style="height:0px;opacity:0" /> -->
            <!-- <ExchangeSection3 data-title="Any to any" data-intro="Crosschain transactions: Exchange Any to Any is easier than ever" v-if="true && $store.state.settings.network == 'mainnet'"  /> -->
            <hr style="height:10px;opacity:0" />
            <makeVTXSection2  v-if="true && $store.state.settings.network == 'mainnet'" />
            <!-- <card-make-VTX /> -->
            <!-- <hr style="height:0px;opacity:0" /> -->
            <!-- <LiquidityPoolsSection2 v-if="true  && $store.state.settings.network == 'mainnet'" /> -->
            <!-- <hr style="height:0px;opacity:0" /> -->
            <!-- <div class="desktop-card-style current-investments explore-opportunities q-mb-sm" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
                <liquidityPoolsTable data-title="Liquidity pools" data-intro="Here you can click the ADD button to add liquidity to any pools" :rowsPerPage="8"  v-if="$store.state.settings.network == 'mainnet'" />
            </div> -->
            <hr style="height:30px;opacity:0" />
            <!-- <card-WPS /> -->
            <!-- <hr style="height:0px;opacity:0" /> -->
            <!-- <card-convert-any-to-VTX /> -->
            <!-- <hr style="height:0px;opacity:0" /> -->
            <!-- <card-import-EOS-account /> -->
            <!-- <hr style="height:0px;opacity:0" /> -->
            <!-- <card-create-wallet /> -->
            <!-- <hr style="height:0px;opacity:0" /> -->
            <!-- <convert-any-coin /> -->
        </div>
        <br><br>
    </div>
    <q-dialog v-model="alert" v-if="false">
      <q-card class="q-px-md" style="min-width:550px">
        <q-card-section>
          <div class="text-h6">Multi Transaction</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
         <MultiTransaction />
         </q-card-section>
      </q-card>
    </q-dialog>
</div>
</q-page>
</template>

<script>
import store from '../../store'
import ProfileHeader from '../../components/Verto/ProfileHeader'
// import CardMakeVTX from '../../components/Verto/CardMakeVTX'
// import CardWPS from '../../components/Verto/CardWPS'
// import CardConvertAnyToVTX from '../../components/Verto/CardConvertAnyToVTX'
// import CardImportEOSAccount from '../../components/Verto/CardImportEOSAccount'
// import CardCreateWallet from '../../components/Verto/CardCreateWallet'
import Wallets from '../../components/Verto/Wallets'
// import AppsSection from '../../components/Verto/AppsSection'
// import StartNodeSection from '../../components/Verto/StartNodeSection'
// import maxDeFiYield from '../../components/Verto/maxDeFiYield'
// import ChainToolsSection from '../../components/Verto/ChainToolsSection'
// import TransactionsSection from '../../components/Verto/TransactionsSection'
// import LiquidityPoolsSection from '../../components/Verto/Defi/LiquidityPoolsSection'
// import LiquidityPoolsSection2 from '../../components/Verto/Defi/LiquidityPoolsSection2'
// import MakeVTXSection from '../../components/Verto/MakeVTXSection'
import MakeVTXSection2 from '../../components/Verto/MakeVTXSection2'
// import ExchangeSection from '../../components/Verto/ExchangeSection'
// import ExchangeSection3 from '../../components/Verto/ExchangeSection3'
//
import SingleToken from '../../components/Verto/SingleToken'
import GodexV2 from '../../components/Verto/Exchange/GodexV2'
import VTXStakeState from '../../components/Verto/EOS/StakingState'
import AssetsExplorer from '../../components/Verto/Token/AssetsExplorer'
import TokenPrices from '../../components/Verto/Token/TokenPrices'
import {
  mapState
} from 'vuex'
// import VespucciRatingSection from '../../components/Verto/VespucciRatingSection'

// import ConvertAnyCoin from '../../components/Verto/ConvertAnyCoin'
// import HD from '@/util/hdwallet'
/* import {
  CruxPay
} from '@cruxpay/js-sdk'
let cruxClient
*/
import DexInteraction from '../../mixins/DexInteraction'
import CrosschainDex from '@/util/CrosschainDex'
// import EosWrapper from '@/util/EosWrapper'
// import Bridge from '@/util/Bridge'
import MultiTransaction from '../../components/Verto/Defi/MultiTransaction'
// const eos = new EosWrapper()
import initWallet from '@/util/Wallets2Tokens'
let platformTools = require('@/util/platformTools')
if (platformTools.default) platformTools = platformTools.default
// import TestnetPools from '../../components/Verto/Defi/TestnetPools'
import 'intro.js/minified/introjs.min.css'
import {
  osName
} from 'mobile-device-detect'
// import Godex from '../../components/Verto/Exchange/Godex.vue'
// import NftsExplorer from '../../components/Verto/Token/NftsExplorer.vue'
export default {
  components: {
    // ConvertAnyCoin,
    VTXStakeState,
    MultiTransaction,
    // NftsExplorer,
    ProfileHeader,
    Wallets,
    GodexV2,
    // AppsSection,
    SingleToken,
    AssetsExplorer,
    // StartNodeSection,
    // maxDeFiYield,
    // ChainToolsSection,
    // TestnetPools,
    // TransactionsSection,
    // LiquidityPoolsSection,
    // LiquidityPoolsSection2,
    // liquidityPoolsTable,
    // AssetBalancesTable,
    // MakeVTXSection,
    MakeVTXSection2,
    TokenPrices
    // ExchangeSection,
    // ExchangeSection3
    // VespucciRatingSection

  },
  data () {
    return {
      customSlider: true,
      rawPools: [],
      showAssetsExplorer: false,
      tab: 'dashboard',
      cruxKey: {},
      assetSelected: false,
      alert: true,
      interval: null,
      osName: '',
      show: {
        exchange: false,
        tokens: false,
        vtxstaking: false
      },
      tabPoolAndAssetBalances: 'asset',
      screenSize: 0,
      openDialog: false,
      walletClientName: 'verto' // should be 'verto' when in prod
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowWidth)
    clearInterval(this.interval)
  },
  async created () {
    let found_eth = this.$store.state.wallets.tokens.filter(w => w.type === 'eth')

    if (found_eth.length > 0 && found_eth[0].usd !== null && found_eth[0].usd > 0) {
      this.interval = setInterval(() => {
        this.customSlider = this.$store.state.investment.zapperTokens.length ? !this.customSlider : this.customSlider
      }, 12000)
    }

    if (!this.$store.state.wallets.tokens.length) {
      setTimeout(() => {
        initWallet()
      }, 500)
    } else if (this.$route.params.walletToRefresh) {
      setTimeout(() => {
        initWallet(this.$route.params.walletToRefresh)
      }, 500)
    }

    window.localStorage.setItem('skin', window.localStorage.getItem('skin') !== null ? window.localStorage.getItem('skin') : true)
    this.$store.state.settings.lightMode = window.localStorage.getItem('skin') !== null ? window.localStorage.getItem('skin') : true
    /*
    this.tableData = this.$store.state.wallets.tokens.map(token => {
      token.selected = false
      if (token.hidden === undefined) {
        token.hidden = false
      }
      return token
    })
    */
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
      this.$router.push({
        name: 'recovery-seed',
        params: { step: 2 }
      })
      this.$store.commit('settings/updateState', { key: 'backupConfig', value: true })
    }

    // Adds the eos account name when it is found to the cruxID

    this.$store.state.currentwallet.wallet = {
      empty: true
    }

    // Promise.all(this.tableData)
    /*
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
    // this.$store.dispatch('investment/getUniSwapHistoricalData')
    // this.$store.dispatch('investment/getBalancerHistoricalData')
    */
  },
  async mounted () {
    this.$bus.$on('showHomeIntro', () => {
      this.showIntros()
    })
    this.$bus.$on('showDefaultDashboard', () => {
      this.assetSelected = false
    })

    /*
    setTimeout(async () => {
      let manualSelectCurrentWallet = false
      await store.state.wallets.tokens.map(async (f) => {
        let stakedAmounts = 0

        if (f.type === 'vtx') {
          let stakes = await eos.getTable('vertostaking', f.name, 'accountstake')
          if (stakes.length) {
            stakes.map(s => {
              s.stake_amount = Math.round(+s.amount.split(' ')[0] * 10000) / 10000
              s.subsidy = Math.round(+s.subsidy.split(' ')[0] * 10000) / 10000
              stakedAmounts += +s.stake_amount
            })
            f.staked = stakedAmounts
            // console.log('f.staked', f.staked)
            if (!manualSelectCurrentWallet && this.screenSize <= 1024) {
              manualSelectCurrentWallet = true
              this.$store.state.currentwallet.wallet = f
            // console.log('this.$store.state.currentwallet.wallet = f', this.$store.state.currentwallet.wallet)
            }
          }
        }
      })
    }, 6000)
   */

    if (this.$q.screen.width < 1024) {
      window.localStorage.setItem('skin', 'false')
      this.$store.state.settings.lightMode = window.localStorage.getItem('skin')
    }

    if (!this.$store.state.settings.coins.defibox.length) {
      setTimeout(() => {
        this.getGodexCoins()
        this.get1inchCoins()
        this.getDefiboxCoins()
      }, 3000)
    }
  },
  methods: {
    assetsChanged (assets) {
      if (this.assetSelected) {
        let asset = assets.find(o => o.type === this.assetSelected.type && o.chain === this.assetSelected.chain && (this.assetSelected.chain !== 'eos' || o.contract === this.assetSelected.contract))
        console.log(asset, 'asset')
        if (asset) {
          this.$refs.singleTokenComponent.asset.usd = asset.usd
          this.$refs.singleTokenComponent.asset.amount = asset.amount
        }
      }
    },
    setAsset (asset) {
      this.assetSelected = asset
    },
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    },
    showIntros () {
      let disableIntro = localStorage.getItem('disableIntros_home')
      if (!disableIntro) {
        const IntroJS = require('intro.js')
        let Intro = new IntroJS()
        Intro.setOptions({
          showProgress: true
        }).onbeforeexit(function () {
          return localStorage.setItem('disableIntros_home', Date.now())
        }).start()
      }
    }

  },

  computed: {
    ...mapState('investment', ['zapperTokens', 'poolDataHistory', 'pools'])
  },
  mixins: [DexInteraction, CrosschainDex]
}
</script>

<style lang="scss" scoped>

.breadcrumbs {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin-top: 0px;
}
.exchange-container{
    min-height: 138px;
    margin: -3px;
    &--head-title{
        // border-bottom: 1px solid #CCC;
        // background-color: rgba(#CCC, .1);
        font-size: 16px;
        font-weight: 700;
    }
    .row{}
    .qbtn-start{
        text-transform: initial !important;
        background: transparent !important;
        border: 1px solid rgba(#CCC, .7);
        font-size: 10px !important;
        border-radius: 40px;
        min-height: 20px;
        margin-bottom: 4px;
    }
}

.cards-wrapper--content {
    @media screen and (min-width: 768px) {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;
        max-width: 1200px;
        margin: auto;

        /deep/ .card-create-wallet--wrapper {
            height: 100%;

            &--header_btn {
                margin-top: 9px;
            }
        }

        /deep/ .card-convert-any-to-VTX--wrapper {
            height: 100%;
        }

        /deep/ .card-make-VTX--wrapper {
            height: 100%;

            &--header_btn {
                margin-top: 0px;
            }
        }

        >div {
            flex-basis: 25%;
            max-width: 25%;
            width: 100%;
            margin-bottom: 2%;
        }

        br,
        hr {
            display: none;
        }
    }
}

/deep/ .wallets-wrapper {
    padding-bottom: 0px !important;
}

/deep/ .wallets-wrapper--list {
    box-shadow: none;
    margin-top: 0px;
}

.marg {
    /deep/ .profile-wrapper {
        &--header {
            margin-bottom: 0px;
            border: 1px solid rgb(235, 235, 235);
            // border-bottom: none;
            border-radius: 10px 10px 0px 0px !important;
        }
    }
}
</style>
<style>
.dark-theme-main-layout .q-page {
    background: #04111F !important;
}
.q-page {
    background: #E7E8E8 !important;
}
</style>
<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.desktop-version {
    background: #E7E8E8;
    padding-top: 13vh;
    padding-left: 18vh;
    padding-bottom: 50px;
    @media screen and (min-width: 768px) {
        padding-top: 11vh;
        padding-bottom: 0px;
    }
}

.mobile-pad {
    padding-bottom: 50px;
    background: #FFF !important;
}

.liquidityPoolsTable{
    position: relative;
    .tabPoolAndAssetBalances{
        position: absolute;
        left: 1px;
        top: calc(3vh + 1px);
        z-index: 3;
        width: 400px;
        padding-right: 90px;
        border-radius: 10px 0px 0px 0px;
        &.bg-myblue{
            background-color: #04111F;
        }
    }
    .tabPoolAndAssetBalancesPanels{
        background-color: transparent;
        /deep/ .q-tab-panel{
            padding: 0px;
            margin: 0px;
        }
    }
    /deep/ .desktop-size{
        padding: 1%;
        background-color: #FFFFFF;
        box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.19);
        max-width: 100%;
        border-radius: 10px;
        .q-table__top{
            padding: 0px 10px !important;
        }
        .current-investments{
            .body-table-col .imgs{
                min-width: 55px !important;
            }
        }
    }
}
.desktop-card-style {
    // height: 100%;
    &.current-investments {
        &.wallet-col {
            h4 {
                margin-bottom: -8px;
            }

            .body-table-col {
                .imgs {
                    img {
                        margin-right: 10px !important;
                    }
                }
            }

            .header-table-col {
                h3 {
                    font-size: 16px;
                    line-height: 20px;
                }
            }
        }

        h4 {
            margin-bottom: -20px;
        }

        .body-table-col {
            font-size: 12px;

            .imgs {
                img {
                    margin-right: 10px !important;
                }
            }
        }

        .header-table-col {
            h3 {
                font-weight: $bold;
                color: #7272FA;
                font-size: 14px;
                margin-top: 20px;
                line-height: 30px;
                margin-bottom: -5px;
                padding-bottom: 10px;
            }
        }

        .body-table-col {
            &:hover {
                background-color: rgba(black, .01);
            }

            &.border {
                border-bottom: 1px solid rgba(black, .04);
            }

            .pairs {
                .pair {
                    font-weight: $bold;
                    color: #2A2A2A;
                    margin-bottom: -2px;
                }

                .value {
                    color: #627797;
                }
            }

            .imgs {
                margin-top: 5px;
                min-width: 30px;

                img {
                    border-radius: 40px;
                    height: 25px;
                }

                &:first-child {
                    img {
                        margin-right: -10px;
                    }
                }
            }
        }

        .qbtn-custom {
            border-radius: 30px;
            height: 34px;
            background: #EFF5F9 !important;

            /deep/ .q-btn__wrapper {
                min-height: unset;
                padding: 0px 5px;

                .q-btn__content {
                    text-transform: initial;
                    font-size: 10px;
                    color: #627797;
                }
            }
        }
    }

    &.yearn-finance {
        img {
            width: 30px;
            margin-right: 10px;
        }

        strong {
            position: relative;
            margin-top: -13px;

            b {
                position: absolute;
                right: 0px;
                bottom: -5px;
                font-size: 12px;
                font-weight: $regular;
                line-height: 20px;
            }
        }

        .pairs {
            font-size: 12px;

            .pair {
                font-weight: $bold;
                color: #2A2A2A;
                margin-bottom: -2px;
            }

            .value {
                color: #627797;
            }
        }

        h4 {
            margin-bottom: 0px;
        }

        .qbtn-download {
            border-radius: 30px;
            height: 34px;
            background: #EFF5F9 !important;
            padding-left: 10px;
            padding-right: 10px;

            /deep/ .q-btn__wrapper {
                min-height: unset;
                padding: 0px 10px;

                .q-btn__content {
                    text-transform: initial;
                    font-size: 14px;
                    color: #627797;
                }
            }
        }
    }

    .qbtn-custom {
        border-radius: 30px;
        height: 34px;
        background: #EFF5F9 !important;
        font-family: $Franklin;

        /deep/ .q-btn__wrapper {
            min-height: unset;
            padding: 0px 5px;

            .q-btn__content {
                text-transform: initial;
                font-size: 10px;
                color: #627797;
            }
        }

        /deep/ .transaction-section {
            box-shadow: none;

            .history-icon {
                display: none;
            }
        }
    }

    &.wallet-snapshot {
        padding-bottom: 8px;
        padding-top: 8px;

        h3 {
            font-size: 16px;
            font-weight: $bold;
            position: relative;
            line-height: 40px;
            font-family: $Titillium;
            margin-top: 0px;
            margin-bottom: 0px;
        }

        .amount {
            font-size: 16px;
            font-weight: $bold;
            position: relative;
            line-height: 40px;
            font-family: $Titillium;

            .interest_rate {
                font-size: 16px;
                font-weight: $regular;
                position: relative;
                margin-top: -15px;

                .thicker {
                    position: relative;
                    top: 7px;
                    margin-right: 10px;
                }

                .p-abs {
                    position: absolute;
                    bottom: -17px;
                    right: 17px;
                    font-size: 12px;
                    font-weight: $regular;
                    opacity: .7;
                }

                img {
                    width: 30px;
                    margin-right: 6px;
                    position: relative;
                    top: 7px;
                }
            }
        }
    }

    h4 {
        font-size: 16px;
        font-weight: $bold;
        position: relative;
        line-height: 40px;
        font-family: $Titillium;
        margin-top: 0px;
        margin-bottom: 20px;
    }
}

.mobile-version {
    .explore-opportunities{
        padding: 0% !important;
        box-shadow: none;
        &.desktop-card-style{
            &:after{
                display: none !important;
            }
        }
    }
    /deep/ .desktop-card-style {
        &:not(.apps-section) {
            background-color: #FFFFFF;
            max-width: 100%;
            margin-left: auto;
            margin-right: auto;
            box-shadow: 0px 3px 6px 0px rgba(black, .19);
            border-radius: 20px;
            .call-action{
                background-color: #FFF;
                border-radius: 40px;
            }
            .row.flex{
                position: relative;
                z-index: 7;
            }
            &:after{
                content: '';
                width: 100%;
                display: block;
                height: 50px;
                background-color: #F3F3F3;
                position: absolute;
                z-index: 0;
                bottom: 0px;
                left: 0px;
                border-radius: 0px 0px 20px 20px;
                box-shadow: 0px 3px 6px 0px rgba(black, .19);
                display: none;
            }
        }
    }
}
.exchange-container{
    &--head-title{
        // background-color: rgba(#000, .05);
    }
}
.dark-theme{
    .dashboard-ui-tokens{
      background-color: #04111F;
      border: 1px solid #627797;
      border-radius: 10px;
      overflow: hidden;
    }
    .breadcrumbs{
      background-color: #04111F !important;
      color: #FFF !important;
    }
    .marg {
        /deep/ .profile-wrapper {
            &--header {
                border: 1px solid #627797;
            }
        }
    }
    .tabPoolAndAssetBalances{

    }
    .desktop-card-style{
        &.apps-section{
            background-color: #04111F;
        }
    }
    .exchange-container{
        &--head-title{
            // background-color: rgba(#CCC, .1);
        }
    }
    .liquidityPoolsTable{
        /deep/ .desktop-size{
            background-color: #04111F;
            border: 1px solid #627797;
            .current-investments{
                background-color: #04111F;
            }
        }
    }
    .desktop-version{
        background: #04111F;
        padding-bottom: 8px;
        min-height: 100vh;
        overflow: hidden;
        position: relative;
        scrollbar-width: 0px;
    }
    .explore-opportunities{
        /deep/ .q-dark{
            background: #04111F;
        }
    }
    /deep/ .mobile-version{
        background: #04111F;
    }
    .mobile-version{
        background: #04111F;
        .explore-opportunities{
        padding: 0% !important;
        box-shadow: none;
        &.desktop-card-style{
            &:after{
                display: none !important;
            }
        }
    }
    /deep/ .desktop-card-style {
        &:not(.apps-section) {
            background-color: #04111F;
            .call-action{
                background-color: #04111F;
            }
            &:after{
                background-color: #081d33;
            }
        }
    }
    }
}
.customSlider{
  height: 85px;
  .slide{
      opacity: 0;
      visibility: hidden;
      position: absolute;
      transition: opacity 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      &.active{
          opacity: 1;
          visibility: visible;
          position: relative;
      }
  }
}
.tabPoolAndAssetBalancesPanels{
  margin-top: 3vh;
  /deep/ .q-panel.scroll{
      overflow: hidden;
  }
}
.max-height{
  max-height: 72vh;
}
.tabPoolAndAssetBalancesPanels{
  box-shadow: 0px 3px 6px 0px rgba(black, .19) !important;
  border-radius: 8px 8px !important;
  overflow: hidden;
  // padding: 5px;
  // background-color: #fff !important;
}
.liquidityPoolsTable /deep/ .q-scrollarea.desktop-size{
    height: 71.5vh !important;
    @media screen and (min-height: 700px) {
      height: 70.5vh !important;
    }
    @media screen and (min-height: 760px) {
      height: 70.5vh !important;
    }
    @media screen and (min-height: 800px) {
      height: 69.2vh !important;
    }
    @media screen and (min-height: 870px) {
      height: 69vh !important;
    }
}
// .max-height2{
//     max-height: 50.5%;
// }
</style>
<style>
.q-scrollarea__bar--v,
.q-scrollarea__thumb--v {
    width: 6px !important;
    border-radius: 10px;
}

.q-scrollarea__bar {
    background: rgb(183, 183, 183) !important;
}

.exchange-notif button {
    opacity: 0;
}
.full-height-desktop {
      height: 100vh !important;
}
</style>

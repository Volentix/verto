<template>
<q-page class="column" :class="{'dark-theme': $store.state.settings.lightMode === 'true', 'text-black bg-white': $store.state.settings.lightMode === 'false', 'desktop-marg' : screenSize > 1024, 'mobile-pad': screenSize < 1024}">
<div :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
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
                <div class="desktop-card-style current-investments explore-opportunities q-mb-sm" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
                    <liquidityPoolsTable :rowsPerPage="10" v-if="$store.state.settings.network == 'mainnet'" />
                    <q-scroll-area :visible="true" class="q-pr-lg q-mr-sm" style="height: 362px;" v-if="false">
                        <div v-for="(pool, index) in $store.state.investment.pools" :key="index" class="body-table-col border row items-center q-pl-md q-pb-lg q-pt-lg">
                            <div class="col-1 flex items-center">
                                <strong>{{(index + 1)}}</strong>
                            </div>
                            <div class="col-3 flex items-center">
                                <span class="imgs q-mr-lg" v-if="pool.icons.length">
                                    <img v-for="(icon, index2) in pool.icons" :key="index2" :src="'https://zapper.fi/images/'+icon" alt="">
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
                <LiquidityPoolsSection v-if="$store.state.settings.network == 'mainnet'"/>
            </div>
        </div>

    </div>
    <div class="mobile-version" v-else>
        <profile-header class="marg" version="type2222" />
        <!-- <q-btn color="white" flat text-color="black" class="full-width" label="Public Proposals" to="/verto/card-wps/public-proposals" /> -->
        <wallets :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
        <div class="cards-wrapper--content q-pl-md q-pr-md">
            <!-- <startNodeSection :banner="1" /> -->
            <!-- <hr style="height:0px;opacity:0" /> -->
            <ExchangeSection />
            <hr style="height:0px;opacity:0" />
            <makeVTXSection />
            <!-- <card-make-VTX /> -->
            <hr style="height:0px;opacity:0" />
            <LiquidityPoolsSection />
            <hr style="height:0px;opacity:0" />
            <div class="desktop-card-style current-investments explore-opportunities q-mb-sm" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
                <liquidityPoolsTable v-if="$store.state.settings.network == 'mainnet'" :rowsPerPage="10" />
            </div>
            <hr style="height:0px;opacity:0" />
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
import AppsSection from '../../components/Verto/AppsSection'
import StartNodeSection from '../../components/Verto/StartNodeSection'
import ChainToolsSection from '../../components/Verto/ChainToolsSection'
// import TransactionsSection from '../../components/Verto/TransactionsSection'
import LiquidityPoolsSection from '../../components/Verto/Defi/LiquidityPoolsSection'
import MakeVTXSection from '../../components/Verto/MakeVTXSection'
import ExchangeSection from '../../components/Verto/ExchangeSection'
import liquidityPoolsTable from '../../components/Verto/Defi/LiquidityPoolsTable'

import {
  mapState
} from 'vuex'
// import VespucciRatingSection from '../../components/Verto/VespucciRatingSection'
import {
  QScrollArea
} from 'quasar'

// import ConvertAnyCoin from '../../components/Verto/ConvertAnyCoin'
// import HD from '@/util/hdwallet'
// import {CruxPay}from '@cruxpay/js-sdk'
// let cruxClient

import DexInteraction from '../../mixins/DexInteraction'
import EosWrapper from '@/util/EosWrapper'
const eos = new EosWrapper()
import initWallet from '@/util/_Wallets2Tokens'
let platformTools = require('@/util/platformTools')
if (platformTools.default) platformTools = platformTools.default

import {
  osName
} from 'mobile-device-detect'
export default {
  components: {
    // ConvertAnyCoin,
    QScrollArea,
    ProfileHeader,
    Wallets,
    // CardCreateWallet,
    // CardImportEOSAccount,
    // CardConvertAnyToVTX,
    // CardMakeVTX,
    // CardWPS,
    // desktop components
    AppsSection,
    StartNodeSection,
    ChainToolsSection,
    // TransactionsSection,
    LiquidityPoolsSection,
    liquidityPoolsTable,
    MakeVTXSection,
    ExchangeSection
    // VespucciRatingSection

  },
  data () {
    return {
      rawPools: [],
      cruxKey: {},
      osName: '',
      screenSize: 0,
      openDialog: false,
      walletClientName: 'verto' // should be 'verto' when in prod
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowWidth)
  },
  beforeCreate () {
    initWallet()
  },
  async created () {
    this.tableData = store.state.wallets.tokens.map(token => {
      token.selected = false
      if (token.hidden === undefined) {
        token.hidden = false
      }
      return token
    })
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
    }

    // Adds the eos account name when it is found to the cruxID

    this.$store.state.currentwallet.wallet = {
      empty: true
    }
    Promise.all(this.tableData)
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
    */
    // this.$store.dispatch('investment/getUniSwapHistoricalData')
    // this.$store.dispatch('investment/getBalancerHistoricalData')
  },
  async mounted () {
    setTimeout(async () => {
      let manualSelectCurrentWallet = false
      await store.state.wallets.tokens.map(async (f) => {
        let stakedAmounts = 0
        if (f.type === 'vtx') {
          let stakes = await eos.getTable('vtxstake1111', f.name, 'accountstake')
          stakes.map(s => {
            s.stake_amount = Math.round(+s.stake_amount.split(' ')[0] * 10000) / 10000
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
      })
    }, 5000)
    setTimeout(() => {
      this.getGodexCoins()
      this.get1inchCoins()
      this.getDefiboxCoins()
    }, 3000)
  },
  methods: {
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    }

  },

  computed: {
    ...mapState('investment', ['zapperTokens', 'poolDataHistory', 'pools'])
  },
  mixins: [DexInteraction]
}
</script>

<style lang="scss" scoped>
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
            border: 1px solid #627797;
            // border-bottom: none;
            border-radius: 10px 10px 0px 0px !important;
        }
    }
}
</style><style>
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
            }
        }
    }
}
.dark-theme{
    .desktop-version{
        background: #04111F;
        padding-bottom: 8px;
        min-height: 102vh;
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
</style>

<template>
  <q-page class="column text-black bg-white" :class="osName.toLowerCase() === 'windows' ? 'desktop-marg': 'mobile-pad'">
    <div class="desktop-version" v-if="osName.toLowerCase() === 'windows'">
      <div class="row">
        <div class="col col-md-3">
          <div class="wallets-container">
            <profile-header :isMobile="false" class="marg" version="type2222" />
            <wallets :isMobile="false" :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
            <!-- <img src="statics/prototype_screens/wallets.jpg" alt=""> -->
          </div>
        </div>
        <div class="col col-md-5">
          <appsSection />
          <startNodeSection />
          <chainToolsSection />
          <TransactionsSection />
          <venueSection />
          <!-- <img src="statics/prototype_screens/apps.jpg" alt=""> -->
          <!-- <img src="statics/prototype_screens/start_node.jpg" alt=""> -->
          <!-- <img src="statics/prototype_screens/chain_tools.jpg" alt=""> -->
          <!-- <img src="statics/prototype_screens/transactions.jpg" alt=""> -->
          <!-- <img src="statics/prototype_screens/venue.jpg" alt=""> -->
        </div>
        <div class="col col-md-4">
          <img src="statics/prototype_screens/vespucci.jpg" class="q-ml-lg" alt="">
          <img src="statics/prototype_screens/make_VTX.jpg" class="q-ml-lg" alt="">
          <img src="statics/prototype_screens/convert_any.jpg" class="q-ml-lg" alt="">
        </div>
      </div>
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
import TransactionsSection from '../../components/Verto/TransactionsSection'
import VenueSection from '../../components/Verto/VenueSection'

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
    ProfileHeader,
    Wallets,
    // CardCreateWallet,
    CardImportEOSAccount,
    CardConvertAnyToVTX,
    CardMakeVTX,
    CardWPS,
    // desktop components
    AppsSection,
    StartNodeSection,
    ChainToolsSection,
    TransactionsSection,
    VenueSection

  },
  data () {
    return {
      cruxKey: {},
      osName: '',
      walletClientName: 'verto' // should be 'verto' when in prod
    }
  },
  async created () {
    // Check if mnemonic exists
    this.osName = osName
    console.log('this.osName', this.osName)
    console.log('store.state.currentwallet.config', store.state.currentwallet.config)
    if (!store.state.currentwallet.config.mnemonic) {
      this.$router.push('recovery-seed')
    } else {
      let wallets2Tokens = require('@/util/Wallets2Tokens')
      if (!store.state.wallets.tokens && wallets2Tokens.default) wallets2Tokens = wallets2Tokens.default
    }

    // Adds the eos account name when it is found to the cruxID
    this.tableData = await store.state.wallets.tokens
    let eosAccount = this.tableData.find(w => w.chain === 'eos' && w.type === 'eos' && w.origin === 'mnemonic')

    if (eosAccount) {
      let accountNames = await eos.getAccountNamesFromPubKeyP(eosAccount.key)

      // May be we could auto convert an eos key to an account if discovered here
      if (accountNames.account_names.includes(eosAccount.name)) {
        console.log('we have an upgraded account', accountNames, eosAccount.name)

        this.cruxKey = await HD.Wallet('crux')
        cruxClient = new CruxPay.CruxClient({
          walletClientName: this.walletClientName,
          privateKey: this.cruxKey.privateKey
        })
        await cruxClient.init()

        let addressMap = await cruxClient.getAddressMap()
        console.log('addressMap', addressMap)

        if (!addressMap.hasOwnProperty('eos')) {
          addressMap['eos'] = { 'addressHash': eosAccount.name }
          cruxClient.putAddressMap(addressMap)
        }
      }
    }
  },
  methods: {
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
  .desktop-version{
    background: #E7E8E8;
    padding-top: 13vh;
    padding-left: 12vh;
    padding-bottom: 50px
  }
  .mobile-pad{
    padding-bottom: 50px
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
</style>

<template>
  <q-page class="column text-black bg-grey-12" style="padding-bottom: 50px">
    <profile-header class="marg" version="type2222" />
    <wallets :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
    <convert-any-coin />
    <br>
    <card-create-wallet />
    <br>
    <card-import-EOS-account />
    <br><br>
    <card-convert-any-to-VTX />
    <br><br>
    <card-make-VTX />
    <br><br>
    <card-WPS />
    <br><br><br>
  </q-page>
</template>

<script>
import store from '../../store'
import ProfileHeader from '../../components/Verto/ProfileHeader'
import CardMakeVTX from '../../components/Verto/CardMakeVTX'
import CardWPS from '../../components/Verto/CardWPS'
import CardConvertAnyToVTX from '../../components/Verto/CardConvertAnyToVTX'
import CardImportEOSAccount from '../../components/Verto/CardImportEOSAccount'
import CardCreateWallet from '../../components/Verto/CardCreateWallet'
import Wallets from '../../components/Verto/Wallets'
import ConvertAnyCoin from '../../components/Verto/ConvertAnyCoin'
import HD from '@/util/hdwallet'
import { CruxPay } from '@cruxpay/js-sdk'
let cruxClient

import EosWrapper from '@/util/EosWrapper'
const eos = new EosWrapper()

let wallets2Tokens = require('@/util/Wallets2Tokens')
if (!store.state.wallets.tokens && wallets2Tokens.default) wallets2Tokens = wallets2Tokens.default

let platformTools = require('@/util/platformTools')
if (platformTools.default) platformTools = platformTools.default

export default {
  components: {
    ConvertAnyCoin,
    ProfileHeader,
    Wallets,
    CardCreateWallet,
    CardImportEOSAccount,
    CardConvertAnyToVTX,
    CardMakeVTX,
    CardWPS
  },
  data () {
    return {
      cruxKey: {},
      walletClientName: 'testwallet' // should be 'verto' when in prod
    }
  },
  async created () {
    // Adds the eos account name when it is found to the cruxID
    this.tableData = await store.state.wallets.tokens
    let eosAccount = this.tableData.find(w => w.chain === 'eos' && w.type === 'eos' && w.origin === 'mnemonic')

    if (eosAccount) {
      let accountNames = await eos.getAccountNamesFromPubKeyP(eosAccount.key)

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

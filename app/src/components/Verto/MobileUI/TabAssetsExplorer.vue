<template>
    <div>
      <q-header class="bg-white" v-if="$route.path != '/verto/dashboard'">
              <q-toolbar :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'bg-white text-black'" class="back_button_wrapper q-pb-sm bg-grey-1">
                <!-- <q-btn flat round dense icon="arrow_back_ios" class="q-mr-sm" @click="closeDialog"/> -->
                <div class="row flex justify-between items-center full-width" style="margin-bottom: -10px;">
                  <q-btn no-caps flat dense icon="arrow_back_ios" label="Back" class="q-pl-sm q-pr-sm q-mr-sm" @click="$router.push('/verto/dashboard')" />
                  <!-- <q-toolbar-title> Assets List </q-toolbar-title> -->

                </div>
              </q-toolbar>
            </q-header>
      <!-- <div v-if="false" class="row justify-between items-center wallets_title_wrapper q-pa-md">
            <div v-if="false">
                <div class="text-h6 text-bold my_custom_title text-grey-8">Wallets</div> -->
        <div v-if="false" class="row justify-between items-center wallets_title_wrapper q-pa-md">
            <div>
                <div class="text-h6 text-bold my_custom_title text-capitalize">{{tabIndex}}</div>
            </div>
            <div v-if="$isbex">
                <q-btn icon="add" :color="$store.state.settings.lightMode === 'true' ? 'white' : 'grey-8'" outline no-caps class="custom-radius" @click="goImport" >Add/Import</q-btn>
            </div>
            <!-- <div v-if="false" class="row text-grey-8">Click on a chain to see assets. </div> -->
            <div v-if="$store.state.investment.defaultAccount" class="row text-grey text-capitalize">{{tabIndex}} for current account </div>

        </div>

        <q-tabs
            v-model="tabIndex"
            dense
            style="max-width: initial"
            no-caps
            outside-arrows
            mobile-arrows
            :dark="$store.state.settings.lightMode === 'true'"
            class="q-pb-md tabindex_wrapper"
            @click="updateTab(tabIndex)"
            :class="{
                'account-tabs': $route.params.accounts,
                'assets-tabs': !$route.params.accounts,
                'text-primary': $store.state.settings.lightMode !== 'true',
                'text-white': $store.state.settings.lightMode === 'true',
                'tabindexDark': $store.state.settings.lightMode === 'true'
            }"
        >
            <q-tab name="receive" :dark="$store.state.settings.lightMode === 'true'" label="Receive" :class="{
                manage: $store.state.wallets.portfolioTotal,
                read:
                  !$store.state.wallets.portfolioTotal &&
                  !$route.params.accounts,
              }"/>
            <q-tab name="import" :dark="$store.state.settings.lightMode === 'true'" label="Import" :class="{
                manage: $store.state.wallets.portfolioTotal,
                read:
                  !$store.state.wallets.portfolioTotal &&
                  !$route.params.accounts,
              }" />
            <q-tab name="create" :dark="$store.state.settings.lightMode === 'true'" label="New account" :class="{ active: tab == 'create', manage: true, }" />
            <q-tab  name="chains" :dark="$store.state.settings.lightMode === 'true'" label="Chains" class="read" v-if="$store.state.wallets.portfolioTotal && !$store.state.investment.defaultAccount"/>
            <q-tab name="assets" :dark="$store.state.settings.lightMode === 'true'" label="Assets" class="read"/>
            <q-tab v-if="$store.state.investment.defaultAccount" :dark="$store.state.settings.lightMode === 'true'" name="history"  label="History" class="read"/>

            <q-tab name="privateKeys"  label="Private Keys" class="manage"/>
            <q-tab name="investments"  label="Investments" class="read" />
        </q-tabs>

        <ChainItemList v-if="!['history'].includes(tabIndex)" :chains="chains" :tab.sync="tabIndex" :chainAction='chainAction' :formatNumber='formatNumber' :showQr='showQr' :getKeyFormat='getKeyFormat' :nFormatter2='nFormatter2' :assetsOptions='assetsOptions' :allAssets='allAssets' :listViewMode='listViewMode' :filterTokens='filterTokens' :getChains='getChains' :allChains='allChains' :showAllChains.sync='showAllChains' :showTokenPage="showTokenPage" :showAllChainData="showAllChainData" :tokenSearchVal="tokenSearchVal" :key="componentKey" :getImportLink="getImportLink"/>
        <History v-else-if="tabIndex == 'history'" :refresh="true" style="height:100vh" />
        <AssetDialog :key="componentKey" v-if="(tabIndex !== 'chains' && !$store.state.investment.defaultAccount) || ((tabIndex == 'investments' && $store.state.investment.defaultAccount)) " :dialog.sync="dialog" :updateTab="updateTab" :tab.sync="tabIndex" :chains="chains" :chainAction='chainAction' :formatNumber='formatNumber' :showQr='showQr' :getKeyFormat='getKeyFormat' :nFormatter2='nFormatter2' :assetsOptions='assetsOptions' :allAssets='allAssets' :listViewMode='listViewMode' :filterTokens='filterTokens'  :getChains='getChains' :allChains='allChains' :showAllChains='showAllChains' :showTokenPage="showTokenPage" :showAllChainData="showAllChainData" :tokenSearchVal="tokenSearchVal" :showPrivateKeys="showPrivateKeys" :getImportLink="getImportLink"/>

    </div>
</template>

<script>
import AssetDialog from './AssetDialog.vue'
import ChainItemList from './ChainItemList.vue'
import History from '../History.vue'
import { setTimeout } from 'timers'
export default {
  name: 'TabAssetExplorer',
  props: ['chains', 'tab', 'chainAction', 'formatNumber', 'showQr', 'getKeyFormat', 'nFormatter2', 'assetsOptions', 'allAssets', 'listViewMode', 'filterTokens', 'getChains', 'allChains', 'showAllChains', 'showTokenPage', 'initTable', 'selectedChain', 'showPrivateKeys', 'alertSecurity', 'tokenSearchVal', 'getImportLink'],
  components: { AssetDialog, ChainItemList, History },
  data () {
    return {
      lightMode: true,
      tabIndex: 'chains',
      qrSelect: false,
      dialog: true,
      componentKey: 1
    }
  },
  mounted () {
    this.tabIndex = this.tab
    if (this.$store.state.investment.defaultAccount) {
      // this.tabIndex = 'assets'
      this.componentKey += 1
    }
  },
  watch: {
    '$store.state.investment.defaultAccount': function (newVal) {
      if (newVal) {
        this.tabIndex = 'assets'
      } else {
        this.tabIndex = 'chains'
        this.dialog = false
      }
      this.componentKey += 1
    },
    tabIndex (val) {
      this.componentKey += 1
      this.$emit('update:tab', val)
      if ((this.$store.state.wallets.portfolioTotal && val !== 'chains') || (!this.$store.state.wallets.portfolioTotal && val !== 'receive') || (this.$route.params.accounts === 'receive')) { this.dialog = true }
      // setTimeout(function () { console.log(":::::: "); this.componentKey += 1 }, 2000)
    },
    tab (val) {
      if (val !== this.tabIndex) { this.tabIndex = val }
    }
  },
  methods: {
    setIndex (index) {
      setTimeout(() => {
        this.tabIndex = index
      }, 1000)
    },
    updateTab (value) {
      if (value !== 'privateKeys') { this.$emit('update:tab', value) }
      if (value === 'import' || value === 'receive') {
        this.getChains()
        this.$emit('update:showQr', {})
      } else if (value === 'chains') {
        this.$emit('update:selectedChain', null)
        this.$store.state.settings.defaultChainData = null
        this.$store.state.wallets.customTotal.show = false
        this.initTable()
      } else if (value === 'assets') {
        this.$store.state.wallets.customTotal.show = false
        this.initTable()
        this.openAssetDialog()
      } else if (value === 'privateKeys') {
        // console.log('showPrivateKeys UPDAT TAB>>', this.showPrivateKeys)
        this.showPrivateKeys ? (this.$emit('update:tab', 'privateKeys')) : (this.$emit('update:alertSecurity', true))
        this.tabIndex = this.tab
        this.$emit('update:showQr', {})
        this.getChains()
        this.$store.state.wallets.customTotal.show = false
      } else if (value === 'investments') {
        this.$store.state.wallets.customTotal.show = false
      }
    },
    openAssetDialog () {
      this.dialog = true
    },
    goImport () {
      this.$router.push({ name: 'accounts', params: { accounts: 'receive', tab: 'import' } })
    },
    showAllChainData () {
      this.$emit('update:showAllChains', true)
      this.getChains()
    }
  }

}
</script>

<style lang="scss" scoped>
/deep/ .history-component {
    padding-top: 30px !important
}
.group:before,
.group:after {
  content: " "; /* 1 */
  display: table; /* 2 */
}
.group:after {
  clear: both;
}
.account-tabs .read {
  display: none;
}
.assets-tabs .manage {
  display: none;
}
.tabindex_wrapper{
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 1;
  background: #eef8ff;
  padding-bottom: 0px;
  box-shadow: 0px 6px 6px 0px rgba(black, .1);
  &.tabindexDark{
    background: #15243d;
  }
  /deep/ .q-tabs__content{
    justify-content: space-between;
    .q-tab{
      &:hover{
        background-color: rgba(#CCC, .1);
      }
      .q-tab__content{
        flex-direction: column-reverse;
        padding-top: 15px;
        padding-bottom: 15px;
      }
      .q-tab__label{
        font-size: 15px;
      }
      .q-tab__indicator{
        background: #64b5f6;
      }
    }
  }
}
.wallets_title_wrapper{
  background: #FFF;
}
/deep/ .custom-radius{
  border-radius: 5px;
}
.my_custom_title{
  // color: #4c4f55;
  font-size: 19px;
}
</style>

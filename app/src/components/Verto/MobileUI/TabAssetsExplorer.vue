<template>
    <div>
        <div class="row justify-between items-center wallets_title_wrapper q-pa-md">
            <div>
                <div class="text-h6 text-bold my_custom_title">Wallets</div>
            </div>
            <div v-if="!$isbex">
                <q-btn :color="$store.state.settings.lightMode === 'true' ? 'white' : 'grey-8'" outline no-caps class="custom-radius" @click="goImport" >Add/Import</q-btn>
            </div>
            <div class="row text-grey">Click on a chain to see assets.{{tabIndex}} </div>
        </div>

        <q-tabs
            v-model="tabIndex"
            dense
            style="max-width: initial"
            no-caps
            outside-arrows
            mobile-arrows
            class="q-pb-md tabindex_wrapper"
            @click="updateTab(tabIndex)"
            :class="{
                'account-tabs': $route.params.accounts,
                'assets-tabs': !$route.params.accounts,
                'text-primary': $store.state.settings.lightMode !== 'true',
                'text-white': $store.state.settings.lightMode === 'true',
            }"
        >
            <q-tab name="receive" icon="get_app" label="Receive" :class="{
                manage: $store.state.wallets.portfolioTotal,
                read:
                  !$store.state.wallets.portfolioTotal &&
                  !$route.params.accounts,
              }"/>
            <q-tab name="import" icon="arrow_downward" label="Import" :class="{
                manage: $store.state.wallets.portfolioTotal,
                read:
                  !$store.state.wallets.portfolioTotal &&
                  !$route.params.accounts,
              }" />
            <q-tab name="create" icon="arrow_downward" label="Create new account" :class="{ active: tab == 'create', manage: true, }" />
            <q-tab name="chains" icon="link" label="Chains" class="read" v-if="$store.state.wallets.portfolioTotal"/>
            <q-tab name="assets" icon="adjust" label="Assets" class="read"/>
            <q-tab name="privateKeys" icon="vpn_key" label="Private Keys" class="manage"/>
            <q-tab name="investments" icon="trending_up" label="Investments" class="read" v-if="$store.state.wallets.portfolioTotal"/>
        </q-tabs>

        <ChainItemList :chains="chains" :tab.sync="tabIndex" :chainAction='chainAction' :formatNumber='formatNumber' :showQr='showQr' :getKeyFormat='getKeyFormat' :nFormatter2='nFormatter2' :assetsOptions='assetsOptions' :allAssets='allAssets' :listViewMode='listViewMode' :filterTokens='filterTokens' :getChains='getChains' :allChains='allChains' :showAllChains.sync='showAllChains' :showTokenPage="showTokenPage" :showAllChainData="showAllChainData" :tokenSearchVal="tokenSearchVal" :key="componentKey" :getImportLink="getImportLink"/>

        <AssetDialog :dialog.sync="dialog" :updateTab="updateTab" :tab.sync="tabIndex" :chains="chains" :chainAction='chainAction' :formatNumber='formatNumber' :showQr='showQr' :getKeyFormat='getKeyFormat' :nFormatter2='nFormatter2' :assetsOptions='assetsOptions' :allAssets='allAssets' :listViewMode='listViewMode' :filterTokens='filterTokens'  :getChains='getChains' :allChains='allChains' :showAllChains='showAllChains' :showTokenPage="showTokenPage" :showAllChainData="showAllChainData" :tokenSearchVal="tokenSearchVal" :showPrivateKeys="showPrivateKeys" :getImportLink="getImportLink"/>
    </div>
</template>

<script>
import AssetDialog from './AssetDialog.vue'
import ChainItemList from './ChainItemList.vue'

export default {
  name: 'TabAssetExplorer',
  props: ['chains', 'tab', 'chainAction', 'formatNumber', 'showQr', 'getKeyFormat', 'nFormatter2', 'assetsOptions', 'allAssets', 'listViewMode', 'filterTokens', 'getChains', 'allChains', 'showAllChains', 'showTokenPage', 'initTable', 'selectedChain', 'showPrivateKeys', 'alertSecurity', 'tokenSearchVal', 'getImportLink'],
  components: { AssetDialog, ChainItemList },
  data () {
    return {
      lightMode: true,
      tabIndex: 'chains',
      qrSelect: false,
      dialog: false,
      componentKey: 1
    }
  },
  mounted () {
    this.tabIndex = this.tab
    console.log(this.tabIndex + ' << mounted tabIndex ', this.tab)
  },
  watch: {
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
    updateTab (value) {
      // console.log('VAlue of tab', value)
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
        console.log('openAssetDialg called value === assets')
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
  color: #8d919d;
  font-size: 19px;
}
</style>

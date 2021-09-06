<template>
    <div class="q-pa-md">
        <div class="row justify-between">
            <div>
                <div class="text-h6 text-bold">DeFi indexes</div>
            </div>
            <div>
                <q-btn flat color="primary" class="text-bold" @click="goImport" >Add/Import</q-btn>
            </div>
            <div  class="row text-grey">tokenized baskets of high quality DeFi project </div>
        </div>

        <q-tabs
            v-model="tabIndex"
            dense
            class="bg-grey-2 text-green q-pb-md"
            @click="updateTab(tabIndex)"
            :class="{
                'account-tabs': $route.params.accounts,
                'assets-tabs': !$route.params.accounts,
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
            <q-tab name="chains" icon="link" label="Chains" class="read" v-if="$store.state.wallets.portfolioTotal"/>
            <q-tab name="assets" icon="adjust" label="Assets" class="read"/>
            <q-tab name="privateKeys" icon="vpn_key" label="Private Keys" class="manage"/>
            <q-tab name="investments" icon="trending_up" label="Investments" class="read"/>
        </q-tabs>

        <ChainItemList :chains="chains" :tab.sync="tabIndex" :chainAction='chainAction' :formatNumber='formatNumber' :showQr='showQr' :getKeyFormat='getKeyFormat' :nFormatter2='nFormatter2' :assetsOptions='assetsOptions' :allAssets='allAssets' :listViewMode='listViewMode' :filterTokens='filterTokens' :getChains='getChains' :allChains='allChains' :showAllChains.sync='showAllChains' :showTokenPage="showTokenPage" :showAllChainData="showAllChainData"/>

        <AssetDialog :dialog.sync="dialog" :updateTab="updateTab" :tab.sync="tabIndex" :chains="chains" :chainAction='chainAction' :formatNumber='formatNumber' :showQr='showQr' :getKeyFormat='getKeyFormat' :nFormatter2='nFormatter2' :assetsOptions='assetsOptions' :allAssets='allAssets' :listViewMode='listViewMode' :filterTokens='filterTokens'  :getChains='getChains' :allChains='allChains' :showAllChains='showAllChains' :showTokenPage="showTokenPage" :showAllChainData="showAllChainData"/>
    </div>
</template>

<script>
import AssetDialog from './AssetDialog.vue'
import ChainItemList from './ChainItemList.vue'

export default {
  name: 'TabAssetExplorer',
  props: ['chains', 'tab', 'chainAction', 'formatNumber', 'showQr', 'getKeyFormat', 'nFormatter2', 'assetsOptions', 'allAssets', 'listViewMode', 'filterTokens', 'getChains', 'allChains', 'showAllChains', 'showTokenPage', 'initTable', 'selectedChain', 'showPrivateKeys', 'alertSecurity'],
  components: { AssetDialog, ChainItemList },
  data () {
    return {
      lightMode: true,
      tabIndex: 'chains',
      qrSelect: false,
      dialog: false
    }
  },
  mounted () {
    this.tabIndex = this.tab
  },
  watch: {
    tabIndex (val) {
      this.$emit('update:tab', val)
      if (val !== 'chains') { this.dialog = true }
    }
  },
  methods: {
    updateTab (value) {
      console.log('update tab', value)
      this.$emit('update:tab', value)
      if (value === 'import' || value === 'receive') {
        console.log('TAA-import ', value)
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
        this.showPrivateKeys ? (this.$emit('update:tab', value)) : (this.$emit('update:alertSecurity', true))
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
</style>

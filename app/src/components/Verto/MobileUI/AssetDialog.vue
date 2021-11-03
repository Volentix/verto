<template>
    <div class="">
        <q-dialog
            v-model="dialog"
            persistent
            :maximized="maximizedToggle"
            transition-show="slide-up"
            transition-hide="slide-down"
        >
        <q-card  :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card': 'text-black'" :style="$store.state.settings.lightMode === 'true' ?'':'background: #f2f2f2 !important'">
            <q-header class="bg-white">
              <q-toolbar :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'bg-white text-black'">
                <q-btn flat round dense icon="arrow_back_ios" class="q-mr-sm" @click="closeDialog"/>
                <q-toolbar-title> Assets List </q-toolbar-title>
                <q-btn flat round dense icon="close" v-close-popup @click="closeDialog"/>
              </q-toolbar>
            </q-header>

            <q-card-section class="q-mt-xl">
                <q-tabs
                  style="max-width: initial"
                    v-model="tabIndex"
                    dense
                    no-caps
                    outside-arrows
                    mobile-arrows
                    class="bg-grey-2 text-primary q-pb-md"
                    @input="handleTab(tabIndex)"
                    :class="{
                        'account-tabs': $route.params.accounts,
                        'assets-tabs': !$route.params.accounts,
                        'mobile-card text-white':  $store.state.settings.lightMode === 'true'
                    }"
                >
                    <q-tab name="receive" dense label="Receive" :class="{
                        manage: $store.state.wallets.portfolioTotal,
                        read:
                        !$store.state.wallets.portfolioTotal &&
                        !$route.params.accounts,
                    }"/>
                    <q-tab name="import"  label="Import" :class="{
                        manage: $store.state.wallets.portfolioTotal,
                        read:
                        !$store.state.wallets.portfolioTotal &&
                        !$route.params.accounts,
                    }" />
                    <q-tab name="create"  label="New account" :class="{ active: tab == 'create', manage: true, }" />
                    <q-tab name="chains"  label="Chains" class="read" v-if="$store.state.wallets.portfolioTotal"/>
                    <q-tab name="assets" label="Assets" class="read"/>
                    <q-tab name="privateKeys"  label="Private Keys" class="manage" @click="handlePrivateKey(tabIndex)"/>
                    <q-tab name="investments"  label="Investments" class="read" v-if="$store.state.wallets.portfolioTotal"/>
                </q-tabs>
            </q-card-section>

            <div class=" q-pl-md q-pb-md" v-if="tabIndex == 'import'">
                Select chain to import
            </div>
            <div class="q-pl-md q-pb-md" v-else-if="tabIndex == 'receive'">
                Select chain to copy or view your receiving account
            </div>
            <div class=" q-pl-md q-pb-md" v-else-if="tabIndex == 'privateKeys'">
                Select chain to copy private keys
            </div>

            <q-card-section class="q-pt-none">
                <ChainItemList :chains="chains" :tab.sync="tabIndex" :chainAction='chainAction' :formatNumber='formatNumber' :showQr='showQr' :getKeyFormat='getKeyFormat' :nFormatter2='nFormatter2' :assetsOptions='assetsOptions'  :allAssets='allAssets' :listViewMode='listViewMode' :filterTokens='filterTokens' :getChains='getChains' :allChains='allChains' :showAllChains='showAllChains' :showTokenPage="showTokenPage" :showAllChainData="showAllChainData" :tokenSearchVal="tokenSearchVal" :getImportLink="getImportLink"/>
            </q-card-section>
        </q-card>
        </q-dialog>
    </div>
</template>

<script>
import ChainItemList from './ChainItemList.vue'

export default {
  name: 'AssesDialogMobile',
  props: ['dialog', 'chains', 'updateTab', 'tab', 'chainAction', 'formatNumber', 'showQr', 'getKeyFormat', 'nFormatter2', 'assetsOptions', 'allAssets', 'listViewMode', 'filterTokens', 'getChains', 'allChains', 'showAllChains', 'showTokenPage', 'showAllChainData', 'tokenSearchVal', 'showPrivateKeys', 'getImportLink'],
  components: { ChainItemList },
  data () {
    return {
      maximizedToggle: true,
      open: false,
      tabIndex: 'assets',
      previousTab: ''
    }
  },
  watch: {
    tab (val) {
      this.tabIndex = val
    }
  },
  methods: {
    closeDialog () {
      if (!this.$route.query.hasOwnProperty('return')) {
        this.handleTab(this.$store.state.wallets.portfolioTotal ? 'chains' : 'receive')
        this.$emit('update:tab', this.$store.state.wallets.portfolioTotal ? 'chains' : 'receive')
        this.$emit('update:dialog', false)
        this.$router.push({
          path: '/verto/dashboard'
        })
      } else {
        this.$router.push({
          path: `/verto/${this.$route.query.return}`
        })
      }
    },
    handleTab (index) {
      this.updateTab(index)
      // console.log('assetDialg handleTab ', this.showPrivateKeys)
      if (!this.showPrivateKeys && index === 'privateKeys') {
        this.tabIndex = this.previousTab
      }
    },
    handlePrivateKey (value) {
      this.previousTab = value
    }
  }

}
</script>

<style lang="scss" scoped>
.mobile-card{
    background-color: #04111F !important;
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
</style>

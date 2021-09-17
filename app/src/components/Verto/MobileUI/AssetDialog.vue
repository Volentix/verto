<template>
    <div>
        <q-dialog
            v-model="dialog"
            persistent
            :maximized="maximizedToggle"
            transition-show="slide-up"
            transition-hide="slide-down"
        >
        <q-card class=" text-black" style="background: #f2f2f2 !important">
            <q-toolbar >
                <q-btn flat round dense icon="arrow_back_ios" class="q-mr-sm" @click="closeDialog"/>
                <q-toolbar-title> Coins/Assets List </q-toolbar-title>
                <q-btn flat round dense icon="close" v-close-popup @click="closeDialog"/>
            </q-toolbar>

            <q-card-section>
                <q-tabs
                  style="max-width: initial"
                    v-model="tabIndex"
                    dense
                    no-caps
                    outside-arrows
                    mobile-arrows
                    class="bg-grey-2 text-green q-pb-md"
                    @input="handleTab(tabIndex)"
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
                    <q-tab name="create" icon="arrow_downward" label="Create new account" :class="{ active: tab == 'create', manage: true, }" />
                    <q-tab name="chains" icon="link" label="Chains" class="read" v-if="$store.state.wallets.portfolioTotal"/>
                    <q-tab name="assets" icon="adjust" label="Assets" class="read"/>
                    <q-tab name="privateKeys" icon="vpn_key" label="Private Keys" class="manage" @click="handlePrivateKey(tabIndex)"/>
                    <q-tab name="investments" icon="trending_up" label="Investments" class="read"/>
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
                <ChainItemList :chains="chains" :tab.sync="tabIndex" :chainAction='chainAction' :formatNumber='formatNumber' :showQr='showQr' :getKeyFormat='getKeyFormat' :nFormatter2='nFormatter2' :assetsOptions='assetsOptions'  :allAssets='allAssets' :listViewMode='listViewMode' :filterTokens='filterTokens' :getChains='getChains' :allChains='allChains' :showAllChains='showAllChains' :showTokenPage="showTokenPage" :showAllChainData="showAllChainData" :tokenSearchVal="tokenSearchVal" />
            </q-card-section>
        </q-card>
        </q-dialog>
    </div>
</template>

<script>
import ChainItemList from './ChainItemList.vue'

export default {
  name: 'AssesDialogMobile',
  props: ['dialog', 'chains', 'updateTab', 'tab', 'chainAction', 'formatNumber', 'showQr', 'getKeyFormat', 'nFormatter2', 'assetsOptions', 'allAssets', 'listViewMode', 'filterTokens', 'getChains', 'allChains', 'showAllChains', 'showTokenPage', 'showAllChainData', 'tokenSearchVal'],
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
      this.$emit('update:tab', 'chains')
      this.$emit('update:dialog', false)
      this.$router.push({
        path: '/verto/dashboard'
      })
    },
    handleTab (index) {
      this.updateTab(index)
      if (index === 'privateKeys') {
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

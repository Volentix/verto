<template>
    <div class="q-pb-xl q-pb-xl2">
        <div class="q-pb-sm">
            <div v-if="
                (($route.params.accounts || !$store.state.wallets.portfolioTotal) &&
                !['assets', 'investments'].includes(tab)) ||
                tab == 'chains'" class="q-pb-xl q-pb-xl3">
                <!-- <h4 class="new_title_style text-grey-8 q-pl-sm q-ml-xs">Assets List</h4> -->
                <q-list :dark="$store.state.settings.lightMode === 'true'" bordered separator class="" :class="$store.state.settings.lightMode === 'true' ? '': ' bg-white text-black'">

                    <q-item clickable v-ripple
                        v-for="(chain, i) in chains.filter(a => tab !== 'privateKeys' || (a.accounts && a.accounts.length))"
                        :key="i"
                        v-show="!allChains"
                        @click="tab !=='receive' ? openAssetDialog (chain) : chainAction(chain) "
                        :dark="$store.state.settings.lightMode === 'true'"
                        class="q-pt-md q-pb-md q-pt-md3"
                    >
                        <q-item-section avatar top>
                          <q-avatar  v-if="!showQr[chain.chain]">
                              <img :src="chain.icon" onerror="this.src='https://etherscan.io/images/main/empty-token.png';" />
                          </q-avatar>
                        </q-item-section>
                        <q-item-section class="chain_and_total_account_section">
                            <q-item-label lines="1" class="text-bold text-capitalize ellipsis">{{chain.label}} </q-item-label>
                            <div class="relative-p" v-if="!$route.params.accounts && tab == 'chains' && chain.chainTotal > 0" >
                              <q-item-label class="assets_under_chain_wrapper" v-for="(item, index) in getChainList(chain)"
                                :key="index+Math.floor(Math.random() * 1000)"
                              >
                                <q-btn
                                  align="left"
                                  size="sm"
                                  class="col-12 q-mb-sm text-left"
                                  flat
                                  dense
                                >
                                  <q-avatar size="xs">
                                    <img :src="item.icon" onerror="this.src='https://etherscan.io/images/main/empty-token.png';" />
                                  </q-avatar>
                                  <span class="q-pl-sm">{{item.type.toUpperCase()}}</span>
                                  <span class="q-pl-sm text-grey">${{ formatNumber(item.usd, 0) }}</span>
                                </q-btn>
                              </q-item-label>
                            </div>
                            <!-- CHAIN SECTION END  -->
                            <!-- RECEIVE / PRIVATE KEY SECTION  -->
                            <div v-if="tab !== 'import' &&(!$route.params.accounts || tab == 'receive' || tab == 'privateKeys')" class="q-pt-md4 relative" :class="{'': checkRecvPrivateKeyAccess(chain)}">
                              <q-btn
                                  v-if="checkRecvPrivateKeyAccess(chain)"
                                  @click="$set(showQr, chain.chain, true)"
                                  unelevated
                                  color="grey-2"
                                  text-color="black"
                                  no-caps
                                  size="sm"
                                  dense
                                  class="full-width"
                                  icon-right="img:https://image.flaticon.com/icons/png/512/107/107072.png"
                              />
                            </div>
                            <div v-if="showQr[chain.chain]" class="qr-code">
                                <qrcode
                                :key="tab"
                                dark
                                :value="chain[tab == 'privateKeys' ? 'privateKey' : 'key']"
                                :options="{ size: 100 }"
                                ></qrcode>
                            </div>
                            <div :class="{ 'text-body1 copy-key text-right' : !showQr[chain.chain], 'text-body2': showQr[chain.chain], }"
                                v-if=" tab == 'receive' && chain.accounts && chain.accounts.length == 1" class="address_truncut">
                                <span @click="chainAction(chain)" v-if="!showQr[chain.chain]" class="">
                                    <span class="">{{ chain.chain == "eos" ? chain.name : getKeyFormat(chain.key) }}</span>
                                    <q-icon name="o_file_copy" size="xs" color="grey-7" class="q-ml-sm" />
                                </span>
                                <q-btn v-else rounded class="cursor-pointer_" @click="showQr[chain.chain] = false">
                                  <q-icon name="visibility_off" /> Hide QR Code
                                </q-btn>
                            </div>
                            <div
                                :class="{
                                    'text-body1 copy-key': !showQr[chain.chain],
                                    'text-body2': showQr[chain.chain],
                                }"
                                v-else-if="tab == 'privateKeys'"
                            >
                                <div
                                    @click="chainAction(chain)"
                                    v-if="
                                    chain.accounts &&
                                    chain.accounts.length == 1 &&
                                    chain.accounts[0].privateKey &&
                                    !showQr[chain.chain]
                                    "
                                >
                                    {{ getKeyFormat(chain.privateKey) }}
                                    <q-icon name="o_file_copy" />
                                </div>
                                <div
                                    @click="chainAction(chain)"
                                    v-else-if="
                                    tab == 'privateKeys' &&
                                    chain.accounts &&
                                    (chain.accounts.length > 1 || !chain.accounts[0].privateKey)
                                    "
                                >
                                    {{ chain.accounts.length }} private keys
                                    <q-icon name="arrow_forward_ios" />
                                </div>
                                <span
                                    class="cursor-pointer"
                                    @click="showQr[chain.chain] = false"
                                    v-else-if="
                                    tab == 'privateKeys' &&
                                    chain.accounts &&
                                    chain.accounts.length == 1 &&
                                    showQr[chain.chain]
                                    "
                                    ><q-icon name="visibility_off" /> Hide QR Code
                                </span>
                            </div>
                            <div
                                class="text-body1 copy-key"
                                v-else-if=" tab == 'receive' && chain.accounts && chain.accounts.length > 1 ">
                                <span class="nbr_total_account">{{ chain.accounts.length }} accounts</span>
                                <q-icon name="arrow_forward_ios" />
                            </div>
                            <div class="text-caption" v-else-if="tab == 'import' || tab == 'create'">
                                <span class="text-capitalize"></span>
                                <q-icon name="arrow_right_alt" />
                            </div>
                            <span v-else-if="tab == 'chains' && chain.chain == 'eos' && chain.type == 'verto' ">
                                <q-btn label="Get EOS account" outline rounded />
                            </span>
                            <div
                                @click="$router.push(getImportLink('eos'))"
                                class="text-caption q-pt-md"
                                v-else-if="chain.type == 'verto'"
                                >
                                Setup account <q-icon name="arrow_right_alt" />
                            </div>
                            <!-- <div class="text-caption q-pt-md" v-else-if="!$route.params.accounts" >
                                Select <q-icon name="arrow_right_alt" />
                            </div> -->
                            <!-- END RECEIVE / PRIVATE KEY SECTION  -->
                        </q-item-section>
                        <q-item-section v-if="tab == 'chains'" side middle>
                          <!-- CHAIN / RECEIVE / IMPORT COMMON SECTION -->
                          <div :class="$store.state.settings.lightMode === 'true' ? '': 'text-black'" class="text-bold text-h7" v-if="!$route.params.accounts || !(tab == 'receive' || tab == 'privateKeys' || tab == 'import' || tab == 'create' )">
                            ${{ nFormatter2(chain.chainTotal, chain.chainTotal > 10 ? 0 : 2) }}
                          </div >
                          <!-- COMMON SECTION END  -->
                        </q-item-section>
                        <!-- <q-item-section side middle>
                          <q-btn color="white" text-color="grey-7" dense icon="chevron_right" flat class="more_verti_btn" unelevated @click="chainAction(chain)" /> -->
                        <q-item-section v-if="tab == 'chains'" side middle>
                          <q-icon name="keyboard_arrow_right" :color="$store.state.settings.lightMode === 'true' ? 'white':''" />
                        </q-item-section>
                    </q-item>
                    <!-- <q-item>
                        <div class="col-md-12 flex flex-center text-body1 cursor-pointer" v-if="!showAllChains && tab == 'chains' " @click="showAllChainData()">
                            <span>Show all chains</span>
                        </div>
                    </q-item> -->
                </q-list>
            </div>
            <!-- ASSET LOOP SECTION  -->
            <div v-show="tab == item.id"
                v-for="(item, index) in assetsOptions.filter(
                    (o) => !allAssets || o.title == allAssets.title
                )"
                :key="index + Math.random() * 1000"
                class="q-pb-xl q-pb-xl4"
            >
                <q-list :dark="$store.state.settings.lightMode === 'true'" bordered separator class="" :class="$store.state.settings.lightMode === 'true' ? '': ' bg-white text-black'">

                    <q-item clickable v-ripple
                        v-show=" (!allAssets || item.id == 'investments' || listViewMode == 'card') && asset.type.toUpperCase() !=='VERTO'"
                        @click="showTokenPage(asset)"
                        v-for="(asset, i) in filterTokens"
                        :key="i"
                        class="q-pt-md q-pt-md2"
                    >
                        <q-item-section avatar top>
                          <q-avatar>
                              <img :src="asset.icon" onerror="this.src='https://etherscan.io/images/main/empty-token.png';"/>
                          </q-avatar>
                        </q-item-section>
                        <q-item-section>
                          <!-- <q-item-label lines="1" class="text-bold text-capitalize ellipsis">{{asset.type.toUpperCase()}} </q-item-label>
                            <q-item-label></q-item-label>
                            <q-item-label :class="{'text-black': !$store.state.settings.lightMode === 'true',}" class="q-pt-sm">
                              Amount: <span class="text-grey q-pl-xs">{{ formatNumber(asset.amount, 6) }}</span>
                            </q-item-label>
                            <q-item-label>
                                <div class="q-pt-sm">
                                  Price: <span class="text-grey q-pl-xs">${{ formatNumber(asset.rateUsd, 4) }}</span>
                                </div>
                                <div class="q-py-sm" v-if="asset.protocol">
                                  <q-icon class="q-pr-sm" size="1.2rem" :name="'img:' + asset.protocolIcon"/>
                                  {{ asset.protocol }}:
                                </div> -->
                            <q-item-label lines="1" class="text-bold text-capitalize ellipsis">{{asset.type.toUpperCase()}}  {{ asset.isStaked ? 'Staked' : ''}}</q-item-label>
                            <q-item-label></q-item-label>
                            <q-item-label :class="{'text-black': !$store.state.settings.lightMode === 'true',}" class="">
                              Amount:
                              <span class="text-grey q-pl-xs">{{ formatNumber(asset.amount, 2) }} {{asset.type.toUpperCase()}}</span>
                            </q-item-label>
                            <q-item-label>
                              <div class="q-pt-sm" v-if="false && asset.rateUsd">
                                Price: <span class="text-grey q-pl-xs">${{ formatNumber(asset.rateUsd, 4) }}</span>
                              </div>
                              <div class="q-py-sm" v-if="asset.protocol">
                                <q-icon class="q-pr-sm" size="1.2rem" :name="'img:' + asset.protocolIcon"/>{{ asset.protocol }}:
                              </div>
                              <span class="text-grey" v-if="asset.poolsCount == 1">{{ asset.poolName }} pool</span>
                              <span class="text-grey" v-else-if="asset.poolsCount">{{ asset.poolsCount }} pools</span>
                            </q-item-label>

                            <!-- <q-item-label
                              class="text-caption chain-label q-py-sm"
                              v-if="asset.chainLabel"
                              :class="{
                                  'text-white': $store.state.settings.lightMode === 'true',
                              }"
                              >Chain:
                              <span class="text-grey">{{
                                  asset.chainLabel.replace("Chain", "")
                              }}</span>
                            </q-item-label> -->
                            <q-item-label>
                                    <!-- <p v-if="!filterTokens.length">
                                    No assets found {{ tokenSearchVal ? "" : "for this chain" }}
                                    </p> -->
                                    <!-- <AssetBalancesTable
                                    @setAsset="showTokenPage"
                                    data-title="Asset balances"
                                    data-intro="Here you can see the asset balances"
                                    :rowsPerPage="8"
                                    v-if="allAssets && listViewMode == 'list'"
                                    class="full-width"
                                    :tableData="filterTokens(allAssets)"
                                    /> -->

                            </q-item-label>
                        </q-item-section>

                        <q-item-section side middle>
                            <q-item-label v-if="asset.rateUsd" class="text-h7 text-bold" :class="$store.state.settings.lightMode === 'true' ? '': ' text-black'">
                                <div >${{ formatNumber(asset.usd, 2) }} </div>
                            </q-item-label>
                            <div v-if="false" class="text-bold text-h7 text-black q-mt-md">
                              <span
                                v-if="asset.change24hPercentage"
                                :class="'sr-txt ' + asset.color"
                                >{{ asset.color === "text-green-6" ? "↑" : "↓" }}
                                {{ asset.change24hPercentage.substring(1) }}
                              </span>
                            </div>
                            <div class="" v-if="false && tab == 'assets'">
                                <q-chip dense>
                                  <!-- <q-avatar icon="insights" :color="$store.state.settings.lightMode === 'true' ? 'black': 'red'" text-color="white" /> -->
                                    <q-avatar icon="chevron_right" :color="$store.state.settings.lightMode === 'true' ? 'grey-12': 'grey-12'" text-color="black" />
                                    Send
                                </q-chip>
                            </div>
                        </q-item-section>
                        <q-item-section side middle>
                          <q-avatar flat icon="chevron_right" dense :text-color="$store.state.settings.lightMode === 'true' ? 'white':'black'" />
                        </q-item-section>
                    </q-item>
                    <p v-if="!filterTokens.length">
                    No assets found
                    </p>
                </q-list>
            </div>
            <!-- <div>
              <span class="version version2 full-width text-center column"> -->
            <div v-if="false">
              <span class="version full-width text-center column">
                <span class="q-mb-md">{{version}}</span>
                <span class="q-pa-md text-grey-6">
                  This app is in beta, please send us bug reports if you find any. <b><a target="_blank" class="text-blue-7" href="https://t.me/vertosupport">t.me/vertosupport</a></b>
                </span>
              </span>
            </div>
        </div>
    </div>
</template>

<script>
import { version } from '../../../../package.json'

export default {
  name: 'ChainItem',
  props: ['chains', 'tab', 'chainAction', 'formatNumber', 'showQr', 'getKeyFormat', 'nFormatter2', 'assetsOptions', 'allAssets', 'listViewMode', 'filterTokens', 'getChains', 'allChains', 'showAllChains', 'showTokenPage', 'showAllChainData', 'tokenSearchVal', 'getImportLink'],
  data () {
    return {
      lightMode: true,
      version: {}
    }
  },
  mounted () {
    this.version = version
    if (this.$q.platform.is.mobile && !this.showAllChains && this.tab === 'chains') { this.showAllChainData() }
  },
  methods: {
    openAssetDialog (chain) {
      if (this.tab !== 'receive' && this.tab !== 'privateKeys') { this.chainAction(chain) }
      if (this.tab === 'chains') { this.$emit('update:tab', 'assets') }
    },
    checkRecvPrivateKeyAccess (chain) {
      try {
        if ((this.tab === 'receive' || this.tab === 'privateKeys') &&
            !this.showQr[chain.chain] &&
            chain.accounts.length === 1 &&
            chain[this.tab === 'privateKeys' ? 'privateKey' : 'key']) { return true }
      } catch (e) { return false }
    },
    getChainList (chain) {
      return this.assetsOptions[0].data.filter((o) => o.chain === chain.chain).slice(0, 1)
    }
  }

}
</script>

<style lang="scss" scoped>
.version{
  padding: 5px 0px;
  text-align: center;
  color: #333;
  font-size: 16px;
}
.relative-p{
  position: relative;
}
.assets_under_chain_wrapper{
  position: absolute;
  left: -3px;
  display: none;
}
.new_title_style{
  font-weight: 600;
  font-size: 18px;
  margin-top: 0px;
  margin-bottom: 0px;
}
.chain_and_total_account_section{
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  // margin-right: -25px;
}
.nbr_total_account{
  font-size: 12px;
  margin-left: 0px;
  margin-right: 10px;
  padding: 5px;
  background: rgba(#000, .03);
  border-radius: 5px;
  letter-spacing: 0px;
}
/deep/ .more_verti_btn{
  .q-icon{
    // margin-right: -15px;
    // margin-left: 5px;
  }
}
.relative{
  position: relative;
}
.address_truncut{
  position: absolute;
  font-size: 12px;
  right: 36%;
  text-align: center;
}
</style>

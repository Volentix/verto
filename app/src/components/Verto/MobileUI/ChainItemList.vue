<template>
    <div class="q-pb-xl">
        <div class="q-pb-sm">
            <div v-if="
                (($route.params.accounts || !$store.state.wallets.portfolioTotal) &&
                !['assets', 'investments'].includes(tab)) ||
                tab == 'chains'
            " class="q-pb-xl">
                <q-list  :dark="$store.state.settings.lightMode === 'true'" bordered separator class="rounded-borders" :class="$store.state.settings.lightMode === 'true' ? '': ' bg-white text-black'">

                    <q-item clickable v-ripple
                        v-for="(chain, i) in chains.filter(a => tab !== 'privateKeys' || (a.accounts && a.accounts.length))"
                        :key="i"
                        v-show="!allChains"
                        @click="tab !=='receive' ? openAssetDialog (chain) : '' "
                        class="q-pt-md"
                    >
                        <q-item-section avatar top>
                            <q-avatar  v-if="!showQr[chain.chain]">
                                <img :src="chain.icon" onerror="this.src='https://etherscan.io/images/main/empty-token.png';" />
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label lines="1" class="text-bold text-capitalize ellipsis">{{chain.label}} </q-item-label>
                            <div v-if="!$route.params.accounts && tab == 'chains' && chain.chainTotal > 0" > <br>
                                <q-item-label v-for="(item, index) in getChainList(chain)"
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

                                        <span class="q-pl-sm text-grey"
                                        >${{ formatNumber(item.usd, 0) }}</span
                                        >
                                    </q-btn>
                                </q-item-label>
                            </div>

                            <!-- CHAIN SECTION END  -->

                            <!-- RECEIVE / PRIVATE KEY SECTION  -->
                            <div v-if="tab !== 'import' &&(!$route.params.accounts || tab == 'receive' || tab == 'privateKeys')"  class="q-pt-md">

                                <q-btn
                                    v-if="checkRecvPrivateKeyAccess(chain)"
                                    @click="$set(showQr, chain.chain, true)"
                                    rounded
                                    size="sm"
                                    class="full-width_"
                                    label="Show"
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
                            <div :class="{ 'text-body1 q-pt-md copy-key' : !showQr[chain.chain], 'text-body2': showQr[chain.chain], }"
                                v-if=" tab == 'receive' && chain.accounts && chain.accounts.length == 1"
                            >
                                <span @click="chainAction(chain)" v-if="!showQr[chain.chain]" >
                                    {{ chain.chain == "eos" ? chain.name : getKeyFormat(chain.key) }}
                                    <q-icon name="o_file_copy" />
                                </span>

                                <q-btn rounded
                                    class="cursor-pointer_"
                                    @click="showQr[chain.chain] = false"
                                    v-else
                                    ><q-icon name="visibility_off" /> Hide QR Code
                                </q-btn>

                            </div>
                            <div
                                :class="{
                                    'text-body1 q-pt-md copy-key': !showQr[chain.chain],
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
                                @click="chainAction(chain)"
                                class="text-body1 q-pt-md copy-key"
                                v-else-if=" tab == 'receive' && chain.accounts && chain.accounts.length > 1 "
                            >
                                {{ chain.accounts.length }} accounts <q-icon name="arrow_forward_ios" />
                            </div>
                            <div class="text-caption q-pt-md" v-else-if="tab == 'import' || tab == 'create'">
                                <span class="text-capitalize">
                                {{tab}}
                                </span>  <q-icon name="arrow_right_alt" />
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

                        <q-item-section side top>
                            <!-- CHAIN / RECEIVE / IMPORT COMMON SECTION -->
                            <div :class="$store.state.settings.lightMode === 'true' ? '': 'text-black'" class="text-bold text-h7" v-if="!$route.params.accounts || !(tab == 'receive' || tab == 'privateKeys' || tab == 'import' || tab == 'create' )" >${{ nFormatter2(chain.chainTotal, chain.chainTotal > 10 ? 0 : 2) }} </div >

                            <!-- COMMON SECTION END  -->
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
                class="q-pb-xl"
            >
                <q-list :dark="$store.state.settings.lightMode === 'true'" bordered separator class="rounded-borders" :class="$store.state.settings.lightMode === 'true' ? '': ' bg-white text-black'">

                    <q-item clickable v-ripple
                        v-show=" (!allAssets || item.id == 'investments' || listViewMode == 'card') && asset.type.toUpperCase() !=='VERTO'"
                        @click="showTokenPage(asset)"
                        v-for="(asset, i) in filterTokens"
                        :key="i"
                        class="q-pt-md"
                    >
                        <q-item-section avatar top>
                            <q-avatar>
                                <img :src="asset.icon" onerror="this.src='https://etherscan.io/images/main/empty-token.png';"/>
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label lines="1" class="text-bold text-capitalize ellipsis">{{asset.type.toUpperCase()}} </q-item-label>
                            <q-item-label>
                            </q-item-label>

                            <q-item-label
                                :class="{'text-black': !$store.state.settings.lightMode === 'true',}"
                                class="q-pt-sm"
                            >
                                Amount:
                                <span class="text-grey q-pl-xs">{{ formatNumber(asset.amount, 6) }}</span>
                            </q-item-label>
                            <q-item-label>
                                <div class="q-pt-sm">
                                        Price:
                                        <span class="text-grey q-pl-xs"
                                            >${{ formatNumber(asset.rateUsd, 4) }}</span
                                        >
                                        </div>
                                        <div class="q-py-sm" v-if="asset.protocol">
                                        <q-icon
                                            class="q-pr-sm"
                                            size="1.2rem"
                                            :name="'img:' + asset.protocolIcon"
                                        />{{ asset.protocol }}:
                                        </div>
                                        <span class="text-grey" v-if="asset.poolsCount == 1"
                                        >{{ asset.poolName }} pool</span
                                        >
                                        <span class="text-grey" v-else-if="asset.poolsCount"
                                        >{{ asset.poolsCount }} pools</span>
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

                        <q-item-section side top>
                            <q-item-label class="text-h7  text-bold" :class="$store.state.settings.lightMode === 'true' ? '': ' text-black'">
                                <div >${{ formatNumber(asset.usd, 2) }} </div >
                            </q-item-label>
                            <div class="text-bold text-h7 text-black q-mt-md">
                                <span
                                    v-if="asset.change24hPercentage"
                                    :class="'sr-txt ' + asset.color"
                                    >{{ asset.color === "text-green-6" ? "↑" : "↓" }}
                                    {{ asset.change24hPercentage.substring(1) }}
                                </span>
                            </div>
                            <div class=" ">
                                <q-chip dense>
                                    <q-avatar icon="insights" :color="$store.state.settings.lightMode === 'true' ? 'black': 'red'" text-color="white" />
                                    Trade
                                </q-chip>
                            </div>
                        </q-item-section>
                    </q-item>
                    <p v-if="!filterTokens.length">
                    No assets found {{ tokenSearchVal ? "" : "for this chain" }}
                    </p>
                </q-list>
            </div>

        </div>
    </div>
</template>

<script>

export default {
  name: 'ChainItem',
  props: ['chains', 'tab', 'chainAction', 'formatNumber', 'showQr', 'getKeyFormat', 'nFormatter2', 'assetsOptions', 'allAssets', 'listViewMode', 'filterTokens', 'getChains', 'allChains', 'showAllChains', 'showTokenPage', 'showAllChainData', 'tokenSearchVal', 'getImportLink'],
  data () {
    return {
      lightMode: true
    }
  },
  mounted () {
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
</style>

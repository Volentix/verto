<template>
    <div>
        <q-toolbar >
            <!-- <q-btn flat round dense icon="menu" class="q-mr-sm" /> -->

            <img src="statics/icons/verto_vulps_logo.svg" width="30" class="png_logo" alt="">

            <q-toolbar-title class="primary" :class="{'text-white': $store.state.settings.lightMode === 'true'} ">VERTO</q-toolbar-title>
            <div class="q-gutter-sm">
                <SearchList :openSearch.sync="openSearch"  v-if="openSearch"/>
                <q-btn dense size="lg" color="white" unelevated text-color="black" class="search_btn" icon="search" @click="openSearch = true" />
                <q-btn dense size="lg" color="white" @click="tabsAlert = !tabsAlert" class="settings_btn" text-color="black" unelevated icon="settings" />
                <q-btn v-if="false" :class="$store.state.settings.lightMode === 'true' ? 'text-black':'text-black'" :color="$store.state.settings.lightMode === 'true' ? 'white': ''" dense icon="qr_code" @click="qrSelect = true" />
                <q-btn v-if="false" :class="$store.state.settings.lightMode === 'true' ? 'text-black':'text-black'" :color="$store.state.settings.lightMode === 'true' ? 'white': ''"   dense icon="notifications">
                    <q-menu transition-show="flip-right" transition-hide="flip-left" auto-close>
                        <q-list separator style="min-width: 100px">
                            <q-item>
                                <q-item-section>
                                    <q-item-label>Transaction alert :</q-item-label>
                                    <q-item-label caption lines="2">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
                                </q-item-section>

                                <q-item-section side top>
                                    <q-item-label caption>5 min ago</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-separator spaced inset />
                            <q-item>
                                <q-item-section>
                                    <q-item-label>Transaction alert </q-item-label>
                                    <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
                                </q-item-section>

                                <q-item-section side top>
                                    <q-item-label caption>US $10</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-separator spaced inset />
                            <q-item>
                                <q-item-section>
                                    <q-item-label>Payment Updated </q-item-label>
                                    <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
                                </q-item-section>
                                <q-item-section side top>
                                    <q-badge color="teal" label="10k" />
                                </q-item-section>
                            </q-item>
                            <q-separator spaced inset />
                            <q-item>
                                <q-item-section>
                                    <q-item-label>Send Money alert </q-item-label>
                                    <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
                                </q-item-section>
                                <q-item-section side top>
                                    <q-item-label caption>2 min ago</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>

                </q-btn>
            </div>
        </q-toolbar>
        <q-dialog v-model="tabsAlert" class="tabs_alert_dialog" position="top">
          <q-card style="width: 100%;max-width:50%;margin-top: 70px;margin-right: -43%">
            <q-card-section>
              <q-tabs
                v-model="tabRoute"
                indicator-color="primary"
                vertical
                :active-color="$store.state.settings.lightMode === 'true' ? 'white':'primary'"
                :active-bg-color="$store.state.settings.lightMode === 'true' ? 'light-blue-10':'white'"
                class="text-bold tabroute_wrapper"
                inline-label
                :class="$store.state.settings.lightMode === 'true' ? 'mobile-card':'bg-white text-grey-7'"
              >
                <q-tab flat v-if="!$isbex" name="exchange" no-caps @click="goTo('crosschain-exchange')" label="Exchange"/>
                <q-tab flat name="history" icon="history" no-caps @click="goTo('history')" label="History"/>
                <q-tab flat v-if="!$isbex" name="dashboard" icon="dashboard" label=" " @click="goTo('dashboard')"/>
                <q-tab flat name="account" icon="account_balance_wallet" no-caps @click="goTo('wallets')" label="Wallets"/>
                <q-tab flat name="profile" icon="settings" no-caps @click="goTo('profile')" label="Settings"/>
                <q-tab flat name="profile" icon="add" no-caps @click="goImport" label="Add/Import"/>
              </q-tabs>
            </q-card-section>
          </q-card>
        </q-dialog>

        <q-dialog v-model="qrSelect">
            <q-card class="my-card" style="min-width: 300px;">
                <q-img src="https://www.imgonline.com.ua/examples/qr-code-url.png" />
                <q-card-section>
                    <q-btn fab color="primary" icon="qr_code" class="absolute" style="top: 0; right: 12px; transform: translateY(-50%);" @click="qrSelect = false" />

                    <div class="row no-wrap items-center">
                        <div class="col text-h6 ellipsis">
                            Scan Wallet Qr Code
                        </div>
                    </div>
                </q-card-section>

            </q-card>
        </q-dialog>

    </div>
</template>

<script>
import SearchList from '../TopMenu.vue'

export default {
  name: 'AppbarMobile',
  props: ['callChainTools'],
  components: { SearchList },
  data () {
    return {
      tabsAlert: false,
      lightMode: true,
      tab: 'mails',
      qrSelect: false,
      openSearch: false,
      tabRoute: 'dashboard'
    }
  },
  methods: {
    goImport () {
      this.$router.push({ name: 'accounts', params: { accounts: 'receive', tab: 'import' } })
    },
    goTo (path) {
      this.$router.push(`/verto/${path}`)
    }
  }

}
</script>

<style lang="scss" scoped>
  .search_btn{}
  .settings_btn{
    border: 2px solid #64b5f6;
  }
  /deep/ .tabroute_wrapper{
    .q-tab__content{
      flex-direction: row-reverse;
    }
    .q-tab__label{
      font-size: 20px;
      padding-right: 10px;
    }
    .q-tab{
      align-items: flex-end;
      justify-content: flex-end;
    }
  }
  .png_logo{
    margin-right: -6px;
  }
</style>

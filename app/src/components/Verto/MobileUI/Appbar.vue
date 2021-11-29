<template>
    <div>
        <q-toolbar >
            <!-- <q-btn flat round dense icon="menu" class="q-mr-sm" /> -->

            <img :src="'statics/icons/verto_vulps_logo'+ ($store.state.settings.lightMode === 'true' ? '_white':'') +'.svg'" width="30" class="png_logo" alt="">

            <q-toolbar-title class="primary" :class="{'text-white': $store.state.settings.lightMode === 'true'} ">VERTO</q-toolbar-title>
            <div class="q-gutter-sm">
                <SearchList :openSearch.sync="openSearch"  v-if="openSearch"/>
                <q-btn dense size="lg" :color="$store.state.settings.lightMode === 'true' ? 'transparent':'white'" :outline="$store.state.settings.lightMode === 'true'" unelevated text-color="grey" class="search_btn" icon="search" @click="openSearch = true">
                  <q-tooltip>
                    Some text as content of Tooltip
                  </q-tooltip>
                </q-btn>
                <q-btn dense size="lg" :color="$store.state.settings.lightMode === 'true' ? 'transparent':'white'" @click="tabsAlert = !tabsAlert" :class="$store.state.settings.lightMode === 'true' ? '' : 'settings_btn'" text-color="grey" :outline="$store.state.settings.lightMode === 'true'" unelevated icon="settings">
                  <q-tooltip>Some text as content of Tooltip</q-tooltip>
                </q-btn>
                <!-- <q-btn @click="openDialogTrigger" dense v-if="$store.state.investment.defaultAccount" size="lg" color="white" class="settings_btn" text-color="grey" unelevated>
                  <q-tooltip>Some text as content of Tooltip</q-tooltip>
                  <div class="flex justify-center items-center">
                    <span class="identicon flex flex-center" v-html="avatar($store.state.investment.defaultAccount.name)" />
                    <q-icon size="xs" name="keyboard_arrow_down" />
                  </div>
                </q-btn> -->
                <!-- <q-btn @click="openDialogTrigger" dense v-if="!$store.state.investment.defaultAccount" size="lg" color="transparent" class="view_account_selector" text-color="grey" unelevated>
                  <q-tooltip>Some text as content of Tooltip</q-tooltip>
                  <div class="flex justify-center items-center">
                    <span class="identicon flex flex-center">
                      <svg width="36" height="36" fill="#64b5f5">
                        <circle cx="18" cy="18" r="18" fill="#64b5f5"></circle>
                        <path
                          d="M11.664 18.866l-1.107.64a.856.856 0 000 1.488l5.678 3.283c1.09.63 2.44.63 3.53 0l5.678-3.283a.856.856 0 000-1.488l-1.107-.64-3.82 2.21a5.031 5.031 0 01-5.032 0l-3.82-2.21z"
                          fill="#fff"
                        ></path>
                        <path
                          d="M16.235 11.723a3.53 3.53 0 013.53 0l5.678 3.283a.856.856 0 010 1.488l-5.678 3.283a3.53 3.53 0 01-3.53 0l-5.678-3.283a.856.856 0 010-1.488l5.678-3.283z"
                          fill="#fff"
                        ></path>
                      </svg>
                    </span>
                    <q-icon size="xs" name="keyboard_arrow_down" />
                  </div>
                </q-btn> -->
                <q-btn v-if="false" :class="$store.state.settings.lightMode === 'true' ? 'text-grey':'text-grey'" :color="$store.state.settings.lightMode === 'true' ? 'white': ''" dense icon="qr_code" @click="qrSelect = true" />
                <q-btn v-if="false" :class="$store.state.settings.lightMode === 'true' ? 'text-grey':'text-grey'" :color="$store.state.settings.lightMode === 'true' ? 'white': ''"   dense icon="notifications">
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
        <q-dialog :dark="$store.state.settings.lightMode === 'true'" v-model="tabsAlert" class="tabs_alert_dialog" position="top">
          <q-card :dark="$store.state.settings.lightMode === 'true'" style="width: 100%;max-width:50%;margin-top: 70px;margin-right: -43%">
            <q-card-section>
              <q-tabs
                v-model="tabRoute"
                indicator-color="primary"
                vertical
                :dark="$store.state.settings.lightMode === 'true'"
                :active-color="$store.state.settings.lightMode === 'true' ? 'white':'primary'"
                :active-bg-color="$store.state.settings.lightMode === 'true' ? 'light-blue-10':'white'"
                class="text-bold tabroute_wrapper"
                inline-label
                :class="$store.state.settings.lightMode === 'true' ? 'mobile-card':'bg-white text-grey-7'"
              >
                <q-tab flat v-if="!$isbex" name="exchange" no-caps @click="goTo('crosschain-exchange')" label="Exchange"/>
                <q-tab flat v-if="!$store.state.investment.defaultAccount" name="history" icon="history" no-caps @click="goTo('history')" label="History"/>
                 <q-tab flat name="account" icon="account_balance_wallet" no-caps @click="goToWallets()" :label="!$store.state.investment.defaultAccount ? 'Wallets' : 'Chain tools'"/>
                 <q-tab flat name="profile" icon="settings" no-caps @click="goTo('profile')" label="Settings"/>
                <q-tab flat name="addImport" icon="add" no-caps @click="goImport" label="Add/Import"/>
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
import { toSvg } from 'jdenticon'

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
    openDialogTrigger () {
      // let accountSelectorTop = document.querySelector('.account_selector_top')
      // if (accountSelectorTop && accountSelectorTop.length > 0) {
      //   // alert(1)
      //   accountSelectorTop.dispatchEvent(new Event('click'))
      // } else {
      //   accountSelectorTop.dispatchEvent(new Event('click'))
      //   // alert(2)
      // }
    },
    avatar (name) {
      return toSvg(name, 30)
    },
    goImport () {
      this.$router.push({ name: 'accounts', params: { accounts: 'receive', tab: 'import' } })
    },
    goToWallets () {
      let a = this.$store.state.investment.defaultAccount
      if (a) {
        this.$router.push({ name: 'wallets', params: { return: this.$route, chainID: a.chain, tokenID: a.type, name: a.name, value: a.value, icon: a.icon } })
      } else {
        this.goTo('wallets')
      }
    },
    goTo (path) {
      this.$router.push(`/verto/${path}`)
    }
  }

}
</script>

<style lang="scss" scoped>

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
  .view_account_selector{
    border: 2px solid #64b5f6;
  }
  .q-dialog .q-card.q-card--dark.q-dark {
    border: 1px solid #0e1829;
    padding: 0px 0px;
    border-radius: 10px;
    background: #04111f;
  }
</style>

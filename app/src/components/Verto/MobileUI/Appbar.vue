<template>
    <div>
        <q-toolbar >
            <!-- <q-btn flat round dense icon="menu" class="q-mr-sm" /> -->

            <img src="statics/icons/ms-icon-144x144.png" width="32" class="png_logo q-mr-sm q-pa" alt="">

            <q-toolbar-title class="primary" :class="{'text-white': $store.state.settings.lightMode === 'true'} ">VERTO</q-toolbar-title>
            <div class="q-gutter-sm">
                <SearchList :openSearch.sync="openSearch"  v-if="openSearch"/>

                <q-btn :class="$store.state.settings.lightMode === 'true' ? 'text-black':'text-black'" :color="$store.state.settings.lightMode === 'true' ? 'white': ''" dense icon="search" @click="openSearch = true" />
                <q-btn :class="$store.state.settings.lightMode === 'true' ? 'text-black':'text-black'" :color="$store.state.settings.lightMode === 'true' ? 'white': ''" dense icon="qr_code" @click="qrSelect = true" />
                <q-btn :class="$store.state.settings.lightMode === 'true' ? 'text-black':'text-black'" :color="$store.state.settings.lightMode === 'true' ? 'white': ''"   dense icon="notifications">
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
      lightMode: true,
      tab: 'mails',
      qrSelect: false,
      openSearch: false
    }
  }

}
</script>

<style lang="scss" scoped>

</style>

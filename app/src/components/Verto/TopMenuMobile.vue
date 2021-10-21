<template>
  <div >
        <AppBar :callChainTools="callChainTools" v-if="showPanelStatus"/>
        <div class="q-pa-md" v-if="showPanelStatus" >
            <div class="q-pb-md row">
                <div class="text-h4 text-bold" v-if="$store.state.wallets.customTotal.show" :class="{'text-white': $store.state.settings.lightMode === 'true'} ">
                  US${{ nFormatter2($store.state.wallets.customTotal.usd, 3) }}
                </div>
                <div class="text-h4 text-bold" :class="{'text-white': $store.state.settings.lightMode === 'true'} " v-else>
                  US${{ nFormatter2($store.state.wallets.portfolioTotal, 3) }}
                </div>
                <q-btn
                      dense
                      flat
                      icon-right="cached"
                      color="grey"
                      @click="refreshWallet()"
                      class="q-pl-md"
                    />
            </div>
            <div class="q-pb-lg">
                <q-toolbar class="shadow-2 rounded-borders row justify-between" :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'text-black bg-white'">
                    <div >
                        <q-btn flat round dense  icon="send"  style="margin-right:-10px;"/>
                        <q-btn flat  class="text-bold" @click="callChainTools"> Send </q-btn>
                    </div>
                    <q-separator vertical inset color="grey"/>
                    <div>
                        <q-btn flat round dense  icon="call_received" class="q-pl-md" style="margin-right:-10px;"/>
                        <q-btn flat  class="text-bold" @click="goTo('manage/receive')"> Receive</q-btn>
                    </div>
                </q-toolbar>
            </div>
        </div>
  </div>
</template>

<script>
import AppBar from '../Verto/MobileUI/Appbar.vue'
import Formatter from '@/mixins/Formatter'

export default {
  name: 'TopMenuMobile',
  components: { AppBar },
  props: ['chainTools', 'keys', 'showPanelStatus', 'refreshWallet'],
  mixins: [Formatter],
  data () {
    return {
      lightMode: true,
      tabRoute: 'dashboard',
      tabIndex: 'chains',
      qrSelect: false,
      showPanel: true
    }
  },
  mounted () {
    // this.checkRoute()
  },
  methods: {
    callChainTools () {
      console.log('calling callChaintools')
      let self = this
      setTimeout(function () {
        self.$emit('update:keys', { send: ++self.keys.send })
        self.$emit('update:chainTools', { show: self.chainTools.show, send: true })
      }, 300)
    },
    goTo (path) {
      let self = this
      setTimeout(function () {
        self.$router.push(`/verto/${path}`)
      }, 100)
    }
  }

}
</script>

<style lang="scss" scoped>
.mobile-card{
    background-color: #04111F !important;
}
</style>

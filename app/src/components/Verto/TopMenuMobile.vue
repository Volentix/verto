<template>
  <div class="bg-white" >
        <AppBar class="appbar_wrapper bg-grey-1" :callChainTools="callChainTools" v-if="showPanelStatus"/>
        <div class="q-pa-md showpanelstatus_wrapper" v-if="showPanelStatus" >
            <div class="q-pb-md row flex justify-between relative q-pt-md">
                <span class="label_balance">Balance of all chains</span>
                <div class="text-h4 text-bold" v-if="$store.state.wallets.customTotal.show" :class="{'text-white': $store.state.settings.lightMode === 'true'} ">
                  US${{ nFormatter2($store.state.wallets.customTotal.usd, 3) }}
                </div>
                <div class="text-h4 text-bold" :class="{'text-white': $store.state.settings.lightMode === 'true'} " v-else>
                  US${{ nFormatter2($store.state.wallets.portfolioTotal, 3) }}
                </div>
                <q-btn
                  icon-right="cached"
                  color="grey"
                  @click="refreshWallet()"
                  dense
                  flat
                  size="lg"
                  class="refresh_btn"
                />
            </div>
            <div class="">
                <q-toolbar v-if="false" class="shadow-2 rounded-borders row justify-between" :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'text-black bg-white'">
                    <div >
                        <q-btn flat round dense  icon="send"  style="margin-right:-10px;"/>
                        <q-btn flat class="text-bold" @click="callChainTools"> Send </q-btn>
                    </div>
                    <q-separator vertical inset color="grey"/>
                    <div>
                        <q-btn flat round dense  icon="call_received" class="q-pl-md" style="margin-right:-10px;"/>
                        <q-btn flat  class="text-bold" @click="goTo('manage/receive')"> Receive</q-btn>
                    </div>
                </q-toolbar>
              <div class="row">
                <div class="col-6 q-pr-sm">
                  <q-btn outline color="blue-4" no-caps class="action_btns full-width text-bold" @click="callChainTools"> Send </q-btn>
                </div>
                <div class="col-6 q-pl-sm">
                  <q-btn unelevated color="blue-4" no-caps class="action_btns full-width text-bold" @click="goTo('manage/receive')"> Receive</q-btn>
                </div>
              </div>
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
.appbar_wrapper{
  padding-top: 10px;
  padding-bottom: 10px;
}
/deep/ .action_btns{
  border-radius: 5px;
  height: 45px;
}
.refresh_btn{
  margin-top: -2px;
}
.showpanelstatus_wrapper{
  border-bottom: 1px solid rgb(231, 231, 231);
}
.relative{
  position: relative;
}
.label_balance{
  position: absolute;
  left: 0px;
  top: -6px;
  font-size: 15px;
  font-weight: 500;
}
</style>

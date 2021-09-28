<template>
  <div >
        <AppBar :callChainTools="callChainTools" v-if="showPanelStatus"/>
        <div class="q-pa-md" v-if="showPanelStatus" >
            <div class="q-pb-md">
                <div class="text-h4 text-bold" v-if="$store.state.wallets.customTotal.show">
                  US${{ nFormatter2($store.state.wallets.customTotal.usd, 3) }}
                </div>
                <div class="text-h4 text-bold" v-else>
                  US${{ nFormatter2($store.state.wallets.portfolioTotal, 3) }}
                </div>
            </div>
            <div class="q-pb-lg">
                <q-toolbar class="bg-white shadow-2 rounded-borders row justify-between">
                    <div>
                        <q-btn flat round dense color="primary" icon="send"  style="margin-right:-10px;"/>
                        <q-btn flat color="primary" class="text-bold" @click="callChainTools"> Send </q-btn>
                    </div>
                    <q-separator vertical inset color="grey"/>
                    <div>
                        <q-btn flat round dense color="primary" icon="call_received" class="q-pl-md" style="margin-right:-10px;"/>
                        <q-btn flat color="primary" class="text-bold" to="/verto/manage/receive"> Receive</q-btn>
                    </div>
                </q-toolbar>
            </div>
        </div>

        <!-- BOTTOM NAVIGATION  -->
        <div >
            <!-- <q-footer  style="position:fixed; bottom:0; width: -webkit-fill-available; z-index: 1;">
              <q-tabs
                v-model="tabRoute"
                indicator-color="primary"
                active-color="primary"
                class="bg-white text-grey-7 shadow-2 text-bold"
              >
                <q-tab name="exchange" icon="sync" label=" " no-caps @click="goTo('crosschain-exchange')" />
                <q-tab name="history" icon="history" label="" no-caps @click="goTo('history')"  />
                <q-tab name="dashboard" icon="dashboard" label="" @click="goTo('dashboard')"/>
                <q-tab name="account" icon="account_balance" label="" no-caps @click="goTo('wallets')" />
                <q-tab name="profile" icon="person" label="" no-caps @click="goTo('profile')"/>
              </q-tabs>
            </q-footer> -->
        </div>
  </div>
</template>

<script>
import AppBar from '../Verto/MobileUI/Appbar.vue'
import Formatter from '@/mixins/Formatter'

export default {
  name: 'TopMenuMobile',
  components: { AppBar },
  props: ['chainTools', 'keys', 'showPanelStatus'],
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
  // watch: {
  //   '$route': function () {
  //     this.checkRoute()
  //   }
  // },
  methods: {
    // checkRoute () {
    //   if (this.$route.name === 'dashboard') { this.tabRoute = 'dashboard' }
    //   if (this.$route.name === 'profile') {
    //     this.tabRoute = 'profile'
    //     this.$emit('update:showPanelStatus', false)
    //   }
    //   if (this.$route.name === 'history') { this.tabRoute = 'history' }
    //   if (this.$route.name === 'crosschain-exchange') { this.tabRoute = 'exchange' }
    // },
    callChainTools () {
      console.log('calling callChaintools')
      this.$emit('update:keys', { send: ++this.keys.send })
      this.$emit('update:chainTools', { show: this.chainTools.show, send: true })
    }
    // goTo (path) {
    //   this.$router.push(`/verto/${path}`)
    // }
  }

}
</script>

<style lang="scss" scoped>
</style>

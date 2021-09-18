<template>
  <div >
        <AppBar :callChainTools="callChainTools" v-if="$route.path != '/verto/crosschain-exchange' "/>
        <!-- <AccountPanel :chainTools.sync="chainTools"/> -->
        <div class="q-pa-md" v-if="$route.path != '/verto/crosschain-exchange' ">
            <div class="q-pb-md">
                <div class="text-h4 text-bold" v-if="$store.state.wallets.customTotal.show">
                  US${{ nFormatter2($store.state.wallets.customTotal.usd, 3) }}
                </div>
                <div class="text-h4 text-bold" v-else>
                  US${{ nFormatter2($store.state.wallets.portfolioTotal, 3) }}
                </div>
                <!-- <div class="text-grey"> ~0.00% last 24hrs</div> -->
            </div>
            <div class="q-pb-lg">
                <q-toolbar class="bg-white shadow-2 rounded-borders row justify-between">
                    <div>
                        <q-btn flat round dense color="green" icon="send"  style="margin-right:-10px;"/>
                        <q-btn flat color="primary" class="text-bold" @click="callChainTools"> Send </q-btn>
                    </div>
                    <q-separator vertical inset color="grey"/>
                    <div>
                        <q-btn flat round dense color="green" icon="call_received" class="q-pl-md" style="margin-right:-10px;"/>
                        <q-btn flat color="primary" class="text-bold" to="/verto/manage/receive"> Receive</q-btn>
                    </div>
                </q-toolbar>
            </div>
            <!-- <div class="q-pb-sm row justify-between">
                <div class="text-h6 text-bold">My Wallets</div>
                <div>
                    <q-btn flat round dense color="green" icon="add" style="margin-right:-20px;"/>
                    <q-btn flat color="primary" class="text-bold">Add/Import</q-btn>
                </div>
            </div>
            <div class="q-pb-lg">
                <q-list   class="rounded-borders bg-white" style="">
                    <q-item clickable v-ripple>
                        <q-item-section avatar top>
                            <q-avatar icon="attach_money" color="green" text-color="white" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label lines="1" class="text-bold">My BCH Wallet</q-item-label>
                            <q-item-label caption >0 BCH</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <div class="text-grey text-h6"> US$0.00 </div>
                        </q-item-section>
                    </q-item>
                </q-list>
            </div> -->
        </div>

        <!-- BOTTOM NAVIGATION  -->
        <div class="q-gutter-y-md" style="position:fixed; bottom:0; width: -webkit-fill-available; z-index: 1;">
            <q-tabs
                v-model="tab"
                indicator-color="primary"
                active-color="primary"
                class="bg-white text-grey-7 shadow-2 text-bold"
            >
                <q-tab name="exchange" icon="sync" label="Exchange" no-caps/>
                <q-tab name="history" icon="history" label="History" no-caps/>
                <q-tab name="dashboard" icon="dashboard" label="" />
                <q-tab name="account" icon="account_balance" label="Accounts" no-caps/>
                <q-tab name="profile" icon="person" label="Profile" no-caps/>
            </q-tabs>
        </div>

  </div>
</template>

<script>
import AppBar from '../Verto/MobileUI/Appbar.vue'
import Formatter from '@/mixins/Formatter'
// import AccountPanel from '../Verto/MobileUI/AccountPanel.vue'

export default {
  name: 'TopMenuMobile',
  components: { AppBar },
  props: ['chainTools', 'keys'],
  mixins: [Formatter],
  data () {
    return {
      lightMode: true,
      tab: 'dashboard',
      tabIndex: 'chains',
      qrSelect: false
    }
  },
  methods: {
    callChainTools () {
      console.log('calling callChaintools')
      this.$emit('update:keys', { send: ++this.keys.send })
      this.$emit('update:chainTools', { show: this.chainTools.show, send: true })
    }
  }

}
</script>

<style lang="scss" scoped>
</style>

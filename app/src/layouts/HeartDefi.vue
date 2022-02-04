<template>
  <div class="main-area">
    <q-layout view="lHh lpR lFf" class="main-container global" :class="$route.path.split('/').join(' ')">
      <q-drawer
        show-if-above
        :width="left_width"
        v-model="left"
        side="left"
        :breakpoint="992"
        content-class="left-drawer">
        <div class="main-container-left">
          <LeftDrawer/>

        </div>
      </q-drawer>
      <q-page-container class="main-container-right" style="padding-left:0px" :style="{'margin-left':left_width+'px'}">
        <q-page>

          <LandingPage v-if="$store.state.currentwallet.user"  v-show="$route.path == '/account/'+$store.state.currentwallet.user.address" />
          <router-view v-if="!$store.state.currentwallet.user || $route.path != '/account/'+$store.state.currentwallet.user.address"/>
        </q-page>
      </q-page-container>

    </q-layout>
  </div>
</template>

<script>
import LeftDrawer from 'components/Heartdefi/LeftDrawer'

import LandingPage from 'pages/Heartdefi/LandingPage'
import Lib from '@/util/walletlib'
import Connect from '../mixins/Connect'
import DexInteraction from '../mixins/DexInteraction'
import initWallet from '@/util/_Wallets2Tokens'
export default {
  mixins: [Connect, DexInteraction],
  components: {
    LeftDrawer,
    LandingPage
  },
  data () {
    return {
      left: true,
      left_width: 250
    }
  },
  watch: {
    '$route' (to, from) {
      this.projectData = this.$store.state.settings.projects.find(o => o.id === this.$route.params.projectId)
      document.querySelector('.main-container-right').scrollTop = 0
    },
    '$store.state.currentwallet.user': function (val) {
      if (val) {
        let wallet = {
          chain: 'eth',
          key: val.address,
          name: val.wallet + '...' + val.addressFriendly,
          type: 'eth'
        }
        let init = true
        if (this.$store.state.wallets.tokens && this.$store.state.wallets.tokens.find(o => o.key.toLowerCase() === val.address.toLowerCase())) {
          init = false
        } else {
          let data = localStorage.getItem('walletPublicDatav2')

          if (data) {
            data = JSON.parse(data)
            if (data && data.find(o => o.key.toLowerCase() === val.address.toLowerCase())) {
              initWallet()
              init = false
            }
          }
        }

        if (init) {
          Lib.setWallets([wallet])
          this.$store.commit(
            'investment/setDefaultAccount',
            wallet
          )
          if (this.$route.path !== '/account/' + val.address) { this.$router.push('/account/' + val.address) }
        }
      }
    }
  },
  computed: {

  },
  created () {
    if (this.$route.params.action === 'logout') {
      this.logout()
    } else {
      this.initConnect()
    }

    if (this.$route.params.key && !this.$store.state.currentwallet.user) {
      this.setUser(this.$route.params.key, 'address')
    }
    this.get1inchCoins()
    this.$store.dispatch('tokens/getTokenList')
    this.$store.state.settings.lightMode = 'false'
    this.$store.dispatch('settings/initiateFeeds')
  },
  mounted () {
  },
  methods: {

  },
  destroyed () {

  }

}
</script>
<style>
  @import '~assets/Heartdefi/style.scss';
  @import '~assets/Heartdefi/css/responsive.css';
</style>
<style lang="scss">
.global .main-container-right {
    overflow: scroll !important;
}
.account_selector_top {
    display: none !important
}
  .main-area{
    .q-drawer{
      background: transparent;
      .left-drawer{
        background-color: #ffe5e4;
      }
    }
    p{
      margin: 0;
    }
    h2,h3,h4,h5{
      font-weight: bold !important;
      line-height: normal !important;
    }
    line-height: normal !important;
    .mainexch-eth-right{
      padding-left: 22px;
    }
    .mncright-right{
      padding-top: 0 !important;
    }
    .main-container-right{
      overflow-y: scroll;
    }
  }

</style>

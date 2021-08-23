
<template>
  <div class="wrapper">
    <q-layout
      view="hHh Lpr lff"
      container
      style="height: 100vh"
      class="shadow-2"
    >
      <q-drawer
        v-model="drawer"
        show-if-above
        :mini="!drawer || miniState"
        :width="250"
        :breakpoint="500"
        :content-class="$store.state.settings.lightMode === 'false' ? 'bg-grey-3':'drawer-dark-theme'"
      >
        <q-scroll-area :dark="$store.state.settings.lightMode === 'true'" :visible="true" class="" style="margin-left: -15px !important; height: 100vh;">
          <div class="left-area gt-sm full-width" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}" v-if="!$q.screen.lt.sm">
            <div class="left">
              <div class="img app-logo q-pt-md flex flex-center">
                <div class="balance flex flex-center">
                  <svg
                    class="svg_logo q-mr-sm"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 20.58"
                    v-if="false"
                  >
                    <path
                      d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z"
                      transform="translate(-183 -18.21)"
                    ></path>
                  </svg>
                  <img src="statics/icons/ms-icon-144x144.png" width="32" class="png_logo q-mr-sm" alt="">
                  <router-link to="/verto/dashboard">VERTO</router-link>

                  <div class="text-caption full-width text-center">
                  <span v-if="$store.state.wallets.customTotal.show">{{$store.state.wallets.customTotal.label}}</span>
                  <span v-else>Total Balance</span>
                    <q-btn
                      dense
                      flat
                      icon-right="cached"
                      color="grey"
                      @click="refreshWallet()"
                    />
                  </div>
                  <div class="text-h3 total" v-if="$store.state.wallets.customTotal.show">
                    ${{ nFormatter2($store.state.wallets.customTotal.usd, 3) }}
                  </div>
                  <div class="text-h3 total" v-else>
                    ${{ nFormatter2($store.state.wallets.portfolioTotal, 3) }}
                  </div>

                  <div class="row flex flex-center q-pt-md q-pb-sm">
                    <q-btn
                      size="sm"
                      label="Send"
                      @click="keys.send++ ; chainTools.send = true "
                      icon="file_upload"
                      outline
                      rounded
                    />
                    <q-btn
                      size="sm"
                      label=""
                      icon="file_download"
                      outline
                      rounded
                      class="q-ml-sm"
                      to="/verto/manage/receive"
                    />
                    <div></div>
                  </div>
                  <AccountSelector
                    class="top q-pt-md"
                    :showAllWallets="true"
                    v-if="false"
                  />
                </div>
              </div>
              <ul class="left-menu">
                <li><a href="#"> </a></li>
                <li class="q-pb-md flex text-center cursor-pointer tools-label-li" v-if="$store.state.settings.defaultChainData && tools[$store.state.settings.defaultChainData.chain]" >
                  <a @click="chainTools.show = !chainTools.show" class="tools-label">
                    <q-icon size="md"  class="q-pr-sm" :name="'img:'+$store.state.settings.defaultChainData.icon" />
                    <span>Chains Tools
                      <q-icon  class="q-pl-md" :name="!chainTools.show  ? 'expand_more' : 'expand_less' " />
                    </span>
                  </a>
                <!--  <AccountSelector
                    class="top q-pt-md"
                    v-show="chainTools.show"
                    :showAllWallets="true"
                    :key="$store.state.settings.defaultChainData.chain"
                    :chains="[$store.state.settings.defaultChainData.chain]"
                  /> -->
                </li>
                <li v-show="chainTools.show && $store.state.settings.defaultChainData && tools[$store.state.settings.defaultChainData.chain]" v-for="(path, index) in ( $store.state.settings.defaultChainData ? tools[$store.state.settings.defaultChainData.chain] : [])" :key="index" class="tools" :class="{ active: $route.path == path.to }">
                  <router-link :to="path.to">
                    <q-icon :name="path.icon"/><span>{{path.title}}</span></router-link
                  >
                </li>
                <li :class="{ active: $route.path == '/verto/dashboard' }">
                  <router-link to="/verto/dashboard">
                    <i class="fas fa-columns change-c"></i
                    ><span>Dashboard</span></router-link
                  >
                </li>
                <li
                  :class="{ active: $route.path == '/verto/crosschain-exchange' }"
                >
                  <router-link to="/verto/crosschain-exchange"
                    ><i class="fas fa-exchange-alt change-c"></i
                    ><span>Exchange</span></router-link
                  >
                </li>
                <li :class="{ active: $route.path == '/verto/history' }">
                  <router-link to="/verto/history"
                    ><i class="fas fa-stream change-c"></i
                    ><span>History</span></router-link
                  >
                </li>
                <li
                  v-if="false"
                  :class="{ active: $route.path == '/verto/stake' }"
                >
                  <router-link to="/verto/stake"
                    ><i class="fas fa-stream change-c"></i
                    ><span>Stake</span></router-link
                  >
                </li>
                <li
                  v-if="false"
                  :class="{ active: $route.path == '/verto/explorer' }"
                >
                  <router-link to="/verto/explorer"
                    ><i class="fas fa-stream change-c"></i
                    ><span>Explorer</span></router-link
                  >
                </li>
                <li :class="{ active: $route.path == '/verto/profile' }">
                  <router-link to="/verto/profile"
                    ><i class="far fa-user change-c"></i><span>Profile</span>
                  </router-link>
                </li>
                <li
                  @click="goToAccounts()"
                  :class="{ active: $route.path.includes('accounts') }"
                >
                  <a href="javascript:void(0)"
                    ><i class="fas fa-plus change-c"></i><span>Accounts </span>
                  </a>
                </li>
              </ul>
              <span class="version full-width text-center column">
                <span class="">{{version}}</span>
                <span class="q-pa-sm text-grey">
                  This app is in beta, please send us bug reports if you find any. <b><a target="_blank" class="text-deep-purple-12c" href="https://t.me/vertosupport">t.me/vertosupport</a></b>
                </span>
              </span>
            </div>
          </div>
        </q-scroll-area>
        <!--
          in this case, we use a button (can be anything)
          so that user can switch back
          to mini-mode
        -->
        <div
          class="q-mini-drawer-hide absolute"
          style="top: 15px; right: -17px"
        >
          <q-btn
            dense
            round
            unelevated
            v-if="false"
            color="accent"
            icon="chevron_left"
            @click="miniState = true"
          />
        </div>
      </q-drawer>

      <q-page-container id="main-container" :class="{'dark-theme':$store.state.settings.lightMode === 'true'}">
        <TopMenu />
        <q-breadcrumbs
          class="text-deep-purple-12 breadcrumbs"
          v-if="$route.path != '/verto/dashboard'"
        >
          <template v-slot:separator>
            <q-icon size="1.5em" name="chevron_right" color="primary" />
          </template>

          <q-breadcrumbs-el
            label="Back"
            icon="keyboard_backspace"
            class="cursor-pointer"
            @click="$route.name.includes('token') && $route.params.asset && !['btc'].includes($route.params.asset.chain) && $route.params.asset.name ? goToTab('assets', $route.params.asset.chain) : $router.go(-1)"
          />
          <q-breadcrumbs-el
            v-if="$route.name.includes('token')"
            @click="goToTab('assets', $route.params.asset && !['btc'].includes($route.params.asset.chain) ? $route.params.asset.chain : null)"
            :label="$route.params.asset && $route.params.asset.amount && !['btc'].includes($route.params.asset.chain) ?  getChainLabel($route.params.asset.chain) + ' assets' : 'Assets'"
            class="cursor-pointer"

          />
           <q-breadcrumbs-el
            v-if="$route.name.includes('token')"
            :icon="'img:'+$route.params.asset.icon"
            :label="$route.params.asset.type.toUpperCase()"
            class="cursor-pointer"
          />
          <q-breadcrumbs-el  v-else class="text-capitalize" :label="$route.name" />
        </q-breadcrumbs>
        <router-view class="main-container" v-if="toggleView" />
      </q-page-container>
      <SelectTokenPopup :key="keys.send" v-if="chainTools.send" />
    </q-layout>
  </div>
</template>

<script>
import { version } from '../../package.json'
import initWallet from '@/util/Wallets2Tokens'
import Formatter from '@/mixins/Formatter'
import AccountSelector from '@/components/Verto/Exchange/AccountSelector.vue'
import TopMenu from '../components/Verto/TopMenu'
import SelectTokenPopup from '../components/Verto/Token/SelectTokenPopup.vue'
import { QScrollArea } from 'quasar'
export default {
  components: {
    AccountSelector,
    TopMenu,
    SelectTokenPopup,
    QScrollArea
  },
  data () {
    return {
      version: {},
      toggleView: true,
      keys: {
        send: 1
      },
      tools: {
        eos: [{
          icon: 'bolt',
          to: '/verto/wallet/eos/powerup',
          title: 'Power up',
          activeAccRequired: true
        }, {
          icon: 'img:https://www.api.bloks.io/image-proxy/display?w=100&h=100&url=https://raw.githubusercontent.com/BlockABC/eos-tokens/master/tokens/volentixgsys/VTX.png&op=resize',
          title: 'Stake VTX',
          activeAccRequired: true,
          to: '/verto/stake/eos/vtx'
        }, {
          icon: 'battery_charging_full',
          title: 'Buy / Sell Ram',
          activeAccRequired: true,
          to: '/verto/ram-market'
        }, /* {
          icon: 'shield',
          title: 'Stake Proxy EOS',
          activeAccRequired: true,
          to: '/verto/stakeproxy',
        }, */ {
          icon: 'swap_vert',
          title: 'Stake EOS',
          activeAccRequired: true,
          to: '/verto/stake/eos/eos'
        }, {
          activeAccRequired: true,
          to: '/verto/custom-transactions',
          icon: 'tune',
          title: 'Transact'
        }]
      },
      drawer: false,
      chainTools: {
        show: true,
        send: false
      },
      str: {},
      miniState: false
    }
  },
  watch: {
    '$store.state.settings.defaultChainData': function () {
      if (this.$store.state.settings.defaultChainData) {
        this.chainTools.show = true
      }
    }
  },
  methods: {
    sendTokens () {
      this.toggleView = false
      this.$router.push({
        name: 'send-tokens',
        params: {
          tab: 'assets',
          label: 'Select asset to send'
        }
      })
      this.toggleView = true
    },
    goToAccounts () {
      this.$router.push('/verto/manage/accounts')
    },
    goToTab (tab, chain) {
      tab = chain ? 'chains' : tab
      this.$router.push({
        name: 'dashboard',
        params: {
          tab: tab,
          selectChain: chain
        }
      })
    },
    refreshWallet (name = null) {
      if (!name) {
        this.$store.state.tokens.walletTokensData = []
        this.$store.state.tokens.pending = []
        this.singleWalletRefresh = null
        localStorage.removeItem('walletPublicDatav2')
      }

      return initWallet(name)
    }
  },
  created () {
    this.version = version
  },
  mixins: [Formatter]
}
</script>
<style scoped>
h2 {
  line-height: initial !important ;
}
/deep/ .q-page-container {
  padding-top: 0px;
}
.center-element {
  margin: 0 auto;
  text-align: center;
  display: block;
}
.wrapper {
  width: 100%;
  background: #ffffff;
  /*display: flex;*/
}

.wrapper .left-area {
  width: 21.5%;
  background: #f2f2f2;
  float: left;
}
.breadcrumbs {
  margin-top: 20px;
  padding: 9px 0px 9px 10px;
}
.top /deep/ .account_selector {
  width: 170px !important;
}
.left {
  background: #f5f6fa;
}
.left ul {
  padding: 20px;
  padding-right: 0px;
  padding-left: 0px;
}
.left .img {
  padding: 5px 20px;
  max-width: 300px;
  float: right;
  clear: both;
  margin-bottom: 50px;
}

.left ul {
  margin: 0px 0 0px;
  max-width: 300px;
  /* float: right; */
  margin: auto;
}

.left ul li {
  display: block;
}

.left ul li a {
  display: block;
  padding: 20px 20px;
  background: transparent;
  color: #7e838d;
  font-size: 17px;
  font-weight: 600;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  text-decoration: none;
  transition: all 0.3s ease;
}
.left ul li.tools a{
  font-size: 14px;
  padding: 10px 20px;
}

.left ul li a i {
  margin-right: 30px;
  color: #7e838d;
  font-size: 22px;
  transition: all 0.3s ease;
}

.left ul li a:hover,
.active a {
  background: white !important ;
  color: #b6b6b6 !important;
}

.left ul li a:hover .change-c,
.active .change-c {
  color: #b6b6b6 !important;
}

.left .upgrade {
  padding: 5px 20px;
  width: 90%;
  border-radius: 25px;
}

.wrapper .mid-area {
  width: 100%;
  max-width: 800px;
  background: #f5f6fa;
  float: left;
}

.mid {
  background: #f5f6fa;
  padding: 20px;
  position: relative;
}

.mid input[type="text"] {
  background: transparent;
  padding: 20px;
  width: 89%;
  color: #7e838d;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 1px;
  border: none;
  padding-left: 45px;
  border-bottom: 2px solid #dee0e4;
  font-family: "Montserrat", sans-serif;
}

::placeholder {
  opacity: 1;
}

.mid form span i {
  color: #7e838d;
  font-size: 25px;
  position: absolute;
  left: 30px;
  top: 40px;
}

.mid h2 {
  font-size: 25px;
  font-weight: 700;
  color: #000;
  padding: 50px 0 30px;
}

.mid h2 a {
  position: absolute;
  right: 20px;
  color: #7e838d;
  font-size: 17px;
  font-weight: 600;
  margin-top: 6px;
}

.mid h2 a i {
  margin-right: 5px;
}

.scrollable {
  width: auto;
  height: 640px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.wrapp-all {
  display: flex;
  padding: 20px;
  background: #fff;
  border: 1px solid transparent;
  border-radius: 10px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.scrollable .active {
  border: 1px solid #5879fb;
}

.wrapp-all:hover {
  border: 1px solid #5879fb;
}

.wrapp-all img {
  width: 30%;
  border-radius: 10px;
}

.details {
  width: 66%;
  padding-left: 20px;
}

.wrapp-all h3 {
  color: #5275fb;
  font-size: 23px;
  font-weight: 700;
}
.wrapp-all h4 {
  font-size: 18px;
  font-weight: 600;
}

.wrapp-all h4 span {
  font-size: 15px;
  font-weight: 400;
  color: #7e838d;
}

.wrapp-all p {
  font-size: 14px;
  font-weight: 400;
  color: #7e838d;
  margin: 10px 0 40px;
}

.wrapp-all p span {
  font-weight: 700;
  margin: 0 5px;
}

.wrapp-all a {
  display: block;
  background: transparent;
  color: #7e838d;
  font-size: 17px;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.wrapp-all a i {
  color: #000;
  font-size: 20px;
}

.wrapp-all h4,
.wrapp-all h3 {
  position: relative;
}

.wrapp-all h4 a,
.wrapp-all h3 a {
  position: absolute;
  right: 0px;
  color: #bbbec3;
  font-size: 12px;
  font-weight: 500;
  top: 0;
  margin-top: 6px;
}

.mid-hy {
  letter-spacing: -2px;
  font-weight: 600;
}

.wrapper .right-area {
  width: 30%;
  background: #fff;
  float: left;
}

.right {
  background: #fff;
  padding: 20px 30px;
}

.right ul {
  text-align: right;
}

.right ul li {
  display: inline-block;
}

.right ul li a {
  display: inline-block;
  padding: 0 8px;
  color: #7e838d;
  font-size: 17px;
  font-weight: 600;
}

.right ul li a img {
  vertical-align: middle;
}

.dropdown {
  width: 150px;
  padding: 10px;
  background: #fff;
  border: 2px solid #5879fb;
  border-radius: 10px;
  position: absolute;
  right: 0;
  opacity: 0;
}

.drop-icon:hover .dropdown {
  opacity: 1;
}

.dropdown ul {
  text-align: left;
}

.dropdown ul li {
  display: block;
}

.dropdown ul li a {
  display: inline-block;
  padding: 6px 8px;
  color: #5879fb;
  font-size: 17px;
  font-weight: 600;
}

.big-list {
  margin-top: 60px;
}

.big-list img {
  width: 100%;
  border-radius: 10px;
}

.big-list h3 {
  color: #5275fb;
  font-size: 30px;
  font-weight: 700;
}
.big-list h4 {
  font-size: 25px;
  font-weight: 700;
  margin-top: 30px;
}

.big-list h4 span {
  font-size: 19px;
  font-weight: 500;
  color: #7e838d;
}

.big-list p {
  font-size: 15px;
  font-weight: 500;
  color: #7e838d;
  margin: 10px 0 40px;
}

.big-list p span {
  font-weight: 700;
  padding: 0 5px;
}

.big-list a {
  font-size: 19px;
  font-weight: 500;
  color: #fff;
  background: #000;
  padding: 16px 0;
  width: 80%;
  display: inline-block;
  margin-top: 10px;
  margin-bottom: 20px;
  text-align: center;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.big-list a:hover {
  color: #000;
  background: #5879fb;
}

.upgrd {
  position: relative;
  text-align: center;
  color: white;
  display: block;
}

.upgrd h2 {
  position: absolute;
  top: 20px;
  left: 40px;
  text-align: left;
}

.upgrd i {
  position: absolute;
  top: 20px;
  right: 22px;
  font-size: 25px;
  text-align: left;
  transform: rotate(48deg);
}

@media screen and (min-width: 768px) and (max-width: 1199px) {
  .left {
    padding: 20px 0;
  }

  .left ul li a i {
    margin-right: 9px;
  }

  .mid input[type="text"] {
    width: 81%;
  }
  .wrapp-all h4 {
    font-size: 17px;
    font-weight: 600;
  }

  .wrapp-all p {
    font-size: 10px;
    margin: 10px 0 22px;
  }

  .wrapp-all h3 {
    font-size: 18px;
  }

  .wrapp-all h4 a,
  .wrapp-all h3 a {
    font-size: 9px;
  }
  .wrapp-all h4 span {
    font-size: 14px;
  }

  .wrapp-all {
    display: flex;
    padding: 10px;
  }

  .scrollable {
    width: auto;
    height: 570px;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .right {
    padding: 20px 15px;
  }
  .big-list {
    margin-top: 30px;
  }

  .big-list h4 {
    font-size: 19px;
  }
  .big-list h4 span {
    font-size: 15px;
  }

  .big-list p {
    font-size: 11px;
  }

  .big-list h3 {
    font-size: 25px;
  }

  .big-list a {
    padding: 12px 0;
  }
}

@media screen and (max-width: 767px) {
  .wrapper .left-area {
    width: 100%;
    float: none;
  }

  .wrapper .mid-area {
    width: 100%;
    float: none;
  }

  .wrapper .right-area {
    width: 100%;
    float: none;
  }

  .mid input[type="text"] {
    width: 77%;
  }

  .wrapp-all {
    display: block;
    padding: 17px;
  }

  .details {
    width: 100%;
    padding-left: 0px;
  }

  .wrapp-all img {
    width: 100%;
  }
}
/deep/ .q-page-container,
/deep/ .q-header {
  background: #f2f2f2 !important;
}
/deep/ .q-page-container.dark-theme,
/deep/ .q-header.dark-theme {
  background: #04111f !important;
}
/deep/ .q-page-container.dark-theme{
  min-height: 100vh;
  overflow-y: hidden;
}
/deep/ .desktop-version {
  padding-left: 0vh !important;
  padding-top: 5vh !important;
}
.top /deep/ .account_selector .q-btn__content {
  font-size: 12px;
}
.app-logo a {
  font-weight: 700;
  text-transform: uppercase;
  font-family: Libre Franklin, sans-serif;
  font-size: 32px;
  color: #333;
  text-decoration: none;
}
/deep/ .menu-top-wrapper {
  background: #ffffff;
}
.img.app-logo {
  padding: 20px;
  padding-top: 0px;
  border-bottom-left-radius: 12px;
}
.q-tab--active {
  background: #f2f2f2;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}
.balance {
  background: #f8f8f8;
  padding-right: 20px;
  padding-left: 20px;
  box-shadow: 0px 0px 10px 10px white;
  margin-top: 19px;
}
ul.left-menu {
  background: #f2f2f2;
}

.left-area {
  background: url(https://i.ibb.co/vm1BbxN/Screen-Shot-2021-08-04-at-4-04-09-PM.png);
  background-size: cover;
  background-position-x: -50px;
  background-repeat: no-repeat;
}
.total {
  font-size: 2rem;
  color: #333333;
  text-shadow: 10px 10px 20px #cbbbeb;
}
.tools {
  background: #e5e5e5;
}
.drawer-dark-theme .tools {
  background: #040e1a;
}
.tools-label {
  display: contents !important;
}
li.tools img {
  margin-right: 30px;
  width: 20px;
  height: auto;
}

</style>
<style>
.drawer-dark-theme{
  /* background: #04111f; */
  background: #040e1a;
}
.wrapper .left-area.dark-theme {
  background: #040e1a;
  /* border-right: 1px solid rgba(255,255,255, .4); */
}
.drawer-dark-theme ul.left-menu {
  background: #040e1a;
  min-height: 66vh;
  /* border-right: 1px solid rgba(255,255,255, .4); */
}
ul.left-menu {
  max-width: 100% !important;
}
.left ul{
  /* padding-top: 50px; */
}
.drawer-dark-theme .left ul li a:hover,
.drawer-dark-theme .active a {
  background: #04111f !important;
  color: #b6b6b6 !important;
}
.drawer-dark-theme .left ul li.tools a:hover{
  background: #04111f !important;
  color: #b6b6b6 !important;
}
.drawer-dark-theme .tools.active a {
  background: #04111f !important;
  color: #b6b6b6 !important;
  box-shadow: none !important;
}
.drawer-dark-theme .active {
  clear: both;
  height: fit-content;
  border-radius: 0px;
}
.drawer-dark-theme .left ul li {
  padding-left: 30px;
}
.drawer-dark-theme .left ul li {
  border-radius: 0px !important;
}
.drawer-dark-theme .active a {
  box-shadow: 0px 0px 10px 0px #0f335f;
  height: fit-content;
  border-radius: 0px !important;
}
.drawer-dark-theme .balance{
  background: #040e1a;
  box-shadow: none;
  color: #FFF;
  width: 100%;
}
.drawer-dark-theme .app-logo a{
  color: #FFF;
}
.drawer-dark-theme .img.app-logo {
  padding: 0px;
}
.drawer-dark-theme .total {
  color: #FFF;
  text-shadow: 10px 10px 20px #cbbbeb;
}
.drawer-dark-theme .png_logo{
  max-width: 32px;
}
.drawer-dark-theme .left {
  background: #040e1a;
}
.drawer-dark-theme .wrapper .left-area {
  background: #040e1a;
}
.version{
  position: relative;
  left: 0px;
  bottom: 0px;
  padding: 5px 20px;
  text-align: center;
  color: #333;
  font-size: 10px;
  font-weight: 700;
  font-family: 'Libre Franklin', sans-serif;
  width: 100%;
}
</style>

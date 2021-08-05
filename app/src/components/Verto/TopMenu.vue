<template>
  <div
    class="menu-top-wrapper"
    :class="{ 'dark-theme': $store.state.settings.lightMode === 'true' }"
  >
    <div class="row">
      <div class="col col-1 app-logo row flex q-pl-md items-center q-pt-md">
        <!-- <img src="statics/vtx_black.svg" alt="" class="q-mr-sm" style="width: 30px; height: 30px;"> -->
        <div class="col-12">
        <svg
          class="svg_logo q-mr-sm"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 20.58"
        >
          <path
            d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z"
            transform="translate(-183 -18.21)"
          ></path>
        </svg>
        <router-link to="/verto/dashboard">VERTO</router-link>
        </div>

      </div>
       <div class="col-2 q-pt-sm" style="width: 150px;">

   </div>
      <div class="col-md-2">
        <q-input  :dark="$store.state.settings.lightMode === 'true'" dense filled v-model="searchVal" style="width:280px" class="float-right  full-width q-mt-sm" icon-right="search" label="Search token by symbol"  >
            <template v-slot:append>
              <q-icon v-if="searchVal !== ''" name="close" @click="searchVal = ''" class="cursor-pointer" />
              <q-icon name="search" />
            </template>
          </q-input>
          </div>

    <div class="col col-3 flex items-center date-scrolling-msg">
        <div class="flex items-center main_portfolio" :class="{'text-white': $store.state.settings.lightMode === 'true'}" v-if="$router.currentRoute.path === '/verto/defi'">
          <h3 class="">Main Portfolio</h3> <span class="q-ml-sm q-mr-sm q-mb-xs">|</span> <h2 class="">${{ nFormatter2($store.state.wallets.portfolioTotal, 3) }} USD</h2>
        </div>
        <!-- <div class="date">{{ refreshDate() }}</div> -->
        <!-- <VTextMarquee :speed="40" @click="animate = !animate" :animate="animate" content='This app is in beta, please send us bug reports if you find any. <b><a target="_blank" href="https://t.me/vertosupport">t.me/vertosupport</a></b>' /> -->
      </div>
      <div class="col col-3 flex justify-end q-pr-md items-center menu">
        <!-- to="/verto/create-polkadot-account" -->
       <!-- <router-link to="/verto/create-polkadot-account" >Polkadot</router-link> -->
        <q-btn @click="$store.state.settings.activityBar = !$store.state.settings.activityBar" dense flat round icon="notifications_none" class="q-ml-md q-mr-md"  >
          <q-badge color="white" class="text-black" floating>0</q-badge>
        </q-btn>
        <q-btn-dropdown
          no-caps
          :color="$store.state.settings.lightMode === 'true' ? 'white':'black'"
          label="Quick access"
          flat
          v-if="false"
        >
          <q-list
          :light="$store.state.settings.lightMode === 'false'"
          :dark="$store.state.settings.lightMode === 'true'"
          >
            <q-item dense @click="buyCPU()" clickable v-close-popup>
              <q-item-section avatar>
                <q-avatar
                  icon="speed"

                />
              </q-item-section>
              <q-item-section>
                <q-item-label>Buy CPU </q-item-label>
              </q-item-section>
            </q-item>

            <q-item dense @click="backupConfig()" clickable v-close-popup>
              <q-item-section avatar>
                <q-avatar
                   icon="backup"

                />
              </q-item-section>
              <q-item-section>
                <q-item-label>Backup config</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-item  v-if="$store.state.wallets.metamask.accounts.length && false" dense class="metamask-btn" style="max-width:300px">
            <q-item-section class="text-body1 q-pr-sm">
                <q-btn  :class=" $store.state.wallets.metamask.accounts.length ? 'bg-green-1' : 'bg-red-1'" flat icon="fiber_manual_record" :color="!$store.state.wallets.metamask.accounts.length ? 'red' : 'green'" :label="!$store.state.wallets.metamask.accounts.length ? 'Connect' : 'Connected'">
                    <img style="width: 35px;" class="q-pl-sm" src="https://cdn.freebiesupply.com/logos/large/2x/metamask-logo-png-transparent.png">
                </q-btn>
            </q-item-section>
        </q-item>
        <q-btn-dropdown
          no-caps
          icon="upgrade"
          label="Import accounts"
          flat
          v-if="false"
          :color="$store.state.settings.lightMode === 'true' ? 'white':'black'"
        >
          <q-list
          :light="$store.state.settings.lightMode === 'false'"
          :dark="$store.state.settings.lightMode === 'true'"
          >
            <q-item dense to="/verto/import-private-key/eos" clickable v-close-popup>
              <q-item-section avatar>
                <q-avatar
                  :icon="'img:https://files.coinswitch.co/public/coins/eos.png'"
                  text-color="white"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>Import EOS account</q-item-label>
              </q-item-section>
            </q-item>

            <q-item dense to="/verto/import-private-key/eth" clickable v-close-popup>
              <q-item-section avatar>
                <q-avatar
                  :icon="'img:https://files.coinswitch.co/public/coins/eth.png'"
                  text-color="white"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>Import ETH account</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <router-link
          to="/verto/eos-account/create"
          v-if="$store.state.settings.network == 'testnet'"
          class="q-pr-md"
          >Create Test Account</router-link
        >
        <q-select
          dense
          borderless
          :light="$store.state.settings.lightMode === 'false'"
          :dark="$store.state.settings.lightMode === 'true'"
          @input="switchNetwork()"
          :color="network.value == 'testnet' ? 'white' : ''"
          :class="[network.value == 'testnet' ? 'bg-red text-white select-input' : '', 'select-input']"
          v-model="network"
          :options="networks"
        >
        <!--
          <template v-slot:option="scope">
            <q-item  dense class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section avatar>
                <q-icon size="xs" :name="`img:${scope.opt.image}`" />
              </q-item-section>
              <q-item-section dark>
                <q-item-label class="text-black" v-html="scope.opt.label" />
              </q-item-section>
            </q-item>
          </template>

          <template v-slot:selected>
            <q-item dense v-if="network">
              <q-item-section avatar>
                <q-icon size="xs" :name="`img:${network.image}`" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-black" v-html="network.label" />
              </q-item-section>
            </q-item>
            <q-item v-else> </q-item>
          </template>
            -->
        </q-select>

        <a href="javascript:void(0)" @click="logout">
          <q-icon class="reverse" name="exit_to_app" /> Logout
        </a>
        <q-toggle
          v-model="lightMode"
          checked-icon="wb_sunny"
          @input="toggleLightDarkMode"
          color="grey"
          size="lg"
          class="darkmode-btn"
          unchecked-icon="brightness_3"
        >
          <q-tooltip
            v-if="$store.state.settings.lightMode === 'false'"
            content-class="black"
            :offset="[10, 10]"
          >
            Dark mode
          </q-tooltip>
          <q-tooltip v-else content-class="black" :offset="[10, 10]">
            Light mode
          </q-tooltip>
        </q-toggle>
        <span style="width: 140px"></span>
      </div>
    </div>
    <q-dialog v-model="temp">
      <FreeCPUDialog />
    </q-dialog>
  </div>
</template>

<script>
// import configManager from '@/util/ConfigManager'
// import { VTextMarquee } from 'vue-text-marquee'
import Vue from 'vue'
import VDexNodeConfigManager from '@/util/VDexNodeConfigManager'
import initWallet from '@/util/Wallets2Tokens'
import EosRPC from '@/util/EosWrapper'
import configManager from '@/util/ConfigManager'

export default {
  name: 'TopMenu',
  components: {

  },
  data () {
    return {
      lightMode: true,
      temp: false,
      animate: true,
      searchVal: '',
      interval: null,
      key: 0,
      network: null,
      networks: [
        {
          label: 'Mainnet',
          image:
            'https://upload.wikimedia.org/wikipedia/commons/2/2d/Basic_green_dot.png',
          value: 'mainnet'
        },
        {
          label: 'Testnet',
          image:
            'https://dev.volentix.io/statics/icon.png',
          value: 'testnet'
        }
      ]
    }
  },
  created () {
    this.network = this.networks.find(
      (o) => o.value.toLowerCase() === this.$store.state.settings.network
    )
    window.localStorage.setItem(
      'skin',
      window.localStorage.getItem('skin') !== null
        ? window.localStorage.getItem('skin')
        : false
    )
    this.$store.state.settings.lightMode =
      window.localStorage.getItem('skin') !== null
        ? window.localStorage.getItem('skin')
        : false
    // console.log('this.$store.state.settings.lightMode', this.$store.state.settings.lightMode)
    this.lightMode = window.localStorage.getItem('skin') !== 'false'
  },
  methods: {
    nFormatter2 (num, digits) {
      var si = [
        { value: 1, symbol: '' },
        { value: 1E3, symbol: 'k' },
        { value: 1E6, symbol: 'M' },
        { value: 1E9, symbol: 'B' },
        { value: 1E12, symbol: 'T' },
        { value: 1E15, symbol: 'P' },
        { value: 1E18, symbol: 'E' }
      ]
      var rx = /\.0+$|(\.[0-9]*[1-9])0+$/
      var i
      for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
          break
        }
      }
      return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
    },
    async switchNetwork () {
      this.$store.dispatch('settings/toggleNetwork', this.network.value)
      Vue.prototype.$rpc = new EosRPC(
        process.env[this.$store.state.settings.network].EOS_HISTORYAPI
      )
      Vue.prototype.$vDexNodeConfigManager = new VDexNodeConfigManager(
        process.env[this.$store.state.settings.network].EOS_HISTORYAPI
      )
      await initWallet()
    },
    async backupConfig () {
      try {
        await configManager.backupConfig()
        if (this.$q.platform.is.android) {
          this.$q.notify({ color: 'positive', message: 'Config Saved' })
        }
      } catch (e) {
        // TODO: Exception handling
      }
    },
    buyCPU () {
      let account = this.$store.state.wallets.tokens.find(o => o.chain === 'eos' && o.type === 'eos')
      if (account) {
        this.$store.commit('currentwallet/updateParams', {
          chainID: 'eos',
          tokenID: 'eos',
          accountName: account ? account.name : ''
        })
        this.$store.state.currentwallet.wallet = account
        this.$router.push('/verto/stake')
      } else {
        this.$q.notify({
          message: 'No EOS account found',
          timeout: 2000,
          icon: 'check',
          textColor: 'white',
          type: 'warning',
          position: 'top'
        })
      }
    },
    toggleLightDarkMode (val) {
      // console.log('toggleLightDarkMode (val)', val)
      window.localStorage.setItem('skin', val)
      this.$store.state.settings.lightMode = window.localStorage.getItem('skin')
      // console.log('this.$store.state.settings.lightMode', this.$store.state.settings.lightMode)
    },
    refreshDate () {
      let date = new Date()
      return date.toDateString() + ',  ' + date.getHours() + ':' + date.getMinutes()
    },
    logout () {
      // configManager.logout()
      this.$router.push({
        path: '/login'
      })
    }
  },
  destroyed () {
    clearInterval(this.interval)
  },
  mounted () {
    this.interval = setInterval(() => {
      this.key++
    }, 60000)
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.menu-top-wrapper {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  $height: 60px;
  height: $height;
  // background-color: #fff;
  background: #e7e8e8;
  z-index: 9;
  // @extend .shad;
  .row {
    .col {
      height: $height;
      &.menu {
        a {
          font-weight: $regular;
          font-family: $Titillium;
          font-size: 16px;
          color: #333;
          text-decoration: none;
          padding: 5px 10px;
          border-radius: 5px;

          &:hover {
            background-color: rgba(black, 0.02);
          }
        }
      }

      &.app-logo {
        svg {
          fill: #000;
        }
        a {
          font-weight: $bold;
          text-transform: uppercase;
          font-family: $Titillium;
          font-size: 20px;
          color: #333;
          text-decoration: none;
        }
      }

      cursor: pointer;
      position: relative;
    }
  }
  &.dark-theme {
    .select-input{
      font-size: 16px;
      font-weight: $light;
      font-family: $Franklin;
      .text-black{
        color: #FFF !important;
      }
    }
    background: #04111f;
    .date-scrolling-msg {
      .date {
        color: #fff;
      }
    }
    .row {
      .col {
        &.app-logo {
          svg {
            fill: #fff;
          }
        }
        &.menu {
          a {
            color: #fff;
          }
        }
        &.app-logo {
          a {
            color: #fff;
          }
        }
      }
    }
  }
}

.reverse {
  transform: scaleX(-1);
}
.date-scrolling-msg {
  /deep/ .v-marquee {
    max-width: 360px;
    margin-left: 20px;
  }
}
.select-input{
  font-size: 16px;
  font-weight: $light;
  font-family: $Franklin;
}
.q-item--dark{
  .text-black{
    color: #FFF !important;
  }
}
.q-list--dark{
  background: #050a10;
  border-radius: 0px;
}
.main_portfolio{
  margin-top: -12px;
  margin-left: -65px;
  h3{
    font-size: 14px;
    font-weight: $regular;
  }
  h2{
    font-size: 16px;
    font-weight: $bold;
  }
}
</style>

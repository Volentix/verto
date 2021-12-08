<template>
  <div
    :class="{ 'menu-top-wrapper': !$q.platform.is.mobile || $isbex, 'dark-theme': $store.state.settings.lightMode === 'true' }"
  >
  <div v-if="!($q.platform.is.mobile || $isbex)">
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
      <div class="col-2 q-pt-sm" style="width: 150px;"></div>
      <div class="col-md-2 q-pt-md q-pb-sm q-pl-sm">
        <q-input v-if="false" dense filled v-model="searchVal" style="width:280px" class="float-right  full-width q-mt-sm" icon-right="search"></q-input>
        <q-select
          filled
          v-model="searchVal"
          :dark="$store.state.settings.lightMode === 'true'"
          use-input
          input-debounce="0"
          class="select-token"
          rounded
          dense
          :label="options.length == optionsUnfiltered.length ? 'Search '+options.length+'+ tokens' : 'Result: '+options.length+' tokens'"
          :options="options"
          @filter="filterFn"
          style="width: 250px"
        >
          <template v-slot:option="scope">
            <q-item
              class="custom-menu"
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
              @click="selectToken(scope.opt) ; "
            >
              <q-item-section v-if="scope.opt.image" avatar>
                <q-icon :name="`img:${scope.opt.image}`" />
              </q-item-section>
              <q-item-section>
                <q-item-label
                  v-html="scope.opt.value.length > 20 ? scope.opt.value.substring(0,20).toUpperCase()+'...' : scope.opt.value.toUpperCase()"
                />
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:append>
            <q-icon v-if="searchVal !== ''" name="close" @click="searchVal = ''" class="cursor-pointer" />
            <q-icon name="search" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
    </div>

      <div v-if="false" class="col col-1 flex items-center date-scrolling-msg">
        <div class="flex items-center main_portfolio" :class="{'text-white': $store.state.settings.lightMode === 'true'}" v-if="$router.currentRoute.path === '/verto/defi'">
          <h3 class="">Main Portfolio</h3> <span class="q-ml-sm q-mr-sm q-mb-xs">|</span> <h2 class="">${{ nFormatter2($store.state.wallets.portfolioTotal, 3) }} USD</h2>
        </div>
        <!-- <div class="date">{{ refreshDate() }}</div> -->
        <!-- <VTextMarquee :speed="40" @click="animate = !animate" :animate="animate" content='This app is in beta, please send us bug reports if you find any. <b><a target="_blank" href="https://t.me/vertosupport">t.me/vertosupport</a></b>' /> -->
      </div>
      <div class="col col-5 flex justify-end q-pt-xs q-pr-md items-center menu">
        <!-- to="/verto/create-polkadot-account" -->
       <!-- <router-link to="/verto/create-polkadot-account" >Polkadot</router-link> -->
        <q-btn v-if="false" @click="$store.state.settings.activityBar = !$store.state.settings.activityBar" dense unelevated round icon="notifications_none" :class="{'text-black': $store.state.settings.lightMode === 'false', 'text-white': $store.state.settings.lightMode === 'true'}" class="q-ml-md q-mr-md">
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
          icon="visibility"
          label="Watch accounts"
          flat
          dense
          :color="$store.state.settings.lightMode === 'true' ? 'white':'indigo-5'"
        >
          <q-list
          :light="$store.state.settings.lightMode === 'false'"
          :dark="$store.state.settings.lightMode === 'true'"
          >
           <q-item :key="index" v-for="(chain, index) in chains" dense :to="getImportLink(chain.chain, true)" clickable v-close-popup>
              <q-item-section avatar>
                <q-avatar
                  :icon="'img:'+chain.icon"
                  text-color="white"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{chain.label}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn-dropdown
          no-caps
          icon="add"
          label="Import accounts"
          flat
          dense
          :color="$store.state.settings.lightMode === 'true' ? 'white':'purple-5'"
        >
          <q-list
          :light="$store.state.settings.lightMode === 'false'"
          :dark="$store.state.settings.lightMode === 'true'"
          >
            <q-item :key="index" v-for="(chain, index) in chains" dense :to="getImportLink(chain.chain)" clickable v-close-popup>
              <q-item-section avatar>
                <q-avatar
                  :icon="'img:'+chain.icon"
                  text-color="white"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{chain.label}}</q-item-label>
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
         v-if="false"
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

    <div v-if="$q.platform.is.mobile || $isbex">
       <q-dialog :dark="$store.state.settings.lightMode === 'true'" v-model="dialog" :maximized="$q.platform.is.mobile">
        <q-card :dark="$store.state.settings.lightMode === 'true'" style="width:100%;">
          <div
            id="id-svk40f"
            role="dialog"
            tabindex="-1"
            aria-modal="true"
            data-dialog="true"
            class="_2ml_U"
            aria-label="Select token to send"
            :style=" $q.platform.is.mobile ? 'height: 100%; max-width: 450px; border-radius: 12px; overflow: hidden; ' : 'height: 470px; max-width: 450px; border-radius: 12px; overflow: hidden; '"
          >
            <div class="_1_oPM">
              <div
                kind="h/5_sb"
                color="currentColor"
                class="UIText-sc-96tl0y-0 iwPgYG"
                style="text-align: center"
              >
                Select Tokens
              </div>
              <button
                type="button"
                aria-label="close"
                @click="$emit('update:openSearch', false)"
                class="UnstyledButton-sc-1d365uh-0 iiKClY"
                style="position: absolute; right: 20px; top: 20px"
              >
                <svg viewBox="0 0 24 24" fill="none" style="width: 24px">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M19.66 4.34a1.16 1.16 0 00-1.642 0l-6.02 6.02-6.016-6.017A1.16 1.16 0 104.34 5.984l6.017 6.018-6.017 6.017a1.16 1.16 0 001.641 1.642L12 13.643l6.02 6.02a1.16 1.16 0 001.641-1.642l-6.02-6.02 6.02-6.019a1.16 1.16 0 000-1.641z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            </div>
            <div class="_149f3"></div>
            <div style="display: flex; flex-direction: column; flex-grow: 1">
              <div class="AssetSelect__Padding-sc-2uja83-0 fAsUxA">
                <div
                  height="12px"
                  width="auto"
                  class="Spacer__SpacerElement-sc-6ie5tt-0 jIsCjR"
                ></div>
                <div class="SearchInput__Wr-sc-15wgvpl-3 kfsUqO">
                  <q-input :dark="$store.state.settings.lightMode === 'true'" v-model="searchVal" :label="options.length == optionsUnfiltered.length ? 'Search '+options.length+'+ tokens' : 'Result: '+options.length+' tokens'" dense filled @input="mobileFilter()">
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div
                  height="20px"
                  width="auto"
                  class="Spacer__SpacerElement-sc-6ie5tt-0 cOuiNY"
                ></div>
              </div>
              <q-scroll-area
                :thumb-style="thumbStyle"
                :bar-style="barStyle"
                style="height: 100%"
                id="scroll-area-with-virtual-scroll-1"
              >
                <q-virtual-scroll
                  scroll-target="#scroll-area-with-virtual-scroll-1 > .scroll"
                  :items="options"
                  :virtual-scroll-item-size="42"
                >
                  <template v-slot="{ item, index }">
                    <q-item
                      :key="index"

                      clickable
                      @click="selectToken(item)"
                    >
                      <!-- <q-item-section side v-if="item.icon">
                        <q-avatar rounded>
                            <img v-if="asset.icon" :src="item.icon" style="max-width: 40px" alt="image" />
                        </q-avatar>
                      </q-item-section> -->
                      <q-item-section>
                        <q-item-label>{{item.type.toUpperCase()}}</q-item-label>
                      </q-item-section>
                      <q-item-section side top>
                      <q-item-label caption>{{getChainLabel(item.chain)}}</q-item-label>
                    </q-item-section>
                    </q-item>
                  </template>
                </q-virtual-scroll>
                <p v-if="options.filter(o => o.type.includes(searchVal.trim()) || !searchVal.trim().length).length == 0" class="q-pl-md">No assets found</p>
              </q-scroll-area>
            </div>
            <div class="_1BCaw" style="background-color: var(--zeric10)"></div>
          </div>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
// import configManager from '@/util/ConfigManager'
// import { VTextMarquee } from 'vue-text-marquee'
import Vue from 'vue'
import VDexNodeConfigManager from '@/util/VDexNodeConfigManager'
import initWallet from '@/util/Wallets2Tokens'
import EosRPC from '@/util/EosWrapper'
import Formatter from '@/mixins/Formatter'
import configManager from '@/util/ConfigManager'
import Lib from '@/util/walletlib'
export default {
  name: 'TopMenu',
  mixins: [Formatter],
  components: {

  },
  props: ['openSearch'],
  data () {
    return {
      lightMode: true,
      optionsUnfiltered: [],
      temp: false,
      animate: true,
      chains: [],
      searchVal: '',
      interval: null,
      key: 0,
      network: null,
      options: [],
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
      ],
      dialog: false,
      thumbStyle: {
        right: '5px',
        borderRadius: '8px',
        backgroundColor: '#C7CBCE',
        width: '8px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '14px',
        backgroundColor: '#BCC2C7',
        width: '14px',
        opacity: 0.2,
        marginTop: '-3px',
        marginBottom: '-3px',
        paddingTop: '3px',
        paddingBottom: '3px'
      }
    }
  },
  created () {
    this.network = this.networks.find(
      (o) => o.value.toLowerCase() === this.$store.state.settings.network
    )
    // this.options = CrosschainDex.getAllCoins()
    this.chains = this.setChains()
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

    this.getTokens()
  },
  watch: {
    '$store.state.tokens.list': function () {
      this.getTokens()
    },
    '$store.state.wallets.tokens': function () {
      this.chains = this.setChains()
    }
  },
  methods: {
    selectToken (asset) {
      console.log('seletcToken ROUTE Push ', asset)
      // if (asset.value) {
      setTimeout(() => {
        this.options = this.optionsUnfiltered
        this.searchVal = ''

        this.$router.push({
          name: this.getPageName('token'),
          path: '/verto/token/' + asset.chain + '/' + asset.value,
          params: {
            asset: asset
          }
        })
        this.$emit('update:openSearch', false)
      }, 300)
      // }
    },
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
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = this.optionsUnfiltered
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.optionsUnfiltered.filter(v => v.value.toLowerCase().indexOf(needle) > -1).sort(function (a, b) {
          return a.value.length - b.value.length
        })
      })
    },
    getTokens () {
      console.log('CREATED GET--TOKEN CALED ')
      if (!this.$store.state.tokens.list || !this.$store.state.tokens.list.length) return
      let top20 = ['btc', 'eth', 'ada', 'usdt', 'bnb', 'xrp', 'doge', 'usdc', 'dot', 'uni', 'sol', 'ltc', 'bch', 'busd', 'link', 'matic', 'icp', 'wbtc', 'xlm', 'etc'].reverse()
      let options = [{
        label: 'Bitcoin',
        value: 'btc',
        chain: 'btc',
        type: 'btc',
        coinGeckoId: 'bitcoin'
        // image: 'https://files.coinswitch.co/public/coins/btc.png'
      }]

      this.$store.state.tokens.list.filter(t => {
        let chains = Object.keys(t.platforms)
        if (chains && chains.length) {
          let chain = chains.find(a => a === 'ethereum')
          chain = chain || chains[0]
          chain = Lib.getCoingeckoChain(chain)
          if (chain) {
            // let image = null /// Lib.getTokenImage(t.symbol.toLowerCase())

            options.push({
              label: t.name,
              value: t.symbol.toLowerCase(),
              chain: chain,
              coinGeckoId: t.id,
              type: t.symbol.toLowerCase()
            })
          }
        }
      })
      options = options.filter((e, i, a) => a.findIndex(j => j.value === e.value) === i).sort(function (a, b) {
        return top20.indexOf(b.type) - top20.indexOf(a.type)
      })
      this.options = options
      this.optionsUnfiltered = options

      if (this.$q.platform.is.mobile) {
        this.options = options.filter((item, idx) => idx < 100)
        setTimeout(() => {
          this.options = options
        }, 100)
      }
      /*
      console.log(a, 'a', this.$store.state.tokens.list) */
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
    },
    mobileFilter () {
      const needle = this.searchVal.toLowerCase()
      if (needle.length > 0) {
        this.options = this.optionsUnfiltered.filter(v => v.value.toLowerCase().indexOf(needle) > -1).sort(function (a, b) {
          return a.value.length - b.value.length
        })
      } else this.options = this.optionsUnfiltered
    }
  },
  destroyed () {
    clearInterval(this.interval)
  },
  mounted () {
    this.interval = setInterval(() => {
      this.key++
    }, 60000)
    this.dialog = this.openSearch
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.select-token /deep/ .q-menu {
  max-width: 100px !important;
  min-width: 50px !important;
}
/deep/ .select-token {
  border-radius: 100px !important;
}
/deep/ .select-token .q-field__control,
/deep/ .select-token .q-field__native {
  border-radius: 100px !important;
}
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
        position: relative;
        right: -45px;
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

._2ml_U {
  background-color: var(--zericWhite);
  border-radius: 4px;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.focus-not-visible ._2ml_U {
  outline: none;
}
@media (max-width: 768px) {
  ._2ml_U {
    border-radius: 0;
    width: 100%;
    max-width: initial;
    height: 100vh;
  }
}
._1_oPM {
  position: relative;
  --horizontal-padding: var(--header-horizontal-padding, 54px);
  padding-left: var(--horizontal-padding);
  padding-right: var(--horizontal-padding);
  padding-top: 18px;
  padding-bottom: 18px;
}
._149f3 {
  background-color: var(--zeric10);
  height: 1px;
  flex-shrink: 0;
}
._3CxWb > * {
  box-shadow: 0 4px 18px rgba(7, 7, 22, 0.2);
  max-width: 610px;
  max-height: 100%;
}
@media (max-width: 768px) {
  ._3lhyU > * {
    height: 100%;
  }
}
._1BCaw {
  width: 100%;
  height: 1px;
  background-color: var(--frame-border-color, currentColor);
}
/*! CSS Used from: Embedded */
.ehgTIN {
  height: 36px;
  width: 36px;
}
.gJTQkQ {
  display: block;
  height: 100%;
  width: 100%;
}
.cNZEJa {
  font-family: Graphik, sans-serif;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background: var(--zeric10);
  line-height: 16px;
  color: var(--zeric80);
  font-weight: 500;
  font-size: 10px;
}
.bhdSQn {
  font-family: inherit;
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: initial;
}
.jYYAZx {
  vertical-align: bottom;
}
.khcNgA {
  display: block;
  font-family: Graphik, sans-serif;
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: -0.2px;
  color: currentcolor;
      margin-top: -14px;
    text-align: right;
}
.iwPgYG {
  display: block;
  font-family: Graphik, sans-serif;
  font-size: 24px;
  line-height: 28px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: currentcolor;
}
.jIsCjR {
  height: 12px;
  width: auto;
}
.IaLFF {
  height: 16px;
  width: auto;
}
.cOuiNY {
  height: 20px;
  width: auto;
}
.iiKClY {
  cursor: pointer;
  padding: 0px;
  margin: 0px;
  border: none;
  background: transparent;
  color: currentcolor;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  line-height: inherit;
}
.focus-not-visible .iiKClY {
  outline: none;
}
.iPFffQ {
  display: grid;
  gap: 4px;
  grid-template-columns: minmax(0px, auto);
}
.iPFffM {
  display: grid;
  gap: 0px;
  grid-template-columns: minmax(0px, auto);
}
.icuFOW {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(min-content, max-content);
  gap: 4px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
}
.iXubSr {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(min-content, max-content);
  gap: 8px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: initial;
  justify-content: initial;
}
.cqCjKr {
  display: block;
  font-family: Graphik, sans-serif;
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: -0.2px;
  color: currentcolor;
  word-break: break-word;
}
.fzDPir {
  display: block;
  font-family: Graphik, sans-serif;
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  letter-spacing: -0.2px;
  color: var(--zeric60);
  word-break: break-word;
}
.MYSLu {
  appearance: none;
  display: block;
  width: 100%;
  height: 36px;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: var(--zeric05);
  color: var(--zeric100);
  outline: none;
  padding-left: 44px;
  padding-right: 44px;
  font-family: Graphik;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
}
@media (hover: hover) {
  .MYSLu:hover {
    border-color: var(--zeric10);
    background-color: var(--zericWhite);
  }
}
.MYSLu:focus {
  background-color: var(--zericWhite);
  border-color: var(--zeric10);
  box-shadow: rgba(16, 36, 87, 0.12) 0px 8px 28px;
}
.gZTczu {
  pointer-events: none;
  position: absolute;
  display: block;
  left: 12px;
  top: 6px;
  color: var(--zeric60);
}
.kfsUqO {
  position: relative;
}
.RUBUj {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
}
.RUBUj .ps {
  overflow-anchor: none;
  touch-action: auto;
  overflow: auto !important;
}
.RUBUj .ps__rail-x {
  display: none;
  opacity: 0;
  transition: background-color 0.2s linear 0s, opacity 0.2s linear 0s;
  height: 15px;
  bottom: 0px;
  position: absolute;
}
.RUBUj .ps__rail-y {
  display: none;
  opacity: 0;
  transition: background-color 0.2s linear 0s, opacity 0.2s linear 0s;
  width: 15px;
  right: 0px;
  position: absolute;
}
.RUBUj .ps--active-y > .ps__rail-y {
  display: block;
  background-color: transparent;
}
.RUBUj .ps:hover > .ps__rail-x,
.RUBUj .ps:hover > .ps__rail-y {
  opacity: 0.6;
}
.RUBUj .ps .ps__rail-x:hover,
.RUBUj .ps .ps__rail-y:hover,
.RUBUj .ps .ps__rail-x:focus,
.RUBUj .ps .ps__rail-y:focus {
  background-color: rgb(238, 238, 238);
  opacity: 0.9;
}
.RUBUj .ps__thumb-x {
  background-color: rgb(170, 170, 170);
  border-radius: 6px;
  transition: background-color 0.2s linear 0s, height 0.2s ease-in-out 0s;
  height: 6px;
  bottom: 2px;
  position: absolute;
}
.RUBUj .ps__thumb-y {
  background-color: rgb(170, 170, 170);
  border-radius: 6px;
  transition: background-color 0.2s linear 0s, width 0.2s ease-in-out 0s;
  width: 6px;
  right: 2px;
  position: absolute;
}
.RUBUj .ps__rail-x:hover > .ps__thumb-x,
.RUBUj .ps__rail-x:focus > .ps__thumb-x {
  background-color: rgb(153, 153, 153);
  height: 11px;
}
.RUBUj .ps__rail-y:hover > .ps__thumb-y,
.RUBUj .ps__rail-y:focus > .ps__thumb-y {
  background-color: rgb(153, 153, 153);
  width: 11px;
}
@media not all, not all {
  .RUBUj .ps {
    overflow: auto !important;
  }
}
.RUBUj .ps .ps__rail-y {
  right: 0px;
  background: rgb(255, 255, 255);
}
.RUBUj .ps .ps__rail-y:hover,
.RUBUj .ps .ps__rail-y:focus {
  width: 14px;
  background: rgb(255, 255, 255);
}
.RUBUj .ps .ps__rail-y > .ps__thumb-y {
  background: rgba(132, 133, 143, 0.3);
  border-radius: 8px;
  width: 6px;
  right: 4px;
}
.RUBUj .ps .ps__rail-y:hover > .ps__thumb-y,
.RUBUj .ps .ps__rail-y:focus > .ps__thumb-y {
  background: rgba(132, 133, 143, 0.3);
}
.RUBUj .ps > .ps__rail-x,
.RUBUj .ps > .ps__rail-y,
.RUBUj .ps:hover > .ps__rail-x,
.RUBUj .ps:hover > .ps__rail-y {
  opacity: 1;
}
.kfPoNl {
  height: 100%;
  flex: 1 1 0%;
}
.hnbMXD {
  position: relative;
  overflow: unset;
}
.fAsUxA {
  padding-left: 20px;
  padding-right: 20px;
}
.gAlxcT {
  cursor: pointer;
  padding: 0px 12px;
  margin: 0px 8px;
  border: none;
  background: transparent;
  color: currentcolor;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  line-height: inherit;
  border-radius: 8px;
}
.focus-not-visible .gAlxcT {
  outline: none;
}
@media (hover: hover) {
  .gAlxcT:hover {
    background-color: var(--zeric05);
  }
}
.gAlxcT:active {
  background-color: var(--zeric10);
}

._34zH_ {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
}
._34zH_:hover {
  background-color: var(--zeric05);
}
.rounded {
border-radius: 50%;
}
button:hover {
  background: #f2f2f2 !important;
}

.q-dialog .q-card.q-card--dark.q-dark button:hover {
  background: #0e1829 !important;
}
</style>

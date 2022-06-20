<template>
  <div class="">
    <q-dialog
      v-model="dialog"
      persistent
      position="right"
      style="max-width: 400px"
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="guideWizardWrapper" :dark="$store.state.settings.lightMode === 'true'"  style="min-width:334px;">
        <q-bar>
          <div class="text-h6 flex items-center welcome-title">
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
              Welcome to Verto Wizard
            </div>
          <q-space />
          <q-btn
            dense
            flat
            color="white"
            icon="minimize"
            @click="maximizedToggle = false"
            :disable="!maximizedToggle"
          >
            <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary"
              >Minimize</q-tooltip
            >
          </q-btn>
          <q-btn
            dense
            flat
            color="white"
            icon="crop_square"
            @click="maximizedToggle = true"
            :disable="maximizedToggle"
          >
            <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary"
              >Maximize</q-tooltip
            >
          </q-btn>
          <q-btn dense flat @click="closeWizard()" color="white" icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <div class="q-pb-md q-pr-sm q-pt-sm">
          <q-scroll-area :visible="true" :style="maximizedToggle ? 'height: 91vh':'height: 80vh'">
            <q-card-section class="q-pa-xs q-pl-md">
              <div class="btn-back full-width" v-if="currentActionItem">
                <q-btn flat color="white" no-caps class="text-bold text-grey" unelevated icon="keyboard_arrow_left" text-color="black" label="Back"
                @click="
                  accountDropdown = false;
                  filterAccount();
                " />
              </div>
            </q-card-section>
            <q-card-section class=" text-h6 q-py-none help-qst-title">
              Get started with Volentix.
            </q-card-section>
            <q-card-section class="text-body1  help-qst-title">
              By Staking 10,000 VTX you will get a free EOS account and access the entire EOS ecosystem all in one click.
              <div class="flex">
                <q-btn
                  rounded
                  @click="getVTX(); dialog = false"
                  class="q-mt-md get-started"
                  outline
                  no-caps
                  color="indigo-12"
                  label="Get Started"
                />
              </div>
            </q-card-section>
            <q-card-section class="q-pt-md text-body1 help-qst-title">
              What do you want to do ?
              <q-input :dark="$store.state.settings.lightMode === 'true'" @click="getAccount()" clearable clear-icon="close" rounded outlined color="indigo-12" label="Type an action" @input="filterActions()" v-model="searchAction" class="q-mt-sm input-input" />
            </q-card-section>
            <q-card-section v-if="currentActionItem" class="q-py-sm text-body2 ">
              <b
                @click="
                  accountDropdown = false;
                  filterAccount();
                "
                class="cursor-pointer"
              >
                Actions </b
              >> {{ currentActionItem.label }}
            </q-card-section>
            <q-card-section v-show="!filteredActions.reduce((a, b) => +a + +b.items.length, 0)" class="">
              <p>
              No actions found
              </p>
            </q-card-section>
            <q-card-section
              v-show="!accountDropdown && list.items.length"
              class=""
              v-for="(list, index) in filteredActions"
              :key="index"
            >
              <span class="text-body2 subtitle flex items-center q-mb-sm" v-if="list.items.length && index === 1">
                Choose chain :
                <q-btn :flat="chainToggle === 'eth'" color="white" :text-color="$store.state.settings.lightMode === 'true' ? 'white':'black'" class="q-ml-sm q-mr-sm" :outline="chainToggle === 'eos' || chainToggle === ''" @click="chainToggle = 'eos'">
                  <div class="flex items-center">
                    <q-icon class="q-mrsm" :name="`img:https://files.coinswitch.co/public/coins/eos.png`" /> EOS
                  </div>
                </q-btn>
                <q-btn :flat="chainToggle === 'eos'" color="white" :text-color="$store.state.settings.lightMode === 'true' ? 'white':'black'" :outline="chainToggle === 'eth' || chainToggle === ''" @click="chainToggle = 'eth'">
                  <div class="flex items-center">
                    <q-icon class="q-mrsm" :name="`img:https://files.coinswitch.co/public/coins/eth.png`" /> ETH
                  </div>
                </q-btn>

              </span>

              <span v-if="list.items.length && index === 0" class="text-body2 subtitle">{{ index + 1 + "- " + list.listLabel }}</span>
              <q-list v-if="index === 0" class="q-mt-md" bordered separator>
                <q-item
                  v-show="list.items.length"
                  clickable
                  v-ripple
                  @click="
                    currentActionItem = item;
                    currentAction = list;
                    triggerMethods(item.methods);
                  "
                  v-for="(item, i) in list.items"
                  :key="i"
                >
                  <q-item-section avatar>
                    <q-icon :name="item.icon" />
                  </q-item-section>
                  <q-item-section>{{ item.label }}</q-item-section>
                </q-item>
              </q-list>
              <span v-if="list.items.length && ((chainToggle === 'eos' && index === 1) || (chainToggle === 'eth' && index === 2))" class="text-body2 subtitle">{{ index + 1 + "- " + list.listLabel }}</span>
              <q-list v-if="(chainToggle === 'eos' && index === 1) || (chainToggle === 'eth' && index === 2)" class="q-mt-md" bordered separator>
                <q-item
                  v-show="list.items.length"
                  clickable
                  v-ripple
                  @click="
                    currentActionItem = item;
                    currentAction = list;
                    triggerMethods(item.methods);
                  "
                  v-for="(item, i) in list.items"
                  :key="i"
                >
                  <q-item-section avatar>
                    <q-icon :name="item.icon" />
                  </q-item-section>
                  <q-item-section>{{ item.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-section v-if="accountDropdown">
              <p v-if="currentToken && currentToken.autoSelect">
                {{ "Use your " + (currentActionItem.type ?  currentActionItem.type.toUpperCase() : currentAction.chain.toUpperCase() )+ " account" }}
              </p>
              <p v-else-if="accounts.length">{{ "Select " + currentAction.chain.toUpperCase() + " account" }}</p>
              <q-select
                :dark="$store.state.settings.lightMode === 'true'"
                :light="$store.state.settings.lightMode === 'false'"
                separator
                rounded
                outlined
                v-if="accounts.length"
                style="min-width: 300px"
                class="select-input accountDropdown"
                @input="selectWallet()"
                v-model="currentToken"
                :options="accounts"
              >
                <template v-slot:option="scope">
                  <q-item
                    class="custom-menu"
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                  >
                    <q-item-section avatar>
                      <q-icon class="option--avatar" :name="`img:${scope.opt.icon}`" />
                    </q-item-section>
                    <q-item-section dark>
                      <q-item-label v-html="scope.opt.label" />
                      <q-item-label caption class="ellipsis mw200">{{
                        scope.opt.value
                          ? scope.opt.value.toString().substring(0, 10) + "..."
                          : ""
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:selected>
                  <q-item v-if="currentToken">
                    <q-item-section avatar>
                      <q-icon class="option--avatar" :name="`img:${currentToken.icon}`" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label v-html="currentToken.label" />
                      <q-item-label caption class="ellipsis mw200">{{
                        currentToken.value.substring(0, 10) + "..."
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-else> </q-item>
                </template>
              </q-select>
              <p v-if="!accounts.length">No accounts found</p>
              <div class="flex justify-end">
                <q-btn
                  rounded
                  :to="currentActionItem.to"
                  @click="dialog = false"
                  class="q-mt-md"
                  outline
                  no-caps
                  color="indigo-12"
                  label="Proceed"
                />
              </div>
            </q-card-section>
            <q-card-section class="">
              <div class="text-h6 q-pb-md">Support</div>
              <q-btn flat label="Ask the community" @click.native="openURL('https://t.me/vertosupport')" icon="groups" />
            </q-card-section>
          </q-scroll-area>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { openURL, QScrollArea } from 'quasar'

const actions = [
  {
    chain: 'eos',
    listLabel: 'VTX',
    items: [
      {
        label: 'Stake VTX now',
        icon: 'img:https://defibox.s3.ap-northeast-1.amazonaws.com/eos/volentixgsys-vtx.png',
        methods: ['showAccountDropdown'],
        to: '/verto/stake',
        type: 'vtx'
      }
    ]
  },
  {
    chain: 'eos',
    listLabel: 'EOS chain',
    items: [
      {
        label: 'Stake/Buy CPU',
        icon: 'img:https://files.coinswitch.co/public/coins/eos.png',
        methods: ['showAccountDropdown'],
        to: '/verto/stake'
      },
      {
        label: 'Import EOS account',
        icon: 'img:https://files.coinswitch.co/public/coins/eos.png',
        to: '/verto/eos-account/import'
      },
      {
        label: 'Invest',
        icon: 'img:https://files.coinswitch.co/public/coins/eos.png',
        methods: ['setDefiAccount'],
        to: '/verto/defi/liquidity'
      },
      {
        label: 'Exchange',
        icon: 'img:https://files.coinswitch.co/public/coins/eos.png',
        methods: ['setDefiAccount'],
        to: '/verto/defi/swap'
      }
    ]
  },
  {
    chain: 'eth',
    listLabel: 'ETH chain',
    items: [
      {
        label: 'Import ETH account',
        icon: 'img:https://files.coinswitch.co/public/coins/eth.png',
        to: '/verto/import-private-key/eth'
      },
      {
        label: 'Invest',
        icon: 'img:https://files.coinswitch.co/public/coins/eth.png',
        methods: ['setDefiAccount'],
        to: '/verto/defi/liquidity'
      },
      {
        label: 'Exchange',
        icon: 'img:https://files.coinswitch.co/public/coins/eth.png',
        methods: ['setDefiAccount'],
        to: '/verto/defi/swap'
      }
    ]
  }
]
export default {
  components: {
    QScrollArea
  },
  data () {
    return {
      chainToggle: '',
      dialog: true,
      accountDropdown: false,
      active: true,
      maximizedToggle: false,
      accounts: [],
      searchAction: null,
      currentToken: null,
      currentAction: null,
      currentActionItem: null,
      filteredActions: []

    }
  },
  watch: {
    '$route' (to, from) {
      if (to !== from) {
        this.dialog = false
      }
    }
  },
  methods: {
    closeWizard () {
      localStorage.setItem('closewizard', Date.now())
      this.$bus.$emit('showHomeIntro')
    },
    getVTX () {
      let accountOption = this.$store.state.wallets.tokens.find(w => w.chain === 'eth' && w.chain === 'eth')
      this.$store.commit('investment/setDefaultAccount', {
        value: accountOption.key,
        key: accountOption.key,
        chain: 'eth',
        usd: accountOption.usd,
        total: accountOption.total,
        image: accountOption.icon,
        label: accountOption.key.substring(0, 6) + '...' + accountOption.key.substr(accountOption.key.length - 5),
        color: 'cyan'
      })
      this.$store.commit('investment/setAccountTokens', this.$store.state.wallets.tokens.filter(w => w.chain === accountOption.chain && w.key === accountOption.key))
      this.$store.commit('settings/setDex', {
        dex: 'coinswitch',
        depositCoin: {
          value: 'eth'
        },
        destinationCoin: {
          value: 'vtx'
        }
      })
      this.$router.push('/verto/exchange/free-eos-account')
    },
    showAccountDropdown () {
      this.filterAccount(this.currentActionItem.type ? this.currentActionItem.type : this.currentAction.chain, this.currentAction.chain)

      if (this.accounts.length === 1) {
        this.currentToken = this.accounts[0]
        this.currentToken.autoSelect = true
        this.selectWallet()
      }
      this.accountDropdown = true
    },
    filterActions () {
      this.filteredActions = actions.map((action) => {
        let o = JSON.parse(JSON.stringify(action))
        o.items = action.items.filter((o) => {
          return (!this.searchAction || this.searchAction.trim().length === 0 || o.label.toLowerCase().includes(this.searchAction.toLowerCase()))
        })
        return o
      })
    },
    setDefiAccount () {
      this.$store.commit('investment/setDefaultAccount', this.accounts.find(o => o.chain === this.currentAction.chain))
      this.$router.push(this.currentActionItem.to)
    },
    selectWallet () {
      this.$store.commit('currentwallet/updateParams', {
        chainID: this.currentToken.chain,
        tokenID: this.currentToken.type,
        accountName: this.currentToken.name
      })
      this.$store.commit('currentwallet/updateCurrentWallet', this.currentToken)
    },
    triggerMethods (methods) {
      if (methods) {
        methods.forEach((method) => this[method]())
      } else {
        this.$router.push(this.currentActionItem.to)
        this.dialog = false
      }
    },
    filterAccount (type = false, chain = false, name = false) {
      this.accounts = this.$store.state.wallets.tokens
        .filter(
          (a) =>
            (type === false || a.type === type) &&
            (chain === false || a.chain === chain) &&
            (name === false || a.name === name)
        )
        .map((token) => {
          token.label = token.name
          token.value = token.key
          return token
        })
    },
    getAccount () {
      this.accountDropdown = false
      this.accounts = this.$store.state.wallets.tokens.map((token) => {
        token.label = token.name
        token.value = token.key

        return token
      })
    },
    openURL (url) {
      if (this.$q.platform.is.cordova) {
        window.open(url, '_system')
      } else {
        openURL(url)
      }
    }
  },
  mounted () {
    this.filteredActions = actions
    this.getAccount()
  }
}
</script>
<style lang="scss" scoped>
  @import "~@/assets/styles/variables.scss";
  .guideWizardWrapper{
    .q-bar{
      background: #7272FA !important;
    }
    .btn-back{
      /deep/ button{
        margin-left: -22px;
      }
    }
    .welcome-title-section{}
    .welcome-title{
      font-size: 14px;
      // position: absolute;
      // top: -32px;
      color: #FFF;
      .svg_logo{
        fill: #FFF;
      }
      svg{
        height: 20px;
      }
    }
    .q-card__section{
      /deep/ .q-list{
        border-radius: 10px;
        background-color: rgba(#CCC, .2);
        overflow: hidden;
      }
    }
    .subtitle{
      font-size: 14px;
      font-family: $Franklin;
      font-weight: $bold;
    }
    .help-qst-title{}
    .select-input{
      border-radius: 100px !important;
      $height: 50px;
      height: $height;
      /deep/ .q-field__marginal{
        height: $height;
        min-height: unset;
      }
      /deep/ .q-field__control{
        height: $height;
        min-height: unset;
        .q-field__native{
          padding-left: 0px;
          padding-top: 0px;
          padding-bottom: 0px;
          height: $height;
          min-height: unset;
          .q-item{
            padding: 0px;
            padding-left: 18px;
            min-height: $height;
            padding-bottom: 0px;
            .q-item__section{
              padding-right: 0px;
              min-width: 36px;
              .q-item__label + .q-item__label {
                margin-top: 0px;
              }
            }
          }
        }
      }
    }
    .input-input{
      height: 50px;
      margin-bottom: 0px;
      padding-bottom: 0px;
      /deep/ .q-field__control{
        height: 50px;
        min-height: unset;
        .q-field__label{
          top: 15px;
        }
      }
    }
  }
  /deep/ .get-started{
    color: #7272FA !important;
  }
  .q-mrsm{
    margin-left: -8px;
  }
</style>
<style>
.q-dialog__inner--maximized {
  max-width: 400px;
}
.q-dialog.fullscreen {
  z-index: 5999;
}
</style>

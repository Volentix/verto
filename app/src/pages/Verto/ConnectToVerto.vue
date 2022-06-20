<template>
  <q-page :class="$store.state.settings.selectedDex+' column flex-center text-black bg-white'">

    <div class="landing" style="background: url('statics/landing_bg.png')">
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <h2 class="landing--title">
          <strong>VERTO</strong> <b class="version">{{ version }}</b>
          <span>Connect to your wallet  </span>
          <img src="statics/picto_verto.svg" alt="" />
        </h2>
      </transition>
      <div v-if="$route.params.txId && loggedIn && !txObject">
           <p>Fetching transaction data..</p>
           <div class="flex-center flex">
          <q-linear-progress indeterminate style="max-width:400px"  color="grey" class="q-pb-md q-my-sm"/>
          </div>
      </div>
      <Sign :txObject="txObject" v-else-if="txObject && $route.params.txId && loggedIn" />
       <div v-else-if="transactionHash" class="standard-content--body full-width">
        <div class="standard-content--body__form">
          <p class="text-body1">
            Transaction submitted <router-link class="float-right" to="/verto/dashboard">Dashboard <q-icon name="chevron_right" /></router-link>
          </p>
          <q-input bottom-slots v-model="transactionHash" readonly rounded class="input-input pr80" outlined color="purple" type="text">
            <template v-slot:append>
              <div class="flex justify-end">
                <q-btn flat unelevated text-color="grey" @click="copyToClipboard(transactionHash, 'Transaction  hash')" round class="btn-copy" icon="file_copy" />
              </div>
            </template>
            <template v-slot:hint>
              <div class="cursor-pointer q-pl-lg q-pt-sm" @click="step = 1"><q-icon name="keyboard_backspace" /> Go Back</div>
            </template>
            <template v-slot:counter>
              <a :href="'https://bloks.io/transaction/' + transactionHash" class="text-body2 text-black" target="_blank"> Follow <img width="18" src="https://bloks.io/favicon-32x32.png?v=BG7PP2QPNi" /> </a>
            </template>
          </q-input>
        </div>
      </div>

      <div v-else-if="loggedIn && !$route.params.session" class="standard-content--body full-width">
        <div class="standard-content--body__form ">
          <div class="text-body1 q-pb-sm"><b>Main portfolio:</b> ${{formatNumber($store.state.wallets.portfolioTotal)}}</div>
          <AccountSelector :key="$store.state.wallets.tokens.length"/>
          <div class="flex-center flex">
          <q-linear-progress indeterminate style="max-width:400px"  color="grey" class="q-pb-md q-my-sm"/>
          </div>
          <p class="q-pt-sm text-body1" v-if="$store.state.wallets.tokens.length">Updating {{$store.state.wallets.tokens[$store.state.wallets.tokens.length - 1].chain.toUpperCase()}} wallet ({{$store.state.wallets.tokens[$store.state.wallets.tokens.length - 1].name}}). {{$store.state.wallets.tokens[$store.state.wallets.tokens.length - 1].total ? '($'+formatNumber($store.state.wallets.tokens[$store.state.wallets.tokens.length - 1].total,0)+')' : ''}}. <br>Fetching {{$store.state.wallets.tokens[$store.state.wallets.tokens.length - 1].type.toUpperCase()}} balance:  (${{formatNumber($store.state.wallets.tokens[$store.state.wallets.tokens.length - 1].usd,2)}})...</p>
        </div>
      </div>

      <div class="standard-content--body full-width" v-else-if=" !loggedIn">
        <div class="standard-content--body__form">
          <div v-if="pending">

          <div class="flex-center flex text-left q-pb-sm">
          Loading wallet balances
          </div>
          <div class="flex-center flex">
          <q-linear-progress indeterminate style="max-width:400px"  color="grey" class="q-pb-md q-mb-md"/>
          </div>
          </div>
          <q-input ref="psswrd" v-model="password" @keyup.enter="login" @input="checkPassword" :error="passHasError" rounded outlined color="deep-purple-14" :type="isPwd ? 'password' : 'text'" label="Verto Password" hint="*Minimum of 8 characters">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </div>

      </div>
 <!--
     <div class="standard-content--body full-width q-pb-lg" v-else-if="loggedIn && !$route.query.url">
        <div class="standard-content--body__form" v-if="$store.state.investment.defaultAccount">
         <Oneinch :crossChain="true" :disableDestinationCoin="false" v-if="$store.state.settings.selectedDex == 'oneinch'"></Oneinch>
         <Swapeos :crossChain="true" :disableDestinationCoin="false" v-else-if="$store.state.settings.selectedDex == 'defibox'"></Swapeos>
         <Coinswitch :crossChain="true" :disableDestinationCoin="false" v-else-if="$store.state.settings.selectedDex == 'coinswitch'"></Coinswitch>
         </div>
     </div>
       -->
      <div class="standard-content--body full-width q-pb-lg" v-else-if="loggedIn">
        <div class="standard-content--body__form row">
      <q-list  class="text-left   offset-md-4  col-md-4" padding>
      <q-item-label v-if="!connected" class="text-bold text-h6" header>Choose account</q-item-label>
      <q-item v-show="!connected" tag="label" class="bg-white rounded-borders shadow-1" :key="index" v-ripple v-for="(account, index) in [...$store.state.currentwallet.config.keys].filter( o => o.type === 'eth')">
        <q-item-section side top>
          <q-radio v-model="accountValue" :val="account" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-bold">{{account.name}}</q-item-label>
          <q-item-label caption>
            {{getKeyFormat(account.key, 16)}}
          </q-item-label>
        </q-item-section>
      </q-item>
      <div class="q-mt-md">
        <q-btn v-if="!connected" size="md" @click="connect()" label="Connect" color="deep-purple-12" outline/>
        <div class="text-center flex flex-center" v-else>
        <div class="text-h6 text-bold">You are connected</div>
        <p class="text-center">You can go back  {{referrer ? 'to '+referrer : ''}}</p>
        <a :href="referrer" target="_blank" v-if="referrer">
           <q-btn size="md" @click="connect()" label="Go back" color="deep-purple-12" outline/>
            </a>
</div>
        </div>

      </q-list>
          <q-select
          v-if="false"
            class="select-input"
            light
            separator
            filled
            rounded
            v-model="account"
            :options="
              $store.state.wallets.tokens
                .filter((o) => ['eth', 'eos'].includes(o.type))
                .map((token) => {
                  return {
                    label: token.name.toLowerCase(),
                    value: token.chain === 'eos' ? token.name.toLowerCase() : token.key,
                    key: token.key,
                    image: token.icon,
                    amount: token.amount,
                    type: token.type,
                  };
                })
            "
          >
            <template v-slot:option="scope">
              <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section avatar>
                  <q-icon :name="`img:${scope.opt.image}`" />
                </q-item-section>
                <q-item-section>
                  <q-item-label v-html="scope.opt.label" />
                  <q-item-label> Balance: {{ parseFloat(scope.opt.amount).toFixed(4) }} {{ scope.opt.type.toUpperCase() }} </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected>
              <q-item-section avatar>
                <q-icon :name="`img:${account.image}`" />
              </q-item-section>
              <q-item-section>
                <q-item-label v-html="account.label" />
                <q-item-label v-if="account.amount"> Balance: {{ parseFloat(account.amount).toFixed(4) }} {{ account.type.toUpperCase() }} </q-item-label>
              </q-item-section>
            </template>
          </q-select>

          <q-list separator v-if="false">
            <q-item v-if="account.value.length">
              <q-item-section>
                <q-item-label class="text-bold">From:</q-item-label>
                <q-item-label caption lines="2">{{ account.label }}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-icon :name="`img:${account.image}`" />
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label class="text-bold">To</q-item-label>
                <q-item-label caption lines="2">berthonythe4</q-item-label>
              </q-item-section>

              <q-item-section v-if="account.value.length" side top>
                <q-icon :name="`img:${account.image}`" />
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label class="text-bold">Amount </q-item-label>
                <q-item-label caption lines="2">3 EOS</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

        <div v-if="!transactionHash && false" class="standard-content--footer full-width">
            <!-- <span v-show="!passHasError" :class="[loggedIn ? '' : '' , 'q-pl-md q-pt-md cursor-pointer text-grey']" @click="passHasError = true">{{loggedIn ? 'Cancel' : 'Restore'}}</span> -->
            <!-- <q-btn v-show="passHasError" flat class="action-link back" color="grey" text-color="white" label="Restore Config" @click="startRestoreConfig" /> -->
            <span></span>
            <q-btn class="action-link next" :disable="loggedIn && !account.value.length" color="deep-purple-14" text-color="white" :label="loggedIn ? 'Sign' : 'Connect'" :loading="spinnerVisible" @click="spinnerVisible = true ; loggedIn ? transactionHash = 'f1b275b26029fd9e8e34a8f77058ff842e29a5a4f62516b2ccd57f00c3d0d7ae': login()" />
        </div>
        <div class="standard-content--footer auto full-width justify-center">
            <span></span>
            <q-btn flat v-show="passHasError" @click="restoreFromWords = true" outline class="back" text-color="deep-purple-14" label="Restore from 24 Words" />
            <span></span>
        </div>

      </div>
      </div>
      <div v-if="!transactionHash && !loggedIn" class="standard-content--footer full-width flex justify-end">
        <span v-show="!passHasError" :class="[loggedIn ? '' : '', 'q-pl-md q-pt-md cursor-pointer text-grey']" @click="passHasError = true">{{ loggedIn ? "Cancel" : "Restore" }}</span>
        <q-btn v-show="passHasError" flat class="action-link back" color="grey" text-color="white" label="Restore Config" @click="startRestoreConfig" />
        <q-btn
          class="action-link next"
          :disable="loggedIn && !account.value.length"
          color="deep-purple-14"
          text-color="white"
          :label="loggedIn ? 'Sign' : 'Connect'"
          :loading="spinnerVisible"
          @click="
            spinnerVisible = true;
            loggedIn ? (transactionHash = 'f1b275b26029fd9e8e34a8f77058ff842e29a5a4f62516b2ccd57f00c3d0d7ae') : login();
          "
        />
      </div>
      <div class="standard-content--footer auto full-width justify-center">
        <span></span>
        <q-btn flat v-show="passHasError" @click="restoreFromWords = true" outline class="back" text-color="deep-purple-14" label="Restore from 24 Words" />
        <span></span>
      </div>
      <div class="landing--volentix-logo">
        <a href="https://www.volentix.io" target="_blank"><img src="statics/vtx_black.svg" class="svg" /></a>
      </div>
      <span class="landing--bottom-bar"></span>
    </div>
    <q-dialog v-model="restoreFromWords">
      <q-card class="q-pa-lg">
        <q-toolbar>
          <q-avatar><img src="statics/icon.png" /></q-avatar>
          <q-toolbar-title><span class="text-weight-bold">Restore from</span> 24 Words</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="text-h6"> Are you sure? This is irriversible! Current config will be errased and Restore process will begin after selecting a new verto password. </q-card-section>
        <q-card-actions align="right" class="q-pr-sm">
          <q-btn label="Yes" flat @click="destroyData()" class="yes-btn" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>

import DexInteraction from '../../mixins/DexInteraction'
import configManager from '@/util/ConfigManager'
import { version } from '../../../package.json'
import initWallet from '@/util/_Wallets2Tokens'
// import Oneinch from '../../components/Verto/Exchange/Oneinch'
// import Coinswitch from '../../components/Verto/Exchange/Coinswitch'
// import Swapeos from '../../components/Verto/Exchange/Swapeos'
import AccountSelector from '../../components/Verto/Exchange/AccountSelector'
import Sign from '../../components/Verto/ETH/Sign'
import Formatter from '../../mixins/Formatter'
import {
  mapState
} from 'vuex'
const Parse = require('parse')
Parse.initialize(
  '6olkjCvR0SZGZxExwEPKgBAL9O9vmeHlQ32RyK3t',
  'UEJsZbYlxn4iXIrKsgAGWj3kLzKMxPqsSuCjQhlP'
)
Parse.serverURL = 'https://parseapi.back4app.com'
export default {
  name: 'Login',
  components: {
    Sign,
    //  Oneinch,
    //  Swapeos,
    // Coinswitch,
    AccountSelector
  },
  data () {
    return {
      hasConfig: false,
      accountValue: null,
      txObject: null,
      walletData: null,
      passHasError: false,
      password: '',
      referrer: null,
      connected: false,
      transactionHash: false,
      isPwd: true,
      deleteConfigFail: false,
      deleteConfig: false,
      version: {},
      restoreFromWords: false,
      disableDestinationCoin: true,
      pending: false,
      showSubmit: false,
      accounts: [],
      depositCoin: {
        toSend: 0,
        label: 'EOS',
        value: 'eos',
        image: 'https://files.coinswitch.co/public/coins/eos.png',
        fromAmount: 1
      },
      destinationCoin: {
        label: 'VTX',
        value: 'vtx',
        image: 'statics/icons/favicon-32x32.png'
      },
      loggedIn: false,
      spinnerVisible: false,
      account: {
        label: 'Select a wallet',
        image: '/statics/picto_verto.svg',
        value: '',
        amaount: 0,
        type: ''
      }
    }
  },
  async created () {
    this.$store.state.currentwallet.wallet = {
      empty: true
    }
    if (document && document.referrer) {
      this.referrer = document.referrer
    }

    this.walletData = localStorage.getItem('walletPublicDatav2')

    if (!this.$route.query.url) {
      this.getGodexCoins()
      this.get1inchCoins()
      this.getDefiboxCoins()
    }
    this.$store.dispatch('investment/getMarketDataVsUSD')
    if (this.$route.params.fromCoin) {
      this.depositCoin.value = this.$route.params.fromCoin
      this.destinationCoin.value = this.$route.params.toCoin
      this.depositCoin.fromAmount = this.$route.params.amount
    }

    this.hasConfig = !!(await configManager.hasVertoConfig())
    if (!this.hasConfig) {
      this.$store.commit('settings/setDex', {
        dex: 'coinswitch',
        destinationCoin: this.destinationCoin,
        depositCoin: this.depositCoin,
        fromAmount: this.depositCoin.fromAmount
      })

      this.$router.push({
        name: 'create-password'
      })
    }
    this.$q.notify.registerType('my-notif', {
      icon: 'announcement',
      progress: true,
      color: 'deep-purple-14',
      textColor: 'white',
      position: 'top'
    })
    this.triggerCustomRegisteredType1()
  },
  async mounted () {
    this.version = version
    // this.$refs.psswrd.focus()
  },
  computed: {
    ...mapState('wallets', ['loaded', 'tokens'])
  },
  watch: {
    tokens: {
      deep: true,
      handler (val) {
        if (this.$route.params.fromCoin && !this.pending && !this.walletData) {
          this.pending = true

          this.loggedIn = true

          setTimeout(() => {
            this.$q.notify({
              message: 'Wallet connected',
              color: 'positive'
            })
            this.pending = false
            this.checkPair()

            this.spinnerVisible = false

            this.$router.push('/verto/exchange')
          }, 10000)
        }
      }
    }

  },
  methods: {

    connect () {
      var acl = new Parse.ACL()
      var Account = Parse.Object.extend('userMeta')
      let account = new Account()
      account.set('key', this.accountValue.key)
      account.set('name', this.accountValue.name)
      account.set('chain', this.accountValue.type)
      // user can read data
      acl.setReadAccess(Parse.User.current(), true)
      // user can write data
      // acl.setWriteAccess(Parse.User.current(), true)

      account.setACL(acl)
      account.save()
      this.connected = true
    },
    checkPassword () {
      if (this.password.length > 1) {
        this.showSubmit = true
      } else {
        this.showSubmit = false
      }
    },
    async startRestoreConfig () {
      this.$router.push({
        name: 'restoreWallet',
        params: {
          returnto: 'settings'
        }
      })
    },
    signTransaction () {},
    async login () {
      this.passHasError = false
      if (!this.password) {
        this.passHasError = true
        this.spinnerVisible = false
        return
      }
      const results = await configManager.login(this.password, false)

      if (results.success) {
        this.loggedIn = true
        this.$store.commit('settings/temporary', this.password)
        if (this.$route.params.session && this.$route.params.txId) {
          this.currentUser = await Parse.User.become(this.$route.params.session)
          let Transaction = Parse.Object.extend('Transaction')
          let query = new Parse.Query(Transaction)
          query.equalTo('objectId', this.$route.params.txId).first().then((result) => {
            if (result) {
              this.txObject = result
            }
          })
        } else if (this.$route.params.session) {
          this.accounts = [...this.$store.state.currentwallet.config.keys].filter(o => o.type === 'eth')
          if (this.accounts.length === 1) {
            this.accountValue = this.accounts[0]
          }
          console.log(this.$route.params.session, 'this.$route.params.session')
          this.currentUser = await Parse.User.become(this.$route.params.session)
        } else {
          await initWallet()
          if (this.walletData) {
            this.$router.push('/verto/exchange')
          }
        }
        this.spinnerVisible = false
      } else {
        if (results.message === 'no_default_key') {
          this.$router.push({
            path: 'vertomanager'
          })
        } else {
          // this.startRestoreConfig()
          this.passHasError = true
          this.spinnerVisible = false
        }
      }
    },
    async destroyData () {
      try {
        await configManager.destroyConfig()
        this.hasConfig = false
        this.deleteConfig = false
        this.$q.notify({
          color: 'positive',
          message: 'Config successfully deleted'
        })
        this.$router.push({
          name: 'create-password'
        })
      } catch (e) {
        this.deleteConfigFail = true
        this.deleteConfig = false
      }
    },
    triggerCustomRegisteredType1 () {
      this.$q.notify({
        type: 'my-notif',
        message: `This app is in beta, use at your own risk.`
      })
    }
  },
  mixins: [DexInteraction, Formatter]
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
a {
  text-decoration: none;
}
.q-field {
    max-width: 400px;
    margin: 0 auto;
}
/deep/ .chain-tools-wrapper--list.open {
    margin-bottom: 0px;
    padding-left: 0%;
    padding-right: 0%;
}
.standard-content--body__form {
  max-width:800px;
  margin: 0 auto;

}
.standard-content--body {
  text-align:center
}
/deep/ .desktop-card-style {

    box-shadow: none;
}
/deep/ .list-wrapper br {
  display:none
}
/deep/ .standard-content {
    display:none
}
.prototype .q-tabs {
    display: none;
}

.list-wrapper {
    background: white;
}
.defibox /deep/
  .standard-content--body  {
    margin-top: 5%;
    margin-bottom: 0%;
    max-width: 900px;
}

.landing {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;

  &--title {
    font-size: 30px;
    font-weight: 100;
    position: relative;
    padding-left: 20px;
    line-height: 24px;
    font-family: $Franklin;
    position: relative;
    margin-left: 32%;

    img {
      position: absolute;
      max-width: 170px;
      right: 100%;
      top: -60px;
      width: 200px;
      opacity: 0.6;
    }

    b.version {
      // position: absolute;
      // right: 0px;
      // bottom: -26px;
      font-weight: $regular;
      font-size: 15px;
      margin-left: 10px;
    }

    span {
      font-size: 20px;
      margin-top: 8px;
      display: block;
      color: #000000;
      font-weight: $regular;
    }

    &__sub {
      font-size: 18px;
      text-align: center;
      line-height: 30px;
      margin-top: 0px;
    }

    strong {
      font-weight: bold;
    }

    &:before {
      content: "";
      width: 14px;
      height: 100%;
      position: absolute;
      left: 0px;
      top: 0px;
      background: #7900ff;
      background: transparent linear-gradient(180deg, #7900ff 0%, #00d0df 100%) 0% 0% no-repeat padding-box;
    }
  }

  &--volentix-logo {
    margin-top: 9px;
    text-decoration: none;
    color: #000 !important;
    font-size: 29px;
    position: relative;
    text-transform: uppercase;
    margin-top: 0px;
    color: #000 !important;
    position: absolute;
    bottom: 20px;
    transform: scale(0.55);

    img {
      top: 7px;
      position: relative;
      width: 40px;
    }

    &:after {
      content: "Volentix";
      font-family: $Franklin;
      font-weight: $light;
      position: relative;
      left: 0px;
      top: 0px;
      margin-left: 10px;
    }

    &:after {
      top: -8px;
    }
  }

  &--bottom-bar {
    position: absolute;
    bottom: 10px;
    width: 130px;
    height: 4px;
    background-color: #555869;
    opacity: 0.2;
  }

  @media screen and (min-width: 768px) {
    &--title {
      margin-left: 8%;
    }
  }
}

.standard-content {
  padding: 5% 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

    &--body {
        margin-top: 9%;
        margin-bottom: 5%;

    @media screen and (min-width: 768px) {
      margin-top: 5%;
      margin-bottom: 0%;
      max-width: 600px;
    }
  }

  &--footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-center;
    min-height: 100px;

    &.auto {
      min-height: unset;
    }

    @media screen and (min-width: 768px) {
      max-width: 400px;
    }

    .action-link {
      height: 50px;
      text-transform: initial !important;
      font-size: 16px;
      letter-spacing: 0.5px;
      border-radius: 40px;
      width: 48%;
      margin-left: 0px;

      &.back {
        background-color: #b0b0b0 !important;
      }
    }
  }
}

.q-card {
  border-radius: 25px;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 35px rgba(0, 0, 0, 0.14), 0 1px 10px rgba(0, 0, 0, 0.12);
}

.yes-btn {
  color: #fff !important;
  background-color: #00d0df !important;
  text-transform: initial !important;
  padding: 10px 30px;
  border-radius: 50px;
  font-weight: $light;
}
.defibox /deep/  .standard-content--body__form {
    max-width: 800px;
}
</style>

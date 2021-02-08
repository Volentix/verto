<template>
<q-page class="text-black bg-white defiPage" :class="screenSize > 1024 ? 'desktop-marg': 'mobile-pad'">

<div :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
   <q-dialog v-model="testnetDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Enjoy verto in Test Mode</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
             You are currently accesing verto in test mode. Currently we only support the EOS chain and it uses the Volentix Test Network. <br><br>
             You can create a EOS wallet and start experiencing upcoming features.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="chain = 'eos'; switchChain()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-if="$store.state.settings.network == 'mainnet'" v-model="chooseAccount" persistent transition-show="scale" transition-hide="scale">
      <q-card
        :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
        class="bg-grey-11 flex flex-center q-py-lg" style="width: 500px;">
        <q-card-section>
          <div class="text-h6">Choose your account</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
         <q-select style="width: 400px;"
          :dark="$store.state.settings.lightMode === 'true'"
          :light="$store.state.settings.lightMode === 'false'"
          separator rounded outlined class="select-input ellipsis mw200" @input="getAccountInformation()" v-model="accountOption" :options="accountOptions">
            <template v-slot:selected>
                <q-item v-if="accountOption">
                    <q-item-section v-if="accountOption.image" avatar>
                        <q-icon class="option--avatar" :name="'img:'+accountOption.image" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label v-if="accountOption.usd">{{ accountOption.chain.toUpperCase() }} account - ${{ accountOption.usd.toFixed(4) }}</q-item-label>
                        <q-item-label caption class="ellipsis mw200 q-pt-xs">{{ accountOption.value }}</q-item-label>
                    </q-item-section>
                </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item
                class="custom-menu"

                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section avatar>
                <q-icon
                  :name="`img:${scope.opt.image}`"
                />
                </q-item-section>
                <q-item-section>
                <q-item-label
                  v-html="scope.opt.label"
                />

                <q-item-label
                  v-if="scope.opt.name"
                  caption
                  >{{ scope.opt.name }}</q-item-label>
                  <q-item-label
                  v-if="scope.opt.total"
                  caption
                  >${{ scope.opt.total.toFixed(2) }}</q-item-label>

                </q-item-section>
              </q-item>
            </template>
            <!-- <template v-slot:append>
                <q-avatar>
                    <img src="https://www.volentix.io/statics/icons_svg/svg_logo.svg">
                </q-avatar>
            </template> -->
        </q-select>
        </q-card-section>
         <q-card-section>
          <!-- <q-btn label="Select wallet" color="primary" @click="chooseAccount = false"/> -->
          <q-btn
              unelevated
              @click="chooseAccount = false; showGuidedIntro()"
              color="primary"
              text-color="black"
              label="Select account"
              class="text-capitalize chose_accounts full-width"
            />
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="desktop-version" v-if="screenSize > 1024">

        <div class="text-h6 row flex flex-center" v-if="!accountOption">
         NO EOS or ETH wallet available
        </div>
        <div class="row" v-else>
        <div class="row full-width fixed-bottom z-top">
        <div  class="col-10 row">
             <div v-if="accountOption.chain == 'eth'"  class="col-6 desktop-card-style wallet-snapshot q-mb-md" style="background: url(statics/header_bg.png) no-repeat; background-position: 20% 75%; background-size: 100%;">
                    <div class="flex justify-between items-center q-pt-sm q-pb-sm">
                        <h3 class="text-white q-pl-md">Max DeFi Yield</h3>
                        <div class="text-white q-pr-md amount flex items-center">
                            <span class="interest_rate q-pr-md flex items-center"><img :src="'https://zapper.fi/images/'+maxDeFiYield.token+'-icon.png'" alt=""><strong class="q-pr-md q-pb-sm"><span class="thicker">{{maxDeFiYield.token}}</span></strong> {{maxDeFiYield.roi}} % <b class="p-abs">Interest Rate</b></span>
                            <!-- <span>28.35 USD</span> -->
                        </div>
                    </div>
                </div>
                <div   class="col-6  desktop-card-style yearn-finance q-mb-md" v-if="maxToken && accountOption.chain == 'eth'">
                    <q-item>
                        <q-item-section>
                            <span class="text-h5 text-bold ">
                                Convert {{maxToken.amount.toFixed(4)}} {{maxToken.type.toUpperCase()}} to {{maxDeFiYield.token}}
                            </span>
                        </q-item-section>
                        <q-item-section>
                            <h4 class="q-pl-md q-pt-sm q-pb-sm flex justify-between items-center">
                                <q-icon name="arrow_right_alt" />
                                <div class="flex justify-between items-center"><img :src="'https://zapper.fi/images/'+maxDeFiYield.token+'-icon.png'" alt=""> <strong>{{maxDeFiYield.toTokenAmount}} <b>{{maxDeFiYield.token}}</b></strong></div>
                                <q-btn unelevated class="qbtn-download" color="black" text-color="white" label="Confirm" @click="goToExchange()" />
                            </h4>
                        </q-item-section>
                    </q-item>
                </div>
             </div>
    </div>
    <q-splitter
      v-model="splitterModel"
      style="width:100%"

    >

      <template style="width:25%" v-slot:before>
        <q-tabs
          class="tabs-chains"
          v-model="chain"
          vertical
          align="left"
          inline-label
        >
         <div >
          <q-list class="text-center flex" data-title="Switch between chains"  data-intro="Each chain have their own related and associated features">

            <q-item v-if="$store.state.settings.network == 'mainnet'" clickable @click="chain = 'eth';  switchChain() " :class="[chain == 'eth' ? 'bg-white' :'']">

            <q-img src="https://files.coinswitch.co/public/coins/eth.png" style="width:20px;"/>

              <q-item-section class="q-pl-sm">Ethereum</q-item-section>
            </q-item>

            <q-item clickable class="col" @click="chain = 'eos'; switchChain() " :class="[chain == 'eos' ? 'bg-white' :'']">
              <q-img src="https://files.coinswitch.co/public/coins/eos.png" style="width:20px;"/>

             <q-item-section class="q-pl-sm">EOS</q-item-section>
            </q-item>
          </q-list>
        </div>

          <div auto-close stretch flat>

           <q-list class="text-left" data-title="Menu"  data-intro="Click on a menu item to switch the view of the main section" separator>
            <q-item clickable @click="menu = 'swap'" :class="[menu == 'swap' ? 'bg-grey-3' : 'bg-white']">
              <q-item-section>Swap</q-item-section>
               <q-item-section side><q-icon name="navigate_next"/></q-item-section>
             </q-item>
              <q-item v-if="chain == 'eos'" clickable @click="menu = 'add_liquidity'" :class="[menu == 'add_liquidity' ? 'bg-grey-3' : 'bg-white']">
              <q-item-section>Add liquidity</q-item-section>
               <q-item-section side><q-icon name="navigate_next"/></q-item-section>
             </q-item>
            <q-item clickable @click="menu = 'liquidity'" :class="[menu == 'liquidity' ? 'bg-grey-3' : 'bg-white']">
              <q-item-section>Liquidity Pools</q-item-section>
               <q-item-section side><q-icon name="navigate_next"/></q-item-section>
        </q-item>
        <q-item clickable @click="menu = 'investments'" :class="[menu == 'investments' ? 'bg-grey-3' : 'bg-white']">
              <q-item-section>Investments</q-item-section>
               <q-item-section side><q-icon name="navigate_next"/></q-item-section>
        </q-item>
         <q-item v-if="chain == 'eth'" clickable @click="menu = 'debts'" :class="[menu == 'debts' ? 'bg-grey-3' : 'bg-white']">
              <q-item-section>Debts</q-item-section>
               <q-item-section side><q-icon name="navigate_next"/></q-item-section>
        </q-item>
         <q-item v-if="chain == 'eth'" clickable @click="menu = 'transactions'" :class="[menu == 'transactions' ? 'bg-grey-3' : 'bg-white']">
              <q-item-section>Transactions</q-item-section>
               <q-item-section side><q-icon name="navigate_next"/></q-item-section>
        </q-item>
        <q-item v-if="chain == 'eth'" clickable @click="menu = 'staking'" :class="[menu == 'staking' ? 'bg-grey-3' : 'bg-white']">
              <q-item-section>Stake</q-item-section>
               <q-item-section side><q-icon name="navigate_next"/></q-item-section>
        </q-item>
       </q-list>

      <q-expansion-item
        v-if="accountOption.value"
        :dark="$store.state.settings.lightMode === 'true'"
        default-opened
        class="bg-white q-py-md accountOption"
        :label="'Total Balance - $'+(accountOption.total ? accountOption.total.toFixed(2) : 0 )"
        :caption="accountOption.label"
      >
        <q-card
          :dark="$store.state.settings.lightMode === 'true'"
          flat
          class="accountOptionCard"
          >
          <q-card-section class="q-pa-zero">
            <q-select
            data-title="Changing account..."  data-intro="Click here to switch to another account"
            :dark="$store.state.settings.lightMode === 'true'"
            class="full-width"
            :class="{'bg-white2': $store.state.settings.lightMode === 'false'}"
            @input="getAccountInformation(accountOption)"
            v-model="accountOption"
            :options="accountOptions">
              <template v-slot:selected>
                <q-item
                  :dark="$store.state.settings.lightMode === 'true'"
                  v-if="accountOption">
                  <q-item-section>
                    <q-item-label >Change account</q-item-label>
                    <q-item-label caption class="ellipsis mw200 q-pt-xs">{{ accountOption.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:option="scope">
                <q-item
                  class="custom-menu"
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section avatar>
                  <q-icon
                    :name="`img:${scope.opt.image}`"
                  />
                  </q-item-section>
                  <q-item-section>
                  <q-item-label
                    v-html="scope.opt.label"
                  />

                  <q-item-label
                    v-if="scope.opt.name"
                    caption
                    >{{ scope.opt.name }}
                    </q-item-label>
                    <q-item-label
                    v-if="scope.opt.total"
                    caption
                    >Balance: ${{ scope.opt.total.toFixed(2)  }}
                    </q-item-label>

                  </q-item-section>
                </q-item>
              </template>
              <!-- <template v-slot:append>
                  <q-avatar>
                      <img src="https://www.volentix.io/statics/icons_svg/svg_logo.svg">
                  </q-avatar>
              </template> -->
            </q-select>
            <div  data-title="Token list"  data-intro="On this list you will find tokens associated with your selected account" >
            <q-item clickable :key="index"  v-for="(token,index) in $store.state.wallets.tokens.filter(o => o.chain ==  chain && (( o.name == accountOption.label && chain == 'eos') || ( o.key.toLowerCase() == accountOption.value.toLowerCase() && chain == 'eth' )))">
              <q-item-section avatar top>
                <q-icon :name="'img:'+token.icon" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>{{token.type.toUpperCase()}}</q-item-section>
              <q-item-section>${{isNaN(token.usd) ? 0 : token.usd.toFixed(4)}}</q-item-section>
            </q-item>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>

        </div>

        </q-tabs>
      </template>

      <template v-slot:after>
      <div :class="{'bg-white2':$store.state.settings.lightMode === 'false'}">
          <div v-if="$store.state.settings.network == 'mainnet'" v-show="chain == 'eth'">
            <LiquidityPoolsTable :rowsPerPage="10" class="minHeight" v-if="menu == 'liquidity'"/>
            <InvestmentsTable class="minHeight2" v-else-if="menu == 'investments'"/>
            <DebtsTable class="minHeight2 DebtsTable" v-else-if="menu == 'debts'"/>
            <TransactionsTable class="minHeight2" v-else-if="menu == 'transactions'"/>
            <InvestmentsOpportunitiesTable class="minHeight2" v-else-if="menu == 'staking'"/>
            <Oneinch class="q-pl-md q-pb-xl accountOptionOneinch" v-show="menu == 'swap'" />
          </div>
          <div v-show="chain == 'eos'">
            <Swapeos class="q-pl-md q-pb-xl minHeight3" v-if="$store.state.settings.network == 'mainnet'" v-show="menu == 'swap' || menu == 'add_liquidity' || menu == 'liquidity'" />
            <EosInvestmentsTable class="minHeight3" v-if="$store.state.settings.network == 'mainnet'" v-show="menu == 'investments'"/>
            <TestnetPools class="minHeight3" v-if="$store.state.settings.network == 'testnet'"  v-show="menu == 'liquidity'" />
            <TestnetInvestments class="minHeight3" v-if="$store.state.settings.network == 'testnet'" v-show="menu == 'investments'"  />
            <VolentixLiquidity class="minHeight3" v-if="$store.state.settings.network == 'testnet'" :showLiquidity="false" v-show="menu == 'swap'" />
            <VolentixLiquidity class="minHeight3" v-if="$store.state.settings.network == 'testnet'" :showLiquidity="true" v-show="menu == 'add_liquidity'" />
          </div>

    </div>
      </template>

    </q-splitter>
  </div>

        </div>

    </div>

</q-page>
</template>

<script>
// import RadialProgressBar from 'vue-radial-progress'
// import EosWrapper from '@/util/EosWrapper'
// import { CruxPay } from '@cruxpay/js-sdk'
// import HD from '@/util/hdwallet'
import {
  osName
} from 'mobile-device-detect'
// import TransactionsSection from '../../components/Verto/TransactionsSection'
import {
  mapState
} from 'vuex'
import LiquidityPoolsTable from '../../components/Verto/Defi/LiquidityPoolsTable'
import TransactionsTable from '../../components/Verto/Defi/TransactionsTable'
import InvestmentsTable from '../../components/Verto/Defi/InvestmentsTable'
import Swapeos from '../../components/Verto/Exchange/Swapeos'
import EosInvestmentsTable from '../../components/Verto/Defi/EosInvestmentsTable'
import TestnetPools from '../../components/Verto/Defi/TestnetPools'
import TestnetInvestments from '../../components/Verto/Defi/TestnetInvestments'
import InvestmentsOpportunitiesTable from '../../components/Verto/Defi/InvestmentsTableOpportunities'
import DebtsTable from '../../components/Verto/Defi/DebtsTable'
import Oneinch from '../../components/Verto/Exchange/Oneinch'
import 'intro.js/minified/introjs.min.css'
import VolentixLiquidity from '../../components/Verto/Exchange/VolentixLiquidity'
export default {
  components: {
    // TransactionsSection,
    // desktop components
    Oneinch,
    Swapeos,
    VolentixLiquidity,
    TestnetInvestments,
    LiquidityPoolsTable,
    InvestmentsTable,

    TestnetPools,
    TransactionsTable,
    InvestmentsOpportunitiesTable,
    DebtsTable,
    EosInvestmentsTable

  },
  data () {
    return {
      maxDeFiYield: {},
      openDialog: false,
      tab: 'mails',
      tab2: 'mails',
      console: {

      },
      chain: 'eth',
      menu: 'swap',
      splitterModel: 20,
      chooseAccount: true,
      osName: '',
      accountOptions: [],
      accountOption: {
        chain: ''
      },
      progressValue: 20,
      openModal: false,
      openModalProgress: false,
      transErrorDialog: false,
      transSuccessDialog: false,
      transactionLink: '',
      transStatus: 'Sent Successfully',
      currentWallet: null,
      sendTo: '',
      to: '',
      goBack: '',
      fetchCurrentWalletFromState: true,
      from: '',
      isPwd: true,
      sendAmount: 1,
      formatedAmount: '',
      options: [],
      minimizedModal: false,
      message: '',
      configPath: '',
      tableData: [],
      sendMemo: '',
      chainID: '',
      tokenID: '',
      accountName: '',
      params: null,
      getPassword: false,
      walletClientName: 'verto', // should be 'verto' when in prod
      cruxKey: {},
      sendToResolved: {},
      memoError: false,
      toError: false,
      toErrorMessage: '',
      invalidPrivateKeyPassword: false,
      privateKeyPassword: '',
      isPrivateKeyEncrypted: false,
      privateKey: {
        success: null
      },
      unknownError: false,
      ErrorMessage: '',
      ethWallet: null,
      eosWallet: null,
      testnetDialog: false,
      invalidEosName: false,
      currentAccount: {
        selected: false,
        type: '',
        name: '',
        amount: '',
        contract: '',
        chain: ''
      },
      key: 10101,
      ethTokens: [],
      maxToken: false
    }
  },
  updated () {
    // console.log('openDialog', this.openDialog)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowWidth)
  },
  watch: {
    selectedEOSPool (val) {
      this.menu = 'liquidity'
    },
    '$store.state.wallets.tokens': function () {
      this.initData()
    },
    menu (val) {
      this.$store.commit('settings/setMenu', val)
    },
    '$store.state.settings.network': function () {
      if (this.$store.state.settings.network === 'testnet') {
        this.testnetDialog = true
        if (this.chain === 'eth') {
          this.chain = 'eos'
          this.switchChain()
          this.initData()
        }
      }
    },
    tab (val) {
      this.checkChain()
    }
  },
  computed: {
    ...mapState('investment', ['selectedEOSPool', 'defaultAccount'])
  },
  async created () {
    if (this.$store.state.settings.network === 'testnet') {
      this.chain = 'eos'
      this.switchChain()
    }
    this.initData()
  },
  async mounted () {
    this.checkChain()
    if (this.$route.params.tab) {
      this.menu = this.$route.params.tab
      this.$store.commit('settings/setMenu', this.menu)
    }
  },
  methods: {
    showGuidedIntro () {
      let disableIntro = localStorage.getItem('disableIntro_defi')
      if (!disableIntro) {
        const IntroJS = require('intro.js')
        let Intro = new IntroJS()
        Intro.setOptions({
          showProgress: true
        }).onbeforeexit(function () {
          return localStorage.setItem('disableIntro_defi', Date.now())
        }).start()
      }
    },
    initData () {
      let exchangeNotif = document.querySelector('.exchange-notif')
      if (exchangeNotif !== null) {
        exchangeNotif.querySelector('.q-btn').dispatchEvent(new Event('click'))
      }
      this.osName = osName
      this.getWindowWidth()
      window.addEventListener('resize', this.getWindowWidth)
      // console.log('this.osName', this.osName)
      this.params = this.$store.state.currentwallet.params
      // console.log('this.params', this.params)
      let tableData = this.$store.state.wallets.tokens
      this.currentAccount = tableData.find(w => w.chain === this.params.chainID && w.type === this.params.tokenID && (
        w.chain === 'eos' ? w.name.toLowerCase() === this.params.accountName : w.key === this.params.accountName))

      // console.log(this.ethAccount,'ethAccount', tableData)
      this.ethTokens = tableData.filter(w => w.chain === 'eth' && !isNaN(w.usd))
      this.maxToken = this.ethTokens.length ? this.ethTokens.reduce((p, c) => p.usd > c.usd ? p : c) : null

      this.goBack = this.fetchCurrentWalletFromState ? `/verto/wallets/${this.params.chainID}/${this.params.tokenID}/${this.params.accountName}` : '/verto/dashboard'

      let eosWallets = tableData.filter(w => w.chain === 'eos' && w.type === 'eos' && this.accountOptions.push({
        value: w.name,
        key: w.key.substring(0, 10) + '...' + w.key.substr(w.key.length - 5),
        usd: w.usd,
        chain: 'eos',
        total: w.total,
        image: w.icon,
        label: w.name
      }))
      let ethACcounts = tableData.filter(w => w.chain === 'eth' && w.type === 'eth' && this.accountOptions.push({
        value: w.key,
        key: w.key.substring(0, 10) + '...' + w.key.substr(w.key.length - 5),
        chain: 'eth',
        usd: w.usd,
        total: w.total,
        image: w.icon,
        label: w.key.substring(0, 10) + '...' + w.key.substr(w.key.length - 5)
      }))
      if (ethACcounts.length) {
        this.getMaxDeFiYield()
        this.ethACcount = ethACcounts[0]
      }
      if (eosWallets.length) {
        this.eosACcount = eosWallets[0]
      }

      if (this.defaultAccount) {
        this.accountOption = this.defaultAccount
        this.chooseAccount = false
        this.chain = this.accountOption.chain

        this.switchChain()
      } else if (this.accountOptions.length) {
        this.accountOption = this.accountOptions[0]
      }

      if (this.accountOption.value) {
        this.$store.commit('investment/setDefaultAccount', this.accountOption)
        this.getAccountInformation(this.accountOption)
      }

      this.key++
    },
    checkChain () {
      if (this.$store.state.settings.network === 'mainnet') {
        // this.chain = 'eos'
      } else {
        this.chain = 'eos'
        this.testnetDialog = true
      }
    },
    showConsole (data) {

    },
    switchChain () {
      let tabs = ['swap', 'investments', 'liquidity']
      this.accountOption = this.accountOptions.find(w => w.chain === this.chain)
      if (this.chain === 'eos') {
        if (!tabs.includes(this.menu)) {
          this.menu = 'liquidity'
        }
        this.$store.commit('investment/setDefaultAccount', this.accountOption)
      } else {
        if (this.menu === 'add_liquidity') this.menu = 'liquidity'
        this.getAccountInformation(this.accountOption)
      }
    },
    goToExchange () {
      // console.log('this.depositCoin', this.depositCoin)
      let depositCoin = {
        label: this.maxToken.type,
        value: this.maxToken.type.toLowerCase(),
        image: 'https://files.coinswitch.co/public/coins/' + this.maxDeFiYield.token.toLowerCase() + '.png'
      }
      let destinationCoin = {
        label: this.maxDeFiYield.token,
        value: this.maxDeFiYield.token.toLowerCase(),
        image: 'https://zapper.fi/images/' + this.maxDeFiYield.token + '-icon.png'
      }
      this.$store.commit('settings/setDex', { dex: 'oneinch', destinationCoin: destinationCoin, depositCoin: depositCoin })

      this.$router.push('/verto/exchange/')
    },
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    },
    async getAccountInformation () {
      this.chain = this.accountOption.chain
      let account = this.accountOption

      this.$store.commit('investment/resetAccountDetails', account)

      if (account.chain !== 'eth') return

      this.$store.commit('investment/setTableLoadingStatus', true)

      this.$store.dispatch('investment/getTransactions', account)
      account.platform = 'uniswap-v2'
      this.$store.dispatch('investment/getInvestments', account)
      account.platform = 'uniswap'
      this.$store.dispatch('investment/getInvestments', account)
      account.platform = 'balancer'
      this.$store.dispatch('investment/getInvestments', account)
      account.platform = 'curve'
      this.$store.dispatch('investment/getInvestments', account)
      account.platform = 'yearn'
      this.$store.dispatch('investment/getInvestments', account)
      account.platform = 'maker'
      await this.$store.dispatch('investment/getDebts', account)
      setTimeout(() => {
        this.$store.commit('investment/setTableLoadingStatus', false)
      }, 4000)
    },
    getMaxDeFiYield () {
      this.$axios.get(process.env[this.$store.state.settings.network].CACHE + 'https://stats.finance/yearn')
        .then((result) => {
          var html = new DOMParser().parseFromString(result.data, 'text/html')
          var prev = 0
          for (let i = 6; i <= 14; i++) {
            let value = parseFloat(html.querySelectorAll('table tr')[i].innerText.match(/[\d.]+/)[0])
            if (value > prev) {
              this.maxDeFiYield = {
                roi: value,
                token: html.querySelectorAll('table tr')[i].innerText.match(/\(([^)]+)\)/)[1]
              }
              prev = value
            }
          }
          this.maxDeFiYield.toTokenAmount = this.convertWalletToken(this.maxToken.type, this.maxDeFiYield.token)
        })
    },
    convertWalletToken (from, to) {
      let find = this.$store.state.investment.zapperTokens.find(o => o.symbol.toLowerCase() === to.toLowerCase())
      return find ? parseInt(this.maxToken.usd / find.price) : 'Not found'
    },
    copyToClipboard (key, copied) {
      this.$clipboardWrite(key)
      this.$q.notify({
        message: copied ? copied + ' Copied' : 'Key Copied',
        timeout: 2000,
        icon: 'check',
        textColor: 'white',
        type: 'warning',
        position: 'top'
      })
    },
    hideModalFun: function () {
      this.openModal = false
      this.openModalProgress = false
    }
  }
}
</script>

<style lang="scss" scoped>

@import "~@/assets/styles/variables.scss";

.q-splitter__panel.q-splitter__after.col {
    background: white;
}
.q-splitter__panel.q-splitter__before {
    width: 25%;
}

/deep/ .wallets-wrapper {
    padding-bottom: 0px !important;
}

/deep/ .wallets-wrapper--list {
    box-shadow: none;
    margin-top: 0px;
}

.marg {
    /deep/ .profile-wrapper {
        &--header {
            margin-bottom: 0px;
        }
    }
}

.mobile-pad {
  padding-bottom: 50px
}

.desktop-version{
  background: #E7E8E8;
  padding-top: 13vh;
  padding-left: 20vh;
  padding-bottom: 50px;
  padding-right: 2%;
  @media screen and (min-width: 768px) {
    padding-top: 11vh;
    padding-bottom: 0px;
  }
}
/deep/ .q-dark{
  &.current-investments{
    background: #04111F !important;
    // padding: 20px;
    // border-radius: 0px;
    // border: 1px solid rgba(#CCC, .2);
    border: 1px solid rgba(#CCC, .3);
    margin: 0px 20px;
    border-radius: 10px;
  }
}

  .accountOptionOneinch{
    // border: 1px solid rgba(#CCC, .3);
    margin: 0px 20px;
    border-radius: 10px;
    padding-right: 20px;
    padding-top: 8px;
    /deep/ .trade-component {
      .prototype .head{
        // color: #FFF;
        // border-bottom: 1px solid rgba(#CCC, .3);
        margin-bottom: 40px;
      }
      .prototype .you-receive-head,
      .prototype .you-pay-head{
        // color: #FFF;
      }
      .prototype .you-receive{
        // background-color: rgba(white, .05);
        .swap_vert{
          // background-color: #04111F !important;
        }
      }
      .prototype .you-receive .chose_accounts{
        // background-color: #FFF !important;
        font-size: 16px !important;
        // font-family: $Franklin !important;
        // color: #04111F !important;
        border-radius: 40px;
        margin-top: 40px;
        height: 54px;
        width: fit-content !important;
        float: right;
      }
    }
  }
  /deep/ .summary-wrapper{
    // background-color: rgba(white, .06);
    // color: #FFF;
    .q-item{
      // border-top: 1px solid rgba(white,.12) !important;
      .q-item__label{
        // color: #FFF;
      }
      &:first-child{
        border-top: none !important;
      }
    }
  }
  /deep/ .swapeos-component{
    background: #FFF;
    margin: 0px 20px;
    border: 1px solid rgba(#CCC, .3);
    border-radius: 10px;
    overflow: hidden;
    .bg-white{
      background: transparent !important;
    }
    .prototype .q-tabs{
      box-shadow: none !important;
      margin-bottom: 10px;
    }
    .trade-component .prototype .head{
      // color: #FFF;
    }
    .trade-component .prototype .you-receive .chose_accounts{
      // background-color: #FFF !important;
      font-size: 16px !important;
      // font-family: $Franklin !important;
      color: #04111F !important;
      border-radius: 40px;
      margin-top: 40px;
      height: 54px;
      width: fit-content !important;
      float: right;
    }
    .trade-component .prototype .you-receive-head,
    .trade-component .prototype .you-pay-head{
      // color: #FFF;
    }
    .trade-component .prototype .you-receive{
      // background-color: rgba(white, .05);
      .swap_vert{
        // background-color: #04111F !important;
      }
    }
    .q-tab{
      // color: #FFF;
      opacity: .2;
      box-shadow: none !important;
      background: transparent;
      &.q-tab--active{
        opacity: 1;
      }
    }
  }
  .tabs-chains{
    .q-list--separator{
      .q-item.q-item-type{
        background: transparent !important;
        opacity: 1;
        border-bottom: 1px solid rgba(#CCC, .3);
        &.bg-white{
          background: transparent !important;
          opacity: .3;
        }
      }
    }
    .q-list:not(.q-list--separator){
      border-radius: 30px;
      border: 1px solid rgba(#CCC, .3);
      overflow: hidden;
      margin-bottom: 18px;
      .q-item.q-item-type{
        opacity: .3;
        &.bg-white{
          // border: 1px solid rgba(purple, .4);
          background: transparent !important;
          opacity: 1;
          box-shadow: inset 0px 0px 25px 1px rgba(purple, .2);
        }
      }
    }
  }
  /deep/ .explore-opportunities{
    background: #FFF;
    margin: 0px 20px;
    border: 1px solid rgba(#CCC, .3);
    border-radius: 10px;
    overflow: hidden;
  }
  /deep/ .q-splitter__separator{
    opacity: 0;
  }
  .DebtsTable{
    /deep/ .current-debts{
      border: 1px solid rgba(#CCC, .3);
      margin: 0px 20px;
      border-radius: 10px;
      overflow: hidden;
      background: #FFF;
    }
  }
  /deep/ .accountOption {
    background: transparent !important;
  }
  .accountOptionOneinch{
    background: #FFF;
    border: 1px solid rgba(#CCC, .3);
    margin: 0px 20px;
    border-radius: 10px;
    padding-right: 20px;
    padding-top: 8px;
  }

.dark-theme{
  .desktop-version{
    background: #04111F;
    padding-bottom: 8px;
    min-height: 102vh;
    overflow: hidden;
    position: relative;
    scrollbar-width: 0px;
    .col-title h4{
        color: #FFF;
    }
  }
  /deep/ .explore-opportunities{
    background: transparent;
  }
  .DebtsTable{
    /deep/ .current-debts{
      border: 1px solid rgba(#CCC, .3);
      margin: 0px 20px;
      border-radius: 10px;
      overflow: hidden;
      background: transparent;
    }
  }
  .accountOptionOneinch{
    border: 1px solid rgba(#CCC, .3);
    background: transparent;
    margin: 0px 20px;
    border-radius: 10px;
    padding-right: 20px;
    padding-top: 8px;
    /deep/ .trade-component {
      .prototype .head{
        color: #FFF;
        border-bottom: 1px solid rgba(#CCC, .3);
        margin-bottom: 40px;
      }
      .prototype .you-receive-head,
      .prototype .you-pay-head{
        color: #FFF;
      }
      .prototype .you-receive{
        background-color: rgba(white, .05);
        .swap_vert{
          background-color: #04111F !important;
        }
      }
      .prototype .you-receive .chose_accounts{
        background-color: #FFF !important;
        font-size: 16px !important;
        // font-family: $Franklin !important;
        color: #04111F !important;
        border-radius: 40px;
        margin-top: 40px;
        height: 54px;
        width: fit-content !important;
        float: right;
      }
    }
  }
  /deep/ .summary-wrapper{
    background-color: rgba(white, .06);
    color: #FFF;
    .q-item{
      border-top: 1px solid rgba(white,.12) !important;
      .q-item__label{
        color: #FFF;
      }
      &:first-child{
        border-top: none !important;
      }
    }
  }
  /deep/ .swapeos-component{
    border: 1px solid rgba(#CCC, .3);
    background: transparent;
    margin: 0px 20px;
    border-radius: 10px;
    .trade-component .prototype .head{
      color: #FFF;
    }
    .trade-component .prototype .you-receive .chose_accounts{
      background-color: #FFF !important;
      font-size: 16px !important;
      // font-family: $Franklin !important;
      color: #04111F !important;
      border-radius: 40px;
      margin-top: 40px;
      height: 54px;
      width: fit-content !important;
      float: right;
    }
    .trade-component .prototype .you-receive-head,
    .trade-component .prototype .you-pay-head{
      color: #FFF;
    }
    .trade-component .prototype .you-receive{
      background-color: rgba(white, .05);
      .swap_vert{
        background-color: #04111F !important;
      }
    }
    .q-tab{
      color: #FFF;
      opacity: .2;
      background: transparent;
      &.q-tab--active{
        opacity: 1;
      }
    }
  }
  .accountOptionCard{
    background: transparent !important;
  }
  .accountOption{
    background: transparent !important;
    /deep/ .q-separator{
      display: none !important;
    }
    &.q-list--separator{
      .q-item.q-item-type{
        color: #FFF !important;
        opacity: 1;
        border-bottom: 1px solid rgba(#CCC, .3);
        &.bg-white{
          background: transparent !important;
          opacity: .3;
        }
      }
    }
  }
  .tabs-chains{
    .q-list--separator{
      .q-item.q-item-type{
        color: #FFF !important;
        background: transparent !important;
        opacity: 1;
        border-bottom: 1px solid rgba(#CCC, .3);
        &.bg-white{
          background: transparent !important;
          opacity: .3;
        }
      }
    }
    .q-list:not(.q-list--separator){
      border-radius: 30px;
      border: 1px solid rgba(#CCC, .3);
      overflow: hidden;
      margin-bottom: 18px;
      .q-item.q-item-type{
        color: #FFF !important;
        opacity: .3;
        &.bg-white{
          // border: 1px solid rgba(purple, .4);
          background: transparent !important;
          opacity: 1;
          box-shadow: inset 0px 0px 25px 0px rgba(purple, .5);
        }
      }
    }
  }
}

.desktop-card-style {

    // height: 100%;
    &.account-overview {
        .body-table-col {
            cursor: pointer;
            border-bottom: 1px solid rgba(0, 0, 0, 0.04);

            &:hover {
                background-color: rgba(black, .02);
            }
        }

        .balance {
            padding-left: 5px;
        }

        .token {
            img {
                max-width: 25px;
                border-radius: 25px;
            }
        }

        h4 {
            margin-bottom: 10px;
        }

        .header-table-col {
            h3 {
                font-weight: $bold;
                color: #7272FA;
                font-size: 16px;
                line-height: 20px;
                margin: 0px;
                // border-bottom: 1px solid rgba(black, .03);
                padding-bottom: 8px;
                margin-bottom: -10px;
            }
        }
    }

    &.current-investments {
        &.wallet-col {
            h4 {
                margin-bottom: -8px;
            }

            .body-table-col {
                .imgs {
                    img {
                        margin-right: 10px !important;
                    }
                }
            }

            .header-table-col {
                h3 {
                    font-size: 16px;
                    line-height: 20px;
                }
            }
        }

        h4 {
            margin-bottom: -20px;
        }

        .header-table-col {
            h3 {
                font-weight: $bold;
                color: #7272FA;
                font-size: 16px;
            }
        }

        .body-table-col {
            &:hover {
                background-color: rgba(black, .01);
            }

            &.border {
                border-bottom: 1px solid rgba(black, .04);
            }

            .pairs {
                .pair {
                    font-weight: $bold;
                    color: #2A2A2A;
                    margin-bottom: -2px;
                }

                .value {
                    color: #627797;
                }
            }

            .imgs {
                margin-top: 5px;

                img {
                    border-radius: 40px;
                    height: 25px;
                }

                &:first-child {
                    img {
                        margin-right: -10px;
                    }
                }
            }
        }

        .qbtn-custom {
            border-radius: 30px;
            height: 34px;
            background: #EFF5F9 !important;

            /deep/ .q-btn__wrapper {
                min-height: unset;
                padding: 0px 10px;

                .q-btn__content {
                    text-transform: initial;
                    font-size: 14px;
                    color: #627797;
                }
            }
        }
    }

    &.yearn-finance {
        img {
            width: 30px;
            margin-right: 30px;
        }

        strong {
            position: relative;
            margin-top: -13px;

            b {
                position: absolute;
                right: 0px;
                bottom: -5px;
                font-size: 12px;
                font-weight: $regular;
                line-height: 20px;
            }
        }

        h4 {
            margin-bottom: 0px;
        }

        .qbtn-download {
            border-radius: 30px;
            height: 34px;
            background: #EFF5F9 !important;
            padding-left: 10px;
            padding-right: 10px;

            /deep/ .q-btn__wrapper {
                min-height: unset;
                padding: 0px 10px;

                .q-btn__content {
                    text-transform: initial;
                    font-size: 14px;
                    color: #627797;
                }
            }
        }
    }

    .qbtn-custom {
        border-radius: 30px;
        height: 34px;
        background: #EFF5F9 !important;

        /deep/ .q-btn__wrapper {
            min-height: unset;
            padding: 0px 0px;

            .q-btn__content {
                text-transform: initial;
                font-size: 12px;
                color: #627797;
            }

            /deep/ .transaction-section {
                box-shadow: none;

                .history-icon {
                    display: none;
                }
            }
        }
    }

    &.wallet-snapshot {
        padding-bottom: 8px;
        padding-top: 8px;

        h3 {
            font-size: 16px;
            font-weight: $bold;
            position: relative;
            line-height: 40px;
            font-family: $Titillium;
            margin-top: 0px;
            margin-bottom: 0px;
        }

        .amount {
            font-size: 16px;
            font-weight: $bold;
            position: relative;
            line-height: 40px;
            font-family: $Titillium;

            .interest_rate {
                font-size: 16px;
                font-weight: $regular;
                position: relative;
                margin-top: -15px;

                .thicker {
                    position: relative;
                    top: 7px;
                    margin-right: 10px;
                }

                .p-abs {
                    position: absolute;
                    bottom: -17px;
                    right: 17px;
                    font-size: 12px;
                    font-weight: $regular;
                    opacity: .7;
                }

                img {
                    width: 30px;
                    margin-right: 6px;
                    position: relative;
                    top: 7px;
                }
            }
        }
    }

    h4 {
        font-size: 16px;
        font-weight: $bold;
        position: relative;
        line-height: 40px;
        font-family: $Titillium;
        margin-top: 0px;
        margin-bottom: 20px;
    }
}

.col-title {
    h4 {
        font-size: 22px;
        font-weight: $bold;
        position: relative;
        line-height: 50px;
        font-family: $Titillium;
        margin-top: 0px;
        margin-bottom: 10px;
    }
}

.standard-content {
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh !important;
    padding-bottom: 100px;

    @media screen and (min-width: 768px) {
        padding: 2%;
        flex-direction: column;
        justify-content: flex-start;
        min-height: unset !important;
        padding-bottom: 20px;
    }

    &--title {
        font-size: 35px;
        font-weight: $bold;
        position: relative;
        line-height: 50px;
        font-family: $Titillium;
        margin-top: 0px;
        margin-bottom: 0px;

        @media screen and (min-width: 768px) {
            margin-top: -20px;
            font-size: 25px;
        }

        .btn-align-left {
            position: absolute;
            left: -15px;
            top: 10px;
        }
    }

    &--desc {
        margin-top: -20px;
        margin-bottom: 40px;
        font-size: 18px;
        font-weight: $regular;
        position: relative;
        line-height: 26px;
        font-family: $Titillium;
        color: $mainColor;
    }

    &--body {
        &__img {
            min-height: 250px;

            img {
                max-width: 90%;
            }
        }

        .total-fee {
            padding: 0px 20px;
            font-family: $Titillium;
            font-weight: $regular;
            color: #B0B0B0;
            font-size: 16px;
        }

        &__form {
            .tokenID {
                text-transform: uppercase;
                font-size: 20px;
                font-weight: 900;
                color: #7271fa;
                padding-top: 0px;
                margin-top: -5px;
            }

            /deep/ .q-field__native {
                padding-left: 8px;
                font-size: 16px;
                font-weight: $regular;
            }

            /deep/ .q-field__label {
                font-family: $Titillium;
                font-weight: $regular;
                font-size: 18px;
                padding-left: 10px;
                margin-top: -2px;
            }

            .input-input {
                height: 50px;
                margin-bottom: 0px;
                padding-bottom: 0px;

                /deep/ .q-field__control {
                    height: 50px;
                    min-height: unset;
                }

                .btn-copy {
                    // height: 30px;
                    position: relative;
                    top: -3px;
                    margin-right: 0px;
                    padding: 6px 13px;
                }

                .qr-btn {
                    width: 30px;
                    height: 30px;
                    padding-right: 8px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    img {
                        width: 25px;
                        height: 25px;
                        position: relative;
                        right: -5px;
                        transform: scale3d(1, 1, 1);
                    }
                }
            }

            .lab-input {
                font-family: $Titillium;
                font-weight: $regular;
                font-size: 16px;
                color: black;
                padding-left: 20px;
                padding-bottom: 0px;
                margin-top: 20px;
                display: block;
            }

            /deep/ .option--avatar {
                border: 1px solid;
                width: 35px;
                height: 35px;
                max-width: 40px;
                padding: 0px;
                min-width: unset;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border-radius: 50px;
                overflow: hidden;
                margin-left: -10px;
                padding-right: 0px;
            }
        }
    }

    &--footer {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: flex-end;
        min-height: fit-content;

        .action-link {
            height: 50px;
            text-transform: initial !important;
            font-size: 16px;
            letter-spacing: .5px;
            border-radius: 40px;
            width: 150px;
            margin-left: 10px;
            background-color: #7272FA !important;
            // &.next{
            //   background-color: #7900FF !important;
            // }
            // &.back{
            //   background-color: #B0B0B0 !important;
            // }
        }

    }
}

.select-input {
    border-radius: 100px !important;
    $height: 50px;
    height: $height;
    margin-top: -10px;

    // .ellipsis{
    //     /deep/ .q-field__native {
    //         max-width: 100px;
    //     }
    // }
    // .mw200{
    //     /deep/ .q-field__native {
    //         max-width: 100px;
    //     }
    // }
    /deep/ .q-field__marginal {
        height: $height;
        min-height: unset;
    }

    /deep/ .q-field__control {
        height: $height;
        min-height: unset;
        background-color: #fff !important;

        .q-field__native {
            padding-left: 0px;
            padding-top: 0px;
            padding-bottom: 0px;
            height: $height;
            min-height: unset;

            .q-item {
                padding: 0px;
                padding-left: 10px;
                min-height: $height;
                padding-bottom: 0px;

                .q-item__section {
                    padding-right: 0px;
                    min-width: 36px;

                    .q-item__label+.q-item__label {
                        margin-top: 0px;
                    }
                }
            }
        }
    }
}

.send-modal {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(black, .5);
    left: 0px;
    top: 0px;
    z-index: 999999;
    visibility: hidden;
    opacity: 0;
    transition: opacity ease .4s;

    &.open {
        visibility: visible;
        opacity: 1;

        .send-modal__content {
            transform: scale(1);
        }
    }

    &__content {
        background-color: #fff;
        border-radius: 20px;
        max-width: 400px;
        padding: 20px;
        width: 100%;
        box-shadow: 0px -2px 9px 0px rgba(black, .29);
        position: relative;
        transform: scale(0);
        transition: ease transform .3s, opacity ease .2s;

        &--head {
            margin-bottom: 20px;

            .close-btn {
                position: absolute;
                right: 10px;
                top: 10px;
                font-size: 40px;
                font-weight: $light;
                font-family: $Titillium;
                height: 40px;
                width: 40px;
                min-height: unset;
                opacity: .3;

                /deep/ .q-btn__content {
                    transform: rotate(45deg);
                    min-height: unset;
                    line-height: 30px;
                    margin-left: 5px;
                    margin-top: -4px;
                }
            }

            .--amount {
                font-size: 25px;
                font-weight: $bold;
                font-family: $Titillium;
                margin-top: 20px;
                position: relative;
                top: -9px;
            }
        }

        &--body {
            position: relative;

            .svg_logo {
                fill: #00D0CA;
                position: absolute;
                margin-top: 5px;
                width: 50px;
            }

            .--label {
                font-size: 14px;
                font-weight: $light;
                font-family: $Titillium;
                position: absolute;
                bottom: -15px;
                width: 150%;
                text-align: center;
                letter-spacing: 1.5px;
            }
        }

        &--footer {
            .--email {
                font-size: 16px;
                font-weight: $bold;
                font-family: $Titillium;
                margin-top: 20px;
            }

            .--error {
                color: red;
                font-size: 14px;
                margin-top: 20px;
                font-weight: $bold;
                font-family: $Titillium;
                line-height: 16px;
            }
        }
    }
}

.q-card {
    border-radius: 25px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 35px rgba(0, 0, 0, 0.14), 0 1px 10px rgba(0, 0, 0, 0.12);
}

.max200 {
    max-width: 200px;
}

.mt-5 {
    margin-top: -5px;
}

.mr10 {
    margin-right: 10px;
}

/deep/ .q-btn__wrapper {
    min-height: 30px !important;
}
/deep/ .swap_vert .q-btn__wrapper {
    min-height: 40px !important;
}

.text-h5 {
    font-size: 16px;
}
.accountOption{}
.tabs-chains{
  .q-list:not(.q-list--separator){
    .q-item.q-item-type{
      border: 1px solid rgba(#CCC, .3);
      border-radius: 50px;
      height: 50px;
      &.bg-white{
        border: 1px solid rgba(purple, .4);
      }
    }
  }
}

.accountOption{
  min-height: 345px;
}
.accountOptionOneinch{
  min-height: 680px !important;
}
.minHeight{
  min-height: 680px !important;
  /deep/ .desktop-size{
    min-height: 680px !important;
  }
}
.minHeight2{
  min-height: 680px !important;
}
.minHeight3{
  min-height: 580px !important;
}
.q-card{
  .chose_accounts{
    background-color: #FFF !important;
    font-size: 16px !important;
    font-family: $Franklin !important;
    color: #04111F !important;
    border-radius: 40px;
    margin-top: 0px;
    height: 54px;
    width: fit-content !important;
  }
}
/deep/ .q-card{
  &.accountOptionCard {
      border: none !important;
      background: transparent !important;
  }
}
/deep/ .q-card.q-card--dark.q-dark{
  background: #04111F !important;
  border: 1px solid #627797 !important;
  &.accountOptionCard {
      border: none !important;
      background: transparent !important;
  }
  /deep/ .select-input .q-field__control {
    background-color: transparent !important;
    .q-field__native .q-item .q-item__section .q-item__label + .q-item__label{
      color: #CCC;
    }
  }
}
</style>
<style>
.q-item--dark .q-item__label{ color: #FFF; }
.defiPage .bg-white{
  height: 100%;
}
.q-pa-zero{
  padding-left: 0px !important;
  padding-right: 0px !important;
}
.q-pa-zero .q-field--standard .q-field__control:before{border-color: transparent !important}
.q-pa-zero .q-field--standard .q-field__control{padding-right: 15px;}
.q-card.q-card--dark.q-dark{background: #04111F !important;border: 1px solid #627797 !important;}
.q-card.q-card--dark.q-dark.accountOptionCard{border: none !important;background: transparent !important;}
.q-card.q-card--dark.q-dark .select-input .q-field__control {background-color: transparent !important;}
.q-card.q-card--dark.q-dark .select-input .q-field__control .q-field__native .q-item .q-item__section .q-item__label + .q-item__label{color: #CCC;}
</style>

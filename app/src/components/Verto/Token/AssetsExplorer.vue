<template>
  <div :class="{'q-pt-lg': !allAssets, 'dark-theme': $store.state.settings.lightMode === 'true'}" class="wrapper q-px-lg full-width">
    <div class="top-part-all"  v-if="false">>
      <div class="text-h6">Invest</div>
      <div class="top-4part">
        <a href="#">
          <div class="top-part top-part1">
            <h4>Top Gainers</h4>
          </div>
        </a>

        <a href="#">
          <div class="top-part top-part2">
            <h4>Top Losers</h4>
          </div> </a
        ><a href="#">
          <div class="top-part top-part3">
            <h4>Market</h4>
          </div>
        </a>
        <a href="#">
          <div class="top-part top-part4">
            <h4>Pools</h4>
          </div>
        </a>
      </div>
    </div>
    <q-scroll-area :visible="true" :class="{'desktop-size': screenSize > 1024, 'mobile-size': screenSize < 1024}">
      <div v-show="!allAssets">
        <div class="sub-top row gt-sm">
          <div class="subt-text col-md-7 col-12" >
            <p class="q-ma-none text-bold text-body1"><q-icon name="img:statics/icons/favicon-96x96.png" style="font-size: 24px" class="q-mr-sm"/>Trade & Earn VTX  </p>
          </div>
          <div class="see-text col col-12 " >
          <q-input :dark="$store.state.settings.lightMode === 'true'" dense filled v-model="tokenSearchVal" style="width:280px" class="float-right q-mr-md" icon-right="search" label="Search token by symbol"  >
            <template v-slot:append>
              <q-icon v-if="tokenSearchVal !== ''" name="close" @click="tokenSearchVal = ''" class="cursor-pointer" />
              <q-icon name="search" />
            </template>
          </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-md q-pr-lg" v-show="!tokenSearchVal.length">
          <div class="col-md-6 col-12">
            <ExchangeSection data-title="Any to any" data-intro="Crosschain transactions: Exchange Any to Any is easier than ever" />
          </div>
          <div class="col-md-6  col-12">
          <makeVTXSection data-title="Earn with VTX" data-intro="Start staking VTX now and enjoy the benefits"   />
          </div>
          <PriceChart
              :dataType="'price'"
              class="col-md-12"
              v-if="chartData && false"
              :data="chartData"
            />
        </div>
      </div>
      <div class="q-pt-md" v-show="filterTokens(item).length || tokenSearchVal.length" v-for="(item, index) in assetsOptions.filter(o =>  !allAssets || o.title == allAssets.title)" :key="index+uniqueKey">
        <div class="sub-top sub-top-chart">
          <div class="subt-text " v-if="!allAssets" >
            <p class="q-ma-none text-bold text-body1">{{item.title}} <span class="text-body2 gt-sm">| {{item.subtitle}}</span></p>
          </div>
          <div class="subt-text" v-else>
            <p>
              <q-breadcrumbs class="col-12  breadcrumbs"  v-if="allAssets">
                <q-breadcrumbs-el  class="cursor-pointer" :class="{'text-white':$store.state.settings.lightMode === 'true'}" @click="allAssets = null" label="Back"  icon="keyboard_backspace" />
                <q-breadcrumbs-el  class="cursor-pointer"  :label="'Showing '+filterTokens(item).length+ ' ' + item.title"  />
              </q-breadcrumbs>
            </p>
          </div>

          <div v-if="!allAssets" class="see-text q-mr-lg cursor-pointer" @click="allAssets = item">
          See all (<span class="text-deep-purple-12">{{filterTokens(item).length}}</span>) <q-icon name="arrow_forward_ios" />
          </div>

          <div  class="see-text col flex  justify-end" v-else>
            <span v-if="item.id == 'assets'" class="flex flex-center">
            <span class="text-body2 q-pr-sm ">List view</span>
            <q-icon name="table_rows" @click="listViewMode = 'list'" size="1.2rem" :color="listViewMode == 'list' ? 'deep-purple-3': 'grey'" class="q-pr-xs " />
            <q-icon name="dashboard_customize"  @click="listViewMode = 'card'" size="1.2rem" :color="listViewMode == 'card' ? 'deep-purple-3': 'grey'" class="q-pr-sm"  />
            </span>
            <q-input :dark="$store.state.settings.lightMode === 'true'" dense filled v-model="tokenSearchVal" style="width:280px" class="float-right q-mr-md" icon-right="search" label="Search token by symbol"  >
              <template v-slot:append>
                <q-icon v-if="tokenSearchVal !== ''" name="close" @click="tokenSearchVal = ''" class="cursor-pointer" />
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

        </div>
        <div class="row q-col-gutter-md" :class="{'q-pr-lg': $q.screen.width > 500}">

          <div class=" col-md-3 " v-show="!allAssets || item.id == 'investments' || listViewMode == 'card' " @click="showTokenPage(asset)" v-for="(asset, i) in filterTokens(item).slice(0,(!allAssets ? ($q.screen.height > 1100 ? 8 : 4) : allAssets.length))" :key="i">
            <div class="main cursor-pointer">
              <div class="main-top">
                <div class="mt-img">
                  <img :src="asset.icon"  />
                </div>
                <div>
                  <h6>
                    {{asset.type.toUpperCase()}}<svg v-if="false" class="q-ml-md" viewBox="0 0 32 32" fill="none" style="width: 20px; height: 20px; vertical-align: middle; margin-left: 0px;"><path d="M15.705 4.215a.5.5 0 01.59 0l2.725 1.988a.5.5 0 00.296.096l3.373-.007a.5.5 0 01.477.347l1.036 3.21a.5.5 0 00.182.251l2.733 1.978a.5.5 0 01.182.56l-1.048 3.207a.5.5 0 000 .31l1.048 3.206a.5.5 0 01-.182.561L24.384 21.9a.5.5 0 00-.182.251l-1.037 3.21a.5.5 0 01-.476.346l-3.373-.006a.5.5 0 00-.296.096l-2.725 1.988a.5.5 0 01-.59 0l-2.725-1.988a.5.5 0 00-.296-.096l-3.373.006a.5.5 0 01-.476-.346l-1.037-3.21a.5.5 0 00-.182-.251l-2.733-1.978a.5.5 0 01-.182-.56l1.048-3.207a.5.5 0 000-.31l-1.048-3.207a.5.5 0 01.182-.56L7.616 10.1a.5.5 0 00.182-.251l1.037-3.21a.5.5 0 01.476-.347l3.373.007a.5.5 0 00.296-.096l2.725-1.988z" fill="url(#verified_svg__paint0_linear)"></path><path opacity="0.5" d="M16 4.619l2.725 1.988a1 1 0 00.591.192l3.374-.007 1.036 3.21a1 1 0 00.365.503l2.733 1.978-1.048 3.206a.999.999 0 000 .622l1.048 3.206-2.733 1.977a1 1 0 00-.365.503l-1.036 3.21-3.374-.006a1 1 0 00-.59.192L16 27.381l-2.725-1.988a1 1 0 00-.591-.192l-3.374.006-1.036-3.21a1 1 0 00-.365-.503l-2.733-1.977 1.048-3.206a1 1 0 000-.622l-1.048-3.206 2.733-1.978-.293-.405.293.405a1 1 0 00.365-.502l1.036-3.21 3.374.006a1 1 0 00.59-.192L16 4.619z" stroke="url(#verified_svg__paint1_linear)"></path><g filter="url(#verified_svg__filter0_d)"><path d="M21.506 11.464a.677.677 0 00-.948.001l-6.745 6.636-2.378-2.334a.675.675 0 00-.946.963L13.813 20l7.695-7.57a.677.677 0 00-.002-.966z" fill="#fff"></path><path d="M21.506 11.464a.677.677 0 00-.948.001l-6.745 6.636-2.378-2.334a.675.675 0 00-.946.963L13.813 20l7.695-7.57a.677.677 0 00-.002-.966z" stroke="#fff" stroke-width="0.5"></path></g><defs><linearGradient id="verified_svg__paint0_linear" x1="6.4" y1="5.2" x2="25.6" y2="26.2" gradientUnits="userSpaceOnUse"><stop stop-color="#376DF3"></stop><stop offset="1" stop-color="#1E56E0"></stop></linearGradient><linearGradient id="verified_svg__paint1_linear" x1="7" y1="4" x2="24.4" y2="26.8" gradientUnits="userSpaceOnUse"><stop stop-color="#2D61E1"></stop><stop offset="1" stop-color="#1549CA"></stop></linearGradient><filter id="verified_svg__filter0_d" x="8.037" y="10.021" width="15.922" height="13.33" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="1"></feOffset><feGaussianBlur stdDeviation="1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter></defs></svg>
                  </h6>
                </div>
              </div>
              <h2 class="q-my-none">
                ${{formatNumber(asset.usd,0)}}
                <span v-if="parseInt(asset.usd).toString().length <= 5" class="g-txt">.{{formatNumber(asset.usd,2).split('.')[1]}}</span>
                <span v-if="asset.change24hPercentage" :class="'sr-txt absolute-top-right ' + asset.color">{{asset.color === 'text-green-6'? '↑':'↓'}} {{asset.change24hPercentage.substring(1)}}</span>
                <a href="javascript:void(0)">Trade</a>
              </h2>
              <q-item-label :class="{ 'text-white': $store.state.settings.lightMode === 'true'}" class="q-pt-sm" caption>Amount: <span class="text-grey q-pl-xs">{{formatNumber(asset.amount,4)}}</span></q-item-label>
              <div class="q-pt-sm">Price: <span class="text-grey q-pl-xs">${{formatNumber(asset.rateUsd,4)}}</span></div>
              <div class="q-py-sm" v-if="asset.protocol"><q-icon class="q-pr-sm" size="1.2rem" :name="'img:'+asset.protocolIcon" />{{asset.protocol}}:</div>
              <span class="text-grey" v-if="asset.poolsCount == 1">{{asset.poolName}} pool</span>
              <span class="text-grey" v-else-if="asset.poolsCount">{{asset.poolsCount}} pools</span>
            </div>

          </div>
        <AssetBalancesTable @setAsset="showTokenPage" data-title="Asset balances" data-intro="Here you can see the asset balances" :rowsPerPage="8"  v-if="allAssets && listViewMode == 'list'" class="full-width" :tableData="filterTokens(allAssets)" />
    </div>
</div>
 <liquidityPoolsTable v-if="!allAssets" :key="4 + uniqueKey" data-title="Liquidity pools" class="q-pt-md" data-intro="Here you can click the ADD button to add liquidity to any pools" :chain="currentChain" :rowsPerPage="10"  />
   </q-scroll-area>
    <div class="small-grid" v-if="false">
      <div class="main">
        <div class="main-top">
          <div class="mt-img">
            <img src="img/1.png" alt="img" />
          </div>

          <div>
            <h6>
              Cryptocurrency Top 10 Tokens piee Index<img
                src="img/check.png"
                alt="image"
              />
            </h6>
          </div>
        </div>

        <p>Price</p>
        <h2>
          $79 <span class="g-txt">.93</span> <span class="sr-txt">↓ 1.3%</span>
          <a href="#">Trade</a>
        </h2>
      </div>

      <div class="main">
        <div class="main-top">
          <div class="mt-img">
            <img src="img/10.png" alt="img" />
          </div>

          <div>
            <h6>Top 10 Index<img src="img/check.png" alt="image" /></h6>
          </div>
        </div>

        <p>Price</p>
        <h2>
          $79 <span class="g-txt">.93</span> <span class="sr-txt">↓ 1.3%</span>
          <a href="#">Trade</a>
        </h2>
      </div>

      <div class="main">
        <div class="main-top">
          <div class="mt-img">
            <img src="img/9.png" alt="img" />
          </div>

          <div>
            <h6>Cryptocurrency Index<img src="img/check.png" alt="image" /></h6>
          </div>
        </div>

        <p>Price</p>
        <h2>
          $99 <span class="g-txt">.93</span> <span class="sg-txt">↑ 1.3%</span>
          <a href="#">Trade</a>
        </h2>
      </div>
    </div>
    <div class="sub-top" v-if="false">
      <div class="subt-text">
        <h3>All Tags</h3>
      </div>
    </div>
    <div class="tags-wrap" v-if="false" >
      <a href="#"><span>#</span>1inch</a>
      <a href="#"><span>#</span>Aave</a>
      <a href="#"><span>#</span>Balancer</a>
      <a href="#"><span>#</span>Bancor</a>
      <a href="#"><span>#</span>Bitcoin</a>
      <a href="#"><span>#</span>Compound</a>
      <a href="#"><span>#</span>Curve</a>
      <a href="#"><span>#</span>DODO</a>
      <a href="#"><span>#</span>Bancor</a>
      <a href="#"><span>#</span>Bitcoin</a>
      <a href="#"><span>#</span>Compound</a>
      <a href="#"><span>#</span>Curve</a>
      <a href="#"><span>#</span>DODO</a>

      <a href="#"><span>#</span>1inch</a>
      <a href="#"><span>#</span>Aave</a>
      <a href="#"><span>#</span>Balancer</a>
      <a href="#"><span>#</span>Bancor</a>
      <a href="#"><span>#</span>Bitcoin</a>
      <a href="#"><span>#</span>Compound</a>
      <a href="#"><span>#</span>Curve</a>
      <a href="#"><span>#</span>DODO</a>
      <a href="#"><span>#</span>Bancor</a>
      <a href="#"><span>#</span>Bitcoin</a>
      <a href="#"><span>#</span>Compound</a>
      <a href="#"><span>#</span>Curve</a>
      <a href="#"><span>#</span>DODO</a>

      <a href="#"><span>#</span>1inch</a>
      <a href="#"><span>#</span>Aave</a>
      <a href="#"><span>#</span>Balancer</a>
      <a href="#"><span>#</span>Bancor</a>
      <a href="#"><span>#</span>Bitcoin</a>
      <a href="#"><span>#</span>Compound</a>
      <a href="#"><span>#</span>Curve</a>
      <a href="#"><span>#</span>DODO</a>
      <a href="#"><span>#</span>Bancor</a>
      <a href="#"><span>#</span>Bitcoin</a>
      <a href="#"><span>#</span>Compound</a>
      <a href="#"><span>#</span>Curve</a>
      <a href="#"><span>#</span>DODO</a>

      <a href="#"><span>#</span>1inch</a>
      <a href="#"><span>#</span>Aave</a>
      <a href="#"><span>#</span>Balancer</a>
      <a href="#"><span>#</span>Bancor</a>
      <a href="#"><span>#</span>Bitcoin</a>
      <a href="#"><span>#</span>Compound</a>
      <a href="#"><span>#</span>Curve</a>
      <a href="#"><span>#</span>DODO</a>
      <a href="#"><span>#</span>Bancor</a>
      <a href="#"><span>#</span>Bitcoin</a>
      <a href="#"><span>#</span>Compound</a>
      <a href="#"><span>#</span>Curve</a>
      <a href="#"><span>#</span>DODO</a>
    </div>
  </div>
</template>

<script>
import {
  QScrollArea
} from 'quasar'
import Formatter from '@/mixins/Formatter'
import MakeVTXSection from '@/components/Verto/MakeVTXSection2'
import ExchangeSection from '@/components/Verto/ExchangeSection3'
import liquidityPoolsTable from '@/components/Verto/Defi/LiquidityPoolsTable'
import PriceChart from '@/components/Verto/Token/PriceChart'
import AssetBalancesTable from '@/components/Verto/AssetBalancesTable'
export default {
  components: {
    QScrollArea,
    ExchangeSection,
    AssetBalancesTable,
    MakeVTXSection,
    liquidityPoolsTable,
    PriceChart
  },
  props: ['rowsPerPage'],
  data () {
    return {
      chartData: false,
      listViewMode: 'card',
      uniqueKey: 1235878,
      allAssets: null,
      currentChain: false,
      platformOptions: [{
        label: 'Uniswap V2',
        value: 'Uniswap V2',
        icon: 'UNI-icon.svg'

      }, {
        label: 'Balancer',
        value: 'Balancer-labs',
        icon: 'BAL-icon.svg'
      }, {
        label: 'yEarn',
        value: 'yEarn',
        icon: 'YFI-icon.svg'
      }, {
        label: 'Curve',
        value: 'Curve',
        icon: 'Curve-icon.svg'
      }],
      assetsOptions: [
        {
          title: 'Active assets',
          id: 'assets',
          subtitle: 'Send, swap & invest',
          data: []
        },
        {
          title: 'Invested assets',
          id: 'investments',
          subtitle: 'Tokens invested in liquidity pools',
          data: {
            eth: [],
            eos: []
          }
        },
        {
          title: 'Ntfs',
          subtitle: 'Non-fungible tokens you own',
          data: []
        },
        {
          title: 'Opportunities',
          subtitle: 'Investment opportunities',
          data: []
        }
      ],
      initialPagination: {
        rowsPerPage: this.rowsPerPage
      },
      loaded: true,
      assets: [],
      tokenSearchVal: '',
      poolsData: [],
      screenSize: 0,
      filter: '',
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Asset',
          align: 'left',
          field: row => row,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'currentPrice',
          align: 'left',
          label: 'Price',
          field: 'currentPrice',
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'dailyChange',
          align: 'left',
          label: 'Daily Change',
          field: 'dailyChange',
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'amount',
          align: 'left',
          label: 'Balance',
          field: 'amount',
          sortable: true,
          format: val => `${this.formatNumber(val, 2)}`
        },
        {
          name: 'usd',
          align: 'left',
          label: 'USD Equivalent',
          field: 'usd',
          format: val => `${this.formatNumber(val, 2)}`,
          sortable: true
        },
        {
          name: 'average_cost',
          align: 'left',
          label: 'Average Cost',
          field: 'average_cost',
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'action',
          label: '',
          sortable: false
        }
      ],
      openDialog: false
    }
  },
  created () {
    this.getWindowWidth()

    this.initTable()

    this.$store.state.wallets.tokens.filter(o => o.chain === 'eth' && o.type === 'eth').forEach(w => {
      this.getInvestments(w)
    })

    let eosWallets = this.$store.state.wallets.tokens.filter(o => o.chain === 'eos' && o.type === 'eos').map(o => o.name)

    this.$store.state.investment.allEosWalletsInvestments = []
    this.$store.dispatch('investment/getAllEOSInvestments', eosWallets)

    this.$bus.$on('selectedChain', () => {
      let chain = localStorage.getItem('selectedChain')
      if (chain !== 'vtx') {
        this.currentChain = chain
        this.uniqueKey++
        this.initTable(chain)
      } else {
        this.setVtxData()
      }
    })
    this.getVTXHistoriclPrice()
  },
  watch: {
    '$store.state.wallets.tokens': function () {
      this.initTable()
    },
    '$store.state.investment.investments': function (investments) {
      this.getInvestedTokens(investments)
    },
    '$store.state.investment.allEosWalletsInvestments': function (investments) {
      this.getInvestedEosTokens(investments)
    },
    '$store.state.tokens.walletTokensData': function (val) {
      this.initTable()
      this.getInvestedEosTokens(this.$store.state.investment.allEosWalletsInvestments)
      this.uniqueKey++
    },
    '$store.state.currentwallet.wallet': function (val) {
      this.initTable()
    }
  },
  computed: {
    allInvestments () {
      return Object.keys(this.assetsOptions[1].data).reduce((all, chain) => this.assetsOptions[1].data[chain] && this.assetsOptions[1].data[chain].length ? all.concat(this.assetsOptions[1].data[chain].filter(o => this.$store.state.currentwallet.wallet.chain ? (chain === 'eos' && o.owner === this.$store.state.currentwallet.wallet.name) || (chain === 'eth' && o.owner === this.$store.state.currentwallet.wallet.name) : true)) : [], [])
    }
  },
  methods: {
    showTokenPage (asset) {
      this.$emit('setAsset', asset)
    },
    setVtxData () {
      let chain = localStorage.getItem('selectedChain')
      if (chain && chain === 'vtx') {
        let asset = this.assets.find(o => o.type === 'vtx')

        if (!asset) {
          asset = {
            type: 'vtx',
            chain: 'eos',
            icon: 'statics/icons/favicon-32x32.png'
          }
        }
        this.tabPoolAndAssetBalances = 'explore'

        this.$emit('setAsset', asset)
      }
    },
    getInvestedEosTokens (investments) {
      let assets = []
      const setValue = (t, index) => {
        let tkData = this.$store.state.tokens.walletTokensData.find(a => a.symbol.toLowerCase() === t['symbol' + index].toLowerCase())

        return {
          usd: tkData ? tkData.current_price * t['count' + index] : '',
          rateUsd: tkData ? tkData.current_price : '',
          type: t['symbol' + index].toLowerCase(),
          chain: 'eos',
          poolsCount: 1,
          poolName: t.symbol0 + ' / ' + t.symbol1,
          amount: t['count' + index],
          icon: 'https://ndi.340wan.com/eos/' + t['contract' + index] + '-' + t['symbol' + index].toLowerCase() + '.png',
          protocol: 'Defibox',
          protocolIcon: 'https://ndi.340wan.com/eos/token.defi-box.png'
        }
      }
      investments.forEach(item => {
        let indexes = [0, 1]
        indexes.forEach(i => {
          let index = assets.findIndex(t => t.type === item['symbol' + i].toLowerCase())
          if (index > -1) {
            assets[index].poolsCount += 1
            assets[index].amount += item['count' + i]
            return
          }
          assets.push(setValue(item, i))
        })
      })
      this.$store.dispatch('tokens/getTokensMarketsData', assets)
      this.assetsOptions[1].data.eos = assets
    },
    async getVTXHistoriclPrice (days = 30) {
      let response = await this.$axios.get(
        'https://api.coingecko.com/api/v3/coins/volentix-vtx/market_chart?vs_currency=usd&days=' +
            days
      )
      this.chartData = response.data
    },
    getInvestedTokens (investments) {
      let assets = []
      console.log(investments, 'investments eth')
      investments.forEach(t => {
        t.tokens.forEach(a => {
          let protocolData = this.platformOptions.find(o => o.label.toLowerCase() === t.protocolDisplay.toLowerCase())

          let index = assets.findIndex(t => t.type === a.symbol.toLowerCase())
          if (index > -1) {
            assets[index].poolsCount += 1
            assets[index].usd += a.balanceUSD
            assets[index].amount += a.balance
            return
          }

          let data = {
            usd: a.balanceUSD,
            rateUsd: a.price,
            type: a.symbol.toLowerCase(),
            chain: 'eth',
            poolName: t.label,
            poolsCount: 1,
            amount: a.balance,
            icon: 'https://zapper.fi/images/' + a.symbol + '-icon.png',
            protocol: protocolData ? protocolData.label : null,
            protocolIcon: protocolData ? 'https://zapper.fi/images/' + protocolData.icon : null
          }
          assets.push(data)
        })
      })

      this.assetsOptions[1].data.eth = assets
    },
    getInvestments (wallet) {
      const self = this
      let investment = {
        eos () {
        },
        eth () {
          self.$store.state.investment.investments = []

          let account = {
            value: wallet.key
          }
          account.platform = 'uniswap-v2'
          self.$store.dispatch('investment/getInvestments', account)
          account.platform = 'uniswap'
          self.$store.dispatch('investment/getInvestments', account)
          account.platform = 'balancer'
          self.$store.dispatch('investment/getInvestments', account)
          account.platform = 'curve'
          self.$store.dispatch('investment/getInvestments', account)
          account.platform = 'yearn'
          self.$store.dispatch('investment/getInvestments', account)
        }
      }
      investment[wallet.chain]()
    },
    onRowClick (evt, row) {
      this.$emit('setAsset', row)
    },
    getIncomingTransaction (ethAddress) {
      let request = {
        jsonrpc: '2.0',
        id: 0,
        method: 'alchemy_getAssetTransfers',
        params: [
          {
            fromBlock: '0xff',
            toBlock: 'latest',
            fromAddress: '',
            toAddress: ethAddress,
            excludeZeroValue: true
          }
        ]
      }
      this.$axios.post('https://eth-mainnet.alchemyapi.io/v2/Le_8-Zg9gV0p_gRbw3kpCJj94eH6Fjg_', request)
        .then((res) => {
          console.log(res)
        })
    },
    filterTokens (item) {
      let tokens = item.id === 'investments' ? this.allInvestments.filter(o => !this.currentChain || o.chain === this.currentChain) : item.data
      if (this.tokenSearchVal.trim().length) {
        tokens = tokens.filter(o => o.type.toLowerCase().includes(this.tokenSearchVal.toLowerCase()))
      }
      return tokens
    },
    initTable (chain) {
      let account = null

      if (this.$store.state.currentwallet.wallet && this.$store.state.currentwallet.wallet.name) {
        account = this.$store.state.currentwallet.wallet
      }
      this.assets = []

      JSON.parse(JSON.stringify(this.$store.state.wallets.tokens.filter(o => (!account && !chain) || (chain && o.chain === chain) || (account && o.chain === account.chain && o.name === account.name)))).forEach((token, i) => {
        token.amount = parseFloat(token.amount)
        token.usd = parseFloat(token.usd)

        if (!isNaN(token.amount) && token.amount !== 0) {
          if (this.assets.find(o => o.type === token.type && o.chain === token.chain && (token.chain !== 'eos' || o.contract === token.contract))) {
            let index = this.assets.findIndex(o => o.type === token.type)

            this.assets[index].amount += token.amount
            this.assets[index].usd += isNaN(token.usd) ? 0 : token.usd
            this.assets[index].rateUsd = isNaN(token.tokenPrice) ? 0 : token.tokenPrice
            this.assets[index].percentage = this.assets[index].usd / parseFloat(this.$store.state.wallets.portfolioTotal) * 100
            this.assets[index] = this.getHistoricalValue(this.assets[index])
          } else {
            token.percentage = token.usd / parseFloat(this.$store.state.wallets.portfolioTotal) * 100
            token.index = this.assets.length
            token.rateUsd = isNaN(token.tokenPrice) ? 0 : token.tokenPrice
            token.friendlyType = token.type.length > 6 ? token.type.substring(0, 6) + '...' : token.type
            token = this.getHistoricalValue(token)
            this.assets.push(token)
          }
          this.assets.sort((a, b) => (isNaN(parseFloat(b.usd)) ? 0 : parseFloat(b.usd)) - (isNaN(parseFloat(a.usd)) ? 0 : parseFloat(a.usd)))
        }

        this.loaded = false
      })

      this.assetsOptions[0].data = this.assets
    },
    getHistoricalValue (token) {
      let tokenData = this.$store.state.tokens.walletTokensData.find(a => a.symbol === token.type)

      if (tokenData) {
        let change = tokenData.price_change_24h * token.amount
        token.change24h = (change > 0 ? '+' : '-') + '$' + this.formatNumber(Math.abs(change), 2)
        token.change24hValue = (change > 0 ? '' : '-') + this.formatNumber(Math.abs(change), 2)
        token.change24hPercentage = (change > 0 ? '+' : '-') + this.formatNumber(Math.abs(tokenData.price_change_percentage_24h), 2) + '%'
        token.color = change > 0 ? 'text-green-6' : 'text-pink-12'
      }
      return token
    },
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
      console.log('this.screenSize', this.screenSize)
    },
    filterTable (rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : ''
      return rows.filter(
        row => row.poolName.toLowerCase().includes(lowerTerms)
      )
    }
  },
  mixins: [Formatter]
}
</script>

<style lang="scss" scoped>
/deep/ .q-field--filled .q-field__control {
  padding: 0 12px;
  background: rgba(0,0,0,0.05);
  border-radius: 9px 9px 9px 9px;
}
.desktop-size{
  height: 100%;
}
.mobile-size{
  height: 818px;
}

.desktop-card-style{
  box-shadow: none !important;
  cursor: default;
  &:after{
    display: none !important;
  }
}
.desktop-card-style.current-investments .body-table-col .pairs{
  margin-bottom: -2px;
}
.desktop-card-style.current-investments .body-table-col{
  &._coin_type{
    width: 110px;
    position: relative;
    .thicker{
      position: absolute;
      left: 50px;
    }
  }
  &._rate_usd{
    width: 150px;
  }
  &._daily_change{
    width: 80px;
  }
}
.desktop-card-style.current-investments .body-table-col .pairs .pair {
    font-weight: 700;
    color: inherit;
    font-size: 14px;
}
.current_price{
  font-size: 12px;
  &.qmtxs{
    margin-top: 1px;
  }
}
.allocation{
  font-size: 12px;
}
.balance{
    font-size: 14px;
}
.desktop-card-style.current-investments .body-table-col .pairs .value {
    color: #627797;
}

.desktop-card-style.current-investments .body-table-col .imgs {
    margin-top: 5px;
    min-width: 20px;
    margin-right: -25px;
}

.desktop-card-style.current-investments .body-table-col .imgs img {
    border-radius: 40px;
    height: 25px;
}

.desktop-card-style.current-investments .body-table-col .imgs:first-child img {
    margin-right: -10px;
}

.desktop-card-style.current-investments .qbtn-custom {
    border-radius: 30px;
    height: 34px;
    text-transform: initial !important;
    background: transparent !important;
    color: #04111F !important;
    border: 1px solid #04111F;
}
.desktop-card-style.current-investments{
  /deep/ .q-table{
    th{
      font-size: 15px;
    }
  }
}
.desktop-card-style.current-investments .qbtn-custom .q-btn__wrapper {
    min-height: unset;
    padding: 0px 5px;
}

.desktop-card-style.current-investments .qbtn-custom .q-btn__wrapper .q-btn__content {
    text-transform: none;
    font-size: 10px;
}
.explore-opportunities{
  .qbtn-custom {
    border-radius: 30px;
    height: 34px;
    width: auto;
    font-size: 12px !important;
    text-transform: initial !important;
    &.qbtn-custom2 {
      width: auto;
      height: 30px;
      margin-bottom: 5px;
      margin-right: 0px;
      margin-top: 5px;
      /deep/ .q-btn__wrapper{
        min-height: unset;
      }
    }
  }
  &.q-table--dark{
    .qbtn-custom {
      border-radius: 30px;
      height: 34px;
      width: auto;
      font-size: 12px !important;
      color: #FFF !important;
      border: 1px solid #FFF !important;
      background: transparent !important;
      text-transform: initial !important;
      font-weight: normal;
      &.qbtn-custom2 {
        width: auto;
        height: 30px;
        margin-bottom: 5px;
        margin-right: 0px;
      }
    }
  }
}

.wrapper {
  background: #fff;
  // height: 86vh;
  border-radius: 12px;
  padding-right: 10px;
}
.wrapper{
  height: 88.5vh;
  padding-bottom: 10px;
  @media screen and (min-height: 700px) {
    height: 86vh;
  }
  @media screen and (min-height: 760px) {
    height: 83vh;
  }
  @media screen and (min-height: 800px) {
    height: 83vh;
  }
  @media screen and (min-height: 870px) {
    height: 82vh;
  }
}
.wrapper /deep/ .q-scrollarea.desktop-size{
    // height: 81.5vh !important;
    // padding-right: 10px;
    // @media screen and (min-height: 700px) {
    //   height: 70.5vh !important;
    // }
    // @media screen and (min-height: 760px) {
    //   height: 70.5vh !important;
    // }
    // @media screen and (min-height: 800px) {
    //   height: 69.2vh !important;
    // }
    // @media screen and (min-height: 870px) {
    //   height: 69vh !important;
    // }
}

.top-4part {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, auto));
  grid-gap: 20px;
}
.wrapper .top-part-all {
  width: 100%;
  background: #fff;

}

.top-part-all h2 {
  display: block;
  font-family: "Rubik", sans-serif;
  font-size: 40px;
  line-height: 48px;
  font-weight: 600;
  letter-spacing: -1px;
  color: #000;
  margin-top: 24px;
}

.wrapper .top-4part a {
  color: #fff;
}

.wrapper .top-part {
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  background-repeat: no-repeat;
  background-size: 80px 60px;
  background-position: bottom right;
}

.sub-top {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(min-content, max-content);

  grid-template-columns: repeat(auto-fit, minmax(150px, auto));
  grid-gap: 4px;
  margin-bottom: 14px;
}

.sub-top h3 {
  font-size: 24px;
  line-height: 28px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: #000;
}

.sub-top p {

  line-height: 16px;
  letter-spacing: -0.2px;
  color: #a1a1a5;
  word-break: break-word;
  margin-top: 6px;
}

.see-text {
  text-align: right;
  position: relative;
}

.see-text a {
  text-align: right;
  position: absolute;
  bottom: 0;
  right: 0;
}

.see-text a:hover {
  text-decoration: underline;
}

.main-top {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(min-content, max-content);
  grid-gap: 4px;
}

.mt-img img {
  width: 40px;
}

.main-top h6 img {
  width: 24px;
  vertical-align: middle;
}

.small-grid {
  display: grid;
  grid-auto-flow: column;
  grid-gap: 30px;
  grid-auto-columns: 22.6%;
  -moz-box-align: center;
  align-items: center;
  -moz-box-pack: initial;
  justify-content: initial;
  margin-bottom: 24px;
}

.main {
  padding: 15px;
  border: 1px solid #e8e8e9;
  border-radius: 12px;
  transition: all 0.2s ease-in-out;
}

.main:hover {
  box-shadow: 0px 4px 8px rgba(46, 63, 116, 0.1);
}

.main h6 {
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: -0.6px;
  color: #000;
  word-break: break-word;
  margin-top: 10px;
  margin-left: 7px;
}

.main p {
  display: block;
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  letter-spacing: -0.2px;
  color: #a1a1a5;
}

.main h2 {
  font-size: 28px;
  line-height: 32px;
  font-weight: 500;
  letter-spacing: -0.4px;
  color: #000;
  word-break: break-word;
  position: relative;
}

.main .g-txt {
  color: #363636;
  margin-left: -5px;
}

.main .sr-txt {
  color: #eb5757;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: -0.6px;
  font-family: "Roboto";
  margin-top: -60px;
}

.main .sg-txt {
  color: #1cc760;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: -0.6px;
  font-family: "Roboto", sans-serif;
}

.main h2 a {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: normal;
  height: 36px;
  padding: 0px 10px;
  border-radius: 99999px;
  border: none;
  outline: none;
  position: absolute;
  right: 0px;
  margin-top: -3px;
  z-index: 1;
  opacity: 0;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  text-transform: initial !important;
  background: #FFF !important;
  border: 1px solid rgba(204, 204, 204, 0.7);
  color: #071e36 !important;
  font-size: 12px !important;
  border-radius: 40px;
  font-weight: 700;
  height: 34px;
  min-width: fit-content;
}

.main h2 a::before {
  content: "";
  display: block;
  width: 20px;
  height: 40px;
  position: absolute;
  left: unset;
  right: 55px;
  z-index: -2222;
  background-image: linear-gradient(
    270deg,
    rgb(255, 255, 255) 54.69%,
    rgba(255, 255, 255, 0) 100%
  );
}

.main h2 a:hover {
  opacity: 1;
}

.tags-wrap a {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #000;
  border-radius: 10000px;
  padding: 3px 11px 3px 7px;
  border: 1px solid #e8e8e9;
  margin-right: 12px;
  margin-bottom: 16px;
  display: inline-block;
}

.tags-wrap a span {
  font-size: 18px;
  font-weight: 700;
  color: #2962ef;
  margin-right: 5px;
}

@media screen and (min-width: 768px) and (max-width: 1199px) {
  .wrapper {
    width: 93.15%;
    background: #fff;
    margin: 0 15px;
  }
}

@media screen and (max-width: 767px) {
  .wrapper {
    width: 100%;
    background: #fff;
    margin: 0 0%;
    padding: 0 15px;
  }

  .sub-top {
    display: grid;
    grid-auto-flow: revert;
    grid-gap: 21px;
    margin-bottom: 24px;
  }

  .small-grid {
    display: block;
    margin-bottom: 50px;
  }

  .main {
    margin-bottom: 20px;
  }

  .tags-wrap a {
    margin-right: 4px;
  }
}
.dark-theme{
  .main .g-txt {
    color: rgb(240, 240, 240);
  }
  .wrapper {
    background-color: #04111F;
    // border: 1px solid #627797;
    /deep/ .q-dark{
      background-color: #04111F !important;
    }
    color: #FFF;
    .main h6,.main h2{
      color: #FFF;
    }
    .main h2 a{
      background: #071e36 !important;
      border: 1px solid rgba(204, 204, 204, 0.7);
      color: #FFF !important;
      &:before{
        width: 30px;
        right: 55px;
        left: unset;
        top: 0px;
        background-image: linear-gradient(270deg, #04111f 54.69%, rgba(4,17,31,0) 100%);
        opacity: .5;
      }
    }
  }
}
</style>

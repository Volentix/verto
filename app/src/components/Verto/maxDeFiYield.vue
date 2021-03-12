<template>
  <div v-if="maxToken" class="desktop-card-style maxdefiyield-section q-mb-sm" style="background: url(statics/bg3d3.png) #04111f no-repeat; background-position: center 80%; background-size: auto 130%;" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <div class="banner-wrapper">
      <div class="flex column q-pt-sm q-pb-sm text-white">
        <div class="title">
            <b>Max DeFi Yield</b>
        </div>
        <div class="subtitle flex items-center justify-between">
          <span class="flex items-center">
            <span>Convert</span>
            <span>{{maxToken.amount.toFixed(4)}}</span>
            <span>{{maxToken.type.toUpperCase()}}</span>
            <span>to</span>
            <span v-if="maxDeFiYield.toTokenAmount">{{maxDeFiYield.toTokenAmount}}</span>
            <span>{{maxDeFiYield.token}}</span>
            <!-- <img :src="'https://zapper.fi/images/'+maxDeFiYield.token+'-icon.png'" alt=""> -->
          </span>
          <q-btn :disable="!maxDeFiYield.toTokenAmount" unelevated class="qbtn-download" outline color="white" text-color="black" label="Confirm" @click="maxDeFiYield.toTokenAmount && goToExchange()" >
            <q-tooltip v-if="!maxDeFiYield.toTokenAmount">
            Swapping {{maxToken.type.toUpperCase()}} to {{maxDeFiYield.token}} is currently unavailable
            </q-tooltip>
          </q-btn>
        </div>
        <div class="interest-wrapper">
          <span>at</span>
          <span class="interest"><span class="text_pink">{{maxDeFiYield.roi}} %</span> <span class="text-grey">(Interest Rate)
            <q-icon @click.native="openURL('https://stats.finance/yearn')" size="xs" name="help_outline">
              <q-tooltip>
                For more information about the interset rate, please visite www.stats.finance/yearn
              </q-tooltip>
            </q-icon>
            </span> <span class="text_pink">With 1 Click</span></span>
           <!-- class="p-abs" -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'maxDeFiYield',
  data () {
    return {
      accountOptions: [],
      accountOption: {
        chain: ''
      },
      maxDeFiYield: {},
      maxToken: false,
      ethTokens: []
    }
  },
  mounted () {
    let tableData = this.$store.state.wallets.tokens
    this.ethTokens = tableData.filter(w => w.chain === 'eth' && !isNaN(w.usd))
    this.maxToken = this.ethTokens.length ? this.ethTokens.reduce((p, c) => p.usd > c.usd ? p : c) : null
    this.getMaxDeFiYield()
  },
  methods: {
    openURL (url) {
      if (this.$q.platform.is.cordova) {
        window.open(url, '_system')
      } else {
        openURL(url)
      }
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
          if (this.maxToken && this.maxToken.type) { this.maxDeFiYield.toTokenAmount = this.convertWalletToken(this.maxToken.type, this.maxDeFiYield.token) }
        })
    },
    convertWalletToken (from, to) {
      let find = this.$store.state.investment.zapperTokens.find(o => o.symbol.toLowerCase() === to.toLowerCase())
      return find ? parseInt(this.maxToken.usd / find.price) : false
    },
    goToExchange () {
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
      this.$store.commit('settings/setDex', { dex: 'oneinch', destinationCoin: destinationCoin, depositCoin: depositCoin, fromAmount: this.maxToken.amount })

      this.$router.push('/verto/exchange/')
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .maxdefiyield-section{
    max-height: 76px;
    min-height: 76px;
    .title{
      margin-bottom: -4px;
      margin-top: -5px;
      font-size: 12px;
      font-weight: $bold;
    }
    .qbtn-download{
      border-radius: 30px;
      height: 30px;
      color: #fe68b5 !important;
      background: #FFF !important;
      /deep/ .q-btn__wrapper{
        min-height: unset;
        .q-btn__content{
          text-transform: initial;
          font-size: 12px;
        }
      }
    }
    .interest-wrapper{
      font-size: 12px;
      margin-top: -5px;
      span{
        padding-right: 5px;
      }
      .interest{
        position: relative;
        .p-abs{
          position: absolute;
          bottom: -20px;
          transform: translateX(-50%);
          left: 50%;
          width: 100px;
          text-align: center;
          opacity: .7;
        }
      }
    }
    .subtitle{
      font-size: 12px;
      padding-right: 10px;
      span{
        span{
          padding-right: 5px;
        }
        img{
          max-width: 30px;
          margin-right: 5px;
        }
      }
    }
    .row{
      .col{

      }
    }
  }
  .scale3d{
    transform: scale3d(1,1,1);
  }
  .banner-wrapper{
    padding-left: 10px;
  }
  .text_pink{
    color: #fe68b5;
  }
</style>

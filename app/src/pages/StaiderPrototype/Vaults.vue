<template>
  <div class="vaults-section" id="topsection">
    <div class="fluid-container">
      <div class="row">
        <div class="col-12 text-white column flex-center">
            <h2 class="text-shadow1 page-title">Our Vaults</h2>
        </div>
        <div class="vault-col col-12 col-md-4 col-lg-4 text-white" :class="{'q-pl-xl q-pr-xl': $q.screen.width > 768, 'q-pt-xl q-pb-xl': $q.screen.width < 768}">
          <div class="vault-wrapper q-pa-lg column justify-between items-center">
            <div class="header column justify-between items-center">
              <img src="statics/staider/vault-bg-head.svg" width="190px" alt="">
              <span class="apy flex flex-center text-black">APY Up to <b>67%</b></span>
            </div>
            <div class="body column full-width">
              <span class="title text-center">US Dollar Fixed growth</span>
              <p class="text-center">1/1 US Dollar. Only Stablecoins that generate above average yield and maintain adequate peg and volume are used to earn more USD. NO IL low risk</p>
            </div>
            <div class="footer">
              <div class="row justify-center">
                <q-btn v-for="(apy, index) in apyData.filter((a) => a.category === 'vault1')" :key="'apy_btn_'+index" color="white" dense class="apy-btn shadow1 col-5 q-ml-sm q-mr-sm q-mb-md" no-caps text-color="white" to="/te/staider-new-prototype/vault" outline rounded>
                  <div class="flex items-center" :class="apy.category">
                    <img height="28px" :src="apy.img" alt="">
                    <div class="btn-label column items-start">
                      <span class="coin">{{apy.coin}}</span>
                      <span class="apy">{{apy.apy}}</span>
                    </div>
                  </div>
                </q-btn>
              </div>
            </div>
            <img src="statics/staider/vault-bg-body1.svg" class="bg" alt="">
          </div>
        </div>
        <div class="vault-col col-12 col-md-4 col-lg-4 text-white" :class="{'q-pl-xl q-pr-xl': $q.screen.width > 768, 'q-pt-xl q-pb-xl': $q.screen.width < 768}">
          <div class="vault-wrapper q-pa-lg column justify-between items-center" :class="{'featured': $q.screen.width > 768}">
            <div class="header column justify-between items-center">
              <img src="statics/staider/vault-bg-head2.svg" width="190px" alt="">
              <span class="apy flex flex-center text-black">APY UNKNOWN</span>
            </div>
            <div class="body column full-width">
              <span class="title text-center">PulseChain Vault</span>
              <p class="text-center">PulseChain  maximization strategy.<br>Staking/liquidity/farms early exposure on PulseCain. No IL Low risk</p>
            </div>
            <div class="footer">
              <div class="row justify-center">
                <q-btn v-for="(apy, index) in apyData.filter((a) => a.category === 'vault2')" :key="'apy_btn_'+index" color="white" dense class="apy-btn shadow1 col-5 q-ml-sm q-mr-sm q-mb-md" no-caps text-color="white" to="/te/staider-new-prototype/vault" outline rounded>
                  <div class="flex justify-between items-center" :class="apy.category">
                    <img height="28px" :src="apy.img" alt="">
                    <div class="btn-label column items-start">
                      <span class="coin">{{apy.coin}}</span>
                      <span class="apy">{{apy.apy}}</span>
                    </div>
                  </div>
                </q-btn>
              </div>
            </div>
            <img src="statics/staider/vault-bg-body2.svg" class="bg2" alt="">
          </div>
        </div>
        <div class="vault-col col-12 col-md-4 col-lg-4 text-white" :class="{'q-pl-xl q-pr-xl': $q.screen.width > 768, 'q-pt-xl q-pb-xl': $q.screen.width < 768}">
          <div class="vault-wrapper q-pa-lg column justify-between items-center">
            <div class="header column justify-between items-center">
              <img src="statics/staider/vault-bg-head.svg" width="190px" alt="">
              <span class="apy flex flex-center text-black">APY Up to <b>73%</b></span>
            </div>
            <div class="body column full-width">
              <span class="title text-center">SIF USDC</span>
              <p class="text-center">SIF USDC - an algorithmic trading strategy with a balanced risk/profit ratio.</p>
            </div>
            <div class="footer">
              <div class="row justify-center">
                <q-btn v-for="(apy, index) in apyData.filter((a) => a.category === 'vault3')" :key="'apy_btn_'+index" color="white" dense class="apy-btn shadow1 col-5 q-ml-sm q-mr-sm q-mb-md" no-caps text-color="white" to="/te/staider-new-prototype/vault" outline rounded>
                  <div class="flex items-center" :class="apy.category">
                    <img height="28px" :src="apy.img" alt="">
                    <div class="btn-label column items-start">
                      <span class="coin">{{apy.coin}}</span>
                      <span class="apy">{{apy.apy}}</span>
                    </div>
                  </div>
                </q-btn>
              </div>
            </div>
            <img src="statics/staider/vault-bg-body3.svg" class="bg3" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VaultsPage',
  components: {
  },
  data () {
    return {
      apyData: [
        {
          category: 'vault1',
          img: 'statics/staider/coins/usdc.svg',
          coin: 'USDC',
          apy: 'APY ~63%'
        },
        {
          category: 'vault1',
          img: 'statics/staider/coins/usdt.svg',
          coin: 'USDC',
          apy: 'APY ~12%'
        },
        {
          category: 'vault1',
          img: 'statics/staider/coins/tusd.svg',
          coin: 'USDC',
          apy: 'APY ~42%'
        },
        {
          category: 'vault1',
          img: 'statics/staider/coins/dai.svg',
          coin: 'USDC',
          apy: 'APY ~12%'
        },
        {
          category: 'vault1',
          img: 'statics/staider/coins/ust.png',
          coin: 'USDC',
          apy: 'APY ~19%'
        },
        {
          category: 'vault1',
          img: 'statics/staider/coins/busd.svg',
          coin: 'USDC',
          apy: 'APY ~10%'
        },
        {
          category: 'vault2',
          img: 'statics/staider/coins/usdc.svg',
          coin: 'USDC'
        },
        {
          category: 'vault2',
          img: 'statics/staider/coins/usdt.svg',
          coin: 'USDT'
        },
        {
          category: 'vault2',
          img: 'statics/staider/coins/tusd.svg',
          coin: 'TUSD'
        },
        {
          category: 'vault2',
          img: 'statics/staider/coins/dai.svg',
          coin: 'DAI'
        },
        {
          category: 'vault2',
          img: 'statics/staider/coins/ust.png',
          coin: 'UST'
        },
        {
          category: 'vault2',
          img: 'statics/staider/coins/busd.svg',
          coin: 'BUSD'
        },
        {
          category: 'vault2',
          img: 'statics/staider/coins/wbtc.svg',
          coin: 'WBTC'
        },
        {
          category: 'vault2',
          img: 'statics/staider/coins/hex.svg',
          coin: 'HEX'
        },
        {
          category: 'vault3',
          img: 'statics/staider/coins/usdc.svg',
          coin: 'USDC',
          apy: 'APY ~73%'
        },
        {
          category: 'vault3',
          img: 'statics/staider/coins/eth.svg',
          coin: 'ETH',
          apy: 'APY ~38%'
        }
      ]
    }
  },
  watch: {
  },
  mounted () {
  },
  async created () {
    this.scrollToSection('topsection')
  },
  methods: {
    scrollToSection (sectionScrollName) {
      // let sectionScrollName = this.$route.params.currentSection
      let scrollTop = 0
      setTimeout(() => {
        console.log('scrollToSection', sectionScrollName)
        try {
          document.querySelector('#' + sectionScrollName).classList.add('activate-animation')
          scrollTop = document.querySelector('#' + sectionScrollName).offsetTop
        } catch (error) {
          console.log(error.message)
        }
        document.querySelector('#scroll_area_wrapper .scroll').scrollTop = parseInt(scrollTop) + (scrollTop > 0 ? -120 : 0)
      }, 100)
    },
    formatNumber (number, tofix) {
      const val = (number / 1).toFixed(tofix).replace(',', ' ')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "assets/styles/staider_theme/helpers.scss";
  .vaults-section{
    max-width: 1600px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100px;
    padding-bottom: 100px;
    padding-left: 50px;
    padding-right: 50px;
    .page-title{
      font-family: $MainFont;
      font-weight: 200;
      font-size: 50px;
      line-height: 60px;
      margin: 0px;
      margin-bottom: 100px;
      text-align: center;
      @media screen and (max-width: 768px) {
        font-size: 30px;
        line-height: 40px;
        margin-bottom: 30px;
      }
    }
    .vault-wrapper{
      // max-width: 310px;
      background: #16161A;
      box-shadow: 0px 34px 34px 0px rgba(black, .5);
      position: relative;
      min-height: 460px;
      border-radius: 20px;
      border: 2px solid rgba(#FFF, .9);
      &:hover{
        z-index: 99;
      }
      .bg{
        position: absolute;
        width: 100%;
        bottom: 0px;
        left: -110px;
        z-index: 1;
      }
      .bg2{
        position: absolute;
        width: 100%;
        bottom: -130px;
        left: -105px;
        z-index: 1;
      }
      .bg3{
        position: absolute;
        width: 100%;
        bottom: 0px;
        right: -165px;
        z-index: 1;
      }
      &.featured{
        transform: scale(1.2);
      }
      .header{
        position: relative;
        z-index: 3;
        margin-top: -40px;
        img{}
        .apy{
          position: absolute;
          width: 100%;
          left: 0px;
          top: 0px;
          min-height: 50px;
          font-family: $MainFont;
          font-weight: 400;
          font-size: 13px;
          b{
            font-size: 16px;
            font-weight: 700;
            padding-left: 5px;
          }
        }
      }
      .body{
        position: relative;
        z-index: 3;
        .title{
          font-family: $MainFont;
          font-weight: 900;
          font-size: 20px;
          margin-bottom: 20px;
        }
        p{
          font-family: $MainFont;
          font-weight: 300;
          font-size: 12px;
          line-height: 24px;
        }
      }
      .footer{
        position: relative;
        z-index: 3;
        /deep/ .apy-btn{
          min-width: 140px;
          img{
            margin-right: 10px;
            margin-left: -5px;
          }
          .btn-label{}
          .coin{
            font-family: $MainFont;
            font-weight: 400;
            font-size: 10px;
            text-align: left;
            margin-bottom: -10px;
          }
          .apy{
            font-family: $MainFont;
            font-weight: 700;
            font-size: 14px;
            text-align: left;
          }
          .vault2{
            min-width: 100px;
            .coin{
              font-weight: 700;
              font-size: 16px;
              margin-bottom: 0px;
              text-align: left;
              min-width: 60px;
            }
          }
        }
      }
    }
  }
</style>

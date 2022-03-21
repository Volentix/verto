<template>
  <div class="landing-page">
    <div class="fluid-container" id="home">
      <div class="row section1">
        <div class="col-12 col-sm-12 col-md-6 col-lg-6 text-white flex flex-center">
          <div class="column justify-center items-start full-width" :class="{'rmv-br q-pl-lg q-pr-lg': $q.screen.width < 768}">
            <h1>Your portfolio <br>on autopilot</h1>
            <h2>Retain full custody of your assets</h2>
            <q-btn color="white" class="shadow1" no-caps text-color="white" to="/vault/0x185a02fd5576817fa0c9847cd6f2acc6707bfa0a" outline rounded label="Launch app" />
          </div>
        </div>
        <div class="col-12 col-sm-12 col-md-6 col-lg-6 flex flex-center staider3d">
          <img src="statics/staider/staider_3d.png" width="370px" alt="" class="">
        </div>
      </div>
      <div class="row section2 section-backdrop">
        <div class="col-12 text-white column flex-center">
            <h2 class="text-shadow1">What is Staider?</h2>
            <p>Staider is an on-chain asset management portal </p>
            <p>Optimized strategies used to easly invest in decentralised finance (DeFi) </p>
            <p>Simply said: Staider puts your crypto portfolio on autopilot</p>
        </div>
      </div>
      <div class="row section3 section-backdrop q-pb-xl">
        <div class="col-12 text-white column flex-center">
            <h2 class="text-shadow1">How to use Staider ?</h2>
            <div class="row full-width steps-row">
              <div class="steps-col" :class="{'col-6': $q.screen.width > 768, 'col-12': $q.screen.width < 768}">
                <div class="steps step1 shadow2">
                  <span class="step-number">1</span>
                  <span class="step-number stroked">1</span>
                  <h4 class="text-shadow1">Choose a vault</h4>
                  <p>Browse the list of vaults available to interact with</p>
                </div>
              </div>
              <div class="steps-col" :class="{'col-6': $q.screen.width > 768, 'col-12': $q.screen.width < 768}">
                <div class="steps step2 shadow2">
                  <span class="step-number">2</span>
                  <span class="step-number stroked">2</span>
                  <h4 class="text-shadow1">Connect your wallet</h4>
                  <p>Use Verto, Metamask or any wallet of choice with WalletConnect support</p>
                </div>
              </div>
              <div class="steps-col" :class="{'col-6': $q.screen.width > 768, 'col-12': $q.screen.width < 768}">
                <div class="steps step3 shadow2">
                  <span class="step-number">3</span>
                  <span class="step-number stroked">3</span>
                  <h4 class="text-shadow1">Deposit or Withdraw</h4>
                  <p>Your vault tokens can be “withdrawn” at the market share price at anytime</p>
                </div>
              </div>
              <div class="steps-col" :class="{'col-6': $q.screen.width > 768, 'col-12': $q.screen.width < 768}">
                <div class="steps step4 shadow2">
                  <span class="step-number">4</span>
                  <span class="step-number stroked">4</span>
                  <h4 class="text-shadow1">Monitor & Transact</h4>
                  <p>Monitor your profile to stay up to date on yield opportunities and the latest Vault strategies</p>
                </div>
              </div>
            </div>
        </div>
        <div class="q-mb-xl"></div>
      </div>
      <div class="row section4 section-backdrop q-pb-xl">
        <div class="col-12 text-white column flex-center">
            <h2 class="text-shadow1">Advantage of Staider</h2>
            <img v-if="$q.screen.width > 768" src="statics/staider/advantage.svg" class="full-width q-mt-xl" alt="">
            <img v-else src="statics/staider/advantage_v.svg" class="full-width q-mt-xl" alt="">
        </div>
      </div>
      <div class="row section5 section-backdrop q-pl-lg q-pr-lg q-pt-xl q-pb-xl" id="vaults">
        <div class="col-12 text-white q-mb-xl">
          <h2 class="text-shadow1">Come discover our Vaults and their performance</h2>
          <p>Discover and follow the best yield farmers with just one click. Historical APY, farming philosophy, risk appetite; You can see it all.</p>
          <div class="cta-view-all flex justify-end">
            <q-btn flat color="white" class="q-ml-sm text-bold" dense icon-right="keyboard_arrow_right" no-caps text-color="white" to="/vaults" label="View All Vaults" />
          </div>
        </div>
        <div :class="{'col-6': $q.screen.width > 768, 'col-12': $q.screen.width < 768}">
          <div class="vault-wrapper vault1 shadow2 text-white">
            <div class="Info-sif-usdc info-wrapper column justify-between" v-if="showInfoSIFUSDC">
              <span class="title flex justify-between items-center">SIF USDC Vault
                <q-btn round color="white" dense icon="close" @click="showInfoSIFUSDC = false" size="xs" class="initial" flat />
              </span>
              <div class="desc">Digital assets that have critical and adopted solutions for DeFi such as REN for bridges, yield generation protocols like AAVE, and exchange solutions like Loopring LRC, among others.</div>
              <div class="more">
                <q-btn color="white" class="shadow1" no-caps text-color="white" to="/staider-new-prototype/vaults/sif-usdc/about" outline rounded label="Learn more" />
              </div>
            </div>
            <div class="row justify-between items-center full-width">
              <div class="vault-wrapper__logo col flex items-center">
                <img width="60" src="statics/staider/sif_logo_white.svg" alt="">
                <span class="q-ml-sm txt text-capitalize">SIF USDC</span>
                <span class="info" @click="showInfoSIFUSDC = true">?</span>
              </div>
              <div class="vault-wrapper__network col column pairs items-end">
                <span class="flex items-center label">
                  <img width="11" src="statics/staider/networks/ethereum.svg" class="q-mr-sm" alt=""> Network
                </span>
                <span class="value text-bold">Ethereum</span>
              </div>
            </div>
            <div class="row justify-between items-center full-width q-mt-xl q-pt-xl">
              <div class="vault-wrapper__apy col">
                <span class="apy"><b>N/A</b> Up to APY</span>
              </div>
              <div class="vault-wrapper__cta col flex justify-end">
                <q-btn color="white" class="shadow1" no-caps text-color="white" to="/vault/0x185a02fd5576817fa0c9847cd6f2acc6707bfa0a" outline rounded label="Deposit">
                  <div class="flex items-center">
                    <img height="20" class="q-ml-md q-mr-xs" src="statics/staider/coins/usdc.svg" alt="">
                    <img height="20" src="statics/staider/coins/eth.svg" alt="">
                  </div>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end" :class="{'col-6': $q.screen.width > 768, 'col-12': $q.screen.width < 768}">
          <div class="vault-wrapper shadow2 text-white full-width">
            <div class="spf-pulsechain info-wrapper column justify-between" v-if="showInfoPulseChain">
              <span class="title flex justify-between items-center">SPF PulseChain Vault
                <q-btn round color="white" dense icon="close" @click="showInfoPulseChain = false" size="xs" class="initial" flat />
              </span>
              <div class="desc">This pool will hold Pulse, PulseX, Hex, Hedron, LiquidLoans and other strategic assets on the Pulse Chain. The fund will remain open until the launch of PulseChain or 100 days, whichever comes first Assets deposited until that time receive a prorated portion of the pool.</div>
              <div class="more">
                <q-btn color="white" class="shadow1" no-caps text-color="white" to="/staider-new-prototype/vaults/sif-usdc/about" outline rounded label="Learn more" />
              </div>
            </div>
            <div class="row justify-between items-center full-width">
              <div class="vault-wrapper__logo col flex items-center">
                <img width="50" src="statics/staider/coins/pulsechain.svg" class="q-pa-xs" alt="">
                <span class="q-ml-sm q-pb-sm txt text-capitalize">SPF PulseChain</span>
                <span class="info info2" @click="showInfoPulseChain = true">?</span>
              </div>
              <div class="vault-wrapper__network col column pairs items-end">
                <span class="flex items-center label">
                  <img width="11" src="statics/staider/networks/ethereum.svg" class="q-mr-sm" alt=""> Network
                </span>
                <span class="value text-bold">Ethereum</span>
              </div>
            </div>
            <div class="row justify-between items-center full-width q-mt-xl q-pt-xl">
              <div class="vault-wrapper__apy col-4">
                <span class="apy"><b>N/A</b> Up to APY</span>
              </div>
              <div class="vault-wrapper__cta col col-8 flex justify-end">
                <q-btn color="white" class="shadow1" no-caps text-color="white" to="/vault/0xe00d15b722a3c3a5ae2d4dd68a302ec8fdc2ccba" outline rounded label="Deposit">
                  <div class="flex items-center">
                    <img height="20" class="q-ml-md q-mr-xs" src="statics/staider/coins/usdc.svg" alt="">
                    <img height="20" class="q-mr-xs" src="statics/staider/coins/eth.svg" alt="">
                    <img height="19" src="statics/staider/coins/hex.svg" alt="">
                  </div>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
        <div v-if="$q.screen.width > 768" class="col-12 q-mb-xl q-pb-xl"></div>
      </div>
      <div class="row section6 section-backdrop q-pl-lg q-pr-lg q-pt-xl q-pb-xl">
        <div v-if="$q.screen.width > 768" class="col-6 text-white q-mb-md">
          <h2 class="text-shadow1">Monitor & manage your digital portfolio</h2>
        </div>
        <div class="col-12"></div>
        <div class="text-white q-mb-xl column" :class="{'col-6': $q.screen.width > 768, 'col-12': $q.screen.width < 768}">
          <p>You can filter strategies by assets, risk and performance, and find one that fits your profile.</p>
          <div class="cta-btns flex q-mt-xl">
            <q-btn color="white" class="shadow1" no-caps text-color="white" to="/vault/0x185a02fd5576817fa0c9847cd6f2acc6707bfa0a" outline rounded label="Explore Funds" />
            <q-btn flat color="white" class="q-ml-sm" no-caps text-color="white" to="/vault/0x185a02fd5576817fa0c9847cd6f2acc6707bfa0a" label="Connect Wallet" />
          </div>
        </div>
        <div class="text-white column" :class="{'col-6 q-mb-xl q-pl-xl': $q.screen.width > 768, 'col-12': $q.screen.width < 768}">
          <div class="coins-wrapper flex flex-center items-center">
            <span v-for="(coin, index) in coins" :key="'coin_'+index" class="coin-item" :class="{'q-mr-md q-ml-md q-mb-lg': $q.screen.width > 768, 'q-mr-md q-ml-md q-mb-md': $q.screen.width < 768}">
              <img :src="'statics/staider/coins/' + coin + '.svg'" width="59px" alt="">
            </span>
          </div>
        </div>
        <div v-if="$q.screen.width < 768" class="col-12 text-white q-mb-md">
          <h2 class="text-shadow1">Monitor & manage your digital portfolio</h2>
        </div>
      </div>
      <div class="row section7 section-backdrop q-pb-xl q-pt-lg" id="timeline">
        <div class="q-mt-xl"></div>
        <div class="col-12 text-white column flex-center">
            <h2 class="text-shadow1">Timeline</h2>
            <img v-if="$q.screen.width > 768" src="statics/staider/timeline.svg" class="full-width q-mt-xl" alt="">
            <img v-else src="statics/staider/timeline_v.svg" class="full-width q-mt-xl" alt="">
        </div>
        <div class="q-mb-xl"></div>
      </div>
      <div class="row section8 text-white section-backdrop q-pb-xl q-pt-lg" id="team">
        <div class="q-mt-lg"></div>
        <div class="col-12 text-white column flex-center">
            <h2 class="text-shadow1">Team</h2>
        </div>
        <div class="column items-center" :class="{'col-3': $q.screen.width > 768, 'col-6': $q.screen.width < 768}">
          <div class="img-user flex flex-center q-mb-md">
            <img src="statics/staider/team/user1_bg.jpg" class="bg q-mt-xl" alt="">
            <img src="statics/staider/team/user1.svg" class="user q-mt-xl" alt="">
          </div>
          <span class="role">SIF Manager</span>
          <span class="name">Nemr Hallak</span>
        </div>
        <div class="column items-center" :class="{'col-3': $q.screen.width > 768, 'col-6': $q.screen.width < 768}">
          <div class="img-user flex flex-center q-mb-md">
            <img src="statics/staider/team/user2_bg.jpg" class="bg q-mt-xl" alt="">
            <img src="statics/staider/team/user2.svg" class="user q-mt-xl" alt="">
          </div>
          <span class="role">SIF Manager</span>
          <span class="name">Marwan Ayoub</span>
        </div>
        <div v-if="false" class="column items-center" :class="{'col-2': $q.screen.width > 768, 'col-6': $q.screen.width < 768}">
          <div class="img-user flex flex-center q-mb-md">
            <img src="statics/staider/team/user3_bg.jpg" class="bg q-mt-xl" alt="">
            <img src="statics/staider/team/user3.svg" class="user q-mt-xl" alt="">
          </div>
          <span class="role">Advisor</span>
          <span class="name">Fadi Hallak</span>
        </div>
        <div class="column items-center" :class="{'col-3': $q.screen.width > 768, 'col-6': $q.screen.width < 768}">
          <div class="img-user flex flex-center q-mb-md">
            <img src="statics/staider/team/user4_bg.jpg" class="bg q-mt-xl" alt="">
            <img src="statics/staider/team/user3.svg" class="user q-mt-xl" alt="">
          </div>
          <span class="role">Advisor</span>
          <span class="name">Sergio Tanguma</span>
        </div>
        <div class="column items-center" :class="{'col-3': $q.screen.width > 768, 'col-6': $q.screen.width < 768}">
          <div class="img-user flex flex-center q-mb-md">
            <img src="statics/staider/team/user5_bg.jpg" class="bg q-mt-xl" alt="">
            <img src="statics/staider/team/user3.svg" class="user q-mt-xl" alt="">
          </div>
          <span class="role">Advisor</span>
          <span class="name">Mark Sleiman</span>
        </div>
        <div v-if="false" class="column items-center" :class="{'col-2': $q.screen.width > 768, 'col-6': $q.screen.width < 768}">
          <div class="img-user flex flex-center q-mb-md">
            <img src="statics/staider/team/user6_bg.jpg" class="bg q-mt-xl" alt="">
            <img src="statics/staider/team/user3.svg" class="user q-mt-xl" alt="">
          </div>
          <span class="role">Advisor</span>
          <span class="name">Ihab Yassine</span>
        </div>
        <div class="q-mb-lg"></div>
      </div>
      <div class="row section9 section-backdrop q-pb-xl q-pt-lg" id="faqs">
        <div class="q-mt-lg"></div>
        <div class="col-12 text-white column flex-center">
            <h2 class="text-shadow1">Frequently Ask Question</h2>
        </div>
        <div class="col-12">
          <div class="row">
            <div v-for="(item, index) in FAQData" :key="'faq_' + index" :class="{'col-6': $q.screen.width > 768, 'col-12': $q.screen.width < 768}">
              <div class="faq-wrapper q-pa-md">
                <q-btn color="white" class="faq-wrapper__btn full-width" :class="{'shadow1 activate' : item.selected}" @click="item.selected = !item.selected" no-caps text-color="white" outline rounded :label="item.question" :icon-right="item.selected ? 'expand_less':'expand_more'" />
                <div class="faq-wrapper__detail q-pa-lg text-white" :class="{'activate' : item.selected}" v-html="item.answer" />
              </div>
            </div>
          </div>
        </div>
        <div class="q-mb-lg"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  components: {
  },
  data () {
    return {
      showInfoPulseChain: false,
      showInfoSIFUSDC: false,
      FAQData: [
        {
          index: 1,
          question: 'What is Staider',
          answer: 'Staider is a decentralized asset management infrastructure built on Ethereum.',
          selected: false
        },
        {
          index: 2,
          question: 'Why use Staider',
          answer: 'We simplify how your crypto investment can be parked to yield returns. Staider allows for investors to interact directly with the index funds in a non-custodial manner. <br>Staider is always innovating and bringing unique vault strategies to the community. The second vault will be geared towards Pulse Chain.',
          selected: false
        },
        {
          index: 3,
          question: 'What is the fee structure on Staider',
          answer: 'There are three types of fees: <br><ol><li>A management fee</li><li>A performance fee</li><li>An entrance fee.</li></ol>',
          selected: false
        },
        {
          index: 4,
          question: 'Has Staider been audited',
          answer: 'Staider is a fork of Enzyme Finance. The Enzyme contracts have been audited by PWC and are available publicly. A second formal and public audit will commence with Open Zeppelinin Q3 this year.',
          selected: false
        },
        {
          index: 5,
          question: 'How can I use Staider as a Vault Manager?',
          answer: 'Open up the app and go to the Vault Manager section and create a new Vault. Go through the configuration steps thoroughly since most configuration options cannot be changed once you have deployed your vault.',
          selected: false
        },
        {
          index: 6,
          question: 'How can I use Staider as a Depositor?',
          answer: 'Open up the app, connect your wallet and whitelist your address to start interacting in Staider.',
          selected: false
        },
        {
          index: 7,
          question: 'Are gas fees cheaper on Staider?',
          answer: 'Fees on Saider are determined by the Ethereum network fees.',
          selected: false
        }
        // {
        //   index: 8,
        //   question: 'What is the fee structure on Staider',
        //   answer: 'Staider is a decentralized asset management infrastructure built on Ethereum.',
        //   selected: false
        // }
      ],
      coins: ['btc', 'pulse2', 'uniswap', 'loopring', 'usdc', 'vtx', 'eth', 'hex_white', 'pulse_x', 'ren', 'eos', 'aave'],
      datasVaults: [
        {
          icon: 'statics/staider/coins/usdc.svg',
          vault: 'SIF USDC',
          denominationCoin: 'USDC',
          myshares: '19,774.25 $US',
          sharePrice: '0.78 $US',
          value: '15,451.85 $US',
          apy: '-14.48%',
          apyStyle: 'red',
          network: 'Ethereum'
        },
        {
          icon: 'statics/staider/coins/pulsechain.svg',
          vault: 'SPF PulseChain',
          denominationCoin: 'USDC',
          myshares: '19,774.25 $US',
          sharePrice: '1.78 $US',
          value: '15,451.85 $US',
          apy: '+10.48%',
          apyStyle: 'green',
          network: 'Ethereum'
        }
      ]
    }
  },
  mounted () {
  },
  created () {
  },
  methods: {
    formatNumber (number, tofix) {
      const val = (number / 1).toFixed(tofix).replace(',', ' ')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "assets/styles/staider_theme/helpers.scss";
  .landing-page{
    min-height: 600px;
    padding: 0px 10px;
    max-width: calc(100% - 180px);
    margin-left: auto;
    margin-right: auto;
    margin-top: 100px;
    @media screen and (max-width: 768px) {
      max-width: 100%;
      // margin-top: 0px;
    }
    .section6{
      @media screen and (max-width: 768px) {
        flex-direction: column-reverse;
      }
      h2{
        font-family: $MainFont;
        font-weight: 700;
        font-size: 31px;
        line-height: 37px;
        margin: 0px;
        margin-bottom: 60px;
        max-width: 466px;
      }
      p{
        font-family: $MainFont;
        font-weight: 200;
        font-size: 30px;
        line-height: 50px;
        margin: 0px;
        @media screen and (max-width: 768px) {
          font-size: 14px;
          line-height: 30px;
        }
      }
      .coins-wrapper{
        @media screen and (max-width: 768px) {
          margin-left: -25px;
          margin-right: -25px;
        }
        img{
          margin: 0px;
          @media screen and (max-width: 768px) {
            width: 40px;
          }
        }
      }
    }
    .section5{
      @media screen and (max-width: 768px) {
        flex-direction: column;
      }
      .vault-wrapper{
        border: 3px solid #1D1D21;
        padding: 25px 40px;
        border-radius: 15px;
        position: relative;
        background: rgba(#1D1D21, .96);
        cursor: default;
        transition: border ease .3s;
        max-width: 570px;
        .info-wrapper{
          position: absolute;
          left: 0px;
          top: 0px;
          background: #1D1D21;
          outline: 4px solid $MainYellow;
          width: 100%;
          height: 100%;
          z-index: 9;
          border-radius: 15px;
          padding: 25px 40px;
          .title{
            font-size: 18px;
            font-family: $MainFont;
            font-weight: 700;
          }
          .desc{
            font-size: 14px;
            line-height: 22px;
            font-family: $MainFont;
            font-weight: 200;
            // margin-bottom: 20px;
            // margin-top: 20px;
          }
          .more{}
        }
        @media screen and (max-width: 768px) {
          padding: 10px 20px;
          margin-bottom: 20px;
        }
        &.vault1{
          @media screen and (max-width: 768px) {
            border-color: $MainYellow;
          }
        }
        &:hover{
          border-color: $MainYellow;
        }
        &__logo{
          margin-left: -10px;
          font-size: 20px;
          font-family: $MainFont;
          font-weight: 700;
          margin-top: -7px;
          .info{
            background: #FFF;
            display: inline-flex;
            width: 20px;
            height: 20px;
            border-radius: 20px;
            justify-content: center;
            color: #333;
            font-family: $MainFont;
            font-size: 13px;
            align-items: center;
            font-weight: 700;
            margin-left: 10px;
            margin-top: 9px;
            &.info2{
              margin-top: 4px;
            }
            cursor: pointer;
            &:hover{
              background: $MainYellow;
            }
          }
          @media screen and (max-width: 768px) {
            font-size: 14px;
            img{
              width: 50px !important;
            }
          }
          .txt{
            margin-top: 10px;
          }
        }
        &__network{
          transform: scale(.9);
          transform-origin: right;
          .label{
            font-size: 16px;
            font-family: $MainFont;
            font-weight: 200;
            @media screen and (max-width: 768px) {
              font-size: 12px;
            }
          }
          .value{
            font-family: $MainFont;
            font-size: 20px;
            font-weight: 700;
            @media screen and (max-width: 768px) {
              font-size: 16px;
            }
          }
        }
        &__apy{
          font-size: 16px;
          font-family: $MainFont;
          font-weight: 200;
          @media screen and (max-width: 768px) {
            font-size: 12px;
          }
          b{
            font-size: 20px;
            font-weight: 700;
            @media screen and (max-width: 768px) {
              font-size: 16px;
            }
          }
        }
        &__cta{
          @media screen and (max-width: 768px) {
            transform: scale(.8);
            margin-right: -20px;
          }
        }
      }
      h2{
        font-family: $MainFont;
        font-weight: 700;
        font-size: 31px;
        line-height: 37px;
        margin: 0px;
        margin-bottom: 60px;
        max-width: 466px;
        @media screen and (max-width: 768px) {
          font-size: 20px;
          line-height: 35px;
        }
      }
      p{
        font-family: $MainFont;
        font-weight: 200;
        font-size: 20px;
        line-height: 30px;
        margin: 0px;
        max-width: 811px;
        @media screen and (max-width: 768px) {
          font-size: 14px;
          line-height: 30px;
        }
      }
    }
    .section8{
      .img-user{
        position: relative;
        overflow: hidden;
        .bg{
          width: 100%;
          max-width: 140px;
          border-radius: 10px;
        }
        .user{
          position: absolute;
        }
      }
      .role{
        font-family: $MainFont;
        font-weight: 600;
        font-size: 18px;
        line-height: 20px;
        margin: 0px;
        margin-bottom: 5px;
        text-align: center;
      }
      .name{
        font-family: $MainFont;
        font-weight: 200;
        font-size: 18px;
        line-height: 20px;
        margin: 0px;
        text-align: center;
      }
    }
    .section9{
      .faq-wrapper{
        &__btn{
          height: 52px;
          font-size: 20px !important;
          opacity: .5;
          @media screen and (max-width: 768px) {
            font-size: 16px !important;
            line-height: 20px;
          }
          &.activate, &:hover{
            opacity: 1;
          }
          /deep/ .q-btn__content{
            justify-content: space-between;
            .block {
              max-width: 80%;
              text-align: left;
              line-height: 18px;
              font-size: 14px;
              font-weight: 400;
            }
          }
        }
        &__detail{
          font-size: 16px;
          font-weight: 200;
          line-height: 25px;
          transition: transform cubic-bezier(0.39, 0.575, 0.565, 1) .4s, opacity cubic-bezier(0.39, 0.575, 0.565, 1) .4s;
          overflow: hidden;
          opacity: 0;
          height: 0px;
          padding: 0px;
          transform: translateY(-10px);
          visibility: hidden;
          @media screen and (max-width: 768px) {
            font-size: 14px;
            line-height: 20px;
          }
          &.activate{
            opacity: 1;
            height: auto;
            padding: 20px;
            padding-top: 50px;
            transform: translateY(0px);
            visibility: visible;
          }
        }
      }
    }
    .section4,.section7,.section8,.section9{
      h2{
        font-family: $MainFont;
        font-weight: 200;
        font-size: 50px;
        line-height: 60px;
        margin: 0px;
        margin-bottom: 60px;
        text-align: center;
        @media screen and (max-width: 768px) {
          font-size: 30px;
          line-height: 40px;
        }
      }
    }
    .section3{
      h2{
        font-family: $MainFont;
        font-weight: 200;
        font-size: 50px;
        line-height: 60px;
        margin: 0px;
        margin-bottom: 60px;
        text-align: center;
        @media screen and (max-width: 768px) {
          font-size: 30px;
          line-height: 40px;
        }
      }
      .steps-row{}
      .steps-col{
        padding: 45px;
        position: relative;
      }
      .steps{
        border: 3px solid #1D1D21;
        padding: 25px 40px;
        border-radius: 15px;
        position: relative;
        background: rgba(#1D1D21, .96);
        cursor: default;
        transition: border ease .3s;
        &:hover{
          border-color: $MainYellow;
          .step-number{
            color: $MainYellow;
          }
        }
        .step-number{
          position: absolute;
          left: 0px;
          top: 0px;
          font-family: $MainFont;
          font-weight: 900;
          font-size: 80px;
          transform: translate(-50%,-50%);
          transition: color ease .3s;
          color: #FFF;
          @media screen and (max-width: 768px) {
            font-size: 46px;
          }
          &.stroked{
            text-shadow: 1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff;
            transform: translate(-65%,-55%);
            color: #1D1D21;
            z-index: -1;
            font-size: 160px;
            opacity: .2;
            @media screen and (max-width: 768px) {
              font-size: 90px;
            }
          }
        }
        &.step1{
          @media screen and (max-width: 768px) {
            border-color: $MainYellow;
          }
        }
        &.step2{
          margin-top: 170px;
          @media screen and (max-width: 768px) {
            margin-top: 10px;
          }
        }
        &.step3{
          margin-top: -120px;
          @media screen and (max-width: 768px) {
            margin-top: 10px;
          }
        }
        &.step4{
          margin-top: 60px;
          @media screen and (max-width: 768px) {
            margin-top: 10px;
          }
        }
        h4{
          font-family: $MainFont;
          font-weight: 600;
          font-size: 28px;
          line-height: 54px;
          margin: 0px;
          margin-bottom: 30px;
          @media screen and (max-width: 768px) {
            font-size: 16px;
            line-height: 19px;
          }
        }
        p{
          font-family: $MainFont;
          font-weight: 200;
          font-size: 28px;
          line-height: 54px;
          margin: 0px;
          @media screen and (max-width: 768px) {
            font-size: 15px;
            line-height: 28px;
          }
        }
      }
    }
    .section2{
      @media screen and (min-width: 768px) {
        min-height: 95vh;
      }
      @media screen and (max-width: 768px) {
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 100px;
        padding-top: 50px;
      }
      h2{
        font-family: $MainFont;
        font-weight: 200;
        font-size: 50px;
        line-height: 60px;
        margin: 0px;
        margin-bottom: 60px;
        text-align: center;
        @media screen and (max-width: 768px) {
          font-size: 30px;
          line-height: 40px;
        }
      }
      p{
        font-family: $MainFont;
        font-weight: 200;
        font-size: 28px;
        line-height: 54px;
        margin: 0px;
        text-align: center;
        margin-bottom: 40px;
        @media screen and (max-width: 768px) {
          font-size: 18px;
          line-height: 30px;
          margin-bottom: 40px;
        }
      }
    }
    .section1{
      @media screen and (min-width: 768px) {
        min-height: 75vh;
      }
      @media screen and (max-width: 768px) {
        min-height: 100vh;
        flex-direction: column-reverse;
        justify-content: flex-end;
      }
      .staider3d{
        position: relative;
        img{
          @media screen and (max-width: 768px) {
            width: 180px;
            margin-top: 70px;
            margin-bottom: 30px;
          }
        }
        &:before{
          content: '';
          width: 1px;
          height: 80%;
          position: absolute;
          left: 0px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent linear-gradient(-29deg, rgba(255, 255, 255, 0.03) 37%, rgba(24, 24, 24, 0.925) 100%) 0% 0% no-repeat padding-box;
        }
      }
      h1{
        font-family: $MainFont;
        font-weight: 200;
        font-size: 63px;
        line-height: 75px;
        margin: 0px;
        @media screen and (max-width: 768px) {
          font-size: 41px;
          line-height: 55px;
        }
      }
      h2{
        font-family: $MainFont;
        font-weight: 200;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 1.1px;
        margin: 0px;
        margin-top: 25px;
        margin-bottom: 60px;
        margin-left: 3px;
        @media screen and (max-width: 768px) {
          font-size: 16px;
          letter-spacing: 1.5px;
        }
      }
      /deep/ a{
        @media screen and (max-width: 768px) {
          background: $solidBackground !important;
        }
      }
    }
    .main-title{
      span{
        font-family: $MainFont;
        font-weight: 200;
        font-size: 16px;
      }
      .number{
        font-weight: 700;
        font-size: 30px;
        .small{
          font-weight: 600;
          font-size: 20px;
        }
      }
    }
    .stats-wrapper{
      .stat-item{}
      span{
        font-family: $MainFont;
        font-weight: 400;
        font-size: 14px;
        opacity: .7;
        &.number{
          opacity: 1;
          font-size: 24px;
          font-weight: 200;
          .small{
            font-weight: 400;
            font-size: 18px;
          }
        }
      }
    }
    .vaults-tabs-centent{
      /deep/ .q-tab-panel{
        @media screen and (max-width: 768px) {
          padding: 0px !important;
          margin-top: 20px;
        }
      }
    }
    .vaults-tabs-wrapper{
      /deep/ .q-tab--active{
        img{
          opacity: 1;
        }
      }
      /deep/ .q-tab--inactive{
        img{
          opacity: .5;
        }
      }
    }
    .vaults-table{
      width: 96%;
      /deep/ .th-header-style{
        color: rgba(white, .4);
        font-family: $MainFont;
        font-size: 14px;
        font-weight: 400;
      }
      /deep/ .q-table__control{
        opacity: .5;
      }
    }
    .identicon{
      overflow: hidden;
      outline: 1px solid rgb(71, 71, 71);
      background: transparent;
      border-radius: 30px;
      display: block;
      width: 30px;
      height: 30px;
      padding: 2px;
      /deep/ svg{
        width: 26px;
        position: relative;
        top: -2px;
      }
    }
    .chart-summary-mobile{
      ul{
        list-style: none;
        padding: 0px;
        margin: 0px;
        li{
          margin-left: 10px;
          margin-right: 10px;
          b{
            width: 10px;
            height: 10px;
            border-radius: 10px;
            margin-right: 10px;
          }
          span{
            font-family: $MainFont;
            font-size: 14px;
            font-weight: 400;
          }
        }
      }
    }
    .mobile-table{
      border: 1px solid #2D2D30;
      border-radius: 10px;
      font-family: $MainFont;
      font-weight: 400;
      font-size: 12px;
      .row{
        border-bottom: 1px solid #2D2D30;
      }
      .net-label{
        font-size: 12px;
      }
      .net-value{
        font-size: 14px;
        font-weight: 600;
      }
      .vault-name{
        font-size: 16px;
        line-height: 20px;
      }
      .standard-label{
        font-size: 16px;
        font-weight: 600;
      }
      .standard-value{
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
</style>
<style>
  .landing-page .apexcharts-gridline{stroke: rgb(49 49 49) !important;}
  .landing-page .apexcharts-pie path{stroke: #1D1D21;}
  .landing-page .apexcharts-legend-text{color: #FFF !important;}
  .landing-page .apexcharts-legend{top: 0px !important;right: 0px !important;display: flex !important;flex-direction: column !important;justify-content: center !important;}
</style>

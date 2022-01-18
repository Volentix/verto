<template>
  <div class="desktop-card-style make-vtx" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <div class="exchange-container" :class="{'dark': $store.state.settings.lightMode === 'true'}" :style="$store.state.settings.lightMode === 'true' ? 'background: url(statics/bg3d2.png)':'background: url(statics/bg3d2light.png)'">
        <div v-if="$store.state.settings.lightMode === 'true'" class="exchange-container--head-title flex justify-between items-center q-pa-sm q-pl-md q-pr-sm q-pb-md">Staking</div>
        <div v-else class="exchange-container--head-title flex justify-between items-center q-pa-sm q-pl-md q-pr-sm q-pb-md lightmd">Staking</div>
        <div class="row items-center q-pa-md">
            <div class="col-4 column p-desc q-pb-sm">
              <span class="text-bold stake-amount">10,000 VTX</span>
              <span class="text-grey stake-amount-required">Minimum required</span>
            </div>
            <div class="col-6 flex">
                <q-btn v-if="!canStakeVTX" unelevated class="qbtn-start" color="black" @click="goToExchange" :text-color="$store.state.settings.lightMode === 'false' ? 'black':'white'" label="Get VTX Now" />
                <q-btn v-else unelevated class="qbtn-start" color="black" @click="goToStaking" :text-color="$store.state.settings.lightMode === 'false' ? 'black':'white'" label="Stake VTX Now" />
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import DexInteraction from '../../mixins/DexInteraction'
export default {
  name: 'MakeVTXSection',
  components: {

  },
  data () {
    return {
      estimatedReward: 0,
      canStakeVTX: false,
      showTxInfoDialog: false,
      depositCoin: {
        label: 'Ethereum',
        value: 'eth',
        image: 'https://files.coinswitch.co/public/coins/eth.png'
      },
      destinationCoin: {
        label: 'VTX',
        value: 'vtx',
        image: 'https://raw.githubusercontent.com/BlockABC/eos-tokens/master/tokens/volentixgsys/VTX.png'
      },
      vtxAccount: null,
      activate: true,
      screenSize: 0,
      base: 'https://files.coinswitch.co/public/coins/',
      highestVTXAccount: null,
      modalBuyWithBTCETH: false,
      modalBuyWithEOS: false
    }
  },
  async created () {
    this.getWindowWidth()
    let highestVTXAccount = await this.$store.state.highestVTXAccount.wallet.amount
    // console.log('highestVTXAccount highestVTXAccount highestVTXAccount highestVTXAccount highestVTXAccount', highestVTXAccount)
    if (highestVTXAccount !== undefined) {
      this.setHighestVTXAccount()
      this.activate = false
    } else {
      setTimeout(() => {
        this.setHighestVTXAccount()
        this.activate = false
      }, 2000)
    }
  },
  watch: {
    '$store.state.wallets.tokens': function () {
      this.canUserStake()
    }
  },
  mounted () {
    this.canUserStake()
  },
  methods: {
    goToExchange () {
      // console.log('this.depositCoin', this.depositCoin)
      this.checkPair()
      let depositCoin = this.depositCoin
      let destinationCoin = this.destinationCoin

      this.$router.push({
        path: '/verto/exchange/:coinToSend/:coinToReceive',
        name: 'exchange-v3',
        params: {
          depositCoin: depositCoin,
          destinationCoin: destinationCoin,
          dex: this.dex
        }
      })
    },
    goToStaking () {
      let params = {}
      if (this.vtxAccount) {
        this.$store.state.currentwallet.wallet = this.vtxAccount
        params = {
          showSummary: true,
          vtxAccount: this.vtxAccount,
          chainID: this.vtxAccount.chain,
          tokenID: this.vtxAccount.type,
          accountName: this.vtxAccount.name
        }
        this.$store.state.currentwallet.params = params
      }
      this.$router.push({
        path: '/verto/stake',
        params: params
      })
    },
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    },
    nFormatter2 (num, digits) {
      var si = [{
        value: 1,
        symbol: ''
      },
      {
        value: 1E3,
        symbol: 'k'
      },
      {
        value: 1E6,
        symbol: 'M'
      },
      {
        value: 1E9,
        symbol: 'G'
      },
      {
        value: 1E12,
        symbol: 'T'
      },
      {
        value: 1E15,
        symbol: 'P'
      },
      {
        value: 1E18,
        symbol: 'E'
      }
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
    getVtxOpportunity () {
      let vtxData = this.$store.state.tokens.walletTokensData.find(o => o.symbol === 'vtx')

      if (vtxData) {
        let minVtxStakingUsd = vtxData.current_price * 10000
        let tokensOpportunities = this.$store.state.wallets.tokens.filter(o => parseFloat(o.usd) >= minVtxStakingUsd)

        let eosAccount = tokensOpportunities.find(o => o.chain === 'eos')
        // check if can be swap to vtx or eos

        if (eosAccount) {

        } else {
          let ethAccount = tokensOpportunities.find(o => o.chain === 'eos')

          if (ethAccount) {
            if (ethAccount.type === 'eth') {
              this.goToExchange()
            } else {
              this.depositCoin.value = ethAccount.type
              this.depositCoin.icon = ethAccount.icon
              this.destinationCoin.value = 'eth'
              this.destinationCoin.icon = 'https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png'
              this.txMessage = 'Swap ' + this.depositCoin.value + ' to ETH and Swap ETH to VTX'
              this.showTxInfoDialog = true
            }
          }
        }
      }
    },
    canUserStake () {
      let count = 0
      let account = null
      this.$store.state.wallets.tokens.forEach(c => {
        if (c.type === 'vtx' && c.chain === 'eos' && !isNaN(c.amount) && parseFloat(c.amount) >= 10000) {
          count++
          account = c
          this.canStakeVTX = true
        }
      })

      if (count) {
        this.vtxAccount = account
      } else {
        this.getVtxOpportunity()
      }
    },
    async setHighestVTXAccount () {
      let tableDatas = (await this.$store.state.wallets.tokens).filter((c) => {
        if (c.type === 'vtx' && c.chain === 'eos') {
          // console.log('c.type', c.type)
          return c
        }
      }).slice().sort(function (a, b) {
        return b.amount - a.amount
      })

      this.highestVTXAccount = tableDatas.length > 1 && parseInt(tableDatas[0].amount) >= 1000 ? tableDatas[0] : null
      // console.log('this.highestVTXAccount **********************************', this.highestVTXAccount)
      if (this.highestVTXAccount !== undefined && this.highestVTXAccount !== null) {
        let stake_per = Math.round((0.01 + (0.001 * 10)) * 1000) / 1000
        let sendAmount = Math.round(Math.pow(10, this.highestVTXAccount.precision) * this.highestVTXAccount.amount) / Math.pow(10, this.highestVTXAccount.precision)
        this.estimatedReward = Math.round(sendAmount * stake_per * 10 * 100) / 100
        // console.log('this.estimatedReward --**', this.estimatedReward)
        this.$store.commit('highestVTXAccount/updateParams', {
          chainID: this.highestVTXAccount.chain,
          tokenID: this.highestVTXAccount.type,
          accountName: this.highestVTXAccount.name
        })
        this.$store.state.highestVTXAccount.wallet = this.highestVTXAccount
        // console.log('this.$store.state.highestVTXAccount.wallet > ', await this.$store.state.highestVTXAccount.wallet)
      }
    }
  },
  mixins: [DexInteraction]
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.coins-wrapper {
    margin-top: -30px;
    margin-bottom: 30px;

    img {
        width: auto;
        height: auto;
        max-width: 26px;
        max-height: 26px;
        border: 1px solid rgba(#CCC, .2);
        border-radius: 30px;
    }
}

.btn-action {
    a {
        text-decoration: none;
        color: #333;
        outline: none;
        flex-basis: 33%;
        text-align: center;
        line-height: 100px;
        margin-top: 10px;
        margin-bottom: 10px;

        &.border {
            border-right: 1px solid rgba(black, .1);
        }

        &:hover {
            background-color: rgba(black, .01);
        }
    }
}

.make-vtx {
    position: relative;

    .earn-picto {
        width: 80px;
        height: 114px;

        img {
            position: absolute;
            left: -147px;
            top: -40px;
            width: 260px !important;
            height: 260px;
            max-width: unset !important;
        }
    }

    .small {
        font-size: 14px;
    }

    .big {
        font-size: 30px;
        letter-spacing: -1px;
        font-weight: $black;
        margin-top: -10px;
        margin-bottom: -10px;
    }

    .thicker {
        font-weight: $bold;

        img {
            width: 30px;
            margin-right: 15px;
        }
    }

    .row {
        .col {
            img {
              max-width: 80px;
              transform: translateX(10px);
            }

            strong {
              margin-bottom: -10px;
              line-height: 16px;
              font-size: 16px;
              padding-right: 20px;
            }
            .qbtn-start {
                border-radius: 30px;
                height: 25px;
                background: #7272FA !important;
                /deep/ .q-btn__wrapper {
                    min-height: unset;
                    padding: 0px 10px;
                    .q-btn__content {
                        text-transform: initial;
                        font-size: 12px;
                    }
                }
            }

            &.chain-token {
                font-weight: $bold;
                font-size: 11px;
                font-family: $Titillium;

                .label {
                    color: #494949;
                }

                strong {
                    font-size: 12px;
                    color: #7272FA;
                    text-transform: uppercase;
                }
            }

            &.venue-icon {
                font-size: 14px;
                font-weight: $bold;
                font-family: $Titillium;
                padding-right: 20px;
                padding-left: 10px;
                // flex-basis: 130px;
                position: relative;
                color: #494949;

                img {
                    width: 28px;
                    height: 24px;
                    margin-right: 5px;
                }
            }

            &.dropdown {}
        }
    }

    .select-input {
        border-radius: 100px !important;
        $height: 35px;
        width: 200px;
        height: $height;

        /deep/ .q-field__marginal {
            height: $height;
            min-height: unset;
        }

        /deep/ .q-field__control {
            height: $height;
            min-height: unset;

            .q-field__native {
                padding-left: 0px;
                padding-top: 0px;
                padding-bottom: 0px;
                height: $height;
                min-height: unset;

                .q-item {
                    padding: 0px;
                    padding-left: 18px;
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
    &.dark-theme{
        .svg-icon{
          fill: #CCC;
        }
        color: #FFF;
        .preloader {
          background-color: #0a2138;
        }
    }
}

.q-card {
    border-radius: 25px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 35px rgba(0, 0, 0, 0.14), 0 1px 10px rgba(0, 0, 0, 0.12);
}

.preloader {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    background-color: #fff;
    z-index: 9;
    transition: opacity ease .5s;
    opacity: 0;
    visibility: hidden;
    &.show {
        visibility: visible;
        opacity: 1;
    }
}
</style>
<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
    .card-make-VTX{
      &--wrapper{
        padding: 5% 7%;
        background-color: #FFFFFF;
        max-width: 100%;
        margin-left: auto;
        margin-right: auto;
        // box-shadow: 0px 3px 6px 0px rgba(black, .19);
        // border-radius: 20px;
        &--header{
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          position: relative;
          z-index: 4;
          &__holder{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            &_title{
              margin: 0px;
              font-size: 20px;
              font-family: $Titillium;
              font-weight: $bold;
              margin-top: 20px;
              line-height: 26px;
              margin-bottom: 30px;
              padding-left: 10px;
            }
            &_img{
              img{
                max-width: 120px;
                @media screen and (min-width: 768px) {
                  max-width: 90px;
                }
              }
            }
          }
          &_btn{
            background: #7272FA !important;
            font-size: 16px !important;
            text-transform: initial !important;
            border-radius: 40px;
            height: 45px;
            padding-left: 15px;
            padding-right: 15px;
            margin-bottom: 10px;
            margin-top: 0px;
            @media screen and (min-width: 768px) {
              margin-top: 25px !important;
            }
          }
        }
        position: relative;
        &:after{
          content: '';
          width: 100%;
          display: block;
          height: 50px;
          background-color: #F3F3F3;
          position: absolute;
          z-index: 0;
          bottom: 0px;
          left: 0px;
          border-radius: 0px 0px 20px 20px;
          box-shadow: 0px 3px 6px 0px rgba(black, .19);
        }
      }
    }
    .dark-theme{
      .card-make-VTX--wrapper{
        background-color: #04111F;
        // border: 1px solid #627797;
        &:after{
          background-color: rgba(#627797, .12);
        }
        &--header__holder_title{
          color: #FFF !important;
        }
      }
    }
    .exchange-container{
      height: 100px;
      margin: -3px;
      background-size: auto calc(100% + 20px) !important;
      background-position: -10px -10px !important;
      background-repeat: no-repeat !important;
      &.dark{
        background-size: auto 100% !important;
        background-position: calc(100% + 25px) -2px !important;
        background-repeat: no-repeat !important;
      }
      @media screen and (min-height: 700px) {
        background-size: auto calc(100% + 30px) !important;
        background-position: -10px -10px !important;
      }
      @media screen and (min-height: 760px) {
        background-size: auto calc(100% + 30px) !important;
        background-position: -10px -10px !important;
      }
      @media screen and (min-height: 800px) {
        background-size: auto calc(100% + 30px) !important;
        background-position: -10px -10px !important;
      }
      @media screen and (min-height: 870px) {
        background-size: auto calc(100% + 30px) !important;
        background-position: -10px -10px !important;
      }
      @media screen and (max-width: 768px) {
        background-size: auto 100% !important;
        background-position: calc(100% + 75px) -2px !important;
        background-repeat-x: no-repeat !important;
        &.dark{
          background-size: auto 100% !important;
          background-position: calc(100% + 75px) -2px !important;
          background-repeat-x: no-repeat !important;
        }
      }
      &--head-title{
        border-bottom: 1px solid rgba(#CCC, 0);
        // background-color: rgba(#CCC, .1);
        font-size: 16px;
        font-weight: 700;
        height: 45px;
        margin-bottom: -8px;
        padding-top: 11px;
        color: #FFF;
        // background-repeat: no-repeat !important;

        &.lightmd{
          color: #04111F;
        }
      }
      .row{}
      .qbtn-start{
        text-transform: initial !important;
        background: transparent !important;
        border: 1px solid rgba(#CCC, .7);
        font-size: 12px !important;
        border-radius: 40px;
        font-weight: $bold;
        min-height: 20px;
        margin-bottom: 0px;
        min-width: fit-content;
      }
    }
    .svg-icon{
      fill: rgba(#333, .6);
      width: 35px;
      height: 30px;
      max-width: unset;
      transform: scale(1);
    }
    .p-desc{
      position: relative;
    }
    .stake-amount{
      font-size: 16px;
      &-required{
        position: absolute;
        bottom: -8px;
        font-size: 12px;
      }
    }
</style>

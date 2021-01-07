<template>
  <div class="desktop-card-style make-vtx" :class="{'dark-theme': $store.state.lightMode.lightMode === 'true'}">
    <div class="exchange-container">
        <div class="exchange-container--head-title flex justify-between items-center q-pa-sm q-pl-md q-pr-sm q-pb-md">
            Staking
            <!-- <q-icon name="o_style" size="sm" /> -->
            <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 66 68" style="enable-background:new 0 0 66 68;" xml:space="preserve"> <g> <path class="st0" d="M31.4,9.2c0,0.5,0.4,0.9,0.9,0.9h0c0.5,0,0.9-0.4,0.9-0.9l0-2.4c0-0.2,0-0.5-0.2-0.7c-0.1-0.2-0.4-0.3-0.6-0.4 c-0.2,0-0.5,0-0.7,0.2s-0.3,0.4-0.4,0.6c0,0.1,0,0.2,0,0.2V9.2z"/> <path class="st0" d="M36.1,13.8c0,0.5,0.4,0.9,0.9,0.9h0c0.5,0,0.9-0.4,0.9-0.9l0-2.4c0-0.2,0-0.5-0.2-0.7 c-0.1-0.2-0.4-0.3-0.6-0.4c-0.5-0.1-1,0.3-1.1,0.8c0,0.1,0,0.2,0,0.2V13.8z"/> <path class="st0" d="M26.4,13.8c0,0.5,0.4,0.9,0.9,0.9h0c0.5,0,0.9-0.4,0.9-0.9l0-2.4c0-0.2,0-0.5-0.2-0.7 c-0.1-0.2-0.4-0.3-0.6-0.4c-0.2,0-0.5,0-0.7,0.2c-0.2,0.1-0.3,0.4-0.4,0.6c0,0.1,0,0.2,0,0.2V13.8z"/> <path class="st0" d="M32.2,11.7c-0.4,0.1-0.7,0.4-0.8,0.9v6.9c0,0,0,0.1,0,0.1c0.1,0.5,0.5,0.8,0.9,0.8c0,0,0.1,0,0.1,0 c0.4-0.1,0.7-0.4,0.8-0.9l0-7C33.1,12,32.7,11.6,32.2,11.7z"/> <path class="st0" d="M36.9,15.5c-0.4,0.1-0.7,0.4-0.8,0.9v4.3c0,0,0,0.1,0,0.1c0.1,0.5,0.5,0.8,0.9,0.8c0,0,0.1,0,0.1,0 c0.4-0.1,0.7-0.4,0.8-0.9l0-4.3C37.8,15.8,37.4,15.4,36.9,15.5z"/> <path class="st0" d="M41,21.2c0.2,0.2,0.4,0.3,0.6,0.3c0,0,0,0,0.1,0c0.5,0,0.9-0.4,0.9-0.9v-2.5c0-0.5-0.4-0.9-0.9-0.9 s-0.9,0.4-0.9,0.9l0,2.4C40.8,20.8,40.9,21,41,21.2z"/> <path class="st0" d="M22.6,21.2c0.2,0.2,0.4,0.3,0.6,0.3c0,0,0,0,0.1,0c0.5,0,0.9-0.4,0.9-0.9v-2.5c0-0.5-0.4-0.9-0.9-0.9 s-0.9,0.4-0.9,0.9l0,2.4C22.4,20.8,22.5,21,22.6,21.2z"/> <path class="st0" d="M25.6,38c1.9,1.8,4.3,2.7,6.9,2.7c0.1,0,0.2,0,0.3,0c5.3-0.2,9.6-4.5,9.8-9.8v-7.8c0-0.2-0.1-0.5-0.3-0.7 c-0.2-0.2-0.4-0.3-0.7-0.3c-0.2,0-0.5,0.1-0.7,0.3c-0.2,0.2-0.3,0.4-0.3,0.7v2c-2.7-3.9-7.9-5.4-12.4-3.4c-1.7,0.8-3.1,1.9-4.2,3.4 v-2c0-0.5-0.4-0.9-0.9-0.9s-0.9,0.4-0.9,0.9v7.8c0,0,0,0,0,0C22.5,33.6,23.6,36.1,25.6,38z M26.6,25.1c1.6-1.6,3.6-2.4,5.9-2.4 c4.6,0,8.3,3.7,8.3,8.3c0,4.6-3.7,8.3-8.3,8.3c0,0,0,0,0,0c-4.6,0-8.3-3.7-8.3-8.3C24.2,28.7,25.1,26.6,26.6,25.1z"/> <path class="st0" d="M27.2,15.5c-0.4,0.1-0.7,0.4-0.8,0.9V21c0,0,0,0.1,0,0.1c0,0.2,0.2,0.5,0.4,0.6c0.2,0.1,0.4,0.2,0.5,0.2 c0,0,0.1,0,0.1,0c0.4-0.1,0.7-0.4,0.8-0.9l0-4.7C28.2,15.8,27.7,15.4,27.2,15.5z"/> <path class="st0" d="M52,42.9c-0.9-1.6-2.9-2.2-4.6-1.3l-10.1,4.8c-0.4-0.6-1-1.1-1.6-1.3l-7.2-3.7c-0.9-0.4-1.8-0.7-2.8-0.7h-5.9 c-3.4,0-6.1,2.8-6.1,6.1v2.5c0,1.5,1,2.8,2.4,3.3l10.4,3.5c0.9,0.3,1.8,0.4,2.8,0.4c0,0,0,0,0,0c0.7,0,1.5-0.1,2.2-0.3l8-2.1 c0.5-0.2,1-0.4,1.5-0.7l9.8-5.7c0.8-0.5,1.4-1.2,1.6-2.1S52.4,43.7,52,42.9z M50.1,46.1c-0.1,0-0.2,0-0.2,0.1l-9.8,5.7 c-0.4,0.2-0.7,0.4-1.1,0.5l-8,2.1c-1.3,0.4-2.7,0.3-4-0.1l-10.4-3.4c-0.7-0.2-1.2-0.9-1.2-1.7v-2.5c0-2.4,2-4.4,4.4-4.4h5.9 c0.7,0,1.4,0.2,2,0.5l7.2,3.7c0.9,0.3,1.3,1.3,1,2.1c0,0,0,0.1-0.1,0.1c-0.4,0.9-1.4,1.3-2.2,1l-8-3.7c-0.5-0.1-1,0.1-1.1,0.6 c-0.1,0.4,0,0.8,0.4,1l8,3.7c0.9,0.4,1.8,0.4,2.7,0c0.9-0.4,1.5-1,1.9-1.9c0.2-0.5,0.3-1,0.3-1.6l10.3-4.9c0.4-0.2,0.9-0.3,1.3-0.2 c0.4,0.1,0.8,0.4,1,0.8C51,44.6,50.8,45.6,50.1,46.1z"/> <path class="st0" d="M27.9,33.6C27.9,33.6,27.9,33.6,27.9,33.6L27.9,33.6l4.3,3.6c0,0,0,0,0,0c0.1,0,0.1,0.1,0.2,0.1c0,0,0,0,0,0 c0,0,0,0,0,0c0,0,0,0,0,0h0c0,0,0,0,0,0h0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0h0c0,0,0,0,0,0c0,0,0,0,0,0h0c0,0,0,0,0,0h0 c0,0,0,0,0,0h0c0,0,0,0,0,0c0,0,0,0,0,0h0c0,0,0,0,0,0h0c0,0,0,0,0,0c0,0,0,0,0,0h0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0 c0,0,0,0,0,0h0c0,0,0,0,0,0s0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0h0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0h0 c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0h0c0,0,0,0,0,0c0,0,0,0,0,0s0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0h0c0,0,0,0,0,0 c0.1,0,0.1,0,0.2-0.1l4.1-3.6c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0.1-0.1,0.1-0.2,0.1-0.2V26c0,0,0,0,0-0.1 c0-0.1,0-0.1-0.1-0.1c0,0-0.1-0.1-0.1-0.1c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0c-0.1,0-0.1,0-0.2,0.1c0,0-0.1,0.1-0.1,0.1 c0,0,0,0,0,0.1L33.5,33h-2.3l-2.8-7.1c0,0,0,0,0-0.1c0,0-0.1-0.1-0.1-0.1c0,0-0.1,0-0.1-0.1c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0 c0,0-0.1,0.1-0.1,0.1s-0.1,0.1-0.1,0.2c0,0,0,0,0,0.1v7.4c0,0,0,0,0,0s0,0,0,0s0,0,0,0C27.8,33.5,27.8,33.5,27.9,33.6 C27.9,33.6,27.9,33.6,27.9,33.6z M36.2,28.1V33h-1.8L36.2,28.1z M34.1,33.7h1.5l-2.3,2L34.1,33.7z M33.3,33.7L32.4,36l-0.9-2.2 H33.3z M31.5,35.8l-2.4-2h1.6L31.5,35.8z M28.5,28l2,5h-2V28z"/> </g> </svg>
        </div>
        <div class="row items-center q-pa-md">
            <div class="col-7 p-desc q-pb-sm">
              10000 VTX required
            </div>
            <div class="col-5 flex justify-end">
                <q-btn unelevated class="qbtn-start" color="black" @click="goToExchange" :text-color="$store.state.lightMode.lightMode === 'false' ? 'black':'white'" label="Get VTX Now" />
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
    async setHighestVTXAccount () {
      let tableDatas = (await this.$store.state.wallets.tokens).filter((c) => {
        if (c.type === 'vtx') {
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

                &.qbtn-start2 {
                    margin-left: 20px;
                    margin-bottom: -10px;

                    /deep/ .q-btn__wrapper {
                        min-height: unset;
                        padding: 0px 10px;

                        .q-btn__content {
                            text-transform: initial;
                            font-size: 12px;
                        }
                    }
                }

                /deep/ .q-btn__wrapper {
                    min-height: unset;
                    padding: 0px 10px;

                    .q-btn__content {
                        text-transform: initial;
                        font-size: 10px;
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
      min-height: 138px;
      margin: -3px;
      &--head-title{
        // border-bottom: 1px solid #CCC;
        // background-color: rgba(#CCC, .1);
        font-size: 16px;
        font-weight: 700;
      }
      .row{}
      .qbtn-start{
        text-transform: initial !important;
        background: transparent !important;
        border: 1px solid rgba(#CCC, .7);
        font-size: 10px !important;
        border-radius: 40px;
        min-height: 20px;
        margin-bottom: 4px;
      }
    }
    .svg-icon{
      fill: rgba(#333, .6);
      width: 35px;
      height: 30px;
      max-width: unset;
      transform: scale(1);
    }
</style>

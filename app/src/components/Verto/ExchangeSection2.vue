<template>
    <div class="desktop-card-style make-vtx" :class="{'dark-theme': $store.state.lightMode.lightMode === 'true'}">
        <div class="exchange-container">
            <div class="exchange-container--head-title flex justify-between items-center q-pa-sm q-pl-md q-pr-sm q-pb-md" style="background: url('statics/bg3d1.png');">
                Exchange
                <!-- <q-icon name="o_style" size="sm" /> -->
                <!-- <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 66 68" style="enable-background:new 0 0 66 68;" xml:space="preserve"> <g> <path class="st0" d="M14.3,26.5c0.4,0.1,0.9-0.1,1.1-0.5c3.9-10.3,15.5-15.5,25.8-11.6c6.6,2.5,11.4,8.4,12.6,15.3v0 c0.1,0.5,0.5,0.8,0.9,0.8h0.1l0,0c0.5-0.1,0.9-0.6,0.8-1.1c-1.3-7.6-6.6-14-13.8-16.8c-5.5-2.1-11.4-1.9-16.7,0.5 c-5.3,2.4-9.4,6.7-11.5,12.2l0,0.1c-0.1,0.2,0,0.5,0.1,0.7S14,26.4,14.3,26.5z"/> <path class="st0" d="M60.8,29.8c-0.4-0.3-0.9-0.3-1.3,0l-4.7,4.9L49.9,30c-0.4-0.4-1-0.4-1.3,0c-0.4,0.4-0.4,1,0,1.4l4.9,4.7 c0.4,0.3,0.8,0.5,1.3,0.5c0,0,0,0,0.1,0c0.5,0,1-0.2,1.3-0.6l4.7-4.9C61.2,30.7,61.2,30.1,60.8,29.8z"/> <path class="st0" d="M54.2,38.9c-0.5-0.2-1,0.1-1.2,0.6c-1.9,5-5.6,9-10.4,11.2s-10.3,2.4-15.3,0.5c-6.6-2.5-11.4-8.4-12.6-15.3 c-0.1-0.5-0.6-0.8-1.1-0.7c-0.2,0-0.5,0.2-0.6,0.4c-0.1,0.2-0.2,0.5-0.2,0.7c1,5.8,4.2,10.8,8.9,14.1c3.7,2.6,8.1,4,12.6,4 c1.2,0,2.5-0.1,3.7-0.3c1.8-0.3,3.7-0.9,5.4-1.6c5.3-2.4,9.4-6.9,11.4-12.3C54.9,39.7,54.7,39.1,54.2,38.9z"/> <path class="st0" d="M18.5,36c0.2,0.2,0.4,0.3,0.7,0.3c0.2,0,0.5-0.1,0.7-0.3c0.2-0.2,0.3-0.4,0.3-0.7c0-0.3-0.1-0.5-0.3-0.7 l-4.8-4.8c-0.4-0.4-0.8-0.6-1.3-0.6c-0.5,0-1,0.2-1.4,0.6l-4.8,4.8c-0.4,0.4-0.3,1,0.1,1.4c0.4,0.3,0.9,0.3,1.3,0l4.8-4.8L18.5,36z "/> <path class="st0" d="M43.9,20.9c-0.1,0-0.2-0.1-0.2-0.1c-0.1,0-0.2,0-0.3,0c-0.1,0-0.2,0.1-0.3,0.1c-0.1,0.1-0.2,0.1-0.2,0.2 c0,0,0,0.1-0.1,0.1l-5.9,15.8h-5.2l-6.2-15.8c0,0,0-0.1-0.1-0.1c-0.1-0.1-0.1-0.2-0.2-0.2c-0.1-0.1-0.2-0.1-0.3-0.1 c-0.1,0-0.2,0-0.3,0c-0.1,0-0.2,0-0.2,0.1c-0.1,0.1-0.2,0.1-0.2,0.2c-0.1,0.1-0.1,0.2-0.1,0.3c0,0,0,0.1,0,0.1v16.3c0,0,0,0,0,0 s0,0,0,0c0,0.2,0.1,0.4,0.2,0.5c0,0,0,0,0,0h0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0l9.5,8.1c0,0,0,0,0,0h0 c0.1,0.1,0.2,0.1,0.4,0.1c0,0,0,0,0,0c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0c0.1,0,0.3-0.1,0.4-0.2c0,0,0,0,0,0l9.2-8.1 c0.2-0.1,0.3-0.3,0.3-0.6V21.6c0,0,0-0.1,0-0.1c0-0.1-0.1-0.2-0.1-0.3C44.1,21.1,44,21,43.9,20.9z M25.6,25.6l4.5,11.6h-4.5V25.6z M26.9,38.6h3.8l1.9,4.9L26.9,38.6z M34.4,43.9l-2.1-5.3h4L34.4,43.9z M36.1,43.5l1.8-4.8h3.7L36.1,43.5z M42.8,37.1h-4.3l4.3-11.4 V37.1z"/> </g> </svg> -->
            </div>
            <div class="row items-center q-pl-md q-pr-md scale">
                <div class="col col-8">
                    <i class="step-1-lab flex">Step<b>1</b> Select coin to send</i>
                    <div class="call-action">
                        <q-select :light="$store.state.lightMode.lightMode === 'false'" :dark="$store.state.lightMode.lightMode === 'true'" separator rounded outlined class="select-input" v-model="depositCoin" use-input @filter="filterDepositCoin" :disabled="!depositCoinOptions" :loading="!depositCoinOptions" :options="depositCoinOptions">
                            <template v-slot:option="scope">
                                <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                    <q-item-section avatar>
                                        <q-icon class="option--avatar option--avatar__custom" :name="`img:${scope.opt.image}`" />
                                    </q-item-section>
                                    <q-item-section dark>
                                        <q-item-label v-html="scope.opt.label" />
                                        <q-item-label v-if="scope.opt.value.toLowerCase() !== scope.opt.label.toLowerCase()" caption>{{ scope.opt.value }}</q-item-label>
                                        <q-item-label v-if="scope.opt.amount" caption>{{ scope.opt.amount }}</q-item-label>
                                        <q-item-label v-if="scope.opt.name" caption>{{ scope.opt.name }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </template>
                            <template v-slot:selected>
                                <q-item v-if="depositCoin">
                                    <q-item-section avatar>
                                        <q-icon class="option--avatar option--avatar__custom" :name="`img:${depositCoin.image}`" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label v-html="depositCoin.label" />

                                    </q-item-section>
                                </q-item>
                                <q-item v-else>
                                </q-item>
                            </template>
                        </q-select>
                    </div>
                    <i class="step-2-lab step-1-lab flex ">Step<b>2</b> Select coin to receive</i>
                    <div class="call-action">
                        <q-select :light="$store.state.lightMode.lightMode === 'false'" :dark="$store.state.lightMode.lightMode === 'true'" separator rounded outlined class="select-input" use-input @filter="filterDestinationCoin" v-model="destinationCoin" :disabled="!destinationCoinOptions" :loading="!destinationCoinOptions" :options="destinationCoinOptions">
                            <template v-slot:option="scope">
                                <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                    <q-item-section avatar>
                                        <q-icon class="option--avatar option--avatar__custom" :name="`img:${scope.opt.image}`" />
                                    </q-item-section>
                                    <q-item-section dark>
                                        <q-item-label v-html="scope.opt.label" />
                                        <q-item-label v-if="scope.opt.value.toLowerCase() !== scope.opt.label.toLowerCase()" caption>{{ scope.opt.value }}</q-item-label>
                                        <q-item-label v-if="scope.opt.amount" caption>{{ scope.opt.amount }}</q-item-label>

                                    </q-item-section>
                                </q-item>
                            </template>
                            <template v-slot:selected>
                                <q-item v-if="destinationCoin">
                                    <q-item-section avatar>
                                        <q-icon class="option--avatar option--avatar__custom" :name="`img:${destinationCoin.image}`" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label v-html="destinationCoin.label" />
                                    </q-item-section>
                                </q-item>
                                <q-item v-else>
                                </q-item>
                            </template>
                        </q-select>
                    </div>
                    <div class="text-red" v-if="error">
                        {{error}}
                    </div>
                </div>
                <div class="col-4 flex justify-end q-pb-sm">
                    <q-btn unelevated class="qbtn-start" color="black" @click="goToExchange" :text-color="$store.state.lightMode.lightMode === 'false' ? 'black':'white'" label="Next" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import store from '@/store'
// const url = 'https://api.coinswitch.co'
// let headers = {
//   'x-api-key': process.env[store.state.settings.network].COINSWITCH_APIKEY
// }
import {
  mapState
} from 'vuex'
import DexInteraction from '../../mixins/DexInteraction'
export default {
  name: 'ExchangeSection',
  components: {},
  data () {
    return {
      error: null,
      depositCoin: {
        label: 'EOS',
        value: 'eos',
        image: 'https://files.coinswitch.co/public/coins/eos.png'
      },
      depositCoinOptions: null,
      depositCoinUnfilter: null,
      destinationCoin: {
        label: 'VTX',
        value: 'vtx',
        image: 'https://raw.githubusercontent.com/BlockABC/eos-tokens/master/tokens/volentixgsys/VTX.png'
      },
      destinationCoinOptions: null,
      destinationCoinUnfilter: null
    }
  },
  watch: {
    coins: {
      deep: true,
      handler (value) {
        this.initData()
      }
    }
  },
  mounted () {
    this.initData()
  },
  computed: {
    ...mapState('settings', ['coins'])
  },
  methods: {
    initData () {
      this.depositCoinOptions = this.getAllCoins()

      this.depositCoinUnfilter = this.depositCoinOptions
      this.destinationCoinUnfilter = this.depositCoinUnfilter
      this.destinationCoinOptions = this.depositCoinOptions
      /*
      if (this.$store.state.settings.dexData.depositCoin) {
        this.depositCoin = this.depositCoinOptions.find(o => o.value.toLowerCase() === this.$store.state.settings.dexData.depositCoin.value.toLowerCase())
      } else {
        this.depositCoin = this.depositCoinOptions.find(o => o.value.toLowerCase() === 'eos')
      }

      if (this.$store.state.settings.dexData.destinationCoin) {
        this.destinationCoin = this.depositCoinOptions.find(o => o.value.toLowerCase() === this.$store.state.settings.dexData.destinationCoin.value.toLowerCase())
      }
      */
    },
    goToExchange () {
      // console.log('this.depositCoin', this.depositCoin)
      this.checkPair()
      if (this.dex) {
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
      }
    },
    filterDepositCoin (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.depositCoinOptions = this.depositCoinUnfilter.filter(v => v.value.toLowerCase().indexOf(needle) > -1 || v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterDestinationCoin (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.destinationCoinOptions = this.destinationCoinUnfilter.filter(v => v.value.toLowerCase().indexOf(needle) > -1 || v.label.toLowerCase().indexOf(needle) > -1)
      })
    }
  },
  mixins: [DexInteraction]
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.make-vtx {
    .row {
        &.scale{
            .col-8{
                transform: scale(.8) translate(-20px, -5px);
            }
        }
        .col {
            .step-1-lab {
                font-size: 8px;
                color: #7272FA;
                font-style: normal;
                background: #FFF;
                font-weight: $regular;
                margin-bottom: -5px;
                margin-top: -10px;
                margin-left: 8px;
                position: relative;
                z-index: 2;
                padding: 0px 5px;
                b {
                    width: 14px;
                    height: 14px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    background-color: #7272FA;
                    border-radius: 20px;
                    color: #FFF;
                    margin: 0px 2px;
                    font-size: 8px;
                }

                &.step-2-lab {
                    margin-top: 5px;
                }
            }

            img {
                &.picto {
                    max-width: 120px;
                    transform: translateX(-15px);
                }
            }

            strong {
                margin-bottom: 0px;
                line-height: 16px;
                font-size: 12px;
                padding-right: 25px;
                width: 100%;
            }

            // .qbtn-start {
            //     border-radius: 30px;
            //     height: 24px;
            //     background: #00D0CA !important;
            //     width: 70px;
            //     margin-left: 0px;

            //     /deep/ .q-btn__wrapper {
            //         min-height: unset;
            //         padding: 0px 10px;

            //         .q-btn__content {
            //             text-transform: initial;
            //             font-size: 12px;
            //         }
            //     }
            // }

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
        width: 140px;
        height: $height;

        /deep/ .q-field__marginal {
            height: $height;
            min-height: unset;
        }

        /deep/ .q-field__control {
            height: $height;
            min-height: unset;

            .option--avatar__custom {
                font-size: 19px;
                max-width: 20px;
                max-height: 20px;
                border: none;
                margin-left: 0px;
            }

            .q-field__native {
                padding-left: 0px;
                padding-top: 0px;
                padding-bottom: 0px;
                height: $height;
                min-height: unset;

                .q-field__input {
                    max-width: 50px !important;
                    min-width: unset !important;
                    position: absolute;
                    left: 60px;
                    font-size: 10px;
                }

                .q-item__label {
                    font-size: 10px;
                    font-weight: 600;
                    margin-bottom: -2px;
                    margin-left: -10px;
                }

                .q-item {
                    padding: 0px;
                    padding-left: 0px;
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
        .row .col .step-1-lab{
            color: #FFF;
            background: #04111F;
        }
    }
}

.earn-exchange {
    font-size: 18px !important;
    font-weight: $bold;
    margin-bottom: 10px !important;
    transform: translateY(-20px);
}
.exchange-container{
    min-height: 138px;
    margin: -3px;
    &--head-title{
        // border-bottom: 1px solid #CCC;
        // background-color: rgba(#CCC, .1);
        font-size: 16px;
        font-weight: 700;
        height: 45px;
        margin-bottom: 10px;
        padding-top: 11px;
        color: #FFF;
        background-size: 100% auto !important;
        background-position: 0px -30px !important;
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
        min-width: 90px;
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

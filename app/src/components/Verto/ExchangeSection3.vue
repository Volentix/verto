<template>
    <div class="desktop-card-style make-vtx" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
        <div class="exchange-container" :class="{'dark': $store.state.settings.lightMode === 'true'}" :style="$store.state.settings.lightMode === 'true' ? 'background: url(statics/bg3d1.png)':'background: url(statics/bg3d1light.png)'">
            <div v-if="$store.state.settings.lightMode === 'true'" class="exchange-container--head-title flex justify-between items-center q-pa-sm q-pl-md q-pr-sm q-pb-md">Exchange</div>
            <div v-else class="exchange-container--head-title flex justify-between items-center q-pa-sm q-pl-md q-pr-sm q-pb-md lightmd">Exchange</div>
            <div class="row call-action-row items-center q-pt-sm q-pl-md q-pr-md">
                <div class="col q-pr-sm col-3">
                    <i class="step-2-lab step-1-lab flex ">Buy</i>
                    <div class="call-action">
                        <q-select v-if="destinationCoinOptions" :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" separator rounded outlined class="select-input" use-input @filter="filterDestinationCoin" v-model="destinationCoin" :disabled="!destinationCoinOptions" :loading="!destinationCoinOptions" :options="destinationCoinOptions">
                            <template v-slot:option="scope">
                                <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                    <q-item-section avatar>
                                        <q-icon class="option--avatar option--avatar__custom" :name="`img:${scope.opt.image}`" />
                                    </q-item-section>
                                    <q-item-section dark>
                                        <q-item-label v-html="scope.opt.label" />
                                        <q-item-label v-if="scope.opt.value.toLowerCase() !== scope.opt.label.toLowerCase()" caption>{{ scope.opt.value }}</q-item-label>

                                    </q-item-section>
                                </q-item>
                            </template>
                            <template v-slot:selected>
                                <q-item v-if="destinationCoin">
                                    <q-item-section avatar>
                                        <q-icon class="option--avatar option--avatar__custom" :name="`img:${destinationCoin.image}`" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label v-html="destinationCoin.value.toUpperCase()" />
                                    </q-item-section>
                                </q-item>
                                <q-item v-else>
                                </q-item>
                            </template>
                        </q-select>
                    </div>
                </div>
                <div class="col flex items-center q-pl-sm col-1 call-action-col">
                  <q-icon name="swap_horiz" size="sm" class="swap_horiz" />
                </div>
                <div class="col flex items-center q-pl-md col-3 call-action-col call-action-col--with">
                    <!-- <i class="step-1-lab flex">Send</i> -->
                    <i class="step-3-lab step-1-lab flex ">With</i>
                    <div class="call-action">
                        <q-select v-if="depositCoinOptions" :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" separator rounded outlined class="select-input" v-model="depositCoin" use-input @filter="filterDepositCoin" :disabled="!depositCoinOptions" :loading="!depositCoinOptions" :options="depositCoinOptions">
                            <template v-slot:option="scope">
                                <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
                                    <q-item-section avatar>
                                        <q-icon class="option--avatar option--avatar__custom" :name="`img:${scope.opt.image}`" />
                                    </q-item-section>
                                    <q-item-section dark>
                                        <q-item-label v-html="scope.opt.label" />
                                        <q-item-label v-if="scope.opt.value.toLowerCase() !== scope.opt.label.toLowerCase()" caption>{{ scope.opt.value }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </template>
                            <template v-slot:selected>
                                <q-item v-if="depositCoin">
                                    <q-item-section avatar>
                                        <q-icon class="option--avatar option--avatar__custom" :name="`img:${depositCoin.image}`" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label v-html="depositCoin.value.toUpperCase()" />
                                    </q-item-section>
                                </q-item>
                                <q-item v-else>
                                </q-item>
                            </template>
                        </q-select>
                    </div>
                    <div class="text-red" v-if="error && false">{{error}}</div>
                </div>
                <div class="col-5 flex q-pt-xs">
                    <q-btn unelevated class="qbtn-start" color="black" @click="goToExchange" :text-color="$store.state.settings.lightMode === 'false' ? 'black':'white'" label="Go" />
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

import DexInteraction from '../../mixins/DexInteraction'
export default {
  name: 'ExchangeSection',
  components: {},
  data () {
    return {
      error: null,
      depositCoin: {
        label: 'ETH',
        value: 'eth',
        image: 'https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png'
      },
      depositCoinOptions: null,
      depositCoinUnfilter: null,
      destinationCoin: {
        label: 'VTX',
        value: 'vtx',
        image: 'statics/icons/favicon-32x32.png'
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
  methods: {
    initData () {
      this.depositCoinOptions = this.getAllCoins()
      this.depositCoinOptions = this.getUniqueTokens(this.depositCoinOptions)

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
      this.$store.state.investment.defaultAccount = null
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
        .call-action-col{
          position: relative;
          &--with{
            margin-left: -10px;
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
                  position: absolute;
                  top: 15px;
                  left: 13px;
                  font-size: 10px;
                  font-weight: $light;
                  background: transparent !important;
                }
                &.step-3-lab {
                  position: absolute;
                  top: 0px;
                  left: 13px;
                  font-size: 10px;
                  font-weight: $light;
                  background: transparent !important;
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
        width: 90px;
        height: $height;
        cursor: pointer;
        /deep/ .q-field__marginal {
            height: $height;
            min-height: unset;
        }

        /deep/ .q-field__control {
            height: $height;
            min-height: unset;
            .q-select__dropdown-icon{
                display: none;
            }
            &:before{
                display: none;
            }
            .option--avatar__custom {
                font-size: 30px;
                max-width: 24px;
                max-height: 24px;
                border: none;
                margin-left: -4px;
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
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: -1px;
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
    height: 100px;
    margin: -3px;
    background-size: auto calc(100% + 20px) !important;
    background-position: -10px -10px !important;
    background-repeat: no-repeat !important;
    &.dark{
      background-size: auto 100% !important;
      background-position: calc(100% + 45px) 0px !important;
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
    &--head-title{
        border-bottom: 1px solid rgba(#CCC, 0);
        // background-color: rgba(#CCC, .1);
        font-size: 16px;
        font-weight: 700;
        height: 45px;
        margin-bottom: -5px;
        padding-top: 11px;
        color: #FFF;
        background-size: 90% auto !important;
        background-position: 100% -42px !important;
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
        margin-bottom: 5px;
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
.call-action-row{
    position: relative;
    padding-top: 10px;
    .swap_horiz{
        margin-left: -10px;
        margin-right: 5px;
    }
    .text-red{
        position: absolute;
        font-size: 12px;
        bottom: -20px;
        width: 100%;
        left: 0px;
        text-align: center;
    }
}
</style>

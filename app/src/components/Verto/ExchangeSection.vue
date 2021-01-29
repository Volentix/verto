<template>
<div class="desktop-card-style make-vtx q-mb-sm" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <br>
    <div class="row flex justify-between q-pb-sm q-pt-sm">
        <div class="col col-8 flex items-center q-pl-md" style="min-height: 140px">
            <strong class="earn-exchange">Exchange </strong>
            <i class="step-2-lab step-1-lab  flex ">Step<b>1</b> Select coin to send</i>
            <div class="call-action">
                <q-select :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" separator rounded outlined class="select-input" v-model="depositCoin" use-input @filter="filterDepositCoin" :disabled="!depositCoinOptions" :loading="!depositCoinOptions" :options="depositCoinOptions">
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
                <q-select :light="$store.state.settings.lightMode === 'false'" :dark="$store.state.settings.lightMode === 'true'" separator rounded outlined class="select-input" use-input @filter="filterDestinationCoin" v-model="destinationCoin" :disabled="!destinationCoinOptions" :loading="!destinationCoinOptions" :options="destinationCoinOptions">
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
        <div class="col col-4 flex items-center">
            <img src="statics/exchange_picto.svg" class="full-width picto" alt="">
            <q-btn unelevated class="qbtn-start" color="black" @click="goToExchange" text-color="white" label="Next" />
        </div>
    </div>
    <br>
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
        label: 'ETH',
        value: 'eth',
        image: 'https://files.coinswitch.co/public/coins/eth.png'
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
        .col {
            .step-1-lab {
                font-size: 8px;
                color: #7272FA;
                font-style: normal;
                background: #FFF;
                font-weight: $regular;
                margin-bottom: -13px;
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

                &.step-2-lab {}
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

            .qbtn-start {
                border-radius: 30px;
                height: 24px;
                background: #00D0CA !important;
                width: 70px;
                margin-left: 0px;

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
</style>

<template>
  <div class="desktop-card-style make-vtx q-mb-sm">
    <div class="row flex justify-between q-pb-lg q-pt-lg">
      <div class="col col-8 flex items-center q-pl-md" style="min-height: 120px">
        <strong>Convert any to any coin</strong>
        <i class="step-1-lab flex ">Step<b>1</b> Select coin to send</i>
        <div class="call-action">
          <q-select
            light
            separator
            rounded
            outlined
            class="select-input"
            v-model="depositCoin"
            use-input
            @filter="filterDepositCoin"
            :disabled="!depositCoinOptions"
            :loading="!depositCoinOptions"
            :options="depositCoinOptions"
            >
            <template v-slot:option="scope">
              <q-item
                class="custom-menu"
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section avatar>
                  <q-icon class="option--avatar option--avatar__custom" :name="`img:${scope.opt.image}`" />
                </q-item-section>
                <q-item-section dark>
                  <q-item-label v-html="scope.opt.label" />
                  <q-item-label caption>{{ scope.opt.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected>
              <q-item
                v-if="depositCoin"
              >
                <q-item-section avatar>
                  <q-icon class="option--avatar option--avatar__custom" :name="`img:${depositCoin.image}`" />
                </q-item-section>
                <q-item-section>
                  <q-item-label v-html="depositCoin.label" />
                  <q-item-label caption>{{ depositCoin.value }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-else>
              </q-item>
            </template>
          </q-select>
        </div>
        <i class="step-2-lab step-1-lab flex ">Step<b>2</b> Select coin to receive</i>
        <div class="call-action">
          <q-select
            light
            separator
            rounded
            outlined
            class="select-input"
            v-model="depositCoin"
            use-input
            @filter="filterDepositCoin"
            :disabled="!depositCoinOptions"
            :loading="!depositCoinOptions"
            :options="depositCoinOptions"
            >
            <template v-slot:option="scope">
              <q-item
                class="custom-menu"
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section avatar>
                  <q-icon class="option--avatar option--avatar__custom" :name="`img:${scope.opt.image}`" />
                </q-item-section>
                <q-item-section dark>
                  <q-item-label v-html="scope.opt.label" />
                  <q-item-label caption>{{ scope.opt.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected>
              <q-item
                v-if="depositCoin"
              >
                <q-item-section avatar>
                  <q-icon class="option--avatar option--avatar__custom" :name="`img:${depositCoin.image}`" />
                </q-item-section>
                <q-item-section>
                  <q-item-label v-html="depositCoin.label" />
                  <q-item-label caption>{{ depositCoin.value }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-else>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>
      <div class="col col-4 flex items-center">
        <img src="statics/exchange_picto.svg" class="full-width" alt="">
        <q-btn unelevated class="qbtn-start" color="black" :disable="!depositCoin" @click="goToExchange" text-color="white" label="Next" />
      </div>
    </div>
  </div>
</template>

<script>

import store from '@/store'
const url = 'https://api.coinswitch.co'
let headers = {
  'x-api-key': process.env[store.state.settings.network].COINSWITCH_APIKEY
}
export default {
  name: 'ExchangeSection',
  components: {},
  data () {
    return {
      depositCoin: null,
      depositQuantity: 0,
      depositCoinOptions: null,
      depositCoinUnfilter: null,
      destinationCoin: null,
      destinationCoinOptions: null,
      destinationCoinUnfilter: null
    }
  },
  methods: {
    goToExchange () {
      console.log('this.depositCoin', this.depositCoin)
      let coin = this.depositCoin.value
      this.$router.push({ name: 'exchange-v2', params: { coin } })
    },
    filterDepositCoin (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.depositCoinOptions = this.depositCoinUnfilter.filter(v => v.value.toLowerCase().indexOf(needle) > -1)
      })
    }
  },
  mounted () {
    const self = this
    this.$axios.get(url + '/v2/coins', { headers }).then(function (result) {
      // will be using this coins array later with the destination select
      self.coins = result.data.data
      self.depositCoinOptions = self.coins.map(function (coin) {
        if (coin.isActive === true) {
          let row = {
            'label': coin.name,
            'value': coin.symbol,
            'image': coin.logoUrl
          }
          return row
        }
      }).filter(function (el) {
        return el != null
      }).sort(function (a, b) {
        if (a.label.toLowerCase() < b.label.toLowerCase()) {
          return -1
        }
        return 1
      })

      self.depositCoinUnfilter = self.depositCoinOptions
      // console.log('depositCoinOptions', self.depositCoinOptions)
    })
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .make-vtx{
    .row{
      .col{
        .step-1-lab{
          font-size: 9px;
          color: #7272FA;
          font-style: normal;
          background: #FFF;
          font-weight: $regular;
          margin-bottom: -8px;
          margin-left: 8px;
          position: relative;
          z-index: 2;
          padding: 0px 5px;
          b{
            width: 14px;
            height: 14px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            background-color:#7272FA;
            border-radius: 20px;
            color: #FFF;
            margin: 0px 2px;
            font-size: 8px;
          }
          &.step-2-lab{}
        }
        img{
          max-width: 80px;
          transform: translateX(0px);
        }
        strong{
          margin-bottom: 0px;
          line-height: 16px;
          font-size: 12px;
          padding-right: 25px;
        }
        .qbtn-start{
          border-radius: 30px;
          height: 24px;
          background: #00D0CA !important;
          width: 50px;
          margin-left: 15px;
          /deep/ .q-btn__wrapper{
            min-height: unset;
            padding: 0px 10px;
            .q-btn__content{
              text-transform: initial;
              font-size: 10px;
            }
          }
        }
        &.chain-token{
          font-weight: $bold;
          font-size: 11px;
          font-family: $Titillium;
          .label{
            color: #494949;
          }
          strong{
            font-size: 12px;
            color: #7272FA;
            text-transform: uppercase;
          }
        }

        &.venue-icon{
          font-size: 14px;
          font-weight: $bold;
          font-family: $Titillium;
          padding-right: 20px;
          padding-left: 10px;
          // flex-basis: 130px;
          position: relative;
          color: #494949;
          img{
            width: 28px;
            height: 24px;
            margin-right: 5px;
          }
        }
        &.dropdown{

        }
      }
    }
    .select-input{
      border-radius: 100px !important;
      $height: 35px;
      width: 140px;
      height: $height;
      /deep/ .q-field__marginal{
        height: $height;
        min-height: unset;
      }
      /deep/ .q-field__control{
        height: $height;
        min-height: unset;
        .option--avatar__custom{
          font-size: 19px;
          max-width: 20px;
          max-height: 20px;
          border: none;
          margin-left: 0px;
        }
        .q-field__native{
          padding-left: 0px;
          padding-top: 0px;
          padding-bottom: 0px;
          height: $height;
          min-height: unset;
          .q-field__input{
            max-width: 50px !important;
            min-width: unset !important;
            position: absolute;
            left: 60px;
            font-size: 10px;
          }
          .q-item__label{
            font-size: 10px;
            font-weight: 600;
            margin-bottom: -2px;
            margin-left: -10px;
          }
          .q-item{
            padding: 0px;
            padding-left: 0px;
            min-height: $height;
            padding-bottom: 0px;
            .q-item__section{
              padding-right: 0px;
              min-width: 36px;
              .q-item__label + .q-item__label {
                margin-top: 0px;
              }
            }
          }
        }
      }
    }
  }
</style>

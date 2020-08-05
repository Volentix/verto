<template>
  <div class="desktop-card-style make-vtx q-mb-sm">
    <div class="row flex justify-between q-pb-xl q-pt-xl">
      <div class="col col-4 flex items-center"><img src="statics/make_vtx_bg.png" class="full-width" alt=""></div>
      <div class="col col-8 flex items-center justify-end">
        <strong v-if="highestVTXAccount !== null">Make {{estimatedReward}} VTX now!</strong>
        <strong v-else>Make VTX while you sleep !</strong>
        <div class="call-action">
          <q-btn v-if="highestVTXAccount !== null" unelevated class="qbtn-start q-mr-md" color="black" :to="`/verto/stake/2`" text-color="white" label="Stake now" />
          <q-btn v-else unelevated class="qbtn-start q-mr-sm" color="black" @click="modalBuyWithBTCETH = true" text-color="white" label="Buy with BTC/ETH" />
          <!-- <q-btn unelevated class="qbtn-start" color="black" @click="modalBuyWithEOS = true" text-color="white" label="Buy with EOS" /> -->
        </div>
      </div>
    </div>
    <q-dialog v-model="modalBuyWithBTCETH">
      <q-card class="q-pa-sm" style="width: 90%;max-width: 500px">
        <q-toolbar>
          <q-avatar><img src="statics/icon.png"></q-avatar>
          <q-toolbar-title><span class="text-weight-bold">Buy with </span> BTC / ETH / EOS</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="text-h6 flex justify-between btn-action q-mb-md">
          <a href="https://app.stex.com/en/basic-trade/pair/BTC/VTX/1D" class="border column" target="_blank"> STEX <div class="flex flex-center coins-wrapper"><img :src="`${base}btc.png`" alt=""><img :src="`${base}eth.png`" alt=""></div>
          </a>
          <a href="https://p2pb2b.io/trade/VTX_BTC" class="border column" target="_blank">P2PB2B <div class="flex flex-center coins-wrapper"><img :src="`${base}btc.png`" alt=""><img :src="`${base}eth.png`" alt=""></div></a>
          <a href="https://newdex.io/trade/volentixgsys-vtx-eos" class="column" target="_blank">NEWDEX <div class="flex flex-center coins-wrapper"><img :src="`${base}eos.png`" alt=""></div></a>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- <q-dialog v-model="modalBuyWithEOS">
      <q-card class="q-pa-sm" style="width: 90%;max-width: 400px">
        <q-toolbar>
          <q-avatar><img src="statics/icon.png"></q-avatar>
          <q-toolbar-title><span class="text-weight-bold">Buy with </span> EOS</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="text-h6 flex justify-center btn-action q-mb-md">
          <a href="https://newdex.io/trade/volentixgsys-vtx-eos" target="_blank">NEWDEX</a>
        </q-card-section>
      </q-card>
    </q-dialog> -->
  </div>
</template>

<script>
export default {
  name: 'MakeVTXSection',
  components: {

  },
  data () {
    return {
      estimatedReward: 0,
      base: 'https://files.coinswitch.co/public/coins/',
      highestVTXAccount: null,
      modalBuyWithBTCETH: false,
      modalBuyWithEOS: false
    }
  },
  async created () {
    let tableDatas = await this.$store.state.wallets.tokens.filter((c) => {
      if (c.type === 'vtx') {
        console.log('c.type', c.type)
        return c
      }
    }).slice().sort(function (a, b) {
      return b.amount - a.amount
    })
    if (tableDatas.length > 1) {

    }
    this.highestVTXAccount = tableDatas.length > 1 && tableDatas[0].amout >= 1000 ? tableDatas[0] : null
    if (this.highestVTXAccount !== undefined && this.highestVTXAccount !== null) {
      let stake_per = Math.round((0.01 + (0.001 * 10)) * 1000) / 1000
      let sendAmount = Math.round(Math.pow(10, this.highestVTXAccount.precision) * this.highestVTXAccount.amount) / Math.pow(10, this.highestVTXAccount.precision)
      this.estimatedReward = Math.round(sendAmount * stake_per * 10 * 100) / 100
      console.log('this.estimatedReward --**', this.estimatedReward)
      this.$store.commit('highestVTXAccount/updateParams', {
        chainID: this.highestVTXAccount.chain,
        tokenID: this.highestVTXAccount.type,
        accountName: this.highestVTXAccount.name
      })
      this.$store.state.highestVTXAccount.wallet = this.highestVTXAccount
      console.log('this.$store.state.highestVTXAccount.wallet > ', await this.$store.state.highestVTXAccount.wallet)
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .coins-wrapper{
    margin-top: -30px;
    margin-bottom: 30px;
    img{
      width: auto;
      height: auto;
      max-width: 26px;
      max-height: 26px;
      border: 1px solid rgba(#CCC, .2);
      border-radius: 30px;
    }
  }
  .btn-action{
    a{
      text-decoration: none;
      color: #333;
      outline: none;
      flex-basis: 33%;
      text-align: center;
      line-height: 100px;
      margin-top: 10px;
      margin-bottom: 10px;
      &.border{
        border-right: 1px solid rgba(black, .1);
      }
      &:hover{
        background-color: rgba(black, .01);
      }
    }
  }
  .make-vtx{
    .row{
      .col{
        img{
          max-width: 80px;
          transform: translateX(10px);
        }
        strong{
          margin-bottom: -10px;
          line-height: 16px;
          font-size: 16px;
          padding-right: 20px;
        }
        .qbtn-start{
          border-radius: 30px;
          height: 25px;
          background: #7272FA !important;
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
      width: 200px;
      height: $height;
      /deep/ .q-field__marginal{
        height: $height;
        min-height: unset;
      }
      /deep/ .q-field__control{
        height: $height;
        min-height: unset;
        .q-field__native{
          padding-left: 0px;
          padding-top: 0px;
          padding-bottom: 0px;
          height: $height;
          min-height: unset;
          .q-item{
            padding: 0px;
            padding-left: 18px;
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
  .q-card{
    border-radius: 25px;
    box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 35px rgba(0,0,0,0.14), 0 1px 10px rgba(0,0,0,0.12);
  }
</style>

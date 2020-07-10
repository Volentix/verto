<template>
    <q-dialog v-model="openDialog">
      <q-card class="q-pa-lg modal-dialog-wrapper" style="width: 800px; max-width: 90vw;">
        <q-toolbar>
          <q-toolbar-title><span class="text-weight-bold q-pl-sm">Add Liquidity</span></q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="text-h6">
          <div class="text-h6 q-mb-md q-pl-sm flex items-center"><h4 class="lab-title q-pr-md">Available ETH:</h4> 0.3482</div>
          <div class="row">
            <div class="col col-3">
              <q-input class="input-input" filled rounded outlined color="purple" value="0.1" suffix="MAX" />
            </div>
            <div class="col col-3 q-ml-md">
              <q-select class="select-input" filled rounded outlined color="purple" value="ETH" :options="['ETH','VTX','EOS']" />
            </div>
          </div>
          <hr style="opacity: .1" class="q-mt-lg">
          <h4 class="lab-title">Choose your Allocation</h4>
          <div class="row">
            <div class="col col-3 q-pr-md">
              <strong class="lab-sub q-pl-md">Platform</strong>
              <q-select class="select-input" filled rounded outlined color="purple" value="Balancer" :options="['Balancer','Balancer1','Balancer2']" />
            </div>
            <div class="col col-3 q-pr-md">
              <strong class="lab-sub q-pl-md">Pool</strong>
              <q-select class="select-input" filled rounded outlined color="purple" value="Balancer" :options="['RPL/WETH','Balancer1','Balancer2']" />
            </div>
            <div class="col col-3 q-pr-md text-center">
              <strong class="lab-sub q-pl-md text-center">Allocation</strong>
              <div class="lab-value flex flex-center text-center q-pl-lg q-pr-sm">90 % RPL 10% WETH</div>
            </div>
            <div class="col col-3 q-pr-md text-center">
              <strong class="lab-sub q-pl-md text-center">Output</strong>
              <div class="lab-value flex flex-center text-center q-pl-lg q-pr-sm">11.5765 RPL 0.0099 WETH</div>
            </div>
          </div>
          <hr style="opacity: .1" class="q-mt-lg">
          <h4 class="lab-title q-pb-md">Select Gas Setting</h4>
          <div class="row">
            <div class="col col-4">
               <q-btn color="white" flat class="btn-gas full-width" outlined rounded size="lg" text-color="black" label="Slow (36 Gwei ~ 12.3 Min)" />
            </div>
            <div class="col col-4 q-pl-md q-pr-md">
               <q-btn color="white" flat class="btn-gas full-width" outlined rounded size="lg" text-color="black" label="Slow (36 Gwei ~ 12.3 Min)" />
            </div>
            <div class="col col-4">
               <q-btn color="white" flat class="btn-gas full-width" outlined rounded size="lg" text-color="black" label="Slow (36 Gwei ~ 12.3 Min)" />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pr-sm q-mb-sm">
          <!-- <q-btn label="Close" flat class="yes-btn" color="primary" v-close-popup/> -->
          <q-btn unelevated class="qbtn-start" @click="openDialog = false" color="black" text-color="white" label="Confirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
export default {
  props: ['open'],
  name: 'AddLiquidityDialog',
  data () {
    return {

    }
  },
  computed: {
    function () {
      if (this.open) {
        return true
      } else {
        return false
      }
    }
  },
  updated () {
    console.log('updated() openDialog', this.open)
  },
  created () {
    console.log('created() openDialog', this.open)
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .modal-dialog-wrapper{
    .qbtn-start{
      border-radius: 30px;
      height: 44px;
      background: #00D0CA !important;
      width: 120px;
      margin-left: 0px;
      padding: 5px 10px;
      /deep/ .q-btn__wrapper{
        min-height: unset;
        padding: 0px 10px;
        .q-btn__content{
          text-transform: initial;
          font-size: 14px;
        }
      }
    }
    .lab-title{
      font-weight: $bold;
      font-size: 18px;
      font-family: $Titillium;
      color: #7272FA;
      margin: 0px;
    }
    /deep/ .btn-gas{
      border: 2px solid #CCC;
      &.active{
        border-color: #00D0CA;
      }
      .q-btn__content{
        @extend .lab-title;
        font-size: 14px;
        text-transform: initial;
      }
    }
    .lab-sub{
      font-size: 14px;
    }
    .lab-value{
      @extend .lab-title;
      font-size: 16px;
      color: #627797;
      line-height: 24px;
    }
    .input-input{
      height: 50px;
      /deep/ .q-field__control{
        height: 50px;
        min-height: unset;
        border-radius: 50px;
      }
      .btn-copy{
        height: 30px;
        position: relative;
        top: -3px;
        margin-right: 0px;
        padding: 6px 13px;
      }
      .qr-btn{
        width: 30px;
        height: 30px;
        padding-right: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img{
          width: 25px;
          height: 25px;
          position: relative;
          right: -5px;
          transform: scale3d(1, 1, 1);
        }
      }
    }
    .select-input{
      border-radius: 100px !important;
      $height: 50px;
      height: $height;
      /deep/ .q-field__marginal{
        height: $height;
        min-height: unset;
      }
      /deep/ .q-field__control{
        border-radius: 50px;
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
        border-radius: 50px;
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
</style>

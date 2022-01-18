<template>
  <div class="desktop-card-style make-vtx" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <div class="exchange-container">
      <div v-if="$store.state.settings.lightMode === 'true'" class="exchange-container--head-title flex justify-between items-center q-pa-sm q-pl-md q-pr-sm q-pb-md" style="background: url('statics/bg3d3.png');">DeFi</div>
      <div v-else class="exchange-container--head-title flex justify-between items-center q-pa-sm q-pl-md q-pr-sm q-pb-md lightmd" style="background: url('statics/bg3d3light.png');">DeFi</div>
      <div class="row items-end q-pa-md">
        <div class="col-6 p-desc">
          Earn exchange fees and pool rewards.
        </div>
        <div class="col-6 flex justify-end q-pb-sm">
          <q-btn unelevated class="qbtn-start" color="black" @click="openDialog = true" :text-color="$store.state.settings.lightMode === 'false' ? 'black':'white'" label="Add liquidity" />
        </div>
      </div>
    </div>
    <q-dialog v-model="openDialog">
      <AddLiquidityDialog />
    </q-dialog>
  </div>
</template>

<script>
import AddLiquidityDialog from './AddLiquidityDialog'

export default {
  name: 'LiquidityPoolsSection',
  components: { AddLiquidityDialog },
  data () {
    return {
      openDialog: false,
      screenSize: 0
    }
  },
  methods: {
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    }
  },
  mounted () {
    this.getWindowWidth()
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .make-vtx{
    .row{
      .header-col{
        padding-left: 10px;
        padding-right: 10px;
        h4{
          margin-top: -5px;
          line-height: 16px;
          font-size: 14px;
          padding-right: 25px;
          font-weight: $bold;
          color: #6C0DCB;
        }
        .qbtn-new{
          margin-top: -20px;
          border-radius: 5px;
          height: 24px;
          background: #C0F5F4 !important;
          width: 40px;
          margin-left: 0px;
          /deep/ .q-btn__wrapper{
            min-height: unset;
            padding: 0px 10px;
            .q-btn__content{
              text-transform: initial;
              font-size: 10px;
              color: #00D0CA;
            }
          }
        }
      }
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
          max-width: 120px;
          transform: translateX(-10px);
          margin-top: -30px;
          margin-bottom: 10px;
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
          background: #7272FA !important;
          width: 80px;
          margin-left: 0px;
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
    &.dark-theme{
      color: #FFF;
      .row .col .step-1-lab{
          color: #FFF;
          background: #04111F;
      }
    }
  }
  .earn-exchange{
    font-size: 14px;
    font-weight: $bold;
    margin-bottom: 0px;
    padding-right: 10px;
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
            padding-left: 30px;
            padding-right: 30px;
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
      .svg-icon{
        fill: #CCC;
      }
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
        border-bottom: 1px solid rgba(#CCC, .4);
        // background-color: rgba(#CCC, .1);
        font-size: 16px;
        font-weight: 700;
        height: 45px;
        margin-bottom: 10px;
        padding-top: 11px;
        color: #FFF;
        background-size: 100% auto !important;
        background-position: 30px -20px !important;
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
</style>

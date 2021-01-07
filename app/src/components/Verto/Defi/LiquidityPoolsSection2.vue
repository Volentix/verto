<template>
  <div class="desktop-card-style make-vtx" :class="{'dark-theme': $store.state.lightMode.lightMode === 'true'}">
    <div class="exchange-container">
      <div class="exchange-container--head-title flex justify-between items-center q-pa-sm q-pl-md q-pr-sm q-pb-md">
        DeFi
        <!-- <q-icon name="o_style" size="sm" /> -->
        <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 66 68" style="enable-background:new 0 0 66 68;" xml:space="preserve"> <g> <path class="st0" d="M32,20.7l4.9,4.2C37,25,37.2,25,37.3,25c0.1,0,0.2,0,0.3-0.1l4.8-4.3c0,0,0,0,0,0c0.1-0.1,0.1-0.2,0.1-0.3v0 c0,0,0,0,0,0v-8.6c0,0,0-0.1,0-0.1c0-0.1,0-0.1-0.1-0.2c0-0.1-0.1-0.1-0.2-0.1c0,0-0.1,0-0.2-0.1c-0.1,0-0.1,0-0.2,0 c-0.1,0-0.1,0-0.2,0.1c-0.1,0-0.1,0.1-0.1,0.2c0,0,0,0.1,0,0.1l-3.1,8.3H36l-3.2-8.3c0,0,0-0.1,0-0.1c0-0.1-0.1-0.1-0.1-0.2 c-0.1,0-0.1-0.1-0.2-0.1c-0.1,0-0.1,0-0.2,0c-0.1,0-0.1,0-0.2,0.1c-0.1,0-0.1,0.1-0.2,0.1c0,0.1-0.1,0.1-0.1,0.2c0,0,0,0.1,0,0.1 V20c0,0.1,0,0.1,0,0.2C31.7,20.4,31.9,20.6,32,20.7z M41.6,14.4v5.4h-2L41.6,14.4z M39.2,20.7h1.6l-2.3,2.1L39.2,20.7z M38.1,20.7 l-0.9,2.4l-0.9-2.4H38.1z M36.1,22.8l-2.5-2.1h1.6L36.1,22.8z M32.8,14.3l2.1,5.4h-2.1V14.3z"/> <path class="st0" d="M37.2,30.1c6.6,0,12-5.4,12-12s-5.4-12-12-12s-12,5.4-12,12S30.5,30.1,37.2,30.1z M37.2,8c5.5,0,10,4.5,10,10 s-4.5,10-10,10s-10-4.5-10-10S31.6,8,37.2,8z"/> <path class="st0" d="M47.4,44.4c-0.6,0-1,0.4-1,1v6.7c0,0.7-0.5,1.2-1.2,1.2H15.6c0,0,0,0,0,0c-0.7,0-1.2-0.5-1.2-1.2V22.5 c0-0.7,0.5-1.2,1.2-1.2h6.7c0.6,0,1-0.4,1-1s-0.4-1-1-1h-6.7c-1.8,0-3.2,1.4-3.2,3.2v29.6c0,1.8,1.4,3.2,3.2,3.2c0,0,0,0,0,0h29.6 c1.8,0,3.2-1.5,3.2-3.2v-6.7C48.4,44.9,48,44.4,47.4,44.4z"/> <path class="st0" d="M50.6,26.9c-4.6,0-8.4,3.8-8.4,8.4s3.8,8.4,8.4,8.4S59,40,59,35.3S55.2,26.9,50.6,26.9z M50.6,41.8 c-3.5,0-6.4-2.9-6.4-6.4s2.9-6.4,6.4-6.4s6.4,2.9,6.4,6.4S54.1,41.8,50.6,41.8z"/> <path class="st0" d="M27,38.5c0,3.8,3.1,6.9,6.9,6.9s6.9-3.1,6.9-6.9c0-3.8-3.1-6.9-6.9-6.9S27,34.7,27,38.5z M38.8,38.5 c0,2.7-2.2,4.9-4.9,4.9S29,41.2,29,38.5c0-2.7,2.2-4.9,4.9-4.9S38.8,35.8,38.8,38.5z"/> </g> </svg>
      </div>
      <div class="row items-end q-pa-md">
        <div class="col-6 p-desc">
          Earn exchange fees and pool rewards.
        </div>
        <div class="col-6 flex justify-end q-pb-sm">
          <q-btn unelevated class="qbtn-start" color="black" @click="openDialog = true" :text-color="$store.state.lightMode.lightMode === 'false' ? 'black':'white'" label="Add liquidity" />
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

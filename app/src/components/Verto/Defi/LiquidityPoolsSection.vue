<template>
  <div class="desktop-card-style make-vtx q-mb-sm" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <div v-if="screenSize > 1024">
      <br>
      <div class="row flex justify-between q-pb-sm q-pt-md">
        <div class="header-col col-12 flex justify-between items-center">
          <h4 class="q-pl-sm">DeFi</h4>
          <!-- <q-btn unelevated class="qbtn-new" @click="openDialog = true" color="black" text-color="white" label="New" /> -->
        </div>
        <div class="col col-8 flex items-center q-pl-md" style="min-height: 50px">
          <p class="earn-exchange">Earn exchange fees and pool rewards.</p>
        </div>
        <div class="col col-4 flex items-center">
          <img src="statics/liquidity_pool.png" class="full-width" alt="">
          <q-btn unelevated class="qbtn-start" @click="openDialog = true" color="black" text-color="white" label="Add liquidity" />
        </div>
      </div>
      <br>
    </div>
    <div v-else class="card-make-VTX--wrapper">
      <!-- <q-toggle v-model="active" label="Active" /> -->
      <div class="card-make-VTX--wrapper--header">
        <div class="card-make-VTX--wrapper--header__holder full-width">
          <span class="card-make-VTX--wrapper--header__holder_img">
            <img src="statics/liquidity_pool.png" class="full-width" alt="">
          </span>
          <h3 class="text-black card-make-VTX--wrapper--header__holder_title">Earn exchange fees and pool rewards.</h3>
        </div>
        <q-btn unelevated class="card-make-VTX--wrapper--header_btn" @click="openDialog = true" color="black" text-color="white" label="Add liquidity" />
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
</style>

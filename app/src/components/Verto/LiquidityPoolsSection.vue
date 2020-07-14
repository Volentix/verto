<template>
  <div class="desktop-card-style make-vtx q-mb-sm">
    <div class="row flex justify-between q-pb-lg q-pt-lg">
      <div class="header-col col-12 flex justify-between items-center">
        <h4>Liquidity pools</h4>
        <q-btn unelevated class="qbtn-new" @click="openDialog = true" color="black" text-color="white" label="New" />
      </div>
      <div class="col col-8 flex items-center q-pl-md" style="min-height: 120px">
        <p>You can invest to earn exchange fees and pool rewards</p>
      </div>
      <div class="col col-4 flex items-center">
        <img src="statics/liquidity_pool.png" class="full-width" alt="">
        <q-btn unelevated class="qbtn-start" @click="openDialog = true" color="black" text-color="white" label="Add liquidity" />
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
      openDialog: false
    }
  },
  methods: {
  },
  mounted () {
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
          font-size: 12px;
          padding-right: 25px;
          font-weight: $bold;
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
  }
</style>

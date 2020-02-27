<template>
<div>
  <div class="convert-any-coin--wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="convert-any-coin--wrapper--header">
      <h3 class="text-white convert-any-coin--wrapper--header_title">Convert any coin to VTX</h3>
      <q-btn class="convert-any-coin--wrapper--header_btn" color="black" text-color="white" label="Go to exchange" />
    </div>
    <div class="convert-any-coin--wrapper--body">
       <q-btn color="white" class="convert-any-coin--wrapper--body__btn" text-color="black">
        <template v-slot>
          <div class="icon-wrapper">
            <img src="statics/why-vtx.png" width="35px" alt="">
          </div>
          <span class="btn-title">Why VTX</span>
        </template>
       </q-btn>
       <q-btn color="white" class="convert-any-coin--wrapper--body__btn" text-color="black">
        <template v-slot>
          <div class="icon-wrapper">
            <img src="statics/buy-vtx.png" width="45px" alt="">
          </div>
          <span class="btn-title">Buy VTX</span>
        </template>
       </q-btn>
       <q-btn color="white" class="convert-any-coin--wrapper--body__btn" text-color="black">
        <template v-slot>
          <div class="icon-wrapper">
            <img src="statics/stake-vtx.png" width="35px" alt="">
          </div>
          <span class="btn-title">Stake VTX</span>
        </template>
       </q-btn>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ConvertAnyCoin',
  data () {
    return {
      active: true
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
    .convert-any-coin{
      &--wrapper{
        padding: 5% 7%;
        background-color: #0E163B;
        max-width: 95%;
        margin-left: auto;
        margin-right: auto;
        box-shadow: 0px 3px 6px 0px rgba(black, .19);
        border-radius: 20px;
        &--header{
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          &_title{
            margin: 0px;
            font-size: 22px;
            font-family: $Titillium;
            font-weight: $bold;
            letter-spacing: 1px;
            margin-top: 30px;
            margin-bottom: 10px;
          }
          &_btn{
            background: #00D0CA !important;
            font-size: 16px !important;
            text-transform: initial !important;
            border-radius: 40px;
            height: 45px;
            padding-left: 30px;
            padding-right: 30px;
          }
        }
        &--body{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding: 5% 0px;
          margin-top: 40px;
          position: relative;
          z-index: 2;
          &__btn{
            flex-basis: 32%;
            max-width: 32%;
            font-size: 14px !important;
            font-family: $Titillium;
            font-weight: $bold;
            text-transform: initial !important;
            padding-top: 10px;
            padding-bottom: 10px;
            .icon-wrapper{
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 50px;
              height: 50px;
            }
            img{
              // max-width: 40px;
              // max-height: 40px;
              // width: auto;
              // height: auto;
            }
          }
        }
        position: relative;
        &:after{
          content: '';
          width: 100%;
          display: block;
          height: 60px;
          background-color: #6C0DCB;
          position: absolute;
          z-index: 0;
          bottom: 0px;
          left: 0px;
          border-radius: 0px 0px 20px 20px;
          box-shadow: 0px 3px 6px 0px rgba(black, .19);
        }
      }
    }
</style>

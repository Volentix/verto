<template>
<div>
  <div class="convert-any-coin--wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="convert-any-coin--wrapper--header">
      <h3 class="text-white convert-any-coin--wrapper--header_title">Convert any coin to VTX</h3>
      <q-btn class="convert-any-coin--wrapper--header_btn" flat color="black" text-color="deep-purple-14" label="Go to exchange" />
      <svg class="svg_logo" fill="#FFFFFF" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58"><path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path></svg>
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
       <q-btn color="white" to="/verto/stake" class="convert-any-coin--wrapper--body__btn" text-color="black">
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
        background: linear-gradient(to bottom,#E6E7E8 0%,#FFFFFF 100%);
        max-width: 95%;
        margin-left: auto;
        margin-right: auto;
        box-shadow: 0px 3px 6px 0px rgba(black, .19);
        border-radius: 20px;
        overflow: hidden;
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
            margin-top: -10px;
            margin-bottom: -12px;
            color: #2A2A2A !important;
          }
          &_btn{
            // background: #00D0CA !important;
            font-size: 18px !important;
            text-transform: initial !important;
            border-radius: 40px;
            height: 45px;
            padding-left: 30px;
            padding-right: 0px;
          }
        }
        &--body{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding: 5% 0px;
          margin-top: 0px;
          margin-bottom: -10px;
          position: relative;
          z-index: 2;
          &__btn{
            flex-basis: 30%;
            max-width: 30%;
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
          }
        }
        position: relative;
        &:after{
          content: '';
          width: 100%;
          display: block;
          height: 50px;
          background: linear-gradient(to bottom,#6C0DCB 0%,#7272FA 100%);;
          position: absolute;
          z-index: 0;
          bottom: 0px;
          left: 0px;
          border-radius: 0px 0px 20px 20px;
          box-shadow: 0px 3px 6px 0px rgba(black, .19);
        }
      }
    }
    .svg_logo{
      position: absolute;
      top: 0px;
      left: -3px;
      width: 80px;
      opacity: .45;
    }
</style>

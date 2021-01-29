<template>
  <div class="desktop-card-style apps-section q-mb-sm" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <div class="row">
      <div class="col col-3 flex flex-center items-center logo-vtx ">
        <svg class="svg_logo q-mr-sm" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58"> <path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path> </svg>
        <!-- <img src="statics/vtx_black.svg" alt="">  -->
        Volentix
      </div>
      <div class="col"></div>
      <div class="col column item-start shape-app"><img src="statics/picto_stex7.svg" alt=""><strong>vtx</strong>Volentix Currency</div>
      <div class="col column item-start shape-app" style="flex-basis: 10px"><img src="statics/picto_verto.svg" alt=""><strong>verto</strong>Multi- Currency Wallet</div>
      <div class="col column item-start shape-app"><img src="statics/picto_stex3.svg" alt=""><strong>vdex</strong>Market Data Analysis</div>
      <div class="col"></div>
      <!-- <div class="col column item-start shape-app"><img src="statics/picto_stex5.svg" alt=""><strong>vespucci</strong>Exchange</div> -->
      <!-- <div class="col column item-start shape-app"><img src="statics/picto_stex4.svg" alt=""><strong>venue</strong>Community platform</div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppsSection',
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .apps-section{
    .row{
      .col{
        cursor: pointer;
        position: relative;
        &:after{
          content: '';
          width: 100%;
          height: 3px;
          background: #07f;
          background: linear-gradient(90deg,#0fe 0%,#07f);
          position: absolute;
          bottom: -5px;
          opacity: 0;
          transition: opacity ease .3s;
        }
        &:hover{
          &:after{
            opacity: .3;
          }
        }
        &.logo-vtx{
          font-size: 14px;
          font-weight: $bold;
          font-family: $Titillium;
          text-transform: uppercase;
          padding-right: 40px;
          flex-basis: 160px;
          position: relative;
          &:after{
            display: none;
          }
          &:before {
            content: "";
            width: 1px;
            height: 70%;
            position: absolute;
            left: 0;
            left: 132px;
            background: #07f;
            background: linear-gradient(180deg,#0fe 0%,#07f);
          }
          img{
            max-width: 25px;
            margin-right: 5px;
            margin-top: 5px;
          }
        }
        &.shape-app{
          font-size: 8px;
          font-weight: $light;
          font-family: $Titillium;
          padding-bottom: 5px;
          strong{
            font-weight: $bold;
            text-transform: uppercase;
            font-size: 10px;
            margin-top: -4px;
            margin-bottom: -2px;
          }
          img{
            max-width: 35px;
            margin-left: -9px;
          }
        }
      }
    }
    &.dark-theme{
      color: #FFF;
      .logo-vtx{
        color: #FFF;
        .svg_logo{
          fill: #FFF;
        }
      }
    }
  }
</style>

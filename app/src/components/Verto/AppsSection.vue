<template>
  <div class="desktop-card-style apps-section q-mb-sm">
    <div class="row">
      <div class="col col-3 flex flex-center items-center logo-vtx"><img src="statics/vtx_black.svg" alt=""> Volentix</div>
      <div class="col column item-start shape-app" style="flex-basis: 10px"><img src="statics/picto_verto.svg" alt=""><strong>verto</strong>Multi- Currency Wallet</div>
      <div class="col column item-start shape-app"><img src="statics/picto_verto.svg" alt=""><strong>vespucci</strong>Exchange</div>
      <div class="col column item-start shape-app"><img src="statics/picto_verto.svg" alt=""><strong>vdex</strong>Market Data Analysis</div>
      <div class="col column item-start shape-app"><img src="statics/picto_verto.svg" alt=""><strong>venue</strong>Community platform</div>
      <div class="col column item-start shape-app"><img src="statics/picto_verto.svg" alt=""><strong>vtx</strong>Volentix Currency</div>
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
          padding-right: 20px;
          flex-basis: 130px;
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
            left: 115px;
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
            font-size: 12px;
            margin-top: -6px;
            margin-bottom: -4px;
          }
          img{
            max-width: 35px;
            margin-left: -9px;
          }
        }
      }
    }
  }
</style>

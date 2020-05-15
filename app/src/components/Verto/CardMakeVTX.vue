<template>
<div>
  <div class="card-make-VTX--wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="card-make-VTX--wrapper--header">
      <div class="card-make-VTX--wrapper--header__holder full-width">
        <span class="card-make-VTX--wrapper--header__holder_img"><img src="statics/make_vtx_bg.png" alt=""></span>
        <h3 class="text-black card-make-VTX--wrapper--header__holder_title">Make VTX while you’re sleeping</h3>
      </div>
      <q-btn unelevated class="card-make-VTX--wrapper--header_btn" to="/verto/stake" color="black" text-color="white" label="Stake" />
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'CardMakeVTX',
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
    .card-make-VTX{
      &--wrapper{
        padding: 5% 7%;
        background-color: #FFFFFF;
        max-width: 95%;
        margin-left: auto;
        margin-right: auto;
        box-shadow: 0px 3px 6px 0px rgba(black, .19);
        border-radius: 20px;
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
</style>

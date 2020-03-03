<template>
<div>
  <div class="card-create-wallet--wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="card-create-wallet--wrapper--header">
      <div class="card-create-wallet--wrapper--header__holder full-width">
        <span class="card-create-wallet--wrapper--header__holder_img"><img src="statics/coins_icons/eos_bg.png" alt=""></span>
        <h3 class="text-black card-create-wallet--wrapper--header__holder_title">Create your multi-currency Verto wallet</h3>
      </div>
      <q-btn unelevated class="card-create-wallet--wrapper--header_btn" color="black" text-color="white" label="Create" />
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'CardCreateWallet',
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
    .card-create-wallet{
      &--wrapper{
        padding: 5% 7%;
        background-color: #F3F3F3;
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
                max-width: 100px;
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
          }
        }
        position: relative;
        &:after{
          content: '';
          width: 100%;
          display: block;
          height: 50px;
          background-color: #FFFFFF;
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

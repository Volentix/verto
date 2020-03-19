<template>
  <div class="card-refer--wrapper full-width">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="card-refer--wrapper--header">
      <div class="card-refer--wrapper--header__holder full-width">
        <span class="card-refer--wrapper--header__holder_img flex flex-center"><img src="statics/vtx_icon.png" alt=""></span>
        <div class="text-black card-refer--wrapper--header__holder_title">
          <div class="title">Have you been referred?</div>
          <div class="desc">You will both receive 10 VTX</div>
        </div>
      </div>
      <q-btn unelevated class="card-refer--wrapper--header_btn" color="black" text-color="white" label="Learn more" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardRefer',
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
    .card-refer{
      &--wrapper{
        padding: 4% 7%;
        background-color: #ffffff;
        max-width: 100%;
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
              font-size: 21px;
              font-family: $Titillium;
              font-weight: $bold;
              margin-top: 20px;
              line-height: 26px;
              margin-bottom: 30px;
              padding-left: 10px;
              text-align: left;
              .desc{
                font-weight: $regular;
                font-size: 17px;
              }
            }
            &_img{
              width: 80px;
              height: 80px;
              border-radius: 80px;
              overflow: hidden;
              img{
                max-width: 100px;
                margin-top: -11px;
              }
            }
          }
          &_btn{
            background-color: #6C0DCB !important;
            width: 140px;
            font-size: 16px !important;
            text-transform: initial !important;
            border-radius: 40px;
            height: 45px;
            padding-left: 30px;
            padding-right: 30px;
            margin-bottom: 0px;
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
          // box-shadow: 0px 3px 6px 0px rgba(black, .19);
        }
      }
    }
</style>

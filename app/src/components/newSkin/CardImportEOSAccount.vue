<template>
<div>
  <div class="card-import-EOS-account--wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="card-import-EOS-account--wrapper--header">
      <div class="card-import-EOS-account--wrapper--header__holder full-width">
        <span class="card-import-EOS-account--wrapper--header__holder_img"><img src="statics/import_bg.png" alt=""></span>
        <h3 class="text-black card-import-EOS-account--wrapper--header__holder_title">Import EOS account</h3>
      </div>
      <div class="card-import-EOS-account--wrapper--header_btns">
        <q-btn unelevated class="card-import-EOS-account--wrapper--header_btn white" color="black" text-color="white" label="Public key" />
        <q-btn unelevated class="card-import-EOS-account--wrapper--header_btn" color="black" text-color="white" label="Private key" />
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'CardImportEOSAccount',
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
    .card-import-EOS-account{
      &--wrapper{
        padding: 5% 7%;
        background-color: #FFF;
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
              }
            }
          }
          &_btns{
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
          }
          &_btn{
            background: #7272FA !important;
            font-size: 16px !important;
            text-transform: initial !important;
            border-radius: 40px;
            height: 45px;
            padding-left: 20px;
            padding-right: 20px;
            margin-bottom: 10px;
            margin-left: 10px;
            &.white{
              border: 1px solid #B0B0B0 !important;
              color: #B0B0B0 !important;
              background: #FFF !important;
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

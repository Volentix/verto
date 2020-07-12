<template>
  <q-page class="column text-black bg-grey-12" :class="osName.toLowerCase() === 'windows' ? 'desktop-marg': 'mobile-pad'">
    <div class="desktop-version" v-if="osName.toLowerCase() === 'windows'">
      <div class="row">
        <div class="col col-md-3">
          <div class="wallets-container">
            <profile-header :isMobile="false" class="marg" version="type2222" />
            <wallets :isMobile="false" :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
            <!-- <img src="statics/prototype_screens/wallets.jpg" alt=""> -->
          </div>
        </div>
        <div class="col col-md-9">
          <div class="desktop-card-style apps-section q-mb-sm">
            <div class="standard-content">
              <h2 class="standard-content--title flex justify-start">Create EOS Account</h2>
              <EOS-account-stepper />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <profile-header version="type4" />
      <EOS-account-stepper />
    </div>
  </q-page>
</template>

<script>
import EOSAccountStepper from '../../components/Verto/EOSAccountStepper'
import ProfileHeader from '../../components/Verto/ProfileHeader'
import { osName } from 'mobile-device-detect'
import Wallets from '../../components/Verto/Wallets'

export default {
  components: {
    EOSAccountStepper,
    ProfileHeader,
    Wallets
  },
  data () {
    return {
      osName: ''
    }
  },
  created () {
    this.osName = osName
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  @import "~@/assets/styles/variables.scss";
  /deep/ .wallets-wrapper{
    padding-bottom: 0px !important;
  }
  /deep/ .wallets-wrapper--list{
    box-shadow: none;
    margin-top: 0px;
  }
  .marg{
    /deep/ .profile-wrapper{
      &--header{
        margin-bottom: 0px;
      }
    }
  }
  .mobile-pad{
    padding-bottom: 50px
  }
  .desktop-version{
    background: #E7E8E8;
    padding-top: 13vh;
    padding-left: 12vh;
    padding-bottom: 50px;
    padding-right: 2%;
  }
  .desktop-card-style{
    height: 100%;
  }
.standard-content{
  padding: 5% 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-start;
  min-height: calc(100vh + 100px) !important;
  padding-bottom: 100px;
  @media screen and (min-width: 768px) {
    padding: 2%;
    flex-direction: column;
    justify-content: flex-start;
    min-height: unset !important;
    padding-bottom: 20px;
    /deep/ .chain-tools-wrapper{
      padding: 0px !important;
      margin-left: -40px;
      margin-right: -20px;
      .list-wrapper--chain__eos-to-vtx-convertor{
        box-shadow: none;
      }
    }
  }
  &--title{
    font-size: 35px;
    font-weight: $bold;
    position: relative;
    line-height: 50px;
    font-family: $Titillium;
    margin-top: 0px;
    margin-bottom: 40px;
    @media screen and (min-width: 768px) {
      margin-top: -20px;
      font-size: 25px;
      margin-bottom: 0px;
    }
    .btn-align-left{
      position: absolute;
      left: -15px;
      top: 10px;
    }
  }
  &--desc{
    margin-top: -20px;
    margin-bottom: 40px;
    font-size: 18px;
    font-weight: $regular;
    position: relative;
    line-height: 26px;
    font-family: $Titillium;
    color: $mainColor;
  }
  &--body{
    .progress-custom-volentix{
      max-width: 150px;
      margin: auto;
      margin-top: 20px;
      .title{
        font-size: 13px;
        color: #7272FA;
        font-weight: $light;
        font-family: $Titillium;
        margin-bottom: -10px;
        margin-top: 10px;
      }
      /deep/ .q-linear-progress__model{
        background: #7272FA;
      }
    }
    &__img{
      min-height: 250px;
      img{
        max-width: 90%;
      }
    }
    .rate-value{
      padding: 0px 20px;
      font-family: $Titillium;
      font-weight: $regular;
      color: #B0B0B0;
      font-size: 16px;
      margin-bottom: -20px;
      margin-top: -20px;
    }
    &__form{
      .pay-get-wrapper{
        border-bottom: 1px solid rgba(#707070, .4);
        padding: 0px 6%;
        padding-bottom: 10px;
        margin-bottom: 20px;
        .pay-wrapper{}
        .exchange-btn{
          height: fit-content;
          align-self: flex-end;
          padding-top: 15px;
          .left-icon{
            transform: scaleX(-1);
            margin-left: 0px;
            margin-right: -26px;
            margin-top: -24px;
            color: #7272FA;
          }
          .right-icon{
            color: #7272FA;
          }
        }
        .label{
          font-size: 17px;
          color: #2A2A2A;
          font-family: $Titillium;
          font-weight: $light;
        }
        .value{
          font-size: 33px;
          color: #B0B0B0;
          font-family: $Titillium;
          font-weight: $regular;
        }
        .get-wrapper{}
      }
      /deep/ .q-field__native{
        padding-left: 8px;
        font-size: 16px;
        font-weight: $regular;
      }
      /deep/ .q-field__label{
        font-family: $Titillium;
        font-weight: $regular;
        font-size: 18px;
        padding-left: 10px;
        margin-top: -2px;
      }
      .input-input{
        height: 50px;
        /deep/ .q-field__control{
          height: 50px;
          min-height: unset;
        }
        .btn-copy{
          height: 30px;
          position: relative;
          top: -3px;
          margin-right: 0px;
          padding: 6px 13px;
        }
        .qr-btn{
          width: 30px;
          height: 30px;
          padding-right: 8px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img{
            width: 25px;
            height: 25px;
            position: relative;
            right: -5px;
            transform: scale3d(1, 1, 1);
          }
        }
      }
      .select-input{
        border-radius: 100px !important;
        $height: 50px;
        height: $height;
        /deep/ .q-field__marginal{
          height: $height;
          min-height: unset;
        }
        /deep/ .q-field__control{
          height: $height;
          min-height: unset;
          .q-field__native{
            padding-left: 0px;
            padding-top: 0px;
            padding-bottom: 0px;
            height: $height;
            min-height: unset;
            .q-item{
              padding: 0px;
              padding-left: 18px;
              min-height: $height;
              padding-bottom: 0px;
              .q-item__section{
                padding-right: 0px;
                min-width: 36px;
                .q-item__label + .q-item__label {
                  margin-top: 0px;
                }
              }
            }
          }
        }
      }
      .lab-input{
        font-family: $Titillium;
        font-weight: $regular;
        font-size: 16px;
        color: black;
        padding-left: 20px;
        padding-bottom: 5px;
      }
      /deep/ .option--avatar{
        border: 1px solid;
        width: 35px;
        height: 35px;
        max-width: 40px;
        padding: 0px;
        min-width: unset;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 50px;
        overflow: hidden;
        margin-left: -10px;
        padding-right: 0px;
        &.vtx{
          background-color: #000;
          padding: 3px;
        }
      }
    }
  }
  &--footer{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 100px;
    .action-link{
      height: 54px;
      text-transform: initial !important;
      font-size: 16px;
      letter-spacing: .5px;
      border-radius: 40px;
      width: fit-content;
      margin-left: 0px;
      padding-left: 35px;
      padding-right: 35px;
      background-color: #7272FA !important;
      .left-icon{
        transform: scaleX(-1);
        margin-left: 14px;
        margin-right: 14px;
        margin-top: -1px;
      }
      // &.next{
      //   background-color: #7900FF !important;
      // }
      // &.back{
      //   background-color: #B0B0B0 !important;
      // }
    }

  }
}
</style>
<style lang="scss">
  .option--avatar{
    border: 1px solid rgba(black, .1);
    width: 35px;
    height: 35px;
    max-width: 40px;
    padding: 0px;
    min-width: unset;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    overflow: hidden;
    &__custom{
      border: 1px solid;
      margin-left: -10px;
      padding-right: 0px;
    }
    &.vtx{
      background-color: #000;
      padding: 3px;
    }
  }
</style>

<template>
  <q-page class="column text-black bg-grey-12" :class="screenSize > 1024 ? 'desktop-marg': 'mobile-pad'">
    <div :class="{'dark-theme': $store.state.settings.lightMode === 'true'}" style="height: 100vh;">
      <div class="desktop-version full-height" v-if="screenSize > 1024">
        <div class="row full-height">
          <div class="col col-md-3" v-if="false">
            <div class="wallets-container" style="height: 100%">
              <profile-header :isMobile="false" class="marg" version="type2222" />
              <wallets :isMobile="false" class="full-height max-height" :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
              <!-- <img src="statics/prototype_screens/wallets.jpg" alt=""> -->
            </div>
          </div>
          <div class="col col-md-12">
            <div class="desktop-card-style apps-section q-mb-sm" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
              <div class="standard-content">

                <CreateEOSAccount  v-if="$store.state.settings.network == 'mainnet' "/>
                <CreateTesnetEOSAccount v-else />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="$q.platform.is.mobile||$isbex" >
        <!-- MOBILE VERSION UI -->
        <q-dialog
            v-model="accDialog"
            persistent
            :maximized="true"
            transition-show="slide-up"
            transition-hide="slide-down"
        >
          <q-card :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'bg-white text-black'">
            <q-header >
              <q-toolbar :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'bg-white text-black'" >
                  <q-btn flat round dense icon="arrow_back_ios" class="q-mr-sm" @click="$router.go(-1);"/>
                  <q-toolbar-title>Import EOS Account  </q-toolbar-title>
                  <q-btn flat round dense icon="close" @click="$router.go(-1);"/>
              </q-toolbar>
            </q-header>

            <!-- <profile-header version="type4" /> -->
            <div class="q-mt-xl" :class="$store.state.settings.lightMode === 'true' ? 'mobile-card':'bg-white text-black'" >
              <CreateEOSAccount  v-if="$store.state.settings.network == 'mainnet' "/>
              <CreateTesnetEOSAccount v-else />
            </div>
          </q-card>
        </q-dialog>

      </div>
    </div>
  </q-page>
</template>

<script>
import CreateEOSAccount from '../../components/Verto/CreateEOSAccountLive'
import ProfileHeader from '../../components/Verto/ProfileHeader'
import { osName } from 'mobile-device-detect'
import Wallets from '../../components/Verto/Wallets'
import CreateTesnetEOSAccount from '../../components/Verto/Testnet/CreateEOSAccount.vue'

export default {
  components: {
    ProfileHeader,
    CreateTesnetEOSAccount,
    Wallets,
    CreateEOSAccount
  },
  data () {
    return {
      osName: '',
      accDialog: this.$q.platform.is.mobile || this.$isbex
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowWidth)
  },
  created () {
    console.log('created eos')
    this.osName = osName
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)
  },
  mounted () {
  },
  methods: {
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    },
    goBack () {
      console.log('router ', this.$router)
      console.log('route ', this.$route)
      // this.$router.push({ name: 'wallets', params: { openDialog: true } })
    }
  },
  watch: {
    '$route': function () {
      // console.log('Route chaNGE ', this.$q.platform.is.mobile || this.$isbex)
      this.accDialog = true
    }
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
  .desktop-version {
    background: #E7E8E8;
    padding-top: 13vh;
    padding-left: 18vh;
    padding-bottom: 50px;
    @media screen and (min-width: 768px) {
        padding-top: 11vh;
        padding-bottom: 0px;
    }
  }
  .dark-theme{
    .desktop-version{
      background: #04111F;
      padding-bottom: 8px;
      min-height: 102vh;
      overflow: hidden;
      position: relative;
      scrollbar-width: 0px;
      .col-title h4{
          color: #FFF;
      }
      .standard-content--body__form .lab-input{
        color: #FFF;
      }
    }
    .standard-content--body__form .select-input .q-field__control .q-field__native .q-item .q-item__section .q-item__label + .q-item__label{
      color: #CCC;
    }
  }
  .desktop-card-style{
    height: 101.5%;
    max-height: 101.5%;
    @media screen and (min-height: 700px) {
        // height: 54.5vh;
        max-height: 98.6%;
    }
    @media screen and (min-height: 760px) {
        // height: 54vh;
        max-height: 97%;
    }
    @media screen and (min-height: 800px) {
        // height: 55vh;
        max-height: 96.4%;
    }
    @media screen and (min-height: 870px) {
        // height: 56vh;
        max-height: 94.6%;
    }
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

<template>
  <q-page class="column text-black bg-grey-12" style="padding-bottom: 50px">
    <profile-header version="type5" />
    <div class="plr10">
      <card-refer />
      <hr style="height:0px;opacity:0" />
      <card-share />
    </div>
    <div class="convert-any-coin--wrapper" style="margin-top: -50px">
      <div class="convert-any-coin--wrapper--body">
        <q-btn color="white" to="/verto/earn/use-referral-account" class="convert-any-coin--wrapper--body__btn" text-color="black">
          <template v-slot>
            <div class="icon-wrapper">
              <img src="statics/share_icon.png" width="35px" alt="">
            </div>
            <span class="btn-title">Create referral link</span>
          </template>
        </q-btn>
        <q-btn color="white" to="/verto/eos-account" class="convert-any-coin--wrapper--body__btn" text-color="black">
          <template v-slot>
            <div class="icon-wrapper">
              <img src="statics/eos_icon.png" width="45px" alt="">
            </div>
            <span class="btn-title">Create an EOS account</span>
          </template>
        </q-btn>
      </div>
    </div>
    <br><br>
  </q-page>
</template>

<script>
import CardShare from '../../components/Verto/CardShare'
import CardRefer from '../../components/Verto/CardRefer'
import ProfileHeader from '../../components/Verto/ProfileHeader'
import configManager from '@/util/ConfigManager'
import { version } from '../../../package.json'
let platformTools = require('../../util/platformTools')
if (platformTools.default) platformTools = platformTools.default

export default {
  components: {
    CardRefer,
    CardShare,
    ProfileHeader
  },
  data () {
    return {
      fromCoin: null,
      toCoin: null,
      progress: 0.2,
      to: '',
      amount: '',
      memo: '',
      optionsFrom: [
        {
          label: 'Ethereum',
          value: 'eth',
          image: 'https://files.coinswitch.co/public/coins/eth.png'
        },
        {
          label: 'Bitcoin',
          value: 'btc',
          image: 'https://files.coinswitch.co/public/coins/btc.png'
        }
      ],
      optionsTo: [
        {
          label: 'Volentix',
          value: 'vtx',
          image: 'statics/coins_icons/svg_logo_white.svg'
        },
        {
          label: 'Bitcoin',
          value: 'btc',
          image: 'https://files.coinswitch.co/public/coins/btc.png'
        }
      ],
      minimizedModal: false,
      message: '',
      version: {},
      network: this.$store.state.settings.network,
      configPath: ''
    }
  },
  mounted () {
    this.version = version
    this.setupPlatformPath()
  },
  methods: {
    async setupPlatformPath () {
      this.configPath = await platformTools.filePath()
    },
    goChangePassword: function () {
      this.$router.push({ path: '/change-password' })
    },
    setNetwork: function () {
      this.$store.dispatch('settings/toggleNetwork', this.network)
      this.$q.notify({ message: `Network changed to ${this.network}`, color: 'positive' })
    },
    async backupConfig () {
      try {
        await configManager.backupConfig()
        if (this.$q.platform.is.android) {
          this.$q.notify({ color: 'positive', message: 'Config Saved' })
        }
      } catch (e) {
        // TODO: Exception handling
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "~@/assets/styles/variables.scss";
  .standard-content{
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-start;
    min-height: calc(100vh + 100px) !important;
    padding-bottom: 100px;
    &--title{
      font-size: 35px;
      font-weight: $bold;
      position: relative;
      line-height: 50px;
      font-family: $Titillium;
      margin-top: 0px;
      margin-bottom: 40px;
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
  .convert-any-coin{
    &--wrapper{
      padding: 5% 7%;
      background-color: #E3E1E1;
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
          margin-top: 0px;
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
        justify-content: flex-start;
        padding: 5% 0px;
        margin-top: 0px;
        position: relative;
        z-index: 2;
        &__btn{
          flex-basis: 36%;
          max-width: 36%;
          margin-right: 10px;
          font-size: 15px !important;
          font-family: $Titillium;
          font-weight: $bold;
          text-transform: initial !important;
          padding-top: 10px;
          padding-bottom: 15px;
          .btn-title{
            text-align: left;
            line-height: 20px;
          }
          .icon-wrapper{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 50px;
            margin-right: auto;
            margin-left: -5px;
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
  .plr10{
    padding-left: 10px;
    padding-right: 10px;
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

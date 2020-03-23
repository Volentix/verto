<template>
  <q-page class="text-black bg-white">
    <div class="standard-content">
      <h2 class="standard-content--title flex justify-center">
        <q-btn flat unelevated class="btn-align-left" to="/verto/dashboard" text-color="black" icon="keyboard_backspace" />
        Receive
      </h2>
      <div class="standard-content--body">
        <div class="standard-content--body__form">
          <span class="lab-input">To</span>
          <q-select
              light
              separator
              rounded
              outlined
              class="select-input"
              v-model="wallet"
              use-input
              :options="options"
          >
            <template v-slot:option="scope">
              <q-item
                class="custom-menu"
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section avatar>
                  <q-icon class="option--avatar" :name="`img:${scope.opt.image}`" />
                </q-item-section>
                <q-item-section dark>
                  <q-item-label v-html="scope.opt.label" />
                  <q-item-label caption>{{ scope.opt.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected>
              <q-item
                v-if="wallet"
              >
                <q-item-section avatar>
                  <q-icon class="option--avatar" :name="`img:${wallet.image}`" />
                </q-item-section>
                <q-item-section>
                  <q-item-label v-html="wallet.label" />
                  <q-item-label caption>{{ wallet.value }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-else>
              </q-item>
            </template>
          </q-select>
          <span class="lab-input">Or Via Verto ID (Cruxpay)</span>
          <q-input v-model="vertoID" class="input-input" rounded outlined color="purple" type="text"/>
          <br>
          <div class="qrcode-wrapper">
            <div class="wallet-address flex justify-between">
              <span class="title">Wallet address</span>
              <q-btn round flat unelevated class="btn-copy" text-color="grey" icon="o_file_copy" />
            </div>
            <span class="qrcode-widget">
              <qrcode :value="exchangeAddress" :options="{size: 200}"></qrcode>
              <span class="exchange-address full-width text-center">{{exchangeAddress}}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="standard-content--footer">
         <q-btn flat class="action-link next" color="black" text-color="white" label="Share" />
      </div>
    </div>
  </q-page>
</template>

<script>
import configManager from '@/util/ConfigManager'
import { version } from '../../../package.json'
let platformTools = require('../../util/platformTools')
if (platformTools.default) platformTools = platformTools.default

import VueQrcode from '@chenfengyuan/vue-qrcode'
import Vue from 'vue'

Vue.component(VueQrcode.name, VueQrcode)

export default {
  components: {},
  data () {
    return {
      wallet: null,
      to: '',
      vertoID: '',
      exchangeAddress: 'dsldkslk34JL309LKLKELKLF0934K34LK3L934LK',
      memo: '',
      options: [
        {
          label: 'Ethereum',
          value: 'eth',
          image: 'https://files.coinswitch.co/public/coins/eth.png'
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
  justify-content: space-between;
  min-height: 100vh !important;
  padding-bottom: 100px;
  &--title{
    font-size: 35px;
    font-weight: $bold;
    position: relative;
    line-height: 50px;
    font-family: $Titillium;
    margin-top: 0px;
    margin-bottom: 0px;
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
    &__img{
      min-height: 250px;
      img{
        max-width: 90%;
      }
    }
    .total-fee{
      padding: 0px 20px;
      font-family: $Titillium;
      font-weight: $regular;
      color: #B0B0B0;
      font-size: 16px;
    }
    &__form{
      .qrcode-wrapper{
        border: 1px solid rgba(black,.24);
        border-radius: 30px;
        padding: 20px 18px;
        .wallet-address{}
        .title{
          font-family: $Titillium;
          font-size: 17px;
          font-weight: $light;
        }
        .btn-copy{
          margin-top: -10px;
          margin-right: -10px;
        }
        .qrcode-widget{
          /deep/ canvas{
            height: auto !important;
            width: 60% !important;
            margin: auto;
            display: block;
          }
          .exchange-address{
            font-size: 17px;
            font-family: $Titillium;
            font-weight: $light;
            color: #B0B0B0;
            margin-bottom: 20px;
            display: block;
            word-wrap: break-word;
          }
        }
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
      }
    }
  }
  &--footer{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    min-height: fit-content;
    .action-link{
      height: 50px;
      text-transform: initial !important;
      font-size: 16px;
      letter-spacing: .5px;
      border-radius: 40px;
      width: 150px;
      margin-left: 10px;
      background-color: #7272FA !important;
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

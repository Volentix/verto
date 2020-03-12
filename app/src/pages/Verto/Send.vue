<template>
  <q-page class="text-black bg-white">
    <div class="standard-content">
      <h2 class="standard-content--title flex justify-center">
        <q-btn flat unelevated class="btn-align-left" text-color="black" icon="keyboard_backspace" />
        Send
      </h2>
      <div class="standard-content--body">
        <div class="standard-content--body__form">
          <span class="lab-input">From</span>
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
            <template v-slot:append>
              <q-btn round flat unelevated text-color="grey" @click.stop icon="o_file_copy" />
            </template>
          </q-select>
          <br>
          <span class="lab-input">Amount</span>
          <q-input v-model="amount" class="input-input" rounded outlined color="purple" type="text"/>
          <br>
          <span class="lab-input">To</span>
          <q-input v-model="to" rounded class="input-input pr80" outlined color="purple" type="text" label="Wallet address">
            <template v-slot:append>
              <div class="flex justify-end">
                <q-btn flat unelevated round class="btn-copy">
                  <span class="qr-btn"><img src="statics/qr-icon.png" alt=""></span>
                </q-btn>
                <q-btn flat unelevated text-color="grey" round class="btn-copy" icon="o_file_copy" />
              </div>
            </template>
          </q-input>
          <br>
          <span class="lab-input">Memo</span>
          <q-input v-model="memo" rounded outlined class="" color="purple" type="textarea"/>
        </div>
        <br>
        <div class="total-fee flex justify-between">
          <span class="label">Total Fee</span>
          <span class="value">0.03254 VTX</span>
        </div>
      </div>
      <div class="standard-content--footer">
         <q-btn flat class="action-link next" color="black" text-color="white" label="Transfer" />
      </div>
    </div>
  </q-page>
</template>

<script>
import configManager from '@/util/ConfigManager'
import { version } from '../../../package.json'
let platformTools = require('../../util/platformTools')
if (platformTools.default) platformTools = platformTools.default

export default {
  components: {},
  data () {
    return {
      wallet: null,
      to: '',
      amount: '',
      memo: '',
      // { selected: false, slug: 'btc-xyz', name: 'BTC xyz', purcent: '1.02%', to: '/verto/wallets/btc-xyz', icon: 'statics/coins_icons/btc.png', amount: '0.023 BTC', amountUSD: '$235.21' },
      // { selected: false, slug: 'vtx', name: 'VTX', purcent: '1.02%', to: '/verto/wallets/vtx', icon: 'statics/coins_icons/vtx.png', amount: '0.023 BTC', amountUSD: '$235.21' },
      // { selected: false, slug: 'eth', name: 'ETH', purcent: '1.02%', to: '/verto/wallets/eth', icon: 'statics/coins_icons/eth.png', amount: '0.023 BTC', amountUSD: '$235.21' },
      // { selected: false, slug: 'dash', name: 'DASH', purcent: '1.02%', to: '/verto/wallets/dash', icon: 'statics/coins_icons/dash.png', amount: '0.023 BTC', amountUSD: '$235.21' },
      // { selected: false, slug: 'riple', name: 'Riple', purcent: '1.02%', to: '/verto/wallets/riple', icon: 'statics/coins_icons/ripple.png', amount: '0.023 BTC', amountUSD: '$235.21' }
      options: [
        {
          label: 'BTC xyz',
          value: 'btc-xyz',
          image: 'statics/coins_icons/btc.png'
        },
        {
          label: 'VTX',
          value: 'vtx',
          image: 'statics/coins_icons/vtx.png'
        },
        {
          label: 'ETH',
          value: 'eth',
          image: 'statics/coins_icons/eth.png'
        },
        {
          label: 'DASH',
          value: 'dash',
          image: 'statics/coins_icons/dash.png'
        },
        {
          label: 'Riple',
          value: 'riple',
          image: 'statics/coins_icons/ripple.png'
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
    min-height: 100px;
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

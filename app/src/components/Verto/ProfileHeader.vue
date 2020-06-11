<template>
  <div>
    <div class="send-modal flex flex-center" :class="{'open' : openModal}">
      <div class="send-modal__content column flex-center">
        <div class="send-modal__content--head">
          <span class="text-h5 --amount">{{ currentAccount.name.toUpperCase() }}</span>
          <q-btn color="white" rounded flat unelevated @click="openModal = false" class="close-btn" text-color="black" label="+" />
        </div>
        <div class="send-modal__content--body qrcode-wrapper column flex-center">
          <qrcode :value="currentAccount.key" :options="{size: 200}"></qrcode>
          <div class="--label text-cyan-5 text-h6">Scan the QR Code</div>
        </div>
        <div class="send-modal__content--footer">
          <div class="text-h4 --email pl20">
            Copy the address <q-btn round flat unelevated text-color="grey" @click="copyToClipboard(currentAccount.chain === 'eos' ? currentAccount.name : currentAccount.key  , 'Address')" icon="o_file_copy" />
          </div>
          <!-- currentAccount.key -->
        </div>
      </div>
    </div>

    <div v-if="version === 'type1'" class="p-relative column flex-center profile-wrapper--header wallets" style="background: url('statics/header_bg.png');">
      <q-btn flat unelevated class="btn-align-left" to="/verto/dashboard" text-color="white" icon="keyboard_backspace" />
      <h3 class="profile-wrapper--header__title text-white">Total Balance</h3>
      <h2 class="profile-wrapper--header__balance text-white">136.23 VTX</h2>
      <div class="profile-wrapper--header__action">
        <q-btn unelevated to="/verto/wallets/send" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Send" />
        <q-btn unelevated to="/verto/wallets/receive" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Receive" />
      </div>
    </div>
    <div v-else-if="version === 'type2'" class="profile-wrapper--header static_with_image" style="background: url('statics/header_bg.png');">
      <div class="flex justify-between flex-row item-center content-center full-width">
        <q-btn flat unelevated class="btn-align-left" :to="goBack" text-color="white" icon="keyboard_backspace" />
        <h3 class="flex flex-center text-white static__holder_title">Making VTX while you sleep, will be available soon.</h3>
        <span class="static__holder_img flex flex-center"><img src="statics/stake-vtx-bg.svg" alt=""></span>
      </div>
      <p class="desc text-white column full-width">
        <span class="text-white">Total Staked amount: {{currentAccount.staked}} {{currentAccount.type.toUpperCase()}}</span>
        <span class="text-white">Liquidity: {{currentAccount.amount}} {{currentAccount.type.toUpperCase()}}</span>
      </p>
    </div>
    <div v-else-if="version === 'type3'" class="column flex-center profile-wrapper--header wallet-detail" style="background: url('statics/header_bg.png');">
      <q-btn flat unelevated class="btn-align-left" :to="goBack" text-color="white" icon="keyboard_backspace" />
      <h3 class="profile-wrapper--header__title text-white">{{ currentAccount.name.toUpperCase() }}</h3>
      <h2 class="profile-wrapper--header__balance text-white">{{ new Number(currentAccount.amount).toFixed(2) }} {{ currentAccount.type.toUpperCase() }}</h2>
      <div class="profile-wrapper--header__action">
        <q-btn unelevated to="/verto/wallets/send" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Send" />
        <q-btn unelevated to="/verto/wallets/receive" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Receive" />
        <q-btn flat unelevated round class="btn-qrcode" @click="openModal = !openModal">
          <span class="qr-btn"><img src="statics/barcode.svg" alt=""></span>
        </q-btn>
        <!-- <qrcode :value="currentAccount.key" :options="{size: 200}"></qrcode> -->
      </div>
    </div>
    <div v-else-if="version === 'type4'" class="profile-wrapper--header static_with_image" style="background: url('statics/header_bg.png');min-height:260px">
      <div class="flex justify-between flex-row item-center content-center full-width">
        <q-btn flat unelevated class="btn-align-left" :to="goBack" text-color="white" icon="keyboard_backspace" />
        <h3 class="flex flex-center text-white static__holder_title">Create EOS account</h3>
        <span class="static__holder_img flex flex-center"><img src="statics/eos_account_bg.svg" style="max-width: 150px;" alt=""></span>
      </div>
      <span class="static__holder_img flex flex-center"></span>
    </div>
    <div v-else-if="version === 'type5'" class="profile-wrapper--header static" style="background: url(statics/earn_venue.svg) center bottom no-repeat rgb(255, 255, 255) !important; min-height: 360px; background-size: 370px!important; box-shadow: none !important; border-radius: 0px;">
      <div class="flex justify-between flex-row item-center content-center full-width">
        <h3 class="flex flex-center text-white static__holder_title title5">Venue<br>Refer & Earn</h3>
        <span class="static__holder_img flex flex-center"></span>
      </div>
    </div>
    <div v-else-if="version === 'type6'" class="profile-wrapper--header static" style="background: url(statics/refer_friend_bg.png) center bottom / cover no-repeat rgb(255, 255, 255) !important; min-height: 390px; box-shadow: none !important; border-radius: 0px;" />
    <div v-else class="column flex-center profile-wrapper--header" style="background: url('statics/header_bg.png');">
      <h3 class="profile-wrapper--header__title text-white">Total Balance</h3>
      <h2 class="profile-wrapper--header__balance text-white">136.23 VTX</h2>
      <div class="profile-wrapper--header__action">
        <q-btn unelevated to="/verto/wallets/send" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Send" />
        <q-btn unelevated to="/verto/wallets/receive" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Receive" />
      </div>
    </div>
  </div>
</template>

<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'
import Vue from 'vue'

Vue.component(VueQrcode.name, VueQrcode)

export default {
  name: 'ProfileHeader',
  props: {
    version: {
      type: String,
      required: false,
      default: 'type1'
    },
    showWallets: {
      type: Boolean,
      required: false,
      default: true
    },
    isWalletsPage: {
      type: Boolean,
      required: false,
      default: true
    },
    isWalletDetail: {
      type: Boolean,
      required: false,
      default: true
    },
    fetchCurrentWalletFromState: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      tableData: [],
      chainID: '',
      openModal: false,
      tokenID: '',
      goBack: '',
      currentAccount: {
        selected: false,
        type: '',
        name: '',
        amount: '',
        contract: '',
        chain: ''
      }
    }
  },
  async mounted () {
  },
  async created () {
    this.tableData = await this.$store.state.wallets.tokens
    let params = this.fetchCurrentWalletFromState ? this.$store.state.currentwallet.params : this.$route.params

    this.currentAccount = this.tableData.find(w => w.chain === params.chainID && w.type === params.tokenID && (
      w.chain === 'eos' ? w.name.toLowerCase() === params.accountName : w.key === params.accountName)
    )
    this.goBack = this.fetchCurrentWalletFromState ? `/verto/wallets/${params.chainID}/${params.tokenID}/${params.accountName}` : '/verto/wallets'

    console.log('this.currentAccount from ProfileHeader****************', this.currentAccount, params)

    if (this.currentAccount === undefined) {
      this.currentAccount = {
        selected: false,
        type: 'verto',
        name: 'test',
        amount: 'test',
        contract: 'test',
        chain: 'test',
        key: 'test'
      }
    }
  },
  methods: {
    copyToClipboard (key, copied) {
      this.$clipboardWrite(key)
      this.$q.notify({
        message: copied ? copied + ' Copied' : 'Key Copied',
        timeout: 2000,
        icon: 'check',
        textColor: 'white',
        type: 'warning',
        position: 'top'
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .profile-wrapper{
    &--header{
      height: 240px;
      margin-bottom: 30px;
      background-repeat: no-repeat !important;
      background-size: cover !important;
      overflow: hidden;
      border-radius: 0px 0px 20px 20px;
      padding-bottom: 20px;
      &.wallets{
        .btn-align-left{
          position: absolute;
          left: 10px;
          top: 30px;
        }
      }
      &.wallet-detail{
        .btn-align-left{
          position: absolute;
          left: 10px;
          top: 30px;
        }
      }
      &.static_with_image{
        // background: #0E163B !important;
        box-shadow: 0px 3px 6px 0px rgba(#000000, .29);
        padding: 30px;
        min-height: 240px;
        height: auto;
        padding-top: 70px;
        margin-bottom: 20px;
        .btn-align-left{
          position: absolute;
          left: 10px;
          top: 3%;
        }
        .flex-row{
          .static__holder_img{
            img{
              max-width: 220px;
              width: 100%;
            }
          }
          .static__holder_title{
            max-width: 200px;
            font-size: 24px;
            line-height: 35px;
            font-weight: $bold;
            font-family: $Titillium;
            margin: 0px;
            &.title2{
              margin-top: 15px;
              font-size: 30px;
              line-height: 45px;
            }
            &.title5{
              margin-top: 15px;
              font-size: 30px;
              line-height: 45px;
              color: #6C0DCB !important;
              margin-top: -40px;
            }
          }
        }
        .desc{
          margin-bottom: -10px;
          margin-top: 40px;
          font-size: 17px;
          line-height: 21px;
          font-weight: $regular;
          font-family: $Titillium;
        }
      }
      &.static{
        background: #0E163B !important;
        box-shadow: 0px 3px 6px 0px rgba(#000000, .29);
        padding: 30px;
        min-height: 240px;
        height: auto;
        padding-top: 70px;
        .btn-align-left{
          position: absolute;
          left: 10px;
          top: 3%;
        }
        .flex-row{
          .static__holder_img{
            img{
              max-width: 220px;
              width: 100%;
            }
          }
          .static__holder_title{
            max-width: 200px;
            font-size: 24px;
            line-height: 35px;
            font-weight: $bold;
            font-family: $Titillium;
            margin: 0px;
            &.title2{
              margin-top: 15px;
              font-size: 30px;
              line-height: 45px;
            }
            &.title5{
              margin-top: 15px;
              font-size: 30px;
              line-height: 45px;
              color: #6C0DCB !important;
              margin-top: -40px;
            }
          }
        }
        .desc{
          margin-bottom: -10px;
          margin-top: 40px;
          font-size: 17px;
          line-height: 21px;
          font-weight: $regular;
          font-family: $Titillium;
        }
      }
      &.eos-account{}
      &__title{
        margin: 0px;
        font-size: 18px;
        font-weight: 100;
        letter-spacing: 1px;
        width: 100%;
        text-align: center;
      }
      &__balance{
        margin: 0px;
        font-size: 42px;
        font-weight: 700;
        text-align: center;
        width: 100%;
        margin-top: -10px;
        margin-bottom: 5px;
        letter-spacing: 1px;
      }
      &__action{
        text-align: center;
        width: 100%;
        .qr-btn{
          width: 35px;
          height: 35px;
          padding: 5px;
          border: 1px solid rgba(255, 255, 255, .2);
          border-radius: 26px;
          overflow: hidden;
          img{
            max-width: 100%;
            // transform: scale3d(1, 1, 1);
          }
        }
        &-btn{
          background: #7272FA !important;
          margin: 0px 10px;
          width: 100px;
          border-radius: 30px;
          height: 40px;
          text-transform: initial !important;
          font-size: 16px;
          letter-spacing: .3px;
        }
      }
    }
  }
  .send-modal{
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(black, .5);
    left: 0px;
    top: 0px;
    z-index: 999999;
    visibility: hidden;
    opacity: 0;
    transition: opacity ease .4s;
    &.open{
      visibility: visible;
      opacity: 1;
      .send-modal__content{
        transform: scale(1);
      }
    }
    &__content{
      background-color: #fff;
      border-radius: 20px;
      max-width: 400px;
      padding: 20px;
      width: 100%;
      box-shadow: 0px -2px 9px 0px rgba(black, .29);
      position: relative;
      transform: scale(0);
      transition: ease transform .3s, opacity ease .2s;
      &--head{
        margin-bottom: 20px;
        .close-btn{
          position: absolute;
          right: 10px;
          top: 10px;
          font-size: 40px;
          font-weight: $light;
          font-family: $Titillium;
          height: 40px;
          width: 40px;
          min-height: unset;
          opacity: .3;
          /deep/ .q-btn__content{
            transform: rotate(45deg);
            min-height: unset;
            line-height: 30px;
            margin-left: 5px;
            margin-top: -4px;
          }
        }
        .--amount{
          font-size: 25px;
          font-weight: $bold;
          font-family: $Titillium;
          margin-top: 20px;
          position: relative;
          top: -5px;
        }
      }
      &--body{
        position: relative;
        &.qrcode-wrapper{
          width: 200px;
          height: 150px;
          canvas{
            transform: scale3d(1.4, 1.4, 1.4);
            border-radius: 5px;
            border: 2px solid rgba(99, 62, 127, .1);
            max-width: 120px;
            max-height: 120px;
          }
        }
        .svg_logo{
          fill: #00D0CA;
          position: absolute;
          margin-top: 5px;
          width: 50px;
        }
        .--label{
          font-size: 12px;
          font-weight: $regular;
          font-family: $Titillium;
          position: absolute;
          bottom: -15px;
          line-height: 15px;
          background: white;
          padding: 4px 9px;
        }
      }

      &--footer{
        .--email{
          font-size: 16px;
          font-weight: $bold;
          font-family: $Titillium;
          margin-top: 20px;
        }
      }
    }
  }
  .pl20{
    padding-left: 20px;
  }
</style>

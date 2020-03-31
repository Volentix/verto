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
        </div>
        <div class="send-modal__content--footer">
          <div class="text-h4 --email">Scan the QR Code</div>
        </div>
      </div>
    </div>

    <div v-if="version === 'type1'" class="p-relative column flex-center profile-wrapper--header wallets" style="background: url('statics/header_bg.png');">
      <q-btn flat unelevated class="btn-align-left" to="/verto/dashboard" text-color="white" icon="keyboard_backspace" />
      <h3 class="profile-wrapper--header__title text-white">Total Balance</h3>
      <h2 class="profile-wrapper--header__balance text-white">136.23 VTX</h2>
      <div class="profile-wrapper--header__action">
        <q-btn unelevated to="/verto/send" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Send" />
        <q-btn unelevated to="/verto/receive" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Receive" />
      </div>
    </div>
    <div v-else-if="version === 'type2'" class="profile-wrapper--header static">
      <div class="flex justify-between flex-row item-center content-center full-width">
        <q-btn flat unelevated class="btn-align-left" to="/verto/dashboard" text-color="white" icon="keyboard_backspace" />
        <h3 class="flex flex-center text-white static__holder_title">Making VTX while you sleep, will be available soon.</h3>
        <span class="static__holder_img flex flex-center"><img src="statics/stake-vtx-bg.svg" alt=""></span>
      </div>
      <p class="desc text-white full-width">For now, you can make EOS while you sleep.</p>
    </div>
    <div v-else-if="version === 'type3'" class="column flex-center profile-wrapper--header wallet-detail" style="background: url('statics/header_bg.png');">
      <q-btn flat unelevated class="btn-align-left" to="/verto/wallets" text-color="white" icon="keyboard_backspace" />
      <h3 class="profile-wrapper--header__title text-white">{{ currentAccount.name.toUpperCase() }}</h3>
      <h2 class="profile-wrapper--header__balance text-white">{{ new Number(currentAccount.amount).toFixed(2) }} {{ currentAccount.type.toLowerCase() }}</h2>
      <div class="profile-wrapper--header__action">
        <q-btn unelevated :to="'/verto/wallets/send/' + currentAccount.name.toLowerCase()" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Send" />
        <q-btn unelevated :to="'/verto/wallets/receive/' + currentAccount.name.toLowerCase()" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Receive" />
        <q-btn flat unelevated round class="btn-qrcode" @click="openModal = !openModal">
          <span class="qr-btn"><img src="statics/qr-icon.png" alt=""></span>
        </q-btn>
        <!-- <qrcode :value="currentAccount.key" :options="{size: 200}"></qrcode> -->
      </div>
    </div>
    <div v-else-if="version === 'type4'" class="profile-wrapper--header static" style="background: url(statics/eos-bg.png) #007086 no-repeat !important; background-size: contain !important; min-height: 260px;">
      <div class="flex justify-between flex-row item-center content-center full-width">
        <q-btn flat unelevated class="btn-align-left" to="/verto/dashboard" text-color="white" icon="keyboard_backspace" />
        <h3 class="flex flex-center text-white static__holder_title title2">Create EOS account</h3>
        <span class="static__holder_img flex flex-center"></span>
      </div>
    </div>
    <div v-else-if="version === 'type5'" class="profile-wrapper--header static" style="background: url(statics/earn_bg.png) center bottom no-repeat rgb(255, 255, 255) !important; min-height: 360px; background-size: 80% !important; box-shadow: none !important; border-radius: 0px;">
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
        <q-btn unelevated to="/verto/send" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Send" />
        <q-btn unelevated to="/verto/receive" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Receive" />
      </div>
    </div>
  </div>
</template>

<script>
import Lib from '@/util/walletlib'
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
    accountName: {
      type: String,
      required: false,
      default: ''
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
    }
  },
  data () {
    return {
      tableData: [],
      chainID: '',
      openModal: false,
      tokenID: '',
      currentAccount: {
        selected: false,
        type: '',
        name: '',
        amount: '',
        contract: '',
        chain: ''
      },
      selectedWallet: {
        selected: false,
        slug: 'btc-xyz',
        name: 'BTC xyz',
        purcent: '1.02%',
        icon: 'statics/coins_icons/btc.png',
        amount: '0.023 BTC',
        amountUSD: '$235.21'
      }
    }
  },
  async mounted () {
  },
  async created () {
    const self = this
    this.tableData = [ ...this.$store.state.currentwallet.config.keys ]

    console.table(this.tableData)

    this.tableData.map(element => {
      element.type = element.type ? element.type : 'verto'
      element.to = '/verto/wallets/' + element.type + '/' + element.name.toLowerCase()
      element.amount = 0.0
      // accountName: this.$route.params.accountName
    })

    for (var i = 0; i < this.tableData.length; i++) {
      if (this.tableData[i].type === 'eos') {
        let balances = (await this.$axios.post('https://eos.greymass.com/v1/chain/get_currency_balances', { 'account': this.tableData[i].name })).data

        balances.map(t => {
          // For eos
          if (t.symbol.toLowerCase() !== 'eos') {
            if (+t.amount !== 0) {
              let _name = self.tableData[i].name.toLowerCase()
              let symbol = t.symbol.toLowerCase()
              self.tableData.push({
                selected: false,
                type: symbol,
                name: _name,
                amount: t.amount,
                contract: t.code,
                chain: 'eos',
                to: '/verto/wallets/eos/' + symbol + '/' + _name,
                icon: 'https://raw.githubusercontent.com/BlockABC/eos-tokens/master/tokens/' + t.code + '/' + t.symbol + '.png'
              })
            }
          } else {
            this.tableData[i].amount = t.amount
          }
        })
      } else if (this.tableData[i].type === 'eth') {
        let t = (await this.$axios.get('https://api.ethplorer.io/getAddressInfo/' + this.tableData[i].key + '?apiKey=freekey')).data
        // For eth
        this.tableData[i].amount = t.ETH.balance
        if (t.tokens) {
          t.tokens.map(t => {
            self.tableData.push({
              selected: false,
              type: t.tokenInfo.symbol.toLowerCase(),
              name: self.tableData[i].name,
              amount: t.balance.div(10 ** t.tokenInfo.decimals),
              contract: t.tokenInfo.address,
              chain: 'eth',
              to: '/verto/wallets/eth/' + t.tokenInfo.symbol.toLowerCase(),
              icon: t.tokenInfo.image ? t.tokenInfo.image : ''
            })
          })
        }
      } else if (this.tableData[i].type === 'btc') {
        this.tableData[i].amount = (await Lib.Wallet(this.tableData[i].type, this.tableData[i].key)).balance
      }
    }
    this.tableData.sort(function (a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1
      }
      return 1
    })
    this.chainID = this.$route.params.chainID
    this.tokenID = this.$route.params.tokenID
    if (this.accountName !== '' && this.accountName !== undefined) {
      this.tableData.map(async account => {
        if (this.accountName === account.name.toLowerCase()) {
          // if(/)
          // if (account.type === 'eos') {
          let balances = (await this.$axios.post('https://eos.greymass.com/v1/chain/get_currency_balances', { 'account': account.name })).data
          let _name = account.name.toLowerCase()
          let self = this
          balances.map(t => {
            console.log('t => ', t)
            let symbol = t.symbol.toLowerCase()
            self.currentAccount = {
              selected: account.selected,
              type: t.symbol.toLowerCase(),
              name: _name,
              amount: t.amount,
              contract: t.code,
              chain: 'eos',
              to: '/verto/wallets/eos/' + symbol + '/' + _name,
              icon: 'https://raw.githubusercontent.com/BlockABC/eos-tokens/master/tokens/' + t.code + '/' + t.symbol + '.png'
            }
            console.log('this.currentAccount', this.currentAccount)
          })
          // }
        }
      })
    }
  },
  methods: {
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
          top: 3%;
        }
      }
      &.wallet-detail{
        .btn-align-left{
          position: absolute;
          left: 10px;
          top: 3%;
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
          background: #FFF;
          border-radius: 26px;
          overflow: hidden;
          img{
            max-width: 100%;
            transform: scale3d(1, 1, 1);
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
      max-width: 85%;
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
        }
      }
      &--body{
        position: relative;
        .qrcode-wrapper{
          width: 200px;
          height: 150px;
          canvas{
            transform: scale3d(1.4, 1.4, 1.4);
            border: 1px solid #e4e4e4;
            border-radius: 10px;
          }
        }
        .svg_logo{
          fill: #00D0CA;
          position: absolute;
          margin-top: 5px;
          width: 50px;
        }
        .--label{
          font-size: 14px;
          font-weight: $regular;
          font-family: $Titillium;
          position: absolute;
          bottom: -15px;
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
</style>

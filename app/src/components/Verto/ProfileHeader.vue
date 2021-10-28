<template>
  <div :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <div class="send-modal flex flex-center"  :class="{'open' : openModal}">
      <div class="send-modal__content column flex-center">
        <div class="send-modal__content--head">
          <span class="text-h5 --amount">{{ currentAccount.name.toUpperCase().replace('- HD', '') }}</span>
          <q-btn color="white" rounded flat unelevated @click="openModal = false" class="close-btn" :text-color="$store.state.settings.lightMode === 'true' ? 'white':'black'" label="+" />
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
    <div v-if="version === 'type1'" class="p-relative column flex-center profile-wrapper--header wallets" style="background: url('statics/header_bg3.png');">
      <q-btn flat unelevated class="btn-align-left" to="/verto/profile" text-color="white" icon="keyboard_backspace" />
      <h3 class="profile-wrapper--header__title text-white">Total Balance</h3>
      <h2 class="profile-wrapper--header__balance text-white">${{ new Number( $store.state.wallets.portfolioTotal ).toFixed(2) }} USD</h2>
      <div class="profile-wrapper--header__action">
        <q-btn unelevated to="/verto/wallets/send" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Send" />
        <q-btn unelevated to="/verto/wallets/receive" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Receive" />
      </div>
    </div>
    <div v-else-if="version === 'type2'" class="profile-wrapper--header static_with_image" style="background: url('statics/header_bg3.png');">
      <div class="flex justify-between flex-row item-center content-center full-width">
        <q-btn flat unelevated class="btn-align-left" to="/verto/wallets/" text-color="white" icon="keyboard_backspace" />
        <h3 class="flex flex-center text-white static__holder_title">Making VTX while you sleep, will be available soon.</h3>
        <span class="static__holder_img flex flex-center"><img src="statics/stake-vtx-bg.svg" alt=""></span>
      </div>
      <p class="desc text-white column full-width">
        <span class="text-white">Total Staked amount: {{currentAccount.staked}} {{currentAccount.type.toUpperCase()}}</span>
        <span class="text-white">Liquidity: {{currentAccount.amount}} {{currentAccount.type.toUpperCase()}}</span>
      </p>
    </div>
    <div v-else-if="version === 'type3'" class="column flex-center profile-wrapper--header wallet-detail" style="background: url('statics/header_bg3.png');">
      <q-btn flat unelevated class="btn-align-left" :to="goBack" text-color="white" icon="keyboard_backspace" />
      <h3 class="profile-wrapper--header__title text-white">{{ currentAccount.name.toUpperCase().replace('- HD', '') }}</h3>
      <h2 class="profile-wrapper--header__balance text-white">{{ nFormatter2(currentAccount.amount, 3) }} {{ currentAccount.type.toUpperCase() }}</h2>
      <div class="profile-wrapper--header__action">
        <q-btn unelevated to="/verto/wallets/send" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Send" />
        <q-btn unelevated to="/verto/wallets/receive" class="profile-wrapper--header__action-btn" color="indigo-12" text-color="white" label="Receive" />
        <q-btn flat unelevated round class="btn-qrcode" @click="openModal = !openModal">
          <span class="qr-btn"><img src="statics/barcode.svg" alt=""></span>
        </q-btn>
        <!-- <qrcode :value="currentAccount.key" :options="{size: 200}"></qrcode> -->
      </div>
    </div>
    <div v-else-if="version === 'type4'" class="profile-wrapper--header static_with_image" style="background: url('statics/header_bg3.png');min-height:260px">
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
    <div v-else
    class="column flex-center profile-wrapper--header"
    :class="{'desktop-ui' : !isMobile, 'selected-wallet':  !isMobile && !$store.getters['currentwallet/getWallet'].empty}"
    style="height:160px;"
    >
    <!-- :style="$store.state.settings.lightMode === 'true' ? `background: url('statics/header_bg3.png')` : `background: url('statics/header_bg3light.png')`" -->

      <q-btn v-if="!isMobile && !$store.getters['currentwallet/getWallet'].empty" flat round @click="resetSelectedWallet()" to="/verto/dashboard" color="transparent" class="reset-btn" text-color="white" size="md" icon="close" />
      <h3 class="profile-wrapper--header__title" :class="$store.state.settings.lightMode === 'true' ? 'text-white':'text-dark'"
      v-if="!isMobile && !$store.getters['currentwallet/getWallet'].empty">{{$store.getters['currentwallet/getWallet'].name.replace('- HD', '')}}</h3>
      <h3 class="profile-wrapper--header__title" :class="$store.state.settings.lightMode === 'true' ? 'text-white':'text-dark'"
      v-else>{{ chainData ?  chainData.label : 'Main Portfolio' }}</h3>
      <h2 class="profile-wrapper--header__balance" :class="$store.state.settings.lightMode === 'true' ? 'text-white':'text-dark'"
      v-if="!isMobile && !$store.getters['currentwallet/getWallet'].empty && balance.equivType">

     <span v-if="parseFloat($store.getters['currentwallet/getWallet'].amount) && (isNaN($store.getters['currentwallet/getWallet'].tokenPrice) || $store.getters['currentwallet/getWallet'].tokenPrice == 0)"> {{$store.getters['currentwallet/getWallet'].amount}} {{$store.getters['currentwallet/getWallet'].type.toUpperCase()}}</span>
     <span v-else>${{ balance.usd }} USD </span>

      <span  class="profile-wrapper--header__equivalent" v-if="!isNaN(balance.equivAmount) ">Equivalent to <b>{{ isNaN(balance.equivAmount) ? 0 : nFormatter2(+balance.equivAmount,5) + ' ' + balance.equivType.toUpperCase() }}</b></span></h2>
      <h2 class="profile-wrapper--header__balance" :class="$store.state.settings.lightMode === 'true' ? 'text-white':'text-dark'"
      v-else>${{ nFormatter2( chainData ?  chainData.total : $store.state.wallets.portfolioTotal , 3) }} USD <span class="profile-wrapper--header__equivalent">Equivalent</span></h2>
      <!-- {{$store.state.wallets.portfolioTotal}} -->
      <div class="profile-wrapper--header__action" v-if="!($q.platform.is.mobile||$isbex)">

        <q-btn unelevated v-if="screenSize <= 1024"
          :disable="$store.getters['currentwallet/getWallet'].type === 'verto' || !($store.state.settings.chainsSendEnabled.includes($store.getters['currentwallet/getWallet'].chain))"
          to="/verto/wallets/send" outline
          class="profile-wrapper--header__action-btn --send"
          :class="{'--dark':$store.state.settings.lightMode === 'true'}"
          color="white" text-color="white" label="Send" />
        <q-btn unelevated v-if="screenSize > 1024"
          :disable="!$store.state.settings.devMode && ($store.state.settings.devMode && ($store.getters['currentwallet/getWallet'].type === 'verto' || !($store.state.settings.chainsSendEnabled.includes($store.getters['currentwallet/getWallet'].chain))))"
          @click="!$store.getters['currentwallet/getWallet'].empty ? goToSendPage() : notifSelectWallet()"
          class="profile-wrapper--header__action-btn --send" outline
          :class="{'--dark':$store.state.settings.lightMode === 'true'}"
          color="white" text-color="white" label="Send" />
        <q-btn unelevated v-if="screenSize <= 1024"
          to="/verto/wallets/receive"
          :disable="!$store.state.settings.devMode && ($store.getters['currentwallet/getWallet'].type === 'verto' || !($store.state.settings.chainsSendEnabled.includes($store.getters['currentwallet/getWallet'].chain)))"
          class="profile-wrapper--header__action-btn --receive" outline
          :class="{'--dark':$store.state.settings.lightMode === 'true'}"
          color="indigo-12" text-color="white" label="Receive" />
        <q-btn unelevated v-if="screenSize > 1024"
          :disable="!$store.state.settings.devMode && ( $store.getters['currentwallet/getWallet'].type === 'verto' || !($store.state.settings.chainsSendEnabled.includes($store.getters['currentwallet/getWallet'].chain)))"
          @click="!$store.getters['currentwallet/getWallet'].empty ? goToReceivePage() : notifSelectWallet()"
          :class="{'--dark':$store.state.settings.lightMode === 'true'}"
          class="profile-wrapper--header__action-btn --receive" outline
          color="indigo-12" text-color="white" label="Receive" />

      </div>
    </div>
  </div>
</template>

<script>
import Formatter from '@/mixins/Formatter'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import Vue from 'vue'
import HD from '@/util/hdwallet'

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
    },
    isMobile: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      tableData: [],
      totalBalance: 0,
      chainData: null,
      chainID: '',
      openModal: false,
      tokenID: '',
      goBack: '',
      screenSize: 0,
      // selectedCoin: null,
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
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowWidth)
  },
  updated () {
    // this.selectedCoin = this.$store.getters['currentwallet/getWallet']
    // console.log('this.selectedCoin updated()', this.selectedCoin)
  },
  // computed: {
  //   selectedCoin () {
  //     return this.$store.getters['currentwallet/getWallet'] || undefined
  //   }
  // },
  async created () {
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)
    this.tableData = await this.$store.state.wallets.tokens
    let params = this.fetchCurrentWalletFromState ? this.$store.state.currentwallet.params : this.$route.params

    this.currentAccount = this.tableData.find(w => w.chain === params.chainID && w.type === params.tokenID && (
      w.chain === 'eos' ? w.name.toLowerCase() === params.accountName : w.key === params.accountName)
    )
    this.goBack = this.fetchCurrentWalletFromState ? `/verto/wallets/${params.chainID}/${params.tokenID}/${params.accountName}` : '/verto/wallets'
    /*
    this.tableData.map(token => {
      this.totalBalance = this.totalBalance + (token.usd ? token.usd : 0)
    })
    // console.log('this.currentAccount from ProfileHeader****************', this.currentAccount, params)
   */
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
    // await this.$store.state.wallets.tokens.map(token => {
    //   if (token.usd !== undefined) {
    //     this.$store.state.wallets.portfolioTotal += token.usd
    //   }
    // })
    // console.log('this.$store.state.wallets.portfolioTotal', this.$store.state.wallets.portfolioTotal)

    this.$bus.$on('selectedChain', () => {
      // this.setChainData()
    })
  },
  computed: {
    balance () {
      let total = {
        usd: 0,
        equivType: this.$store.getters['currentwallet/getWallet'].chain,
        equivAmount: 0
      }

      if (this.$store.getters['currentwallet/getWallet'].chain) {
        if (['eos', 'eth'].includes(this.$store.getters['currentwallet/getWallet'].chain)) {
          let account = this.$store.state.wallets.tokens.find(o => ['eos', 'eth'].includes(this.$store.getters['currentwallet/getWallet'].chain) && o.name.toLowerCase() === this.$store.getters['currentwallet/getWallet'].name.toLowerCase())
          total.usd = this.nFormatter2(account.total, 3)
          total.equivType = this.$store.getters['currentwallet/getWallet'].type
          total.equivAmount = account.total / +this.$store.getters['currentwallet/getWallet'].tokenPrice
        } else if (!isNaN(this.$store.getters['currentwallet/getWallet'].usd)) {
          total.usd = this.nFormatter2(this.$store.getters['currentwallet/getWallet'].usd, 3)
          total.equivType = this.$store.getters['currentwallet/getWallet'].type
          total.equivAmount = this.$store.getters['currentwallet/getWallet'].usd / +this.$store.getters['currentwallet/getWallet'].tokenPrice
        }
      }
      return total
    }
  },
  methods: {
    setChainData () {
      this.chainData = {}
      let chain = localStorage.getItem('selectedChain')

      this.chainData.total = this.$store.state.wallets.tokens.filter((c) => chain === 'vtx' ? (c.chain === 'eos' && c.type === chain) : c.chain === chain).reduce((a, b) => +a + (isNaN(b.usd) ? 0 : +b.usd), 0)

      let chainData = HD.names.find(a => a.value === chain)
      this.chainData.label = chain === 'vtx' ? 'VTX' : (chainData ? chainData.label : chain)
      /*
      setTimeout(() => {
        this.chainData = null
      }, 10000)
      */
    },
    resetSelectedWallet () {
      this.$emit('setAsset', false)

      this.$store.state.currentwallet.wallet = { empty: true }
      this.$store.state.wallets.tokens.map(token => {
        token.selected = false
      })

      // console.log('this.$store.getters['currentwallet/getWallet'] = { empty: true } called')
    },
    notifSelectWallet () {
      this.$q.notify.registerType('my-notif', {
        icon: 'announcement',
        progress: true,
        color: 'deep-purple-14',
        textColor: 'white',
        position: 'top'
      })
      // console.log('notifSelectWallet , notifSelectWallet')
      this.triggerCustomRegisteredType1()
    },
    triggerCustomRegisteredType1 () {
      this.$q.notify({
        type: 'my-notif',
        message: `Please select a wallet`,
        caption: 'from the list'
      })
    },
    goToSendPage () {
      // console.log('goToSendPage , goToSendPage')
      this.$router.push({ path: '/verto/wallets/send' })
    },
    goToReceivePage () {
      // console.log('goToSendPage , goToSendPage')
      this.$router.push({ path: '/verto/wallets/receive' })
    },
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    },
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
  },
  mixins: [Formatter]
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
      position: relative;
      z-index: 3;
      &__equivalent{
        position: absolute;
        bottom: -25px;
        right: 0px;
        // color: #FFF;
        font-size: 10px;
        font-weight: $light;
        width: 100%;
      }
      &.desktop-ui{
        border-radius: 10px;
        height: 200px;
        margin-right: 10px;
        .profile-wrapper--header{
          &__title{
            // color: #fff !important;
            font-weight: $bold;
            font-family: $Titillium;
            font-size: 18px;
          }
          &__balance{
            font-size: 26px;
            position: relative;
            width: fit-content;
            min-width: 200px;
          }
          &__action-btn{
            margin-bottom: -20px;
            margin-top: 10px;
            font-size: 14px;
            height: 36px;
          }
        }
        .profile-wrapper--header__action-btn{
          &.--send{
            background: transparent !important;
            &.--dark{
              color: #FFF !important;
              font-weight: $bold !important;
            }
          }
          &.--receive{
            background: transparent !important;
            &.--dark{
              color: #FFF !important;
              font-weight: $bold !important;
            }
          }
        }
      }
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
        max-width: fit-content;
        margin-top: -10px;
        margin-bottom: 5px;
        letter-spacing: 1px;
        position: relative;
        @media screen and (max-width: 768px) {
          font-size: 32px;
        }
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
          background: #FFF !important;
          color: #04111F !important;
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
  .selected-wallet{
    border: 0px solid #7272FA !important;
    border-bottom: 5px solid #7272FA !important;
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
          top: -20px;
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
  /deep/ .reset-btn{
    position: absolute;
    right: 0px;
    top: 0px;
    transform: scale(1);
    background-color: transparent !important;
    background: transparent !important;
  }
  .dark-theme{
    /deep/ .reset-btn{
      color: #7272FA !important;
    }
    .selected-wallet{
      border: 1px solid #7272FA !important;
      border-bottom: 5px solid #7272FA !important;
    }
    .send-modal__content{
      background-color: #04111F !important;
      border: 1px solid #627797;
      .send-modal__content--body .--label{
        background-color: #04111F;
        color: #FFF;
        bottom: -20px;
        border-radius: 5px;
      }
      .send-modal__content--footer .--email{
        color: #FFF;
      }
      .send-modal__content--head .--amount{
        color: #FFF;
      }
    }
    .profile-wrapper{
      &--header{
        &__action{
          .qr-btn{
            border: 1px solid rgba(255, 255, 255, .2);
          }
          &-btn{
            background: #FFF !important;
            color: #000 !important;
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
  }
</style>

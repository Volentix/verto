<template>
<div>
  <div class="wallets-wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="wallets-wrapper--list" :class="{'open': !walletShowHide}">
      <q-list bordered separator class="list-wrapper">
        <q-item v-for="(item, index) in tableData" :key="index" clickable :active="active" :to="item.to">
          <div class="header-wallet-wrapper culumn full-width">
            <div @click="showMenu(item)" class="header-wallet full-width flex justify-between">
              <q-item-section avatar>
                <img class="coin-icon" width="35px" :src="item.icon" alt="">
              </q-item-section>
              <q-item-section class="item-name">
                <span class="item-name--name">{{item.name}}</span>
                <span class="item-name--percent">{{item.percent}}</span>
              </q-item-section>
              <q-item-section class="item-info">
                <span class="item-info--amount">{{new Number(item.amount).toFixed(8)}} {{ item.type.toUpperCase() }}</span>
                <span class="item-info--amountUSD">${{new Number(item.usd).toFixed(2)}}</span>
              </q-item-section>
            </div>
          </div>
        </q-item>
      </q-list>
      <div v-if="!walletShowHide" class="add-remove-wrapper flex column flex-center item-center content-center">
        <span class="add-remove-wrapper--title text-black">Show all currencies</span>
        <span class="add-remove-wrapper--desc text-black">Main chains and balances above zero will show in this list</span>
        <!-- <q-btn class="add-remove-wrapper--btn" unelevated color="indigo-6" text-color="white" label="+" /> -->
      </div>
      <q-btn unelevated v-if="!showWallets" flat @click="toggleWallets()" :icon-right="showText ? 'keyboard_arrow_up': 'keyboard_arrow_down'" class="full-width wallets-wrapper--list__hide-wallets" color="white" text-color="black" :label="showText ? 'Hide all wallets' : 'Show all wallets'" :class="showText ? 'open': 'hide'" />
    </div>
    <div class="modal-wrapper text-black bg-white" :class="{'open' : openModal}">
      <div class="modal-wrapper--content">
        <!-- <q-scroll-area style="height: 100vh;max-height: 100vh;"> -->
          <div class="standard-content">
            <div class="standard-content--body">
              <h2 class="standard-content--title flex justify-center">
                <q-btn flat unelevated class="btn-align-left" @click="hideModalFun()" text-color="black" icon="keyboard_backspace" />
                Are you sure you want to remove BTC?
              </h2>
              <p class="standard-content--desc">You can restore BTC **** at any time using your seed phrase.</p>
              <div class="text-h6 wallet-name">BTC wallet</div>
              <div class="text-h6 wallet-amount">136.23 BTC</div>
            </div>
            <div v-if="!confirmed" class="standard-content--footer">
              <q-btn flat class="action-link next" color="black" text-color="white" @click="hideModalFun()" label="Cancel" />
              <q-btn flat class="action-link next" color="black" text-color="white" @click="confirmed = true" label="Confirm" />
            </div>
            <div v-else class="standard-content--footer confirmed">
              <span class="confirmed-title">BTC has been removed.</span>
              <q-btn flat class="action-link next" color="black" text-color="white" @click="hideModalFun()" label="Back to wallet" />
            </div>
          </div>
        <!-- </q-scroll-area> -->
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Wallets',
  props: {
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
      toggled: false,
      showPrivate: false,
      showVespucciScore: false,
      active: true,
      openModal: false,
      accountName: '',
      tokenID: '',
      currentAsset: {
        'buySupport': '',
        'currentPrice': '',
        'marketCap': '',
        'c24hChange': '',
        'c24hChange2': '',
        'vespucciScore': ''
      },
      confirmed: false,
      // showWallet: true,
      showText: false,
      menu: [
        { selected: false, type: 'btc-xyz', name: 'BTC xyz', percent: '1.02%', to: '/verto/wallets/btc-xyz', icon: 'statics/coins_icons/btc.png', amount: '0.023 BTC', amountUSD: '$235.21' },
        { selected: false, type: 'vtx', name: 'VTX', percent: '1.02%', to: '/verto/wallets/vtx', icon: 'statics/coins_icons/vtx.png', amount: '0.023 BTC', amountUSD: '$235.21' },
        { selected: false, type: 'eth', name: 'ETH', percent: '1.02%', to: '/verto/wallets/eth', icon: 'statics/coins_icons/eth.png', amount: '0.023 BTC', amountUSD: '$235.21' },
        { selected: false, type: 'dash', name: 'DASH', percent: '1.02%', to: '/verto/wallets/dash', icon: 'statics/coins_icons/dash.png', amount: '0.023 BTC', amountUSD: '$235.21' },
        { selected: false, type: 'riple', name: 'Riple', percent: '1.02%', to: '/verto/wallets/riple', icon: 'statics/coins_icons/ripple.png', amount: '0.023 BTC', amountUSD: '$235.21' }
      ],
      selectedWallet: {
        selected: false,
        type: 'btc',
        name: 'BTC xyz',
        percent: '1.02%',
        icon: 'statics/coins_icons/btc.png',
        amount: '0.023 BTC',
        amountUSD: '$235.21'
      },
      tableData: [],
      currentAccount: {
        selected: false,
        type: '',
        key: '',
        name: '',
        amount: '',
        contract: '',
        chain: '',
        to: '',
        icon: ''
      }
    }
  },
  async mounted () {
  },
  updated () {
    // console.log('updated')
  },
  async created () {
    // console.log('created')
    // this.params = this.$store.state.currentwallet.params
    this.chainID = this.$route.params.chainID
    this.tokenID = this.$route.params.tokenID
    this.accountName = this.$route.params.accountName

    this.tableData = await this.$store.state.wallets.tokens

    console.log('this.tableData', this.tableData)

    this.$store.commit('currentwallet/updateParams', {
      chainID: this.chainID,
      tokenID: this.tokenID,
      accountName: this.accountName
    })
  },
  computed: {
    walletShowHide () {
      return this.toggled ? this.showWallets : !this.showWallets
    }
  },
  methods: {
    togglePrivateKey () {
      this.showPrivate = !this.showPrivate
    },
    hideModalFun: function () {
      this.openModal = false
      this.confirmed = false
    },
    openModalFun: function (item) {
      this.openModal = true
    },
    showMenu: function (menu) {
      if (!menu.selected) {
        this.removeClassSelected()
        menu.selected = true
      } else {
        menu.selected = false
      }
    },
    removeClassSelected: function () {
      for (let item of this.menu) {
        item.selected = false
      }
    },
    toggleWallets () {
      this.toggled = !this.toggled
      this.showText = !this.showText
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .wallets-wrapper{
    padding: 0px 6%;
    padding-bottom: 70px;
    &.padtop{
      padding-bottom: 0px;
    }
    .modal-wrapper{
      position: fixed;
      width: 100vw;
      // height: 100vh;
      z-index: 99999;
      top: 0px;
      left: 0px;
      visibility: hidden;
      transform: translateY(50px);
      opacity: 0;
      transition: ease transform .3s, opacity ease .2s;
      &.open{
        visibility: visible;
        transform: translateY(0px);
        opacity: 1;
      }
    }
    &--list{
      background-color: #fff;
      padding: 4% 0%;
      border-radius: 0px 0px 25px 25px;
      box-shadow: 0px 3px 6px 0px rgba(black, .19);
      .add-remove-wrapper{
        align-items: center;
        margin-top: -20px;
        margin-bottom: 10px;
        cursor: pointer;
        &--title{
          font-size: 18px;
          font-family: $Titillium;
          font-weight: $regular;
          margin-right: 0px;
          color: #7272FA !important;
          margin-bottom: 10px;
        }
        &--desc{
          font-size: 14px;
          font-family: $Titillium;
          font-weight: $regular;
          margin-right: 0px;
          box-shadow: 0px 5px 10px 0px rgba(black, .07);
          border-radius: 10px;
          max-width: 220px;
          padding: 5px;
          text-align: center;
        }
        &--btn{
          border-radius: 50px;
          font-size: 25px;
          line-height: 25px;
          font-family: $Titillium;
          font-weight: $light;
          background: #7272FA !important;
          width: 39px;
          height: 39px;
          min-height: unset;
          padding: 0px !important;
          margin-left: 5px;
          /deep/ .q-btn__content{
            margin-top: -1px;
            margin-left: -1px;
          }
        }
      }
      &__hide-wallets{
        text-transform: initial !important;
        margin-top: 0px;
        margin-bottom: 25px;
        color: #7272FA !important;
        font-size: 17px;
        &.hide{
          margin-bottom: 0px;
          margin-top: -8px;
          @media screen and (min-width: 768px) {
            margin-bottom: 35px;
            margin-top: -38px;
          }
        }
      }
      .list-wrapper{
        overflow: hidden;
        visibility: hidden;
        height: 0px;
        opacity: 0;
        transform: translateY(-20px) scaleY(.5);
        transform-origin: top;
        transition: ease transform .3s, ease opacity .4s;
      }
      &.open{
        margin-bottom: -40px;
        .list-wrapper{
          visibility: visible;
          height: auto;
          opacity: 1;
          transform: translateY(0px) scaleY(1);
          margin-bottom: 40px;
        }
      }
      /deep/ .q-list--bordered {
          border: none;
          .q-item{
            &:not(:first-child){
              .q-link {
                border-top: 1px solid rgba(0,0,0,0.02);
              }
            }
          }
          .q-link {
            border-top: 1px solid rgba(0,0,0,0.06);
            .menu-wallet{
              display: none;
              .sub-list-menu{
                margin-top: 10px;
                .p-relative{
                  position: relative;
                  .copy{
                    margin-right: 10px;
                  }
                  .close{
                    margin-right: -15px;
                  }
                  .p-abs{
                    position: absolute;
                    right: 0px;
                  }
                  .private-key{}
                }
                .q-link{
                  border-top: 1px solid rgba(0,0,0,0.06);
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  font-size: 15px;
                  color: #B0B0B0;
                }
              }
            }
            &.selected{
              .menu-wallet{
                display: block;
              }
            }
          }
          .q-item{
            &:first-child{
              border-top: 1px solid rgba(0,0,0,0);
            }
          }
          .q-item__section{
            &.hide{
              display: none !important;
            }
          }
      }
      &__item-info{
        border: 2px solid;
        border-radius: 9px;
        text-align: center;
      }
      .coin-icon{
        margin-left: -3px;
        // opacity: .4;
      }
      .icons{
        // opacity: .4;
        &.reverse{
          transform: scaleX(-1);
        }
      }
      .item-name{
        color: #000;
        font-weight: 700;
        max-width: fit-content;
        &--name{
          font-size: 14px;
        }
        &--percent{
          font-size: 12px;
        }
      }
      .item-info{
        color: #000;
        font-weight: 700;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        &--amount{
          font-size: 16px;
        }
        &--amountUSD{
          font-size: 13px;
          color: #B0B0B0;
        }
      }
    }
  }
  .standard-content{
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh !important;
    max-height: 100vh !important;
    overflow: auto;
    padding-bottom: 100px;
    &--title{
      font-size: 35px;
      font-weight: $bold;
      position: relative;
      line-height: 50px;
      font-family: $Titillium;
      margin-top: 0px;
      padding-top: 60px;
      margin-bottom: 60px;
      .btn-align-left{
        position: absolute;
        left: -20px;
        top: 10px;
      }
    }
    &--body{
      .wallet-name{
        font-family: $Titillium;
        font-weight: $regular;
        color: #B0B0B0;
        font-size: 17px;
      }
      .wallet-amount{
        font-family: $Titillium;
        font-weight: $bold;
        color: #B0B0B0;
        font-size: 19px;
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
    &--footer{
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: baseline;
      min-height: 100px;
      &.confirmed{
        background: #F3F3F3;
        padding: 20px;
        border-radius: 20px;
        flex-direction: column;
        align-items: flex-end;
        .confirmed-title{
          font-size: 19px;
          color: #191818;
          font-family: $Titillium;
          font-weight: $bold;
          width: 100%;
          text-align: left;
          margin-bottom: 20px;
        }
      }
      .action-link{
        height: 47px;
        text-transform: initial !important;
        font-size: 16px;
        letter-spacing: .5px;
        border-radius: 40px;
        width: 150px;
        margin-left: 10px;
        background-color: #7272FA !important;
      }
    }
  }
  .max200{
    max-width: 200px;
  }
  .max260{
    max-width: 260px;
  }
  .no-column{
    flex-direction: row !important;
    padding-right: 0px !important;
  }
  .pr0{
    padding-right: 0px !important;
  }
  .mt10{
    margin-top: 10px;
  }
  .lower{
    text-transform: initial !important;
  }
</style>

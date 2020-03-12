<template>
<div>
  <div class="wallets-wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="wallets-wrapper--list" :class="{'open': showWallets}">
      <q-list v-if="walletID === ''" bordered separator class="list-wrapper">
        <q-item v-for="(item, index) in menu" :key="index" clickable :active="active" :to="item.to">
          <div class="header-wallet-wrapper culumn full-width">
            <div @click="showMenu(item)" class="header-wallet full-width flex justify-between">
              <q-item-section avatar>
                <img class="coin-icon" width="35px" :src="item.icon" alt="">
              </q-item-section>
              <q-item-section class="item-name">
                <span class="item-name--name">{{item.name}}</span>
                <span class="item-name--purcent">{{item.purcent}}</span>
              </q-item-section>
              <q-item-section class="item-info">
                <span class="item-info--amount">{{item.amount}}</span>
                <span class="item-info--amountUSD">{{item.amountUSD}}</span>
              </q-item-section>
            </div>
          </div>
        </q-item>
      </q-list>
      <q-list v-else bordered separator class="list-wrapper">
        <q-item class="selected" clickable>
          <div class="header-wallet-wrapper culumn full-width">
            <div class="header-wallet full-width flex justify-between">
              <q-item-section avatar>
                <img class="coin-icon" width="35px" :src="selectedWallet.icon" alt="">
              </q-item-section>
              <q-item-section class="item-name">
                <span class="item-name--name">{{selectedWallet.name}}</span>
                <span class="item-name--purcent">{{selectedWallet.purcent}}</span>
              </q-item-section>
              <q-item-section class="item-info">
                <span class="item-info--amount">{{selectedWallet.amount}}</span>
                <span class="item-info--amountUSD">{{selectedWallet.amountUSD}}</span>
              </q-item-section>
            </div>
            <div class="menu-wallet">
              <q-list bordered separator class="sub-list-menu">
                <q-item clickable v-ripple class="p-relative">View private key <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
                <q-item clickable v-ripple class="p-relative">Transaction History <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
                <q-item clickable v-ripple class="p-relative">Trade <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
                <q-item clickable v-ripple class="p-relative">Vespucci score <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
                <q-item clickable v-ripple class="p-relative" @click="openModalFun(selectedWallet)">Remove <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
              </q-list>
            </div>
          </div>
        </q-item>
      </q-list>
      <div v-if="!isWalletDetail && isWalletsPage" class="add-remove-wrapper flex justify-center item-center content-center">
        <span class="add-remove-wrapper--title text-black">Add Currency</span>
        <q-btn class="add-remove-wrapper--btn" unelevated color="indigo-6" text-color="white" label="+" />
      </div>
      <div v-if="isWalletsPage && walletID === ''" class="add-remove-wrapper flex justify-center item-center content-center">
        <span class="add-remove-wrapper--title text-black">Add Currency</span>
        <q-btn class="add-remove-wrapper--btn" unelevated color="indigo-6" text-color="white" label="+" />
      </div>
      <div v-if="!isWalletsPage && showWallets" class="add-remove-wrapper flex justify-center item-center content-center">
        <span class="add-remove-wrapper--title text-black">Add Currency</span>
        <q-btn class="add-remove-wrapper--btn" unelevated color="indigo-6" text-color="white" label="+" />
      </div>
      <q-btn v-if="!isWalletDetail" @click="toggleWallets()" unelevated flat :icon-right="showText ? 'keyboard_arrow_up': 'keyboard_arrow_down'" class="full-width wallets-wrapper--list__hide-wallets" color="white" text-color="black" :label="showText ? 'Hide all wallets' : 'Show all wallets'" />
      <!-- <q-btn v-else @click="toggleWallets()" unelevated flat :icon-right="showText ? 'keyboard_arrow_up': 'keyboard_arrow_down'" class="full-width wallets-wrapper--list__hide-wallets" color="white" text-color="black" :label="showText ? 'Hide all wallets' : 'Show all wallets'" /> -->
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
            <div class="standard-content--footer">
              <q-btn flat class="action-link next" color="black" text-color="white" @click="hideModalFun()" label="Cancel" />
              <q-btn flat class="action-link next" color="black" text-color="white" label="Confirm" />
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
    },
    walletID: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      active: true,
      openModal: false,
      // showWallet: true,
      showText: false,
      menu: [
        { selected: false, slug: 'btc-xyz', name: 'BTC xyz', purcent: '1.02%', to: '/verto/wallets/btc-xyz', icon: 'statics/coins_icons/btc.png', amount: '0.023 BTC', amountUSD: '$235.21' },
        { selected: false, slug: 'vtx', name: 'VTX', purcent: '1.02%', to: '/verto/wallets/vtx', icon: 'statics/coins_icons/vtx.png', amount: '0.023 BTC', amountUSD: '$235.21' },
        { selected: false, slug: 'eth', name: 'ETH', purcent: '1.02%', to: '/verto/wallets/eth', icon: 'statics/coins_icons/eth.png', amount: '0.023 BTC', amountUSD: '$235.21' },
        { selected: false, slug: 'dash', name: 'DASH', purcent: '1.02%', to: '/verto/wallets/dash', icon: 'statics/coins_icons/dash.png', amount: '0.023 BTC', amountUSD: '$235.21' },
        { selected: false, slug: 'riple', name: 'Riple', purcent: '1.02%', to: '/verto/wallets/riple', icon: 'statics/coins_icons/ripple.png', amount: '0.023 BTC', amountUSD: '$235.21' }
      ],
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
  methods: {
    hideModalFun: function () {
      this.openModal = false
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
      this.showWallets = !this.showWallets
      this.showText = !this.showText
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .wallets-wrapper{
    padding: 0px 6%;
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
      &--content{}
    }
    &--list{
      background-color: #fff;
      padding: 4% 5%;
      border-radius: 0px 0px 10px 10px;
      box-shadow: 0px 3px 6px 0px rgba(black, .19);
      .add-remove-wrapper{
        align-items: center;
        margin-top: -20px;
        margin-bottom: 10px;
        &--title{
          font-size: 16px;
          font-family: $Titillium;
          font-weight: $regular;
          margin-right: 15px;
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
        margin-bottom: 10px;
        color: #7272FA !important;
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
        margin-bottom: -100px;
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
                  .p-abs{
                    position: absolute;
                    right: 0px;
                  }
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
        margin-left: 10px;
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
        &--name{
          font-size: 14px;
        }
        &--purcent{
          font-size: 12px;
        }
      }
      .item-info{
        color: #000;
        font-weight: 700;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
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
      .action-link{
        height: 50px;
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
</style>

<template>
<div>
  <div class="wallets-wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="wallets-wrapper--list" :class="{'open': showWallets}">
      <q-list bordered separator class="list-wrapper">
        <q-item v-for="(item, index) in menu" :key="index" :class="{'selected': item.selected}" clickable :active="active">
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
            <div class="menu-wallet">
              <q-list bordered separator class="sub-list-menu">
                <q-item clickable v-ripple class="p-relative">View private key <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
                <q-item clickable v-ripple class="p-relative">Transaction History <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
                <q-item clickable v-ripple class="p-relative">Trade <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
                <q-item clickable v-ripple class="p-relative">Vespucci score <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
                <q-item clickable v-ripple class="p-relative">Remove <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
              </q-list>
            </div>
          </div>
        </q-item>
      </q-list>
      <div v-if="isWalletsPage" class="add-remove-wrapper flex justify-center item-center content-center">
        <span class="add-remove-wrapper--title text-black">Add or remove currency</span>
        <q-btn class="add-remove-wrapper--btn" unelevated color="indigo-6" text-color="white" label="-" />
        <q-btn class="add-remove-wrapper--btn" unelevated color="indigo-6" text-color="white" label="+" />
      </div>
      <q-btn v-else @click="toggleWallets()" unelevated flat :icon-right="showText ? 'keyboard_arrow_up': 'keyboard_arrow_down'" class="full-width wallets-wrapper--list__hide-wallets" color="white" text-color="black" :label="showText ? 'Hide all wallets' : 'Show all wallets'" />
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
    }
  },
  data () {
    return {
      active: true,
      // showWallet: true,
      showText: false,
      menu: [
        { selected: false, name: 'BTC xyz', purcent: '1.02%', to: '/wallets', icon: 'statics/coins_icons/btc.png', amount: '0.023 BTC', amountUSD: '$235.21' },
        { selected: false, name: 'VTX', purcent: '1.02%', to: '/wallets', icon: 'statics/coins_icons/vtx.png', amount: '0.023 BTC', amountUSD: '$235.21' },
        { selected: false, name: 'ETH', purcent: '1.02%', to: '/wallets', icon: 'statics/coins_icons/eth.png', amount: '0.023 BTC', amountUSD: '$235.21' },
        { selected: false, name: 'DASH', purcent: '1.02%', to: '/wallets', icon: 'statics/coins_icons/dash.png', amount: '0.023 BTC', amountUSD: '$235.21' },
        { selected: false, name: 'Riple', purcent: '1.02%', to: '/wallets', icon: 'statics/coins_icons/ripple.png', amount: '0.023 BTC', amountUSD: '$235.21' }
      ]
    }
  },
  methods: {
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
</style>

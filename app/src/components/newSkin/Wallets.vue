<template>
<div>
  <div class="wallets-wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="wallets-wrapper--list" :class="{'open': showWallet}">
      <q-list bordered separator class="list-wrapper">
        <q-item v-for="(item, index) in menu" :key="index" clickable v-ripple :active="active" :to="item.to">
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
        </q-item>
      </q-list>
       <q-btn @click="toggleWallets()" unelevated flat :icon-right="showText ? 'keyboard_arrow_up': 'keyboard_arrow_down'" class="full-width wallets-wrapper--list__hide-wallets" color="white" text-color="black" :label="showText ? 'Hide all wallets' : 'Show all wallets'" />
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Wallets',
  data () {
    return {
      active: true,
      showWallet: false,
      showText: false,
      menu: [
        { name: 'BTC xyz', purcent: '1.02%', to: '/wallets', icon: 'statics/coins_icons/btc.png', amount: '0.023 BTC', amountUSD: '$235.21' },
        { name: 'VTX', purcent: '1.02%', to: '/wallets', icon: 'statics/coins_icons/vtx.png', amount: '0.023 BTC', amountUSD: '$235.21' },
        { name: 'ETH', purcent: '1.02%', to: '/wallets', icon: 'statics/coins_icons/eth.png', amount: '0.023 BTC', amountUSD: '$235.21' },
        { name: 'DASH', purcent: '1.02%', to: '/wallets', icon: 'statics/coins_icons/dash.png', amount: '0.023 BTC', amountUSD: '$235.21' },
        { name: 'Riple', purcent: '1.02%', to: '/wallets', icon: 'statics/coins_icons/ripple.png', amount: '0.023 BTC', amountUSD: '$235.21' }
      ]
    }
  },
  methods: {
    toggleWallets () {
      this.showWallet = !this.showWallet
      this.showText = !this.showText
    }
  }
}
</script>

<style scoped lang="scss">
    .wallets-wrapper{
      padding: 0px 6%;
      &--list{
        background-color: #fff;
        padding: 4% 5%;
        border-radius: 0px 0px 10px 10px;
        box-shadow: 0px 3px 6px 0px rgba(black, .19);
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
          &--amount{
            font-size: 14px;
          }
          &--amountUSD{
            font-size: 12px;
            color: #B0B0B0;
          }
        }
      }
    }
</style>

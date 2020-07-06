<template>
<div>
  <div class="wallets-wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div v-if="isMobile" class="wallets-wrapper--list" :class="{'open': !walletShowHide}">
      <q-scroll-area :visible="true" class="scrollarea" :class="{'height' : !walletShowHide}">
        <q-list bordered separator class="list-wrapper">
          <q-item v-for="(item, index) in tableData.filter(f => !f.hidden)" :key="index" clickable :active="item.hidden" active-class="bg-teal-1 text-grey-8" :to="item.to">
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
          <q-item v-for="(item, index) in tableData.filter(f => f.hidden && this.showHidden)" :key="index" clickable :active="item.hidden" active-class="bg-teal-1 text-grey-8" :to="item.to">
            <div class="header-wallet-wrapper culumn full-width" style="opacity: .4">
              <div @click="showMenu(item)" class="header-wallet full-width flex justify-between items-center">
                <q-item-section avatar>
                  <img class="coin-icon" width="35px" :src="item.icon" alt="">
                </q-item-section>
                <q-item-section class="item-name">
                  <span class="item-name--name">{{item.name}}</span>
                  <span class="item-name--percent">{{item.percent}}</span>
                </q-item-section>
                <q-item-section class="item-info" style="font-size: 1.6em;">
                  <q-icon name="visibility_off" />
                  <!-- <span class="item-info--amount">{{new Number(item.amount).toFixed(8)}} {{ item.type.toUpperCase() }}</span>
                  <span class="item-info--amountUSD">${{new Number(item.usd).toFixed(2)}}</span> -->
                </q-item-section>
              </div>
            </div>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div v-if="!walletShowHide" class="add-remove-wrapper flex column flex-center item-center content-center">
        <q-btn unelevated flat @click="revealHide()" :icon-right="showHidden ? 'visibility_off': 'visibility'" class="full-width wallets-wrapper--list__hide-wallets wallets-wrapper--list__hide-wallets--reveal" color="white" text-color="black" :label="showHidden ? 'Conceal Hidden Currencies' : 'Reveal Hidden Currencies'" :class="showText ? 'open': 'hide'" />
        <span class="add-remove-wrapper--desc text-black">Main chains and balances above zero will show in this list</span>
        <!-- <q-btn class="add-remove-wrapper--btn" unelevated color="indigo-6" text-color="white" label="+" /> -->
      </div>
      <q-btn unelevated v-if="!showWallets" flat @click="toggleWallets()" :icon-right="showText ? 'keyboard_arrow_up': 'keyboard_arrow_down'" class="full-width wallets-wrapper--list__hide-wallets" color="white" text-color="black" :label="showText ? 'Hide all wallets' : 'Show all wallets'" :class="showText ? 'open': 'hide'" />
    </div>
    <div v-else class="else-is-desktop wallets-wrapper--list open">
      <h2 class="wallets-wrapper--list_title q-pa-md q-ml-md flex items-center"><q-icon name="o_account_balance_wallet"/> Wallets</h2>
      <q-scroll-area :visible="true" class="q-mr-sm" style="height: 300px;">
        <q-list bordered separator class="list-wrapper">
          <q-item v-for="(item, index) in tableData.filter(f => !f.hidden)" :class="{'selected' : item.selected}" :key="index" clickable :active="item.hidden" active-class="bg-teal-1 text-grey-8">
            <div class="header-wallet-wrapper culumn full-width">
              <div @click="showMenu(item)" class="header-wallet full-width flex justify-between">
                <q-item-section avatar>
                  <img class="coin-icon" width="35px" :src="item.icon" alt="">
                </q-item-section>
                <q-item-section class="item-name">
                  <span class="item-name--name">{{item.name}}</span>
                </q-item-section>
                <q-item-section class="item-info">
                  <span class="item-info--amount">{{new Number(item.amount).toFixed(8)}} {{item.type.toUpperCase()}}</span>
                </q-item-section>
              </div>
              <div class="menu-wallet">
                <q-list bordered separator class="sub-list-menu">
                  <q-item class="p-relative full-width no-pad">
                    <div class="vespucci-score--wrapper full-width flex justify-between items-center">
                      <span class="label">{{ item.vespucciScore > 50 ? 'Strong Buy':'Strong Sell' }}</span>
                      <span class="value">{{ item.vespucciScore }}</span>
                      <span class="powered">Powered by Vespucci</span>
                    </div>
                  </q-item>
                  <q-separator style="margin-top: 10px" />
                  <q-item data-name='Trade' clickable v-ripple class="p-relative" to="/verto/exchange">Trade <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
                  <q-item data-name='Associate with EOS' v-if="item.type === 'verto'" to="/verto/eos-account" clickable v-ripple class="p-relative">Associate with EOS <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
                  <q-item v-if="item.type === 'eos'" data-name='EOS to VTX Converter' clickable v-ripple class="p-relative" to="/verto/converter">EOS to VTX Converter<q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
                  <q-item data-name='Security' clickable @click="alertSecurity = true" v-ripple class="p-relative">Security <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
                  <q-item tag="label" data-name='Hide Currency Chain' v-ripple class="p-relative">
                    <q-item-section>
                      <q-item-label>{{item.hidden ? 'Reveal' : 'Hide'}} Currency Chain</q-item-label>
                    </q-item-section>
                    <q-item-section avatar>
                      <q-toggle class="p-abs" color="blue" @input="hideCurrency()" v-model="item.hidden" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-item>
          <q-item v-for="(item, index) in tableData.filter(f => f.hidden && this.showHidden)" :class="{'selected' : item.selected}" :key="index" clickable :active="item.hidden" active-class="bg-teal-1 text-grey-8">
            <div class="header-wallet-wrapper culumn full-width" style="opacity: .4">
              <div class="header-wallet-wrapper culumn full-width">
                <div @click="showMenu(item)" class="header-wallet full-width flex justify-between">
                  <q-item-section avatar>
                    <img class="coin-icon" width="35px" :src="item.icon" alt="">
                  </q-item-section>
                  <q-item-section class="item-name">
                    <span class="item-name--name">{{item.name}}</span>
                  </q-item-section>
                  <q-item-section class="item-info">
                    <span class="item-info--amount">{{new Number(item.amount).toFixed(8)}} {{item.type.toUpperCase()}}</span>
                  </q-item-section>
                </div>
                <div class="menu-wallet">
                  <q-list bordered separator class="sub-list-menu">
                    <q-item class="p-relative full-width no-pad">
                      <div class="vespucci-score--wrapper full-width flex justify-between items-center">
                        <span class="label">{{ item.vespucciScore > 50 ? 'Strong Buy':'Strong Sell' }}</span>
                        <span class="value">{{ item.vespucciScore }}</span>
                        <span class="powered">Powered by Vespucci</span>
                      </div>
                    </q-item>
                    <q-separator style="margin-top: 10px" />
                    <q-item data-name='Trade' clickable v-ripple class="p-relative" to="/verto/exchange">Trade <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
                    <q-item data-name='Transaction History' clickable v-ripple class="p-relative" to="/verto/wallet/coinHistory">Transaction History<q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
                    <q-item data-name='Associate with EOS' v-if="item.type === 'verto'" to="/verto/eos-account" clickable v-ripple class="p-relative">Associate with EOS <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
                    <q-item v-if="item.type === 'eos'" data-name='EOS to VTX Converter' clickable v-ripple class="p-relative" to="/verto/converter">EOS to VTX Converter<q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
                    <q-item data-name='Security' clickable @click="alertSecurity = true" v-ripple class="p-relative">Security <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /></q-item>
                    <q-item tag="label" data-name='Hide Currency Chain' v-ripple class="p-relative">
                      <q-item-section>
                        <q-item-label>{{item.hidden ? 'Reveal' : 'Hide'}} Currency Chain</q-item-label>
                      </q-item-section>
                      <q-item-section avatar>
                        <q-toggle class="p-abs" color="blue" @input="hideCurrency()" v-model="item.hidden" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </div>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div class="add-remove-wrapper flex column flex-center item-center content-center">
        <q-btn unelevated flat @click="revealHide()" :icon-right="showHidden ? 'visibility_off': 'visibility'" class="full-width wallets-wrapper--list__hide-wallets wallets-wrapper--list__hide-wallets--reveal" color="white" text-color="black" :label="showHidden ? 'Conceal Hidden Currencies' : 'Reveal Hidden Currencies'" :class="showText ? 'open': 'hide'" />
        <span class="add-remove-wrapper--desc text-black">Main chains and balances above zero will show in this list</span>
      </div>
    </div>
  </div>
  <q-dialog v-model="alertSecurity">
    <q-card style="width: 100%; max-width: 400px">
      <q-card-section>
        <div class="icon-alert flex flex-center q-mt-lg">
          <img src="statics/alert.svg" style="max-width: 100px" alt="">
        </div>
      </q-card-section>

      <q-card-section class="q-pa-lg text-h6">
        The private key is confidential. Please make sure you do not share it with anyone. Your private keys control your funds.
      </q-card-section>

      <q-card-actions align="right" class="q-pb-lg q-pr-lg">
        <q-btn flat label="Got it" class="go-to-security" @click="goToSecurity()" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</div>
</template>

<script>

import { QScrollArea } from 'quasar'
export default {
  components: {
    QScrollArea
  },
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
    isMobile: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      toggled: false,
      alertSecurity: false,
      showHidden: false,
      showPrivate: false,
      showVespucciScore: false,
      active: true,
      openModal: false,
      accountName: '',
      tokenID: '',
      selectedCoin: null,
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
      menu: [],
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
    this.tableData.map((c) => {
      c.selected = false
    })

    console.log('this.tableData in wallets', this.tableData)

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
    goToSecurity () {
      this.$router.push({ path: '/verto/wallet/privateKey' })
    },
    revealHide () {
      this.showHidden = !this.showHidden
    },
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
      console.log(menu.selected)
      if (!menu.selected) {
        this.removeClassSelected()
        menu.selected = true
        this.selectedCoin = menu
        // console.log('this.selectedCoin', this.selectedCoin)
        this.$store.state.currentwallet.wallet = this.selectedCoin
        this.$store.commit('currentwallet/updateParams', {
          chainID: this.selectedCoin.chain,
          tokenID: this.selectedCoin.type,
          accountName: this.selectedCoin.name
        })
        this.$store.commit('currentwallet/updateParams', {
          chainID: this.$route.params.chainID,
          tokenID: this.$route.params.tokenID,
          accountName: this.$route.params.accountName
        })
        this.$store.state.currentwallet.wallet = this.currentAccount
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
    },
    async hideCurrency () {
      console.log('this.$store.state.wallets.tokens', this.$store.state.wallets.tokens)

      this.$store.state.wallets.tokens.filter(w => w.chain === this.$route.params.chainID && w.type === this.$route.params.tokenID && (
        w.chain === 'eos' ? w.name.toLowerCase() === this.$route.params.accountName : w.key === this.$route.params.accountName)
      ).map(t => {
        t.hidden = this.currentAccount.hidden
      })

      await this.$configManager.updateConfig(this.$store.state.settings.temporary, this.$store.state.currentwallet.config)
      console.log('hidden', this.currentAccount.hidden)
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .wallets-wrapper{
    padding: 0px 6%;
    padding-bottom: 70px;
    @media screen and (min-width: 768px) {
      background: #FFF;
      padding: 5% 0px;
      margin-top: -10px;
      margin-right: 10px;
      border-radius: 0px 0px 10px 10px;
    }
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
      @media screen and (min-width: 768px) {
        box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.19) !important;
        border-radius: 0px 0px 8px 8px !important;
      }

      &_title{
        font-size: 16px;
        font-family: $Titillium;
        font-weight: $bold;
        line-height: 30px;
        margin-top: -20px;
        margin-bottom: 0px;
        color: #494949;
        i{
          font-size: 20px;
          margin-right: 10px;
        }
      }
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
          @media screen and (min-width: 768px) {
            font-size: 12px;
          }
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
        &--reveal{
          margin-top: 50px !important;
          @media screen and (min-width: 768px) {
            margin-top: 30px !important;
            margin-bottom: 5px !important;
            max-width: 90%;
          }
        }
        &.hide{
          margin-bottom: 0px;
          margin-top: -8px;
          @media screen and (min-width: 768px) {
            margin-bottom: 35px;
            margin-top: 0px;
            font-size: 14px;
          }
        }
        // @media screen and (min-width: 768px) {
        //   margin-bottom: 35px;
        //   margin-top: 0px;
        // }
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
        // margin-bottom: -260px;
        .list-wrapper{
          visibility: visible;
          height: auto;
          opacity: 1;
          transform: translateY(0px) scaleY(1);
          margin-bottom: 40px;
          @media screen and (min-width: 768px) {
            margin-bottom: 0px;
            /deep/ .q-focus-helper{
              display: none !important;
            }
          }
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
            @media screen and (min-width: 768px) {
              max-width: 90%;
              margin: auto;
            }
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
                }
                .q-link{
                  border-top: 1px solid rgba(0,0,0,0.06);
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  font-size: 15px;
                  color: #B0B0B0;
                  @media screen and (min-width: 768px) {
                    margin-left: 0px;
                    margin-right: 0px;
                    width: 100% !important;
                    max-width: 100% !important;
                    padding-top: 0px;
                    padding-bottom: 0px;
                    font-size: 12px;
                    color: #000;
                  }
                  &:hover{
                    @media screen and (min-width: 768px) {
                      background-color: rgba(black, .02);
                    }
                  }
                }
              }
            }
            &.selected{
              .menu-wallet{
                display: block;
                .vespucci-score--wrapper{
                  min-height: 35px;
                  background-color: #F3F3F3;
                  background: transparent linear-gradient(180deg, #FFFFFF 0%, #F3F3F3 100%) 0% 0% no-repeat padding-box;
                  border-radius: 8px;
                  padding: 0px 10px;
                  box-shadow: 0px 5px 8px 0px rgba(black, .1);
                  position: relative;
                  .powered{
                    position: absolute;
                    left: 0px;
                    width: 100%;
                    text-align: center;
                    font-size: 10px;
                    color: #2A2A2A;
                    font-weight: $regular;
                    opacity: .5;
                    letter-spacing: .2px;
                    padding-left: 30px;
                  }
                  .label{
                    background-color: #6C0DCB;
                    color: #FFF;
                    font-size: 12px;
                    font-family: $Titillium;
                    font-weight: $regular;
                    padding: 2px 6px;
                    border-radius: 20px;
                    background: transparent linear-gradient(270deg, #6C0DCB 0%, #00FFFF 100%) 0% 0% no-repeat;
                    box-shadow: 0px 3px 6px 0px rgba(black, .1);
                  }
                  .value{
                    @extend .label;
                  }
                }
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
        @media screen and (min-width: 768px) {
          max-width: 20px;
        }
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
          @media screen and (min-width: 768px) {
            font-size: 12px;
          }
        }
        &--percent{
          font-size: 12px;
        }
        @media screen and (min-width: 768px) {
          margin-left: -27px;
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
          @media screen and (min-width: 768px) {
            font-size: 12px;
            margin-bottom: -5px;
          }
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
  .scrollarea{
    &.height{
      height: 300px;
    }
  }
  .no-pad{
    padding-left: 0px;
    padding-right: 0px;
  }
</style>

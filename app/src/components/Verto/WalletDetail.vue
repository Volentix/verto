<template>
<div>
  <div class="wallets-wrapper padtop">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="wallets-wrapper--list open">
      <q-list bordered separator class="list-wrapper">
        <q-item class="selected" clickable>
          <div class="header-wallet-wrapper culumn full-width">
            <div class="header-wallet full-width flex justify-between">
              <q-item-section avatar>
                <img class="coin-icon" width="35px" :src="currentAccount.icon" alt="">
              </q-item-section>
              <q-item-section class="item-name">
                <span class="item-name--name">{{currentAccount.name}}</span>
                <!-- <span class="item-name--percent">{{currentAccount.percent}}</span> -->
              </q-item-section>
              <q-item-section class="item-info">
                <span class="item-info--amount">{{new Number(currentAccount.amount).toFixed(2)}} {{currentAccount.type.toUpperCase()}}</span>
                <!-- <span class="item-info--amountUSD">{{currentAccount.amountUSD}}</span> -->
              </q-item-section>
            </div>
            <div class="menu-wallet">
              <q-list bordered separator class="sub-list-menu">
                <q-item class="p-relative full-width">
                  <div class="vespucci-score--wrapper full-width flex justify-between items-center">
                    <span class="label">{{ currentAccount.vespucciScore > 50 ? 'Strong Buy':'Strong Sell' }}</span>
                    <span class="value">{{ currentAccount.vespucciScore }}</span>
                    <span class="powered">Powered by Vespucci</span>
                  </div>
                </q-item>
                <q-separator style="margin-top: 10px" />
                <q-item clickable v-ripple class="p-relative" to="/verto/exchange">
                  Trade <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                </q-item>
                <q-item clickable v-ripple class="p-relative" to="/verto/wallet/coinHistory">Transaction History<q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                </q-item>
                <q-item clickable @click="alertSecurity = true" v-ripple class="p-relative">
                  Security <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                </q-item>
                <q-item v-if="currentAccount.type === 'verto'" to="/verto/eos-account" clickable v-ripple class="p-relative">
                  Associate with EOS <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" />
                </q-item>
                <q-item clickable v-ripple class="p-relative" @click="hideCurrency = !hideCurrency">
                  Hide Currency
                  <q-toggle class="p-abs" color="red" v-model="hideCurrency" />
                  <!-- <q-icon class="p-abs" name="keyboard_arrow_right" style="font-size:1.5em" /> -->
                </q-item>
              </q-list>
            </div>
          </div>
        </q-item>
      </q-list>
    </div>
    <q-dialog v-model="alertSecurity">
      <q-card>
        <q-card-section>
          <div class="icon-alert flex flex-center">
            <img src="statics/alert.svg" alt="">
          </div>
        </q-card-section>

        <q-card-section class="q-pa-lg text-h6">
          The private key is confidential. Aliquam a ipsum neque. Praesent sodales neque augue,
        </q-card-section>

        <q-card-actions align="right" class="q-pb-lg q-pr-lg">
          <q-btn flat label="Got it" class="go-to-security" @click="goToSecurity()" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      hideCurrency: false,
      alertSecurity: false,
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
    this.tableData = await this.$store.state.wallets.tokens
    this.currentAccount = this.tableData.find(w => w.chain === this.$route.params.chainID && w.type === this.$route.params.tokenID && (
      w.chain === 'eos' ? w.name.toLowerCase() === this.$route.params.accountName : w.key === this.$route.params.accountName)
    )
    this.$store.commit('currentwallet/updateParams', {
      chainID: this.$route.params.chainID,
      tokenID: this.$route.params.tokenID,
      accountName: this.$route.params.accountName
    })
  },
  computed: {
  },
  methods: {
    goToSecurity () {
      this.$router.push({ path: '/verto/wallet/privateKey' })
    },
    togglePrivateKey () {
      this.showPrivate = !this.showPrivate
      // console.log('this.showPrivate', this.showPrivate)
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
      border-radius: 0px 0px 30px 30px;
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
        margin-bottom: 25px;
        color: #7272FA !important;
        &.hide{
          margin-bottom: 13px;
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
        margin-bottom: 0px;
        .list-wrapper{
          visibility: visible;
          height: auto;
          opacity: 1;
          transform: translateY(0px) scaleY(1);
          margin-bottom: 0px;
        }
      }
      /deep/ .q-list--bordered {
          border: none;
          .q-item{
            &:not(:first-child){
              .q-link {
                border-top: 1px solid rgba(0,0,0,0);
              }
            }
          }
          .q-link {
            border-top: 1px solid rgba(0,0,0,0);
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
                  border-top: 1px solid rgba(0,0,0,0);
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
                .vespucci-score--wrapper{
                  min-height: 40px;
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
                    font-size: 15px;
                    font-family: $Titillium;
                    font-weight: $regular;
                    padding: 3px 10px;
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
        max-width: fit-content;
        &--name{
          font-size: 14px;
          margin-left: -13px;
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
          margin-right: 16px;
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
  .icon-alert{
    padding-top: 25px;
    padding-bottom: 0px;
    img{
      width: 50px;
    }
  }
  .q-card{
    border-radius: 25px;
    box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 35px rgba(0,0,0,0.14), 0 1px 10px rgba(0,0,0,0.12);
  }
  .go-to-security{
    color: #FFF !important;
    background-color: #00D0DF !important;
    text-transform: initial !important;
    padding: 10px 30px;
    border-radius: 50px;
    font-weight: $light;
  }
</style>

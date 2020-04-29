<template>
  <q-page class="text-black bg-white">
    <div class="standard-content">
      <h2 class="standard-content--title flex justify-center">
        <q-btn flat unelevated class="btn-align-left" :to="goBack" text-color="black" icon="keyboard_backspace" />
        Trade
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
              v-model="fromCoin"
              :options="optionsFrom"
          >
            <template v-slot:option="scope">
              <q-item
                class="custom-menu"
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section avatar>
                  <q-icon class="option--avatar option--avatar" :class="scope.opt.value" :name="`img:${scope.opt.image}`" />
                </q-item-section>
                <q-item-section dark>
                  <q-item-label v-html="scope.opt.label" />
                  <q-item-label caption class="ellipsis mw200">{{ scope.opt.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected>
              <q-item
                v-if="fromCoin"
              >
                <q-item-section avatar>
                  <q-icon class="option--avatar option--avatar__custom" :name="`img:${fromCoin.image}`" />
                </q-item-section>
                <q-item-section>
                  <q-item-label v-html="fromCoin.label" />
                  <q-item-label caption class="ellipsis mw200">{{ fromCoin.value }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-else>
              </q-item>
            </template>
          </q-select>
          <br>
          <span class="lab-input">To</span>
          <q-select
              light
              separator
              rounded
              outlined
              class="select-input"
              v-model="toCoin"
              use-input
              :options="optionsTo"
          >
            <template v-slot:option="scope">
              <q-item
                class="custom-menu"
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section avatar>
                  <q-icon class="option--avatar option--avatar" :class="scope.opt.value" :name="`img:${scope.opt.image}`" />
                </q-item-section>
                <q-item-section dark>
                  <q-item-label v-html="scope.opt.label" />
                  <q-item-label caption class="ellipsis mw200">{{ scope.opt.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected>
              <q-item
                v-if="toCoin"
              >
                <q-item-section avatar>
                  <q-icon class="option--avatar option--avatar__custom" :class="toCoin.value" :name="`img:${toCoin.image}`" />
                </q-item-section>
                <q-item-section>
                  <q-item-label v-html="toCoin.label" />
                  <q-item-label caption class="ellipsis mw200">{{ toCoin.value }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-else>
              </q-item>
            </template>
          </q-select>
          <br>
          <div class="pay-get-wrapper flex justify-between item-center content-center">
            <div class="pay-wrapper column">
              <span class="label">you pay</span>
              <span class="value">
                <q-input rounded class="mw100 pl0" flat v-model="fromCoinAmount" type="number" />
                {{ fromCoin !== null ? fromCoin.type.toUpperCase() : 'ESO' }}
              </span>
            </div>
            <q-btn flat unelevated class="exchange-btn" @click="switchAmounts()" text-color="black">
              <q-icon name="keyboard_backspace" class="left-icon" />
              <q-icon name="keyboard_backspace" class="right-icon" />
            </q-btn>
            <div class="get-wrapper column">
              <span class="label">you get</span>
              <span class="value">
                <q-input rounded class="mw100 pl0" flat v-model="toCoinAmount" type="number" />
                {{ toCoin !== null ? toCoin.type.toUpperCase() : 'VTX' }}
              </span>
            </div>
          </div>
        </div>
        <br>
        <div class="rate-value flex justify-center">
          <span class="label">Rate VTX=</span>
          <span class="value"> 0.03254 XRP</span>
        </div>
        <br>
        <div class="standard-content--footer">
          <q-btn flat class="action-link next" color="black" text-color="white">
            <span class="label">Exchange EOS <q-icon name="keyboard_backspace" color="white" class="left-icon" /> VTX</span>
          </q-btn>
        </div>
        <div class="progress-custom-volentix column flex-center">
          <svg class="svg_logo" fill="#7272FA" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58"><path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path></svg>
          <span class="title">Processing</span>
          <q-linear-progress rounded size="md" :value="progress" class="q-mt-md" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>

export default {
  components: {},
  data () {
    return {
      fromCoin: null,
      fromCoinAmount: 0,
      toCoinAmount: 0,
      toCoin: null,
      progress: 0.2,
      to: '',
      amount: '',
      memo: '',
      optionsFrom: [],
      optionsTo: [],
      minimizedModal: false,
      params: null,
      tableData: [],
      currentAccount: null,
      goBack: '/verto/dashboard',
      fetchCurrentWalletFromState: true
    }
  },
  updated () {
    console.log('this.toCoin ---------', this.toCoin)
  },
  async created () {
    console.log('created - created - created - created')
    this.params = this.$store.state.currentwallet.params
    this.tableData = await this.$store.state.wallets.tokens
    let self = this
    this.tableData.map(token => {
      self.optionsFrom.push({
        label: token.name.toLowerCase(),
        value: token.key.toLowerCase(),
        image: token.icon,
        type: token.type
      })
      self.optionsTo.push({
        label: token.name.toLowerCase(),
        value: token.key.toLowerCase(),
        image: token.icon,
        type: token.type
      })
    })
    this.currentAccount = this.tableData.find(w => w.chain === this.params.chainID && w.type === this.params.tokenID && (
      w.chain === 'eos' ? w.name.toLowerCase() === this.params.accountName : w.key === this.params.accountName)
    )
    console.log('this.currentAccount', this.currentAccount)
    if (this.currentAccount !== null && this.currentAccount !== undefined) {
      this.fromCoin = {
        label: this.currentAccount.name,
        value: this.currentAccount.key,
        image: this.currentAccount.icon,
        type: this.currentAccount.type
      }
      this.goBack = this.fetchCurrentWalletFromState ? `/verto/wallets/${this.params.chainID}/${this.params.tokenID}/${this.params.accountName}` : '/verto/dashboard'
    }
  },
  mounted () {

  },
  methods: {
    switchAmounts () {
      let fromCoinVar = this.fromCoin
      this.fromCoin = this.toCoin
      this.toCoin = fromCoinVar

      let fromCoinAmountVar = this.fromCoinAmount
      this.fromCoinAmount = this.toCoinAmount
      this.toCoinAmount = fromCoinAmountVar
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
  justify-content: space-start;
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
    .progress-custom-volentix{
      max-width: 150px;
      margin: auto;
      margin-top: 20px;
      .title{
        font-size: 13px;
        color: #7272FA;
        font-weight: $light;
        font-family: $Titillium;
        margin-bottom: -10px;
        margin-top: 10px;
      }
      /deep/ .q-linear-progress__model{
        background: #7272FA;
      }
    }
    &__img{
      min-height: 250px;
      img{
        max-width: 90%;
      }
    }
    .rate-value{
      padding: 0px 20px;
      font-family: $Titillium;
      font-weight: $regular;
      color: #B0B0B0;
      font-size: 16px;
      margin-bottom: -20px;
      margin-top: -20px;
    }
    &__form{
      .pay-get-wrapper{
        border-bottom: 1px solid rgba(#707070, .4);
        padding: 0px 6%;
        padding-bottom: 10px;
        margin-bottom: 20px;
        .pay-wrapper{}
        .exchange-btn{
          height: fit-content;
          align-self: flex-end;
          padding-top: 15px;
          .left-icon{
            transform: scaleX(-1);
            margin-left: 0px;
            margin-right: -26px;
            margin-top: -24px;
            color: #7272FA;
          }
          .right-icon{
            color: #7272FA;
          }
        }
        .label{
          font-size: 17px;
          color: #2A2A2A;
          font-family: $Titillium;
          font-weight: $light;
        }
        .value{
          font-size: 33px;
          color: #B0B0B0;
          font-family: $Titillium;
          font-weight: $regular;
        }
        .get-wrapper{}
      }
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
        &.vtx{
          background-color: #000;
          padding: 3px;
        }
      }
    }
  }
  &--footer{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 100px;
    .action-link{
      height: 54px;
      text-transform: initial !important;
      font-size: 16px;
      letter-spacing: .5px;
      border-radius: 40px;
      width: fit-content;
      margin-left: 0px;
      padding-left: 35px;
      padding-right: 35px;
      background-color: #7272FA !important;
      .left-icon{
        transform: scaleX(-1);
        margin-left: 14px;
        margin-right: 14px;
        margin-top: -1px;
      }
      // &.next{
      //   background-color: #7900FF !important;
      // }
      // &.back{
      //   background-color: #B0B0B0 !important;
      // }
    }

  }
}
.mw200{
  max-width: 220px;
}
.mw100{
  max-width: 80px;
}
.pl0{
  padding-left: 0px !important;
  /deep/ .q-field__native{
    padding-left: 0px !important;
  }
}
</style>
<style lang="scss">
  .option--avatar{
    border: 1px solid rgba(black, .1);
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
    &__custom{
      border: 1px solid;
      margin-left: -10px;
      padding-right: 0px;
    }
    &.vtx{
      background-color: #000;
      padding: 3px;
    }
  }
</style>

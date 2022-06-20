<template>
<q-card :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" class="q-pa-lg modal-dialog-wrapper" style="width: 500px; " :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <q-toolbar>
        <q-toolbar-title><span class="text-weight-bold q-pl-sm">Stake</span></q-toolbar-title>
        <q-select :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-model="currentExrternalWallet" label="Account" />

        <q-btn :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" flat round dense icon="close" v-close-popup />
    </q-toolbar>
    <q-card-section class="text-h6" v-if="!transactionStatus">

        <div class="row">

            <div class="col-12 text-h6 q-mb-md q-pl-sm flex items-center">
                <h4 class="lab-title q-pr-md">Staking: <span class="text-grey">{{sendAmount}} {{stakeData.code}} </span></h4>
            </div>
            <div class="col col-6">
                <!-- <q-input class="input-input" filled rounded outlined color="purple" value="0.1" suffix="MAX" /> -->
                <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" min="0" :max="stakeData.token" @input="validateInput(); error = null" v-model="sendAmount" filled rounded outlined class="input-input" color="purple" type="number" />
            </div>

        </div>
        <hr style="opacity: .1">
        <q-item v-ripple>

            <q-item-section>
                <q-item-label class="lab-title">Your liquidity</q-item-label>
                <q-item-label class="text-bold" caption lines="1">{{stakeData.count0 + ' ' + stakeData.symbol0 + ' / ' + stakeData.count1 + ' ' + stakeData.symbol1}}</q-item-label>
            </q-item-section>

        </q-item>
        <div class="row">

            <div class="col-12">

                <q-list separator>
                    <q-item class="q-my-sm" clickable v-ripple>
                        <q-item-section avatar>
                            <q-item-label class="lab-title">Withdraw assets</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item class="q-my-sm" clickable v-ripple>

                        <q-item-section avatar>
                            <q-icon size="md" class="option--avatar" :name="'img:https://defibox.s3.ap-northeast-1.amazonaws.com/eos/'+ stakeData.contract0 +'-'+ stakeData.symbol0.toLowerCase() +'.png'" />
                        </q-item-section>

                        <q-item-section>

                            <q-item-label lines="1">{{(stakeData.count0 * sendAmount/stakeData.token).toFixed(8)+' '+ stakeData.symbol0}}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item class="q-my-sm" clickable v-ripple>
                        <q-item-section avatar>
                            <q-icon size="md" class="option--avatar" :name="'img:https://defibox.s3.ap-northeast-1.amazonaws.com/eos/'+ stakeData.contract1 +'-'+ stakeData.symbol1.toLowerCase() +'.png'" />
                        </q-item-section>

                        <q-item-section>

                            <q-item-label lines="1">{{(stakeData.count1 * sendAmount/stakeData.token).toFixed(8)+' '+ stakeData.symbol1}}</q-item-label>
                        </q-item-section>

                    </q-item>
                </q-list>
            </div>
            <div class="text-red q-mt-md" v-if="error">{{error}}</div>

        </div>

    </q-card-section>
    <q-card-section class="text-h6" v-else>
        <div class="row">

            <div class="progress-custom-volentix column flex-center col-md-12 q-pb-md">
                <svg class="svg_logo" fill="#7272FA" width="80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58">
                    <path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path>
                </svg>
                <span class="title">Transaction submitted</span>
                <span class="title">Status: {{transactionStatus}}</span>
                <q-linear-progress v-if="transactionStatus == 'Pending'" style="max-width:300px;" stripe rounded size="md" indeterminate class="q-mt-md" />
            </div>
            <div class="col-12 col-md-6 offset-md-3 text-center text-h6" v-if="transactionHash">
                <q-input bottom-slots filled v-model="transactionHash" label="Your transaction hash" readonly>
                    <template v-slot:counter>
                        <a :href="'https://bloks.io/transaction/'+transactionHash" class="text-body2 text-black " target="_blank">
                            Follow <img width="18" src="https://bloks.io/favicon-32x32.png?v=BG7PP2QPNi" />
                        </a>
                    </template>
                    <template v-slot:hint>
                        <div class="cursor-pointer" @click="transactionStatus = null ; ">
                            <q-icon name="keyboard_backspace" /> Go Back
                        </div>
                    </template>
                </q-input>
            </div>

        </div>

    </q-card-section>
    <q-card-actions align="right" class="q-pr-sm q-mb-sm " v-if="!transactionStatus">
        <q-btn label="Cancel" flat class="qbtn-start q-mr-sm cancel" color="black" v-close-popup />
        <q-btn unelevated class="qbtn-start" :disable="sendAmount == 0 || invalidTransaction" color="black" text-color="white" label="Confirm" @click="doTransaction()" />
    </q-card-actions>
</q-card>
</template>

<script>
import EOSContract from '../../../mixins/EOSContract'
export default {
  name: 'EOSStakingDialog',
  data () {
    return {
      transactionStatus: false,
      invalidTransaction: false,
      currentExrternalWallet: '',
      transactionHash: null,
      sendAmount: 0,
      eosAccount: null,
      spinnervisible: false,
      error: null
    }
  },
  props: ['notWidget', 'stakeData'],
  updated () {},
  async created () {
    let tableData = await this.$store.state.wallets.tokens
    this.eosAccount = tableData.find(w => w.chain === 'eos' && w.type === 'eos')
    this.currentExrternalWallet = this.eosAccount.name
    this.setDialogData()
  },

  methods: {
    setDialogData () {
      this.sendAmount = this.stakeData.token
    },
    doTransaction () {
      let transactionObject = {
        actions: [{
          account: 'lptoken.defi',
          name: 'transfer',
          authorization: [{
            actor: this.eosAccount.name,
            permission: 'active'
          }],
          data: {
            from: this.eosAccount.name,
            to: 'swap.defi',
            quantity: this.sendAmount + ' ' + this.stakeData.code,
            memo: ''
          }
        }]
      }

      this.sendTransaction(transactionObject)
    },
    validateInput () {
      this.sendAmount = this.sendAmount > this.stakeData.token ? this.stakeData.token : this.sendAmount
      this.sendAmount = this.sendAmount < 0 ? 0 : this.sendAmount
    }
  },
  mixins: [EOSContract]
}
</script>

<style lang="scss" scoped>
.gasfield .selected {
    background: #dfdff1 !important;
}

a {
    text-decoration: none;
}

.q-field__messages.col {
    margin-top: 5px;
}

.etherscan a {
    color: black;
    text-decoration: none;
}

.gasSelector .q-item {
    border: 1px solid #f1e7e7
}

.Slow i {
    color: #a0afae !important;
}

.Fast i {
    color: #00d0ca !important;
}

.Instant i {
    color: #7272fa !important;
}

@import "~@/assets/styles/variables.scss";

.link-to-exchange {
    text-decoration: underline;
    color: blue;
    padding-left: 15px;
    font-size: 14px;
    cursor: pointer;
    font-weight: $bold;
}

.modal-dialog-wrapper {
    &.dark-theme{
      background: #04111F;
      border: 1px solid #627797;
      .q-item__label + .q-item__label{
          color: #CCC;
      }
    }
    .qbtn-start {
        border-radius: 30px;
        height: 44px;
        background: #00D0CA !important;
        width: 120px;
        margin-left: 0px;
        padding: 5px 10px;

        &.cancel {
            background: #CCC !important;
            width: 100px;
        }

        /deep/ .q-btn__wrapper {
            min-height: unset;
            padding: 0px 10px;

            .q-btn__content {
                text-transform: initial;
                font-size: 14px;
            }
        }
    }

    .lab-title {
        font-weight: $bold;
        font-size: 18px;
        font-family: $Titillium;
        color: #7272FA;
        margin: 0px;
    }

    /deep/ .btn-gas {
        border: 2px solid #CCC;

        &.active {
            border-color: #00D0CA;
        }

        .q-btn__content {
            @extend .lab-title;
            font-size: 14px;
            text-transform: initial;
        }
    }

    .lab-sub {
        font-size: 14px;
    }

    .lab-value {
        @extend .lab-title;
        font-size: 16px;
        color: #627797;
        line-height: 24px;

        &.output {
            font-size: 12px;
        }

        img {
            max-width: 25px;
        }
    }

    .input-input {
        height: 50px;

        /deep/ .q-field__control {
            height: 50px;
            min-height: unset;
            border-radius: 50px;
        }

        .btn-copy {
            height: 30px;
            position: relative;
            top: -3px;
            margin-right: 0px;
            padding: 6px 13px;
        }

        .qr-btn {
            width: 30px;
            height: 30px;
            padding-right: 8px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            img {
                width: 25px;
                height: 25px;
                position: relative;
                right: -5px;
                transform: scale3d(1, 1, 1);
            }
        }
    }

    .select-input {
        // border-radius: 100px !important;
        $height: 50px;
        height: $height;

        /deep/ .q-field__marginal {
            height: $height;
            min-height: unset;
        }

        /deep/ .q-field__control {
            // border-radius: 50px;
            height: $height;
            min-height: unset;

            .q-field__native {
                padding-left: 0px;
                padding-top: 0px;
                padding-bottom: 0px;
                height: $height;
                min-height: unset;

                .q-item {
                    padding: 0px;
                    padding-left: 18px;
                    min-height: $height;
                    padding-bottom: 0px;

                    .q-item__section {
                        padding-right: 0px;
                        min-width: 36px;

                        .q-item__label+.q-item__label {
                            margin-top: 0px;
                        }
                    }
                }
            }
        }
    }
}

.select-input {
    border-radius: 100px !important;
    $height: 35px;
    width: 140px;
    height: $height;

    /deep/ .q-field__marginal {
        height: $height;
        min-height: unset;
    }

    /deep/ .q-field__control {
        height: $height;
        min-height: unset;
        border-radius: 50px;

        .option--avatar__custom {
            font-size: 19px;
            max-width: 20px;
            max-height: 20px;
            border: none;
            margin-left: 0px;
        }

        .q-field__native {
            padding-left: 0px;
            padding-top: 0px;
            padding-bottom: 0px;
            height: $height;
            min-height: unset;

            .q-field__input {
                max-width: 50px !important;
                min-width: unset !important;
                position: absolute;
                left: 60px;
                font-size: 10px;
            }

            .q-item__label {

                font-weight: 600;
                margin-bottom: -2px;
                margin-left: -10px;
            }

            .q-item {
                padding: 0px;
                padding-left: 0px;
                min-height: $height;
                padding-bottom: 0px;

                .q-item__section {
                    padding-right: 0px;
                    min-width: 36px;

                    .q-item__label+.q-item__label {
                        margin-top: 0px;
                    }
                }
            }
        }
    }
}

.modal-dialog-wrapper .input-input {
    height: auto;
}
</style>

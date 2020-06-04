<template>
<div>
  <div class="vtx-converter-wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="vtx-converter-wrapper--list open">
      <div class="list-wrapper">
        <!-- <div class="list-wrapper--chain__type flex justify-between item-center"><div class="chain">Chain: <b> {{ currentAccount.chain.toUpperCase() }} </b></div><div class="token">Token: <b> {{ currentAccount.type.toUpperCase() }} </b></div></div> --><!-- <q-btn flat @click="step = 1" unelevated icon="keyboard_arrow_down" color="primary" class="--back-btn"/> -->
        <div class="list-wrapper--chain__eos-to-vtx-convertor">
          <h3 class="list-wrapper--chain__eos-to-vtx-convertor--title" @click="step = 1">
            EOS to VTX Convertor
          </h3>
          <div v-if="step > 0" class="">
            <q-stepper
              v-model="step"
              vertical
              color="primary"
              animated
              flat
            >
              <q-step title="How many EOS"
                :name="1"
                prefix="1"
                :done="step > 1"
              >
                <div class="text-black">
                  <div class="row">
                    <div class="">
                      <span class="--title row text-h6"> EOS (Liquid) </span>
                      <span class="--amount row text-h4"> {{ currentAccount.amount }} </span>
                    </div>
                    <div class="col --progress">
                      <q-linear-progress indeterminate rounded :reverse="progColor === 'red'" :color="progColor" size="xl" class="q-mt-md" />
                    </div>
                    <div class="col">
                      <span class="--title row text-h6">
                        VTX (Liquid)
                      </span>
                      <span class="--amount row text-h4">
                        {{ vtxbalance }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <br>
                    <q-slider
                      v-model="slider"
                      :label-value="slider + '%'"
                      :min="0"
                      :max="100"
                      :step="5"
                      color="orange"
                      :label-color="progColor"
                      dark
                      markers
                      label
                      class="--slider"
                      label-always
                      @input="changeSlider()"
                    />
                    <q-input
                      type="number"
                      v-model="sendAmount"
                      light
                      rounded
                      outlined
                      class="--input"
                      color="green"
                      label="Amount of EOS to convert to VTX"
                      @input="checkAmount"
                      @keyup.enter="goToPassword()"
                    />
                    </div>
                    <!-- <div v-show="navigationButtons.amount" class="q-pa-sm" @click="step = 2" >
                      <q-icon name="navigate_next" size="3.2rem" color="green"   >
                        <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                      </q-icon>
                    </div> -->
                </div>

                <q-stepper-navigation v-show="navigationButtons.amount" class="flex justify-end">
                  <q-btn @click="step = 2" color="deep-purple-14" class="--next-btn" rounded label="Next" />
                </q-stepper-navigation>
              </q-step>

              <q-step v-if="isPrivateKeyEncrypted" title="Sign & Submit"
                :name="2"
                prefix="2"
                :done="step > 2"
              >
                <q-btn flat @click="step = 1" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>

                <div class="text-black">
                  <div class="text-h4 --subtitle">Enter your password to sign the transaction.</div>
                  <q-input
                    v-model="privateKeyPassword"
                    light
                    rounded
                    outlined
                    class="full-width"
                    color="green"
                    label="Private Key Password"
                    @input="checkPrivateKeyPassword()"
                    debounce="500"
                    @keyup.enter="toSummary"
                    :type="isPwd ? 'password' : 'text'"
                    :error="invalidPrivateKeyPassword"
                    error-message="The private key password is invalid"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                </div>
                <q-stepper-navigation class="flex justify-end">
                  <q-btn @click="login()" v-if="showSubmit" color="deep-purple-14" class="--next-btn" rounded label="Next" />
                </q-stepper-navigation>
              </q-step>

              <q-step v-else title="Confirm & Submit"
                :name="2"
                prefix="2"
                :done="step > 2"
              >
                <q-btn flat @click="step = 1" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>

                <div class="text-black">
                  <div class="text-h4 --subtitle">Are you sure?</div>

                </div>
                <q-stepper-navigation class="flex justify-end">
                  <q-btn @click="sendTransaction()" color="deep-purple-14" class="--next-btn" rounded label="Submit" />
                </q-stepper-navigation>
              </q-step>

              <q-step title="Result"
                :name="4"
                prefix="3"
              >
                <q-btn flat @click="step = 2" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>

                <div class="text-black">
                  <!-- change --subtitle__success to --subtitle__faild to get the appropriate style -->
                  <div v-show="transactionError === ''" class="text-h4 --subtitle --subtitle__summary">Processing the transaction</div>
                  <!-- <div class="text-h4 --subtitle --subtitle__transLink">Transaction link</div> -->
                  <div v-show="transactionError === ''" class="text-black">
                    <q-spinner />
                  </div>
                  <div v-if="!transactionError" class="content__success">
                    <img src="statics/success_icon.svg" class="success_icon" alt="">
                    <div class="text-h4 --subtitle text-center --subtitle__success">Successful completion</div>
                    <div class="text-h4 --subtitle text-center --subtitle__transLink" v-html="SuccessMessage"> {{ SuccessMessage }}</div>
                    <!-- <div class="text-h4 --subtitle  text-center --subtitle__summary">Summary</div> -->
                    <!-- <ul class="--subtitle__summary--list"> -->
                      <!-- <li v-html="SuccessMessage"> {{ SuccessMessage }}</li> -->
                    <!-- </ul> -->
                  </div>
                  <div v-else class="content__failed text-red q-pa-md">
                    <img src="statics/fail_icon.svg" class="failed_icon" alt="">
                    <div class="text-h4 --subtitle text-center --subtitle__faild">Something's wrong!</div>
                    <div class="text-h4 --subtitle text-center --subtitle__transLink"> {{ ErrorMessage }}</div>
                    <!-- <div class="text-h4 --subtitle --subtitle__summary">Summary</div> -->
                    <!-- <ul class="--subtitle__summary--list"> -->
                      <!-- <li>{{ ErrorMessage }}</li> -->
                    <!-- </ul> -->
                  </div>
                </div>

                <!-- <q-stepper-navigation>
                  <q-btn color="primary" label="Finish" />
                  <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
                </q-stepper-navigation> -->
              </q-step>
            </q-stepper>
          </div>
        </div>
        <!-- <br><br><br> -->
      </div>
    </div>
  </div>
</div>
</template>

<script>
import configManager from '@/util/ConfigManager'
import EosWrapper from '@/util/EosWrapper'
const eos = new EosWrapper()

export default {
  name: 'VTXConverter',
  data () {
    return {
      step: 1,
      active: true,
      showWallet: false,
      showText: false,
      password: '',
      showSubmit: false,
      passHasError: false,
      slider: 0,
      progColor: 'green',
      vtxbalance: 0,
      vtxprice: 0,
      params: {},
      sendAmount: null,
      formatedAmount: null,
      isPrivateKeyEncrypted: false,
      ErrorMessage: null,
      SuccessMessage: null,
      invalidPrivateKeyPassword: false,
      privateKey: {
        success: null
      },
      transactionId: null,
      transactionError: '',
      spinnervisible: false,
      isPwd: true,
      account: null,
      privateKeyPassword: null,
      showSendModal: false,
      navigationButtons: {
        to: false,
        token: false,
        amount: false,
        privateKeyPasswordBtn: false,
        showNextButtonToPassword: false
      },
      tableData: [],
      currentAccount: {
        chain: '',
        token: '',
        type: ''
      }
    }
  },
  computed: {
    showNext: function () {
      if (!this.voted && !this.proxyModel) {
        return false
      } else {
        return true
      }
    }
  },
  async created () {
    this.params = this.$store.state.currentwallet.params
    this.tableData = await this.$store.state.wallets.tokens
    this.currentAccount = this.tableData.find(w => w.chain === this.params.chainID && w.type === this.params.tokenID && (
      w.chain === 'eos' ? w.name.toLowerCase() === this.params.accountName : w.key === this.params.accountName)
    )

    console.log('this.currentAccount ----------------- ', this.currentAccount)

    if (eos.isPrivKeyValid(this.currentAccount.privateKey)) {
      this.privateKey.key = this.currentAccount.privateKey
      this.isPrivateKeyEncrypted = false
    } else {
      this.isPrivateKeyEncrypted = true
    }

    this.vtxprice = (await this.$axios.get('https://cors-anywhere.herokuapp.com/https://api.newdex.io/v1/price?symbol=volentixgsys-vtx-eos')).data.data.price
  },
  async mounted () {
  },
  methods: {
    toSummary () {
      if (!this.invalidPrivateKeyPassword) {
        // this.formatedAmount = this.formatAmountString()
        // this.sendTokens()
        this.step = 4
      }
    },
    checkPrivateKeyPassword () {
      const privateKeyEncrypted = JSON.stringify(this.currentAccount.privateKeyEncrypted)
      this.privateKey = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)
      if (this.privateKey.success) {
        this.invalidPrivateKeyPassword = false
      } else {
        this.invalidPrivateKeyPassword = true
        return false
      }
    },
    checkPassword () {
      if (this.password.length > 2) {
        this.showSubmit = true
      } else {
        this.showSubmit = false
      }
    },
    async login () {
      this.passHasError = false
      if (!this.password) {
        this.passHasError = true
        return
      }
      const results = await configManager.login(this.password)
      if (results.success) {
        this.step = 4
        this.upgradeAccountName()
        this.sendTransaction()
      } else {
        if (results.message === 'no_default_key') {
        } else {
          this.passHasError = true
        }
      }
    },
    changeSlider () {
      this.sendAmount = Math.round(10000 * this.currentAccount.amount * (this.slider / 100)) / 10000
      this.checkAmount()
    },
    checkAmount () {
      this.navigationButtons.amount = false
      this.vtxbalance = Math.round(100000000 * (this.sendAmount / this.vtxprice)) / 100000000

      if (this.sendAmount > 0.0 && this.sendAmount <= this.currentAccount.amount) {
        this.navigationButtons.amount = true
      }
    },
    formatAmountString () {
      let numberOfDecimals = 0
      let stringAmount = this.sendAmount.toString()
      const amountParsed = stringAmount.split('.')
      if (amountParsed && amountParsed.length > 1) {
        numberOfDecimals = amountParsed[1].length
      } else {
        stringAmount += '.'
      }
      for (;numberOfDecimals < 4; numberOfDecimals++) {
        stringAmount += '0'
      }

      return stringAmount + ' EOS'
    },
    async sendTransaction () {
      try {
        this.step = 4

        this.formatedAmount = this.formatAmountString()
        const transaction = await eos.transferToken(
          'eosio.token',
          this.currentAccount.name,
          'newdexpublic',
          this.formatedAmount,
          '{"type":"buy-market","symbol":"volentixgsys-vtx-eos","price":"0.00000","channel":"dapp","ref":"verto"}',
          this.privateKey.key
        )

        this.transactionError = false
        this.transactionId = transaction.transaction_id
        this.SuccessMessage = 'Congratulations, your transactions have been recorded on the blockchain. You can check it on this <a href="https://bloks.io/transaction/' + this.transactionId + '">block explorer</a>'
      } catch (error) {
        if (error.includes('maximum billable CPU time')) {
          this.transactionError = true
          this.ErrorMessage = 'Your EOS account does not have enough CPU staked to process the transaction.'
        } else if (error.includes('Sorry, Newdex trade is pause')) {
          this.transactionError = true
          this.ErrorMessage = 'Convertion is suspended at the moment, it`s not your fault.  Try again later'
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .vtx-converter-wrapper{
    padding: 0px 6%;
    &--list{
      &__hide-vtx-converter{
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
        &--chain{
          &__type{
            background-color: #fff;
            margin-bottom: 10px;
            border-radius: 0px 0px 10px 10px;
            padding: 3% 8%;
            box-shadow: 0px 4px 16px 0px rgba(black, .09);
            font-family: $Titillium;
            font-size: 20px;
            color: #2A2A2A;
            font-weight: $bold;
            b{
              color: #7272FA;
              text-transform: uppercase;
            }
          }
          &__coming-soon{
            ul{
              list-style: none;
              padding: 0px;
              margin: 0px;
              padding: 5% 6%;
              padding-top: 0px;
              li{
                &:not(:last-child){
                  border-bottom: 1px solid #707070;
                }
                .btn-soon{
                  text-transform: initial !important;
                  padding: 20px 10px;
                  border-radius: 0px;
                  /deep/ .q-btn__content{
                    display: flex;
                    justify-content: space-between;
                    flex-direction: row;
                    align-items: center;
                    align-content: center;
                  }
                  .title{
                    font-size: 20px;
                    color: #454F63;
                    font-weight: $bold;
                    margin-right: auto;
                  }
                  .soon{
                    font-size: 16px;
                    color: #B0B0B0;
                    display: flex;
                    justify-content: space-between;
                    flex-direction: row;
                    align-items: center;
                    align-content: center;
                  }
                  .icon{
                    color: #78849E;
                    position: relative;
                    top: 2px;
                    margin-left: 20px;
                    padding-right: 2px !important;
                  }
                }
              }
            }
          }
          &__eos-to-vtx-convertor{
            background-color: #fff;
            margin-bottom: 10px;
            border-radius: 10px;
            padding: 1% 2%;
            box-shadow: 0px 4px 16px 0px rgba(black, .09);
            &--title{
              font-size: 22px;
              font-family: $Titillium;
              font-weight: $bold;
              color: #2A2A2A;
              margin: 0px;
              padding-left: 22px;
              margin-top: 3px;
              position: relative;
            }
            /deep/ .q-stepper__step{
              position: relative;
            }
            /deep/ .q-stepper--vertical .q-stepper__dot:before,
            /deep/ .q-stepper--vertical .q-stepper__dot:after {
              content: '';
              transform: translateX(-50%);
              width: 18px;
              background: #F3F3F3;
              // margin-top: -4px;
              // margin-bottom: -4px;
            }
            /deep/ .q-stepper__tab{
              .q-stepper__title{
                font-size: 20px;
                font-family: $Titillium;
                font-weight: $bold;
                color: #2A2A2A;
              }
              &.q-stepper__tab--active,&.q-stepper__tab--done{
                .q-stepper__title{
                  color: #7272FA;
                }
                .q-stepper__dot{
                  background: #7272FA;
                }
              }
            }
            .--input{
              margin-top: 20px;
              /deep/ .q-field{
                height: 40px;
              }
              /deep/ .q-field__native,
              /deep/ .q-field__prefix,
              /deep/ .q-field__suffix{
                padding-top: 10px;
                padding-bottom: 0px;
              }
              /deep/ .q-field__label{
                top: 10px;
                font-size: 12px;
                font-weight: $bold;
                font-family: $Titillium;
              }
              /deep/ .q-field__marginal{
                height: 40px;
              }
              /deep/ .q-field__control{
                height: 40px;
              }
            }
            .--slider{
              /deep/ &.q-slider--dark {
                .q-slider__track-container{
                  background: rgba(0, 0, 0, 0.3);
                }
                .q-slider__pin-value-marker-text{
                  font-weight: $bold;
                  font-size: 11px;
                }
                .q-slider__pin-value-marker-bg{
                  background: #FFB200 !important;
                }
                .q-slider__pin-text-container{
                  background: #FFB200 !important;
                }
                .q-slider__arrow.text-green{
                  color: #FFB200 !important;
                }
              }
            }
            .--next-btn{
              width: 100px;
              text-transform: initial !important;
            }
            .--progress{
              height: 20px;
              /deep/ .q-linear-progress{
                margin-top: 8px;
                height: 5px !important;
                max-width: 90%;
                margin-left: auto;
                margin-right: auto;
                .q-linear-progress__track{
                  background: #FFB200;
                }
                .q-linear-progress__model--indeterminate:before,
                .q-linear-progress__model--indeterminate:after{
                  background: #FFB200;
                }
              }
            }
            .--back-btn{
              position: absolute;
              right: 0px;
              top: 6px;
            }
            .content__success{
              border: 2px solid #00D0CA;
              padding: 10px 15px;
              border-radius: 20px;
              background-color: #fff;
              box-shadow: 0px 5px 10px 0px rgba(black, .1);
              position: relative;
              a{
                display: block;
                margin-top: 10px;
              }
              .success_icon{
                display: block;
                margin: auto;
                margin-top: -50px;
                margin-bottom: -10px;
                width: 80px;
              }
            }
            .content__failed{
              border: 2px solid #FFB200;
              padding: 10px 15px;
              border-radius: 20px;
              background-color: #fff;
              box-shadow: 0px 5px 10px 0px rgba(black, .1);
              position: relative;
              a{
                display: block;
                margin-top: 10px;
              }
              .failed_icon{
                display: block;
                margin: auto;
                margin-top: -50px;
                margin-bottom: -10px;
                width: 80px;
              }
            }
            .--subtitle{
              font-size: 17px;
              color: #000;
              font-family: $Titillium;
              font-weight: $regular;
              line-height: 20px;
              margin-top: 10px;
              margin-bottom: 30px;
              &__success{
                color: #00D0CA;
                font-weight: $bold;
                margin-bottom: 20px;
              }
              &__faild{
                color: #FFB200;
                font-weight: $bold;
                margin-bottom: 20px;
              }
              &__transLink{
                color: #2A2A2A;
                // border-bottom: 1px solid;
                // width: fit-content;
                font-weight: $regular;
                margin-bottom: 20px;
                font-size: 16px;
              }
              &__summary{
                margin-bottom: 20px;
                font-weight: $bold;
              }
              &__summary--list{
                list-style: disc;
                padding-left: 24px;
                margin-top: -10px;
                li{
                  color: #B0B0B0;
                }
              }
            }
            .--title,.--amount{
              font-size: 13px;
              font-family: $Titillium;
              font-weight: $bold;
              color: #B0B0B0;
              text-transform: initial !important;
              line-height: 20px;
            }
            .--amount{
              color: #2A2A2A !important;
            }
          }
        }
      }
      &.open{
        margin-bottom: 0px;
        .list-wrapper{
          visibility: visible;
          height: auto;
          opacity: 1;
          transform: translateY(0px) scaleY(1);
          margin-bottom: 10px;
        }
      }
    }
  }
</style>

<template>
<div>
  <div class="chain-tools-wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="chain-tools-wrapper--list open">
      <div class="list-wrapper">
        <div class="list-wrapper--chain__type flex justify-between item-center">
          <div class="chain">Chain: <b>EOS</b></div>
          <div class="token">Token: <b>VTX</b></div>
        </div>
        <div class="list-wrapper--chain__coming-soon">
          <ul>
            <li>
               <q-btn class="btn-soon full-width" unelevated flat color="white" text-color="black">
                 <span class="title">Staking</span><span class="soon">Coming soon <q-icon class="icon" name="keyboard_arrow_right" /></span>
               </q-btn>
            </li>
            <li>
              <!-- Lending Voting EOS to VTX Convertor -->
               <q-btn class="btn-soon full-width" unelevated flat color="white" text-color="black">
                 <span class="title">Lending</span><span class="soon">Coming soon <q-icon class="icon" name="keyboard_arrow_right" /></span>
               </q-btn>
            </li>
            <li>
              <!-- Lending Voting EOS to VTX Convertor -->
               <q-btn class="btn-soon full-width" unelevated flat color="white" text-color="black">
                 <span class="title">Voting</span><span class="soon">Coming soon <q-icon class="icon" name="keyboard_arrow_right" /></span>
               </q-btn>
            </li>
          </ul>
        </div>
        <div class="list-wrapper--chain__eos-to-vtx-convertor">
          <h3 class="list-wrapper--chain__eos-to-vtx-convertor--title">EOS to VTX Convertor</h3>
          <div class="">
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
                <div class="text-center text-black">
                  <div class="row">
                    <div class="text-center">
                      <span class="--title row text-h6 text-center"> EOS (Liquid) </span>
                      <span class="--amount row text-h4"> {{ eosbalance }} </span>
                    </div>
                    <div class="col --progress">
                      <q-linear-progress indeterminate rounded :reverse="progColor === 'red'" :color="progColor" size="xl" class="q-mt-md" />
                    </div>
                    <div class="col text-center">
                      <span class="--title row text-h6 text-center">
                        EOS (Staked)
                      </span>
                      <span class="--amount row text-h4">
                        {{ stakedAmount }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <br>
                    <q-slider
                      v-model="slider"
                      :label-value="slider + '%'"
                      :min="-100"
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
                    <div v-show="navigationButtons.amount" class="q-pa-sm" @click="step = 2" >
                      <q-icon name="navigate_next" size="3.2rem" color="green"   >
                        <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                      </q-icon>
                    </div>
                </div>

                <q-stepper-navigation class="flex justify-end">
                  <q-btn @click="step = 2" color="primary" class="--next-btn" rounded label="Next" />
                </q-stepper-navigation>
              </q-step>

              <q-step title="Sign & submit"
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
                    class="--input"
                    color="green"
                    label="Private Key Password"
                    debounce="500"
                    :error="invalidPrivateKeyPassword"
                    error-message="The password is incorrect"
                    @input="checkPrivateKeyPassword"
                    :type="isPwd ? 'password' : 'text'"
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
                  <q-btn @click="step = 4" color="primary" class="--next-btn" rounded label="Next" />
                </q-stepper-navigation>
              </q-step>

              <q-step title="Result"
                :name="4"
                prefix="3"
              >
                <q-btn flat @click="step = 2" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>

                <div class="text-black">
                  <!-- change --subtitle__success to --subtitle__faild to get the appropriate style -->
                  <div class="text-h4 --subtitle --subtitle__success">Success</div>
                  <div class="text-h4 --subtitle --subtitle__transLink">Transaction link</div>
                  <div class="text-h4 --subtitle --subtitle__summary">Summary</div>
                  <ul class="--subtitle__summary--list">
                    <li>EOS nation is now your proxy.</li>
                    <li>Amount of EOS stake 101</li>
                  </ul>
                  <hr>
                  <div class="text-h4 --subtitle --subtitle__faild">Faild</div>
                  <div class="text-h4 --subtitle --subtitle__summary">Summary</div>
                  <ul class="--subtitle__summary--list">
                    <li>EOS nation is now your proxy.</li>
                    <li>Amount of EOS stake 101</li>
                  </ul>
                </div>

                <!-- <q-stepper-navigation>
                  <q-btn color="primary" label="Finish" />
                  <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
                </q-stepper-navigation> -->
              </q-step>
            </q-stepper>
          </div>
        </div>
        <br><br><br>
      </div>
    </div>
  </div>
</div>
</template>

<script>

import EosWrapper from '@/util/EosWrapper'
const eos = new EosWrapper()

export default {
  name: 'ChainTools',
  data () {
    return {
      step: 2,
      active: true,
      showWallet: false,
      showText: false,
      slider: 0,
      progColor: 'green',
      eosbalance: 0,
      vtxbalance: 0,
      stakedAmount: 0,
      vtxprice: 0,
      sendAmount: null,
      formatedAmount: null,
      currentProxy: null,
      ErrorMessage: null,
      SuccessMessage: null,
      invalidPrivateKeyPassword: false,
      privateKey: {
        success: null
      },
      transactionId: null,
      transactionError: false,
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
    this.eosbalance = this.$route.params.eosbalance
    this.hasPrivateKeyInWallet = this.$store.state.currentwallet.wallet.privateKeyEncrypted
  },
  async mounted () {
    this.walletName = this.$store.state.currentwallet.wallet.name
    this.account = await eos.getAccount(this.walletName)

    if (this.account.voter_info) {
      this.stakedAmount = +this.account.voter_info.staked / 10000
      this.currentProxy = this.account.voter_info.proxy
    }
  },
  methods: {
    showMore () {

    },
    changeSlider () {
      if (this.slider >= 0) {
        this.sendAmount = Math.round(10000 * this.eosbalance * (this.slider / 100)) / 10000
      } else {
        this.sendAmount = Math.round(10000 * this.stakedAmount * (this.slider / 100)) / 10000
      }
      this.checkAmount()
    },
    checkAmount () {
      this.navigationButtons.amount = false

      if (+this.sendAmount > 0.0 && +this.sendAmount <= +this.eosbalance) {
        this.slider = Math.round(100 * (this.sendAmount / +this.eosbalance))
        this.navigationButtons.amount = true
        this.progColor = 'green'
      } else if (+this.sendAmount < 0.0 && +this.sendAmount <= +this.stakedAmount) {
        this.slider = Math.round(100 * (this.sendAmount / +this.stakedAmount))
        console.log('this.slider', this.slider)
        this.navigationButtons.amount = true
        this.progColor = 'red'
      }
    },
    checkPrivateKeyPassword () {
      const privateKeyEncrypted = JSON.stringify(this.$store.state.currentwallet.wallet.privateKeyEncrypted)
      this.privateKey = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)
      if (this.privateKey.success) {
        this.invalidPrivateKeyPassword = false
      } else {
        this.invalidPrivateKeyPassword = true
        return false
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/assets/styles/variables.scss";
    .chain-tools-wrapper{
      padding: 0px 6%;
      &--list{
        &__hide-chain-tools{
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
              .chain{}
              .token{}
            }
            &__coming-soon{
              ul{
                list-style: none;
                padding: 0px;
                margin: 0px;
                padding: 5% 6%;
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
                margin-top: 10px;
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
                /deep/ .q-field--labeled .q-field__native,
                /deep/ .q-field--labeled .q-field__prefix,
                /deep/ .q-field--labeled .q-field__suffix{
                  padding-top: 7px;
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
                  .text-green{
                    background: #FFB200 !important;
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
                  border-bottom: 1px solid;
                  width: fit-content;
                  font-weight: $bold;
                  margin-bottom: 20px;
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
                font-size: 15px;
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
          margin-bottom: -100px;
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

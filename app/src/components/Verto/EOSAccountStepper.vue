<template>
<div>
  <div class="chain-tools-wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="chain-tools-wrapper--list open">
      <div class="list-wrapper">
        <div class="list-wrapper--chain__eos-to-vtx-convertor">
          <div v-if="step > 0" class="">
            <q-stepper
              v-model="step"
              vertical
              color="primary"
              animated
              flat
            >
              <q-step title="Account name"
                :name="1"
                prefix="1"
                :done="step > 1"
              >
                <div class="text-black">
                  <div class="text-h4 --subtitle">
                    <ul>
                      <li><span>Choose a 12 letter and/or (1-5)EOS account name</span></li>
                      <li><span>0.35 EOS is required to be transferred to the new account</span></li>
                    </ul>
                  </div>
                  <q-input
                    v-model="accountNew"
                    light
                    rounded
                    outlined
                    class="--input"
                    color="deep-purple-14"
                    label="Account name"
                    debounce="500"
                    :error="inError"
                    :error-message="errorMessage"
                    @input="checkName"
                  />
                </div>

                <q-stepper-navigation class="flex justify-end" v-show="showNextButtonToPassword">
                  <q-btn @click="step = 2" unelevated color="deep-purple-14" class="--next-btn" rounded label="Next" />
                </q-stepper-navigation>
              </q-step>

              <q-step title="Select public key"
                :name="2"
                prefix="2"
                :done="step > 2"
              >
                <q-btn flat @click="step = 1" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>

                <div class="text-black">
                  <div class="text-h4 --subtitle --subtitle__summary">Select the public key for this account</div>
                  <q-select
                      light
                      separator
                      rounded
                      outlined
                      class="select-input"
                      v-model="wallet"
                      use-input
                      :options="options"
                  >
                    <template v-slot:option="scope">
                      <q-item
                        class="custom-menu"
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents"
                      >
                        <q-item-section avatar>
                          <q-icon class="option--avatar" :name="`img:${scope.opt.image}`" />
                        </q-item-section>
                        <q-item-section dark>
                          <q-item-label v-html="scope.opt.label" />
                          <q-item-label caption>{{ scope.opt.value }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                    <template v-slot:selected>
                      <q-item
                        v-if="wallet"
                      >
                        <q-item-section avatar>
                          <q-icon class="option--avatar" :name="`img:${wallet.image}`" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label v-html="wallet.label" />
                          <q-item-label caption>{{ wallet.value }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item
                        v-else>
                      </q-item>
                    </template>
                    <template v-slot:append>
                      <q-btn round flat unelevated text-color="grey" @click.stop icon="o_file_copy" />
                    </template>
                  </q-select>
                  <div class="text-h4 --subtitle --subtitle__summary">or paste it below</div>
                  <q-input
                    v-model="publicKey"
                    light
                    rounded
                    outlined
                    class="--input"
                    color="deep-purple-14"
                    label="Public key"
                    debounce="500"
                  />
                </div>
                <q-stepper-navigation class="flex justify-end">
                  <q-btn @click="step = 3" v-if="wallet !== null || publicKey !== ''" color="deep-purple-14" class="--next-btn" rounded label="Next" />
                </q-stepper-navigation>
              </q-step>

              <q-step title="Sign & submit"
                :name="3"
                prefix="3"
                :done="step > 3"
              >
                <q-btn flat @click="step = 2" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>

                <div class="text-black">
                  <div class="text-h4 --subtitle">Enter your password to sign the transaction.</div>
                  <q-input
                    ref="psswrd"
                    v-model="password"
                    @keyup.enter="login"
                    @input="checkPassword"
                    :error="passHasError"
                    rounded outlined
                    :type="isPwd ? 'password' : 'text'"
                    label="Private Key Password"
                    hint="*Minimum of 8 characters"
                    light
                    error-message="The password is incorrect"
                    class="--input"
                    color="green"
                    debounce="500"
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
                  <q-btn @click="login" v-if="showSubmit" color="deep-purple-14" class="--next-btn" rounded label="Next" />
                  <!-- <q-btn flat label="Ok" :disable="!vertoPassordValid" @click="upgradeAccountName()" v-close-popup /> -->
                </q-stepper-navigation>
              </q-step>

              <q-step title="Result"
                :name="4"
                prefix="4"
              >
                <q-btn flat @click="step = 3" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>

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
import Lib from '@/util/walletlib'

import configManager from '@/util/ConfigManager'

export default {
  name: 'ChainTools',
  data () {
    return {
      walletName: '',
      accountNew: '',
      password: '',
      passHasError: false,
      showSubmit: false,
      showNextButtonToVertoPassword: false,
      showNextButtonToPassword: false,
      inError: false,
      step: 1,
      active: true,
      publicKey: '',
      wallet: null,
      options: [
        {
          label: 'CALLHERO ',
          value: 'EOSjkhljljuiiygkgkgjfdhggdghljljhgihjgdgdrteiuoh...',
          image: 'statics/coins_icons/eth.png'
        }
      ],
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
      currentWallet: null,
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
      tableData: []
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
  mounted () {
    this.walletName = this.$store.state.currentwallet.wallet.name
    this.account = eos.getAccount(this.walletName)

    if (this.account.voter_info) {
      this.stakedAmount = +this.account.voter_info.staked / 10000
      this.currentProxy = this.account.voter_info.proxy
    }

    this.tableData = this.$store.state.currentwallet.config.keys
    this.tableData.forEach(async element => {
      element.to = '/verto/wallets/' + element.type
      element.type = element.type ? element.type : 'verto'
      if (element.type === 'eos') {
        // eos as chain, account name, token name
        element.amount = (await new Lib.Wallet('eos', element.name, 'vtx')).balance
        // console.log(element.amount)
        // console.log('balance', element.name, element.amount)
      } else {
        element.amount = 0.0
      }
      this.options.push({
        label: element.name,
        value: element.key,
        image: this.getImages(element.type)
      })
      console.log('this.options', this.options)
    }
    )

    console.log('this.tableData')
    console.table(this.tableData)
  },
  methods: {
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
      } else {
        if (results.message === 'no_default_key') {
        } else {
          this.passHasError = true
        }
      }
    },
    upgradeAccountName () {
      this.currentWallet.type = 'eos'
      this.currentWallet.name = this.accountName.value
      this.$configManager.updateCurrentWallet(this.currentWallet)
      this.$configManager.updateConfig(this.vertoPassword, this.$store.state.currentwallet.config)
      // reset form variables
      this.vertoPassword = null
      this.privateKeyPassword = null
      this.accountName = null
      this.step = 1
    },
    checkPassword () {
      if (this.password.length > 2) {
        this.showSubmit = true
      } else {
        this.showSubmit = false
      }
    },
    getImages (symbol) {
      console.log('symbol', symbol)
      if (symbol === 'verto') {
        return '/statics/icon.png'
      } else {
        return symbol ? 'https://files.coinswitch.co/public/coins/' + symbol.toLowerCase() + '.png' : false
      }
    },
    async checkName () {
      this.inError = false
      if (this.accountNew.length === 12) {
        if (/(^[a-z1-5]{1}([a-z1-5.]{0,10}[a-z1-5])?$)/g.test(this.accountNew)) {
          this.showNextButtonToPassword = true
          try {
            await eos.getAccount(this.accountNew)
            this.inError = true
            this.errorMessage = 'Account Name Taken'
          } catch (error) {
            this.inError = false
            this.showNextButtonToPassword = true
          }
        } else {
          this.inError = true
          this.errorMessage = 'Invalid Account Name'
          this.showNextButtonToPassword = false
        }
      } else {
        this.inError = true
        this.errorMessage = 'You need exactly 12 characters'
        this.showNextButtonToPassword = false
      }
    },
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
                .text-green{
                  background: #FFB200 !important;
                }
              }
            }
            .--next-btn{
              width: fit-content;
              text-transform: initial !important;
              margin-left: 10px;
              margin-bottom: 10px;
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
              &.hr-vertical{
                max-width: 50px;
                .bar{
                  height: 30px;
                  width: 4px;
                  background: #FFB200;
                  margin-top: 5px;
                  border-radius: 10px;
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
              ul{
                padding: 0px;
                margin: 0px;
                margin-left: 20px;
                li{
                  font-size: 15px;
                  font-weight: $bold;
                  margin-bottom: 10px;
                  line-height: 15px;
                  color: #FFB200;
                  span{
                    color: #2A2A2A;
                  }
                }
              }
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
            .--alert{
              font-size: 17px;
              line-height: 21px;
              font-family: $Titillium;
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
          padding-left: 8px;
          min-height: $height;
          padding-bottom: 0px;
          .q-item__section{
            padding-right: 0px;
            min-width: 36px;
            .q-item__label + .q-item__label {
              margin-top: 0px;
              text-overflow: ellipsis;
              width: 120px;
              position: relative;
              white-space: nowrap;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
  /deep/ .option--avatar{
    // border: 1px solid;
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
  }
</style>

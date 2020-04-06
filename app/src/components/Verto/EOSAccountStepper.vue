<template>
<div>
  <div class="chain-tools-wrapper">
    <!-- <q-toggle v-model="active" label="Active" /> -->
    <div class="chain-tools-wrapper--list open">
      <div class="list-wrapper">
        <div class="list-wrapper--chain__eos-to-vtx-convertor">
          <div v-if="step >= 0" class="">
            <div v-show="!Array.isArray(accountNames) || !accountNames.length">
              <div class="text-h6 --title">There are no EOS accounts attached to this public key.</div>
              <q-stepper
                light
                flat
                v-model="step"
                vertical
                ref="stepper"
                color="primary"
                animated
              >
                <q-step
                  :name="0"
                  title="Select a new account name"
                  icon="settings"
                  :done="step > 0"
                >
                  <div class="text-black">
                    <div class="text-h4 --subtitle">
                      <ul>
                        <li><span>Choose a 12 letter and/or (1-5)EOS account name</span></li>
                        <!-- <li><span>0.35 EOS is required to be transferred to the new account</span></li> -->
                      </ul>
                    </div>
                    <q-input
                      v-model="accountNew"
                      light
                      color="green"
                      label="Account Name"
                      hint="Choose a 12 Letter and/or Number (1-5)"
                      :error="inError"
                      :error-message="errorMessage"
                      @input="checkName"
                      @keyup.enter="goToStep(12)"
                    >
                    </q-input>
                  </div>
                  <q-stepper-navigation class="flex justify-end" v-show="!inError" >
                    <q-btn @click="step = 1" unelevated color="deep-purple-14" class="--next-btn" rounded label="Next" />
                  </q-stepper-navigation>
                </q-step>
                <q-step title="Select public key"
                  :name="1"
                  prefix="1"
                  :done="step > 1"
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
                    <q-btn @click="step = 2" v-if="wallet !== null || publicKey !== ''" color="deep-purple-14" class="--next-btn" rounded label="Next" />
                  </q-stepper-navigation>
                </q-step>
                <q-step
                  :name="2"
                  title="Send 0.35"
                  icon="money"
                  :done="step > 2"
                >
                  <q-btn flat @click="step = 1" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                  <div class="text-black">
                    <div class="text-h4 --subtitle">
                      <ul>
                        <li><span>Send 0.35 EOS to Create the Account</span></li>
                        <!-- <li><span>0.35 EOS is required to be transferred to the new account</span></li> -->
                      </ul>
                    </div>
                    <q-input
                      v-model="accountAmount"
                      light
                      color="green"
                      label="Minimum Amount:"
                      readonly
                    >
                      <template v-slot:append>
                        <q-icon name="file_copy" @click="copyToClipboard(accountAmount, 'Amount')"/>
                      </template>
                    </q-input>
                    <q-input
                      v-model="accountTo"
                      light
                      color="green"
                      label="Send To:"
                      readonly
                    >
                      <template v-slot:append>
                        <q-icon name="file_copy" @click="copyToClipboard(accountTo, 'To Account')"/>
                      </template>
                    </q-input>
                    <q-input
                      v-model="accountMemo"
                      light
                      color="green"
                      label="Mandatory Memo:"
                      readonly
                    >
                      <template v-slot:append>
                        <q-icon name="file_copy" @click="copyToClipboard(accountMemo, 'Memo')"/>
                      </template>
                    </q-input>
                  </div>
                  <q-stepper-navigation class="flex justify-end" v-show="!inError" >
                    <q-btn @click="step = 3" unelevated color="deep-purple-14" class="--next-btn" rounded label="Next" />
                  </q-stepper-navigation>
                </q-step>
                <q-step
                  :name="3"
                  title="Retry the Upgrade Account"
                  icon="restore"
                  :done="step > 3"
                >
                <q-btn flat @click="step = 2" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>

                  <div class="text-h4 --subtitle --subtitle__summary">Summary</div>
                  <ul class="--subtitle__summary--list">
                    <li>Once you have purchase EOS from an exchange and the transfer is complete, retry the upgrade, it will find the account then.</li>
                  </ul>
                </q-step>
              </q-stepper>
            </div>
            <div v-show="Array.isArray(accountNames) && accountNames.length">
              <q-stepper
                light
                flat
                v-model="step2"
                vertical
                ref="stepper"
                color="primary"
                animated
              >
                <q-step
                  :name="1"
                  title="Select account name"
                  icon="settings"
                  :done="step2 > 1"
                >
                  <q-select
                    label="Select an EOS Account Name in the list"
                    separator
                    light
                    rounded
                    outlined
                    v-model="accountName"
                    :options="accountNames"
                    :error="accountNameError"
                    error-message='This account name is already in your wallet, upgrade the other one instead if you have not done so yet.'
                    :loading="!accountNames"
                    @input="validAccountName"
                  />
                </q-step>
                <q-step
                  :name="2"
                  title="Validate Private Key"
                  icon="assignment"
                  :disable="noPrivateKey"
                  :done="step2 > 2"
                >
                  <q-input
                    v-model="privateKeyPassword"
                    light
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
                </q-step>
                <q-step
                  :name="3"
                  title="Confirm Verto Password"
                  icon="add_comment"
                  :done="step2 > 3"
                >
                  <q-input
                    v-model="vertoPassword"
                    light
                    color="green"
                    label="Verto Password"
                    debounce="500"
                    :error="vertoPasswordWrong"
                    error-message="The password is incorrect"
                    @input="checkVertoPassword"
                    @keyup.enter="upgradeAccountName(); prompt=false"
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
                </q-step>
              </q-stepper>
            </div>
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
import { userError } from '@/util/errorHandler'

import configManager from '@/util/ConfigManager'

export default {
  name: 'ChainTools',
  data () {
    return {
      accountNames: null,
      walletName: '',
      accountNew: '',
      accountAmount: '0.35',
      accountTo: 'signupeoseos',
      accountName: '',
      password: '',
      passHasError: false,
      showSubmit: false,
      vertoPassword: null,
      accountNameError: false,
      errorMessage: '',
      vertoPasswordWrong: false,
      showNextButtonToVertoPassword: false,
      showNextButtonToPassword: false,
      inError: true,
      step: 0,
      step2: 1,
      active: true,
      publicKey: '',
      wallet: null,
      options: [],
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
    noPrivateKey () {
      if (typeof this.currentWallet !== 'undefined' && this.currentWallet !== null && this.currentWallet.hasOwnProperty('privateKeyEncrypted') && this.currentWallet.privateKeyEncrypted) {
        return false
      } else {
        return true
      }
    },
    showNext: function () {
      if (!this.voted && !this.proxyModel) {
        return false
      } else {
        return true
      }
    },
    accountMemo () {
      if (this.wallet) {
        return this.accountNew + '-' + this.wallet.key
      } else {
        return false
      }
    }
  },
  async created () {
    this.eosbalance = this.$route.params.eosbalance
    this.hasPrivateKeyInWallet = this.$store.state.currentwallet.wallet.privateKeyEncrypted
    this.tableData = [ ...this.$store.state.currentwallet.config.keys ]

    // console.log('this.tableData', this.tableData)
    let self = this
    this.accountName = this.$route.params.accountName
    self.tableData.forEach(async element => {
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
      self.options.push({
        label: element.name,
        value: element.key,
        image: self.getImages(element.type)
      })
      if (self.accountName === element.name.toLowerCase()) {
        self.wallet = {
          label: element.name,
          value: element.key,
          image: self.getImages(element.type)
        }
        self.getAccountNames(self.wallet)
      }
      // console.log('self.options', self.options)
    })
  },
  mounted () {
    this.walletName = this.$store.state.currentwallet.wallet.name
    this.account = eos.getAccount(this.walletName)

    if (this.account.voter_info) {
      this.stakedAmount = +this.account.voter_info.staked / 10000
      this.currentProxy = this.account.voter_info.proxy
    }
  },
  methods: {
    checkVertoPassword () {
      this.vertoPasswordWrong = false
      this.vertoPassordValid = false
      if (this.vertoPassword.length > 7) {
        try {
          const self = this
          this.$configManager.getConfig(this.vertoPassword)
            .then(function (result) {
              self.vertoPasswordWrong = false
              self.vertoPassordValid = true
            }).catch(function (err) {
              self.vertoPasswordWrong = true
              userError(err)
            })
        } catch (err) {
          self.vertoPasswordWrong = true
          userError(err)
        }
      }
    },
    validAccountName () {
      if (this.$store.state.currentwallet.config.keys.some((key) => key.name.toLowerCase() === this.accountName.label.toLowerCase())) {
        this.accountNameError = true
      } else {
        this.accountNameError = false
        this.noPrivateKey ? this.step2 = 3 : this.step2 = 2
      }
    },
    cancelAccountName () {
      // reset form variables
      this.vertoPassword = null
      this.privateKeyPassword = null
      this.accountName = null
      this.step = 1
    },
    copyToClipboard (key, copied) {
      this.$clipboardWrite(key)
      this.$q.notify({
        message: copied ? copied + ' Copied' : 'Key Copied',
        timeout: 2000,
        icon: 'check',
        textColor: 'white',
        type: 'warning',
        position: 'top'
      })
    },
    getAccountNames (row) {
      console.log('-----------------row-----------------', row)
      this.currentWallet = row
      const self = this
      let key = row.value
      eos.getAccountNamesFromPubKeyP(key)
        .then(function (result) {
          console.log('result', result)
          self.accountNames = []
          for (var i = 0; i < result.account_names.length; i++) {
            self.accountNames.push({ label: result.account_names[i], value: result.account_names[i] })
          }
          self.walletName = result.account_names[0]
          this.step = 1
        }).catch((err) => {
          userError('There was a problem getting account names', err)
        })
      this.prompt = true
    },
    async login () {
      this.passHasError = false
      if (!this.password) {
        this.passHasError = true
        return
      }
      const results = await configManager.login(this.password)
      if (results.success) {
        this.step = 3
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
    showMore () {},
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
            .--title{
              font-size: 25px;
              font-family: $Titillium;
              font-weight: $regular;
              color: #2A2A2A;
              margin: 0px;
              padding-left: 25px;
              padding-top: 20px;
              position: relative;
            }
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

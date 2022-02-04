<template>
<div :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <div class="chain-tools-wrapper">
        <!-- <q-toggle v-model="active" label="Active" /> -->
        <div class="chain-tools-wrapper--list open">
            <div class="list-wrapper">
                <div class="list-wrapper--chain__eos-to-vtx-convertor">
                    <div v-if="step >= 0" class="">
                        <div v-show="true || !Array.isArray(accountNames) || !accountNames.length">

                            <q-stepper :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" flat v-model="step" vertical ref="stepper" color="primary" animated>
                               <q-step title="Create/Import wallet" :name="1" prefix="2" :done="step > 1">

                                    <div class="text-black">
                                        <div v-if="!publicKey" class="text-h4 --subtitle --subtitle__summary">Generate new key pair (Public/Private key)</div>
                                        <q-btn  v-if="!publicKey" @click="generateKeyPair()"  color="deep-purple-14" class="--next-btn" rounded label="Generate key Pair" />

                                        <div v-if="!publicKey" class="text-h4 --subtitle --subtitle__summary">Select the private key for this account</div>
                                        <q-select v-if="!publicKey" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" separator rounded outlined class="select-input" v-model="currentToken" :options="tokensOption">

                                            <template v-slot:option="scope">
                                                <q-item class="custom-menu" v-bind="scope.itemProps" v-on="scope.itemEvents">
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
                                                <q-item v-if="currentToken">
                                                    <q-item-section avatar>
                                                        <q-icon class="option--avatar" :name="`img:${currentToken.image}`" />
                                                    </q-item-section>
                                                    <q-item-section>
                                                        <q-item-label v-html="currentToken.label" />
                                                        <q-item-label caption>{{ currentToken.value }}</q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                                <q-item v-else>
                                                </q-item>
                                            </template>

                                            <template v-slot:append>
                                                <q-btn round flat unelevated text-color="grey" @click.stop icon="o_file_copy" />
                                            </template>
                                        </q-select>
                                        <div class="text-h4 --subtitle --subtitle__summary">or import your account by pasting your public key below</div>
                                        <q-input @input="getPublicKeyFromPrivate()" v-model="privateKey.key" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" rounded outlined class="--input" color="deep-purple-14" label="Private key" debounce="500" />
                                         <div v-if="publicKey" class="text-body2 q-mt-sm q-pl-sm">Public key: {{publicKey}}</div>
                                    </div>
                                    <q-stepper-navigation class="flex justify-end">
                                        <q-btn @click="step++" v-if="publicKey" color="deep-purple-14" class="--next-btn" rounded label="Next" />
                                    </q-stepper-navigation>
                                </q-step>
                                 <q-step :name="2" title="Select a new account name" icon="settings" :done="step > 2">
                                  <q-btn flat @click="step--" unelevated icon="keyboard_arrow_up" :color="$store.state.settings.lightMode === 'false' ? 'primary' : 'white'" class="--back-btn" />

                                    <div class="text-black">
                                        <div class="text-h4 --subtitle">
                                            <ul>
                                                <li ><span>Choose a 12 letter and/or (1-5)EOS account name</span></li>
                                                <!-- <li><span>0.35 EOS is required to be transferred to the new account</span></li> -->
                                            </ul>
                                        </div>
                                        <q-input v-model="accountNew" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" color="green" label="Account Name" hint="Choose a 12 Letter and/or Number (1-5)" :error="inError" :error-message="errorMessage" @input="checkName" @keyup.enter="step = 2">
                                        </q-input>

                                        <q-input  v-show="!inError" v-model="vertoPassword" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" color="green" label="Enter Verto Password" debounce="500" :error="vertoPasswordWrong" error-message="The password is incorrect" @input="checkVertoPassword" @keyup.enter="upgradeAccountName(); prompt=false" :type="isPwd ? 'password' : 'text'">
                                        <template v-slot:append>
                                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                                        </template>
                                    </q-input>

                                    </div>
                                    <q-stepper-navigation class="flex justify-end" v-show="!inError">
                                        <q-btn @click="createAccount()" unelevated color="deep-purple-14" class="--next-btn" rounded label="Create new account" />
                                    </q-stepper-navigation>
                                </q-step>
                                <q-step :name="3" title="Account successfully created" v-if="step==3" icon="settings" :done="step > 3">
                                  <q-btn flat @click="step--" unelevated icon="keyboard_arrow_up" :color="$store.state.settings.lightMode === 'false' ? 'primary' : 'white'" class="--back-btn" />

                                    <div class="text-black">
                                        <div class="text-h4 --subtitle">
                                            <ul>
                                                <li ><span>Congratulations you have succesfully created your account</span></li>

                                            </ul>
                                        </div>

                                    </div>

                                </q-step>

                            </q-stepper>
                        </div>
                        <div v-show="Array.isArray(accountNames) && accountNames.length">
                            <div class="text-h6 --title">There is an EOS accounts to be attached to this public key.</div>
                            <q-stepper :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" flat v-model="step" vertical ref="stepper" color="primary" animated>
                                <q-step :name="1" title="Select account name" icon="settings" :done="step > 1">
                                    <div class="text-black">
                                        <div class="text-h4 --subtitle">
                                            <ul>
                                                <li><span>Choose EOS account</span></li>
                                            </ul>
                                        </div>
                                        <q-select label="Select an EOS Account Name in the list" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" separator rounded outlined class="select-input" v-model="accountName" :options="accountNames" :error="accountNameError" error-message='This account name is already in your wallet, upgrade the other one instead if you have not done so yet.' :loading="!accountNames" @input="validAccountName" />
                                    </div>
                                </q-step>
                                <q-step :name="2" title="Validate Private Key" icon="assignment" :disable="noPrivateKey" :done="step > 2">
                                    <q-input v-model="privateKeyPassword" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" color="green" label="Private Key Password" debounce="500" :error="invalidPrivateKeyPassword" error-message="The password is incorrect" @input="checkPrivateKeyPassword" :type="isPwd ? 'password' : 'text'">
                                        <template v-slot:append>
                                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                                        </template>
                                    </q-input>
                                </q-step>
                                <q-step :name="3" title="Confirm Verto Password" icon="add_comment" :done="step > 3">
                                    <q-input v-model="vertoPassword" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" color="green" label="Verto Password" debounce="500" :error="vertoPasswordWrong" error-message="The password is incorrect" @input="checkVertoPassword" @keyup.enter="upgradeAccountName(); prompt=false" :type="isPwd ? 'password' : 'text'">
                                        <template v-slot:append>
                                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                                        </template>
                                    </q-input>

                                    <q-btn color="white" text-color="black" label="Submit" @click="upgradeAccountName(); prompt=false" />

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
import {
  userError
} from '@/util/errorHandler'
import ecc from 'eosjs-ecc'
import configManager from '@/util/ConfigManager'
import initWallet from '@/util/_Wallets2Tokens'
export default {
  name: 'VTXConverter',
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
      step: 1,
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
        success: null,
        key: null
      },
      addWallet: {},
      transactionId: null,
      transactionError: false,
      spinnervisible: false,
      isPwd: true,
      currentAccount: {},
      currentToken: null,
      creator: {},
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
      tokensOption: [],
      params: null
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
      if (this.currentToken) {
        return this.accountNew + '-' + this.currentToken.value
      } else {
        return false
      }
    }
  },
  async created () {
    this.params = this.$store.state.currentwallet.params
    this.tableData = await this.$store.state.wallets.tokens
    let self = this
    this.tableData.map(token => {
      if (token.origin === 'eos_tesnet') {
        self.tokensOption.push({
          label: token.name.toLowerCase(),
          value: token.key,
          image: token.icon
        })
      }
    })
    /*
    /*
                            this.currentAccount = this.tableData.find(w => w.chain === this.params.chainID && w.type === this.params.tokenID && (
                              w.chain === 'eos' ? w.name.toLowerCase() === this.params.accountName : w.key === this.params.accountName))
                              */
    // this.currentAccount = this.tableData.find(w => w.chain === 'eos' && w.type === 'verto')

    this.creator.key = 'EOS8UrDjUkeVxfUzUS1hZQtmaGkdWbGLExyzKF6569kRMR5TzSnQT'
    this.creator.privateKey = '5JDCvBSasZRiyHXCkGNQC7EXdTNjima4MXKoYCbs9asRiNvDukc'
    this.creator.name = 'berthonytha1'
    this.creator.icon = 'https://files.coinswitch.co/public/coins/eos.png'

    /*
    this.currentToken = {
      label: this.currentAccount.name,
      value: this.currentAccount.key,
      image: this.currentAccount.icon
    }
    */

    // this.getAccountNames()
  },
  updated () {

  },
  mounted () {},
  methods: {
    generateKeyPair () {
      ecc.randomKey().then(privateWif => {
        this.publicKey = ecc.privateToPublic(privateWif)
        this.privateKey.key = privateWif
      })
    },
    getPublicKeyFromPrivate () {
      this.publicKey = false
      if (eos.isPrivKeyValid(this.privateKey.key)) {
        this.publicKey = ecc.privateToPublic(this.privateKey.key)
      } else {
        this.publicKey = null
      }
    },
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
        this.noPrivateKey ? this.step = 3 : this.step = 2
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
    getAccountNames () {
      const self = this
      let key = this.currentToken.value
      eos.getAccountNamesFromPubKeyP(key)
        .then(function (result) {
          console.log('result pour getAccountNames ', result)
          self.accountNames = []
          for (var i = 0; i < result.account_names.length; i++) {
            self.accountNames.push({
              label: result.account_names[i],
              value: result.account_names[i]
            })
          }
          self.walletName = result.account_names[0]
          self.step = 1
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
        if (results.message === 'no_default_key') {} else {
          this.passHasError = true
        }
      }
    },
    async createAccount () {
      this.$configManager.getConfig(this.vertoPassword).then(async () => {
        try {
          await eos.transact({
            actions: [{
              account: 'eosio',
              name: 'newaccount',
              authorization: [{
                actor: this.creator.name,
                permission: 'active'
              }],
              data: {
                creator: this.creator.name,
                name: this.accountNew,
                owner: {
                  threshold: 1,
                  keys: [
                    {
                      key: this.publicKey,
                      weight: 1
                    }
                  ],
                  accounts: [],
                  waits: []
                },
                active: {
                  threshold: 1,
                  keys: [
                    {
                      key: this.publicKey,
                      weight: 1
                    }
                  ],
                  accounts: [],
                  waits: []
                }
              }
            }]
          }, { keyProvider: this.creator.privateKey })
          this.AddAccountToConfig()
          this.step++
        } catch (error) {
          userError(error.toString())
        }
      }).catch((err) => {
        userError(err.toString())
      })
    },
    async AddAccountToConfig () {
      /* this.currentAccount.origin = 'eos_testnet'
      this.currentAccount.type = 'eos'
      this.currentAccount.name = this.accountNew
      this.currentAccount.to = `/verto/wallets/eos/eos/${this.currentAccount.name}`
      this.currentAccount.icon = 'https://files.coinswitch.co/public/coins/eos.png'
      */
      // this.$configManager.updateCurrentWallet(this.currentAccount)

      this.addWallet = {
        walletName: {
          value: this.accountNew
        },
        origin: 'eos_testnet',
        address: this.publicKey,
        addressPriv: this.privateKey.key,
        vertoPassword: this.vertoPassword,
        vertoPasswordError: 'Wrong paswword',
        storeInWallet: true
      }

      // await this.$configManager.createEosWallet(addWallet)
      console.log(this.addWallet)
      const result = await this.$configManager.saveWalletAndKey(this.accountNew, this.addWallet.vertoPassword, null, this.addWallet.address, this.addWallet.addressPriv, 'eos', 'eos_testnet')
      console.log(result, 'resultresult')
      this.$configManager.updateConfig(this.vertoPassword, this.$store.state.currentwallet.config)
      // reset form variables
      this.vertoPassword = null
      this.privateKeyPassword = null
      this.accountName = null
      initWallet()
      // this.step = 1
      // this.$router.push('/verto/dashboard')
    },
    async upgradeAccountName () {
      this.currentAccount.origin = 'eos_testnet'
      this.currentAccount.type = 'eos'
      this.currentAccount.name = this.accountName.value
      this.currentAccount.to = `/verto/wallets/${this.currentAccount.chain}/${this.currentAccount.type}/${this.currentAccount.name}`
      this.currentAccount.icon = 'https://files.coinswitch.co/public/coins/eos.png'
      // this.$configManager.updateCurrentWallet(this.currentAccount)
      await this.$configManager.createEosWallet(this.currentAccount)
      this.$configManager.updateConfig(this.vertoPassword, this.$store.state.currentwallet.config)
      // reset form variables
      this.vertoPassword = null
      this.privateKeyPassword = null
      this.accountName = null
      initWallet()
      // this.step = 1
      this.$router.push('/verto/dashboard')
    },
    checkPassword () {
      if (this.password.length > 2) {
        this.showSubmit = true
      } else {
        this.showSubmit = false
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
        // console.log('this.slider', this.slider)
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

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.chain-tools-wrapper {
    padding: 0px 6%;

    &--list {
        &__hide-chain-tools {
            text-transform: initial !important;
            margin-top: 0px;
            margin-bottom: 10px;
            color: #7272FA !important;
        }

        .list-wrapper {
            overflow: hidden;
            visibility: hidden;
            height: 0px;
            opacity: 0;
            transform: translateY(-20px) scaleY(.5);
            transform-origin: top;
            transition: ease transform .3s, ease opacity .4s;

            &--chain {
                &__type {
                    background-color: #fff;
                    margin-bottom: 10px;
                    border-radius: 0px 0px 10px 10px;
                    padding: 3% 8%;
                    box-shadow: 0px 4px 16px 0px rgba(black, .09);
                    font-family: $Titillium;
                    font-size: 20px;
                    color: #2A2A2A;
                    font-weight: $bold;

                    b {
                        color: #7272FA;
                        text-transform: uppercase;
                    }

                    .chain {}

                    .token {}
                }

                &__coming-soon {
                    ul {
                        list-style: none;
                        padding: 0px;
                        margin: 0px;
                        padding: 5% 6%;

                        li {
                            &:not(:last-child) {
                                border-bottom: 1px solid #707070;
                            }

                            .btn-soon {
                                text-transform: initial !important;
                                padding: 20px 10px;
                                border-radius: 0px;

                                /deep/ .q-btn__content {
                                    display: flex;
                                    justify-content: space-between;
                                    flex-direction: row;
                                    align-items: center;
                                    align-content: center;
                                }

                                .title {
                                    font-size: 20px;
                                    color: #454F63;
                                    font-weight: $bold;
                                    margin-right: auto;
                                }

                                .soon {
                                    font-size: 16px;
                                    color: #B0B0B0;
                                    display: flex;
                                    justify-content: space-between;
                                    flex-direction: row;
                                    align-items: center;
                                    align-content: center;
                                }

                                .icon {
                                    color: #78849E;
                                    position: relative;
                                    top: 2px;
                                    margin-left: 20px;
                                }
                            }
                        }
                    }
                }

                &__eos-to-vtx-convertor {
                    background-color: #fff;
                    margin-bottom: 10px;
                    border-radius: 10px;
                    padding: 1% 2%;
                    box-shadow: 0px 4px 16px 0px rgba(black, .09);

                    .--title {
                        font-size: 25px;
                        font-family: $Titillium;
                        font-weight: $regular;
                        color: #2A2A2A;
                        margin: 0px;
                        padding-left: 25px;
                        padding-top: 20px;
                        position: relative;
                    }

                    &--title {
                        font-size: 22px;
                        font-family: $Titillium;
                        font-weight: $bold;
                        color: #2A2A2A;
                        margin: 0px;
                        padding-left: 22px;
                        margin-top: 3px;
                        position: relative;
                    }

                    /deep/ .q-stepper__step {
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

                    /deep/ .q-stepper__tab {
                        .q-stepper__title {
                            font-size: 20px;
                            font-family: $Titillium;
                            font-weight: $bold;
                            color: #2A2A2A;
                        }

                        &.q-stepper__tab--active,
                        &.q-stepper__tab--done {
                            .q-stepper__title {
                                color: #7272FA;
                            }

                            .q-stepper__dot {
                                background: #7272FA;
                            }
                        }
                    }

                    .--input {
                        margin-top: 20px;

                        /deep/ .q-field {
                            height: 40px;
                        }

                        /deep/ .q-field__native,
                        /deep/ .q-field__prefix,
                        /deep/ .q-field__suffix {
                            padding-top: 10px;
                            padding-bottom: 0px;
                        }

                        /deep/ .q-field__label {
                            top: 10px;
                            font-size: 12px;
                            font-weight: $bold;
                            font-family: $Titillium;
                        }

                        /deep/ .q-field__marginal {
                            height: 40px;
                        }

                        /deep/ .q-field__control {
                            height: 40px;
                        }
                    }

                    .--slider {
                        /deep/ &.q-slider--dark {
                            .q-slider__track-container {
                                background: rgba(0, 0, 0, 0.3);
                            }

                            .q-slider__pin-value-marker-text {
                                font-weight: $bold;
                                font-size: 11px;
                            }

                            .q-slider__pin-value-marker-bg {
                                background: #FFB200 !important;
                            }

                            .text-green {
                                background: #FFB200 !important;
                            }
                        }
                    }

                    .--next-btn {
                        width: fit-content;
                        text-transform: initial !important;
                        margin-left: 10px;
                        margin-bottom: 10px;
                    }

                    .--progress {
                        height: 20px;

                        /deep/ .q-linear-progress {
                            margin-top: 8px;
                            height: 5px !important;
                            max-width: 90%;
                            margin-left: auto;
                            margin-right: auto;

                            .q-linear-progress__track {
                                background: #FFB200;
                            }

                            .q-linear-progress__model--indeterminate:before,
                            .q-linear-progress__model--indeterminate:after {
                                background: #FFB200;
                            }
                        }

                        &.hr-vertical {
                            max-width: 50px;

                            .bar {
                                height: 30px;
                                width: 4px;
                                background: #FFB200;
                                margin-top: 5px;
                                border-radius: 10px;
                            }
                        }
                    }

                    .--back-btn {
                        position: absolute;
                        right: 0px;
                        top: 6px;
                    }

                    .--subtitle {
                        font-size: 17px;
                        color: #000;
                        font-family: $Titillium;
                        font-weight: $regular;
                        line-height: 20px;
                        margin-top: 10px;
                        margin-bottom: 30px;

                        ul {
                            padding: 0px;
                            margin: 0px;
                            margin-left: 20px;

                            li {
                                font-size: 15px;
                                font-weight: $bold;
                                margin-bottom: 10px;
                                line-height: 15px;
                                color: #FFB200;

                                span {
                                    color: #2A2A2A;
                                }
                            }
                        }

                        &__success {
                            color: #00D0CA;
                            font-weight: $bold;
                            margin-bottom: 20px;
                        }

                        &__faild {
                            color: #FFB200;
                            font-weight: $bold;
                            margin-bottom: 20px;
                        }

                        &__transLink {
                            color: #2A2A2A;
                            border-bottom: 1px solid;
                            width: fit-content;
                            font-weight: $bold;
                            margin-bottom: 20px;
                        }

                        &__summary {
                            margin-bottom: 20px;
                            font-weight: $bold;
                        }

                        &__summary--list {
                            list-style: disc;
                            padding-left: 24px;
                            margin-top: -10px;

                            li {
                                color: #B0B0B0;
                            }
                        }
                    }

                    .--title,
                    .--amount {
                        font-size: 15px;
                        font-family: $Titillium;
                        font-weight: $bold;
                        color: #B0B0B0;
                        text-transform: initial !important;
                        line-height: 20px;
                    }

                    .--alert {
                        font-size: 17px;
                        line-height: 21px;
                        font-family: $Titillium;
                    }

                    .--amount {
                        color: #2A2A2A !important;
                    }
                }
            }
        }

        &.open {
            margin-bottom: -100px;

            .list-wrapper {
                visibility: visible;
                height: auto;
                opacity: 1;
                transform: translateY(0px) scaleY(1);
                margin-bottom: 10px;
            }
        }
    }
}

.select-input {
    border-radius: 100px !important;
    $height: 50px;
    height: $height;

    /deep/ .q-field__marginal {
        height: $height;
        min-height: unset;
    }

    /deep/ .q-field__control {
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
                padding-left: 8px;
                min-height: $height;
                padding-bottom: 0px;

                .q-item__section {
                    padding-right: 0px;
                    min-width: 36px;

                    .q-item__label+.q-item__label {
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

/deep/ .option--avatar {
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
.dark-theme{
    .chain-tools-wrapper--list .list-wrapper--chain__eos-to-vtx-convertor{
      background-color: #04111F;
    }
    .chain-tools-wrapper--list .list-wrapper--chain__eos-to-vtx-convertor .--subtitle{
        color: #CCC;
    }
    .chain-tools-wrapper--list .list-wrapper .select-input .q-field__control .q-field__native .q-item .q-item__section .q-item__label + .q-item__label{
        color: #CCC !important;
    }
    .chain-tools-wrapper--list .list-wrapper--chain__eos-to-vtx-convertor .--amount{
      color: #FFF !important;
    }
    .chain-tools-wrapper--list .list-wrapper--chain__eos-to-vtx-convertor .--subtitle ul li span{
      color: #CCC;
    }

}
  /deep/ .q-stepper{
    &.q-dark{
      background: #04111F;
      .q-tab-panels{
        background: #04111F;
      }
      .q-stepper__title{
        color: #CCC !important;
      }
    }
  }
</style>

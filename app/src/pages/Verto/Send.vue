<template>
  <q-page class="text-black bg-white" :class="osName.toLowerCase() === 'windows' ? 'desktop-marg': 'mobile-pad'">
    <div v-if="getPassword" class="send-modal flex flex-center" :class="{'open' : openModal}">
      <div class="send-modal__content column flex-center">
        <div class="send-modal__content--head">
          <span class="text-h5 --amount">Private key password</span>
          <q-btn color="white" rounded flat unelevated @click="hideModalFun()" class="close-btn" text-color="black" label="+" />
        </div>
        <div class="send-modal__content--body column flex-center full-width">
          <q-input
            v-model="privateKeyPassword"
            light
            rounded
            outlined
            class="full-width"
            color="green"
            label="Private Key Password"
            @input="checkPrivateKeyPassword"
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

          <div class="flex justify-start full-width">
            <q-btn @click="openModal = false" unelevated color="grey" class="--next-btn mr10" rounded label="Cancel" />
            <q-btn @click="toSummary()" unelevated color="deep-purple-14" class="--next-btn" rounded label="Submit transaction" />
          </div>

        </div>
        <div class="send-modal__content--footer">
          <div class="text-h4 --error">{{ ErrorMessage }}</div>
        </div>
      </div>
    </div>
    <div class="send-modal flex flex-center" :class="{'open' : openModalProgress}">
      <div class="send-modal__content column flex-center">
        <div class="send-modal__content--head">
          <span class="text-h5 --amount">{{sendAmount + ' ' + currentAccount.type.toUpperCase()}}</span>
          <q-btn color="white" rounded flat unelevated @click="hideModalFun()" class="close-btn" text-color="black" label="+" />
        </div>
        <div class="send-modal__content--body column flex-center">
          <q-circular-progress
              indeterminate
              :value="progressValue"
              size="100px"
              :thickness="0.05"
              color="cyan-5"
              track-color="grey-3"
              class="q-ma-md" />
          <svg class="svg_logo" fill="#7272FA" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58"><path d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z" transform="translate(-183 -18.21)"></path></svg>
          <div class="--label text-cyan-5 text-h6">{{transStatus}}</div>
        </div>
        <div class="send-modal__content--footer">
          <div class="text-h4 --email">To {{sendTo}}</div>
        </div>
      </div>
    </div>
    <q-dialog v-model="transSuccessDialog">
      <q-card class="q-pa-lg" style="width: 700px; max-width: 90vw;">
        <q-toolbar>
          <q-avatar><q-icon name="done_all" size="md" color="green" /></q-avatar>
          <q-toolbar-title><span class="text-weight-bold">Success</span></q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="text-h6">
          <div class="text-h6 q-mb-md q-pl-sm">Transaction done Successfully.</div>
          <q-input readonly class="input-input" rounded outlined color="purple" v-model="transactionLink">
            <template v-slot:append>
              <div class="flex justify-end">
                <q-btn flat unelevated @click="copyToClipboard(transactionLink , 'Transaction link')" text-color="grey" round class="btn-copy" icon="o_file_copy" />
              </div>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right" class="q-pr-sm">
          <q-btn label="Close" flat class="yes-btn" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="transErrorDialog">
      <q-card class="q-pa-lg">
        <q-toolbar>
          <q-avatar><q-icon name="error_outline" size="md" color="red" /></q-avatar>
          <q-toolbar-title><span class="text-weight-bold">Error</span></q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="text-h6">{{ErrorMessage}}</q-card-section>
        <q-card-actions align="right" class="q-pr-sm">
          <q-btn label="Close" flat class="yes-btn" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="desktop-version" v-if="osName.toLowerCase() === 'windows'">
      <div class="row">
        <div class="col col-md-3">
          <div class="wallets-container">
            <profile-header :isMobile="false" class="marg" version="type2222" />
            <wallets :isMobile="false" :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
            <!-- <img src="statics/prototype_screens/wallets.jpg" alt=""> -->
          </div>
        </div>
        <div class="col col-md-9">
          <div class="desktop-card-style apps-section q-mb-sm">
            <div class="standard-content">
              <h2 class="standard-content--title flex justify-start">Send </h2>
              <div class="standard-content--body">
                <div class="standard-content--body__form">
                  <div class="row">
                    <div class="col col-8 q-pr-lg">
                      <span class="lab-input">From</span>
                      <q-input v-model="from" rounded class="input-input pr80" outlined color="purple" type="text" :label="(currentAccount.type !== 'eos' && currentAccount.type !== 'verto') ? 'Current ' + currentAccount.type.toUpperCase() + ' Address' : 'Current ' + currentAccount.type.toUpperCase() + ' Account'">
                        <template v-slot:append>
                          <div class="flex justify-end">
                            <q-btn flat unelevated text-color="grey" @click="copyToClipboard(from , 'Address')" round class="btn-copy" icon="o_file_copy" />
                          </div>
                        </template>
                      </q-input>
                    </div>
                    <div class="col col-4">
                      <span class="lab-input">Amount</span>
                      <q-input v-model="sendAmount" class="input-input" rounded outlined color="purple" type="number">
                        <template v-slot:append>
                          <div class="flex justify-end">
                            <span class="tokenID">{{ params.tokenID }}</span>
                            <q-btn color="white" rounded class="mt-5" @click="getMaxBalance()" outlined unelevated flat text-color="black" label="Max" />
                          </div>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col col-12">
                      <span class="lab-input">To</span>
                      <q-input
                        ref="sendTo"
                        v-model="sendTo"
                        @input="checkTo()"
                        class="input-input pr80" outlined rounded color="purple"
                        type="text"
                        bottom-slots
                        :error="toError"
                        :error-message="toErrorMessage"
                        :label="(currentAccount.type !== 'eos' && currentAccount.type !== 'verto') ? currentAccount.type.toUpperCase() + ' Address' : 'Account name'"
                      >
                        <template v-slot:append>
                          <div class="flex justify-end">
                            <!-- <q-btn flat unelevated round class="btn-copy"><span class="qr-btn"><img src="statics/qr-icon.png" alt=""></span> </q-btn> -->
                            <q-btn flat unelevated @click="copyToClipboard(sendTo , 'Address')" text-color="grey" round class="btn-copy" icon="o_file_copy" />
                          </div>
                        </template>
                      </q-input>
                    </div>
                    <div class="col col-12">
                      <span class="lab-input">Memo</span>
                      <q-input ref="sendMemo" v-model="sendMemo" @input="checkMemo" :error="memoError" error-message="Memo is required on this exchange, check your deposit instructions" rounded outlined class="" color="purple" type="textarea"/>
                    </div>
                  </div>
                </div>
                <br>
              </div>
              <div class="standard-content--footer">
                <q-btn flat class="action-link next" color="black" @click="openModalFun()" text-color="white" :disable="!sendToResolved" label="Transfer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="standard-content">
      <h2 class="standard-content--title flex justify-center"><q-btn flat unelevated class="btn-align-left" :to="goBack" text-color="black" icon="keyboard_backspace" /> Send </h2>
      <div class="standard-content--body">
        <div class="standard-content--body__form">
          <span class="lab-input">From</span>
          <q-input v-model="from" rounded class="input-input pr80" outlined color="purple" type="text" :label="(currentAccount.type !== 'eos' && currentAccount.type !== 'verto') ? 'Current ' + currentAccount.type.toUpperCase() + ' Address' : 'Current ' + currentAccount.type.toUpperCase() + ' Account'">
            <template v-slot:append>
              <div class="flex justify-end">
                <q-btn flat unelevated text-color="grey" @click="copyToClipboard(from , 'Address')" round class="btn-copy" icon="o_file_copy" />
              </div>
            </template>
          </q-input>
          <span class="lab-input">Amount</span>
          <q-input v-model="sendAmount" class="input-input" rounded outlined color="purple" type="number">
            <template v-slot:append>
              <div class="flex justify-end">
                <span class="tokenID">{{ params.tokenID }}</span>
                <q-btn color="white" rounded class="mt-5" @click="getMaxBalance()" outlined unelevated flat text-color="black" label="Max" />
               </div>
            </template>
          </q-input>

          <span class="lab-input">To</span>
          <q-input
            ref="sendTo"
            v-model="sendTo"
            @input="checkTo()"
            class="input-input pr80" outlined rounded color="purple"
            type="text"
            bottom-slots
            :error="toError"
            :error-message="toErrorMessage"
            :label="(currentAccount.type !== 'eos' && currentAccount.type !== 'verto') ? currentAccount.type.toUpperCase() + ' Address' : 'Account name'"
          >
            <template v-slot:append>
              <div class="flex justify-end">
                <!-- <q-btn flat unelevated round class="btn-copy"><span class="qr-btn"><img src="statics/qr-icon.png" alt=""></span> </q-btn> -->
                <q-btn flat unelevated @click="copyToClipboard(sendTo , 'Address')" text-color="grey" round class="btn-copy" icon="o_file_copy" />
              </div>
            </template>
          </q-input>

          <span class="lab-input">Memo</span>
          <q-input ref="sendMemo" v-model="sendMemo" @input="checkMemo" :error="memoError" error-message="Memo is required on this exchange, check your deposit instructions" rounded outlined class="" color="purple" type="textarea"/>

        </div>
        <br>
        <!-- <div class="total-fee flex justify-between">
          <span class="label">Total Fee</span>
          <span class="value">0.03254 {{ params.tokenID }}</span>
        </div> -->
      </div>
      <div class="standard-content--footer">
         <q-btn flat class="action-link next" color="black" @click="openModalFun()" text-color="white" :disable="!sendToResolved" label="Transfer" />
      </div>
    </div>
  </q-page>
</template>

<script>
// import RadialProgressBar from 'vue-radial-progress'
// import EosWrapper from '@/util/EosWrapper'
import { CruxPay } from '@cruxpay/js-sdk'
import HD from '@/util/hdwallet'
import Lib from '@/util/walletlib'
import { osName } from 'mobile-device-detect'
import Wallets from '../../components/Verto/Wallets'
import ProfileHeader from '../../components/Verto/ProfileHeader'

let cruxClient

export default {
  components: {
    // desktop components
    ProfileHeader,
    Wallets
  },
  data () {
    return {
      osName: '',
      progressValue: 20,
      openModal: false,
      openModalProgress: false,
      transErrorDialog: false,
      transSuccessDialog: false,
      transactionLink: '',
      transStatus: 'Sent Successfully',
      currentWallet: null,
      sendTo: '',
      to: '',
      goBack: '',
      fetchCurrentWalletFromState: true,
      from: '',
      isPwd: true,
      sendAmount: 1,
      formatedAmount: '',
      options: [],
      minimizedModal: false,
      message: '',
      configPath: '',
      tableData: [],
      sendMemo: '',
      chainID: '',
      tokenID: '',
      accountName: '',
      params: null,
      getPassword: false,
      walletClientName: 'verto', // should be 'verto' when in prod
      cruxKey: {},
      sendToResolved: {},
      memoError: false,
      toError: false,
      toErrorMessage: '',
      invalidPrivateKeyPassword: false,
      privateKeyPassword: '',
      isPrivateKeyEncrypted: false,
      privateKey: {
        success: null
      },
      unknownError: false,
      ErrorMessage: '',
      invalidEosName: false,
      currentAccount: {
        selected: false,
        type: '',
        name: '',
        amount: '',
        contract: '',
        chain: ''
      }
    }
  },
  async created () {
    this.osName = osName
    console.log('this.osName', this.osName)
    this.params = this.$store.state.currentwallet.params
    console.log('this.params', this.params)
    this.tableData = await this.$store.state.wallets.tokens
    this.currentAccount = this.tableData.find(w => w.chain === this.params.chainID && w.type === this.params.tokenID && (
      w.chain === 'eos' ? w.name.toLowerCase() === this.params.accountName : w.key === this.params.accountName)
    )

    this.goBack = this.fetchCurrentWalletFromState ? `/verto/wallets/${this.params.chainID}/${this.params.tokenID}/${this.params.accountName}` : '/verto/dashboard'
    this.from = this.currentAccount.chain !== 'eos' ? this.currentAccount.key : this.currentAccount.name

    console.log('this.currentAccount sur la page send', this.currentAccount)

    if (this.currentAccount.privateKey) {
      this.privateKey.key = this.currentAccount.privateKey
      this.isPrivateKeyEncrypted = false
    } else {
      this.isPrivateKeyEncrypted = true
    }

    this.cruxKey = await HD.Wallet('crux')
    console.log('crux privateKey', this.cruxKey.privateKey)
    cruxClient = new CruxPay.CruxClient({
      walletClientName: this.walletClientName,
      privateKey: this.cruxKey.privateKey
    })
    await cruxClient.init()
  },
  mounted () {
  },
  methods: {
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
    checkMemo () {
      if (this.sendMemo.length > 0) {
        this.$refs.sendMemo.error = false
      } else if (this.sendTo.toLowerCase() === 'stexofficial') {
        this.$refs.sendMemo.error = true
      }
    },
    async checkTo () {
      this.toError = false

      if (this.validateEmail(this.sendTo)) {
        try {
          this.sendToResolved = (await cruxClient.resolveCurrencyAddressForCruxID(this.sendTo, this.currentAccount.chain)).addressHash
        } catch (error) {
          console.log('checkTo:', error)
          this.sendToResolved = ''

          if (error.errorCode === 1002) {
            // ID does not exist
            this.toError = true
            this.toErrorMessage = 'This Verto ID does not exist'
          } else if (error.errorCode === 1005) {
            // Currency address not available for user
            this.toError = true
            this.toErrorMessage = this.currentAccount.chain.toUpperCase() + ' address not set for that user'
          }
        }

        console.log('sendToResolved', this.sendToResolved)
      } else {
        // check for valid eos name
        this.sendToResolved = this.sendTo
        this.invalidEosName = false
        if (this.sendTo.length === 12) {
          if (this.sendTo.toLowerCase() === 'stexofficial') {
            this.memoError = true
          }
        } else {
          this.memoError = false
        }
      }
    },
    validateEmail (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    },
    async getMaxBalance () {
      this.sendAmount = await this.currentAccount.amount
    },
    goChangePassword: function () {
      this.$router.push({ path: '/change-password' })
    },
    openModalFun: function (item) {
      if (this.currentAccount.privateKey) {
        this.sendTokens()
        this.openModalProgress = true
      } else {
        this.getPassword = true
        this.openModal = true
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
    async sendTokens () {
      this.unknownError = false
      this.invalidEosName = false
      this.transStatus = 'Transaction in progress'

      console.log(
        'chainID', this.params.chainID,
        'tokenID', this.params.tokenID,
        'name', this.params.accountName,
        'to', this.sendToResolved,
        'value', this.sendAmount,
        'memo', this.sendMemo,
        'key', this.privateKey.key,
        'contract', this.currentAccount.contract)

      Lib.send(
        this.params.chainID,
        this.params.tokenID,
        this.params.accountName,
        this.sendToResolved,
        this.sendAmount,
        this.sendMemo,
        this.privateKey.key,
        this.currentAccount.contract
      ).then(result => {
        if (result.success) {
          this.getPassword = false
          this.transErrorDialog = false
          this.openModal = false
          this.openModalProgress = false
          this.transSuccessDialog = true
          this.transactionLink = result.message
          this.transStatus = 'Sent Successfully'
        } else {
          this.unknownError = true
          this.ErrorMessage = result.message
          this.transErrorDialog = true
          this.openModal = false
          this.openModalProgress = false
        }
      })
    },
    toSummary () {
      if (!this.invalidPrivateKeyPassword) {
        this.formatedAmount = this.formatAmountString()
        this.sendTokens()
        this.openModalProgress = true
      }
    },
    hideModalFun: function () {
      this.openModal = false
      this.openModalProgress = false
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "~@/assets/styles/variables.scss";
  /deep/ .wallets-wrapper{
    padding-bottom: 0px !important;
  }
  /deep/ .wallets-wrapper--list{
    box-shadow: none;
    margin-top: 0px;
  }
  .marg{
    /deep/ .profile-wrapper{
      &--header{
        margin-bottom: 0px;
      }
    }
  }
  .desktop-version{
    background: #E7E8E8;
    padding-top: 13vh;
    padding-left: 12vh;
    padding-bottom: 50px;
    padding-right: 2%;
  }
  .desktop-card-style{
    height: 100%;
  }
  .standard-content{
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh !important;
    padding-bottom: 100px;
    @media screen and (min-width: 768px) {
      padding: 2%;
      flex-direction: column;
      justify-content: flex-start;
      min-height: unset !important;
      padding-bottom: 20px;
    }
    &--title{
      font-size: 35px;
      font-weight: $bold;
      position: relative;
      line-height: 50px;
      font-family: $Titillium;
      margin-top: 0px;
      margin-bottom: 0px;
      @media screen and (min-width: 768px) {
        margin-top: -20px;
        font-size: 25px;
      }
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
      &__img{
        min-height: 250px;
        img{
          max-width: 90%;
        }
      }
      .total-fee{
        padding: 0px 20px;
        font-family: $Titillium;
        font-weight: $regular;
        color: #B0B0B0;
        font-size: 16px;
      }
      &__form{
        .tokenID{
          text-transform: uppercase;
          font-size: 20px;
          font-weight: 900;
          color: #7271fa;
          padding-top: 0px;
          margin-top: -5px;
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
          margin-bottom: 0px;
          padding-bottom: 0px;
          /deep/ .q-field__control{
            height: 50px;
            min-height: unset;
          }
          .btn-copy{
            // height: 30px;
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
          padding-bottom: 0px;
          margin-top: 20px;
          display: block;
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
        }
      }
    }
    &--footer{
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: flex-end;
      min-height: fit-content;
      .action-link{
        height: 50px;
        text-transform: initial !important;
        font-size: 16px;
        letter-spacing: .5px;
        border-radius: 40px;
        width: 150px;
        margin-left: 10px;
        background-color: #7272FA !important;
        // &.next{
        //   background-color: #7900FF !important;
        // }
        // &.back{
        //   background-color: #B0B0B0 !important;
        // }
      }

    }
  }
  .send-modal{
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(black, .5);
    left: 0px;
    top: 0px;
    z-index: 999999;
    visibility: hidden;
    opacity: 0;
    transition: opacity ease .4s;
    &.open{
      visibility: visible;
      opacity: 1;
      .send-modal__content{
        transform: scale(1);
      }
    }
    &__content{
      background-color: #fff;
      border-radius: 20px;
      max-width: 400px;
      padding: 20px;
      width: 100%;
      box-shadow: 0px -2px 9px 0px rgba(black, .29);
      position: relative;
      transform: scale(0);
      transition: ease transform .3s, opacity ease .2s;
      &--head{
        margin-bottom: 20px;
        .close-btn{
          position: absolute;
          right: 10px;
          top: 10px;
          font-size: 40px;
          font-weight: $light;
          font-family: $Titillium;
          height: 40px;
          width: 40px;
          min-height: unset;
          opacity: .3;
          /deep/ .q-btn__content{
            transform: rotate(45deg);
            min-height: unset;
            line-height: 30px;
            margin-left: 5px;
            margin-top: -4px;
          }
        }
        .--amount{
          font-size: 25px;
          font-weight: $bold;
          font-family: $Titillium;
          margin-top: 20px;
          position: relative;
          top: -9px;
        }
      }
      &--body{
        position: relative;
        .svg_logo{
          fill: #00D0CA;
          position: absolute;
          margin-top: 5px;
          width: 50px;
        }
        .--label{
          font-size: 14px;
          font-weight: $light;
          font-family: $Titillium;
          position: absolute;
          bottom: -15px;
          width: 150%;
          text-align: center;
          letter-spacing: 1.5px;
        }
      }
      &--footer{
        .--email{
          font-size: 16px;
          font-weight: $bold;
          font-family: $Titillium;
          margin-top: 20px;
        }
        .--error{
          color: red;
          font-size: 14px;
          margin-top: 20px;
          font-weight: $bold;
          font-family: $Titillium;
          line-height: 16px;
        }
      }
    }
  }
  .q-card{
    border-radius: 25px;
    box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 35px rgba(0,0,0,0.14), 0 1px 10px rgba(0,0,0,0.12);
  }
  .max200{
    max-width: 200px;
  }
  .mt-5{
    margin-top: -5px;
  }
  .mr10{
    margin-right: 10px;
  }
  /deep/ .q-btn__wrapper{
    min-height: 30px !important;
  }
</style>

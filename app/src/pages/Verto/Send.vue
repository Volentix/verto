<template>
  <q-page class="text-black bg-white" :class="screenSize > 1024 ? 'desktop-marg': 'mobile-pad'">
    <div v-if="getPassword" class="send-modal flex flex-center" :class="{'open' : openModal, 'dark-theme': $store.state.settings.lightMode === 'true'}">
      <div class="send-modal__content column flex-center">
        <div class="send-modal__content--head">
          <span class="text-h5 --amount">Private key password</span>
          <q-btn :color="$store.state.settings.lightMode === 'true' ? 'black' : 'white'" rounded flat unelevated @click="hideModalFun()" class="close-btn" :text-color="$store.state.settings.lightMode === 'true' ? 'white' : 'black'" label="+" />
        </div>
        <div class="send-modal__content--body column flex-center full-width">
          <q-input
            v-model="privateKeyPassword"
            :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
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
    <div class="send-modal flex flex-center" :class="{'open' : openModalProgress, 'dark-theme': $store.state.settings.lightMode === 'true'}">
      <div class="send-modal__content column flex-center">
        <div class="send-modal__content--head">
          <span class="text-h5 --amount">{{sendAmount + ' ' + currentAccount.type.toUpperCase()}}</span>
          <q-btn :color="$store.state.settings.lightMode === 'true' ? 'black' : 'white'" rounded flat unelevated @click="hideModalFun()" class="close-btn" :text-color="$store.state.settings.lightMode === 'true' ? 'white' : 'black'" label="+" />
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
      <q-card class="q-pa-lg" style="width: 700px; max-width: 90vw;" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'">
        <q-toolbar v-if="transStatus != 'pending'">
          <q-avatar><q-icon name="done_all" size="md" color="green" /></q-avatar>
          <q-toolbar-title><span class="text-weight-bold">Success</span></q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="text-h6">
          <div class="text-h6 q-mb-md q-pl-sm">{{transStatus  &&  transStatus == 'pending' ? 'Transaction submitted' : 'Transaction done Successfully.'}}</div>
          <p class="text-body1" v-if=" transStatus == 'pending' "> Follow this link to check its status</p>
          <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" readonly class="input-input" rounded outlined color="purple" v-model="transactionLink">
            <template v-slot:append>
              <div class="flex justify-end">
                <q-btn flat unelevated @click="copyToClipboard(transactionLink , 'Transaction link')" text-color="grey" round class="btn-copy" icon="o_file_copy" />
              </div>
            </template>
          </q-input>
          <a :href="transactionLink" target="_blank" class="text-body2 text-black"> More infos</a>
        </q-card-section>
        <q-card-actions align="right" class="q-pr-sm">
          <q-btn label="Close" flat class="yes-btn" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="transErrorDialog">
      <q-card :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" class="q-pa-lg">
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
    <div :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
      <div class="desktop-version" v-if="screenSize > 1024">
        <div class="row">
          <div class="col col-md-3" v-if="!embedded">
            <div class="wallets-container">
              <profile-header :isMobile="false" class="marg" version="type2222" />
              <wallets :isMobile="false" :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
              <!-- <img src="statics/prototype_screens/wallets.jpg" alt=""> -->
            </div>
          </div>
          <div :class="[ embedded ? 'col-md-10 offset-md-1' : ' col-md-9' , 'col']">
            <div class="desktop-card-style apps-section q-mb-sm" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
              <div class="standard-content">
                <h2 class="standard-content--title flex justify-start items-center">Send <img :src="currentToken.image" class="max40 q-ml-sm" alt=""></h2>
                <div class="standard-content--body">
                  <div class="standard-content--body__form">
                    <div class="row">
                      <div class="col col-8 q-pr-lg">
                        <span class="lab-input">From</span>
                        <q-select
                            :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                            separator
                            rounded
                            outlined
                            class="select-input"
                            v-model="currentToken"
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
                                <q-item-label caption class="ellipsis mw200">{{ scope.opt.value }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </template>
                          <template v-slot:selected>
                            <q-item
                              v-if="currentToken"
                            >
                              <q-item-section avatar>
                                <q-icon class="option--avatar" :name="`img:${currentToken.image}`" />
                              </q-item-section>
                              <q-item-section>
                                <q-item-label v-html="currentToken.label" />
                                <q-item-label caption class="ellipsis mw200">{{ currentToken.value }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item
                              v-else>
                            </q-item>
                          </template>
                        </q-select>
                        <!-- <q-input v-model="from" rounded class="input-input pr80" outlined color="purple" type="text" :label="(currentAccount.type !== 'eos' && currentAccount.type !== 'verto') ? 'Current ' + currentAccount.type.toUpperCase() + ' Address' : 'Current ' + currentAccount.type.toUpperCase() + ' Account'">
                          <template v-slot:append>
                            <div class="flex justify-end">
                              <q-btn flat unelevated text-color="grey" @click="copyToClipboard(from , 'Address')" round class="btn-copy" icon="o_file_copy" />
                            </div>
                          </template>
                        </q-input> -->
                      </div>
                      <div class="col col-4">
                        <span class="lab-input">Amount</span>
                        <q-input :dark="$store.state.settings.lightMode === 'true'" @input="sendAmount = parseFloat(sendAmount) > parseFloat(currentAccount.amount) ? parseFloat(currentAccount.amount) : parseFloat(sendAmount) ; checkGas();" :light="$store.state.settings.lightMode === 'false'" :max="currentAccount.amount" v-model="sendAmount" class="input-input" rounded outlined color="purple" type="number">
                          <template v-slot:append>
                            <div class="flex justify-end">
                              <span class="tokenID">{{ currentToken.type }}</span>
                              <q-btn :color="$store.state.settings.lightMode === 'true' ? 'black' : 'white'" rounded class="mt-5" @click="getMaxBalance()" outlined unelevated flat :text-color="$store.state.settings.lightMode === 'true' ? 'white' : 'black'" label="Max" />
                            </div>
                          </template>
                        </q-input>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col col-12">
                        <span class="lab-input">To</span>
                        <q-input
                          :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                          ref="sendTo"
                          v-model="sendTo"
                          @input="checkTo()"
                          class="input-input pr80" outlined rounded color="purple"
                          type="text"
                          bottom-slots
                          :error="toError"
                          :error-message="toErrorMessage"
                          :label="currentToken.type.toUpperCase() + ' Address'"
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
                        <span v-if="currentToken.chainID && currentToken.chainID.toLowerCase() == 'eos'" class="lab-input">Memo</span>
                        <q-input v-if="currentToken.chainID && currentToken.chainID.toLowerCase() == 'eos'" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" ref="sendMemo" v-model="sendMemo" @input="checkMemo" :error="memoError" error-message="Memo is required on this exchange, check your deposit instructions" rounded outlined class="" color="purple" type="textarea"/>
                      </div>
                    </div>
                  </div>
                  <br>
                </div>
                <q-list v-if="gasOptions.length && currentAccount.chain == 'eth' " class="gasfield q-mb-md"  separator>
                    <q-item dense class="gasSelector">
                        <q-item-section v-for="(gas, index) in gasOptions" :key="index">
                            <q-item :class="[gasSelected.label == gas.label ? 'selected bg-black text-white' : '' , gas.label]" @click="gasSelected = gas" clickable separator v-ripple>
                                <q-item-section>
                                    <q-item-label :class="[gasSelected.label == gas.label ? 'text-black' : 'text-body1 text-black']">${{gas.value }}</q-item-label>
                                    <q-item-label class="text-body1 text-grey"> {{gas.label }}</q-item-label>
                                </q-item-section>
                                <q-item-section avatar>
                                    <q-icon color="primary" name="local_gas_station" />
                                </q-item-section>
                            </q-item>
                        </q-item-section>
                    </q-item>
                </q-list>

                <div class="standard-content--footer">
                  <q-btn flat class="action-link next" :disable="currentAccount.chain == 'eth' &&  gasOptions.length == 0 || sendAmount == 0 || !sendToResolved" color="black" @click="openModalFun()" text-color="white"  label="Transfer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="standard-content mobile-version">
        <h2 class="standard-content--title flex justify-center"><q-btn flat unelevated class="btn-align-left" :to="goBack" :text-color="$store.state.settings.lightMode === 'true' ? 'white':'black'" icon="keyboard_backspace" /> Send </h2>
        <div class="standard-content--body">
          <div class="standard-content--body__form">
            <span class="lab-input">From</span>
            <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-model="from" rounded class="input-input pr80" outlined color="purple" type="text" :label="(currentAccount.type !== 'eos' && currentAccount.type !== 'verto') ? 'Current ' + currentAccount.type.toUpperCase() + ' Address' : 'Current ' + currentAccount.type.toUpperCase() + ' Account'">
              <template v-slot:append>
                <div class="flex justify-end">
                  <q-btn flat unelevated text-color="grey" @click="copyToClipboard(from , 'Address')" round class="btn-copy" icon="o_file_copy" />
                </div>
              </template>
            </q-input>
            <span class="lab-input">Amount</span>
            <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-model="sendAmount" class="input-input" rounded outlined color="purple" type="number">
              <template v-slot:append>
                <div class="flex justify-end">
                  <span class="tokenID">{{ params.tokenID }}</span>
                  <q-btn :color="$store.state.settings.lightMode === 'true' ? 'black' : 'white'" rounded class="mt-5" @click="getMaxBalance()" outlined unelevated flat text-color="black" label="Max" />
                </div>
              </template>
            </q-input>

            <span class="lab-input">To</span>
            <q-input
              :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
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

            <span v-if="currentToken.chainID && currentToken.chainID.toLowerCase() == 'eos'" class="lab-input">Memo</span>
            <q-input v-if="currentToken.chainID && currentToken.chainID.toLowerCase() == 'eos'" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" ref="sendMemo" v-model="sendMemo" @input="checkMemo" :error="memoError" error-message="Memo is required on this exchange, check your deposit instructions" rounded outlined class="" color="purple" type="textarea"/>

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
    </div>
  </q-page>
</template>

<script>
// import RadialProgressBar from 'vue-radial-progress'
// import EosWrapper from '@/util/EosWrapper'
// import { CruxPay } from '@cruxpay/js-sdk'
// import HD from '@/util/hdwallet'
import Lib from '@/util/walletlib'
import { osName } from 'mobile-device-detect'
import Wallets from '../../components/Verto/Wallets'
import ProfileHeader from '../../components/Verto/ProfileHeader'
import EOSContract from '../../mixins/EOSContract'
import ETHContract from '../../mixins/contract'
import {
  mapState
} from 'vuex'
let cruxClient

export default {
  components: {
    // desktop components
    ProfileHeader,
    Wallets
  },
  props: ['embedded'],
  data () {
    return {
      osName: '',
      progressValue: 20,
      gasOptions: [],
      gasSelected: null,
      openModal: false,
      openModalProgress: false,
      transErrorDialog: false,
      transSuccessDialog: false,
      transactionLink: '',
      transStatus: 'Sent Successfully',
      currentWallet: null,
      sendTo: '',
      screenSize: 1024,
      to: '',
      goBack: '',
      fetchCurrentWalletFromState: true,
      from: '',
      isPwd: true,
      sendAmount: 0.001,
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
      params: {
        tokenID: ''
      },
      getPassword: false,
      walletClientName: 'verto', // should be 'verto' when in prod
      cruxKey: {},
      currentToken: {
        image: ''
      },
      sendToResolved: null,
      memoError: false,
      toError: false,
      toErrorMessage: '',
      invalidPrivateKeyPassword: false,
      privateKeyPassword: '',
      isPrivateKeyEncrypted: false,
      privateKey: {
        key: '',
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
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowWidth)
  },
  computed: {
    selectedCoin () {
      return this.$store.state.currentwallet.wallet || {}
    },
    ...mapState('investment', ['gasPrice'])
  },
  watch: {
    gasPrice: function (newVal) {
      this.checkGas()
    },
    currentToken: function (newVal) {
      if (newVal) {
        /*
        this.from = newVal.label
        this.currentAccount = this.tableData.find(w => w.chain === newVal.chainID && w.type === newVal.type && (
          w.chain === 'eos' ? w.name.toLowerCase() === newVal.label : w.key === newVal.label)
        )
        */

        // this.$store.commit('currentwallet/updateCurrentWallet', this.currentAccount)
        this.sendAmount = this.$store.state.currentwallet.params && this.$store.state.currentwallet.params.amount ? this.$store.state.currentwallet.params.amount : 0.001
      }
    }
  },
  async created () {
    this.tableData = await this.$store.state.wallets.tokens

    if (this.$store.state.currentwallet.params) {
      this.params = this.$store.state.currentwallet.params

      if (this.params.amount) { this.sendAmount = this.params.amount }

      if (this.params.to) { this.sendTo = this.params.to }
    } else if (this.$route.params.chainID && this.$route.params.chainID) {
      this.params = {
        chainID: this.$route.params.chainID,
        tokenID: this.$route.params.tokenID,
        accountName: this.$route.params.accountName
      }

      this.$store.commit('currentwallet/updateParams', this.params)
      this.$store.state.currentwallet.wallet = this.getCurrentWallet()
    }

    let exchangeNotif = document.querySelector('.exchange-notif'); if (exchangeNotif !== null) { exchangeNotif.querySelector('.q-btn').dispatchEvent(new Event('click')) }
    this.osName = osName
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)

    let self = this
    this.tableData.map(token => {
      if (!token.disabled && token.type.toLowerCase() !== 'verto' && parseFloat(token.amount) > 0) {
        self.options.push({
          label: token.name.toLowerCase(),
          value: token.chain !== 'eos' ? token.key : token.key + ' - ' + token.type.toUpperCase(),
          image: token.type !== 'usdt' ? token.icon : 'https://assets.coingecko.com/coins/images/325/small/tether.png',
          type: token.type,
          amount: token.amount,
          chainID: token.chain
        })
      }
    })

    if (this.selectedCoin) {
      this.currentAccount = this.selectedCoin
      this.currentToken = {
        label: this.selectedCoin.name,
        value: this.selectedCoin.chain !== 'eos' ? this.selectedCoin.key : this.selectedCoin.key + ' - ' + this.selectedCoin.type.toUpperCase(),
        image: this.selectedCoin.type !== 'usdt' ? this.selectedCoin.icon : 'https://assets.coingecko.com/coins/images/325/small/tether.png',
        type: this.selectedCoin.type,
        chainID: this.selectedCoin.chain,
        amount: this.selectedCoin.amount
      }
    } else {
      this.currentAccount = this.getCurrentWallet()
    }

    this.currentAccount = this.currentAccount || this.currentToken
    if (this.params.chainID === undefined) {
      this.params = {
        chainID: this.currentAccount.chain,
        tokenID: this.currentAccount.type,
        accountName: this.currentAccount.name
      }
    }

    if (this.currentAccount !== undefined) {
      this.goBack = this.fetchCurrentWalletFromState ? `/verto/wallets/${this.params.chainID}/${this.params.tokenID}/${this.params.accountName}` : '/verto/dashboard'
      this.from = this.currentAccount.chain !== 'eos' ? this.currentAccount.key : this.currentAccount.name
    }

    if (this.currentAccount.privateKey) {
      this.privateKey.key = this.currentAccount.privateKey
      this.isPrivateKeyEncrypted = false
    } else {
      this.isPrivateKeyEncrypted = true
    }
    /*
    this.cruxKey = await HD.Wallet('crux')

    cruxClient = new CruxPay.CruxClient({
      walletClientName: this.walletClientName,
      privateKey: this.cruxKey.privateKey
    })
    await cruxClient.init()

    */

    if (this.params.chainID === 'eth') {
      this.$store.dispatch('investment/getGasPrice')
      this.checkTo()
      this.checkGas()
    }
  },
  mounted () {
  },
  methods: {

    getCurrentWallet () {
      return this.tableData.find(w => w.chain === this.params.chainID && w.type === this.params.tokenID && (
        w.chain === 'eos' ? w.name.toLowerCase() === this.params.accountName : true)
      )
    },
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
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
          // console.log('checkTo:', error)
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

        // console.log('sendToResolved', this.sendToResolved)
      } else {
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

      if (this.currentAccount.chain === 'eth') {
        this.checkGas()
      }
    },
    validateEmail (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    },
    getMaxBalance () {
      this.sendAmount = this.currentToken.amount
      // console.log('getMaxBalance', this.sendAmount)
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
    checkGas () {
      if (this.currentAccount.chain !== 'eth') return

      try {
        if (this.sendAmount && this.sendToResolved) {
          Lib.getRawETHTransaction(
            this.currentAccount.type,
            this.currentAccount.key,
            this.sendToResolved,
            this.sendAmount,
            this.privateKey.key,
            this.currentAccount.contract
          ).then((tx) => {
            this.getGasOptions(tx)
          })
        }
      } catch (error) {
        this.ErrorMessage = error.message
      }
    },
    async sendTokens () {
      this.unknownError = false
      this.invalidEosName = false
      this.transStatus = 'Transaction in progress'

      console.log(
        'chain', this.currentAccount.chain,
        'type', this.currentAccount.type,
        'name/key', this.currentAccount.key,
        'to', this.sendToResolved,
        'value', this.sendAmount,
        'memo', this.sendMemo,
        'key', this.privateKey.key,
        'contract', this.currentAccount.contract)

      // Pass gas details in memo
      if (this.currentAccount.chain === 'eth') {
        this.sendMemo = {
          gasData: this.gasSelected,
          txData: null
        }
      }

      Lib.send(
        this.currentAccount.chain,
        this.currentAccount.type,
        this.currentAccount.chain !== 'eos' ? this.currentAccount.key : this.currentAccount.name,
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
          this.transStatus = !result.status ? 'Sent Successfully' : result.status
        } else {
          if (result.message.toString().includes('is greater than the maximum billable CPU time for the transaction') || result.message.toString().includes('the current CPU usage limit imposed on the transaction')) {
            this.payForUserCPU()
          } else {
            this.unknownError = true
            this.ErrorMessage = result.message
            this.transErrorDialog = true
            this.openModal = false
            this.openModalProgress = false
          }
        }
      }).catch((error) => {
        if (error.toString().includes('is greater than the maximum billable CPU time for the transaction') || error.toString().includes('the current CPU usage limit imposed on the transaction')) {
          this.payForUserCPU()
        } else {
          this.unknownError = true
          this.ErrorMessage = error.message

          this.transErrorDialog = true
          this.openModal = false
          this.openModalProgress = false
        }
      })
    },
    payForUserCPU () {
      const actions = [{
        account: this.currentAccount.contract,
        name: 'transfer',
        authorization: [{
          actor: this.currentAccount.name,
          permission: 'active'
        }
        ],
        data: {
          from: this.currentAccount.name.toLowerCase(),
          to: this.sendToResolved.toLowerCase(),
          quantity: parseFloat(this.sendAmount).toFixed(this.currentAccount.precision) + ' ' + this.currentAccount.type.toUpperCase(),
          memo: this.sendMemo
        }
      }]

      let account = {
        name: this.currentAccount.name,
        privateKey: this.privateKey.key
      }
      this.sendFreeCPUTransaction(actions, account).then(result => {
        if (result.success) {
          this.getPassword = false
          this.transErrorDialog = false
          this.openModal = false
          this.openModalProgress = false
          this.transSuccessDialog = true
          this.transactionLink = result.message
          this.transStatus = !result.status ? 'Sent Successfully' : result.status
        } else {
          this.unknownError = true
          this.ErrorMessage = result.message
          this.transErrorDialog = true
          this.openModal = false
          this.openModalProgress = false
        }
      }).catch((error) => {
        this.unknownError = true
        this.ErrorMessage = error.message

        this.transErrorDialog = true
        this.openModal = false
        this.openModalProgress = false
      })
    },
    toSummary () {
      if (!this.invalidPrivateKeyPassword) {
        this.formatedAmount = this.formatAmountString()
        this.sendTokens()
        this.openModalProgress = true
      }
    },
    formatAmountString () {
      let numberOfDecimals = 0
      // console.log('this.currentAccount', this.currentAccount)
      let stringAmount = (Math.round(this.sendAmount * Math.pow(10, this.currentAccount.precision)) / Math.pow(10, this.currentAccount.precision)).toString()
      const amountParsed = stringAmount.split('.')
      if (amountParsed && amountParsed.length > 1) {
        numberOfDecimals = amountParsed[1].length
      } else {
        stringAmount += '.'
      }
      for (;numberOfDecimals < this.currentAccount.precision; numberOfDecimals++) {
        stringAmount += '0'
      }
      return stringAmount + ' ' + this.tokenSymbol
    },
    hideModalFun: function () {
      this.openModal = false
      this.openModalProgress = false
    }
  },
  mixins: [EOSContract, ETHContract]
}
</script>
<style lang="scss" scoped>
  @import "~@/assets/styles/variables.scss";

.gasfield {
    /deep/ .q-item.gasSelector {
        padding-left: 0px;
        padding-right: 0px;

        .q-item__section {
            .q-item--clickable {
                border-radius: 40px;
                margin-right: 20px;
                padding: 15px 30px;
            }
        }
    }
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

.gasfield .selected {
    background: #dfdff1 !important;
}

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
  .mobile-pad {
    padding-bottom: 50px;
    background: #FFF !important;
  }
  .desktop-version{
    background: #E7E8E8;
    padding-top: 13vh;
    padding-left: 18vh;
    padding-bottom: 50px;
    padding-right: 2%;
    @media screen and (min-width: 768px) {
      padding-top: 11vh;
      padding-bottom: 0px;
    }
  }
  .dark-theme{
    &.send-modal{
      .send-modal__content{
        background: #04111F;
        border: 1px solid #627797;
        .send-modal__content--head .--amount{
          color: #FFF;
        }
        .send-modal__content--footer .--email{
          color: #FFF;
        }
      }
    }
    .mobile-version{
      background: #04111F;
      .standard-content--title{
        color: #FFF;
      }
      .standard-content--body__form .lab-input{
        color: #FFF;
      }
      .standard-content--body__form .input-input{
        /deep/ button{
          color: #FFF !important;
        }
      }
    }
    .desktop-version{
      background: #04111F;
      padding-bottom: 8px;
      min-height: 102vh;
      overflow: hidden;
      position: relative;
      scrollbar-width: 0px;
      .col-title h4{
          color: #FFF;
      }
      .standard-content--body__form .lab-input{
        color: #FFF;
      }
    }
    .standard-content--body__form .select-input .q-field__control .q-field__native .q-item .q-item__section .q-item__label + .q-item__label{
      color: #CCC;
    }
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
          font-size: 16px;
          font-weight: 700;
          color: #7271fa;
          padding-top: 0px;
          margin-top: -1px;
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
        width: 100%;
        max-width: 300px;
        .--email{
          font-size: 16px;
          font-weight: $bold;
          line-height: 20px;
          font-family: $Titillium;
          margin-top: 20px;
          word-wrap: break-word !important;
          max-width: 100%;
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
  .max40{
    max-width: unset;
    height: 30px;
    width: 30px;
    max-height: unset;
  }
</style>

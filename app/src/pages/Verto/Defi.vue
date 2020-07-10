<template>
  <q-page class="text-black bg-white" :class="osName.toLowerCase() === 'windows' ? 'desktop-marg': 'mobile-pad'">
    <div class="desktop-version" v-if="osName.toLowerCase() === 'windows'">
      <div class="row">
        <div class="col-12 col-title">
          <h4>Liquidity pool</h4>
        </div>
        <div class="col col-12">
          <div class="desktop-card-style current-investments explore-opportunities">
            <h4 class="q-pl-md">Explore Opportunities</h4>
            <div class="header-table-col row q-pl-md">
              <div class="col-1"><h3>#</h3></div>
              <div class="col-3"><h3>Available pools</h3></div>
              <div class="col-2"><h3>Liquidity</h3></div>
              <div class="col-2"><h3>Net ROI(1mo)</h3></div>
              <div class="col-2"><h3>Net ROI(1mo)</h3></div>
              <div class="col-2"></div>
            </div>
            <q-scroll-area :visible="true" class="q-pr-lg q-mr-sm" style="height: 350px;">
              <div v-for="i in 10" :key="i" class="body-table-col border row items-center q-pl-md q-pb-sm q-pt-sm">
                <div class="col-1 flex items-center">
                  <strong>{{i}}</strong>
                </div>
                <div class="col-3 flex items-center">
                  <span class="imgs q-mr-lg">
                    <img src="statics/coins_icons/eth2.png" alt="">
                    <img src="statics/coins_icons/bat.png" alt="">
                  </span>
                  <span class="column pairs">
                    <span class="pair">ETH / BAT</span>
                    <span class="value">Uniswap V1</span>
                  </span>
                </div>
                <div class="col-2 q-pl-sm">
                  <span class="column pairs">
                    <span class="pair">$10,918,987</span>
                  </span>
                </div>
                <div class="col-2 q-pl-md">
                  <span class="column pairs">
                    <span class="value">N/A</span>
                  </span>
                </div>
                <div class="col-2 q-pl-lg">
                  <span class="column pairs">
                    <span class="value">N/A</span>
                  </span>
                </div>
                <div class="col-2 flex justify-end">
                  <q-btn unelevated @click="openDialog = true" class="qbtn-custom q-pl-sm q-pr-sm q-mr-sm" color="black" text-color="white" label="Add Liquidity" />
                </div>
              </div>
            </q-scroll-area>
          </div>
        </div>
        <div class="col col-md-5 q-pr-md">
          <!-- <div class="desktop-card-style account-overview q-mb-sm">
            <div class="row">
              <div class="col-8">
                <h4 class="q-pl-md">Account overview</h4>
                <div class="q-pl-md">Total Assets : $343.3482</div>
                <div class="q-pl-md">Net Worth : $343.3482</div>
              </div>
              <div class="col-4">
                <img src="statics/liquidity_pool.png" class="full-width q-pt-sm" alt="">
              </div>
            </div>
          </div> -->
          <!-- <div class="desktop-card-style wallet-snapshot q-mb-sm" style="background: url(statics/header_bg.png) no-repeat; background-position: 20% 72%; background-size: 100%;">
            <div class="flex justify-between items-center q-pt-sm q-pb-sm">
              <h3 class="text-white q-pl-md">Wallet Snapshot</h3>
              <div class="text-white q-pr-md amount flex items-center">
                <span class="vtx q-pr-md">425.17 VTX</span>
                <span>28.35 USD</span>
              </div>
            </div>
          </div> -->
          <!-- <div class="desktop-card-style transaction-history q-mb-sm">
            <h4 class="q-pl-md q-pt-md flex justify-between items-center">
              Transaction History of pool
              <q-btn unelevated class="qbtn-download q-mr-md" color="black" text-color="white" label="Download CSV" />
            </h4>
            <transactionsSection />
          </div> -->
        </div>
        <div class="col col-md-7">
          <!-- <div class="desktop-card-style current-investments q-mb-sm">
            <h4 class="q-pl-md">Current Investments</h4>
            <div class="header-table-col row q-pl-md">
              <div class="col-3"><h3>Liquidity Pools</h3></div>
              <div class="col-4"><h3>Value</h3></div>
            </div>
            <q-scroll-area :visible="true" class="q-pr-lg q-mb-md q-mr-sm" style="height: 200px;">
              <div v-for="i in 10" :key="i" class="body-table-col border row items-center q-pl-md q-pb-sm q-pt-sm">
                <div class="col-3 flex items-center">
                  <span class="imgs q-mr-lg">
                    <img src="statics/coins_icons/eth2.png" alt="">
                    <img src="statics/coins_icons/bat.png" alt="">
                  </span>
                  <span class="column pairs">
                    <span class="pair">ETH / BAT</span>
                    <span class="value">Uniswap V1</span>
                  </span>
                </div>
                <div class="col-5">
                  <span class="column pairs">
                    <span class="pair">ETH / BAT</span>
                    <span class="value">0.12 ETH / 87.37 BAT</span>
                  </span>
                </div>
                <div class="col-4 q">
                  <q-btn unelevated class="qbtn-custom q-mr-sm" color="black" text-color="white" label="Rebalance" />
                  <q-btn unelevated class="qbtn-custom q-mr-sm" color="black" text-color="white" label="Withdraw" />
                  <q-btn unelevated class="qbtn-custom" color="black" text-color="white" label="Add" />
                </div>
              </div>
            </q-scroll-area>
          </div> -->
        </div>
      </div>
      <AddLiquidityDialog :open="openDialog" />
    </div>
    <div v-else class="standard-content">
      <h2 class="standard-content--title flex justify-center"><q-btn flat unelevated class="btn-align-left" text-color="black" icon="keyboard_backspace" /> Liquidity pool </h2>
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
// import TransactionsSection from '../../components/Verto/TransactionsSection'
import AddLiquidityDialog from '../../components/Verto/AddLiquidityDialog'
import { QScrollArea } from 'quasar'

let cruxClient

export default {
  components: {
    QScrollArea,
    // desktop components
    AddLiquidityDialog
  },
  data () {
    return {
      openDialog: false,
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
  updated () {
    console.log('openDialog', this.openDialog)
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
  .mobile-pad{
    padding-bottom: 50px
  }
  .desktop-version{
    background: #E7E8E8;
    padding-top: 13vh;
    padding-left: 12vh;
    padding-bottom: 50px;
    padding-right: 2%;
    // height: fit-content;
  }
  .desktop-card-style{
    // height: 100%;
    &.current-investments{
      h4{
        margin-bottom: -20px;
      }
      .header-table-col{
        h3{
          font-weight: $bold;
          color: #7272FA;
          font-size: 16px;
        }
      }
      .body-table-col{
        &:hover{
          background-color: rgba(black, .01);
        }
        &.border{
          border-bottom: 1px solid rgba(black, .04);
        }
        .pairs{
          .pair{
            font-weight: $bold;
            color: #2A2A2A;
            margin-bottom: -2px;
          }
          .value{
            color: #627797;
          }
        }
        .imgs{
          margin-top: 5px;
          img{
            border-radius: 40px;
            height: 25px;
          }
          &:first-child{
            img{
              margin-right: -10px;
            }
          }
        }
      }
      .qbtn-custom{
        border-radius: 30px;
        height: 34px;
        background: #EFF5F9 !important;
        /deep/ .q-btn__wrapper{
          min-height: unset;
          padding: 0px 10px;
          .q-btn__content{
            text-transform: initial;
            font-size: 14px;
            color: #627797;
          }
        }
      }
    }
    &.transaction-history{
      h4{
        margin-bottom: 0px;
      }
      .qbtn-download{
        border-radius: 30px;
        height: 34px;
        background: #EFF5F9 !important;
        /deep/ .q-btn__wrapper{
          min-height: unset;
          padding: 0px 10px;
          .q-btn__content{
            text-transform: initial;
            font-size: 14px;
            color: #627797;
          }
        }
      }
      /deep/ .transaction-section{
        box-shadow: none;
        .history-icon{
          display: none;
        }
      }
    }
    &.wallet-snapshot{
      h3{
        font-size: 16px;
        font-weight: $bold;
        position: relative;
        line-height: 40px;
        font-family: $Titillium;
        margin-top: 0px;
        margin-bottom: 0px;
      }
      .amount{
        font-size: 16px;
        font-weight: $bold;
        position: relative;
        line-height: 40px;
        font-family: $Titillium;
        .vtx{
          font-size: 20px;
        }
      }
    }
    h4{
      font-size: 16px;
      font-weight: $bold;
      position: relative;
      line-height: 40px;
      font-family: $Titillium;
      margin-top: 0px;
      margin-bottom: 20px;
    }
  }
  .col-title{
    h4{
      font-size: 22px;
      font-weight: $bold;
      position: relative;
      line-height: 50px;
      font-family: $Titillium;
      margin-top: -10px;
      margin-bottom: 10px;
    }
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

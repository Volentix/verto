<template>
<q-page class="column import-private-key" :class="{'dark-theme': $store.state.settings.lightMode === 'true', 'text-black bg-grey-12': $store.state.settings.lightMode === 'false', 'desktop-marg': screenSize > 1024,  'mobile-pad': screenSize < 1024}">
    <div :class="{'dark-theme mobile-card': $store.state.settings.lightMode === 'true'}" style="height: 100vh;">
      <div class="desktop-version full-height" v-if="screenSize > 1024">
          <div class="row full-height">
            <div class="col col-md-3" v-if="false">
              <div class="wallets-container" style="height: 100%">
                <profile-header :isMobile="false" class="marg" version="type2222" />
                <wallets :isMobile="false" class="full-height max-height" :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
                <!-- <img src="statics/prototype_screens/wallets.jpg" alt=""> -->
              </div>
          </div>
          <div class="col col-md-12">
            <div class="desktop-card-style apps-section q-mb-sm" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
                <div class="chain-tools-wrapper">
                    <div class="standard-content">
                        <h2 class="standard-content--title flex">Create HD Account</h2>
                    </div>
                    <div class="chain-tools-wrapper--list open">
                        <div class="list-wrapper">
                            <div class="list-wrapper--chain__eos-to-vtx-convertor">
                                <div>
                                    <q-stepper :dark="$store.state.settings.lightMode === 'true'" v-model="step" done-color="green" ref="stepper" alternative-labels vertical color="primary" animated flat>
                                        <q-step :dark="$store.state.settings.lightMode === 'true'" title="Missing HD Account" :name="1" prefix="1" order="10" :done="step > 1">
                                            <div class="text-black">
                                                <q-select
                                                  v-if="notCreated.length !== 0"
                                                  :dark="$store.state.settings.lightMode === 'true'"
                                                  separator rounded outlined
                                                  label="Select chain"
                                                  class="select-input"
                                                  v-model="currentToken"
                                                  :options="notCreated"
                                                />
                                                <p  class="text-body1" :class="{
                                                   'text-grey': $store.state.settings.lightMode === 'true'
                                                }" v-else> No Missing HD keys found</p>
                                                <p  class="text-body1 text-green q-pt-md" v-if="successMessage">{{successMessage}}</p>

                                                <q-stepper-navigation v-show="currentToken && !successMessage" class="flex justify-end">
                                                    <q-btn @click="addHdAccount()" color="deep-purple-14" class="--next-btn" rounded :label="$t('Add')" />
                                                </q-stepper-navigation>
                                            </div>
                                        </q-step>
                                    </q-stepper>
                                </div>
                            </div>
                            <br><br><br>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
          <div class="col col-md-12">
            <q-toolbar :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'bg-white text-black'" >
                <q-btn flat round dense icon="arrow_back_ios" class="q-mr-sm" @click="$router.go(-1)"/>
                <q-toolbar-title> HD Account Details </q-toolbar-title>
            </q-toolbar>
            <div class="apps-section q-mb-sm" :class="{'dark-theme mobile-card text-white': $store.state.settings.lightMode === 'true'}">
                <div class="chain-tools-wrapper_">
                    <div class="q-pa-md text-h6">
                         Create HD Account
                    </div>
                    <div class="chain-tools-wrapper--list_ open">
                        <div class="list-wrapper_">
                            <div class="list-wrapper--chain__eos-to-vtx-convertor">
                                <div>
                                    <q-stepper :dark="$store.state.settings.lightMode === 'true'" v-model="step" done-color="green" ref="stepper" alternative-labels vertical color="primary" animated flat>
                                        <q-step :dark="$store.state.settings.lightMode === 'true'" title="Missing HD Account" :name="1" prefix="1" order="10" :done="step > 1">
                                            <div class="text-black">
                                                <q-select
                                                  v-if="notCreated.length !== 0"
                                                  :dark="$store.state.settings.lightMode === 'true'"
                                                  separator rounded outlined
                                                  label="Select chain"
                                                  class="select-input"
                                                  v-model="currentToken"
                                                  :options="notCreated"
                                                />
                                                <p  class="text-body1" :class="{
                                                   'text-grey': $store.state.settings.lightMode === 'true'
                                                }" v-else> No Missing HD keys found</p>
                                                <p  class="text-body1 text-green q-pt-md" v-if="successMessage">{{successMessage}}</p>

                                                <q-stepper-navigation v-show="currentToken && !successMessage" class="flex justify-end">
                                                    <q-btn @click="addHdAccount()" color="deep-purple-14" class="--next-btn" rounded :label="$t('Add')" />
                                                </q-stepper-navigation>
                                            </div>
                                        </q-step>
                                    </q-stepper>
                                </div>
                            </div>
                            <br><br><br>
                        </div>
                    </div>
                </div>
            </div>
          </div>

      </div>
    </div>
</q-page>
</template>

<script>
import Wallets from '../../components/Verto/Wallets'
import ProfileHeader from '../../components/Verto/ProfileHeader'

import HD from '@/util/hdwallet'
import configManager from '@/util/ConfigManager'

export default {
  components: {
    // desktop components
    ProfileHeader,
    Wallets
  },
  data () {
    return {
      screenSize: 0,
      step: 1,
      step2: 1,
      notCreated: [{
        label: 'Avalanche',
        value: 'avax'
      }, {
        label: 'PolkaDot',
        value: 'dot'
      }, {
        label: 'Kusama',
        value: 'ksm'
      }],
      successMessage: null,
      isPwd: true,
      currentToken: null,
      vertoPassword: this.$store.state.settings.temporary,
      config: this.$store.state.currentwallet.config,
      walletAddressUsed: false,
      unknownError: false,
      addWallet: {
        walletName: '',
        address: '',
        addressPriv: '',
        vertoPassword: '',
        vertoPasswordError: '',
        filePassword: '',
        filePasswordConfirm: '',
        storeInWallet: false
      }
    }
  },
  created () {
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)
    this.notCreated = HD.names.filter(o => !this.$store.state.wallets.tokens.find(w => w.chain === o.value))
  },
  methods: {
    async addHdAccount () {
      const self = this
      let result = await HD.Wallet(this.currentToken.value).then(async keys => {
        return configManager.saveWalletAndKey(
          self.currentToken.label,
          self.vertoPassword,
          null,
          keys.publicKey,
          keys.privateKey,
          self.currentToken.value,
          'mnemonic')
      })

      if (result.success) {
        // Append wallet name to url to avoid loading the entire wallet
        /*
          To do maybe? :
          Select mulitple keys and add them with one click
        */
        this.successMessage = self.currentToken.label + ' account successfully created. Redirecting...'

        setTimeout(() => {
          this.$router.push('/verto/dashboard/' + self.currentToken.label.toLowerCase())
        }, 1000)
      } else {
        this.submitKey = false
        if (result.message === 'address_already_used') {
          this.walletAddressUsed = true
        } else {
          this.unknownError = true
        }
      }
    },
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    },
    createKeys () {
      this.$router.push('create-keys')
    },
    filePasswordCheck: function () {
      this.filePasswordApproved = false
      if (this.addWallet.filePassword.length > 7) {
        this.filePasswordApproved = true
      }
    },
    filePasswordConfirmCheck () {
      this.filePasswordConfirmApproved = false
      if (this.addWallet.filePassword === this.addWallet.filePasswordConfirm) {
        this.filePasswordConfirmApproved = true
      }
    },
    gotoFileConfirmPassword () {
      if (this.filePasswordApproved) {
        this.$refs.stepperFilePassword.next()
      }
    },
    gotToSaveFileInWallet () {
      if (this.filePasswordConfirmApproved) {
        this.$refs.stepperFilePassword.next()
      }
    },
    gotToVertoPassword (saveFile) {
      this.addWallet.storeInWallet = saveFile
      this.showMainSteps = true
      this.$refs.stepperFilePassword.goTo(1)
      this.$refs.stepper.next()
    },
    createAccount () {
      this.$router.push('create-eos-account')
    },
    nextFromName () {
      this.addWallet.walletNameEmpty = false
      this.confirmPassword = true
    },
    async nextFromPriv () {
      if (!this.ethKeyNext) {
        return
      }

      let account = null

      this.addWallet.address = account.address

      this.$refs.stepper.next()
    },
    showethKeyNext () {
      this.ethKeyInvalid = false
      if (this.addWallet.addressPriv.length === 64) {
        this.ethKeyNext = true
      } else {
        this.ethKeyNext = false
      }
    },
    showSubmitKey () {
      this.resetErrors()
      if (this.addWallet.vertoPassword.length > 2) {
        this.submitKey = true
      } else {
        this.submitKey = false
      }
    },
    resetErrors () {
      this.incorrectPassword = false
      this.walletAddressUsed = false
      this.unknownError = false
    },
    cancelAddVertoAddress: function () {
      this.addWallet.walletNameEmpty = false
      this.addWallet.addressEmpty = false
      this.addWallet.vertoPasswordEmpty = false
      this.addWallet.walletName = ''
      this.addWallet.address = ''
      this.addWallet.addressPriv = ''
      this.addWallet.vertoPassword = ''
      this.addingWallet = false
    },
    cancel () {
      this.$router.push('/verto/dashboard')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.desktop-card-style{
    height: 101.5%;
    max-height: 101.5%;
    @media screen and (min-height: 700px) {
        // height: 54.5vh;
        max-height: 98.6%;
    }
    @media screen and (min-height: 760px) {
        // height: 54vh;
        max-height: 97%;
    }
    @media screen and (min-height: 800px) {
        // height: 55vh;
        max-height: 96.4%;
    }
    @media screen and (min-height: 870px) {
        // height: 56vh;
        max-height: 94.6%;
    }
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
  .mobile-pad{
    padding-bottom: 50px
  }
  .desktop-version{
    background: #E7E8E8;
    padding-top: 13vh;
    padding-left: 18vh;
    padding-bottom: 0px;
    padding-right: 18px;
    position: relative;
    overflow: hidden;
    @media screen and (min-width: 768px) {
      padding-top: 11vh;
      padding-bottom: 0px;
    }
  }
.desktop-version{
    .standard-content{
        padding: 0% 2%;
    }
    .chain-tools-wrapper--list.open{
        padding: 0%;
    }
    /deep/ .profile-wrapper--header.desktop-ui{
        margin-bottom: 0px;
    }
    .standard-content--title{
        font-size: 25px;
    }
  }
  .dark-theme{
    /deep/ .marg .profile-wrapper--header {
      border: 1px solid #627797;
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

.chain-tools-wrapper {

    // padding: 0px 6%;
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
                        width: 100px;
                        text-transform: initial !important;
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
                        font-size: 13px;
                        font-family: $Titillium;
                        font-weight: $bold;
                        color: #B0B0B0;
                        text-transform: initial !important;
                        line-height: 20px;
                    }

                    .--amount {
                        color: #2A2A2A !important;
                    }
                }
            }
        }

        &.open {
            margin-bottom: 0px;
            padding-left: 6%;
            padding-right: 6%;

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

.standard-content {
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    // padding-bottom: 100px;
    .privatekey_bg {
        margin-top: -30px;

        img {
            width: 100%;
            max-width: 330px;
        }
    }

    &--title {
        font-size: 30px;
        font-weight: $bold;
        position: relative;
        line-height: 50px;
        font-family: $Titillium;
        margin-top: 0px;
        margin-bottom: 0px;
        position: relative;
        z-index: 2;

        .btn-align-left {
            position: absolute;
            left: -35px;
            top: 10px;
        }
    }
}

.file-select-wrapper {
    border: 1px solid #CCC;
    border-radius: 100px;
    padding: 0px;
    overflow: hidden;
    position: relative;

    .icon-upload {
        font-size: 25px;
        position: absolute;
        right: 15px;
        opacity: .3;
    }

    label {
        width: 100%;
    }

    /deep/ .file-select>.select-button {
        padding: .12rem;
        color: transparent;
        background-color: #fbfbfb !important;
        padding: 10px 0px;
        border: none;
        flex-direction: row;
        justify-content: flex-start;
        display: flex;

        span {
            color: #000;
            padding: 0px 15px;
        }
    }
}

.sm-circle {
    height: 10px;
    width: 10px;
    margin-top: 0px;
    box-shadow: none;
    padding: 0px;
    margin-left: -20px;
}
.import-private-key{
    padding-bottom: 50px;
    @media screen and (min-width: 768px) {
        padding-bottom: 0px;
    }
    background: #f3f3f3 !important;
    &.dark-theme{
        .chain-tools-wrapper{
            background: #04111F;
            .standard-content--title{
                color: #FFF !important;
            }
        }
    }
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
  .chain-tools-wrapper--list /deep/ .list-wrapper--chain__eos-to-vtx-convertor{
      box-shadow: none !important;
  }

</style>

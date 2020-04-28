<template>
  <q-page class="column text-black bg-grey-12" style="padding-bottom: 50px;background: #f3f3f3 !important">
        <div class="chain-tools-wrapper">
            <div class="standard-content">
                <h2 v-show="showMainSteps" class="standard-content--title flex justify-center">
                    <q-btn flat unelevated class="btn-align-left" to="/verto/dashboard" text-color="black" icon="keyboard_backspace" />
                     Import EOS Account
                </h2>
                <h2 v-show="!showMainSteps" class="standard-content--title flex justify-center">
                    <q-btn flat unelevated class="btn-align-left" to="/verto/dashboard" text-color="black" icon="keyboard_backspace" />
                     Save Private Key
                </h2>
                <div class="privatekey_bg flex flex-center"><img src="statics/privatekey_bg.svg" alt=""></div>
            </div>
            <div class="chain-tools-wrapper--list open">
                <div class="list-wrapper">
                    <div class="list-wrapper--chain__eos-to-vtx-convertor">
                        <div v-show="showMainSteps">
                            <q-stepper v-model="step" done-color="green" ref="stepper" alternative-labels vertical color="primary" animated flat >
                                <!--
                                    1.Private key
                                    -->
                                <q-step title="Private Key" :name="1" prefix="1" order="10" :done="step > 1">
                                    <div class="text-black">
                                        <div class="text-h4 --subtitle">
                                            <ul>
                                                <li>
                                                    <span>
                                                        <span v-if="!eosKeyNext || eosKeyInvalid"><q-chip dense color="red" class="sm-circle shadow-1">&nbsp;</q-chip></span>
                                                        <span v-else><q-chip dense color="green" class="sm-circle shadow-1">&nbsp;</q-chip></span>
                                                        A valid EOS active key
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                        <span>
                                            <q-input
                                                light
                                                debounce="500"
                                                rounded outlined color="purple"
                                                v-model="addWallet.addressPriv"
                                                :error="addWallet.addressError"
                                                @input="showEosKeyNext"
                                                @keyup.enter="nextFromPriv"
                                                :label="$t('EosAccount.enter_private_key')"
                                            />
                                        </span>
                                        <div v-show="eosKeyInvalid" class="text-h6 text-red">
                                            Key invalid
                                        </div>
                                        <q-stepper-navigation v-show="eosKeyNext && !eosKeyInvalid" class="flex justify-end">
                                            <q-btn @click="nextFromPriv()" color="deep-purple-14" class="--next-btn" rounded :label="$t('next')" />
                                        </q-stepper-navigation>
                                    </div>
                                </q-step>
                                <!--
                                    2. Account Name
                                    -->
                                <q-step title="Account Name" :name="2" prefix="2" order="20" :done="step > 2">
                                    <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                                    <div class="text-black">
                                        <div>
                                            <q-select
                                                light
                                                separator
                                                rounded
                                                outlined
                                                class="select-input"
                                                stack-label
                                                label="EOS Account Name"
                                                color="purple"
                                                v-model="addWallet.walletName"
                                                :options="accountNames"
                                                :error="addWallet.walletNameEmpty"
                                            />
                                        </div>
                                        <q-stepper-navigation v-show="addWallet.walletName" class="flex justify-end">
                                            <q-btn @click="$refs.stepper.next()" color="deep-purple-14" class="--next-btn" rounded :label="$t('next')" />
                                        </q-stepper-navigation>
                                    </div>
                                </q-step>
                                <!--
                                    3. Save Key Encrypted
                                    -->
                                <q-step title="Save Key" :name="3" prefix="3" order="30" :done="step > 3">
                                    <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                                    <div class="text-black">
                                        <div class="text-h4 --subtitle">
                                            <ul>
                                                <li><span>Save Private Key</span></li>
                                                <li>
                                                    <span>
                                                        <span><q-chip dense color="green" class="sm-circle shadow-1">&nbsp;</q-chip></span>
                                                        Password Encrypted
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                        <q-stepper-navigation class="flex justify-end">
                                            <q-btn @click="showMainSteps = false" outline color="deep-purple-14 q-mr-md" class="--next-btn" rounded label="Yes" />
                                            <q-btn @click="$refs.stepper.next()" color="deep-purple-14" class="--next-btn" rounded label="No" />
                                        </q-stepper-navigation>
                                    </div>
                                </q-step>
                                <!--
                                    4. Verto Password
                                    -->
                                <q-step title="Verto Password" :name="4" prefix="4" order="40" :done="step > 4">
                                    <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                                    <div class="text-black">
                                        <div>
                                            <q-input
                                                light
                                                debounce="500"
                                                rounded outlined color="purple"
                                                v-model="addWallet.vertoPassword"
                                                @input="showSubmitKey"
                                                @keyup.enter="addEosAddress"
                                                v-bind:label="$t('CreateVertoPassword.vertopassword')"
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
                                        <div v-show="incorrectPassword" class="text-h6 text-uppercase text-red q-pa-lg">
                                            {{ $t('Welcome.incorrect') }}
                                        </div>
                                        <div v-show="walletNameUsed" class="text-h6 text-uppercase text-red q-pa-lg">
                                            {{ $t('DisplayKey.name_is_used') }}
                                        </div>
                                        <div v-show="unknownError" class="text-h6 text-uppercase text-red q-pa-lg">
                                            Unknown Error
                                        </div>
                                        <q-stepper-navigation v-show="submitKey" class="flex justify-end">
                                            <q-btn @click="addEosAddress()" color="deep-purple-14" class="--next-btn" rounded :label="$t('next')" />
                                        </q-stepper-navigation>
                                    </div>
                                </q-step>
                            </q-stepper>
                        </div>
                        <div v-show="!showMainSteps">
                            <q-stepper v-model="step2" done-color="green" ref="stepperFilePassword" alternative-labels vertical color="primary" animated flat >
                                <!--
                                1.Private key
                                -->
                                <q-step title="File Password" :name="1" prefix="1" :done="step2 > 1">
                                    <q-btn flat @click="showMainSteps = true" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                                    <div class="text-black">
                                        <div class="text-h4 --subtitle">
                                            <ul>
                                                <li><span>Recommended to be different than your wallet password</span></li>
                                                <li>
                                                    <span v-show="!filePasswordApproved">
                                                        <q-chip dense color="red" class="sm-circle shadow-1">&nbsp;</q-chip>
                                                    </span>
                                                    <span v-show="filePasswordApproved">
                                                        <q-chip dense color="green" class="sm-circle shadow-1">&nbsp;</q-chip>
                                                    </span>
                                                    Minimum 8 Digits
                                                </li>
                                            </ul>
                                        </div>
                                        <span class="q-pa-sm">
                                            <q-input
                                                light
                                                debounce="500"
                                                rounded outlined color="purple"
                                                v-model="addWallet.filePassword"
                                                @input="filePasswordCheck"
                                                label="Password For The File"
                                                @keyup.enter="gotoFileConfirmPassword()"
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
                                        </span>
                                        <q-stepper-navigation v-show="filePasswordApproved" class="flex justify-end">
                                            <q-btn @click="gotoFileConfirmPassword()" color="deep-purple-14" class="--next-btn" rounded :label="$t('SaveYourKeys.create')" />
                                        </q-stepper-navigation>
                                    </div>
                                </q-step>
                                <!--
                                2. Confirm
                                -->
                                <q-step title="Confirm Password" :name="2" prefix="2" :done="step2 > 2">
                                    <q-btn flat @click="$refs.stepperFilePassword.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                                    <div class="text-black">
                                        <span class="q-pa-sm">
                                            <q-input
                                            light
                                            debounce="500"
                                            rounded outlined color="purple"
                                            v-model="addWallet.filePasswordConfirm"
                                            @input="filePasswordConfirmCheck"
                                            label="Confirm Password For The File"
                                            @keyup.enter="gotToSaveFileInWallet()"
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
                                        </span>
                                        <div class="q-pa-sm" v-show="filePasswordConfirmApproved" @click="gotToSaveFileInWallet()" >
                                        <q-icon name="navigate_next" size="3.2rem" color="green"   >
                                            <q-tooltip>{{ $t('SaveYourKeys.create') }}</q-tooltip>
                                        </q-icon>
                                        </div>
                                        <q-stepper-navigation v-show="filePasswordConfirmApproved" class="flex justify-end">
                                            <q-btn @click="gotToSaveFileInWallet()" color="deep-purple-14" class="--next-btn" rounded :label="$t('SaveYourKeys.create')" />
                                        </q-stepper-navigation>
                                    </div>
                                </q-step>
                                <!--
                                3. Save File In Wallet
                                -->
                                <q-step title="Save In Wallet" :name="3" prefix="3" :done="step2 > 3">
                                    <q-btn flat @click="$refs.stepperFilePassword.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                                    <div class="text-black">
                                        <div class="text-h4 --subtitle">
                                            <ul>
                                                <li><span>Encrypt the private key in the wallet?</span></li>
                                            </ul>
                                        </div>
                                        <q-stepper-navigation class="flex justify-end">
                                            <q-btn @click="gotToVertoPassword(true)" outline color="deep-purple-14 q-mr-md" class="--next-btn" rounded label="Yes" />
                                            <q-btn @click="gotToVertoPassword(false)" color="deep-purple-14" class="--next-btn" rounded label="No" />
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
    </q-page>
</template>

<script>
import EosWrapper from '@/util/EosWrapper'

export default {
  data () {
    return {
      step: 1,
      step2: 1,
      isPwd: true,
      contractable: true,
      showMainSteps: true,
      filePasswordApproved: false,
      filePasswordConfirmApproved: false,
      eosKeyNext: false,
      submitKey: false,
      eosKeyInvalid: false,
      incorrectPassword: false,
      unknownError: false,
      walletNameUsed: false,
      enableImport: true,
      confirmPassword: false,
      accountNames: [],
      wrongPrivateKey: false,
      accountIsNotValid: true,
      enteredPrivateKey: '',
      showSaveKey: false,
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
  methods: {
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
    nextFromPriv () {
      if (!this.eosKeyNext) {
        return
      }
      if ((new EosWrapper()).isPrivKeyValid(this.addWallet.addressPriv)) {
        this.importPrivateKey()
        this.$refs.stepper.next()
      } else {
        this.eosKeyInvalid = true
      }
    },
    showEosKeyNext () {
      this.eosKeyInvalid = false
      if (this.addWallet.addressPriv.length === 51) {
        this.eosKeyNext = true
      } else {
        this.eosKeyNext = false
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
      this.walletNameUsed = false
      this.unknownError = false
    },
    addEosAddress: async function () {
      if (this.submitKey) {
        this.resetErrors()
        const result = await this.$configManager.createEosWallet(this.addWallet)
        if (result.success) {
          this.$router.push({ path: '/wallet' })
        } else {
          this.submitKey = false
          if (result.message === 'bad_password') {
            this.incorrectPassword = true
          } else if (result.message === 'name_already_used') {
            this.walletNameUsed = true
          } else {
            this.unknownError = true
          }
        }
      }
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
    importPrivateKey () {
      const eos = new EosWrapper()
      this.addWallet.address = eos.fromPrivToPub(this.addWallet.addressPriv)
      var self = this
      eos.getAccountNamesFromPubKeyP(this.addWallet.address)
        .then(function (result) {
          self.accountNames = []
          for (var i = 0; i < result.account_names.length; i++) {
            self.accountNames.push({ label: result.account_names[i], value: result.account_names[i] })
          }
          self.walletName = result.account_names[0]
        })
      // this.enableImport = false
      this.linkAccount = true
    },
    cancel () {
      this.$router.push('vertomanager')
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  .chain-tools-wrapper{
    // padding: 0px 6%;
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
        padding-left: 6%;
        padding-right: 6%;
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
.standard-content{
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // padding-bottom: 100px;
    .privatekey_bg{
        margin-top: -30px;
        img{
            width: 100%;
            max-width: 330px;
        }
    }
    &--title{
      font-size: 35px;
      font-weight: $bold;
      position: relative;
      line-height: 50px;
      font-family: $Titillium;
      margin-top: 0px;
      margin-bottom: 0px;
      position: relative;
      z-index: 2;
      .btn-align-left{
        position: absolute;
        left: -35px;
        top: 10px;
      }
    }
}
  .file-select-wrapper{
    border: 1px solid #CCC;
    border-radius: 100px;
    padding: 0px;
    overflow: hidden;
    position: relative;
    .icon-upload{
      font-size: 25px;
      position: absolute;
      right: 15px;
      opacity: .3;
    }
    label{
      width: 100%;
    }
    /deep/ .file-select > .select-button {
      padding: .12rem;
      color: transparent;
      background-color: #fbfbfb !important;
      padding: 10px 0px;
      border: none;
      flex-direction: row;
      justify-content: flex-start;
      display: flex;
      span{
        color: #000;
        padding: 0px 15px;
      }
    }
  }
  .sm-circle{
    height: 10px;
    width: 10px;
    margin-top: 0px;
    box-shadow: none;
    padding: 0px;
    margin-left: -20px;
  }
</style>

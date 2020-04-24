<template>
  <q-page class="column text-black bg-grey-12" style="padding-bottom: 50px;background: #f3f3f3 !important">
        <div class="chain-tools-wrapper">
            <div class="standard-content">
                <h2 class="standard-content--title flex justify-center">
                    <q-btn flat unelevated class="btn-align-left" to="/verto/dashboard" text-color="black" icon="keyboard_backspace" />
                     {{$t('CreateVertoPassword.addwallet')}}
                </h2>
                <div class="privatekey_bg flex flex-center"><img src="statics/privatekey_bg.svg" alt=""></div>
            </div>
            <div class="chain-tools-wrapper--list open">
                <div class="list-wrapper">
                    <div class="list-wrapper--chain__eos-to-vtx-convertor">
                        <q-stepper v-model="step" done-color="green" ref="stepper" alternative-labels vertical color="primary" animated flat >
                            <q-step title="Wallet Name" :name="1" prefix="1" :done="step > 1">
                                <div class="text-black">
                                    <div class="text-h4 --subtitle">
                                        <ul>
                                            <li><span>{{$t('DisplayKey.walletname')}}</span></li>
                                        </ul>
                                    </div>
                                    <q-input
                                        v-model="wallet.name"
                                        light
                                        debounce="500"
                                        rounded outlined color="purple"
                                        @input="checkName"
                                        @keyup.enter="showEnterKeyScreen"
                                    />
                                    <q-stepper-navigation v-show="showSubmit.name" class="flex justify-end">
                                        <q-btn @click="showEnterKeyScreen()" color="deep-purple-14" class="--next-btn" rounded :label="$t('SaveYourKeys.create')" />
                                    </q-stepper-navigation>
                                </div>
                            </q-step>
                            <q-step :name="2" title="Public Address" prefix="2" :done="step>2">
                                <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                                <div class="text-black">
                                    <div class="text-h4 --subtitle">
                                      <ul>
                                          <li>
                                              <span>
                                                  <span v-if="!this.showSubmit.address"><q-chip dense color="red" class="sm-circle shadow-1">&nbsp;</q-chip></span>
                                                  <span v-else><q-chip dense color="green" class="sm-circle shadow-1">&nbsp;</q-chip></span>
                                                  Must be a valid EOS public key
                                              </span>
                                          </li>
                                      </ul>
                                    </div>
                                    <span class="">
                                        <q-input
                                            v-model="wallet.address"
                                            light
                                            debounce="500"
                                            rounded outlined color="purple"
                                            @input="checkAddress"
                                            @keyup.enter="showVertoPasswordScreen"
                                            :label="$t('WalletManager.keyhere')"
                                        />
                                    </span>
                                    <q-stepper-navigation v-show="showSubmit.address" class="flex justify-end">
                                        <q-btn @click="showVertoPasswordScreen()" color="deep-purple-14" class="--next-btn" rounded :label="$t('SaveYourKeys.create')" />
                                    </q-stepper-navigation>
                                </div>
                            </q-step>
                            <q-step :name="3" title="Verto Password" prefix="3" :done="step>3">
                                <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                                <div class="text-black">
                                    <q-input
                                        v-model="wallet.vertoPassword"
                                        light
                                        debounce="500"
                                        rounded outlined color="purple"
                                        @input="checkVertoPassword"
                                        @keyup.enter="submit"
                                        :label="$t('CreateVertoPassword.vertopassword')"
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
                                    <div v-show="errors.nameUsed" class="text-h6 text-uppercase text-red q-pa-md">
                                        {{ $t('DisplayKey.name_is_used') }}
                                    </div>
                                    <div v-show="errors.badPassword" class="text-h6 text-uppercase text-red  q-pa-md">
                                        {{ $t('SaveToFile.password_incorrect') }}
                                    </div>
                                    <div v-show="errors.unknown" class="text-h6 text-uppercase text-red  q-pa-md">
                                        Unkown Error.
                                    </div>
                                    <q-stepper-navigation v-show="showSubmit.vertoPassword" class="flex justify-end">
                                        <q-btn @click="submit()" color="deep-purple-14" class="--next-btn" rounded :label="$t('SaveYourKeys.create')" />
                                    </q-stepper-navigation>
                                </div>
                            </q-step>
                        </q-stepper>
                    </div>
                    <br><br><br>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script>
export default {
  data () {
    return {
      step: 3,
      isPwd: true,
      contractable: true,
      wallet: {
        name: '',
        address: '',
        vertoPassword: ''
      },
      showSubmit: {
        name: false,
        address: false,
        vertoPassword: false
      },
      errors: {
        nameUsed: false,
        badPassword: false,
        unknown: false
      },
      showNameSubmit: false
    }
  },
  mounted () {
  },
  methods: {
    checkName () {
      if (this.wallet.name && this.wallet.name.length > 2) {
        this.showSubmit.name = true
      } else {
        this.showSubmit.name = false
      }
    },
    checkAddress () {
      if (this.wallet.address &&
       this.wallet.address.length === 53 &&
       this.wallet.address.includes('EOS')) {
        this.showSubmit.address = true
      } else {
        this.showSubmit.address = false
      }
    },
    checkVertoPassword () {
      this.resetErrors()
      if (this.wallet.vertoPassword && this.wallet.vertoPassword.length > 2) {
        this.showSubmit.vertoPassword = true
      } else {
        this.showSubmit.vertoPassword = false
      }
    },
    showEnterKeyScreen () {
      if (this.showSubmit.name) {
        this.$refs.stepper.next()
      }
    },
    showVertoPasswordScreen () {
      if (this.showSubmit.address) {
        this.$refs.stepper.next()
      }
    },
    resetErrors () {
      this.errors.nameUsed = false
      this.errors.badPassword = false
      this.errors.unknown = false
    },
    async submit () {
      if (this.showSubmit.vertoPassword) {
        this.resetErrors()
        const result = await this.$configManager.addWallet(this.wallet.name, this.wallet.vertoPassword, this.wallet.address)
        if (result.success) {
          let wallet = {
            'key': this.wallet.address,
            'name': this.wallet.name,
            'type': 'verto'
          }
          this.$configManager.updateCurrentWallet(wallet)
          this.$router.push({ path: '/wallet' })
        } else if (result.message === 'bad_password') {
          this.showSubmit.vertoPassword = false
          this.errors.badPassword = true
        } else if (result.message === 'name_already_used') {
          this.errors.nameUsed = true
        } else {
          this.showSubmit.vertoPassword = false
          this.errors.unknown = true
        }
      }
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

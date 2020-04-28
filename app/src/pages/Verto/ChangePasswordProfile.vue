<template>
  <q-page class="column text-black bg-grey-12" style="padding-bottom: 50px;background: #f3f3f3 !important">
        <div class="chain-tools-wrapper">
            <div class="standard-content">
                <h2 class="standard-content--title flex justify-center">
                    <q-btn flat unelevated class="btn-align-left" to="/verto/profile" text-color="black" icon="keyboard_backspace" />
                     {{ $t('ChangeVertoPassword.header') }}
                </h2>
                <div class="privatekey_bg flex flex-center"><img src="statics/password_picto.svg" alt=""></div>
            </div>
            <div class="chain-tools-wrapper--list open">
                <div class="list-wrapper">
                    <div class="list-wrapper--chain__eos-to-vtx-convertor">
                        <q-stepper v-model="step" done-color="green" ref="stepper" alternative-labels vertical color="primary" animated flat >
                            <!--
                                1. Current Password
                            -->
                            <q-step title="Current Password" :name="1" prefix="1" :done="step > 1">
                                <q-input
                                    v-model="passwords.current"
                                    light
                                    debounce="500"
                                    rounded outlined color="purple"
                                    @input="checkCurrent"
                                    @keyup.enter="showNewPassword"
                                    :label="$t('ChangeVertoPassword.current')"
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
                                <div v-show="errors.orgPasswordIncorrect" class="text-h6 text-uppercase text-red q-pa-md">
                                    {{ $t('SaveToFile.password_incorrect') }}
                                </div>
                                <q-stepper-navigation v-show="showSubmit.current" class="flex justify-end">
                                    <q-btn @click="showNewPassword()" color="deep-purple-14" class="--next-btn" rounded :label="$t('SaveYourKeys.create')" />
                                </q-stepper-navigation>
                            </q-step>
                            <!--
                                2. New Password
                            -->
                            <q-step title="New Password" :name="2" prefix="2" :done="step > 2">
                                <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                                <div class="text-black">
                                    <div class="text-h4 --subtitle">
                                      <ul>
                                          <li>
                                              <span>
                                                  <span v-show="!contains_long"><q-chip dense color="red" class="sm-circle shadow-1">&nbsp;</q-chip></span>
                                                  <span v-show="contains_long"><q-chip dense color="green" class="sm-circle shadow-1">&nbsp;</q-chip></span>
                                                  Minimum of 8 characters
                                              </span>
                                          </li>
                                          <!-- <li><span>0.35 EOS is required to be transferred to the new account</span></li> -->
                                      </ul>
                                    </div>
                                    <span class="">
                                        <q-input
                                            light
                                            debounce="500"
                                            rounded outlined color="purple"
                                            v-model="passwords.new"
                                            @input="passwordCheck"
                                            :label="$t('ChangeVertoPassword.new')"
                                            @keyup.enter="gotoConfirmScreen"
                                            ref="passwordInput"
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
                                </div>
                                <q-stepper-navigation v-show="showSubmit.new" class="flex justify-end">
                                    <q-btn @click="gotoConfirmScreen()" color="deep-purple-14" class="--next-btn" rounded :label="$t('next')" />
                                </q-stepper-navigation>
                            </q-step>
                            <!--
                                3. Confirm Password
                            -->
                            <q-step title="Confirm Password" :name="3" prefix="3" :done="step > 3">
                                <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                                <q-input
                                    v-model="passwords.confirm"
                                    light
                                    debounce="500"
                                    rounded outlined color="purple"
                                    @input="checkConfirm"
                                    @keyup.enter="submit"
                                    :label="$t('ChangeVertoPassword.confirm')"
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
                                <q-inner-loading :visible="progress" />
                                <q-stepper-navigation v-show="showSubmit.confirm" class="flex justify-end">
                                    <q-btn @click="submit()" color="deep-purple-14" class="--next-btn" rounded :label="$t('SaveYourKeys.create')" />
                                </q-stepper-navigation>
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
      step: 1,
      isPwd: true,
      passwords: {
        current: '',
        new: '',
        confirm: ''
      },
      showSubmit: {
        current: false,
        new: false,
        confirm: false
      },
      errors: {
        orgPasswordIncorrect: false
      },
      progress: false,
      contractable: true,
      contains_long: false,
      userPassword: '',
      checkPassword: '',
      originalPassword: '',
      vertoPasswordWrong: false,
      newPasswordNull: false,
      newPasswordDontMatch: false
    }
  },
  methods: {
    checkCurrent () {
      this.errors.orgPasswordIncorrect = false
      this.errors.orgPasswordIncorrect = false
      if (this.passwords.current.length > 2) {
        this.showSubmit.current = true
      } else {
        this.showSubmit.current = false
      }
    },
    checkConfirm () {
      if (this.passwords.new === this.passwords.confirm) {
        this.showSubmit.confirm = true
      } else {
        this.showSubmit.confirm = false
      }
    },
    passwordCheck () {
      this.contains_long = false
      this.showSubmit.new = false
      if (this.passwords.new.length > 7) {
        this.contains_long = true
        this.showSubmit.new = true
      }
    },
    gotoConfirmScreen () {
      if (this.showSubmit.new) {
        this.$refs.stepper.next()
      }
    },
    async showNewPassword () {
      this.errors.orgPasswordIncorrect = false
      if (!this.showSubmit.current) {
        return
      }
      try {
        const result = await this.$configManager.getConfig(this.passwords.current)
        if (!result.success) {
          this.errors.orgPasswordIncorrect = true
          this.showSubmit.current = false
          return
        }
      } catch (err) {
        this.errors.orgPasswordIncorrect = true
        this.showSubmit.current = false
        return
      }
      this.$refs.stepper.next()
    },
    submit: async function () {
      this.errors.orgPasswordIncorrect = false
      if (!this.showSubmit.confirm) {
        return
      }
      try {
        this.progress = true
        const result = await this.$configManager.changeVertoPassword(this.passwords.current, this.passwords.new)
        if (!result.success) {
          this.errors.orgPasswordIncorrect = true
        } else {
          this.$router.push({ path: 'settings' })
        }
        this.progress = false
      } catch (err) {
        this.progress = false
        this.errors.orgPasswordIncorrect = true
      }
    },
    cancel () {
      this.$router.push({ path: 'settings' })
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

<template>
  <q-page v-if="false" class="column  items-center justify-start  restore-wallet">
    <div class="q-pa-md">
      <img src="statics/icons/icon-256x256.png"  width="80" alt="logo"/>
    </div>
    <notify-message/>
    <div v-if="step==1" class="vert-page-content">
      <!--          <h2 class="vert-page-content&#45;&#45;title">-->
      <!--            Verto-->
      <!--          </h2>-->
      <h2 class="vert-page-content--title">
        Select your config file
      </h2>
      <!-- The seed phrase will now be added to your config after confirming the password. -->
      <div class="vert-page-content--body">
        <!-- <div class="standard-content--body__img column flex-center gt-xs" v-if="!passwordsMatch"> -->
        <!-- <img src="statics/password_bg.svg" alt=""> -->
        <!-- </div> -->
        <div class="standard-content--body__form">
          <div>
            <q-file :error="fileError" error-message="Please select config file" accept=".config" outlined v-model="file" label="Select your config file">
              <template v-slot:append>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
        </div>
      </div>
      <div class="vert-page-content--footer q-mb-lg">
        <q-btn unelevated class="btn__blue block" @click="validateAndToNextstep"  size="lg"   label="Continue"/>
        <span class="q-pa-sm"/>
        <q-btn outline unelevated size="lg" class="btn--outline__blue"  label="Back" @click="$router.back()"/>
      </div>
    </div>
    <div v-if="step==2" class="vert-page-content">
      <h2 class="vert-page-content--title">
        Enter your config password
      </h2>
      <!-- The seed phrase will now be added to your config after confirming the password. -->
      <div class="vert-page-content--body">
        <!-- <div class="standard-content--body__img column flex-center gt-xs" v-if="!passwordsMatch"> -->
        <!-- <img src="statics/password_bg.svg" alt=""> -->
        <!-- </div> -->
        <div class="standard-content--body__form">
          <div>
            <label class="ver-label">Enter your password</label>
            <q-input
              ref="psswrd"
              v-model="addWallet.vertoPassword"
              @input="showSubmitKey"
              @keyup.enter="restoreConfig"
              autofocus
              outlined
              :type="isPwd ? 'password' : 'text'"
              class="q-mt-sm"
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
        </div>
      </div>
      <div class="vert-page-content--footer q-mb-lg">
        <q-btn @click="restoreConfig" unelevated class="btn__blue block"  size="lg"   label="Continue"/>
        <span class="q-pa-sm"/>
        <q-btn outline unelevated size="lg" class="btn--outline__blue"  label="Back" @click="step=1"/>
      </div>
    </div>
  </q-page>
  <q-page v-else class="column items-center justify-start login-page restore-page-wrapper" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
    <div class="full-width full-height">
      <img :src="'statics/login_ui_' + ($store.state.settings.lightMode === 'true' ? 'dark':'light') +'.png'" alt="head-login" class="head-login" />
      <div class="form_wrapper full-height column q-pa-lg">
        <span class="text-h2 q-pl-md">VERTO</span>
        <span class="text-h3 q-pl-md q-pr-md q-mt-md">Restore wallet</span>
        <!-- <p class="q-pl-md q-pr-md q-mt-md" v-if="step==1">Select your config file</p> -->
        <p class="q-pl-md q-pr-md q-mt-md" v-if="step==2">Enter your config password</p>
        <div class="password_wrapper q-pl-md q-pr-md">
          <div v-if="step==1" class="full-width">
            <div class="full-width q-pt-lg">
              <q-file :dark="$store.state.settings.lightMode === 'true'" class="full-width" :error="fileError" error-message="Please select config file" accept=".config" outlined v-model="file" label="Select your config file">
                <template v-slot:append>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
            <div class="unlock_restore flex justify-between items-end q-mt-xl">
              <q-btn unelevated class="btn__blue unlock_btn" color="grey-4" outline size="md" no-caps @click="validateAndToNextstep" label="Continue" />
              <q-btn flat size="md" no-caps class="restore_btn" color="grey-8" label="Cancel" @click="$router.back()"/>
            </div>
          </div>
          <div v-if="step==2" class="full-width q-pt-xs">
            <div class="full-width q-mt-md q-pt-xs">
              <div>
                <label class="ver-label" v-if="false">Enter your password</label>
                <q-input
                  ref="psswrd"
                  v-model="addWallet.vertoPassword"
                  @input="showSubmitKey"
                  @keyup.enter="restoreConfig"
                  autofocus
                  outlined
                  :type="isPwd ? 'password' : 'text'"
                  class="q-mt-sm full-width"
                  :dark="$store.state.settings.lightMode === 'true'"
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
            </div>
            <div class="unlock_restore flex justify-between items-end q-mt-sm">
              <q-btn @click="restoreConfig" unelevated class="btn__blue unlock_btn" color="grey-4" outline size="md" no-caps label="Continue" />
              <q-btn flat size="md" no-caps class="restore_btn" color="grey-8" label="Back" @click="step=1" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <notify-message/>
  </q-page>
</template>

<script>
// import FileSelect from '@/components/FileSelect.vue'
import configManager from '@/util/ConfigManager'
import { userError } from '@/util/errorHandler'
import Vue from 'vue'
import VideoBg from 'vue-videobg'
import NotifyMessage from '../../../components/notify/NotifyMessage'
Vue.component('video-bg', VideoBg)
export default {
  name: 'RestoreConfig',
  components: {
    NotifyMessage
    // FileSelect
  },
  data () {
    return {
      step: 1,
      isPwd: true,
      spinnervisible: false,
      contractable: true,
      submitKey: false,
      fileEmpty: false,
      unknownError: false,
      incorrectPassword: false,
      showNextButtonToPassword: false,
      file: null,
      fileError: false,
      returnto: '',
      addWallet: {
        walletName: '',
        address: '',
        addressPriv: '',
        vertoPassword: '',
        vertoPasswordError: ''
      }
    }
  },
  created () {
    this.returnto = this.$route.params.returnto
    // console.log('this.returnto', this.returnto)
  },
  methods: {
    validateAndToNextstep () {
      if (this.file == null) {
        this.fileError = true
        return
      }
      this.step = 2
    },
    goback () {
      if (this.returnto === 'settings') {
        this.$router.push('/settings')
      } else if (this.returnto === 'profile') {
        this.$router.push('/verto/profile')
      } else {
        this.$router.push(this.returnto)
      }
    },
    showThePasswordScreen () {
      if (this.showNextButtonToPassword) {
        this.$refs.stepper.next()
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
      this.fileEmpty = false
      this.unknownError = false
    },
    checks: function () {
      if (!this.file) {
        this.fileEmpty = true
        this.showNextButtonToPassword = false
      } else {
        this.fileEmpty = false
        this.showNextButtonToPassword = true
      }
    },
    async restoreConfig () {
      const self = this
      const reader = new FileReader()
      reader.onload = async function () {
        try {
          self.spinnervisible = true
          const results = await configManager.restoreConfig(reader.result, self.addWallet.vertoPassword)
          console.log(results, 'results restoreConfig')
          if (results.message === 'bad_password') {
            // self.startRestoreConfig()
            self.spinnervisible = false
            throw new Error('Incorrect Password')
          }
          // updateProgress(1)
          self.$store.commit('settings/temporary', self.addWallet.vertoPassword)
          self.applicationRefreshing = true
          self.$q.notify({ color: 'positive', message: 'Application refreshing' })
          setTimeout(function () {
            self.$router.push({
              path: '/verto/dashboard'
            })
            self.spinnervisible = false
          }, 300)
        } catch (e) {
          self.spinnervisible = false
          console.log(e, 'restoreConfig error')
          userError(e)
        }
      }
      reader.readAsText(this.file)
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/variables.scss";
  @import "~@/assets/styles/auth_page.scss";
  .restore-wallet{
    //padding-bottom: 0px;
     background: #F5F5FE
  }
  //.vert-page-content {
  //  padding: 0 5% 10% 5%;
  //  flex-grow: 1;
  //  width: 100%;
  //  display: flex;
  //  flex-direction: column;
  //  justify-content: flex-start;
  //
  //  &--title {
  //    font-size: 24px;
  //    font-weight: 600;
  //    line-height: 24px;
  //    font-family: $Franklin;
  //    position: relative;
  //    margin-left: 0%;
  //    margin-top: 0px;
  //    text-align: center;
  //
  //    &__sub {
  //      font-size: 18px;
  //      font-weight: 400;
  //      text-align: center;
  //      line-height: 30px;
  //      margin-top: 0px;
  //    }
  //  }
  //
  //  &--desc {
  //    font-size: 14px;
  //    font-weight: $regular;
  //    line-height: 16px;
  //    font-family: $Titillium;
  //  }
  //
  //  &--body {
  //    flex-grow: 1;
  //    display: flex;
  //    flex-direction: column;
  //    justify-content: space-evenly;
  //    margin-top: 5%;
  //    margin-bottom: 5%;
  //
  //    @media screen and (min-width: 768px) {
  //      margin-top: 5%;
  //      margin-bottom: 0%;
  //      max-width: 400px;
  //      margin-left: auto !important;
  //      margin-right: auto !important;
  //    }
  //
  //    &.extra__px {
  //      padding: 0 70px;
  //    }
  //  }
  //
  //  &--footer {
  //    padding: 0 70px;
  //    display: flex;
  //    flex-direction: column;
  //    justify-content: center;
  //  }
  //  /deep/ .q-field--focused .q-field__label {
  //  }
  //  /deep/ .q-field--outlined .q-field__control{
  //    background-color: #fff
  //  }
  //  /deep/ .q-field--outlined .q-field__control:after {
  //    border: 2px solid #E1E1E9;
  //    //background-color: #fff;
  //    //box-shadow: 0px 0px 10px 0px #E1E1E9;
  //  }
  //
  //  /deep/ .q-field--outlined .q-field__control:before {
  //    border: 2px solid #E1E1E9;
  //    //background-color: #fff;
  //    //box-shadow: 0px 0px 10px 0px #E1E1E9;
  //  }
  //
  //  /deep/ .q-field--outlined.q-field--focused .q-field__control:after {
  //    border: 2px solid #c4c4c6;
  //    //background-color: #fff;
  //    //box-shadow: 0px 0px 10px 0px #d4d4db;
  //  }
  //
  //  /deep/ .q-field--outlined.q-field--focused .q-field__control:before {
  //    border: 2px solid #c4c4c6;
  //    //background-color: #fff;
  //    //box-shadow: 0px 0px 10px 0px #d4d4db;
  //  }
  //
  //  /deep/ .q-field--dark:not(.q-field--focused) .q-field__label,
  //  /deep/ .q-field--dark .q-field__marginal,
  //  /deep/ .q-field--dark .q-field__bottom {
  //  }
  //}
  .chain-tools-wrapper{
    // padding: 0px 6%;
    @media screen and (min-width: 768px) {
      max-width: 700px;
      width: 100%;
      margin: auto;
    }
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
            margin-bottom: 0px;
            border-radius: 10px;
            padding: 0px;
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
                font-size: 16px;
                font-family: $Titillium;
                font-weight: $regular;
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
              box-shadow: 0px 0px 10px 0px #6200ea;
              border: 1px solid #B0B0B0 !important;
              height: 40px;
              text-transform: initial !important;
              font-size: 15px;
              letter-spacing: .5px;
              border-radius: 40px;
              margin-left: 0px;
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
    padding: 5%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // padding-bottom: 100px;
    .privatekey_bg{
        margin-top: -10px;
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
        left: -5px;
        top: 5px;
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
.dark-theme{
  .svg_logo{
    fill: #FFF;
  }
  background: transparent !important;
  .chain-tools-wrapper--list .list-wrapper--chain__eos-to-vtx-convertor{
    background-color: transparent;
  }
  .standard-content--title{
    color: #FFF;
    font-size: 20px;
    margin-top: 8px;
    font-weight: $regular;
  }
  /deep/ .file-select-wrapper {
    .file-select > .select-button span{
      color: #FFF;
    }
    .file-select > .select-button{
      background-color: #04111F !important;
      border: 1px solid #627797;
    }
  }
}
/deep/ .q-stepper{
  &.q-dark{
    background: transparent !important;
    .q-stepper__title{
      color: #CCC !important;
    }
  }
}
.app-logo-row{
  position: relative;
  width: 97%;
  .app-logo{
    position: absolute !important;
    left: 0px;
    z-index: 9;
    a {
      font-weight: $lighter;
      text-transform: uppercase;
      font-family: $Titillium;
      font-size: 25px;
      color: #FFF;
      text-decoration: none;
    }
  }
}

/deep/ .video-page-wrapper{
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.5);
  background-color: rgba(black, .5);
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
}
/deep/ .VideoBg {
    overflow: hidden;
    width: 100vw !important;
    height: 100vh !important;
}
/deep/ .VideoBg__content{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img{}
  h1{
    font-family: $Franklin;
    color: #FFF;
    font-weight: 100;
    font-size: 45px;
    text-align: center;
    line-height: 55px;
  }
}
.video-page-wrapper{
  .or-text{
    margin-left: 10px;
    font-size: 16px;
    // margin-top: -10px;
    // margin-bottom: 10px;
  }
  /deep/ .q-field--focused .q-field__label{
    color: #FFF !important;
  }
  .next {
    box-shadow: 0px 0px 10px 0px #6200ea;
    border: 1px solid #B0B0B0 !important;
  }
  .back {
    box-shadow: 0px 0px 10px 0px #4caf50;
  }
  /deep/ .q-field--outlined.q-field--focused .q-field__control:after{
    border: 1px solid #FFF;
    box-shadow: 0px 0px 10px 0px #6200ea;
  }
  /deep/ .q-field--dark:not(.q-field--focused) .q-field__label,
  /deep/ .q-field--dark .q-field__marginal,
  /deep/ .q-field--dark .q-field__bottom{
    color: #FFF !important;
  }
  .perpleGlow{
    text-shadow: 2px 2px 2px #6200ea;
  }
}
.restore-page-wrapper{
  background: #F9F9F9;
  .head-login{
    max-width: 100%;
    position: relative;
    transform: scale3d(1,1,1);
  }
  .form_wrapper{
    border-radius: 50px 50px 0px 0px;
    margin-top: -80px;
    background: #F9F9F9;
    position: relative;
    z-index: 2;
    box-shadow: 0px -30px 50px 0px rgba(black, .1);
    .text-h2{
      font-family: $Franklin;
      font-weight: $black;
      font-size: 20px;
      line-height: 30px;
      color: #04111F;
    }
    .text-h3{
      font-family: $Franklin;
      font-weight: $lighter;
      font-size: 30px;
      line-height: 35px;
      color: #04111F;
    }
    p{
      font-family: $Franklin;
      font-weight: $lighter;
      font-size: 14px;
      line-height: 22px;
      color: #04111F;
    }
    .unlock_restore{
      min-height: 132px;
      .unlock_btn{
        width: 65%;
        height: 45px;
        letter-spacing: 1px;
        font-weight: $lighter;
        font-family: $Franklin;
        font-size: 16px !important;
        /deep/ .q-btn__wrapper:before{
          border: 2px solid #CCC !important;
        }
      }
      .restore_btn{
        width: 30%;
        height: 45px;
        letter-spacing: 1px;
        font-weight: $lighter;
        font-family: $Franklin;
        font-size: 16px !important;
      }
    }
  }
  &.dark-theme{
    background: #04111F;
    .form_wrapper{
      background: #04111F;
      .text-h2{
        color: #FFF;
      }
      .text-h3{
        color: #FFF;
      }
      p{
        color: #FFF;
      }
      .restore_btn{
        // color: #FFF !important;
      }
    }
  }
}
.password_wrapper{
  /deep/ .q-field__messages{
    color: #929398;
    font-size: 14px;
    margin-left: -10px;
    margin-top: -4px;
  }
  /deep/ .text-negative {
    color: #929398 !important;
  }
  /deep/ .q-field__native{
    div{
      font-size: 12px;
      opacity: .7;
    }
  }
}
.dark-theme{
  .password_wrapper{
    /deep/ .q-field__messages{
      color: #FFF;
    }
    /deep/ .text-negative {
      color: #FFF !important;
    }
  }
}
</style>

<template>
  <q-page class="column restore-wallet dark-theme">
    <div class="row app-logo-row">
      <div class="col col-md-12 app-logo flex q-pl-lg q-ml-sm q-mt-lg items-center justify-start">
        <img src="statics/icons/vtx-logo-1024x1024.png" class="q-mr-sm" width="40" alt="logo"/>
        <router-link to="/verto/dashboard">VERTO</router-link>
      </div>
    </div>
    <video-bg :sources="[require('assets/mp4/restore.mp4')]" img="">
      <div class="video-page-wrapper q-pt-md q-pb-md">
        <!-- <div class="standard-content" style="padding-bottom: 0px"> -->
        <div class="chain-tools-wrapper">
          <div class="standard-content">
            <h2 class="standard-content--title flex justify-center">
              <q-btn flat unelevated class="btn-align-left" @click="returnto === 'profile' ? $router.push('/verto/profile') : $router.go(-1)" text-color="white" icon="keyboard_backspace" />
              <span class="text-white">{{$t('SettingsView.restore_config')}}</span>
            </h2>
            <div class="privatekey_bg flex flex-center" v-if="false">
              <img src="statics/restore_config.svg" alt="">
            </div>
          </div>
          <div class="chain-tools-wrapper--list open">
            <div class="list-wrapper">
              <div class="list-wrapper--chain__eos-to-vtx-convertor">
                <q-stepper dark v-model="step" done-color="green" ref="stepper" alternative-labels vertical color="primary" animated flat >
                  <q-step title="Select Config File" :name="1" prefix="1" :done="step > 1">
                    <div class="flex full-width file-select-wrapper flex-center q-pa-sm">
                      <FileSelect @input="checks" @keyup.enter="showThePasswordScreen" v-model="file" />
                      <q-icon name="cloud_upload" class="icon-upload" />
                    </div>
                    <q-stepper-navigation v-show="showNextButtonToPassword" class="flex justify-end">
                      <q-btn @click="showThePasswordScreen" flat text-color="white" color="transparent" class="--next-btn next" rounded label="Next" />
                    </q-stepper-navigation>
                  </q-step>
                  <q-step title="Verto Password" :name="2" prefix="1" :done="step > 2">
                    <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                    <q-card-section class="text-white text-center"  >
                      <div>
                        <q-input
                          dark
                          v-model="addWallet.vertoPassword"
                          @input="showSubmitKey"
                          @keyup.enter="restoreConfig"
                          :type="isPwd ? 'password' : 'text'"
                          rounded outlined color="purple"
                          label="Config Verto password"
                          hint="*Minimum of 8 characters">
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
                      <div v-show="fileEmpty" class="text-h6 text-uppercase text-red q-pa-lg">
                        You have to select a config file
                      </div>
                      <div v-show="unknownError" class="text-h6 text-uppercase text-red q-pa-lg">
                        Unknown Error
                      </div>
                      <q-stepper-navigation v-show="submitKey" class="flex justify-end">
                        <q-btn @click="restoreConfig" flat color="white" class="--next-btn next" rounded label="Next" />
                      </q-stepper-navigation>
                    </q-card-section>
                  </q-step>
                </q-stepper>
              </div>
              <br><br><br>
            </div>
          </div>
        </div>
        <!-- </div> -->
      </div>
    </video-bg>
  </q-page>
</template>

<script>
import FileSelect from '@/components/FileSelect.vue'
import configManager from '@/util/ConfigManager'
import { userError } from '@/util/errorHandler'
import Vue from 'vue'
import VideoBg from 'vue-videobg'
Vue.component('video-bg', VideoBg)
export default {
  name: 'RestoreConfig',
  components: {
    FileSelect
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
.restore-wallet{
  padding-bottom: 0px;
  // background: #f3f3f3 !important
}
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
</style>

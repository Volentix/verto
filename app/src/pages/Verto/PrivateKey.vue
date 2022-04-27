<template>
  <q-page class="column import-private-key" :class="{'desktop-marg':screenSize > 1024, 'mobile-pad': screenSize < 1024,'dark-theme': $store.state.settings.lightMode === 'true', 'text-black bg-grey-12': $store.state.settings.lightMode === 'false'}">
    <div :class="{'dark-theme': $store.state.settings.lightMode === 'true'}" style="height: 90vh;">
      <div class="desktop-version full-height" v-if="screenSize > 1024">
        <div class="row full-height">
          <div class="col col-md-3">
            <div class="wallets-container" style="height: 100%">
              <profile-header :isMobile="false" class="marg" version="type2222" />
              <wallets :isMobile="false" class="full-height max-height" :showWallets="false" :isWalletsPage="false" :isWalletDetail="false" />
              <!-- <img src="statics/prototype_screens/wallets.jpg" alt=""> -->
            </div>
          </div>
          <div class="col col-md-9">
            <div class="desktop-card-style private-key q-mb-sm" :class="{'dark-theme': $store.state.settings.lightMode === 'true'}">
              <div class="chain-tools-wrapper">
                <div class="standard-content">
                    <h2 class="standard-content--title flex justify-start items-center">
                      {{ currentWallet.privateKey ?  'Show private key' : 'Add private key' }}
                    </h2>
                </div>
                <div class="chain-tools-wrapper--list open">
                    <div class="list-wrapper">
                        <div class="list-wrapper--chain__eos-to-vtx-convertor">
                          <q-stepper :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-if="currentWallet.privateKey" v-model="step2" done-color="green" ref="stepper" alternative-labels vertical color="primary" animated flat >
                            <q-step title="Private key" :name="1" icon="fas fa-check-double" :done="step2 > 1">
                                <div class="text-black" style="margin-left: -35px">
                                  <br>
                                  <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" readonly v-model="currentWallet.privateKey" rounded class="input-input pr80" outlined color="purple" type="text">
                                    <template v-slot:append>
                                      <div class="flex justify-end">
                                        <q-btn flat unelevated text-color="grey" @click="copyToClipboard(currentWallet.privateKey , 'Private Key')" round class="btn-copy" icon="o_file_copy" />
                                      </div>
                                    </template>
                                  </q-input>

                                  <br>
                                </div>
                            </q-step>
                          </q-stepper>
                          <q-stepper class="q-mb-md" v-else :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-model="step" done-color="green" ref="stepper" alternative-labels vertical color="primary" animated flat >
                              <!--
                              1. Paid to
                              -->
                              <q-step title="Choose File" :name="1" prefix="1" :done="step > 1">
                                  <div class="text-black">
                                      <div class="text-h4 --subtitle">
                                          <ul>
                                              <li><span>Choose Private Key Encrypted File</span></li>
                                          </ul>
                                      </div>
                                      <div class="flex full-width file-select-wrapper flex-center q-pa-sm">
                                          <file-select @input="checksFile" v-model="file" />
                                          <q-icon :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" name="cloud_upload" class="icon-upload" />
                                      </div>
                                      <div v-show="passwordFileError" class="text-h6 text-uppercase text-red q-pa-md">
                                          Error Getting File
                                      </div>
                                      <q-stepper-navigation v-show="gotfile && !passwordFileError" class="flex justify-end">
                                          <q-btn @click="gottoFilePassword()" color="deep-purple-14" class="--next-btn" rounded :label="$t('next')" />
                                      </q-stepper-navigation>
                                  </div>
                              </q-step>
                              <!--
                              2
                              -->
                              <q-step :name="2" title="Validate" icon="fas fa-check-double" :done="step>2">
                                  <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                                  <q-input
                                      v-model="privateKeyPassword"
                                      :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                                      debounce="500"
                                      rounded outlined color="purple"
                                      label="Private Key Password"
                                      @input="checkPrivateKeyPassword"
                                      @keyup.enter="gotoVertoPassword()"
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
                                  <div v-show="invalidPrivateKeyPassword" class="text-h6 text-uppercase text-red q-pa-md text-center">
                                      Password Incorrect
                                  </div>
                                  <q-stepper-navigation v-show="privateKeyPasswordValid" class="flex justify-end">
                                      <q-btn @click="gotoVertoPassword()" color="deep-purple-14" class="--next-btn" rounded :label="$t('SaveYourKeys.create')" />
                                  </q-stepper-navigation>
                              </q-step>
                              <!--
                              3
                              -->
                              <q-step :name="3" title="Verto Password" icon="fas fa-lock" :done="step>3">
                                  <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                                      <q-input
                                          v-model="vertoPassword"
                                          :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                                          debounce="500"
                                          rounded outlined color="purple"
                                          label="Verto Password"
                                          @input="checkVertoPassword"
                                          @keyup.enter="submit()"
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

                                  <div v-show="vertoPasswordWrong" class="text-h6 text-uppercase text-red q-pa-md text-center">
                                      Password Incorrect
                                  </div>
                                  <q-stepper-navigation v-show="vertoPassordValid" class="flex justify-end">
                                      <q-btn @click="submit()" color="deep-purple-14" class="--next-btn" rounded :label="$t('SaveYourKeys.create')" />
                                  </q-stepper-navigation>
                              </q-step>
                          </q-stepper>
                           <q-dialog v-model="deletAccountDialog" >
                            <q-card style="width:450px">
                              <q-card-section class="">

                                <div class="text-bold text-body1 q-pb-sm">Enter Verto password</div>
                                  <span class="text-body2 text-red">After deleting this account ({{this.currentWallet.name}}), you will need to import it using the private to be able to use it inside Verto again.</span>
                                    <q-input
                                    v-model="vertoPassword"
                                    :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                                    debounce="500"
                                    class="q-pt-sm"
                                    rounded outlined color="purple"
                                    label="Verto Password"
                                    @input="vertoPassordValid = false"
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

                            <div v-show="vertoPassordValid" class="text-uppercase text-red q-pa-md ">
                                Password Incorrect
                            </div>
                            </q-card-section>

                              <q-card-actions align="right">
                                <q-btn flat label="Cancel" @click="deletAccountDialog = false" color="primary" v-close-popup />
                                <q-btn flat label="Delete" @click="deleteAccount(currentWallet.name)" color="primary"  />
                              </q-card-actions>
                            </q-card>
                          </q-dialog>
                            <div class="q-pl-md cursor-pointer delete-account"> <q-btn @click="deletAccountDialog = true" size="sm" icon="delete" label="Delete account" flat /></div>
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
        <div class="chain-tools-wrapper_">
          <q-header class="bg-white">
            <q-toolbar  :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'bg-white text-black'">
                <q-btn flat round dense icon="arrow_back_ios" class="q-mr-sm" @click="goBackPage()" :text-color="$store.state.settings.lightMode === 'false' ? 'black':'white'"/>
                <q-toolbar-title> {{ currentWallet.privateKey ?  'Show private key' : 'Add private key' }}  </q-toolbar-title>
                <!-- <q-btn flat round dense icon="close" v-close-popup to="/verto/dashboard"/> -->
            </q-toolbar>
          </q-header>
          <div class="standard-content">
              <!-- <div class="standard-content--title flex justify-center">
                  <q-btn flat unelevated class="btn-align-left" :to="goBack" :text-color="$store.state.settings.lightMode === 'false' ? 'black':'white'" icon="keyboard_backspace" />
                    {{ currentWallet.privateKey ?  'Show private key' : 'Add private key' }}
              </div> -->
              <div class="privatekey_bg flex flex-center"><img src="statics/privatekey_bg.svg" height="130px;" alt=""></div>
          </div>
          <div class="chain-tools-wrapper--list_ open">
              <div class="list-wrapper">
                  <div class="list-wrapper--chain__eos-to-vtx-convertor">
                    <q-stepper  v-if="currentWallet.privateKey" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-model="step2" done-color="green" ref="stepper" alternative-labels vertical color="primary" animated flat >
                      <q-step title="Private key" :name="1" icon="fas fa-check-double" :done="step2 > 1">
                          <div class="text-black" style="margin-left: -35px">
                            <br>
                            <q-input :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" readonly v-model="currentWallet.privateKey" rounded class="input-input pr80" outlined color="purple" type="text">
                              <template v-slot:append>
                                <div class="flex justify-end">
                                  <q-btn flat unelevated text-color="grey" @click="copyToClipboard(currentWallet.privateKey , 'Private Key')" round class="btn-copy" icon="o_file_copy" />
                                </div>
                              </template>
                            </q-input>
                            <br>
                          </div>
                      </q-step>
                    </q-stepper>
                    <q-stepper class="q-pb-md" v-else :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" v-model="step" done-color="green" ref="stepper" alternative-labels vertical color="primary" animated flat >
                        <!--
                        1. Paid to
                        -->
                        <q-step title="Choose File" :name="1" prefix="1" :done="step > 1">
                            <div class="text-black">
                                <div class="text-h4_ --subtitle">
                                    <ul>
                                        <li><span>Choose Private Key Encrypted File</span></li>
                                    </ul>
                                </div>
                                <div class="flex full-width file-select-wrapper flex-center q-pa-sm">
                                    <file-select @input="checksFile" v-model="file" />
                                    <q-icon :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" name="cloud_upload" class="icon-upload" />
                                </div>
                                <div v-show="passwordFileError" class="text-h6 text-uppercase text-red q-pa-md">
                                    Error Getting File
                                </div>
                                <q-stepper-navigation v-show="gotfile && !passwordFileError" class="flex justify-end">
                                    <q-btn @click="gottoFilePassword()" color="deep-purple-14" class="--next-btn" rounded :label="$t('next')" />
                                </q-stepper-navigation>
                            </div>
                        </q-step>
                        <!--
                        2
                        -->
                        <q-step :name="2" title="Validate" icon="fas fa-check-double" :done="step>2">
                            <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                            <q-input
                                v-model="privateKeyPassword"
                                :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                                debounce="500"
                                rounded outlined color="purple"
                                label="Private Key Password"
                                @input="checkPrivateKeyPassword"
                                @keyup.enter="gotoVertoPassword()"
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
                            <div v-show="invalidPrivateKeyPassword" class="text-h6 text-uppercase text-red q-pa-md text-center">
                                Password Incorrect
                            </div>
                            <q-stepper-navigation v-show="privateKeyPasswordValid" class="flex justify-end">
                                <q-btn @click="gotoVertoPassword()" color="deep-purple-14" class="--next-btn" rounded :label="$t('SaveYourKeys.create')" />
                            </q-stepper-navigation>
                        </q-step>
                        <!--
                        3
                        -->
                        <q-step :name="3" title="Verto Password" icon="fas fa-lock" :done="step>3">
                            <q-btn flat @click="$refs.stepper.previous()" unelevated icon="keyboard_arrow_up" color="primary" class="--back-btn"/>
                                <q-input
                                    v-model="vertoPassword"
                                    :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                                    debounce="500"
                                    rounded outlined color="purple"
                                    label="Verto Password"
                                    @input="checkVertoPassword"
                                    @keyup.enter="submit()"
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

                            <div v-show="vertoPasswordWrong" class="text-h6 text-uppercase text-red q-pa-md text-center">
                                Password Incorrect
                            </div>
                            <q-stepper-navigation v-show="vertoPassordValid" class="flex justify-end">
                                <q-btn @click="submit()" color="deep-purple-14" class="--next-btn" rounded :label="$t('SaveYourKeys.create')" />
                            </q-stepper-navigation>
                        </q-step>
                    </q-stepper>

                  </div>
                  <br><br><br>
              </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import sjcl from 'sjcl'
import FileSelect from '@/components/FileSelect.vue'
import ProfileHeader from '../../components/Verto/ProfileHeader'
import Wallets from '../../components/Verto/Wallets'
import initWallet from '@/util/_Wallets2Tokens'
export default {
  components: {
    FileSelect,
    ProfileHeader,
    Wallets
  },
  data () {
    return {
      step: 1,
      step2: 1,
      currentWallet: {
        privatekey: ''
      },
      deletAccountDialog: false,
      goBack: '',
      file: null,
      isPwd: true,
      iunderstand: false,
      contractable: true,
      gotfile: false,
      privateKeyPasswordValid: false,
      privateKeyPassword: '',
      privateKeyFromFile: '',
      passwordFileError: false,
      invalidPrivateKeyPassword: false,
      vertoPassword: '',
      vertoPassordValid: false,
      vertoPasswordWrong: false
    }
  },
  async created () {
    let exchangeNotif = document.querySelector('.exchange-notif'); if (exchangeNotif !== null) { exchangeNotif.querySelector('.q-btn').dispatchEvent(new Event('click')) }
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)
    // let tableData = await this.$store.state.wallets.tokens
    let params = this.$store.state.currentwallet.params

    this.currentWallet = this.$store.state.currentwallet.config.keys.find(w => w.name.toLowerCase() === params.accountName.toLowerCase())

    if (params.chainID.toLowerCase() === 'eth' && this.currentWallet.privateKey && this.currentWallet.privateKey.substring(0, 2) === '0x') {
      this.currentWallet.privateKey = this.currentWallet.privateKey.substring(2)
    }
    this.goBack = `/verto/wallets/${params.chainID}/${params.tokenID}/${params.accountName}`
  },
  methods: {
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
    async submit () {
      if (!this.vertoPassordValid) {
        return
      }
      try {
        const result = await this.$configManager.addPrivateKeyToWallet(this.vertoPassword, this.currentWallet.name, this.privateKeyFromFile)
        if (result.success) {
          this.$router.push({ path: 'vertomanager' })
        } else {
          this.vertoPasswordWrong = true
        }
      } catch (err) {
        this.vertoPasswordWrong = true
      }
    },
    checkVertoPassword () {
      this.vertoPassordValid = false
      if (this.vertoPassword.length > 7) {
        this.vertoPassordValid = true
      }
    },
    gottoFilePassword () {
      const that = this
      const reader = new FileReader()
      this.passwordFileError = false
      reader.onload = async function () {
        try {
          that.privateKeyFromFile = reader.result
          that.$refs.stepper.next()
        } catch (e) {
          that.passwordFileError = true
          // userError(e)
        }
      }
      reader.readAsText(this.file)
    },
    gotoVertoPassword () {
      if (!this.privateKeyPasswordValid) {
        return
      }
      this.invalidPrivateKeyPassword = false
      let privateKeyEncrypted = ''
      if (this.privateKeyFromFile.constructor === String) {
        // In case it was previously useleslly stringified
        privateKeyEncrypted = this.privateKeyFromFile.replace(/\\"/g, '"')
      } else if (this.privateKeyFromFile.constructor === Object) {
        privateKeyEncrypted = JSON.stringify(this.privateKeyFromFile)
      }
      const result = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)
      if (!result.success) {
        this.invalidPrivateKeyPassword = true
        this.privateKeyPasswordValid = false
        return
      } else {
        // This block is to support an old file format of keys found in the wild
        if (result.key.indexOf('privatekey') !== -1) {
          const key = JSON.parse(result.key)
          this.privateKeyFromFile = sjcl.encrypt(this.privateKeyPassword, '"' + key.privatekey + '"')
        } else {
          this.privateKeyFromFile = privateKeyEncrypted
        }
      }
      // Remove the private key immediately so it
      // does not stick around any longer than it has to
      this.privateKeyPassword = ''
      this.$refs.stepper.next()
    },
    checkPrivateKeyPassword () {
      this.invalidPrivateKeyPassword = false
      this.privateKeyPasswordValid = false
      if (this.privateKeyPassword.length > 7) {
        this.privateKeyPasswordValid = true
      }
    },
    async deleteAccount (name) {
      let result = await this.$configManager.deleteAccount(this.vertoPassword, name)

      if (!result.success) {
        this.vertoPassordValid = true
      } else {
        initWallet()
        this.$router.push('/verto/dashboard')
      }
    },
    checksFile () {
      this.passwordFileError = false
      this.gotfile = false
      if (this.file) {
        this.gotfile = true
      }
    },
    goBackPage () {
      this.$router.push({ name: 'wallets', params: { openDialog: true } })
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowWidth)
  }
}
</script>

<style scoped lang="scss">

.delete-account {
  margin-top:-20px
}
  @import "~@/assets/styles/variables.scss";

  /deep/ .profile-wrapper--header{
    margin-bottom: 0px;
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
    padding-bottom: 50px;
    background: #f3f3f3 !important;
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
    &.import-private-key{
      background: #04111F !important;
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
    }
  }
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
  .private-key{
    /deep/ .chain-tools-wrapper--list{
      padding: 0px;
      padding-left: 0px !important;
      padding-right: 0px !important;
      .list-wrapper--chain__eos-to-vtx-convertor{
        box-shadow: none;
        padding: 0%;
      }
    }
  }
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
    @media screen and (min-width: 768px) {
      padding: 2%;
      flex-direction: column;
      justify-content: flex-start;
      min-height: unset !important;
      padding-bottom: 20px;
    }
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
      @media screen and (min-width: 768px) {
        margin-top: -20px;
        font-size: 25px;
      }
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
  /deep/ .q-stepper{
    &.q-dark{
      background: #04111F;
      .q-stepper__title{
        color: #CCC !important;
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
    /deep/ .file-select-wrapper {
      .file-select > .select-button span{
        color: #FFF;
      }
      .file-select > .select-button{
        background-color: #04111F !important;
        border: 1px solid #627797;
      }
    }
    .standard-content--title{
      color: #FFF;
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

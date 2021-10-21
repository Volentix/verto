<template>
  <q-page
    class=""
    :class="{
      'desktop-marg': screenSize > 1024,
      'mobile-pad': screenSize < 1024 && !$q.platform.is.mobile,
      'text-black bg-white': $store.state.settings.lightMode === 'false',
      'text-white': $store.state.settings.lightMode === 'true',
    }"
  >
    <div :class="{ 'dark-theme': $store.state.settings.lightMode === 'true' }" style="height: 100vh;">
      <div class="full-height" :class="{'desktop-version': screenSize > 1024 }">
        <div class="row full-height">
          <div class="col col-md-3"  v-if="screenSize > 1024 && false">
            <div class="wallets-container" style="height: 100%">
              <profile-header
                :isMobile="false"
                class="marg"
                version="type2222"
              />
              <wallets
                :isMobile="false"
                :showWallets="false"
                :isWalletsPage="false"
                :isWalletDetail="false"
                class="full-height max-height"
              />
              <!-- <img src="statics/prototype_screens/wallets.jpg" alt=""> -->
            </div>
          </div>
          <div class="col col-md-12">
            <div
              class="desktop-card-style apps-section history-card"
              :class="{
                'dark-theme': $store.state.settings.lightMode === 'true',
              }"
              style="height: 100%"
            >
              <q-banner
                inline-actions
                class="text-white bg-red q-my-md"
                v-if="false"
              >
                Section currently in development: currently showing ETH wallets
                history
              </q-banner>
              <div class="row" v-if="false">

                <div class="col flex justify-end q-pr-md">
                  <AccountSelector :showAllWallets="true" />
                </div>
              </div>

              <div class="standard-content--body" style="height: 100%">
                <div class="row">
                  <div class="col-md-12 q-pl-md">
                    <PowerUp v-if="$route.params.action == 'powerup'" @setTxData="setTxData" />
                    <BuySellEosRam @setTxData="setTxData" v-else />

                       <p class="text-h6 text-bold" v-if="transactionObject && !decryptPrivateKey && !transactionLink">Click button below to process</p>
                       <p class="text-red text-body2">{{ErrorMessage}}</p>
                       <p class="text-green text-body2">{{SuccessMessage}}</p>

                         <div v-if="decryptPrivateKey">
                          <q-card-section :dark="$store.state.settings.lightMode === 'true'">
                            <div class="text-uppercase">
                              <q-item-section>
                                <q-item-label>Enter your private key password to sign the transaction</q-item-label>
                              </q-item-section>

                              <div >
                                <q-input dark v-model="privateKeyPassword" color="deep-purple-14" label="Private Key Password" debounce="500" :error="invalidPrivateKeyPassword" error-message="The password is incorrect" @input="checkPrivateKeyPassword" :type="isPwd ? 'password' : 'text'">
                                  <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                                  </template>
                                </q-input>
                              </div>

                                <q-btn  :disable="!privateKey.success" :loading="spinnervisible"  label="Submit" outline @click="process" />

                            </div>
                          </q-card-section>
                        </div>
                        <p>
                        <q-btn label="Process" :disable="!transactionObject" :loading="spinnervisible" @click="process()"  v-if="transactionObject && !decryptPrivateKey && !transactionLink" outline />
                        </p>
                         <q-input v-if="transactionLink" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" readonly class="input-input" rounded outlined color="purple" v-model="transactionLink">
                            <template v-slot:append>
                            <div class="flex justify-end">
                                <q-btn flat unelevated @click="copyToClipboard(transactionLink , 'Transaction link')" text-color="grey" round class="btn-copy" icon="o_file_copy" />
                            </div>
                            </template>
                        </q-input>
                        <a v-if="transactionLink" :href="transactionLink" target="_blank" class="text-body2 text-black"> More info</a>
                        <!-- <p> </p> -->
                  </div>
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
import configManager from '@/util/ConfigManager'
import AccountSelector from '../../components/Verto/Exchange/AccountSelector'
import BuySellEosRam from '../../components/Verto/BuySellEosRam'
import PowerUp from '../../components/Verto/EOS/PowerUp'
import EosWrapper from '@/util/EosWrapper'
const eos = new EosWrapper()
import { version } from '../../../package.json'
let platformTools = require('../../util/platformTools')
if (platformTools.default) platformTools = platformTools.default
import EOSContract from '../../mixins/EOSContract'

export default {
  components: {
    ProfileHeader,
    Wallets,
    AccountSelector,
    BuySellEosRam,
    PowerUp
  },
  data () {
    return {
      colors: ['cyan', 'teal', 'light-blue', 'blue-1', 'pink', 'purple'],
      transaction: [],
      privateKeyPassword: '',
      SuccessMessage: '',
      transactionLink: null,
      transactionObject: false,
      invalidPrivateKeyPassword: false,
      isPwd: true,
      privateKey: {

      },
      spinnervisible: false,
      actionTemplate:
        {
          account: '',
          name: '',
          dataKeys: [],
          memo: '',
          dataValues: [],
          dataCount: 1
        },
      actions: [
        {
          account: '',
          name: '',
          dataKeys: [],
          memo: '',
          dataValues: [],
          dataCount: 1
        }
      ],
      pword: '',
      screenSize: 1024,
      minimizedModal: false,
      message: '',
      ErrorMessage: '',
      version: {},
      decryptPrivateKey: false,
      network: this.$store.state.settings.network,
      configPath: '',
      transStatus: null
    }
  },
  mounted () {
    this.version = version
    this.setupPlatformPath()
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)
    this.privateKey.key = this.$store.state.currentwallet.wallet.privateKey
    eos.freePowerUp(this.$store.state.currentwallet.wallet.name)
  },
  watch: {

    actions: {
      handler: function () {
        this.setTransaction()
      },
      deep: true
    }
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
    checkPrivateKeyPassword () {
      const privateKeyEncrypted = JSON.stringify(this.$store.state.currentwallet.wallet.privateKeyEncrypted)
      this.privateKey = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)
      if (this.privateKey.success) {
        this.invalidPrivateKeyPassword = false
      } else {
        this.invalidPrivateKeyPassword = true
        return false
      }
    },
    async process () {
      this.ErrorMessage = null
      this.transStatus = null

      if (this.$store.state.currentwallet.wallet.privateKeyEncrypted && !this.privateKey.success) {
        this.decryptPrivateKey = true
        return
      }
      let transactionObject = this.transactionObject

      try {
        this.spinnervisible = true

        let result = await eos.transact(transactionObject, { keyProvider: this.privateKey.key }, 300)

        this.transactionLink = process.env[this.$store.state.settings.network].EOS_TRANSACTION_EXPLORER + result.transaction_id
        this.spinnervisible = false
        this.transStatus = 'Sent Successfully'
        this.SuccessMessage = 'Congratulations, your transactions have been recorded on the blockchain.'
      } catch (error) {
        if (error.toString().includes('is greater than the maximum billable CPU time for the transaction')) {
          this.freeCPU = true
          this.spinnervisible = true
          let account = this.$store.state.currentwallet.wallet
          account.privateKey = this.privateKey.key
          this.sendFreeCPUTransaction(transactionObject.actions, account).then(result => {
            console.log(result, 'result')
            if (result.success) {
              this.transactionLink = result.message
              this.transStatus = !result.status ? 'Sent Successfully' : result.status
            } else {
              this.ErrorMessage = result.message
            }
            this.spinnervisible = false
          }).catch((error) => {
            this.spinnervisible = true
            this.ErrorMessage = error.message
          })
        } else {
          this.ErrorMessage = error.message
          this.spinnervisible = false
        }
        /*
         if (error.includes('maximum billable CPU time')) {
          this.voteError = true
          this.ErrorMessage = 'Your EOS account does not have enough CPU staked to process the transaction.'
        } else if (error.includes('user must stake before they can vote')) {
          this.voteError = true
          this.ErrorMessage = 'You must stake before you can vote!'
        }
        */
      }
    },
    setTxData (data) {
      this.transactionLink = false
      this.transactionObject = data
      console.log(this.transactionObject, 9)
      if (this.transactionObject.send) {
        this.process()
      }
    },
    getWindowWidth () {
      this.screenSize = document.querySelector('#q-app').offsetWidth
    },
    async setupPlatformPath () {
      this.configPath = await platformTools.filePath()
    },
    goChangePassword: function () {
      this.$router.push({ path: '/change-password' })
    },
    setNetwork: function () {
      this.$store.dispatch('settings/toggleNetwork', this.network)
      this.$q.notify({
        message: `Network changed to ${this.network}`,
        color: 'positive'
      })
    },
    async backupConfig () {
      try {
        await configManager.backupConfig()
        if (this.$q.platform.is.android) {
          this.$q.notify({ color: 'positive', message: 'Config Saved' })
        }
      } catch (e) {
        // TODO: Exception handling
      }
    }
  },
  mixins: [EOSContract]
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
.action {
    border: 1px solid;
    border-radius: 12px;
}
.preFormatted {

    font-family: monospace;
    white-space: pre;
}
/deep/ .wallets-wrapper {
  padding-bottom: 0px !important;
}
/deep/ .wallets-wrapper--list {
  box-shadow: none;
  margin-top: 0px;
}
.marg {
  /deep/ .profile-wrapper {
    &--header {
      margin-bottom: 0px;
    }
  }
}
.mobile-pad {
  padding-bottom: 50px;
  background: #fff !important;
}
.desktop-version {
  background: #e7e8e8;
  padding-top: 0vh;
  padding-left: 0vh;
  padding-bottom: 50px;
  padding-right: 0px;
  @media screen and (min-width: 768px) {
    padding-top: 0vh;
    padding-bottom: 0px;
  }
}
.standard-content {
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
  &--title {
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
    .btn-align-left {
      position: absolute;
      left: -15px;
      top: 10px;
    }
  }
}
.dark-theme {
  .desktop-version {
    background: #04111f;
  }
  .history-card {
  }
  /deep/ .profile-wrapper {
    &--header {
      margin-bottom: 0px;
      border: 1px solid #627797;
      // border-bottom: none;
      border-radius: 10px 10px 0px 0px !important;
    }
  }
  /deep/ .transaction-wrapper--list {
    background-color: #04111f;
    .q-list--bordered .q-link {
      border-top: 1px solid rgba(white, 0.06);
    }
  }
}
</style>

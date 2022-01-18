<template>
  <div class="row">
    <div class="col-md-12 q-pl-md">
          <p class="text-h6 text-bold" v-if="transactionObject && !decryptPrivateKey && !transactionLink && !hideLabels">Click button below to process</p>
          <p class="text-red text-body2" v-if="ErrorMessage">{{ErrorMessage}}</p>
          <p class="text-green text-body2" v-if="SuccessMessage">{{SuccessMessage}}</p>
          <div v-if="decryptPrivateKey && !transactionLink" >
            <q-card-section>
              <div class="">
                <q-item-section>
                  <q-item-label>Enter your private key password to sign the transaction</q-item-label>
                </q-item-section>

                <div >
                  <q-input filled :dark="$store.state.settings.lightMode === 'true'" v-model="privateKeyPassword" color="deep-purple-14" label="Private Key Password" debounce="500" :error="invalidPrivateKeyPassword" error-message="The password is incorrect" @input="checkPrivateKeyPassword" :type="isPwd ? 'password' : 'text'">

                    <template v-slot:append>
                      <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                    </template>
                  </q-input>
                </div>

                  <q-btn :disable="!privateKey.success" :loading="spinnervisible" rounded no-caps label="Submit" outline @click="process" />

              </div>
            </q-card-section>
          </div>
          <q-btn  label="Process" :disable="!transactionObject" :loading="spinnervisible" @click="process()"  v-if="transactionObject && !decryptPrivateKey && !transactionLink && (!hideLabels || hideLabels && !ErrorMessage)" outline />
          <q-input v-if="transactionLink" :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'" readonly class="input-input" rounded outlined color="purple" v-model="transactionLink">
            <template v-slot:append>
              <div class="flex justify-end">
                <q-btn flat unelevated @click="copyToClipboard(transactionLink , 'Transaction link')" text-color="grey" round class="btn-copy" icon="o_file_copy" />
              </div>
            </template>
          </q-input>
          <a v-if="transactionLink" :href="transactionLink" target="_blank" :class="{'text-white': $store.state.settings.lightMode === 'true', 'text-black': $store.state.settings.lightMode === 'false'}"  class="text-body2 q-pb-md "> More info</a>
        </div>
  </div>
</template>

<script>

import configManager from '@/util/ConfigManager'

import EosWrapper from '@/util/EosWrapper'
const eos = new EosWrapper()
import { version } from '../../../package.json'
let platformTools = require('../../util/platformTools')
if (platformTools.default) platformTools = platformTools.default
import EOSContract from '../../mixins/EOSContract'

export default {
  props: ['hideLabels'],
  data () {
    return {
      colors: ['cyan', 'teal', 'light-blue', 'blue-1', 'pink', 'purple'],
      transaction: [],
      privateKeyPassword: '',
      SuccessMessage: '',
      currentwallet: null,
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
      ErrorMessage: null,
      version: {},
      decryptPrivateKey: false,
      network: this.$store.state.settings.network,
      configPath: '',
      transStatus: null
    }
  },
  async mounted () {
    this.version = version
    this.setupPlatformPath()
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)

    let account = this.$store.state.wallets.tokens.find(o => o.name.toLowerCase() === this.$store.state.investment.defaultAccount.name.toLowerCase() && o.key.toLowerCase() === this.$store.state.investment.defaultAccount.key.toLowerCase())

    if (account) {
      this.currentwallet = account
      this.privateKey.key = account.privateKey
    }

    await eos.freePowerUp(this.currentwallet.name)
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
      const privateKeyEncrypted = JSON.stringify(this.currentwallet.privateKeyEncrypted)
      this.privateKey = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)
      if (this.privateKey.success) {
        this.invalidPrivateKeyPassword = false
      } else {
        this.invalidPrivateKeyPassword = true
        return false
      }
    },
    async process () {
      if (!this.currentwallet) {
        this.ErrorMessage = 'Account not set'
        return
      }
      if (this.transactionObject.multi) {
        this.processMultipleTransaction()
      }
      this.ErrorMessage = null
      this.transStatus = null

      if (this.currentwallet.privateKeyEncrypted && !this.privateKey.success) {
        this.decryptPrivateKey = true
        return
      }

      let transactionObject = this.transactionObject

      try {
        this.spinnervisible = true

        let result = await eos.transact(transactionObject, { keyProvider: this.privateKey.key })

        this.transactionLink = process.env[this.$store.state.settings.network].EOS_TRANSACTION_EXPLORER + result.transaction_id
        this.spinnervisible = false
        this.transStatus = 'Sent Successfully'
        this.SuccessMessage = 'Sent Successfully'
        this.$emit('setSuccessData', true)
      } catch (error) {
        if (error.toString().includes('is greater than the maximum billable CPU time for the transaction')) {
          this.freeCPU = true
          this.spinnervisible = true
          let account = this.currentwallet
          account.privateKey = this.privateKey.key
          this.sendFreeCPUTransaction(transactionObject.actions, account).then(result => {
            if (result.success) {
              this.transactionLink = result.message
              this.SuccessMessage = 'Sent Successfully'
              this.transStatus = !result.status ? 'Sent Successfully' : result.status
              this.$emit('setSuccessData', true)
            } else {
              this.ErrorMessage = result.message
            }
            this.spinnervisible = false
          }).catch((error) => {
            this.spinnervisible = true
            this.ErrorMessage = error.message
            this.$emit('setSuccessData', false)
          })
        } else {
          this.ErrorMessage = error.message
          this.spinnervisible = false
          this.$emit('setSuccessData', true)
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

.action {
    border: 1px solid;
    border-radius: 12px;
}
.preFormatted {

    font-family: monospace;
    white-space: pre;
}
</style>

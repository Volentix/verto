<template>
  <q-page  class="flex flex-center text-white bg-black">
    <q-card style="width:55rem; max-width: 100%;" flat class="bg-black">
      <q-card-section class="text-center text-white">
        <div class="text-center text-weight-bold text-uppercase q-pa-lg row">
          <div class="col-auto">
            <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('walletmanager/index')">
              <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
            </q-icon>
          </div>
          <div class="col text-center">
            <big class="titillium q-pa-xs">{{ $t('WalletManager.header') }}</big>
          </div>
          <div class="col-auto">
            <q-icon class="float-right" @click.native="createWallet" name="add_circle_outline" color="green" size="2.5rem">
              <q-tooltip>{{ $t('CreateVertoPassword.createwallet') }}</q-tooltip>
            </q-icon>
          </div>
        </div>
        <q-table
          class="bg-black"
          :dark='dark'
          :data="tableData"
          :columns="columns"
          row-key="key"
        >
          <q-tr  :id="props.row.id" slot="body" slot-scope="props" :props="props" class="cursor-pointer">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              <div v-if="col.name === 'name'" class="text-center text-uppercase text-white q-pa-lg">
                <div @click="changeCurrentWallet(props.row)" >
                  <span class=" text-h6">
                  &nbsp;&nbsp;{{ col.value }}
                  </span>
                </div>
              </div>
              <div v-if="col.name === 'type'" class="text-center text-white">
                <div v-if="col.value === 'eos'">
                  <img
                    src="statics/icon.png"
                    style="max-width:45px;"
                  >
                </div>
                <div v-else>
                  <img
                    src="statics/vtx.png"
                    style="max-width:30px;"
                  />
                </div>
              </div>
              <div v-if="col.name === 'default'" class="text-left">
                <div v-if="col.value" class="q-pa-lg">
                  <q-checkbox v-model="props.row.defaultKey" color="green" disable>

                  </q-checkbox>
                </div>
                <div v-else class="q-pa-lg">
                  <q-checkbox v-model="props.row.defaultKey" color="blue" @input="changeTheDefaultWallet(props.row)" />
                </div>
              </div>
              <div
                v-if="col.name === 'privateKey'"
                class="text-right text-white"
              >
                <div v-show="props.row.privateKeyEncrypted" @click="removePrivateKey(props.row)">
                  <q-icon color="red" name="remove_circle_outline" size="2.0rem">
                    <q-tooltip>Remove Private Key</q-tooltip>
                  </q-icon>
                </div>
                <div v-show="!props.row.privateKeyEncrypted" @click="addPrivateKey(props.row)">
                  <q-icon color="green" name="add_circle_outline" size="2.0rem">
                    <q-tooltip>Add Private Key</q-tooltip>
                  </q-icon>
                </div>
              </div>
              <div
                v-if="col.name === 'associations' && props.row.type !== 'eos'"
                class="text-right text-white"
                @click="getAccountNames(props.row)"
              >
                  <q-icon name="update" size="2.2rem" color='yellow'>
                    <q-tooltip>{{ $t('WalletManager.upgrade') }}</q-tooltip>
                  </q-icon>
              </div>
              <div
                v-if="col.name === 'associations'"
                class="text-right text-white"
                @click="goToAssociations(props.row)"
              >
                  <q-icon name="link" size="2.2rem">
                    <q-tooltip>{{ $t('WalletManager.tools') }}</q-tooltip>
                  </q-icon>
              </div>
              <div v-if="col.name === 'delete'" class="text-center text-white" @click="$router.push({name:'delete-wallet', params: {wallet: props.row }})">
                <div v-if="!props.row.defaultKey && props.row.name !== $store.state.currentwallet.wallet.name" class="q-pa-lg">
                  <q-icon name="delete_forever" size="2rem" color='red'/>
                </div>
              </div>
            </q-td>
          </q-tr>
        </q-table>
      </q-card-section>
    </q-card>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 400px; border:1px solid #FFF;">
        <q-card-section>
          <div class="text-h6 text-center">Upgrade and attach an EOS account to this wallet</div>
        </q-card-section>
        <q-card-section class="text-white bg-black">
          <div v-show="!Array.isArray(accountNames) || !accountNames.length">

            <q-card-section class="text-center">
              <div class="text-h6">There are no EOS accounts attached to this public key. You will need to create or use an existing EOS account and (skip generate new keys & step 3)</div>
              <q-btn outline rounded @click="goToLink()" label="Change the Active Key Permissions with Bloks.io" />
            </q-card-section>

          </div>
          <div v-show="Array.isArray(accountNames) && accountNames.length">
            <q-stepper
              dark
              flat
              v-model="step"
              vertical
              done-color="green"
              active-color="green"
              ref="stepper"
              color="primary"
              animated
              class="bg-black"
            >
              <q-step
                :name="1"
                title="Select account name"
                icon="settings"
                :done="step > 1"
              >
                <q-select
                  label="Select an EOS Account Name in the list"
                  separator
                  filled
                  dark
                  v-model="accountName"
                  :options="accountNames"
                  :error="accountNameError"
                  error-message='This account name is already in your wallet, upgrade the other one instead if you have not done so yet.'
                  :loading="!accountNames"
                  @input="validAccountName"
                />
              </q-step>
              <q-step
                :name="2"
                title="Validate Private Key"
                icon="assignment"
                :disable="noPrivateKey"
                :done="step > 2"
              >
                <q-input
                  v-model="privateKeyPassword"
                  dark
                  color="green"
                  label="Private Key Password"
                  debounce="500"
                  :error="invalidPrivateKeyPassword"
                  error-message="The password is incorrect"
                  @input="checkPrivateKeyPassword"
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
              </q-step>
              <q-step
                :name="3"
                title="Confirm Verto Password"
                icon="add_comment"
                :done="step > 3"
              >
                <q-input
                  v-model="vertoPassword"
                  dark
                  color="green"
                  label="Verto Password"
                  debounce="500"
                  :error="vertoPasswordWrong"
                  error-message="The password is incorrect"
                  @input="checkVertoPassword"
                  @keyup.enter="upgradeAccountName(); prompt=false"
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
              </q-step>
            </q-stepper>
          </div>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" @click="cancelAccountName()" v-close-popup />
            <q-btn flat label="Ok" :disable="!vertoPassordValid" @click="upgradeAccountName()" v-close-popup />
          </q-card-actions>
          </q-card-section>
        </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import sjcl from 'sjcl'
import { openURL } from 'quasar'
import { userError } from '@/util/errorHandler'
import EosWrapper from '@/util/EosWrapper'
const eos = new EosWrapper()

export default {
  // name: 'ComponentName',
  data () {
    return {
      dark: true,
      step: 1,
      isPwd: true,
      prompt: false,
      vertoPassword: null,
      vertoPasswordWrong: false,
      vertoPassordValid: false,
      privateKeyPassword: '',
      privateKeyFromFile: '',
      invalidPrivateKeyPassword: false,
      accountName: '',
      accountNames: null,
      accountNameError: false,
      accountNameErrorMsg: '',
      currentWallet: null,
      columns: [
        {
          name: 'default',
          label: 'Default',
          required: false,
          align: 'center',
          field: 'defaultKey',
          sortable: false,
          classes: 'text-h6'
        }, {
          name: 'type',
          label: 'Type',
          required: true,
          align: 'center',
          field: 'type',
          sortable: false,
          classes: 'my-class'
        }, {
          name: 'name',
          label: 'Wallet Name',
          required: true,
          align: 'center',
          field: 'name',
          sortable: true,
          classes: 'my-class'
        }, {
          name: 'privateKey',
          label: 'Private Key',
          required: false,
          align: 'center',
          sortable: false,
          classes: 'text-right text-h3'
        }, {
          name: 'associations',
          label: 'Tools',
          required: false,
          align: 'center',
          sortable: false,
          classes: 'text-right text-h3'
        }, {
          name: 'delete',
          label: 'Delete',
          required: false,
          align: 'center',
          sortable: false,
          classes: 'my-class'
        }
      ],
      tableData: []
    }
  },
  mounted () {
    if (this.$q.platform.is.electron) {
      let command = 'networksetup -setairportpower airport on'
      let exec = require('child_process').exec
      exec(command)
    }
    this.loadTableData()
  },
  computed: {
    noPrivateKey () {
      if (typeof this.currentWallet !== 'undefined' && this.currentWallet !== null && this.currentWallet.hasOwnProperty('privateKeyEncrypted') && this.currentWallet.privateKeyEncrypted) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    changeTheDefaultWallet (row) {
      row.defaultKey = false
      this.$router.push({ name: 'change-default', params: { wallet: row } })
    },
    addPrivateKey (row) {
      this.$configManager.updateCurrentWallet(row)
      this.$router.push({ name: 'add-private-key' })
    },
    removePrivateKey (row) {
      this.$configManager.updateCurrentWallet(row)
      this.$router.push({ name: 'remove-private-key' })
    },
    goToAssociations (row) {
      this.$configManager.updateCurrentWallet(row)
      this.$router.push('associations')
    },
    goToLink () {
      openURL('https://medium.com/@eosnationbp/change-the-active-key-permissions-with-bloks-io-eos-nation-tutorial-682efb0a00d3')
    },
    validAccountName () {
      if (this.$store.state.currentwallet.config.keys.some((key) => key.name.toLowerCase() === this.accountName.label.toLowerCase())) {
        this.accountNameError = true
      } else {
        this.accountNameError = false
        this.noPrivateKey ? this.step = 3 : this.step = 2
      }
    },
    upgradeAccountName () {
      this.currentWallet.type = 'eos'
      this.currentWallet.name = this.accountName.value
      this.$configManager.updateCurrentWallet(this.currentWallet)
      this.$configManager.updateConfig(this.vertoPassword, this.$store.state.currentwallet.config)
      // reset form variables
      this.vertoPassword = null
      this.privateKeyPassword = null
      this.accountName = null
      this.step = 1
    },
    cancelAccountName () {
      // reset form variables
      this.vertoPassword = null
      this.privateKeyPassword = null
      this.accountName = null
      this.step = 1
    },
    getAccountNames (row) {
      this.currentWallet = row
      const self = this
      eos.getAccountNamesFromPubKeyP(row.key)
        .then(function (result) {
          self.accountNames = []
          for (var i = 0; i < result.account_names.length; i++) {
            self.accountNames.push({ label: result.account_names[i], value: result.account_names[i] })
          }
          self.walletName = result.account_names[0]
        }).catch((err) => {
          userError('There was a problem getting account names', err)
        })
      this.prompt = true
    },
    async loadTableData () {
      this.tableData = this.$store.state.currentwallet.config.keys
    },
    changeCurrentWallet: function (row) {
      this.$configManager.updateCurrentWallet(row)
      this.$router.push({ path: '/wallet' })
    },
    createWallet: function () {
      this.$router.push({ name: 'keep-your-key-safe', params: { isCancelButtonActive: true } })
    },
    copyToClipboard (key) {
      this.$clipboardWrite(key)
      this.$q.notify({
        message: this.$t('DisplayKey.copied'),
        timeout: 2000,
        icon: 'check',
        textColor: 'black',
        type: 'warning',
        position: 'top'
      })
    },
    checkPrivateKeyPassword () {
      let privateKeyEncrypted = ''
      if (this.currentWallet.privateKeyEncrypted.constructor === String) {
        // In case it was previously useleslly stringified
        privateKeyEncrypted = this.currentWallet.privateKeyEncrypted.replace(/\\"/g, '"')
      } else if (this.currentWallet.privateKeyEncrypted.constructor === Object) {
        privateKeyEncrypted = JSON.stringify(this.currentWallet.privateKeyEncrypted)
      }
      const result = this.$configManager.decryptPrivateKey(this.privateKeyPassword, privateKeyEncrypted)
      if (result.success) {
        // This block is to support an old file format of keys found in the wild
        if (result.key.indexOf('privatekey') !== -1) {
          const key = JSON.parse(result.key)
          this.currentWallet.privateKeyEncrypted = JSON.parse(sjcl.encrypt(this.privateKeyPassword, '"' + key.privatekey + '"'))
        }
        this.invalidPrivateKeyPassword = false
        this.step = 3
      } else {
        this.invalidPrivateKeyPassword = true
      }
    },
    checkVertoPassword () {
      this.vertoPasswordWrong = false
      this.vertoPassordValid = false
      if (this.vertoPassword.length > 7) {
        try {
          const self = this
          this.$configManager.getConfig(this.vertoPassword)
            .then(function (result) {
              self.vertoPasswordWrong = false
              self.vertoPassordValid = true
            }).catch(function (err) {
              self.vertoPasswordWrong = true
              userError(err)
            })
        } catch (err) {
          self.vertoPasswordWrong = true
          userError(err)
        }
      }
    }
  }
}
</script>

<style scoped>
img {
  width: 4rem;
}
.key-decrypter-modal >>> .q-if-has-label,
.key-decrypter-modal >>> .q-if-has-label .q-popup--skip > div,
.key-decrypter-modal >>> .q-if-has-label .col.q-input-target,
.key-decrypter-modal >>> .col.q-input-target > div {
  max-width: 100% !important;
}
.manager-button {
  cursor: pointer;
  max-width: 30vw;
}
.manager-button .q-card {
  height: 9.6rem;
}
.modal-window-pop img{
  width: 1.3rem;
}
.key-result {
  border: 1px solid gray;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  min-height: 2.5rem;
  max-width: 90vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.q-table-container {
  max-width: 90vw;
  padding: 1rem;
}
.key-input {
  border: 1px solid yellow;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  min-height: 2.5rem;
  max-width: 90vw;
}
.key-input div{
  max-width: 70vw;
  white-space: nowrap;
}
.key-input .user-keys {
  /* max-width: 50%; */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.key-input img {
  width: 1.2rem;
  cursor: pointer;
}
</style>

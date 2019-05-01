<template>
  <q-page  class="flex flex-center text-white bg-black">
    <q-card style="width:55rem;" flat class="bg-black">
      <q-card-section class="text-center text-white">
        <div class="text-center text-weight-bold text-uppercase q-pa-lg">
          <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('walletmanager/index')">
            <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
          </q-icon>
          <big class="titillium q-pa-xl">{{ $t('WalletManager.header') }}</big>
          <q-icon class="float-right" @click.native="createWallet" name="add_circle_outline" color="green" size="2.5rem">
            <q-tooltip>{{ $t('CreateVertoPassword.createwallet') }}</q-tooltip>
          </q-icon>
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
                    src="@/assets/img/currencies/eosioWalletManager.png"
                    style="max-width:50px;"
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
  </q-page >
</template>

<script>

export default {
  // name: 'ComponentName',
  data () {
    return {
      dark: true,
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

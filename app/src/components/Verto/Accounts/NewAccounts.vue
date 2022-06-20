<template>
  <div class="q-pa-md" :class="$store.state.settings.lightMode === 'true' ? 'text-white mobile-card':'bg-white text-black'">
    <div  v-if="!addToVerto">
      <div class="text-h6">
        New {{ chain.label }} account
        <q-btn flat @click="create(index)" icon="sync" />
      </div>
      Generated from your menmonic
      <div class="q-py-md cursor-pointer" @click="copyToClipboard(publicKey)">
        <span class="text-bold">Public Key</span>
        <div>
          {{ getKeyFormat(publicKey, 15) }}
          <q-btn
            :loading="!publicKey"
            class="q-ml-md"
            size="sm"
            :icon="publicKey ? 'content_copy' : ''"
            flat
            dense
            :label="publicKey ? 'Copy' : 'Generating'"
          />
        </div>
      </div>

      <div class="q-pb-md cursor-pointer" @click="copyToClipboard(privateKey)">
        <span class="text-bold">Private Key</span>
        <div>
          {{ getKeyFormat(privateKey, 15) }}
          <q-btn
            :loading="!publicKey"
            class="q-ml-md"
            size="sm"
            :icon="publicKey ? 'content_copy' : ''"
            flat
            dense
            :label="publicKey ? 'Copy' : 'Generating'"
          />
        </div>
      </div>
      Click here to add this account in Verto<br />
      <q-btn

        @click="addToVerto = true"
        outline
        rounded
        label="Add to Verto"
        class="q-mt-sm"
      />
    </div>
    <div v-else>
    <p>Adding Wallet to Verto...</p>
    <q-input
    counter
    outlined
    autocomplete="off"
    @input="nameAlreadyUsed = false"
    v-model="accountName"
    :dark="$store.state.settings.lightMode === 'true'"
    :light="$store.state.settings.lightMode === 'false'"
    color="green"
    label="Enter wallet Name"
    :error="nameAlreadyUsed"
    error-message="Wallet name already used"
    />

    <q-input
    v-model="vertoPassword"
    :dark="$store.state.settings.lightMode === 'true'"
    :light="$store.state.settings.lightMode === 'false'"
    color="green"
    outlined
    label="Enter Verto Password"
    debounce="500"
    autocomplete="off"
    :class="{'q-pt-sm':accountNameError}"
    :error="vertoPasswordWrong"
    error-message="The password is incorrect"
    @input="checkVertoPassword"
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
    <q-btn
        @click="addAcount()"
        :disable="accountName.trim().length == 0 || (!vertoPassword ||  vertoPassword.trim().length == 0) || vertoPasswordWrong"
        outline
        rounded
        label="Add to Verto"
        class="q-mt-sm"
      />
    </div>
  </div>
</template>
<script>
import Formatter from '@/mixins/Formatter'
import HD from '@/util/hdwallet'
import initWallet from '@/util/_Wallets2Tokens'
export default {
  props: ['chain'],
  mixins: [Formatter],
  data () {
    return {
      publicKey: null,
      privateKey: null,
      vertoPassword: '',
      vertoPasswordWrong: false,
      accountNameError: false,
      vertoPassordValid: false,
      indexAccount: 0,
      isPwd: true,
      addToVerto: false,
      nameAlreadyUsed: '',
      passwordInvalid: '',
      currentAccount: {},
      accountName: ''
    }
  },
  created () {
    this.create()
  },
  methods: {
    checkVertoPassword () {
      this.vertoPasswordWrong = false
      this.vertoPassordValid = false

      try {
        const self = this
        this.$configManager
          .getConfig(this.vertoPassword)
          .then(function (result) {
            self.vertoPasswordWrong = false
            self.vertoPassordValid = true
          })
          .catch(function (err) {
            self.vertoPasswordWrong = true
            self.error = err
          })
      } catch (err) {
        self.vertoPasswordWrong = true
        self.error = err
      }
    },
    create (setIndex = false) {
      this.publicKey = null
      this.privateKey = null
      if (!setIndex) {
        let mnemonicAccounts = this.setChains().find(a => a.chain === this.chain.chain).accounts.filter(
          (o) =>

            o.origin === 'mnemonic'

        )
        this.indexAccount = mnemonicAccounts.length
      }
      const createAddress = (index) => {
        return HD.Wallet(this.chain.isEvm ? 'eth' : this.chain.chain, index)
      }

      let fetch = true
      setTimeout(async () => {
        while (fetch) {
          let keys = await createAddress(this.indexAccount)
          fetch = this.$store.state.wallets.tokens.find(
            (o) => o.key.toLowerCase() === keys.publicKey.toLowerCase()
          )
          if (!fetch) {
            this.publicKey = keys.publicKey
            this.privateKey = keys.privateKey
            fetch = false
          }
          this.indexAccount++
          // return self.$configManager.saveWalletAndKey(name.label, self.vertoPassword, null, keys.publicKey, keys.privateKey, name.value, 'mnemonic')
        }
      }, 100)
    },
    async addAcount () {
      let origin = 'mnemonic'

      this.currentAccount = {}
      this.currentAccount.privateKey = this.privatekey
      this.currentAccount.key = this.publicKey
      this.currentAccount.privateKey = this.privateKey
      this.currentAccount.chain = this.chain.chain
      this.currentAccount.type = this.chain.chain
      this.currentAccount.name = this.accountName
      this.currentAccount.icon = this.chain.icon
      try {
        const result = await this.$configManager.saveWalletAndKey(
          this.currentAccount.name,
          this.vertoPassword,
          this.privateKeyPassword,
          this.currentAccount.key,
          this.currentAccount.privateKey,
          this.currentAccount.chain,
          origin
        )
        if (result && result.success) {
          this.walletName = ''
          this.vertoPassword = ''
          this.publicKey = ''
          this.privateKey = ''
          this.$q.notify({ color: 'positive', message: 'Wallet created' })
          this.$router.push('wallet')
        } else {
          if (result && result.message === 'name_already_used') {
            this.nameAlreadyUsed = true
          } else {
            this.passwordInvalid = true
          }
        }
        this.vertoPassword = null

        initWallet()
      } catch (err) {
        console.log(err, 'err')
        this.vertoPasswordWrong = true
        this.error = err
      }
    }
  }
}
</script>

<template>
    <q-dialog v-model="alert">
      <q-card >
        <q-card-section>
          <div class="text-body1 text-bold"><q-icon :name="'img:'+chain.icon" class="q-pr-sm" />{{chain.label}} accounts: {{(field == 'key' ? 'Public keys' : (field == 'privateKey' ? 'Private keys' : '' )) }}</div>
        </q-card-section>
        <q-scroll-area style="height: 300px; ">
        <q-card-section class="q-pt-none" v-for="(account , index) in chain.accounts" :key="index">
         <span class="q-pb-sm">{{account.name}}</span><br/>
         <div class="text-body1 q-pt-md copy-key cursor-pointer" @click="copyToClipboard(account[field],'Copied')"  v-if="account[field] || showPrivateKeys[index]" >
               {{getKeyFormat(account[field], 20)}} <q-icon name="o_file_copy"  />
          </div>
           <div class="text-body1 q-pt-md copy-key cursor-pointer" v-if="!account.privateKeyEncrypted && field == 'privateKey' &&  !showPrivateKeys[index] " >
               <q-input
                  dense
                        v-model="privateKeyPassword[index]"
                        :dark="$store.state.settings.lightMode === 'true'" :light="$store.state.settings.lightMode === 'false'"
                        rounded
                        outlined
                        class="full-width"
                        color="green"
                        label="Private Key Password"
                        @input="checkPrivateKeyPassword(privateKeyPassword[index], index)"
                        debounce="500"
                        @keyup.enter="showKeys(index)"
                        :type="showPwd[index] ? 'password' : 'text'"
                        :error="invalidPrivateKeyPassword[index]"
                        error-message="The private key password is invalid"
                    >
                        <template v-slot:append>
                        <q-btn flat :disable="!decryptedKeys[index]" @click="showKeys(index)" icon="send" rounded   dense />
                        <q-icon  v-if="false" :name="showPwd[index] ? 'visibility' : 'visibility_off'" class="cursor-pointer" @click="$set(showPwd, index, !showPwd[index])" />
                        </template>

                    </q-input>

          </div>

        </q-card-section>
 </q-scroll-area>
      </q-card>
    </q-dialog>
</template>
<script>
import Formatter from '@/mixins/Formatter'
export default {
  props: ['chain', 'field'],
  mixins: [Formatter],
  data () {
    return {
      alert: true,
      showPrivateKeys: {

      },
      showPwd: {

      },
      decryptedKeys: {

      },
      privateKeyPassword: {

      },
      invalidPrivateKeyPassword: {

      }
    }
  },
  methods: {
    showKeys (index) {
      this.checkPrivateKeyPassword()
      if (this.decryptedKeys[index]) {
        this.$set(this.showPrivateKeys, index, true)
      }
    },
    checkPrivateKeyPassword (account, index) {
      const privateKeyEncrypted = JSON.stringify(account.privateKeyEncrypted)
      let privateKey = this.$configManager.decryptPrivateKey(this.privateKeyPassword[index], privateKeyEncrypted)

      if (privateKey.success) {
        this.$set(this.invalidPrivateKeyPassword, index, false)
        this.$set(this.decryptedKeys, index, privateKey.key)
      } else {
        this.$set(this.invalidPrivateKeyPassword, index, true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.copy-key {
    background: #f2f2f2;
    padding: 10px;
    border-radius: 5px;
    font-size: 13px;
  }
</style>

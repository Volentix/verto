<template>
  <q-dialog  :dark="$store.state.settings.lightMode === 'true'" v-model="alert">
    <q-card :class="{'min-size': !$q.platform.is.mobile}" :dark="$store.state.settings.lightMode === 'true'" style="width: 100%;max-width: 96%">
      <q-card-section>
        <!-- Public keys removed -->
        <div class="text-body1 text-bold">
          <q-icon :name="'img:'+chain.icon" class="q-pr-sm" />
          {{chain.label}} accounts {{(field == 'key' ? '' : (field == 'privateKey' ? 'Private keys' : '' )) }}
        </div>
             <q-btn v-close-popup class="close_qr_code_popup absolute-top-right q-pa-md" dense flat icon="close" />
      </q-card-section>
      <q-scroll-area style="height: 45vh;">
        <q-card-section  class="q-pt-none" v-for="(account , index) in chain.accounts" :key="index">
          <div class="text-body1 q-pt-md flex justify-between items-center copy-key" v-if="account[field] || (showPrivateKeys[index] && decryptedKeys[index])">
            <div class="flex justify-between" @click="copyToClipboard(account[field])">
              <div class="flex">
                <span class="identicon" v-html="avatar(account.name)" />
                <span class="account_name text-bold q-ml-sm q-mr-sm flex flex-center text-center" >{{account.name}}</span>
              </div>
              <span class="flex flex-center text-cur" >
                {{getKeyFormat(decryptedKeys[index] ? decryptedKeys[index] : account[field], 4)}}
              </span>
            </div>
            <div class="flex">
              <q-btn dense flat color="white" :text-color="$store.state.settings.lightMode === 'true' ? 'white':'black'" icon="o_file_copy" @click="copyToClipboard(account[field])" />
              <q-btn dense v-if="account[field] || showPrivateKeys[index] || decryptedKeys[index]" @click="$set(showQr,account.name.split(' ')[0],!showQr[account.name.split(' ')[0]])" flat icon="img:https://image.flaticon.com/icons/png/512/107/107072.png" />
              <div class="qr_code_wrapper column justify-center items-center" :class="{ 'min-size': !$q.platform.is.mobile, 'show' : (account[field] || showPrivateKeys[index]) && showQr[account.name.split(' ')[0]] }">
                <div class="flex flex-center account_name_text">{{account.name}}</div>
                <q-btn class="close_qr_code_popup" dense v-if="account[field] || showPrivateKeys[index] || decryptedKeys[index]" @click="$set(showQr,account.name.split(' ')[0],!showQr[account.name.split(' ')[0]])" flat icon="close" />
                <qrcode v-if="(account[field] || showPrivateKeys[index]) && showQr[account.name.split(' ')[0]]" dark :value="decryptedKeys[index] ? decryptedKeys[index] : account[field]" :size="200" :options="{size: 100}"></qrcode>
                <div class="flex flex-center scan_text q-pt-md" style="bottom:0px">Scan the qr code</div>
              </div>
            </div>
          </div>
          <div class="text-body1 q-pt-md copy-key cursor-pointer" v-if="account.privateKeyEncrypted && field == 'privateKey' &&  !showPrivateKeys[index] " >
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
import Vue from 'vue'
import { toSvg } from 'jdenticon'
import VueQrcode from '@chenfengyuan/vue-qrcode'
Vue.component(VueQrcode.name, VueQrcode)
import Formatter from '@/mixins/Formatter'
export default {
  props: ['chain', 'field'],
  mixins: [Formatter],
  data () {
    return {
      alert: true,
      showQr: {

      },
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
    avatar (name) {
      return toSvg(name, 30)
    },
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
  .q-icon{
    width: 30px;
    height: 30px;
  }
  .identicon{
    overflow: hidden;
    background: #FFF;
    width: 30px;
    border-radius: 10px;
    height: 30px;
    outline: 1px solid #64b5f6;
    svg{
    }
  }
  .qr_code_wrapper{
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
    max-width: 80vw;
    height: 100vh;
    max-height: calc(50vh);
    z-index: 9;
    background-color: #fff;
    visibility: hidden;
    .close_qr_code_popup{
      position: absolute;
      right: 10px;
      top: 0px;
    }
    canvas{
      transform: scale3d(1.5,1.5,1.5);
    }
    &.show{
      visibility: visible;
    }
    .account_name_text{
      position: absolute;
      top: 10px;
    }
    .scan_text{
      position: absolute;
      bottom: 10px;
    }
  }
  .q-dialog .q-card.q-card--dark.q-dark{
    .copy-key {
      background: #0e1829;
    }
    .identicon{
      background: #0e1829;
    }
    .qr_code_wrapper{
      background-color: #050a10;
    }
  }
  .min-size {
     width:400px  !important
  }
</style>

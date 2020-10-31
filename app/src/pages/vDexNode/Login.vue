/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
<template>
  <q-layout>
    <div class="titlebar"></div>
    <q-page-container>
      <q-page class="bg-vdark text-vgrey titilium">
        <div class="fixed-top-right q-pa-xl">
          <q-btn flat round color="vgrey" class="q-mx-xs" icon="fas fa-sliders-h" to="/settings" />
          <q-btn flat round color="vgrey" class="q-mx-xs" icon="fas fa-link" @click="$utils.openExternal('https://volentix.io/')" />
        </div>
        <div class="fixed-top-left row q-pa-xl">
          <img src="@/statics/icons/logo.png" style="height: 32px; max-width: 32px" />
          <div class="text-weight-bolder text-uppercase q-px-sm text-h6">Volentix Node</div>
        </div>
        <div class="row window-height items-center q-pa-xl">
          <div class="col-5 text-center q-pa-xl">
            <img src="@/statics/icons/icon-512x512.png" style="height: 250px; max-width: 250px" />
            <div class="text-h5 text-vgrey">
              <span class="text-weight-bolder">Volentix Node</span> Control Panel
              <q-badge color="vgold" class text-color="vdark" align="top" transparent>{{ version }}</q-badge>
            </div>
            <div class="q-mt-lg" v-show="progress > 0 && progress < 1">
              <q-linear-progress :value="progress" rounded color="vgold" track-color="vdarkgrey" style="height: 20px" />
              <div class="text-subtitle1 text-vgrey">Update downloading: {{ Math.round(progress*100) }} %</div>
            </div>
            <q-form @submit="login()">
              <ual-trigger :options="opts" @login="userCallback" />
              <pre style="text-align: left; width: 400px; margin: 30px auto; background: #eee; padding: 30px;"><code>UserInfo:{{stringify(user)}}</code></pre>
            </q-form>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
/* eslint-disable no-console */
const ipcRenderer = require('electron').ipcRenderer
import { Scatter } from 'ual-scatter'
import ScatterJS from '@scatterjs/core'
import ScatterEOS from '@scatterjs/eosjs2'
import { Api, JsonRpc, RpcError } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { ualTrigger } from 'ual-vuejs-renderer'
import Vue from 'vue'
import { Dialog } from 'quasar'
import { EosRPC, EosAPI } from '@/util/EosWrapper'
import { userError } from '@/util/errorHandler'
import { userResult } from '@/util/resultHandler'
import * as utils from '@/util/utils'
import path from 'path'
import { config } from 'bluebird-lst'
import store from '@/store'
import router from '@/router'
import EosApi from 'eosjs-api'
// EosApi = require('eosjs-api')
ScatterJS.plugins(new ScatterEOS())
export default {
  name: 'index',
  components: {
    ualTrigger
  },
  data: function () {
    return {
      privateKey: '',
      isPwd: true,
      version: '',
      progress: 0,
      user: {
        name: '',
        chainId: ''
      },
      accountName: null,
      accountBalance: 0,
      opts: {
        name: 'Connect To Wallet',
        nets: [{
          chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
          rpcEndpoints: [{
            protocol: 'https',
            host: 'eos.greymass.com',
            port: Number(443)
          }]
        }],
        authenticators: [
          { authenticator: Scatter, netChainIds: ['aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'], options: { appName: 'vDexNode-GUI' } }
        ]
      }
    }
  },
  mounted () {
    this.version = this.$utils.getVersion()
    // this.$refs.input.focus()
    this.updater()
  },
  methods: {
    stringify (item) {
      return JSON.stringify(item, null, 2)
    },
    async userCallback (users) {
      const loggedInUser = users[0]
      this.user.name = await loggedInUser.getAccountName()
      this.user.chainId = await loggedInUser.getChainId()
      this.name = await loggedInUser.getAccountName()
      this.chainId = await loggedInUser.getChainId()
      this.publicKey = loggedInUser.keys[0]
      this.network = this.opts.nets
      this.user.publicKey = loggedInUser.keys[0]
      this.user.privateKey = loggedInUser.keys[1]
      this.$store.commit('setAccountName', this.user.name)
      this.$store.commit('setPublicKey', this.publicKey)
      const rpc = new EosRPC()
      Vue.prototype.$rpc = rpc
      if (this.name) {
        router.push({ path: '/vdexnode' })
        this.$store.commit('setLoggedIn')
      }
      this.identity = await loggedInUser.scatter.getIdentity()
      const eos = new EosAPI(this.network, Vue.prototype.$rpc)
      Vue.prototype.$eos = eos
    },
    updater () {
      // TODO: Update
      ipcRenderer.on('error', (event, data) => {
        this.$userError(data, 'Auto updater')
      })
      ipcRenderer.on('notification', (event, data) => {
        this.$userResult(data)
      })
      ipcRenderer.on('message', (event, data) => {
        this.progress = data / 100
      })
    },
    login () {
      this.$vDexNodeConfigManager.login()
    }
  }
}
</script>

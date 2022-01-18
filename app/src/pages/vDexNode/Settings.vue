<template>
<q-layout>
    <div class="titlebar"></div>
    <q-page-container>
        <q-page class="bg-vblack q-pa-lg" :class="blur ? 'blur' : ''">
            <!-- TopBar -->
            <div class="row bg-vdark items-center q-mb-lg titilium">
                <div class="col q-py-sm q-px-md">
                    <div class="text-h6 text-uppercase text-vgrey titilium">
                        <span class="text-weight-bolder">vdexnode</span> dashboard
                        <q-badge color="vgold" class="q-mx-sm" text-color="vblack" align="top" transparent>{{ version }}</q-badge>
                    </div>
                </div>
                <div class="col-5 q-py-sm q-px-sm">
                    <div class="row justify-end">
                        <q-btn outline rounded color="vgold" class="q-mx-xs" label="Home" to="/" />
                        <q-btn v-if="loggedIn" outline rounded color="vgold" class="q-mx-xs" label="Logout" @click="$configManager.logout()" />
                    </div>
                </div>
            </div>
            <!-- Settings -->
            <div class="row q-col-gutter-x-lg q-mb-lg titilium">
                <div class="col-5">
                    <q-banner dense class="text-vgrey bg-vdark q-pa-md">
                        <div class="text-subtitle2 text-uppercase">Configuration</div>
                    </q-banner>
                    <q-list dark dense separator class="bg-vdark text-vgrey q-px-md">
                        <q-item>
                            <q-item-section>
                                <q-item-label>EOS endpoint</q-item-label>
                                <q-item-label caption class="text-vgrey text-uppercase">
                                    Status:
                                    <span class="text-weight-bolder" :class="eosEndpointStatus ? 'text-vgreen' : 'text-red'">{{ eosEndpointStatus ? 'ok' : 'fail' }}</span>
                                </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-item-label class="code">{{ $configStore.get('eos_endpoint') }}</q-item-label>
                            </q-item-section>
                            <q-item-section avatar>
                                <q-btn rounded outline size="sm" dense class="q-px-md" label="Edit" @click="editEosEndpointDialog = true" />
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>
                                <q-item-label>Node API gateway</q-item-label>
                                <q-item-label caption class="text-vgrey text-uppercase">
                                    Status:
                                    <span class="text-weight-bolder" :class="nodeApiStatus ? 'text-vgreen' : 'text-red'">{{ nodeApiStatus ? 'ok' : 'fail' }}</span>
                                </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-item-label class="code">{{ $configStore.get('node_api') }}</q-item-label>
                            </q-item-section>
                            <q-item-section avatar>
                                <q-btn rounded outline size="sm" dense class="q-px-md" label="Edit" @click="editNodeApiDialog = true" />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
                <div class="col">
                    <q-banner dense class="text-vgrey bg-vdark q-pa-md">
                        <div class="text-subtitle2 text-uppercase">Stats</div>
                    </q-banner>
                    <q-list dark dense separator class="bg-vdark text-vgrey q-px-md">
                        <q-item>
                            <q-item-section>
                                <q-item-label>Config file path</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-item-label class="code">{{ $configStore.path }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>
                                <q-item-label>RPC endpoint in use</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-item-label class="code">{{ inUseRPC }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>
                                <q-item-label>EOS authority provider in use</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-item-label class="code">{{ inUseEOS }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>
                                <q-item-label>Vue version</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-item-label class="code">{{ vueVersion }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>
                                <q-item-label>Quasar version</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-item-label class="code">{{ $q.version }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>
                                <q-item-label>Get vDexNode option</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-item-label class="code">{{ $configStore.get('node_readme') }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
            </div>
            <!-- Edit eos endpoint dialog -->
            <q-dialog v-model="editEosEndpointDialog">
                <q-card square style="min-width: 50vw; max-width: 70vw;" class="bg-vdark text-vgrey">
                    <q-card-section>
                        <div class="text-h6">Edit EOS Endpoint</div>
                        <q-separator dark />
                    </q-card-section>
                    <q-card-section align="right">
                        <q-form @submit="updateEosEndpoint()">
                            <q-input dark dense clearable v-model="newEosEndpoint" counter color="vgrey" ref="input" @keyup.enter="updateEosEndpoint" label="New EOS Endpoint" />
                            <q-btn color="vgrey" :disabled="newEosEndpoint ? false: true" unelevated rounded outline class="q-mt-md" label="Continue" type="submit" v-close-popup />
                        </q-form>
                    </q-card-section>
                </q-card>
            </q-dialog>
            <!-- Edit node api dialog -->
            <q-dialog v-model="editNodeApiDialog">
                <q-card square style="min-width: 50vw; max-width: 70vw;" class="bg-vdark text-vgrey">
                    <q-card-section>
                        <div class="text-h6">Edit Node API</div>
                        <q-separator dark />
                    </q-card-section>
                    <q-card-section align="right">
                        <q-form @submit="updateNodeAPI()">
                            <q-input dark dense v-model="newNodeApi" counter color="vgrey" ref="input" @keyup.enter="updateNodeAPI" label="New Node API" />
                            <q-btn color="vgrey" :disabled="newNodeApi ? false: true" unelevated rounded outline class="q-mt-md" label="Continue" type="submit" v-close-popup />
                        </q-form>
                    </q-card-section>
                </q-card>
            </q-dialog>
        </q-page>
    </q-page-container>
</q-layout>
</template>

<script>
import Vue from 'vue'
import {
  EosRPC,
  EosAPI
} from '@/util/EosInterac'
//  const { app } = require('electron').remote

export default {
  data () {
    return {
      version: this.$utils.getVersion(),
      vueVersion: Vue.version,
      eosEndpointStatus: false,
      nodeApiStatus: false,
      editEosEndpointDialog: false,
      editNodeApiDialog: false,
      newNodeApi: '',
      newEosEndpoint: '',
      inUseRPC: this.$rpc.rpc.endpoint,
      inUseEOS: this.$eos.api.authorityProvider.endpoint
    }
  },
  computed: {
    blur: function () {
      return this.editNodeApiDialog || this.editEosEndpointDialog
    },
    loggedIn: function () {
      return this.$store.getters.isLoggedIn
    }
  },
  mounted () {
    this.checkNodeApiStatus()
    this.checkEosEndpointStatus()
    this.s1 = setInterval(() => {
      this.checkEosEndpointStatus()
      this.checkNodeApiStatus()
    }, 300000)
  },
  beforeDestroy () {
    clearInterval(this.s1)
  },
  methods: {
    checkEosEndpointStatus () {
      this.$utils.checkEosEndpoint(this.$configStore.get('eos_endpoint')).then(response => {
        this.eosEndpointStatus = response
      })
    },
    checkNodeApiStatus () {
      this.$utils.checkNodeApi(this.$configStore.get('node_api')).then(response => {
        this.nodeApiStatus = response
      })
    },
    updateNodeAPI () {
      // TODO: if the / in the end of the new api then remove it
      this.$configStore.set('node_api', this.newNodeApi)
      this.checkNodeApiStatus()
    },
    updateEosEndpoint () {
      // TODO: to config manager
      this.$configStore.set('eos_endpoint', this.newEosEndpoint)
      this.checkEosEndpointStatus()
      try {
        Vue.prototype.$rpc = new EosRPC()
        this.inUseRPC = this.$rpc.rpc.endpoint
      } catch (error) {
        this.$userError(error, 'RPC: Update EOS endpoint')
        throw error
      }
      try {
        Vue.prototype.$eos = new EosAPI(this.$rpc.rpc, this.$store.state.identity.privateKey)
        this.inUseEOS = this.$eos.api.authorityProvider.endpoint
      } catch (error) {
        this.$userError(error, 'API: Update EOS endpoint')
        throw error
      }
    }
  }
}
</script>

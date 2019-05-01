<template>
  <q-page class="flex flex-center text-white bg-black">
    <q-card class="q-pa-sm" flat>
      <q-card-title class=" text-center uppercase">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('settings/index')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium q-pa-xl">Settings</big>
      </q-card-title>
      <q-card-main class="text-center settings-border">
        <q-card-title>
          <big class="titillium uppercase">General</big>
        </q-card-title>
        <p>Version:
          <span class="q-title q-pa-lg">
            {{ version }}
          </span>
        </p>
        <p>Config Path:
          <span class="break-word q-title q-pa-lg">
            {{ configPath }}
          </span>
        </p>
        <p>Network:
          <q-btn-toggle
            v-model="network"
            glossy
            @input="setNetwork"
            :options="[
              {label: 'Main Net', value: 'mainnet'},
              {label: 'Test Net', value: 'testnet'}
            ]"
          />
        </p>
      </q-card-main>
      <br>
      <q-card-main class="text-left settings-border">
        <q-card-title class="text-weight-bold text-center">
          <big class="titillium uppercase">Credentials</big>
        </q-card-title>
        <div class='text-center'>
          <div class='q-pa-md'>
            <q-btn class='full-width'
              outline
              glossy
              dense @click.native="goChangePassword"
            >
              {{ $t('SettingsView.change_password') }}
            </q-btn>
          </div>
          <div class='q-pa-md'>
            <q-btn class='full-width'
              outline
              glossy
              dense
              @click.native="backupConfig"
            >
                {{ $t('SettingsView.backup_config') }}
              </q-btn>
          </div>
          <div class='q-pa-md'>
            <q-btn class='full-width'
              outline
              glossy
              dense
              @click.native="$router.push({name:'restore-wallet', params: {returnto: 'settings'}})"
            >
              {{ $t('SettingsView.restore_config') }}
            </q-btn>
          </div>
        </div>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<script>
import configManager from '@/util/ConfigManager'
import { version } from '../../../package.json'
let platformTools = require('../../util/platformTools')
if (platformTools.default) platformTools = platformTools.default

export default {
  data () {
    return {
      pword: '',
      minimizedModal: false,
      message: '',
      version: {},
      network: this.$store.state.settings.network,
      configPath: ''
    }
  },
  mounted () {
    this.version = version
    this.setupPlatformPath()
  },
  methods: {
    async setupPlatformPath () {
      this.configPath = await platformTools.filePath()
    },
    goChangePassword: function () {
      this.$router.push({path: '/change-password'})
    },
    setNetwork: function () {
      this.$store.dispatch('settings/toggleNetwork', this.network)
    },
    async backupConfig () {
      try {
        await configManager.backupConfig()
        if (this.$q.platform.is.android) {
          this.$q.notify({type: 'positive', message: 'Config Saved'})
        }
      } catch (e) {
        // TODO: Exception handling
      }
    }
  }
}
</script>
<style>
.settings-border {
  border-style: solid;
  border-width: thin;
}
.break-word {
  word-wrap: break-word;
}
</style>

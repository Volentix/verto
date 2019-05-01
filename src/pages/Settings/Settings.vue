<template>
  <q-page class="column flex-center text-white bg-black">
    <q-card class="q-pa-sm bg-black" flat style="max-width: 500px; width: 100%;">
      <q-card-section class=" text-center text-uppercase">
        <q-icon class="float-left" name="help_outline" size="2.5rem" color="white" @click.native="$documentationManger.openDocumentation('settings/index')">
          <q-tooltip>{{ $t('SettingsView.help') }}</q-tooltip>
        </q-icon>
        <big class="titillium">Settings</big>
      </q-card-section>
    </q-card>
    <q-card class="q-pa-sm bg-black" flat style="max-width: 500px; width: 100%;">
      <q-card-section class="text-center settings-border">
        <big class="titillium text-uppercase">General</big>
        <p>Version:
          <span class="text-h6 q-pa-lg">
            {{ version }}
          </span>
        </p>
        <p>Config Path:
          <span class="break-word text-h6 q-pa-lg">
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
      </q-card-section>
      <br>
      <q-card-section class="text-left settings-border">
        <div class="text-weight-bold text-center">
          <big class="titillium text-uppercase">Credentials</big>
        </div>
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
      </q-card-section>
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
      this.$router.push({ path: '/change-password' })
    },
    setNetwork: function () {
      this.$store.dispatch('settings/toggleNetwork', this.network)
      this.$q.notify({ message: `Network changed to ${this.network}`, color: 'positive' })
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
  }
}
</script>
<style>
.settings-border {
  border: solid thin white !important;
  border-style: solid;
  border-width: thin;
}
.break-word {
  word-wrap: break-word;
}
</style>

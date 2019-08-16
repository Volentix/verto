<template>
<q-page class="flex flex-center text-white bg-black">
  <q-card flat class="bg-black" style="width: 100%; max-width: 500px; border-style:solid;">
    <q-card-section class="text-weight-bold text-center">
      <big class="titillium">{{ $t('KeepYourKeysSafe.keepsafe') }}</big>
    </q-card-section>
    <q-card-section class="text-left">
      <div class="q-py-sm">
        {{ $t('KeepYourKeysSafe.before') }}
      </div>
      <div class="q-pa-sm">
        <div class="q-py-sm">
          <q-select dark color="white" separator v-model="createtype" :options="options" />
        </div>
        <div class="text-right q-pa-lg">
          <q-btn v-if="isCancelButtonActive" color="red" outline rounded class="float-left" @click="cancel">{{ $t('SaveYourKeys.cancel') }}</q-btn>
          <q-btn color="yellow" outline rounded @click="submit">{{ $t('SaveYourKeys.create') }}</q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
</q-page>
</template>

<script>
// import configManager from '@/util/ConfigManager'

export default {
  // name: 'ComponentName',
  data () {
    return {
      createtype: 'FILE',
      buttonsAreDisabled: true,
      isCancelButtonActive: this.$route.params.isCancelButtonActive,
      options: [
        {
          label: this.$t('SaveYourKeys.save_keys'),
          value: 'FILE'
        },
        {
          label: this.$t('DisplayKey.header'),
          value: 'WRITTEN'
        }
      ]
    }
  },
  mounted () {
    this.isCancelButtonActive = true
  },
  methods: {
    async submit () {
      // if (this.checkOne && this.checkTwo && this.checkThree && this.checkFour) {
      if (this.$q.platform.is.electron) {
        let command = 'networksetup -setairportpower airport off'
        let exec = require('child_process').exec
        exec(command)
      } else if (this.$q.platform.is.cordova) {
        try {
          await this.$q.dialog({
            title: 'Turn on Airplane mode?',
            ok: true,
            cancel: true
          })
          this.$store.dispatch('settings/setAirplaneMode', true)
          window.cordova.plugins.settings.open('airplane_mode')
        } catch (e) {}
      }
      if (this.createtype === 'FILE') {
        this.$router.push('save-to-file')
      } else {
        this.$router.push('write-it-down')
      }
    },
    cancel () {
      this.$router.go(-1)
    }
  }
}
</script>

<style>
</style>

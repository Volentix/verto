<template>
<q-page class="flex flex-center text-white bg-black">
  <div class="column">
  <q-card style="max-width: 700px; border-style: solid;" flat>
    <q-card-section class="text-weight-bold text-center">
      <big class="titillium"> Create EOS account </big>
    </q-card-section>
    <q-card-section class="text-left">
      <div v-if="createAccount" class="q-pa-sm">
        <p>
          Choose your EOS account name (12 characters)
        </p>
        <q-field :error="accountIsNotValid" v-bind:error-label="$t('Welcome.incorrect')" :count="12" >
          <q-input dark v-model="accountName" color="yellow" :label="$t('EosAccount.enter_account_name')"/>
        </q-field>
        <div class="text-right q-pa-lg">
          <q-btn color="yellow" outline rounded class="float-left" @click="cancelCreateAccount">{{ $t('back') }}</q-btn>
          <q-btn color="yellow" outline rounded class="float-right" @click="createEosAccount">{{ $t('next') }}</q-btn>
        </div>
      </div>
      <div v-if="generateUserKeys" class="q-pa-sm">
        <p>
          Choose your saving key option:
        </p>
        <div class="q-py-sm">
          <q-select dark color="white" separator v-model="createtype" :options="options" />
        </div>
        <div class="text-right q-pa-lg">
          <q-btn color="yellow" outline rounded class="float-left" @click="generateUserKeys = false; createAccount = true">{{ $t('back') }}</q-btn>
          <q-btn color="yellow" outline rounded class="float-right" @click="generateKeys">{{ $t('next') }}</q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
  <br>
  <div class="text-center text-yellow text-body2">
    <a @click="cancel"> Cancel and go back to Verto manager </a>
  </div>
  </div>
</q-page>
</template>

<script>
export default {
  data () {
    return {
      createAccount: true,
      generateUserKeys: false,
      spinnervisible: false,
      accountName: '',
      createType: '',
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
  methods: {
    createEosAccount () {
      this.createAccount = false
      this.generateUserKeys = true
    },
    generateKeys () {
      // if (this.$q.platform.is.electron) {
      //   let command = 'networksetup -setairportpower airport off'
      //   let exec = require('child_process').exec
      //   exec(command)
      // } else if (this.$q.platform.is.cordova) {
      //   try {
      //     await this.$q.dialog({
      //       title: 'Turn on Airplane mode?',
      //       ok: true,
      //       cancel: true
      //     })
      //     this.$store.dispatch('settings/setAirplaneMode', true)
      //     window.cordova.plugins.settings.open('airplane_mode')
      //   } catch (e) {}
      // }
      if (this.createtype === 'FILE') {
        this.$router.push('save-to-file')
      } else {
        this.$router.push('write-it-down')
      }
    },
    cancelCreateAccount () {
      this.$router.go(-1)
    },
    cancel () {
      this.$router.push('vertomanager')
    }
  }
}
</script>

<style lang="stylus" scoped>
a
  cursor: pointer
</style>

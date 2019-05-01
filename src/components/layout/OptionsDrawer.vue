<template>
<div>
  <q-list no-border link inset-delimiter class="text-white text-center bg-primary vert-list">
    <div v-if="!showNewSettingsPage">
      <q-item to="/vertomanager">
        <q-item-side icon="all_inbox" />
        <q-item-main>{{ $t('SettingsView.manager') }}</q-item-main>
      </q-item>
      <q-item to="/wallet">
        <q-item-side icon="inbox" />
        <q-item-main>{{ $t('SettingsView.current_wallet') }}</q-item-main>
      </q-item>
      <q-item to="/settings">
        <q-item-side icon="settings"/>
        <q-item-main>{{ $t('SettingsView.settings') }}</q-item-main>
      </q-item>
      <q-item @click.native="openURL('https://t.me/vertosupport/')">
        <q-item-side icon="live_help"/>
        <q-item-main>{{ $t('SettingsView.support') }}</q-item-main>
      </q-item>
      <q-item @click.native="logout()">
        <q-item-side icon="lock"/>
        <q-item-main>{{ $t('SettingsView.logout') }}</q-item-main>
      </q-item>
    </div>
  </q-list>
</div>
</template>

<script>
import configManager from '@/util/ConfigManager'
import { openURL } from 'quasar'

export default {
  name: 'OptionsDrawer',
  computed: {
    showNewSettingsPage () {
      return this.$store.state.settings.newSettingsPage
    }
  },
  data () {
    return {
      pword: '',
      restoreConfigModal: false,
      showCurrentWallet: false,
      showWalletManager: false,
      getvtxmessage: '',
      showGetVtx: true,
      minimizedModal: false,
      message: ''
    }
  },
  mounted () { },
  methods: {
    openURL,
    logout: function () {
      configManager.logout()
      this.$router.push({
        path: '/login'
      })
    },
    route: function (route) {
      this.showCurrentWallet = true
      this.showWalletManager = true
      if (route === 'wallet') {
        this.showCurrentWallet = false
      }
      if (route === 'vertomanager') {
        this.showWalletManager = false
      }
      this.$router.push({
        path: route
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  .vert-list .q-item
    padding-top 25px
    padding-bottom 25px
    flex-wrap wrap
    & > *
      text-align center
      flex 1 0 100%
      margin 0
      color white
      padding 10px
    .q-item-side >>> .q-item-icon
      font-size 32px
  .q-item-side img
    width 2rem
  .q-item:hover
    background rgba(189,189,189,0.4)
    cursor pointer
</style>

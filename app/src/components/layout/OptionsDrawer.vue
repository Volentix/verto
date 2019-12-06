<template>
<div>
  <q-list no-border link inset-delimiter class="text-white text-center bg-primary vert-list">
    <div v-if="!showNewSettingsPage">
      <q-item to="/vertomanager">
        <q-item-section class="flex-center">
          <q-avatar icon="all_inbox" size="65px"/>
        </q-item-section>
        <q-item-label>{{ $t('SettingsView.manager') }}</q-item-label>
      </q-item>
      <q-item to="/wallet">
        <q-item-section class="flex-center">
          <q-avatar icon="inbox" size="65px"/>
        </q-item-section>
        <q-item-label>{{ $t('SettingsView.current_wallet') }}</q-item-label>
      </q-item>
      <q-item to="/vdexnodes">
        <q-item-section class="flex-center">
          <q-avatar icon="developer_board" size="65px"/>
        </q-item-section>
        <q-item-label>{{ $t('SettingsView.vdexnodes') }}</q-item-label>
      </q-item>
      <q-item to="/exchange">
        <q-item-section class="flex-center">
          <q-avatar icon="swap_horizontal_circle" size="65px"/>
        </q-item-section>
        <q-item-label>{{ $t('SettingsView.exchange') }}</q-item-label>
      </q-item>
      <q-item to="/cruxpay">
        <q-item-section class="flex-center">
          <q-avatar size="32px">
            <img src="/statics/img/cruxpay.png" />
          </q-avatar>
        </q-item-section>
        <q-item-label>{{ $t('SettingsView.cruxpay') }}</q-item-label>
      </q-item>
      <q-item to="/settings">
        <q-item-section class="flex-center">
          <q-avatar icon="settings" size="65px"/>
        </q-item-section>
        <q-item-label>{{ $t('SettingsView.settings') }}</q-item-label>
      </q-item>
      <q-item @click.native="openURL('https://t.me/vertosupport/')">
        <q-item-section class="flex-center">
          <q-avatar icon="live_help" size="65px"/>
        </q-item-section>
        <q-item-label>{{ $t('SettingsView.support') }}</q-item-label>
      </q-item>
      <q-item @click.native="logout()">
        <q-item-section class="flex-center">
          <q-avatar icon="lock" size="65px"/>
        </q-item-section>
        <q-item-label>{{ $t('SettingsView.logout') }}</q-item-label>
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
    openURL (url) {
      if (this.$q.platform.is.cordova) {
        window.open(url, '_system')
      } else {
        openURL(url)
      }
    },
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
    padding-top 10px
    padding-bottom 10px
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

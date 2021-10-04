<template>
  <div>

  </div>
</template>

<script>
import configManager from '@/util/ConfigManager'
import store from '../../../store'

export default {
  name: 'StorageSync',
  async mounted () {
    console.log(localStorage.getItem('sync_data'))
    if (localStorage.getItem('sync_data')) {
      this.$router.push({
        name: 'syncExtensionWallet'
      })
    } else {
      if (store.state.currentwallet && store.state.currentwallet.loggedIn === true) {
        this.$router.push({
          path: '/verto/dashboard'
        })
      } else {
        this.hasConfig = !!await configManager.hasVertoConfig()
        if (!this.hasConfig) {
          this.$router.push({
            name: 'setup',
            params: {
              showConfigStep: true
            }
          })
        } else {
          this.$router.push({
            name: 'login'
          })
        }
      }
    }
    if (this.$isbex) {
      this.$nextTick(() => {
        document.querySelector('#preloader').style.display = 'none'
      })
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div>

  </div>
</template>

<script>
import configManager from '@/util/ConfigManager'

export default {
  name: 'StorageSync',
  async mounted () {
    console.log('route loaded')
    sessionStorage.setItem('router_loaded', true)
    const routerLoaded = sessionStorage.getItem('app_started')
    if (routerLoaded == null) {
      return
    }
    if (localStorage.getItem('sync_data')) {
      this.$router.push({
        name: 'syncExtensionWallet'
      })
    } else {
      const lastRoute = localStorage.getItem('last_route') ? JSON.parse(localStorage.getItem('last_route')) : null
      if (lastRoute && this.$route.name !== lastRoute.name && lastRoute.name !== 'storesync') {
        console.log('loading existing route ', lastRoute.path)
        this.$router.push({
          name: lastRoute.name,
          query: lastRoute.query,
          params: lastRoute.params
        })
      } else {
        if (this.$store.state.currentwallet && this.$store.state.currentwallet.loggedIn === true) {
          console.log('moving to dashboard')
          this.$router.push({
            path: '/verto/dashboard'
          })
        } else {
          const hasConfig = !!await configManager.hasVertoConfig()
          if (!hasConfig) {
            console.log('moving to setup')
            this.$router.push({
              name: 'setup',
              params: {
                showConfigStep: true
              }
            })
          } else {
            console.log('moving to login')
            this.$router.push({
              name: 'login'
            })
          }
        }
      }
    }
    document.querySelector('#preloader').style.display = 'none'
  }
}
</script>

<style scoped>

</style>

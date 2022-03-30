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

    }
    let call = localStorage.getItem('call_request')
    let qr = localStorage.getItem('wallet_connect_svg')

    if (call) {
      localStorage.removeItem('call_request')
      call = JSON.parse(call)

      this.$router.push({
        name: 'connectv1',
        params: {
          txObject: call.params[0],
          payloadId: call.id
        }
      })
    } else if (qr) {
      qr = JSON.parse(qr)
      localStorage.removeItem('wallet_connect_svg')
      this.$router.push({
        name: 'connectv1',
        params: {
          qr: qr.qr,
          domain: qr.domain
        }
      })
    } else if (localStorage.getItem('sync_data')) {
      this.$router.push({
        name: 'syncExtensionWallet'
      })
    } else {
      const lastRoute = localStorage.getItem('last_route') ? JSON.parse(localStorage.getItem('last_route')) : null
      console.log(lastRoute, 'lastRoute 2')
      if (lastRoute && this.$route.name !== lastRoute.name && !['connectv1', 'storesync', 'login'].includes(lastRoute.name)) {
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
        } else if (!window.location.href.includes('restore')) {
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

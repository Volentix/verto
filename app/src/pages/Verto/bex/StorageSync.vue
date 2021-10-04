<template>

</template>

<script>
import store from '../../../store'

export default {
  name: 'StorageSync',
  mounted () {
    if (this.$isbex) {
      this.$nextTick(() => {
        document.querySelector('#preloader').style.display = 'none'
      })
    }
    if (store.state.currentwallet && store.state.currentwallet.loggedIn === true) {
      this.$router.push({
        path: '/verto/dashboard'
      })
    } else {
      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>

<style scoped>

</style>

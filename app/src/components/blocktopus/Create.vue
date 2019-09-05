<template>
  <section>
    <iframe class="full-width window-height"  id="blocktopusiframe" :src="blocktopusLink"/>
  </section>
</template>

<script>
import EventBus from '../../bus'

export default {
  data () {
    return {
      blocktopusLink: process.env[this.$store.state.settings.network].BLOCKTOPUS_URL + '/token_buyers/sign_up?verto_public_address=' + this.$store.state.currentwallet.wallet.key
    }
  },
  beforeMount () {
    EventBus.addListener(this.callback)
  },
  destroyed () {
    EventBus.removeListener(this.callback)
  },
  methods: {
    signup: function () {
      this.$router.push('walletmanager')
    },
    callback: function (e) {
      if (e.data && (typeof e.data === 'string' || e.data instanceof String)) {
        if (e.data.startsWith('success')) {
          this.$router.push({ path: 'blocktopusSuccess' })
        } else if (e.data.startsWith('cancel')) {
          this.$router.push({ path: 'wallet' })
        } else if (e.data.startsWith('error')) {
          this.$router.push({ path: 'kycError' })
        }
      }
    }
  }
}
</script>

<style>
#blocktopusiframe
{
    height:   100%;
    width:    100%;
}
</style>

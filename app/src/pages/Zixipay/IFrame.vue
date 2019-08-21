<template>
  <iframe id="zixipayiframe" class="full-width window-height" :src="zixipayLink"/>
</template>

<script>
import EventBus from '../../bus'

export default {
  // name: 'ComponentName',
  data () {
    return {
      zixipayLink: 'https://zixipay.com',
      merchant: '',
      description: '',
      amount: 0,
      currency: '',
      custom: '',
      hash: ''
    }
  },
  created () {
    /*

          '/zixipay-iframe?' +
          'merchant=' + self.form.merchantid +
          '&description=' + self.form.description +
          '&amount=' + self.form.amount +
          '&currency=' + self.form.currency +
          '&custom=' + custom +
          '&hash=' + result.data.hash
    */
    this.merchant = this.$route.query.merchant
    this.description = this.$route.query.description
    this.amount = this.$route.query.amount
    this.currency = this.$route.query.currency
    this.custom = this.$route.query.custom
    this.hash = this.$route.query.hash
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
#zixipayiframe
{
    height:   100%;
    width:    100%;
}
</style>

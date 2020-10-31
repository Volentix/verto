<template>
  <div ref="ual-mount-point">
  </div>
</template>

<script>

export default {
  name: 'ualTrigger',
  async mounted () {
    console.log('test')
    // import here for SSR
    const { UALJs } = await import('ual-vuejs-renderer')

    const self = this
    const options = this.options
    const ual = new UALJs(
      function (...arg) { return self.loginCallback(...arg) },
      options.nets,
      options.name,
      options.authenticators.map(Auth => {
        if (typeof Auth === 'object') {
          const nets = options.nets.filter(net => Auth.netChainIds ? Auth.netChainIds.includes(net.chainId) : true)
          return new Auth.Authenticator(nets, Auth.options || null)
        } else { return new Auth(options.nets) }
      }),
      { containerElement: this.$refs['ual-mount-point'] }
    )

    ual.init()
  },
  methods: {
    loginCallback (...args) {
      console.log('test')
      return this.$emit('login', ...args)
    }
  },
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>

</style>

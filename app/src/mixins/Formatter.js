export default {
  methods: {
    formatNumber (num, decimals = 4) {
      let value = parseFloat(num).toFixed(decimals)

      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals
      })

      return isNaN(value) ? 0 : formatter.format(value)
    },
    formatDefiboxPool (pool) {
      return this.formatNumber(pool.split(' ')[0]) + ' ' + pool.split(' ')[1]
    }

  }
}

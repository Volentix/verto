export default {
  methods: {
    formatNumber (num, decimals = 4) {
      let value = parseFloat(num).toFixed(decimals)
      return isNaN(value) ? 0 : value
    },
    formatDefiboxPool (pool) {
      return this.formatNumber(pool.split(' ')[0]) + ' ' + pool.split(' ')[1]
    }

  }
}

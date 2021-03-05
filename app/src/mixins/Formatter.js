export default {
  methods: {
    formatNumber (num, decimals = 4) {
      return parseFloat(num).toFixed(decimals)
    },
    formatDefiboxPool (pool) {
      return this.formatNumber(pool.split(' ')[0]) + ' ' + pool.split(' ')[1]
    }

  }
}

export default {
  methods: {
    formatNumber (num, decimals = 4) {
      let value = parseFloat(num ? num.toString().split(',').join('') : num).toFixed(decimals)

      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals
      })

      return isNaN(value) ? '0.00' : formatter.format(value)
    },
    convertTimestamp (timestamp) {
      let d = new Date(timestamp * 1000),
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),
        dd = ('0' + d.getDate()).slice(-2),
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),
        ampm = 'AM',
        time

      if (hh > 12) {
        h = hh - 12
        ampm = 'PM'
      } else if (hh === 12) {
        h = 12
        ampm = 'PM'
      } else if (hh === 0) {
        h = 12
      }

      time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm

      return time
    },
    formatDefiboxPool (pool) {
      return this.formatNumber(pool.split(' ')[0]) + ' ' + pool.split(' ')[1]
    }

  }
}

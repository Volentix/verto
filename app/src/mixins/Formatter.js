export default {
  methods: {
    formatNumber (num, decimals = 4) {
      return parseFloat(num).toFixed(decimals).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    }

  }
}

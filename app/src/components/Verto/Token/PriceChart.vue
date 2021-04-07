<script>

import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: ['dataType', 'data'],
  data: () => ({
    chartdata: {
      labels: [],
      datasets: [
        {
          data: [4, 5, 9, 19, 4],
          fill: false,
          borderColor: '#7272fa',
          tension: 0.01,
          legend: {
            display: false,
            labels: {
              display: false
            }
          },
          borderWidth: 2,
          pointRadius: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        },
        xAxes: [{
          gridLines: {
            display: false
          },
          display: false
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          display: false
        }]
      }
    }
  }),
  async mounted () {
    this.chartdata.labels = this.data.prices.map(o => o[0])
    if (this.dataType === 'price') {
      this.chartdata.datasets[0].label = ''
      this.chartdata.datasets[0].data = this.data.prices.map(o => o[1])
    } else if (this.dataType === 'volume') {
      this.chartdata.datasets[0].label = 'Volume'
      this.chartdata.datasets[0].data = this.data.total_volumes.map(o => o[1])
    }
    this.renderChart(this.chartdata, this.options)
  }
}
</script>

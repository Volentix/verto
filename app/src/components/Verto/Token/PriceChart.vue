<script>

import { Line } from 'vue-chartjs'
import Formatter from '@/mixins/Formatter'
import store from '@/store'
const updatePrice = (data) => {
  store.commit('tokens/updateState', { key: 'historicalPrice', value: data })
}
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
          borderWidth: 2,
          pointRadius: 0.1
        }
      ]
    },
    options: {

      tooltips: {
        mode: 'index',
        yAlign: 'top',
        intersect: false,
        callbacks: {
          label: function (tooltipItems, data) {
            return 'Price: $' + parseFloat(tooltipItems.yLabel).toFixed(6)
          }
        },
        custom: (tooltip) => {
          if (!tooltip) return

          tooltip.displayColors = false
          tooltip.y = 12

          if (store.state.settings.lightMode === 'true') {
            tooltip.backgroundColor = 'rgba(4,18,31,1)'
            tooltip.bodyFontColor = '#fff'
            tooltip.titleFontColor = '#fff'
          } else {
            tooltip.backgroundColor = 'rgba(255,255,255,1)'
            tooltip.bodyFontColor = '#000'
            tooltip.titleFontColor = '#000'
            if (tooltip.labelTextColors && tooltip.labelTextColors[0]) { tooltip.labelTextColors[0] = '#000' }
          }
        }
      },
      hover: {
        mode: 'index',
        intersect: false,
        onHover: (e, item) => {
          if (item.length) {
            const data = item[0]._chart.config.data.datasets[0].data[item[0]._index]
            updatePrice(data)
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
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
  destroyed () {
    store.commit('tokens/updateState', { key: 'historicalPrice', value: null })
  },
  async mounted () {
    this.chartdata.labels = this.data.prices.map(o => o[0])
    if (this.dataType === 'price') {
      this.chartdata.labels = this.data.prices.map(o => (new Date(o[0])).toUTCString())
      this.chartdata.datasets[0].data = this.data.prices.map(o => o[1])
    } else if (this.dataType === 'volume') {
      this.chartdata.datasets[0].label = 'Volume'
      this.chartdata.datasets[0].data = this.data.total_volumes.map(o => o[1])
    }
    this.renderChart(this.chartdata, this.options)
  },
  mixins: [Formatter]
}
</script>
<style scoped>
/deep/ #chartjs-tooltip {
            opacity: 1;
            position: absolute;
            background: rgba(0, 0, 0, .7);
            color: white;
            border-radius: 3px;
            -webkit-transition: all .1s ease;
            transition: all .1s ease;
            pointer-events: none;
            -webkit-transform: translate(-50%, 0);
            transform: translate(-50%, 0);
        }

  /deep/    .chartjs-tooltip-key {
            display: inline-block;
            width: 10px;
            height: 10px;
            margin-right: 10px;
        }
</style>

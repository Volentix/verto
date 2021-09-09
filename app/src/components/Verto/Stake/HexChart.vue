<script>
import { Bar } from 'vue-chartjs'
import HexChartPayload from './HexChartPayload.json'
import Formatter from '@/mixins/Formatter'
export default {
  extends: Bar,
  data () {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: '#f87979',
            label: 'Stakes Expirin'
          }, {
            data: [],
            backgroundColor: '#f87979',
            label: 'Cumulative Shares Expiring'
          }, {
            data: [],
            backgroundColor: '#f87979',
            label: 'Stakes Expiring SMA(5)'
          }
        ]
      }
    }
  },
  mounted () {
    let config = {
      headers: {
        'kbn-version': '7.13.3'
      }
    }
    this.$axios.post(process.env[this.$store.state.settings.network].CACHE + 'https://hex.vision/api/metrics/vis/data', HexChartPayload, config)
      .then((res) => {
        let data = res.data['61ca57f0-469d-11e7-af02-69e470af7417'].series
        console.log(this.chartData, 99)
        this.chartData.datasets[0].data = data[0].data.map(o => o[1])
        this.chartData.labels = data[0].data.map(o => (new Date(o[0])).toUTCString().substring(0, 16))
        //  this.chartData.datasets[1].data = data[1].data.map(o => o[1])
        //   this.chartData.datasets[2].data = data[2].data.map(o => o[1])

        const self = this
        console.log(this.chartData)
        this.renderChart(this.chartData,
          { responsive: true,
            maintainAspectRatio: false,
            tooltips: {
              mode: 'index',
              intersect: false
            },
            scales: {
              y: {
                type: 'linear',
                grace: '50%'
              },
              yAxes: [{
                gridLines: {
                  color: 'rgba(0, 0, 0, 0)'
                },
                stacked: true,
                ticks: {

                  callback: function (value, index, values) {
                    console.log(value, 'value')
                    return self.nFormatter2(value, 2) + ' HEX'
                  },

                  beginAtZero: false,
                  steps: 100000,
                  stepValue: 100000,
                  suggestedMin: 50,
                  suggestedMax: 100
                }

              }],

              xAxes: [{

                gridLines: {
                  color: 'rgba(0, 0, 0, 0)'
                },
                stacked: true,
                display: true,

                time: {
                  parser: 'YYYY-MM-DD',
                  tooltipFormat: 'll HH:mm',
                  unit: 'year',

                  displayFormats: {
                    'day': 'YYYY-MM-DD'
                  }
                }
              }]
            } })
      })
  },
  mixins: [Formatter]
}
</script>

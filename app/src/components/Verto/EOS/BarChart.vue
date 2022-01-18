<script>
import { Bar } from 'vue-chartjs'
import Formatter from '@/mixins/Formatter'

export default {
  extends: Bar,
  props: ['dataType', 'stakingData'],
  data: () => ({
    chartdata: {
      datasets: [
        {
          data: [],
          backgroundColor: '#f87979',
          label: 'Stake'
        }
      ]
    }
  }),
  async mounted () {
    this.chartdata.labels = [].concat(this.stakingData[0]).map(o => o.x)
    this.chartdata.datasets[0].data = [].concat(this.stakingData[0]).map(o => o.y)
    // this.chartdata.datasets[1].data = this.stakingData[1]

    const self = this
    this.renderChart(this.chartdata, { responsive: true,
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
              return self.nFormatter2(value, 2) + ' VTX'
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

<script>

import { Pie } from 'vue-chartjs'
import Formatter from '@/mixins/Formatter'

export default {
  extends: Pie,
  props: ['dataType', 'stakingData'],
  data: () => ({
    chartdata: {
      labels: [],
      datasets: [
        {
          data: [4, 5, 9, 19, 4],
          fill: false,

          tension: 0.01,
          borderWidth: 2,
          pointRadius: 0.1
        }
      ]
    }
  }),
  async mounted () {
    this.chartdata.labels = [

      'Staked',
      'Reward sent'

    ]
    console.log(this.stakingData, '')
    this.chartdata.datasets[0].data = this.stakingData
    this.chartdata.datasets[0].backgroundColor = [
      '#d7dddf',
      '#4f5ce2'
    ]
    this.renderChart(this.chartdata, { responsive: true, maintainAspectRatio: false })
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

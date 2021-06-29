<script>

import { Line } from 'vue-chartjs'
import Formatter from '@/mixins/Formatter'

export default {
  extends: Line,
  props: ['dataType', 'stakingData'],
  data: () => ({
    chartdata: {

      type: 'bar',
      datasets: [
        {
          data: [],
          backgroundColor: '#f87979',
          label: 'Stake'
        },
        {
          data: [],
          backgroundColor: '#000',
          label: 'Rewards'
        }
      ]
    }
  }),
  async mounted () {
    this.chartdata.labels = this.stakingData[0]
    console.log(this.chartdata, this.stakingData, 'this.chartdata')
    this.chartdata.datasets[0].data = this.stakingData[0]
    this.chartdata.datasets[1].data = this.stakingData[1]

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

<script>

import { Pie } from 'vue-chartjs'

export default {
  props: ['fundData'],
  extends: Pie,
  mounted () {
    let labels = []
    let data = []
    this.fundData.forEach(element => {
      labels.push(element.name)
      data.push(element.calculations.USD.price * element.investorShares)
    })
    this.renderChart({
      labels: labels,
      datasets: [
        {
          backgroundColor: [
            '#41B883',
            '#E46651',
            '#00D8FF',
            '#DD1B16'
          ],
          data: data
        }
      ]
    }, { responsive: true, maintainAspectRatio: false })
  }
}

</script>

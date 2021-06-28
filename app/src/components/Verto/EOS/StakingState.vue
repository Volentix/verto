<template>
<div class="full-width q-pt-md bg-white q-pa-md" v-if="chartData.length">
<div class="text-h6 q-py-md">
THE STATE OF VTX
</div>
<div class="row">
<div class="col-md-4">

<Chart :stakingData="chartData"   :key="chartKey" />
</div>
<div class="col-md-4">
<span class="text-h6">
<b class="highlight-color">Total staked: </b><br/>{{formatNumber(state.filter(o => o.action === 'stake').map(o => o.amount).reduce((a, b) => a + b, 0), 0)}} VTX
</span>

<q-list class="rounded-borders q-my-md " style="max-width:250px;" bordered>

<div class="q-pl-md q-pt-sm">Recently staked</div>
      <q-item dense v-for="stake in state.filter(o => o.action === 'stake').slice(0,5)" :key="stake.timestamp" class="q-my-sm" clickable v-ripple>
        <q-item-section avatar>
          <q-avatar :color="getRandomColor()" text-color="grey-7">
            {{ stake.staker.charAt(0) }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ stake.amount }} VTX</q-item-label>
          <q-item-label caption lines="1">{{ stake.staker }}</q-item-label>
           <q-item-label caption lines="1">{{ convertTimestamp(stake.timestamp)}}</q-item-label>
        </q-item-section>

      </q-item>

    </q-list>
    <p class="q-ml-md" ><a href="https://www.bloks.io/account/vertostaking" target="_blank">View all <q-icon name="chevron_right"/></a></p>
</div>
<div class="col-md-4">
<span class="text-h6">
<b class="highlight-color">Total rewarded:</b> <br/>{{formatNumber(state.filter(o => o.action === 'unstake').map(o => o.amount).reduce((a, b) => a + b, 0), 0)}} VTX
</span>
<br/>

<q-list class="rounded-borders q-my-md " style="max-width:250px;" bordered>

<div class="q-pl-md q-pt-sm">Recently rewarded</div>

      <q-item dense v-for="stake in state.filter(o => o.action === 'unstake').slice(0,5)" :key="stake.timestamp" class="q-my-sm" clickable v-ripple>
        <q-item-section avatar>
          <q-avatar :color="getRandomColor()" text-color="grey-7">
            {{ stake.staker.charAt(0) }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ stake.amount }} VTX</q-item-label>
          <q-item-label caption lines="1">{{ stake.staker }}</q-item-label>
           <q-item-label caption lines="1">{{ convertTimestamp(stake.timestamp)}}</q-item-label>
        </q-item-section>

      </q-item>

    </q-list>
    <span class="q-ml-md"><a href="https://www.bloks.io/account/vertostaking" target="_blank">View all <q-icon name="chevron_right"/></a></span>
</div>

</div>
</div>
</template>
<script>

import Chart from './PieChart'
import Formatter from '@/mixins/Formatter'

export default {
  components: {
    Chart
  },
  data: () => ({
    state: [],
    chartData: [],
    chartKey: 1
  }),
  async mounted () {
    this.getHistoryData()
  },
  methods: {
    getHistoryData () {
      this.state = []
      let contract = 'vertostaking'
      this.$axios.get('https://eos.hyperion.eosrio.io/v2/history/get_actions?account=' + contract + '&skip=0&limit=1000&sort=desc').then((response) => {
        if (response && response.data && response.data.actions) {
          response.data.actions.map(a => {
            let item = {
              action: null,
              amount: null,
              timestamp: null
            }

            if ((a.act.name === 'transfer' && typeof a.act.data.from !== 'undefined' && typeof a.act.data.to !== 'undefined')) {
              let stakingMemo = !isNaN(a.act.data.memo) && (parseInt(a.act.data.memo) >= 1 || parseInt(a.act.data.memo) <= 10)
              if (a.act.data.to === contract && stakingMemo) {
                item.action = 'stake'
                item.staker = a.act.data.from
              } else if (a.act.data.from === contract && a.act.data.memo === 'unstaking fund') {
                item.action = 'unstake'
                item.staker = a.act.data.to
              }
              console.log(a, item, 'item', 123, stakingMemo)
              if (item.action) {
                item.amount = parseFloat(a.act.data.quantity)
                item.timestamp = a.timestamp
                this.state.push(item)
              }
            }
          }
          )
        }
        this.chartKey++
        this.chartData = [this.state.filter(o => o.action === 'stake').map(o => o.amount).reduce((a, b) => a + b, 0), this.state.filter(o => o.action === 'unstake').map(o => o.amount).reduce((a, b) => a + b, 0)]

        console.log(this.state, this.chartData, this.chartKey)
      }).catch(e => {

      })
    }
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
.highlight-color {
color: #50509f
}
</style>

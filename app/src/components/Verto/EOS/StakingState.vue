<template>
<div class="full-width">
<div class="full-width q-pt-md bg-white q-pa-md" v-if="chartData.length">
<div class="text-h6 q-py-md">
THE STATE OF VTX
</div>
<div class="row">
<div class="col-md-12">

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
<div v-else>
<q-linear-progress indeterminate color="grey" class="q-mt-sm" />
</div>
</div>
</template>
<script>

import Chart from './BarChart'
import Formatter from '@/mixins/Formatter'
import {
  EosRPC
} from '@/util/EosInterac'

export default {
  components: {
    Chart
  },
  data: () => ({
    state: [],
    chartData: [],
    chartKey: 1,
    monthGroup: {

    }
  }),
  async mounted () {
    this.getHistoryData()
    const rpc = new EosRPC(process.env[this.$store.state.settings.network].EOS_HISTORYAPI)
    let data = await rpc.getTableByScope(
      'vertostaking',
      'vertostaking',
      'accountstake'
    )
    console.log(data, 'data')
  },
  methods: {
    estimateReward (amount, period) {
      let stake_per = (1 + period / 10.0) / 100

      return (Math.round(amount * stake_per * 100) / 100) * period
    },
    getHistoryData () {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ]

      /*  const d = new Date()
      document.write('The current month is ' + monthNames[d.getMonth()])
      */

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
                item.period = parseInt(a.act.data.memo)
                let maturity = (new Date(a.timestamp))

                maturity.setDate(maturity.getDate() + parseInt(a.act.data.memo) * 30)

                item.maturity = maturity
                item.reward = this.estimateReward(parseFloat(a.act.data.quantity), item.period)
              } else if (a.act.data.from === contract && a.act.data.memo === 'unstaking fund') {
                item.action = 'unstake'
                item.staker = a.act.data.to
              }

              if (item.action) {
                item.amount = parseFloat(a.act.data.quantity)
                item.timestamp = a.timestamp
                let month = monthNames[(new Date(item.timestamp)).getMonth()]
                if (!this.monthGroup[month]) {
                  this.monthGroup[month] = [item]
                } else {
                  this.monthGroup[month].push(item)
                }
                this.state.push(item)
              }
            }
          }
          )
        }

        this.state.sort(function (a, b) {
          return (new Date(a.maturity)).getTime() - (new Date(b.maturity)).getTime()
        })

        /* const formatForChartv1 = (data, i) => {
          let days = this.groupday(data, 'timestamp')
          console.log(days, i, 77)
          return Object.keys(days).map(o => {
            o = days[o]
            return o && o.length ? o.map(a => a.amount).reduce((a, b) => a + b, 0) : 0
          }).filter(o => o)
        } */

        const formatForChartV2 = (dataset, action, key) => {
          let set = {
            data: [],
            time: []
          }
          dataset.forEach(o => {
            if (o.action === action) {
              set.data.push({ y: o[key], x: (new Date(o.maturity)).toISOString().substring(0, 10) })
            //  set.time.push(o.timestamp)
            } else {
              //   data.push(0)
            }
          })
          return set
        }
        let set = formatForChartV2(this.state, 'stake', 'reward')
        this.chartData = [set.data, set.time]
        console.log(this.chartData, ' this.chartData 8', this.monthGroup)
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

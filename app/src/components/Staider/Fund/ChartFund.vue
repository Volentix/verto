<template>
  <div id="fund_chart" class="fund_chart full-width">
      <div class="option-toggle">
        <q-btn-group outline>
            <q-btn :dark="$store.state.settings.lightMode === 'true'" :text-color="$store.state.settings.lightMode === 'true' ? 'white':''" unelevated label="1D" @click="getSharePriceEndpoint('1d')" :class="{'active': currentOption }" size="md" />
            <q-btn :dark="$store.state.settings.lightMode === 'true'" :text-color="$store.state.settings.lightMode === 'true' ? 'white':''" unelevated label="1W" @click="getSharePriceEndpoint('1w')" size="md" />
            <q-btn :dark="$store.state.settings.lightMode === 'true'" :text-color="$store.state.settings.lightMode === 'true' ? 'white':''" unelevated label="1M" @click="getSharePriceEndpoint('1m')" size="md" />
            <q-btn :dark="$store.state.settings.lightMode === 'true'" :text-color="$store.state.settings.lightMode === 'true' ? 'white':''" unelevated label="3M" @click="getSharePriceEndpoint('3m')" size="md" />
            <q-btn :dark="$store.state.settings.lightMode === 'true'" :text-color="$store.state.settings.lightMode === 'true' ? 'white':''" unelevated label="6M" @click="getSharePriceEndpoint('6m')" size="md" />
            <q-btn :dark="$store.state.settings.lightMode === 'true'" :text-color="$store.state.settings.lightMode === 'true' ? 'white':''" unelevated label="1Y" @click="getSharePriceEndpoint('1y')" size="md" />
        </q-btn-group>
      </div>
    <div id="chart">
        <apexchart type="area" ref="lineChartSharePrice" :height="height" :options="chartOptions" :series="series"></apexchart>
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'
import { date } from 'quasar'
Vue.use(VueApexCharts)
function formatNumber2 (number, tofix) {
  const val = (number / 1).toFixed(tofix).replace(',', ' ')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
export default {
  name: 'ChartFund',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    height: {
      type: String,
      required: false,
      default: '200'
    },
    chartColor: {
      type: String,
      required: false,
      default: '#008000'
    },
    fundID: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      currentOption: '24h',
      series: [
        {
          name: 'Share Price',
          data: [
            // { 'x': 1602792277529, 'y': 0.03 },
            // { 'x': 1602392287529, 'y': 0.05 }
          ]
        }
      ],
      chartOptions: {
        tooltip: {
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            const unixTime = w.config.series[0].data[dataPointIndex].x
            // const dateTime = new Date(unixTime * 1000)
            // console.log(dateTime.toLocaleDateString('en-US'))
            const timeStamp = new Date(unixTime * 1000)
            const hour = date.formatDate(timeStamp, 'DD MMMM YYYY HH:mm')
            let sign = window.localStorage.getItem('currency').toUpperCase() !== 'USD' ? '' : '$'
            return (
              '<div class="arrow_box_tooltip q-pa-md"><span class="' + (window.localStorage.getItem('skin') === 'dark' ? 'text-grey-5' : 'text-grey') + '">' + hour + '</span><br> <span class="text-h6 ' + (window.localStorage.getItem('skin') === 'dark' ? 'text-white' : '') + '"> Share Price: ' + sign + formatNumber2(series[0][dataPointIndex], 0) + ' ' + window.localStorage.getItem('currency').toUpperCase() + '</span>' + '</div>'
            )
          }
        },
        noData: {
          text: 'Loading...'
        },
        chart: {
          type: 'area',
          stacked: false,
          zoom: {
            type: 'x',
            enabled: false,
            autoScaleYaxis: false
          },
          toolbar: {
            autoSelected: 'zoom'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 1,
          curve: 'straight',
          colors: [this.chartColor]
        },
        xaxis: {
          type: 'datetime',
          title: {
            // text: 'Date'
          }
        },
        fill:
        {
          type: 'gradient',
          //   type: 'solid',
          //   colors: ['#CCC'],
          //   opacity: 0.9
          gradient: {
            shade: 'dark',
            type: 'vertical',
            shadeIntensity: 0.2,
            gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
            inverseColors: true,
            opacityFrom: 0.5,
            opacityTo: 0.1,
            stops: [0, 100],
            colorStops: []
          }
          /* gradient: {
            shadeIntensity: 1,
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 0.6,
            stops: [0, 40, 100]
          } */
        },
        markers: {
          size: 0,
          colors: ['#FFA41B'],
          strokeColors: '#fff',
          strokeWidth: 2,
          hover: {
            size: 7
          }
        },
        yaxis: {
        //   min: 0.026,
          //   max: 0.1,
          title: {
            // text: 'Share Price'
          },
          labels: {
            formatter: function (value) {
              let sign = window.localStorage.getItem('currency').toUpperCase() !== 'USD' ? '' : '$'
              return sign + formatNumber2(value, 0) + ' ' + window.localStorage.getItem('currency').toUpperCase()
            }
          }
        }
      }
    }
  },
  async created () {
    let currency = window.localStorage.getItem('currency')
    if (!currency) {
      window.localStorage.setItem('currency', 'usd')
    }

    // let SharePriceEndPoint = 'https://services.enzyme.finance/api/enzyme/fund/metrics/range?address=0x1da7ea480ed3f6a681f3e6069c07adb3eed9d6dd&range=1d'
    this.getSharePriceEndpoint('1d')
  },
  computed: {
    currentCurrency () {
      return window.localStorage.getItem('currency').toUpperCase()
    }
  },
  methods: {
    getSharePriceEndpoint (param) {
      let SharePriceEndPoint = 'https://services.enzyme.finance/api/enzyme/fund/metrics/range?address=' + this.fundID + '&range=' + param
      this.getSharePrice(SharePriceEndPoint)
    },
    getSharePrice (endPoint) {
      let self = this
      this.$axios.get(endPoint)
        .then(response => {
          let sharePrice = response.data.data

          let dataSharePrice = []
          for (let price of sharePrice) {
            const unixTime = price.timestamp
            // const timeStamp = new Date(unixTime * 1000)
            // const hour = date.formatDate(timeStamp, 'HH')
            // console.log('timeStamp', timeStamp, 'hour', hour)
            // this.formatNumber(, 2)
            if (Object.keys(price.calculations).length > 0) { dataSharePrice.push({ 'x': unixTime, 'y': price.calculations[self.currentCurrency].price.toFixed() }) } else { dataSharePrice.push({ 'x': unixTime, 'y': 0 }) }
          }
          // console.log('this.series', this.series)
          this.series[0].data = dataSharePrice
          this.$refs.lineChartSharePrice.updateSeries([{
            data: dataSharePrice
          }])
        })
    },
    formatNumber (number, tofix) {
      const val = (number / 1).toFixed(tofix).replace(',', ' ')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/colors.scss";
@import "assets/styles/fonts.scss";
.section-sub-wrapper{
  font-family: $Comfortaa;
  font-weight: $light;
}
.p-relative{
  position: relative;
}
.lineheight{
  line-height: 30px;
}
.fund_chart{
  position: relative;
}
.option-toggle{
    position: absolute;
    right: 40px;
    top: -8px;
    z-index: 9;
    @media screen and (max-width: 768px) {
      margin-left: 44px;
    }
    /deep/ button{
        // width: 35px;
        // border-right: 1px solid #D1D1D1;
        text-transform: lowercase !important;
    }
}

#fund_chart{
    z-index: 5;
}
</style>
<style>
.fund_chart .apexcharts-tooltip-text-value:after{content: '$';display: inline-flex;font-size: 12px; font-weight: 600; padding-left: 2px;}
.fund_chart .apexcharts-gridline{opacity: 0 !important;}
.fund_chart .apexcharts-text{opacity: .4 !important;}
.dark_theme .fund_chart .apexcharts-text {fill: #FFF !important;}
.dark_theme .apexcharts-tooltip.apexcharts-theme-light {border: none;background: #182032;box-shadow:none !important;color: #FFF !important;}
.dark_theme .apexcharts-tooltip.apexcharts-theme-light .text-h6 {color: #FFF !important;}
.dark_theme .apexcharts-xaxistooltip{border: none;background: #182032;color: #FFF !important;}
</style>

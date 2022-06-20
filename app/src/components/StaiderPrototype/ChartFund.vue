<template>
  <div id="fund_chart" class="fund_chart full-width">
      <div class="option-toggle">
        <q-btn-group outline>

            <q-btn dark text-color="white" unelevated label="1D" @click="getSharePriceEndpoint('1d')" :class="{'active': currentOption === '1d' }" size="md" />
            <q-btn dark text-color="white" unelevated label="1W" @click="getSharePriceEndpoint('1w')" size="md" :class="{'active': currentOption === '1w' }" />
            <q-btn dark text-color="white" unelevated label="1M" @click="getSharePriceEndpoint('1m')" size="md" :class="{'active': currentOption === '1m' }" />
            <!-- <q-btn dark text-color="white" unelevated label="3M" @click="getSharePriceEndpoint('3m')" size="md" :class="{'active': currentOption === '3m' }" /> -->
            <!-- <q-btn dark text-color="white" unelevated label="6M" @click="getSharePriceEndpoint('6m')" size="md" :class="{'active': currentOption === '6m' }" /> -->
            <q-btn dark text-color="white" unelevated label="1Y" @click="getSharePriceEndpoint('1y')" size="md" :class="{'active': currentOption === '1y' }" />
        </q-btn-group>
      </div>
    <div id="chart">
      <span class="ath">1 $US</span>
      <span class="atl">0.60 $US</span>
        <apexchart type="area" ref="lineChartSharePrice" :height="height" :options="chartOptions" :series="series"></apexchart>
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'
import { date, QBtnGroup } from 'quasar'
Vue.use(VueApexCharts)
function formatNumber2 (number, tofix) {
  const val = (number / 1).toFixed(tofix).replace(',', ' ')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
let currency = window.localStorage.getItem('currency')
currency = currency || 'USD'
export default {
  name: 'ChartFund',
  components: {
    apexchart: VueApexCharts,
    QBtnGroup
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
      currentOption: '1d',
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
            let sign = currency.toUpperCase() !== 'USD' ? '' : '$'
            return (
              '<div class="arrow_box_tooltip q-pa-md"><span class="' + (window.localStorage.getItem('skin') === 'dark' ? 'text-grey-5' : 'text-grey') + '">' + hour + '</span><br> <span class="text-h6 ' + (window.localStorage.getItem('skin') === 'dark' ? 'text-white' : '') + '"> Share Price: ' + sign + formatNumber2(series[0][dataPointIndex], 3) + ' ' + currency.toUpperCase() + '</span>' + '</div>'
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
              let sign = currency.toUpperCase() !== 'USD' ? '' : '$'
              return sign + formatNumber2(value, 0) + ' ' + currency.toUpperCase()
            }
          }
        }
      }
    }
  },
  async created () {
    // let SharePriceEndPoint = 'https://services.enzyme.finance/api/enzyme/fund/metrics/range?address=0x1da7ea480ed3f6a681f3e6069c07adb3eed9d6dd&range=1d'
    this.getSharePriceEndpoint('1d')
  },
  computed: {
    currentCurrency () {
      return 'USD'
      // window.localStorage.getItem('currency').toUpperCase()
    }
  },
  methods: {
    getSharePriceEndpoint (param) {
      this.currentOption = param
      // let SharePriceEndPoint = 'https://services.enzyme.finance/api/enzyme/fund/metrics/range?address=' + this.fundID + '&range=' + param
      let SharePriceEndPoint = 'https://app.enzyme.finance/api/time-series/vault?vault=' + this.fundID + '&period=' + param.toUpperCase() + '&currency=USD&network=ethereum'
      // https://services.enzyme.finance/api/enzyme/fund/metrics/range?address=0x185a02fd5576817fa0c9847cd6f2acc6707bfa0a&range=1d
      this.getSharePrice(SharePriceEndPoint)
    },
    /* async getvaultHistoricalData(){
    let data = []
     let res = await this.$axios.post('https://app.enzyme.finance/api/time-series/vault?vault=' + this.fundID + '&period=1W&currency=USD&network=1')
     if(res && res.data){
       data = res.data
     }
     return data
    }, */
    getSharePrice (endPoint) {
      // let self = this
      this.$axios.get(endPoint)
        .then(response => {
          // console.log('response', response)
          let sharePrice = response.data

          let dataSharePrice = []
          for (let price of sharePrice) {
            const unixTime = price.timestamp
            // const timeStamp = new Date(unixTime * 1000)
            // const hour = date.formatDate(timeStamp, 'HH')
            // console.log('timeStamp', timeStamp, 'hour', hour)
            // this.formatNumber(, 2)

            dataSharePrice.push(
              {
                'x': unixTime,
                'y': price.netShareValue
              }
            )
            // console.log('self.currentCurrency', self.currentCurrency)
            // console.log('price.calculations[USD].price', price.calculations['USD'].price)
          }
          // console.log('this.series', this.series)
          this.series[0].data = dataSharePrice
          this.$refs.lineChartSharePrice.updateSeries([{
            data: dataSharePrice
          }])
          // console.log('dataSharePrice', dataSharePrice)
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
  @import "assets/styles/staider_theme/helpers.scss";
  .section-sub-wrapper{
    font-family: $MainFont;
    font-weight: 200;
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
    left: 30px;
    bottom: 0px;
    z-index: 9;
    @media screen and (max-width: 768px) {
      margin-left: 0px;
      bottom: 17px;
      left: 20px;
    }
    /deep/ button{
        // width: 35px;
        // border-right: 1px solid #D1D1D1;
        // text-transform: lowercase !important;
        border-radius: 12px !important;
        margin-right: 5px !important;
        margin-left: 5px !important;
        padding: 0px !important;
        width: 45px;
        height: 30px;
        font-family: $MainFont !important;
        font-weight: 600 !important;
        font-size: 14px !important;
        .q-btn__wrapper{
          padding: 4px !important;
          min-height: auto;
        }
        &.active{
          background: #4FBF67 !important;
          color: #FFF !important;
        }
    }
  }
  #fund_chart{
    z-index: 5;
  }
  #chart{
    margin-left: -120px;
    margin-right: -10px;
    position: relative;
    .ath,.atl{
      position: absolute;
      right: 32px;
      z-index: 10;
      font-family: $MainFont;
      font-size: 16px;
      font-weight: 200;
      color: #9DA0A6;
      cursor: default;
    }
    .ath{
      top: 12px;
    }
    .atl{
      bottom: 20px;
    }
  }
</style>
<style>
  #chart .apexcharts-tooltip-text-value:after{content: '$';display: inline-flex;font-size: 12px; font-weight: 600; padding-left: 2px;}
  #chart .apexcharts-gridline{opacity: 0 !important;}
  #chart .apexcharts-text{opacity: .4 !important;}
  #chart .apexcharts-text {fill: #FFF !important;transform: translateX(60px);}
  #chart .apexcharts-tooltip.apexcharts-theme-light {border: none;background: #1D1D21 !important;
  box-shadow: 0px 36px 36px 0px #121214 !important;color: #FFF !important;}
  #chart .apexcharts-tooltip.apexcharts-theme-light .text-h6 {color: #FFF !important;}
  #chart .apexcharts-xaxistooltip{border: none;background: #1D1D21;color: #FFF !important;}
  #chart .apexcharts-yaxis, #chart .apexcharts-xaxis{display: none;}
  #chart .apexcharts-xaxis-tick{display: none;}
  #chart .apexcharts-area{opacity: .6;stroke-width: 2;fill-opacity: .6;}
  #chart .apexcharts-zoom-icon{display: none;}
  #chart .apexcharts-toolbar{display: none !important;}
</style>

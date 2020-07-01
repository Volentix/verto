<template>
  <div class="campaigns full-width q-pl-md q-pr-md">
    <q-scroll-area :visible="true" class="q-pr-md q-pb-sm" style="height: 118px;">
      <div class="col2 score_col">
        <div id="slider" :class="strongSellValue">
            <div class="labels_wrapper"> <span class="lab1">Strong<br>Sell</span> <span class="lab2">Buy</span> <span class="lab3">Neutral</span> <span class="lab4">Sell</span> <span class="lab5">Strong<br>Buy</span> </div>
            <div class="container">
              <img v-if="strongSellValue === 'strong_buy'" src="statics/strong_sell.svg" class="thermostat strong_sell">
              <img v-else src="statics/strong_buy.svg" class="thermostat strong_buy">
                <div class="circle">
                  <div class="curve">
                      <div class="curve-1"></div>
                  </div>
                  <div class="inner-circle">
                      <span class="line"></span>
                      <span class="line line2"></span>
                      <span class="score_label">Score</span>
                      <span class="score_value">{{ scoreValue }}</span>
                  </div>
                </div>
            </div>
            <div class="details_coin_wrapper">
              <span class="coin"><img :src="symbol_icon"> {{ symbol }}</span>
              <span class="up_down_purcent">{{ formatPrice(upDownPurcent) }}%</span>
              <!-- <span class="up_down_amount">${{ formatPrice(upDownAmount) }}</span> -->
              <span class="price">${{ formatPrice(price) }}</span> <span class="chart">
              <img src="statics/chart_blue.png"></span>
            </div>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
import { QScrollArea } from 'quasar'
export default {
  name: 'Campaigns',
  components: {
    QScrollArea
  },
  props: {
    hideControl: {
      type: Boolean,
      default: false
    }
  },
  created () {
    setTimeout(() => {
      this.getCoinScore()
    }, 2000)
  },
  data () {
    return {
      strongSellValue: 'strong_buy',
      scoreValue: 20,
      upDownPurcent: -1.15,
      upDownAmount: 13.16,
      price: 7408.55,
      symbol: 'BTC',
      symbol_icon: ''
    }
  },
  methods: {
    getCoinScore: function () {
      let self = this
      this.$axios.get('https://volentix.info/get_asset_data?asset=' + this.modelCoin.value)
        .then(response => {
          let mydata = response.data.data
          let scoreVespucci = 0
          for (let accuracy of mydata.rating) {
            if (accuracy.accuracy !== 0) {
              scoreVespucci = accuracy.accuracy
            }
          }
          self.scoreValue = scoreVespucci
          if (self.scoreValue < 50) {
            self.strongSellValue = 'strong_buy'
          } else {
            self.strongSellValue = 'strong_sell'
          }
          self.upDownPurcent = mydata.market_data.percent_change_usd_last_24_hours
          let upDownAmountVal = (mydata.market_data.volume_last_24_hours_overstatement_multiple === undefined) ? 0 : mydata.market_data.volume_last_24_hours_overstatement_multiple
          self.upDownAmount = upDownAmountVal
          self.price = mydata.market_data.price_usd
          self.symbol = mydata.symbol
          self.symbol_icon = mydata.icon_url.replace('http:', 'https:')
          let marketCap = mydata.marketcap.current_marketcap_usd
          // get buy support from coinmarketbook
          // let buySupportFrom = ''
          // console.log('mydata', mydata)
          this.$axios.get('https://cors-anywhere.herokuapp.com/https://coinmarketbook.cc/api/ticker/' + mydata.slug).then(response => {
            let buySupportFrom = response.data.buy_order
            // console.log(buySupportFrom, mydata.slug)
            let asset = {
              'buySupport': buySupportFrom,
              'current_price': mydata.market_data.price_usd,
              'marketCap': marketCap,
              'c24h_change': mydata.market_data.percent_change_usd_last_24_hours,
              'c24h_change2': (mydata.market_data.percent_change_usd_last_24_hours === undefined) ? 0 : mydata.market_data.percent_change_usd_last_24_hours,
              'vespucci_score': scoreVespucci,
              'symbol': mydata.icon_url.replace('http:', 'https:'),
              'name': mydata.slug,
              'symbol2': mydata.symbol,
              'selected': true,
              'searched': true
            }
            self.assetData.unshift(asset)
            console.log('asset ----', asset)
          })
          // Promise.all([promise1, promise2, promise3]).then((values) => {
          //   console.log(values)
          // })
        })
    },
    formatPrice: function (value) {
      let val = (value / 1).toFixed(2).replace(',', ' ')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    }
  }
}
</script>
<style lang="scss" scoped>
    @import "~@/assets/styles/variables.scss";
    .search_home_section .score_col{}
    #slider .container {
      margin: auto;
      width: 20rem;
      height: 20rem;
    }
    #slider .circle {
      position: absolute;
      z-index: 0;
      width: 15rem;
      height: 15rem;
      background: transparent;
      border-radius: 100%;
      overflow: hidden;
      top: 0px;
    }
    #slider .curve {
      position: absolute;
      z-index: 1;
      width: 90%;
      height: 90%;
      background: radial-gradient(farthest-corner at 40px 40px, #C400FF 20%, #00FFF7 100%);
      border-radius: 100%;
      top: 5%;
      left: 5%;
      box-shadow: inset 0px -2px 12px -2px #000;
      opacity: 0;
    }
    #slider .curve .curve-1 {
      position: absolute;
      border: 80px solid transparent;
      border-radius: 100%;
      height: 243px;
      width: 343px;
      border-bottom: 50px solid #f2f2f2;
      bottom: -1px;
      right: -80px;
    }
    #slider .curve .curve-1 {
        position: absolute;
        border: 80px solid transparent;
        border-radius: 100%;
        height: 323px;
        width: 373px;
        border-bottom: 50px solid #f2f2f2;
        bottom: -1px;
        right: -80px;
    }
    #slider .inner-circle {
        position: absolute;
        z-index: 3;
        width: 45%;
        height: 46%;
        background: transparent;
        border-radius: 100%;
        top: 25%;
        left: 28%;
        color: #9e9e9e;
    }
    #slider .inner-circle .temp-max {
      position: absolute;
      top: 0;
      left: 45%;
      font-weight: 300;
    }
    #slider .inner-circle .temp-max .line {
      transition: all 0.5s ease-in-out;
      position: absolute;
      top: 86%;
      left: -250%;
      width: 60%;
      height: 60%;
      border-right: 2px solid #9e9e9e;
      transform: rotate(-50deg);
      overflow: hidden;
    }
    #slider {
        position: relative;
        margin-top: 20px;
        cursor: default;
    }
    #slider .labels_wrapper{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 470px;
        height: 240px;
        position: absolute;
        /*left: -126px;*/
        left: -114px;
        top: 0px;
        font-family: "Titillium Web", sans-serif;
        font-weight: 100;
    }
    #slider .labels_wrapper .lab1{position: relative; top: 0px; left: -90px;}
    #slider .labels_wrapper .lab2{position: relative; top: -90px; left: 145px;}
    #slider .labels_wrapper .lab3{position: relative; top: -140px; left: -5px;}
    #slider .labels_wrapper .lab4{position: relative; top: -90px; left: -155px;}
    #slider .labels_wrapper .lab5{position: relative; top: 0px; left: 83px; text-align: right;}
    #slider .inner-circle .line{width: 108px; height: 156px; position: absolute; transition: transform ease .6s; transform: rotate(90deg);}
    #slider .inner-circle .line.line2{width: 258px; height: 160px;}
    #slider.strong_buy .inner-circle .line{transform: rotate(0deg);}
    #slider.strong_buy .labels_wrapper .lab1{font-weight:700;}
    #slider.strong_sell .inner-circle .line{transform: rotate(180deg);}
    #slider.strong_sell .labels_wrapper .lab5{font-weight:700;}
    #slider.neutral .inner-circle .line{transform: rotate(90deg);}
    #slider.neutral .labels_wrapper .lab3{font-weight:600;}
    #slider .inner-circle {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    #slider .inner-circle .line:before {
        content:"";
        position: absolute;
        width: 15px;
        height: 4px;
        background: #b1b1b1;
        left: 0px;
        top: 77px;
        border-radius: 11px;
        transform: rotate(0deg);
    }
    #slider .inner-circle .score_label{
        font-size: 22px;
        font-family: "Titillium Web", sans-serif;
        font-weight: 700;
        letter-spacing: 1px;
        color: #000;
        margin-top: 8px;
    }
    #slider .inner-circle .score_value{
        font-size: 21px;
        font-family: "Titillium Web", sans-serif;
        font-weight: 700;
        letter-spacing: 1px;
        color: #000;
    }
    #slider .inner-circle .temp-min,
    #slider .inner-circle .temp-hidden {
      transition: all 0.5s ease-in-out;
      position: absolute;
      top: -30%;
      left: 23%;
      font-size: 4.5em;
      color: #7d0d90;
    }
    #slider .inner-circle .temp-min .degree,
    #slider .inner-circle .temp-hidden .degree {
      font-size: 0.5em;
      position: absolute;
      top: 10%;
      left: 95%;
    }
    #slider .inner-circle .temp-hidden {
      font-size: 2.5em;
      top: 10%;
      left: 100%;
      opacity: 0;
      transform: translateX(150px) translateY(15px);
    }
    #slider .inner-circle .location {
      position: absolute;
      top: 65%;
      left: 32%;
      font-size: 0.9em;
      font-weight: 300;
    }
    #slider .details_coin_wrapper{
        background: #F2F2F2;
        width: 100%;
        height: 80px;
        border-radius: 12px;
        position: absolute;
        bottom: -20px;
        left: -40px;
        font-family: "Titillium Web", sans-serif;
    }
    #slider .details_coin_wrapper .coin{position: absolute; left: 10px; top: 7px; font-weight: 600; font-size: 21px;}
    #slider .details_coin_wrapper .coin img{width: 19px; transform: scale3d(1, 1, 1) translateY(2px);}
    #slider .details_coin_wrapper .up_down_purcent{position: absolute; left: 10px; top: 42px; font-size: 16px; font-weight: 600; color: #6D71FC;}
    #slider .details_coin_wrapper .up_down_amount{position: absolute; left: 100px; top: 46px; font-size: 13px; font-weight: 600; color: #6D71FC;}
    #slider .details_coin_wrapper .price{position: absolute; right: 14px; top: 41px; font-size: 16px;}
    #slider .details_coin_wrapper .chart{position: absolute; right: 13px; top: 9px; width: 90px;}
    #slider .thermostat{max-width:250px;}
    @media screen and (max-width: 1024px) {
      body #home.home.section_item_wrapper{min-height: unset !important; height: auto !important;padding-bottom: 50px;}
    }
    @media screen and (max-width: 767px) {
        body #home.home.section_item_wrapper{min-height: unset !important; height: auto !important;}
        .search_home_section{margin-top: 0px;}
        .search_home_section .row2{flex-direction: column; justify-content: space-between; padding: 0px 20px;}
        #slider{margin-top: 60px;}
        #slider .labels_wrapper{width: 100%;left: 0px;}
        #slider .container{width: 75%;}
        #slider .details_coin_wrapper{position: relative; bottom: 0px; left: 0px; margin-top: -40px; margin-bottom: 40px;}
    }
    @media screen and (max-width: 520px) {
      #slider .container{width: 55%;}
      #slider .labels_wrapper { width: 100%; left: 0px; transform: scale(0.7); top: -30px; }
      #slider .circle{width: 157px; height: 162px;}
      #slider .inner-circle .score_label{font-size: 17px;}
      #slider .inner-circle .score_value{font-size: 16px;}
    }
</style>

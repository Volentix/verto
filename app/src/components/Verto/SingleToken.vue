
   <template>
  <div class="wrapper row">
    <div class="left-area col-md-8">
      <div class="left">
        <span
          ><img
            :src="asset.icon"
            style="max-width: 30px"
            alt="image"
          />
          {{asset.type.toUpperCase()}}
          <h2>
            {{asset.type.toUpperCase()}}
            <img
              style="max-width: 30px"
              src="https://cdn.iconscout.com/icon/free/png-256/verified-badge-1-866240.png"
              alt=""
            />
          </h2>
        </span>

        <h3>
          ${{formatNumber(asset.rateUsd,0)}}<span
            style="
              font-size: 40px;
              line-height: 48px;
              font-weight: 600;
              letter-spacing: normal;
              color: #d0d0d2;
            "
            >.{{formatNumber(asset.rateUsd, 2).split('.')[1]}}</span
          >
          <span :class="asset.color">{{asset.change24hPercentage}}</span>
        </h3>

        <ul class="tab-btn">
          <li><a href="#">1H</a></li>
          <li><a href="#" class="active-tab">1D</a></li>
          <li><a href="#">1W</a></li>
          <li><a href="#">1M</a></li>
          <li><a href="#">1Y</a></li>
        </ul>
      </div>

      <div class="left left2">
        <table>
          <tr>
            <td>
              <h3>Equity <span>30.65%</span></h3>
              <h2>$27,472.<span>35</span></h2>
              <h4>16.255 ETH</h4>
            </td>

            <td class="m-left">
              <h5>
                Profit/Loss <span><i class="far fa-question-circle"></i></span>
              </h5>
              <p>+$10,648.27</p>

              <h5>24-hour Return</h5>
              <p>-$1,843.25 <span>-6.3%</span></p>
            </td>

            <td class="m-left">
              <h5>
                Average Cost <span><i class="far fa-question-circle"></i></span>
              </h5>
              <p>$597.11</p>

              <h5>
                Paid Fees <span><i class="far fa-question-circle"></i></span>
              </h5>
              <p>$1,328.49</p>
            </td>
          </tr>
        </table>
      </div>

      <div class="left left3" v-if="false">
        <h3>Stats</h3>

        <table>
          <tr>
            <td>
              <h5>1 Day</h5>
              <span style="color: #f18383; font-weight: 400">-6.3%</span>
              <h5>Market Cap</h5>
              <p>$194.6B</p>
            </td>

            <td>
              <h5>1 Month</h5>
              <span style="color: #f18383; font-weight: 400">-14.7%</span>
              <h5>Fully Diluted Value</h5>
              <p>$194.6B</p>
            </td>

            <td>
              <h5>3 Month</h5>
              <span style="color: #65d687; font-weight: 400">+176.9%</span>
              <h5>1 Year Low</h5>
              <p>$124.55</p>
            </td>

            <td>
              <h5>1 Year</h5>
              <span style="color: #65d687; font-weight: 400">+1,178.2%</span>
              <h5>1 Year High</h5>
              <p>$1,969.98</p>
            </td>
          </tr>
        </table>
      </div>

      <div class="left left3" style="border: none" v-if="false">
        <h3>Tags</h3>

        <a href="#"><span>#</span>Token</a>
      </div>

      <div class="left left4" v-if="false">
        <h3>History</h3>

        <table>
          <tr>
            <td>
              <h6>Send at $1,751.81</h6>
              <p>Mar 12, 2021, 09:56 AM</p>
            </td>

            <td class="t-right">
              <h6>-1 eth</h6>
              <p>$1751.81</p>
            </td>
          </tr>

          <tr>
            <td>
              <h6>Send at $1,735.98</h6>
              <p>Mar 12, 2021, 09:56 AM</p>
            </td>

            <td class="t-right">
              <h6>-0.299 eth</h6>
              <p>$520.79</p>
            </td>
          </tr>

          <tr>
            <td>
              <h6>Send at $1,751.81</h6>
              <p>Mar 12, 2021, 09:56 AM</p>
            </td>

            <td class="t-right">
              <h6>-0.275 eth</h6>
              <p>$1751.81</p>
            </td>
          </tr>

          <tr>
            <td>
              <h6>Send at $1,735.98</h6>
              <p>Mar 12, 2021, 09:56 AM</p>
            </td>

            <td class="t-right">
              <h6>-0.275 eth</h6>
              <p>$520.79</p>
            </td>
          </tr>

          <tr>
            <td>
              <h6>Send at $1,735.98</h6>
              <p>Mar 12, 2021, 09:56 AM</p>
            </td>

            <td class="t-right">
              <h6>-0.389 eth</h6>
              <p>$520.79</p>
            </td>
          </tr>
        </table>

        <div class="view">
          <a href="#">View more transactions</a>
        </div>
      </div>
    </div>

    <div class="right-area q-pr-lg col">
      <div class="right">
        <ul>
          <li class="active-b">
            <a href="#">Buy</a>
          </li>
          <li>
            <a href="#">Sell</a>
          </li>
        </ul>

        <form action="#" method="#">
          <div class="input-bg">
            <label>
              <div class="half">
                <p>Pay with</p>
                <input type="text" name="" placeholder="0" />
              </div>

              <div class="select-op">
                <select>
                  <option>USDC</option>
                  <option>USD Coin</option>
                  <option>Wrapped Ether</option>
                  <option>Wrapped BTC</option>
                  <option>Dai</option>
                  <option>True USD</option>
                </select>
              </div>
            </label>
          </div>
          <div class="input-bg">
            <label>
              <div>
                <p>Receive</p>
                <input type="text" name="" placeholder="0" />
              </div>

              <div class="select-eth">ETH</div>
            </label>
          </div>

          <div class="buy">
            <a href="#">BUY</a>
          </div>
        </form>
      </div>
    </div>

    <div class="col-12 col-md-12 row showhistory" v-if="$store.state.currentwallet.wallet.chain">
      <History :isMobile="false" />
    </div>
  </div>
</template>
<script>
import Formatter from '@/mixins/Formatter'
import History from '../../components/Verto/History'
export default {

  components: {
    History
  },
  props: ['asset'],
  mixins: [Formatter]

}
</script>
<style scoped>
.showhistory {
      display: block;
    width: 100%;
    height: 100%;
    z-index: 9999;
}
.wrapper {
  background: #fff;
}

.wrapper .left-area {
  background: #fff;
  float: left;
}

.left {
  background: #fff;
  margin: 20px;

  padding: 20px 0;
}

.left span img {
  vertical-align: middle;
  margin-right: 5px;
}

.left span {
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  color: #000;
}

.left ul.icon-ul {
  position: absolute;
  margin-left: auto;
  display: inline-block;
  right: 33.5%;
}

.left ul.icon-ul li {
  display: inline-block;
}

.left ul.icon-ul li i {
  font-size: 19px;
  color: #000;
  line-height: 170%;
  padding-left: 8px;
}

.left ul.icon-ul li a {
  background: transparent;
  width: 33px;
  height: 33px;
  border-radius: 50%;
  border: 1px solid #c7c7c9;
  display: inline-block;
  margin-right: 10px;
}

.left ul.tab-btn {
  margin-top: 30px;
}

.left ul.tab-btn li {
  display: inline-block;
}

.left ul.tab-btn li a {
  font-size: 12px;
  line-height: 20px;
  font-weight: 500;
  border-radius: 25px;
  background: #f8f8f8;
  padding: 0px 8px;
  color: #8a8a8f;
  height: 20px;
  display: inline-block;
  margin-right: 13px;
}

.left ul.tab-btn li .active-tab {
  background: #eb5757;
  color: #fff;
}

.left h2 {
  font-size: 40px;
  line-height: 48px;
  font-weight: 600;
  letter-spacing: normal;
  color: #000;
  margin-top: 20px;
}

.left h3 {
  font-size: 40px;
  line-height: 48px;
  font-weight: 500;
  letter-spacing: normal;
  color: #000;
  margin-top: 12px;
}

.left h3 span {
  font-size: 24px;
  line-height: 28px;
  font-weight: 400;
  color: #e65555;
}

.left table h3 {
  font-size: 20px;
  line-height: 24px;
  font-weight: 500;
  letter-spacing: normal;
  color: #000;
}

.left table h3 span {
  font-size: 11px;
  line-height: 12px;
  font-weight: 500;
  color: #000;
  padding: 4px;
  border-radius: 3px;
  background: #f4f3f5;
}

.left2 {
  border: 1px solid #e8e8e8;
  border-radius: 17px;
  padding: 30px 30px 0;
  margin: 0 20px;
  margin-bottom: 70px;
}

.left table h2 {
  font-size: 28px;
  line-height: 32px;
  font-weight: 500;
  letter-spacing: normal;
  color: #000;
  margin-top: 24px;
}

.left table h2 span {
  font-size: 28px;
  line-height: 32px;
  font-weight: 500;
  color: #d3d4d7;
}

.left table h4 {
  color: #737379;
  margin-top: 4px;
  margin-bottom: 42px;
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
}

.left table h5 {
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: #000;
}

.left table h5 i {
  color: #ceced1;
  margin-left: 5px;
}

.left table p {
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
  color: #000;
  margin: 5px 0 35px;
}

.left td > span {
  margin: 8px 0 25px;
  display: block;
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
}

.left table {
  width: 100%;
}

.left tr td {
  width: 33.33%;
}

.m-left {
  padding-left: 12%;
}

.left3 {
  border-top: 1px solid #e8e8e8;
}

.left3 tr td {
  width: 25%;
}

.left3 h3 {
  font-size: 20px;
  line-height: 24px;
  font-weight: 500;
  color: #000;
  margin-bottom: 40px;
}

.left3 a {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #000;
  border-radius: 10000px;
  padding: 3px 11px 3px 7px;
  border: 1px solid #e8e8e9;
  margin-bottom: 40px;
  display: inline-block;
}

.left3 a span {
  font-size: 18px;
  font-weight: 700;
  color: #2962ef;
  margin-right: 5px;
}

.left3 table p {
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  color: #000;
  margin: 8px 0 35px;
}

.left4 {
  border-top: 1px solid #f5f3f5;
}

.left4 tr td {
  width: 50%;
}

.left4 h3 {
  font-size: 20px;
  line-height: 24px;
  font-weight: 500;
  color: #000;
  margin-bottom: 40px;
}

.left4 h6 {
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  color: #000;
}

.left4 table p {
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  color: #8a8a8f;
}

.t-right {
  text-align: right;
}

.left4 table td {
  padding-bottom: 10px;
}

.view {
  text-align: center;
}
.left4 a {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #000;
  border-radius: 10000px;
  padding: 13px 50px;
  border: 1px solid #e8e8e9;
  margin-bottom: 40px;
  display: inline-block;
  transition: all 0.3s ease;
}

.left ul.icon-ul a:hover,
.left3 a:hover,
.left4 a:hover {
  color: #000;
  background: #e8e8e9;
}

.wrapper .right-area {
  background: #fff;
  float: left;
}

.right {
  background: #fff;
  padding: 0px 20px 20px;
  border: 1px solid #e9e9ea;
  border-radius: 12px;
  margin-top: 20px;

  box-shadow: 0 4px 16px rgba(24, 52, 123, 0.1);
}
.right ul {
  border-bottom: 1px solid #efefef;
}

.right ul li {
  display: inline-block;
  width: 48%;
  text-align: center;
}

.right ul li a {
  background: transparent;
  color: #000;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  padding: 14px;
  text-align: center;
  display: inline-block;
}

.active-b a {
  color: #2962ef !important;
}

.active-b {
  border-bottom: 2px solid #2962ef;
}

.right form .input-bg {
  padding: 8px 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: #f3f3f4;
  color: #737379;
  margin: 15px 0;
  position: relative;
}

.right form label p {
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
}

.right form input {
  background: transparent;
  border: none;
  font-size: inherit;
  font-weight: 600;
  color: #000;
  margin-top: 10px;
}

::placeholder {
  color: #737379;
  opacity: 1;
}

.half {
  width: 60%;
}

.select-op {
  font-size: 16px;
  font-weight: 500;
}

.select-op select {
  color: #000;
  font-size: 16px;
  font-weight: 600;
  width: 27%;
  position: absolute;
  right: 5px;
  top: 34px;
  font-size: 16px;
  font-weight: 500;
  background: transparent;
  border: none;
  line-height: 20px;
}

.select-eth {
  font-size: 16px;
  font-weight: 500;
  position: absolute;
  right: 5px;
  top: 34px;
  line-height: 20px;
}

.buy {
  text-align: center;
  background: transparent;
}

.buy a {
  display: block;
  font-size: 15px;
  line-height: 20px;
  font-weight: 500;
  color: #fff;
  background: #346af0;
  border-radius: 10000px;
  padding: 13px 50px;
  border: 1px solid #e8e8e9;
  margin-top: 30px;
  text-align: center;
  transition: all 0.3s ease;
}

.buy a:hover {
  color: #000;
  background: #e8e8e9;
}

@media screen and (min-width: 768px) and (max-width: 1199px) {
  .wrapper {
    width: 93.15%;
    background: #fff;
    margin: 0 15px;
  }
  .left {
    padding: 20px 0;
  }

  .right {
    padding: 20px 15px;
  }

  .m-left {
    padding-left: 4%;
  }

  .left table h2 {
    font-size: 26px;
    margin-top: 19px;
  }

  .right {
    margin-left: 15px;
  }

  .select-op select {
    width: 42%;
    font-size: 16px;
  }
}

@media screen and (max-width: 767px) {
  .wrapper {
    width: 100%;
    background: #fff;
    margin: 0 0%;
  }

  .wrapper .left-area {
    width: 100%;
    float: none;
  }

  .wrapper .right-area {
    width: 100%;
    float: none;
  }

  .left ul.icon-ul {
    right: 8px;
  }

  .left2 {
    padding: 15px;
    margin: 15px;
  }

  .left tr td {
    width: 100%;
    display: block;
    margin-bottom: 20px;
  }

  .m-left {
    padding-left: 0;
  }

  .left4 table td {
    padding-bottom: 30px;
    width: 50% !important;
    display: table-cell !important;
  }

  .right {
    margin: 15px;
  }
}
</style>

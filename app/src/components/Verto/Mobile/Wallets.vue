<template>
  <div class="list">
    <div class="item" v-for="item in 10" :key="item">
      <div class="badge">
        <div class="crypto btc">
          <svg width="20" height="20" viewBox="0 0 226 226">
            <path
              d="M183 112.9c-7.3-5.5-17.7-7.7-17.7-7.7S174 100 177.7 95c3.6-5.1 5.4-13 5.7-17.1.3-4.1 1-21.3-12.4-31.2C160.6 39 148.7 36 132.8 35V.3h-21.4v34.3H95V.3H73.7v34.3h-42v22.2H44c3.4 0 9.4.4 11.9 3.2 2.6 2.9 3 4.4 3 10v88.4c0 2.1-.4 4.7-2.2 6.4-1.8 1.7-3.6 2.1-7.9 2.1H36l-4.4 25.7h42.1v34.2h21.4v-34.2h16.3v34.2h21.4v-34.7c5.5-.3 10.7-.8 13.7-1.2 6-.8 19.9-2.4 32.8-11.4 12.9-9 15.8-23 16-37.2.4-14.2-5-24-12.3-29.4zM95 58.8s6.8-.6 13.5-.5a68 68 0 0 1 21.4 3c8.8 2.7 14 9.3 14.2 17 .2 7.9-3.2 13-9.2 16.4-6 3.3-14.3 5-22.1 5.4-7.8.3-17.8 0-17.8 0V58.8zM143 161a68 68 0 0 1-24.2 5.8c-9.5.7-23.7.4-23.7.4v-45.8s13.6-.7 24.2 0 19.5 3.4 23.5 5.4c4 2 11 6.4 11 16.9 0 10.4-6 14.6-10.8 17.3z"
            ></path>
          </svg>
        </div>
      </div>
      <div class="info">
        <div class="name">Bitcoin</div>
        <div class="alias">BTC</div>
      </div>
      <div class="money">
        <div class="current-price">56,148 $</div>
        <div class="difference green">
          <span>816.44%</span><i class="fas fa-caret-up"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style scoped>

.inspiration {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  font-family: 'Gill Sans', sans-serif;
  font-size: 12px;
  color: #969696;
}
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 550px;
  background-color: #21242c;
  overflow: hidden;
}
@media screen and (max-height: 500px) {
  .center {
    transition: transform 0.5s;
    transform: translate(-50%, -50%) scale(0.65);
  }
}
.phone {
  display: flex;
  flex-direction: column;
  background-color: #2d2d37;
}
.header {
  padding: 10px 0 15px;
  text-align: center;
  font-size: 20px;
  background-color: #2d2d37;
  color: #fff;
}
.material-icons {
  font-size: 16px;
}
.stats {
  display: grid;
  grid-template-columns: 75px 150px auto;
  padding: 7px 10px;
  color: #fff;
  font-size: 12px;
}
.stats > div {
  display: flex;
  align-items: center;
  justify-content: center;
}
.stats .indicators {
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
}
.stats .wifi {
  margin-left: auto;
}
.battery:after {
  content: "";
  display: block;
  height: 6px;
  width: 17px;
  background: #fff;
  float: right;
  margin: 2px 3px 0px 6px;
  box-shadow: 0px 0px 0px 1px rgba(255,255,255,0.7);
}
.battery:before {
  content: "";
  display: block;
  height: 2px;
  width: 1px;
  background: rgba(255,255,255,0.9);
  float: right;
  position: relative;
  top: 4px;
  right: 2px;
  box-shadow: 0px 0px 0px 1px rgba(255,255,255,0.3);
}
.crypto svg {
  fill: #fff;
}
.btc svg {
  transform: rotate(20deg);
}
.item {
  display: grid;
  grid-template-columns: 1.4fr 2fr 2.2fr;
  padding: 8px 15px;
  margin: 20px;
  border-radius: 5px;
  background-color: #2d2d37;
  color: #fff;
  cursor: pointer;
}
.item > * {
  align-self: center;
}
.item .badge {
  width: 30px;
  height: 30px;
  background-image: linear-gradient(to top, #3d3e49, #555);
  border-radius: 7px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.item .alias,
.item .difference {
  margin-top: 3px;
}
.item .money {
  text-align: right;
  margin-right: 20px;
}
.item .difference.green {
  color: #7cfc00;
}
.item .difference.red {
  color: #f00;
}
.item .difference i {
  margin-left: 3px;
}
.item .arrow {
  text-align: right;
  font-size: 15px;
}

</style>

<template>
  <div class="wrapper">
   <span v-if="loading">Loading NFTS...</span>
   <p class="q-pb-lg" v-else-if="!loading && nfts.length == 0"> No NFTs found on Ethereum</p>
   <q-linear-progress class="q-pb-lg" indeterminate v-if="loading" color="grey" />
    <div class="part1" v-if="false">
      <div class="heading">
        <h2 class="q-pa-none q-ma-none">Explore ⚡</h2>
      </div>
      <div class="buttons-wrap">
        <div class="buttons" v-if="false">
          <a href="#" class="blac-btn">All</a>
          <a href="#">🌈 Art</a>
          <a href="#">📸 Photography</a>
          <a href="#">👾 Metaverses</a>
        </div>
        <div class="filter">
          <label class="dropdown">
            <div class="dd-button">
              <span
                ><svg
                  viewBox="0 0 24 24"
                  fill="none"
                  width="22"
                  height="22"
                  xlmns="http://www.w3.org/2000/svg"
                  style="vertical-align: middle"
                >
                  <path
                    d="M20 16L12 16"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M6 16L4 16"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M20 8L18 8"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M12 8L4 8"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <circle cx="9" cy="16" r="3" fill="currentColor"></circle>
                  <circle cx="15" cy="8" r="3" fill="#000"></circle></svg
                >Filter &amp; Sort</span
              >
            </div>

            <input type="checkbox" class="dd-input" id="test" />

            <ul class="dd-menu">
              <p class="namee">Sort by</p>
              <p>
                <input type="radio" id="test1" name="radio-group" checked="" />
                <label for="test1">Recently added</label>
              </p>
              <p>
                <input type="radio" id="test2" name="radio-group" />
                <label for="test2">cheapest</label>
              </p>
              <p>
                <input type="radio" id="test3" name="radio-group" />
                <label for="test3">Highest price</label>
              </p>

              <p>
                <input type="radio" id="test4" name="radio-group" />
                <label for="test4">Most liked</label>
              </p>

              <p class="namee">Options</p>
              <div class="switch_box box_1">
                verified only
                <input type="checkbox" class="switch_1" checked="" />
              </div>
            </ul>
          </label>
        </div>
      </div>
    </div>

    <div class="part2 row q-col-gutter-md">
      <div class="part2-main col-md-4" v-for="(nft, index) in nfts" :key="index">
        <div class="wrap-content">
          <div class="main-top">
            <div class="mt-img" v-if="false">
              <img src="https://images.rarible.com/?fit=outsize&n=-1&url=https%3A%2F%2Fipfs.rarible.com%2Fipfs%2FQmUNbMmMtbzP5ZwpQ7X77cNEqR5DvEmDYqWvw1QQkx7nbE&w=100" alt="img" />
              <img src="https://images.rarible.com/?fit=outsize&n=-1&url=https%3A%2F%2Fipfs.rarible.com%2Fipfs%2FQmYBra8T5BNmph65g4FYqbDxrydyDK1rU5u6PW1AK3PZpM&w=100" alt="img" class="ml-l" />
              <img src="https://images.rarible.com/?fit=outsize&n=-1&url=https%3A%2F%2Fipfs.rarible.com%2Fipfs%2FQmSd3TEEAJv7DrYXaaWmNojUGwm88GGRuRTqkkjWis6DgV&w=100" alt="img" class="ml-l" />

              <svg
                class="svg-f"
                width="16"
                height="16"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.78117 0.743103C5.29164 -0.247701 6.70826 -0.247701 7.21872 0.743103C7.52545 1.33846 8.21742 1.62509 8.8553 1.42099C9.91685 1.08134 10.9186 2.08304 10.5789 3.1446C10.3748 3.78247 10.6614 4.47445 11.2568 4.78117C12.2476 5.29164 12.2476 6.70826 11.2568 7.21872C10.6614 7.52545 10.3748 8.21742 10.5789 8.8553C10.9186 9.91685 9.91685 10.9186 8.8553 10.5789C8.21742 10.3748 7.52545 10.6614 7.21872 11.2568C6.70826 12.2476 5.29164 12.2476 4.78117 11.2568C4.47445 10.6614 3.78247 10.3748 3.1446 10.5789C2.08304 10.9186 1.08134 9.91685 1.42099 8.8553C1.62509 8.21742 1.33846 7.52545 0.743103 7.21872C-0.247701 6.70826 -0.247701 5.29164 0.743103 4.78117C1.33846 4.47445 1.62509 3.78247 1.42099 3.1446C1.08134 2.08304 2.08304 1.08134 3.1446 1.42099C3.78247 1.62509 4.47445 1.33846 4.78117 0.743103Z"
                  fill="#feda03"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.43961 4.23998C8.64623 4.43922 8.65221 4.76823 8.45297 4.97484L5.40604 8.13462L3.54703 6.20676C3.34779 6.00014 3.35377 5.67113 3.56039 5.47189C3.76701 5.27266 4.09602 5.27864 4.29526 5.48525L5.40604 6.63718L7.70475 4.25334C7.90398 4.04672 8.23299 4.04074 8.43961 4.23998Z"
                  fill="#000000"
                ></path>
              </svg>
            </div>

            <div v-if="false">
              <h6>
                <label class="dropdown">
                  <div class="dd-button">
                    <i class="fas fa-ellipsis-h" aria-hidden="true"></i>
                  </div>

                  <input type="checkbox" class="dd-input" id="test" />

                  <ul class="dd-menu">
                    <li><a href="#">Purchase now</a></li>
                    <li><a href="#">Place a bid</a></li>
                    <li><a href="#">View on OpenSea</a></li>
                    <li><a href="#">Share</a></li>
                    <li><a href="#">Report</a></li>
                  </ul>
                </label>
              </h6>
            </div>
          </div>
          <div class="mid-img">
            <q-img style="height:300px" :src="nft.assetImg" alt="img" class="mid-img" />
          </div>

          <h4>{{nft.assetName}}</h4>
          <h5>USD {{formatNumber(nft.balanceUSD,2)}}</h5>
          <h2 class="q-pa-none q-ma-none" v-if="false">
            <a href="#">Place a bid</a>
            <span
              ><a href="#"
                ><i class="far fa-heart" aria-hidden="true"></i>45</a
              ></span
            >
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Formatter from '@/mixins/Formatter'
import Lib from '@/util/walletlib'
export default {
  mixins: [Formatter],
  data () {
    return {
      nfts: [],
      loading: true
    }
  },
  created () {
    let wallets = Lib.getWallets('eth')
    wallets.forEach(async (element, i) => {
      let v = await Lib.fetchNfts(element.key)
      this.nfts = this.nfts.concat(v)
      if (i === wallets.length - 1) {
        this.loading = false
      }
    })
  }
}
</script>

<style scoped>
* {
   font-family: "Poppins-Medium";
}
.wrapper {
  width: 99%;

  padding: 0 32px;
  padding-bottom: 30px;
}
.wrapper {
    height: auto !important;
    padding-bottom: 10px;
    background: #04121f !important;
}
.part1 {
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(150px,auto));
    grid-gap: 20px;
    padding: 35px 0 10px;
}

.buttons-wrap {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(min-content, max-content);

    grid-template-columns: repeat(auto-fit,minmax(150px,auto));
    grid-gap: 4px;
    margin-bottom: 24px;
}

.heading h2 {
  font-size: 30px;
  font-weight: 900;
}

.buttons-wrap a {
  display: inline-block;
  padding: 10px 19px;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 900;
  transition: all 0.12s ease-in-out 0s;
  transform-origin: center center 0px;
  background: rgb(255, 255, 255) none repeat scroll 0% 0%;
  border: 1px solid rgba(4, 4, 5, 0.1);
  line-height: 16px;
  color: rgb(4, 4, 5);
  margin: 0 3px;
  transition: all 0.2s ease;
}

.buttons-wrap a:hover {
  background: #000;
  color: #fff;
}

.buttons-wrap span {
  display: inline-block;
  padding: 10px 19px;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 900;
  transition: all 0.12s ease-in-out 0s;
  transform-origin: center center 0px;
  background: rgb(255, 255, 255) none repeat scroll 0% 0%;
  border: 1px solid rgba(4, 4, 5, 0.1);
  line-height: 16px;
  color: rgb(4, 4, 5);
  margin: 0 3px;
  transition: all 0.2s ease;
}

.filter .dd-menu {
    position: absolute;
    top: 55px;
    border-radius: 8px;
    padding: 20px 10px;
    margin: 2px 0 0 0;
    box-shadow: rgba(4, 4, 5, 0.2) 0px 7px 36px -8px;
    background-color: #ffffff;
    list-style-type: none;
    right: -18px;
    width: 200px;
    z-index: 99;
}

[type="radio"]:checked,
[type="radio"]:not(:checked) {
    position: absolute;
    left: -9999px;
}
[type="radio"]:checked + label,
[type="radio"]:not(:checked) + label
{
    position: relative;
    padding-left: 28px;
    cursor: pointer;
    line-height: 20px;
    display: inline-block;
    color: #666;
}

[type="radio"]:checked + label:after,
[type="radio"]:not(:checked) + label:after {
    content: '';
display: block;
position: absolute;
top: 2px;
right: 6px;
width: 4px;
height: 11px;
border: solid #0079bf;
border-width: 0 2px 2px 0;
transform: rotate(45deg);
 -webkit-transition: all 0.2s ease;
 transition: all 0.2s ease;
}
[type="radio"]:not(:checked) + label:after {
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
}
[type="radio"]:checked + label:after {
    opacity: 1;
}

.filter .dd-menu ul p {
    padding: 10px 20px;
    cursor: pointer;
    white-space: nowrap;
    border-radius: 5px;
}

.filter .dd-menu label {
    display: block;
    /*! margin: -10px -20px; */
    padding: 0px 0px;
    font-weight: 700;
    font-size: 14px;
    color: #000;
    border-radius: 5px;
    border: none;
}

.filter .dd-menu p {
    display: block;
    /*! margin: -10px -20px; */
    padding: 8px 12px;
    font-weight: 700;
    font-size: 14px;
    color: #818182;
    border-radius: 5px;
    border: none;
}

/* Switch 1 Specific Styles Start */

.box_1{
  background: #fff;
  font-weight: 700;
    font-size: 14px;
    color: #000;
  margin-left: 10px;
}

input[type="checkbox"].switch_1{
  font-size: 30px;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  width: 28px;
  height: 16px;
  background: #ddd;
  border-radius: 3em;
  position: relative;
  cursor: pointer;
  outline: none;
  -webkit-transition: all .2s ease-in-out;
  transition: all .2s ease-in-out;
  margin-left: 26%;
  margin-top: 5px;
  }

  input[type="checkbox"].switch_1:checked{
  background: rgb(0, 102, 255);
  }

  input[type="checkbox"].switch_1:after{
  position: absolute;
  content: "";
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  -webkit-box-shadow: 0 0 .25em rgba(0,0,0,.3);
          box-shadow: 0 0 .25em rgba(0,0,0,.3);
  -webkit-transform: scale(.7);
          transform: scale(.7);
  left: 4px;
  -webkit-transition: all .2s ease-in-out;
  transition: all .2s ease-in-out;
  top: 2px;
  }

  input[type="checkbox"].switch_1:checked:after{
  left: calc(100% - 0.45em);
  }

/* Switch 1 Specific Style End */

/*
.part2-main .main-top {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(min-content, max-content);
  grid-gap: 4px;
  position: relative;
}
*/

.part2-main .main-top h6 {
 transition: all 0.12s ease-in-out 0s;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  position: absolute;
  right: 0;
}

.part2-main .main-top h6 i {
  position: absolute;
 right: -23px;
 font-size: 15px;
 color: #818182;
  top: -1px;
}

.part2-main .main-top h6:hover {
    color: rgb(4, 4, 5);
    background: rgba(4, 4, 5, 0.06) none repeat scroll 0% 0%;
}

.part2-main .main-top h6:hover i {
    color: #000;

  }

.part2-main .mt-img img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-top: 3px;
}

.svg-f {

  bottom: 0;
  margin-left: -11px;
}

.mt-img .ml-l {
  margin-left: -14px;
}

.mid-img{
display: flex;
-moz-box-align: center;
align-items: center;
-moz-box-pack: center;
justify-content: center;
min-width: 100%;
}

.mid-img img {
  width: 100%;
  border-radius: 6px;
  margin: 8px 0;
}

.wrap-content {
 padding: 23px 23px;
    border: 1px solid #0a1830;
    border-radius: 16px;
    transition: all 0.2s ease-in-out;
    position: relative;
    z-index: 9;
    background: #0a1830;
}
.part2-main {

  border-radius: 16px;
  transition: all 0.2s ease-in-out;

}

.part2-main:hover {
  box-shadow: 0px 4px 8px rgba(46, 63, 116, 0.1);
}

.part2-main h4 {
  font-size: 15px;
  line-height: 20.7px;

  font-weight: 900;
  display: block;
  letter-spacing: -0.2px;
  color: #e7e7e7;

}

.part2-main h5 {
     font-size: 18px;
    line-height: 20.7px;

    font-weight: 900;
    display: block;
    letter-spacing: -0.2px;
    color: #fff;
    margin: 5px 0 0;

}

.part2-main h5 span {
  color: #818182;
  margin-left: 10px;
  font-weight: 700;

}

.part2-main h2 {
  position: relative;
}

.part2-main h2 a {
  font-size: 13px;
  line-height: 1.26;
  font-weight: 600;
  letter-spacing: normal;
  color: #006BFF;
}

.part2-main h2 span a {
  color: rgba(4, 4, 5, 0.5);
  font-size: 15px;
  line-height: 16.56px;
  font-weight: 700;
  padding: 10px 12px;
  border-radius: 99999px;
  border: none;
  outline: none;
  background: transparent;
  position: absolute;
  right: 0px;
  z-index: 1;
  transition: all 0.2s ease-in-out;
  top: 0px;
}

.part2-main h2 span a i {
  margin-right: 5px;
  font-weight: 500;
}

.part2-main h2 span a:hover {
  background: #F0F0F0;
  color: #000;
}

.botton-b{
    z-index: 0;
    inset: 0px;
    position: absolute;
    width: 100%;
    height: 40px;
    /*! background: black; */
    top: 93%;
    left: 0;
}

.botton-b::before, .botton-b::after {
    position: absolute;
    height: 40px;
    display: block;
    background: rgb(255, 255, 255) none repeat scroll 0% 0%;
    border-radius: 16px;
    border: 1px solid rgba(4, 4, 5, 0.1);
    content: "";
    width: 96%;
}

.botton-b::before {
    bottom: 8px;
    z-index: 1;
    left: 4px;
}

.botton-b::after {
    bottom: 5px;
    z-index: 0;
    left: 8px;
    width: 93%;
}

.buttons .blac-btn {
  background: #000;
  color: #fff;
}

/* Dropdown */

.dropdown {
  display: inline-block;
  position: relative;
}

.dd-input {
  display: none;
}

.dd-menu {
  position: absolute;
  top: 30px;
  border-radius: 8px;
  padding: 20px 10px;
  margin: 2px 0 0 0;
  box-shadow: rgba(4, 4, 5, 0.2) 0px 7px 36px -8px;
  background-color: #ffffff;
  list-style-type: none;
  right: -30px;
  width: 200px;
  z-index: 99;
}

.dd-input + .dd-menu {
  display: none;
}

.dd-input:checked + .dd-menu {
  display: block;
}

.dd-menu li {
  padding: 10px 20px;
  cursor: pointer;
  white-space: nowrap;
  border-radius: 5px;
}

.dd-menu li:hover {
  background-color: #f6f6f6;
}

.dd-menu li a {
  display: block;
  margin: -10px -20px;
  padding: 8px 12px;
  font-weight: 700;
  font-size: 14px;
  color: #000;
  border-radius: 5px;
  border: none;
}

@media screen and (min-width: 768px) and (max-width: 1199px) {

.wrapper {
    width: 96%;
}

.part1 {
    display: block;
  }

.buttons-wrap a{
    display: inline-block;
    padding: 7px 9px;
    border-radius: 40px;
    font-size: 12px;
    font-weight: 700;
    transition: all 0.12s ease-in-out 0s;
    transform-origin: center center 0px;
    background: rgb(255, 255, 255) none repeat scroll 0% 0%;
    border: 1px solid rgba(4, 4, 5, 0.1);
    line-height: 16px;
    color: rgb(4, 4, 5);
    margin: 6px 1px;
}

.buttons-wrap {
    display: block;
  }
.wrap-content {
    padding: 23px 10px;
}

.mid-img {
    min-height: 130px;
    min-width: 100%;
}

.mid-img img {
    width: 100%;
    border-radius: 6px;
    margin: 29px 0;
}

.part2-main h4 {
    font-size: 13px;
    }

.part2-main h5 {
    font-size: 13px;
    }
.part2-main h2 a {
    font-size: 10px;
}
.part2-main h2 span a {
    font-size: 10px;
    padding: 3px 12px;
    top: 8px;
}

.botton-b {
    left: -3px;
    margin-top: -8px;
}

}

@media screen and (min-width: 1900px) and (max-width: 3000px) {

.botton-b {
    top: 95.5%;
    left: 4px;
}

}

@media screen and (min-width: 1200px) and (max-width: 1355px) {

.buttons-wrap a {
    display: inline-block;
    padding: 10px 9px;

}

}

@media screen and (min-width: 992px) and (max-width: 1199px) {

.buttons-wrap {
    display: grid;
}

.mid-img {
    min-height: 190px;
    min-width: 100%;
}

.botton-b {
    left: -2px;
    margin-top: -5px;
}

.buttons-wrap a {
    padding: 7px 9px;
    font-size: 14px;
    margin: 6px 1px;
}

}

@media screen and (max-width: 767px) {

.wrapper {
    width: 100%;
    background: #fff;
    margin: 0 0%;
    padding: 0 15px;
}

.part1 {
    display: block;
  }

.buttons-wrap a{
    display: inline-block;
    padding: 5px 6px;
    border-radius: 40px;
    font-size: 10px;
    font-weight: 700;
    transition: all 0.12s ease-in-out 0s;
    transform-origin: center center 0px;
    background: rgb(255, 255, 255) none repeat scroll 0% 0%;
    border: 1px solid rgba(4, 4, 5, 0.1);
    line-height: 16px;
    color: rgb(4, 4, 5);
    margin: 6px 1px;
}

.buttons-wrap {
    display: block;
  }

.part2 {
    display: block;
  }

.part2-main {

  border-radius: 16px;
  transition: all 0.2s ease-in-out;
  position: relative;
  margin-bottom: 20px;
}

.filter .dd-menu {
    position: absolute;
    top: 55px;
    border-radius: 8px;
    padding: 20px 10px;
    margin: 2px 0 0 0;
    box-shadow: rgba(4, 4, 5, 0.2) 0px 7px 36px -8px;
    background-color: #ffffff;
    list-style-type: none;
    right: -43px;
    width: 200px;
    z-index: 99;
}

}
</style>

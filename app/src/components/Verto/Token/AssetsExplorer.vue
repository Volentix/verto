<template>
  <div class="wrapper q-px-lg">
    <div class="top-part-all"  v-if="false">>
      <div class="text-h6">Invest</div>
      <div class="top-4part">
        <a href="#">
          <div class="top-part top-part1">
            <h4>Top Gainers</h4>
          </div>
        </a>

        <a href="#">
          <div class="top-part top-part2">
            <h4>Top Losers</h4>
          </div> </a
        ><a href="#">
          <div class="top-part top-part3">
            <h4>Market</h4>
          </div>
        </a>
        <a href="#">
          <div class="top-part top-part4">
            <h4>Pools</h4>
          </div>
        </a>
      </div>
    </div>

<div v-for="(item, index) in 6" :key="item">
    <div class="sub-top">
      <div class="subt-text">
        <h3>Token category #{{index}}</h3>
        <p>Category subtitle</p>
      </div>

      <div class="see-text">
        <a href="#">See all</a>
      </div>
    </div>

    <div class="small-grid">

      <div class="main" v-for="i in 4" :key="i">
        <div class="main-top">
          <div class="mt-img">
            <img src="https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png" alt="img" />
          </div>

          <div>
            <h6>
              WBTC<svg viewBox="0 0 32 32" fill="none" style="width: 20px; height: 20px; vertical-align: middle; margin-left: 0px;"><path d="M15.705 4.215a.5.5 0 01.59 0l2.725 1.988a.5.5 0 00.296.096l3.373-.007a.5.5 0 01.477.347l1.036 3.21a.5.5 0 00.182.251l2.733 1.978a.5.5 0 01.182.56l-1.048 3.207a.5.5 0 000 .31l1.048 3.206a.5.5 0 01-.182.561L24.384 21.9a.5.5 0 00-.182.251l-1.037 3.21a.5.5 0 01-.476.346l-3.373-.006a.5.5 0 00-.296.096l-2.725 1.988a.5.5 0 01-.59 0l-2.725-1.988a.5.5 0 00-.296-.096l-3.373.006a.5.5 0 01-.476-.346l-1.037-3.21a.5.5 0 00-.182-.251l-2.733-1.978a.5.5 0 01-.182-.56l1.048-3.207a.5.5 0 000-.31l-1.048-3.207a.5.5 0 01.182-.56L7.616 10.1a.5.5 0 00.182-.251l1.037-3.21a.5.5 0 01.476-.347l3.373.007a.5.5 0 00.296-.096l2.725-1.988z" fill="url(#verified_svg__paint0_linear)"></path><path opacity="0.5" d="M16 4.619l2.725 1.988a1 1 0 00.591.192l3.374-.007 1.036 3.21a1 1 0 00.365.503l2.733 1.978-1.048 3.206a.999.999 0 000 .622l1.048 3.206-2.733 1.977a1 1 0 00-.365.503l-1.036 3.21-3.374-.006a1 1 0 00-.59.192L16 27.381l-2.725-1.988a1 1 0 00-.591-.192l-3.374.006-1.036-3.21a1 1 0 00-.365-.503l-2.733-1.977 1.048-3.206a1 1 0 000-.622l-1.048-3.206 2.733-1.978-.293-.405.293.405a1 1 0 00.365-.502l1.036-3.21 3.374.006a1 1 0 00.59-.192L16 4.619z" stroke="url(#verified_svg__paint1_linear)"></path><g filter="url(#verified_svg__filter0_d)"><path d="M21.506 11.464a.677.677 0 00-.948.001l-6.745 6.636-2.378-2.334a.675.675 0 00-.946.963L13.813 20l7.695-7.57a.677.677 0 00-.002-.966z" fill="#fff"></path><path d="M21.506 11.464a.677.677 0 00-.948.001l-6.745 6.636-2.378-2.334a.675.675 0 00-.946.963L13.813 20l7.695-7.57a.677.677 0 00-.002-.966z" stroke="#fff" stroke-width="0.5"></path></g><defs><linearGradient id="verified_svg__paint0_linear" x1="6.4" y1="5.2" x2="25.6" y2="26.2" gradientUnits="userSpaceOnUse"><stop stop-color="#376DF3"></stop><stop offset="1" stop-color="#1E56E0"></stop></linearGradient><linearGradient id="verified_svg__paint1_linear" x1="7" y1="4" x2="24.4" y2="26.8" gradientUnits="userSpaceOnUse"><stop stop-color="#2D61E1"></stop><stop offset="1" stop-color="#1549CA"></stop></linearGradient><filter id="verified_svg__filter0_d" x="8.037" y="10.021" width="15.922" height="13.33" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="1"></feOffset><feGaussianBlur stdDeviation="1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter></defs></svg>
            </h6>
          </div>
        </div>

        <p>Price</p>
        <h2>
          $79 <span class="g-txt">.93</span> <span class="sr-txt">↓ 1.3%</span>
          <a href="#">Trade</a>
        </h2>
      </div>

    </div>
</div>
    <div class="small-grid">
      <div class="main">
        <div class="main-top">
          <div class="mt-img">
            <img src="img/1.png" alt="img" />
          </div>

          <div>
            <h6>
              Cryptocurrency Top 10 Tokens piee Index<img
                src="img/check.png"
                alt="image"
              />
            </h6>
          </div>
        </div>

        <p>Price</p>
        <h2>
          $79 <span class="g-txt">.93</span> <span class="sr-txt">↓ 1.3%</span>
          <a href="#">Trade</a>
        </h2>
      </div>

      <div class="main">
        <div class="main-top">
          <div class="mt-img">
            <img src="img/10.png" alt="img" />
          </div>

          <div>
            <h6>Top 10 Index<img src="img/check.png" alt="image" /></h6>
          </div>
        </div>

        <p>Price</p>
        <h2>
          $79 <span class="g-txt">.93</span> <span class="sr-txt">↓ 1.3%</span>
          <a href="#">Trade</a>
        </h2>
      </div>

      <div class="main">
        <div class="main-top">
          <div class="mt-img">
            <img src="img/9.png" alt="img" />
          </div>

          <div>
            <h6>Cryptocurrency Index<img src="img/check.png" alt="image" /></h6>
          </div>
        </div>

        <p>Price</p>
        <h2>
          $99 <span class="g-txt">.93</span> <span class="sg-txt">↑ 1.3%</span>
          <a href="#">Trade</a>
        </h2>
      </div>
    </div>

    <div class="sub-top">
      <div class="subt-text">
        <h3>All Tags</h3>
      </div>
    </div>

    <div class="tags-wrap">
      <a href="#"><span>#</span>1inch</a>
      <a href="#"><span>#</span>Aave</a>
      <a href="#"><span>#</span>Balancer</a>
      <a href="#"><span>#</span>Bancor</a>
      <a href="#"><span>#</span>Bitcoin</a>
      <a href="#"><span>#</span>Compound</a>
      <a href="#"><span>#</span>Curve</a>
      <a href="#"><span>#</span>DODO</a>
      <a href="#"><span>#</span>Bancor</a>
      <a href="#"><span>#</span>Bitcoin</a>
      <a href="#"><span>#</span>Compound</a>
      <a href="#"><span>#</span>Curve</a>
      <a href="#"><span>#</span>DODO</a>

      <a href="#"><span>#</span>1inch</a>
      <a href="#"><span>#</span>Aave</a>
      <a href="#"><span>#</span>Balancer</a>
      <a href="#"><span>#</span>Bancor</a>
      <a href="#"><span>#</span>Bitcoin</a>
      <a href="#"><span>#</span>Compound</a>
      <a href="#"><span>#</span>Curve</a>
      <a href="#"><span>#</span>DODO</a>
      <a href="#"><span>#</span>Bancor</a>
      <a href="#"><span>#</span>Bitcoin</a>
      <a href="#"><span>#</span>Compound</a>
      <a href="#"><span>#</span>Curve</a>
      <a href="#"><span>#</span>DODO</a>

      <a href="#"><span>#</span>1inch</a>
      <a href="#"><span>#</span>Aave</a>
      <a href="#"><span>#</span>Balancer</a>
      <a href="#"><span>#</span>Bancor</a>
      <a href="#"><span>#</span>Bitcoin</a>
      <a href="#"><span>#</span>Compound</a>
      <a href="#"><span>#</span>Curve</a>
      <a href="#"><span>#</span>DODO</a>
      <a href="#"><span>#</span>Bancor</a>
      <a href="#"><span>#</span>Bitcoin</a>
      <a href="#"><span>#</span>Compound</a>
      <a href="#"><span>#</span>Curve</a>
      <a href="#"><span>#</span>DODO</a>

      <a href="#"><span>#</span>1inch</a>
      <a href="#"><span>#</span>Aave</a>
      <a href="#"><span>#</span>Balancer</a>
      <a href="#"><span>#</span>Bancor</a>
      <a href="#"><span>#</span>Bitcoin</a>
      <a href="#"><span>#</span>Compound</a>
      <a href="#"><span>#</span>Curve</a>
      <a href="#"><span>#</span>DODO</a>
      <a href="#"><span>#</span>Bancor</a>
      <a href="#"><span>#</span>Bitcoin</a>
      <a href="#"><span>#</span>Compound</a>
      <a href="#"><span>#</span>Curve</a>
      <a href="#"><span>#</span>DODO</a>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.wrapper {
  background: #fff;

  padding-bottom: 80px;
}

.top-4part {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, auto));
  grid-gap: 20px;
}
.wrapper .top-part-all {
  width: 100%;
  background: #fff;

}

.top-part-all h2 {
  display: block;
  font-family: "Rubik", sans-serif;
  font-size: 40px;
  line-height: 48px;
  font-weight: 600;
  letter-spacing: -1px;
  color: #000;
  margin-top: 24px;
}

.wrapper .top-4part a {
  color: #fff;
}

.wrapper .top-part {
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  background-repeat: no-repeat;
  background-size: 80px 60px;
  background-position: bottom right;
}

.sub-top {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(min-content, max-content);

  grid-template-columns: repeat(auto-fit, minmax(150px, auto));
  grid-gap: 4px;
  margin-bottom: 24px;
}

.sub-top h3 {
  font-size: 24px;
  line-height: 28px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: #000;
}

.sub-top p {
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: -0.2px;
  color: #a1a1a5;
  word-break: break-word;
  margin-top: 6px;
}

.see-text {
  text-align: right;
  position: relative;
}

.see-text a {
  text-align: right;
  position: absolute;
  bottom: 0;
  right: 0;
}

.see-text a:hover {
  text-decoration: underline;
}

.main-top {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(min-content, max-content);
  grid-gap: 4px;
}

.mt-img img {
  width: 40px;
}

.main-top h6 img {
  width: 24px;
  vertical-align: middle;
}

.small-grid {
  display: grid;
  grid-auto-flow: column;
  grid-gap: 30px;
  grid-auto-columns: 22.6%;
  -moz-box-align: center;
  align-items: center;
  -moz-box-pack: initial;
  justify-content: initial;
  margin-bottom: 24px;
}

.main {
  padding: 23px;
  border: 1px solid #e8e8e9;
  border-radius: 12px;
  transition: all 0.2s ease-in-out;
}

.main:hover {
  box-shadow: 0px 4px 8px rgba(46, 63, 116, 0.1);
}

.main h6 {
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: -0.6px;
  color: #000;
  word-break: break-word;
  margin-top: 10px;
  margin-left: 7px;
}

.main p {
  display: block;
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  letter-spacing: -0.2px;
  color: #a1a1a5;
}

.main h2 {
  font-size: 28px;
  line-height: 32px;
  font-weight: 500;
  letter-spacing: -0.4px;
  color: #000;
  word-break: break-word;
  position: relative;
}

.main .g-txt {
  color: #d0d0d2;
}

.main .sr-txt {
  color: #eb5757;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: -0.6px;
  font-family: "Roboto";
}

.main .sg-txt {
  color: #1cc760;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: -0.6px;
  font-family: "Roboto", sans-serif;
}

.main h2 a {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: normal;
  height: 36px;
  padding: 1px 24px;
  border-radius: 99999px;
  border: none;
  outline: none;
  background-color: #2962ef;
  color: #fff;
  position: absolute;
  right: 0px;
  z-index: 1;
  opacity: 0;
  transition: all 0.2s ease-in-out;
}

.main h2 a::before {
  content: "";
  display: block;
  width: 20px;
  height: 40px;
  position: absolute;
  left: -21px;
  background-image: linear-gradient(
    270deg,
    rgb(255, 255, 255) 54.69%,
    rgba(255, 255, 255, 0) 100%
  );
}

.main h2 a:hover {
  opacity: 1;
}

.tags-wrap a {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #000;
  border-radius: 10000px;
  padding: 3px 11px 3px 7px;
  border: 1px solid #e8e8e9;
  margin-right: 12px;
  margin-bottom: 16px;
  display: inline-block;
}

.tags-wrap a span {
  font-size: 18px;
  font-weight: 700;
  color: #2962ef;
  margin-right: 5px;
}

@media screen and (min-width: 768px) and (max-width: 1199px) {
  .wrapper {
    width: 93.15%;
    background: #fff;
    margin: 0 15px;
  }
}

@media screen and (max-width: 767px) {
  .wrapper {
    width: 100%;
    background: #fff;
    margin: 0 0%;
    padding: 0 15px;
  }

  .sub-top {
    display: grid;
    grid-auto-flow: revert;
    grid-gap: 21px;
    margin-bottom: 24px;
  }

  .small-grid {
    display: block;
    margin-bottom: 50px;
  }

  .main {
    margin-bottom: 20px;
  }

  .tags-wrap a {
    margin-right: 4px;
  }
}
</style>

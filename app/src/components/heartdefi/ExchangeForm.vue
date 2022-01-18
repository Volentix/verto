<template>
  <div>
    <div class="Search">
      <form action="#" method="POST">
        <i class="fas fa-search"></i>
        <input type="search" name="search" placeholder="Search Crypto" />
      </form>
    </div>
    <div class="Exchange-area">
      <h3>Exchange</h3>
      <div class="Exchange_parttop">
        <div class="Exchange_parttop_a">
          <div class="Exchange_parttop_a1">
            <div class="Exchange-part">
              <div class="mainexch-eth-left">
                <img
                  :src="require('assets/heartdefi/img/Ethereum-ETH-icon.png')"
                  alt="images not found " />
                <p>ETH</p>
              </div>
              <div class="mainexch-eth-inner">
                <i class="fas fa-chevron-down"></i>
              </div>
              <div class="mainexch-eth-right">
                <input type="text" name="" placeholder="9,39" />
                <p>$2196.563</p>
              </div>
            </div>

            <div class="Exchange-part newExchange-part">
              <div class="mainexch-eth-left">
                <img
                  :src="require('assets/heartdefi/img/hex-hex.png')"
                  alt="images not found " />
                <p>BNB</p>
              </div>
              <div class="mainexch-eth-inner">
                <i class="fas fa-chevron-down"></i>
              </div>
              <div class="mainexch-eth-right">
                <input type="text" name="" placeholder="64,01" />
                <p>$2036.563</p>
              </div>
            </div>
          </div>
          <div class="Exchange_parttop_a2">
            <img
              :src="require('assets/heartdefi/img/hex-hex.png')"
              alt="images not found" />
          </div>
        </div>
      </div>
      <div class="Connect-Wallet">
        <a href="" @click.prevent="">Connect Wallet</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mixins: [],
  components: {},
  data () {
    return {}
  },
  watch: {},
  computed: {},
  created () {},
  mounted () {},
  methods: {},
  destroyed () {}
}
</script>

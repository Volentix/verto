<template>
  <div>
    <div class="Search" v-if="!hideForm">
      <form action="#" method="POST">
        <i class="fas fa-search"></i>
        <q-input @input="search()" v-model="input" type="search" name="search" placeholder="Enter address" />
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
                  src="data:image/jpeg;base64,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"
                  alt="images not found " />
                <p>PLS</p>
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
                  :src="require('assets/Heartdefi/img/hex-hex.png')"
                  alt="images not found " />
                <p>HEX</p>
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
          <div class="Exchange_parttop_a2 cursor-pointer">
            <img
              src="https://icons.veryicon.com/png/o/miscellaneous/fs-icon/switch-38.png"
               />
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
import Lib from '@/util/walletlib'
import Connect from '../../mixins/Connect'
export default {
  mixins: [Connect],
  props: ['hideForm'],
  components: {},
  data () {
    return {
      input: null
    }
  },
  watch: {},
  computed: {},
  created () {},
  mounted () {},
  methods: {
    search () {
      if (this.input && this.input.length) {
        if (Lib.isEthValidAddress(this.input)) {
          this.connect('address', { address: this.input })
        }
      }
    }
  },
  destroyed () {}
}
</script>

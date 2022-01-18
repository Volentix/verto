<template>
  <div>
    <template v-if="type == 1">
      <div class="defi-area1">
        <div class="defi-part">
        <div class="defi-left">
            <h2>DeFI Indexes</h2>
            <p>Tokenized baskets of high quality DeFi projects</p>
        </div>
        <div class="defi-right">
            <p><a href="#">See all</a></p>
        </div>
        </div>
      </div>

      <div class="dndefi-area">
        <div class="dndefi-part">
          <div class="dndefi-a1">
            <h2><img src="img/Ethereum-ETH-icon.png" alt="images not found" class="img_a1" /> DeFi Pulse <img src="img/Ethereum-ETH-icon.png" alt="images not found" class="img_a2" /></h2>
            <p>Price</p>
            <h3>$258.<span>63</span> <sub><i class="fas fa-long-arrow-alt-up"></i>4%</sub></h3>
          </div>

          <div class="dndefi-a1 dndefi-a2">
            <h2><img src="img/Ethereum-ETH-icon.png" alt="images not found" class="img_a1" /> Metaverse Index <img src="img/Ethereum-ETH-icon.png" alt="images not found" class="img_a2" /></h2>
            <p>Price</p>
            <h3>$201.<span>80</span> <sub><i class="fas fa-long-arrow-alt-up"></i>4%</sub></h3>
          </div>

          <div class="dndefi-a1 dndefi-a3">
            <h2><img src="img/Ethereum-ETH-icon.png" alt="images not found" class="img_a1" /> DEGEN Index <img src="img/Ethereum-ETH-icon.png" alt="images not found" class="img_a2" /></h2>
            <p>Price</p>
            <h3>$4.<span>39</span> <sub><i class="fas fa-long-arrow-alt-up"></i>4%</sub></h3>
          </div>

        </div>
      </div>
    </template>
    <template v-else>
      <div class="defi-area2">
        <div class="defi-part">
        <div class="defi-left">
            <h2>DeFI Indexes</h2>
            <p>Tokenized baskets of high quality DeFi projects</p>
        </div>
        <div class="defi-right">
            <p><a href="#">See all</a></p>
        </div>
        </div>
      </div>

      <div class="cvv-area">
        <div class="cvv-part">

          <div class="cvv-parta">
            <div class="cvv-parttb">
            <div class="cvv-partb">
              <div class="cvv-partb1">
                <img src="img/Ethereum-ETH-icon.png" alt="images not found" />
              </div>
              <div class="cvv-partb2">
                <h5>Compound</h5>
              </div>
              <div class="cvv-partb3">
                <p>0%</p>
              </div>
            </div>
            </div>

            <div class="cvv-parttc">
              <div class="cvv-parttc1">
                <p>Debt</p>
                <h5>-</h5>
              </div>
              <div class="cvv-parttc2">
              <p>Collateral</p>
              <h5>-</h5>
              </div>
              <div class="cvv-parttc3">
              <p>Interest accrued</p>
              <h5>$0.00</h5>
              </div>
              <div class="cvv-parttc4">
                <a href="#">Manage</a>
              </div>
            </div>
          </div>

          <div class="cvv-parta cvv-partaaa">
            <div class="cvv-parttb">
            <div class="cvv-partb">
              <div class="cvv-partb1">
                <img src="img/Ethereum-ETH-icon.png" alt="images not found" />
              </div>
              <div class="cvv-partb2">
                <h5>Vault #12400</h5>
              </div>
              <div class="cvv-partb3">
                <p>0%</p>
              </div>
            </div>
            </div>

            <div class="cvv-parttc">
              <div class="cvv-parttc1">
                <p>Debt</p>
                <h5><img src="img/hex-hex.png" alt="images not found" /> O DAL<span>at 2.75%</span></h5>
              </div>
              <div class="cvv-parttc2">
              <p>Collateral</p>
              <h5><img src="img/hex-hex.png" alt="images not found" /> O ETH</h5>
              </div>
              <div class="cvv-parttc3">
              <p>Interest accrued</p>
              <h5>$0.00</h5>
              </div>
              <div class="cvv-parttc4">
                <a href="#">Manage</a>
              </div>
            </div>
          </div>

          <div class="cvv-parta">
            <div class="cvv-parttb">
            <div class="cvv-partb">
              <div class="cvv-partb1">
                <img src="img/Ethereum-ETH-icon.png" alt="images not found" />
              </div>
              <div class="cvv-partb2">
                <h5>Vault #12400</h5>
              </div>
              <div class="cvv-partb3">
                <p>0%</p>
              </div>
            </div>
            </div>

            <div class="cvv-parttc">
              <div class="cvv-parttc1">
                <p>Debt</p>
                <h5><img src="img/hex-hex.png" alt="images not found" /> O DAL<span>at 2.75%</span></h5>
              </div>
              <div class="cvv-parttc2">
              <p>Collateral</p>
              <h5><img src="img/hex-hex.png" alt="images not found" /> O ETH</h5>
              </div>
              <div class="cvv-parttc3">
              <p>Interest accrued</p>
              <h5>$0.00</h5>
              </div>
              <div class="cvv-parttc4">
                <a href="#">Manage</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  mixins: [],
  props: {
    type: {
      default () {
        return 1
      }
    }
  },
  components: {

  },
  data () {
    return {

    }
  },
  watch: {

  },
  computed: {

  },
  created () {

  },
  mounted () {
  },
  methods: {

  },
  destroyed () {

  }

}
</script>

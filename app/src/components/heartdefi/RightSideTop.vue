<template>
  <div class="right-sidetop">
    <div class="rightsidetop-part">
      <div class="rightsidetop-part-left">

      </div>
      <div class="rightsidetop-part-right">
       <MetamaskConnect />
       <q-btn v-if="false" size="lg"  color="deep-purple-12" label="Connect Wallet" rounded class="rounded-borders" />
        <ul v-if="false">
        <li><a href="#"><img src="img/Ethereum-ETH-icon.png" alt="images not found" /></a></li>
        <li><a href="#">Arya Wijaya</a></li>
        <li><a href="#"><i class="fas fa-chevron-down" aria-hidden="true"></i></a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import MetamaskConnect from '../Moralis/MetamaskConnect.vue'
export default {
  mixins: [],
  components: {
    MetamaskConnect
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

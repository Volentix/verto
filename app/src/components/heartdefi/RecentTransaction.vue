<template>
    <div class="tpRecent-parta1">

        <div class="Recent-parta">
        <div class="Recent-parta1">
          <img :src="data.icon" alt="images not found" />
        </div>
        <div class="Recent-parta2">
          <h3>{{data.name}} {{data.symbol}}</h3>
          <p>{{data.date}}</p>
        </div>
        <div class="Recent-parta3 Recent-parta33">
          <h5>{{data.amount}}<br/> {{data.symbol}}</h5>
        </div>
      </div>
    </div>

</template>

<script>
export default {
  mixins: [],
  props: ['data'],
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

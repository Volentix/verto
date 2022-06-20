<template>
    <div class="tpRecent-parta1 cursor-pointer" @click="setNotifAction()">

        <div class="Recent-parta">
        <div class="Recent-parta1 q-pr-sm">
          <q-img contain :src="data.icon" alt="images not found" />
        </div>
        <div class="Recent-parta2">
          <h3>{{data.title}}</h3>
          <p class="ellipsis text-deep-purple-12">New Project added</p>
        </div>
        <div  class="Recent-parta3 Recent-parta33  ">
        <q-icon size="lg" color="grey" name="navigate_next" class="float-right"/>
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
    setNotifAction () {
      if (this.data.type === 'project') {
        this.$router.push('/project/' + this.data.id)
      }
    }
  },
  destroyed () {

  }

}
</script>

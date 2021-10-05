<template>
  <div v-if="message!=''" class="message" :class="type" >
      {{message}}
  </div>
</template>

<script>
export default {
  name: 'NotifyMessage',
  computed: {
    message () {
      return this.$store.getters['notify/message']
    },
    type () {
      return this.$store.getters['notify/type']
    }
  }
}
</script>

<style lang="scss" scoped>
.message{
  padding: 5px;
  font-size: 14px;
}
.success{
  color: #06ec06;
}
.error{
  color: #ff333f;
}
.banner{
  color: purple;
}
</style>

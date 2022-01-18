<template>
<div>
  <q-list no-border link inset-delimiter class="text-white text-center bg-primary vert-list">
    <q-item @click.native="setLanguage('en')">
      <q-item-section avatar class="flex-center">
        <q-avatar><img src="statics/flags/en.png" alt="en flag"></q-avatar>
      </q-item-section>
      <q-item-label>English</q-item-label>
    </q-item>
  </q-list>
</div>
</template>

<script>
export default {
  name: 'LangDrawer',
  data () {
    return {
      open: false,
      langs: ['en', 'fr', 'ru', 'es', 'el', 'ar', 'tr', 'pl', 'zh', 'nl', 'az', 'pt', 'sr', 'fil'],
      showParents: true,
      appVersion: this.$appVersion,
      appName: this.$appName
    }
  },
  methods: {
    setLanguage: function (lang) {
      this.$i18n.locale = lang
    }
  }
}
</script>

<style scoped lang="stylus">
  .vert-list .q-item
    padding-top 25px
    padding-bottom 25px
    flex-wrap wrap
    & > *
      text-align center
      flex 1 0 100%
      margin 0
      color white
      padding 10px
    .q-item-section >>> .q-item-icon
      font-size 32px
</style>

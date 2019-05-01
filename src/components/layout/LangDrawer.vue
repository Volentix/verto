<template>
<div>
  <q-list no-border link inset-delimiter class="text-white text-center bg-primary vert-list">
    <q-item @click.native="setLanguage('en')">
      <q-item-side avatar="statics/flags/en.png" />
      <q-item-main label="English" />
    </q-item>
    <q-item @click.native="setLanguage('fr')">
      <q-item-side avatar="statics/flags/fr.png" />
      <q-item-main label="Français" />
    </q-item>
    <q-item @click.native="setLanguage('ru')">
      <q-item-side avatar="statics/flags/ru.png" />
      <q-item-main label="Русский язык" />
    </q-item>
    <q-item @click.native="setLanguage('es')">
      <q-item-side avatar="statics/flags/es.png" />
      <q-item-main label="Español" />
    </q-item>
    <q-item @click.native="setLanguage('el')">
      <q-item-side avatar="statics/flags/el.png" />
      <q-item-main label="ελληνικά" />
    </q-item>
    <q-item @click.native="setLanguage('ar')">
      <q-item-side avatar="statics/flags/ar.png" />
      <q-item-main label="العربية" />
    </q-item>
    <q-item @click.native="setLanguage('tr')">
      <q-item-side avatar="statics/flags/tr.png" />
      <q-item-main label="Türkçe" />
    </q-item>
    <q-item @click.native="setLanguage('pl')">
      <q-item-side avatar="statics/flags/pl.png" />
      <q-item-main label="Polski" />
    </q-item>
    <q-item @click.native="setLanguage('zh')">
      <q-item-side avatar="statics/flags/zh.png" />
      <q-item-main label="中文" />
    </q-item>
    <q-item @click.native="setLanguage('nl')">
      <q-item-side avatar="statics/flags/nl.png" />
      <q-item-main label="Nederlands" />
    </q-item>
    <q-item @click.native="setLanguage('az')">
      <q-item-side avatar="statics/flags/az.png" />
      <q-item-main label="Азәрбајҹан дили" />
    </q-item>
    <q-item @click.native="setLanguage('pt')">
      <q-item-side avatar="statics/flags/pt.png" />
      <q-item-main label="Português" />
    </q-item>
    <q-item @click.native="setLanguage('sr')">
      <q-item-side avatar="statics/flags/sr.png" />
      <q-item-main label="Cрпски" />
    </q-item>
    <q-item @click.native="setLanguage('de')">
      <q-item-side avatar="statics/flags/de.png" />
      <q-item-main label="Deutsch" />
    </q-item>
    <q-item @click.native="setLanguage('fil')">
      <q-item-side avatar="statics/flags/fil.png" />
      <q-item-main label="Filipino" />
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
    .q-item-side >>> .q-item-icon
      font-size 32px
</style>

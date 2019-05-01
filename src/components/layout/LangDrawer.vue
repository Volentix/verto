<template>
<div>
  <q-list no-border link inset-delimiter class="text-white text-center bg-primary vert-list">
    <q-item @click.native="setLanguage('en')">
      <q-item-section avatar class="flex-center">
        <q-avatar><img src="statics/flags/en.png" alt="en flag"></q-avatar>
      </q-item-section>
      <q-item-label>English</q-item-label>
    </q-item>
    <q-item @click.native="setLanguage('fr')">
      <q-item-section avatar class="flex-center">
        <q-avatar><img src="statics/flags/fr.png" alt="fr flag"></q-avatar>
      </q-item-section>
      <q-item-label>Français</q-item-label>
    </q-item>
    <q-item @click.native="setLanguage('ru')">
      <q-item-section avatar class="flex-center">
        <q-avatar><img src="statics/flags/ru.png" alt="ru flag"></q-avatar>
      </q-item-section>
      <q-item-label>Русский язык</q-item-label>
    </q-item>
    <q-item @click.native="setLanguage('es')">
      <q-item-section avatar class="flex-center">
        <q-avatar><img src="statics/flags/es.png" alt="es flag"></q-avatar>
      </q-item-section>
      <q-item-label>Español</q-item-label>
    </q-item>
    <q-item @click.native="setLanguage('el')">
      <q-item-section avatar class="flex-center">
        <q-avatar><img src="statics/flags/el.png" alt="el flag"></q-avatar>
      </q-item-section>
      <q-item-label>ελληνικά</q-item-label>
    </q-item>
    <q-item @click.native="setLanguage('ar')">
      <q-item-section avatar class="flex-center">
        <q-avatar><img src="statics/flags/ar.png" alt="ar flag"></q-avatar>
      </q-item-section>
      <q-item-label>العربية</q-item-label>
    </q-item>
    <q-item @click.native="setLanguage('tr')">
      <q-item-section avatar class="flex-center">
        <q-avatar><img src="statics/flags/tr.png" alt="tr flag"></q-avatar>
      </q-item-section>
      <q-item-label>Türkçe</q-item-label>
    </q-item>
    <q-item @click.native="setLanguage('pl')">
      <q-item-section avatar class="flex-center">
        <q-avatar><img src="statics/flags/pl.png" alt="pl flag"></q-avatar>
      </q-item-section>
      <q-item-label>Polski</q-item-label>
    </q-item>
    <q-item @click.native="setLanguage('zh')">
      <q-item-section avatar class="flex-center">
        <q-avatar><img src="statics/flags/zh.png" alt="zh flag"></q-avatar>
      </q-item-section>
      <q-item-label>中文</q-item-label>
    </q-item>
    <q-item @click.native="setLanguage('nl')">
      <q-item-section avatar class="flex-center">
        <q-avatar><img src="statics/flags/nl.png" alt="nl flag"></q-avatar>
      </q-item-section>
      <q-item-label>Nederlands</q-item-label>
    </q-item>
    <q-item @click.native="setLanguage('az')">
      <q-item-section avatar class="flex-center">
        <q-avatar><img src="statics/flags/az.png" alt="az flag"></q-avatar>
      </q-item-section>
      <q-item-label>Азәрбајҹан дили</q-item-label>
    </q-item>
    <q-item @click.native="setLanguage('pt')">
      <q-item-section avatar class="flex-center">
        <q-avatar><img src="statics/flags/pt.png" alt="pt flag"></q-avatar>
      </q-item-section>
      <q-item-label>Português</q-item-label>
    </q-item>
    <q-item @click.native="setLanguage('sr')">
      <q-item-section avatar class="flex-center">
        <q-avatar><img src="statics/flags/sr.png" alt="sr flag"></q-avatar>
      </q-item-section>
      <q-item-label>Cрпски</q-item-label>
    </q-item>
    <q-item @click.native="setLanguage('de')">
      <q-item-section avatar class="flex-center">
        <q-avatar><img src="statics/flags/de.png" alt="de flag"></q-avatar>
      </q-item-section>
      <q-item-label>Deutsch</q-item-label>
    </q-item>
    <q-item @click.native="setLanguage('fil')">
      <q-item-section avatar class="flex-center">
        <q-avatar><img src="statics/flags/fil.png" alt="fil flag"></q-avatar>
      </q-item-section>
      <q-item-label>Filipino</q-item-label>
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

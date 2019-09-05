import VueI18n from 'vue-i18n'
import en from 'src/i18n/en.json'
import fr from 'src/i18n/fr.json'
import ru from 'src/i18n/ru.json'
import es from 'src/i18n/es.json'
import ar from 'src/i18n/ar.json'
import tr from 'src/i18n/tr.json'
import sr from 'src/i18n/sr.json'
import pl from 'src/i18n/pl.json'
import el from 'src/i18n/el.json'
import zh from 'src/i18n/zh.json'
import nl from 'src/i18n/nl.json'
import az from 'src/i18n/az.json'
import pt from 'src/i18n/pt.json'
import de from 'src/i18n/de.json'
import fil from 'src/i18n/fil.json'

export default ({ app, Vue }) => {
  Vue.use(VueI18n)

  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en, fr, ru, es, ar, tr, sr, pl, el, zh, nl, az, pt, de, fil } // set locale messages
  })
}

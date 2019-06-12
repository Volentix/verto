import store from '@/store'
import { openURL, Platform } from 'quasar'

class DocumentationManger {
  openDocumentation (documentName) {
    const link = process.env[store.state.settings.network].READ_THE_DOCS + documentName + '.html'
    if (Platform.is.cordova) {
      window.open(link, '_system')
    } else {
      openURL(link)
    }
  }
}
export default new DocumentationManger()

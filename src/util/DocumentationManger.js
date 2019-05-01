import store from '@/store'
import { openURL } from 'quasar'

class DocumentationManger {
  openDocumentation (documentName) {
    openURL(process.env[store.state.settings.network].READ_THE_DOCS + documentName + '.html')
  }
}
export default new DocumentationManger()

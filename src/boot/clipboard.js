import * as clipboard from 'clipboard-polyfill'

export default ({ Vue }) => {
  Vue.prototype.$clipboardWrite = (str) => {
    clipboard.writeText(str)
    if (typeof cordova !== 'undefined' && !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
      cordova.plugins.clipboard.copy(str)
    }
  }
}

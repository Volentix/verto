import * as clipboard from 'clipboard-polyfill'

export default ({ Vue }) => {
  Vue.prototype.$clipboardWrite = (str) => {
    clipboard.writeText(str)
  }
}

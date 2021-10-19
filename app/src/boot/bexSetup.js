
export default ({ Vue }) => {
  Vue.prototype.$isbex = process.env.MODE === 'bex'

  Vue.prototype.$extensionId = process.env.EXTENSION_ID
  Vue.prototype.$extensionIdMozila = process.env.EXTENSION_ID_MOZILA
  Vue.prototype.$extensionUrl = process.env.EXTENSION_URL
  Vue.prototype.$extensionUrlMozila = process.env.EXTENSION_URL_MOZILA
}

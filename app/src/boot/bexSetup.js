
export default ({ Vue }) => {
  Vue.prototype.$isbex = process.env.MODE === 'bex'
  Vue.prototype.$extensionId = process.env.EXTENSION_ID
}

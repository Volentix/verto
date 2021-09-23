
export default ({ Vue }) => {
  Vue.prototype.$isbex = process.env.MODE === 'bex'
}

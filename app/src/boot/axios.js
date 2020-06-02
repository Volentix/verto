import axios from 'axios'
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

export default async ({ Vue }) => {
  Vue.prototype.$axios = axios
}

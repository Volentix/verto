import axios from 'axios'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

export default async ({ Vue }) => {
  Vue.prototype.$axios = axios
  // Add a response interceptor
  axios.interceptors.response.use(function (response) {
  // Do nothing with response data
    return response
  }, function (error) {
  // Do something with response error
    if (error.response) {
      /* Catching errors in a spreadsheet: https://docs.google.com/spreadsheets/d/1fT_NHSnvVBt5-QH7VAl13Tr6lcMRoNbtI1gzA92Upic/edit?usp=sharing
      axios.post('https://enh08uyf97tybts.m.pipedream.net', {
        data: error,
        url: (typeof window !== 'undefined') ? window.location.href : ''
      })
      */
    }
  })
}

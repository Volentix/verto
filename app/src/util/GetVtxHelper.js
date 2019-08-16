import store from '@/store'
import axios from 'axios'

class GetVtxHelper {
  getWalletStatus (walletAddress, callback) {
    let url = (process.env[store.state.settings.network].CROWDFUND_URL + '/public/api/allocate-native-chain/?verto_public_address=' + walletAddress).replace(/"/gm, '')
    axios.get(url).then(function (response) {
      // eslint-disable-next-line
      callback({success: true, message: response.data.message, data: response.data})
    }).catch(function (error) {
      // eslint-disable-next-line
      callback({success: false, error})
    })
  }
}
export default new GetVtxHelper()

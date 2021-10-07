import configManager from '../util/ConfigManager'
import VDexNodeConfigManager from '../util/VDexNodeConfigManager'
import EosRPC from '../util/EosWrapper'
import * as utils from '@/util/utils.js'
import { userError } from '@/util/errorHandler'
import store from '@/store'
console.log(store.state.settings, 'store.state.settings.network')
export default ({ Vue }) => {
  Vue.prototype.$configManager = configManager
  Vue.prototype.$vDexNodeConfigManager = new VDexNodeConfigManager(process.env[store.state.settings.network].EOS_HISTORYAPI)
  Vue.prototype.$rpc = new EosRPC(process.env[store.state.settings.network].EOS_HISTORYAPI)
  Vue.prototype.$utils = utils
  Vue.prototype.$userError = userError
}

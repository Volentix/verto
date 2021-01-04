import configManager from '../util/ConfigManager'
import VDexNodeConfigManager from '../util/VDexNodeConfigManager'
import EosRPC from '../util/EosWrapper'
import * as utils from '@/util/utils.js'
import { userError } from '@/util/errorHandler'

export default ({ Vue }) => {
  Vue.prototype.$configManager = configManager
  Vue.prototype.$vDexNodeConfigManager = new VDexNodeConfigManager('http://140.82.56.143:8888')
  Vue.prototype.$rpc = new EosRPC('http://140.82.56.143:8888')
  Vue.prototype.$utils = utils
  Vue.prototype.$userError = userError
}

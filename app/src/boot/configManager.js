import configManager from '../util/ConfigManager'
import vDexNodeConfigManager from '../util/VDexNodeConfigManager'
import EosRPC from '../util/EosWrapper'
import * as utils from '@/util/utils.js'
import { userError } from '@/util/errorHandler'

export default ({ Vue }) => {
  Vue.prototype.$configManager = configManager
  Vue.prototype.$vDexNodeConfigManager = vDexNodeConfigManager
  Vue.prototype.$rpc = new EosRPC('http://140.82.56.143:8888')
  Vue.prototype.$utils = utils
  Vue.prototype.$userError = userError
}

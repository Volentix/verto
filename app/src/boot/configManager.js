import configManager from '../util/ConfigManager'
import vDexNodeConfigManager from '../util/VDexNodeConfigManager'

export default ({ Vue }) => {
  Vue.prototype.$configManager = configManager
  Vue.prototype.$vDexNodeConfigManager = vDexNodeConfigManager
}

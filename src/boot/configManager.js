import configManager from '../util/ConfigManager'

export default ({ Vue }) => {
  Vue.prototype.$configManager = configManager
}

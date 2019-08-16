import { Platform } from 'quasar'
let platformTools

if (Platform.is.electron) {
  platformTools = require('./electron')
}
if (Platform.is.cordova) {
  platformTools = require('./cordova')
}
if (!platformTools) {
  platformTools = require('./web')
}
if (platformTools.default) platformTools = platformTools.default
export default platformTools

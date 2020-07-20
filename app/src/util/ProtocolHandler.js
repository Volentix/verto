
import { Menu } from 'electron'
import packageJson from '../../package.json'
const { remote } = require('electron')
import { configureIPC } from '../shared/electron/ipc'

import { uri } from './uri'
import { windowStateKeeper } from '../shared/electron/windowStateKeeper'

const { exec } = require('child_process')
const log = require('electron-log')
const path = require('path')
const isMac = () => process.platform === 'darwin'

let ui

class ProtocolHandler {
  createProtocolHandler = (resourcePath, store, request = false) => {
    log.info('protocol handler: creating ui')
    log.info('initial request', request)

    const uiStateKeeper = windowStateKeeper(store, 'signingWindow')

    const { productName, version } = packageJson
    const title = `Signing Request - ${productName} (${version})`

    ui = new remote.BrowserWindow({
      alwaysOnTop: true,
      frame: false,
      x: uiStateKeeper.x,
      y: uiStateKeeper.y,
      width: uiStateKeeper.width,
      height: uiStateKeeper.height,
      title,
      skipTaskbar: true,
      show: false,
      resizable: true,
      backgroundColor: '#f1f0ee',
      icon: path.join(resourcePath, '../assets/icons/png/64x64.png'),
      webPreferences: {
        nodeIntegration: true
      }
    })

    uiStateKeeper.track(ui)
    let absolute = path.resolve()
    let pathname = path.join('src/', 'index.template.html')
    let total = 'file://' + absolute + '/' + pathname
    ui.loadURL(total)

    ui.webContents.on('did-finish-load', () => {
      log.info('protocol handler: loaded ui')
      ui.focus()
      ui.setTitle(title)
      if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
        ui.openDevTools({ mode: 'detach' })
      }
    })

    // macOS: Tell Chrome it should enable the "Always open" checkbox for the first ESR link
    if (isMac) {
      exec('defaults write com.google.Chrome ExternalProtocolDialogShowAlwaysOpenCheckbox -bool true')
    }

    // TODO: Needs proper hide/close logic independent of the primary ui
    ui.on('close', (e) => {
      if (ui.isVisible()) {
        if (isMac && Menu.sendActionToFirstResponder) {
          Menu.sendActionToFirstResponder('hide:')
        }
        store.dispatch(uri.clearURI())
        setTimeout(() => {
          ui.hide()
        }, 100)
        e.preventDefault()
        return false
      }
    })

    configureIPC(ui)

    return ui
  }
}

window.ProtocolHandler = new ProtocolHandler()
export default window.ProtocolHandler

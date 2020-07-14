
const path = require('path')
const fs = require('fs')
import { saveAs } from 'file-saver'
const log = require('electron-log')

const { exec } = require('child_process')
const isMac = () => process.platform === 'darwin'
// let ui
import { electron, BrowserWindow } from 'electron'
import packageJson from '../../../package.json'
import { configureIPC } from '../../shared/electron/ipc'
import { clearURI } from '../uri'
import { windowStateKeeper } from '../../shared/electron/windowStateKeeper'

const createProtocolHandlers = (resourcePath, store, request = false) => {
  log.info('protocol handler: creating ui')
  log.info('initial request', request)

  const uiStateKeeper = windowStateKeeper(store, 'signingWindow')

  const { productName, version } = packageJson
  const title = `Signing Request - ${productName} (${version})`
  const ui = new BrowserWindow({
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
    icon: path.join(resourcePath, 'renderer/assets/icons/png/64x64.png'),
    webPreferences: {
      nodeIntegration: true
    }
  })

  uiStateKeeper.track(ui)

  ui.loadURL(`file://${path.join(resourcePath, 'renderer/handler/index.html')}`)

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
      if (isMac && electron.Menu.sendActionToFirstResponder) {
        electron.Menu.sendActionToFirstResponder('hide:')
      }
      store.dispatch(clearURI())
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

const filePath = () => Promise.resolve(path.join(electron.remote.app.getPath('userData'), '/verto.config'))

const enableSigningRequests = () => {
  return new Promise(function (resolve, reject) {
    // TODO: remove eosio:// protocol handler in the future, it conflicts with B1 implementation
    electron.remote.app.setAsDefaultProtocolClient('eosio')
    electron.remote.protocol.registerHttpProtocol('eosio', (req, cb) => {
      log.info('protocol handler: register', req, cb)
    })
    electron.remote.app.setAsDefaultProtocolClient('esr')
    electron.remote.protocol.registerHttpProtocol('esr', (req, cb) => {
      log.info('protocol handler: register', req, cb)
    })
  })
}

const readFile = (filename) => {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, 'utf8', function (err, data) {
      if (err) { reject(err) } else { resolve(data) }
    })
  })
}

const writeFile = (...args) => {
  return new Promise(function (resolve, reject) {
    fs.writeFile(...args, function (err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}
const unlink = (...args) => {
  return new Promise(function (resolve, reject) {
    fs.unlink(...args, function (err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

const downloadFile = (text, fileName) => {
  return new Promise(function (resolve, reject) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, fileName)
    resolve()
  })
}

enableSigningRequests()

export default {
  ...fs,
  filePath,
  readFile,
  writeFile,
  unlink,
  downloadFile,
  enableSigningRequests,
  createProtocolHandlers
}

// import electron from 'electron'
// const path = require('path')
// const fs = require('fs')
// import { saveAs } from 'file-saver'

// const filePath = () => Promise.resolve(path.join(electron.remote.app.getPath('userData'), '/verto.config'))

// const readFile = (filename) => {
//   return new Promise(function (resolve, reject) {
//     fs.readFile(filename, 'utf8', function (err, data) {
//       if (err) { reject(err) } else { resolve(data) }
//     })
//   })
// }

// const writeFile = (...args) => {
//   return new Promise(function (resolve, reject) {
//     fs.writeFile(...args, function (err, data) {
//       if (err) reject(err)
//       else resolve(data)
//     })
//   })
// }
// const unlink = (...args) => {
//   return new Promise(function (resolve, reject) {
//     fs.unlink(...args, function (err, data) {
//       if (err) reject(err)
//       else resolve(data)
//     })
//   })
// }

// const downloadFile = (text, fileName) => {
//   return new Promise(function (resolve, reject) {
//     const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
//     saveAs(blob, fileName)
//     resolve()
//   })
// }

// export default {
//   ...fs,
//   filePath,
//   readFile,
//   writeFile,
//   unlink,
//   downloadFile
// }

// import { Platform } from 'quasar'
// import { app, crashReporter, ipcMain, protocol } from 'electron'
// import { createProtocolHandlers, initProtocolHandlers, app, ipcMain, protocol } from 'electron'
// import { app, ipcMain, protocol } from 'electron'

// import { app, crashReporter, ipcMain, protocol } from 'electron';
// import { app, protocol } from 'electron'

// import { store } from '../store/'
// import { devError } from '@/util/errorHandler'
// import sjcl from 'sjcl'
// import store from '../store'
// import { createInterface } from 'electron'
// import { createTray } from '../modules/tray/electron'
// import { createTrayIcon } from '../modules/tray/electron/icon'
// import { createProtocolHandlers } from 'electron'

const log = require('electron-log')
// const { electron } = require('electron')

let platformTools = require('./platformTools')
// if (platformTools.default) platformTools = platformTools.default

class SigningRequests {
  currentConfig
  currentWallet
  constructor () {
    // console.log('hey')
    log.info('******************')
    log.info(platformTools)

    // let pHandler = null
    // let resourcePath = __dirname
    // let uri = null
    this.enableSigningRequests()
    // this.initProtocolHandlers()
    //     if (uri) {
    //       setTimeout(() => {
    //         handleUri(resourcePath, store, mainWindow, pHandler, uri);
    //       }, 2000);
    //     }
    // const initProtocolHandler = (request = false) => {
    // pHandler = createProtocolHandlers(this.resourcePath, store, request)
  }

  //   // Allow ESR Requests from the UI
  //   ipcMain.on('openUri', (event, data) => {
  //     pHandler.webContents.send('openUri', data);
  //     pHandler.show();
  //   });

  //   // Allow for configuration of ESR from the UI
  //   ipcMain.on('enableSigningRequests', enableSigningRequests);
  //   handleUri(resourcePath, store, mainWindow, pHandler, url);
  // }

  enableSigningRequests () {
  //   log.info('enableSigningRequests')

    //   app.setAsDefaultProtocolClient('eosio')
  //   protocol.registerHttpProtocol('eosio', (req, cb) => {
  //     log.info('protocol handler: register', req, cb)
  //   })
  //   app.setAsDefaultProtocolClient('esr')
  //   protocol.registerHttpProtocol('esr', (req, cb) => {
  //     log.info('protocol handler: register', req, cb)
  //   })
  }
}

//   getSigningRequests () {
//     // //   return new Promise(async (resolve, reject) => {
//     // //     let filePath = await platformTools.filePath()
//     // //     const configData = await platformTools.readFile(filePath, 'utf-8')
//     // //     letc onfig = {}
//     // //     try {
//     // //       config = JSON.parse(sjcl.decrypt(password, configData))
//     // //       resolve({ success: true, config })
//     // //     } catch (e) {
//     // //       reject(new Error('bad_password'))
//     // //       // TODO: Exception handling
//     // //     }
//     // //   })
//     // }

// decryptKeys (text, password) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const config = JSON.parse(sjcl.decrypt(password, text))
//       resolve({ success: true, config })
//     } catch (e) {
//       resolve({ success: false })
//     }
//   })
// }

// async addPrivateKeyToWallet (password, name, privateKey) {
//   privateKey = privateKey.replace(/^"(.+)"$/, '$1')
//   const configInfo = await this.getConfig(password)
//   if (!configInfo.success) {
//     return configInfo
//   }
//   const config = configInfo.config
//   let wallet = null
//   let i = 0
//   for (i = 0; i < config.keys.length; i++) {
//     const key = config.keys[i]
//     if (key.name === name) {
//       wallet = key
//     }
//   }
//   if (!wallet) {
//     return { success: false, message: 'key_not_found' }
//   }
//   wallet.privateKeyEncrypted = JSON.parse(privateKey)
//   return this.saveConfigOnly(password, config)
// }

// async removePrivateKeyInWallet (password, name) {
//   const configInfo = await this.getConfig(password)
//   if (!configInfo.success) {
//     return configInfo
//   }
//   const config = configInfo.config
//   let wallet = null
//   let i = 0
//   for (i = 0; i < config.keys.length; i++) {
//     const key = config.keys[i]
//     if (key.name === name) {
//       wallet = key
//     }
//   }
//   if (!wallet) {
//     return { success: false, message: 'key_not_found' }
//   }
//   wallet.privateKeyEncrypted = null
//   return this.saveConfigOnly(password, config)
// }

// // Function takes two strings, not objects
// decryptPrivateKey (password, encryptedText) {
//   try {
//     // make sure the string we get is not quoted, that's not a valid JSON!
//     encryptedText = encryptedText.replace(/^"(.+)"$/, '$1')
//     // sjcl.decrypt returns a string, no need to JSON.parse it, but it can't be quoted!
//     const privateKey = sjcl.decrypt(password, encryptedText).replace(/^"(.+)"$/, '$1')
//     return { success: true, key: privateKey }
//   } catch (e) {
//     devError(e)
//     return { success: false }
//   }
// }
window.SigningRequests = new SigningRequests()
export default window.SigningRequests

import { app, BrowserWindow, Menu, shell, Tray, ipcMain, nativeImage } from 'electron'
import { autoUpdater } from 'electron-updater'
const path = require('path')
const log = require('electron-log')

// Add the menu module
// const menu = require('./electron-menu')
import VertoMenu from './electron-menu'
const vertoMenu = VertoMenu(app, shell)
/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = path.join(__dirname, 'statics').replace(/\\/g, '\\\\')
}

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    useContentSize: true,
    resizable: true,
    title: 'Verto wallet',
    center: true,
    webPreferences: {
      backgroundThrottling: false}
  })

  mainWindow.maximize()

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  Menu.setApplicationMenu(Menu.buildFromTemplate(vertoMenu))
}

app.setAppUserModelId('io.volentix.verto')

let iconPath
if (process.env.PROD) {
  iconPath = path.join(__dirname, 'statics/tray')
} else {
  iconPath = path.join('src/statics/tray')
}

let tray = null
app.on('ready', () => {
  tray = new Tray(nativeImage.createFromPath(iconPath + '/walletTemplate.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: app.getName() + ': ' + app.getVersion(), enabled: false },
    { type: 'separator' },
    { label: 'Check for updates', enabled: false },
    { label: 'Settings', enabled: false },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        mainWindow.destroy()
        app.quit()
      }
    }
  ])
  tray.setTitle('')
  tray.setToolTip(app.getName())
  // tray.setContextMenu(contextMenu)
  tray.on('double-click', toggleWindow)
  tray.on('click', event => {
    toggleWindow()
    // Show devtools when command clicked
    if (mainWindow.isVisible() && process.defaultApp && event.metaKey) {
      mainWindow.openDevTools({
        mode: 'detach'
      })
    }
  })
  tray.on('right-click', event => {
    tray.popUpContextMenu(contextMenu)
  })
})

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
    mainWindow.focus()
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// ipcMain.on('defaultIcon', function () {
//   tray.setImage(nativeImage.createFromPath(iconPath + '/walletTemplate.png'))
// })

// ipcMain.on('updateAvailable', function () {
//   tray.setImage(nativeImage.createFromPath(iconPath + '/walletNewTemplate.png'))
// })

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') {
    log.info('Setup check for updates and notify')
    autoUpdater.checkForUpdatesAndNotify()
  }
})

// autoUpdater.on('update-downloaded', () => {
//   mainWindow.webContents.send("updateReady");
//   autoUpdater.quitAndInstall();
//   // process.exit(1);
// })
function sendStatusToWindow (text) {
  log.info(text)
  mainWindow.webContents.send('message', text)
}
autoUpdater.on('update-available', (info) => {
  try {
    app.dock.setBadge('update')
  } catch (e) {
    log.info('setBadge() does not work on windows.')
  }
  try {
    tray.setImage(nativeImage.createFromPath(iconPath + '/walletNewTemplate.png'))
  } catch (e) {
    log.info('setImage() does not work on windows')
  }
  sendStatusToWindow('Update available. Once the download is complete you will need to quit and restart Verto.')
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err)
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Restart Verto to open the latest version!')
})
// autoUpdater.on('checking-for-update', () => {
//   sendStatusToWindow('Checking for update...')
// })
// autoUpdater.on('update-not-available', (info) => {
//   sendStatusToWindow('Update not available.')
// })

// Background code goes here

// const element = document.createElement('div')
// element.id = 'q-app'
// window.document.body.insertBefore(element, window.document.body.firstChild)
chrome.runtime.onInstalled.addListener(function(details) {
  if ((details.reason === 'install') ) 
  { 
    window.open(window.location.origin+'/www/index.html#/setup')
  } 
});
chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    if (message.type === 'EXTENSION_AVAILABLE') {
      const manifest = chrome.runtime.getManifest()
      sendResponse({
        type: 'EXTENSION_AVAILABLE',
        success: true,
        version: manifest.version
      })
      return true
    } else if (message.type === 'SYNC_DATA') {
      localStorage.setItem('sync_data', message.data)
      chrome.windows.create(
        {
          url: chrome.runtime.getURL('www/index.html'),
          type: 'popup',
          height: 600,
          width: 357,
          top: 0,
          left: screen.width - 350,
          focused: true
        })
      const url = chrome.extension.getURL('www/index.html')
      sendResponse({
        type: 'SYNC_DATA',
        url: url,
        success: true
      })
    }
  })

chrome.idle.setDetectionInterval(300)

const idleStateListener = function (state) {
  if (state === 'idle' || state === 'locked') {
    if (ConfigManager.isLoggedIn() === true) {
      ConfigManager.logout()
    }
  }
}
if (!chrome.idle.onStateChanged.hasListener(idleStateListener)) {
  chrome.idle.onStateChanged.addListener(idleStateListener)
}

// chrome.idle.setDetectionInterval(15)
// chrome.idle.onStateChanged.addListener(function (state) {
//   console.log(state)
// })
// chrome.browserAction.onClicked.addListener((/* tab */) => {
//   // Opens our extension in a new browser window.
//   // Only if a popup isn't defined in the manifest.
//   chrome.tabs.create({
//     url: chrome.extension.getURL('www/index.html')
//   }, (/* newTab */) => {
//     // Tab opened.
//   })
// })

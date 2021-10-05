// Background code goes here
const element = document.createElement('div')
element.id = 'q-app'
window.document.body.insertBefore(element, window.document.body.firstChild)
// chrome.browserAction.onClicked.addListener((/* tab */) => {
//   // Opens our extension in a new browser window.
//   // Only if a popup isn't defined in the manifest.
//   chrome.tabs.create({
//     url: chrome.extension.getURL('www/index.html')
//   }, (/* newTab */) => {
//     // Tab opened.
//   })
// })

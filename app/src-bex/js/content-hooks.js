// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/content-hooks
// Select the node that will be observed for mutations

export default function attachContentHooks (bridge) {
  (function () {
    // When the page loads, insert our browser extension app.
    // $$ ESLint - change from docs - strings must use single quote (not backticks)

    var targetNode = document.querySelector('body')

    // Options for the observer (which mutations to observe)
    var config = { attributes: true, childList: true }

    // Callback function to execute when mutations are observed
    var callback = function (mutationsList) {
      for (var mutation of mutationsList) {
        if (mutation.type === 'childList') {
          if (mutation.addedNodes[0] && mutation.addedNodes[0].id === 'walletconnect-wrapper') {
            setTimeout(() => {
              let qr = document.querySelector('.walletconnect-qrcode__image')
              if (qr) { bridge.send('app.connect', { qr: qr.outerHTML, domain: document.domain }) }
            }, 1000
            )
          }
        }
      }
    }

    var observer = new MutationObserver(callback)

    observer.observe(targetNode, config)
  })()

  // Hook into the bridge to listen for events sent from the client BEX.
  bridge.on('app.save', event => {
    bridge.send('app.sync', event.data).then((data) => {
      bridge.send(event.eventResponseKey, data.data)
    })
  })
  bridge.on('app.askUrl', event => {
    // console.log(event.data)
    bridge.send('app.url', event.data).then((data) => {
      bridge.send(event.eventResponseKey, data.data)
    })
  })
  /*
  bridge.on('some.event', event => {
    if (event.data.yourProp) {
      // Access a DOM element from here.
      // Document in this instance is the underlying website the contentScript runs on
      const el = document.getElementById('some-id')
      if (el) {
        el.value = 'Quasar Rocks!'
      }
    }
  })
  */
}

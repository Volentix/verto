// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/content-hooks

export default function attachContentHooks (bridge) {
  // Hook into the bridge to listen for events sent from the client BEX.
  bridge.on('app.save', event => {
    // console.log(event.data)
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

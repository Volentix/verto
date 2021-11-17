// Hooks added here have a bridge allowing communication between the BEX Background Script and the BEX Content Script.
// Note: Events sent from this background script using `bridge.send` can be `listen`'d for by all client BEX bridges for this BEX
import WalletConnect from '@walletconnect/client'
// eslint-disable-next-line no-unused-vars
// import store from '../../src/store'
// import store from '@/store'
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/background-hooks
export default function attachBackgroundHooks (bridge /* , allActiveConnections */) {
  console.log('idle setting')

  const connect = async (connector, accounts) => {
    connector.connected = false
    connector._connected = false
    if (!connector.connected) {
      await connector.approveSession({
        accounts: accounts,
        chainId: 1
      })
    } else {
      await connector.updateSession({
        accounts: accounts,
        chainId: 1
      })
    }
  }
  bridge.on('connector.listener', event => {
    let connectorArray = []

    let connexion = connectorArray.find(o => o.domain === event.data.domain)
    let connector = null
    if (!connexion) {
      connector = new WalletConnect({ uri: event.data.uri })
      connectorArray.push({ connector: connector, domain: event.data.domain })
      connector = connectorArray[connectorArray.length - 1].connector
    } else {
      connector = connexion.connector
      connect(connector, event.data.accounts)
      return
    }

    if (event.data.accept) {
      // Approve Session
      setTimeout(async () => {
        connect(connector, event.data.accounts)

        connector.on('call_request', (error, payload) => {
          if (error) {
            throw error
          }

          bridge.on('result.listener.' + payload.id, event => {
            if (event.data.approve) {
              connector.approveRequest({
                id: payload.id,
                result: event.data.hash
              })
            } else {
              connector.rejectRequest({
                id: payload.id,
                error: { message: 'Transaction rejected by user' }
              })
            }
          })

          localStorage.setItem('call_request', JSON.stringify(payload))
          chrome.windows.create({
            url: chrome.runtime.getURL('www/index.html'),
            type: 'popup',
            height: 600,
            width: 357,
            top: 0,
            left: screen.width - 350,
            focused: true
          })
        })
        connector.on('session_request', (error, payload) => {
          if (error) {
            throw error
          }
          alert(payload)
          connect(connector, event.data.accounts)
          /*
          connector.approveRequest({
            id: payload.id,
            result: event.data.accounts
          }) */
        })

        connector.on('disconnect', (error, payload) => {
          if (error) {
            throw error
          }
          connector.killSession()
        })
        setTimeout(() => {
          bridge.send(event.eventResponseKey, { u: 5, connector: connector, t: event.data })
        }, 2000)
      }, 3000)
    } else {
      connector.rejectSession({
        message: 'Connection to Verto rejected'
      })
      bridge.send(event.eventResponseKey, { u: 5, connector: connector, t: event.data })
    }

    /*
      window.connector.on("personal_sign", (error, payload) => {
        alert('personal_sign')
        if (error) {
           throw error;
        }
        localStorage.setItem('call_request', JSON.stringify(payload))
        chrome.windows.create(
         { url: chrome.runtime.getURL('www/index.html'),
           type: 'popup',
           height: 600,
           width: 400,
           top: 0,
           left: screen.width - 350,
           focused: true
         })
       })
      bridge.send(event.eventResponseKey)
      */
  })
  bridge.on('app.connect', event => {
    localStorage.setItem('wallet_connect_svg', JSON.stringify(event.data))
    chrome.windows.create({
      url: chrome.runtime.getURL('www/index.html'),
      type: 'popup',
      height: 600,
      width: 357,
      top: 0,
      left: screen.width - 350,
      focused: true
    })
    bridge.send(event.eventResponseKey, {
      success: true,
      url: chrome.runtime.getURL('www/index.html')
    })
  })

  bridge.on('app.sync', event => {
    localStorage.setItem('sync_data', event.data.data)
    chrome.windows.create({
      url: chrome.runtime.getURL('www/index.html'),
      type: 'popup',
      height: 600,
      width: 357,
      top: 0,
      left: screen.width - 350,
      focused: true
    })
    bridge.send(event.eventResponseKey, {
      success: true,
      url: chrome.runtime.getURL('www/index.html')
    })
  })
  bridge.on('app.url', event => {
    bridge.send(event.eventResponseKey, {
      success: true,
      url: chrome.runtime.getURL('www/index.html')
    })
  })
  console.log('hooks')
}

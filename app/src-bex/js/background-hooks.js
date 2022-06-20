// Hooks added here have a bridge allowing communication between the BEX Background Script and the BEX Content Script.
// Note: Events sent from this background script using `bridge.send` can be `listen`'d for by all client BEX bridges for this BEX
import WalletConnect from '@walletconnect/client'
// eslint-disable-next-line no-unused-vars
// import store from '../../src/store'
// import store from '@/store'
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/background-hooks
export default function attachBackgroundHooks (bridge /* , allActiveConnections */) {
  const resolve_ = (accounts, chainId) => {
    return new Promise((resolve, reject) => {
      resolve({
        accounts: accounts,
        chainId: chainId
      })
    })
  }
  const normalizeHex = (n) => n.toString().includes('0x') ? parseInt(n, 16) : n

  const connect = async (connector, accounts, chainId = 1, provider = 'https://mainnet.infura.io/v3/0dd5e7c7cbd14603a5c20124a76afe63') => {
    await connector.createSession({ chainId: chainId })
    await connector.approveSession({
      accounts: accounts,
      chainId: chainId,
      rpcUrl: provider,
      peerId: connector.peerId
    })
  }
  const openPopup = (path = 'www/index.html') => {
    chrome.windows.create({
      url: chrome.runtime.getURL(path),
      type: 'popup',
      height: 600,
      width: 357,
      top: 0,
      left: screen.width - 350,
      focused: true
    })
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
      // connect(connector, event.data.accounts)
      // return
    }

    if (event.data.accept) {
      // Approve Session
      setTimeout(async () => {
        await connect(connector, event.data.accounts, event.data.chainId, event.data.provider)

        // Subscribe to connection events

        connector.on('connect', (error, payload) => {
          if (error) {
            throw error
          }
          return resolve_(event.data.accounts, event.data.chainId)

          // Get provided accounts and chainId
          // const { accounts, chainId } = payload.params[0];
        })

        connector.on('call_request', async (error, payload) => {
          console.log(payload, 'payload')

          if (error) {
            throw error
          }

          if (payload.method === 'wallet_switchEthereumChain') {
            connector.updateSession({
              chainId: normalizeHex(payload.params[0].chainId),
              networkId: normalizeHex(payload.params[0].chainId),
              accounts: event.data.accounts
            })
            return connector.approveRequest({
              id: payload.id,
              result: payload.params[0].chainId
            })
            // return resolve_(event.data.accounts, event.data.chainId)
          } else if (payload.method === 'eth_sendTransaction') {
            payload.params[0].chainId = connector.chainId
            localStorage.setItem('call_request', JSON.stringify(payload))
            openPopup()
          }

          bridge.on('result.listener.' + payload.id, event => {
            if (event.data.approve) {
              connector.approveRequest({
                id: payload.id,
                result: event.data.result
              })
            } else {
              connector.rejectRequest({
                id: payload.id,
                error: { message: 'Transaction rejected by user' }
              })
            }
          })
        })
        connector.on('session_request', async (error, payload) => {
          if (error) {
            throw error
          }

          await connect(connector, event.data.accounts, event.data.chainId, event.data.provider)

          connector.approveRequest({
            id: payload.id,
            result: event.data.accounts
          })
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
    let data = JSON.stringify(event.data)
    // localStorage.setItem('wallet_connect_svg', data)
    chrome.windows.create({
      url: chrome.runtime.getURL('www/index.html#/verto/connectv1/' + encodeURIComponent(data)),
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

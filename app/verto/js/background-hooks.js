// Hooks added here have a bridge allowing communication between the BEX Background Script and the BEX Content Script.
// Note: Events sent from this background script using `bridge.send` can be `listen`'d for by all client BEX bridges for this BEX
import WalletConnect from "@walletconnect/client";
//import store from '@/store'
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/background-hooks
export default function attachBackgroundHooks(
  bridge /* , allActiveConnections */
) {
  // bridge.on('storage.get', event => {
  //   const payload = event.data
  //   if (payload.key === null) {
  //     chrome.storage.local.get(null, r => {
  //       const result = []
  //
  //       // Group the items up into an array to take advantage of the bridge's chunk splitting.
  //       for (const itemKey in r) {
  //         result.push(r[itemKey])
  //       }
  //       bridge.send(event.eventResponseKey, result)
  //     })
  //   } else {
  //     chrome.storage.local.get([payload.key], r => {
  //       bridge.send(event.eventResponseKey, r[payload.key])
  //     })
  //   }
  // })
  //
  // bridge.on('storage.set', event => {
  //   const payload = event.data
  //   chrome.storage.local.set({ [payload.key]: payload.data }, () => {
  //     bridge.send(event.eventResponseKey, payload.data)
  //   })
  // })
  //
  // bridge.on('storage.remove', event => {
  //   const payload = event.data
  //   chrome.storage.local.remove(payload.key, () => {
  //     bridge.send(event.eventResponseKey, payload.data)
  //   })
  // })*/
 const connect = async (connector, accounts = ['0x915f86d27e4E4A58E93E59459119fAaF610B5bE1']) => {
  connector.connected = false
  connector._connected = false
  if(!connector.connected){
    await connector.approveSession({
       accounts: accounts,
       chainId: 1 
     });
   } else {
     
      await connector.updateSession({
       accounts: accounts,
       chainId: 1 
     });
   }
 }
  bridge.on("connector.listener",  event => {
    let connectorArray = []
    
   let connexion = connectorArray.find(o => o.domain === event.data.domain)
    let connector = null
    if(!connexion ){
     connector = new WalletConnect({ bridge: , uri: event.data.uri } )
     connectorArray.push({connector:connector, domain: event.data.domain })
     connector = connectorArray[connectorArray.length - 1].connector
   } else {
      connector = connexion.connector
      connect(connector)
      return
    } 
   
    if (event.data.accept) {
      // Approve Session
      setTimeout(async () => {
        connect(connector)
      
        connector.on("call_request", (error, payload) => {
          if (error) {
            throw error;
          }
      
          localStorage.setItem("call_request", JSON.stringify(payload));
          chrome.windows.create({
            url: chrome.runtime.getURL("www/index.html"),
            type: "popup",
            height: 600,
            width: 357,
            top: 0,
            left: screen.width - 350,
            focused: true
          });
        });
        connector.on("session_request", (error, payload) => {
          if (error) {
            throw error;
          }
          alert('session_request')
          alert(JSON.stringify(payload))
          connector.approveRequest({
            id: payload.id,
            result: '0x915f86d27e4E4A58E93E59459119fAaF610B5bE1'
          })
        });
  
        connector.on("disconnect", (error, payload) => {
          if (error) {
            throw error;
          }
          connector.killSession();
        });
      setTimeout(() => {
        bridge.send(event.eventResponseKey, {u:5, connector:connector, t:  event.data});
      }, 2000)
      }, 3000);


    
    } else {
      connector.rejectSession({
        message: "Connection to Verto rejected"
      });
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
  });
  bridge.on("app.connect", event => {
    localStorage.setItem("wallet_connect_svg", JSON.stringify(event.data));
    chrome.windows.create({
      url: chrome.runtime.getURL("www/index.html"),
      type: "popup",
      height: 600,
      width: 357,
      top: 0,
      left: screen.width - 350,
      focused: true
    });
    bridge.send(event.eventResponseKey, {
      success: true,
      url: chrome.runtime.getURL("www/index.html")
    });
  });

  bridge.on("app.sync", event => {
    localStorage.setItem("sync_data", event.data.data);
    chrome.windows.create({
      url: chrome.runtime.getURL("www/index.html"),
      type: "popup",
      height: 600,
      width: 357,
      top: 0,
      left: screen.width - 350,
      focused: true
    });
    bridge.send(event.eventResponseKey, {
      success: true,
      url: chrome.runtime.getURL("www/index.html")
    });
  });
  bridge.on("app.url", event => {
    bridge.send(event.eventResponseKey, {
      success: true,
      url: chrome.runtime.getURL("www/index.html")
    });
  });
  /*
  // Send a message to the client based on something happening.
  chrome.tabs.onCreated.addListener(tab => {
    bridge.send('browserTabCreated', { tab })
  })

  // Send a message to the client based on something happening.
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      bridge.send('browserTabUpdated', { tab, changeInfo })
    }
  })
   */
}

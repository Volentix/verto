// import { Platform } from 'quasar'
import sjcl from 'sjcl'
import store from '../store'
let platformTools = require('./platformTools')
if (platformTools.default) platformTools = platformTools.default

class ConfigManager {
    currentConfig
    currentWallet

    getConfig (password) {
      return new Promise(async (resolve, reject) => {
        let filePath = await platformTools.filePath()
        const configData = await platformTools.readFile(filePath, 'utf-8')
        let config = {}
        try {
          config = JSON.parse(sjcl.decrypt(password, configData))
          resolve({ success: true, config })
        } catch (e) {
          reject(new Error('bad_password'))
          // TODO: Exception handling
        }
      })
    }

    async backupConfig () {
      const fileName = `verto-${(new Date()).getTime()}.config`
      const { configData } = await this.getRawConfig()
      return platformTools.downloadFile(configData, fileName)
    }

    async restoreConfig (configData, password) {
      // if (typeof configData !== 'string') configData = JSON.stringify(configData)
      try {
        let filePath = await platformTools.filePath()
        const config = JSON.parse(sjcl.decrypt(password, configData))
        let defaultKey
        try {
          defaultKey = config.keys.filter(k => k.defaultKey)[0].key
        } catch (e) {
          defaultKey = config.keys[0].key
          config.keys = config.keys.map((k, i) => ({ ...k, defaultKey: !i }))
        }
        configData = sjcl.encrypt(password, JSON.stringify(config))
        await platformTools.writeFile(filePath, configData, 'utf-8')
        store.commit('currentwallet/updateCurrentWallet', defaultKey)
        store.commit('currentwallet/updateConfig', config)
        return config
      } catch (e) {
        return new Error('bad_password')
      }
    }

    getRawConfig () {
      return new Promise(async (resolve, reject) => {
        let filePath = await platformTools.filePath()
        const configData = await platformTools.readFile(filePath, 'utf-8')
        resolve({ success: true, configData })
      })
    }

    decryptKeys (text, password) {
      return new Promise(async (resolve, reject) => {
        try {
          const config = JSON.parse(sjcl.decrypt(password, text))
          resolve({ success: true, config })
        } catch (e) {
          resolve({ success: false })
        }
      })
    }

    async saveConfig (password, currentWallet, config) {
      let filePath = await platformTools.filePath()
      await platformTools.writeFile(filePath, sjcl.encrypt(password, JSON.stringify(config)), 'utf-8')
      store.commit('currentwallet/updateCurrentWallet', currentWallet)
      store.commit('currentwallet/updateConfig', config)
      return { success: true }
    }

    async saveConfigOnly (password, config) {
      let filePath = await platformTools.filePath()
      await platformTools.writeFile(filePath, sjcl.encrypt(password, JSON.stringify(config)), 'utf-8')
      store.commit('currentwallet/updateConfig', config)
      return { success: true }
    }

    async updateConfig (password, config) {
      // make sure that the password is correct before proceeding.
      const configInfo = await this.getConfig(password)
      if (!configInfo.success) {
        return configInfo
      }
      return this.saveConfigOnly(password, config)
    }

    async addPrivateKeyToWallet (password, name, privateKey) {
      privateKey = privateKey.replace(/^"(.+)"$/, '$1')
      const configInfo = await this.getConfig(password)
      if (!configInfo.success) {
        return configInfo
      }
      const config = configInfo.config
      let wallet = null
      let i = 0
      for (i = 0; i < config.keys.length; i++) {
        const key = config.keys[i]
        if (key.name === name) {
          wallet = key
        }
      }
      if (!wallet) {
        return { success: false, message: 'key_not_found' }
      }
      wallet.privateKeyEncrypted = JSON.parse(privateKey)
      console.log('wallet.privateKeyEncrypted', wallet.privateKeyEncrypted)
      return this.saveConfigOnly(password, config)
    }

    async removePrivateKeyInWallet (password, name) {
      const configInfo = await this.getConfig(password)
      if (!configInfo.success) {
        return configInfo
      }
      const config = configInfo.config
      let wallet = null
      let i = 0
      for (i = 0; i < config.keys.length; i++) {
        const key = config.keys[i]
        if (key.name === name) {
          wallet = key
        }
      }
      if (!wallet) {
        return { success: false, message: 'key_not_found' }
      }
      wallet.privateKeyEncrypted = null
      return this.saveConfigOnly(password, config)
    }

    async createWallet (password) {
      return new Promise(async (resolve, reject) => {
        try {
          this.currentConfig = { keys: [] }
          const payload = JSON.stringify(this.currentConfig)
          let filePath = await platformTools.filePath()
          await platformTools.writeFile(filePath, sjcl.encrypt(password, payload), 'utf-8')
          store.commit('currentwallet/setLoggedIn', true)
          resolve(true)
        } catch (e) {
          // TODO: Exception handling
          reject(e)
        }
      })
    }

    async hasVertoConfig () {
      try {
        let filePath = await platformTools.filePath()
        const config = await platformTools.readFile(filePath, 'utf-8')
        if (config.constructor && config.constructor.name === 'FileError') {
          const fileError = new Error('File Error')
          fileError.code = config.code
          throw fileError
        }
        return config
      } catch (e) {
        return false
      }
    }

    async downloadFile (data, filename) {
      return new Promise(async (resolve, reject) => {
        try {
          await platformTools.downloadFile(data, filename)
          resolve(true)
        } catch (e) {
          // TODO: Exception handling
          reject(e)
        }
      })
    }

    async saveWalletAndKey (keyname, vertoPassword, privateKeyPassword, publicAddress, privateAddress) {
      try {
        const result = await this.getConfig(vertoPassword)
        if (!result.success) return result

        let config = result.config
        const nameTaken = config.keys.some((key) => key.name.toLowerCase() === keyname.toLowerCase())
        const defaultKey = config.keys.length <= 0
        if (nameTaken) return { success: false, message: 'name_already_used' }

        const key = { name: keyname, key: publicAddress, defaultKey: defaultKey }
        // const privateWallet = JSON.stringify({name: keyname, publickey: publicAddress, privatekey: privateAddress})
        config.keys.push(key)
        this.currentConfig = config
        if (defaultKey) { this.currentWallet = key }

        if (privateKeyPassword) {
          const encryptedData = sjcl.encrypt(privateKeyPassword, privateAddress)
          const fileName = `keys-${(new Date()).getTime()}.config`
          await platformTools.downloadFile(encryptedData, fileName)
        }
        await this.saveConfig(vertoPassword, key, config)
        return { success: true }
      } catch (e) {
        console.log(e)
        // TODO: Exception handling
      }
    }

    updateCurrentWallet (wallet) {
      this.currentWallet = wallet
      store.commit('currentwallet/updateCurrentWallet', wallet)
    }

    async changeVertoPassword (currentPassword, newPassword) {
      const result = await this.getConfig(currentPassword)
      if (!result.success) { return result }
      return this.saveConfig(newPassword, store.state.currentwallet.wallet, result.config)
    }

    async login (password) {
      try {
        const result = await this.getConfig(password)
        if (!result.success) {
          return result
        }
        let config = result.config
        store.commit('currentwallet/updateConfig', config)
        store.commit('currentwallet/setLoggedIn', true)
        let i
        for (i = 0; i < config.keys.length; i++) {
          const key = config.keys[i]
          if (key.defaultKey) {
            store.commit('currentwallet/updateCurrentWallet', key)
            return { success: true, message: 'success' }
          }
        }
        return { success: false, message: 'no_default_key' }
      } catch (e) {
        // TODO: Exception handling
        return e
      }
    }

    async deleteWallet (password, wallet) {
      try {
        const configInfo = await this.getConfig(password)
        if (!configInfo.success) {
          return configInfo
        }
        let currentWallet = store.state.currentwallet.wallet
        // we are deleting the current wallet (not the default)
        // so we need to get the default and make it the current wallet.
        if (typeof currentWallet === 'string' || currentWallet.name.toString() === wallet.name.toString()) {
          const currentWallets = configInfo.config.keys.filter(function (value, index, arr) {
            return value.defaultKey
          })
          currentWallet = currentWallets[0]
        }
        const keys = configInfo.config.keys.filter(function (value, index, arr) {
          return value.name.toString() !== wallet.name.toString()
        })
        configInfo.config.keys = keys
        return this.saveConfig(password, currentWallet, configInfo.config)
        // return {success: true}
      } catch (e) {
        return e
      }
    }

    async changeToDefault (newDefaultWallet, password) {
      try {
        const configInfo = await this.getConfig(password)
        if (!configInfo.success) {
          return configInfo
        }
        const config = configInfo.config
        let i = 0
        for (i = 0; i < config.keys.length; i++) {
          const key = config.keys[i]
          if (key.name === newDefaultWallet.name) {
            key.defaultKey = true
          } else if (key.name !== newDefaultWallet.name && key.defaultKey) {
            key.defaultKey = false
          }
        }
        return this.saveConfig(password, newDefaultWallet, config)
      } catch (e) {
        // TODO: Exception handling
        return e
      }
    }

    async addAssociationToWallet (address, password, associationName, data) {
      const configInfo = await this.getConfig(password)
      if (!configInfo.success) {
        return configInfo
      }
      const config = configInfo.config
      let wallet = null
      let i = 0
      for (i = 0; i < config.keys.length; i++) {
        const key = config.keys[i]
        if (key.key === address) {
          wallet = key
        }
      }
      if (!wallet) {
        return { success: false, message: 'key_not_found' }
      }
      if (!wallet.associations) {
        wallet.associations = []
      }
      wallet.associations.push({ name: associationName, createTime: new Date() })
      if (data.foundAllAssociations) {
        wallet['setupcomplete'] = true
      }
      return this.saveConfig(password, wallet, config)
    }

    hasWallets () {
      if (this.currentConfig.keys && this.currentConfig.keys.length > 0) {
        return true
      }
      return false
    }

    hasCurrentWallet () {
      return store.state.currentwallet.wallet
    }

    /*
    addWallet: {
        walletName: '',
        address: '',
        addressPriv: '',
        vertoPassword: '',
        filePassword: '',
      }
    */
    async createEosWallet (walletInformation) {
      try {
        const result = await this.getConfig(walletInformation.vertoPassword)
        if (!result.success) {
          return result
        }
        let config = result.config
        let i
        for (i = 0; i < config.keys.length; i++) {
          const wallet = config.keys[i]

          if (wallet.name.toLowerCase() === walletInformation.walletName.value.toLowerCase()) {
            return { success: false, message: 'name_already_used' }
          }
        }
        if (walletInformation.filePassword) {
          walletInformation.addressPrivateEncrypted = JSON.parse(sjcl.encrypt(walletInformation.filePassword, JSON.stringify(walletInformation.addressPriv)))
          await platformTools.downloadFile(JSON.stringify(walletInformation.addressPrivateEncrypted), walletInformation.walletName.value + '.priv')
        }
        const wallet = {
          name: walletInformation.walletName.value,
          type: 'eos',
          key: walletInformation.address,
          defaultKey: config.keys.length < 1
        }
        if (walletInformation.storeInWallet) {
          wallet.privateKeyEncrypted = walletInformation.addressPrivateEncrypted
        }
        config.keys.push(wallet)
        await this.saveConfig(walletInformation.vertoPassword, wallet, config)
        return { success: true }
      } catch (e) {
        return e
      }
    }

    // Function takes two strings, not objects
    decryptPrivateKey (password, encryptedText) {
      try {
        // make sure the string we get is not quoted, that's not a valid JSON!
        encryptedText = encryptedText.replace(/^"(.+)"$/, '$1')
        // sjcl.decrypt returns a string, no need to JSON.parse it, but it can't be quoted!
        const privateKey = sjcl.decrypt(password, encryptedText).replace(/^"(.+)"$/, '$1')
        return { success: true, key: privateKey }
      } catch (e) {
        console.log('e', e)
        return { success: false }
      }
    }

    async addWallet (keyname, vertoPassword, publicAddress, privateAddress) {
      try {
        const result = await this.getConfig(vertoPassword)
        if (!result.success) {
          return result
        }
        let config = result.config
        let i
        for (i = 0; i < config.keys.length; i++) {
          const wallet = config.keys[i]
          if (wallet.name.toString().toLowerCase() === keyname.toString().toLowerCase()) {
            return { success: false, message: 'name_already_used' }
          }
        }
        const wallet = { name: keyname, key: publicAddress, priv: privateAddress, defaultKey: config.keys.length < 1 }
        if (privateAddress) {
          wallet.type = 'eos'
        } else {
          wallet.type = 'verto'
        }
        config.keys.push(wallet)
        await this.saveConfig(vertoPassword, wallet, config)
        return { success: true }
      } catch (e) {
        return e
      }
    }

    checkIfAssociatedWithVenue () {
      let venueIsAssociated = false
      if (store.state.currentwallet.wallet.associations) {
        for (var i = 0; i < store.state.currentwallet.wallet.associations.length; i++) {
          const name = store.state.currentwallet.wallet.associations[i].name
          if (name === 'KnowVenue') {
            venueIsAssociated = true
          } else if (name === 'Venue') {
            venueIsAssociated = true
          }
        }
      }
      return venueIsAssociated
    }

    checkIfAssociatedWithBlocktopus () {
      if (store.state.currentwallet.wallet.associations) {
        for (var i = 0; i < store.state.currentwallet.wallet.associations.length; i++) {
          const name = store.state.currentwallet.wallet.associations[i].name
          if (name === 'Blocktopus') {
            return true
          }
        }
      }
      return false
    }

    checkIfAssociatedWithZixipay () {
      if (store.state.currentwallet.wallet.associations) {
        for (var i = 0; i < store.state.currentwallet.wallet.associations.length; i++) {
          const name = store.state.currentwallet.wallet.associations[i].name
          if (name === 'Zixipay') {
            return true
          }
        }
      }
      return false
    }

    async destroyConfig () {
      let filePath = await platformTools.filePath()
      const unlinked = await platformTools.unlink(filePath)
      return unlinked
    }

    logout () {
      store.commit('currentwallet/updateCurrentWallet', null)
      store.commit('currentwallet/updateConfig', null)
      store.commit('currentwallet/setLoggedIn', false)
    }
}
window.ConfigManager = new ConfigManager()
export default window.ConfigManager

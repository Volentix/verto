import store from '@/store'
import Lib from '@/util/walletlib'
import { Keyring } from '@polkadot/api'
import nacl from 'tweetnacl'
import { derivePath } from 'ed25519-hd-key'
import { MnemonicKey } from '@terra-money/terra.js'
import { encode } from 'js-base64'

// import AvaHDWallet from 'ava-hd-wallet'

// Hierarchical Deterministic Wallets
// https://iancoleman.io/bip39/ used to validate the derived keys as per bip44 non-hardened addresses.
class HD {
  constructor () {
    this.paths = {
      avax: "m/44'/9000'/0'/0/0",
      sol: "m/44'/501'/0'",
      eos: "m/44'/194'/0'/0/0",
      btc: "m/44'/0'/0'/0/0",
      eth: "m/44'/60'/0'/0/0"
    }

    this.names = [{
      'value': 'btc',
      'label': 'Bitcoin'
    },
    {
      'value': 'eth',
      'label': 'Ethereum'
    },
    {
      'value': 'matic',
      'label': 'Polygon'
    },
    {
      'value': 'bnb',
      'label': 'Binance'
    },
    {
      'value': 'bsc',
      'label': 'Binance Smart Chain'

    },
    {
      'value': 'ltc',
      'label': 'Litecoin'
    },
    {
      'value': 'dash',
      'label': 'DASH'
    },
    {
      'icon': 'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png',
      'value': 'avax',
      'label': 'Avalanche X-Chain'
    },
    {
      'value': 'avaxc',
      'label': 'Avalanche C-Chain'
    },
    {
      'value': 'ftm',
      'label': 'Fantom'
    },
    {
      'value': 'dot',
      'label': 'Polkadot'
    },
    {
      'value': 'eos',
      'label': 'EOS'
    },
    { 'icon': 'https://verto.volentix.io/statics/img/terra.png',
      'value': 'terra',
      'label': 'Terra'
    },
    { 'icon': 'https://assets.coingecko.com/coins/images/9568/small/m4zRhP5e_400x400.jpg',
      'value': 'ksm',
      'label': 'Kusama'
    },
    {
      'value': 'xlm',
      'label': 'Stellar Lumens'
    },
    { 'icon': 'https://assets.coingecko.com/coins/images/4128/small/coinmarketcap-solana-200.png',
      'value': 'sol',
      'label': 'Solana'
    },
    {
      'value': 'xtz',
      'label': 'Tezos'
    }
    ]
  }
  getVertoChains () {
    let chains = this.names.filter(e => !Lib.evms.find(v => v.chain === e.value))
    let order = ['eth', 'btc', 'eos', 'bsc', 'matic'].reverse()
    chains.map(o => {
      if (!o.icon) {
        o.icon = 'https://files.coinswitch.co/public/coins/' + o.value + '.png'
      }
    })

    Lib.evms.forEach(o => {
      chains.unshift({
        icon: o.icon,
        isEvm: true,
        chainId: o.network_id,
        provider: o.provider,
        value: o.chain,
        label: o.name
      })
    })
    chains.map(c => {
      c.index = order.indexOf(c.value)
      c.chain = c.value
    })
    return chains.sort((a, b) => b.index - a.index)
  }
  getTerraWrapper () {
    const keySize = 256
    const iterations = 100
    const CryptoJS = require('crypto-js')

    const encrypt = (msg, pass) => {
      try {
        const salt = CryptoJS.lib.WordArray.random(128 / 8)

        const key = CryptoJS.PBKDF2(pass, salt, {
          keySize: keySize / 32,
          iterations: iterations
        })

        const iv = CryptoJS.lib.WordArray.random(128 / 8)

        const encrypted = CryptoJS.AES.encrypt(msg, key, {
          iv: iv,
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC
        })

        const transitmessage =
      salt.toString() + iv.toString() + encrypted.toString()
        return transitmessage
      } catch (error) {
        return ''
      }
    }
    const encodeWallet = (name, address, privateKey, password) => {
      const data = { name, address, encrypted_key: encrypt(privateKey, password) }
      console.log(data, 'data')
      return encode(JSON.stringify(data))
    }
    const decrypt = (transitmessage, pass) => {
      const salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32))
      const iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
      const encrypted = transitmessage.substring(64)

      const keySize = 256
      const iterations = 100
      const key = CryptoJS.PBKDF2(pass, salt, {
        keySize: keySize / 32,
        iterations: iterations
      })

      return CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      }).toString(CryptoJS.enc.Utf8)
    }

    return {
      encrypt,
      decrypt,
      encodeWallet
    }
  }
  Wallet = async (walletType, addressIndex = 0, customPath = null) => {
    // const bip32 = require('bip32')
    // const util = require('ethereumjs-util')
    // const createHash = require('create-hash')
    // const bs58check = require('bs58check')
    // const bech32 = require('bech32')
    // const rippleProvider = require('xrp-provider')
    const bip39 = require('bip39')
    const bitcoin = require('bitcoinjs-lib')
    const mnemonic = store.state.currentwallet.config.mnemonic
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    // const self = this
    const keys = {
      avax () {
        const avalanche = require('avalanche')
        const ava = new avalanche.Avalanche('https://api.avax.network', 443, 'https', 1, '2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM')
        const xchain = ava.XChain()
        const keychain = xchain.keyChain()

        const HDKey = require('hdkey')
        const path = customPath || "m/44'/9000'/0'/0/" + addressIndex.toString()
        const hdkey = HDKey.fromMasterSeed(seed)
        const key = hdkey.derive(path)

        const privateKeyHEX = key.privateKey.toString('hex')
        const privateKeyBuffer = Buffer.from(privateKeyHEX, 'hex')
        const keypair = keychain.importKey(privateKeyBuffer)

        const publicKey = keypair.getAddressString()
        const privateKey = keypair.getPrivateKeyString()

        return { publicKey, privateKey }
      },
      sol () {
        const solanaWeb3 = require('@solana/web3.js')
        const path = customPath || "m/44'/501'/" + addressIndex.toString() + "'"
        const derivedSeed = derivePath(path, seed).key
        const account = new solanaWeb3.Account(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey)
        const publicKey = account.publicKey.toString()
        const privateKey = JSON.stringify(account.secretKey) // or .data ?

        return { publicKey, privateKey }
      },
      dot () {
        const keyring = new Keyring({ type: 'sr25519' })
        const newPair = keyring.createFromUri(mnemonic)
        keyring.setSS58Format(0)

        const publicKey = newPair.address
        const privateKey = 'unused'

        return { publicKey, privateKey }
      },
      ksm () {
        const keyring = new Keyring({ type: 'sr25519' })
        const newPair = keyring.createFromUri(mnemonic)
        keyring.setSS58Format(2)

        const publicKey = newPair.address
        const privateKey = 'unused'

        return { publicKey, privateKey }
      },
      eos () {
        const hdkey = require('hdkey')
        const wif = require('wif')
        const ecc = require('eosjs-ecc')
        const hdwallet = hdkey.fromMasterSeed(seed)
        const eosPath = customPath || "m/44'/194'/0'/0/" + addressIndex.toString()
        const eosNode = hdwallet.derive(eosPath)
        const publicKey = ecc.PublicKey(eosNode._publicKey).toString()
        const privateKey = wif.encode(128, eosNode._privateKey, false)

        return { publicKey, privateKey }
      },
      terra () {
        /* let t = JSON.parse(Buffer.from(
          'eyJuYW1lIjoiYmVydGhvbnkiLCJhZGRyZXNzIjoidGVycmExMDRtcWpqbDdqNHBydmE3ZDVzc2hrd3dyZ3lteG5sajg4ejVnOXgiLCJlbmNyeXB0ZWRfa2V5IjoiODEzZTBkNWM0YWI1NzRiNmI1NjVkYTEwMTU2NGQyY2E0MmJjM2NiNzU4YzA2YzI1YTRiNTgzMjMxYWFhOTY2NnJ2YU1lSVlZMGZIQ2VwaWpXQmprUXBpOS9FcEFjQk1NQlBqaWFnaDlUSU5ONDQ1a2dDcCtxaWt2ajg2K0FQeWcvZzhkN2JtZTh0enlFMUhnZE5Dd0VGS0thNjlVTmloYVBWVVVabDBhZjdVPSJ9',
          'base64'
        ).toString('utf8'))
        */
        // create a key out of a mnemonic

        const mk = new MnemonicKey({
          mnemonic: mnemonic
        })

        let privateKey = Buffer.from(mk.privateKey.buffer).toString('hex')

        // const rk = new RawKey(buffer)

        //   const decoder = new TextDecoder()
        // const str = decoder.decode(mk.privateKey)
        // let str = Buffer.from(mk.privateKey.buffer).toString()
        /* let d = TerraWrapper.decrypt(t.encrypted_key, '')
        console.log(d, t, 'wallet', buffer)
        let c = TerraWrapper.encrypt(d, '').toString()
        let x = TerraWrapper.decrypt(c, '')
        console.log(c, 'c', x, 45)
let TerraWrapper = self.getTerraWrapper()
        let w = TerraWrapper.encodeWallet('samuel1', mk.accAddress, privateKey, '')

        console.log(w, 'w', { publicKey: mk.accAddress, privateKey: privateKey })
 */
        return { publicKey: mk.accAddress, privateKey: privateKey }
      },
      steem () {
        const { PrivateKey, key } = require('steemjs-lib')
        const pkey = PrivateKey.fromSeed(key.normalize_brainKey(mnemonic))
        const publicKey = pkey.toPublicKey().toString()
        const privateKey = pkey.toWif()

        return { publicKey, privateKey }
      },
      crux () {
        const bitcore = require('bitcore-lib')
        const path = "m/889'/0'/0'"
        const network = bitcoin.networks.livenet
        const xpriv = bitcore.HDPrivateKey.fromSeed(seed, network) // BIP32 Root Key
        const extPrivKey = xpriv.derive(path) // BIP32 Extended Private Key
        const privKey = extPrivKey.privateKey
        const privateKey = privKey.toWIF()
        const pubKey = privKey.publicKey
        const publicKey = bitcore.Address(pubKey, network).toString()

        return { publicKey, privateKey }
      },
      btc () {
        const bitcore = require('bitcore-lib')
        const path = customPath || "m/44'/0'/0'/0/" + addressIndex.toString()
        const network = bitcoin.networks.livenet
        const xpriv = bitcore.HDPrivateKey.fromSeed(seed, network) // BIP32 Root Key
        const extPrivKey = xpriv.derive(path) // BIP32 Extended Private Key
        const privKey = extPrivKey.privateKey
        const privateKey = privKey.toWIF()
        const pubKey = privKey.publicKey

        let publicKey = bitcore.Address(pubKey, network).toString()
        if (path.includes('49')) {
          const keyPair = bitcoin.ECPair.fromWIF(privateKey)
          console.log(keyPair.publicKey.toString('hex'))
          const pubkeys = [
            keyPair.publicKey.toString('hex')
          ].map(hex => Buffer.from(hex, 'hex'))
          const { address } = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wsh({
              redeem: bitcoin.payments.p2ms({ m: 1, pubkeys })
            })
          })
          publicKey = address
        }

        return { publicKey, privateKey }
      },
      ltc () {
        const litecore = require('litecore-lib')
        const path = "m/44'/2'/0'/0/" + addressIndex.toString()
        const network = bitcoin.networks.litecoin
        const xpriv = litecore.HDPrivateKey.fromSeed(seed, network) // BIP32 Root Key
        const extPrivKey = xpriv.derive(path) // BIP32 Extended Private Key
        const privKey = extPrivKey.privateKey
        const privateKey = privKey.toWIF()
        const pubKey = privKey.publicKey
        const publicKey = litecore.Address(pubKey, network).toString()

        return { publicKey, privateKey }
      },
      eth () {
        const ethhdkey = require('ethereumjs-wallet/hdkey')
        const ethhdwallet = ethhdkey.fromMasterSeed(seed)
        const ethPath = customPath || "m/44'/60'/0'/0/" + addressIndex.toString()
        const ethWallet = ethhdwallet.derivePath(ethPath).getWallet()
        const publicKey = ethWallet.getAddressString()
        const privateKey = ethWallet.getPrivateKeyString()

        return { publicKey, privateKey }
      },
      // xrp () {
      //   const rippleBip32 = require('ripple-bip32')
      //   const buffer = rippleBip32.fromSeedBuffer(seed)
      //   const xrpPath = "m/44'/144'/0'/0/0"
      //   const keyPair = buffer.derivePath(xrpPath).keyPair.getKeyPairs()
      //   const privateKey = keyPair.privateKey.substring(2)
      //   const publicKey = buffer.derivePath(xrpPath).getAddress()

      //   return { publicKey, privateKey }
      // },
      dash () {
        const dashcore = require('@dashevo/dashcore-lib')
        const path = "m/44'/5'/0'/0/" + addressIndex.toString()
        const network = dashcore.Networks.livenet
        const xpriv = dashcore.HDPrivateKey.fromSeed(seed, network) // BIP32 Root Key
        const extPrivKey = xpriv.derive(path) // BIP32 Extended Private Key
        const privKey = extPrivKey.privateKey
        const privateKey = privKey.toWIF()
        const pubKey = privKey.publicKey
        const publicKey = dashcore.Address(pubKey, network).toString()

        return { publicKey, privateKey }
      },
      xlm () {
        const XlmProvider = require('xlm-provider').default
        const xlmProvider = new XlmProvider('mainnet')
        const privateKey = xlmProvider.createPrivateKeyFromMnemonic(mnemonic)
        const publicKey = xlmProvider.createPublicKey(privateKey)

        return { publicKey, privateKey }
      },
      bnb () {
        // Validation required
        // const aminoPrefix = 'eb5ae98721'
        const bnb = require('@binance-chain/javascript-sdk')
        const privateKey = bnb.crypto.getPrivateKeyFromMnemonic(mnemonic)
        const address = bnb.crypto.getAddressFromPrivateKey(privateKey, 'bnb')
        // const pubkey = bnb.crypto.getPublicKeyFromPrivateKey(privateKey)
        // const compressed = bnb.crypto.getPublicKey(pubkey).encodeCompressed('hex')
        // const publicKey = bech32.encode('bnbp', bech32.toWords(Buffer.from(aminoPrefix + compressed, 'hex')))

        return { publicKey: address, privateKey }
      },
      async xtz () {
        // Validation required
        const xtz = require('conseiljs')
        const ppkeys = await xtz.TezosWalletUtil.getKeysFromMnemonicAndPassphrase(mnemonic)
        const privateKey = ppkeys.privateKey
        const publicKey = ppkeys.publicKeyHash

        return { publicKey, privateKey }
      },
      async ada () {
        // Validation required
        const ada = require('js-chain-libs/js_chain_libs')
        const extPrivateKey = await ada.PrivateKey.from_normal_bytes(seed.slice(0, 32))
        const privateKey = extPrivateKey.to_bech32()
        const account = ada.Account.single_from_public_key(extPrivateKey.to_public())
        const publicKey = account.to_address('AddressDiscrimination.Production').to_string('addr')
        // console.log('publicKey', publicKey)

        return { publicKey, privateKey }
      }
    }[walletType]
    /*
  let wallet = {}
         if(keys){
         wallet =  await keys()
         }
       return wallet
       */

    if (bip39.validateMnemonic(mnemonic)) {
      return keys ? keys() : {}
    } else {
      return false
    }
  }
}
window.HD = new HD()
export default window.HD

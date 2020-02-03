import store from '@/store'

// Hierarchical Deterministic Wallets
// https://iancoleman.io/bip39/ used to validate the derived keys as per bip44 non-hardened addresses.
class HD {
  Wallet = async (walletType) => {
    const bip39 = require('bip39')
    // const bip32 = require('bip32')
    const rippleBip32 = require('ripple-bip32')
    const hdkey = require('hdkey')
    const ethhdkey = require('ethereumjs-wallet/hdkey')
    // const util = require('ethereumjs-util')
    const bitcoin = require('bitcoinjs-lib')
    const wif = require('wif')
    const ecc = require('eosjs-ecc')
    // const createHash = require('create-hash')
    // const bs58check = require('bs58check')
    // const bech32 = require('bech32')
    // const rippleProvider = require('xrp-provider')
    const litecore = require('litecore-lib')
    const bitcore = require('bitcore-lib')
    const dashcore = require('@dashevo/dashcore-lib')
    const bnb = require('@binance-chain/javascript-sdk')
    const XlmProvider = require('xlm-provider').default
    const xtz = require('conseiljs')
    const ada = require('js-chain-libs/js_chain_libs')

    const mnemonic = store.state.currentwallet.config.mnemonic
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    const hdwallet = hdkey.fromMasterSeed(seed)
    const ethhdwallet = ethhdkey.fromMasterSeed(seed)
    // const btchdwallet = bip32.fromSeed(seed)

    const keys = {
      eos () {
        const eosPath = "m/44'/194'/0'/0/0"
        const eosNode = hdwallet.derive(eosPath)
        const publicKey = ecc.PublicKey(eosNode._publicKey).toString()
        const privateKey = wif.encode(128, eosNode._privateKey, false)

        return { publicKey, privateKey }
      },
      btc () {
        const path = "m/44'/0'/0'/0/0"
        const network = bitcoin.networks.livenet
        const xpriv = bitcore.HDPrivateKey.fromSeed(seed, network) // BIP32 Root Key
        const extPrivKey = xpriv.derive(path) // BIP32 Extended Private Key
        const privKey = extPrivKey.privateKey
        const privateKey = privKey.toWIF()
        const pubKey = privKey.publicKey
        const publicKey = bitcore.Address(pubKey, network).toString()

        return { publicKey, privateKey }
      },
      ltc () {
        const path = "m/44'/2'/0'/0/0"
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
        const ethPath = "m/44'/60'/0'/0/0"
        const ethWallet = ethhdwallet.derivePath(ethPath).getWallet()
        const publicKey = ethWallet.getAddressString()
        const privateKey = ethWallet.getPrivateKeyString()

        return { publicKey, privateKey }
      },
      xrp () {
        const buffer = rippleBip32.fromSeedBuffer(seed)
        const xrpPath = "m/44'/144'/0'/0/0"
        const keyPair = buffer.derivePath(xrpPath).keyPair.getKeyPairs()
        const privateKey = keyPair.privateKey.substring(2)
        const publicKey = buffer.derivePath(xrpPath).getAddress()

        return { publicKey, privateKey }
      },
      dash () {
        const path = "m/44'/5'/0'/0/0"
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
        const xlmProvider = new XlmProvider('mainnet')
        const privateKey = xlmProvider.createPrivateKeyFromMnemonic(mnemonic)
        const publicKey = xlmProvider.createPublicKey(privateKey)

        return { publicKey, privateKey }
      },
      bnb () {
        // Validation required
        // const aminoPrefix = 'eb5ae98721'
        const privateKey = bnb.crypto.getPrivateKeyFromMnemonic(mnemonic)
        const address = bnb.crypto.getAddressFromPrivateKey(privateKey, 'bnb')
        // const pubkey = bnb.crypto.getPublicKeyFromPrivateKey(privateKey)
        // const compressed = bnb.crypto.getPublicKey(pubkey).encodeCompressed('hex')
        // const publicKey = bech32.encode('bnbp', bech32.toWords(Buffer.from(aminoPrefix + compressed, 'hex')))

        return { publicKey: address, privateKey }
      },
      async xtz () {
        // Validation required
        const ppkeys = await xtz.TezosWalletUtil.getKeysFromMnemonicAndPassphrase(mnemonic)
        const privateKey = ppkeys.privateKey
        const publicKey = ppkeys.publicKeyHash

        return { publicKey, privateKey }
      },
      async ada () {
        // Validation required
        console.log('ada', ada)
        const extPrivateKey = await ada.PrivateKey.from_normal_bytes(seed.slice(0, 32))
        const privateKey = extPrivateKey.to_bech32()
        const account = ada.Account.single_from_public_key(extPrivateKey.to_public())
        const publicKey = account.to_address('AddressDiscrimination.Production').to_string('addr')
        console.log('publicKey', publicKey)

        return { publicKey, privateKey }
      }
    }[walletType]

    if (bip39.validateMnemonic(mnemonic)) {
      return keys ? keys() : {}
    } else {
      return false
    }
  }
}
window.HD = new HD()
export default window.HD

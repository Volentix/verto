const config = {
  'mainnet': {
    'CHAIN_ID': 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    'EOS_ENDPOINTS': 'https://api.main.alohaeos.com:443,https://api.cypherglass.com:443,https://api.eosnewyork.io',
    'EOS_HISTORYAPI': 'https://history.cryptolions.io,http://eos.eoscafeblock.com,http://api.eosbean.com,https://api-eos.blckchnd.com,https://eos.greymass.com:443',
    'LEDGER_ACCOUNT_NAME': 'volentixfrst',
    'CROWDFUND_URL': 'https://volentix-cf.tekstackapps.com/',
    'BLOCKTOPUS_URL': 'https://volentix.blocktopus.io',
    'VENUE_URL': 'https://venue.volentix.io/',
    'ZIXIPAY_MERCHANT_ID': 'M432589',
    'EOS_TRANSACTION_EXPLORER': 'https://bloks.io/transaction/',
    'READ_THE_DOCS': 'https://vertohowto.readthedocs.io/en/latest/tutorial/'
  },
  'testnet': {
    'CHAIN_ID': '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
    'EOS_ENDPOINTS': 'https://api.kylin.alohaeos.com',
    'EOS_HISTORYAPI': 'https://api.kylin.alohaeos.com,https://api.kylin.alohaeos.com,https://api.kylin.alohaeos.com,https://api.kylin.alohaeos.com,https://api.kylin.alohaeos.com',
    'LEDGER_ACCOUNT_NAME': 'volentix1111',
    'CROWDFUND_URL': 'https://cf-dev.volentix.io/',
    'BLOCKTOPUS_URL': 'https://test.volentix.blocktopus.io/',
    'VENUE_URL': 'https://venue-dev.volentix.io/',
    'ZIXIPAY_MERCHANT_ID': 'M696982',
    'EOS_TRANSACTION_EXPLORER': 'https://kylin.eosx.io/tx/',
    'READ_THE_DOCS': 'https://vertohowto.readthedocs.io/en/latest/tutorial/'
  }
}

module.exports = {
  development: config,
  production: config
}

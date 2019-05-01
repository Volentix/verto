Core Concepts
=============

The following document provides the core concepts behind the Verto. Note that these core concepts are inline with the three main principles outlined in the `Vision <vision.html>`_.

============
Config
============

The config information for Verto, and its associated data, can be found in the verto.config file on your local operating system. Its contents are the responsibility of the owner and are never stored into a centralized service.

Note that this configuration information is designed to be extendable as the wallet begins to take on more features. For now, the focus has been on each wallet and its configuration, as a result, all the configuration can be found in the `keys` label. Each key has their configuration contained within it. However, going further, and especially once the sovereign identity management system gets more verbose, we would expect more top level elements begin to take shape in the config file. 

The following shows the configurtion as of the time of writting. Note the keys with `//` are considered comments for clearer context but do not appear in the decrypred file.

    .. code-block:: JSON

        {
            "keys": [
                {
                    "name": "Wallet Name",
                    "type": "verto/vtx/btc",
                    "key": "PUBLIC_KEY",
                    "defaultKey": true,
                    "associations": [
                        {
                            "name": "Zixipay/Blocktopus/Venue",
                            "createTime": "2019-04-03T19:00:26.164Z"
                        }
                    ],
                    "//": "This is opt in and can be removed by the user at any time.",
                    "//": "Note that the private key is encrypted even after the verto.config ",
                    "//": "has been decrypted. This is additional security for the private key.",
                    "privateKeyEncrypted": {
                        "iv": "uBkNBWS6hgmoJ0zU2vDaXw==",
                        "v": 1,
                        "iter": 10000,
                        "ks": 128,
                        "ts": 64,
                        "mode": "ccm",
                        "adata": "",
                        "cipher": "aes",
                        "salt": "uX9mUzihxaA=",
                        "ct": "PokVS37fX4+izqVGY6vJhnbS50kJzxJTswul8d0LFA2cQ/....."
                    }
                }
            ]
        }

For more details about the configuration management of the system, please see the file `src/util/ConfigManager.js`.

==============
MultiPlatform
==============

Currently, Verto is supported on the following platforms:
  1. Windows
  2. Mac
  3. Linux
  4. IOS
  5. Android
  6. Web

For the most part, the application has no differences between platforms, however, as the config information is capture on the host machine (inflixdb on the web), the mechanics for retrieving the information is managed per environment. For details on how this is accomplished, please refer to the `src/util/platformTools/index.js` file.

=========
Web?
=========

Verto has a web site for anyone to use, however, it does have one main shortcoming in that it, for now, must be hosted from a centralized S3 bucket, however, it is intended that the website be migrated to a more decentralized service (like IPFS) in the near future.

If you have any thoughts about how to decentralize the web based delivery, `please contact the team on Discord <https://discord.gg/wFAmdxq>`_.
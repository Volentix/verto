const path = require('path')

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'axios',
      'clipboard',
      'configManager',
      'documentationManger',
      'i18n',
      'vuelidate'
    ],

    css: [
      'app.styl'
    ],

    extras: [
      'roboto-font',
      'material-icons', // optional, you are not bound to it
      // 'ionicons-v4',
      // 'mdi-v3',
      'fontawesome-v5'
      // 'eva-icons'
    ],

    framework: {
      // all: true, // --- includes everything; for dev only!

      components: [
        'QAvatar',
        'QInnerLoading',
        'QBtn',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QCircularProgress',
        'QChip',
        'QDialog',
        'QDrawer',
        'QExpansionItem',
        'QField',
        'QHeader',
        'QIcon',
        'QInput',
        'QItem',
        'QItemLabel',
        'QTable',
        'QMarkupTable',
        'QBtnToggle',
        'QTr',
        'QTd',
        'QCheckbox',
        'QItemLabel',
        'QItemSection',
        'QLinearProgress',
        'QSelect',
        'QItemSection',
        'QLayout',
        'QList',
        'QPage',
        'QPageContainer',
        'QSeparator',
        'QStep',
        'QStepper',
        'QStepperNavigation',
        'QToolbar',
        'QToolbarTitle',
        'QTooltip'
      ],

      directives: [
        'ClosePopup',
        'Ripple'
      ],

      // Quasar plugins
      plugins: [
        'Notify',
        'Dialog'
      ]

      // iconSet: 'ionicons-v4'
      // lang: 'de' // Quasar language
    },

    supportIE: true,

    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          '@': path.resolve(__dirname, './src')
        }
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            cache: true,
            fix: true
          }
        })
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app'
      // noIosLegacyBuildFlag: true // uncomment only if you know what you are doing
    },

    electron: {
      bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
      },
      // chainWebpack (chain) {
      //  chain.plugin('icon-factory')
      //    .use(IconFactory, [
      //      [{
      //        preset: 'kitchensink',
      //        source: './src/statics/icon-prototype.png',
      //        target: './src/statics/',
      //        options: {
      //          background_color: '#000000',
      //          theme_color: '#1f273a'
      //        },
      //        minify: 'optipng',
      //        mode: false,
      //        debug: true
      //      }]
      //    ])
      // },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
        'productName': 'Verto',
        'appId': 'io.volentix.verto',
        /* eslint-disable */
        'artifactName': '${name}-${os}-${version}.${ext}',
        /* eslint-enable */
        // "directories": {
        //   "output": "build"
        // },
        // "files": [
        //   "dist/electron/**/*"
        // ],
        'extraResources': [
          'resources/**'
        ],
        'dmg': {
          'contents': [{
            'x': 410,
            'y': 150,
            'type': 'link',
            'path': '/Applications'
          },
          {
            'x': 130,
            'y': 150,
            'type': 'file'
          }
          ]
        },
        'mac': {
          'icon': 'src/statics/icons/icon.icns',
          'target': [
            'zip',
            'dmg'
          ],
          'extendInfo': {
            'NSAppTransportSecurity': {
              'NSAllowsArbitraryLoads': false
            },
            'NSExceptionDomains': {
              'localhost': {
                'NSTemporaryExceptionAllowsInsecureHTTPSLoads': false,
                'NSIncludesSubdomains': false,
                'NSTemporaryExceptionAllowsInsecureHTTPLoads': true,
                'NSTemporaryExceptionMinimumTLSVersion': '1.0',
                'NSTemporaryExceptionRequiresForwardSecrecy': false
              }
            }
          }
        },
        'win': {
          'icon': 'src/statics/icons/icon.ico',
          'target': 'nsis',
          'publisherName': 'Volentix Labs, Inc.'
        },
        'linux': {
          'category': 'Network',
          'description': 'A multi-currency crypto wallet with initial support for EOS & VTX',
          'desktop': {
            'Name': 'Verto',
            'GenericName': 'Verto Wallet',
            'X-GNOME-FullName': 'Verto',
            'Comment': 'A multi-currency crypto wallet with initial support for EOS & VTX',
            'Type': 'Application',
            'Terminal': 'false',
            'StartupNotify': 'false',
            'Categories': 'Network;'
          },
          'icon': 'src/statics/icons/...',
          'target': 'AppImage'
        },
        'publish': [{
          'owner': 'Volentix',
          'provider': 'github',
          'releaseType': 'draft',
          'url': 'https://github.com/Volentix/verto.git'
        }]
      }
    }
  }
}

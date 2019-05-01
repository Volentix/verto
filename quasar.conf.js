// import configManager from './src/plugins/configManager';

// Configuration for your app
const path = require('path')
const IconFactory = require('icon-factory')
const configObj = require('./config')
const config = Object.keys(configObj).reduce((last, current) => {
  last[current] = JSON.stringify(configObj[current])
  return last
}, {})

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'i18n',
      'axios',
      'clipboard',
      'configManager',
      'vuelidate',
      'documentationManger'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons', // optional, you are not bound to it
      // 'ionicons',
      // 'mdi',
      'fontawesome'
    ],
    supportIE: false,
    build: {
      scopeHoisting: true,
      env: config,
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
            cache: true
          }
        })
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'openURL',
        'QBtn',
        'QCard',
        'QCardActions',
        'QCardMain',
        'QCardMedia',
        'QCardSeparator',
        'QCardTitle',
        'QCheckbox',
        'QCollapsible',
        'QField',
        'QIcon',
        'QInput',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QItemTile',
        'QJumbotron',
        'QLayout',
        'QLayoutDrawer',
        'QLayoutFooter',
        'QLayoutHeader',
        'QList',
        'QListHeader',
        'QModal',
        'QPage',
        'QPageContainer',
        'QProgress',
        'QRouteTab',
        'QScrollArea',
        'QSelect',
        'QSlideTransition',
        'QTab',
        'QTable',
        'QTabPane',
        'QTabs',
        'QTd',
        'QToolbar',
        'QToolbarTitle',
        'QTooltip',
        'QTr',
        'QUploader',
        'QChip',
        'QStepper',
        'QStep',
        'QStepperNavigation',
        'QInnerLoading',
        'QSpinner',
        'QBtnToggle',
        'QWindowResizeObservable'
      ],
      directives: [
        'Ripple',
        'CloseOverlay'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'Dialog'
      ]
      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      // i18n: 'de' // Quasar language
    },
    // animations: 'all' --- includes all animations
    animations: [],
    ssr: {
      pwa: false
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
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
            'src': 'statics/pwa/generic-icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/pwa/generic-icon-144x144.png',
            'sizes': '144x144',
            'type': 'image/png'
          },
          {
            'src': 'statics/pwa/generic-icon-168x168.png',
            'sizes': '168x168',
            'type': 'image/png'
          },
          {
            'src': 'statics/pwa/generic-icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/pwa/generic-icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
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

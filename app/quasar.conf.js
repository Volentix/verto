const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = function (ctx) {
  return {
    vendor: {
      disable: false
    },
    boot: [
      'axios',
      'clipboard',
      'configManager',
      'documentationManger',
      'i18n',
      'eventBus',
      'vuelidate',
      'bexSetup'
    ],

    css: [
      'app.styl'
    ],

    extras: [
      'roboto-font',
      'material-icons', // optional, you are not bound to it
      'material-icons-outlined', // optional, you are not bound to it
      // 'ionicons-v4',
      // 'mdi-v3',
      'fontawesome-v5'
      // 'eva-icons'
    ],

    framework: {
      // all: true, // --- includes everything; for dev only!

      components: [
        'QOptionGroup',
        'QBanner',
        'QForm',
        'QPopupProxy',
        'QSpinner',
        'QBadge',
        'QSlider',
        'QToggle',
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
        'QTooltip',
        'QTabs',
        'QTab',
        'QRouteTab',
        'QTabPanels',
        'QTabPanel',
        'QToggle',
        'QUploader',
        'QEditor',
        'QImg',
        'QSplitter',
        'Loading',
        'QBtnDropdown',
        'QBar',
        'QSpace',
        'QFab',
        'QFabAction',
        'QPageSticky',
        'QBreadcrumbs',
        'QBreadcrumbsEl',
        'QSkeleton',
        'QMarkupTable',
        'QRadio',
        'QSpinnerDots',
        'QTimeline',
        'QTimelineEntry',
        'QMenu',
        'QScrollArea',
        'QPullToRefresh',
        'QFooter',
        'QFile',
        'QVirtualScroll'
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
      uglifyOptions: {
        keep_fnames: true,
       compress: { drop_console: true }
      },
      scopeHoisting: true,
      vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      extractCSS: true,
      extendWebpack (cfg) {
        console.log(cfg)
        // cfg.plugins.push(
        //   new HtmlWebpackPlugin({
        //     template: `${__dirname}\\src\\index2.template.html`,
        //     filename: 'index3.html',
        //     chunks: 'all',
        //     ctx: ctx,
        //     process: { env: env },
        //     productName: 'PageTitle 3',
        //     productDescription: 'PageDescription 3',
        //     minify: true,
        //     hash: true
        //   })
        // )
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          '@': path.resolve(__dirname, './src')
        }
        /*
        if (process.env.QMODE === 'bex' && cfg.mode === 'production') {
          //
          cfg.plugins.push(
            new HtmlWebpackPlugin({
              template: `${__dirname}/src-bex/background.template.html`,
              filename: `${__dirname}/dist/bex/UnPackaged/background.html`,
              excludeChunks: ['bex-content-script', 'bex-dom'],
              productName: 'Verto Background',
              productDescription: 'Verto Background',
              minify: false,
              hash: false
            })
          )
          cfg.optimization.splitChunks = {
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'initial',
                maxSize: 4000000
              },
              app: {
                maxSize: 2000000
              }
            }
            // chunks: ['app'],
            // maxSize: 2000000
          }
        }
         */
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
        cfg.module.rules.push({
          test: /\.(glb)$/,
          loader: 'file-loader',
          exclude: /node_modules/
        })
        // cfg.module.rules.push({
        //   test: /\.(hdr)$/,
        //   loader: 'file-loader',
        //   exclude: /node_modules/
        // })
        // cfg.module.rules.push({
        //   test: /\.(fbx)$/,
        //   loader: 'file-loader',
        //   exclude: /node_modules/
        // })
      }
    },

    devServer: {
      // before (app) {
      //   const cors = require('cors')
      //   app.use(cors())
      // },
      // https: true,
      // port: 8080,
      watchOptions: {
        poll: 1000 // Check for changes every second
      },
      open: true // opens browser window automatically
    },

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
      id: 'org.cordova.vertoapp'
      // noIosLegacyBuildFlag: true // uncomment only if you know what you are doing
    },
    bex: {
      extendWebpack (cfg) {
        cfg.optimization.splitChunks = {
          // include all types of chunks
          cacheGroups: {
            defaultVendors: {
              chunks: 'all',
              name: 'vendor'
            },
            app: {
              chunks: 'all',
              name: 'all'
            }
          },

          chunks: 'all',
          maxSize: 2000000
        }
      }
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
        'version': '123',
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

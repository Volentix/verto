/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.conf.js > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/

import 'quasar/dist/quasar.ie.polyfills.js'



import '@quasar/extras/roboto-font/roboto-font.css'

import '@quasar/extras/material-icons/material-icons.css'

import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'

import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'




// We load Quasar stylesheet file
import 'quasar/dist/quasar.styl'




import 'src/css/app.styl'


import Vue from 'vue'
import createApp from './app.js'




import qboot_Bootaxios from 'boot/axios'

import qboot_Bootclipboard from 'boot/clipboard'

import qboot_BootconfigManager from 'boot/configManager'

import qboot_BootdocumentationManger from 'boot/documentationManger'

import qboot_Booti18n from 'boot/i18n'

import qboot_BooteventBus from 'boot/eventBus'

import qboot_Bootvuelidate from 'boot/vuelidate'

import qboot_BootbexSetup from 'boot/bexSetup'

import qboot_Quasarappextensionualvuejsrendereraesrcbootfilejs from 'quasar-app-extension-ual-vuejs-renderer-ae/src/bootfile.js'







Vue.config.devtools = true
Vue.config.productionTip = false



console.info('[Quasar] Running SPA.')





async function start () {
  const { app, store, router } = await createApp()

  

  
  let routeUnchanged = true
  const redirect = url => {
    routeUnchanged = false
    window.location.href = url
  }

  const urlPath = window.location.href.replace(window.location.origin, '')
  const bootFiles = [qboot_Bootaxios,qboot_Bootclipboard,qboot_BootconfigManager,qboot_BootdocumentationManger,qboot_Booti18n,qboot_BooteventBus,qboot_Bootvuelidate,qboot_BootbexSetup,qboot_Quasarappextensionualvuejsrendereraesrcbootfilejs]

  for (let i = 0; routeUnchanged === true && i < bootFiles.length; i++) {
    if (typeof bootFiles[i] !== 'function') {
      continue
    }

    try {
      await bootFiles[i]({
        app,
        router,
        store,
        Vue,
        ssrContext: null,
        redirect,
        urlPath
      })
    }
    catch (err) {
      if (err && err.url) {
        window.location.href = err.url
        return
      }

      console.error('[Quasar] boot error:', err)
      return
    }
  }

  if (routeUnchanged === false) {
    return
  }
  

  

    

    

    
      new Vue(app)
    

    

    

  

}

start()

import Vue from 'vue'
// import { shell, clipboard } from 'electron'
import { userError } from '@/util/errorHandler'
import { userResult } from '@/util/resultHandler'
import axios from 'axios'
// const { app, dialog } = require('electron').remote
// const fs = require('fs')

/**
 * Function returns an array with removed duplicates by any field in the object
 * @param {Array} arr - Array of objects to work with.
 * @param {string} comp - Field to check.
 *
 * @return {Array} Array of objects with uremoved duplicates
 *
 * @example
 *
 *    var unique = getUnique([{'key':1}, {'key':2}, {'key':3}, {'key':3}, {'key':3}], 'key')
 *    unique = [{'key':1}, {'key':2}, {'key':3}]
 */
function getUnique (arr, comp) {
  const unique = arr
    .map(e => e[comp])
    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
    // eliminate the dead keys & store unique objects
    .filter(e => arr[e])
    .map(e => arr[e])
  return unique
}

/**
 * Sort array of object by key field
 *
 * @param {*} array
 * @param {*} key
 * @returns {Array} Sorted Array
 */
function sortByKey (array, key) {
  return array.sort(function (a, b) {
    var x = a[key]
    var y = b[key]
    return x < y ? -1 : x > y ? 1 : 0
  })
}
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
function getUniqueLocations (locations) {
  let data = []
  for (let i = 0; i < locations.length; i++) {
    if (data.some(item => item.city === locations[i].city)) {
      data.find(item => item.city === locations[i].city).ids.push(locations[i].id)
    } else {
      data.push({ city: locations[i].city, lat: locations[i].lat, long: locations[i].long, ids: [locations[i].id] })
    }
  }
  return data
}

function openExternal (link, parameter = '') {
  // shell.openExternal(link + parameter)
}

function copyToClipboard (data) {
  try {
  //  clipboard.writeText(data)
  } catch (error) {
    userError(error, 'Copy to clipboard action')
  } finally {
    userResult('Copied')
  }
}

function getVersion () {
//  return app.getVersion()
}

function getTime () {
  return Math.floor(new Date().getTime() / 1000)
}

function formatBytes (bytes, decimals) {
  if (bytes === 0) return '0 Bytes'
  var k = 1024,
    dm = decimals <= 0 ? 0 : decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

function getInstaller () {
  // TODO: Redo the env variables with electron-store
  let way = process.env.NODE_WAY
  if (way.includes('readme')) {
    require('electron').shell.openExternal(this.$configStore.get('node_readme'))
  } else if (way.includes('installer')) {
    axios({
      method: 'get',
      url: process.env.INSTALLER,
      responseType: 'arraybuffer'
    })
      .then(response => {
        forceFileDownload(response)
      })
      .catch(error => {
        userError(error, 'Get Installer action')
        throw error
      })
  }
}

function forceFileDownload (response) {
  /* var options = {
    title: 'Save installer',
    defaultPath: 'installer',
    buttonLabel: 'Save',

    filters: [{ name: 'sh', extensions: ['sh'] }]
  }
*/
  // dialog.showSaveDialog(options, filename => {
  //  fs.writeFileSync(filename, response.data, 'utf-8')
  // })
}

/**
 * STUB for future notification center in renderer process
 */
// function notifyMe () {
//   // Let's check if the browser supports notifications
//   if (!('Notification' in window)) {
//     alert('This browser does not support desktop notification')
//   } else if (Notification.permission === 'granted') {
//     // If it's okay let's create a notification
//     var notification = new Notification('Hi there!')
//   } else if (Notification.permission !== 'denied') {
//     Notification.requestPermission().then(function (permission) {
//       // If the user accepts, let's create a notification
//       if (permission === 'granted') {
//         var notification = new Notification('Hi there!')
//       }
//     })
//   }
// }

async function checkEosEndpoint (url) {
  return new Promise(resolve => {
    Vue.prototype
      .$http({
        method: 'get',
        url: url + '/v1/chain/get_info',
        responseType: 'arraybuffer'
      })
      .then(response => {
        if (response.status === 200) resolve(true)
        else resolve(false)
      })
      .catch(error => {
        // userError(error, 'Check EOS endpoint')
        resolve(false)
        throw error
      })
  })
}

async function checkNodeApi (url) {
  return new Promise(resolve => {
    Vue.prototype
      .$http({
        method: 'get',
        url: url,
        responseType: 'arraybuffer'
      })
      .then(response => {
        if (response.status === 200) resolve(true)
        else resolve(false)
      })
      .catch(error => {
        // userError(error, 'Check Node API')
        resolve(false)
        throw error
      })
  })
}

export {
  getUnique,
  sortByKey,
  openExternal,
  formatBytes,
  getUniqueLocations,
  getInstaller,
  getVersion,
  getTime,
  sleep,
  copyToClipboard,
  checkEosEndpoint,
  checkNodeApi
}

import electron from 'electron'
const path = require('path')
const fs = require('fs')
import { saveAs } from 'file-saver'

const filePath = () => Promise.resolve(path.join(electron.remote.app.getPath('userData'), '/verto.config'))

const readFile = (filename) => {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, 'utf8', function (err, data) {
      if (err) { reject(err) } else { resolve(data) }
    })
  })
}

const writeFile = (...args) => {
  return new Promise(function (resolve, reject) {
    fs.writeFile(...args, function (err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}
const unlink = (...args) => {
  return new Promise(function (resolve, reject) {
    fs.unlink(...args, function (err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

const downloadFile = (text, fileName) => {
  return new Promise(function (resolve, reject) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, fileName)
    resolve()
  })
}

export default {
  ...fs,
  filePath,
  readFile,
  writeFile,
  unlink,
  downloadFile
}

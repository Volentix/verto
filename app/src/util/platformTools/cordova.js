const deviceReady = () => {
  return new Promise((resolve, reject) => {
    document.addEventListener('deviceready', resolve(), false)
  })
}

const fileName = 'verto.config'
function cordovaWriteFile (dirEntry, fileName, data, isAppend = false) {
  // Creates a new file or returns the file if it already exists.
  return new Promise((resolve, reject) => {
    dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
      resolve(createFile(fileEntry, data, isAppend))
    }, (e) => {
      reject(e)
      // TODO: Exception handling
    })
  })
}

const resolveLocalFileOrDir = (path, file = '') => {
  return new Promise((resolve, reject) => {
    deviceReady().then(() => {
      const dirOrFile = path + file
      window.resolveLocalFileSystemURL(dirOrFile, entry => {
        resolve(entry)
      }, (e) => {
        reject(e)
        // TODO: Exception handling
      })
    })
  })
}

const cordovaReadFile = (fileEntry) => {
  return new Promise((resolve, reject) => {
    fileEntry.file((file) => {
      const reader = new FileReader()
      reader.onloadend = function () { resolve(this.result) }
      reader.readAsText(file)
    }, (e) => reject(e))
  })
}

const createFile = (fileEntry, dataObj) => {
  return new Promise((resolve, reject) => {
    fileEntry.createWriter((fileWriter) => {
      fileWriter.onwriteend = () => resolve(cordovaReadFile(fileEntry))
      fileWriter.onerror = (e) => reject(e)
      fileWriter.write(dataObj)
    }, (e) => reject(e))
  })
}

const writeFile = async (path, data, charSet = 'utf-8') => {
  try {
    let splitPath
    let name
    if (path.includes('.')) {
      splitPath = path.split('/')
      name = splitPath.splice(splitPath.length - 1, 1)[0]
      path = splitPath.join('/')
    }
    const dirEntry = await resolveLocalFileOrDir(path)
    return cordovaWriteFile(dirEntry, name || fileName, data)
  } catch (e) {
    return e
    // TODO: Exception handling
  }
}

const readFile = async (path, charSet = 'utf-8') => {
  try {
    const fileEntry = await resolveLocalFileOrDir(path, fileName)
    return cordovaReadFile(fileEntry)
  } catch (e) {
    return e
    // TODO: Exception handling
  }
}

const filePath = () => {
  return new Promise((resolve, reject) => {
    deviceReady().then(() => {
      if (window.cordova.file.documentsDirectory) {
        resolve(window.cordova.file.documentsDirectory)
      } else {
        resolve(window.cordova.file.dataDirectory)
      }
    })
  })
}

const unlink = (path) => {
  return new Promise(async (resolve, reject) => {
    const fileEntry = await resolveLocalFileOrDir(path, fileName)
    fileEntry.remove(function (file) {
      resolve(file)
      window.alert('file removed!')
    }, function (error) {
      reject(error)
      window.alert('error occurred: ' + error.code)
    }, function () {
      reject(new Error('file does not exist'))
      window.alert('file does not exist')
    })
    return fileEntry
  })
}

const downloadFile = async (text, optionalFileName) => {
  return new Promise(async (resolve, reject) => {
    const path = await filePath()
    const fname = optionalFileName || fileName
    if (window.cordova.file.documentsDirectory) {
      await writeFile(path + fname, text)
      cordova.plugins.fileOpener2.open(path + fname, 'text/plain', {
        error: function (e) {
          reject(e)
          // TODO: Exception handling
        },
        success: function () {
          resolve()
        }
      })
    } else {
      let permissions = cordova.plugins.permissions
      permissions.checkPermission(permissions.READ_EXTERNAL_STORAGE, (status) => {
        if (status.hasPermission) {
          writeFile(cordova.file.externalRootDirectory + 'download/' + fname, text).then(() => {
            resolve()
          })
        } else {
          permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, (status) => {
            writeFile(cordova.file.externalRootDirectory + 'download/' + fname, text).then(() => {
              resolve()
            })
          }, null)
        }
      }, (e) => {
        reject(e)
        // TODO: Exception handling
      })
    }
  })
}

export {
  readFile,
  writeFile,
  filePath,
  unlink,
  downloadFile
}

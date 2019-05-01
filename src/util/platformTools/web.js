import { writeFile as writeFileWeb, readString, removeFile } from 'fs-web'
import { saveAs } from 'file-saver'

const filePath = () => Promise.resolve('/verto.config')

const readFile = (filename) => {
  return readString(filename)
}

const writeFile = async (...args) => {
  await writeFileWeb(...args)
  return readFile(args[0])
}
const unlink = (...args) => {
  removeFile(...args)
}

const downloadFile = (text, fileName) => {
  return new Promise(function (resolve, reject) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, fileName)
    resolve()
  })
}

export default {
  filePath,
  readFile,
  writeFile,
  unlink,
  downloadFile
}

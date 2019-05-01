import { Notify } from 'quasar'

const cleanError = (message) => {
  return message.replace(/^Error: /, '')
}

class ErrorHandler extends Error {
  constructor (err) {
    const message = err instanceof Error ? err.message : err

    const cleanMessage = cleanError(message)
    const error = super(cleanMessage)
    error.customMessage = cleanMessage
    return error
  }
}

export const userError = (message) => {
  if (!process.env.PROD) return devError(message)
  const error = new ErrorHandler(message)
  Notify.create({ message: error.customMessage })
}

export const devError = (message) => {
  // With user permission log to server or service
  if (process.env.PROD) return
  const error = new ErrorHandler(message)
  Notify.create({ message: error.customMessage })
  throw error
}

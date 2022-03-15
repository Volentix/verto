/*
export function someAction (context) {
}
*/
import { Notify } from 'quasar'
import axios from 'axios'
// import initWallet from '@/util/_Wallets2Tokens'
import parseDb from '@/util/Staider/ParseWrapper'
import {
  version
} from '../../../package.json'

export const setAirplaneMode = ({ commit }, data) => {
  commit('setAirplaneMode', data)
}

export const toggleNetwork = ({ commit }, data) => {
  commit('toggleNetwork', data)
}

export const temporary = ({ commit }, data) => {
  commit('temporary', data)
}

export const rightOrder = ({ commit }, data) => {
  commit('rightOrder', data)
}

const versionToInt = (version) => {
  return parseInt(version.toString().split('.').join(''))
}

export const getSettings = ({ commit }, data) => {
  axios.get('https://cpu.volentix.io/api/global/vertoSettings').then(response => {
    let settings = response.data
    if (!settings || settings.error) {
      settings = localStorage.getItem('globalSettings')
      if (settings) settings = JSON.parse(settings)
    } else {
      if (process.env.QMODE !== 'bex' && version !== settings.vertoVersion && settings.vertoVersion && versionToInt('0.9.260.7') && versionToInt(settings.vertoVersion) > versionToInt(version)) {
        Notify.create({
          message: 'New Version available (v' + settings.vertoVersion + ')',
          color: 'black',
          position: 'top',
          // #SUJAN timeout: 360000,
          timeout: 3600,
          avatar: 'https://verto.volentix.io/statics/icons/vtx-logo-1024x1024.png',
          actions: [
            { label: 'Refresh Page',
              color: 'white',
              handler: () => {
                location.reload(true)
              } }
          ]
        })
      }
    }

    commit('setGlobalSettings', settings)
    // initWallet({ fromCache: true })
  })
}

export const initiateFeeds = async (context, payload) => {
  try {
    context.dispatch('getUpvotes', payload)
    context.dispatch('subscribeComments', payload)
    context.dispatch('subscribeReplies', payload)
  } catch (error) {
    context.dispatch('getUpvotes', payload)
    context.dispatch('subscribeComments', payload)
    context.dispatch('subscribeReplies', payload)
  }
}

export const subscribeComments = async (context, payload) => {
  try {
    if (context.state.subscribed_comments) {
      context.dispatch('getComments', payload)
      return
    }
    const parseQuery = parseDb.parseQuery('Comments')
    const live_event = await parseQuery.subscribe()
    context.commit('subscribedComments', live_event)

    live_event.on('open', () => {
      console.log('subscribeComments')
      context.dispatch('getComments', payload)
    })

    const insertComment = async (response) => {
      try {
        const data = JSON.parse(JSON.stringify(response.attributes))
        data.obj = response
        context.commit('insertComment', data)
      } catch (error) {
        console.log(error)
      }
    }

    live_event.on('create', insertComment)

    live_event.on('update', insertComment)

    live_event.on('delete', async response => {
      context.commit('removeComment', { ...response.attributes })
    })
  } catch (error) {
    context.dispatch('subscribeComments', payload)
  }
}

export const subscribeReplies = async (context, payload) => {
  try {
    if (context.state.subscribed_comments) {
      context.dispatch('getReplies', payload)
      return
    }
    const parseQuery = parseDb.parseQuery('Replies')
    const live_event = await parseQuery.subscribe()
    context.commit('subscribedReplies', live_event)

    live_event.on('open', () => {
      console.log('subscribeReplies')
      context.dispatch('getReplies', payload)
    })

    const insertReply = async (response) => {
      try {
        const data = JSON.parse(JSON.stringify(response.attributes))
        data.obj = response
        context.commit('insertReply', data)
      } catch (error) {
        console.log(error)
      }
    }

    live_event.on('create', insertReply)

    live_event.on('update', insertReply)

    live_event.on('delete', async response => {
      context.commit('removeReply', { ...response.attributes })
    })
  } catch (error) {
    context.dispatch('subscribeReplies', payload)
  }
}

export async function getUpvotes (context, payload) {
  try {
    const parseQuery = parseDb.parseQuery('Upvotes')
    parseQuery.find()
      .then((response) => {
        for (const element of response) {
          const data = JSON.parse(JSON.stringify(element.attributes))
          data.obj = element
          context.commit('insertUpvote', data)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  } catch (error) {
    console.log(error)
  }
}

export const addUpvote = async (context, payload) => {
  return new Promise(async function (resolve, reject) {
    const parseObject = parseDb.parse('Upvotes')
    for (const key in payload) {
      parseObject.set(key, payload[key])
    }

    parseObject.save(payload)
      .then(async (response) => {
        const data = JSON.parse(JSON.stringify(response.attributes))
        data.obj = response
        // data.obj.destroy()
        context.commit('insertUpvote', data)
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export async function getComments (context, payload) {
  try {
    const parseQuery = parseDb.parseQuery('Comments')
    parseQuery.find()
      .then((response) => {
        for (const element of response) {
          const data = JSON.parse(JSON.stringify(element.attributes))
          data.obj = element
          // data.obj.destroy()
          context.commit('insertComment', data)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  } catch (error) {
    console.log(error)
  }
}

export async function getReplies (context, payload) {
  try {
    const parseQuery = parseDb.parseQuery('Replies')
    parseQuery.find()
      .then((response) => {
        for (const element of response) {
          const data = JSON.parse(JSON.stringify(element.attributes))
          data.obj = element
          // data.obj.destroy()
          context.commit('insertReply', data)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  } catch (error) {
    console.log(error)
  }
}

export const addComment = async (context, payload) => {
  return new Promise(async function (resolve, reject) {
    const parseObject = parseDb.parse('Comments')
    for (const key in payload) {
      parseObject.set(key, payload[key])
    }

    parseObject.save(payload)
      .then(async (response) => {
        const comment = JSON.parse(JSON.stringify(response.attributes))
        comment.obj = response
        console.log(comment)
        context.commit('insertComment', comment)
        resolve(comment)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const addReply = async (context, payload) => {
  return new Promise(async function (resolve, reject) {
    const parseObject = parseDb.parse('Replies')
    for (const key in payload) {
      parseObject.set(key, payload[key])
    }

    parseObject.save(payload)
      .then(async (response) => {
        const comment = JSON.parse(JSON.stringify(response.attributes))
        comment.obj = response
        console.log(comment)
        context.commit('insertReply', comment)
        resolve(comment)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

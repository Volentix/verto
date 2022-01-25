/*
export function someAction (context) {
}
*/
import { Notify } from 'quasar'
import axios from 'axios'
import initWallet from '@/util/Wallets2Tokens'
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
    initWallet()
  })
}

export const subscribeUpvotes = async (context, payload) => {
  try {
    const parseQuery = parseDb.parseQuery('Upvotes')
    const live_event = await parseQuery.subscribe()

    live_event.on('open', () => {
      console.log('subscribeUpvotes')
      context.dispatch('getUserNotifications', payload)
    })

    const insertUpvote = async (response) => {
      try {
        const upvote = JSON.parse(JSON.stringify(response.attributes))
        upvote.id = response.id
        console.log(upvote)
      } catch (error) {
        console.log(error)
      }
    }

    live_event.on('create', insertUpvote)

    live_event.on('update', insertUpvote)

    live_event.on('delete', async response => {
      const upvote = JSON.parse(JSON.stringify(response.attributes))
      upvote.id = response.id
      console.log(upvote)
    })
  } catch (error) {
    context.dispatch('subscribeUpvotes', payload)
    // context.dispatch("getUserNotifications",payload)
  }
}

export const addUpvote = async (context, payload) => {
  return new Promise(async function (resolve, reject) {
    const parseObject = parseDb.parse('Upvotes')
    for (const key in payload) {
      parseObject.set(key, payload[key])
    }
    // var acl = parseDb.acl()
    // acl.setPublicReadAccess(true)
    // acl.setWriteAccess(payload.user, true)
    // parseObject.setACL(acl)

    parseObject.save(payload)
      .then(async (response) => {
        const upvote = JSON.parse(JSON.stringify(response.attributes))
        upvote.obj = response
        console.log(upvote)
        context.commit('insertUpvote', upvote)
        resolve(upvote)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export async function getUpvotes (context, payload) {
  try {
    const parseQuery = parseDb.parseQuery('Upvotes')
    parseQuery.find()
      .then((response) => {
        for (const element of response) {
          console.log(element)
          const upvote = JSON.parse(JSON.stringify(element.attributes))
          upvote.obj = element
          context.commit('insertUpvote', upvote)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  } catch (error) {
    console.log(error)
  }
}

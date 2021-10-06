/*
export function someAction (context) {
}
*/

export function notify (context, payload) {
  context.commit('setMessage', payload)
  setTimeout(() => context.commit('setMessage', {
    message: '',
    type: ''
  }), 3000)
}
export function success (context, payload) {
  context.dispatch('notify', {
    message: payload,
    type: 'success',
    timeout: 3000
  })
}

export function error (context, payload) {
  context.dispatch('notify', {
    message: payload,
    type: 'error'
  })
}

export function banner (context, payload) {
  context.dispatch('notify', {
    message: payload,
    type: 'banner'
  })
}

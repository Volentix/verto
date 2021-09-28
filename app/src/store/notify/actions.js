/*
export function someAction (context) {
}
*/

export function notify (context, payload) {
  context.commit('setMessage', payload)
  setTimeout(() => context.commit('setMessage', {
    message: '',
    type: ''
  }), 2000)
}
export function success (context, payload) {
  context.dispatch('notify', {
    message: payload,
    type: 'success'
  })
}

export function error (context, payload) {
  context.dispatch('notify', {
    message: payload,
    type: 'error'
  })
}

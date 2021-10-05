/*
export function someMutation (state) {
}
*/
export function setMessage (state, payload) {
  state.message = payload.message
  state.type = payload.type
}

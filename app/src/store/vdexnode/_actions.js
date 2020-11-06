
export const login = ({ commit }, data) => {
  return new Promise((resolve, reject) => {
    commit('setPrivateKey', data.privateKey)
    commit('setPublicKey', data.publicKey)
    commit('setAccountName', data.accountName)
    commit('setLoggedIn')
    commit('setMethod', 'private')
    resolve()
  })
}
export const logout = ({ commit }) => {
  return new Promise((resolve, reject) => {
    commit('logout')
    resolve()
  })
}

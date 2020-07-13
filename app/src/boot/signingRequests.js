import SigningRequests from '../util/signingRequests'

export default ({ Vue }) => {
  Vue.prototype.$signingRequests = SigningRequests
}

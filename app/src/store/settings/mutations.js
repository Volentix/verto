/*
export function someMutation (state) {
}
*/
import initWallet from '@/util/_Wallets2Tokens'

export const setAirplaneMode = (state, data) => {
  state.airplaneMode = data
}
export const setComponentState = (state, data) => {
  state.components[data.key] = data.data
}
export const setGlobalSettings = (state, data) => {
  for (let key in data) {
    if (!state.globalSettings[key]) {
      state.globalSettings[key] = data[key]
    }
  }
  initWallet()
  localStorage.setItem('globalSettings', JSON.stringify(data))
}
export const setGlobalSettingsItem = (state, item) => {
  state.globalSettings[item.key] = item.data
}

export const setEosSwapSlippage = (state, data) => {
  state.eos.swapSlippage = data
}
export const toggleNetwork = (state, data) => {
  state.network = data
}
export const updatelightMode = (state, lightMode) => {
  state.lightMode = lightMode
}
export const temporary = (state, data) => {
  state.temporary = data
}

export const rightOrder = (state, data) => {
  state.rightOrder = data
}
export const setMenu = (state, payload) => {
  state.defiMenu = payload
}
export const setCoinData = (state, payload) => {
  state.coins[payload.source] = payload.data
}
export const setDex = (state, data) => {
  if (data.depositCoin) { state.dexData.depositCoin = data.depositCoin }
  if (data.destinationCoin) { state.dexData.destinationCoin = data.destinationCoin }
  if (data.fromAmount) { state.dexData.fromAmount = data.fromAmount }
  if (state.selectedDex !== data.dex) { state.selectedDex = data.dex }
}
export const updateState = (state, payload) => {
  state[payload.key] = payload.value
}

export const insertUpvote = (state, data) => {
  const index = state.upvotes.findIndex(store => store.upvote_id === data.upvote_id)
  if (index < 0) {
    state.upvotes.push(data)
  } else {
    state.upvotes.splice(index, 1, data)
  }
}

export const removeUpvote = (state, data) => {
  const index = state.upvotes.findIndex(store => store.upvote_id === data.upvote_id)
  if (index >= 0) {
    state.upvotes.splice(index, 1)
  }
}

export const insertComment = (state, data) => {
  const index = state.comments.findIndex(store => store.comment_id === data.comment_id)
  if (index < 0) {
    state.comments.push(data)
  } else {
    state.comments.splice(index, 1, data)
  }
}

export const removeComment = (state, data) => {
  const index = state.comments.findIndex(store => store.comment_id === data.comment_id)
  if (index >= 0) {
    state.comments.splice(index, 1)
  }
}

export const insertReply = (state, data) => {
  const index = state.replies.findIndex(store => store.reply_id === data.reply_id)
  if (index < 0) {
    state.replies.push(data)
  } else {
    state.replies.splice(index, 1, data)
  }
}

export const removeReply = (state, data) => {
  const index = state.replies.findIndex(store => store.reply_id === data.reply_id)
  if (index >= 0) {
    state.replies.splice(index, 1)
  }
}

export const subscribedComments = (state, data) => {
  state.subscribed_comments = data
}

export const subscribedReplies = (state, data) => {
  state.subscribed_replies = data
}

/*
export function someMutation (state) {
}
*/
import initWallet from '@/util/Wallets2Tokens'

export const setAirplaneMode = (state, data) => {
  state.airplaneMode = data
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

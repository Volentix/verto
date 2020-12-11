/*
export function someMutation (state) {
}
*/
export const updateTokens = (state, updatedtokens) => {
  state.tokens = updatedtokens
}
export const setLoadingState = (state, value) => {
  state.loaded.eos = value.hasOwnProperty('eos') ? value.eos : state.loaded.eos
  state.loaded.eth = value.hasOwnProperty('eth') ? value.eth : state.loaded.eth
}
export const updatePortfolioTotal = (state, updatedportfolioTotal) => {
  state.portfolioTotal = updatedportfolioTotal
}

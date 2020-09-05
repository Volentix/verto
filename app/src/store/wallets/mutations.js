/*
export function someMutation (state) {
}
*/
export const updateTokens = (state, updatedtokens) => {
  state.tokens = updatedtokens
}
export const updatePortfolioTotal = (state, updatedportfolioTotal) => {
  state.portfolioTotal = updatedportfolioTotal
}

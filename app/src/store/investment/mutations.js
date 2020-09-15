/*
export function someMutation (state) {
}
*/

export const setSelectedPool = (state, pool) => {
    state.selectedPool = pool
    }
export const setPools = (state, pools) => {
    state.pools = pools
    }
export const updatePools = (state, pool) => {
    state.pools.push(pool)
   }
export const setTokens = (state, tokens) => {
    state.zapperTokens = tokens

   }
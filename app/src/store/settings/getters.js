/*
export function someGetter (state) {
}
*/
export const project = (state) => (id) => {
  if (!id) return null
  const index = state.projects.findIndex(x => x.id === id)
  return index >= 0 ? state.projects[index] : null
}

export const feed_items = (state) => (type, type_id) => {
  if (!type_id) return []
  const comments = state.comments.filter((el) => el.type === type && el.type_id === type_id)
  const replies = state.replies.filter((el) => el.type === type && el.type_id === type_id)
  const arr = [...comments, ...replies]
  return arr.sort((a, b) => parseInt(new Date(a.createdAt).getTime()) - parseInt(new Date(b.createdAt).getTime())).reverse()
}

export const feed_upvotes = (state) => (type, type_id) => {
  if (!type_id) return []
  const upvotes = state.upvotes.filter((el) => el.type === type && el.type_id === type_id)
  return upvotes.sort((a, b) => a.upvote_id - b.upvote_id).reverse()
}

export const feed_comments = (state) => (type, type_id) => {
  if (!type_id) return []
  const comments = state.comments.filter((el) => el.type === type && el.type_id === type_id)
  return comments.sort((a, b) => a.comment_id - b.comment_id).reverse()
}

export const comment_replies = (state) => (comment_id) => {
  if (!comment_id) return []
  const replies = state.replies.filter((el) => el.comment_id === comment_id)
  return replies.sort((a, b) => a.reply_id - b.reply_id).reverse()
}

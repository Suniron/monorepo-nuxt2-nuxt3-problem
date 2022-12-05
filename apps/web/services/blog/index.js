export const fetchPosts = async (axios) => {
  const { data } = await axios.get('/posts')
  return data.posts
}

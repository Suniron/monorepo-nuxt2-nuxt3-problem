export const fetchCartographiesService = async (axios) => {
  const { data } = await axios.get('/cartographies')
  return data.cartographies
}

export const fetchCartographyElementsService = async (axios, id) => {
  const { data } = await axios.get('/cartographies/' + id)
  return data.elements
}

export const addCartographyElementService = async (axios, id, params) => {
  const { data } = await axios.post(
    '/cartographies/' + id + '/elements',
    params
  )
  return data.id
}

export const updateCartographyElementService = async (
  axios,
  id,
  eid,
  params
) => {
  const { data } = await axios.patch(
    '/cartographies/' + id + '/elements/' + eid,
    params
  )
  return data.id
}

export const updateCartographyService = async (axios, id, params) => {
  await axios.patch('/cartographies/' + id, params)
}

export const createCartographyService = async (axios, params = {}) => {
  const { data } = await axios.post('/cartographies', params)
  return data.id
}

export const deleteCartographyService = async (axios, id) => {
  await axios.delete('/cartographies/' + id)
}

export const deleteCartographyElementService = async (axios, id, eid) => {
  await axios.delete('/cartographies/' + id + '/elements/' + eid)
}

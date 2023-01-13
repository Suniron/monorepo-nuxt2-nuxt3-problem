const getEndpoint = (id = '') => (id ? `ips/${id}` : 'ips')
/**
 *
 * @param {Axios} axios Axios instance to use
 * @param {object} item full item containing IP informations
 * @param {string} item.id Search id to update ip by ID
 * @param {string} item.mask  the mask of the ip
 * @param {string} item.mac the mac of the ip
 * @param {string} item.address the address of the ip
 * @param {string} item.iface the iface of the ip
 */
export const deleteIpService = async (axios, id) => {
  const response = await axios.delete(getEndpoint(id))
  return response
}
export const updateIpService = async (axios, item) => {
  const { id, address, mask, mac, iface, isMain } = item
  const requestBody = {
    address,
    iface,
    isMain,
    mac,
    mask,
  }
  const response = await axios.patch(getEndpoint(id), requestBody)
  return response
}

export const createIpService = async (axios, item) => {
  const { assetId, address, mask, mac, iface } = item
  const requestBody = {
    address,
    iface,
    mac,
    mask,
  }
  const response = await axios.post(getEndpoint(assetId), requestBody)
  return response
}

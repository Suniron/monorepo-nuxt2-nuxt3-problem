const getEndpoint = (aid, vid) => `/assets/${aid}/vulnerabilities/${vid}`
const getEndpointPost = (aid, vid) =>
  `/assets/${aid}/vulnerabilities/${vid}/post`

export const updateStatusVulnerability = async (axios, aid, vid, params) => {
  if (!aid || !vid)
    throw new Error('Missing parameter aid or vid to update the status')
  const bodyPayload = {
    comment: params.comment,
    orig: params.orig,
    updated: params.updated?.toLowerCase(),
  }
  if (Object.values(bodyPayload).some(param => param !== undefined))
    await axios.post(getEndpoint(aid, vid), bodyPayload)
}

export const searchPostAssetVulnerabilityService = async (axios, aid, vid) => {
  if (!aid || !vid)
    throw new Error('Missing parameter aid or vid to update the status')

  const { data } = await axios.get(getEndpointPost(aid, vid))
  return data.comments
}

export const addPostAssetVulnerabilityService = async (
  axios,
  aid,
  vid,
  params,
) => {
  if (!aid || !vid)
    throw new Error('Missing parameter aid or vid to update the status')
  const bodyPayload = {
    comment: params.comment,
  }
  if (Object.values(bodyPayload).some(param => param !== undefined))
    await axios.post(getEndpointPost(aid, vid), bodyPayload)
}

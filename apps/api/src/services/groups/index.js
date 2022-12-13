import { groupsAPIs } from '@/api/store'
import { createServiceError } from '@/common/errors/service'

const formatGroup = group => ({
  id: group.id,
  members: group.members.map(m => ({
    email: m.email,
    firstName: m.first_name,
    id: m.id,
    lastName: m.last_name,
  })),
  name: group.name,
})

export const searchGroupsService = async (params, accessToken = '') => {
  const { id } = params
  const { error, group, groups, total } = await groupsAPIs.searchGroups(
    {
      id,
    },
    accessToken,
  )

  if (error)
    return createServiceError(error)

  return group
    ? { group: formatGroup(group) }
    : {
        groups: groups.map(formatGroup),
        total,
      }
}

export const createGroupService = async (params, accessToken = '') => {
  const { error, id } = await groupsAPIs.createGroup(params, accessToken)
  return error ? createServiceError(error) : { id }
}

export const updateGroupService = async (params, accessToken = '') => {
  const { error, group } = await groupsAPIs.updateGroup(params, accessToken)
  return error ? createServiceError(error) : { group: formatGroup(group) }
}
export const deleteGroupService = async (id, accessToken = '') => {
  const { error, data } = await groupsAPIs.deleteGroup(id, accessToken)
  return error ? createServiceError(error) : data
}

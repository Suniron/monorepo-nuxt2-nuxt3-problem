import { tagsAPIs } from '@/api/store'
import { createServiceError } from '@/common/errors/service'
import { getRandomColor } from '@/common/strings/colors'

export const searchTagsService = async (params, accessToken = '') => {
  const { id } = params
  const { error, tag, tags, total } = await tagsAPIs.searchTags(
    {
      id,
    },
    accessToken,
  )

  if (error)
    return createServiceError(error)

  const formatTag = tag => ({
    color: tag.color,
    id: tag.id,
    name: tag.name,
  })

  return tag
    ? { tag: formatTag(tag) }
    : {
        tags: tags.map(formatTag),
        total,
      }
}

export const createTagService = async (params, accessToken = '') => {
  const { name, color = getRandomColor() } = params

  const { error, id } = await tagsAPIs.createTag({ color, name }, accessToken)
  if (error)
    return createServiceError(error)

  return { id }
}

export const deleteTagService = async (id, accessToken = '') => {
  const { error, status } = await tagsAPIs.deleteTag(id, accessToken)
  if (error)
    return createServiceError(error)

  return { status }
}

import { throwHTTPError } from '@/common/errors'
import {
  createTagService,
  deleteTagService,
  searchTagsService,
} from '@/services/tags'

export const searchTagsController = async (req, res, next) => {
  try {
    const { error, tag, tags, total } = await searchTagsService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken,
    )

    if (error)
      throwHTTPError(error)

    res.send(tag || { tags, total })
  }
  catch (error) {
    next(error)
  }
}

export const createTagController = async (req, res, next) => {
  try {
    const { error, id } = await createTagService(req.body, req.accessToken)

    if (error)
      throwHTTPError(error)

    res.status(201).send({ id })
  }
  catch (error) {
    next(error)
  }
}

export const deleteTagController = async (req, res, next) => {
  try {
    const { error } = await deleteTagService(
      req.params?.id,
      req.accessToken,
    )

    if (error)
      throwHTTPError(error)

    res.status(204).end()
  }
  catch (error) {
    next(error)
  }
}

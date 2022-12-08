import { DUPLICATE } from '@/common/constants'
import { throwHTTPError } from '@/common/errors'
import {
  searchTagsModel,
  createTagModel,
  deleteTagModel,
  updateTagModel,
} from '@/models/tags'

export const searchTagsController = async (req, res, next) => {
  try {
    const { error, tag, tags, total } = await searchTagsModel(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.user
    )

    if (error) throwHTTPError(error)

    res.send(tag || { tags, total })
  } catch (error) {
    next(error)
  }
}

export const createTagController = async (req, res, next) => {
  try {
    const { error, id } = await createTagModel(req.body, req.user)

    if (error === 'DuplicateError') {
      throwHTTPError(DUPLICATE)
      res.status(400).send({ error }).end()
    }
    if (error) throwHTTPError(error)

    res.status(201).send({ id })
  } catch (error) {
    next(error)
  }
}

export const updateTagController = async (req, res, next) => {
  try {
    const { error } = await updateTagModel(req.params?.id, req.body, req.user)

    if (error) throwHTTPError(error)

    res.status(201).end()
  } catch (error) {
    next(error)
  }
}

export const deleteTagController = async (req, res, next) => {
  try {
    const { error } = await deleteTagModel(req.params?.id, req.user)

    if (error) throwHTTPError(error)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

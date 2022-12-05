import { throwHTTPError } from '@/common/errors'
import {
  fetchPostsService,
  CreateRemediationProjectPostsService,
} from '@/services/blog'

export const fetchPostsConroller = async (req, res, next) => {
  try {
    const data = await fetchPostsService(req.accessToken)
    if (data.error) throwHTTPError(data.error)
    res.status(201).send(data)
  } catch (error) {
    next(error)
  }
}

export const CreateRemediationProjectPostsController = async (
  req,
  res,
  next
) => {
  try {
    const data = await CreateRemediationProjectPostsService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.body,
      req.accessToken
    )
    if (data.error) throwHTTPError(data.error)
    res.send(data)
  } catch (error) {
    next(error)
  }
}

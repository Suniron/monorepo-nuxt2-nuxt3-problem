import { throwHTTPError } from '../../common/errors'
import {
  createRemediationProjectPostsModel,
  fetchPostsModel,
} from '../../models/blog'

export const fetchPostsController = async (req: any, res: any, next: any) => {
  try {
    const { error, posts, total } = await fetchPostsModel(req.user)
    if (error)
      return throwHTTPError(error)
    res.status(201).send({ posts, total })
  }
  catch (error) {
    next(error)
  }
}

export const createRemediationProjectPostsController = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    const result = await createRemediationProjectPostsModel(
      Number(req.params.id),
      req.body,
      req.user,
    )

    if ('error' in result)
      throwHTTPError(result.error)
    res.status(201).send(result)
  }
  catch (error) {
    next(error)
  }
}
// @ts-check
// @ts-expect-error TS(2307): Cannot find module '@/common/errors' or its corres... Remove this comment to see the full error message
import { throwHTTPError } from '@/common/errors'
import {
  fetchPostsModel,
  createRemediationProjectPostsModel,
// @ts-expect-error TS(2307): Cannot find module '@/models/blog' or its correspo... Remove this comment to see the full error message
} from '@/models/blog'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const fetchPostsController = async (req: any, res: any, next: any) => {
  try {
    const { error, posts, total } = await fetchPostsModel(req.user)
    if (error) return throwHTTPError(error)
    res.status(201).send({ posts, total })
  } catch (error) {
    next(error)
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const createRemediationProjectPostsController = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await createRemediationProjectPostsModel(
      Number(req.params.id),
      req.body,
      req.user
    )

    if ('error' in result) throwHTTPError(result.error)
    res.status(201).send(result)
  } catch (error) {
    next(error)
  }
}

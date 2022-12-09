
import { throwHTTPError } from '../../common/errors'
import {
  getAssetVulnerabilitiesModel,
  updateStatusModel,
  searchVulnerabilitiesModel,
  searchVulnerabilitiesWithTheirAssetsModel,
  addPostAssetVulnerabilityModel,
  searchPostAssetVulnerabilityModel,
  createVulnerabilityModel,
  UpdateVulnerabilitiesModel,
  DeleteVulnerabilitiesModel,

} from '../../models/vulnerabilities'

export const assetVulnerabilitiesController = async (req: any, res: any, next: any) => {
  try {
    const {
      error,
      vulnerabilities,
      total,
    } = await getAssetVulnerabilitiesModel(req.params?.id, req.query, req.user)
    if (error) throwHTTPError(error)

    res.send({ vulnerabilities, total })
  } catch (error) {
    next(error)
  }
}
export const updateVulnerabilitiesAssetController = async (req: any, res: any, next: any) => {
  try {
    const response = await UpdateVulnerabilitiesModel(req.body)
    if (response) {
      res.status(200).send('Changements effectués')
      return 'Ok'
    }
  } catch (error) {
    next(error)
  }
}
export const deleteVulnerabilitiesAssetController = async (req: any, res: any, next: any) => {
  try {
    const response = await DeleteVulnerabilitiesModel(req.body)
    if (response) {
      res.status(200).send('Suppression effectués')
      return 'Ok'
    }
  } catch (error) {
    next(error)
  }
}

export const searchVulnerabilitiesController = async (req: any, res: any, next: any) => {
  try {
    const {
      error,
      vulnerability,
      vulnerabilities,
      total,
    } = await searchVulnerabilitiesModel({
      ...(req.params || {}),
      ...(req.query || {}),
    })

    if (error) throwHTTPError(error)

    res.send(vulnerability || { vulnerabilities, total })
  } catch (error) {
    next(error)
  }
}

export const searchVulnerabilitiesWithTheirAssetsController = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const {
      error,
      vulnerability,
      vulnerabilities,
      total,
    } = await searchVulnerabilitiesWithTheirAssetsModel(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.user
    )

    if (error) throwHTTPError(error)

    res.send(vulnerability || { vulnerabilities, total })
  } catch (error) {
    next(error)
  }
}

export const updateStatusController = async (req: any, res: any, next: any) => {
  try {
    const { error } = await updateStatusModel(
      req.params?.aid,
      req.params?.vid,
      req.body,
      req.user
    )
    if (error) throwHTTPError(error)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export const addPostAssetVulnerabilityController = async (req: any, res: any, next: any) => {
  try {
    const { error } = await addPostAssetVulnerabilityModel(
      req.params?.aid,
      req.params?.vid,
      req.body,
      req.user
    )
    if (error) throwHTTPError(error)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export const searchPostAssetVulnerabilityController = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const { error, comments, total } = await searchPostAssetVulnerabilityModel(
      req.params?.aid,
      req.params?.vid,
      req.user
    )
    if (error) throwHTTPError(error)

    res.send({ comments, total })
  } catch (error) {
    next(error)
  }
}

export const createVulnerabilityController = async (req: any, res: any, next: any) => {
  try {
    const vulnId = await createVulnerabilityModel(req.body, req.user)
    res.send({ id: vulnId })
  } catch (error) {
    next(error)
  }
}

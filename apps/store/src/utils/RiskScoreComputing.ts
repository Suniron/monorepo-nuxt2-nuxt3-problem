import type { InherentRiskScore, LightAsset, LightRelation } from '../../types/asset'
import { SUPER_ASSET_TYPES, TECHNICAL_ASSET_TYPES } from './assets'

const inheritedRiskCalculation = (
  risks: { [assetId: number]: number | null },
  { listUnvisited, relations, inherentScores }: {
    listUnvisited: LightAsset[]
    relations: LightRelation[]
    inherentScores: InherentRiskScore[]
  },
) => {
  // 2) For each unvisited asset, initialize the inheritedRisk with the score of the inherentScore or 10 for non scanned assets
  listUnvisited.forEach(async (asset: any) => {
    risks[asset.id]
      = inherentScores.find(
        (inherentScore: InherentRiskScore) => inherentScore.asset_id === asset.id,
      )?.inherentRisk ?? 0
  })

  while (listUnvisited.length > 0) {
    // 3) Select the asset with max(inheritedRisk) inside the listUnvisited, named currentAsset
    const currentAsset = listUnvisited.reduce((prev: LightAsset, current: LightAsset) =>
      (risks[prev.id] ?? 0) > (risks[current.id] ?? 0) ? prev : current,
    )

    // 4) Remove currentAsset from the listUnvisited
    listUnvisited.splice(listUnvisited.indexOf(currentAsset), 1)

    // 5) For currentAsset, list all its asset connected by a link, named listConnected
    const unvisitedIds = listUnvisited.map((asset: LightAsset) => asset.id)
    /**
     * @type {number[]}
     */
    const listConnected = relations
      .filter((relation: LightRelation) => {
        return (
          relation.to_asset_id
          && relation.from_asset_id
          && ((relation.from_asset_id === currentAsset.id
            && unvisitedIds.includes(relation.to_asset_id))
            || (relation.to_asset_id === currentAsset.id
              && unvisitedIds.includes(relation.from_asset_id)))
        )
      })
      .map((relation: any) =>
        relation.from_asset_id === currentAsset.id
          ? relation.to_asset_id
          : relation.from_asset_id,
      )

    listConnected.sort((a: any, b: any) => {
      return (risks[b] ?? 0) - (risks[a] ?? 0)
    })

    // 6) For each asset connected, update its inheritedRisk with the following formula:
    listConnected.forEach((connectedAssetId: any) => {
      // a) set IRa as the inheritedRisk of the connected asset
      const IRa = risks[connectedAssetId] ?? 0

      // b) score increase = max( 0, 0.5 * ( inheritedRisk[currentAsset] - IRa ) )
      const scoreIncrease = Math.max(
        0,
        0.5 * ((risks[currentAsset.id] ?? 0) - IRa),
      )

      // c) inheritedRisk = IRa + Pond
      risks[connectedAssetId] = IRa + scoreIncrease
    })
  }

  // 7) Update the inherited risk with the max(inheritedRisk) of all assets
  return risks
}

const getAllTechnicalDescendantsAssets = (
  assetId: number,
  relations: LightRelation[],
  listAssets: LightAsset[],
): number[] => {
  const children = relations
    .filter(
      (relation: any) =>
        relation.to_asset_id === assetId
        && (relation.type === 'BELONGS_TO' || relation.type === 'LOCATED_TO'),
    )
    .map((relation: any) => relation.from_asset_id)

  const technicalChildren: any = []
  const abstractChildren: any = []
  children.forEach((child: any) => {
    const asset = listAssets.find((asset: any) => asset.id === child)
    if (!asset)
      throw new Error('Asset not found')

    if (TECHNICAL_ASSET_TYPES.includes(asset.type))
      technicalChildren.push(child)
    else abstractChildren.push(child)
  })

  return technicalChildren.concat(
    ...abstractChildren.map((childId: number) =>
      getAllTechnicalDescendantsAssets(childId, relations, listAssets).filter(
        (grandChildId: number) => !technicalChildren.includes(grandChildId),
      ),
    ),
  )
}

const compoundRiskCalculation = (
  risks: { [assetId: string]: number | null },
  { listUnvisited, relations, allAssets }: {
    listUnvisited: LightAsset[]
    relations: LightRelation[]
    allAssets: LightAsset[]
  },
) => {
  listUnvisited.forEach(async (asset: any) => {
    const technicalAssetsInside = getAllTechnicalDescendantsAssets(
      asset.id,
      relations,
      allAssets,
    )

    const aggregation: { maxCvss: number; sumInherentScore: number } = technicalAssetsInside.reduce(
      (
        prev: { maxCvss: number; sumInherentScore: number }, current: number,
      ) => {
        const currentScore = risks[current] ?? 0
        return {
          maxCvss: Math.max(prev.maxCvss, currentScore),
          sumInherentScore: prev.sumInherentScore + currentScore,
        }
      },
      { maxCvss: 0, sumInherentScore: 0 },
    )

    if (technicalAssetsInside.length > 0) {
      risks[asset.id]
        = 0.5 * aggregation.maxCvss
        + 0.5
          * (aggregation.sumInherentScore
            / Math.max(1, technicalAssetsInside.length))
    }
    else {
      risks[asset.id] = null
    }
  })

  return risks
}
export const riskScoreComputing = (
  listUnvisited: LightAsset[],
  relations: LightRelation[],
  inherentScores: InherentRiskScore[],
): { [assetId: string]: number } => {
  const technicalAssets = listUnvisited.filter((asset: LightAsset) =>
    TECHNICAL_ASSET_TYPES.includes(asset.type),
  )
  const superAssets = listUnvisited.filter((asset: LightAsset) =>
    SUPER_ASSET_TYPES.includes(asset.type),
  )

  const calculatedRiskScores: { [assetId: string]: number } = {}

  inheritedRiskCalculation(calculatedRiskScores, {
    inherentScores,
    listUnvisited: technicalAssets,
    relations,
  })
  compoundRiskCalculation(calculatedRiskScores, {
    allAssets: listUnvisited,
    // inherentScores,
    listUnvisited: superAssets,
    relations,
  })

  return calculatedRiskScores
}


import { SUPER_ASSET_TYPES, TECHNICAL_ASSET_TYPES } from './assets'

/**
 * @typedef {'USER' | 'SERVER' | 'WEB'} TechnicalAssetsEnum
 * @typedef {'NETWORK' | 'BUILDING' | 'MISSION' | 'UNIT' | 'USERGROUP'} SuperAssetsEnum
 *
 * @typedef {{
 *  id: number,
 *  type: TechnicalAssetsEnum | SuperAssetsEnum
 * }} lightAssetType
 *
 * @typedef {{
 *  id: number,
 *  type: 'BELONGS_TO' | 'CONNECTED_TO' | 'LOCATED_TO' | 'OWN_BY' | 'MAINTAINED_BY' | null
 *  to_asset_id: number,
 *  from_asset_id: number,
 * }} lightRelationType
 *
 * @typedef {{
 *  asset_id: number,
 *  inherentRisk: number,
 * }} inherentRiskScores
 */

/**
 * @param {lightAssetType[]} listUnvisited
 * @param {lightRelationType[]} relations
 * @param {inherentRiskScores[]} inherentScores
 * @returns {{[assetId: string]: number}}
 */
export function riskScoreComputing(listUnvisited: any, relations: any, inherentScores: any) {
  const technicalAssets = listUnvisited.filter((asset: any) => TECHNICAL_ASSET_TYPES.includes(asset.type)
  )
  const superAssets = listUnvisited.filter((asset: any) => SUPER_ASSET_TYPES.includes(asset.type)
  )

  /**
   * @type {{[assetId: string]: number}}
   */
  const calculatedRiskScores = {}

  inheritedRiskCalculation(calculatedRiskScores, {
    listUnvisited: technicalAssets,
    relations,
    inherentScores,
  })
  compoundRiskCalculation(calculatedRiskScores, {
    listUnvisited: superAssets,
    relations,
    inherentScores,
    allAssets: listUnvisited,
  })

  return calculatedRiskScores
}

/**
 * @param {{[assetId: string]: number | null}} risks
 * @param {{
 *  listUnvisited: lightAssetType[],
 *  relations: lightRelationType[],
 *  inherentScores: inherentRiskScores[]
 * }} param1
 */
function inheritedRiskCalculation(
  risks: any,
  {
    listUnvisited,
    relations,
    inherentScores
  }: any
) {
  // 2) For each unvisited asset, initialize the inheritedRisk with the score of the inherentScore or 10 for non scanned assets
  listUnvisited.forEach(async (asset: any) => {
    risks[asset.id] =
      inherentScores.find(
        (inherentScore: any) => inherentScore.asset_id === asset.id
      )?.inherentRisk ?? 0
  })

  while (listUnvisited.length > 0) {
    // 3) Select the asset with max(inheritedRisk) inside the listUnvisited, named currentAsset
    let currentAsset = listUnvisited.reduce((prev: any, current: any) =>
      (risks[prev.id] ?? 0) > (risks[current.id] ?? 0) ? prev : current
    )

    // 4) Remove currentAsset from the listUnvisited
    listUnvisited.splice(listUnvisited.indexOf(currentAsset), 1)

    // 5) For currentAsset, list all its asset connected by a link, named listConnected
    const unvisitedIds = listUnvisited.map((asset: any) => asset.id)
    /**
     * @type {number[]}
     */
    const listConnected = relations
      .filter((relation: any) => {
        return (
          relation.to_asset_id &&
          relation.from_asset_id &&
          ((relation.from_asset_id === currentAsset.id &&
            unvisitedIds.includes(relation.to_asset_id)) ||
            (relation.to_asset_id === currentAsset.id &&
              unvisitedIds.includes(relation.from_asset_id)))
        )
      })
      .map((relation: any) => relation.from_asset_id === currentAsset.id
      ? relation.to_asset_id
      : relation.from_asset_id
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
        0.5 * ((risks[currentAsset.id] ?? 0) - IRa)
      )

      // c) inheritedRisk = IRa + Pond
      risks[connectedAssetId] = IRa + scoreIncrease
    })
  }

  // 7) Update the inherited risk with the max(inheritedRisk) of all assets
  return risks
}

/**
 * @param {{[assetId: string]: number | null}} risks
 * @param {{
 *  listUnvisited: lightAssetType[],
 *  relations: lightRelationType[],
 *  allAssets: lightAssetType[]
 * }} param1
 */
function compoundRiskCalculation(
  risks: any,
  {
    listUnvisited,
    relations,
    allAssets
  }: any
) {
  listUnvisited.forEach(async (asset: any) => {
    const technicalAssetsInside = getAllTechnicalDescendantsAssets(
      asset.id,
      relations,
      allAssets
    )
    /**
     * @type {{
     *  maxCvss: number,
     *  sumInherentScore: number
     * }}
     */
    const aggregation = technicalAssetsInside.reduce(
      (
        /** @type {{ maxCvss: number; sumInherentScore: number; }} */ prev: any,
        /** @type {number} */ current: any
      ) => {
        const currentScore = risks[current] ?? 0
        return {
          maxCvss: Math.max(prev.maxCvss, currentScore),
          sumInherentScore: prev.sumInherentScore + currentScore,
        }
      },
      { maxCvss: 0, sumInherentScore: 0 }
    )

    if (technicalAssetsInside.length > 0) {
      risks[asset.id] =
        0.5 * aggregation.maxCvss +
        0.5 *
          (aggregation.sumInherentScore /
            Math.max(1, technicalAssetsInside.length))
    } else {
      risks[asset.id] = null
    }
  })

  return risks
}

/**
 *
 * @param {number} assetId
 * @param {lightRelationType[]} relations
 * @param {lightAssetType[]} listAssets
 * @returns {number[]}
 */
function getAllTechnicalDescendantsAssets(assetId: any, relations: any, listAssets: any) {
  const children = relations
    .filter(
      (relation: any) => relation.to_asset_id === assetId &&
      (relation.type === 'BELONGS_TO' || relation.type === 'LOCATED_TO')
    )
    .map((relation: any) => relation.from_asset_id)

  const technicalChildren: any = []
  const abstractChildren: any = []
  children.forEach((child: any) => {
    const asset = listAssets.find((asset: any) => asset.id === child)
    if (!asset) {
      throw new Error('Asset not found')
    }
    if (TECHNICAL_ASSET_TYPES.includes(asset.type)) {
      technicalChildren.push(child)
    } else {
      abstractChildren.push(child)
    }
  })

  return technicalChildren.concat(

    ...abstractChildren.map((childId) =>
      getAllTechnicalDescendantsAssets(childId, relations, listAssets).filter(
        (grandChildId: any) => !technicalChildren.includes(grandChildId)
      )
    )
  );
}

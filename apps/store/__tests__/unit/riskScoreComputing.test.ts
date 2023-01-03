import { riskScoreComputing } from '../../src/utils/RiskScoreComputing'
import type { InherentRiskScore, LightAsset, LightRelation, SuperAssetType, TechnicalAssetType } from '../../types/asset'

/**
 * The following part of the file are helpers.
 * You can use the function to transform a string into correctly formatted data.
 *
 * The format of the string is the following:
 *
 * For declaring an asset:
 * <id>:<type>/<inherentRisk>
 *
 * For declaring a relation:
 * <from_asset_id> <relation_type> <to_asset_id>
 *
 * (comments are supported with a '#' prefix)
 */

const RELATION_TYPES_ENUM = {
  BELONGS_TO: 'BELONGS_TO',
  CONNECTED_TO: 'CONNECTED_TO',
  LOCATED_TO: 'LOCATED_TO',
  MAINTAINED_BY: 'MAINTAINED_BY',
  OWN_BY: 'OWN_BY',
}

const graphToParams = (graph: {
  nodes: {
    id: number
    type: TechnicalAssetType | SuperAssetType
    inherentRisk: number
  }[]
  edges: {
    from_asset_id: number
    to_asset_id: number
    type: keyof typeof RELATION_TYPES_ENUM
  }[]
}): {
  listUnvisited: LightAsset[]
  relations: LightRelation[]
  inherentScores: InherentRiskScore[]
} => {
  const listUnvisited: LightAsset[] = []
  const inherentScores: InherentRiskScore[] = []

  graph.nodes.forEach((node) => {
    listUnvisited.push({
      id: node.id,
      type: node.type,
    })
    inherentScores.push({
      asset_id: node.id,
      inherentRisk: node.inherentRisk,
    })
  })
  return {
    inherentScores,

    listUnvisited,
    relations: graph.edges.map((edge, index) => ({
      ...edge,
      id: index,
    })),
  }
}

const parseGraph = (stringToParse: string) => {
  const nodes: {
    id: number
    type: TechnicalAssetType | SuperAssetType
    inherentRisk: number
  }[] = []
  const edges: {
    from_asset_id: number
    to_asset_id: number
    type: keyof typeof RELATION_TYPES_ENUM
  }[] = []

  const lines = stringToParse.split('\n')
  lines.forEach((line) => {
    line = line.split('#')[0].trim()
    if (line.includes(':') && line.includes('/')) {
      const [id, assetDetails] = line.split(':')
      const [assetType, inherentRisk] = assetDetails.split('/')
      nodes.push({
        id: parseInt(id),
        inherentRisk: Number(inherentRisk),
        type: assetType as TechnicalAssetType | SuperAssetType,
      })
    }
    else {
      let relationType = Object.keys(RELATION_TYPES_ENUM)
        .concat('NULL')
        .find(relationType => line.includes(relationType))

      if (relationType) {
        const [from, to] = line.split(relationType)
        if (relationType === 'NULL')
          relationType = undefined

        edges.push({
          from_asset_id: parseFloat(from),
          to_asset_id: parseFloat(to),
          type: relationType as keyof typeof RELATION_TYPES_ENUM,
        })
      }
    }
  })
  return { edges, nodes }
}

describe('Testing the risk score computing algo', () => {
  it('Simple test case', () => {
    const calculatedRisks = riskScoreComputing(
      [
        {
          id: 1,
          type: 'USER',
        },
        {
          id: 2,
          type: 'SERVER',
        },
      ],
      [
        {
          from_asset_id: 1,
          id: 1,
          to_asset_id: 2,
          type: 'CONNECTED_TO',
        },
      ],
      [
        {
          asset_id: 1,
          inherentRisk: 10,
        },
        {
          asset_id: 2,
          inherentRisk: 0,
        },
      ],
    )

    expect(calculatedRisks).toEqual({
      1: 10,
      2: 5,
    })
  })
  it('Simple test case with unscanned asset', () => {
    const calculatedRisks = riskScoreComputing(
      [
        {
          id: 1,
          type: 'USER',
        },
        {
          id: 2,
          type: 'SERVER',
        },
      ],
      [
        {
          from_asset_id: 1,
          id: 1,
          to_asset_id: 2,
          type: 'CONNECTED_TO',
        },
      ],
      [
        {
          asset_id: 1,
          inherentRisk: 5,
        },
        {
          asset_id: 2,
          inherentRisk: 10,
        },
      ],
    )

    expect(calculatedRisks).toEqual({
      1: 7.5,
      2: 10,
    })
  })

  it('Simple test case with string graph', () => {
    const str = `
1:USER/10
2:SERVER/0

1 CONNECTED_TO 2
    `
    const params = graphToParams(parseGraph(str))
    const calculatedRisks = riskScoreComputing(
      params.listUnvisited,
      params.relations,
      params.inherentScores,
    )

    expect(calculatedRisks).toEqual({
      1: 10,
      2: 5,
    })
  })

  it('Test case from confluence documentation', () => {
    const str = `
1:SERVER/0
2:SERVER/7.5
3:WEB/0
4:SERVER/3.70
5:SERVER/0

1 CONNECTED_TO 2
1 CONNECTED_TO 3
1 CONNECTED_TO 4
1 CONNECTED_TO 5
    `
    const params = graphToParams(parseGraph(str))
    const calculatedRisks = riskScoreComputing(
      params.listUnvisited,
      params.relations,
      params.inherentScores,
    )

    expect(calculatedRisks).toEqual({
      1: 3.75,
      2: 7.5,
      3: 1.875,
      4: 3.725,
      5: 1.875,
    })
  })

  it('Test case with network', () => {
    const str = `
1:SERVER/0    # Resolved to 3.75
2:SERVER/7.5  # Resolved to 7.5
3:WEB/0       # Resolved to 1.875
4:SERVER/3.70 # Resolved to 3.725
5:SERVER/0    # Resolved to 1.875
6:NETWORK/0   # Need compound score

1 CONNECTED_TO 2
1 CONNECTED_TO 3
1 CONNECTED_TO 4
1 CONNECTED_TO 5

1 BELONGS_TO 6
2 BELONGS_TO 6
3 BELONGS_TO 6
4 BELONGS_TO 6
5 BELONGS_TO 6
    `
    const params = graphToParams(parseGraph(str))
    const calculatedRisks = riskScoreComputing(
      params.listUnvisited,
      params.relations,
      params.inherentScores,
    )

    const averageInherent = (3.75 + 7.5 + 1.875 + 3.725 + 1.875) / 5

    expect(calculatedRisks).toEqual({
      1: 3.75,
      2: 7.5,
      3: 1.875,
      4: 3.725,
      5: 1.875,
      6: 0.5 * averageInherent + 0.5 * 7.5, // Compound score (half of the average of the assets inside + half of the max CVSS score)
    })
  })

  it('Test case with multiple networks', () => {
    const str = `
1:SERVER/0    # Resolved to 3.75
2:SERVER/7.5  # Resolved to 7.5
3:WEB/0       # Resolved to 1.875
4:SERVER/3.70 # Resolved to 3.7
5:SERVER/0    # Resolved to 1.85
6:NETWORK/0   # Need compound score
7:NETWORK/0   # Need compound score

1 CONNECTED_TO 2
1 CONNECTED_TO 3

4 CONNECTED_TO 5

1 BELONGS_TO 6
2 BELONGS_TO 6
3 BELONGS_TO 6
4 BELONGS_TO 7
5 BELONGS_TO 7
    `
    const params = graphToParams(parseGraph(str))
    const calculatedRisks = riskScoreComputing(
      params.listUnvisited,
      params.relations,
      params.inherentScores,
    )

    const averageInherent6 = (3.75 + 7.5 + 1.875) / 3
    const averageInherent7 = (3.7 + 1.85) / 2

    expect(calculatedRisks).toEqual({
      1: 7.5 / 2,
      2: 7.5,
      3: 7.5 / 4,

      4: 3.7,
      5: 3.7 / 2,

      6: 0.5 * averageInherent6 + 0.5 * 7.5, // Compound score (half of the average of the assets inside + half of the max CVSS score)
      7: 0.5 * averageInherent7 + 0.5 * 3.7, // Compound score (half of the average of the assets inside + half of the max CVSS score)
    })
  })

  it('Test case with multiple networks and a Business Unit', () => {
    const str = `
1:SERVER/0    # Resolved to 3.75
2:SERVER/7.5  # Resolved to 7.5
3:WEB/0       # Resolved to 1.875
4:SERVER/3.70 # Resolved to 3.7
5:SERVER/0    # Resolved to 1.85
6:NETWORK/0   # Need compound score
7:NETWORK/0   # Need compound score
8:UNIT/0

1 CONNECTED_TO 2
1 CONNECTED_TO 3

4 CONNECTED_TO 5

1 BELONGS_TO 6
2 BELONGS_TO 6
3 BELONGS_TO 6
4 BELONGS_TO 7
5 BELONGS_TO 7

1 BELONGS_TO 8 # Adding some technical assets to the business unit to ensure it does not change the score
2 BELONGS_TO 8

6 BELONGS_TO 8
7 BELONGS_TO 8
  `
    const params = graphToParams(parseGraph(str))
    const calculatedRisks = riskScoreComputing(
      params.listUnvisited,
      params.relations,
      params.inherentScores,
    )

    const scores: { [key: number]: number } = {}

    scores[1] = 7.5 / 2

    scores[2] = 7.5

    scores[3] = 7.5 / 4

    scores[4] = 3.7

    scores[5] = 3.7 / 2

    scores[6] = 0.5 * ((scores[1] + scores[2] + scores[3]) / 3) + 0.5 * 7.5

    scores[7] = 0.5 * ((scores[4] + scores[5]) / 2) + 0.5 * 3.7

    scores[8]
      = 0.5 * ((scores[1] + scores[2] + scores[3] + scores[4] + scores[5]) / 5)
      + 0.5 * 7.5

    expect(calculatedRisks).toEqual(scores)
  })
})


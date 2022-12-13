import { searchAssetsService } from '~/services/assets'

export const getAssetsGraphService = async (axios, params) => {
  // const assetNodes = assets.map(createAssetNode)
  // const assetEdges = edges.map(createAssetEdge)

  const data = await searchAssetsService(axios, {
    types: ['USER', 'SERVER', 'WEB', 'BUILDING', 'NETWORK'],
  })
  // console.log(data)
  const nodes = []
  const edges = []
  data.assets.forEach((element) => {
    console.log(element)
    let c = '#ddd'
    if (element.vulnerabilities.low > 0)
      c = '#f0d802'

    if (element.vulnerabilities.medium > 0)
      c = '#ed9b0e'

    if (element.vulnerabilities.high > 0)
      c = '#d92b2b'

    if (element.vulnerabilities.critical > 0)
      c = '#941e1e'

    nodes.push({
      classes:
        element.os?.toLowerCase()
        || element.language?.toLowerCase()
        || element.type.toLowerCase(),
      data: {
        color: c,
        id: `asset-${element.id}`,
        name: element.name,
        type:
          element.os?.toLowerCase()
          || element.language?.toLowerCase()
          || element.type.toLowerCase(),
      },
      group: 'nodes',
      position: {
        x: element.x || undefined,
        y: element.y || undefined,
      },
    })
    element.relations.forEach((elt) => {
      let c = '#888'
      let s = 'solid'
      if (elt.type === 'LOCATED_TO') {
        c = '#ddd'
        s = 'dashed'
      }
      if (elt.type === 'MAINTAINED_BY') {
        c = '#9BEDFF'
        s = 'dotted'
      }
      if (elt.type === 'BELONGS_TO') { nodes[nodes.length - 1].data.parent = `asset-${elt.to_id}` }
      else {
        edges.push({
          data: {
            color: c,
            id: `edge-${elt.rel_id}`,
            name: elt.type,
            source: `asset-${element.id}`,
            style: s,
            target: `asset-${elt.to_id}`,
          },
          group: 'edges',
        })
      }
    })
  })
  console.log(edges)
  return [...nodes, ...edges]
}
